#!/usr/bin/env node
// Writes dist/build.txt: the commit this build was made from. The Google Search Console workflow
// (.github/workflows/google-search-console.yml) waits until the live site serves its commit before it
// tells Google anything, and an audit can read it to prove which build is live.
//
// Cloudflare Pages sets CF_PAGES_COMMIT_SHA during its builds; anywhere else the git HEAD is used.
// Runs last in `npm run build`.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const dist = path.resolve('dist');
if (!fs.existsSync(dist)) {
  console.log('No dist/ folder, so no build stamp.');
  process.exit(0);
}
let sha = process.env.CF_PAGES_COMMIT_SHA || '';
if (!sha) {
  try {
    sha = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    sha = 'unknown';
  }
}
fs.writeFileSync(path.join(dist, 'build.txt'), `${sha}\n`);
console.log(`Build stamp: dist/build.txt = ${sha}`);
