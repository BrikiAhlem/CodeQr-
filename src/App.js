import { useEffect, useRef, useState } from "react";

const COLORS = ["#f0c060", "#e8847a", "#5ec9c0", "#c084fc", "#ffffff", "#ffd700"];

function useStars(count = 80) {
  const [stars] = useState(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      size: Math.random() * 3 + 1,
      top: Math.random() * 100,
      left: Math.random() * 100,
      duration: (Math.random() * 4 + 2).toFixed(1),
      opacity: (Math.random() * 0.7 + 0.3).toFixed(2),
      delay: (Math.random() * 5).toFixed(1),
    }))
  );
  return stars;
}

function ConfettiCanvas({ triggerRef }) {
  const canvasRef = useRef(null);
  const piecesRef = useRef([]);
  const animatingRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const burst = () => {
      for (let i = 0; i < 120; i++) {
        piecesRef.current.push({
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
          vx: (Math.random() - 0.5) * 18,
          vy: (Math.random() - 1.5) * 14,
          r: Math.random() * 7 + 3,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          alpha: 1,
          rot: Math.random() * Math.PI * 2,
          rotV: (Math.random() - 0.5) * 0.3,
        });
      }
      if (!animatingRef.current) animate();
    };

    const animate = () => {
      animatingRef.current = true;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      piecesRef.current = piecesRef.current.filter((p) => p.alpha > 0.02);
      piecesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.45;
        p.vx *= 0.99;
        p.alpha -= 0.014;
        p.rot += p.rotV;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.rect(-p.r / 2, -p.r / 2, p.r, p.r * 1.6);
        ctx.fill();
        ctx.restore();
      });
      if (piecesRef.current.length > 0) requestAnimationFrame(animate);
      else animatingRef.current = false;
    };

    // expose burst to parent via ref
    if (triggerRef) triggerRef.current = burst;

    // auto-burst on load
    const timer = setTimeout(burst, 800);

    return () => {
      window.removeEventListener("resize", resize);
      clearTimeout(timer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 999,
      }}
    />
  );
}

