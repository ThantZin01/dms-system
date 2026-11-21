"use client";

import { RefreshCw, CheckCircle2, Users } from "lucide-react";

export function DormitoryHeroVisual() {
  return (
    <div
      className="relative w-full max-w-[520px] h-[220px] xl:h-[246px] select-none"
      aria-hidden="true"
    >
      {/* Ambient Soft Radial Glow Behind Dormitory */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-40 w-56 rounded-full bg-[#2D7DD2]/22 blur-3xl pointer-events-none" />
      <div className="absolute left-[48%] top-[60%] -translate-x-1/2 -translate-y-1/2 h-24 w-40 rounded-full bg-[#2CA548]/22 blur-2xl pointer-events-none" />

      {/* Central Dormitory Architecture & Animated Signal Lines */}
      <svg
        viewBox="0 0 520 240"
        fill="none"
        className="absolute inset-0 h-full w-full pointer-events-none"
      >
        <defs>
          <linearGradient id="line-sky" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.15" />
            <stop offset="50%" stopColor="#60A5FA" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#6EE787" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="line-emerald" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6EE787" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#4ADE80" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.15" />
          </linearGradient>
          <linearGradient id="dorm-tower" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#14457E" />
            <stop offset="100%" stopColor="#071F3D" />
          </linearGradient>
          <linearGradient id="dorm-wing" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0E3666" />
            <stop offset="100%" stopColor="#05172E" />
          </linearGradient>
          <linearGradient id="swoosh-green" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#146B26" />
            <stop offset="55%" stopColor="#4ADE80" />
            <stop offset="100%" stopColor="#38BDF8" />
          </linearGradient>
        </defs>

        {/* Animated dashed signal paths connecting dormitory objects to the building */}
        <path
          d="M 134 62 Q 186 68 214 94"
          stroke="url(#line-sky)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          className="animate-dorm-dash"
        />
        <path
          d="M 386 58 Q 336 66 306 94"
          stroke="url(#line-emerald)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          className="animate-dorm-dash"
        />
        <path
          d="M 140 182 Q 174 178 194 162"
          stroke="url(#line-emerald)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          className="animate-dorm-dash"
        />
        <path
          d="M 382 182 Q 346 178 326 162"
          stroke="url(#line-sky)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          className="animate-dorm-dash"
        />

        {/* Ground Platform & Brand Swoosh Arc */}
        <ellipse
          cx="260"
          cy="198"
          rx="96"
          ry="14"
          fill="#041226"
          fillOpacity="0.8"
          stroke="#6EE787"
          strokeOpacity="0.22"
          strokeWidth="1"
        />
        <path
          d="M 176 192 Q 260 218 344 190"
          stroke="url(#swoosh-green)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeOpacity="0.78"
        />

        {/* LEFT WING */}
        <g>
          <rect
            x="190"
            y="106"
            width="38"
            height="88"
            rx="5"
            fill="url(#dorm-wing)"
            stroke="rgba(148,163,184,0.22)"
            strokeWidth="1"
          />
          <rect x="198" y="118" width="9" height="11" rx="2" fill="#6EE787" className="animate-dorm-window" style={{ animationDelay: "0s" }} />
          <rect x="211" y="118" width="9" height="11" rx="2" fill="#7BB8F7" className="animate-dorm-window" style={{ animationDelay: "1.1s" }} />
          <rect x="198" y="137" width="9" height="11" rx="2" fill="#FDE68A" className="animate-dorm-window" style={{ animationDelay: "2.2s" }} />
          <rect x="211" y="137" width="9" height="11" rx="2" fill="#6EE787" className="animate-dorm-window" style={{ animationDelay: "0.6s" }} />
          <rect x="198" y="156" width="9" height="11" rx="2" fill="#7BB8F7" className="animate-dorm-window" style={{ animationDelay: "1.7s" }} />
          <rect x="211" y="156" width="9" height="11" rx="2" fill="#FDE68A" className="animate-dorm-window" style={{ animationDelay: "2.8s" }} />
        </g>

        {/* RIGHT WING */}
        <g>
          <rect
            x="292"
            y="112"
            width="38"
            height="82"
            rx="5"
            fill="url(#dorm-wing)"
            stroke="rgba(148,163,184,0.22)"
            strokeWidth="1"
          />
          <rect x="300" y="124" width="9" height="11" rx="2" fill="#7BB8F7" className="animate-dorm-window" style={{ animationDelay: "0.9s" }} />
          <rect x="313" y="124" width="9" height="11" rx="2" fill="#6EE787" className="animate-dorm-window" style={{ animationDelay: "2.0s" }} />
          <rect x="300" y="143" width="9" height="11" rx="2" fill="#6EE787" className="animate-dorm-window" style={{ animationDelay: "1.5s" }} />
          <rect x="313" y="143" width="9" height="11" rx="2" fill="#FDE68A" className="animate-dorm-window" style={{ animationDelay: "0.3s" }} />
          <rect x="300" y="162" width="9" height="11" rx="2" fill="#FDE68A" className="animate-dorm-window" style={{ animationDelay: "2.5s" }} />
          <rect x="313" y="162" width="9" height="11" rx="2" fill="#7BB8F7" className="animate-dorm-window" style={{ animationDelay: "1.3s" }} />
        </g>

        {/* CENTER MAIN DORMITORY TOWER */}
        <g>
          <path
            d="M 224 74 L 260 54 L 296 74 Z"
            fill="#174E8C"
            stroke="rgba(110,231,135,0.4)"
            strokeWidth="1"
          />
          <rect
            x="224"
            y="74"
            width="72"
            height="120"
            rx="6"
            fill="url(#dorm-tower)"
            stroke="rgba(148,163,184,0.32)"
            strokeWidth="1.2"
          />

          {/* Main Tower Animated Room Windows */}
          {[
            { x: 234, y: 86, fill: "#6EE787", delay: "0.2s" },
            { x: 254, y: 86, fill: "#FDE68A", delay: "1.4s" },
            { x: 274, y: 86, fill: "#7BB8F7", delay: "2.6s" },
            { x: 234, y: 108, fill: "#7BB8F7", delay: "1.9s" },
            { x: 254, y: 108, fill: "#6EE787", delay: "0.5s" },
            { x: 274, y: 108, fill: "#FDE68A", delay: "1.1s" },
            { x: 234, y: 130, fill: "#FDE68A", delay: "0.8s" },
            { x: 254, y: 130, fill: "#7BB8F7", delay: "2.3s" },
            { x: 274, y: 130, fill: "#6EE787", delay: "1.6s" },
          ].map((win, idx) => (
            <rect
              key={idx}
              x={win.x}
              y={win.y}
              width="11"
              height="13"
              rx="2.5"
              fill={win.fill}
              className="animate-dorm-window"
              style={{ animationDelay: win.delay }}
            />
          ))}

          {/* Ground-Floor Dorm Emblem Arch + Bed Silhouette */}
          <path
            d="M 239 194 L 239 162 Q 260 151 281 162 L 281 194 Z"
            fill="#04152B"
            stroke="rgba(110,231,135,0.4)"
            strokeWidth="1"
          />
          {/* Minimal Bed Mark echoing dorm-mark.png */}
          <g fill="#E2E8F0">
            <rect x="247" y="170" width="2.5" height="14" rx="1" />
            <rect x="270.5" y="174" width="2.5" height="10" rx="1" />
            <rect x="247" y="178" width="26" height="2.8" rx="1" />
            <circle cx="253.5" cy="174.5" r="2.2" fill="#6EE787" />
            <rect x="257" y="173.5" width="12.5" height="3.8" rx="1.8" fill="#7BB8F7" />
          </g>
        </g>
      </svg>

      {/* FLOATING OBJECT 1: Animated Drinking Water Bottle Stock */}
      <div className="animate-dorm-float-a absolute left-0 top-4 rounded-2xl border border-white/15 bg-[#082244]/90 backdrop-blur-md px-2.5 py-2 xl:px-3 xl:py-2.5 shadow-lg flex items-center gap-2">
        <div className="relative flex h-8 w-8 xl:h-9 xl:w-9 shrink-0 items-center justify-center rounded-xl bg-sky-500/15 border border-sky-400/25 overflow-hidden">
          <svg viewBox="0 0 32 36" className="h-6 w-6 xl:h-7 xl:w-7" fill="none">
            <defs>
              <clipPath id="bottle-clip">
                <rect x="7" y="10" width="18" height="22" rx="4" />
              </clipPath>
            </defs>
            <rect x="12" y="3" width="8" height="4" rx="1.5" fill="#7BB8F7" />
            <rect x="13" y="7" width="6" height="3" fill="#38BDF8" fillOpacity="0.6" />
            <rect
              x="7"
              y="10"
              width="18"
              height="22"
              rx="4"
              stroke="#7BB8F7"
              strokeWidth="1.5"
              fill="#071C36"
            />
            <g clipPath="url(#bottle-clip)">
              <path
                d="M 2 20 Q 10 17 18 20 T 34 20 T 50 20 L 50 34 L 2 34 Z"
                fill="#38BDF8"
                fillOpacity="0.82"
                className="animate-dorm-wave"
              />
            </g>
          </svg>
        </div>
        <div className="leading-tight pr-0.5">
          <p className="text-[11px] font-bold text-white">Water Stock</p>
          <p className="text-[10px] font-medium text-sky-300 mt-0.5">
            Bottles Ready
          </p>
        </div>
      </div>

      {/* FLOATING OBJECT 2: Animated Garbage Duty Rotation */}
      <div className="animate-dorm-float-b absolute right-0 top-3 rounded-2xl border border-white/15 bg-[#082244]/90 backdrop-blur-md px-2.5 py-2 xl:px-3 xl:py-2.5 shadow-lg flex items-center gap-2">
        <div className="relative flex h-8 w-8 xl:h-9 xl:w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-400/25">
          <RefreshCw className="h-4 w-4 text-[#6EE787] animate-dorm-spin" />
        </div>
        <div className="leading-tight pr-0.5">
          <p className="text-[11px] font-bold text-white">Duty Rotation</p>
          <p className="text-[10px] font-medium text-[#6EE787] mt-0.5">
            Fair Queue
          </p>
        </div>
      </div>

      {/* FLOATING OBJECT 3: Animated Shared Ledger & Fees */}
      <div className="animate-dorm-float-c absolute right-0 bottom-3 rounded-2xl border border-white/15 bg-[#082244]/90 backdrop-blur-md px-2.5 py-2 xl:px-3 xl:py-2.5 shadow-lg flex items-center gap-2">
        <div className="flex h-8 w-8 xl:h-9 xl:w-9 shrink-0 items-end justify-center gap-[3px] rounded-xl bg-white/[0.06] border border-white/10 px-1.5 pb-1.5 pt-2">
          <span
            className="w-1.5 h-3 rounded-sm bg-sky-400 animate-dorm-bar"
            style={{ animationDelay: "0s" }}
          />
          <span
            className="w-1.5 h-4.5 rounded-sm bg-[#4ADE80] animate-dorm-bar"
            style={{ animationDelay: "0.7s" }}
          />
          <span
            className="w-1.5 h-3.5 rounded-sm bg-sky-300 animate-dorm-bar"
            style={{ animationDelay: "1.4s" }}
          />
        </div>
        <div className="leading-tight pr-0.5">
          <p className="text-[11px] font-bold text-white flex items-center gap-1">
            Shared Ledger
            <CheckCircle2 className="h-3 w-3 text-[#6EE787]" />
          </p>
          <p className="text-[10px] font-medium text-slate-300 mt-0.5">
            Fees & Splits
          </p>
        </div>
      </div>

      {/* FLOATING OBJECT 4: Active Rooms Pill */}
      <div className="animate-dorm-float-b absolute left-1 bottom-4 rounded-xl border border-white/15 bg-[#082244]/90 backdrop-blur-md px-2.5 py-2 shadow-lg flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#6EE787]/15 text-[#6EE787]">
          <Users className="h-3.5 w-3.5" />
        </span>
        <span className="text-[11px] font-semibold text-slate-100">
          Active Rooms
        </span>
        <span className="h-2 w-2 rounded-full bg-[#4ADE80] animate-pulse" />
      </div>
    </div>
  );
}
