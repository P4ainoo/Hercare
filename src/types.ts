import { PaletteThemeKey, SpiritType, MessageFormat, LanguageCode } from './utils/sanctuaryLogic';

export interface UserState {
  journeyType: 'student' | 'graduate';
  name: string;
  ageBracket: string;
  campusOrField: string;
  language: LanguageCode;
  studentStage: 'undergrad' | 'master' | 'phd' | 'pfe';
  academicStage: string;
  energyConsumingTopic: string;
  importantDeadline: string;
  workloadScore: number;
  dailySelfCareMinutes: string;
  helpTopics: string[];
  recentEnergy: string;
  careStyle: 'listen' | 'plan' | 'exercise';
  companionType: 'Bunny-Cat' | 'Cat' | 'Fox' | 'Bear' | 'Panda' | 'Baby Dragon';
  companionName: string;
  paletteTheme: PaletteThemeKey;
  spiritType: SpiritType;
  nicknameType: string;
  messageFormat: MessageFormat;
  focusGoals: string[];
  allowReflectionContinuity: boolean;
  allowDailyCheckin: boolean;
  arrivalEmotion: 'Great' | 'Okay' | 'Stressed' | 'Overwhelmed';
  // Dashboard states
  studySprintMilestone: number;
  totalStudyMilestones: number;
  currentFeeling: string;
  ventingEntries: Array<{
    id: string;
    timestamp: string;
    content: string;
    tag: string;
    aiReframe?: {
      validation: string;
      distortionInsight?: string;
      gentleReframe: string;
      microAction: string;
    };
  }>;
  companionBondLevel: number;
  soundscape?: 'lofi' | 'ocean' | 'rain';
}

export type ScreenId =
  | 'welcome'               // Screen 0
  | 'step1_journey'         // Screen 1: Where are you in your journey?
  | 'step2_get_to_know'     // Screen 2: Let's get to know you
  | 'step3_academic_context'// Screen 3: Academic & life context
  | 'step4_gentle_support'  // Screen 4: What would you like help with?
  | 'step4_companion_pick'  // Screen 5: Let's find your little companion
  | 'step5_companion_name'  // Screen 6: Name your new friend
  | 'step6_color_world'     // Screen 7: Pick colors of your world
  | 'step7_companion_spirit'// Screen 8: What kind of friend do you need?
  | 'tone_and_language'     // Screen 9: Let's make this feel like you
  | 'personal_focus'        // Screen 10: What would you like to work toward?
  | 'safety_and_control'    // Screen 11: Your space, your choices
  | 'meet_companion'        // Screen 12: Meet Lumi! Your sanctuary is ready
  | 'first_moment_checkin'  // Screen 13: How are you arriving today?
  | 'dashboard';            // Screen 14: Sanctuary Home Dashboard
