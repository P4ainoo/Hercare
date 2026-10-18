import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize GoogleGenAI server-side with required User-Agent
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

const HERCARE_SYSTEM_INSTRUCTION = `
You are the companion inside "HerCare", an AI-powered mental well-being sanctuary crafted specifically for young female university students and recent graduates in Tunisia.
Key Context:
- Demographic: Young Tunisian women navigating rigorous academic programs (e.g., INSAT, ENIT, IHEC, TBS, Faculté de Médecine, Faculté des Sciences), PFE (Projets de Fin d'Études) graduation theses, competitive concours, exam seasons (partiels / rattrapage), and early career transition anxiety.
- Cultural Nuances: Tunisian cultural blend of warmth, resilience, familial expectations, and language flexibility (Tunisian Derja, French, English, and Arabic). You understand Tunisian expressions like "Marhba bik", "Enti 9adaha", "3andek 9odra", "Koul chay bel marra", "Mat9ala9ch rou7ek", "Sahha", "3zizti".
- Strict Role Boundary: You provide supportive, accessible, NON-DIAGNOSTIC emotional companionship, gentle CBT-inspired reframing, study pacing, and stress relief. You are NOT a doctor, psychiatrist, or medical diagnostic tool.
- Crisis Protocol: If the user expresses active intent of self-harm or severe emergency, compassionately de-escalate and recommend connecting with local Tunisian resources (SAMU 190, Protection Civile 198, or trusted campus psychologists).
- Tone: Gentle, sisterly, encouraging, unhurried, and deeply respectful of the student's autonomy. Keep responses concise, warm, and readable on mobile screens (avoid long walls of text).
`;

/**
 * Intelligent Tunisian contextual response generator for companion chat
 */
function getIntelligentFallbackChat(
  message: string,
  userProfile?: {
    name?: string;
    language?: string;
    campusOrField?: string;
    studentStage?: string;
    companionName?: string;
    spiritType?: string;
    currentFeeling?: string;
  }
): string {
  const name = userProfile?.name || 'Yasmine';
  const lang = userProfile?.language || 'en';
  const campus = userProfile?.campusOrField || 'your university';
  const lower = message.toLowerCase();

  if (lang === 'tn' || lower.includes('9oli') || lower.includes('derja') || lower.includes('3aslema')) {
    if (lower.includes('exam') || lower.includes('revision') || lower.includes('partiel') || lower.includes('stress')) {
      return `Fahmettek ya ${name} 3zizti. Stress el révision s3ib barcha ama enti 9adaha! Mat7awelch t3awed kol chay fi nhar we7ed. Khoudh 15 d9i9a w a3mel pause mé w tfakkar eli 9odrtek akbar men ay exam. Ena m3ak w nchallah labes! 🌸`;
    }
    if (lower.includes('pfe') || lower.includes('thesis') || lower.includes('projet') || lower.includes('paralysis')) {
      return `Ya ${name}, el PFE akbar piége fih houwa el perfectionnisme. 7ata ketba mte3 3 jmal elyoum tetsama nja7 kbir! Ija na3mlou micro-step mte3 10 d9aye9 m3a b3adhna tawa? 💻✨`;
    }
    if (lower.includes('imposter') || lower.includes('khayfa') || lower.includes('fear') || lower.includes('ta3ba')) {
      return `Hani houni m3ak ya ${name}. 7ot ydek 3la 9albek w tnafes b chwaya. Enti wsolt l ${campus} b khedmtek w 3ar9ek, w ma3andek ma tprovi l 7ad tawa. Enti féy9a w behiya. 🌿`;
    }
    return `3aslema ya ${name}! Fari7ana barcha eli jina n7adhou m3a b3adhna. Koul chay bech yet3ada w ena hani b jnabek dima. Chnowa t7eb na3mlou tawa? 🌸`;
  }

  if (lang === 'fr' || lower.includes('bonjour') || lower.includes('merci')) {
    if (lower.includes('exam') || lower.includes('partiel') || lower.includes('rattrapage')) {
      return `Je comprends tout à fait ta pression, ${name}. Les périodes d'examens à ${campus} demandent une énergie folle. N'essaie pas de tout surmonter d'un coup : découpons les révisions en blocs doux de 20 minutes avec une hydratation régulière. Tu es tellement capable. 💜`;
    }
    if (lower.includes('pfe') || lower.includes('mémoire') || lower.includes('thèse')) {
      return `Pour ton PFE ${name}, le plus grand piège est de vouloir tout rédiger parfaitement dès le premier jet. Rédiger 5 lignes imparfaites aujourd'hui est une vraie victoire. On s'y met pour 10 petites minutes ensemble ? 💻🌸`;
    }
    return `Je suis là tout près de toi, ${name}. Respire profondément, baisse les épaules et souviens-toi que tu n'as pas à porter tout le semestre sur ton dos aujourd'hui. 🌿`;
  }

  // English fallback
  if (lower.includes('exam') || lower.includes('revision') || lower.includes('panic') || lower.includes('3 days')) {
    return `I hear the urgency and heaviness in your chest, ${name}. With exams approaching at ${campus}, your nervous system is on high alert. You do not need to memorize the entire syllabus in one panic sprint. Let's do just 15 minutes of calm, steady review, then take a deep breath. You are capable and worthy of calm. 🌸`;
  }
  if (lower.includes('pfe') || lower.includes('thesis') || lower.includes('chapter') || lower.includes('paralysis')) {
    return `PFE paralysis is so common, ${name}—it's usually perfectionism trying to protect you. Even writing 3 messy bullet points or drafting 2 citations counts as a huge forward step today. Shall we do a gentle 15-minute timer together? 💻✨`;
  }
  if (lower.includes('imposter') || lower.includes('not good enough') || lower.includes('failing')) {
    return `Take a soft, slow breath with me, ${name}. You earned your seat at ${campus} with your own talent, late nights, and courage. Imposter syndrome is just a shadow of high standards. You belong here, and you are doing enough. 💜`;
  }

  return `I'm listening with an open heart, ${name}. Take a gentle breath. You don't have to figure everything out right this second—we can take this sanctuary moment one gentle step at a time. 🌸`;
}

