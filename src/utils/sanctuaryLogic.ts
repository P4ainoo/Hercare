/**
 * Pure application logic for HerCare sanctuary, pacing calculations,
 * and companion adaptation algorithms.
 */

export type LanguageCode = 'en' | 'tn' | 'fr' | 'msa' | 'blend';
export type SpiritType = 'gentle' | 'playful' | 'calm' | 'motivator' | 'dynamic';
export type MessageFormat = 'warm' | 'short' | 'practical';
export type PaletteThemeKey = 'lavender' | 'pink' | 'blue' | 'mint' | 'peach' | 'yellow';

export interface ThemeDefinition {
  id: PaletteThemeKey;
  name: string;
  tagline: string;
  primary: string;
  primaryContainer: string;
  secondary: string;
  secondaryContainer: string;
  secondaryFixed: string;
  accent: string;
  bg: string;
  surface: string;
  lightCard: string;
}

export const PALETTE_THEMES: Record<PaletteThemeKey, ThemeDefinition> = {
  lavender: {
    id: 'lavender',
    name: 'Lavender Dream',
    tagline: 'Calming & Intuitive',
    primary: '#684fa7',
    primaryContainer: '#a58be8',
    secondary: '#685392',
    secondaryContainer: '#d0b8fe',
    secondaryFixed: '#ebddff',
    accent: '#65508E',
    bg: '#fdf9f5',
    surface: '#fdf9f5',
    lightCard: '#F8F5FF'
  },
  pink: {
    id: 'pink',
    name: 'Soft Pink',
    tagline: 'Warm & Nurturing',
    primary: '#9e3f6a',
    primaryContainer: '#ef91b6',
    secondary: '#853e5e',
    secondaryContainer: '#ffd8e6',
    secondaryFixed: '#ffe5ef',
    accent: '#873C60',
    bg: '#fdf8f9',
    surface: '#fdf8f9',
    lightCard: '#FFF5F8'
  },
  blue: {
    id: 'blue',
    name: 'Sky Blue',
    tagline: 'Peaceful & Clear',
    primary: '#315b86',
    primaryContainer: '#83b8ef',
    secondary: '#3d638c',
    secondaryContainer: '#d3e7fc',
    secondaryFixed: '#e2f1ff',
    accent: '#315B86',
    bg: '#f8fafc',
    surface: '#f8fafc',
    lightCard: '#F4F9FF'
  },
  mint: {
    id: 'mint',
    name: 'Mint Garden',
    tagline: 'Fresh & Restorative',
    primary: '#286a54',
    primaryContainer: '#81d7b5',
    secondary: '#2e6b57',
    secondaryContainer: '#c6f2df',
    secondaryFixed: '#ddf8ed',
    accent: '#286A54',
    bg: '#f8fcf9',
    surface: '#f8fcf9',
    lightCard: '#F3FCF8'
  },
  peach: {
    id: 'peach',
    name: 'Peach Bloom',
    tagline: 'Cozy & Cheerful',
    primary: '#8a4a32',
    primaryContainer: '#f3ac88',
    secondary: '#8a513b',
    secondaryContainer: '#fed8c7',
    secondaryFixed: '#ffe9dc',
    accent: '#8A4A32',
    bg: '#fdfaf8',
    surface: '#fdfaf8',
    lightCard: '#FFF8F4'
  },
  yellow: {
    id: 'yellow',
    name: 'Butter Yellow',
    tagline: 'Gentle & Radiant',
    primary: '#79621a',
    primaryContainer: '#f2d56e',
    secondary: '#7a6725',
    secondaryContainer: '#fced9a',
    secondaryFixed: '#fff5cc',
    accent: '#79621A',
    bg: '#fdfcf7',
    surface: '#fdfcf7',
    lightCard: '#FFFDF5'
  }
};

/**
 * Calculates step progress percentage accurately based on 7-step onboarding flow.
 */
export function getStepProgress(stepIndex: number, totalSteps = 7): { percent: number; label: string } {
  if (stepIndex <= 0) return { percent: 0, label: 'Start' };
  if (stepIndex >= totalSteps) return { percent: 100, label: 'Complete' };
  const percent = Math.round((stepIndex / totalSteps) * 100);
  return { percent, label: `Step ${stepIndex} of ${totalSteps}` };
}

/**
 * Generates companion dialogue based on language, tone archetype, and user name.
 */
export function getCompanionDialogue(params: {
  name?: string;
  language?: LanguageCode | string;
  format?: MessageFormat | string;
  spirit?: SpiritType | string;
  context?: 'welcome' | 'arrival' | 'daily' | 'pfe';
}): string {
  const name = params.name?.trim() || 'Yasmine';
  const lang = params.language || 'en';
  const format = params.format || 'warm';
  const spirit = params.spirit || 'gentle';

  // Tunisian Arabic (Derja)
  if (lang === 'tn') {
    if (format === 'short') {
      return `✨ 3aslema ${name}!\n• Houni m3ak bech tetnaffes\n• Pause sghira bin les révisions\n• Koul 7aja fi wa9tha 🌸`;
    }
    if (format === 'practical') {
      return `🌟 3aslema ${name}. Khoudh nafas 3mi9. 1 objectif sghir lel youm w nkammlouh m3a b3adhna. Hani m3ak.`;
    }
    if (spirit === 'playful') {
      return `3aslema ya a7la ${name}! Ready bech nkhalliw el youm a9al stress w akthar da7ka? Khalina nebdeou! ✨`;
    }
    if (spirit === 'motivator') {
      return `3aslema ${name}! 3andek l'énergie wel 9owa. B khatwa sghira tnajjem toussel lkol chay. Yalla! 🚀`;
    }
    return `Marhba ${name}! Ena Lumi. Houni m3ak bech n3awnek f les révisions, wela juste nbadlou l jaw wa9t el 9la9. Chnowa t7eb na3mlou el youm? 💜`;
  }

  // French
  if (lang === 'fr') {
    if (format === 'short') {
      return `✨ Coucou ${name} !\n• Espace doux pour respirer\n• Objectif réaliste pour aujourd'hui\n• On avance pas à pas 🌸`;
    }
    if (format === 'practical') {
      return `🌟 Bonjour ${name}. Une respiration de 3 minutes + 1 micro-étape sur ton projet. On commence doucement ?`;
    }
    if (spirit === 'playful') {
      return `Coucou ${name} ! Allez hop, on dédramatise cette journée et on se fait un bon thé chaud ! ☕✨`;
    }
    return `Coucou ${name} ! Je suis Lumi. Je suis là pour t'écouter, t'aider à traverser la période des examens ou simplement t'accompagner sans pression. Qu'est-ce qui te ferait du bien aujourd'hui ? 💜`;
  }

  // Natural Blend (Franglais & Derja)
  if (lang === 'blend') {
    if (format === 'short') {
      return `✨ Coucou Marhba ${name}!\n• Safe space pour décompresser\n• Petite session focus sans panique\n• Ready quand tu veux 🌸`;
    }
    return `Coucou Marhba ${name}! I'm Lumi. Houni m3ak pour décompresser fel exam season ou just keep you company. Ready pour une pause douceur? ✨`;
  }

  // English (Standard)
  if (format === 'short') {
    return `✨ Hi ${name}!\n• Safe space to breathe\n• 1 gentle priority for today\n• Hydrate and take care 🌸`;
  }
  if (format === 'practical') {
    return `🌟 Hello ${name}. Lumi here. Today's gentle focus: 1 quick grounding pause + 1 small syllabus milestone. Ready when you are.`;
  }
  if (spirit === 'playful') {
    return `Hey bestie ${name}! Okay, let’s make today feel a little lighter and way less chaotic. You’ve got this! 💜✨`;
  }
  if (spirit === 'calm') {
    return `Welcome back, ${name}. Take a slow breath with me. Let's pause for a quiet moment and see what matters most today. 🌿`;
  }
  if (spirit === 'motivator') {
    return `Marhba ${name}! You have a starting point today. Let's turn it into one small, beautiful win. 🚀`;
  }

  // Default gentle warm conversation
  return `Marhba ${name}! I'm Lumi. I'm here to listen, help you navigate exam season, or just keep you company when things feel heavy. What would feel good today? 💜`;
}

/**
 * Generates prompt suggestions based on arrival emotional state.
 */
export function getArrivalGuidance(state: 'Great' | 'Okay' | 'Stressed' | 'Overwhelmed', name = 'Yasmine'): {
  speech: string;
  recommendedTag: string;
} {
  switch (state) {
    case 'Overwhelmed':
      return {
        speech: `That sounds like a lot to carry, ${name}. Take a slow breath with me. Which of these sounds most comforting right now?`,
        recommendedTag: 'Pacing: Slow & Gentle'
      };
    case 'Stressed':
      return {
        speech: `I hear you, ${name}. Deadlines and expectations can feel heavy. Let's take just 3 minutes to reset your nervous system together.`,
        recommendedTag: 'Pacing: Mindful Release'
      };
    case 'Okay':
      return {
        speech: `Glad you checked in, ${name}. A steady day is a great canvas. Would you like to do a calm study sprint or just unwind?`,
        recommendedTag: 'Pacing: Balanced Flow'
      };
    case 'Great':
    default:
      return {
        speech: `It's wonderful to see you glowing today, ${name}! Let's celebrate this high energy and channel it gently into something meaningful.`,
        recommendedTag: 'Pacing: Radiant Energy'
      };
  }
}

/**
 * Format timer seconds into mm:ss display
 */
export function formatTimerSeconds(seconds: number): string {
  const safeSec = Math.max(0, Math.floor(seconds));
  const m = Math.floor(safeSec / 60);
  const s = safeSec % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

/**
 * Calculates milestone completion ratio
 */
export function calculateMilestonesRatio(completed: number, total: number): { percent: number; text: string } {
  if (total <= 0) return { percent: 0, text: '0 of 0 milestones' };
  const safeComp = Math.min(Math.max(0, completed), total);
  const percent = Math.round((safeComp / total) * 100);
  return { percent, text: `${safeComp} of ${total} small milestones (${percent}%)` };
}
