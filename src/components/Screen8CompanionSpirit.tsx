import React from 'react';
import { UserState } from '../types';
import { SpiritType } from '../utils/sanctuaryLogic';
import { soundFx } from '../utils/audioPlayer';

interface Props {
  state: UserState;
  updateState: (fields: Partial<UserState>) => void;
  onBack: () => void;
  onContinue: () => void;
}

export const Screen8CompanionSpirit: React.FC<Props> = ({
  state,
  updateState,
  onBack,
  onContinue
}) => {
  const archetypes: Array<{
    id: SpiritType;
    title: string;
    desc: string;
    quote?: string;
    tag?: string;
    voice?: string;
    icon: string;
  }> = [
    {
      id: 'gentle',
      title: 'The Gentle One',
      desc: 'Soft, caring, and a patient listener.',
      quote: 'We can take this one gentle little step at a time, no rush.',
      tag: 'Deep Empathy',
      voice: 'Calming Breeze',
      icon: 'cloud'
    },
    {
      id: 'playful',
      title: 'The Playful One',
      desc: 'Lighthearted, funny, and full of warmth.',
      quote: 'Okay bestie, let’s make today a little less chaotic!',
      tag: 'Warm Spark',
      voice: 'Cheerful Sun',
      icon: 'sentiment_satisfied'
    },
    {
      id: 'calm',
      title: 'The Calm One',
      desc: 'Grounded, thoughtful, and reassuring.',
      quote: 'Let’s pause for a moment and figure out what matters most.',
      tag: 'Mindful Anchor',
      voice: 'Quiet Stream',
      icon: 'filter_vintage'
    },
    {
      id: 'motivator',
      title: 'The Motivator',
      desc: 'Encouraging, optimistic, and action-oriented.',
      quote: 'You have a starting point. Let’s turn it into one small win.',
      tag: 'Gentle Push',
      voice: 'Bright Dawn',
      icon: 'bolt'
    },
    {
      id: 'dynamic',
      title: 'A Little Bit of Everything',
      desc: 'Let our conversations guide the mood naturally.',
      icon: 'all_inclusive'
    }
  ];

  const handleSelectSpirit = (id: SpiritType) => {
    soundFx.playGentleChime(530);
    soundFx.playSparkle();
    updateState({ spiritType: id });
  };

  return (
    <div className="flex flex-col w-full px-margin pb-10 max-w-md mx-auto pt-2">
      {/* Top Header */}
      <div className="flex items-center justify-between w-full h-12">
        <button
          aria-label="Go Back"
          onClick={onBack}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-surface-container-low text-on-surface hover:bg-surface-container transition-transform active:scale-95 cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </button>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary-fixed text-on-secondary-fixed">
          <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            arrow_back_ios_new
          </span>
          <span className="text-xs font-semibold">Step 7 of 7</span>
        </div>
        <div className="w-12 h-12 flex items-center justify-center text-primary">
          <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            favorite
          </span>
        </div>
      </div>

      {/* Progress Track */}
      <div className="w-full mt-2 mb-4">
        <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
          <div className="bg-primary h-full rounded-full transition-all duration-700 ease-out" style={{ width: '92%' }} />
        </div>
        <div className="flex justify-between items-center mt-1.5 px-0.5 text-xs">
          <span className="text-outline">Almost there</span>
          <span className="text-primary font-bold">92%</span>
        </div>
      </div>

      {/* Title */}
      <section className="flex flex-col w-full mb-5">
        <div className="inline-flex items-center gap-1.5 mb-1">
          <span className="material-symbols-outlined text-primary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            auto_awesome
          </span>
          <span className="text-xs font-bold tracking-wider text-primary uppercase">Companion Spirit</span>
        </div>
        <h1 className="text-2xl font-bold text-on-surface tracking-tight">
          What kind of friend do you need?
        </h1>
        <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
          Your companion adapts to the kind of support you prefer each day. You can change this anytime.
        </p>
      </section>

      {/* Archetype Cards List */}
      <div className="flex flex-col gap-3.5 w-full mb-5" role="radiogroup">
        {archetypes.map((arch) => {
          const isSelected = state.spiritType === arch.id;
          return (
            <div
              key={arch.id}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              onClick={() => handleSelectSpirit(arch.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') handleSelectSpirit(arch.id);
              }}
              className={`relative flex flex-col p-4 rounded-2xl transition-all duration-200 cursor-pointer select-none active:scale-[0.99] ${
                isSelected
                  ? 'bg-surface-container-lowest shadow-md ring-2 ring-primary/40'
                  : 'bg-surface-container-low hover:bg-surface-container'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                      isSelected ? 'bg-primary-fixed text-primary' : 'bg-surface-container-highest text-secondary'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[24px]">{arch.icon}</span>
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-on-surface">{arch.title}</h2>
                    <p className="text-xs text-on-surface-variant mt-0.5">{arch.desc}</p>
                  </div>
                </div>

                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 shadow-sm ${
                    isSelected ? 'bg-primary text-white scale-105' : 'bg-surface-container text-outline'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {isSelected ? 'check' : 'add'}
                  </span>
                </div>
              </div>

              {arch.quote && (
                <div className="mt-3 p-3 rounded-xl bg-surface-container-low text-on-surface flex items-start gap-2">
                  <span className="material-symbols-outlined text-primary text-[16px] shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                    format_quote
                  </span>
                  <p className="text-xs italic text-on-surface leading-relaxed">
                    “{arch.quote}”
                  </p>
                </div>
              )}

              {arch.tag && (
                <div className="flex items-center justify-between mt-3 pt-1">
                  <span className="px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[11px] font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      spa
                    </span>
                    {arch.tag}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (arch.quote) {
                        soundFx.speakText(arch.quote, state.language);
                      } else {
                        soundFx.playGentleChime(528);
                      }
                    }}
                    className="text-[11px] text-primary font-bold flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[14px]">volume_up</span>
                    <span>Voice: {arch.voice}</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Sisterhood Promise Banner */}
      <section className="mb-5 px-4 py-3 rounded-2xl bg-secondary-fixed/50 flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary shrink-0 shadow-sm mt-0.5">
          <span className="material-symbols-outlined text-[18px]">verified_user</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-on-secondary-fixed">HerCare Sisterhood Promise</span>
          <p className="text-xs text-on-secondary-fixed-variant mt-0.5 leading-snug">
            HerCare companions never shame you, guilt-trip you, or create emotional dependency.
          </p>
        </div>
      </section>

      {/* Footer Nav */}
      <footer className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="h-12 px-6 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-bold hover:bg-secondary-fixed-dim transition-all active:scale-[0.98] cursor-pointer"
          type="button"
        >
          Back
        </button>
        <button
          onClick={() => {
            soundFx.playGentleChime(528);
            onContinue();
          }}
          className="h-12 flex-1 rounded-full bg-primary-container text-white text-xs font-bold shadow-md hover:opacity-95 transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
          type="button"
        >
          <span>Meet Your Companion</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </footer>
    </div>
  );
};
