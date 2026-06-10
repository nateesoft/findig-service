# findig-service — CLAUDE.md

## Project Overview

Stock Realtime Management System สำหรับติดตาม stock, การขาย, และรายงาน แบบ realtime

- **Frontend**: React 19 (CRA) — dev port 3000, production port 3008, basename `/realtime-web`
- **Backend**: Express.js 4 (Node.js) — port 9090, prefix `realtime-service`
- **Database**: MySQL — 3 ฐานข้อมูล (POS, CRM, BOR)

## Key Architecture

```
findig-service/
├── realtime-service/          # Express.js backend
│   ├── bin/www                # Entry point
│   ├── src/
│   │   ├── config/database/   # MySQL connection config
│   │   ├── controllers/       # Route handlers
│   │   ├── services/          # Business logic
│   │   ├── repository/        # DB query layer
│   │   ├── routes/            # Express routes (auto-generated)
│   │   ├── middlewares/       # Auth, validation middleware
│   │   ├── utils/             # Helpers
│   │   ├── views/             # Pug templates
│   │   └── tests/             # Unit tests
│   ├── scripts/               # Migration scripts (migrate-discount.js, migrate-price.js)
│   ├── templates/             # Handlebars templates สำหรับ code generation
│   ├── logs/                  # Winston log files
│   ├── spec.json              # Route/controller spec สำหรับ generate-service.js
│   ├── generate-service.js    # Code generator (controllers, services, repositories, routes)
│   ├── db.sql                 # Database schema + seed data
│   ├── ecosystem.config.js    # PM2 config (production)
│   └── .env.example           # Environment template
│
├── realtime-web/              # React frontend
│   ├── src/
│   │   ├── api/               # Axios API clients (productApi, saleApi, stockInApi, ...)
│   │   ├── components/        # Auth, Layout (Sidebar, Header), Modals, Common
│   │   ├── contexts/          # AppContext (userInfo, currentTheme, branchCode)
│   │   ├── pages/             # Feature pages
│   │   ├── utils/             # auth.js, themes.js, constants.js
│   │   ├── httpRequest/       # Axios instance
│   │   └── App.js             # Router + session management
│   ├── public/                # Static assets
│   ├── server.js              # Express static server + API proxy (production)
│   ├── ecosystem.config.js    # PM2 config (production)
│   └── .env.example           # Environment template
```

## Development Commands

```bash
# Backend
cd realtime-service
npm run start:dev        # node --env-file=.env.local ./bin/www → :9090
npm run local:watch      # nodemon watch mode

# Frontend
cd realtime-web
npm start                # CRA dev server → :3000 (proxies /api/* → :9090)
npm run build            # Production build → build/

# Migration scripts
cd realtime-service
npm run migrate          # scripts/migrate-discount.js
npm run migrate:price    # scripts/migrate-price.js

# Code generation
cd realtime-service
node generate-service.js  # อ่าน spec.json → generate controllers/services/repositories/routes
```

## Environment

**realtime-service/.env.local** (dev)
```
PORT=9090
APP_PREFIX=realtime-service
dbConfig=PRODUCTION
WEB_USER_AUTH=admin
WEB_USER_PASS=
API_SECRET_PASS=
DB_HOST=
DB_PORT=3306
DB_USER=
DB_PASS=
DB_DRIVER=mysql
DB_APP_NAME=Stock Realtime
DB_POS_NAME=          # main POS database (e.g. MyRetail652findigColo)
DB_CRM_NAME=          # CRM database
DB_BOR_NAME=          # BOR database
MYSQLDUMP_PATH=       # path to mysqldump binary
```

**realtime-web/.env** (dev)
```
REACT_APP_API_USER=admin
REACT_APP_API_KEY=supersecret
REACT_APP_SERVICE_HOST=/api/realtime-service
BACKEND_HOST=http://127.0.0.1:9090
BACKEND_PREFIX=realtime-service
PORT=3333
```

## API Routing

**Development**: CRA dev server ใช้ `setupProxy.js` — `/api/realtime-service/*` → `http://localhost:9090`

**Production**: `realtime-web/server.js` (Express) รับ request แล้ว:
- Proxy `/api/realtime-service/*` → backend (port 9090)
- Serve React build จาก `build/` directory
- SPA fallback: return `index.html` สำหรับทุก route ที่ไม่ใช่ static file

Frontend ส่ง request ผ่าน `src/httpRequest/index.js` (Axios instance) ไปที่ `REACT_APP_SERVICE_HOST`

## Database Schema

ฐานข้อมูลหลัก (`DB_POS_NAME`) — MySQL MyISAM engine, charset latin1:

