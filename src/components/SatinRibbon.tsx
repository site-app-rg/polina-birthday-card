export function SatinRibbon({ className = '' }: { className?: string }) {
  return (
    <svg className={`satin-ribbon ${className}`} viewBox="0 0 250 145" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="satin-shine" x1="0" x2="0" y1="0" y2="1">
          <stop stopColor="#fff0d6" />
          <stop offset=".23" stopColor="#f7cbaa" />
          <stop offset=".51" stopColor="#c77453" />
          <stop offset=".72" stopColor="#f3bf99" />
          <stop offset="1" stopColor="#a44e38" />
        </linearGradient>
      </defs>
      <path d="M-16 108C24 47 49 139 94 92C135 50 123 13 164 24C196 32 187 98 233 46" stroke="#663b30" strokeOpacity=".25" strokeWidth="28" strokeLinecap="round" transform="translate(4 6)" />
      <path d="M-16 108C24 47 49 139 94 92C135 50 123 13 164 24C196 32 187 98 233 46" stroke="url(#satin-shine)" strokeWidth="29" strokeLinecap="round" />
      <path d="M-17 91L7 92L-5 108L8 126L-18 128L-8 108Z" fill="#d38763" />
      <path d="M222 36L249 31L239 47L250 63L222 59L231 46Z" fill="#b95f46" />
      <path d="M-10 99C24 39 48 131 91 85C134 43 122 6 163 17C196 25 184 92 228 39" stroke="#fff3dd" strokeOpacity=".7" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}
