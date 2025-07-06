import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, X } from 'lucide-react';
import { getThemeClasses } from '../utils/themes';
import { mockProducts } from '../data/mockData';

const Products = ({ currentTheme, searchTerm, setSearchTerm }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    code: '',
    name: '',
    category: '',
    price: '',
    cost: '',
    stock: ''
  });

  const addProduct = () => {
    if (!newProduct.name || !newProduct.price) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }
    alert('เพิ่มสินค้าเรียบร้อย');
    setShowAddModal(false);
    setNewProduct({
      code: '',
      name: '',
      category: '',
      price: '',
      cost: '',
      stock: ''
    });
  };

  const filteredProducts = mockProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className={`text-2xl font-bold ${getThemeClasses('textPrimary', currentTheme)}`}>จัดการสินค้า</h1>
        <button 
          onClick={() => setShowAddModal(true)}
          className={`mt-4 sm:mt-0 text-white px-4 py-2 rounded-lg font-medium ${getThemeClasses('primaryBtn', currentTheme)} ${getThemeClasses('transition', currentTheme)} flex items-center`}
        >
          <Plus className="w-4 h-4 mr-2" />
          เพิ่มสินค้าใหม่
        </button>
      </div>

      {/* Filters */}
      <div className={`${getThemeClasses('cardBg', currentTheme)} rounded-lg shadow-sm border ${getThemeClasses('cardBorder', currentTheme)} p-6`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${getThemeClasses('textMuted', currentTheme)} w-4 h-4`} />
            <input
              type="text"
              placeholder="ค้นหาสินค้า..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg ${getThemeClasses('input', currentTheme)}`}
            />
          </div>
          <select className={`px-4 py-2 border rounded-lg ${getThemeClasses('input', currentTheme)}`}>
            <option>ทุกหมวดหมู่</option>
            <option>อิเล็กทรอนิกส์</option>
            <option>เสื้อผ้า</option>
          </select>
          <select className={`px-4 py-2 border rounded-lg ${getThemeClasses('input', currentTheme)}`}>
            <option>ทุกสถานะ</option>
            <option>ใช้งาน</option>
            <option>ไม่ใช้งาน</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className={`${getThemeClasses('cardBg', currentTheme)} rounded-lg shadow-sm border ${getThemeClasses('cardBorder', currentTheme)}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={getThemeClasses('tableHeader', currentTheme)}>
              <tr>
                <th className={`px-6 py-3 text-left text-xs font-medium ${getThemeClasses('textMuted', currentTheme)} uppercase tracking-wider`}>
                  รหัสสินค้า
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${getThemeClasses('textMuted', currentTheme)} uppercase tracking-wider`}>
                  ชื่อสินค้า
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${getThemeClasses('textMuted', currentTheme)} uppercase tracking-wider`}>
                  หมวดหมู่
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${getThemeClasses('textMuted', currentTheme)} uppercase tracking-wider`}>
                  ราคา
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${getThemeClasses('textMuted', currentTheme)} uppercase tracking-wider`}>
                  คงเหลือ
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${getThemeClasses('textMuted', currentTheme)} uppercase tracking-wider`}>
                  สถานะ
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${getThemeClasses('textMuted', currentTheme)} uppercase tracking-wider`}>
                  การดำเนินการ
                </th>
              </tr>
            </thead>
            <tbody className={`${getThemeClasses('cardBg', currentTheme)} divide-y ${getThemeClasses('tableBorder', currentTheme)}`}>
              {filteredProducts.map((product) => (
                <tr key={product.id} className={getThemeClasses('tableRow', currentTheme)}>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${getThemeClasses('textPrimary', currentTheme)}`}>
                    {product.code}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${getThemeClasses('textPrimary', currentTheme)}`}>{product.name}</div>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${getThemeClasses('textSecondary', currentTheme)}`}>
                    {product.category}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${getThemeClasses('textPrimary', currentTheme)}`}>
                    ฿{product.price.toLocaleString()}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${getThemeClasses('textPrimary', currentTheme)}`}>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      product.stock > 10 
                        ? getThemeClasses('success', currentTheme)
                        : product.stock > 0
                        ? getThemeClasses('warning', currentTheme)
                        : getThemeClasses('danger', currentTheme)
                    }`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getThemeClasses('success', currentTheme)}`}>
                      ใช้งาน
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className={`${getThemeClasses('textSecondary', currentTheme)} hover:${getThemeClasses('textPrimary', currentTheme)} mr-3`}>
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`${getThemeClasses('cardBg', currentTheme)} rounded-lg shadow-xl w-full max-w-md`}>
            <div className={`p-6 border-b ${getThemeClasses('cardBorder', currentTheme)}`}>
              <div className="flex items-center justify-between">
                <h3 className={`text-lg font-semibold ${getThemeClasses('textPrimary', currentTheme)}`}>เพิ่มสินค้าใหม่</h3>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className={`${getThemeClasses('textMuted', currentTheme)} hover:${getThemeClasses('textSecondary', currentTheme)}`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className={`block text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)} mb-2`}>
                  รหัสสินค้า
                </label>
                <input
                  type="text"
                  value={newProduct.code}
                  onChange={(e) => setNewProduct({...newProduct, code: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg ${getThemeClasses('input', currentTheme)}`}
                  placeholder="PRD001"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)} mb-2`}>
                  ชื่อสินค้า *
                </label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg ${getThemeClasses('input', currentTheme)}`}
                  placeholder="ชื่อสินค้า"
                  required
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)} mb-2`}>
                  หมวดหมู่
                </label>
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg ${getThemeClasses('input', currentTheme)}`}
                >
                  <option value="">เลือกหมวดหมู่</option>
                  <option value="อิเล็กทรอนิกส์">อิเล็กทรอนิกส์</option>
                  <option value="เสื้อผ้า">เสื้อผ้า</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)} mb-2`}>
                    ราคาต้นทุน
                  </label>
                  <input
                    type="number"
                    value={newProduct.cost}
                    onChange={(e) => setNewProduct({...newProduct, cost: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg ${getThemeClasses('input', currentTheme)}`}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)} mb-2`}>
                    ราคาขาย *
                  </label>
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg ${getThemeClasses('input', currentTheme)}`}
                    placeholder="0"
                    required
                  />
                </div>
              </div>
              <div>
                <label className={`block text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)} mb-2`}>
                  จำนวนคงเหลือ
                </label>
                <input
                  type="number"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg ${getThemeClasses('input', currentTheme)}`}
                  placeholder="0"
                />
              </div>
            </div>
            <div className={`p-6 border-t ${getThemeClasses('cardBorder', currentTheme)} flex justify-end space-x-3`}>
              <button
                onClick={() => setShowAddModal(false)}
                className={`px-4 py-2 border rounded-lg font-medium ${getThemeClasses('secondaryBtn', currentTheme)} ${getThemeClasses('transition', currentTheme)}`}
              >
                ยกเลิก
              </button>
              <button
                onClick={addProduct}
                className={`px-4 py-2 text-white rounded-lg font-medium ${getThemeClasses('primaryBtn', currentTheme)} ${getThemeClasses('transition', currentTheme)}`}
              >
                เพิ่มสินค้า
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;