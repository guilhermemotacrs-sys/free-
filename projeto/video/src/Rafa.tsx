// "Rafa" — apresentador fictício em ilustração flat (SVG). Não representa nenhuma pessoa real.
import React from 'react';

type Props = { boca: number; piscar: number; cabecaX: number; cabecaY: number; inclinacao: number; sobrancelha: number; respiro: number };

const PELE = '#c98b5f';
const PELE_SOMBRA = '#ad7149';
const CABELO = '#1c1411';
const BARBA = '#2b1d16';

export const Rafa: React.FC<Props> = ({ boca, piscar, cabecaX, cabecaY, inclinacao, sobrancelha, respiro }) => {
  const abre = Math.max(0, Math.min(1, boca));
  const olho = Math.max(0.08, 1 - piscar);
  return (
    <svg viewBox="0 0 600 820" width="100%" height="100%" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="jaq" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2c3a5c" /><stop offset="1" stopColor="#172036" />
        </linearGradient>
        <linearGradient id="cam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#dfe6ef" />
        </linearGradient>
        <radialGradient id="rosto" cx="0.45" cy="0.4" r="0.7">
          <stop offset="0" stopColor="#d89a6c" /><stop offset="1" stopColor={PELE} />
        </radialGradient>
      </defs>

      {/* tronco */}
      <g transform={`translate(0, ${respiro})`}>
        <path d="M 300 500 C 180 505 90 540 60 620 L 30 820 L 570 820 L 540 620 C 510 540 420 505 300 500 Z" fill="url(#jaq)" />
        {/* camisa social */}
        <path d="M 236 506 L 300 640 L 364 506 Q 300 492 236 506 Z" fill="url(#cam)" />
        <path d="M 300 560 L 300 820" stroke="#c9d2dd" strokeWidth="3" />
        {[600, 660, 720, 780].map((y) => <circle key={y} cx="307" cy={y} r="4" fill="#c2ccd8" />)}
        <path d="M 300 560 L 300 820 L 330 820 L 330 600 Z" fill="url(#cam)" opacity="0" />
        {/* colarinho */}
        <path d="M 244 500 L 300 556 L 268 590 L 232 520 Z" fill="#ffffff" stroke="#d5dde7" strokeWidth="2" />
        <path d="M 356 500 L 300 556 L 332 590 L 368 520 Z" fill="#ffffff" stroke="#d5dde7" strokeWidth="2" />
        {/* lapelas da jaqueta */}
        <path d="M 232 512 L 300 650 L 300 820 L 200 820 L 150 560 Z" fill="#23304d" />
        <path d="M 368 512 L 300 650 L 300 820 L 400 820 L 450 560 Z" fill="#23304d" />
        <path d="M 232 512 L 286 640 L 250 600 L 196 548 Z" fill="#33446b" />
        <path d="M 368 512 L 314 640 L 350 600 L 404 548 Z" fill="#33446b" />
        <path d="M 300 650 L 300 820" stroke="#0f1626" strokeWidth="3" />
        {/* zíper/bolso da jaqueta */}
        <rect x="390" y="660" width="70" height="8" rx="4" fill="#0f1626" opacity="0.6" />
        {/* costuras ombro */}
        <path d="M 120 580 Q 160 640 170 820" stroke="#0f1626" strokeWidth="3" fill="none" opacity="0.5" />
        <path d="M 480 580 Q 440 640 430 820" stroke="#0f1626" strokeWidth="3" fill="none" opacity="0.5" />
      </g>

      {/* pescoço */}
      <path d="M 262 430 L 262 512 Q 300 540 342 512 L 342 400 Z" fill={PELE_SOMBRA} />

      {/* cabeça */}
      <g transform={`translate(${cabecaX}, ${cabecaY + 38}) rotate(${inclinacao} 300 470)`}>
        {/* orelhas */}
        <ellipse cx="196" cy="320" rx="22" ry="34" fill={PELE_SOMBRA} />
        <ellipse cx="404" cy="320" rx="22" ry="34" fill={PELE_SOMBRA} />
        {/* rosto */}
        <path d="M 200 250 Q 200 160 300 158 Q 400 160 400 250 L 398 360 Q 392 440 300 462 Q 208 440 202 360 Z" fill="url(#rosto)" />
        {/* barba curta */}
        <path d="M 204 340 Q 210 440 300 464 Q 390 440 396 340 Q 386 400 352 420 Q 300 440 248 420 Q 214 400 204 340 Z" fill={BARBA} opacity="0.55" />
        <path d="M 262 392 Q 300 380 338 392 Q 332 398 300 395 Q 268 398 262 392 Z" fill={BARBA} opacity="0.7" />
        <ellipse cx="236" cy="352" rx="18" ry="10" fill="#e07a5f" opacity="0.18" />
        <ellipse cx="364" cy="352" rx="18" ry="10" fill="#e07a5f" opacity="0.18" />
        {/* cabelo: topete curto com laterais baixas */}
        <path d="M 196 270 Q 186 170 250 140 Q 300 112 360 132 Q 420 156 406 270 Q 398 214 372 196 Q 330 214 270 200 Q 226 196 206 236 Z" fill={CABELO} />
        <path d="M 236 150 Q 300 120 372 150 Q 330 160 300 168 Q 262 160 236 150 Z" fill="#2c211c" />
        <path d="M 198 262 L 204 300 L 210 262 Z" fill={CABELO} opacity="0.8" />
        <path d="M 402 262 L 396 300 L 390 262 Z" fill={CABELO} opacity="0.8" />

        {/* sobrancelhas */}
        <g transform={`translate(0, ${-sobrancelha})`}>
          <path d="M 236 262 Q 260 248 284 258" stroke={CABELO} strokeWidth="11" strokeLinecap="round" fill="none" />
          <path d="M 316 258 Q 340 248 364 262" stroke={CABELO} strokeWidth="11" strokeLinecap="round" fill="none" />
        </g>
        {/* olhos */}
        <g transform={`translate(0, 292) scale(1, ${olho}) translate(0, -292)`}>
          <ellipse cx="260" cy="292" rx="20" ry="13" fill="#fff" />
          <ellipse cx="340" cy="292" rx="20" ry="13" fill="#fff" />
          <circle cx="262" cy="293" r="9.5" fill="#3a2418" />
          <circle cx="342" cy="293" r="9.5" fill="#3a2418" />
          <circle cx="262" cy="293" r="4.5" fill="#0d0806" />
          <circle cx="342" cy="293" r="4.5" fill="#0d0806" />
          <circle cx="265" cy="289" r="2.6" fill="#fff" />
          <circle cx="345" cy="289" r="2.6" fill="#fff" />
        </g>
        <path d={`M 238 ${292 - 13 * olho} Q 260 ${280 - 14 * olho} 282 ${292 - 13 * olho}`} stroke="#7a4b30" strokeWidth="3" fill="none" />
        <path d={`M 318 ${292 - 13 * olho} Q 340 ${280 - 14 * olho} 362 ${292 - 13 * olho}`} stroke="#7a4b30" strokeWidth="3" fill="none" />

        {/* nariz */}
        <path d="M 300 300 Q 296 336 284 350 Q 300 360 316 350" stroke={PELE_SOMBRA} strokeWidth="5" fill="none" strokeLinecap="round" />

        {/* boca animada pela amplitude */}
        <g>
          <path d={`M 268 404 Q 300 ${398 - 2} 332 404 Q 322 ${408 + 30 * abre} 300 ${410 + 32 * abre} Q 278 ${408 + 30 * abre} 268 404 Z`} fill="#5a1f1c" />
          {abre > 0.12 && (
            <path d={`M 274 405 Q 300 401 326 405 L 324 ${409 + 6 * abre} Q 300 ${411 + 6 * abre} 276 ${409 + 6 * abre} Z`} fill="#f4f1ea" />
          )}
          {abre > 0.35 && <ellipse cx="300" cy={414 + 22 * abre} rx={14 * abre} ry={6 * abre} fill="#c8545a" />}
          <path d={`M 264 403 Q 300 ${394 + 0} 336 403`} stroke="#7d3a2f" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d={`M 276 ${414 + 30 * abre} Q 300 ${420 + 32 * abre} 324 ${414 + 30 * abre}`} stroke="#9a4f3f" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6" />
        </g>
      </g>
    </svg>
  );
};
