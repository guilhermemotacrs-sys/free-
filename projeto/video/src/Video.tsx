import React from 'react';
import {
  AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing,
} from 'remotion';
import { useAudioData, visualizeAudio } from '@remotion/media-utils';
import { Rafa } from './Rafa';
import timeline from './timeline.json';

const FPS = 30;
const FONTE = "'Inter Display', 'Inter', sans-serif";
const AZUL = '#7cc4ff';
const LARANJA = '#ff9a2e';
const FRASE = 'Meu caráter não tem nada a ver com meu instinto.';

const cena = (n: number) => timeline.cenas[n - 1];
const f = (s: number) => Math.round(s * FPS);
// instante (s) em que a palavra `w` é falada pela k-ésima vez na cena n
const quando = (n: number, w: string, k = 0) => {
  const lista = cena(n).words.filter((x) => x.w.toLowerCase() === w.toLowerCase());
  return (lista[k] ?? lista[lista.length - 1]).s;
};
const ini = (n: number) => cena(n).start - 0.35;
const fim = (n: number) => (n < 6 ? cena(n + 1).start - 0.35 : timeline.total);

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

// ---------- utilidades de animação ----------
const FadeSlide: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const fr = useCurrentFrame();
  const op = interpolate(fr, [0, 12, dur - 10, dur], [0, 1, 1, 0], clamp);
  const y = interpolate(fr, [0, 14], [26, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  return <AbsoluteFill style={{ opacity: op, transform: `translateY(${y}px)` }}>{children}</AbsoluteFill>;
};

const Digitando: React.FC<{ inicio: number; fimDigit: number; tamanho: number; cor?: string }> = ({ inicio, fimDigit, tamanho, cor = '#fff' }) => {
  const fr = useCurrentFrame();
  const n = Math.round(interpolate(fr, [inicio, fimDigit], [0, FRASE.length], clamp));
  const cursor = Math.floor(fr / 15) % 2 === 0;
  if (fr < inicio - 2) return null;
  return (
    <div style={{ fontFamily: FONTE, fontWeight: 900, fontSize: tamanho, lineHeight: 1.08, color: cor, letterSpacing: '-0.02em', textAlign: 'center', padding: '0 70px' }}>
      <span>“{FRASE.slice(0, n)}</span>
      {n >= FRASE.length ? <span>”</span> : null}
      <span style={{ opacity: cursor ? 1 : 0, color: LARANJA, fontWeight: 400 }}>|</span>
    </div>
  );
};

// ---------- cenário ----------
const Estudio: React.FC = () => {
  const fr = useCurrentFrame();
  const pulso = 0.6 + 0.1 * Math.sin(fr / 40);
  return (
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 55% 30%, #1b2740 0%, #0b1020 55%, #05070d 100%)' }}>
      {/* faixas de luz na parede: azul (caráter) e laranja (instinto) */}
      {[140, 230, 1700, 1790].map((x, i) => (
        <div key={x} style={{
          position: 'absolute', left: x, top: 0, width: 14, height: 820,
          background: `linear-gradient(to bottom, ${i < 2 ? AZUL : LARANJA}, transparent)`,
          opacity: pulso * (i % 2 ? 0.45 : 0.8), filter: 'blur(1px)', boxShadow: `0 0 40px ${i < 2 ? AZUL : LARANJA}`,
        }} />
      ))}
      {/* piso */}
      <div style={{ position: 'absolute', left: 0, top: 820, width: 1920, height: 260, background: 'linear-gradient(to bottom, #141b2e, #070a12)' }} />
      <div style={{ position: 'absolute', left: 0, top: 818, width: 1920, height: 3, background: 'linear-gradient(to right, transparent, rgba(255,255,255,.25), transparent)' }} />
      {/* logo discreto na parede */}
      <div style={{ position: 'absolute', left: 80, top: 60, fontFamily: FONTE, fontWeight: 900, fontSize: 30, letterSpacing: 10, color: 'rgba(255,255,255,.55)' }}>
        V<span style={{ color: LARANJA }}>·</span>VÉRTICE <span style={{ fontWeight: 500, letterSpacing: 4, fontSize: 18, color: 'rgba(255,255,255,.4)' }}>CASE ACADÊMICO</span>
      </div>
    </AbsoluteFill>
  );
};

// telão: área de conteúdo 1080 x 608
const TL = { x: 770, y: 120, w: 1080, h: 608 };
const Telao: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ position: 'absolute', left: TL.x - 14, top: TL.y - 14, width: TL.w + 28, height: TL.h + 28, borderRadius: 26,
    background: '#0a0d14', boxShadow: '0 30px 80px rgba(0,0,0,.6), 0 0 0 2px rgba(255,255,255,.08), 0 0 90px rgba(124,196,255,.18)' }}>
    <div style={{ position: 'absolute', left: 14, top: 14, width: TL.w, height: TL.h, borderRadius: 16, overflow: 'hidden',
      background: 'linear-gradient(135deg, #0f1830 0%, #141c33 50%, #2a1408 100%)' }}>
      {children}
    </div>
    <div style={{ position: 'absolute', left: TL.w / 2 - 60, top: TL.h + 28, width: 148, height: 90, background: 'linear-gradient(#1a2030,#0c0f17)' }} />
  </div>
);

