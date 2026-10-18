import React from 'react';
import { UserState } from '../types';
import { IMAGES } from '../constants/assets';
import { getCompanionDialogue } from '../utils/sanctuaryLogic';
import { soundFx } from '../utils/audioPlayer';

interface Props {
  state: UserState;
  updateState: (fields: Partial<UserState>) => void;
  onBack: () => void;
  onContinue: () => void;
}

export const Screen9ToneAndLanguage: React.FC<Props> = ({
  state,
  updateState,
  onBack,
  onContinue
}) => {
  const nicknames = [
    state.name || 'Yasmine',
    'Bestie',
    'Habibi / Azizi',
    'My friend',
    'No nickname'
  ];

  const languages = [
    { id: 'en', flag: '🇬🇧', title: 'English', desc: 'Fluent, warm, supportive' },
    { id: 'tn', flag: '🇹🇳', title: 'Tunisian Arabic', badge: 'Local Favorite', desc: '(الدارجة التونسية) • Qrib l qalbek' },
    { id: 'fr', flag: '🇫🇷', title: 'French (Français)', desc: 'Douce, naturelle et bienveillante' },
    { id: 'blend', flag: '✨', title: 'Natural blend', desc: 'Franglais & Derja blending casually' }
  ];

  const formats = [
    {
      id: 'warm' as const,
      icon: 'favorite',
      title: 'Warm conversations',
      desc: 'Gentle, sisterly dialogue that holds space for your emotions and celebrates small wins.'
    },
    {
      id: 'short' as const,
      icon: 'format_list_bulleted',
      title: 'Short & simple bullet points',
      desc: 'Bite-sized, quick-to-read reflections when energy is low or during study breaks.'
    },
    {
      id: 'practical' as const,
      icon: 'lightbulb',
      title: 'Practical actionable advice',
      desc: 'Direct frameworks, coping techniques, and step-by-step career & exam solutions.'
    }
  ];

  const previewDialogue = getCompanionDialogue({
    name: state.nicknameType === 'No nickname' ? '' : state.nicknameType || state.name,
    language: state.language,
    format: state.messageFormat,
    spirit: state.spiritType
  });

  return (
    <div className="flex flex-col w-full px-margin pb-10 max-w-md mx-auto pt-2">
      {/* Top Header */}
      <div className="flex items-center justify-between w-full pt-1 pb-3">
        <button
          aria-label="Go Back"
          onClick={onBack}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-surface-container-low text-on-surface hover:bg-surface-container active:scale-95 transition-transform duration-150 cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back_ios_new</span>
        </button>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary-fixed text-on-secondary-fixed">
          <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            auto_awesome
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider">Step 3 of 4 • Tone &amp; Language</span>
        </div>
        <div className="w-10 flex items-center justify-center text-outline">
          <span className="material-symbols-outlined text-[20px]">help_outline</span>
        </div>
      </div>

      {/* Progress Track */}
      <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden mb-4">
        <div className="bg-primary-container h-full rounded-full transition-all duration-500 ease-out" style={{ width: '75%' }} />
      </div>

      {/* Title */}
      <div className="flex flex-col w-full mb-5">
        <div className="inline-flex items-center gap-1.5 text-primary text-xs font-bold uppercase tracking-wider mb-1">
          <span className="material-symbols-outlined text-[18px]">forum</span>
          <span>Conversational Fit</span>
        </div>
        <h1 className="text-2xl font-bold text-on-surface tracking-tight">
          Let's make this feel like you
        </h1>
        <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
          Choose how you'd like {state.companionName || 'Lumi'} to talk with you through study sessions, stressful mornings, and late reflections.
        </p>
      </div>

      <div className="flex flex-col w-full gap-5">
        {/* Nickname Selection */}
        <section className="flex flex-col w-full gap-2.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-on-surface flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-[18px]">badge</span>
              What should {state.companionName || 'Lumi'} call you?
            </label>
            <span className="text-[11px] text-on-surface-variant">Tap to pick</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {nicknames.map((nick) => {
              const isSelected = state.nicknameType === nick;
              return (
                <button
                  key={nick}
                  type="button"
                  onClick={() => {
                    soundFx.playGentleChime(500);
                    updateState({ nicknameType: nick });
                  }}
                  className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-secondary-fixed text-on-secondary-fixed ring-2 ring-primary'
                      : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low'
                  }`}
                >
                  {isSelected && (
                    <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      arrow_back_ios_new
                    </span>
                  )}
                  <span>{nick}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Language Selection */}
        <section className="flex flex-col w-full gap-2.5">
          <label className="text-sm font-bold text-on-surface flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[18px]">translate</span>
            Which language should we converse in?
          </label>
          <div className="flex flex-col w-full gap-2">
            {languages.map((lang) => {
              const isSelected = state.language === lang.id;
              return (
                <button
                  key={lang.id}
                  type="button"
                  onClick={() => {
                    soundFx.playGentleChime(520);
                    updateState({ language: lang.id as any });
                  }}
                  className={`w-full p-3.5 rounded-2xl text-left flex items-center justify-between shadow-sm transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-secondary-fixed ring-2 ring-primary'
                      : 'bg-surface-container-lowest hover:bg-surface-container-low'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface-container-lowest flex items-center justify-center text-lg shadow-sm">
                      {lang.flag}
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm ${isSelected ? 'font-semibold text-on-secondary-fixed' : 'font-medium text-on-surface'}`}>
                          {lang.title}
                        </span>
                        {lang.badge && (
                          <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-semibold">
                            {lang.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-on-surface-variant">{lang.desc}</span>
                    </div>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      isSelected ? 'bg-primary text-white' : 'bg-surface-container text-transparent'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">check</span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Format Selection */}
        <section className="flex flex-col w-full gap-2.5">
          <label className="text-sm font-bold text-on-surface flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[18px]">chat_bubble_outline</span>
            What kind of messages do you prefer?
          </label>
          <div className="grid grid-cols-1 gap-2.5">
            {formats.map((fmt) => {
              const isSelected = state.messageFormat === fmt.id;
              return (
                <button
                  key={fmt.id}
                  type="button"
                  onClick={() => {
                    soundFx.playGentleChime(535);
                    updateState({ messageFormat: fmt.id });
                  }}
                  className={`w-full p-3.5 rounded-2xl text-left shadow-sm flex items-start gap-3 transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-secondary-fixed ring-2 ring-primary'
                      : 'bg-surface-container-lowest hover:bg-surface-container-low'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm mt-0.5 ${
                      isSelected ? 'bg-primary text-white' : 'bg-surface-container text-primary'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]" style={isSelected ? { fontVariationSettings: "'FILL' 1" } : undefined}>
                      {fmt.icon}
                    </span>
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${isSelected ? 'font-semibold text-on-secondary-fixed' : 'font-medium text-on-surface'}`}>
                        {fmt.title}
                      </span>
                      {isSelected ? (
                        <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                      ) : (
                        <span className="material-symbols-outlined text-transparent text-[20px]">check_circle</span>
                      )}
                    </div>
                    <p className="text-xs text-on-surface-variant mt-1 leading-snug">{fmt.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Live Chat Preview */}
        <section className="flex flex-col w-full gap-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs uppercase tracking-wider text-primary font-bold flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
              Live Chat Preview
            </span>
            <span className="text-xs text-on-surface-variant">Updates in real-time</span>
          </div>

          <div className="w-full bg-surface-container-lowest rounded-3xl p-4 shadow-sm relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-36 h-36 bg-secondary-fixed/50 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-start gap-3.5 relative z-10">
              <div className="relative shrink-0 flex flex-col items-center">
                <div className="w-13 h-13 rounded-full overflow-hidden shadow-sm bg-secondary-fixed ring-2 ring-primary/20 p-0.5">
                  <img alt={state.companionName} className="w-full h-full object-cover rounded-full" src={IMAGES.foxLumi} />
                </div>
                <span className="mt-1 text-xs text-primary font-bold">{state.companionName || 'Lumi'}</span>
              </div>

              <div className="flex-1 flex flex-col items-start">
                <div className="relative bg-secondary-fixed rounded-2xl rounded-tl-sm p-3 text-on-secondary-fixed shadow-sm">
                  <p className="text-xs leading-relaxed whitespace-pre-line">{previewDialogue}</p>
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-surface-container-lowest flex items-center justify-center text-primary shadow-xs">
                    <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                  </span>
                </div>
                <span className="text-[11px] text-on-surface-variant mt-1 pl-1">Just now • Your Sanctuary</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Nav */}
      <div className="w-full pt-6 pb-2 flex items-center gap-3">
        <button
          onClick={onBack}
          className="h-12 px-6 rounded-full text-xs font-bold text-secondary bg-surface-container-high hover:bg-surface-container active:scale-95 transition-all duration-150 flex items-center justify-center cursor-pointer"
          type="button"
        >
          Back
        </button>
        <button
          onClick={() => {
            soundFx.playGentleChime(528);
            onContinue();
          }}
          className="h-12 flex-1 rounded-full text-xs font-bold text-white bg-primary-container shadow-md hover:opacity-95 active:scale-98 transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer"
          type="button"
        >
          <span>Continue to Focus Areas</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
