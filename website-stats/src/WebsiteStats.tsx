import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  Easing,
} from 'remotion';

// ─── Design Tokens ─────────────────────────────────────────────────────────────
const COLORS = {
  bg: '#0A0E1A',
  bgCard: '#111827',
  bgCardLight: '#1F2937',
  accent: '#6366F1',
  accentLight: '#818CF8',
  accentGlow: 'rgba(99,102,241,0.25)',
  teal: '#14B8A6',
  tealGlow: 'rgba(20,184,166,0.25)',
  amber: '#F59E0B',
  rose: '#F43F5E',
  text: '#F9FAFB',
  textMuted: '#9CA3AF',
  textDim: '#6B7280',
  white: '#FFFFFF',
  gradient1: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
  gradient2: 'linear-gradient(135deg, #14B8A6 0%, #06B6D4 100%)',
  gradient3: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
};

// ─── Helpers ───────────────────────────────────────────────────────────────────
const useFadeIn = (startFrame: number, duration = 20) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [startFrame, startFrame + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
};

const useSlideUp = (startFrame: number, duration = 25) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame: frame - startFrame, fps, config: { stiffness: 80, damping: 18 } });
  const y = interpolate(progress, [0, 1], [50, 0]);
  const opacity = interpolate(progress, [0, 0.5], [0, 1], { extrapolateRight: 'clamp' });
  return { y, opacity };
};

const useCountUp = (startFrame: number, endFrame: number, target: number) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [startFrame, endFrame], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.exp),
  });
  return Math.round(progress * target);
};

// ─── Shared Components ─────────────────────────────────────────────────────────
const GlowOrb: React.FC<{ x: number; y: number; color: string; size: number; opacity?: number }> = ({
  x, y, color, size, opacity = 0.15,
}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: size,
      height: size,
      borderRadius: '50%',
      background: color,
      opacity,
      filter: `blur(${size * 0.4}px)`,
      transform: 'translate(-50%, -50%)',
      pointerEvents: 'none',
    }}
  />
);

const SourceBadge: React.FC<{ source: string; opacity: number }> = ({ source, opacity }) => (
  <div
    style={{
      opacity,
      position: 'absolute',
      bottom: 52,
      right: 72,
      background: 'rgba(255,255,255,0.06)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 8,
      padding: '8px 18px',
      fontSize: 22,
      color: COLORS.textDim,
      fontFamily: 'sans-serif',
    }}
  >
    Quelle: {source}
  </div>
);

const Pill: React.FC<{ label: string; gradient: string }> = ({ label, gradient }) => (
  <div
    style={{
      display: 'inline-block',
      background: gradient,
      borderRadius: 50,
      padding: '10px 28px',
      fontSize: 26,
      fontWeight: 700,
      color: '#fff',
      letterSpacing: 1,
      textTransform: 'uppercase',
      fontFamily: 'sans-serif',
    }}
  >
    {label}
  </div>
);

