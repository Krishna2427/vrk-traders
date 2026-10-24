import React, { useEffect, useState, useRef, useMemo, useCallback } from "react"
import { ArrowRight, Sparkles } from "lucide-react"
import "./CoconutLoader.css"

// Generate water particles with realistic fluid dynamics for vertical equatorial rupture
function generateParticles(count = 48) {
  const particles = []
  for (let i = 0; i < count; i++) {
    // 360-degree radial spread with upward fountain bias
    const angleRad = (i / count) * Math.PI * 2 + (Math.random() * 0.28 - 0.14)
    const distance = 95 + Math.random() * 160
    const tx = Math.cos(angleRad) * distance
    const ty = Math.sin(angleRad) * distance - (Math.random() * 40 + 15)
    const size = Math.floor(Math.random() * 9) + 6 // 6px to 15px
    const delay = Math.random() * 0.16
    const gravity = Math.random() * 50 + 30
    const duration = 1.05 + Math.random() * 0.45

    particles.push({
      id: i,
      tx: `${tx.toFixed(1)}px`,
      ty: `${ty.toFixed(1)}px`,
      size: `${size}px`,
      delay: `${delay.toFixed(3)}s`,
      duration: `${duration.toFixed(2)}s`,
      gravity: `${gravity.toFixed(1)}px`,
      isTeardrop: i % 3 === 0,
      opacity: 0.75 + Math.random() * 0.25,
    })
  }
  return particles
}

// Generate screen splatter droplets
function generateScreenDrops() {
  return [
    { id: 1, top: "25%", left: "28%", size: "26px", delay: "0.12s" },
    { id: 2, top: "32%", left: "72%", size: "32px", delay: "0.15s" },
    { id: 3, top: "62%", left: "22%", size: "22px", delay: "0.22s" },
    { id: 4, top: "66%", left: "76%", size: "28px", delay: "0.18s" },
    { id: 5, top: "20%", left: "50%", size: "20px", delay: "0.20s" },
    { id: 6, top: "45%", left: "14%", size: "24px", delay: "0.25s" },
    { id: 7, top: "48%", left: "85%", size: "22px", delay: "0.24s" },
    { id: 8, top: "76%", left: "48%", size: "30px", delay: "0.28s" },
  ]
}

// 360-degree radial & fountain spray angles for vertical crack
const WATER_JET_ANGLES = [
  -90, -75, -105, -60, -120, // Upward fountain geyser
  -40, -15, 0, 15, 40,        // Right lateral spread
  140, 165, 180, 195, 220,    // Left lateral spread
  75, 90, 105                 // Downward splash
]

