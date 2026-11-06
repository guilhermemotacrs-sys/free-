// Gera a peça publicitária VÉRTICE DUO em PNG (16:9 e 4:5) via HTML/SVG + Playwright.
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const carro = require('./carro');

const logo = (h, cor = '#fff') => `
  <svg height="${h}" viewBox="0 0 520 90" style="display:block">
    <path d="M6 8 L38 80 L70 8" fill="none" stroke="${cor}" stroke-width="13" stroke-linejoin="miter"/>
    <path d="M30 8 L38 26 L46 8" fill="none" stroke="#ff9a2e" stroke-width="7"/>
    <text x="96" y="74" font-family="Inter Display" font-weight="900" font-size="80" letter-spacing="14" fill="${cor}">VÉRTICE</text>
  </svg>`;

function cenaCarater(w, h, gy, bh = 300) {
  // Dia claro, frente de escola. Tudo em px dentro da metade esquerda (largura w).
  const jan = [];
  const bx = w * 0.06, bw = w * 0.62, by = gy - 30 - bh;
  for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++) {
    const x = bx + 28 + c * ((bw - 56) / 6), y = by + 46 + r * 70;
    if (r === 2 && (c === 2 || c === 3)) continue;
    jan.push(`<rect x="${x}" y="${y}" width="${(bw - 56) / 6 - 18}" height="44" rx="4" fill="#bcdcf5"/>
              <rect x="${x}" y="${y}" width="${(bw - 56) / 6 - 18}" height="10" rx="3" fill="#ffffff" opacity="0.7"/>`);
  }
  const arvore = (x, s) => `<g transform="translate(${x},${gy - 40}) scale(${s})">
      <rect x="-7" y="-60" width="14" height="70" fill="#8a6a4a"/>
      <circle cx="0" cy="-110" r="62" fill="#8fd18a"/><circle cx="-38" cy="-78" r="40" fill="#7cc477"/>
      <circle cx="36" cy="-82" r="44" fill="#9bd896"/></g>`;
  return `
  <defs>
    <linearGradient id="ceu1" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#7fc0f2"/><stop offset="0.55" stop-color="#cfe8fb"/><stop offset="1" stop-color="#f4fbff"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#ceu1)"/>
  <circle cx="${w * 0.14}" cy="${h * 0.3}" r="70" fill="#fff" opacity="0.55"/>
  <g fill="#fff" opacity="0.9">
    <ellipse cx="${w * 0.3}" cy="${h * 0.36}" rx="90" ry="22"/><ellipse cx="${w * 0.36}" cy="${h * 0.345}" rx="60" ry="24"/>
    <ellipse cx="${w * 0.8}" cy="${h * 0.28}" rx="70" ry="16"/>
  </g>
  ${arvore(w * 0.02, 1.0)}
  <!-- escola -->
  <rect x="${bx}" y="${by}" width="${bw}" height="${bh}" fill="#ffffff"/>
  <rect x="${bx}" y="${by}" width="${bw}" height="18" fill="#2d6fb7"/>
  <rect x="${bx + bw / 2 - 120}" y="${by - 64}" width="240" height="64" fill="#ffffff"/>
  <rect x="${bx + bw / 2 - 120}" y="${by - 64}" width="240" height="10" fill="#2d6fb7"/>
  <text x="${bx + bw / 2}" y="${by - 18}" text-anchor="middle" font-family="Inter Display" font-weight="800" font-size="26" letter-spacing="5" fill="#2d6fb7">ESCOLA</text>
  ${jan.join('')}
  <rect x="${bx + bw / 2 - 46}" y="${by + bh - 96}" width="92" height="96" fill="#2d6fb7"/>
  <rect x="${bx + bw / 2 - 2}" y="${by + bh - 96}" width="4" height="96" fill="#fff" opacity="0.7"/>
  ${arvore(w * 0.86, 1.1)}
  <!-- calçada e rua -->
  <rect x="0" y="${gy - 30}" width="${w}" height="34" fill="#e8edf1"/>
  <rect x="0" y="${gy - 4}" width="${w}" height="8" fill="#cfd8df"/>
  <rect x="0" y="${gy + 4}" width="${w}" height="${h - gy}" fill="#9fb0bd"/>
  ${[0, 1, 2, 3, 4, 5, 6].map(i => `<rect x="${w * 0.08 + i * 46}" y="${gy + 18}" width="28" height="${h - gy}" fill="#ffffff" opacity="0.75"/>`).join('')}
  `;
}