// ─── Scene 1 – Intro ───────────────────────────────────────────────────────────
const SceneIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
  const titleY = spring({ frame: frame - 10, fps, config: { stiffness: 60, damping: 14 } });
  const subtitleY = spring({ frame: frame - 25, fps, config: { stiffness: 60, damping: 14 } });
  const lineW = interpolate(frame, [30, 70], [0, 480], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const tagOpacity = interpolate(frame, [50, 75], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const exitOpacity = interpolate(frame, [80, 95], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: COLORS.bg, opacity: bgOpacity * exitOpacity }}>
      <GlowOrb x={300} y={200} color="#6366F1" size={600} opacity={0.2} />
      <GlowOrb x={1600} y={800} color="#14B8A6" size={500} opacity={0.15} />

      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 24,
      }}>
        {/* Pill */}
        <div style={{ opacity: tagOpacity, transform: `translateY(${interpolate(tagOpacity, [0, 1], [20, 0])}px)` }}>
          <Pill label="Digitale Präsenz" gradient={COLORS.gradient1} />
        </div>

        {/* Title */}
        <div style={{
          transform: `translateY(${interpolate(titleY, [0, 1], [60, 0])}px)`,
          opacity: titleY,
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: 100,
            fontWeight: 900,
            color: COLORS.white,
            fontFamily: 'sans-serif',
            lineHeight: 1.05,
            letterSpacing: -2,
          }}>
            Warum Ihre Website
          </div>
          <div style={{
            fontSize: 100,
            fontWeight: 900,
            background: COLORS.gradient1,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontFamily: 'sans-serif',
            lineHeight: 1.05,
          }}>
            über Erfolg entscheidet
          </div>
        </div>

        {/* Divider line */}
        <div style={{
          width: lineW, height: 3,
          background: COLORS.gradient1,
          borderRadius: 2,
        }} />

        {/* Subtitle */}
        <div style={{
          transform: `translateY(${interpolate(subtitleY, [0, 1], [40, 0])}px)`,
          opacity: subtitleY * tagOpacity,
          fontSize: 36,
          color: COLORS.textMuted,
          fontFamily: 'sans-serif',
          textAlign: 'center',
          maxWidth: 900,
          lineHeight: 1.5,
        }}>
          Fakten & Zahlen für moderne Unternehmen
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 2 – Erster Eindruck ─────────────────────────────────────────────────
const SceneFirstImpression: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const exit = interpolate(frame, [80, 95], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const opacity = enter * exit;

  const cardSpring = spring({ frame: frame - 8, fps, config: { stiffness: 70, damping: 16 } });
  const numCount = useCountUp(5, 45, 50);
  const numCount2 = useCountUp(20, 60, 75);

  const barW1 = interpolate(frame, [30, 65], [0, 50 / 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const barW2 = interpolate(frame, [40, 75], [0, 75 / 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });

  return (
    <AbsoluteFill style={{ background: COLORS.bg, opacity }}>
      <GlowOrb x={1700} y={150} color="#6366F1" size={700} opacity={0.18} />
      <GlowOrb x={200} y={900} color="#8B5CF6" size={400} opacity={0.12} />

      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '0 100px', gap: 64,
      }}>
        {/* Left: Big stat */}
        <div style={{
          flex: 1,
          transform: `translateY(${interpolate(cardSpring, [0, 1], [60, 0])}px)`,
          opacity: cardSpring,
        }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: COLORS.accentLight, fontFamily: 'sans-serif', marginBottom: 16, letterSpacing: 2, textTransform: 'uppercase' }}>
            Erster Eindruck
          </div>
          <div style={{
            fontSize: 180,
            fontWeight: 900,
            background: COLORS.gradient1,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontFamily: 'sans-serif',
            lineHeight: 1,
          }}>
            {numCount}ms
          </div>
          <div style={{ fontSize: 42, color: COLORS.text, fontFamily: 'sans-serif', fontWeight: 600, lineHeight: 1.3, maxWidth: 560, marginTop: 16 }}>
            So schnell bilden Nutzer ihren ersten Eindruck von Ihrer Website
          </div>
          <div style={{ marginTop: 24, fontSize: 26, color: COLORS.textMuted, fontFamily: 'sans-serif', lineHeight: 1.6 }}>
            In 0,05 Sekunden entscheidet sich, ob Ihr Besucher bleibt – oder geht.
          </div>
        </div>

        {/* Right: Second stat */}
        <div style={{
          flex: 1,
          display: 'flex', flexDirection: 'column', gap: 32,
          transform: `translateY(${interpolate(cardSpring, [0, 1], [80, 0])}px)`,
          opacity: cardSpring,
        }}>
          <StatBar
            value={numCount2}
            max={100}
            barFraction={barW2}
            label="der Nutzer beurteilen die Glaubwürdigkeit eines Unternehmens anhand seines Website-Designs"
            gradient={COLORS.gradient1}
            large
          />
          <StatBar
            value={numCount}
            max={100}
            barFraction={barW1}
            label="der Nutzer kehren nach einem schlechten Website-Erlebnis nie zurück"
            gradient="linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)"
          />
        </div>
      </div>

      <SourceBadge source="Stanford Web Credibility Project · Sweor (2023)" opacity={enter} />
    </AbsoluteFill>
  );
};

