import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getStepProgress,
  getCompanionDialogue,
  getArrivalGuidance,
  formatTimerSeconds,
  calculateMilestonesRatio,
  PALETTE_THEMES
} from './sanctuaryLogic.ts';

test('getStepProgress calculates accurate percentage for 7-step journey', () => {
  assert.deepEqual(getStepProgress(0), { percent: 0, label: 'Start' });
  assert.equal(getStepProgress(1).percent, 14); // 1/7 = 14.28% -> 14%
  assert.equal(getStepProgress(2).percent, 29); // 2/7 = 28.57% -> 29%
  assert.equal(getStepProgress(3).percent, 43); // 3/7 = 42.8% -> 43%
  assert.equal(getStepProgress(4).percent, 57); // 4/7 = 57.1% -> 57%
  assert.equal(getStepProgress(5).percent, 71); // 5/7 = 71.4% -> 71%
  assert.equal(getStepProgress(6).percent, 86); // 6/7 = 85.7% -> 86%
  assert.deepEqual(getStepProgress(7), { percent: 100, label: 'Complete' });
});

test('getCompanionDialogue produces expected dialect and tone variants', () => {
  const tnMsg = getCompanionDialogue({ name: 'Nour', language: 'tn', spirit: 'gentle' });
  assert.ok(tnMsg.includes('Nour'));
  assert.ok(tnMsg.includes('Lumi') || tnMsg.includes('Marhba') || tnMsg.includes('3aslema'));

  const shortMsg = getCompanionDialogue({ name: 'Sarah', language: 'en', format: 'short' });
  assert.ok(shortMsg.includes('Sarah'));
  assert.ok(shortMsg.includes('•'));

  const frMsg = getCompanionDialogue({ name: 'Yasmine', language: 'fr' });
  assert.ok(frMsg.includes('Yasmine'));
  assert.ok(frMsg.includes('Coucou'));
});

test('getArrivalGuidance maps emotional state to compassionate guidance', () => {
  const over = getArrivalGuidance('Overwhelmed', 'Yasmine');
  assert.ok(over.speech.includes('lot to carry'));
  assert.equal(over.recommendedTag, 'Pacing: Slow & Gentle');

  const great = getArrivalGuidance('Great', 'Yasmine');
  assert.ok(great.speech.includes('glowing'));
  assert.equal(great.recommendedTag, 'Pacing: Radiant Energy');
});

test('formatTimerSeconds formats seconds into mm:ss', () => {
  assert.equal(formatTimerSeconds(0), '00:00');
  assert.equal(formatTimerSeconds(65), '01:05');
  assert.equal(formatTimerSeconds(1500), '25:00');
  assert.equal(formatTimerSeconds(900), '15:00');
});

test('calculateMilestonesRatio returns correct percent and display text', () => {
  const r = calculateMilestonesRatio(1, 3);
  assert.equal(r.percent, 33);
  assert.equal(r.text, '1 of 3 small milestones (33%)');

  const r2 = calculateMilestonesRatio(3, 3);
  assert.equal(r2.percent, 100);
});

test('PALETTE_THEMES contains all 6 sanctuary palettes', () => {
  const keys = Object.keys(PALETTE_THEMES);
  assert.equal(keys.length, 6);
  assert.ok(PALETTE_THEMES.lavender);
  assert.ok(PALETTE_THEMES.pink);
  assert.ok(PALETTE_THEMES.blue);
  assert.ok(PALETTE_THEMES.mint);
  assert.ok(PALETTE_THEMES.peach);
  assert.ok(PALETTE_THEMES.yellow);
});
