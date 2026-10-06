# findig-service

-- CREATE INDEX idx_stkfile_BPCode ON stkfile(BPCode);
-- CREATE INDEX idx_product_PCode ON product(PCode);
-- CREATE INDEX idx_groupfile_GroupCode ON groupfile(GroupCode);
-- CREATE INDEX idx_stkfile_Branch ON stkfile(Branch);
-- CREATE INDEX idx_stkfile_BStk ON stkfile(BStk);
-- CREATE INDEX idx_product_PGroup ON product(PGroup);


## Run with PM2 (Windows)

ต้องติดตั้ง PM2 ก่อน: `npm install -g pm2` และสร้าง `ecosystem.config.js` ในแต่ละโปรเจกต์ (copy จาก `_ecosystem.config.js`)

```bat
pm2-manager.bat                    :: เปิดเมนู
pm2-manager.bat start              :: start ทั้ง realtime-service และ realtime-web
pm2-manager.bat restart service    :: restart เฉพาะ realtime-service
pm2-manager.bat stop web           :: stop เฉพาะ realtime-web
pm2-manager.bat logs service       :: ดู log
pm2-manager.bat status
pm2-manager.bat build              :: build realtime-web (npm run build)
pm2-manager.bat rebuild            :: build realtime-web แล้ว start/restart realtime-web
pm2-manager.bat startup            :: ให้ PM2 start อัตโนมัติตอนเปิดเครื่อง (pm2-windows-startup)
```

## ติดตั้งบนเครื่องใหม่ (Windows)

### 0. สิ่งที่ต้องมี
- Node.js 20 ขึ้นไป
- PM2: `npm install -g pm2`
- เครื่องต้องเชื่อมต่อ MySQL ได้ และรู้ path ของ `mysqldump` ถ้าจะใช้ฟีเจอร์ backup (เช่น `D:\MySQL5\bin`)

### 1. Clone และติดตั้ง dependencies
```bat
git clone <repo-url> findig-service
cd findig-service\realtime-service
npm install
cd ..\realtime-web
npm install
```

### 2. ตั้งค่า realtime-service
`ecosystem.config.js` ไม่ได้อยู่ใน git ต้องสร้างจาก template:
```bat
cd realtime-service
copy _ecosystem.config.js ecosystem.config.js
```
แล้วกรอกค่า:
- `WEB_USER_AUTH`, `WEB_USER_PASS` — user/password ที่ realtime-web ใช้เรียก API
- `API_SECRET_PASS`
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_DRIVER`
- `DB_POS_NAME`, `DB_CRM_NAME`, `DB_BOR_NAME`
- `MYSQLDUMP_PATH` (ใน JS ต้องใช้ backslash สองตัว เช่น `"D:\\MySQL5\\bin"`)

ถ้าเป็นฐานข้อมูลใหม่ ให้รัน `db.sql` และสร้าง index ตามด้านบน

### 3. ตั้งค่า realtime-web
ค่า `REACT_APP_*` และ `PUBLIC_URL` ถูกฝังลงไฟล์ตอน `npm run build` ดังนั้นต้องสร้าง `.env` ให้เสร็จ**ก่อน build**:
```bat
cd realtime-web
copy .env.example .env
copy _ecosystem.config.js ecosystem.config.js
```
- `.env`: `REACT_APP_API_USER` / `REACT_APP_API_KEY` ต้องตรงกับ `WEB_USER_AUTH` / `WEB_USER_PASS` ของ realtime-service
- `ecosystem.config.js`: ตรวจ `PORT` (3008) และ `BACKEND_HOST` (`http://127.0.0.1:9090`)

### 4. Build และ start
```bat
cd ..
pm2-manager.bat build
pm2-manager.bat start
```

### 5. ตรวจสอบ
- `pm2-manager.bat status` — ทั้งสองตัวต้องมีสถานะ `online`
- เปิด `http://localhost:3008/realtime-web`
- ดู log: `pm2-manager.bat logs service` หรือ `pm2-manager.bat logs web`

### 6. ให้ PM2 start อัตโนมัติตอนเปิดเครื่อง (ทำครั้งเดียว)
```bat
pm2-manager.bat startup
```

### อัปเดต code ครั้งต่อไป
```bat
git pull
cd realtime-service && npm install && cd ..
cd realtime-web && npm install && cd ..
pm2-manager.bat rebuild
pm2-manager.bat restart service
```

## เปลี่ยน URL prefix ของ realtime-web

ค่า default คือ `/realtime-web` ถ้าต้องการเปลี่ยน (เช่น `/findig-sale-online`) แก้แค่ฝั่ง realtime-web ก็พอ ไม่ต้องแก้ realtime-service เพราะ API ยังเรียกผ่าน `/api/realtime-service` เหมือนเดิม

ต้องตั้งค่าให้ตรงกันทั้ง 3 ตัว ถ้าไม่ตรงกันหน้าเว็บจะขาว หรือหาไฟล์ JS/CSS ไม่เจอ:

| ตัวแปร | ไฟล์ | ใช้ทำอะไร |
|---|---|---|
| `PUBLIC_URL` | `realtime-web/.env` | path ของไฟล์ JS/CSS ตอน build (ใช้แทน `homepage` ใน package.json) |
| `REACT_APP_BASENAME` | `realtime-web/.env` | basename ของ React Router |
| `APP_PREFIX` | `realtime-web/ecosystem.config.js` | path ที่ `server.js` ใช้ serve ไฟล์ใน `build/` |

ตัวอย่าง `.env`:
```
PUBLIC_URL=/findig-sale-online
REACT_APP_BASENAME=/findig-sale-online
```
ตัวอย่าง `ecosystem.config.js`:
```js
APP_PREFIX: "findig-sale-online",
```

แก้แล้วต้อง build ใหม่ เพราะ `PUBLIC_URL` และ `REACT_APP_BASENAME` ถูกฝังลงไฟล์ตอน build:
```bat
pm2-manager.bat rebuild
```
แล้วเข้าที่ `http://<server>:3008/findig-sale-online` (ชื่อ process ใน PM2 ยังเป็น `realtime-web` เหมือนเดิม)
