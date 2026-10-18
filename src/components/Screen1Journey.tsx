import React from 'react';
import { IMAGES } from '../constants/assets';
import { soundFx } from '../utils/audioPlayer';

interface Props {
  journeyType: 'student' | 'graduate';
  onSelectJourney: (type: 'student' | 'graduate') => void;
  onBack: () => void;
  onContinue: () => void;
}

export const Screen1Journey: React.FC<Props> = ({
  journeyType,
  onSelectJourney,
  onBack,
  onContinue
}) => {
  return (
    <div className="flex flex-col w-full px-margin pb-10 max-w-md mx-auto pt-2">
      {/* Top Navigation & Progress Bar */}
      <div className="flex items-center justify-between pt-2 pb-2">
        <button
          aria-label="Go back"
          onClick={onBack}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-surface-container active:scale-95 transition-transform text-on-surface cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </button>
        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface-container-high">
          <span className="material-symbols-outlined text-[16px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
            arrow_back_ios_new
          </span>
          <span className="font-semibold text-xs text-on-surface-variant uppercase tracking-wider">
            Step 1 of 7
          </span>
        </div>
        <div className="w-12 h-12 flex items-center justify-center">
          <span className="text-sm font-bold text-primary">14%</span>
        </div>
      </div>

      {/* Progress Bar Line */}
      <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden mt-1 mb-5">
        <div className="bg-primary h-full rounded-full transition-all duration-500 ease-out" style={{ width: '14%' }} />
      </div>

      {/* Header Headline & Supportive Warmth */}
      <div className="flex flex-col gap-1 mb-5">
        <div className="inline-flex items-center gap-1.5 text-secondary">
          <span className="material-symbols-outlined text-[18px]">favorite</span>
          <span className="font-semibold text-xs uppercase tracking-wider">Personal Sanctuary Setup</span>
        </div>
        <h1 className="text-2xl font-bold text-on-surface">Where are you in your journey?</h1>
        <p className="text-sm text-on-surface-variant">
          We'll personalize HerCare around what life looks like for you right now.
        </p>
      </div>

      {/* Selection Cards Stack */}
      <div aria-label="Journey Stage Selection" className="flex flex-col gap-4" role="radiogroup">
        {/* Card A: Student */}
        <div
          aria-checked={journeyType === 'student'}
          role="radio"
          tabIndex={0}
          onClick={() => {
            soundFx.playGentleChime(440);
            onSelectJourney('student');
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') onSelectJourney('student');
          }}
          className={`relative flex flex-col p-4 rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden ${
            journeyType === 'student'
              ? 'bg-surface-container-lowest shadow-md ring-2 ring-primary-container'
              : 'bg-surface-container-low hover:bg-surface-container'
          }`}
        >
          {/* Ambient Glow Layer */}
          {journeyType === 'student' && (
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-secondary-container/30 rounded-full blur-2xl pointer-events-none" />
          )}
          <div className="flex items-start justify-between gap-2 mb-2 z-10">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed text-xs font-semibold">
              <span className="material-symbols-outlined text-[14px]">auto_stories</span>
              Study &amp; well-being
            </span>
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-white shadow-sm transition-transform ${
                journeyType === 'student' ? 'bg-primary scale-100' : 'bg-surface-container-high text-transparent scale-90'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">check</span>
            </div>
          </div>

          {/* Card Image Visual */}
          <div className="w-full h-36 rounded-xl overflow-hidden mb-3 bg-surface-container relative">
            <img
              alt="Student study sanctuary"
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
              src={IMAGES.studentDesk}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>

          <div className="flex flex-col z-10">
            <h2 className="text-lg font-bold text-on-surface flex items-center gap-1.5">
              I'm a student
              <span className="text-primary text-[16px] material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                school
              </span>
            </h2>
            <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
              For university life, exams, deadlines, thesis stress, and finding balance in your daily routine.
            </p>
          </div>

          {/* Quick perks tags */}
          <div className="flex flex-wrap gap-1.5 mt-2.5 z-10">
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant">
              Exam Calm
            </span>
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant">
              Study Timers
            </span>
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant">
              Dorm Life
            </span>
          </div>
        </div>

        {/* Card B: Graduated */}
        <div
          aria-checked={journeyType === 'graduate'}
          role="radio"
          tabIndex={0}
          onClick={() => {
            soundFx.playGentleChime(493.88);
            onSelectJourney('graduate');
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') onSelectJourney('graduate');
          }}
          className={`relative flex flex-col p-4 rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden ${
            journeyType === 'graduate'
              ? 'bg-surface-container-lowest shadow-md ring-2 ring-primary-container'
              : 'bg-surface-container-low hover:bg-surface-container'
          }`}
        >
          {journeyType === 'graduate' && (
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-tertiary-fixed/30 rounded-full blur-2xl pointer-events-none" />
          )}
          <div className="flex items-start justify-between gap-2 mb-2 z-10">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-xs font-semibold">
              <span className="material-symbols-outlined text-[14px]">work_outline</span>
              Career &amp; well-being
            </span>
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-white shadow-sm transition-transform ${
                journeyType === 'graduate' ? 'bg-primary scale-100' : 'bg-surface-container-high text-transparent scale-90'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">check</span>
            </div>
          </div>

          <div className="w-full h-36 rounded-xl overflow-hidden mb-3 bg-surface-container relative">
            <img
              alt="Graduate workspace desk"
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
              src={IMAGES.graduateDesk}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>

          <div className="flex flex-col z-10">
            <h2 className="text-lg font-bold text-on-surface flex items-center gap-1.5">
              I've graduated
              <span className="text-tertiary text-[16px] material-symbols-outlined">explore</span>
            </h2>
            <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
              For job hunting, career uncertainty, new beginnings, and finding your direction post-college.
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5 mt-2.5 z-10">
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant">
              Career Transition
            </span>
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant">
              Post-Grad Identity
            </span>
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant">
              First Job Tips
            </span>
          </div>
        </div>
      </div>

      {/* Reassurance Note */}
      <div className="flex items-center gap-2.5 p-3 rounded-xl bg-surface-container mt-4 text-on-surface-variant">
        <span className="material-symbols-outlined text-primary text-[20px] shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
          sentiment_satisfied
        </span>
        <p className="text-xs">
          You can always change your journey later in your sanctuary settings.
        </p>
      </div>

      {/* Primary Sticky Bottom Action */}
      <div className="sticky bottom-0 left-0 right-0 pt-4 pb-2 mt-4 bg-gradient-to-t from-surface via-surface/90 to-transparent">
        <button
          onClick={() => {
            soundFx.playGentleChime(528);
            onContinue();
          }}
          className="w-full h-12 flex items-center justify-center gap-2 rounded-full bg-primary-container text-on-primary font-semibold text-sm shadow-md active:scale-[0.98] hover:shadow-lg transition-all duration-200 cursor-pointer"
          type="button"
        >
          <span>Continue</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
