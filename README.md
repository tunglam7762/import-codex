<p align="center">
  <img src="https://img.shields.io/badge/9router-Import%20Codex-4f9cf7?style=for-the-badge" />
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

- 📁 **Kéo thả** — mở trình duyệt là dùng được, không cần cài gì
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

## Sử dụng

### Cách 1: HTML

Mở `import.html` trong trình duyệt. **Không cần cài đặt gì.**

```
import.html
```

1. **Kéo thả** file `.json` mua từ bot vào ô
2. Chọn **Upload db.json** (tại `~/AppData/Roaming/9router/db.json`) hoặc **Dùng template trống**
3. Nhấn **Merge** → xem kết quả
4. Nhấn **Tải db.json** → copy vào `~/AppData/Roaming/9router/`
5. Mở lại 9router

### Cách 2: CLI

**Yêu cầu:** Node.js ≥ 18

```bash
node import.js file.json              # Import
node import.js --dry file.json        # Preview, không ghi
node import.js file1.json file2.json  # Nhiều file
node import.js ./tokens/              # Import folder
```

Tự động backup db.json trước khi ghi.

### Cách 3: Web Server

**Yêu cầu:** Node.js ≥ 18

```bash
node server.js
```

Mở `http://localhost:3456` → kéo thả → merge → **Lưu trực tiếp** vào 9router.

## Format đầu vào

Bot nhả file `.json` dạng array (kể cả mua 1 acc):

```json
[
  {
    "access_token": "eyJ...",
    "refresh_token": "rt.1...",
    "id_token": "eyJ...",
    "account_id": "5683b77b-...",
    "email": "mailxxx@team.wenjie.codes",
    "expired": "2026-06-15T16:48:41Z",
    "type": "codex"
  }
]
```

Tool tự động decode JWT → lấy plan type, account ID.

## Quy trình

```
Mua Codex trên bot → Nhận file .json → Import tool → 9router
```

## Cấu trúc file

```
import-codex/
├── import.html    # 🌐 Giao diện HTML (không cần cài gì)
├── import.js      # ⚡ CLI (cần Node.js)
├── server.js      # 🖥️ Web server (cần Node.js)
└── README.md      # 📖 Tài liệu
```

## 9router

Tool import credentials vào [9router](https://github.com/decolua/9router) — local AI API router.

**Đường dẫn db.json:**
- macOS/Linux: `~/.9router/db.json`
- Windows: `%APPDATA%\9router\db.json`

## FAQ

**Q: Dùng HTML có cần Node.js không?**
A: Không. Mở `import.html` trong trình duyệt là xong.

**Q: CLI và Server cần gì?**
A: Node.js ≥ 18.

**Q: Có cần tắt 9router trước khi import không?**
A: Có, nếu dùng HTML hoặc CLI. Server mode tự xử lý.

**Q: File .json từ bot có phải array không?**
A: Luôn là array, kể cả mua 1 acc.

**Q: Trùng email thì sao?**
A: Tool tự bỏ qua, không tạo duplicate.

**Q: db.json hay SQLite?**
A: Tool hỗ trợ db.json. Nếu dùng SQLite, cần tool khác.

## License

MIT
