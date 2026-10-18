import React from 'react';
import { UserState } from '../types';
import { soundFx } from '../utils/audioPlayer';

interface Props {
  state: UserState;
  updateState: (fields: Partial<UserState>) => void;
  onBack: () => void;
  onNext: () => void;
}

export const Screen3AcademicContext: React.FC<Props> = ({
  state,
  updateState,
  onBack,
  onNext
}) => {
  const stageItems = [
    { id: 'begin', label: 'Beginning my studies', badge: null },
    { id: 'middle', label: 'Somewhere in the middle', badge: null },
    { id: 'final', label: 'Final year', badge: 'Key phase' },
    { id: 'thesis', label: 'Working on thesis / PFE', badge: null }
  ];

  const energyItems = [
    { id: 'exams', label: 'Exams & Revision', badge: 'High intensity' },
    { id: 'pfe', label: 'Thesis or final project (PFE)', badge: null },
    { id: 'balance', label: 'Managing university & personal balance', badge: null },
    { id: 'uncertainty', label: 'Uncertainty about next steps', badge: null }
  ];

  const deadlineItems = [
    { id: '7days', icon: 'schedule', label: 'Within next 7 days', badge: 'Urgent pacing' },
    { id: 'month', icon: 'calendar_today', label: 'Within next month', badge: null },
    { id: 'none', icon: 'spa', label: 'No major deadline', badge: null }
  ];

  const workloadScale = [
    { num: 1, label: 'Very manageable', icon: 'sentiment_very_satisfied' },
    { num: 2, label: 'Manageable', icon: 'sentiment_satisfied' },
    { num: 3, label: 'Moderate', icon: 'sentiment_neutral' },
    { num: 4, label: 'Difficult', icon: 'sentiment_dissatisfied' },
    { num: 5, label: 'Completely overwhelming', icon: 'sentiment_very_dissatisfied' }
  ];

  const timeOptions = ['5 mins', '10–15 mins', '30+ mins', 'Changes daily'];

  return (
    <div className="flex flex-col w-full px-margin pb-10 max-w-md mx-auto pt-2">
      {/* Top Header */}
      <div className="flex items-center justify-between pt-2 pb-2">
        <button
          aria-label="Go back"
          onClick={onBack}
          className="w-12 h-12 -ml-2 rounded-full flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </button>
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface-container-high text-on-surface-variant text-xs font-semibold shadow-sm">
          <span className="material-symbols-outlined text-[15px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
            auto_awesome
          </span>
          <span>Step 3 of 7</span>
        </div>
        <div className="w-10 text-right text-xs font-bold text-primary">42%</div>
      </div>

      {/* Progress Track */}
      <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden p-0.5 mb-3">
        <div
          className="bg-gradient-to-r from-primary-container to-primary h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: '42%' }}
        />
      </div>

      {/* Context Badge & Title */}
      <div className="pt-1 pb-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-secondary text-xs font-semibold mb-2">
          <span className="material-symbols-outlined text-[16px]">school</span>
          <span className="uppercase tracking-wider">ACADEMIC & LIFE CONTEXT</span>
        </div>
        <h1 className="text-2xl font-bold text-on-surface tracking-tight">
          What's happening in your student life?
        </h1>
        <p className="text-sm text-on-surface-variant mt-1 leading-relaxed">
          Let's understand what's taking up your time and energy right now.
        </p>
      </div>

      {/* Safe Sanctuary Note */}
      <div className="p-3.5 rounded-2xl bg-surface-container-low flex items-center gap-3 mb-5 shadow-sm">
        <div className="w-9 h-9 rounded-full bg-primary-fixed flex items-center justify-center text-primary shrink-0">
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            sentiment_satisfied
          </span>
        </div>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          <strong className="font-semibold text-on-surface">Safe Sanctuary note:</strong> No judgments here. This helps your companion pace micro-reflections around your deadlines.
        </p>
      </div>

      {/* Section 1: Academic Stage */}
      <div className="flex flex-col gap-2.5 mb-5">
        <h2 className="text-sm font-bold text-on-surface">1. What stage are you at?</h2>
        <div className="flex flex-col gap-2">
          {stageItems.map((item) => {
            const isSelected = state.academicStage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  soundFx.playGentleChime(480);
                  updateState({ academicStage: item.id });
                }}
                className={`w-full p-3.5 rounded-2xl flex items-center justify-between text-left transition-all active:scale-[0.99] cursor-pointer ${
                  isSelected
                    ? 'bg-secondary-fixed text-on-secondary-fixed shadow-sm'
                    : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-low'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${isSelected ? 'font-semibold text-on-secondary-fixed' : 'font-medium text-on-surface'}`}>
                    {item.label}
                  </span>
                  {item.badge && (
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed">
                      {item.badge}
                    </span>
                  )}
                </div>
                {isSelected ? (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white">
                    <span className="material-symbols-outlined text-[16px]">check</span>
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full bg-surface-container-high" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Section 2: What's taking up most of your energy */}
      <div className="flex flex-col gap-2.5 mb-5">
        <h2 className="text-sm font-bold text-on-surface">2. What's taking up most of your energy right now?</h2>
        <div className="flex flex-col gap-2">
          {energyItems.map((item) => {
            const isSelected = state.energyConsumingTopic === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  soundFx.playGentleChime(500);
                  updateState({ energyConsumingTopic: item.id });
                }}
                className={`w-full p-3.5 rounded-2xl flex items-center justify-between text-left transition-all active:scale-[0.99] cursor-pointer ${
                  isSelected
                    ? 'bg-secondary-fixed text-on-secondary-fixed shadow-sm'
                    : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-low'
                }`}
              >
                <div className="flex flex-col">
                  <span className={`text-sm ${isSelected ? 'font-semibold text-on-secondary-fixed' : 'font-medium text-on-surface'}`}>
                    {item.label}
                  </span>
                  {item.badge && (
                    <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-primary-container text-white w-fit">
                      <span className="material-symbols-outlined text-[12px]">bolt</span>
                      {item.badge}
                    </span>
                  )}
                </div>
                {isSelected ? (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white">
                    <span className="material-symbols-outlined text-[16px]">check</span>
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full bg-surface-container-high" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Section 3: Important Deadline */}
      <div className="flex flex-col gap-2.5 mb-5">
        <h2 className="text-sm font-bold text-on-surface">3. Do you have an important deadline coming up?</h2>
        <div className="flex flex-col gap-2">
          {deadlineItems.map((item) => {
            const isSelected = state.importantDeadline === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  soundFx.playGentleChime(520);
                  updateState({ importantDeadline: item.id });
                }}
                className={`w-full p-3.5 rounded-2xl flex items-center justify-between text-left transition-all active:scale-[0.99] cursor-pointer ${
                  isSelected
                    ? 'bg-secondary-fixed text-on-secondary-fixed shadow-sm'
                    : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-low'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-primary text-[20px]">{item.icon}</span>
                  <span className={`text-sm ${isSelected ? 'font-semibold text-on-secondary-fixed' : 'font-medium text-on-surface'}`}>
                    {item.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {item.badge && (
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-primary text-white">
                      {item.badge}
                    </span>
                  )}
                  {isSelected ? (
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white">
                      <span className="material-symbols-outlined text-[16px]">check</span>
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-surface-container-high" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section 4: Workload Manageability 1-5 */}
      <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm mb-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-on-surface">4. How manageable does your workload feel?</h2>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-error-container text-error">
            {state.workloadScore >= 4 ? 'High Load' : 'Moderate'}
          </span>
        </div>
        <p className="text-xs text-on-surface-variant">
          Point {state.workloadScore} selected:{' '}
          {state.workloadScore >= 4
            ? 'Feeling strained and difficult to keep up.'
            : state.workloadScore === 3
            ? 'Holding steady, pacing myself.'
            : 'Smooth and manageable.'}
        </p>

        {/* 1-5 Rating buttons */}
        <div className="grid grid-cols-5 gap-2 pt-1">
          {workloadScale.map((item) => {
            const isSelected = state.workloadScore === item.num;
            return (
              <button
                key={item.num}
                type="button"
                onClick={() => {
                  soundFx.playGentleChime(400 + item.num * 30);
                  updateState({ workloadScore: item.num });
                }}
                className={`flex flex-col items-center justify-center py-3 rounded-xl transition-all active:scale-95 cursor-pointer ${
                  isSelected
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                <span className="text-xs font-bold mb-1">{item.num}</span>
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              </button>
            );
          })}
        </div>
        <div className="flex justify-between text-[11px] text-outline font-medium px-1">
          <span>Very manageable</span>
          <span>4: Difficult</span>
          <span>Overwhelming</span>
        </div>
      </div>

      {/* Section 5: Daily Time */}
      <div className="flex flex-col gap-2.5 mb-5">
        <h2 className="text-sm font-bold text-on-surface">5. Daily time you can realistically set aside for yourself:</h2>
        <div className="flex flex-wrap gap-2">
          {timeOptions.map((time) => {
            const isSelected = state.dailySelfCareMinutes === time;
            return (
              <button
                key={time}
                type="button"
                onClick={() => {
                  soundFx.playGentleChime(530);
                  updateState({ dailySelfCareMinutes: time });
                }}
                className={`px-4 py-2.5 rounded-full text-xs font-semibold transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-secondary-fixed text-on-secondary-fixed ring-2 ring-primary shadow-sm'
                    : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low'
                }`}
              >
                {isSelected && (
                  <span className="material-symbols-outlined text-[14px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                    auto_awesome
                  </span>
                )}
                <span>{time}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Burnout Recovery Badge */}
      <div className="p-3.5 rounded-2xl bg-tertiary-fixed/40 flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary shrink-0 shadow-sm">
          <span className="material-symbols-outlined text-[18px]">favorite</span>
        </div>
        <p className="text-xs text-on-surface-variant leading-snug">
          Even 10 minutes makes a profound difference in academic burnout recovery.
        </p>
      </div>

      {/* Bottom Nav */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="h-12 px-6 rounded-full bg-surface-container text-secondary font-semibold text-sm flex items-center justify-center transition-transform active:scale-95 hover:bg-surface-container-high cursor-pointer"
          type="button"
        >
          <span>Back</span>
        </button>
        <button
          onClick={() => {
            soundFx.playGentleChime(528);
            onNext();
          }}
          className="flex-1 h-12 px-6 rounded-full bg-primary-container text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md transition-all duration-200 active:scale-98 hover:brightness-105 cursor-pointer"
          type="button"
        >
          <span>Next</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
