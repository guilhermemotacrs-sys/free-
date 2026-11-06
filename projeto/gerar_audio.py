import asyncio, json, os, subprocess, edge_tts
PROXY = os.environ.get("HTTPS_PROXY")
lines = [l.strip() for l in open("cenas.txt", encoding="utf-8") if l.strip()]
async def gen(i, text):
    c = edge_tts.Communicate(text, "pt-BR-AntonioNeural", rate="+5%", boundary="WordBoundary", proxy=PROXY)
    words = []
    with open(f"cena{i}.mp3", "wb") as f:
        async for ch in c.stream():
            if ch["type"] == "audio": f.write(ch["data"])
            elif ch["type"] == "WordBoundary":
                words.append({"w": ch["text"], "s": ch["offset"]/1e7, "e": (ch["offset"]+ch["duration"])/1e7})
    dur = float(subprocess.check_output(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",f"cena{i}.mp3"]))
    return {"text": text, "words": words, "dur": dur}
async def main():
    out = [await gen(i+1, t) for i, t in enumerate(lines)]
    json.dump(out, open("timing.json","w",encoding="utf-8"), ensure_ascii=False, indent=1)
    for i,o in enumerate(out): print(i+1, o["dur"], len(o["words"]), o["words"][:3])
asyncio.run(main())
