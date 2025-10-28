# Cờ Thú Online

## Chạy dự án

### Chuẩn bị MySQL Database
1. Cài đặt MySQL server
2. Tạo database:
   ```sql
   CREATE DATABASE cothu;
   ```

### Backend (NestJS)
- Tạo file `.env` trong thư mục `backend/`:
  ```
  DB_HOST=localhost
  DB_PORT=3306
  DB_USERNAME=root
  DB_PASSWORD=your_mysql_password
  DB_DATABASE=cothu
  JWT_SECRET=your_jwt_secret_key_here
  ```
- Chạy:
  ```bash
  cd backend
  npm run start:dev
  ```
- API: http://localhost:3000

### Frontend (Next.js)
- Env: `NEXT_PUBLIC_API_URL` (mặc định http://localhost:3000), `NEXT_PUBLIC_WS_URL` (mặc định cùng API)
- Chạy:
  ```bash
  cd frontend
  npm run dev
  ```
- Web: http://localhost:3000 (nếu trùng port backend, Next.js sẽ hỏi đổi port)

## Tính năng
- Đăng ký/Đăng nhập (JWT)
- Tạo/Tham gia phòng
- Kết nối thời gian thực qua Socket.IO
- Bàn cờ mẫu và sự kiện nước đi (cần hoàn thiện UI)
- Quy luật cờ thú (trang Rules)
- Tích điểm khi kết thúc ván (endpoint `/rooms/finish`)