// ---------- conteúdo de cada cena no telão ----------
const Cena1: React.FC = () => {
  const fr = useCurrentFrame();
  const t0 = 0;
  const digit0 = f(quando(1, 'Meu')) - t0;
  const digit1 = f(quando(1, 'instinto')) - t0 + 14;
  const tagOp = interpolate(fr, [0, 12, digit0 - 6, digit0 + 4], [0, 1, 1, 0.0], clamp);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ position: 'absolute', top: 70, opacity: tagOp, fontFamily: FONTE, fontWeight: 800, fontSize: 30, letterSpacing: 6, color: LARANJA }}>
        ▲ EM ALTA NA INTERNET
      </div>
      <div style={{ position: 'absolute', top: 210, opacity: tagOp, fontFamily: FONTE, fontWeight: 900, fontSize: 150, color: 'rgba(255,255,255,.14)' }}>#meme</div>
      <Digitando inicio={digit0} fimDigit={digit1} tamanho={74} />
    </AbsoluteFill>
  );
};

const Cena2: React.FC = () => {
  const fr = useCurrentFrame();
  const t0 = f(ini(2));
  const { fps } = useVideoConfig();
  const views = Math.round(interpolate(fr, [0, f(quando(2, 'graça')) - t0 + 10], [0, 2400000], { ...clamp, easing: Easing.out(Easing.quad) }));
  const chipAtencao = spring({ frame: fr - (f(quando(2, 'atenção')) - t0), fps, config: { damping: 12 } });
  const chipRisco = spring({ frame: fr - (f(quando(2, 'queimar')) - t0), fps, config: { damping: 12 } });
  const pergunta = interpolate(fr, [f(quando(2, 'Mas')) - t0, f(quando(2, 'Mas')) - t0 + 12], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ position: 'absolute', top: 70, width: '100%', opacity: 1 - pergunta * 0.65, transform: `scale(${1 - pergunta * 0.12})` }}>
        <Digitando inicio={-10} fimDigit={0} tamanho={60} />
      </div>
      <div style={{ position: 'absolute', top: 300, display: 'flex', gap: 28, alignItems: 'center' }}>
        <div style={{ fontFamily: FONTE, fontWeight: 900, fontSize: 64, color: '#fff' }}>
          {(views / 1e6).toFixed(1).replace('.', ',')} mi <span style={{ fontSize: 30, fontWeight: 600, color: 'rgba(255,255,255,.6)' }}>visualizações</span>
        </div>
        <div style={{ transform: `scale(${chipAtencao})`, background: AZUL, color: '#08223f', fontFamily: FONTE, fontWeight: 800, fontSize: 30, padding: '12px 26px', borderRadius: 999 }}>
          atenção de graça
        </div>
      </div>
      <div style={{ position: 'absolute', top: 410, opacity: pergunta, transform: `translateY(${(1 - pergunta) * 20}px)`, fontFamily: FONTE, fontWeight: 800, fontSize: 46, color: '#fff', textAlign: 'center' }}>
        Como usar <span style={{ color: LARANJA }}>sem queimar a marca?</span>
        <div style={{ marginTop: 22 }}><span style={{ display: 'inline-block', transform: `scale(${chipRisco})`, background: '#ff4d4d', color: '#fff', fontSize: 26, padding: '8px 20px', borderRadius: 10, letterSpacing: 2 }}>⚠ RISCO DE REPUTAÇÃO</span></div>
      </div>
    </AbsoluteFill>
  );
};

