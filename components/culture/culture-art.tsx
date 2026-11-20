import React from 'react'

export function KohbarMotifSvg({ className = '', style = {} }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ maxWidth: '100%', height: 'auto', ...style }}
      aria-label="Traditional Mithila Kohbar Nuptial Motif"
      role="img"
    >
      <rect width="400" height="400" rx="16" fill="#FDFBF7" />
      {/* Decorative double border */}
      <rect x="12" y="12" width="376" height="376" rx="10" stroke="#8C2D19" strokeWidth="3" fill="none" />
      <rect x="20" y="20" width="360" height="360" rx="8" stroke="#D4AF37" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />

      {/* Corner Aripan Flourishes */}
      <g stroke="#8C2D19" strokeWidth="1.5" fill="none">
        <path d="M 24 60 C 45 45, 45 45, 60 24" />
        <path d="M 376 60 C 355 45, 355 45, 340 24" />
        <path d="M 24 340 C 45 355, 45 355, 60 376" />
        <path d="M 376 340 C 355 355, 355 355, 340 376" />
      </g>

      {/* Central Sacred Sun (Surya) & Lotus (Purain) */}
      <circle cx="200" cy="200" r="70" fill="#F5F0E6" stroke="#8C2D19" strokeWidth="2.5" />
      <circle cx="200" cy="200" r="58" stroke="#D4AF37" strokeWidth="1.5" strokeDasharray="3 3" />

      {/* Lotus Petals */}
      <g fill="#A65D3F" fillOpacity="0.25" stroke="#8C2D19" strokeWidth="1.5">
        <path d="M 200 130 C 185 160, 215 160, 200 130 Z" />
        <path d="M 200 270 C 185 240, 215 240, 200 270 Z" />
        <path d="M 130 200 C 160 185, 160 215, 130 200 Z" />
        <path d="M 270 200 C 240 185, 240 215, 270 200 Z" />
        <path d="M 150 150 C 175 165, 165 175, 150 150 Z" />
        <path d="M 250 150 C 225 165, 235 175, 250 150 Z" />
        <path d="M 150 250 C 175 235, 165 225, 150 250 Z" />
        <path d="M 250 250 C 225 235, 235 225, 250 250 Z" />
      </g>

      {/* Sun Ray Beams */}
      <g stroke="#8C2D19" strokeWidth="2">
        <line x1="200" y1="120" x2="200" y2="90" />
        <line x1="200" y1="280" x2="200" y2="310" />
        <line x1="120" y1="200" x2="90" y2="200" />
        <line x1="280" y1="200" x2="310" y2="200" />
        <line x1="145" y1="145" x2="120" y2="120" />
        <line x1="255" y1="145" x2="280" y2="120" />
        <line x1="145" y1="255" x2="120" y2="280" />
        <line x1="255" y1="255" x2="280" y2="280" />
      </g>

      {/* Traditional Double Fish (Macha) - Symbol of Prosperity */}
      <g stroke="#1A3328" strokeWidth="2" fill="#D3DFCF" fillOpacity="0.6">
        {/* Top-Right Fish */}
        <path d="M 275 80 Q 320 60 340 90 Q 315 120 275 80 Z" />
        <polygon points="340,90 355,80 355,100" fill="#1A3328" />
        <circle cx="290" cy="82" r="3" fill="#8C2D19" />

        {/* Bottom-Left Fish */}
        <path d="M 125 320 Q 80 340 60 310 Q 85 280 125 320 Z" />
        <polygon points="60,310 45,320 45,300" fill="#1A3328" />
        <circle cx="110" cy="318" r="3" fill="#8C2D19" />
      </g>

      {/* Traditional Bamboo Shoot (Bans) - Lineage & Endurance */}
      <g stroke="#1A3328" strokeWidth="2">
        <path d="M 65 140 Q 75 170 65 200 Q 75 230 65 260" />
        <line x1="60" y1="170" x2="70" y2="170" />
        <line x1="60" y1="230" x2="70" y2="230" />
        <path d="M 70 160 C 85 155 90 165 70 170" fill="#A9C0A2" />
        <path d="M 70 220 C 85 215 90 225 70 230" fill="#A9C0A2" />
      </g>

      {/* Center Bindu and Script */}
      <circle cx="200" cy="200" r="14" fill="#8C2D19" />
      <circle cx="200" cy="200" r="6" fill="#D4AF37" />
      <text
        x="200"
        y="360"
        textAnchor="middle"
        fill="#8C2D19"
        fontFamily="serif"
        fontSize="15"
        fontWeight="bold"
        letterSpacing="2"
      >
        कोहबर · मंगलम्
      </text>
    </svg>
  )
}

export function AripanMandalaSvg({ className = '', style = {} }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      viewBox="0 0 300 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ maxWidth: '100%', height: 'auto', ...style }}
      aria-label="Mithila Aripan Mandala"
      role="img"
    >
      <circle cx="150" cy="150" r="140" stroke="#8C2D19" strokeWidth="2" strokeDasharray="6 4" />
      <circle cx="150" cy="150" r="120" stroke="#D4AF37" strokeWidth="1.5" />
      <polygon points="150,40 235,198 65,198" stroke="#8C2D19" strokeWidth="2" fill="none" />
      <polygon points="150,260 65,102 235,102" stroke="#8C2D19" strokeWidth="2" fill="none" />
      <circle cx="150" cy="150" r="35" fill="#FAF6F0" stroke="#8C2D19" strokeWidth="2" />
      <circle cx="150" cy="150" r="12" fill="#D4AF37" />
      <g stroke="#8C2D19" strokeWidth="1">
        <line x1="150" y1="10" x2="150" y2="40" />
        <line x1="150" y1="260" x2="150" y2="290" />
        <line x1="10" y1="150" x2="40" y2="150" />
        <line x1="260" y1="150" x2="290" y2="150" />
      </g>
    </svg>
  )
}

export function PaagEmblemSvg({ className = '', style = {} }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: '48px', height: '48px', ...style }}
      aria-label="Maithil Paag Emblem"
      role="img"
    >
      <circle cx="60" cy="60" r="56" fill="#FBF8F2" stroke="#8C2D19" strokeWidth="2" />
      {/* Paag Headgear Shape */}
      <path
        d="M 30 74 C 30 50, 45 38, 60 38 C 75 38, 90 50, 90 74 C 75 80, 45 80, 30 74 Z"
        fill="#A65D3F"
        stroke="#8C2D19"
        strokeWidth="2"
      />
      {/* Paag Crown pleats */}
      <path d="M 40 54 Q 60 46 80 54" stroke="#D4AF37" strokeWidth="1.5" />
      <path d="M 45 64 Q 60 56 75 64" stroke="#D4AF37" strokeWidth="1.5" />
      {/* Red Tilak Dot */}
      <circle cx="60" cy="50" r="3" fill="#D9534F" />
    </svg>
  )
}
