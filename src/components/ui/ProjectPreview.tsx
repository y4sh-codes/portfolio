import type { ProjectVisual } from "@/data/projects";

function LoptVisual() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0a0c10]">
      <div
        className="absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.16) 1px, transparent 1px)",
          backgroundSize: "34px 34px",
        }}
      />
      <svg
        viewBox="0 0 500 360"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <defs>
          <clipPath id="lopt-face">
            <path d="M250 58c-42 0-68 34-68 82 0 36 16 64 42 80v24c0 11 11 19 26 19s26-8 26-19v-24c26-16 42-44 42-80 0-48-26-82-68-82Z" />
          </clipPath>
          <radialGradient id="lopt-glow" cx="50%" cy="42%" r="52%">
            <stop offset="0%" stopColor="#8AB4F8" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#8AB4F8" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="500" height="360" fill="url(#lopt-glow)" />
        <g clipPath="url(#lopt-face)" stroke="#8AB4F8" strokeOpacity="0.4" strokeWidth="0.7">
          {Array.from({ length: 14 }).map((_, i) => (
            <line key={`v-${i}`} x1={182 + i * 10} y1="50" x2={182 + i * 10} y2="270" />
          ))}
          {Array.from({ length: 16 }).map((_, i) => (
            <line key={`h-${i}`} x1="170" y1={58 + i * 14} x2="330" y2={58 + i * 14} />
          ))}
        </g>
        <path
          d="M250 58c-42 0-68 34-68 82 0 36 16 64 42 80v24c0 11 11 19 26 19s26-8 26-19v-24c26-16 42-44 42-80 0-48-26-82-68-82Z"
          fill="none"
          stroke="#DCE7F5"
          strokeOpacity="0.8"
          strokeWidth="1.2"
        />
        <g fill="none" stroke="#DCE7F5" strokeOpacity="0.72" strokeWidth="1.1">
          <path d="M196 132c16-10 34-14 54-14s38 4 54 14" />
          <path d="M202 132h34v24h-34zM264 132h34v24h-34z" />
          <path d="M236 132h28" />
          <path d="M250 156v30" />
          <path d="M230 206c12 8 28 8 40 0" />
        </g>
        <g fill="#F5F5F5" fillOpacity="0.7">
          {[
            [208, 144],
            [218, 146],
            [282, 144],
            [292, 146],
            [250, 172],
            [240, 198],
            [260, 198],
            [214, 232],
            [286, 232],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="1.6" />
          ))}
        </g>
      </svg>
      <div className="absolute inset-x-0 top-0 h-px animate-scan bg-gradient-to-r from-transparent via-accent/80 to-transparent shadow-[0_0_18px_rgba(138,180,248,0.7)]" />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
        <div>
          <p className="text-[0.55rem] uppercase tracking-label text-accent">Virtus / Scarlet</p>
          <p className="mt-1 text-[0.6rem] uppercase tracking-wide text-muted">Real 0.982</p>
        </div>
        <div className="text-right">
          <p className="text-[0.55rem] uppercase tracking-label text-muted">Fake</p>
          <p className="mt-1 text-[0.6rem] uppercase tracking-wide text-paper">0.018</p>
        </div>
      </div>
    </div>
  );
}

function Context0Visual() {
  const nodes = [
    [90, 90],
    [250, 54],
    [410, 96],
    [130, 220],
    [250, 180],
    [370, 240],
    [70, 300],
    [430, 320],
  ];
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#090b0e]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(138,180,248,0.13),transparent_55%)]" />
      <svg
        viewBox="0 0 500 360"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <g stroke="#8AB4F8" strokeOpacity="0.22" strokeWidth="0.7">
          {nodes.map(([x, y], i) =>
            nodes.slice(i + 1).map(([x2, y2], j) => {
              const distance = Math.hypot(x - x2, y - y2);
              if (distance > 190) return null;
              return (
                <line
                  key={`${i}-${j}`}
                  x1={x}
                  y1={y}
                  x2={x2}
                  y2={y2}
                  strokeDasharray="2 6"
                  className="animate-dash"
                />
              );
            }),
          )}
        </g>
        <g fill="none" stroke="#8AB4F8" strokeOpacity="0.3">
          <circle cx="250" cy="180" r="52" />
          <circle cx="250" cy="180" r="84" strokeDasharray="2 8" />
          <circle cx="250" cy="180" r="118" strokeOpacity="0.14" />
        </g>
        <g>
          {nodes.map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="7" fill="#08090B" stroke="#8AB4F8" strokeOpacity="0.6" />
              <circle cx={x} cy={y} r="2" fill={i === 4 ? "#8AB4F8" : "#F5F5F5"} />
            </g>
          ))}
        </g>
        <g transform="translate(250 180)">
          <rect x="-18" y="-18" width="36" height="36" fill="#08090B" stroke="#DCE7F5" strokeOpacity="0.65" />
          <text x="0" y="5" textAnchor="middle" fill="#F5F5F5" fontSize="12" fontFamily="var(--font-montserrat)">
            0
          </text>
        </g>
      </svg>
      <div className="absolute inset-x-0 top-0 flex items-start justify-between p-5">
        <div>
          <p className="text-[0.55rem] uppercase tracking-label text-accent">EizenDB</p>
          <p className="mt-1 text-[0.6rem] uppercase tracking-wide text-muted">HNSW / Arweave</p>
        </div>
        <p className="text-[0.55rem] uppercase tracking-label text-muted">MCP</p>
      </div>
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
        <p className="text-[0.6rem] uppercase tracking-wide text-muted">Memory layer / 01</p>
        <p className="text-[0.55rem] uppercase tracking-label text-accent">Decentralised</p>
      </div>
    </div>
  );
}

