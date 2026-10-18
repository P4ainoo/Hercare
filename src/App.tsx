/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserState, ScreenId } from './types';
import { PALETTE_THEMES } from './utils/sanctuaryLogic';
import { ScreenSwitcher } from './components/ScreenSwitcher';
import { Screen0Welcome } from './components/Screen0Welcome';
import { Screen1Journey } from './components/Screen1Journey';
import { Screen2GetToKnow } from './components/Screen2GetToKnow';
import { Screen3AcademicContext } from './components/Screen3AcademicContext';
import { Screen4GentleSupport } from './components/Screen4GentleSupport';
import { Screen5CompanionPick } from './components/Screen5CompanionPick';
import { Screen6CompanionName } from './components/Screen6CompanionName';
import { Screen7ColorSanctuary } from './components/Screen7ColorSanctuary';
import { Screen8CompanionSpirit } from './components/Screen8CompanionSpirit';
import { Screen9ToneAndLanguage } from './components/Screen9ToneAndLanguage';
import { Screen10PersonalFocus } from './components/Screen10PersonalFocus';
import { Screen11SafetyAndControl } from './components/Screen11SafetyAndControl';
import { Screen12MeetCompanion } from './components/Screen12MeetCompanion';
import { Screen13FirstMomentCheckin } from './components/Screen13FirstMomentCheckin';
import { Screen14HomeDashboard } from './components/Screen14HomeDashboard';

const INITIAL_STATE: UserState = {
  journeyType: 'student',
  name: 'Yasmine',
  ageBracket: '21–24',
  campusOrField: 'INSAT, Université de Tunis',
  language: 'en',
  studentStage: 'master',
  academicStage: 'final',
  energyConsumingTopic: 'exams',
  importantDeadline: '7days',
  workloadScore: 4,
  dailySelfCareMinutes: '10–15 mins',
  helpTopics: ['exam_stress', 'procrastination', 'routine'],
  recentEnergy: 'drained',
  careStyle: 'listen',
  companionType: 'Bunny-Cat',
  companionName: 'Lumi',
  paletteTheme: 'lavender',
  spiritType: 'gentle',
  nicknameType: 'Yasmine',
  messageFormat: 'warm',
  focusGoals: ['overwhelmed', 'routine'],
  allowReflectionContinuity: false,
  allowDailyCheckin: false,
  arrivalEmotion: 'Overwhelmed',
  studySprintMilestone: 1,
  totalStudyMilestones: 3,
  currentFeeling: 'Anxious',
  ventingEntries: [],
  companionBondLevel: 4
};

