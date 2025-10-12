import { useEffect, useRef, useState } from 'react';
import logoImage from '../../assets/images/logo.png';

export default function SplashScreen({
  onComplete,
  progressMs = 2200, // משך פרוגרס
  fadeMs = 600,      // משך פייד-אאוט
  holdMs = 180       // נשימה קטנה לפני פייד
}) {
  const [fadeOut, setFadeOut] = useState(false);
  const containerRef = useRef(null);
  const progressRef = useRef(null);
  const finishedOnce = useRef(false);

  // Preload ללוגו למניעת layout shift
  useEffect(() => {
    const img = new Image();
    img.src = logoImage;
  }, []);

  // סיום על בסיס סוף אנימציית הפרוגרס
  useEffect(() => {
    const el = progressRef.current;
    if (!el) return;
    const onAnimEnd = () => {
      const t = setTimeout(() => setFadeOut(true), holdMs);
      return () => clearTimeout(t);
    };
    el.addEventListener('animationend', onAnimEnd);
    return () => el.removeEventListener('animationend', onAnimEnd);
  }, [holdMs]);

  // כשהפייד נגמר — קוראים ל-onComplete פעם אחת
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onTransEnd = (e) => {
      if (finishedOnce.current) return;
      if (e.propertyName === 'opacity' && fadeOut) {
        finishedOnce.current = true;
        onComplete?.();
      }
    };
    el.addEventListener('transitionend', onTransEnd);
    return () => el.removeEventListener('transitionend', onTransEnd);
  }, [fadeOut, onComplete]);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
      style={{
        background: 'linear-gradient(135deg, #2563eb 0%, #0891b2 100%)',
        transitionDuration: `${fadeMs}ms`,
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Splash screen"
    >
      {/* Blobs רכים */}
      <div className="absolute -z-0 top-1/4 left-1/4 w-56 h-56 rounded-full bg-white/10 blur-[2px] animate-blob" />
      <div className="absolute -z-0 bottom-1/4 right-1/4 w-40 h-40 rounded-full bg-white/10 blur-[2px] animate-blob delay-200" />
      <div className="absolute -z-0 top-1/2 right-1/3 w-28 h-28 rounded-full bg-cyan-300/20 blur-[2px] animate-blob delay-400" />

      <div className="relative z-10 text-center">
        {/* לוגו – bounce in עם overshoot עדין + glow נשימתי */}
        <div className="mb-8">
          <div className="mx-auto w-32 h-32 rounded-full flex items-center justify-center bg-white shadow-2xl splash-card">
            <img
              src={logoImage}
              alt="Finance Manager"
              className="w-16 h-16 object-contain splash-logo"
              loading="eager"
              decoding="async"
            />
          </div>
        </div>

        {/* כותרת – bounce מדורג אחרי הלוגו */}
        <h1 className="text-4xl font-bold text-white text-center mb-2 splash-title">
          Finance Manager
        </h1>

        {/* תת־כותרת – fade up עדין */}
        <p className="text-lg text-white/80 text-center mb-10 px-8 splash-sub">
          ניהול כספים חכם ופשוט
        </p>

        {/* טעינה – נקודות “נושמות” */}
        <div className="items-center splash-loading">
          <div className="flex justify-center items-center mb-5">
            <span className="text-white/90 text-base ml-2">טוען</span>
            <div className="flex space-x-1" aria-hidden>
              <span className="w-2 h-2 rounded-full bg-white/70 dot dot-1" />
              <span className="w-2 h-2 rounded-full bg-white/70 dot dot-2" />
              <span className="w-2 h-2 rounded-full bg-white/70 dot dot-3" />
            </div>
          </div>

          {/* Progress bar – רוחב אנימטיבי חלק */}
          <div className="w-72 h-2 bg-white/20 rounded-full overflow-hidden mx-auto">
            <div
              ref={progressRef}
              className="h-full bg-white rounded-full splash-progress"
              style={{ ['--progress-ms']: `${progressMs}ms` }}
            />
          </div>
        </div>
      </div>

      {/* CSS פנימי: bounce חלק, staggered delays, glow נשימתי, blob תנועתי */}
      <style>{`
        /* Blobs רכים עם תנועה */
        @keyframes blobFloat1 {
          0%   { transform: translate3d(0,0,0) scale(1) rotate(0deg); }
          25%  { transform: translate3d(12px,-8px,0) scale(1.05) rotate(2deg); }
          50%  { transform: translate3d(-6px,-15px,0) scale(1.02) rotate(-1deg); }
          75%  { transform: translate3d(-10px,5px,0) scale(1.08) rotate(1.5deg); }
          100% { transform: translate3d(0,0,0) scale(1) rotate(0deg); }
        }
        @keyframes blobFloat2 {
          0%   { transform: translate3d(0,0,0) scale(1) rotate(0deg); }
          30%  { transform: translate3d(-8px,10px,0) scale(1.03) rotate(-2deg); }
          60%  { transform: translate3d(15px,-5px,0) scale(1.06) rotate(1deg); }
          85%  { transform: translate3d(3px,12px,0) scale(1.01) rotate(-1.5deg); }
          100% { transform: translate3d(0,0,0) scale(1) rotate(0deg); }
        }
        @keyframes blobFloat3 {
          0%   { transform: translate3d(0,0,0) scale(1) rotate(0deg); }
          20%  { transform: translate3d(-5px,-12px,0) scale(1.04) rotate(2.5deg); }
          45%  { transform: translate3d(10px,8px,0) scale(1.02) rotate(-1deg); }
          70%  { transform: translate3d(-12px,-3px,0) scale(1.07) rotate(1.8deg); }
          100% { transform: translate3d(0,0,0) scale(1) rotate(0deg); }
        }
        .animate-blob { animation: blobFloat1 8s ease-in-out infinite; }
        .delay-200 { animation: blobFloat2 7s ease-in-out infinite; }
        .delay-400 { animation: blobFloat3 9s ease-in-out infinite; }

        /* לוגו/קארד: pulse glow נשימתי */
        @keyframes cardGlow {
          0%, 100% { box-shadow: 0 15px 40px rgba(0,0,0,.25), 0 0 0 rgba(96,165,250,0.0) inset; }
          50%      { box-shadow: 0 15px 40px rgba(0,0,0,.25), 0 0 24px rgba(96,165,250,.18) inset; }
        }
        .splash-card { animation: cardGlow 3.4s ease-in-out infinite; }

        /* Bounce-in “מקצועי” (scale + translateY + easing springy) */
        @keyframes bounceIn {
          0%   { transform: translateY(16px) scale(.85); opacity: 0; }
          55%  { transform: translateY(-6px) scale(1.08); opacity: 1; }
          75%  { transform: translateY(3px) scale(.98); }
          100% { transform: translateY(0) scale(1); }
        }
        .splash-logo     { animation: bounceIn 720ms cubic-bezier(.22,1.28,.36,1) both; }
        .splash-title    { animation: bounceIn 680ms cubic-bezier(.22,1.28,.36,1) .18s both; }
        .splash-sub      { animation: fadeUp   540ms ease-out .34s both; }
        .splash-loading  { animation: fadeIn   380ms ease-out .48s both; }

        /* Fade-up נקי לטקסט */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        /* נקודות טעינה עם stagger */
        @keyframes dotPulse {
          0%, 100% { transform: scale(.85); opacity: .35; }
          50%      { transform: scale(1.15); opacity: 1; }
        }
        .dot   { animation: dotPulse 900ms ease-in-out infinite; }
        .dot-2 { animation-delay: .2s; }
        .dot-3 { animation-delay: .4s; }

        /* פרוגרס – מסיים את המסך על animationend */
        @keyframes splashProgress {
          from { width: 0%; }
          to   { width: 100%; }
        }
        .splash-progress {
          width: 0%;
          animation: splashProgress var(--progress-ms, 2200ms) cubic-bezier(.2,.9,.2,1) forwards;
        }

        /* נגישות: פחות תנועה */
        @media (prefers-reduced-motion: reduce) {
          .splash-logo, .splash-title, .splash-sub, .splash-loading,
          .animate-blob, .dot, .splash-progress {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>
    </div>
  );
}