const Cena3: React.FC = () => {
  const fr = useCurrentFrame();
  const t0 = f(ini(3));
  const sep = f(quando(3, 'contraste')) - t0;
  const p = interpolate(fr, [sep, sep + 22], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const prod = interpolate(fr, [f(quando(3, 'produto')) - t0 - 4, f(quando(3, 'produto')) - t0 + 10], [0, 1], clamp);
  const palavra = (txt: string, cor: string, lado: -1 | 1) => (
    <div style={{ position: 'absolute', top: TL.h / 2 - 60, left: TL.w / 2 + lado * TL.w / 4 * p - 300, width: 600, textAlign: 'center',
      fontFamily: FONTE, fontWeight: 900, fontSize: 92, letterSpacing: '0.04em', color: cor, opacity: p,
      transform: `scale(${0.6 + 0.4 * p})`, textShadow: `0 0 40px ${cor}55` }}>{txt}</div>
  );
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ opacity: 1 - p, filter: `blur(${p * 8}px)`, transform: `scale(${1 - p * 0.1})` }}>
        <Digitando inicio={-10} fimDigit={0} tamanho={62} />
      </div>
      <div style={{ position: 'absolute', left: TL.w / 2 - 2, top: 70, width: 4, height: (TL.h - 140) * p, background: `linear-gradient(${AZUL}, ${LARANJA})`, opacity: p }} />
      {palavra('CARÁTER', AZUL, -1)}
      {palavra('INSTINTO', LARANJA, 1)}
      <div style={{ position: 'absolute', bottom: 60, opacity: prod, transform: `translateY(${(1 - prod) * 20}px)`, fontFamily: FONTE, fontWeight: 700, fontSize: 34, color: 'rgba(255,255,255,.85)' }}>
        estrutura do meme <span style={{ color: LARANJA }}>→</span> atributo do produto
      </div>
    </AbsoluteFill>
  );
};

