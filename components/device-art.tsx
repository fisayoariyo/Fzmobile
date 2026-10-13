import type { ArtKind } from "@/lib/types";

export function DeviceArt({
  kind,
  color,
  className,
}: {
  kind: ArtKind;
  color: string;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 400 400" className={className} aria-hidden="true">
      <ellipse cx="200" cy="352" rx="92" ry="10" fill="#000" opacity="0.06" />
      {kind === "phone" && <Phone color={color} />}
      {kind === "laptop" && <Laptop color={color} />}
      {kind === "tablet" && <Tablet color={color} />}
      {kind === "console" && <Console color={color} />}
      {kind === "deck" && <Deck color={color} />}
      {kind === "headphones" && <Headphones color={color} />}
      {kind === "mic" && <Mic color={color} />}
      {kind === "camera" && <Camera color={color} />}
      {kind === "power" && <Power color={color} />}
      {(kind === "glasses" || kind === "speaker" || kind === "accessory") && (
        <Accessory color={color} kind={kind} />
      )}
    </svg>
  );
}

function Phone({ color }: { color: string }) {
  return (
    <g>
      <rect x="124" y="42" width="152" height="308" rx="32" fill={color} stroke="#000" strokeOpacity="0.14" />
      <rect x="134" y="54" width="132" height="284" rx="24" fill="#121316" />
      <rect x="170" y="66" width="60" height="16" rx="8" fill="#2A2C31" />
    </g>
  );
}

function Tablet({ color }: { color: string }) {
  return (
    <g>
      <rect x="78" y="64" width="244" height="272" rx="28" fill={color} stroke="#000" strokeOpacity="0.14" />
      <rect x="92" y="80" width="216" height="240" rx="16" fill="#121316" />
      <circle cx="200" cy="308" r="5" fill="#3A3C42" />
    </g>
  );
}

function Laptop({ color }: { color: string }) {
  return (
    <g>
      <rect x="78" y="78" width="244" height="162" rx="12" fill={color} stroke="#000" strokeOpacity="0.14" />
      <rect x="92" y="92" width="216" height="134" rx="6" fill="#15171c" />
      <path d="M52 250h296l-22 22H74z" fill="#d7d7d7" stroke="#000" strokeOpacity="0.08" />
      <rect x="168" y="250" width="64" height="6" rx="2" fill="#bdbdbd" />
    </g>
  );
}

function Console({ color }: { color: string }) {
  return (
    <g>
      <path d="M150 70h28c18 0 28 16 28 36v168c0 18-8 28-22 28h-34V70z" fill={color} stroke="#000" strokeOpacity="0.12" />
      <path d="M250 70h-28c-18 0-28 16-28 36v168c0 18 8 28 22 28h34V70z" fill="#111" />
      <rect x="168" y="118" width="18" height="92" rx="4" fill="#111" opacity="0.35" />
    </g>
  );
}

function Deck({ color }: { color: string }) {
  return (
    <g>
      <rect x="46" y="118" width="308" height="164" rx="28" fill={color} stroke="#000" strokeOpacity="0.16" />
      <rect x="118" y="140" width="164" height="120" rx="8" fill="#101114" />
      <circle cx="86" cy="200" r="22" fill="#2C2C2C" stroke="#fff" strokeOpacity="0.25" />
      <circle cx="314" cy="176" r="10" fill="#3A3A3A" />
      <circle cx="314" cy="214" r="10" fill="#3A3A3A" />
    </g>
  );
}

function Headphones({ color }: { color: string }) {
  return (
    <g>
      <path
        d="M92 196v-16c0-62 48-110 108-110s108 48 108 110v16"
        fill="none"
        stroke="#111"
        strokeWidth="16"
        strokeLinecap="round"
      />
      <rect x="68" y="176" width="48" height="92" rx="18" fill={color} stroke="#000" strokeOpacity="0.16" />
      <rect x="284" y="176" width="48" height="92" rx="18" fill={color} stroke="#000" strokeOpacity="0.16" />
    </g>
  );
}

function Mic({ color }: { color: string }) {
  return (
    <g>
      <rect x="156" y="70" width="88" height="150" rx="44" fill={color} stroke="#000" strokeOpacity="0.16" />
      <path d="M132 168c0 46 30 78 68 78s68-32 68-78" fill="none" stroke="#111" strokeWidth="10" />
      <rect x="190" y="246" width="20" height="46" fill="#111" />
      <rect x="158" y="286" width="84" height="12" rx="4" fill="#111" />
    </g>
  );
}

function Camera({ color }: { color: string }) {
  return (
    <g>
      <rect x="70" y="120" width="260" height="170" rx="18" fill={color} stroke="#000" strokeOpacity="0.16" />
      <rect x="150" y="96" width="90" height="28" rx="6" fill={color} />
      <circle cx="200" cy="206" r="52" fill="#1a1c20" stroke="#c8c8c8" strokeWidth="8" />
      <circle cx="200" cy="206" r="24" fill="#3a78b4" opacity="0.85" />
    </g>
  );
}

function Power({ color }: { color: string }) {
  return (
    <g>
      <rect x="96" y="110" width="208" height="180" rx="22" fill={color} stroke="#000" strokeOpacity="0.16" />
      <rect x="168" y="86" width="64" height="28" rx="8" fill="#2A2A2A" />
      <rect x="122" y="142" width="96" height="58" rx="8" fill="#14382d" />
      <rect x="136" y="158" width="48" height="8" rx="2" fill="#4BB8FC" />
      <circle cx="250" cy="230" r="16" fill="#111" />
    </g>
  );
}

function Accessory({ color, kind }: { color: string; kind: ArtKind }) {
  if (kind === "glasses") {
    return (
      <g>
        <rect x="70" y="160" width="100" height="55" rx="18" fill={color} stroke="#000" strokeOpacity="0.2" />
        <rect x="230" y="160" width="100" height="55" rx="18" fill={color} stroke="#000" strokeOpacity="0.2" />
        <path d="M170 180h60" stroke="#111" strokeWidth="10" strokeLinecap="round" />
      </g>
    );
  }
  if (kind === "speaker") {
    return (
      <g>
        <rect x="120" y="90" width="160" height="220" rx="28" fill={color} stroke="#000" strokeOpacity="0.16" />
        <circle cx="200" cy="180" r="42" fill="#111" opacity="0.35" />
        <circle cx="200" cy="260" r="28" fill="#111" opacity="0.25" />
      </g>
    );
  }
  return (
    <g>
      <rect x="140" y="110" width="120" height="180" rx="24" fill={color} stroke="#000" strokeOpacity="0.16" />
      <rect x="160" y="140" width="80" height="24" rx="8" fill="#111" opacity="0.2" />
    </g>
  );
}

