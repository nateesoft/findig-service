# 🏪 ระบบบันทึกการขาย (Sales Management System)

ระบบบันทึกการขายที่ทันสมัย รองรับธีมหลากหลาย และมีระบบความปลอดภัยแบบ Auto Logout

## ✨ คุณสมบัติเด่น

- 🎨 **ธีมหลากหลาย**: รองรับธีม 12+ แบบ รวมถึงธีมพิเศษและ Dark Mode
- 🔐 **ระบบความปลอดภัย**: Auto Logout หลังไม่มีการใช้งาน 5 นาทีพร้อมแจ้งเตือน
- 📱 **Responsive Design**: ใช้งานได้ทั้งบนมือถือและเดสก์ท็อป
- 🛍️ **ระบบขาย**: บันทึกการขาย จัดการสินค้า และลูกค้า
- 📊 **รายงานและแดชบอร์ด**: กราฟและสถิติการขายแบบ Real-time
- 👥 **จัดการผู้ใช้**: ระบบกลุ่มผู้ใช้และสิทธิ์การเข้าถึง

## 🎯 ธีมที่รองรับ

### 🌟 ธีมพื้นฐาน
- **ธีมสว่าง** (Light) - ธีมเริ่มต้น
- **ธีมมืด** (Dark) - เหมาะสำหรับการใช้งานยามค่ำคืน
- **ธีมแดง** (Red) - โทนสีแดงสดใส
- **ธีมเขียว** (Green) - โทนสีเขียวธรรมชาติ
- **ธีมน้ำเงิน** (Blue) - โทนสีน้ำเงินเข้ม

### 🌈 ธีมสีสัน
- **ธีมชมพู** (Pink) - โทนสีชมพูนุ่มนวล
- **ธีมม่วง** (Purple) - โทนสีม่วงหรูหรา
- **ธีมส้ม** (Orange) - โทนสีส้มสดใส
- **ธีมเขียวอมฟ้า** (Teal) - โทนสีเขียวอมฟ้า

### ✨ ธีมพิเศษ
- **ธีมคอนทราสต์สูง** (High Contrast) - เพื่อการเข้าถึงที่ดีขึ้น
- **ธีมพระอาทิตย์ตก** (Sunset) - ไล่สีอบอุ่น
- **ธีมมหาสมุทร** (Ocean) - ไล่สีเซีย

## 🚀 การติดตั้งและใช้งาน

### ข้อกำหนดระบบ
- Node.js 16+ 
- npm หรือ yarn
- Modern Web Browser

### ขั้นตอนการติดตั้ง

1. **Clone หรือสร้างโปรเจค**
```bash
# สร้างโปรเจคใหม่
npm create vite@latest sales-management-system -- --template react
cd sales-management-system
```

2. **คัดลอกไฟล์ทั้งหมด**
- คัดลอกไฟล์จากโครงสร้างด้านล่างไปยังโฟลเดอร์โปรเจค

3. **ติดตั้ง Dependencies**
```bash
npm install
```

4. **ติดตั้ง TailwindCSS**
```bash
npm install -D tailwindcss postcss autoprefixer
```

5. **รันโปรเจค**
```bash
npm run dev
```

6. **เปิดเบราว์เซอร์**
```
http://localhost:3000
```

### ข้อมูลสำหรับเข้าสู่ระบบ
- **ชื่อผู้ใช้**: `admin`
- **รหัสผ่าน**: `password`

## 📁 โครงสร้างไฟล์

```
src/
├── components/           # React Components
│   ├── Auth/            # Authentication Components
│   │   └── LoginPage.jsx
│   ├── Layout/          # Layout Components
│   │   ├── Sidebar.jsx
│   │   ├── Header.jsx
│   │   └── QuickThemeSelector.jsx
│   ├── Modals/          # Modal Components
│   │   ├── SessionWarningModal.jsx
│   │   └── LogoutConfirmModal.jsx
│   └── Common/          # Common Components
│       └── SessionIndicator.jsx
├── pages/               # Page Components
│   ├── Dashboard.jsx    # หน้าแดชบอร์ด
│   ├── Sales.jsx        # หน้าบันทึกการขาย
│   ├── UserGroups.jsx   # หน้าจัดการกลุ่มผู้ใช้
│   ├── Products.jsx     # หน้าจัดการสินค้า
│   ├── Customers.jsx    # หน้าจัดการลูกค้า
│   ├── Reports.jsx      # หน้ารายงานการขาย
│   ├── InventoryReport.jsx # หน้ารายงานสินค้าคงคลัง
│   ├── SystemSettings.jsx  # หน้าตั้งค่าระบบ
│   └── BranchInfo.jsx   # หน้าข้อมูลสาขา
├── data/                # Mock Data
│   └── mockData.js      # ข้อมูลจำลอง
├── utils/               # Utility Functions
│   ├── themes.js        # การจัดการธีม
│   └── constants.js     # ค่าคงที่
├── App.jsx              # ไฟล์หลักของแอป
├── main.jsx             # Entry Point
└── index.css            # Global Styles
```

## 🔧 การปรับแต่ง

### เพิ่มธีมใหม่
1. เปิดไฟล์ `src/utils/themes.js`
2. เพิ่มธีมใหม่ในออบเจค `themes`:

```javascript
newTheme: {
  name: 'ธีมใหม่',
  primary: 'color-name',
  background: 'bg-class',
  // ... คุณสมบัติอื่นๆ
}
```

### เปลี่ยนเวลา Auto Logout
1. เปิดไฟล์ `src/utils/constants.js`
2. แก้ไขค่า `SESSION_TIMEOUT`:

```javascript
export const SESSION_TIMEOUT = 10 * 60 * 1000; // 10 นาที
```

### เพิ่มเมนูใหม่
1. เปิดไฟล์ `src/utils/constants.js`
2. เพิ่มเมนูใน `MENU_GROUPS`
3. สร้างไฟล์ Page ใหม่ใน `src/pages/`
4. เพิ่ม Route ใน `src/App.jsx`

## 🛠️ การพัฒนาต่อ

### เพิ่มความสามารถใหม่
- **ระบบ API**: เชื่อมต่อกับ Backend API
- **ระบบพิมพ์**: เพิ่มฟีเจอร์พิมพ์ใบเสร็จ
- **ระบบแจ้งเตือน**: Push Notifications
- **การส่งออกข้อมูล**: Export เป็น Excel/PDF
- **ระบบสำรองข้อมูล**: Auto Backup

### เทคโนโลยีที่ใช้
- **React 18**: JavaScript Framework
- **Vite**: Build Tool
- **TailwindCSS**: CSS Framework  
- **Lucide React**: Icon Library
- **Recharts**: Chart Library

## 📊 ฟีเจอร์หลัก

### 🏠 แดชบอร์ด
- สถิติการขายแบบ Real-time
- กราฟยอดขายรายเดือน
- สัดส่วนการขายตามหมวดหมู่
- รายการขายล่าสุด

### 🛍️ ระบบขาย
- เลือกสินค้าและเพิ่มในตะกร้า
- เลือกลูกค้าและวิธีชำระเงิน
- คำนวณภาษีและส่วนลดอัตโนมัติ
- บันทึกการขายและพิมพ์ใบเสร็จ

### 📦 จัดการสินค้า
- เพิ่ม/แก้ไข/ลบสินค้า
- จัดการหมวดหมู่สินค้า
- ติดตามสต็อกคงเหลือ
- แจ้งเตือนสินค้าใกล้หมด

### 👥 จัดการลูกค้า
- ข้อมูลลูกค้าแบบละเอียด
- จัดกลุ่มลูกค้า (ทั่วไป/ขายส่ง/VIP)
- ประวัติการซื้อของลูกค้า

### 📈 รายงาน
- รายงานการขายรายวัน/เดือน/ปี
- รายงานสินค้าคงคลัง
- รายงานลูกค้า
- ส่งออกเป็น Excel/PDF

## 🔐 ระบบความปลอดภัย

### Auto Logout
- ออกจากระบบอัตโนมัติหลังไม่มีการใช้งาน 5 นาที
- แจ้งเตือนล่วงหน้า 1 นาทีก่อนออกจากระบบ
- สามารถต่ออายุเซสชันได้จากแจ้งเตือน
- ติดตามกิจกรรมการใช้งาน

### การจัดการสิทธิ์
- ระบบกลุ่มผู้ใช้ (Admin/Manager/Staff)
- การกำหนดสิทธิ์การเข้าถึงแต่ละหน้า
- ป้องกันการเข้าถึงฟีเจอร์ที่ไม่ได้รับอนุญาต

## 📱 การใช้งานบนมือถือ

- ออกแบบ Responsive รองรับทุกขนาดหน้าจอ
- เมนูแบบ Hamburger สำหรับมือถือ
- ปุ่มเปลี่ยนธีมสำหรับมือถือ
- การใช้งานด้วยสัมผัส (Touch-friendly)

## 🎨 การจัดการธีม

### การเปลี่ยนธีม
1. **จากหน้าเข้าสู่ระบบ**: ดรอปดาวน์มุมขวาบน
2. **ในระบบ**: 
   - Quick Theme Selector (มุมขวาบน - เดสก์ท็อป)
   - เมนูธีมใน Header (มือถือ)
   - หน้าตั้งค่าระบบ

### ธีมเด่น
- **ธีมคอนทราสต์สูง**: เพื่อผู้ใช้ที่มีปัญหาการมองเห็น
- **ธีม Sunset**: ไล่สีอบอุ่นสวยงาม
- **ธีม Ocean**: ไล่สีเซียน่าดู

## 🚀 การ Deploy

### Build สำหรับ Production
```bash
npm run build
```

### Preview Build
```bash
npm run preview
```

### Deploy บน Netlify/Vercel
1. Push โค้ดขึ้น GitHub
2. เชื่อมต่อ Repository กับ Netlify/Vercel
3. ตั้งค่า Build Command: `npm run build`
4. ตั้งค่า Publish Directory: `dist`

## 🤝 การสนับสนุน

หากพบปัญหาหรือต้องการปรับปรุง สามารถ:
- เปิด Issue ใน Repository
- Fork และส่ง Pull Request
- ติดต่อทีมพัฒนา

## 📝 License

MIT License - ใช้งานและแก้ไขได้อย่างอิสระ

---

**พัฒนาด้วย ❤️ โดย Thailand Development Team**

🎯 **เป้าหมาย**: สร้างระบบขายที่ใช้งานง่าย สวยงาม และปลอดภัย