const StatBar: React.FC<{
  value: number; max: number; barFraction: number;
  label: string; gradient: string; large?: boolean;
}> = ({ value, max, barFraction, label, gradient, large }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
      <span style={{ fontSize: large ? 100 : 80, fontWeight: 900, background: gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: 'sans-serif', lineHeight: 1 }}>
        {value}%
      </span>
    </div>
    <div style={{ fontSize: 26, color: COLORS.textMuted, fontFamily: 'sans-serif', lineHeight: 1.4 }}>
      {label}
    </div>
    <div style={{ height: 10, background: 'rgba(255,255,255,0.08)', borderRadius: 5, overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${barFraction * 100}%`, background: gradient, borderRadius: 5 }} />
    </div>
  </div>
);

// ─── Scene 3 – Online-Recherche ────────────────────────────────────────────────
const SceneOnlineResearch: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const exit = interpolate(frame, [80, 95], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const opacity = enter * exit;

  const count = useCountUp(5, 50, 81);
  const iconSpring = spring({ frame: frame - 10, fps, config: { stiffness: 65, damping: 15 } });

  const icons = ['🔍', '📊', '💻', '📱', '🛒', '⭐'];
  const iconDelays = [5, 15, 20, 25, 30, 35];

  return (
    <AbsoluteFill style={{ background: COLORS.bg, opacity }}>
      <GlowOrb x={960} y={300} color="#14B8A6" size={800} opacity={0.12} />

      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 40,
      }}>
        <div style={{ opacity: iconSpring, transform: `translateY(${interpolate(iconSpring, [0, 1], [-30, 0])}px)` }}>
          <Pill label="Online-Recherche" gradient={COLORS.gradient2} />
        </div>

        {/* Big percentage */}
        <div style={{
          fontSize: 220,
          fontWeight: 900,
          background: COLORS.gradient2,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontFamily: 'sans-serif',
          lineHeight: 1,
        }}>
          {count}%
        </div>

        <div style={{
          fontSize: 52,
          fontWeight: 700,
          color: COLORS.text,
          fontFamily: 'sans-serif',
          textAlign: 'center',
          maxWidth: 1100,
          lineHeight: 1.3,
          opacity: iconSpring,
        }}>
          der Konsumenten recherchieren online, bevor sie einen Kauf tätigen
        </div>

        {/* Icon row */}
        <div style={{ display: 'flex', gap: 40, marginTop: 16 }}>
          {icons.map((icon, i) => {
            const s = spring({ frame: frame - iconDelays[i], fps, config: { stiffness: 100, damping: 14 } });
            return (
              <div
                key={i}
                style={{
                  fontSize: 56,
                  opacity: s,
                  transform: `scale(${s}) translateY(${interpolate(s, [0, 1], [20, 0])}px)`,
                  background: 'rgba(20,184,166,0.1)',
                  border: '1px solid rgba(20,184,166,0.3)',
                  borderRadius: 16,
                  width: 100, height: 100,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                {icon}
              </div>
            );
          })}
        </div>
      </div>

      <SourceBadge source="Think with Google · Statista 2024" opacity={enter} />
    </AbsoluteFill>
  );
};

// ─── Scene 4 – Mobile ──────────────────────────────────────────────────────────
const SceneMobile: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const exit = interpolate(frame, [80, 95], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const opacity = enter * exit;

  const mobileCount = useCountUp(5, 50, 60);
  const abandonCount = useCountUp(10, 55, 53);

  const cardSpring = spring({ frame: frame - 5, fps, config: { stiffness: 70, damping: 16 } });
  const card2Spring = spring({ frame: frame - 18, fps, config: { stiffness: 70, damping: 16 } });

  const phoneScale = spring({ frame: frame - 0, fps, config: { stiffness: 50, damping: 14 } });

  return (
    <AbsoluteFill style={{ background: COLORS.bg, opacity }}>
      <GlowOrb x={400} y={540} color="#6366F1" size={600} opacity={0.15} />
      <GlowOrb x={1500} y={300} color="#F59E0B" size={500} opacity={0.12} />

      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center',
        padding: '0 100px', gap: 80,
      }}>
        {/* Phone graphic */}
        <div style={{
          flex: '0 0 auto',
          transform: `scale(${phoneScale}) rotate(${interpolate(phoneScale, [0, 1], [-8, 0])}deg)`,
          opacity: phoneScale,
        }}>
          <div style={{
            width: 260, height: 500,
            background: 'linear-gradient(160deg, #1F2937 0%, #111827 100%)',
            borderRadius: 40,
            border: '3px solid rgba(255,255,255,0.12)',
            boxShadow: '0 40px 120px rgba(99,102,241,0.3)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'flex-start',
            padding: 20,
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Notch */}
            <div style={{ width: 80, height: 20, background: '#0A0E1A', borderRadius: 10, marginBottom: 16 }} />
            {/* Screen content bars */}
            {[90, 60, 80, 45, 70].map((w, i) => (
              <div key={i} style={{
                width: `${w}%`, height: 16,
                background: i === 0 ? COLORS.gradient1 : 'rgba(255,255,255,0.08)',
                borderRadius: 4, marginBottom: 12,
              }} />
            ))}
            <div style={{ width: '100%', height: 100, background: 'rgba(99,102,241,0.15)', borderRadius: 12, marginTop: 8 }} />
            {/* Glow inside */}
            <div style={{
              position: 'absolute', bottom: -40, left: '50%',
              transform: 'translateX(-50%)',
              width: 200, height: 200,
              borderRadius: '50%',
              background: 'rgba(99,102,241,0.2)',
              filter: 'blur(40px)',
            }} />
          </div>
        </div>

        {/* Stats */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 48 }}>
          <div style={{ opacity: enter, transform: `translateY(${interpolate(enter, [0, 1], [-20, 0])}px)` }}>
            <Pill label="Mobile First" gradient="linear-gradient(135deg, #F59E0B 0%, #F97316 100%)" />
          </div>

          <div style={{
            transform: `translateX(${interpolate(cardSpring, [0, 1], [60, 0])}px)`,
            opacity: cardSpring,
          }}>
            <StatCard
              value={`${mobileCount}%`}
              description="des globalen Website-Traffics kommt von Mobilgeräten"
              gradient={COLORS.gradient1}
              source="Statista 2024"
            />
          </div>

          <div style={{
            transform: `translateX(${interpolate(card2Spring, [0, 1], [60, 0])}px)`,
            opacity: card2Spring,
          }}>
            <StatCard
              value={`${abandonCount}%`}
              description="der mobilen Nutzer verlassen eine Seite, die länger als 3 Sek. lädt"
              gradient="linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)"
              source="Google 2024"
            />
          </div>
        </div>
      </div>

      <SourceBadge source="Statista · Google / Portent 2024" opacity={enter} />
    </AbsoluteFill>
  );
};

const StatCard: React.FC<{ value: string; description: string; gradient: string; source: string }> = ({
  value, description, gradient,
}) => (
  <div style={{
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 20,
    padding: '32px 40px',
    display: 'flex', alignItems: 'center', gap: 32,
  }}>
    <div style={{
      fontSize: 90, fontWeight: 900,
      background: gradient,
      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
      fontFamily: 'sans-serif', lineHeight: 1, flexShrink: 0,
    }}>
      {value}
    </div>
    <div style={{ fontSize: 28, color: COLORS.textMuted, fontFamily: 'sans-serif', lineHeight: 1.4 }}>
      {description}
    </div>
  </div>
);

// ─── Scene 5 – Geschwindigkeit & Conversions ───────────────────────────────────
const SceneSpeed: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const exit = interpolate(frame, [80, 95], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const opacity = enter * exit;

  const convCount = useCountUp(5, 50, 7);
  const speedItems = [
    { delay: 5, value: '7%', label: 'Conversion-Verlust pro Sekunde Ladezeit', gradient: COLORS.gradient3 },
    { delay: 20, value: '+2×', label: 'mehr Conversions bei 1s vs. 5s Ladezeit', gradient: COLORS.gradient2 },
    { delay: 35, value: '3 Sek.', label: 'maximale Ladezeit, bevor Nutzer abspringen', gradient: COLORS.gradient1 },
  ];

  return (
    <AbsoluteFill style={{ background: COLORS.bg, opacity }}>
      <GlowOrb x={960} y={200} color="#F43F5E" size={700} opacity={0.12} />
      <GlowOrb x={200} y={800} color="#6366F1" size={400} opacity={0.1} />

      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 48,
        padding: '0 80px',
      }}>
        <div style={{ opacity: enter, textAlign: 'center' }}>
          <Pill label="Ladegeschwindigkeit" gradient={COLORS.gradient3} />
        </div>

        <div style={{
          fontSize: 56, fontWeight: 800, color: COLORS.text,
          fontFamily: 'sans-serif', textAlign: 'center', lineHeight: 1.2,
          opacity: enter,
        }}>
          Jede Sekunde Ladezeit kostet bares Geld
        </div>

        <div style={{ display: 'flex', gap: 40, width: '100%' }}>
          {speedItems.map((item, i) => {
            const s = spring({ frame: frame - item.delay, fps, config: { stiffness: 70, damping: 15 } });
            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 24,
                  padding: '48px 40px',
                  display: 'flex', flexDirection: 'column', gap: 16,
                  transform: `translateY(${interpolate(s, [0, 1], [60, 0])}px)`,
                  opacity: s,
                  textAlign: 'center',
                }}
              >
                <div style={{
                  fontSize: 100, fontWeight: 900,
                  background: item.gradient,
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  fontFamily: 'sans-serif', lineHeight: 1,
                }}>
                  {i === 0 ? `${convCount}%` : item.value}
                </div>
                <div style={{ fontSize: 28, color: COLORS.textMuted, fontFamily: 'sans-serif', lineHeight: 1.4 }}>
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <SourceBadge source="Google · Portent Research · OuterBox 2023" opacity={enter} />
    </AbsoluteFill>
  );
};

// ─── Scene 6 – Umsatz & Wachstum ──────────────────────────────────────────────
const SceneRevenue: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const exit = interpolate(frame, [80, 95], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const opacity = enter * exit;

  const growthCount = useCountUp(5, 50, 40);
  const revenueCount = useCountUp(5, 50, 2);

  const barSpring1 = spring({ frame: frame - 15, fps, config: { stiffness: 55, damping: 14 } });
  const barSpring2 = spring({ frame: frame - 28, fps, config: { stiffness: 55, damping: 14 } });

  return (
    <AbsoluteFill style={{ background: COLORS.bg, opacity }}>
      <GlowOrb x={1600} y={540} color="#14B8A6" size={700} opacity={0.15} />
      <GlowOrb x={300} y={200} color="#6366F1" size={500} opacity={0.1} />

      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center',
        padding: '0 100px', gap: 80,
      }}>
        {/* Left text */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 32 }}>
          <div style={{ opacity: enter }}>
            <Pill label="Wachstum & Umsatz" gradient={COLORS.gradient2} />
          </div>

          <div style={{
            fontSize: 64, fontWeight: 800, color: COLORS.text,
            fontFamily: 'sans-serif', lineHeight: 1.2,
            opacity: enter,
          }}>
            Eine starke Web-Präsenz steigert direkt den Umsatz
          </div>

          <div style={{ fontSize: 30, color: COLORS.textMuted, fontFamily: 'sans-serif', lineHeight: 1.6, opacity: enter }}>
            Unternehmen mit professioneller Website wachsen schneller, gewinnen mehr Kunden und bauen nachhaltig Vertrauen auf.
          </div>
        </div>

        {/* Right bars */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 48 }}>
          <GrowthBar
            spring={barSpring1}
            value={growthCount}
            suffix="%"
            label="schneller wachsen kleine Unternehmen mit starker Online-Präsenz"
            gradient={COLORS.gradient2}
          />
          <GrowthBar
            spring={barSpring2}
            value={revenueCount}
            suffix="×"
            label="mehr Umsatz pro Mitarbeiter mit vollständiger Web-Präsenz vs. ohne"
            gradient={COLORS.gradient1}
          />
        </div>
      </div>

      <SourceBadge source="Google / Deloitte Connected Small Businesses Report" opacity={enter} />
    </AbsoluteFill>
  );
};

const GrowthBar: React.FC<{
  spring: number; value: number; suffix: string; label: string; gradient: string;
}> = ({ spring: s, value, suffix, label, gradient }) => (
  <div style={{
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 20, padding: '32px 40px',
    transform: `translateX(${interpolate(s, [0, 1], [80, 0])}px)`,
    opacity: s,
  }}>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 12 }}>
      <span style={{ fontSize: 100, fontWeight: 900, background: gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: 'sans-serif', lineHeight: 1 }}>
        {value}{suffix}
      </span>
    </div>
    <div style={{ fontSize: 28, color: COLORS.textMuted, fontFamily: 'sans-serif', lineHeight: 1.4, marginBottom: 20 }}>
      {label}
    </div>
    <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${s * 80}%`, background: gradient, borderRadius: 4 }} />
    </div>
  </div>
);

