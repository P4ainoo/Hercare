import React from 'react';
import { UserState } from '../types';
import { COMPANION_OPTIONS } from '../constants/assets';
import { soundFx } from '../utils/audioPlayer';

interface Props {
  state: UserState;
  updateState: (fields: Partial<UserState>) => void;
  onBack: () => void;
  onContinue: () => void;
}

export const Screen5CompanionPick: React.FC<Props> = ({
  state,
  updateState,
  onBack,
  onContinue
}) => {
  const currentCompanion =
    COMPANION_OPTIONS.find((c) => c.type === state.companionType) || COMPANION_OPTIONS[0];

  const handleSelectCompanion = (comp: typeof COMPANION_OPTIONS[number]) => {
    soundFx.playGentleChime(528);
    soundFx.playSparkle();
    updateState({ companionType: comp.type });
  };

  return (
    <div className="flex flex-col w-full px-margin pb-10 max-w-md mx-auto pt-2">
      {/* Top Navigation & Progress Bar */}
      <div className="flex items-center justify-between pt-2 pb-2">
        <button
          aria-label="Go back"
          onClick={onBack}
          className="w-12 h-12 -ml-2 rounded-full flex items-center justify-center text-on-surface hover:bg-surface-container active:scale-95 transition-transform cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </button>
        <div className="bg-secondary-fixed/70 px-3.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
          <span className="material-symbols-outlined text-[15px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
            auto_awesome
          </span>
          <span className="text-xs font-semibold text-on-secondary-fixed">Step 4 of 7</span>
        </div>
        <div className="w-10 text-right text-xs font-bold text-primary">57%</div>
      </div>

      <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden mb-3">
        <div className="h-full bg-primary-container rounded-full transition-all duration-500 ease-out" style={{ width: '57%' }} />
      </div>

      {/* Header Titles */}
      <div className="pt-1 pb-3 text-center">
        <h1 className="text-2xl font-bold text-on-surface tracking-tight">Let's find your little companion</h1>
        <p className="text-xs text-on-surface-variant mt-1 max-w-xs mx-auto">
          Choose a friend who feels like you. You can change your companion anytime.
        </p>
      </div>

      {/* Live Showcase Card */}
      <div className="mb-4">
        <div className="relative bg-gradient-to-b from-secondary-fixed/40 via-surface-container-lowest to-surface-container-lowest rounded-3xl p-5 shadow-lg overflow-hidden flex flex-col items-center">
          {/* Glow effect behind preview avatar */}
          <div className="absolute -top-10 w-44 h-44 bg-primary-fixed/60 rounded-full blur-2xl pointer-events-none" />

          {/* Floating Sparkles */}
          <span className="material-symbols-outlined absolute top-4 left-5 text-secondary text-[20px] opacity-70 animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>
            auto_awesome
          </span>
          <span className="material-symbols-outlined absolute top-7 right-6 text-primary text-[18px] opacity-60" style={{ fontVariationSettings: "'FILL' 1" }}>
            star
          </span>
          <span className="material-symbols-outlined absolute bottom-6 right-5 text-tertiary-fixed-dim text-[16px] opacity-80" style={{ fontVariationSettings: "'FILL' 1" }}>
            favorite
          </span>

          {/* Active Selection Badge */}
          <div className="relative z-10 mb-3 bg-surface-container-lowest/90 px-3.5 py-1 rounded-full shadow-sm flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
            <span className="text-xs font-bold text-primary uppercase tracking-wider">
              Selected: {currentCompanion.type}
            </span>
          </div>

          {/* Preview Image Showcase */}
          <div className="relative z-10 w-40 h-40 rounded-2xl overflow-hidden shadow-md flex items-center justify-center bg-surface-container-low group">
            <img
              alt="Selected companion"
              className="w-full h-full object-cover transition-transform duration-300 scale-105 group-hover:scale-110"
              src={currentCompanion.image}
            />
          </div>

          <p className="relative z-10 mt-3 text-xs text-on-surface-variant text-center italic">
            "{currentCompanion.quote}"
          </p>
        </div>
      </div>

      {/* Companion Selection Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4" role="radiogroup">
        {COMPANION_OPTIONS.map((comp) => {
          const isSelected = state.companionType === comp.type;
          return (
            <button
              key={comp.type}
              type="button"
              onClick={() => handleSelectCompanion(comp)}
              className={`relative text-left p-3.5 rounded-2xl shadow-sm transition-all duration-200 active:scale-95 flex flex-col justify-between h-38 cursor-pointer ${
                isSelected
                  ? 'bg-primary-fixed/20 ring-2 ring-primary shadow-md'
                  : 'bg-surface-container-lowest hover:bg-surface-container-low'
              }`}
            >
              <div className="flex items-start justify-between">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-sm ${
                    isSelected ? 'bg-primary-fixed text-primary' : 'bg-surface-container text-secondary'
                  }`}
                >
                  <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {comp.icon}
                  </span>
                </div>
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shadow-sm ${
                    isSelected ? 'bg-primary text-white' : 'bg-surface-container text-transparent'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">check</span>
                </div>
              </div>

              <div className="mt-2">
                <div className="flex items-center gap-1">
                  <h3 className="font-bold text-sm text-on-surface">{comp.name}</h3>
                  {isSelected && (
                    <span className="material-symbols-outlined text-primary text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      favorite
                    </span>
                  )}
                </div>
                <span
                  className={`inline-block mt-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    isSelected
                      ? 'bg-primary-fixed/60 text-on-primary-fixed-variant'
                      : 'bg-surface-container-high text-on-surface-variant'
                  }`}
                >
                  {comp.trait}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Supportive Comfort Note */}
      <div className="bg-secondary-fixed/40 rounded-2xl p-3.5 flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-full bg-secondary-container shrink-0 flex items-center justify-center text-on-secondary-container">
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            wb_sunny
          </span>
        </div>
        <p className="text-xs text-on-secondary-container leading-snug">
          Each companion brings warm, comforting energy and adapts to your rhythm.
        </p>
      </div>

      {/* Sticky Bottom CTA */}
      <div className="sticky bottom-0 left-0 right-0 py-2 bg-gradient-to-t from-background via-background/95 to-transparent">
        <button
          onClick={() => {
            soundFx.playGentleChime(528);
            onContinue();
          }}
          className="w-full h-14 bg-primary-container text-white rounded-full font-bold text-sm tracking-wide shadow-lg shadow-primary/20 flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.98] transition-transform cursor-pointer"
          type="button"
        >
          <span>This is the one</span>
          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
