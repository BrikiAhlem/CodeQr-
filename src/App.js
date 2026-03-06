import { useEffect, useRef, useState, useCallback } from "react";

const COLORS = ["#f0c060", "#e8847a", "#5ec9c0", "#c084fc", "#ffffff", "#ffd700"];

function useStars(count = 60) {
  const [stars] = useState(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      size: Math.random() * 2.5 + 1,
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

    if (triggerRef) triggerRef.current = burst;
    const timer = setTimeout(burst, 800);

    return () => {
      window.removeEventListener("resize", resize);
      clearTimeout(timer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 999 }}
    />
  );
}

const cards = [
  {
    emoji: "✨",
    lang: "fr",
    quote: "Chaque matin est une nouvelle chance de devenir la meilleure version de toi-même. Ne doute jamais de ta lumière — le monde en a besoin.",
    author: "Avec tout mon cœur 💛",
    accent: "#f0c060",
    bg: "linear-gradient(135deg, rgba(240,192,96,0.12), rgba(232,132,122,0.08))",
  },
  {
    emoji: "🌟",
    lang: "ar",
    quote: "أنتَ قادرٌ على تجاوز كلّ العقبات، فلا تستسلم أبدًا. نورك يضيء الدروب المظلمة، والعالم يحتاج إليك بكلّ ما تحمله من جمال.",
    author: "بكلّ محبّة 💜",
    accent: "#c084fc",
    bg: "linear-gradient(135deg, rgba(192,132,252,0.12), rgba(94,201,192,0.08))",
    rtl: true,
  },
  {
    emoji: "🔥",
    lang: "fr",
    quote: "Ta force intérieure est plus grande que tous tes doutes. Avance, même à petits pas — chaque pas compte et te rapproche de qui tu es vraiment.",
    author: "Pour toi, toujours 🧡",
    accent: "#e8847a",
    bg: "linear-gradient(135deg, rgba(232,132,122,0.12), rgba(240,192,96,0.08))",
  },
  {
    emoji: "🌙",
    lang: "ar",
    quote: "في أعمق اللّيالي، تولد أجمل النّجوم. أنت نجمة لامعة، لا تدع أحدًا يطفئ بريقك. ثِق بنفسك وامضِ قُدُمًا بثقة.",
    author: "إلى الأبد معك 🌟",
    accent: "#5ec9c0",
    bg: "linear-gradient(135deg, rgba(94,201,192,0.12), rgba(192,132,252,0.08))",
    rtl: true,
  },
];

const tickerItems = [
  { emoji: "🌟", text: "Tu es unique" },
  { emoji: "🔥", text: "Tu es fort(e)" },
  { emoji: "💪", text: "Tu peux le faire" },
  { emoji: "🌈", text: "Crois en toi" },
  { emoji: "✨", text: "Avance toujours" },
  { emoji: "💜", text: "أنت رائع" },
  { emoji: "🌙", text: "لا تستسلم" },
];
const tickerDouble = [...tickerItems, ...tickerItems];