// ─── Scene 7 – Outro ───────────────────────────────────────────────────────────
const SceneOutro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });

  const titleSpring = spring({ frame: frame - 8, fps, config: { stiffness: 60, damping: 14 } });
  const sub1 = spring({ frame: frame - 22, fps, config: { stiffness: 60, damping: 14 } });
  const sub2 = spring({ frame: frame - 35, fps, config: { stiffness: 60, damping: 14 } });
  const sub3 = spring({ frame: frame - 48, fps, config: { stiffness: 60, damping: 14 } });

  const pulseScale = interpolate(
    Math.sin((frame / 30) * Math.PI),
    [-1, 1], [0.97, 1.03]
  );

  const checkItems = [
    { spring: sub1, text: 'Modernes, professionelles Design aufbauen' },
    { spring: sub2, text: 'Mobile-First & Ladegeschwindigkeit optimieren' },
    { spring: sub3, text: 'Vertrauen schaffen – online & offline' },
  ];

  return (
    <AbsoluteFill style={{ background: COLORS.bg, opacity: enter }}>
      <GlowOrb x={960} y={540} color="#6366F1" size={1000} opacity={0.12} />
      <GlowOrb x={200} y={900} color="#14B8A6" size={400} opacity={0.1} />
      <GlowOrb x={1700} y={200} color="#F59E0B" size={350} opacity={0.08} />

      {/* Pulsing ring */}
      <div style={{
        position: 'absolute', left: '50%', top: '38%',
        transform: `translate(-50%, -50%) scale(${pulseScale})`,
        width: 220, height: 220,
        borderRadius: '50%',
        border: '2px solid rgba(99,102,241,0.3)',
        boxShadow: `0 0 80px rgba(99,102,241,0.2)`,
        opacity: titleSpring,
      }} />
      <div style={{
        position: 'absolute', left: '50%', top: '38%',
        transform: `translate(-50%, -50%) scale(${pulseScale * 0.85})`,
        width: 160, height: 160,
        borderRadius: '50%',
        background: 'rgba(99,102,241,0.08)',
        border: '2px solid rgba(99,102,241,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 72,
        opacity: titleSpring,
      }}>
        🌐
      </div>

      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 32,
        padding: '0 120px',
      }}>
        <div style={{ height: 200 }} />

        <div style={{
          fontSize: 80, fontWeight: 900,
          background: COLORS.gradient1,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          fontFamily: 'sans-serif', lineHeight: 1.1, textAlign: 'center',
          transform: `translateY(${interpolate(titleSpring, [0, 1], [40, 0])}px)`,
          opacity: titleSpring,
        }}>
          Jetzt handeln – online sichtbar werden
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%', maxWidth: 900 }}>
          {checkItems.map((item, i) => (
            <div
              key={i}
              style={{
                display: 'flex', alignItems: 'center', gap: 20,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 14, padding: '20px 32px',
                transform: `translateX(${interpolate(item.spring, [0, 1], [60, 0])}px)`,
                opacity: item.spring,
              }}
            >
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: COLORS.gradient1,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, flexShrink: 0,
              }}>
                ✓
              </div>
              <span style={{ fontSize: 30, color: COLORS.text, fontFamily: 'sans-serif' }}>
                {item.text}
              </span>
            </div>
          ))}
        </div>

        <div style={{
          fontSize: 26, color: COLORS.textDim, fontFamily: 'sans-serif',
          textAlign: 'center', marginTop: 8,
          opacity: sub3,
        }}>
          Quellen: Stanford Web Credibility Project · Google/Deloitte · Think with Google · Statista · Sweor · Portent
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Main Composition ──────────────────────────────────────────────────────────
export const WebsiteStats: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.bg }}>
      <Sequence from={0} durationInFrames={100}>
        <SceneIntro />
      </Sequence>
      <Sequence from={95} durationInFrames={100}>
        <SceneFirstImpression />
      </Sequence>
      <Sequence from={190} durationInFrames={100}>
        <SceneOnlineResearch />
      </Sequence>
      <Sequence from={285} durationInFrames={100}>
        <SceneMobile />
      </Sequence>
      <Sequence from={380} durationInFrames={100}>
        <SceneSpeed />
      </Sequence>
      <Sequence from={475} durationInFrames={100}>
        <SceneRevenue />
      </Sequence>
      <Sequence from={570} durationInFrames={100}>
        <SceneOutro />
      </Sequence>
    </AbsoluteFill>
  );
};
