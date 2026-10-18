import React from 'react';
import { UserState } from '../types';
import { IMAGES } from '../constants/assets';
import { getArrivalGuidance } from '../utils/sanctuaryLogic';
import { soundFx } from '../utils/audioPlayer';

interface Props {
  state: UserState;
  updateState: (fields: Partial<UserState>) => void;
  onBack: () => void;
  onSelectNextStep: (stepType: 'talk' | 'plan' | 'exercise') => void;
  onEnterSanctuary: () => void;
}

export const Screen13FirstMomentCheckin: React.FC<Props> = ({
  state,
  updateState,
  onBack,
  onSelectNextStep,
  onEnterSanctuary
}) => {
  const emotionalStates: Array<{ id: 'Great' | 'Okay' | 'Stressed' | 'Overwhelmed'; label: string; icon: string }> = [
    { id: 'Great', label: 'Great', icon: 'wb_sunny' },
    { id: 'Okay', label: 'Okay', icon: 'sentiment_satisfied' },
    { id: 'Stressed', label: 'Stressed', icon: 'cyclone' },
    { id: 'Overwhelmed', label: 'Overwhelmed', icon: 'cloud' }
  ];

  const guidance = getArrivalGuidance(state.arrivalEmotion, state.name);

  const handleSelectEmotion = (emotion: 'Great' | 'Okay' | 'Stressed' | 'Overwhelmed') => {
    soundFx.playGentleChime(emotion === 'Great' ? 600 : emotion === 'Okay' ? 528 : 440);
    updateState({ arrivalEmotion: emotion });
  };

  return (
    <div className="flex flex-col w-full px-margin pb-10 max-w-md mx-auto pt-2">
      {/* Top Header */}
      <div className="flex items-center justify-between w-full py-2 mb-2">
        <button
          aria-label="Go Back"
          onClick={onBack}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-surface-container-low text-on-surface hover:bg-surface-container active:scale-95 transition-transform duration-150 cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </button>
        <span className="text-sm font-bold text-on-surface">First Moment Together</span>
        <div className="w-12 h-12 flex items-center justify-center text-primary">
          <span className="material-symbols-outlined text-[22px]">spa</span>
        </div>
      </div>

      {/* Gentle Check-in Badge & Title */}
      <div className="flex flex-col mb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed w-fit text-xs font-semibold mb-2">
          <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            auto_awesome
          </span>
          <span>A Gentle Check-in</span>
        </div>
        <h1 className="text-2xl font-bold text-on-surface tracking-tight mb-1">
          How are you arriving today?
        </h1>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          You don't have to have everything figured out right now.
        </p>
      </div>

      {/* Step Indicator & State Selector */}
      <div className="flex flex-col mb-5">
        <div className="flex justify-between items-center mb-2.5">
          <span className="text-[11px] font-bold text-secondary uppercase tracking-wider">
            Select your emotional state
          </span>
          <span className="text-[11px] font-medium text-outline">Step 1 of 2</span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {emotionalStates.map((em) => {
            const isSelected = state.arrivalEmotion === em.id;
            return (
              <button
                key={em.id}
                type="button"
                onClick={() => handleSelectEmotion(em.id)}
                className={`flex flex-col items-center justify-center py-4 px-2 rounded-2xl transition-all duration-200 active:scale-95 cursor-pointer ${
                  isSelected
                    ? 'bg-primary text-white shadow-md ring-2 ring-primary-container'
                    : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-low shadow-sm'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center mb-1.5 ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-surface-container text-primary'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{em.icon}</span>
                </div>
                <span className="text-xs font-bold truncate">{em.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Responsive Companion dialogue card */}
      <div className="relative bg-surface-container-lowest rounded-3xl p-4 shadow-sm mb-5 border border-surface-container">
        <div className="flex items-start gap-3">
          <div className="relative shrink-0">
            <div className="w-13 h-13 rounded-full overflow-hidden shadow-sm bg-secondary-fixed p-0.5">
              <img alt={state.companionName} className="w-full h-full object-cover rounded-full" src={IMAGES.foxLumi} />
            </div>
            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white text-[10px] shadow-xs">
              <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                favorite
              </span>
            </span>
          </div>

          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-primary">{state.companionName || 'Lumi'} your companion</span>
              <span className="text-[10px] text-on-surface-variant">Just now</span>
            </div>
            <p className="text-xs text-on-surface leading-relaxed italic">
              “{guidance.speech}”
            </p>
          </div>
        </div>
      </div>

      {/* Gentle Next Steps */}
      <div className="flex flex-col gap-2.5 mb-6">
        <span className="text-[11px] font-bold text-secondary uppercase tracking-wider mb-0.5">
          Gentle Next Steps
        </span>

        {/* Step 1: Talk */}
        <button
          onClick={() => {
            soundFx.playGentleChime(528);
            onSelectNextStep('talk');
          }}
          className="w-full p-4 rounded-2xl bg-surface-container-lowest hover:bg-surface-container-low shadow-sm flex items-center justify-between transition-all active:scale-[0.99] cursor-pointer text-left"
          type="button"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary-fixed flex items-center justify-center text-secondary shrink-0">
              <span className="material-symbols-outlined text-[20px]">chat_bubble_outline</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-on-surface">I Just Want to Talk</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-secondary-container/50 text-on-secondary-container w-fit mt-1">
                AI Companion space
              </span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant">
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </div>
        </button>

        {/* Step 2: Plan */}
        <button
          onClick={() => {
            soundFx.playGentleChime(528);
            onSelectNextStep('plan');
          }}
          className="w-full p-4 rounded-2xl bg-surface-container-lowest hover:bg-surface-container-low shadow-sm flex items-center justify-between transition-all active:scale-[0.99] cursor-pointer text-left"
          type="button"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-[20px]">checklist</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-on-surface">Help Me Make a Plan</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant w-fit mt-1">
                Small 10-min step
              </span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant">
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </div>
        </button>

        {/* Step 3: Exercise */}
        <button
          onClick={() => {
            soundFx.playGentleChime(528);
            onSelectNextStep('exercise');
          }}
          className="w-full p-4 rounded-2xl bg-surface-container-lowest hover:bg-surface-container-low shadow-sm flex items-center justify-between transition-all active:scale-[0.99] cursor-pointer text-left"
          type="button"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-tertiary-fixed flex items-center justify-center text-on-tertiary-container shrink-0">
              <span className="material-symbols-outlined text-[20px]">self_improvement</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-on-surface">Let's Try a Short Exercise</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant w-fit mt-1">
                3-min grounding audio
              </span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant">
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </div>
        </button>
      </div>

      {/* Skip to Sanctuary */}
      <div className="flex justify-center mt-2">
        <button
          onClick={() => {
            soundFx.playGentleChime(528);
            onEnterSanctuary();
          }}
          className="text-xs font-semibold text-secondary hover:text-primary transition-colors flex items-center gap-1 py-2 cursor-pointer"
          type="button"
        >
          <span>Skip for now and enter sanctuary</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        </button>
      </div>
    </div>
  );
};
