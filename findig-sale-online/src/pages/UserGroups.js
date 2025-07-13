import React, { useState } from 'react';
import { Plus, Edit, Trash2, X, Check } from 'lucide-react';

import { getThemeClasses } from '../utils/themes';
import { mockUserGroups } from '../data/mockData';

const UserGroups = ({ currentTheme }) => {
  const [userGroups, setUserGroups] = useState(mockUserGroups);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: '',
    code: '',
    permissions: []
  });

  const availablePermissions = [
    { key: 'all', label: 'ทั้งหมด', description: 'สิทธิ์ทั้งหมดในระบบ' },
    { key: 'sales', label: 'ขาย', description: 'การจัดการข้อมูลการขาย' },
    { key: 'reports', label: 'รายงาน', description: 'การดูและสร้างรายงาน' },
    { key: 'products', label: 'สินค้า', description: 'การจัดการข้อมูลสินค้า' },
    { key: 'customers', label: 'ลูกค้า', description: 'การจัดการข้อมูลลูกค้า' },
    { key: 'inventory', label: 'คลังสินค้า', description: 'การจัดการสต็อกสินค้า' }
  ];

  const handlePermissionChange = (permissionKey) => {
    if (permissionKey === 'all') {
      // If "all" is selected, clear other permissions and set only "all"
      if (newGroup.permissions.includes('all')) {
        setNewGroup(prev => ({ ...prev, permissions: [] }));
      } else {
        setNewGroup(prev => ({ ...prev, permissions: ['all'] }));
      }
    } else {
      // If other permission is selected, remove "all" first
      setNewGroup(prev => {
        let updatedPermissions = prev.permissions.filter(p => p !== 'all');
        
        if (updatedPermissions.includes(permissionKey)) {
          updatedPermissions = updatedPermissions.filter(p => p !== permissionKey);
        } else {
          updatedPermissions.push(permissionKey);
        }
        
        return { ...prev, permissions: updatedPermissions };
      });
    }
  };

  const handleSaveGroup = () => {
    if (!newGroup.name.trim() || !newGroup.code.trim() || newGroup.permissions.length === 0) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    // Check if code already exists
    if (userGroups.some(group => group.code === newGroup.code)) {
      alert('รหัสกลุ่มนี้มีอยู่แล้ว กรุณาใช้รหัสอื่น');
      return;
    }

    const newGroupData = {
      id: Date.now(),
      name: newGroup.name,
      code: newGroup.code,
      permissions: newGroup.permissions,
      userCount: 0
    };

    setUserGroups(prev => [...prev, newGroupData]);
    setNewGroup({ name: '', code: '', permissions: [] });
    setShowAddModal(false);
  };

  const handleCloseModal = () => {
    setNewGroup({ name: '', code: '', permissions: [] });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className={`text-2xl font-bold ${getThemeClasses('textPrimary', currentTheme)}`}>กำหนดรหัสกลุ่มผู้ใช้งาน</h1>
        <button 
          onClick={() => setShowAddModal(true)}
          className={`mt-4 sm:mt-0 text-white px-4 py-2 rounded-lg font-medium ${getThemeClasses('primaryBtn', currentTheme)} ${getThemeClasses('transition', currentTheme)} flex items-center`}
        >
          <Plus className="w-4 h-4 mr-2" />
          เพิ่มกลุ่มใหม่
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {userGroups.map((group) => (
          <div key={group.id} className={`${getThemeClasses('cardBg', currentTheme)} rounded-lg shadow-sm border ${getThemeClasses('cardBorder', currentTheme)} p-6`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${getThemeClasses('textPrimary', currentTheme)}`}>{group.name}</h3>
              <span className={`text-xs px-2 py-1 rounded ${getThemeClasses('info', currentTheme)}`}>
                {group.code}
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-sm ${getThemeClasses('textSecondary', currentTheme)}`}>จำนวนผู้ใช้:</span>
                <span className={`text-sm font-medium ${getThemeClasses('textPrimary', currentTheme)}`}>{group.userCount} คน</span>
              </div>
              
              <div>
                <span className={`text-sm ${getThemeClasses('textSecondary', currentTheme)}`}>สิทธิ์การใช้งาน:</span>
                <div className="mt-2 flex flex-wrap gap-1">
                  {group.permissions.map((permission, index) => (
                    <span key={index} className={`text-xs px-2 py-1 rounded ${getThemeClasses('success', currentTheme)}`}>
                      {permission === 'all' ? 'ทั้งหมด' : 
                       permission === 'sales' ? 'ขาย' :
                       permission === 'reports' ? 'รายงาน' : 
                       permission === 'products' ? 'สินค้า' :
                       permission === 'customers' ? 'ลูกค้า' :
                       permission === 'inventory' ? 'คลังสินค้า' : permission}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className={`mt-4 pt-4 border-t ${getThemeClasses('cardBorder', currentTheme)} flex justify-end space-x-2`}>
              <button className={`${getThemeClasses('textSecondary', currentTheme)} hover:${getThemeClasses('textPrimary', currentTheme)} p-1`}>
                <Edit className="w-4 h-4" />
              </button>
              <button className={`text-red-600 hover:text-red-900 p-1`}>
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* User List by Group */}
      <div className={`${getThemeClasses('cardBg', currentTheme)} rounded-lg shadow-sm border ${getThemeClasses('cardBorder', currentTheme)}`}>
        <div className={`p-6 border-b ${getThemeClasses('cardBorder', currentTheme)}`}>
          <h3 className={`text-lg font-semibold ${getThemeClasses('textPrimary', currentTheme)}`}>รายชื่อผู้ใช้งานในระบบ</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={getThemeClasses('tableHeader', currentTheme)}>
              <tr>
                <th className={`px-6 py-3 text-left text-xs font-medium ${getThemeClasses('textMuted', currentTheme)} uppercase tracking-wider`}>
                  ชื่อผู้ใช้
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${getThemeClasses('textMuted', currentTheme)} uppercase tracking-wider`}>
                  ชื่อ-นามสกุล
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${getThemeClasses('textMuted', currentTheme)} uppercase tracking-wider`}>
                  กลุ่มผู้ใช้
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
              <tr className={getThemeClasses('tableRow', currentTheme)}>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${getThemeClasses('textPrimary', currentTheme)}`}>admin</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${getThemeClasses('textPrimary', currentTheme)}`}>ผู้ดูแลระบบ</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                    ผู้ดูแลระบบ
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
              <tr className={getThemeClasses('tableRow', currentTheme)}>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${getThemeClasses('textPrimary', currentTheme)}`}>manager1</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${getThemeClasses('textPrimary', currentTheme)}`}>สมชาย ผู้จัดการ</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    ผู้จัดการ
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
              <tr className={getThemeClasses('tableRow', currentTheme)}>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${getThemeClasses('textPrimary', currentTheme)}`}>staff1</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${getThemeClasses('textPrimary', currentTheme)}`}>สมหญิง พนักงาน</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${currentTheme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'}`}>
                    พนักงานขาย
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
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Group Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
              onClick={handleCloseModal}
            ></div>

            {/* Modal content */}
            <div className={`inline-block align-bottom ${getThemeClasses('cardBg', currentTheme)} rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full`}>
              {/* Modal header */}
              <div className={`${getThemeClasses('cardBg', currentTheme)} px-6 py-4 border-b ${getThemeClasses('cardBorder', currentTheme)}`}>
                <div className="flex items-center justify-between">
                  <h3 className={`text-lg font-medium ${getThemeClasses('textPrimary', currentTheme)}`}>
                    เพิ่มกลุ่มผู้ใช้ใหม่
                  </h3>
                  <button
                    onClick={handleCloseModal}
                    className={`${getThemeClasses('textSecondary', currentTheme)} hover:${getThemeClasses('textPrimary', currentTheme)} transition-colors`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal body */}
              <div className="px-6 py-4">
                <div className="space-y-4">
                  {/* Group Name */}
                  <div>
                    <label className={`block text-sm font-medium ${getThemeClasses('textPrimary', currentTheme)} mb-2`}>
                      ชื่อกลุ่ม <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newGroup.name}
                      onChange={(e) => setNewGroup(prev => ({ ...prev, name: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${getThemeClasses('cardBg', currentTheme)} ${getThemeClasses('cardBorder', currentTheme)} ${getThemeClasses('textPrimary', currentTheme)}`}
                      placeholder="เช่น ผู้จัดการ, พนักงานขาย"
                    />
                  </div>

                  {/* Group Code */}
                  <div>
                    <label className={`block text-sm font-medium ${getThemeClasses('textPrimary', currentTheme)} mb-2`}>
                      รหัสกลุ่ม <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newGroup.code}
                      onChange={(e) => setNewGroup(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${getThemeClasses('cardBg', currentTheme)} ${getThemeClasses('cardBorder', currentTheme)} ${getThemeClasses('textPrimary', currentTheme)}`}
                      placeholder="เช่น MGR, SALES"
                    />
                  </div>

                  {/* Permissions */}
                  <div>
                    <label className={`block text-sm font-medium ${getThemeClasses('textPrimary', currentTheme)} mb-3`}>
                      สิทธิ์การใช้งาน <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-3">
                      {availablePermissions.map((permission) => (
                        <div key={permission.key} className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              type="checkbox"
                              id={`permission-${permission.key}`}
                              checked={newGroup.permissions.includes(permission.key)}
                              onChange={() => handlePermissionChange(permission.key)}
                              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label 
                              htmlFor={`permission-${permission.key}`} 
                              className={`font-medium ${getThemeClasses('textPrimary', currentTheme)} cursor-pointer`}
                            >
                              {permission.label}
                            </label>
                            <p className={`${getThemeClasses('textSecondary', currentTheme)}`}>
                              {permission.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal footer */}
              <div className={`${getThemeClasses('cardBg', currentTheme)} px-6 py-4 border-t ${getThemeClasses('cardBorder', currentTheme)} flex justify-end space-x-3`}>
                <button
                  onClick={handleCloseModal}
                  className={`px-4 py-2 text-sm font-medium rounded-md border ${getThemeClasses('cardBorder', currentTheme)} ${getThemeClasses('textSecondary', currentTheme)} hover:${getThemeClasses('textPrimary', currentTheme)} transition-colors`}
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleSaveGroup}
                  className={`px-4 py-2 text-sm font-medium text-white rounded-md ${getThemeClasses('primaryBtn', currentTheme)} transition-colors flex items-center`}
                >
                  <Check className="w-4 h-4 mr-2" />
                  บันทึก
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserGroups;