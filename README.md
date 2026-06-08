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
- 🌐 Web Server — lưu trực tiếp vào 9router
- ⚡ CLI — import nhanh từ terminal
- 🔄 Auto dedup — trùng email/token tự bỏ qua
- 💾 Auto backup — backup db.json trước khi ghi
- 🔐 JWT decode — tự đọc plan type, account ID

## Cài đặt

### Bước 1: Cài Node.js

**macOS (Terminal):**
```bash
brew install node
```

**Windows:**
Mở https://nodejs.org → tải bản LTS → chạy installer → Next → Finish.

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo bash -
sudo apt install -y nodejs
```

**Kiểm tra đã cài thành công:**
```bash
node --version
# Phải hiện v18.x.x hoặc cao hơn
```

### Bước 2: Tải tool

```bash
git clone https://github.com/tunglam7762/import-codex.git
cd import-codex
```

Nếu không có git, tải ZIP tại https://github.com/tunglam7762/import-codex → giải nén → mở Terminal/Command Prompt → `cd` vào thư mục vừa giải nén.

---

## Cách 1: Web Server (khuyến nghị)

Đây là cách tiện nhất — lưu trực tiếp vào 9router, không cần copy file thủ công.

### Bước 1: Mở Terminal, cd vào thư mục tool

```bash
cd import-codex
```

**Quan trọng:** Phải chạy từ đúng thư mục `import-codex`. Nếu chạy sai thư mục sẽ báo lỗi.

### Bước 2: Chạy server

```bash
node server.js
```

Terminal sẽ hiện:
```
🚀 Import Codex server: http://localhost:3456
📂 DB path: /Users/.../AppData/Roaming/9router/db.json
```

### Bước 3: Mở trình duyệt

Truy cập http://localhost:3456

### Bước 4: Kéo thả file credentials

Kéo file `.json` mua từ bot vào ô "Kéo thả file .json vào đây".

Server sẽ tự phát hiện `db.json` hiện tại của 9router.

### Bước 5: Merge

Nhấn **"Merge vào db.json"** → xem kết quả (thêm mới / bỏ qua trùng).

### Bước 6: Lưu

Nhấn **"Lưu trực tiếp vào 9router"** → xong.

Khởi động lại 9router để áp dụng.

**Lưu ý:** Không cần tắt 9router khi dùng web server.

---

## Cách 2: HTML (không cần Node.js)

Dùng khi không muốn cài Node.js.

### Bước 1: Mở file HTML

Double-click file `import.html` trong thư mục tool. File sẽ mở trong trình duyệt.

### Bước 2: Kéo thả file credentials

Kéo file `.json` mua từ bot vào ô kéo thả.

Tool sẽ hiện danh sách tài khoản (email, plan, hạn).

### Bước 3: Chọn db.json

Nhấn **"Upload db.json"** → chọn file `db.json` tại:
- macOS/Linux: `~/.9router/db.json`
- Windows: `%APPDATA%\9router\db.json`

Nếu chưa có, nhấn **"Dùng template trống"**.

### Bước 4: Merge

Nhấn **"Merge"** → xem kết quả.

### Bước 5: Tải db.json mới

Nhấn **"Tải db.json"** → file sẽ được tải về.

### Bước 6: Copy vào 9router

1. **Tắt 9router**
2. Copy file `db.json` vừa tải vào:
   - macOS/Linux: `~/.9router/db.json`
   - Windows: `%APPDATA%\9router\db.json`
3. Ghi đè file cũ
4. **Mở lại 9router**

---

## Cách 3: CLI

Dùng khi muốn import nhanh từ terminal.

### Bước 1: Mở Terminal, cd vào thư mục tool

```bash
cd import-codex
```

### Bước 2: Chạy lệnh import

```bash
# Import 1 file
node import.js /path/to/file.json

# Preview (không ghi)
node import.js --dry /path/to/file.json

# Import nhiều file
node import.js file1.json file2.json

# Import cả folder
node import.js ./tokens/
```

**Quan trọng:** Phải chạy từ đúng thư mục `import-codex`. Nếu chạy từ thư mục khác sẽ báo lỗi "not a module" hoặc "not found".

### Bước 3: Khởi động lại 9router

```bash
# macOS/Linux
9router restart

# Windows
# Đóng 9router → mở lại
```

---

## Format đầu vào

Bot nhả file `.json` dạng array (kể cả mua 1 acc). Tool tự decode JWT từ `id_token` → lấy plan type, account ID.

## Đường dẫn db.json

| OS | Path |
|----|------|
| macOS / Linux | `~/.9router/db.json` |
| Windows | `%APPDATA%\9router\db.json` |
