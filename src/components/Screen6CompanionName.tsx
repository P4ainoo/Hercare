import React from 'react';
import { UserState } from '../types';
import { IMAGES } from '../constants/assets';
import { soundFx } from '../utils/audioPlayer';

interface Props {
  state: UserState;
  updateState: (fields: Partial<UserState>) => void;
  onBack: () => void;
  onNext: () => void;
}

export const Screen6CompanionName: React.FC<Props> = ({
  state,
  updateState,
  onBack,
  onNext
}) => {
  const suggestedNames = ['Lumi', 'Mochi', 'Rosie', 'Poppy', 'Bao', 'Luna', 'Fifi'];

  const handlePickName = (name: string) => {
    soundFx.playGentleChime(520);
    soundFx.playSparkle();
    updateState({ companionName: name });
  };

  return (
    <div className="flex flex-col w-full px-margin pb-10 max-w-md mx-auto pt-2">
      {/* Top Navigation & Progress */}
      <div className="flex items-center justify-between pt-2 pb-2">
        <button
          aria-label="Go back"
          onClick={onBack}
          className="w-12 h-12 -ml-2 rounded-full flex items-center justify-center text-on-surface hover:bg-surface-container active:scale-95 transition-transform cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </button>
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary-fixed text-on-secondary-fixed shadow-sm">
          <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            auto_awesome
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider">Step 5 of 7</span>
        </div>
        <div className="w-10 text-right text-xs font-bold text-primary">71%</div>
      </div>

      <div className="w-full h-2 rounded-full bg-surface-container-highest overflow-hidden mb-3">
        <div className="h-full rounded-full bg-primary transition-all duration-500 ease-out" style={{ width: '71%' }} />
      </div>

      {/* Companion Stage with Ambient Halo & Sparkles */}
      <div className="relative flex flex-col items-center justify-center py-2 mb-2">
        <div className="absolute w-56 h-56 rounded-full bg-gradient-to-tr from-secondary-container/40 via-primary-fixed/30 to-surface-bright filter blur-2xl pointer-events-none -z-10" />

        {/* Decorative sparkles */}
        <div className="absolute -top-1 left-12 animate-pulse text-primary-container">
          <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
            auto_awesome
          </span>
        </div>
        <div className="absolute top-6 right-10 animate-bounce text-secondary delay-150">
          <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
            star
          </span>
        </div>
        <div className="absolute bottom-4 left-10 text-tertiary-fixed-dim">
          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
            favorite
          </span>
        </div>

        {/* Companion Portrait Frame */}
        <div className="relative w-40 h-40 rounded-3xl p-2 bg-surface-container-lowest shadow-md flex items-center justify-center overflow-hidden">
          <img
            alt={state.companionName}
            className="w-full h-full object-cover rounded-2xl transform transition-transform duration-700 hover:scale-105"
            src={IMAGES.foxLumi}
          />
          {/* Ambient Companion State Badge */}
          <div className="absolute bottom-2 right-2 bg-surface-container-lowest/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
            <span className="inline-block w-2 h-2 rounded-full bg-primary animate-ping" />
            <span className="text-[11px] text-secondary font-semibold">Awake &amp; Cozy</span>
          </div>
        </div>
      </div>

      {/* Section Typography */}
      <div className="text-center px-1 mb-4">
        <h1 className="text-2xl font-bold text-on-surface tracking-tight mb-1">
          What should we call your new friend?
        </h1>
        <p className="text-xs text-on-surface-variant max-w-xs mx-auto">
          Every great friendship starts with a name. You can always change it later.
        </p>
      </div>

      {/* Name Input Card */}
      <div className="w-full rounded-2xl bg-surface-container-lowest p-4 shadow-sm mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-secondary" htmlFor="companionNameInput">
            <span className="material-symbols-outlined text-[16px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
              favorite
            </span>
            <span>Companion Name</span>
          </label>
          <span className="text-[11px] text-on-surface-variant/80">3-12 letters</span>
        </div>

        <div className="relative flex items-center w-full rounded-2xl bg-surface-container-low px-4 py-3 transition-all focus-within:bg-surface-container-lowest focus-within:ring-2 focus-within:ring-primary/40">
          <input
            id="companionNameInput"
            maxLength={14}
            className="w-full bg-transparent text-xl font-bold text-on-surface outline-none placeholder:text-outline"
            placeholder="Type a sweet name..."
            type="text"
            value={state.companionName}
            onChange={(e) => updateState({ companionName: e.target.value })}
          />
          <div className="flex items-center gap-1.5 pl-2">
            <span className="px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed text-xs font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                auto_awesome
              </span>
              <span>Sweet</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-3 pt-1">
          <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
          <p className="text-xs text-on-surface-variant">
            Meet <strong className="font-semibold text-primary">{state.companionName || 'Lumi'}</strong>, your personal well-being companion.
          </p>
        </div>
      </div>

      {/* Suggested Name Chips */}
      <div className="flex flex-col gap-2 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-on-surface-variant">Popular gentle names:</span>
          <span className="text-[11px] font-semibold text-secondary flex items-center gap-0.5">
            <span className="material-symbols-outlined text-[13px]">touch_app</span> Tap to pick
          </span>
        </div>
        <div className="flex flex-wrap gap-2 pt-0.5">
          {suggestedNames.map((name) => {
            const isSelected = state.companionName.toLowerCase() === name.toLowerCase();
            return (
              <button
                key={name}
                type="button"
                onClick={() => handlePickName(name)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-primary-container text-white shadow-sm ring-2 ring-primary/40'
                    : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                {isSelected && (
                  <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    star
                  </span>
                )}
                <span>{name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Companion Trait Preview */}
      <div className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm mb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="material-symbols-outlined text-secondary text-[18px]">psychology</span>
          <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider">Companion Trait Preview</h3>
        </div>
        <p className="text-xs text-on-surface-variant mb-3 leading-relaxed">
          Tailored to nurture your academic rhythm and gentle emotional recovery.
        </p>
        <div className="flex flex-wrap gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-semibold">
            <span className="material-symbols-outlined text-[16px]">hearing</span>
            <span>Kind Listener</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-xs font-semibold">
            <span className="material-symbols-outlined text-[16px]">sentiment_satisfied</span>
            <span>Soft Encourager</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-fixed text-on-primary-fixed text-xs font-semibold">
            <span className="material-symbols-outlined text-[16px]">school</span>
            <span>Tunisian Student Ally</span>
          </div>
        </div>
      </div>

      {/* Reassurance Footnote */}
      <div className="flex items-center justify-center gap-1.5 mb-5 text-center px-4">
        <span className="material-symbols-outlined text-outline text-[16px]">lock_reset</span>
        <p className="text-xs text-on-surface-variant">
          You can change {state.companionName || 'Lumi'}'s name anytime in sanctuary settings.
        </p>
      </div>

      {/* Nav */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={onBack}
          className="col-span-1 h-12 rounded-full bg-surface-container text-xs font-bold text-secondary flex items-center justify-center hover:bg-surface-container-high transition-transform active:scale-95 cursor-pointer"
          type="button"
        >
          Back
        </button>
        <button
          onClick={() => {
            soundFx.playGentleChime(528);
            onNext();
          }}
          className="col-span-2 h-12 rounded-full bg-primary-container text-xs font-bold text-white flex items-center justify-center gap-2 shadow-md hover:brightness-105 transition-transform active:scale-95 cursor-pointer"
          type="button"
        >
          <span>Next</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