function Carousel() {
  const [current, setCurrent] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragDelta, setDragDelta] = useState(0);
  const trackRef = useRef(null);

  const go = useCallback((idx) => {
    setCurrent((idx + cards.length) % cards.length);
    setDragDelta(0);
  }, []);

  const onPointerDown = (e) => {
    setDragging(true);
    setStartX(e.clientX ?? e.touches?.[0]?.clientX ?? 0);
  };
  const onPointerMove = (e) => {
    if (!dragging) return;
    const x = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    setDragDelta(x - startX);
  };
  const onPointerUp = () => {
    if (!dragging) return;
    setDragging(false);
    if (dragDelta < -50) go(current + 1);
    else if (dragDelta > 50) go(current - 1);
    else setDragDelta(0);
  };

  useEffect(() => {
    const interval = setInterval(() => go(current + 1), 4500);
    return () => clearInterval(interval);
  }, [current, go]);

  return (
    <div style={{ width: "100%", maxWidth: 420, margin: "0 auto 32px", position: "relative" }}>
      {/* Track */}
      <div
        ref={trackRef}
        onMouseDown={onPointerDown}
        onMouseMove={onPointerMove}
        onMouseUp={onPointerUp}
        onMouseLeave={onPointerUp}
        onTouchStart={onPointerDown}
        onTouchMove={onPointerMove}
        onTouchEnd={onPointerUp}
        style={{ overflow: "hidden", borderRadius: 24, cursor: dragging ? "grabbing" : "grab", userSelect: "none" }}
      >
        <div
          style={{
            display: "flex",
            transition: dragging ? "none" : "transform 0.45s cubic-bezier(0.25,1,0.5,1)",
            transform: `translateX(calc(${-current * 100}% + ${dragDelta}px))`,
            willChange: "transform",
          }}
        >
          {cards.map((card, i) => (
            <div
              key={i}
              style={{
                minWidth: "100%",
                background: card.bg,
                border: `1px solid ${card.accent}33`,
                borderRadius: 24,
                padding: "36px 28px 32px",
                backdropFilter: "blur(20px)",
                position: "relative",
                overflow: "hidden",
                direction: card.rtl ? "rtl" : "ltr",
                textAlign: card.rtl ? "right" : "left",
              }}
            >
              {/* Big quote mark */}
              <div style={{
                position: "absolute",
                top: 18,
                [card.rtl ? "right" : "left"]: 18,
                fontFamily: "'Playfair Display', serif",
                fontSize: 96,
                lineHeight: 1,
                color: card.accent,
                opacity: 0.18,
                pointerEvents: "none",
                fontWeight: 700,
              }}>
                
              </div>

              {/* Glow orb */}
              <div style={{
                position: "absolute",
                width: 120, height: 120,
                borderRadius: "50%",
                background: card.accent,
                opacity: 0.07,
                filter: "blur(40px)",
                top: -20,
                [card.rtl ? "left" : "right"]: -20,
                pointerEvents: "none",
              }} />

              <div style={{ fontSize: 40, marginBottom: 16, display: "block" }}>{card.emoji}</div>

              <p style={{
                fontFamily: card.rtl ? "'Noto Sans Arabic', 'Cairo', sans-serif" : "'Playfair Display', serif",
                fontStyle: card.rtl ? "normal" : "italic",
                fontSize: card.rtl ? "1.05rem" : "1.08rem",
                lineHeight: 1.75,
                color: "rgba(253,246,236,0.92)",
                marginBottom: 20,
                position: "relative",
                zIndex: 1,
              }}>
                {card.quote}
              </p>

              <p style={{
                fontSize: "0.75rem",
                letterSpacing: "0.1em",
                textTransform: card.rtl ? "none" : "uppercase",
                color: card.accent,
                fontWeight: 600,
              }}>
                — {card.author}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 18 }}>
        {cards.map((card, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            style={{
              width: current === i ? 24 : 8,
              height: 8,
              borderRadius: 999,
              background: current === i ? card.accent : "rgba(255,255,255,0.2)",
              border: "none",
              cursor: "pointer",
              padding: 0,
              transition: "all 0.3s ease",
            }}
          />
        ))}
      </div>

      {/* Nav arrows (hidden on very small) */}
      <button
        onClick={() => go(current - 1)}
        style={{
          position: "absolute",
          left: -14,
          top: "calc(50% - 32px)",
          transform: "translateY(-50%)",
          width: 36, height: 36,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.15)",
          color: "white",
          fontSize: 16,
          cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          backdropFilter: "blur(8px)",
          transition: "background 0.2s",
        }}
      >‹</button>
      <button
        onClick={() => go(current + 1)}
        style={{
          position: "absolute",
          right: -14,
          top: "calc(50% - 32px)",
          transform: "translateY(-50%)",
          width: 36, height: 36,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.15)",
          color: "white",
          fontSize: 16,
          cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          backdropFilter: "blur(8px)",
          transition: "background 0.2s",
        }}
      >›</button>
    </div>
  );
}

