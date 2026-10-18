import React, { useState, useEffect } from 'react';
import { UserState } from '../types';
import { COMPANION_OPTIONS } from '../constants/assets';
import { formatTimerSeconds, calculateMilestonesRatio, PALETTE_THEMES } from '../utils/sanctuaryLogic';
import { soundFx } from '../utils/audioPlayer';

interface Props {
  state: UserState;
  updateState: (fields: Partial<UserState>) => void;
  onOpenSettings: () => void;
  onRevisitOnboarding: () => void;
}

export const Screen14HomeDashboard: React.FC<Props> = ({
  state,
  updateState,
  onOpenSettings,
  onRevisitOnboarding
}) => {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'home' | 'companion' | 'plan' | 'sanctuary' | 'profile'>('home');

  // Modals & Drawers
  const [activeModal, setActiveModal] = useState<
    'breathe' | 'venting' | 'affirmation' | 'timer' | 'circle' | 'stretches' | 'notifications' | 'pfe_breaker' | 'crisis_shield' | 'soundscapes' | null
  >(null);

  // Focus Timer state (15 min default micro-step)
  const [timerDuration, setTimerDuration] = useState(900); // 15 mins default
  const [timerSeconds, setTimerSeconds] = useState(900);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isLofiOn, setIsLofiOn] = useState(false);
  const [ambientType, setAmbientType] = useState<'lofi' | 'ocean' | 'rain'>('lofi');

  // Morning feeling
  const [loggedFeeling, setLoggedFeeling] = useState<string | null>(state.currentFeeling || 'Anxious');
  const [feelingSuccessMsg, setFeelingSuccessMsg] = useState('');

  // Daily goals state
  const [dailyMilestones, setDailyMilestones] = useState([
    { id: '1', title: 'Morning breathing & tea ritual', done: true },
    { id: '2', title: 'PFE Thesis Micro-Step: Chapter 2 outline', done: false },
    { id: '3', title: 'Review 5 past exam problems', done: false },
    { id: '4', title: 'Evening reflection in Venting Space', done: false }
  ]);
  const [newMilestoneText, setNewMilestoneText] = useState('');

  // Exam Countdown Deadlines
  const [deadlines, setDeadlines] = useState([
    { id: 'd1', name: 'Software Engineering Final Exam', date: 'In 5 days', badge: 'High priority' },
    { id: 'd2', name: 'PFE Progress Report 2 Submission', date: 'In 14 days', badge: 'Milestone' }
  ]);
  const [newDeadlineName, setNewDeadlineName] = useState('');

  // Companion Chat state (Integrated with Gemini AI)
  const [chatInput, setChatInput] = useState('');
  const [isCompanionTyping, setIsCompanionTyping] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'lumi'; text: string; time: string }>>([
    {
      sender: 'lumi',
      text: `Sbah el khir ${state.name || 'Yasmine'}! 🌸 I'm here right by your side. Did you get some rest last night? Remember: you don't have to carry the whole semester at once.`,
      time: '9:00 AM'
    }
  ]);

  // AI PFE & Exam Micro-Breaker State
  const [pfeTaskInput, setPfeTaskInput] = useState('PFE Chapter 2: Related Works & Architecture');
  const [pfeDeadlineInput, setPfeDeadlineInput] = useState('Next Tuesday');
  const [isGeneratingPfeBreakdown, setIsGeneratingPfeBreakdown] = useState(false);
  const [pfeBreakdownResult, setPfeBreakdownResult] = useState<{
    microSteps: string[];
    mindsetReframe: string;
    calmAffirmation: string;
  } | null>(null);

  // Venting diary input & AI Reframer state
  const [ventText, setVentText] = useState('');
  const [ventTag, setVentTag] = useState<'Exam Stress' | 'PFE Pressure' | 'Fatigue' | 'Gratitude'>('Exam Stress');
  const [isReframingVent, setIsReframingVent] = useState(false);
  const [activeReframingResult, setActiveReframingResult] = useState<{
    validation: string;
    distortionInsight?: string;
    gentleReframe: string;
    microAction: string;
  } | null>(null);

  // Daily Affirmations
  const affirmations = [
    'You don’t have to finish everything today to be worthy of rest. One small breath at a time.',
    'Your intelligence, warmth, and resilience are far greater than any exam stress. You are doing enough, sweet soul. 🌸',
    '3andek 9odra kbira w 9alb tayeb. Koul 7aja bech tji fi wa9tha.',
    'Progress is not always linear. Sometimes taking a slow, deep breath is the most productive thing you can do.',
    'You are writing your own future with patience and grace. Proud of how gently you keep going.'
  ];
  const [affirmationIdx, setAffirmationIdx] = useState(0);

  // Breathing exercise state (Inhale 4s, Hold 4s, Exhale 6s)
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [breathCount, setBreathCount] = useState(4);
  const [completedBreathCycles, setCompletedBreathCycles] = useState(0);

  // Tunis Student Circle
  const [circleStudents, setCircleStudents] = useState([
    { id: '1', name: 'Nour M.', uni: 'INSAT', goal: 'Software Engineering review', state: 'Focusing 25m', cheers: 6 },
    { id: '2', name: 'Meriem B.', uni: 'Faculté de Médecine de Tunis', goal: 'Pediatrics clinical case notes', state: 'Focusing 12m', cheers: 8 },
    { id: '3', name: 'Amira K.', uni: 'ENIT', goal: 'PFE Signal Processing', state: 'Resting 3m', cheers: 4 },
    { id: '4', name: 'Sarra T.', uni: 'IHEC Carthage', goal: 'Corporate Finance case', state: 'Focusing 18m', cheers: 5 },
    { id: '5', name: 'Ines D.', uni: 'TBS (Tunis Business School)', goal: 'Data Analytics Capstone', state: 'Focusing 10m', cheers: 7 }
  ]);
  const [isUserInCircle, setIsUserInCircle] = useState(false);
  const [cheerNoteInput, setCheerNoteInput] = useState('');

  // Current Companion Asset
  const currentCompanionAsset =
    COMPANION_OPTIONS.find((c) => c.type === state.companionType) || COMPANION_OPTIONS[0];

  // Breathing timer loop
  useEffect(() => {
    if (activeModal !== 'breathe') return;
    const interval = setInterval(() => {
      setBreathCount((prev) => {
        if (prev <= 1) {
          if (breathPhase === 'Inhale') {
            setBreathPhase('Hold');
            soundFx.playGentleChime(480);
            return 4;
          } else if (breathPhase === 'Hold') {
            setBreathPhase('Exhale');
            soundFx.playGentleChime(400);
            return 6;
          } else {
            setBreathPhase('Inhale');
            soundFx.playGentleChime(528);
            setCompletedBreathCycles((c) => c + 1);
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [activeModal, breathPhase]);

  // Focus timer countdown loop
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            soundFx.playSuccessFanfare();
            // Mark milestone
            setDailyMilestones((prevMilestones) =>
              prevMilestones.map((m, idx) => (idx === 1 ? { ...m, done: true } : m))
            );
            updateState({
              studySprintMilestone: Math.min(state.studySprintMilestone + 1, state.totalStudyMilestones),
              companionBondLevel: state.companionBondLevel + 1
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSeconds, state.studySprintMilestone, state.totalStudyMilestones, state.companionBondLevel, updateState]);

  const toggleFocusTimer = () => {
    soundFx.playGentleChime(isTimerRunning ? 440 : 528);
    setIsTimerRunning(!isTimerRunning);
  };

  const handleToggleLofi = () => {
    const nextState = soundFx.toggleLofiBeats();
    setIsLofiOn(nextState);
  };

  const handleSelectSoundscape = (type: 'lofi' | 'ocean' | 'rain') => {
    soundFx.playGentleChime(528);
    setAmbientType(type);
    soundFx.setAmbientType(type);
    if (!isLofiOn) {
      soundFx.startLofiBeats();
      setIsLofiOn(true);
    }
  };

  const handleLogFeeling = async () => {
    if (!loggedFeeling) return;
    soundFx.playSparkle();
    updateState({ currentFeeling: loggedFeeling });

    try {
      const res = await fetch('/api/daily-nudge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feeling: loggedFeeling,
          studentStage: state.studentStage,
          language: state.language
        })
      });
      const data = await res.json();
      setFeelingSuccessMsg(data.nudge || 'Thank you for honoring your body and heart today.');
    } catch {
      let advice = 'Thank you for honoring your body and heart today.';
      if (loggedFeeling === 'Anxious') {
        advice = 'Anxiety noted gently. Let’s keep tasks down to 10 minutes each today. 💜';
      } else if (loggedFeeling === 'Exhausted') {
        advice = 'Rest is productive. Cancel non-urgent stress and take a cozy break. 🌙';
      } else if (loggedFeeling === 'Energized') {
        advice = 'Channel this beautiful spark into one key project step! ⚡';
      }
      setFeelingSuccessMsg(advice);
    }

    setTimeout(() => setFeelingSuccessMsg(''), 6000);
  };

  // Real Gemini AI Chat integration with fallback
  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || chatInput;
    if (!textToSend.trim()) return;

    soundFx.playGentleChime(500);
    const newChat = [...chatMessages, { sender: 'user' as const, text: textToSend.trim(), time: 'Just now' }];
    setChatMessages(newChat);
    if (!customText) setChatInput('');
    setIsCompanionTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend.trim(),
          history: newChat.slice(-6).map((m) => ({ role: m.sender === 'user' ? 'user' : 'model', parts: [{ text: m.text }] })),
          userProfile: {
            name: state.name,
            language: state.language,
            campusOrField: state.campusOrField,
            studentStage: state.studentStage,
            companionName: state.companionName,
            spiritType: state.spiritType,
            currentFeeling: loggedFeeling || state.currentFeeling
          }
        })
      });

      const data = await response.json();
      setIsCompanionTyping(false);
      soundFx.playSparkle();

      const reply = data.reply || `I'm right here with you, ${state.name || 'habibi'}. Take a slow breath. 💜`;
      setChatMessages((prev) => [...prev, { sender: 'lumi' as const, text: reply, time: 'Just now' }]);
    } catch (err) {
      console.error('Chat error:', err);
      setIsCompanionTyping(false);
      soundFx.playSparkle();

      let reply = `I'm right here with you, ${state.name || 'habibi'}. Take a slow breath. We can take this one gentle step at a time. 💜`;
      if (state.language === 'tn') {
        reply = `Fahmettek ya ${state.name || '3zizti'}. Mat9ala9ch rou7ek, kol chay bech yet3ada w ena hani m3ak. 🌸`;
      }
      setChatMessages((prev) => [...prev, { sender: 'lumi' as const, text: reply, time: 'Just now' }]);
    }
  };

  // AI PFE & Exam Micro-Breaker Handler
  const handleGeneratePfeBreakdown = async () => {
    if (!pfeTaskInput.trim()) return;
    setIsGeneratingPfeBreakdown(true);
    soundFx.playGentleChime(528);

    try {
      const res = await fetch('/api/pfe-breakdown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: pfeTaskInput.trim(),
          deadline: pfeDeadlineInput,
          language: state.language,
          studentName: state.name
        })
      });
      const data = await res.json();
      setPfeBreakdownResult(data);
      soundFx.playSuccessFanfare();
    } catch (err) {
      console.error('Breakdown error:', err);
      setPfeBreakdownResult({
        microSteps: [
          'Open document and write 3 raw bullet ideas without editing (5 mins).',
          'Sip a cold glass of water and roll your shoulders (2 mins).',
          'Draft just one imperfect paragraph or review 1 key reference (10 mins).'
        ],
        mindsetReframe: 'Perfectionism feeds paralysis. Any imperfect 10-minute start is a complete victory.',
        calmAffirmation: 'Enti 9adaha. One gentle step at a time. 🌸'
      });
    } finally {
      setIsGeneratingPfeBreakdown(false);
    }
  };

  // AI Venting Cognitive Reframing Handler
  const handleReframeVent = async () => {
    if (!ventText.trim()) return;
    setIsReframingVent(true);
    soundFx.playGentleChime(500);

    try {
      const res = await fetch('/api/reframe-vent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vent: ventText.trim(),
          tag: ventTag,
          language: state.language,
          userName: state.name
        })
      });
      const data = await res.json();
      setActiveReframingResult(data);
      soundFx.playSparkle();
    } catch (err) {
      console.error('Reframe error:', err);
      setActiveReframingResult({
        validation: 'Your feelings are heard and held with deep tenderness.',
        distortionInsight: 'Remember that stress magnifies worst-case thoughts.',
        gentleReframe: 'One difficult day does not define your bright future.',
        microAction: 'Take 4 slow breaths and soften your jaw.'
      });
    } finally {
      setIsReframingVent(false);
    }
  };

  const handleSaveVenting = () => {
    if (!ventText.trim()) return;
    soundFx.playGentleChime(528);
    const newEntry = {
      id: Date.now().toString(),
      timestamp: 'Today · ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: ventText.trim(),
      tag: ventTag,
      aiReframe: activeReframingResult || undefined
    };
    updateState({
      ventingEntries: [newEntry, ...state.ventingEntries]
    });
    setVentText('');
    setActiveReframingResult(null);
    soundFx.playSparkle();
    alert('✨ Your reflection and gentle reframe have been securely saved in your encrypted diary.');
  };

  const handleToggleMilestone = (id: string) => {
    soundFx.playGentleChime(490);
    setDailyMilestones((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const nextDone = !m.done;
          if (nextDone) soundFx.playSparkle();
          return { ...m, done: nextDone };
        }
        return m;
      })
    );
  };

  const handleAddMilestone = () => {
    if (!newMilestoneText.trim()) return;
    soundFx.playSparkle();
    setDailyMilestones([
      ...dailyMilestones,
      { id: Date.now().toString(), title: newMilestoneText.trim(), done: false }
    ]);
    setNewMilestoneText('');
  };

  const handleJoinCircle = () => {
    soundFx.playSparkle();
    if (!isUserInCircle) {
      setCircleStudents([
        {
          id: 'user',
          name: `${state.name || 'Yasmine'} (You)`,
          uni: state.campusOrField || 'INSAT',
          goal: 'PFE & Exam Calm Focus',
          state: 'Focusing 15m',
          cheers: 1
        },
        ...circleStudents
      ]);
      setIsUserInCircle(true);
    } else {
      setCircleStudents(circleStudents.filter((s) => s.id !== 'user'));
      setIsUserInCircle(false);
    }
  };

  const handleCheerStudent = (id: string) => {
    soundFx.playSparkle();
    setCircleStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, cheers: (s.cheers || 0) + 1 } : s))
    );
  };

  const completedMilestonesCount = dailyMilestones.filter((m) => m.done).length;
  const milestoneRatio = calculateMilestonesRatio(completedMilestonesCount, dailyMilestones.length);

  return (
    <div className="flex flex-col w-full min-h-screen bg-surface max-w-md mx-auto relative select-none">
      {/* Scrollable Main Sanctuary Content */}
      <div className="flex-1 flex flex-col px-margin pb-24 pt-2">
        {/* Top Header Bar */}
        <header className="flex items-center justify-between py-2 mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center text-primary shadow-xs">
              <span className="material-symbols-outlined text-[18px]">spa</span>
            </div>
            <span className="text-xl font-bold text-on-surface">HerCare</span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Safety & Non-Diagnostic Shield Button */}
            <button
              aria-label="Safety and Non-Diagnostic Helplines"
              onClick={() => {
                soundFx.playGentleChime(500);
                setActiveModal('crisis_shield');
              }}
              className="px-2.5 py-1 rounded-full bg-surface-container text-primary flex items-center gap-1 hover:bg-surface-container-high transition-colors cursor-pointer text-[11px] font-bold"
              type="button"
              title="Non-diagnostic safety guarantee & 24/7 Tunisian crisis contacts"
            >
              <span className="material-symbols-outlined text-[15px] text-primary">verified_user</span>
              <span>Sanctuary Safety</span>
            </button>

            <button
              aria-label="Notifications"
              onClick={() => {
                soundFx.playGentleChime(480);
                setActiveModal('notifications');
              }}
              className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer relative"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary" />
            </button>

            <button
              aria-label="Profile and Settings"
              onClick={() => {
                soundFx.playGentleChime(500);
                setActiveTab('profile');
              }}
              className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white shadow-sm hover:opacity-95 transition-opacity cursor-pointer font-bold text-xs"
              type="button"
            >
              {state.name ? state.name.slice(0, 1).toUpperCase() : 'Y'}
            </button>
          </div>
        </header>

        {/* Tab 1: Home Screen View */}
        {activeTab === 'home' && (
          <div className="flex flex-col w-full">
            {/* Greeting & Location */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold text-on-surface leading-tight">
                  Sbah el khir,
                  <br />
                  <span className="text-primary">{state.name || 'Yasmine'}</span>
                </h1>
                <div className="flex items-center gap-1.5 text-xs text-on-surface-variant mt-1">
                  <span className="material-symbols-outlined text-[15px] text-secondary">calendar_month</span>
                  <span>{state.campusOrField || 'INSAT'} · Exam &amp; PFE Season</span>
                </div>
              </div>

              {/* Tunis Weather badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary-fixed text-on-secondary-fixed shadow-sm">
                <span>🌸</span>
                <span className="text-xs font-semibold">Tunis, 21°C</span>
              </div>
            </div>

            {/* Companion Showcase Card */}
            <div className="relative bg-gradient-to-r from-secondary-fixed/50 via-surface-container-lowest to-surface-container-lowest rounded-3xl p-4 shadow-sm mb-5 border border-surface-container overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <div className="inline-flex items-center gap-1 text-[11px] font-bold text-primary bg-surface-container-lowest/90 px-2.5 py-0.5 rounded-full shadow-xs">
                  <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    favorite
                  </span>
                  <span>{state.companionName || 'Lumi'} is feeling cozy</span>
                </div>
                <span className="text-xs font-bold text-secondary">Level {state.companionBondLevel} Sister</span>
              </div>

              <div className="flex items-start gap-3.5">
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    soundFx.playSparkle();
                    updateState({ companionBondLevel: state.companionBondLevel + 1 });
                  }}
                  className="relative shrink-0 cursor-pointer active:scale-95 transition-transform"
                >
                  <div className="w-18 h-18 rounded-2xl overflow-hidden shadow-sm bg-secondary-fixed p-0.5 ring-2 ring-primary/20">
                    <img alt={state.companionName} className="w-full h-full object-cover rounded-2xl" src={currentCompanionAsset.image} />
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white text-[10px] shadow-xs">
                    <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      favorite
                    </span>
                  </span>
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex items-start gap-1">
                    <span className="material-symbols-outlined text-primary text-[16px] shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                      format_quote
                    </span>
                    <p className="text-xs text-on-surface leading-snug">
                      Enti tekhdem b dhmir. Remember to drink water and take small 10-minute pauses today!
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-2.5">
                    <button
                      onClick={() => {
                        soundFx.playGentleChime(500);
                        setActiveTab('companion');
                      }}
                      className="px-3.5 py-1.5 rounded-full bg-primary text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm active:scale-95 transition-transform cursor-pointer"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[14px]">chat_bubble</span>
                      <span>Talk to {state.companionName || 'Lumi'} (AI)</span>
                    </button>
                    <button
                      onClick={() => {
                        soundFx.playGentleChime(480);
                        setActiveModal('soundscapes');
                      }}
                      className="p-1.5 rounded-full bg-surface-container text-on-surface hover:bg-surface-container-high cursor-pointer"
                      title="Tunisian Ambient Soundscapes"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[16px]">headphones</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Morning Check-In Module */}
            <div className="p-4 rounded-3xl bg-surface-container-lowest shadow-sm mb-5 border border-surface-container">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-[18px]">psychology</span>
                  <h2 className="text-sm font-bold text-on-surface">Daily Energy Check-In</h2>
                </div>
                <span className="text-[11px] text-outline font-medium">Non-diagnostic</span>
              </div>
              <p className="text-xs text-on-surface-variant mb-3">
                How is your emotional battery feeling right now, {state.name || 'Yasmine'}?
              </p>

              <div className="grid grid-cols-4 gap-2 mb-3">
                {[
                  { id: 'Energized', icon: 'bolt', label: 'Energized' },
                  { id: 'Neutral', icon: 'eco', label: 'Neutral' },
                  { id: 'Anxious', icon: 'bubble_chart', label: 'Anxious' },
                  { id: 'Exhausted', icon: 'bedtime', label: 'Exhaust...' }
                ].map((feel) => {
                  const isSelected = loggedFeeling === feel.id;
                  return (
                    <button
                      key={feel.id}
                      type="button"
                      onClick={() => {
                        soundFx.playGentleChime(480);
                        setLoggedFeeling(feel.id);
                      }}
                      className={`flex flex-col items-center justify-center py-3 rounded-2xl transition-all active:scale-95 cursor-pointer ${
                        isSelected
                          ? 'bg-secondary-fixed ring-2 ring-primary text-on-secondary-fixed shadow-xs'
                          : 'bg-surface-container-low hover:bg-surface-container text-on-surface'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px] text-primary mb-1">
                        {feel.icon}
                      </span>
                      <span className="text-[11px] font-bold truncate">{feel.label}</span>
                    </button>
                  );
                })}
              </div>

              {feelingSuccessMsg && (
                <div className="mb-2 p-2.5 rounded-xl bg-secondary-fixed/50 text-[11px] font-semibold text-primary leading-relaxed animate-in fade-in">
                  🌸 {feelingSuccessMsg}
                </div>
              )}

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-on-surface-variant italic">
                  Honoring your real pace
                </span>
                <button
                  onClick={handleLogFeeling}
                  disabled={!loggedFeeling}
                  className="px-3.5 py-1.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-semibold flex items-center gap-1 shadow-xs active:scale-95 transition-transform disabled:opacity-40 cursor-pointer"
                  type="button"
                >
                  <span>Log &amp; Get Nudge</span>
                  <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                </button>
              </div>
            </div>

            {/* PFE Thesis Micro-Step Focus Sprint Card */}
            <div className="p-4 rounded-3xl bg-surface-container-lowest shadow-sm mb-5 border border-surface-container relative overflow-hidden">
              <div className="flex items-center justify-between mb-1.5">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant">
                  <span className="material-symbols-outlined text-[13px]">school</span>
                  Graduation Project (PFE)
                </span>
                <button
                  onClick={() => {
                    soundFx.playGentleChime(500);
                    setActiveModal('pfe_breaker');
                  }}
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                  <span>AI Task Breaker</span>
                </button>
              </div>

              <h2 className="text-base font-bold text-on-surface mb-1">PFE Thesis Micro-Step</h2>
              <p className="text-xs text-on-surface-variant leading-relaxed mb-3">
                Outline chapter 2 bibliography — just 15 minutes of calm, structured focus without pressure.
              </p>

              {/* Progress track */}
              <div className="flex items-center justify-between text-[11px] text-on-surface-variant mb-1 font-medium">
                <span>Daily Goal: {milestoneRatio.text}</span>
              </div>
              <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden mb-3">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${milestoneRatio.percent}%` }}
                />
              </div>

              {/* Timer & Controls */}
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={handleToggleLofi}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
                    isLofiOn ? 'bg-primary text-white shadow-sm' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">headphones</span>
                  <span>{isLofiOn ? `${ambientType === 'ocean' ? 'Ocean Waves' : ambientType === 'rain' ? 'Jasmine Rain' : 'Lo-Fi'} ♫` : 'Soundscapes ready'}</span>
                </button>

                <button
                  type="button"
                  onClick={toggleFocusTimer}
                  className="px-4 py-2 rounded-full bg-primary text-white text-xs font-bold shadow-md flex items-center gap-1.5 active:scale-95 transition-transform hover:opacity-95 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {isTimerRunning ? 'pause' : 'play_arrow'}
                  </span>
                  <span>
                    {isTimerRunning
                      ? `Pause (${formatTimerSeconds(timerSeconds)})`
                      : timerSeconds < timerDuration
                      ? `Resume (${formatTimerSeconds(timerSeconds)})`
                      : 'Start Gentle Focus'}
                  </span>
                </button>
              </div>
            </div>

            {/* Sanctuary Spaces Grid */}
            <div className="flex flex-col mb-5">
              <div className="flex items-center justify-between mb-2.5">
                <h2 className="text-sm font-bold text-on-surface">Sanctuary Spaces</h2>
                <button
                  onClick={() => setActiveTab('sanctuary')}
                  className="text-xs text-primary font-bold hover:underline cursor-pointer"
                  type="button"
                >
                  Explore All
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Space 1: Breathe */}
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playGentleChime(528);
                    setActiveModal('breathe');
                  }}
                  className="p-3.5 rounded-2xl bg-surface-container-lowest hover:bg-surface-container-low shadow-sm flex flex-col justify-between h-28 text-left transition-transform active:scale-95 cursor-pointer border border-surface-container"
                >
                  <div className="w-9 h-9 rounded-xl bg-secondary-fixed flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[20px]">air</span>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-on-surface">Breathe 3 min</h3>
                    <p className="text-[11px] text-on-surface-variant truncate">Soothe chest tension</p>
                  </div>
                </button>

                {/* Space 2: Venting Space */}
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playGentleChime(500);
                    setActiveModal('venting');
                  }}
                  className="p-3.5 rounded-2xl bg-surface-container-lowest hover:bg-surface-container-low shadow-sm flex flex-col justify-between h-28 text-left transition-transform active:scale-95 cursor-pointer border border-surface-container"
                >
                  <div className="w-9 h-9 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[20px]">chat_bubble_outline</span>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-on-surface">AI Venting Sanctuary</h3>
                    <p className="text-[11px] text-on-surface-variant truncate">CBT gentle reframing</p>
                  </div>
                </button>

                {/* Space 3: Affirmation */}
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playSparkle();
                    setAffirmationIdx((prev) => (prev + 1) % affirmations.length);
                    setActiveModal('affirmation');
                  }}
                  className="p-3.5 rounded-2xl bg-surface-container-lowest hover:bg-surface-container-low shadow-sm flex flex-col justify-between h-28 text-left transition-transform active:scale-95 cursor-pointer border border-surface-container"
                >
                  <div className="w-9 h-9 rounded-xl bg-tertiary-fixed flex items-center justify-center text-on-tertiary-container">
                    <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-on-surface">Sisterly Affirmation</h3>
                    <p className="text-[11px] text-on-surface-variant truncate">Tunisian daily courage</p>
                  </div>
                </button>

                {/* Space 4: Study Timer */}
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playGentleChime(480);
                    setActiveModal('timer');
                  }}
                  className="p-3.5 rounded-2xl bg-surface-container-lowest hover:bg-surface-container-low shadow-sm flex flex-col justify-between h-28 text-left transition-transform active:scale-95 cursor-pointer border border-surface-container"
                >
                  <div className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined text-[20px]">timer</span>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-on-surface">Study Timer</h3>
                    <p className="text-[11px] text-on-surface-variant truncate">Gentle 25/5 intervals</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Tunis Student Circle Card */}
            <button
              type="button"
              onClick={() => {
                soundFx.playGentleChime(510);
                setActiveModal('circle');
              }}
              className="w-full p-3.5 rounded-2xl bg-surface-container-lowest hover:bg-surface-container-low shadow-sm flex items-center justify-between transition-transform active:scale-98 cursor-pointer border border-surface-container mb-4 text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-primary shrink-0">
                  <span className="material-symbols-outlined text-[20px]">groups</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-on-surface">Tunis Student Sisterhood Circle</span>
                  <span className="text-[11px] text-on-surface-variant">
                    {circleStudents.length} students studying peacefully across INSAT, ENIT, &amp; IHEC
                  </span>
                </div>
              </div>
              <span className="material-symbols-outlined text-[18px] text-on-surface-variant">chevron_right</span>
            </button>
          </div>
        )}

        {/* Tab 2: Companion Chat */}
        {activeTab === 'companion' && (
          <div className="flex flex-col flex-1 h-[72vh]">
            <div className="p-3.5 rounded-2xl bg-secondary-fixed flex items-center justify-between mb-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-white ring-2 ring-primary">
                  <img alt={state.companionName} className="w-full h-full object-cover" src={currentCompanionAsset.image} />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <h2 className="text-sm font-bold text-on-secondary-fixed">{state.companionName || 'Lumi'}</h2>
                    <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                  </div>
                  <span className="text-[11px] text-on-secondary-fixed-variant">
                    AI Sister Companion • Non-Diagnostic Sanctuary
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    soundFx.speakText(
                      `Marhba bik ${state.name}! I am listening with an open heart. Whatever is stressing you out today, you don't have to carry it alone.`,
                      state.language
                    );
                  }}
                  className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-primary shadow-xs cursor-pointer"
                  title="Speak greeting"
                >
                  <span className="material-symbols-outlined text-[18px]">volume_up</span>
                </button>
              </div>
            </div>

            {/* Quick prompt pills tailored for Tunisian student challenges */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar mb-2">
              {[
                'Exam Panic: 3 days left',
                'PFE Thesis paralysis',
                'Feeling imposter syndrome',
                'Derja cheer: 9oli klem yfarhedni 🌸',
                'Need a gentle 5-min micro step'
              ].map((promptText, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(promptText)}
                  className="shrink-0 px-3 py-1 rounded-full bg-surface-container text-[11px] font-semibold text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
                >
                  {promptText}
                </button>
              ))}
            </div>

            {/* Chat message stream */}
            <div className="flex-1 overflow-y-auto space-y-3 p-3 bg-surface-container-lowest rounded-3xl mb-3 shadow-inner">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed relative ${
                      msg.sender === 'user'
                        ? 'bg-primary text-white rounded-tr-none'
                        : 'bg-secondary-fixed text-on-secondary-fixed rounded-tl-none shadow-xs'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                    {msg.sender === 'lumi' && (
                      <button
                        onClick={() => soundFx.speakText(msg.text, state.language)}
                        className="mt-1 text-primary hover:opacity-80 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[13px]">volume_up</span>
                        <span>Listen</span>
                      </button>
                    )}
                  </div>
                  <span className="text-[10px] text-outline mt-1 px-1">{msg.time}</span>
                </div>
              ))}
              {isCompanionTyping && (
                <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-secondary-fixed text-primary text-xs w-fit">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce delay-150" />
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce delay-300" />
                  <span className="text-[11px] font-medium ml-1">{state.companionName || 'Lumi'} is thinking gently...</span>
                </div>
              )}
            </div>

            {/* Input bar */}
            <div className="flex items-center gap-2 bg-surface-container-low p-2 rounded-full shadow-sm">
              <input
                type="text"
                placeholder={`Talk with ${state.companionName || 'Lumi'} in Derja, French, or English...`}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage();
                }}
                className="flex-1 bg-transparent px-3 text-xs text-on-surface outline-none"
              />
              <button
                type="button"
                onClick={() => handleSendMessage()}
                className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center shrink-0 shadow-sm cursor-pointer hover:opacity-95"
              >
                <span className="material-symbols-outlined text-[16px]">send</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: My Plan */}
        {activeTab === 'plan' && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <h2 className="text-xl font-bold text-on-surface">My Gentle Plan</h2>
              <p className="text-xs text-on-surface-variant">
                Paced milestones and exam timeline tailored for {state.campusOrField || 'your university in Tunisia'}.
              </p>
            </div>

            {/* AI PFE / Task De-escalator CTA */}
            <div className="p-4 rounded-3xl bg-gradient-to-r from-secondary-fixed/70 to-surface-container-lowest border border-surface-container shadow-sm flex items-center justify-between">
              <div className="flex flex-col pr-2">
                <span className="text-xs font-bold text-primary flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px]">auto_awesome</span>
                  AI Task De-escalator
                </span>
                <p className="text-[11px] text-on-surface-variant mt-0.5">
                  Overwhelmed by a thesis chapter or revision topic? Break it into 5-min steps.
                </p>
              </div>
              <button
                onClick={() => {
                  soundFx.playGentleChime(520);
                  setActiveModal('pfe_breaker');
                }}
                className="px-3.5 py-2 rounded-full bg-primary text-white text-xs font-bold shrink-0 shadow-sm cursor-pointer hover:opacity-95"
              >
                Open
              </button>
            </div>

            {/* Daily Milestones */}
            <div className="bg-surface-container-lowest p-4 rounded-3xl shadow-sm border border-surface-container flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-primary">Daily Milestones</span>
                <span className="text-xs font-bold text-secondary">{milestoneRatio.percent}% Completed</span>
              </div>
              <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${milestoneRatio.percent}%` }} />
              </div>

              <div className="flex flex-col gap-2 mt-1">
                {dailyMilestones.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low">
                    <span className={`text-xs ${item.done ? 'line-through text-outline' : 'text-on-surface font-medium'}`}>
                      {item.title}
                    </span>
                    <button
                      onClick={() => handleToggleMilestone(item.id)}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center text-white text-xs cursor-pointer transition-all ${
                        item.done ? 'bg-primary' : 'border border-outline hover:bg-surface-container'
                      }`}
                    >
                      {item.done && '✓'}
                    </button>
                  </div>
                ))}
              </div>

              {/* Add milestone */}
              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-surface-container">
                <input
                  type="text"
                  placeholder="Add a gentle micro-milestone..."
                  value={newMilestoneText}
                  onChange={(e) => setNewMilestoneText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddMilestone();
                  }}
                  className="flex-1 text-xs bg-surface-container-low px-3 py-2 rounded-xl outline-none text-on-surface"
                />
                <button
                  onClick={handleAddMilestone}
                  className="px-3 py-2 rounded-xl bg-primary text-white text-xs font-bold cursor-pointer hover:opacity-95"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Exam & Defense Timeline */}
            <div className="bg-surface-container-lowest p-4 rounded-3xl shadow-sm border border-surface-container flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-secondary uppercase tracking-wider">Upcoming Checkpoints</span>
                <span className="material-symbols-outlined text-primary text-[18px]">event_upcoming</span>
              </div>

              <div className="flex flex-col gap-2.5">
                {deadlines.map((d) => (
                  <div key={d.id} className="flex items-center justify-between p-3 rounded-2xl bg-surface-container-low">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-on-surface">{d.name}</span>
                      <span className="text-[11px] text-primary font-semibold">{d.date}</span>
                    </div>
                    <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed">
                      {d.badge}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 mt-1 pt-2 border-t border-surface-container">
                <input
                  type="text"
                  placeholder="Add an exam or PFE deadline..."
                  value={newDeadlineName}
                  onChange={(e) => setNewDeadlineName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newDeadlineName.trim()) {
                      setDeadlines([...deadlines, { id: Date.now().toString(), name: newDeadlineName.trim(), date: 'Next week', badge: 'Upcoming' }]);
                      setNewDeadlineName('');
                      soundFx.playSparkle();
                    }
                  }}
                  className="flex-1 text-xs bg-surface-container-low px-3 py-2 rounded-xl outline-none text-on-surface"
                />
                <button
                  onClick={() => {
                    if (newDeadlineName.trim()) {
                      setDeadlines([...deadlines, { id: Date.now().toString(), name: newDeadlineName.trim(), date: 'Next week', badge: 'Upcoming' }]);
                      setNewDeadlineName('');
                      soundFx.playSparkle();
                    }
                  }}
                  className="px-3 py-2 rounded-xl bg-secondary text-white text-xs font-bold cursor-pointer hover:opacity-95"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Sanctuary Hub */}
        {activeTab === 'sanctuary' && (
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-xl font-bold text-on-surface">Sanctuary Vault</h2>
              <p className="text-xs text-on-surface-variant">
                Confidential, stigma-free grounding spaces adapted for student well-being in Tunisia.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {/* Space 1: AI PFE & Exam Micro-Breaker */}
              <div className="p-4 rounded-3xl bg-surface-container-lowest shadow-sm flex items-center justify-between border border-surface-container">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-secondary-fixed flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-on-surface">AI PFE &amp; Exam Task Breaker</h3>
                    <p className="text-[11px] text-on-surface-variant">Dismantles paralysis into 5-minute micro-actions</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    soundFx.playGentleChime(528);
                    setActiveModal('pfe_breaker');
                  }}
                  className="px-3.5 py-1.5 rounded-full bg-primary text-white text-xs font-bold cursor-pointer shadow-xs"
                >
                  Start
                </button>
              </div>

              {/* Space 2: Box Breathing */}
              <div className="p-4 rounded-3xl bg-surface-container-lowest shadow-sm flex items-center justify-between border border-surface-container">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-secondary-fixed flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[20px]">air</span>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-on-surface">3-Minute Box Breathing</h3>
                    <p className="text-[11px] text-on-surface-variant">Calms vagus nerve &amp; reduces exam panic</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    soundFx.playGentleChime(528);
                    setActiveModal('breathe');
                  }}
                  className="px-3.5 py-1.5 rounded-full bg-primary text-white text-xs font-bold cursor-pointer shadow-xs"
                >
                  Breathe
                </button>
              </div>

              {/* Space 3: Private AI Venting Diary */}
              <div className="p-4 rounded-3xl bg-surface-container-lowest shadow-sm flex items-center justify-between border border-surface-container">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-primary-fixed flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[20px]">chat_bubble_outline</span>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-on-surface">Private Venting Diary with AI Reframe</h3>
                    <p className="text-[11px] text-on-surface-variant">CBT-inspired non-judgmental thought reframing</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    soundFx.playGentleChime(500);
                    setActiveModal('venting');
                  }}
                  className="px-3.5 py-1.5 rounded-full bg-primary text-white text-xs font-bold cursor-pointer shadow-xs"
                >
                  Reflect
                </button>
              </div>

              {/* Space 4: Soundscapes */}
              <div className="p-4 rounded-3xl bg-surface-container-lowest shadow-sm flex items-center justify-between border border-surface-container">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-tertiary-fixed flex items-center justify-center text-on-tertiary-container">
                    <span className="material-symbols-outlined text-[20px]">waves</span>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-on-surface">Tunisian Soundscapes</h3>
                    <p className="text-[11px] text-on-surface-variant">Sidi Bou Said waves &amp; Jasmine rain</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    soundFx.playGentleChime(480);
                    setActiveModal('soundscapes');
                  }}
                  className="px-3.5 py-1.5 rounded-full bg-secondary text-white text-xs font-bold cursor-pointer shadow-xs"
                >
                  Listen
                </button>
              </div>

              {/* Space 5: Desk Stretches */}
              <div className="p-4 rounded-3xl bg-surface-container-lowest shadow-sm flex items-center justify-between border border-surface-container">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-surface-container flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined text-[20px]">fitness_center</span>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-on-surface">Desk Tension Release Stretches</h3>
                    <p className="text-[11px] text-on-surface-variant">4 gentle postures for neck and shoulders</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    soundFx.playGentleChime(490);
                    setActiveModal('stretches');
                  }}
                  className="px-3.5 py-1.5 rounded-full bg-secondary text-white text-xs font-bold cursor-pointer shadow-xs"
                >
                  Guide
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Profile & Settings */}
        {activeTab === 'profile' && (
          <div className="flex flex-col gap-4">
            <div className="p-4 rounded-3xl bg-secondary-fixed shadow-sm flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl shadow-sm">
                {state.name ? state.name.slice(0, 1).toUpperCase() : 'Y'}
              </div>
              <div className="flex flex-col">
                <h2 className="text-base font-bold text-on-secondary-fixed">{state.name || 'Yasmine'}</h2>
                <span className="text-xs text-on-secondary-fixed-variant">
                  {state.campusOrField || 'INSAT, Université de Tunis'}
                </span>
                <span className="text-[11px] font-semibold text-primary mt-0.5">
                  Companion: {state.companionName || 'Lumi'} ({state.companionType})
                </span>
              </div>
            </div>

            {/* Safety & Non-Diagnostic Guarantee Card */}
            <div className="bg-surface-container-lowest p-4 rounded-3xl shadow-sm border border-surface-container flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-secondary-fixed flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[22px]">verified_user</span>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-on-surface">Non-Diagnostic Safety Shield</h3>
                  <p className="text-[11px] text-on-surface-variant">Tunisian crisis hotlines &amp; privacy pledge</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal('crisis_shield')}
                className="px-3.5 py-1.5 rounded-full bg-primary text-white text-xs font-bold cursor-pointer"
              >
                View
              </button>
            </div>

            {/* Quick Palette Picker */}
            <div className="bg-surface-container-lowest p-4 rounded-3xl shadow-sm border border-surface-container flex flex-col gap-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-secondary">Live Theme Palette</span>
              <div className="grid grid-cols-3 gap-2">
                {Object.values(PALETTE_THEMES).map((theme) => {
                  const isSelected = state.paletteTheme === theme.id;
                  return (
                    <button
                      key={theme.id}
                      onClick={() => {
                        soundFx.playGentleChime(540);
                        updateState({ paletteTheme: theme.id });
                      }}
                      className={`p-2.5 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                        isSelected ? 'ring-2 ring-primary shadow-xs' : 'bg-surface-container-low'
                      }`}
                      style={{ backgroundColor: isSelected ? theme.lightCard : undefined }}
                    >
                      <span className="w-4 h-4 rounded-full shadow-xs" style={{ backgroundColor: theme.primary }} />
                      <span className="truncate w-full text-center text-[11px]">{theme.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Companion Changer */}
            <div className="bg-surface-container-lowest p-4 rounded-3xl shadow-sm border border-surface-container flex flex-col gap-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-secondary">Switch Companion</span>
              <div className="grid grid-cols-3 gap-2">
                {COMPANION_OPTIONS.map((c) => {
                  const isSelected = state.companionType === c.type;
                  return (
                    <button
                      key={c.type}
                      onClick={() => {
                        soundFx.playSparkle();
                        updateState({ companionType: c.type });
                      }}
                      className={`p-2 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 cursor-pointer transition-all ${
                        isSelected ? 'bg-secondary-fixed ring-2 ring-primary' : 'bg-surface-container-low'
                      }`}
                    >
                      <img alt={c.name} className="w-10 h-10 rounded-full object-cover" src={c.image} />
                      <span className="text-[11px]">{c.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation options */}
            <div className="bg-surface-container-lowest p-4 rounded-3xl shadow-sm border border-surface-container flex flex-col gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-secondary mb-1">Sanctuary Setup</h3>
              <button
                onClick={onRevisitOnboarding}
                className="w-full py-2.5 px-3 rounded-xl bg-surface-container-low hover:bg-surface-container text-xs font-semibold text-on-surface flex items-center justify-between cursor-pointer"
              >
                <span>Revisit Onboarding Screens (15 Screens)</span>
                <span className="material-symbols-outlined text-[16px]">tune</span>
              </button>
              <button
                onClick={onOpenSettings}
                className="w-full py-2.5 px-3 rounded-xl bg-surface-container-low hover:bg-surface-container text-xs font-semibold text-on-surface flex items-center justify-between cursor-pointer"
              >
                <span>Color Sanctuary Studio</span>
                <span className="material-symbols-outlined text-[16px]">palette</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* Interactive Modals */}
      {/* ========================================================================= */}

      {/* Modal 1: AI PFE & Exam Micro-Breaker Modal */}
      {activeModal === 'pfe_breaker' && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest w-full max-w-sm rounded-3xl p-5 shadow-xl flex flex-col relative max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">auto_awesome</span>
                AI Task De-escalator
              </span>
              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <h2 className="text-lg font-bold text-on-surface mb-1">Dissolve Exam &amp; PFE Paralysis</h2>
            <p className="text-xs text-on-surface-variant mb-3">
              Describe what task feels impossibly huge right now. Gemini AI breaks it down into three 5-minute micro-steps.
            </p>

            <div className="flex flex-col gap-2 mb-3">
              <label className="text-[11px] font-bold text-on-surface">The daunting task:</label>
              <input
                type="text"
                value={pfeTaskInput}
                onChange={(e) => setPfeTaskInput(e.target.value)}
                placeholder="e.g. Chapter 2 Methodology or Signal Processing Exam"
                className="w-full px-3 py-2 text-xs rounded-xl bg-surface-container-low text-on-surface outline-none border border-surface-container"
              />
              <div className="flex items-center gap-2">
                <label className="text-[11px] font-semibold text-on-surface-variant shrink-0">Due by:</label>
                <input
                  type="text"
                  value={pfeDeadlineInput}
                  onChange={(e) => setPfeDeadlineInput(e.target.value)}
                  placeholder="e.g. Next Monday"
                  className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-surface-container-low text-on-surface outline-none border border-surface-container"
                />
              </div>
            </div>

            <button
              onClick={handleGeneratePfeBreakdown}
              disabled={isGeneratingPfeBreakdown || !pfeTaskInput.trim()}
              className="w-full py-2.5 rounded-full bg-primary text-white text-xs font-bold shadow-md cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              {isGeneratingPfeBreakdown ? (
                <>
                  <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                  <span>Lumi is breaking this down...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                  <span>Break Into 5-Min Micro-Steps</span>
                </>
              )}
            </button>

            {pfeBreakdownResult && (
              <div className="mt-4 pt-3 border-t border-surface-container flex flex-col gap-3 animate-in fade-in">
                <div className="p-3 rounded-2xl bg-secondary-fixed/50 border border-secondary-fixed">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Mindset Reframe</span>
                  <p className="text-xs text-on-secondary-fixed font-medium mt-1 leading-snug">
                    {pfeBreakdownResult.mindsetReframe}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold text-on-surface">Your 3 Gentle Micro-Steps:</span>
                  {pfeBreakdownResult.microSteps.map((step, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-surface-container-low flex items-start gap-2 text-xs">
                      <span className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="text-on-surface leading-snug flex-1">{step}</span>
                    </div>
                  ))}
                </div>

                <div className="p-2 rounded-xl bg-tertiary-fixed/40 text-center text-[11px] font-semibold text-on-tertiary-container italic">
                  "{pfeBreakdownResult.calmAffirmation}"
                </div>

                <button
                  onClick={() => {
                    soundFx.playGentleChime(528);
                    setActiveModal('timer');
                    setTimerDuration(900);
                    setTimerSeconds(900);
                    setIsTimerRunning(true);
                  }}
                  className="w-full py-2 rounded-full bg-secondary text-white text-xs font-bold shadow-sm cursor-pointer hover:opacity-95 flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                  <span>Start Step 1 (15m Timer)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal 2: Breathe Modal */}
      {activeModal === 'breathe' && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest w-full max-w-sm rounded-3xl p-6 shadow-xl flex flex-col items-center text-center relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
            <span className="text-xs font-bold text-primary uppercase tracking-wider mb-2">3-Minute Grounding</span>
            <h2 className="text-xl font-bold text-on-surface mb-4">Gentle Box Breathing</h2>

            {/* Animated breathing circle */}
            <div
              className={`w-44 h-44 rounded-full flex flex-col items-center justify-center shadow-lg transition-transform duration-1000 ${
                breathPhase === 'Inhale'
                  ? 'scale-110 bg-secondary-fixed ring-4 ring-primary-container'
                  : breathPhase === 'Hold'
                  ? 'scale-105 bg-tertiary-fixed ring-4 ring-secondary'
                  : 'scale-90 bg-surface-container ring-2 ring-outline'
              }`}
            >
              <span className="text-lg font-bold text-on-surface">{breathPhase}</span>
              <span className="text-3xl font-bold text-primary mt-1">{breathCount}</span>
            </div>

            <p className="text-xs text-on-surface-variant mt-5 leading-relaxed">
              Inhale peace, hold gently, and exhale all academic tension.
            </p>
            <span className="text-[11px] font-semibold text-secondary mt-1">
              Completed cycles: {completedBreathCycles}
            </span>
          </div>
        </div>
      )}

      {/* Modal 3: Venting Space Modal with AI Cognitive Reframing */}
      {activeModal === 'venting' && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest w-full max-w-sm rounded-3xl p-5 shadow-xl flex flex-col relative max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-primary uppercase tracking-wider">Private &amp; Confidential</span>
              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <h2 className="text-lg font-bold text-on-surface mb-1">Venting &amp; Release Harbor</h2>
            <p className="text-xs text-on-surface-variant mb-3">
              Write freely about your exams, thesis, or exhaustion. Zero judgment safe space.
            </p>

            <div className="flex gap-1.5 mb-2 overflow-x-auto no-scrollbar">
              {(['Exam Stress', 'PFE Pressure', 'Fatigue', 'Gratitude'] as const).map((tag) => (
                <button
                  key={tag}
                  onClick={() => setVentTag(tag)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer ${
                    ventTag === tag ? 'bg-primary text-white' : 'bg-surface-container text-on-surface'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            <textarea
              rows={4}
              value={ventText}
              onChange={(e) => setVentText(e.target.value)}
              placeholder="Write freely... e.g. I feel like everyone at INSAT understands this except me, and I'm scared I will disappoint my family..."
              className="w-full p-3 rounded-2xl bg-surface-container-low text-xs text-on-surface outline-none focus:ring-2 focus:ring-primary/40 resize-none mb-2.5"
            />

            <div className="flex items-center gap-2 mb-3">
              <button
                onClick={handleReframeVent}
                disabled={isReframingVent || !ventText.trim()}
                className="flex-1 py-2 px-3 rounded-xl bg-secondary-fixed text-on-secondary-fixed text-xs font-bold flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
              >
                {isReframingVent ? (
                  <>
                    <span className="material-symbols-outlined text-[14px] animate-spin">progress_activity</span>
                    <span>Reframing...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                    <span>Lumi CBT Reframe (AI)</span>
                  </>
                )}
              </button>

              <button
                onClick={handleSaveVenting}
                disabled={!ventText.trim()}
                className="py-2 px-4 rounded-xl bg-primary text-white text-xs font-bold shadow-md cursor-pointer disabled:opacity-50"
              >
                Save
              </button>
            </div>

            {/* AI Reframing Card */}
            {activeReframingResult && (
              <div className="p-3.5 rounded-2xl bg-secondary-fixed/40 border border-secondary-fixed mb-3 flex flex-col gap-2 text-xs animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">lightbulb</span>
                    Gentle Perspective Shift
                  </span>
                  <span className="text-[10px] text-outline">Non-diagnostic</span>
                </div>
                <p className="text-on-surface leading-snug">
                  <strong className="text-primary">Validation:</strong> {activeReframingResult.validation}
                </p>
                {activeReframingResult.distortionInsight && (
                  <p className="text-on-surface-variant text-[11px] italic">
                    💡 {activeReframingResult.distortionInsight}
                  </p>
                )}
                <p className="text-on-surface leading-snug font-medium">
                  🌿 <strong>Gentle Reframe:</strong> {activeReframingResult.gentleReframe}
                </p>
                <div className="p-2 rounded-xl bg-white/70 text-[11px] font-semibold text-secondary flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px]">self_improvement</span>
                  <span>Somatic Micro-Action: {activeReframingResult.microAction}</span>
                </div>
              </div>
            )}

            {/* Previous entries */}
            {state.ventingEntries.length > 0 && (
              <div className="mt-2 pt-3 border-t border-surface-container flex flex-col gap-2">
                <span className="text-[11px] font-bold text-outline uppercase tracking-wider">Past Reflections</span>
                {state.ventingEntries.slice(0, 4).map((e) => (
                  <div key={e.id} className="p-3 rounded-xl bg-surface-container-low text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] text-primary font-bold">{e.tag}</span>
                      <span className="text-[10px] text-outline">{e.timestamp}</span>
                    </div>
                    <p className="text-on-surface leading-snug">{e.content}</p>
                    {e.aiReframe && (
                      <div className="mt-1.5 p-2 rounded-lg bg-secondary-fixed/30 text-[11px] text-on-secondary-fixed">
                        🌿 {e.aiReframe.gentleReframe}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal 4: Non-Diagnostic Safety & Confidential Tunisian Helplines Shield */}
      {activeModal === 'crisis_shield' && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest w-full max-w-sm rounded-3xl p-5 shadow-xl flex flex-col relative max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">verified_user</span>
                Safety Sanctuary
              </span>
              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <h2 className="text-lg font-bold text-on-surface mb-1">Safety &amp; Non-Diagnostic Charter</h2>
            <div className="p-3 rounded-2xl bg-secondary-fixed/50 border border-secondary-fixed mb-3 text-xs leading-relaxed text-on-secondary-fixed">
              <strong>HerCare Commitment:</strong> This application is a compassionate, stigma-free emotional companion and daily habit support system for students. It does <em>not</em> provide medical diagnosis, clinical treatment, or psychiatric care.
            </div>

            <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider mb-2">
              Confidential Support in Tunisia (24/7):
            </h3>

            <div className="space-y-2 mb-4">
              <div className="p-3 rounded-2xl bg-surface-container-low flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-on-surface">SAMU Urgences Médicales</h4>
                  <p className="text-[11px] text-on-surface-variant">Immediate medical &amp; acute crisis dispatch</p>
                </div>
                <a
                  href="tel:190"
                  className="px-3 py-1.5 rounded-full bg-primary text-white text-xs font-bold shadow-xs flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">call</span>
                  <span>190</span>
                </a>
              </div>

              <div className="p-3 rounded-2xl bg-surface-container-low flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-on-surface">Protection Civile Tunisie</h4>
                  <p className="text-[11px] text-on-surface-variant">Emergency safety assistance</p>
                </div>
                <a
                  href="tel:198"
                  className="px-3 py-1.5 rounded-full bg-secondary text-white text-xs font-bold shadow-xs flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">call</span>
                  <span>198</span>
                </a>
              </div>

              <div className="p-3 rounded-2xl bg-surface-container-low flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-on-surface">SOS Amitié Tunisie</h4>
                  <p className="text-[11px] text-on-surface-variant">Confidential listening &amp; psychological support</p>
                </div>
                <a
                  href="tel:71801111"
                  className="px-3 py-1.5 rounded-full bg-surface-container text-on-surface text-xs font-bold shadow-xs flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">call</span>
                  <span>71 801 111</span>
                </a>
              </div>

              <div className="p-3 rounded-2xl bg-surface-container-low">
                <h4 className="text-xs font-bold text-on-surface">Campus Psychological Clinics</h4>
                <p className="text-[11px] text-on-surface-variant mt-0.5 leading-snug">
                  Direction de la Médecine Scolaire et Universitaire (DMSU) provides confidential consultations across university campuses in Tunis, Sfax, Sousse, and Monastir.
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 rounded-full bg-primary text-white text-xs font-bold shadow-md cursor-pointer"
            >
              Return to Sanctuary
            </button>
          </div>
        </div>
      )}

      {/* Modal 5: Tunisian Ambient Soundscapes */}
      {activeModal === 'soundscapes' && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest w-full max-w-sm rounded-3xl p-5 shadow-xl flex flex-col relative max-h-[85vh]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-secondary uppercase tracking-wider">Acoustic Sanctuary</span>
              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <h2 className="text-lg font-bold text-on-surface mb-1">Tunisian Ambient Soundscapes</h2>
            <p className="text-xs text-on-surface-variant mb-4">
              Ground your nervous system during studying with synthesized nature tones.
            </p>

            <div className="space-y-2.5 mb-4">
              {[
                { id: 'lofi', name: 'Tunis Café Mint Tea Lo-Fi', desc: 'Warm acoustic chords inspired by study cafés', icon: 'local_cafe' },
                { id: 'ocean', name: 'Sidi Bou Said Mediterranean Waves', desc: 'Rhythmic coastal breeze & gentle wave wash', icon: 'water' },
                { id: 'rain', name: 'Jasmine Rain in Carthage', desc: 'Calming soft rain over green garden leaves', icon: 'rainy' }
              ].map((s) => {
                const isSelected = ambientType === s.id && isLofiOn;
                return (
                  <button
                    key={s.id}
                    onClick={() => handleSelectSoundscape(s.id as 'lofi' | 'ocean' | 'rain')}
                    className={`w-full p-3 rounded-2xl flex items-center justify-between text-left cursor-pointer transition-all ${
                      isSelected ? 'bg-secondary-fixed ring-2 ring-primary text-on-secondary-fixed' : 'bg-surface-container-low hover:bg-surface-container text-on-surface'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white/80 flex items-center justify-center text-primary shadow-xs">
                        <span className="material-symbols-outlined text-[20px]">{s.icon}</span>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold">{s.name}</h4>
                        <p className="text-[11px] text-on-surface-variant">{s.desc}</p>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  handleToggleLofi();
                }}
                className={`flex-1 py-2.5 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                  isLofiOn ? 'bg-error-container text-error' : 'bg-primary text-white shadow-md'
                }`}
              >
                {isLofiOn ? 'Turn Off Sound' : 'Play Soundscape'}
              </button>
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2.5 rounded-full bg-surface-container text-xs font-bold text-on-surface cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 6: Affirmation Modal */}
      {activeModal === 'affirmation' && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest w-full max-w-sm rounded-3xl p-6 shadow-xl flex flex-col items-center text-center relative">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
            <div className="w-12 h-12 rounded-full bg-secondary-fixed flex items-center justify-center text-primary mb-3">
              <span className="material-symbols-outlined text-[24px]">auto_awesome</span>
            </div>
            <span className="text-xs font-bold text-secondary uppercase tracking-wider mb-2">Sisterly Voice</span>
            <p className="text-sm font-semibold text-on-surface leading-relaxed mb-6 italic">
              "{affirmations[affirmationIdx]}"
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  soundFx.speakText(affirmations[affirmationIdx], state.language);
                }}
                className="px-4 py-2 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[15px]">volume_up</span>
                <span>Listen</span>
              </button>
              <button
                onClick={() => {
                  soundFx.playSparkle();
                  setAffirmationIdx((prev) => (prev + 1) % affirmations.length);
                }}
                className="px-4 py-2 rounded-full bg-primary text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Next Whisper ✨
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 7: Timer Modal */}
      {activeModal === 'timer' && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest w-full max-w-sm rounded-3xl p-6 shadow-xl flex flex-col items-center text-center relative">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
            <span className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Study Sprint</span>
            <h2 className="text-xl font-bold text-on-surface mb-3">Focus Interval</h2>

            <div className="flex items-center gap-1.5 mb-4">
              {[
                { min: 15, sec: 900 },
                { min: 25, sec: 1500 },
                { min: 45, sec: 2700 }
              ].map((p) => (
                <button
                  key={p.min}
                  onClick={() => {
                    soundFx.playGentleChime(480);
                    setIsTimerRunning(false);
                    setTimerDuration(p.sec);
                    setTimerSeconds(p.sec);
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer ${
                    timerDuration === p.sec ? 'bg-primary text-white' : 'bg-surface-container text-on-surface'
                  }`}
                >
                  {p.min} min
                </button>
              ))}
            </div>

            <div className="text-5xl font-bold text-primary mb-6 font-mono">
              {formatTimerSeconds(timerSeconds)}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleFocusTimer}
                className="px-6 py-2.5 rounded-full bg-primary text-white text-xs font-bold shadow-md cursor-pointer hover:opacity-95"
              >
                {isTimerRunning ? 'Pause' : 'Start Sprint'}
              </button>
              <button
                onClick={() => {
                  soundFx.playGentleChime(440);
                  setIsTimerRunning(false);
                  setTimerSeconds(timerDuration);
                }}
                className="px-4 py-2.5 rounded-full bg-surface-container text-on-surface text-xs font-bold cursor-pointer hover:bg-surface-container-high"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 8: Tunis Circle Modal */}
      {activeModal === 'circle' && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest w-full max-w-sm rounded-3xl p-5 shadow-xl flex flex-col relative max-h-[85vh]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-primary uppercase tracking-wider">Quiet Study Room</span>
              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <h2 className="text-lg font-bold text-on-surface mb-1">Tunis Student Sisterhood Circle</h2>
            <p className="text-xs text-on-surface-variant mb-3">
              Students across INSAT, ENIT, IHEC, and Faculté de Médecine studying silently together in mutual support.
            </p>

            <button
              onClick={handleJoinCircle}
              className={`w-full py-2.5 rounded-full text-xs font-bold mb-3 shadow-sm cursor-pointer transition-colors ${
                isUserInCircle
                  ? 'bg-error-container text-error'
                  : 'bg-primary text-white hover:opacity-95'
              }`}
            >
              {isUserInCircle ? 'Leave Study Circle' : 'Join Quiet Focus Circle 🌸'}
            </button>

            {/* Quick Cheer Post */}
            <div className="flex items-center gap-1.5 mb-3">
              <input
                type="text"
                placeholder="Whisper anonymous encouragement (e.g. 3andek da3m!)..."
                value={cheerNoteInput}
                onChange={(e) => setCheerNoteInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && cheerNoteInput.trim()) {
                    soundFx.playSparkle();
                    alert(`✨ Your whisper "${cheerNoteInput.trim()}" has been sent anonymously to the circle!`);
                    setCheerNoteInput('');
                  }
                }}
                className="flex-1 text-xs bg-surface-container-low px-3 py-1.5 rounded-xl outline-none text-on-surface"
              />
              <button
                onClick={() => {
                  if (cheerNoteInput.trim()) {
                    soundFx.playSparkle();
                    alert(`✨ Your whisper "${cheerNoteInput.trim()}" has been sent anonymously to the circle!`);
                    setCheerNoteInput('');
                  }
                }}
                className="px-3 py-1.5 rounded-xl bg-secondary text-white text-xs font-bold cursor-pointer"
              >
                Cheer
              </button>
            </div>

            <div className="space-y-2 max-h-52 overflow-y-auto">
              {circleStudents.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low text-xs">
                  <div>
                    <span className="font-bold text-on-surface">{student.name}</span>{' '}
                    <span className="text-outline text-[11px]">({student.uni})</span>
                    <p className="text-[11px] text-on-surface-variant">{student.goal}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCheerStudent(student.id)}
                      className="px-2 py-0.5 rounded-full bg-white hover:bg-secondary-fixed text-[11px] font-bold text-primary flex items-center gap-1 cursor-pointer shadow-2xs"
                      title="Cheer up sister"
                    >
                      <span>❤️</span>
                      <span>{student.cheers || 0}</span>
                    </button>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed">
                      {student.state}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal 9: Desk Stretches Modal */}
      {activeModal === 'stretches' && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest w-full max-w-sm rounded-3xl p-5 shadow-xl flex flex-col relative max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-secondary uppercase tracking-wider">Somatic Reset</span>
              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <h2 className="text-lg font-bold text-on-surface mb-1">Desk Tension Release</h2>
            <p className="text-xs text-on-surface-variant mb-4">
              Take 2 minutes to unhook your shoulders and soften your brow.
            </p>
            <div className="space-y-3">
              {[
                { title: 'Gentle Neck Rolls', desc: 'Roll chin to chest, hold for 5s, gently tilt right, then left.', icon: 'self_improvement' },
                { title: 'Shoulder Blades Hug', desc: 'Wrap your arms around yourself like a warm embrace, rounding the upper back.', icon: 'favorite' },
                { title: 'Palming for Tired Eyes', desc: 'Rub palms together until warm, gently cup over closed eyes for 30s.', icon: 'visibility' },
                { title: 'Seated Torso Twist', desc: 'Hold chair arm and gently gaze over your shoulder with an open ribcage.', icon: 'accessibility_new' }
              ].map((s, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-surface-container-low flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary shrink-0 shadow-xs">
                    <span className="material-symbols-outlined text-[18px]">{s.icon}</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-on-surface">{s.title}</h4>
                    <p className="text-[11px] text-on-surface-variant mt-0.5 leading-snug">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal 10: Notifications Drawer Modal */}
      {activeModal === 'notifications' && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest w-full max-w-sm rounded-3xl p-5 shadow-xl flex flex-col relative max-h-[85vh]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-primary uppercase tracking-wider">Sanctuary Reminders</span>
              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <h2 className="text-lg font-bold text-on-surface mb-3">Today's Kind Notes</h2>

            <div className="space-y-2.5 overflow-y-auto">
              {[
                { title: 'Hydration Pause', time: '10 mins ago', desc: 'Have you had a glass of water recently? Your brain needs fluids to think clearly! 💧' },
                { title: 'Quiet Study Circle', time: '1 hour ago', desc: '22 girls are currently studying peacefully across Tunis in the sisterhood circle.' },
                { title: 'Evening Check-in Scheduled', time: 'Tonight at 9:00 PM', desc: 'Lumi will check in with you for a gentle bedtime reflection.' }
              ].map((n, i) => (
                <div key={i} className="p-3 rounded-2xl bg-surface-container-low text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-on-surface">{n.title}</span>
                    <span className="text-[10px] text-outline">{n.time}</span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant leading-snug">{n.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Fixed Bottom Navigation Bar */}
      <nav aria-label="Bottom Navigation" className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-surface-container-lowest/95 backdrop-blur-md border-t border-surface-container-high py-2 px-3 flex items-center justify-around z-40">
        <button
          onClick={() => {
            soundFx.playGentleChime(480);
            setActiveTab('home');
          }}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl cursor-pointer ${
            activeTab === 'home' ? 'text-primary font-bold' : 'text-outline font-medium'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]" style={activeTab === 'home' ? { fontVariationSettings: "'FILL' 1" } : undefined}>
            home
          </span>
          <span className="text-[10px]">Home</span>
        </button>

        <button
          onClick={() => {
            soundFx.playGentleChime(500);
            setActiveTab('companion');
          }}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl cursor-pointer ${
            activeTab === 'companion' ? 'text-primary font-bold' : 'text-outline font-medium'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]" style={activeTab === 'companion' ? { fontVariationSettings: "'FILL' 1" } : undefined}>
            auto_awesome
          </span>
          <span className="text-[10px]">Companion</span>
        </button>

        <button
          onClick={() => {
            soundFx.playGentleChime(520);
            setActiveTab('plan');
          }}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl cursor-pointer ${
            activeTab === 'plan' ? 'text-primary font-bold' : 'text-outline font-medium'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]" style={activeTab === 'plan' ? { fontVariationSettings: "'FILL' 1" } : undefined}>
            calendar_today
          </span>
          <span className="text-[10px]">My Plan</span>
        </button>

        <button
          onClick={() => {
            soundFx.playGentleChime(540);
            setActiveTab('sanctuary');
          }}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl cursor-pointer ${
            activeTab === 'sanctuary' ? 'text-primary font-bold' : 'text-outline font-medium'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]" style={activeTab === 'sanctuary' ? { fontVariationSettings: "'FILL' 1" } : undefined}>
            spa
          </span>
          <span className="text-[10px]">Sanctuary</span>
        </button>

        <button
          onClick={() => {
            soundFx.playGentleChime(560);
            setActiveTab('profile');
          }}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl cursor-pointer ${
            activeTab === 'profile' ? 'text-primary font-bold' : 'text-outline font-medium'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]" style={activeTab === 'profile' ? { fontVariationSettings: "'FILL' 1" } : undefined}>
            person
          </span>
          <span className="text-[10px]">Profile</span>
        </button>
      </nav>
    </div>
  );
};
