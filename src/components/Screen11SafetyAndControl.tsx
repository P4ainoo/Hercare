import React, { useState } from 'react';
import { UserState } from '../types';
import { IMAGES } from '../constants/assets';
import { soundFx } from '../utils/audioPlayer';

interface Props {
  state: UserState;
  updateState: (fields: Partial<UserState>) => void;
  onBack: () => void;
  onEnterWorld: () => void;
}

export const Screen11SafetyAndControl: React.FC<Props> = ({
  state,
  updateState,
  onBack,
  onEnterWorld
}) => {
  const [activeInfo, setActiveInfo] = useState<'privacy' | 'terms' | null>(null);

  return (
    <div className="flex flex-col w-full px-margin pb-10 max-w-md mx-auto pt-2">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between w-full py-2 mb-2">
        <button
          aria-label="Go back"
          onClick={onBack}
          className="flex items-center justify-center w-12 h-12 rounded-full active:scale-95 transition-transform text-secondary bg-surface-container-low shadow-sm cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back_ios_new</span>
        </button>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary-fixed text-on-secondary-fixed">
          <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            shield
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider">Safety &amp; Control</span>
        </div>
        <div className="w-12 h-12 flex items-center justify-center text-primary">
          <span className="material-symbols-outlined text-[22px]">lock</span>
        </div>
      </div>

      {/* Warm Header Section */}
      <div className="flex flex-col mb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl font-bold text-on-surface">Your space, your choices</span>
          <span className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            arrow_back_ios_new
          </span>
        </div>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          HerCare is built on trust. You decide what to share and how it's used.
        </p>
      </div>

      {/* Companion Aura Visual Anchor */}
      <div className="relative w-full overflow-hidden rounded-2xl bg-surface-container-low p-4 mb-5 shadow-sm">
        <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-secondary-container/40 blur-2xl pointer-events-none" />
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 bg-primary-fixed shadow-inner">
            <img alt="Lumi Celestial" className="w-full h-full object-cover" src={IMAGES.celestialAura} />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-primary">{state.companionName || 'Lumi'} is listening</span>
              <span className="material-symbols-outlined text-primary text-[14px]">favorite</span>
            </div>
            <p className="text-xs text-on-surface-variant line-clamp-2 mt-0.5 leading-snug">
              "Everything here remains in our private haven. Nothing leaves without your gentle nod."
            </p>
          </div>
        </div>
      </div>

      {/* Informative Cards Deck */}
      <div className="flex flex-col gap-3 mb-5">
        <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-surface-container-lowest shadow-sm">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-fixed text-primary shrink-0">
            <span className="material-symbols-outlined text-[20px]">psychology_alt</span>
          </div>
          <div className="flex flex-col min-w-0">
            <h2 className="text-xs font-bold text-on-surface mb-0.5">Personalized Support</h2>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Your answers help HerCare suggest calming exercises and study pacing tailored to your goals.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-surface-container-lowest shadow-sm">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary-fixed text-secondary shrink-0">
            <span className="material-symbols-outlined text-[20px]">tune</span>
          </div>
          <div className="flex flex-col min-w-0">
            <h2 className="text-xs font-bold text-on-surface mb-0.5">Your Companion, Your Way</h2>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Update {state.companionName || 'Lumi'}'s name, tone, language, and theme whenever you want from settings.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-surface-container-lowest shadow-sm">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-tertiary-fixed text-on-tertiary-container shrink-0">
            <span className="material-symbols-outlined text-[20px]">verified_user</span>
          </div>
          <div className="flex flex-col min-w-0">
            <h2 className="text-xs font-bold text-on-surface mb-0.5">Transparent &amp; Private</h2>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Your reflections are encrypted. We never sell your personal thoughts or share them with university administrators.
            </p>
          </div>
        </div>
      </div>

      {/* Consent & Continuity Toggles */}
      <div className="flex flex-col gap-2.5 mb-5">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="material-symbols-outlined text-secondary text-[18px]">toggle_on</span>
          <span className="text-xs font-bold text-secondary uppercase tracking-wider">Preferences &amp; Permissions</span>
        </div>

        {/* Toggle 1: Reflection Continuity */}
        <label className="flex items-start justify-between gap-3 p-3.5 rounded-2xl bg-surface-container-low cursor-pointer select-none transition-colors active:bg-surface-container">
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-xs font-bold text-on-surface">Reflection Continuity</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant">
                Optional
              </span>
            </div>
            <p className="text-xs text-on-surface-variant leading-snug">
              Allow companion to remember my reflection themes for more continuity
            </p>
          </div>
          <input
            type="checkbox"
            checked={state.allowReflectionContinuity}
            onChange={(e) => {
              soundFx.playGentleChime(490);
              updateState({ allowReflectionContinuity: e.target.checked });
            }}
            className="w-5 h-5 mt-1 accent-primary rounded cursor-pointer"
          />
        </label>

        {/* Toggle 2: Gentle Daily Check-in */}
        <label className="flex items-start justify-between gap-3 p-3.5 rounded-2xl bg-surface-container-low cursor-pointer select-none transition-colors active:bg-surface-container">
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-xs font-bold text-on-surface">Gentle Daily Check-in</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant">
                Optional
              </span>
            </div>
            <p className="text-xs text-on-surface-variant leading-snug">
              Gentle daily check-in reminders (tunable quiet hours)
            </p>
          </div>
          <input
            type="checkbox"
            checked={state.allowDailyCheckin}
            onChange={(e) => {
              soundFx.playGentleChime(510);
              updateState({ allowDailyCheckin: e.target.checked });
            }}
            className="w-5 h-5 mt-1 accent-primary rounded cursor-pointer"
          />
        </label>
      </div>

      {/* Non-Clinical Support Note */}
      <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-tertiary-fixed/60 mb-5 shadow-sm">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-tertiary text-white shrink-0">
          <span className="material-symbols-outlined text-[18px]">info</span>
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-bold text-on-tertiary-container mb-0.5">Non-Clinical Support Note</span>
          <p className="text-xs text-on-tertiary-container leading-relaxed">
            HerCare provides non-clinical well-being support and companionship. It is not a substitute for clinical psychiatric care or medical diagnosis.
          </p>
        </div>
      </div>

      {/* Primary Interactive Button */}
      <button
        onClick={() => {
          soundFx.playGentleChime(528);
          soundFx.playSparkle();
          onEnterWorld();
        }}
        className="w-full flex items-center justify-center gap-2 h-12 rounded-full bg-primary-container text-white text-xs font-bold shadow-md active:scale-95 transition-all mb-4 cursor-pointer"
        type="button"
      >
        <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
          arrow_back_ios_new
        </span>
        <span className="text-sm">Enter My World</span>
      </button>

      {/* Legal Sanctuary Links */}
      <div className="flex items-center justify-center gap-3 text-center">
        <button
          onClick={() => setActiveInfo('privacy')}
          className="text-xs text-secondary hover:text-primary transition-colors underline underline-offset-4 py-1 px-1 cursor-pointer"
          type="button"
        >
          Privacy Policy
        </button>
        <span className="w-1 h-1 rounded-full bg-outline-variant" />
        <button
          onClick={() => setActiveInfo('terms')}
          className="text-xs text-secondary hover:text-primary transition-colors underline underline-offset-4 py-1 px-1 cursor-pointer"
          type="button"
        >
          Terms of Sanctuary
        </button>
      </div>

      {/* In-app Privacy & Terms Modal */}
      {activeInfo && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest w-full max-w-sm rounded-3xl p-5 shadow-xl flex flex-col relative max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                {activeInfo === 'privacy' ? 'Privacy Guarantee' : 'Terms of Sanctuary'}
              </span>
              <button
                onClick={() => setActiveInfo(null)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <h2 className="text-base font-bold text-on-surface mb-2">
              {activeInfo === 'privacy' ? 'Your Personal Safe Harbor' : 'HerCare Sanctuary Principles'}
            </h2>
            <div className="text-xs text-on-surface-variant space-y-2 leading-relaxed">
              {activeInfo === 'privacy' ? (
                <>
                  <p>1. <strong>Local & Encrypted:</strong> All daily reflections, stress ratings, and journal entries remain encrypted on your device.</p>
                  <p>2. <strong>Zero University Disclosure:</strong> We never share or sell personal information to universities, administrations, or third-party advertisers.</p>
                  <p>3. <strong>Complete Control:</strong> You can export, reset, or wipe your reflection history at any time from your settings.</p>
                </>
              ) : (
                <>
                  <p>1. <strong>Empathetic Companion:</strong> HerCare offers compassionate daily companionship, pacing tools, and emotional reassurance.</p>
                  <p>2. <strong>Non-Clinical Note:</strong> HerCare is not a substitute for clinical psychological therapy, medical diagnosis, or emergency psychiatric care.</p>
                  <p>3. <strong>Kind Community:</strong> Quiet circles and shared study spaces are built on mutual respect and positive encouragement.</p>
                </>
              )}
            </div>
            <button
              onClick={() => setActiveInfo(null)}
              className="mt-4 w-full py-2.5 rounded-full bg-primary text-white text-xs font-bold cursor-pointer"
            >
              Understood 🌸
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
