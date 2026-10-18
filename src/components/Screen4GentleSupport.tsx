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

export const Screen4GentleSupport: React.FC<Props> = ({
  state,
  updateState,
  onBack,
  onNext
}) => {
  const helpOptions = [
    { id: 'exam_stress', title: 'Managing exam stress & calm', icon: 'self_improvement' },
    { id: 'procrastination', title: 'Overcoming procrastination & motivation', icon: 'bolt' },
    { id: 'routine', title: 'Building a gentle daily routine', icon: 'wb_twilight' },
    { id: 'balance', title: 'Balancing studies & personal life', icon: 'balance' },
    { id: 'career_conf', title: 'Career confidence & interview peace', icon: 'psychology_alt' },
    { id: 'vent_space', title: 'Having a safe space to vent & reflect', icon: 'forum' }
  ];

  const energyPills = [
    { id: 'full', label: 'Full of energy' },
    { id: 'okay', label: 'Doing okay' },
    { id: 'drained', label: 'A little drained' },
    { id: 'exhausted', label: 'Exhausted' }
  ];

  const careStyles = [
    {
      id: 'listen' as const,
      title: 'Listen to me first',
      desc: "A compassionate, non-judgmental space to express what's on your mind"
    },
    {
      id: 'plan' as const,
      title: 'Help me make a realistic plan',
      desc: 'Break stressful assignments or daily obligations into small gentle steps'
    },
    {
      id: 'exercise' as const,
      title: 'Suggest quick 3-minute breath & focus exercises',
      desc: 'Simple grounded pauses between revisions or before stepping into class'
    }
  ];

  const toggleHelpTopic = (id: string) => {
    soundFx.playGentleChime(480);
    const exists = state.helpTopics.includes(id);
    const updated = exists ? state.helpTopics.filter((t) => t !== id) : [...state.helpTopics, id];
    updateState({ helpTopics: updated });
  };

  return (
    <div className="flex flex-col w-full px-margin pb-10 max-w-md mx-auto pt-2">
      {/* Top Navigation & Progress */}
      <div className="flex items-center justify-between pt-2 pb-2">
        <button
          aria-label="Go back"
          onClick={onBack}
          className="w-12 h-12 -ml-2 rounded-full flex items-center justify-center text-on-surface hover:bg-surface-container transition-transform active:scale-95 cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-[22px]">arrow_back</span>
        </button>
        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface-container text-secondary text-xs font-semibold">
          <span className="material-symbols-outlined text-[14px]">spa</span>
          <span>Step 4 of 7</span>
        </div>
        <div className="w-10 text-right text-xs font-bold text-primary">56%</div>
      </div>

      <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden p-0.5 mb-3">
        <div className="bg-primary-container h-full rounded-full transition-all duration-500 ease-out" style={{ width: '56%' }} />
      </div>

      {/* Header */}
      <div className="pt-1 pb-3">
        <div className="inline-flex items-center gap-1.5 text-primary text-xs font-semibold uppercase tracking-wider mb-1">
          <span className="material-symbols-outlined text-[16px]">favorite</span>
          <span>GENTLE SUPPORT</span>
        </div>
        <h1 className="text-2xl font-bold text-on-surface leading-tight">
          What would you like a little help with?
        </h1>
        <p className="text-sm text-on-surface-variant mt-1">
          There's no right or wrong answer. Choose whatever feels relevant to you today.
        </p>
      </div>

      {/* Multi-Select Cards */}
      <div className="flex flex-col gap-2.5 mb-5">
        {helpOptions.map((opt) => {
          const isSelected = state.helpTopics.includes(opt.id);
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => toggleHelpTopic(opt.id)}
              className={`w-full text-left p-3.5 rounded-2xl transition-all flex items-center justify-between gap-3 shadow-sm active:scale-[0.99] cursor-pointer ${
                isSelected
                  ? 'bg-secondary-fixed ring-2 ring-primary/40'
                  : 'bg-surface-container-lowest hover:bg-surface-container-low'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                    isSelected ? 'bg-surface-container-lowest text-primary' : 'bg-surface-container text-secondary'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]" style={isSelected ? { fontVariationSettings: "'FILL' 1" } : undefined}>
                    {opt.icon}
                  </span>
                </div>
                <span className={`text-sm truncate ${isSelected ? 'font-semibold text-on-secondary-fixed' : 'font-medium text-on-surface'}`}>
                  {opt.title}
                </span>
              </div>
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                  isSelected ? 'bg-primary text-white shadow-sm' : 'bg-surface-container text-transparent'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">check</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Companion Guide Note Card */}
      <div className="rounded-2xl bg-gradient-to-r from-secondary-fixed to-surface-container-lowest p-3.5 mb-5 flex items-center gap-3.5 shadow-sm">
        <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-surface-container">
          <img alt="Guide companion cat" className="w-full h-full object-cover" src={IMAGES.guideCatPillow} />
        </div>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5 text-primary text-xs font-bold">
            <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
            <span>{state.name || 'Yasmine'}, your guide</span>
          </div>
          <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
            “We adapt our rhythm together. Whatever you select helps create your peaceful space.”
          </p>
        </div>
      </div>

      {/* Follow-up 1: Energy Level */}
      <div className="p-4 rounded-2xl bg-surface-container-lowest shadow-sm mb-5 flex flex-col gap-3">
        <div className="flex flex-col">
          <span className="text-[11px] font-bold uppercase tracking-wider text-secondary">Reflection Moment</span>
          <h2 className="text-base font-bold text-on-surface">How has your energy felt lately?</h2>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {energyPills.map((pill) => {
            const isSelected = state.recentEnergy === pill.id;
            return (
              <button
                key={pill.id}
                type="button"
                onClick={() => {
                  soundFx.playGentleChime(510);
                  updateState({ recentEnergy: pill.id });
                }}
                className={`shrink-0 h-10 px-4 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                }`}
              >
                {isSelected && (
                  <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                )}
                <span>{pill.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Follow-up 2: Care Style */}
      <div className="p-4 rounded-2xl bg-surface-container-lowest shadow-sm mb-5 flex flex-col gap-3">
        <div className="flex flex-col">
          <span className="text-[11px] font-bold uppercase tracking-wider text-secondary">Care Style</span>
          <h2 className="text-base font-bold text-on-surface">How would you prefer HerCare to help?</h2>
        </div>
        <div className="flex flex-col gap-2">
          {careStyles.map((style) => {
            const isSelected = state.careStyle === style.id;
            return (
              <button
                key={style.id}
                type="button"
                onClick={() => {
                  soundFx.playGentleChime(530);
                  updateState({ careStyle: style.id });
                }}
                className={`w-full text-left p-3.5 rounded-2xl transition-colors flex items-start gap-3 shadow-sm active:scale-[0.99] cursor-pointer ${
                  isSelected ? 'bg-secondary-fixed ring-2 ring-primary/40' : 'bg-surface-container-low hover:bg-surface-container'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    isSelected ? 'bg-primary text-white' : 'bg-surface-container-highest'
                  }`}
                >
                  <div className={`w-2.5 h-2.5 rounded-full ${isSelected ? 'bg-white' : 'bg-transparent'}`} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className={`text-sm ${isSelected ? 'font-semibold text-on-secondary-fixed' : 'font-medium text-on-surface'}`}>
                    {style.title}
                  </span>
                  <span className="text-xs text-on-surface-variant mt-0.5 leading-snug">{style.desc}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Reassurance Banner */}
      <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-tertiary-fixed text-on-tertiary-fixed-variant mb-6 shadow-sm">
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-tertiary shrink-0">
          <span className="material-symbols-outlined text-[18px]">lock</span>
        </div>
        <span className="text-xs font-medium">
          Private &amp; safe: No mental health diagnosis is ever required.
        </span>
      </div>

      {/* Bottom Nav */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex-1 h-12 rounded-full bg-surface-container-high text-on-surface font-semibold text-sm flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
          type="button"
        >
          <span>Back</span>
        </button>
        <button
          onClick={() => {
            soundFx.playGentleChime(528);
            onNext();
          }}
          className="flex-[2] h-12 rounded-full bg-primary-container text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95 cursor-pointer"
          type="button"
        >
          <span>Next</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
