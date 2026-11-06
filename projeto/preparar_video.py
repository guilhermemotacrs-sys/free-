"""Monta a linha do tempo do vídeo: narração concatenada, legendas (SRT + JSON) e trilha sintética."""
import json, re, shutil, subprocess, wave
from pathlib import Path
import numpy as np

BASE = Path(__file__).parent
AUD = BASE / "audio"
PUB = BASE / "video" / "public"
SRC = BASE / "video" / "src"
SAIDA = BASE.parent / "saida"
PUB.mkdir(parents=True, exist_ok=True)

FPS = 30
INICIO = 0.7      # respiro antes da 1ª fala
PAUSA = 0.45      # pausa entre cenas
FINAL = 2.4       # respiro depois da última fala

cenas = json.load(open(AUD / "timing.json", encoding="utf-8"))
t = INICIO
for c in cenas:
    c["start"] = round(t, 3)
    t += c["dur"] + PAUSA
total = t - PAUSA + FINAL
total_frames = int(round(total * FPS))
print(f"duração total: {total:.2f}s ({total_frames} frames)")

# ---------- narração concatenada ----------
inputs, filt = [], []
for i, c in enumerate(cenas):
    inputs += ["-i", str(AUD / f"cena{i+1}.mp3")]
    ms = int(c["start"] * 1000)
    filt.append(f"[{i}:a]adelay={ms}|{ms},aresample=48000[a{i}]")
mix = "".join(f"[a{i}]" for i in range(len(cenas)))
filt.append(f"{mix}amix=inputs={len(cenas)}:normalize=0,apad,atrim=0:{total:.3f}[out]")
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *inputs, "-filter_complex", ";".join(filt),
                "-map", "[out]", "-ac", "1", "-ar", "48000", str(PUB / "narracao.wav")], check=True)
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(PUB / "narracao.wav"), "-b:a", "192k",
                str(AUD / "narracao_completa.mp3")], check=True)

# ---------- legendas a partir dos limites de palavra ----------
def norm(s):
    return re.sub(r"[^\wÀ-ÿ]", "", s.lower())

legendas = []
for ci, c in enumerate(cenas):
    tokens = c["text"].split()
    words = c["words"]
    ti = 0
    mapped = []  # (token com pontuação, início, fim)
    for w in words:
        while ti < len(tokens) and norm(tokens[ti]) != norm(w["w"]):
            ti += 1
        tok = tokens[ti] if ti < len(tokens) else w["w"]
        mapped.append([tok, c["start"] + w["s"], c["start"] + w["e"]])
        ti += 1
    # agrupa em blocos curtos, quebrando preferencialmente na pontuação
    bloco = []
    aspas = False
    for k, m in enumerate(mapped):
        if m[0].startswith('"'): aspas = True
        bloco.append(m)
        txt = " ".join(b[0] for b in bloco)
        prox = mapped[k + 1][0] if k + 1 < len(mapped) else ""
        fim_pont = re.search(r"[.!?:,]\"?$", m[0]) is not None
        estoura = len(txt) + 1 + len(prox) > 44 and not aspas
        if m[0].endswith('"') or m[0].endswith('."'): aspas = False
        antes_de = norm(prox) in ("porque",) and len(txt) >= 14
        if k == len(mapped) - 1 or estoura or antes_de or (fim_pont and len(txt) >= 14) or re.search(r"[.!?]\"?$", m[0]):
            legendas.append({"cena": ci + 1, "text": txt, "start": bloco[0][1], "end": m[2]})
            bloco = []
# fim de cada legenda: estende até a próxima (máx. +0.6s) para não piscar
for i, l in enumerate(legendas):
    nxt = legendas[i + 1]["start"] if i + 1 < len(legendas) else total
    l["end"] = round(nxt if nxt - l["end"] < 1.0 else l["end"] + 0.6, 3)
    l["start"] = round(l["start"], 3)

def ts(s):
    h, r = divmod(s, 3600); m, r = divmod(r, 60)
    return f"{int(h):02d}:{int(m):02d}:{int(r):02d},{int(round((r - int(r)) * 1000)) % 1000:03d}"

with open(SAIDA / "legendas.srt", "w", encoding="utf-8") as f:
    for i, l in enumerate(legendas, 1):
        f.write(f"{i}\n{ts(l['start'])} --> {ts(l['end'])}\n{l['text']}\n\n")

# ---------- trilha sintética (beat lo-fi simples, 96 BPM, sem samples de terceiros) ----------
SR = 48000
n = int(total * SR)
trilha = np.zeros(n)
bpm = 96; beat = 60 / bpm
tt = np.arange(n) / SR
rng = np.random.default_rng(7)
def env(length, decay):
    x = np.arange(length) / SR
    return np.exp(-x * decay)
kick_len = int(0.35 * SR)
kx = np.arange(kick_len) / SR
kick = np.sin(2 * np.pi * (50 + 90 * np.exp(-kx * 30)) * kx) * env(kick_len, 9)
hat_len = int(0.05 * SR)
hat = rng.standard_normal(hat_len) * env(hat_len, 90)
hat = np.diff(np.concatenate([[0], hat]))  # passa-alta simples
acordes = [[220.0, 261.63, 329.63], [174.61, 220.0, 261.63], [196.0, 246.94, 293.66], [164.81, 196.0, 246.94]]
nb = int(total / beat) + 1
for b in range(nb):
    i0 = int(b * beat * SR)
    if b % 4 in (0, 2) or (b % 8 == 7):
        seg = kick[: max(0, min(kick_len, n - i0))]; trilha[i0:i0 + len(seg)] += 0.9 * seg
    for off in (0.5,):
        j = int((b + off) * beat * SR)
        seg = hat[: max(0, min(hat_len, n - j))]; trilha[j:j + len(seg)] += 0.25 * seg
for bar in range(int(total / (4 * beat)) + 1):
    i0 = int(bar * 4 * beat * SR); L = int(4 * beat * SR)
    if i0 >= n: break
    L = min(L, n - i0); x = np.arange(L) / SR
    a = np.minimum(1, x / 0.4) * np.exp(-x * 0.5)
    pad = sum(np.sin(2 * np.pi * f * x) + 0.3 * np.sin(2 * np.pi * 2 * f * x) for f in acordes[bar % 4])
    trilha[i0:i0 + L] += 0.12 * a * pad
fade = np.minimum(1, tt / 1.5) * np.minimum(1, (total - tt) / 2.0)
trilha = trilha * fade
trilha = trilha / np.max(np.abs(trilha)) * 0.9
with wave.open(str(PUB / "trilha.wav"), "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((trilha * 32767).astype(np.int16).tobytes())

shutil.copy(SAIDA / "peca_publicitaria.png", PUB / "peca.png")

timeline = {
    "fps": FPS, "totalFrames": total_frames, "total": total,
    "cenas": [{"n": i + 1, "start": c["start"], "dur": c["dur"],
               "words": [{"w": w["w"], "s": round(c["start"] + w["s"], 3)} for w in c["words"]]} for i, c in enumerate(cenas)],
    "legendas": legendas,
}
json.dump(timeline, open(SRC / "timeline.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
for l in legendas:
    print(f"{l['start']:6.2f}-{l['end']:6.2f}  {l['text']}")
