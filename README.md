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
pm2-manager.bat startup            :: ให้ PM2 start อัตโนมัติตอนเปิดเครื่อง (pm2-windows-startup)
```
