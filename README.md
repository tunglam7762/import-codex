<p align="center">
  <img src="https://img.shields.io/badge/9router-Import%20Codex-4f9cf7?style=for-the-badge" />
</p>

<h1 align="center">🤖 Import Codex</h1>

<p align="center">
  Import ChatGPT Codex credentials vào 9router<br>
  <b>Kéo thả • CLI • Web Server</b>
</p>

---

## Tính năng

- 📁 Kéo thả — mở trình duyệt là dùng được
- ⚡ CLI — import nhanh từ terminal
- 🌐 Web Server — lưu trực tiếp vào 9router, không cần copy thủ công
- 🔄 Auto dedup — trùng email/token tự bỏ qua
- 💾 Auto backup — backup db.json trước khi ghi
- 🔐 JWT decode — tự đọc plan type, account ID

## Cài đặt

### Cài Node.js

**macOS:** `brew install node`

**Windows:** Tải tại https://nodejs.org → bản LTS

**Linux:** `curl -fsSL https://deb.nodesource.com/setup_22.x | sudo bash - && sudo apt install -y nodejs`

### Tải tool

```bash
git clone https://github.com/tunglam7762/import-codex.git
cd import-codex
```

## Sử dụng

### Cách 1: Web Server (khuyến nghị)

```bash
node server.js
```

Mở `http://localhost:3456` → kéo thả file `.json` → merge → **lưu trực tiếp** vào 9router. Không cần tắt 9router, không cần copy file thủ công.

### Cách 2: HTML (không cần Node.js)

Mở `import.html` trong trình duyệt. Kéo thả file `.json` vào → merge → tải `db.json` → copy vào `~/AppData/Roaming/9router/`.

### Cách 3: CLI

```bash
node import.js file.json              # Import
node import.js --dry file.json        # Preview
node import.js ./tokens/              # Import folder
```

## Format đầu vào

Bot nhả file `.json` dạng array. Tool tự decode JWT từ `id_token` → lấy `chatgpt_plan_type`, `chatgpt_account_id`.

## Đường dẫn db.json

| OS | Path |
|----|------|
| macOS / Linux | `~/.9router/db.json` |
| Windows | `%APPDATA%\9router\db.json` |
