# Career Path & AWS DVA-C02 Study Tracker

Ứng dụng Web theo dõi lộ trình sự nghiệp (Career Path) và tiến độ học chứng chỉ **AWS Certified Developer – Associate (DVA-C02)** với giao diện kỹ thuật **Anatomy Isometric Instrument**, đồng bộ đọc/ghi hai chiều trực tiếp với 2 file Markdown gốc:
- `AWS-study-checklist.md`
- `VoQuangTrung_QA.md`

---

## Yêu cầu hệ thống

- **Node.js** `>= 20.x` (không cần cài đặt thêm thư viện ngoài / zero-dependency).

---

## Lệnh chạy Backend & Web App (Command Line)

Mở **PowerShell** hoặc **Terminal** tại thư mục dự án (`d:\working\trial\trial`) và chạy một trong hai lệnh sau:

### Cách 1: Chạy trực tiếp bằng Node.js
```powershell
node server.mjs
```

### Cách 2: Chạy qua npm script
```powershell
npm start
```

Sau khi chạy lệnh, mở trình duyệt tại địa chỉ:
- **URL:** http://localhost:3000

### Đổi cổng chạy (Port) nếu cổng 3000 đang bận
```powershell
# Trên PowerShell:
$env:PORT=8080; node server.mjs
```

---

## Cấu trúc dự án

- `server.mjs`: Backend HTTP server đọc/ghi trực tiếp vào `AWS-study-checklist.md` và `VoQuangTrung_QA.md`.
- `AWS-study-checklist.md`: File dữ liệu tiến độ học 16 tuần AWS DVA-C02, checklist bài học và nhật ký học tập (Session Log).
- `VoQuangTrung_QA.md`: File dữ liệu hồ sơ năng lực, kinh nghiệm làm việc và chứng chỉ.
- `public/`:
  - `index.html`: Giao diện chính gồm 5 tab điều hướng và bộ đếm 45 phút học tập.
  - `styles.css` & `iso.css`: Hệ thống giao diện kỹ thuật Anatomy (hỗ trợ cả chế độ **Dark** và **Light Paper**).
  - `rig-figure.mjs` & `iso-kit.mjs`: Bộ dựng mô hình cơ khí Isometric tương tác (`Fig 1 · 16-Week Indexing Gauge Rig`).
  - `app.js`: Logic đồng bộ dữ liệu thời gian thực và hiệu ứng vật lý lò xo cho máy đo.

---

## Các API của Backend (`server.mjs`)

| Method | Endpoint | Mô tả |
|---|---|---|
| `GET` | `/api/data` | Đọc và phân tích dữ liệu từ `AWS-study-checklist.md` và `VoQuangTrung_QA.md` |
| `POST` | `/api/toggle` | Tick / bỏ tick `- [ ]` / `- [x]` theo đúng số dòng trong `AWS-study-checklist.md` |
| `POST` | `/api/update-week` | Cập nhật `%` tiến độ của tuần học và tính lại tiến độ tổng thể |
| `POST` | `/api/add-session` | Ghi thêm 1 dòng nhật ký buổi học mới vào bảng `Session log` trong `AWS-study-checklist.md` |
| `POST` | `/api/save-file` | Lưu nội dung chỉnh sửa trực tiếp của `AWS-study-checklist.md` hoặc `VoQuangTrung_QA.md` |

