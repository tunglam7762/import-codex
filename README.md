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
    "access_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjE5MzQ0ZTY1LWJiYzktNDRkMS1hOWQwLWY5NTdiMDc5YmQwZSIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsiaHR0cHM6Ly9hcGkub3BlbmFpLmNvbS92MSJdLCJjbGllbnRfaWQiOiJhcHBfRU1vYW1FRVo3M2YwQ2tYYVhwN2hyYW5uIiwiZXhwIjoxNzgxNTQyMTIxLCJodHRwczovL2FwaS5vcGVuYWkuY29tL2F1dGgiOnsiY2hhdGdwdF9hY2NvdW50X2lkIjoiNTY4M2I3N2ItMjMyNi00Njg4LWFkYzctNjk0ZmZjNDNjN2FjIiwiY2hhdGdwdF9hY2NvdW50X3VzZXJfaWQiOiJ1c2VyLVZ1a3VwVndJS0VicllsTk93akFnUWJGYyIsImxvY2FsaG9zdCI6dHJ1ZSwic3NvX2Nvbm5lY3Rpb25faWQiOiJjb25uXzAxS1Q5WVZIRVZZWDNWNE1LMEE1SjlSNEVaIiwidXNlcl9pZCI6InVzZXItVnVrdXBWd0lLRWJyWWxOT3dqQWdRYkZjIn0sImh0dHBzOi8vYXBpLm9wZW5haS5jb20vcHJvZmlsZSI6eyJlbWFpbCI6Im1haWxwbWtsbnlpZDB3QHRlYW0ud2VuamllLmNvZGVzIiwiZW1haWxfdmVyaWZpZWQiOnRydWV9LCJpYXQiOjE3ODA2NzgxMjAsImlzcyI6Imh0dHBzOi8vYXV0aC5vcGVuYWkuY29tIiwianRpIjoiZWNiYjNlY2YtMzRiMC00ZWRhLTg3MTUtMjg5MmU1NWZmYzgzIiwibmJmIjoxNzgwNjc4MTIwLCJwd2RfYXV0aF90aW1lIjoxNzgwNjc4MTE5MDE3LCJzY3AiOlsib3BlbmlkIiwicHJvZmlsZSIsImVtYWlsIiwib2ZmbGluZV9hY2Nlc3MiXSwic2Vzc2lvbl9pZCI6ImF1dGhzZXNzX2RsNzlZaWRiMXhoS01hSjZDREN2T1RnOSIsInNsIjp0cnVlLCJzdWIiOiJzYW1scHxwcm9mXzAxS1RDQVZCV1RZWEJYRTVERDNaRk1DVjBBfG1haWxwbWtsbnlpZDB3QHRlYW0ud2VuamllLmNvZGVzIn0.SAMPLE_SIGNATURE",
    "refresh_token": "rt.1.AABQLGoNwvD44ogWZlqWBW2FiHPByWwKue0B3B54CUCPK6zUb2H2nhDwGv0GZtwdk4_KHbLfqPOJYqwEzooNTaQfumDW5quW4tJVczWGvrBS3k2hqZCy4iQ_Y76YmFdzRUSm7UDNf23e3h89wcrDsMSNBH26jCzplk7n0BGqk1pxsVB7nf_cpmNmKGe6HfLvIfP4ZwFvRM53_pruL1aVXQNia6Kmuh4RX9ABWCeZF62jvBkGOhZJ3xScQrin8FCfNfFmXw3wgq5B21pQ6Co85zgNJ5Ny8MIMur52x1oMLeGla4ycctyYIGopnZNlwHFPMxI",
    "id_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6ImIxZGQzZjhmLTlhYWQtNDdmZS1iMGU3LWVkYjAwOTc3N2Q2YiIsInR5cCI6IkpXVCJ9.eyJhdF9oYXNoIjoiUTZLdF9hNkVKcjJucGJNYzJrMGZIdyIsImF1ZCI6WyJhcHBfRU1vYW1FRVo3M2YwQ2tYYVhwN2hyYW5uIl0sImF1dGhfcHJvdmlkZXIiOiJ3b3Jrb3MiLCJhdXRoX3RpbWUiOjE3ODA2NzgxMTksImVtYWlsIjoibWFpbHBta2xueWlkMHdAdGVhbS53ZW5qaWUuY29kZXMiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZXhwIjoxNzgwNjgxNzIwLCJodHRwczovL2FwaS5vcGVuYWkuY29tL2F1dGgiOnsiY2hhdGdwdF9hY2NvdW50X2lkIjoiNTY4M2I3N2ItMjMyNi00Njg4LWFkYzctNjk0ZmZjNDNjN2FjIiwiY2hhdGdwdF9wbGFuX3R5cGUiOiJ0ZWFtIiwidXNlcl9pZCI6InVzZXItVnVrdXBWd0lLRWJyWWxOT3dqQWdRYkZjIn0sImh0dHBzOi8vYXBpLm9wZW5haS5jb20vcHJvZmlsZSI6eyJlbWFpbCI6Im1haWxwbWtsbnlpZDB3QHRlYW0ud2VuamllLmNvZGVzIiwiZW1haWxfdmVyaWZpZWQiOnRydWV9LCJpYXQiOjE3ODA2NzgxMjAsImlzcyI6Imh0dHBzOi8vYXV0aC5vcGVuYWkuY29tIiwianRpIjoiODhjZDA5ZGQtNjU2NS00M2QwLWE2NjctYjM0NjhjMzRjYzZlIiwibmFtZSI6Im1haWxwbWtsbnlpZHciLCJzdWIiOiJzYW1scHxwcm9mXzAxS1RDQVZCV1RZWEJYRTVERDNaRk1DVjBBfG1haWxwbWtsbnlpZDB3QHRlYW0ud2VuamllLmNvZGVzIn0.SAMPLE_SIGNATURE",
    "account_id": "5683b77b-2326-4688-adc7-694ffc43c7ac",
    "email": "mailxxx@team.wenjie.codes",
    "outlook_email": "mailxxx@team.wenjie.codes",
    "expired": "2026-06-15T16:48:41.571301+00:00",
    "last_refresh": "2026-06-05T16:48:41.571334+00:00",
    "disabled": false,
    "oai_password": "YourPassword123",
    "status": "success",
    "type": "codex"
  }
]
```

Tool tự động decode JWT từ `id_token` → lấy `chatgpt_plan_type` (team/free/plus), `chatgpt_account_id`.

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