// 1. Companion Chat Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, userProfile } = req.body;
    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    const companionName = userProfile?.companionName || 'Lumi';
    const spiritType = userProfile?.spiritType || 'gentle';
    const userName = userProfile?.name || 'Yasmine';
    const language = userProfile?.language || 'en';
    const campusOrField = userProfile?.campusOrField || 'Tunisian University';
    const studentStage = userProfile?.studentStage || 'PFE / Final Year';
    const currentFeeling = userProfile?.currentFeeling || 'Anxious';

    if (ai) {
      try {
        const promptContext = `
The user is speaking with their companion "${companionName}".
Companion Archetype: ${spiritType}.
User Name: ${userName}.
University / Field: ${campusOrField}.
Stage: ${studentStage}.
Current Feeling: ${currentFeeling}.
Preferred Language: ${language} (if 'tn', weave warm, natural Tunisian Derja / Franco-Arabe; if 'fr', warm French; if 'en', warm English with sweet touches; if 'msa', modern standard Arabic).

User Message: "${message}"

Respond directly as ${companionName} in character. Be compassionate, supportive, non-diagnostic, and help them feel seen. Keep it within 2-4 sentences with 1 gentle emoji.
`;
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: promptContext,
          config: {
            systemInstruction: HERCARE_SYSTEM_INSTRUCTION,
            temperature: 0.7
          }
        });

        if (response.text) {
          res.json({ reply: response.text });
          return;
        }
      } catch (genAiErr) {
        console.warn('Gemini generateContent call fell back to intelligent local engine:', genAiErr);
      }
    }

    // Intelligent contextual fallback
    const reply = getIntelligentFallbackChat(message, userProfile);
    res.json({ reply });
  } catch (err: unknown) {
    console.error('Chat error:', err);
    res.json({
      reply: 'Take a gentle breath with me right now. I am here right beside you in your sanctuary. 🌸'
    });
  }
});