| Table | คำอธิบาย | Primary Key |
|---|---|---|
| `stcard` | Stock card movements (in/out per transaction) | `S_Date, S_No, S_Que, S_PCode, S_Stk` |
| `stkfile` | Stock balance per product per warehouse/branch | `BPCode, BStk, Branch` |
| `product` | Product master (PCode, barcode, price tiers 1-5, group) | `PCode` |
| `groupfile` | Product groups | `GroupCode` |
| `branfile` | Branch master with KIC printer config | `Code` |
| `branch` | Branch operational config (KIC 1-20, permissions) | - |
| `posuser` | POS user permissions (Sale1-38, Cont0-47, Stock0-74) | `UserName` |
| `draft_sale` | Draft sale header | `id` |
| `draft_sale_details` | Draft sale line items | `id` |

**Important indexes** (สร้างแยกต่างหาก ดู README.md):
```sql
CREATE INDEX idx_stkfile_BPCode ON stkfile(BPCode);
CREATE INDEX idx_product_PCode ON product(PCode);
CREATE INDEX idx_groupfile_GroupCode ON groupfile(GroupCode);
```

## Auth

- JWT เก็บใน **HTTP-only cookie** (ไม่ใช่ localStorage)
- `getUserFromToken()` / `getBranchFromToken()` — อ่าน JWT จาก cookie ใน `src/utils/auth.js`
- Backend ใช้ `express-basic-auth` สำหรับ web UI auth และ JWT สำหรับ API auth
- Default credentials: `WEB_USER_AUTH=admin`, `WEB_USER_PASS=supersecret` (ตั้งใน .env)

## Frontend Conventions

- React 19 (CRA) — ไม่ใช้ Vite หรือ Next.js
- React Router v7 (`BrowserRouter`) — basename คือ `REACT_APP_BASENAME` env var (default `/realtime-web`)
- **AppContext** (`src/contexts/index.js`) — global state: `userInfo`, `currentTheme`, `branchCode`
- Themes — ตั้งค่าใน `src/utils/themes.js`, บันทึกใน `localStorage` key `currentTheme` (default: `"sunset"`)
- Session timeout — auto-logout เมื่อ user ไม่ active, ตั้งค่าใน `src/utils/constants.js`
- HTTP client — Axios ผ่าน `src/httpRequest/index.js`
- API modules — แยกไฟล์ตาม domain ใน `src/api/` (e.g. `saleApi.js`, `stockInApi.js`)
- Page pattern — แต่ละ page มี `index.js`, `SearchForm.js`, `DataTable.js` (และ modals ถ้าจำเป็น)
- Charts — `recharts` + `react-chartjs-2`
- Date picker — `react-datepicker`
- Select — `react-select`
- Excel export — `xlsx` + `xlsx-js-style`

## Backend Conventions

- Controller-Service-Repository pattern (3 layers)
- Code generator: แก้ `spec.json` แล้วรัน `node generate-service.js` เพื่อ scaffold ไฟล์ใหม่
- Winston logger — log files เก็บใน `logs/`
- `node-cache` — in-memory caching
- ESC/POS printing — `node-thermal-printer` + `escpos-network` (network printer)
- PDF — `puppeteer`
- QR/PromptPay — `qrcode` + `promptpay-qr`
- Kafka — `kafkajs` สำหรับ realtime message streaming
- Socket.io — realtime web socket

## Production Deployment (PM2)

**realtime-service** (`ecosystem.config.js`):
- PM2 name: `realtime-service`, port: 9090
- รันบน Windows server

**realtime-web** (`ecosystem.config.js`):
- PM2 name: `realtime-web`, port: 3008
- `server.js` เป็น entry point (Express static server)

```bash
# Start production (Windows)
start-pm2.bat    # or start-pm2.ps1
pm2 start ecosystem.config.js
pm2 restart realtime-service
pm2 restart realtime-web
```

## Important Notes

- Database charset ใช้ `latin1` (ข้อมูลเก่าจาก POS) — ระวังเรื่อง encoding ภาษาไทย ควรใช้ `iconv-lite` แปลงก่อน
- `stkfile` มี BQty0–BQty24 (25 warehouse slots) — index เริ่มจาก 0
- `posuser` มี permission flags แบบ flat columns (Sale1-38, Cont0-47, Stock0-74) ไม่ใช่ JSON
- `stcard.S_Rem` เป็น movement type code (5 chars) ไม่ใช่ remark
- `branfile` และ `branch` เป็นคนละ table ที่มีข้อมูลซ้อนกัน — `branfile` = master config, `branch` = operational
- MySQL ใน production รันบน Windows (`MYSQLDUMP_PATH` ชี้ไปที่ `D:\MySQL5\bin`)
