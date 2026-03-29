#!/usr/bin/env node
/**
 * RAUNI CONTEXT UPDATER
 * Usage: node .rauni/update.mjs "Session title" "What happened" "key decision 1" "key decision 2"
 * Or:   node .rauni/update.mjs --interactive
 *
 * Updates context.json with new session log entry.
 * Commit and push to GitHub after running.
 */

import { readFileSync, writeFileSync } from 'fs';
import { createInterface } from 'readline';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CTX_PATH = join(__dirname, 'context.json');

const ctx = JSON.parse(readFileSync(CTX_PATH, 'utf8'));

const today = new Date().toISOString().split('T')[0];
const args = process.argv.slice(2);

if (args.includes('--interactive') || args.length === 0) {
  // Interactive mode
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const ask = (q) => new Promise(r => rl.question(q, r));

  console.log('\n🌀 RAUNI CONTEXT UPDATER\n');

  const session = await ask('Session name: ');
  const what = await ask('What happened (one paragraph): ');
  const decisions = [];
  console.log('Key decisions (empty line to stop):');
  let d;
  while ((d = await ask('  → ')) !== '') decisions.push(d);
  const breakthrough = await ask('Breakthrough moment (or enter to skip): ');
  const seed = await ask('New vision seed (or enter to skip): ');

  rl.close();

  const entry = {
    date: today,
    session,
    what_happened: what,
    key_decisions: decisions,
  };
  if (breakthrough) entry.breakthrough = breakthrough;

  ctx._session_log.push(entry);
  if (seed) ctx._vision_seeds.push(seed);
  ctx._meta.version = bumpVersion(ctx._meta.version);

  writeFileSync(CTX_PATH, JSON.stringify(ctx, null, 2));
  console.log(`\n✅ Context updated to v${ctx._meta.version}`);
  console.log('Run: git add .rauni/context.json && git commit -m "context: update session log" && git push');

} else {
  // CLI mode: node update.mjs "session" "what" "decision1" "decision2"
  const [session, what, ...decisions] = args;
  const entry = { date: today, session, what_happened: what, key_decisions: decisions };
  ctx._session_log.push(entry);
  ctx._meta.version = bumpVersion(ctx._meta.version);
  writeFileSync(CTX_PATH, JSON.stringify(ctx, null, 2));
  console.log(`✅ Context updated to v${ctx._meta.version}`);
}

function bumpVersion(v) {
  const parts = v.split('.').map(Number);
  parts[2]++;
  return parts.join('.');
}