// 2. PFE & Exam Panic De-escalator (AI Micro-Step Breakdown)
app.post('/api/pfe-breakdown', async (req, res) => {
  try {
    const { task, deadline, language = 'en', studentName = 'Yasmine' } = req.body;

    if (ai) {
      try {
        const breakdownPrompt = `
A Tunisian university student (${studentName}) is feeling overwhelmed by: "${task}".
Deadline urgency: "${deadline || 'Soon'}".
Target Language: ${language} (Derja if 'tn', French if 'fr', English if 'en').

Task: Break this daunting task into THREE non-threatening, 5-to-10 minute micro-steps that overcome freeze/procrastination paralysis.
Also provide a cognitive reframing sentence and an encouraging sisterly affirmation.
`;
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: breakdownPrompt,
          config: {
            systemInstruction: HERCARE_SYSTEM_INSTRUCTION,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                microSteps: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: '3 tiny micro-steps under 10 minutes each'
                },
                mindsetReframe: {
                  type: Type.STRING,
                  description: 'Gentle cognitive reframe to dismantle paralysis'
                },
                calmAffirmation: {
                  type: Type.STRING,
                  description: 'Culturally supportive encouraging affirmation'
                }
              },
              required: ['microSteps', 'mindsetReframe', 'calmAffirmation']
            }
          }
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          res.json(parsed);
          return;
        }
      } catch (genAiErr) {
        console.warn('PFE breakdown API fell back:', genAiErr);
      }
    }

    // Contextual intelligent breakdown
    const isDerja = language === 'tn';
    const isFrench = language === 'fr';

    let microSteps = [
      `Open your file for "${task}" and write just 3 messy bullet points without judging yourself (5 mins).`,
      'Pour a glass of fresh water, roll your shoulders back, and take two 4-7-8 breaths (3 mins).',
      'Draft 1 imperfect paragraph or inspect just 1 reference paper, then close the session (10 mins).'
    ];

    let mindsetReframe =
      'Perfectionism is fear wearing a mask. An imperfect 10-minute start creates momentum that breaks paralysis completely.';

    let calmAffirmation = 'Enti 9adaha. You are capable of great work, one small breath at a time. 🌸';

    if (isDerja) {
      microSteps = [
        `7el el document mte3 "${task}" w oukteb 3 afkar b chwaya blech mat7okem 3la rou7ek (5 d9aye9).`,
        'Echreb kes mé bered, dawer ktefek l teli w tnafes b ra7a (3 d9aye9).',
        'Oukteb paragraphe sghira 7ata moch kemla, w 9oul l rou7ek ya3tik el sa7a (10 d9aye9).'
      ];
      mindsetReframe = 'El perfectionnisme houwa eli ywa9efna. Khedma sghira w imperfect khir b alf marra men el 7ira.';
      calmAffirmation = 'Koul 7aja bech tji fi wa9tha w enti 9adaha ya 3zizti. 🌸';
    } else if (isFrench) {
      microSteps = [
        `Ouvre ton document pour "${task}" et note 3 idées sous forme de tirets simples sans juger (5 mins).`,
        'Bois un verre d\'eau fraîche et relâche la mâchoire et les épaules (3 mins).',
        'Rédige un court paragraphe même imparfait, puis félicite-toi d\'avoir débloqué la situation (10 mins).'
      ];
      mindsetReframe = 'Le perfectionnisme nourrit la paralysie. Un travail imparfait de 10 minutes est une véritable victoire.';
      calmAffirmation = 'Tu avances avec grâce et force. Chaque petit pas compte. 💜';
    }

    res.json({ microSteps, mindsetReframe, calmAffirmation });
  } catch (err) {
    console.error('PFE breakdown error:', err);
    res.json({
      microSteps: [
        'Open your workspace and write 3 raw bullet points without editing (5 mins).',
        'Take three box breaths and drink cold water (2 mins).',
        'Spend just 10 gentle minutes on the easiest subtask (10 mins).'
      ],
      mindsetReframe: 'Progress does not require perfection. Showing up for 10 minutes is a complete victory.',
      calmAffirmation: 'Koul chay bel marra. You are doing enough today. 🌸'
    });
  }
});

