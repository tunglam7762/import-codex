#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');

const APPDATA = process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming');
const DB_JSON_PATH = path.join(APPDATA, '9router', 'db.json');

function decodeJwt(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = payload + '='.repeat((4 - payload.length % 4) % 4);
    return JSON.parse(Buffer.from(padded, 'base64').toString('utf-8'));
  } catch { return null; }
}

function parseTokenFile(text) {
  let data;
  try { data = JSON.parse(text); } catch { return { error: 'JSON không hợp lệ' }; }

  if (!Array.isArray(data)) {
    if (typeof data === 'object' && data.access_token) data = [data];
    else return { error: 'File phải là array hoặc object có access_token' };
  }

  const accounts = [];
  for (const item of data) {
    if (!item.access_token || !item.refresh_token) continue;
    const idClaims = decodeJwt(item.id_token) || {};
    const auth = idClaims['https://api.openai.com/auth'] || {};
    const plan = auth.chatgpt_plan_type || 'unknown';
    const accountId = auth.chatgpt_account_id || item.account_id || '';
    const email = idClaims.email || item.email || item.outlook_email || '';
    let expiresAt = item.expired || null;
    if (!expiresAt && item.last_refresh) {
      const t = new Date(item.last_refresh);
      t.setDate(t.getDate() + 10);
      expiresAt = t.toISOString();
    }
    accounts.push({
      access_token: item.access_token,
      refresh_token: item.refresh_token,
      id_token: item.id_token || '',
      account_id: accountId, email, plan, expires_at: expiresAt,
    });
  }
  return { accounts };
}

function to9routerEntry(acc, priority) {
  return {
    id: crypto.randomUUID(), provider: 'codex', authType: 'oauth',
    name: acc.email, email: acc.email, priority, isActive: 1,
    data: JSON.stringify({
      accessToken: acc.access_token, refreshToken: acc.refresh_token,
      expiresAt: acc.expires_at, tokenType: 'Bearer', testStatus: 'active',
      providerSpecificData: {
        chatgptAccountId: acc.account_id, chatgptPlanType: acc.plan, authMethod: 'imported',
      },
    }),
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  };
}

function mergeIntoDb(db, accounts) {
  if (!db.providerConnections) db.providerConnections = [];
  const existingEmails = new Set(
    db.providerConnections.filter(c => c.provider === 'codex').map(c => (c.email || '').toLowerCase())
  );
  const existingTokens = new Set(
    db.providerConnections.filter(c => c.provider === 'codex').map(c => {
      try { return JSON.parse(c.data).accessToken; } catch { return ''; }
    }).filter(Boolean)
  );
  let maxPriority = db.providerConnections
    .filter(c => c.provider === 'codex')
    .reduce((max, c) => Math.max(max, c.priority || 0), 0);
  let added = 0, skipped = 0;
  for (const acc of accounts) {
    if (existingEmails.has(acc.email.toLowerCase()) || existingTokens.has(acc.access_token)) { skipped++; continue; }
    maxPriority++;
    db.providerConnections.push(to9routerEntry(acc, maxPriority));
    existingEmails.add(acc.email.toLowerCase());
    existingTokens.add(acc.access_token);
    added++;
  }
  return { added, skipped };
}

function parseArgs(argv) {
  const opts = { inputs: [], dry: false, dbPath: DB_JSON_PATH, help: false };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--dry' || a === '--list') opts.dry = true;
    else if (a === '--db') opts.dbPath = argv[++i];
    else if (a === '-h' || a === '--help') opts.help = true;
    else opts.inputs.push(a);
  }
  return opts;
}

function expandInputs(inputs) {
  const files = [];
  for (const input of inputs) {
    const stat = fs.statSync(input, { throwIfNoEntry: false });
    if (!stat) continue;
    if (stat.isFile()) files.push(input);
    else if (stat.isDirectory()) {
      for (const e of fs.readdirSync(input, { withFileTypes: true })) {
        if (e.isFile() && e.name.endsWith('.json')) files.push(path.join(input, e.name));
      }
    }
  }
  return files;
}

function main() {
  const opts = parseArgs(process.argv);
  if (opts.help || opts.inputs.length === 0) {
    console.log('Import Codex vào 9router\n\nSử dụng:\n  node import.js <file.json> [file2.json ...]\n  node import.js <folder/>\n  node import.js --dry <file.json>\n  node import.js --db /path/db.json');
    process.exit(opts.help ? 0 : 1);
  }

  const files = expandInputs(opts.inputs);
  if (files.length === 0) { console.error('❌ Không tìm thấy file .json'); process.exit(1); }

  const allAccounts = [];
  for (const file of files) {
    const result = parseTokenFile(fs.readFileSync(file, 'utf-8'));
    if (result.error) { console.error(`❌ ${path.basename(file)}: ${result.error}`); continue; }
    allAccounts.push(...result.accounts);
    console.log(`📄 ${path.basename(file)}: ${result.accounts.length} tài khoản`);
  }
  if (allAccounts.length === 0) { console.error('❌ Không có tài khoản hợp lệ'); process.exit(1); }

  console.log(`\n📊 Tổng: ${allAccounts.length} tài khoản`);
  for (const acc of allAccounts) {
    const exp = acc.expires_at ? new Date(acc.expires_at).toLocaleDateString('vi-VN') : '?';
    console.log(`  ✅ ${acc.email} | ${acc.plan} | ${exp}`);
  }

  if (opts.dry) { console.log('\n🔍 Dry run — không ghi'); process.exit(0); }

  let db;
  if (fs.existsSync(opts.dbPath)) {
    db = JSON.parse(fs.readFileSync(opts.dbPath, 'utf-8'));
  } else {
    db = { providerConnections: [], providerNodes: [], proxyPools: [], modelAliases: [], mitmAlias: [], combos: [], apiKeys: [], settings: {}, pricing: {} };
  }

  if (fs.existsSync(opts.dbPath)) {
    const bak = opts.dbPath + '.bak-' + new Date().toISOString().replace(/[:.]/g, '-');
    fs.copyFileSync(opts.dbPath, bak);
    console.log(`💾 Backup: ${path.basename(bak)}`);
  }

  const result = mergeIntoDb(db, allAccounts);
  console.log(`\n✅ Thêm mới: ${result.added}`);
  console.log(`⏭️  Bỏ qua (trùng): ${result.skipped}`);
  console.log(`📊 Tổng connections: ${db.providerConnections.length}`);

  fs.writeFileSync(opts.dbPath, JSON.stringify(db, null, 2));
  console.log(`\n💾 Đã lưu: ${opts.dbPath}`);
}

main();
