#!/usr/bin/env node

/**
 * Verify logo file mapping
 * 
 * This script helps identify if logo files are correctly named.
 * Run this and visually inspect each logo to confirm it matches the filename.
 */

import { readdir } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const LOGOS_DIR = join(__dirname, '../client/src/assets/logos');

async function main() {
  console.log('🔍 Logo Files Found:\n');
  
  const files = await readdir(LOGOS_DIR);
  const logos = files.filter(f => f.endsWith('.svg') || f.endsWith('.png') || f.endsWith('.webp'));
  
  console.log('File Name → Expected Company');
  console.log('═'.repeat(50));
  
  const mapping = {
    'waturbine.svg': 'Waturbine',
    'wato.svg': 'WATO',
    'needlist.svg': 'Needlist',
    'baja.svg': 'Baja',
    'afterquery.svg': 'AfterQuery',
    'studica.svg': 'Studica',
  };
  
  logos.forEach(file => {
    const expected = mapping[file] || '❓ Unknown';
    console.log(`  ${file.padEnd(25)} → ${expected}`);
  });
  
  console.log('\n' + '═'.repeat(50));
  console.log('\n📋 Current Dice Face Order (companyLogos.ts):');
  console.log('  Face 1 → Waturbine (waturbine.svg)');
  console.log('  Face 2 → WATO (wato.svg)');
  console.log('  Face 3 → Baja (baja.svg)');
  console.log('  Face 4 → Needlist (needlist.svg)');
  console.log('  Face 5 → AfterQuery (afterquery.svg)');
  console.log('  Face 6 → Studica (studica.svg)');
  
  console.log('\n💡 To fix mismatched logos:');
  console.log('  1. Open each SVG file and visually check which company it shows');
  console.log('  2. Rename the file to match the correct company');
  console.log('  3. Or swap entries in companyLogos.ts to match actual files');
  console.log('\n  Example: If baja.svg actually shows Needlist logo:');
  console.log('    - Rename baja.svg → temp.svg');
  console.log('    - Rename needlist.svg → baja.svg');
  console.log('    - Rename temp.svg → needlist.svg');
}

main().catch(console.error);