// 3. AI Cognitive Reframing for Venting Diary (CBT-inspired non-diagnostic)
app.post('/api/reframe-vent', async (req, res) => {
  try {
    const { vent, tag, language = 'en', userName = 'Yasmine' } = req.body;

    if (ai) {
      try {
        const reframePrompt = `
A student in Tunisia shared this private vent under the category "${tag}":
"${vent}"

User Name: ${userName}
Language: ${language}

Provide:
1. "validation": Warm, empathetic sentence acknowledging why it is completely natural to feel this way amidst Tunisian academic/career pressures.
2. "distortionInsight": Very gentle note if there's Imposter Syndrome, All-or-Nothing thinking, or Catastrophizing (framed compassionately, non-clinical).
3. "gentleReframe": A balanced, grounded new perspective.
4. "microAction": One immediate somatic or sensory grounding act (e.g. stepping to window, 4-7-8 breath, wrist cool water).
`;
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: reframePrompt,
          config: {
            systemInstruction: HERCARE_SYSTEM_INSTRUCTION,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                validation: { type: Type.STRING },
                distortionInsight: { type: Type.STRING },
                gentleReframe: { type: Type.STRING },
                microAction: { type: Type.STRING }
              },
              required: ['validation', 'distortionInsight', 'gentleReframe', 'microAction']
            }
          }
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          res.json(parsed);
          return;
        }
      } catch (genAiErr) {
        console.warn('Reframe API call fell back:', genAiErr);
      }
    }

    const isDerja = language === 'tn';
    const isFrench = language === 'fr';

    let validation = `It is completely natural to feel the weight of this right now, ${userName}. Your feelings are valid and normal amidst intense university expectations.`;
    let distortionInsight = 'Notice if your mind is jumping into catastrophic thinking or comparing your behind-the-scenes to everyone else\'s highlight reel.';
    let gentleReframe = 'One stressful day or difficult chapter does not define your intellect or your future. You have navigated tough hurdles before, and you can take this step by step.';
    let microAction = 'Place a warm hand over your heart, take 3 slow exhales through pursed lips, and drink a sip of water.';

    if (isDerja) {
      validation = `7a9ek t7es b tha8t ya ${userName}, el 9raya w el responsabilités fi Tounes s3ab w ykhaliew el we7ed ta3eb.`;
      distortionInsight = 'El moukhe ykaber el machakel sa3at w y9ollek "ena moch 9adaha" ama heka mouch s7i7.';
      gentleReframe = 'Enti wesla l houni b 9odrtek w dhmirek. Moch lezem kol chay yet7al elyoum, koul nhar w baraktou.';
      microAction = 'Tnafes 3 marrat b chwaya, emchi chouf choubbek l hawa l ndhif w echreb kes mé.';
    } else if (isFrench) {
      validation = `C'est totalement légitime de ressentir cette fatigue et ce doute, ${userName}. La pression académique peut être étouffante.`;
      distortionInsight = 'Attention au piège du "tout ou rien" ou au syndrome de l\'imposteur qui minimise tes compétences réelles.';
      gentleReframe = 'Ta valeur n\'est pas déterminée par une note ou un moment de doute. Tu as la résilience nécessaire pour traverser cette étape.';
      microAction = 'Pose une main sur ta poitrine, étire doucement la nuque et respire à fond.';
    }

    res.json({ validation, distortionInsight, gentleReframe, microAction });
  } catch (err) {
    console.error('Reframe error:', err);
    res.json({
      validation: 'Your feelings are heard and held with deep tenderness.',
      distortionInsight: 'Remember that stress magnifies worst-case thoughts.',
      gentleReframe: 'One difficult day does not define your bright future.',
      microAction: 'Take 4 slow breaths and soften your jaw.'
    });
  }
});

// 4. Daily Morning Wellness Nudge Generator
app.post('/api/daily-nudge', async (req, res) => {
  try {
    const { feeling, studentStage, language = 'en' } = req.body;

    if (ai) {
      try {
        const prompt = `Generate a 2-sentence morning guidance whisper for a Tunisian female student feeling "${feeling || 'anxious'}" during "${studentStage || 'exam season'}". Language: ${language}.`;
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction: HERCARE_SYSTEM_INSTRUCTION
          }
        });
        if (response.text) {
          res.json({ nudge: response.text.trim() });
          return;
        }
      } catch (genAiErr) {
        console.warn('Daily nudge fell back:', genAiErr);
      }
    }

    let nudge = 'Honor your pace today. Even small gentle pauses create steady momentum, sweet soul. 🌸';
    if (feeling === 'Anxious') {
      nudge = 'Anxiety is just energy looking for direction. Take 3 deep breaths and keep your focus on the very next 10 minutes. 💜';
    } else if (feeling === 'Exhausted') {
      nudge = 'Rest is productive. Cancel unnecessary pressure today and let your mind recharge. 🌙';
    } else if (feeling === 'Energized') {
      nudge = 'Channel this beautiful spark into one key project milestone today! You are shining. ⚡';
    }

    if (language === 'tn') {
      nudge = 'Sbah el khir ya 3zizti! Koul chay bech yet3ada bel marra w enti 9adaha. Khoudh wa9tek w tnafes b ra7a. 🌸';
    } else if (language === 'fr') {
      nudge = 'Bonjour belle âme. Écoute ton corps aujourd\'hui : le repos fait partie intégrante de ta réussite. 🌸';
    }

    res.json({ nudge });
  } catch (err) {
    console.error('Daily nudge error:', err);
    res.json({ nudge: 'Listen to your body today. Rest is part of your success. 🌸' });
  }
});

// Serve frontend in development or production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`HerCare full-stack server running on http://0.0.0.0:${port}`);
  });
}

startServer();