export default function App() {
  const [userState, setUserState] = useState<UserState>(() => {
    try {
      const saved = localStorage.getItem('hercare_user_state');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_STATE;
  });

  const [currentScreen, setCurrentScreen] = useState<ScreenId>(() => {
    // Check URL parameters (e.g. ?autostart=1 or ?screen=dashboard)
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('autostart') === '1' || params.get('screen') === 'dashboard') {
        return 'dashboard';
      }
      const requestedScreen = params.get('screen') as ScreenId;
      if (requestedScreen) return requestedScreen;
    }
    return 'welcome';
  });

  // Persist state
  useEffect(() => {
    try {
      localStorage.setItem('hercare_user_state', JSON.stringify(userState));
    } catch {
      // ignore
    }
  }, [userState]);

  const updateState = (fields: Partial<UserState>) => {
    setUserState((prev) => ({ ...prev, ...fields }));
  };

  const themeObj = PALETTE_THEMES[userState.paletteTheme] || PALETTE_THEMES.lavender;

  // Apply CSS color variables dynamically
  const dynamicThemeStyles = {
    '--theme-primary': themeObj.primary,
    '--theme-primary-container': themeObj.primaryContainer,
    '--theme-secondary': themeObj.secondary,
    '--theme-secondary-container': themeObj.secondaryContainer,
    '--theme-secondary-fixed': themeObj.secondaryFixed,
    '--theme-bg': themeObj.bg,
    '--theme-surface': themeObj.surface
  } as React.CSSProperties;

  return (
    <div
      style={dynamicThemeStyles}
      className="min-h-screen bg-surface font-body text-on-surface antialiased flex flex-col pt-safe pb-safe"
    >
      {/* Top Screen Switcher for seamless testing and demonstration */}
      <ScreenSwitcher currentScreen={currentScreen} onSelectScreen={setCurrentScreen} />

      {/* Screen Router */}
      <main className="flex-1 flex flex-col relative w-full">
        {currentScreen === 'welcome' && (
          <Screen0Welcome
            onBegin={() => setCurrentScreen('step1_journey')}
            onAlreadyAccount={() => setCurrentScreen('dashboard')}
          />
        )}

        {currentScreen === 'step1_journey' && (
          <Screen1Journey
            journeyType={userState.journeyType}
            onSelectJourney={(type) => updateState({ journeyType: type })}
            onBack={() => setCurrentScreen('welcome')}
            onContinue={() => setCurrentScreen('step2_get_to_know')}
          />
        )}

        {currentScreen === 'step2_get_to_know' && (
          <Screen2GetToKnow
            state={userState}
            updateState={updateState}
            onBack={() => setCurrentScreen('step1_journey')}
            onNext={() => setCurrentScreen('step3_academic_context')}
          />
        )}

        {currentScreen === 'step3_academic_context' && (
          <Screen3AcademicContext
            state={userState}
            updateState={updateState}
            onBack={() => setCurrentScreen('step2_get_to_know')}
            onNext={() => setCurrentScreen('step4_gentle_support')}
          />
        )}

        {currentScreen === 'step4_gentle_support' && (
          <Screen4GentleSupport
            state={userState}
            updateState={updateState}
            onBack={() => setCurrentScreen('step3_academic_context')}
            onNext={() => setCurrentScreen('step4_companion_pick')}
          />
        )}

        {currentScreen === 'step4_companion_pick' && (
          <Screen5CompanionPick
            state={userState}
            updateState={updateState}
            onBack={() => setCurrentScreen('step4_gentle_support')}
            onContinue={() => setCurrentScreen('step5_companion_name')}
          />
        )}

        {currentScreen === 'step5_companion_name' && (
          <Screen6CompanionName
            state={userState}
            updateState={updateState}
            onBack={() => setCurrentScreen('step4_companion_pick')}
            onNext={() => setCurrentScreen('step6_color_world')}
          />
        )}

        {currentScreen === 'step6_color_world' && (
          <Screen7ColorSanctuary
            state={userState}
            updateState={updateState}
            onBack={() => setCurrentScreen('step5_companion_name')}
            onContinue={() => setCurrentScreen('step7_companion_spirit')}
          />
        )}

        {currentScreen === 'step7_companion_spirit' && (
          <Screen8CompanionSpirit
            state={userState}
            updateState={updateState}
            onBack={() => setCurrentScreen('step6_color_world')}
            onContinue={() => setCurrentScreen('tone_and_language')}
          />
        )}

        {currentScreen === 'tone_and_language' && (
          <Screen9ToneAndLanguage
            state={userState}
            updateState={updateState}
            onBack={() => setCurrentScreen('step7_companion_spirit')}
            onContinue={() => setCurrentScreen('personal_focus')}
          />
        )}

        {currentScreen === 'personal_focus' && (
          <Screen10PersonalFocus
            state={userState}
            updateState={updateState}
            onBack={() => setCurrentScreen('tone_and_language')}
            onContinue={() => setCurrentScreen('safety_and_control')}
          />
        )}

        {currentScreen === 'safety_and_control' && (
          <Screen11SafetyAndControl
            state={userState}
            updateState={updateState}
            onBack={() => setCurrentScreen('personal_focus')}
            onEnterWorld={() => setCurrentScreen('meet_companion')}
          />
        )}

        {currentScreen === 'meet_companion' && (
          <Screen12MeetCompanion
            state={userState}
            onMeetProperly={() => setCurrentScreen('first_moment_checkin')}
            onChangeChoices={() => setCurrentScreen('step6_color_world')}
          />
        )}

        {currentScreen === 'first_moment_checkin' && (
          <Screen13FirstMomentCheckin
            state={userState}
            updateState={updateState}
            onBack={() => setCurrentScreen('meet_companion')}
            onSelectNextStep={(type) => {
              if (type === 'talk') setCurrentScreen('dashboard');
              else if (type === 'plan') setCurrentScreen('dashboard');
              else setCurrentScreen('dashboard');
            }}
            onEnterSanctuary={() => setCurrentScreen('dashboard')}
          />
        )}

        {currentScreen === 'dashboard' && (
          <Screen14HomeDashboard
            state={userState}
            updateState={updateState}
            onOpenSettings={() => setCurrentScreen('step6_color_world')}
            onRevisitOnboarding={() => setCurrentScreen('welcome')}
          />
        )}
      </main>
    </div>
  );
}
