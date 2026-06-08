<p align="center">
  <img src="https://img.shields.io/badge/9router-Import%20Codex-4f9cf7?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMTIgMkwyIDEybDEwIDEwIDEwLTEwTDEyIDJ6Ii8+PHBhdGggZD0iTTIgMTJoMjAiLz48L3N2Zz4=" />
  <img src="https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" />
</p>

<h1 align="center">🤖 Import Codex</h1>

<p align="center">
  <b>Import ChatGPT Codex credentials vào 9router</b><br>
  Kéo thả • CLI • Web Server
</p>

<p align="center">
  <a href="#cách-1-html">HTML</a> •
  <a href="#cách-2-cli">CLI</a> •
  <a href="#cách-3-web-server">Server</a> •
  <a href="#format-đầu-vào">Format</a> •
  <a href="#faq">FAQ</a>
</p>

---

## Tính năng

- 📁 **Kéo thả** — không cần terminal, mở trình duyệt là dùng được
- ⚡ **CLI** — import nhanh từ command line
- 🌐 **Web Server** — lưu trực tiếp vào 9router, không cần copy thủ công
- 🔄 **Auto dedup** — trùng email/token tự bỏ qua
- 💾 **Auto backup** — backup db.json trước khi ghi
- 🔐 **JWT decode** — tự đọc plan type, account ID từ token
- 🌍 **Cross-platform** — Windows, macOS, Linux

## Cài đặt

```bash
git clone https://github.com/tunglam7762/import-codex.git
cd import-codex
```

**Yêu cầu:** Node.js ≥ 18 (không cần npm install)

## Sử dụng

### Cách 1: HTML

Mở file `import.html` trong trình duyệt:

```
import.html
```

1. **Kéo thả** file `.json` mua từ bot vào ô
2. Chọn **Upload db.json** (tại `~/AppData/Roaming/9router/db.json`) hoặc **Dùng template trống**
3. Nhấn **Merge** → xem kết quả (thêm mới / bỏ qua trùng)
4. Nhấn **Tải db.json** → copy vào `~/AppData/Roaming/9router/`
5. Mở lại 9router

### Cách 2: CLI

```bash
# Xem trước (không ghi)
node import.js --dry file.json

# Import
node import.js file.json

# Import nhiều file
node import.js file1.json file2.json

# Import cả folder
node import.js ./tokens/

# Custom db.json path
node import.js --db /path/to/db.json file.json
```

**Output mẫu:**
```
📄 codex_5_123456_1718.json: 5 tài khoản

📊 Tổng: 5 tài khoản
  ✅ mailxxx@team.wenjie.codes | team | 15/6/2026
  ✅ mailyyy@team.wenjie.codes | team | 15/6/2026
  ✅ mailzzz@team.wenjie.codes | team | 16/6/2026
  ✅ mailaaa@team.wenjie.codes | team | 15/6/2026
  ✅ mailbbb@team.wenjie.codes | team | 15/6/2026

💾 Backup: db.json.bak-2026-06-08T12-00-00-000Z

✅ Thêm mới: 5
⏭️  Bỏ qua (trùng): 0
📊 Tổng connections: 33

💾 Đã lưu: /Users/.../AppData/Roaming/9router/db.json
```

### Cách 3: Web Server

```bash
node server.js
```

Mở `http://localhost:3456` trong trình duyệt:

1. Kéo thả file `.json` vào
2. Server tự phát hiện `db.json` hiện tại
3. Nhấn **Merge vào db.json**
4. Nhấn **Lưu trực tiếp vào 9router** (không cần copy thủ công)

**API Endpoints:**

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `GET` | `/` | Giao diện HTML |
| `GET` | `/api/db-status` | Kiểm tra db.json |
| `POST` | `/api/parse` | Parse credentials |
| `POST` | `/api/merge` | Merge vào db |
| `POST` | `/api/save` | Lưu db.json |

## Format đầu vào

Bot nhả file `.json` dạng array (kể cả mua 1 acc):

```json
[
  {
    "access_token": "eyJhbGciOiJSUzI1NiIs...",
    "refresh_token": "rt.1.AABQLGoNwvD44o...",
    "id_token": "eyJhbGciOiJSUzI1NiIs...",
    "account_id": "5683b77b-2326-4688-adc7-694ffc43c7ac",
    "email": "mailxxx@team.wenjie.codes",
    "expired": "2026-06-15T16:48:41.571Z",
    "type": "codex"
  }
]
```

Tool tự động:
- Decode JWT từ `id_token` → lấy `chatgpt_plan_type`, `chatgpt_account_id`
- Convert snake_case → camelCase (9router format)
- Tính `expiresAt` từ `last_refresh + 10 ngày` nếu thiếu

## Quy trình mua → import

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Mua Codex  │────▶│ Nhận .json  │────▶│ Import tool │────▶│  9router    │
│  trên bot   │     │ đính kèm    │     │ (HTML/CLI)  │     │  dùng được  │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

## Cấu trúc file

```
import-codex/
├── import.html       # 🌐 Giao diện HTML (drag & drop)
├── import.js         # ⚡ CLI tool
├── server.js         # 🖥️ Web server
└── README.md         # 📖 Tài liệu
```

## 9router

Tool này import credentials vào [9router](https://github.com/decolua/9router) — local AI API router chạy trên `localhost:20128`.

**Đường dẫn db.json:**
- macOS/Linux: `~/.9router/db.json`
- Windows: `%APPDATA%\9router\db.json`

## FAQ

**Q: Có cần tắt 9router trước khi import không?**
A: Có, nếu dùng HTML hoặc CLI. Server mode tự xử lý.

**Q: File .json từ bot có phải array không?**
A: Luôn là array, kể cả mua 1 acc.

**Q: Trùng email thì sao?**
A: Tool tự bỏ qua, không tạo duplicate.

**Q: Có cần npm install không?**
A: Không, chỉ dùng Node.js core modules.

**Q: db.json hay SQLite?**
A: Tool hỗ trợ db.json (JSON format). Nếu dùng SQLite, cần tool khác.

## License

MIT

---

<p align="center">
  <b>Import Codex</b> — Tool import Codex credentials cho 9router<br>
  Không liên quan @botbanlo
</p>
