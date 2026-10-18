import React, { useState } from 'react';
import { ScreenId } from '../types';

interface Props {
  currentScreen: ScreenId;
  onSelectScreen: (screen: ScreenId) => void;
}

export const ScreenSwitcher: React.FC<Props> = ({ currentScreen, onSelectScreen }) => {
  const [isOpen, setIsOpen] = useState(false);

  const screens: Array<{ id: ScreenId; label: string; step: string }> = [
    { id: 'welcome', label: 'Welcome / Sanctuary Intro', step: 'Cover' },
    { id: 'step1_journey', label: '1. Journey: Student vs Graduate', step: 'Step 1' },
    { id: 'step2_get_to_know', label: '2. Get to Know You', step: 'Step 2' },
    { id: 'step3_academic_context', label: '3. Academic & Life Context', step: 'Step 3' },
    { id: 'step4_gentle_support', label: '4. Gentle Support Needs', step: 'Step 4' },
    { id: 'step4_companion_pick', label: '5. Find Your Companion', step: 'Mascot' },
    { id: 'step5_companion_name', label: '6. Name Your Friend (Lumi)', step: 'Step 5' },
    { id: 'step6_color_world', label: '7. Color Sanctuary Palette', step: 'Step 6' },
    { id: 'step7_companion_spirit', label: '8. Companion Spirit Archetype', step: 'Step 7' },
    { id: 'tone_and_language', label: '9. Tone & Language Live Fit', step: 'Tone' },
    { id: 'personal_focus', label: '10. Personal Focus Goals', step: 'Focus' },
    { id: 'safety_and_control', label: '11. Safety, Privacy & Control', step: 'Privacy' },
    { id: 'meet_companion', label: '12. Meet Lumi! Ready Showcase', step: 'Ready' },
    { id: 'first_moment_checkin', label: '13. First Moment Check-in', step: 'Check-in' },
    { id: 'dashboard', label: '14. Home Sanctuary Dashboard', step: 'Home' }
  ];

  return (
    <div className="relative z-50">
      <div className="flex items-center justify-between px-3 py-1.5 bg-surface-container/70 backdrop-blur-sm border-b border-surface-container-high text-xs">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 font-semibold text-secondary hover:text-primary transition-colors cursor-pointer py-1 px-2 rounded-lg bg-surface-container-lowest shadow-xs"
          type="button"
          aria-expanded={isOpen}
          aria-label="Toggle screen navigation selector"
        >
          <span className="material-symbols-outlined text-[16px]">devices</span>
          <span>Screen Jumper ({screens.findIndex((s) => s.id === currentScreen) + 1}/15)</span>
          <span className="material-symbols-outlined text-[14px]">
            {isOpen ? 'expand_less' : 'expand_more'}
          </span>
        </button>

        <span className="text-[11px] text-outline font-medium">🇹🇳 HerCare Sanctuary</span>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-surface-container-lowest/98 backdrop-blur-md shadow-xl border-b border-surface-container-high p-3 max-h-72 overflow-y-auto max-w-md mx-auto">
          <div className="flex justify-between items-center mb-2 px-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary">All 15 Screens</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-xs text-outline hover:text-on-surface cursor-pointer"
            >
              Close
            </button>
          </div>
          <div className="grid grid-cols-1 gap-1">
            {screens.map((s, idx) => {
              const isCurrent = s.id === currentScreen;
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    onSelectScreen(s.id);
                    setIsOpen(false);
                  }}
                  className={`text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                    isCurrent
                      ? 'bg-secondary-fixed text-on-secondary-fixed font-bold'
                      : 'hover:bg-surface-container-low text-on-surface'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-surface-container flex items-center justify-center text-[10px] font-bold text-secondary">
                      {idx + 1}
                    </span>
                    <span>{s.label}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-container text-outline">
                    {s.step}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
