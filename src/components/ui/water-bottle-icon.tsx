export function WaterBottleIcon({ status, className }: { status: "FULL" | "EMPTY", className?: string }) {
  const isFull = status === "FULL";
  return (
    <svg 
      viewBox="0 0 100 140" 
      className={className} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Cap */}
      <rect x="40" y="2" width="20" height="12" rx="2" fill={isFull ? "#0284c7" : "#94a3b8"} />
      <rect x="38" y="10" width="24" height="4" rx="1" fill={isFull ? "#0369a1" : "#64748b"} />
      
      {/* Neck */}
      <path d="M42 14 L42 24 C42 24, 30 28, 26 40" stroke={isFull ? "#38bdf8" : "#cbd5e1"} strokeWidth="2" fill="none" />
      <path d="M58 14 L58 24 C58 24, 70 28, 74 40" stroke={isFull ? "#38bdf8" : "#cbd5e1"} strokeWidth="2" fill="none" />
      
      {/* Main Body - Outer Shell */}
      <path 
        d="M26 40 C22 50, 20 60, 20 70 L20 120 C20 132, 30 138, 50 138 C70 138, 80 132, 80 120 L80 70 C80 60, 78 50, 74 40 Z" 
        fill={isFull ? "#e0f2fe" : "#f1f5f9"} 
        stroke={isFull ? "#7dd3fc" : "#e2e8f0"} 
        strokeWidth="2"
      />

      {/* Water Fill */}
      {isFull && (
        <path 
          d="M22 65 Q 50 75 78 65 L78 120 C78 130, 68 136, 50 136 C32 136, 22 130, 22 120 Z" 
          fill="#38bdf8" 
          opacity="0.8"
        />
      )}
      
      {/* Ribs (The horizontal rings on 5-gallon bottles) */}
      <path d="M22 60 Q 50 70 78 60" stroke={isFull ? "#0284c7" : "#cbd5e1"} strokeWidth="2" opacity="0.3" fill="none" />
      <path d="M21 80 Q 50 90 79 80" stroke={isFull ? "#0284c7" : "#cbd5e1"} strokeWidth="2" opacity="0.3" fill="none" />
      <path d="M21 100 Q 50 110 79 100" stroke={isFull ? "#0284c7" : "#cbd5e1"} strokeWidth="2" opacity="0.3" fill="none" />

      {/* Highlights for 3D glass effect */}
      <path 
        d="M28 45 L28 115" 
        stroke="white" 
        strokeWidth="3" 
        strokeLinecap="round" 
        opacity="0.6" 
      />
      <path 
        d="M34 50 L34 110" 
        stroke="white" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        opacity="0.4" 
      />
    </svg>
  );
}
