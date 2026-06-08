<p align="center">
  <img src="https://img.shields.io/badge/9router-Import%20Codex-4f9cf7?style=for-the-badge" />
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" />
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
- 🌐 Web Server — lưu trực tiếp vào 9router
- 🔄 Auto dedup — trùng email/token tự bỏ qua
- 💾 Auto backup — backup db.json trước khi ghi
- 🔐 JWT decode — tự đọc plan type, account ID

## Cài đặt

### Cài Node.js (cho CLI và Server)

**macOS:**
```bash
brew install node
```

**Windows:**
Tải tại https://nodejs.org → chọn bản LTS → cài đặt.

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo bash -
sudo apt install -y nodejs
```

**Kiểm tra:**
```bash
node --version   # v18.0.0 trở lên
```

### Tải tool

```bash
git clone https://github.com/tunglam7762/import-codex.git
cd import-codex
```

## Sử dụng

### Cách 1: HTML (không cần cài gì)

Mở `import.html` trong trình duyệt. Kéo thả file `.json` vào → merge → tải `db.json` → copy vào `~/AppData/Roaming/9router/`.

### Cách 2: CLI

```bash
node import.js file.json              # Import
node import.js --dry file.json        # Preview
node import.js file1.json file2.json  # Nhiều file
node import.js ./tokens/              # Import folder
```

### Cách 3: Web Server

```bash
node server.js
```

Mở `http://localhost:3456` → kéo thả → merge → lưu trực tiếp.

## Format đầu vào

Bot nhả file `.json` dạng array:

```json
[
  {
    "access_token": "",
    "refresh_token": "",
    "id_token": "",
    "account_id": "",
    "email": "",
    "outlook_email": "",
    "expired": "",
    "last_refresh": "",
    "oai_password": "",
    "disabled": false,
    "status": "",
    "type": "codex"
  }
]
```

Tool tự decode JWT từ `id_token` → lấy `chatgpt_plan_type`, `chatgpt_account_id`.

## Quy trình

```
Mua Codex trên bot → Nhận file .json → Import → 9router
```

## Đường dẫn db.json

| OS | Path |
|----|------|
| macOS / Linux | `~/.9router/db.json` |
| Windows | `%APPDATA%\9router\db.json` |

## FAQ

| Câu hỏi | Trả lời |
|---------|---------|
| HTML có cần Node.js? | Không. Mở trình duyệt là xong. |
| CLI/Server cần gì? | Node.js ≥ 18. |
| Có cần tắt 9router? | Có, nếu dùng HTML hoặc CLI. Server tự xử lý. |
| File từ bot là gì? | Array JSON, kể cả mua 1 acc. |
| Trùng email? | Tự bỏ qua. |
| db.json hay SQLite? | Chỉ hỗ trợ db.json. |

## License

MIT