export default function MessagePourToi() {
  const stars = useStars(80);
  const burstRef = useRef(null);

  const handleBurst = () => {
    if (burstRef.current) burstRef.current();
  };

  const tickerItems = [
    { emoji: "🌟", text: "Tu es unique" },
    { emoji: "🔥", text: "Tu es fort(e)" },
    { emoji: "💪", text: "Tu peux le faire" },
    { emoji: "🌈", text: "Crois en toi" },
    { emoji: "✨", text: "Avance toujours" },
  ];

  const tickerDouble = [...tickerItems, ...tickerItems];

  return (
    <>
      {/* Global styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=DM+Sans:wght@300;400&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --gold: #f0c060;
          --cream: #fdf6ec;
          --deep: #1a0f2e;
          --rose: #e8847a;
          --teal: #5ec9c0;
        }

        html, body {
          min-height: 100%;
          width: 100%;
          overflow-x: hidden;
          background: var(--deep);
          font-family: 'DM Sans', sans-serif;
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50% { opacity: var(--op, 0.8); transform: scale(1); }
        }
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, 40px) scale(1.1); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-20px, -30px) scale(1.08); }
        }
        @keyframes pop {
          from { opacity: 0; transform: scale(0) rotate(-20deg); }
          to { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes breathe {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.6); opacity: 1; }
        }
        @keyframes scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes shine {
          0% { left: -100%; }
          40%, 100% { left: 130%; }
        }

        .emoji-burst {
          font-size: 64px;
          animation: pop 0.6s cubic-bezier(0.34,1.56,0.64,1) both 0.2s;
          filter: drop-shadow(0 0 20px #f0c06088);
          margin-bottom: 16px;
        }
        .pill {
          display: inline-block;
          background: linear-gradient(135deg, var(--gold), var(--rose));
          color: var(--deep);
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          padding: 6px 18px;
          border-radius: 999px;
          margin-bottom: 28px;
          animation: slideUp 0.5s ease both 0.5s;
        }
        .headline {
          font-family: 'Playfair Display', serif;
          font-weight: 700;
          font-size: clamp(2rem, 8vw, 3.2rem);
          color: var(--cream);
          line-height: 1.15;
          margin-bottom: 20px;
          animation: slideUp 0.6s ease both 0.7s;
        }
        .headline em {
          font-style: italic;
          background: linear-gradient(90deg, var(--gold), var(--teal));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .card {
          position: relative;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 24px;
          padding: 32px 28px;
          max-width: 380px;
          width: 100%;
          margin: 0 auto 36px;
          backdrop-filter: blur(16px);
          animation: slideUp 0.6s ease both 0.9s;
        }
        .card::before {
          content: '"';
          font-family: 'Playfair Display', serif;
          font-size: 120px;
          line-height: 0;
          position: absolute;
          top: 36px; left: 20px;
          color: var(--gold);
          opacity: 0.2;
        }
        .quote-text {
          font-size: 1.15rem;
          line-height: 1.7;
          color: rgba(253,246,236,0.9);
          font-style: italic;
        }
        .quote-author {
          margin-top: 16px;
          font-size: 0.8rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--gold);
        }
        .dot {
          width: 10px; height: 10px; border-radius: 50%;
          animation: breathe 2s ease-in-out infinite;
        }
        .ticker {
          display: flex;
          gap: 60px;
          white-space: nowrap;
          animation: scroll 18s linear infinite;
          font-size: 0.8rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(253,246,236,0.55);
        }
        .btn {
          position: relative;
          display: inline-block;
          padding: 16px 40px;
          border-radius: 999px;
          font-size: 1rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          color: var(--deep);
          background: linear-gradient(135deg, var(--gold) 0%, var(--rose) 100%);
          cursor: pointer;
          border: none;
          overflow: hidden;
          animation: slideUp 0.5s ease both 1.5s;
        }
        .btn::after {
          content: '';
          position: absolute; inset: 0;
          background: white;
          opacity: 0;
          transition: opacity 0.2s;
        }
        .btn:active::after { opacity: 0.25; }
        .btn-shine {
          position: absolute; top: 0; left: -100%;
          width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          animation: shine 2.5s ease-in-out infinite;
        }
      `}</style>

      <ConfettiCanvas triggerRef={burstRef} />

      {/* Stars */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
        {stars.map((s) => (
          <div
            key={s.id}
            style={{
              position: "absolute",
              borderRadius: "50%",
              background: "white",
              width: s.size,
              height: s.size,
              top: `${s.top}%`,
              left: `${s.left}%`,
              animation: `twinkle ${s.duration}s ease-in-out infinite ${s.delay}s`,
              "--op": s.opacity,
              opacity: 0,
            }}
          />
        ))}
      </div>

      {/* Orbs */}
      <div style={{ position: "fixed", width: 320, height: 320, top: -80, left: -80, borderRadius: "50%", filter: "blur(80px)", pointerEvents: "none", zIndex: 0, background: "radial-gradient(circle, #9b4dca88, transparent 70%)", animation: "float1 8s ease-in-out infinite" }} />
      <div style={{ position: "fixed", width: 260, height: 260, bottom: -60, right: -60, borderRadius: "50%", filter: "blur(80px)", pointerEvents: "none", zIndex: 0, background: "radial-gradient(circle, #e8847a77, transparent 70%)", animation: "float2 10s ease-in-out infinite" }} />
      <div style={{ position: "fixed", width: 180, height: 180, top: "50%", left: "60%", borderRadius: "50%", filter: "blur(80px)", pointerEvents: "none", zIndex: 0, background: "radial-gradient(circle, #5ec9c066, transparent 70%)", animation: "float1 12s ease-in-out infinite reverse" }} />

      {/* Page */}
      <div style={{ position: "relative", zIndex: 1, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", textAlign: "center" }}>

        <div className="emoji-burst">✨</div>

        <div className="pill">Message spécial pour toi</div>

        <h1 className="headline">
          Tu es capable de<br /><em>choses extraordinaires</em>
        </h1>

        <div className="card">
          <p className="quote-text">
            Chaque matin est une nouvelle chance de devenir
            la meilleure version de toi-même.
            Ne doute jamais de ta lumière — le monde en a besoin.
          </p>
          <p className="quote-author">— Avec tout mon cœur 💛</p>
        </div>

        {/* Breathing dots */}
        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 36, animation: "slideUp 0.5s ease both 1.1s" }}>
          <div className="dot" style={{ background: "var(--teal)" }} />
          <div className="dot" style={{ background: "var(--gold)", animationDelay: "0.3s" }} />
          <div className="dot" style={{ background: "var(--rose)", animationDelay: "0.6s" }} />
        </div>

        {/* Ticker */}
        <div style={{ overflow: "hidden", width: "100%", maxWidth: 400, borderTop: "1px solid rgba(255,255,255,0.1)", borderBottom: "1px solid rgba(255,255,255,0.1)", padding: "14px 0", marginBottom: 40, animation: "slideUp 0.5s ease both 1.3s" }}>
          <div className="ticker">
            {tickerDouble.map((item, i) => (
              <span key={i}>
                <span style={{ color: "var(--gold)" }}>{item.emoji}</span>{" "}
                {item.text}&nbsp;
              </span>
            ))}
          </div>
        </div>

        <button className="btn" onClick={handleBurst}>
          <div className="btn-shine" />
          🎉 Envoyer de l'amour
        </button>

        <p style={{ marginTop: 48, fontSize: "0.7rem", letterSpacing: "0.1em", color: "rgba(253,246,236,0.3)", animation: "slideUp 0.5s ease both 1.7s" }}>
          Scanné avec amour · Fait pour toi
        </p>

      </div>
    </>
  );
}