function cenaInstinto(w, h, gy) {
  const mont = (pts, cor) => `<path d="M0 ${gy} ${pts.map(([x, y]) => `L${x * w} ${gy - y}`).join(' ')} L${w} ${gy} Z" fill="${cor}"/>`;
  const postes = [];
  for (let i = 0; i < 9; i++) postes.push(`<rect x="${i * w / 8 - 4}" y="${gy - 52}" width="8" height="40" fill="#120a05"/>`);
  const riscos = [];
  for (let i = 0; i < 7; i++) {
    const y = gy - 170 + i * 30, x = w * (0.04 + (i * 37 % 50) / 100), l = 140 + (i * 53 % 160);
    riscos.push(`<rect x="${x}" y="${y}" width="${l}" height="${i % 2 ? 2 : 3}" rx="2" fill="#ffd27a" opacity="${0.18 + (i % 3) * 0.08}"/>`);
  }
  return `
  <defs>
    <linearGradient id="ceu2" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#140904"/><stop offset="0.35" stop-color="#5a2108"/>
      <stop offset="0.68" stop-color="#e2661a"/><stop offset="0.86" stop-color="#ffb347"/><stop offset="1" stop-color="#ffd98a"/>
    </linearGradient>
    <radialGradient id="sol"><stop offset="0" stop-color="#fff3c4"/><stop offset="0.35" stop-color="#ffd166"/><stop offset="1" stop-color="#ff9a2e" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#ceu2)"/>
  <circle cx="${w * 0.72}" cy="${gy - 150}" r="210" fill="url(#sol)"/>
  <circle cx="${w * 0.72}" cy="${gy - 150}" r="62" fill="#fff1c1"/>
  ${mont([[0, 210], [0.18, 300], [0.34, 220], [0.52, 330], [0.7, 240], [0.86, 310], [1, 230]], '#8a3a12')}
  ${mont([[0, 150], [0.12, 190], [0.3, 120], [0.46, 210], [0.62, 140], [0.8, 200], [1, 130]], '#4a1d08')}
  ${mont([[0, 90], [0.2, 120], [0.4, 70], [0.6, 110], [0.82, 60], [1, 95]], '#1e0c04')}
  <!-- estrada de serra -->
  <rect x="0" y="${gy - 14}" width="${w}" height="${h - gy + 14}" fill="#0d0a08"/>
  ${postes.join('')}
  <rect x="0" y="${gy - 54}" width="${w}" height="9" fill="#2a1a10"/>
  <rect x="0" y="${gy - 54}" width="${w}" height="2" fill="#ffb347" opacity="0.6"/>
  <rect x="0" y="${gy - 15}" width="${w}" height="2" fill="#ff9a2e" opacity="0.35"/>
  ${[0, 1, 2, 3, 4, 5].map(i => `<rect x="${i * w / 5 + 20}" y="${gy + 34}" width="${w / 10}" height="7" fill="#ffc35a" opacity="0.8"/>`).join('')}
  ${riscos.join('')}
  `;
}

