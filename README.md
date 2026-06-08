# Import Codex vào 9router

Tool import ChatGPT Codex credentials vào 9router.

## Cách 1: HTML (đơn giản nhất)

Mở `import.html` trong trình duyệt:

1. Kéo thả file `.json` (từ bot) vào
2. Upload `db.json` hiện tại hoặc dùng template trống
3. Merge → Tải `db.json` mới
4. Copy vào `~/AppData/Roaming/9router/`

## Cách 2: CLI (nhanh nhất)

```bash
node import.js file.json              # Import
node import.js --dry file.json        # Preview
node import.js ./tokens/              # Import folder
node import.js --db /path/db.json     # Custom DB path
```

## Cách 3: Web Server (tiện nhất)

```bash
node server.js
```

Mở `http://localhost:3456` → kéo thả → merge → lưu trực tiếp.

## Format đầu vào

Bot nhả array JSON. Tool tự decode JWT, convert sang 9router format.

## Lưu ý

- Tắt 9router trước khi import
- Tool tự backup db.json
- Tự dedup theo email và access_token
