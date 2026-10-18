import React, { useState } from 'react';
import { UserState } from '../types';
import { IMAGES } from '../constants/assets';
import { PALETTE_THEMES, getCompanionDialogue } from '../utils/sanctuaryLogic';
import { soundFx } from '../utils/audioPlayer';

interface Props {
  state: UserState;
  onMeetProperly: () => void;
  onChangeChoices: () => void;
}

export const Screen12MeetCompanion: React.FC<Props> = ({
  state,
  onMeetProperly,
  onChangeChoices
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [podBounce, setPodBounce] = useState(false);

  const themeObj = PALETTE_THEMES[state.paletteTheme] || PALETTE_THEMES.lavender;

  const handleListen = () => {
    setIsPlayingAudio(true);
    soundFx.speakText(customDialogue, state.language, () => {
      setIsPlayingAudio(false);
    });
  };

  const handleTapCompanion = () => {
    soundFx.playSparkle();
    setPodBounce(true);
    setTimeout(() => setPodBounce(false), 300);
  };

  const customDialogue = getCompanionDialogue({
    name: state.name || 'Yasmine',
    language: state.language,
    format: state.messageFormat,
    spirit: state.spiritType
  });

  return (
    <div className="flex flex-col w-full relative px-margin pb-10 max-w-md mx-auto pt-2 select-none">
      {/* Ambient Atmospheric Halos */}
      <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-secondary-fixed/50 blur-3xl -z-10" />
      <div className="pointer-events-none absolute top-48 left-8 w-44 h-44 rounded-full bg-tertiary-fixed/40 blur-2xl -z-10" />

      {/* Top Utilities Bar */}
      <header className="flex items-center justify-between py-2 mb-2 w-full">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed shadow-sm">
          <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            spa
          </span>
          <span className="text-xs font-semibold tracking-wide">Your Sanctuary is Ready</span>
        </div>
        <button
          aria-label="Settings"
          onClick={onChangeChoices}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container-low text-on-surface-variant active:scale-95 transition-transform duration-150 cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]">tune</span>
        </button>
      </header>

      {/* Companion Centerpiece Stage */}
      <section className="relative flex flex-col items-center justify-center mt-1 mb-4">
        {/* Tactile floating sparkles */}
        <div className="absolute -top-1 left-10 text-primary-container animate-pulse">
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            arrow_back_ios_new
          </span>
        </div>
        <div className="absolute top-12 right-8 text-secondary-container">
          <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            auto_awesome
          </span>
        </div>
        <div className="absolute bottom-20 left-6 text-tertiary-container/80">
          <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            favorite
          </span>
        </div>
        <div className="absolute bottom-24 right-8 text-primary-container">
          <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            star
          </span>
        </div>

        {/* Companion Portrait with Radial Soft Halo */}
        <div className="relative w-60 h-60 flex items-center justify-center">
          <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-secondary-fixed via-surface-container-low to-tertiary-fixed shadow-inner opacity-90" />
          <div
            role="button"
            tabIndex={0}
            onClick={handleTapCompanion}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') handleTapCompanion();
            }}
            className={`relative z-10 w-52 h-52 rounded-full overflow-hidden p-1 shadow-lg bg-surface-container-lowest transition-transform duration-300 ease-out cursor-pointer ${
              podBounce ? 'scale-105 rotate-3' : 'active:scale-95'
            }`}
          >
            <img
              alt={state.companionName}
              className="w-full h-full object-cover rounded-full"
              src={IMAGES.foxLumi}
            />
          </div>
          {/* Small companion mood chip */}
          <div className="absolute bottom-1 right-10 z-20 px-2.5 py-1 rounded-full bg-surface-container-lowest shadow-md flex items-center gap-1.5 text-on-surface">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
            <span className="text-[11px] font-semibold text-secondary">Listening</span>
          </div>
        </div>

        {/* Companion Name & Identity */}
        <div className="text-center mt-2">
          <div className="inline-flex items-center justify-center gap-1.5">
            <h1 className="text-2xl font-bold text-on-surface">Meet {state.companionName || 'Lumi'}!</h1>
            <span className="material-symbols-outlined text-primary text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              magic_button
            </span>
          </div>
          <p className="text-xs text-on-surface-variant mt-0.5">Your gentle companion is ready to walk with you.</p>
        </div>
      </section>

      {/* Speech Bubble Dialogue Card */}
      <section className="relative bg-surface-container-lowest rounded-2xl p-4 shadow-sm mb-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-[18px]">sentiment_satisfied</span>
          </div>
          <div className="flex-1">
            <p className="text-xs text-on-surface leading-relaxed">
              “{customDialogue}”
            </p>
          </div>
        </div>

        <div className="mt-3 pt-3 flex items-center justify-between text-on-surface-variant border-t border-surface-container">
          <span className="text-xs text-secondary flex items-center gap-1 font-medium">
            <span className="material-symbols-outlined text-[14px]">local_cafe</span> Made for your pace
          </span>
          <button
            aria-label="Listen to voice greeting"
            onClick={handleListen}
            className="flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container-low text-on-surface active:bg-secondary-fixed transition-colors cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[15px]">
              {isPlayingAudio ? 'graphic_eq' : 'volume_up'}
            </span>
            <span className="text-xs font-semibold">{isPlayingAudio ? 'Speaking...' : 'Listen'}</span>
          </button>
        </div>
      </section>

      {/* Personalization Summary Chips */}
      <section className="mb-5">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Tuned to you</span>
          <span className="text-xs text-primary font-bold flex items-center gap-0.5">
            <span className="material-symbols-outlined text-[14px]">check_circle</span>
            Synced
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {/* Theme */}
          <div className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-surface-container-low text-center shadow-sm">
            <span className="text-[11px] text-on-surface-variant">Theme</span>
            <span className="text-xs text-on-surface font-semibold mt-0.5 truncate w-full">
              {themeObj.name}
            </span>
          </div>
          {/* Spirit */}
          <div className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-surface-container-low text-center shadow-sm">
            <span className="text-[11px] text-on-surface-variant">Spirit</span>
            <span className="text-xs text-on-surface font-semibold mt-0.5 truncate w-full capitalize">
              The {state.spiritType} One
            </span>
          </div>
          {/* Language */}
          <div className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-surface-container-low text-center shadow-sm">
            <span className="text-[11px] text-on-surface-variant">Language</span>
            <span className="text-xs text-on-surface font-semibold mt-0.5 truncate w-full uppercase">
              {state.language === 'tn' ? 'Derja' : state.language === 'blend' ? 'Derja & EN' : state.language}
            </span>
          </div>
        </div>
      </section>

      {/* Action CTA Area */}
      <footer className="flex flex-col items-center gap-2.5 w-full mt-auto">
        <button
          onClick={() => {
            soundFx.playGentleChime(528);
            onMeetProperly();
          }}
          className="w-full h-12 rounded-full bg-primary text-white text-xs font-bold shadow-md flex items-center justify-center gap-2 active:scale-95 transition-transform duration-150 cursor-pointer"
          type="button"
        >
          <span>Let’s Meet Properly</span>
          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
        </button>

        <button
          onClick={onChangeChoices}
          className="h-9 px-4 rounded-full text-secondary text-xs font-semibold hover:bg-surface-container-low active:scale-95 transition-all flex items-center justify-center gap-1 cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-[15px]">tune</span>
          <span>Change my choices</span>
        </button>
      </footer>
    </div>
  );
};
