# Biblioteca de prompts

> Modelos iniciais. Sua biblioteca real fica na aba "Biblioteca de Prompts" da planilha, com nota de resultado. Escreva prompts de imagem e vídeo **em inglês** (os modelos entendem melhor e você treina vocabulário).

## P-IMG — imagem de produto

```
[PRODUCT: exact description, repeated identically in every prompt — material, color, shape, label]
[SETTING: where it is]
[LIGHTING: soft window light / softbox from the left / golden hour / rim light / high-key / low-key]
[CAMERA: 35mm / 50mm / 85mm / 100mm macro · angle: eye level / top-down flat lay / low angle]
[COMPOSITION: centered hero shot / rule of thirds / negative space on the right for text]
[STYLE: photorealistic commercial product photography, natural textures, subtle reflections]
[CONSTRAINTS: no text, no extra logos, no people, no hands]  ← remova o que não se aplica
```

Exemplo:
> A matte black aluminum can of iced coffee with a minimalist white label, on a wooden breakfast table by a window, soft morning light from the left, condensation drops on the can, shot on 85mm, shallow depth of field, negative space on the right, photorealistic commercial product photography, no extra text.

**Dicas:** gere o packshot primeiro e use-o como referência; repita a descrição do produto palavra por palavra; texto e logos gerados por IA costumam sair errados — aplique na edição.

## P-VID — image-to-video (ou text-to-video)

```
[SHOT: what happens — one action only]
[CAMERA: slow push-in / dolly out / orbit left / crane up / handheld subtle / locked-off static]
[SPEED: slow, subtle, smooth]
[LIGHT/ATMOSPHERE: if it changes]
[DURATION: 5–8 seconds]
[AVOID: morphing, text changes, extra objects, camera shake]  ← se a ferramenta aceitar prompt negativo
```

Exemplos:
- Hero shot: "Slow orbit around the bottle on a dark glossy surface, thin rim light outlining the edges, tiny particles floating, smooth and premium, 6 seconds."
- Comida: "Extreme close-up of melted cheese stretching as a burger is pulled apart, steam rising, warm light, slow motion, 5 seconds."
- Imóvel: "Very slow dolly forward through the living room, natural daylight from the windows, no changes to furniture or architecture, 6 seconds."
- Splash: "Orange slices and water splash around the serum bottle in slow motion, studio lighting, clean white background, 5 seconds."

**Regra:** em image-to-video descreva **movimento e ação**, não o visual (a imagem já define o visual).

## P-ROTEIRO — roteiro de anúncio

```
You are a senior performance creative strategist for e-commerce brands.
Product: [ ] · Price/offer: [ ] · Customer: [ ] · Main pain: [ ] · Proof we can legally use: [ ]
Write 3 scripts for [15/20/30]-second [platform] video ads, each with a DIFFERENT concept:
(1) problem-solution, (2) product demo, (3) "3 reasons".
For each: hook (first 2 seconds, works without sound), on-screen text, voiceover (max [45] words
for 20 s), shot list (5–6 shots), CTA. No health claims, no fake testimonials, no invented numbers.
```

## P-CRITICA — crítica de roteiro/anúncio

```
Act as a skeptical head of growth at a DTC brand who reviews 50 ads a week.
Critique this ad script/storyboard: [ ].
Score 1–10 for: hook strength, clarity of benefit, believability, differentiation from typical ads, CTA.
Then give me the 3 most important changes, and rewrite only the hook in 3 stronger ways.
```

## P-PESQUISA — mineração de avaliações (Dia 92)

```
Below are customer reviews and comments about [category/product].
Group them into themes. For each theme give: persona, pain or desire, the exact customer quote
(copy literally), the objection it reveals, and one ad hook idea based on the quote.
Return a table. Do not invent quotes.
Reviews: """[cole os trechos com a fonte]"""
```

## P-ING-1, P-ING-2, P-ING-3 — inglês

Ver [04-INGLES/plano-de-ingles.md](../04-INGLES/plano-de-ingles.md#prompts-de-ia-para-inglês).

## P-LOOM — tópicos para teardown (Dia 67)

```
I'm recording a 2-minute Loom for [Brand]'s founder about their Meta ads.
Here's what I observed: [observações].
Give me bullet points (not a script) for: 10-second intro, what's working (2 points),
2 opportunities, 1 concrete ad idea, 10-second invitation. Simple English (B1–B2), friendly, specific.
```