export default function MessagePourToi() {
  const stars = useStars(60);
  const burstRef = useRef(null);

  const handleBurst = () => {
    if (burstRef.current) burstRef.current();
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=DM+Sans:wght@300;400;600&family=Cairo:wght@400;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --gold: #f0c060;
          --cream: #fdf6ec;
          --deep: #100a1e;
          --rose: #e8847a;
          --teal: #5ec9c0;
          --purple: #c084fc;
        }

        html, body {
          min-height: 100%;
          width: 100%;
          overflow-x: hidden;
          background: var(--deep);
          font-family: 'DM Sans', sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0; transform: scale(0.4); }
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
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .emoji-burst {
          font-size: clamp(48px, 12vw, 64px);
          animation: pop 0.6s cubic-bezier(0.34,1.56,0.64,1) both 0.2s;
          filter: drop-shadow(0 0 20px #f0c06088);
          margin-bottom: 14px;
          line-height: 1;
        }
        .pill {
          display: inline-block;
          background: linear-gradient(135deg, var(--gold), var(--rose));
          color: var(--deep);
          font-size: clamp(0.65rem, 2.5vw, 0.75rem);
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          padding: 6px 18px;
          border-radius: 999px;
          margin-bottom: 20px;
          animation: slideUp 0.5s ease both 0.5s;
        }
        .headline {
          font-family: 'Playfair Display', serif;
          font-weight: 700;
          font-size: clamp(1.6rem, 6.5vw, 3rem);
          color: var(--cream);
          line-height: 1.2;
          margin-bottom: 28px;
          animation: slideUp 0.6s ease both 0.7s;
          padding: 0 4px;
        }
        .headline em {
          font-style: italic;
          background: linear-gradient(90deg, var(--gold), var(--teal));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .dot {
          width: 9px; height: 9px; border-radius: 50%;
          animation: breathe 2s ease-in-out infinite;
        }
        .ticker-wrap {
          overflow: hidden;
          width: 100%;
          max-width: 440px;
          border-top: 1px solid rgba(255,255,255,0.1);
          border-bottom: 1px solid rgba(255,255,255,0.1);
          padding: 13px 0;
          margin-bottom: 32px;
          animation: slideUp 0.5s ease both 1.3s;
        }
        .ticker {
          display: flex;
          gap: 48px;
          white-space: nowrap;
          animation: scroll 22s linear infinite;
          font-size: clamp(0.7rem, 2.5vw, 0.8rem);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(253,246,236,0.5);
        }
        .btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: clamp(13px, 3.5vw, 16px) clamp(28px, 7vw, 40px);
          border-radius: 999px;
          font-size: clamp(0.9rem, 3.5vw, 1rem);
          font-weight: 700;
          letter-spacing: 0.05em;
          color: var(--deep);
          background: linear-gradient(135deg, var(--gold) 0%, var(--rose) 100%);
          cursor: pointer;
          border: none;
          overflow: hidden;
          animation: slideUp 0.5s ease both 1.5s;
          touch-action: manipulation;
        }
        .btn::after {
          content: '';
          position: absolute; inset: 0;
          background: white;
          opacity: 0;
          transition: opacity 0.2s;
        }
        .btn:active::after { opacity: 0.2; }
        .btn-shine {
          position: absolute; top: 0; left: -100%;
          width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          animation: shine 2.5s ease-in-out infinite;
          pointer-events: none;
        }

        /* Mobile specific */
        @media (max-width: 480px) {
          .carousel-nav-btn { display: none !important; }
        }
      `}</style>

      <ConfettiCanvas triggerRef={burstRef} />

      {/* Stars */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
        {stars.map((s) => (
          <div key={s.id} style={{
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
          }} />
        ))}
      </div>

      {/* Orbs */}
      <div style={{ position: "fixed", width: "min(320px, 60vw)", height: "min(320px, 60vw)", top: -60, left: -60, borderRadius: "50%", filter: "blur(80px)", pointerEvents: "none", zIndex: 0, background: "radial-gradient(circle, #9b4dca77, transparent 70%)", animation: "float1 8s ease-in-out infinite" }} />
      <div style={{ position: "fixed", width: "min(260px, 50vw)", height: "min(260px, 50vw)", bottom: -50, right: -50, borderRadius: "50%", filter: "blur(80px)", pointerEvents: "none", zIndex: 0, background: "radial-gradient(circle, #e8847a66, transparent 70%)", animation: "float2 10s ease-in-out infinite" }} />
      <div style={{ position: "fixed", width: "min(180px, 40vw)", height: "min(180px, 40vw)", top: "45%", left: "60%", borderRadius: "50%", filter: "blur(80px)", pointerEvents: "none", zIndex: 0, background: "radial-gradient(circle, #5ec9c055, transparent 70%)", animation: "float1 12s ease-in-out infinite reverse" }} />

      {/* Page */}
      <div style={{
        position: "relative",
        zIndex: 1,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(32px, 6vw, 60px) clamp(16px, 5vw, 32px)",
        textAlign: "center",
      }}>

        <div className="emoji-burst">✨</div>

        <div className="pill">Message spécial pour toi · رسالة خاصة إليك</div>

        <h1 className="headline">
          Tu es capable de<br /><em>choses extraordinaires</em>
        </h1>

        {/* Carousel */}
        <div style={{ width: "100%", maxWidth: 440, padding: "0 20px", animation: "slideUp 0.6s ease both 0.9s" }}>
          <Carousel />
        </div>

        {/* Breathing dots */}
        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 28, animation: "slideUp 0.5s ease both 1.1s" }}>
          <div className="dot" style={{ background: "var(--teal)" }} />
          <div className="dot" style={{ background: "var(--gold)", animationDelay: "0.3s" }} />
          <div className="dot" style={{ background: "var(--rose)", animationDelay: "0.6s" }} />
        </div>

        {/* Ticker */}
        <div className="ticker-wrap">
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
          🎉 Envoyer de l'amour · أرسل الحب
        </button>

        <p style={{
          marginTop: 40,
          fontSize: "clamp(0.6rem, 2vw, 0.7rem)",
          letterSpacing: "0.1em",
          color: "rgba(253,246,236,0.28)",
          animation: "slideUp 0.5s ease both 1.7s",
        }}>
          Fait avec amour · صُنع بكلّ محبّة
        </p>

      </div>
    </>
  );
}