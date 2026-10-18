import React, { useState } from 'react';
import { IMAGES } from '../constants/assets';
import { soundFx } from '../utils/audioPlayer';

interface Props {
  onBegin: () => void;
  onAlreadyAccount: () => void;
}

export const Screen0Welcome: React.FC<Props> = ({ onBegin, onAlreadyAccount }) => {
  const phrases = [
    "Marhba bik! I'm ready when you are ✨",
    'Take your time, no rush today 🌸',
    "Exam week or new job? I've got your back! 💜",
    'Just one gentle step at a time 🌿'
  ];

  const [phraseIdx, setPhraseIdx] = useState(0);
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [bounce, setBounce] = useState(false);

  const handleCompanionTap = (e: React.MouseEvent<HTMLDivElement>) => {
    soundFx.playSparkle();
    setPhraseIdx((prev) => (prev + 1) % phrases.length);
    setBounce(true);
    setTimeout(() => setBounce(false), 300);

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX ? e.clientX - rect.left : rect.width / 2;
    const y = e.clientY ? e.clientY - rect.top : rect.height / 2;

    const newId = Date.now();
    setSparkles((prev) => [...prev, { id: newId, x, y }]);
    setTimeout(() => {
      setSparkles((prev) => prev.filter((s) => s.id !== newId));
    }, 800);
  };

  return (
    <div className="flex flex-col w-full px-margin pb-8 space-y-6 relative overflow-hidden max-w-md mx-auto pt-2">
      {/* Subtle decorative ambient lights */}
      <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-gradient-to-b from-secondary-container/40 via-tertiary-fixed/30 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Regional Dedication Badge */}
      <div className="flex items-center justify-center pt-2">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface-container-low shadow-sm">
          <span className="text-sm">🇹🇳</span>
          <span className="font-semibold text-xs text-on-surface-variant text-center">
            Designed with care for students & graduates in Tunisia
          </span>
        </div>
      </div>

      {/* Sanctuary Stage & Companion Mascot */}
      <div className="relative w-full aspect-[4/4.2] rounded-3xl bg-gradient-to-b from-secondary-fixed/50 via-surface-container-low to-surface-container flex items-center justify-center p-3 shadow-md">
        {/* Ambient glowing halo behind companion */}
        <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-secondary-container/30 to-tertiary-fixed/40 blur-xl" />

        {/* Interactive Companion Mascot Image */}
        <div
          role="button"
          tabIndex={0}
          aria-label="Tap HerCare Companion to interact"
          onClick={handleCompanionTap}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') handleCompanionTap(e as unknown as React.MouseEvent<HTMLDivElement>);
          }}
          className={`relative z-10 w-full h-full flex flex-col items-center justify-center cursor-pointer transition-transform duration-300 ${
            bounce ? 'scale-105' : 'active:scale-95'
          }`}
        >
          <img
            alt="HerCare Mascot"
            className="w-full h-full object-contain filter drop-shadow-lg pointer-events-none select-none"
            src={IMAGES.bunnyMascot}
          />

          {/* Floating animated sparkles */}
          {sparkles.map((s) => (
            <span
              key={s.id}
              className="material-symbols-outlined text-primary-container absolute pointer-events-none animate-ping text-xl"
              style={{ left: s.x, top: s.y }}
            >
              auto_awesome
            </span>
          ))}

          {/* Living Speech Pill */}
          <div className="absolute bottom-2 bg-surface-container-lowest/90 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-1.5 transform transition-all duration-300">
            <span className="material-symbols-outlined text-primary text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
              auto_awesome
            </span>
            <span className="font-semibold text-xs text-secondary">
              {phrases[phraseIdx]}
            </span>
          </div>
        </div>
      </div>

      {/* Content & Value Proposition Block */}
      <div className="flex flex-col items-center text-center px-1 space-y-2.5">
        {/* Brand header with soft sparkle */}
        <div className="inline-flex items-center gap-1.5 text-primary">
          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
            arrow_back_ios_new
          </span>
          <span className="text-xl tracking-wide font-bold">HerCare</span>
          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
            arrow_back_ios_new
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-2xl sm:text-[26px] font-bold text-on-surface leading-tight">
          A little companion.
          <br />
          <span className="text-primary">A little more you.</span>
        </h1>

        {/* Supporting Narrative */}
        <p className="text-sm text-on-surface-variant max-w-[320px] mx-auto pt-1 leading-relaxed">
          Your personal space to breathe, grow, and find your next step — one day at a time.
        </p>
      </div>

      {/* Primary & Secondary Interactive Action Zone */}
      <div className="flex flex-col w-full space-y-3 pt-1">
        {/* Primary CTA */}
        <button
          onClick={() => {
            soundFx.playGentleChime(528);
            onBegin();
          }}
          className="w-full h-14 rounded-full bg-primary-container hover:bg-primary text-white font-semibold flex items-center justify-center gap-2 shadow-lg transition-all duration-200 active:scale-[0.98] cursor-pointer"
          type="button"
        >
          <span className="text-base tracking-wide">Let's begin</span>
          <span className="material-symbols-outlined text-lg">arrow_forward</span>
        </button>

        {/* Secondary Ghost Action */}
        <button
          onClick={onAlreadyAccount}
          className="w-full h-12 rounded-full bg-transparent hover:bg-surface-container text-secondary font-semibold text-sm flex items-center justify-center transition-all duration-150 active:scale-[0.98] cursor-pointer"
          type="button"
        >
          <span>I already have an account</span>
        </button>
      </div>

      {/* Reassurance & Privacy Sanctuary Badges */}
      <div className="flex flex-col items-center space-y-2 pt-2 pb-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container shadow-sm text-center">
          <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
            lock
          </span>
          <span className="text-xs text-on-surface-variant font-medium">
            Your journey is personal. You're in control of your choices.
          </span>
        </div>

        <p className="text-xs text-outline text-center">
          A calm well-being companion created to support your daily student life.
        </p>
      </div>
    </div>
  );
};