function AtlasVisual() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#090b0e]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(138,180,248,0.12),transparent_52%)]" />
      <svg
        viewBox="0 0 500 360"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <g fill="none" stroke="#8AB4F8" strokeOpacity="0.3" strokeWidth="0.8">
          <path d="M-20 250c70-34 120 18 190-12s120-72 190-30 100 40 160 16" />
          <path d="M-20 278c70-34 120 18 190-12s120-72 190-30 100 40 160 16" strokeOpacity="0.18" />
          <path d="M-20 306c70-34 120 18 190-12s120-72 190-30 100 40 160 16" strokeOpacity="0.12" />
          <path d="M-20 222c70-34 120 18 190-12s120-72 190-30 100 40 160 16" strokeOpacity="0.18" />
          <path d="M-20 194c70-34 120 18 190-12s120-72 190-30 100 40 160 16" strokeOpacity="0.1" />
        </g>
        <g transform="translate(360 130)" fill="none" stroke="#DCE7F5" strokeOpacity="0.5">
          <circle r="62" />
          <ellipse rx="62" ry="22" />
          <ellipse rx="26" ry="62" />
          <ellipse rx="48" ry="62" strokeOpacity="0.2" />
          <line x1="-62" y1="0" x2="62" y2="0" strokeOpacity="0.25" />
        </g>
        <g fill="#8AB4F8">
          <circle cx="142" cy="176" r="2.5" />
          <circle cx="188" cy="214" r="1.8" />
          <circle cx="250" cy="188" r="2.2" />
          <circle cx="306" cy="236" r="1.8" />
          <circle cx="382" cy="202" r="2.4" />
        </g>
        <path
          d="M60 320c80-26 150-26 230-12s120 12 160-4"
          fill="none"
          stroke="#8AB4F8"
          strokeOpacity="0.7"
          strokeDasharray="3 9"
          className="animate-dash"
        />
      </svg>
      <div className="absolute inset-x-0 top-0 flex items-start justify-between p-5">
        <div>
          <p className="text-[0.55rem] uppercase tracking-label text-accent">Argo / INCOIS</p>
          <p className="mt-1 text-[0.6rem] uppercase tracking-wide text-muted">Ocean intelligence</p>
        </div>
        <p className="text-[0.55rem] uppercase tracking-label text-muted">SIH</p>
      </div>
      <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
        <div className="flex items-end gap-1.5">
          {[22, 34, 18, 42, 28, 50, 30, 38, 24].map((height, i) => (
            <span
              key={i}
              className="w-1 bg-accent/60"
              style={{ height, opacity: 0.25 + i * 0.06 }}
            />
          ))}
        </div>
        <p className="text-[0.55rem] uppercase tracking-label text-muted">18.4°N / 87.2°E</p>
      </div>
    </div>
  );
}

function ChimeraVisual() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0a0a0c]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(138,180,248,0.1),transparent_58%)]" />
      <svg
        viewBox="0 0 500 360"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <g fill="none" stroke="#8AB4F8" strokeOpacity="0.34" strokeWidth="0.9">
          {Array.from({ length: 11 }).map((_, i) => {
            const y = 40 + i * 28;
            return (
              <path
                key={i}
                d={`M-20 ${y} C 80 ${y - 52 + i * 2}, 140 ${y + 58}, 240 ${y - 6} S 390 ${y + 40}, 520 ${y - 20}`}
                strokeOpacity={0.1 + i * 0.025}
              />
            );
          })}
        </g>
        <g transform="translate(250 178)">
          <ellipse rx="72" ry="108" fill="none" stroke="#DCE7F5" strokeOpacity="0.55" transform="rotate(-22)" />
          <ellipse rx="72" ry="108" fill="none" stroke="#8AB4F8" strokeOpacity="0.55" transform="rotate(22)" />
          <path d="M0-112v224" stroke="#F5F5F5" strokeOpacity="0.18" strokeDasharray="2 7" />
          <circle r="5" fill="#8AB4F8" />
        </g>
        <g fill="#F5F5F5" fillOpacity="0.55">
          {[
            [96, 78],
            [128, 282],
            [392, 86],
            [410, 278],
            [74, 184],
            [430, 190],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="1.4" />
          ))}
        </g>
      </svg>
      <div className="absolute inset-x-0 top-0 flex items-start justify-between p-5">
        <div>
          <p className="text-[0.55rem] uppercase tracking-label text-accent">Flow-Anchor</p>
          <p className="mt-1 text-[0.6rem] uppercase tracking-wide text-muted">Clean-label backdoor</p>
        </div>
        <p className="text-[0.55rem] uppercase tracking-label text-muted">DiT / 03</p>
      </div>
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
        <p className="text-[0.6rem] uppercase tracking-wide text-muted">FLUX.1 / SD3</p>
        <p className="text-[0.55rem] uppercase tracking-label text-accent">Research</p>
      </div>
    </div>
  );
}

export default function ProjectPreview({
  variant,
}: {
  variant: ProjectVisual;
}) {
  return (
    <div className="pointer-events-none absolute inset-0 transition-transform duration-[1.4s] ease-cinematic group-hover:scale-[1.035]">
      {variant === "lopt" && <LoptVisual />}
      {variant === "context0" && <Context0Visual />}
      {variant === "atlas" && <AtlasVisual />}
      {variant === "chimera" && <ChimeraVisual />}
      <div className="absolute inset-0 bg-gradient-to-t from-[#08090B] via-transparent to-transparent opacity-60" />
    </div>
  );
}
