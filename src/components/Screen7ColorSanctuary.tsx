import React from 'react';
import { UserState } from '../types';
import { PALETTE_THEMES, PaletteThemeKey } from '../utils/sanctuaryLogic';
import { soundFx } from '../utils/audioPlayer';

interface Props {
  state: UserState;
  updateState: (fields: Partial<UserState>) => void;
  onBack: () => void;
  onContinue: () => void;
}

export const Screen7ColorSanctuary: React.FC<Props> = ({
  state,
  updateState,
  onBack,
  onContinue
}) => {
  const themesList = Object.values(PALETTE_THEMES);
  const activeTheme = PALETTE_THEMES[state.paletteTheme] || PALETTE_THEMES.lavender;

  const handleSelectTheme = (id: PaletteThemeKey) => {
    soundFx.playGentleChime(540);
    updateState({ paletteTheme: id });
  };

  return (
    <div className="flex flex-col w-full px-margin pb-10 max-w-md mx-auto pt-2">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between w-full py-2">
        <button
          aria-label="Go back"
          onClick={onBack}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-surface-container text-on-surface hover:bg-surface-container-high transition-all active:scale-95 cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-primary">arrow_back</span>
        </button>
        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface-container text-primary">
          <span className="material-symbols-outlined text-[16px]">arrow_back_ios_new</span>
          <span className="text-xs font-semibold tracking-wide uppercase">Step 6 of 7</span>
        </div>
        <div className="w-12 h-12 flex items-center justify-center">
          <span className="text-xs font-bold text-outline">85%</span>
        </div>
      </div>

      <div className="w-full bg-surface-container rounded-full h-1.5 mb-4 overflow-hidden">
        <div className="bg-primary h-full rounded-full transition-all duration-500 ease-out" style={{ width: '85%' }} />
      </div>

      {/* Header */}
      <div className="flex flex-col mb-4">
        <div className="inline-flex items-center gap-1.5 text-primary mb-1">
          <span className="material-symbols-outlined text-[18px]">palette</span>
          <span className="text-xs uppercase tracking-wider font-bold">Color Sanctuary</span>
        </div>
        <h1 className="text-2xl font-bold text-on-surface mb-1">Pick the colors of your world</h1>
        <p className="text-xs text-on-surface-variant">Choose a palette that makes you feel comfortable, grounded, and calm.</p>
      </div>

      {/* Palette Grid */}
      <div className="grid grid-cols-2 gap-3 mb-5" id="palette-grid" role="radiogroup">
        {themesList.map((theme) => {
          const isSelected = state.paletteTheme === theme.id;
          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => handleSelectTheme(theme.id)}
              className={`flex flex-col text-left p-3.5 rounded-2xl bg-surface-container-lowest transition-all duration-200 relative overflow-hidden cursor-pointer active:scale-[0.98] ${
                isSelected ? 'shadow-md ring-2 ring-primary/40' : 'shadow-sm hover:bg-surface-container-low'
              }`}
            >
              {/* Check Pill */}
              <div
                className={`absolute top-2.5 right-2.5 w-6 h-6 rounded-full flex items-center justify-center text-white shadow-sm transition-transform ${
                  isSelected ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                }`}
                style={{ backgroundColor: theme.primary }}
              >
                <span className="material-symbols-outlined text-[15px] font-bold">check</span>
              </div>

              {/* Color dots */}
              <div className="flex items-center gap-1.5 mb-2.5">
                <span className="w-5 h-5 rounded-full shadow-inner" style={{ backgroundColor: theme.bg }} />
                <span className="w-5 h-5 rounded-full shadow-inner" style={{ backgroundColor: theme.primaryContainer }} />
                <span className="w-5 h-5 rounded-full shadow-inner" style={{ backgroundColor: theme.accent }} />
              </div>

              {/* Mini Preview Box */}
              <div className="w-full rounded-xl p-2.5 mb-2.5 shadow-sm transition-colors" style={{ backgroundColor: theme.lightCard }}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="w-10 h-1.5 rounded-full opacity-40" style={{ backgroundColor: theme.accent }} />
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: theme.primaryContainer }} />
                </div>
                <div
                  className="w-full py-1 rounded-lg text-center text-[11px] text-white font-semibold shadow-xs"
                  style={{ backgroundColor: theme.primaryContainer }}
                >
                  Breathe
                </div>
              </div>

              <span className="text-sm text-on-surface font-bold truncate mb-0.5">{theme.name}</span>
              <span className="text-[11px] text-secondary truncate">{theme.tagline}</span>

              {isSelected && (
                <div className="absolute inset-x-0 bottom-0 h-1 rounded-full" style={{ backgroundColor: theme.primary }} />
              )}
            </button>
          );
        })}
      </div>

      {/* Companion Sanctuary Preview Banner */}
      <div className="w-full p-4 rounded-2xl bg-surface-container-low shadow-sm flex items-center gap-3.5 mb-4">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm transition-colors duration-300"
          style={{ backgroundColor: activeTheme.bg }}
        >
          <span className="material-symbols-outlined text-[20px]" style={{ color: activeTheme.accent }}>
            auto_awesome
          </span>
        </div>
        <div className="flex flex-col flex-1 min-w-0">
          <span className="text-[11px] uppercase tracking-wider text-outline font-bold">Companion Sanctuary</span>
          <p className="text-xs text-on-surface font-medium truncate">
            Current preview: <span style={{ color: activeTheme.primary, fontWeight: 700 }}>{activeTheme.name}</span> is active.
          </p>
        </div>
      </div>

      <div className="flex justify-center mb-5">
        <button
          onClick={onContinue}
          className="text-xs text-on-surface-variant hover:text-primary transition-colors py-1.5 px-4 rounded-full active:scale-95 cursor-pointer"
          type="button"
        >
          I'll choose later
        </button>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center gap-3 w-full">
        <button
          onClick={onBack}
          className="w-24 h-12 rounded-full bg-surface-container text-on-surface text-xs font-semibold flex items-center justify-center hover:bg-surface-container-high transition-all active:scale-95 cursor-pointer"
          type="button"
        >
          Back
        </button>
        <button
          onClick={() => {
            soundFx.playGentleChime(528);
            onContinue();
          }}
          className="flex-1 h-12 rounded-full text-white text-xs font-bold shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
          style={{ backgroundColor: activeTheme.primaryContainer }}
          type="button"
        >
          <span>Save Palette &amp; Continue</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
