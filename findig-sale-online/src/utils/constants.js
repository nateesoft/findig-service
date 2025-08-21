export const SESSION_TIMEOUT = 40 * 60 * 1000;
export const WARNING_TIME = 60 * 1000;

// Menu configuration
export const MENU_GROUPS = [
  {
    id: 'dashboard',
    label: 'หน้าหลัก',
    page: 'dashboard'
  },
  {
    id: 'sales',
    label: 'กลุ่มเมนูการขาย',
    items: [
      { id: 'sales-record', label: 'ข้อมูลการขาย', page: 'sales' },
      { id: 'stcard', label: 'ข้อมูลความเคลื่อนไหว', page: 'stcard' },
      { id: 'stkfile', label: 'ข้อมูลสินค้าคงเหลือ', page: 'stkfile' }
    ]
  },
  {
    id: 'reports',
    label: 'รายงานต่างๆ',
    items: [
      { id: 'stock-card', label: 'รายงานภาพรวมสินค้า', page: 'report-summary' },
      { id: 'stock-card', label: 'รายงานการเปิดบิลด้วยมือ', page: 'report-sales' },
      { id: 'stock-card', label: 'รายงาน สต๊อกคงเหลือ', page: 'report-stkfile' },
      { id: 'stock-card', label: 'รายงานความเคลื่อนไหวสินค้า', page: 'report-stcard' }
    ]
  },
  {
    id: 'settings',
    label: 'ตั้งค่าระบบ',
    items: [
      { id: 'branch-info', label: 'ข้อมูลรายละเอียดสาขา', page: 'branch-info' },
      { id: 'user-groups', label: 'กำหนดรหัสกลุ่มผู้ใช้งาน', page: 'user-groups' },
      { id: 'system-settings', label: 'ปรับแต่งระบบ', page: 'system-settings' }
    ]
  }
];

// Page titles mapping
export const PAGE_TITLES = {
  dashboard: 'แดชบอร์ด',
  sales: 'บันทึกการขาย',
  'user-groups': 'กำหนดรหัสกลุ่มผู้ใช้งาน',
  products: 'จัดการสินค้า',
  customers: 'จัดการลูกค้า',
  reports: 'รายงาน',
  'inventory-report': 'รายงานสินค้าคงคลัง',
  'system-settings': 'ปรับแต่งระบบ',
  'branch-info': 'ข้อมูลรายละเอียดสาขา'
};

// Default settings
export const DEFAULT_SETTINGS = {
  companyName: 'บริษัท ตัวอย่าง จำกัด',
  taxRate: 7,
  currency: 'THB',
  language: 'th',
  autoBackup: true,
  emailNotifications: true,
  lowStockAlert: 10,
  receiptFooter: 'ขอบคุณที่ใช้บริการ',
  theme: 'light'
};

// API endpoints (for future use)
export const API_ENDPOINTS = {
  LOGIN: '/api/auth/login',
  LOGOUT: '/api/auth/logout',
  PRODUCTS: '/api/products',
  CUSTOMERS: '/api/customers',
  SALES: '/api/sales',
  REPORTS: '/api/reports'
};
