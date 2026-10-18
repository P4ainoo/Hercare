import React from 'react';
import { UserState } from '../types';
import { soundFx } from '../utils/audioPlayer';

interface Props {
  state: UserState;
  updateState: (fields: Partial<UserState>) => void;
  onBack: () => void;
  onContinue: () => void;
}

export const Screen10PersonalFocus: React.FC<Props> = ({
  state,
  updateState,
  onBack,
  onContinue
}) => {
  const maxSelect = 3;

  const goalOptions = [
    {
      id: 'overwhelmed',
      title: 'Feel less overwhelmed by my workload',
      subtitle: 'Break large syllabus tasks into soft micro-steps',
      icon: 'psychology'
    },
    {
      id: 'routine',
      title: 'Build a manageable study routine',
      subtitle: 'Honor your circadian rhythm without marathon all-nighters',
      icon: 'schedule'
    },
    {
      id: 'exams',
      title: 'Prepare for exams without neglecting myself',
      subtitle: 'Nourishing snacks, steady pauses, and emotional safety',
      icon: 'self_improvement'
    },
    {
      id: 'thesis',
      title: 'Make steady progress on my thesis / PFE',
      subtitle: 'Gentle pacing and accountability without paralyzing panic',
      icon: 'edit_note'
    },
    {
      id: 'rest',
      title: 'Create space for guilt-free rest & hobbies',
      subtitle: 'Unplug completely without the nagging inner critic',
      icon: 'palette'
    },
    {
      id: 'oneday',
      title: 'Take things one day at a time',
      subtitle: 'Quiet post-graduation uncertainties and future anxiety',
      icon: 'filter_vintage'
    },
    {
      id: 'triggers',
      title: 'Understand what triggers my stress',
      subtitle: 'Discover emotional cues and somatic signals with warmth',
      icon: 'lightbulb'
    }
  ];

  const handleToggleGoal = (id: string) => {
    soundFx.playGentleChime(510);
    const exists = state.focusGoals.includes(id);
    if (exists) {
      updateState({ focusGoals: state.focusGoals.filter((g) => g !== id) });
    } else {
      if (state.focusGoals.length >= maxSelect) {
        soundFx.playGentleChime(350);
        return;
      }
      updateState({ focusGoals: [...state.focusGoals, id] });
    }
  };

  return (
    <div className="flex flex-col w-full px-margin pb-10 max-w-md mx-auto pt-2">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between mb-3 pt-1">
        <button
          aria-label="Go back"
          onClick={onBack}
          className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-transform active:scale-95 cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-[22px]">arrow_back</span>
        </button>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center gap-1.5 shadow-sm text-xs font-semibold">
            <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              spa
            </span>
            <span>Personal Focus</span>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${
              state.focusGoals.length === maxSelect
                ? 'bg-secondary-container text-on-secondary-container'
                : 'bg-primary-container/30 text-on-primary-container'
            }`}
          >
            {state.focusGoals.length} of {maxSelect} selected
          </div>
        </div>
      </div>

      {/* Intro */}
      <div className="w-full mb-4">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="material-symbols-outlined text-primary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            auto_awesome
          </span>
          <span className="text-xs font-semibold text-secondary tracking-wider uppercase">Step 3 of 4</span>
        </div>
        <h1 className="text-2xl font-bold text-on-surface tracking-tight mb-1">
          What would you like to work toward?
        </h1>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          Pick up to three areas you'd like gentle support with right now.
        </p>
      </div>

      {/* Companion Tip Card */}
      <div className="w-full p-3.5 mb-4 rounded-2xl bg-gradient-to-r from-secondary-fixed/40 via-surface-container-low to-primary-fixed/30 flex items-start gap-3 shadow-sm">
        <div className="w-9 h-9 rounded-full bg-primary-container text-white flex items-center justify-center shrink-0 shadow-sm">
          <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            favorite
          </span>
        </div>
        <div className="flex flex-col min-w-0">
          <div className="text-xs text-on-primary-container font-semibold">A reminder from your companion</div>
          <div className="text-xs text-on-surface-variant mt-0.5 leading-snug">
            There are no wrong choices. Tune in to what your mind needs this semester.
          </div>
        </div>
      </div>

      {/* Goals Container */}
      <div className="w-full flex flex-col gap-2.5 mb-5" role="group">
        {goalOptions.map((opt) => {
          const isSelected = state.focusGoals.includes(opt.id);
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleToggleGoal(opt.id)}
              className={`w-full text-left p-3.5 rounded-2xl transition-all duration-200 flex items-center justify-between gap-3 shadow-sm active:scale-[0.99] cursor-pointer ${
                isSelected
                  ? 'bg-primary-container/20 ring-2 ring-primary/40'
                  : 'bg-surface-container-lowest hover:bg-surface-container-low'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors shadow-sm ${
                    isSelected ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{opt.icon}</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-on-surface leading-snug">{opt.title}</span>
                  <span className="text-[11px] text-on-surface-variant mt-0.5">{opt.subtitle}</span>
                </div>
              </div>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all shadow-sm ${
                  isSelected ? 'bg-primary text-white' : 'bg-surface-container text-transparent'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">check</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Reassuring note */}
      <div className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-surface-container-low mb-5">
        <span className="material-symbols-outlined text-secondary text-[18px] shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
          cottage
        </span>
        <p className="text-xs text-on-surface-variant">
          You can update your focus areas at any time in your sanctuary.
        </p>
      </div>

      {/* Bottom CTA */}
      <div className="w-full flex flex-col gap-2.5">
        <button
          onClick={() => {
            soundFx.playGentleChime(528);
            onContinue();
          }}
          disabled={state.focusGoals.length === 0}
          className="w-full h-14 rounded-full bg-primary-container text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
          type="button"
        >
          <span>Create My Experience</span>
          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
        </button>
        <div className="w-full text-center px-4">
          <p className="text-xs text-outline flex items-center justify-center gap-1.5 leading-snug">
            <span className="material-symbols-outlined text-[15px] text-secondary">verified_user</span>
            HerCare offers gentle daily pacing, not rigid targets or pressure.
          </p>
        </div>
      </div>
    </div>
  );
};