export default function CoconutLoader({ onComplete }) {
  // Animation phases: 'drop' -> 'shudder' -> 'blast' -> 'settled'
  const [phase, setPhase] = useState("drop")
  const [progress, setProgress] = useState(20)
  const [statusText, setStatusText] = useState("Selecting fresh semi-husked coconuts...")
  const [isClosing, setIsClosing] = useState(false)
  const [animIteration] = useState(0)

  const particles = useMemo(() => generateParticles(48), [animIteration])
  const screenDrops = useMemo(() => generateScreenDrops(), [animIteration])
  const timersRef = useRef([])

  const onCompleteRef = useRef(onComplete)
  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  // Run the horizontal semi-husked coconut cracking sequence with vertical split
  const startSequence = useCallback(() => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []

    setIsClosing(false)
    setPhase("drop")
    setProgress(20)
    setStatusText("Harvesting premium semi-husked coconuts...")

    // 550ms: Tension & vertical fracture lightning along center equator
    const t1 = setTimeout(() => {
      setPhase("shudder")
      setProgress(60)
      setStatusText("Cracking along natural center seam...")
    }, 550)

    // 1000ms: THE VERTICAL BREAK & WATER BLAST!
    const t2 = setTimeout(() => {
      setPhase("blast")
      setProgress(100)
      setStatusText("Pure coconut water blast!")
    }, 1000)

    // 1950ms: Smoothly open the website
    const t3 = setTimeout(() => {
      setIsClosing(true)
      setTimeout(() => {
        if (onCompleteRef.current) onCompleteRef.current()
      }, 400)
    }, 1950)

    timersRef.current = [t1, t2, t3]
  }, [])

  useEffect(() => {
    startSequence()
    return () => timersRef.current.forEach(clearTimeout)
  }, [startSequence])

  const handleManualClose = () => {
    timersRef.current.forEach(clearTimeout)
    setIsClosing(true)
    setTimeout(() => {
      if (onCompleteRef.current) onCompleteRef.current()
    }, 300)
  }

  const isCracked = phase === "blast" || phase === "settled"

  return (
    <div
      id="coconut-loader-container"
      className={`coconut-loader-overlay ${isClosing ? "fade-out" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Horizontal Semi-Husked Coconut Break & Water Blast Loader"
    >
      <div className="coconut-loader-ambient" />
      <div className="coconut-loader-grid" />

      {/* Top action control */}
      <div className="loader-controls">
        <button
          type="button"
          id="loader-skip-btn"
          className="loader-ctrl-btn"
          onClick={handleManualClose}
          title="Skip to VRK Traders website"
        >
          <span>Enter site</span>
          <ArrowRight size={15} />
        </button>
      </div>

      {/* Center animation arena */}
      <div className="coconut-loader-stage">
        {/* Expanding liquid shockwaves */}
        <div className={`water-shockwave active-1 ${isCracked ? "" : "opacity-0"}`} />
        <div className={`water-shockwave active-2 ${isCracked ? "" : "opacity-0"}`} />
        <div className={`water-shockwave active-3 ${isCracked ? "" : "opacity-0"}`} />

        {/* Central impact flash */}
        <div className={`impact-flash ${isCracked ? "active" : ""}`} />

        {/* Central vertical water fountain / geyser surging from the vertical split */}
        <svg
          className={`water-fountain ${isCracked ? "active" : ""}`}
          viewBox="0 0 70 140"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M35 135 C20 100, 6 65, 8 35 C10 12, 28 2, 35 0 C42 2, 60 12, 62 35 C64 65, 50 100, 35 135 Z"
            fill="url(#fountainGrad)"
            opacity="0.92"
          />
          <path
            d="M35 125 C26 95, 18 60, 20 40 C22 22, 30 10, 35 8 C40 10, 48 22, 50 40 C52 60, 44 95, 35 125 Z"
            fill="#ffffff"
            opacity="0.85"
          />
          <circle cx="35" cy="18" r="7" fill="#ffffff" opacity="0.9" />
          <circle cx="28" cy="42" r="5" fill="#e0f2fe" opacity="0.8" />
          <circle cx="42" cy="46" r="4.5" fill="#e0f2fe" opacity="0.8" />
        </svg>

        {/* 360-Degree Radial Water Jet Streams from vertical seam */}
        <div className="water-blast-container" aria-hidden="true">
          {isCracked &&
            WATER_JET_ANGLES.map((angle, idx) => (
              <div
                key={`jet-${angle}-${animIteration}`}
                className="water-jet active"
                style={{
                  "--angle": `${angle}deg`,
                  "--distance": `${140 + (idx % 3) * 35}px`,
                  animationDelay: `${(idx % 4) * 0.025}s`,
                }}
              />
            ))}

          {/* Bursting Water Droplet Particles */}
          {isCracked &&
            particles.map((p) => (
              <div
                key={`drop-${p.id}-${animIteration}`}
                className="water-droplet active"
                style={{
                  "--tx": p.tx,
                  "--ty": p.ty,
                  "--gravity": p.gravity,
                  width: p.size,
                  height: p.size,
                  opacity: p.opacity,
                  animationDelay: p.delay,
                  animationDuration: p.duration,
                  borderRadius: p.isTeardrop ? "50% 50% 50% 0" : "50%",
                  transform: p.isTeardrop ? "rotate(-45deg)" : "none",
                }}
              />
            ))}
        </div>

        {/* Screen Splatter Water Droplets */}
        <div className="screen-splash-container" aria-hidden="true">
          {isCracked &&
            screenDrops.map((sd) => (
              <div
                key={`screen-${sd.id}-${animIteration}`}
                className="screen-drop active"
                style={{
                  top: sd.top,
                  left: sd.left,
                  width: sd.size,
                  height: sd.size,
                  animationDelay: sd.delay,
                }}
              />
            ))}
        </div>

        {/* THE HORIZONTAL SEMI-HUSKED COCONUT (Vertical Crack Down Middle) */}
        <div
          className={`coconut-svg-wrap ${
            phase === "drop"
              ? "coconut-drop-in"
              : phase === "shudder"
              ? "coconut-shudder"
              : ""
          } ${isCracked ? "coconut-split" : ""}`}
        >
          <svg
            viewBox="0 0 260 200"
            className="w-full h-full"
            style={{ overflow: "visible" }}
            aria-label="Horizontal semi-husked coconut with vertical crack"
          >
            <defs>
              {/* Fibrous husk tuft gradient (golden straw to amber coir fiber) */}
              <linearGradient id="huskTuftGrad" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" stopColor="#cf9a58" />
                <stop offset="35%" stopColor="#b67f40" />
                <stop offset="75%" stopColor="#8d5624" />
                <stop offset="100%" stopColor="#5a3111" />
              </linearGradient>

              {/* Left shell hemisphere radial gradient */}
              <radialGradient id="shellLeftGrad" cx="60%" cy="50%" r="65%" fx="65%" fy="45%">
                <stop offset="0%" stopColor="#7a4420" />
                <stop offset="45%" stopColor="#532910" />
                <stop offset="85%" stopColor="#351606" />
                <stop offset="100%" stopColor="#1e0b02" />
              </radialGradient>

              {/* Right shell hemisphere radial gradient */}
              <radialGradient id="shellRightGrad" cx="40%" cy="50%" r="68%" fx="35%" fy="45%">
                <stop offset="0%" stopColor="#78421e" />
                <stop offset="45%" stopColor="#50270e" />
                <stop offset="85%" stopColor="#331505" />
                <stop offset="100%" stopColor="#1c0a02" />
              </radialGradient>

              {/* White inner coconut meat (copra / kernel) layer */}
              <linearGradient id="meatGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="55%" stopColor="#fdfcf9" />
                <stop offset="85%" stopColor="#f3ede2" />
                <stop offset="100%" stopColor="#ded5c2" />
              </linearGradient>

              {/* Fresh coconut water pool surface in right shell bowl */}
              <radialGradient id="waterSurfaceGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                <stop offset="35%" stopColor="#bae6fd" stopOpacity="0.9" />
                <stop offset="75%" stopColor="#38bdf8" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0.35" />
              </radialGradient>

              {/* Water sheen reflection inside left shell cavity */}
              <radialGradient id="waterSheen" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.85" />
                <stop offset="60%" stopColor="#38bdf8" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#0369a1" stopOpacity="0.1" />
              </radialGradient>

              {/* Fountain geyser surge gradient */}
              <linearGradient id="fountainGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#0284c7" stopOpacity="0.3" />
                <stop offset="35%" stopColor="#38bdf8" stopOpacity="0.85" />
                <stop offset="85%" stopColor="#bae6fd" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
              </linearGradient>
            </defs>

            {/* ================= LEFT HALF (FIBROUS TUFT CROWN + LEFT SHELL) ================= */}
            <g className="shell-half-left">
              {/* Shell dome for left half with vertical jagged fracture edge */}
              <path
                d="M 130 30 
                   C 80 30, 30 65, 25 100 
                   C 30 135, 80 170, 130 170 
                   L 128 158 
                   L 133 144 
                   L 125 130 
                   L 134 114 
                   L 126 98 
                   L 133 80 
                   L 126 62 
                   L 132 46 
                   Z"
                fill="url(#shellLeftGrad)"
                stroke="#291205"
                strokeWidth="1.6"
              />

              {/* Shell longitudinal fiber ridges */}
              <path
                d="M 85 58 Q 105 52 128 48 
                   M 88 80 Q 108 78 126 76 
                   M 88 120 Q 108 122 126 124 
                   M 85 142 Q 105 148 128 152"
                stroke="#371c0b"
                strokeWidth="1.2"
                strokeDasharray="3 5"
                fill="none"
                opacity="0.6"
              />

              {/* Coconut Eyes (Germination pores) right next to the husk collar */}
              <g className="coconut-eyes">
                <ellipse cx="96" cy="85" rx="5.5" ry="6.5" fill="#1b0a02" stroke="#361706" strokeWidth="1" />
                <ellipse cx="97" cy="84" rx="2" ry="2.5" fill="#2d1205" opacity="0.6" />
                <ellipse cx="96" cy="115" rx="5.5" ry="6.5" fill="#1b0a02" stroke="#361706" strokeWidth="1" />
                <ellipse cx="97" cy="114" rx="2" ry="2.5" fill="#2d1205" opacity="0.6" />
                <ellipse cx="90" cy="100" rx="4.5" ry="5" fill="#180802" stroke="#361706" strokeWidth="1" />
              </g>

              {/* ================= SEMI-HUSK FIBROUS TUFT (COCONUT CROWN) ================= */}
              <g className="semi-husk-tuft">
                {/* Conical tuft body on the left apex */}
                <path
                  d="M 82 52 
                     C 58 56, 34 74, 25 100 
                     C 34 126, 58 144, 82 148 
                     C 86 134, 84 116, 87 100 
                     C 84 84, 86 66, 82 52 Z"
                  fill="url(#huskTuftGrad)"
                  stroke="#4e2a0f"
                  strokeWidth="1.4"
                />

                {/* Natural bristled fibers at the tip (pointing left) */}
                <path
                  d="M 24 96 L 16 94 
                     M 22 100 L 14 100 
                     M 24 104 L 16 106 
                     M 28 92 L 20 88 
                     M 28 108 L 20 112"
                  stroke="#d79e5a"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />

                {/* Fibrous coir strands flowing horizontally rightwards */}
                <path
                  d="M 25 98 Q 50 85 80 62 
                     M 25 102 Q 50 115 80 138 
                     M 28 96 Q 55 76 82 72 
                     M 28 104 Q 55 124 82 128 
                     M 25 100 L 85 100 
                     M 35 92 Q 58 86 84 82 
                     M 35 108 Q 58 114 84 118"
                  stroke="#d29957"
                  strokeWidth="1.3"
                  fill="none"
                  opacity="0.85"
                />
                <path
                  d="M 30 94 Q 52 82 78 66 
                     M 30 106 Q 52 118 78 134 
                     M 32 100 L 85 97 
                     M 32 101 L 85 103"
                  stroke="#6b3e15"
                  strokeWidth="1.2"
                  fill="none"
                  opacity="0.75"
                />

                {/* Trimmed collar fringe at x ≈ 82 */}
                <path
                  d="M 82 52 L 85 57 L 82 62 L 86 68 L 82 74 L 86 80 L 83 86 L 87 92 L 83 98 L 88 104 L 83 110 L 87 116 L 83 122 L 87 128 L 83 134 L 86 140 L 82 148"
                  stroke="#b47c3e"
                  strokeWidth="1.8"
                  fill="none"
                />
              </g>

              {/* Inner White Coconut Meat (Copra) layer shown when cracked */}
              {isCracked && (
                <path
                  d="M 130 30 L 132 46 L 126 62 L 133 80 L 126 98 L 134 114 L 125 130 L 133 144 L 128 158 L 130 170 
                     L 120 164 L 124 150 L 118 134 L 125 116 L 117 98 L 125 80 L 118 62 L 122 42 Z"
                  fill="url(#meatGrad)"
                  stroke="#ded8c8"
                  strokeWidth="1"
                />
              )}

              {/* Water sheen reflection inside left shell cavity */}
              {isCracked && (
                <ellipse
                  cx="115"
                  cy="100"
                  rx="10"
                  ry="45"
                  fill="url(#waterSheen)"
                  opacity="0.9"
                />
              )}
            </g>

            {/* ================= RIGHT HALF (ROUNDED HARD SHELL BASE) ================= */}
            <g className="shell-half-right">
              {/* Outer Shell Bowl with complementary vertical jagged crack edge */}
              <path
                d="M 130 30 
                   L 132 46 
                   L 126 62 
                   L 133 80 
                   L 126 98 
                   L 134 114 
                   L 125 130 
                   L 133 144 
                   L 128 158 
                   L 130 170 
                   C 180 170, 230 135, 235 100 
                   C 230 65, 180 30, 130 30 Z"
                fill="url(#shellRightGrad)"
                stroke="#291205"
                strokeWidth="1.6"
              />

              {/* Right shell longitudinal fiber ridges */}
              <path
                d="M 135 48 Q 175 55 215 85 
                   M 135 76 Q 185 82 222 95 
                   M 135 100 L 235 100 
                   M 135 124 Q 185 118 222 105 
                   M 135 152 Q 175 145 215 115"
                stroke="#361706"
                strokeWidth="1.3"
                strokeDasharray="4 6"
                fill="none"
                opacity="0.65"
              />

              {/* Shell gloss / specular highlight */}
              <path
                d="M 145 42 C 175 40, 205 60, 220 85"
                stroke="#8d4a22"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
                opacity="0.4"
              />

              {/* Inner White Coconut Meat (Copra) layer shown when cracked */}
              {isCracked && (
                <path
                  d="M 130 30 L 132 46 L 126 62 L 133 80 L 126 98 L 134 114 L 125 130 L 133 144 L 128 158 L 130 170 
                     L 140 164 L 136 150 L 142 134 L 135 116 L 143 98 L 135 80 L 142 62 L 138 42 Z"
                  fill="url(#meatGrad)"
                  stroke="#ded8c8"
                  strokeWidth="1"
                />
              )}

              {/* Fresh Sweet Coconut Water Pool in right shell cavity */}
              {isCracked && (
                <g className="coconut-water-pool">
                  <ellipse cx="148" cy="100" rx="14" ry="50" fill="url(#waterSurfaceGrad)" opacity="0.95" />
                  <ellipse cx="146" cy="98" rx="8" ry="36" fill="#ffffff" opacity="0.65" />
                  <ellipse cx="150" cy="104" rx="4" ry="18" fill="#e0f2fe" opacity="0.85" />
                </g>
              )}
            </g>

            {/* Glowing vertical fracture line right before burst */}
            {phase === "shudder" && (
              <path
                d="M 130 30 L 132 46 L 126 62 L 133 80 L 126 98 L 134 114 L 125 130 L 133 144 L 128 158 L 130 170"
                stroke="#67e8f9"
                strokeWidth="3.5"
                fill="none"
                className="crack-line cracked"
                filter="drop-shadow(0 0 10px #38bdf8)"
              />
            )}
          </svg>
        </div>

        {/* Soft ground shadow underneath horizontal coconut */}
        <div className="coconut-shadow" aria-hidden="true" />
      </div>

      {/* Brand & Loading Info */}
      <div className="coconut-loader-content">
        <div className="loader-brand">
          <span className="loader-brand-name">VRK TRADERS</span>
        </div>

        <p className="loader-status-text">
          {statusText.includes("blast") ? (
            <span className="loader-status-highlight">
              <Sparkles size={15} className="inline mr-1 text-sky-400" />
              {statusText}
            </span>
          ) : (
            statusText
          )}
        </p>

        {/* Progress bar */}
        <div className="loader-progress-wrap">
          <div
            className="loader-progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="loader-percentage">{progress}%</span>
      </div>
    </div>
  )
}
