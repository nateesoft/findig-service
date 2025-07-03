// src/data/mockData.js

// Mock Sales Data
export const mockSalesData = [
  { month: 'ม.ค.', revenue: 45000, orders: 120 },
  { month: 'ก.พ.', revenue: 52000, orders: 135 },
  { month: 'มี.ค.', revenue: 48000, orders: 128 },
  { month: 'เม.ย.', revenue: 61000, orders: 156 },
  { month: 'พ.ค.', revenue: 55000, orders: 142 },
  { month: 'มิ.ย.', revenue: 67000, orders: 178 }
];

// Mock Products Data
export const mockProducts = [
  { 
    id: 1, 
    code: 'PRD001', 
    name: 'แล็ปท็อป Acer Aspire 5', 
    category: 'อิเล็กทรอนิกส์', 
    price: 18990, 
    stock: 25, 
    status: 'active' 
  },
  { 
    id: 2, 
    code: 'PRD002', 
    name: 'มือถือ iPhone 15', 
    category: 'อิเล็กทรอนิกส์', 
    price: 35900, 
    stock: 15, 
    status: 'active' 
  },
  { 
    id: 3, 
    code: 'PRD003', 
    name: 'หูฟัง AirPods Pro', 
    category: 'อิเล็กทรอนิกส์', 
    price: 8990, 
    stock: 32, 
    status: 'active' 
  },
  { 
    id: 4, 
    code: 'PRD004', 
    name: 'เสื้อยืด Cotton 100%', 
    category: 'เสื้อผ้า', 
    price: 299, 
    stock: 150, 
    status: 'active' 
  },
  { 
    id: 5, 
    code: 'PRD005', 
    name: 'กางเกงยีนส์ Levi\'s', 
    category: 'เสื้อผ้า', 
    price: 1990, 
    stock: 45, 
    status: 'active' 
  }
];

// Mock Sales Records
export const mockSales = [
  { 
    id: 1, 
    saleNumber: 'SAL001', 
    customer: 'สมชาย ใจดี', 
    date: '2024-06-15', 
    total: 45780, 
    status: 'paid', 
    items: 3,
    productCode: "SET1001",
    productName: "SET 1001 Premium",
    stock: "A1",
    branch: "001",
    post: "N"
  },
  { 
    id: 2, 
    saleNumber: 'SAL002', 
    customer: 'สมหญิง สวยงาม', 
    date: '2024-06-15', 
    total: 8990, 
    status: 'paid', 
    items: 1,
    productCode: "SET1001",
    productName: "SET 1001 Premium",
    stock: "A1",
    branch: "001",
    post: "N"
  },
  { 
    id: 3, 
    saleNumber: 'SAL003', 
    customer: 'ประชา ซื่อสัตย์', 
    date: '2024-06-14', 
    total: 2289, 
    status: 'pending', 
    items: 2,
    productCode: "SET1001",
    productName: "SET 1001 Premium",
    stock: "A1",
    branch: "001",
    post: "N"
  },
  { 
    id: 4, 
    saleNumber: 'SAL004', 
    customer: 'มาลี สุขใส', 
    date: '2024-06-14', 
    total: 35900, 
    status: 'paid', 
    items: 1,
    productCode: "SET1001",
    productName: "SET 1001 Premium",
    stock: "A1",
    branch: "001",
    post: "N"
  },
  { 
    id: 5, 
    saleNumber: 'SAL005', 
    customer: 'วิชัย เก่งกาจ', 
    date: '2024-06-13', 
    total: 19289, 
    status: 'paid', 
    items: 2,
    productCode: "SET1001",
    productName: "SET 1001 Premium",
    stock: "A1",
    branch: "001",
    post: "N"
  }
];

// Mock Customers Data
export const mockCustomers = [
  { 
    id: 1, 
    code: 'CUS001', 
    name: 'สมชาย ใจดี', 
    phone: '089-123-4567', 
    email: 'somchai@email.com', 
    type: 'retail' 
  },
  { 
    id: 2, 
    code: 'CUS002', 
    name: 'สมหญิง สวยงาม', 
    phone: '081-234-5678', 
    email: 'somying@email.com', 
    type: 'wholesale' 
  },
  { 
    id: 3, 
    code: 'CUS003', 
    name: 'ประชา ซื่อสัตย์', 
    phone: '082-345-6789', 
    email: 'pracha@email.com', 
    type: 'retail' 
  },
  { 
    id: 4, 
    code: 'CUS004', 
    name: 'มาลี สุขใส', 
    phone: '083-456-7890', 
    email: 'malee@email.com', 
    type: 'vip' 
  },
  { 
    id: 5, 
    code: 'CUS005', 
    name: 'วิชัย เก่งกาจ', 
    phone: '084-567-8901', 
    email: 'wichai@email.com', 
    type: 'retail' 
  }
];

// Category Data for Charts
export const categoryData = [
  { name: 'อิเล็กทรอนิกส์', value: 65, color: '#3B82F6' },
  { name: 'เสื้อผ้า', value: 25, color: '#10B981' },
  { name: 'อื่นๆ', value: 10, color: '#F59E0B' }
];

// Mock User Groups
export const mockUserGroups = [
  { 
    id: 1, 
    name: 'ผู้ดูแลระบบ', 
    code: 'ADMIN', 
    permissions: ['all'], 
    userCount: 2 
  },
  { 
    id: 2, 
    name: 'ผู้จัดการ', 
    code: 'MANAGER', 
    permissions: ['sales', 'reports', 'products'], 
    userCount: 3 
  },
  { 
    id: 3, 
    name: 'พนักงานขาย', 
    code: 'STAFF', 
    permissions: ['sales'], 
    userCount: 5 
  }
];

// Mock Branch Information
export const mockBranchInfo = {
  branchName: 'สาขาใหญ่',
  branchCode: 'BR001',
  address: '123 ถนนสีลม เขตบางรัก กรุงเทพมหานคร 10500',
  phone: '02-234-5678',
  email: 'info@company.com',
  manager: 'คุณสมชาย ใจดี',
  taxId: '1234567890123',
  registrationNumber: 'BOR001234567',
  website: 'www.company.com'
};