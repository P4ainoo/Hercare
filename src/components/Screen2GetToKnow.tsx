import React from 'react';
import { UserState } from '../types';
import { soundFx } from '../utils/audioPlayer';

interface Props {
  state: UserState;
  updateState: (fields: Partial<UserState>) => void;
  onBack: () => void;
  onNext: () => void;
}

export const Screen2GetToKnow: React.FC<Props> = ({
  state,
  updateState,
  onBack,
  onNext
}) => {
  const ageOptions = ['Under 18', '18–20', '21–24', '25–29', '30+', 'Prefer not to say'];

  const languageOptions = [
    { id: 'tn', flag: '🇹🇳', title: 'Tunisian Arabic', subtitle: 'Derja (الدارجة التونسية)' },
    { id: 'fr', flag: '🇫🇷', title: 'French', subtitle: 'Français' },
    { id: 'en', flag: '🇬🇧', title: 'English', subtitle: 'International' },
    { id: 'msa', flag: '🇸🇦', title: 'Modern Standard Arabic', subtitle: 'العربية الفصحى' },
    { id: 'blend', flag: '✨', title: 'A natural mix of languages', subtitle: 'Franglais & Derja blending' }
  ];

  const stageOptions = [
    {
      id: 'undergrad',
      icon: 'local_library',
      title: 'Undergraduate student',
      subtitle: 'License 1, 2, or 3'
    },
    {
      id: 'master',
      icon: 'psychology',
      title: "Master's / Engineering student",
      subtitle: "Cycle d'ingénieur or Master degree"
    },
    {
      id: 'phd',
      icon: 'science',
      title: 'PhD student / Researcher',
      subtitle: 'Doctorate, lab work & publications'
    },
    {
      id: 'pfe',
      icon: 'flag',
      title: 'Preparing final project / PFE',
      subtitle: 'Graduation defense & career transition'
    }
  ];

  return (
    <div className="flex flex-col w-full px-margin pb-10 max-w-md mx-auto pt-2">
      {/* Progress Header & Step Navigation */}
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
          <span>Step 2 of 7</span>
        </div>
        <div className="w-10 text-right text-xs font-bold text-primary">29%</div>
      </div>

      {/* Progress Track */}
      <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden p-0.5 mb-3">
        <div
          className="bg-gradient-to-r from-primary-container to-primary h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: '28.5%' }}
        />
      </div>

      {/* Editorial Headline */}
      <div className="pt-2 pb-3">
        <div className="inline-flex items-center gap-2 mb-1 text-secondary">
          <span className="material-symbols-outlined text-[18px]">spa</span>
          <span className="font-semibold text-xs uppercase tracking-wider">A Safe Sanctuary</span>
        </div>
        <h1 className="text-2xl font-bold text-on-surface tracking-tight">Let's get to know you</h1>
        <p className="text-sm text-on-surface-variant mt-1 leading-relaxed">
          Just a few gentle details to make your journaling and reflection feel like home.
        </p>
      </div>

      {/* Form Journey */}
      <div className="flex flex-col gap-4">
        {/* Q1: Preferred Name */}
        <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-sm text-on-surface flex items-center gap-1.5" htmlFor="preferred-name">
              <span>What should we call you?</span>
              <span className="text-error text-xs">*</span>
            </label>
            <span className="material-symbols-outlined text-primary-container text-[20px]">favorite</span>
          </div>
          <div className="relative w-full">
            <input
              id="preferred-name"
              className="w-full h-12 px-4 rounded-xl bg-surface-container-low text-on-surface text-base outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/40 transition-all duration-200"
              placeholder="e.g., Yasmine, Nour, Sarah..."
              type="text"
              value={state.name}
              onChange={(e) => updateState({ name: e.target.value })}
            />
            <span
              className="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 text-primary text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              arrow_back_ios_new
            </span>
          </div>
          <p className="text-xs text-on-surface-variant">Your first name, a cute nickname, or whatever brings you peace.</p>
        </div>

        {/* Q2: Age Bracket */}
        <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm text-on-surface">How old are you?</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant">Optional</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 -mx-1 px-1 no-scrollbar" role="radiogroup">
            {ageOptions.map((age) => {
              const isSelected = state.ageBracket === age;
              return (
                <button
                  key={age}
                  type="button"
                  onClick={() => {
                    soundFx.playGentleChime(460);
                    updateState({ ageBracket: age });
                  }}
                  className={`px-4 py-2.5 rounded-full text-xs font-semibold shrink-0 transition-transform active:scale-95 cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-primary-container text-on-primary-container shadow-sm'
                      : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  {isSelected && (
                    <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                  )}
                  <span>{age}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Q3: Campus / Work */}
        <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-sm text-on-surface" htmlFor="study-place">
              Where are you studying or starting your career?
            </label>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant">Optional</span>
          </div>
          <div className="relative w-full">
            <input
              id="study-place"
              className="w-full h-12 px-4 rounded-xl bg-surface-container-low text-on-surface text-sm outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/40 transition-all duration-200"
              placeholder="e.g. INSAT, Université de Tunis, or field of work"
              type="text"
              value={state.campusOrField}
              onChange={(e) => updateState({ campusOrField: e.target.value })}
            />
            <span className="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 text-tertiary-container text-[20px]">
              school
            </span>
          </div>
        </div>

        {/* Q4: Language */}
        <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm flex flex-col gap-2.5">
          <div className="flex flex-col">
            <span className="font-semibold text-sm text-on-surface">Which language feels most natural to you?</span>
            <span className="text-xs text-on-surface-variant mt-0.5">Pick how your virtual companion chats with you.</span>
          </div>
          <div className="grid grid-cols-1 gap-2 pt-1" role="radiogroup">
            {languageOptions.map((lang) => {
              const isSelected = state.language === lang.id;
              return (
                <button
                  key={lang.id}
                  type="button"
                  onClick={() => {
                    soundFx.playGentleChime(500);
                    updateState({ language: lang.id as any });
                  }}
                  className={`w-full p-3.5 rounded-xl flex items-center justify-between transition-all active:scale-[0.99] cursor-pointer text-left ${
                    isSelected
                      ? 'bg-secondary-fixed text-on-secondary-fixed shadow-sm'
                      : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{lang.flag}</span>
                    <div className="flex flex-col text-left">
                      <span className={`text-sm ${isSelected ? 'font-semibold text-on-secondary-fixed' : 'font-medium text-on-surface'}`}>
                        {lang.title}
                      </span>
                      <span className={`text-xs ${isSelected ? 'text-on-secondary-fixed-variant' : 'text-on-surface-variant'}`}>
                        {lang.subtitle}
                      </span>
                    </div>
                  </div>
                  {isSelected ? (
                    <span className="material-symbols-outlined text-[22px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                  ) : (
                    <span className="material-symbols-outlined text-[20px] text-outline opacity-40">
                      radio_button_unchecked
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Q5: Student stage */}
        <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm flex flex-col gap-2.5">
          <div className="flex flex-col">
            <span className="font-semibold text-sm text-on-surface">Which option best describes your current situation?</span>
            <span className="text-xs text-on-surface-variant mt-0.5">We personalize stress trackers and semester checkpoints.</span>
          </div>
          <div className="grid grid-cols-1 gap-2.5 pt-1" role="radiogroup">
            {stageOptions.map((stage) => {
              const isSelected = state.studentStage === stage.id;
              return (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => {
                    soundFx.playGentleChime(520);
                    updateState({ studentStage: stage.id as any });
                  }}
                  className={`w-full p-3.5 rounded-xl flex items-center gap-3.5 text-left transition-all active:scale-[0.99] cursor-pointer ${
                    isSelected
                      ? 'bg-secondary-fixed text-on-secondary-fixed shadow-sm'
                      : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-primary text-white' : 'bg-surface-container text-secondary'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]" style={isSelected ? { fontVariationSettings: "'FILL' 1" } : undefined}>
                      {stage.icon}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${isSelected ? 'font-semibold text-on-secondary-fixed' : 'font-medium text-on-surface'}`}>
                      {stage.title}
                    </p>
                    <p className={`text-xs truncate ${isSelected ? 'text-on-secondary-fixed-variant' : 'text-on-surface-variant'}`}>
                      {stage.subtitle}
                    </p>
                  </div>
                  {isSelected ? (
                    <span className="material-symbols-outlined text-[22px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                  ) : (
                    <span className="material-symbols-outlined text-[20px] text-outline opacity-40">
                      radio_button_unchecked
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Safe Harbor Privacy Note */}
        <div className="px-3 py-3 rounded-xl bg-surface-container-high flex items-start gap-2.5">
          <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
            shield
          </span>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            <strong className="font-semibold text-on-surface">Your safe harbor:</strong> We never ask for your government ID or exact address. All personal reflections are privately encrypted.
          </p>
        </div>

        {/* Bottom Navigation */}
        <div className="pt-2 pb-6 flex items-center gap-3">
          <button
            onClick={onBack}
            className="h-12 px-6 rounded-full bg-surface-container text-secondary font-semibold text-sm flex items-center justify-center gap-1.5 transition-transform active:scale-95 hover:bg-surface-container-high cursor-pointer"
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
    </div>
  );
};