const Cena4: React.FC = () => {
  const fr = useCurrentFrame();
  const t0 = f(ini(4));
  const zEsq = f(quando(4, 'caráter')) - t0 - 8;
  const zDir = f(quando(4, 'Do')) - t0 - 4;
  const ease = Easing.inOut(Easing.cubic);
  const escala = interpolate(fr, [0, zEsq, zEsq + 20, zDir, zDir + 20], [1, 1, 1.75, 1.75, 1.75], { ...clamp, easing: ease });
  const origemX = interpolate(fr, [zDir, zDir + 22], [8, 92], { ...clamp, easing: ease });
  const rotulo = (txt: string, cor: string, a: number) => (
    <div style={{ position: 'absolute', bottom: 34, left: 0, right: 0, textAlign: 'center', opacity: a }}>
      <span style={{ background: cor, color: '#0b0b0b', fontFamily: FONTE, fontWeight: 900, fontSize: 34, padding: '10px 28px', borderRadius: 999, letterSpacing: 4 }}>{txt}</span>
    </div>
  );
  return (
    <AbsoluteFill>
      <Img src={staticFile('peca.png')} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${escala})`, transformOrigin: `${origemX}% 62%` }} />
      {rotulo('CARÁTER', AZUL, interpolate(fr, [zEsq + 10, zEsq + 20, zDir - 4, zDir + 4], [0, 1, 1, 0], clamp))}
      {rotulo('INSTINTO', LARANJA, interpolate(fr, [zDir + 12, zDir + 22], [0, 1], clamp))}
    </AbsoluteFill>
  );
};

const Cena5: React.FC = () => {
  const fr = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t0 = f(ini(5));
  const tT = f(quando(5, 'valor')) - t0 - 4;
  const tI = f(quando(5, 'identidade')) - t0 - 4;
  const sT = spring({ frame: fr - tT, fps, config: { damping: 14 } });
  const seta = interpolate(fr, [tI - 8, tI + 6], [0, 1], clamp);
  const sI = spring({ frame: fr - tI, fps, config: { damping: 10, stiffness: 120 } });
  const risco = interpolate(fr, [tI, tI + 14], [0, 100], clamp);
  const lados = interpolate(fr, [f(quando(5, 'dois')) - t0 - 4, f(quando(5, 'dois')) - t0 + 10], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 40 }}>
      <div style={{ position: 'absolute', top: 70, fontFamily: FONTE, fontWeight: 800, fontSize: 30, letterSpacing: 6, color: LARANJA }}>VALOR DE MARCA</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, fontFamily: FONTE, fontWeight: 900 }}>
        <div style={{ position: 'relative', fontSize: 54, color: `rgba(255,255,255,${0.95 - risco / 200})`, transform: `scale(${sT})` }}>
          TRANSPORTE
          <div style={{ position: 'absolute', left: 0, top: '52%', height: 7, width: `${risco}%`, background: LARANJA, borderRadius: 4 }} />
        </div>
        <div style={{ fontSize: 56, color: LARANJA, opacity: seta, transform: `translateX(${(1 - seta) * -30}px)` }}>→</div>
        <div style={{ fontSize: 64, transform: `scale(${sI})`, background: `linear-gradient(90deg, ${AZUL}, ${LARANJA})`, WebkitBackgroundClip: 'text', color: 'transparent' }}>
          IDENTIDADE
        </div>
      </div>
      <div style={{ opacity: lados, fontFamily: FONTE, fontWeight: 700, fontSize: 36, color: 'rgba(255,255,255,.85)' }}>
        os <span style={{ color: AZUL }}>dois lados</span> de quem <span style={{ color: LARANJA }}>dirige</span>
      </div>
    </AbsoluteFill>
  );
};

// cena 6: tela cheia
const Final: React.FC = () => {
  const fr = useCurrentFrame();
  const { fps } = useVideoConfig();
  const zoom = interpolate(fr, [0, 300], [1.18, 1.26], clamp);
  const tOs = f(quando(6, 'Os')) - f(ini(6));
  const escurece = interpolate(fr, [tOs - 14, tOs + 4], [0, 1], clamp);
  const desenho = interpolate(fr, [tOs - 10, tOs + 18], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const letras = spring({ frame: fr - (tOs + 2), fps, config: { damping: 15 } });
  const assin = interpolate(fr, [tOs + 6, tOs + 20], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Img src={staticFile('peca.png')} style={{ width: '100%', height: '100%', transform: `scale(${zoom})`, transformOrigin: '50% 28%', filter: `blur(${escurece * 9}px)` }} />
      <AbsoluteFill style={{ background: `rgba(3,5,10,${0.72 * escurece})` }} />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 30, marginTop: -60 }}>
        <svg width="760" height="132" viewBox="0 0 520 90" style={{ opacity: escurece }}>
          <path d="M6 8 L38 80 L70 8" fill="none" stroke="#fff" strokeWidth="13" strokeDasharray="170" strokeDashoffset={170 * (1 - desenho)} />
          <path d="M30 8 L38 26 L46 8" fill="none" stroke={LARANJA} strokeWidth="7" opacity={desenho} />
          <text x="96" y="74" fontFamily="Inter Display" fontWeight={900} fontSize={80} letterSpacing={14 + (1 - letras) * 30} fill="#fff" opacity={letras}>VÉRTICE</text>
        </svg>
        <div style={{ opacity: assin, transform: `translateY(${(1 - assin) * 24}px)`, fontFamily: FONTE, fontWeight: 600, fontSize: 54, color: '#fff', textAlign: 'center' }}>
          <b style={{ fontWeight: 900, color: LARANJA }}>Vértice Duo.</b> Os dois lados de você,<br />num carro só.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- apresentador ----------
const Apresentador: React.FC<{ amp: number }> = ({ amp }) => {
  const fr = useCurrentFrame();
  const saida = interpolate(fr, [f(ini(6)) - 4, f(ini(6)) + 14], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const entrada = interpolate(fr, [0, 16], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  // piscar: a cada ~3,2 s, com variação
  const ciclo = 96 + ((Math.floor(fr / 96) * 37) % 30);
  const pos = fr % ciclo;
  const piscar = pos < 3 ? [0.5, 1, 0.5][pos] : 0;
  const cabecaX = Math.sin(fr / 23) * 4 + Math.sin(fr / 9) * amp * 2;
  const cabecaY = Math.sin(fr / 31) * 3 - amp * 4;
  const inclinacao = Math.sin(fr / 41) * 2.2 + amp * 1.2;
  return (
    <div style={{ position: 'absolute', left: 70 - saida * 700, bottom: 0, width: 640, height: 875, opacity: entrada * (1 - saida),
      transform: `translateY(${(1 - entrada) * 40}px)` }}>
      <div style={{ position: 'absolute', left: 80, bottom: 0, width: 480, height: 40, borderRadius: '50%', background: 'rgba(0,0,0,.5)', filter: 'blur(14px)' }} />
      <Rafa boca={amp} piscar={piscar} cabecaX={cabecaX} cabecaY={cabecaY} inclinacao={inclinacao} sobrancelha={amp * 5} respiro={Math.sin(fr / 45) * 3} />
      <div style={{ position: 'absolute', left: 40, bottom: 175, background: 'rgba(5,8,15,.85)', borderLeft: `5px solid ${LARANJA}`, padding: '8px 18px', fontFamily: FONTE, color: '#fff' }}>
        <div style={{ fontWeight: 900, fontSize: 26 }}>Rafa</div>
        <div style={{ fontWeight: 500, fontSize: 16, opacity: 0.7 }}>apresentador virtual (personagem fictício)</div>
      </div>
    </div>
  );
};

// ---------- legendas ----------
const Legendas: React.FC = () => {
  const fr = useCurrentFrame();
  const t = fr / FPS;
  const l = timeline.legendas.find((x) => t >= x.start && t < x.end);
  if (!l) return null;
  const op = interpolate(t, [l.start, l.start + 0.12], [0.4, 1], clamp);
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 52, display: 'flex', justifyContent: 'center' }}>
      <div style={{ maxWidth: 1500, background: 'rgba(0,0,0,.66)', borderRadius: 14, padding: '14px 34px', opacity: op,
        fontFamily: FONTE, fontWeight: 800, fontSize: 46, color: '#fff', textAlign: 'center', lineHeight: 1.2, textShadow: '0 2px 6px rgba(0,0,0,.6)' }}>
        {l.text}
      </div>
    </div>
  );
};

export const Video: React.FC = () => {
  const fr = useCurrentFrame();
  const { fps } = useVideoConfig();
  const audio = useAudioData(staticFile('narracao.wav'));
  let amp = 0;
  if (audio) {
    const amostra = (k: number) => {
      const v = visualizeAudio({ fps, frame: Math.max(0, fr + k), audioData: audio, numberOfSamples: 32 });
      return v.slice(1, 10).reduce((a, b) => a + b, 0) / 9;
    };
    const bruto = (amostra(-1) + 2 * amostra(0) + amostra(1)) / 4; // suavização
    amp = Math.min(1, Math.pow(bruto * 9, 0.8));
    if (amp < 0.06) amp = 0;
  }
  const telaoOp = interpolate(fr, [f(ini(6)) - 6, f(ini(6)) + 10], [1, 0], clamp);
  const entraTelao = interpolate(fr, [4, 22], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <Audio src={staticFile('narracao.wav')} />
      <Audio src={staticFile('trilha.wav')} volume={0.07} />
      <Estudio />
      <div style={{ opacity: telaoOp * entraTelao, transform: `translateX(${(1 - entraTelao) * 60}px)` }}>
        <Telao>
          <Sequence from={0} durationInFrames={f(fim(1))} layout="none"><FadeSlide dur={f(fim(1))}><Cena1 /></FadeSlide></Sequence>
          {[2, 3, 4, 5].map((n) => {
            const C = [Cena2, Cena3, Cena4, Cena5][n - 2];
            const d = f(fim(n)) - f(ini(n));
            return <Sequence key={n} from={f(ini(n))} durationInFrames={d} layout="none"><FadeSlide dur={d}><C /></FadeSlide></Sequence>;
          })}
        </Telao>
      </div>
      <Apresentador amp={amp} />
      <Sequence from={f(ini(6))}>
        <AbsoluteFill style={{ opacity: interpolate(fr, [f(ini(6)), f(ini(6)) + 14], [0, 1], clamp) }}><Final /></AbsoluteFill>
      </Sequence>
      <Legendas />
    </AbsoluteFill>
  );
};
