// SUV "Vértice Duo" — ilustração vetorial original (vista lateral, frente para a direita).
// Sistema de coordenadas: 1000 x 400, chão em y = 400.
module.exports = function carro({ id = 'c', abrirPortaMalas = true, faroisAcesos = true } = {}) {
  const roda = (cx) => `
    <g transform="translate(${cx},322)">
      <circle r="74" fill="#0c0d10"/>
      <circle r="70" fill="#17181c"/>
      <circle r="66" fill="none" stroke="#2a2c31" stroke-width="3"/>
      <circle r="50" fill="url(#${id}-aro)"/>
      ${[0, 72, 144, 216, 288].map(a => `
        <g transform="rotate(${a})">
          <path d="M-7,-12 L-11,-47 Q0,-51 11,-47 L7,-12 Z" fill="#d9dde3"/>
          <path d="M-2,-14 L-4,-46 L4,-46 L2,-14 Z" fill="#9aa1ab"/>
        </g>`).join('')}
      <circle r="47" fill="none" stroke="#c3c8cf" stroke-width="3"/>
      <circle r="13" fill="#2a2d33"/>
      <circle r="13" fill="none" stroke="#e8ebef" stroke-width="2"/>
      <path d="M-5,-2 L0,4 L5,-2" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
    </g>`;

  const corpo = `M 40 318 L 36 250 Q 36 214 62 200 L 84 118 Q 92 92 122 90 L 600 84 Q 640 84 668 102
    L 772 180 Q 780 186 800 188 L 930 204 Q 966 212 970 246 L 972 300 Q 972 318 950 320
    L 878 320 A 88 88 0 0 0 702 320 L 328 320 A 88 88 0 0 0 152 320 L 40 318 Z`;

  return `
  <defs>
    <linearGradient id="${id}-lat" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#6b7582"/>
      <stop offset="0.28" stop-color="#4a525d"/>
      <stop offset="0.36" stop-color="#2f353d"/>
      <stop offset="0.62" stop-color="#3b424b"/>
      <stop offset="1" stop-color="#1d2127"/>
    </linearGradient>
    <linearGradient id="${id}-vidro" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#2b3d52"/>
      <stop offset="0.55" stop-color="#121b26"/>
      <stop offset="1" stop-color="#0a0f15"/>
    </linearGradient>
    <radialGradient id="${id}-aro">
      <stop offset="0" stop-color="#3a3e45"/><stop offset="1" stop-color="#15171b"/>
    </radialGradient>
    <linearGradient id="${id}-quente" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#ff8a1e" stop-opacity="0"/>
      <stop offset="0.6" stop-color="#ff8a1e" stop-opacity="0.35"/>
      <stop offset="1" stop-color="#ffc14d" stop-opacity="0.55"/>
    </linearGradient>
    <linearGradient id="${id}-frio" x1="1" y1="0" x2="0" y2="0">
      <stop offset="0" stop-color="#bfe0ff" stop-opacity="0"/>
      <stop offset="1" stop-color="#d8ecff" stop-opacity="0.35"/>
    </linearGradient>
    <linearGradient id="${id}-facho" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#fff6d8" stop-opacity="0.85"/>
      <stop offset="1" stop-color="#fff6d8" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="${id}-sombra">
      <stop offset="0" stop-color="#000" stop-opacity="0.55"/><stop offset="1" stop-color="#000" stop-opacity="0"/>
    </radialGradient>
    <clipPath id="${id}-clip"><path d="${corpo}"/></clipPath>
    <clipPath id="${id}-dir"><rect x="505" y="-200" width="700" height="800"/></clipPath>
    <clipPath id="${id}-esq"><rect x="-200" y="-200" width="705" height="800"/></clipPath>
  </defs>

  <ellipse cx="505" cy="398" rx="480" ry="26" fill="url(#${id}-sombra)"/>
  <g transform="translate(505,400) scale(0.9,1.1) translate(-505,-400)">

  ${faroisAcesos ? `<path d="M 968 222 L 1400 170 L 1400 330 Z" fill="url(#${id}-facho)" opacity="0.55"/>` : ''}

  ${abrirPortaMalas ? `
  <g>
    <path d="M 124 90 L 66 6 Q 60 -2 52 4 L 46 10 L 104 96 Z" fill="url(#${id}-lat)"/>
    <path d="M 112 84 L 68 20 L 60 26 L 102 90 Z" fill="url(#${id}-vidro)"/>
    <path d="M 58 2 L 49 9" stroke="#c4182b" stroke-width="5" stroke-linecap="round"/>
    <line x1="96" y1="106" x2="72" y2="40" stroke="#888" stroke-width="3"/>
  </g>` : ''}

  <ellipse cx="240" cy="318" rx="86" ry="84" fill="#0b0c0f"/>
  <ellipse cx="790" cy="318" rx="86" ry="84" fill="#0b0c0f"/>
  <path d="${corpo}" fill="url(#${id}-lat)"/>

  <!-- vidros -->
  <path d="M 108 182 L 122 120 Q 127 108 140 108 L 196 107 L 196 182 Z" fill="url(#${id}-vidro)"/>
  <path d="M 222 182 L 222 106 L 448 103 L 448 182 Z" fill="url(#${id}-vidro)"/>
  <path d="M 470 182 L 470 103 L 594 102 Q 626 102 648 116 L 736 182 Z" fill="url(#${id}-vidro)"/>
  <path d="M 230 112 L 300 110 L 262 176 L 236 176 Z" fill="#fff" opacity="0.08"/>
  <path d="M 480 110 L 560 108 L 510 176 L 484 176 Z" fill="#fff" opacity="0.08"/>

  ${abrirPortaMalas ? `
  <!-- compras visíveis no porta-malas -->
  <g>
    <rect x="118" y="140" width="34" height="42" rx="3" fill="#d9a066"/>
    <rect x="118" y="140" width="34" height="6" fill="#b5804b"/>
    <circle cx="128" cy="134" r="9" fill="#5fb85a"/><circle cx="140" cy="130" r="10" fill="#4aa34a"/>
    <rect x="156" y="148" width="30" height="34" rx="3" fill="#f2f2ee"/>
    <rect x="160" y="128" width="6" height="22" rx="3" fill="#e6b45c"/>
    <rect x="170" y="124" width="7" height="26" rx="3" fill="#d79c3c"/>
  </g>` : ''}

  <!-- frisos e detalhes -->
  <path d="M 104 186 L 752 186" stroke="#c9ced6" stroke-width="2.5" opacity="0.55"/>
  <path d="M 70 214 Q 400 206 960 226" stroke="#fff" stroke-width="2" opacity="0.18" fill="none"/>
  <line x1="150" y1="86" x2="590" y2="79" stroke="#16191d" stroke-width="7" stroke-linecap="round"/>
  <line x1="210" y1="187" x2="212" y2="300" stroke="#15181c" stroke-width="2.2"/>
  <line x1="459" y1="187" x2="460" y2="304" stroke="#15181c" stroke-width="2.2"/>
  <path d="M 742 186 Q 756 240 728 300" stroke="#15181c" stroke-width="2.2" fill="none"/>
  <rect x="286" y="206" width="40" height="7" rx="3.5" fill="#20252b"/>
  <rect x="536" y="206" width="40" height="7" rx="3.5" fill="#20252b"/>
  <path d="M 722 176 Q 716 156 736 150 L 760 156 Q 766 172 750 180 Z" fill="#2a2f36"/>

  <!-- saia inferior e arcos -->
  <g clip-path="url(#${id}-clip)">
    <rect x="0" y="292" width="1000" height="40" fill="#15181c"/>
    <rect x="0" y="289" width="1000" height="3" fill="#8e96a1" opacity="0.6"/>
  </g>
  <path d="M 148 320 A 92 92 0 0 1 332 320" fill="none" stroke="#111317" stroke-width="12"/>
  <path d="M 698 320 A 92 92 0 0 1 882 320" fill="none" stroke="#111317" stroke-width="12"/>

  <!-- lanternas e faróis -->
  <path d="M 38 208 L 74 198 L 77 214 L 38 226 Z" fill="#d1182c"/>
  <path d="M 40 212 L 72 204" stroke="#ff6a6a" stroke-width="2"/>
  <path d="M 900 208 L 962 220 L 960 238 L 906 228 Z" fill="${faroisAcesos ? '#fffbe8' : '#e6edf5'}"/>
  ${faroisAcesos ? `<ellipse cx="948" cy="226" rx="42" ry="16" fill="#fff4cc" opacity="0.55"/>` : ''}
  <path d="M 930 262 L 970 262 L 970 286 L 936 282 Z" fill="#14171b"/>
  <path d="M 938 268 L 966 268 M 938 276 L 966 276" stroke="#3a4048" stroke-width="2"/>

  <!-- emblema V -->
  <path d="M 935 238 l 6 10 l 6 -10" fill="none" stroke="#e6e9ee" stroke-width="2.2"/>

  <!-- luz ambiente: frio à esquerda (caráter), quente à direita (instinto) -->
  <g clip-path="url(#${id}-clip)" style="mix-blend-mode:screen">
    <rect x="0" y="0" width="505" height="400" fill="url(#${id}-frio)" clip-path="url(#${id}-esq)"/>
    <rect x="505" y="0" width="500" height="400" fill="url(#${id}-quente)"/>
  </g>
  <path d="M 600 84 Q 640 84 668 102 L 772 180 Q 780 186 800 188 L 930 204 Q 966 212 970 246"
        fill="none" stroke="#ffcf7a" stroke-width="3" opacity="0.75" clip-path="url(#${id}-dir)"/>

  </g>
  ${roda(266.5)}
  ${roda(761.5)}
  `;
};