function html(W, H, cfg) {
  const half = W / 2;
  const carW = 1000 * cfg.escala;
  const carX = half - 505 * cfg.escala;
  const carY = cfg.chao - 400 * cfg.escala;
  return `<!doctype html><html><head><meta charset="utf-8"><style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{width:${W}px;height:${H}px;overflow:hidden;font-family:'Inter Display','Inter',sans-serif;background:#000}
    .abs{position:absolute}
    .head{top:${cfg.headTop}px;font-weight:900;font-size:${cfg.headSize}px;
          line-height:1.02;letter-spacing:-0.025em}
    .head span.k{font-style:italic}
    .tag{top:${cfg.tagTop}px;width:${half}px;display:flex;justify-content:center}
    .tag div{font-weight:700;font-size:${cfg.tagSize}px;padding:${cfg.tagSize * 0.45}px ${cfg.tagSize * 0.9}px;border-radius:999px;
             letter-spacing:0.01em;text-align:center;max-width:${half - 50}px;line-height:1.25}
    .tag b{font-weight:900}
    .faixa{left:0;bottom:0;width:${W}px;height:${cfg.faixa}px;
           background:linear-gradient(to bottom,rgba(0,0,0,0) 0%,rgba(4,6,10,.82) 34%,#05070b 70%);
           display:flex;flex-direction:column;align-items:center;justify-content:flex-end;padding-bottom:${cfg.faixaPad}px;gap:${cfg.gap}px}
    .assin{color:#fff;font-weight:600;font-size:${cfg.assinSize}px;letter-spacing:0.01em}
    .assin b{font-weight:900;color:#ffb347}
    .legal{color:rgba(255,255,255,.45);font-size:${cfg.legalSize}px;font-weight:500;letter-spacing:.04em}
  </style></head><body>
  <svg class="abs" style="left:0;top:0" width="${half}" height="${H}">${cenaCarater(half, H, cfg.chao, cfg.predio)}</svg>
  <svg class="abs" style="left:${half}px;top:0" width="${half}" height="${H}">${cenaInstinto(half, H, cfg.chao)}</svg>
  <div class="abs" style="left:${half - 2}px;top:0;width:4px;height:${H}px;background:linear-gradient(to bottom,#ffffff 0%,#ffd27a 60%,rgba(255,180,80,0) 100%);box-shadow:0 0 24px rgba(255,220,150,.8)"></div>
  <svg class="abs" style="left:${carX}px;top:${carY}px;overflow:visible" width="${carW}" height="${400 * cfg.escala}" viewBox="0 0 1000 400">
    ${carro({ id: 'duo' })}
  </svg>

  <!-- headline em duas colunas: caráter (esq.) x instinto (dir.) -->
  <div class="abs head" style="left:0;width:${half}px;text-align:right;padding-right:${cfg.gapHead}px;color:#0b2545">${cfg.headL}</div>
  <div class="abs head" style="left:${half}px;width:${half}px;text-align:left;padding-left:${cfg.gapHead}px;color:#fff;text-shadow:0 4px 30px rgba(0,0,0,.35)">${cfg.headR}</div>

  <div class="abs tag" style="left:0"><div style="background:rgba(255,255,255,.88);color:#0b2545;box-shadow:0 8px 30px rgba(20,70,130,.18)">
    <b>Meu caráter:</b> econômico, seguro, família.</div></div>
  <div class="abs tag" style="left:${half}px"><div style="background:rgba(10,6,3,.72);color:#fff;border:1.5px solid rgba(255,179,71,.7)">
    <b style="color:#ffb347">Meu instinto:</b> 0 a 100 em 7 segundos.</div></div>

  <div class="abs faixa">
    ${logo(cfg.logoH)}
    <div class="assin"><b>Vértice Duo.</b> Os dois lados de você, num carro só.</div>
    <div class="legal">MARCA FICTÍCIA · TRABALHO ACADÊMICO · IMAGEM ILUSTRATIVA</div>
  </div>
  </body></html>`;
}

const formatos = {
  '1920x1080': {
    W: 1920, H: 1080, escala: 1.22, chao: 860, headTop: 62, headSize: 96, tagTop: 302, tagSize: 27,
    headL: 'Meu <span class="k">caráter</span><br>a ver com', headR: 'não tem nada<br>meu <span class="k">instinto.</span>', gapHead: 26, predio: 300,
    faixa: 230, faixaPad: 26, gap: 12, logoH: 46, assinSize: 30, legalSize: 13,
  },
  '1080x1350': {
    W: 1080, H: 1350, escala: 1.0, chao: 1065, headTop: 165, headSize: 76, tagTop: 400, tagSize: 21,
    headL: 'Meu <span class="k">caráter</span><br>a ver com', headR: 'não tem nada<br>meu <span class="k">instinto.</span>', gapHead: 18, predio: 430,
    faixa: 250, faixaPad: 30, gap: 12, logoH: 44, assinSize: 28, legalSize: 12,
  },
};

(async () => {
  const out = process.argv[2] || path.join(__dirname, '..', '..', 'saida');
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch();
  for (const [nome, cfg] of Object.entries(formatos)) {
    const page = await browser.newPage({ viewport: { width: cfg.W, height: cfg.H } });
    const doc = html(cfg.W, cfg.H, cfg);
    fs.writeFileSync(path.join(__dirname, `peca_${nome}.html`), doc);
    await page.setContent(doc);
    await page.evaluate(() => document.fonts.ready);
    const arq = nome === '1920x1080' ? 'peca_publicitaria.png' : 'peca_publicitaria_1080x1350.png';
    await page.screenshot({ path: path.join(out, arq) });
    console.log('ok', arq);
    await page.close();
  }
  await browser.close();
})();
