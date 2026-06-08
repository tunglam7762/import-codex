#!/usr/bin/env node
'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');

const APPDATA = process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming');
const DB_JSON_PATH = path.join(APPDATA, '9router', 'db.json');
const DB_SQLITE_PATH = path.join(os.homedir(), 'Documents', '9router', 'data', 'db', 'data.sqlite');
const PORT = 3456;

function getDbPath() {
  if (fs.existsSync(DB_SQLITE_PATH)) return DB_SQLITE_PATH;
  if (fs.existsSync(DB_JSON_PATH)) return DB_JSON_PATH;
  return DB_JSON_PATH;
}

function isSqlite(p) { return p.endsWith('.sqlite'); }

function loadDb(dbPath) {
  if (isSqlite(dbPath)) {
    let Database;
    try { Database = require('better-sqlite3'); } catch {
      try { Database = require(path.join(os.homedir(), 'Documents', '9router', 'node_modules', 'better-sqlite3')); } catch {
        throw new Error('better-sqlite3 not found');
      }
    }
    const db = new Database(dbPath, { readonly: true });
    const rows = db.prepare('SELECT * FROM providerConnections').all();
    db.close();
    const connections = rows.map(r => ({ ...r, data: typeof r.data === 'string' ? r.data : JSON.stringify(r.data) }));
    return { providerConnections: connections };
  }
  return JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
}

function saveDb(dbPath, data) {
  if (isSqlite(dbPath)) {
    let Database;
    try { Database = require('better-sqlite3'); } catch {
      try { Database = require(path.join(os.homedir(), 'Documents', '9router', 'node_modules', 'better-sqlite3')); } catch {
        throw new Error('better-sqlite3 not found');
      }
    }
    const db = new Database(dbPath);
    const insert = db.prepare('INSERT OR REPLACE INTO providerConnections (id, provider, authType, name, email, priority, isActive, data, createdAt, updatedAt) VALUES (@id, @provider, @authType, @name, @email, @priority, @isActive, @data, @createdAt, @updatedAt)');
    const tx = db.transaction((rows) => { for (const r of rows) insert.run(r); });
    tx(data.providerConnections || []);
    db.close();
  } else {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  }
}

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
      const t = new Date(item.last_refresh); t.setDate(t.getDate() + 10); expiresAt = t.toISOString();
    }
    accounts.push({ access_token: item.access_token, refresh_token: item.refresh_token, id_token: item.id_token || '', account_id: accountId, email, plan, expires_at: expiresAt });
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
      providerSpecificData: { chatgptAccountId: acc.account_id, chatgptPlanType: acc.plan, authMethod: 'imported' },
    }),
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  };
}

function mergeIntoDb(db, accounts) {
  if (!db.providerConnections) db.providerConnections = [];
  const existingEmails = new Set(db.providerConnections.filter(c => c.provider === 'codex').map(c => (c.email || '').toLowerCase()));
  const existingTokens = new Set(db.providerConnections.filter(c => c.provider === 'codex').map(c => { try { return JSON.parse(c.data).accessToken; } catch { return ''; } }).filter(Boolean));
  let maxPriority = db.providerConnections.filter(c => c.provider === 'codex').reduce((max, c) => Math.max(max, c.priority || 0), 0);
  let added = 0, skipped = 0;
  for (const acc of accounts) {
    if (existingEmails.has(acc.email.toLowerCase()) || existingTokens.has(acc.access_token)) { skipped++; continue; }
    maxPriority++;
    db.providerConnections.push(to9routerEntry(acc, maxPriority));
    existingEmails.add(acc.email.toLowerCase()); existingTokens.add(acc.access_token); added++;
  }
  return { added, skipped };
}

const HTML = fs.readFileSync(path.join(__dirname, 'import.html'), 'utf-8');

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(HTML);
    return;
  }

  if (req.method === 'POST' && req.url === '/api/parse') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { tokens } = JSON.parse(body);
        const result = parseTokenFile(tokens);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  if (req.method === 'POST' && req.url === '/api/merge') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { tokens, dbContent } = JSON.parse(body);
        const parseResult = parseTokenFile(tokens);
        if (parseResult.error) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: parseResult.error }));
          return;
        }
        let db;
        if (dbContent) {
          db = JSON.parse(dbContent);
        } else {
          const dbPath = getDbPath();
          if (fs.existsSync(dbPath)) {
            db = loadDb(dbPath);
          } else {
            db = { providerConnections: [] };
          }
        }
        const result = mergeIntoDb(db, parseResult.accounts);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ...result, db, dbPath: getDbPath() }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  if (req.method === 'POST' && req.url === '/api/save') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { db } = JSON.parse(body);
        const dbPath = getDbPath();
        if (fs.existsSync(dbPath)) {
          const bak = dbPath + '.bak-' + new Date().toISOString().replace(/[:.]/g, '-');
          fs.copyFileSync(dbPath, bak);
        }
        saveDb(dbPath, db);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true, path: dbPath }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  if (req.method === 'GET' && req.url === '/api/db-status') {
    const dbPath = getDbPath();
    const exists = fs.existsSync(dbPath);
    let connections = 0;
    if (exists) {
      try {
        const db = loadDb(dbPath);
        connections = (db.providerConnections || []).length;
      } catch {}
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ exists, path: dbPath, connections }));
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, () => {
  const dbPath = getDbPath();
  console.log(`🚀 Import Codex server: http://localhost:${PORT}`);
  console.log(`📂 DB path: ${dbPath}`);
  console.log(`📋 DB type: ${isSqlite(dbPath) ? 'SQLite' : 'JSON'}`);
  console.log(`\nMở trình duyệt → http://localhost:${PORT}`);
});
