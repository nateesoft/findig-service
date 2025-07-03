// src/pages/BranchInfo.jsx
import React, { useState } from 'react';
import { getThemeClasses } from '../utils/themes';
import { mockBranchInfo } from '../data/mockData';

const BranchInfo = ({ currentTheme }) => {
  const [branchInfo, setBranchInfo] = useState(mockBranchInfo);

  return (
    <div className="space-y-6">
      <h1 className={`text-2xl font-bold ${getThemeClasses('textPrimary', currentTheme)}`}>ข้อมูลรายละเอียดสาขา</h1>

      <div className={`${getThemeClasses('cardBg', currentTheme)} rounded-lg shadow-sm border ${getThemeClasses('cardBorder', currentTheme)} p-6`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={`block text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)} mb-2`}>
              ชื่อสาขา
            </label>
            <input
              type="text"
              value={branchInfo.branchName}
              onChange={(e) => setBranchInfo({...branchInfo, branchName: e.target.value})}
              className={`w-full px-3 py-2 border rounded-lg ${getThemeClasses('input', currentTheme)}`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)} mb-2`}>
              รหัสสาขา
            </label>
            <input
              type="text"
              value={branchInfo.branchCode}
              onChange={(e) => setBranchInfo({...branchInfo, branchCode: e.target.value})}
              className={`w-full px-3 py-2 border rounded-lg ${getThemeClasses('input', currentTheme)}`}
            />
          </div>

          <div className="md:col-span-2">
            <label className={`block text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)} mb-2`}>
              ที่อยู่
            </label>
            <textarea
              value={branchInfo.address}
              onChange={(e) => setBranchInfo({...branchInfo, address: e.target.value})}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg ${getThemeClasses('input', currentTheme)}`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)} mb-2`}>
              เบอร์โทรศัพท์
            </label>
            <input
              type="text"
              value={branchInfo.phone}
              onChange={(e) => setBranchInfo({...branchInfo, phone: e.target.value})}
              className={`w-full px-3 py-2 border rounded-lg ${getThemeClasses('input', currentTheme)}`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)} mb-2`}>
              อีเมล
            </label>
            <input
              type="email"
              value={branchInfo.email}
              onChange={(e) => setBranchInfo({...branchInfo, email: e.target.value})}
              className={`w-full px-3 py-2 border rounded-lg ${getThemeClasses('input', currentTheme)}`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)} mb-2`}>
              ผู้จัดการสาขา
            </label>
            <input
              type="text"
              value={branchInfo.manager}
              onChange={(e) => setBranchInfo({...branchInfo, manager: e.target.value})}
              className={`w-full px-3 py-2 border rounded-lg ${getThemeClasses('input', currentTheme)}`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)} mb-2`}>
              เลขประจำตัวผู้เสียภาษี
            </label>
            <input
              type="text"
              value={branchInfo.taxId}
              onChange={(e) => setBranchInfo({...branchInfo, taxId: e.target.value})}
              className={`w-full px-3 py-2 border rounded-lg ${getThemeClasses('input', currentTheme)}`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)} mb-2`}>
              เลขทะเบียนพาณิชย์
            </label>
            <input
              type="text"
              value={branchInfo.registrationNumber}
              onChange={(e) => setBranchInfo({...branchInfo, registrationNumber: e.target.value})}
              className={`w-full px-3 py-2 border rounded-lg ${getThemeClasses('input', currentTheme)}`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)} mb-2`}>
              เว็บไซต์
            </label>
            <input
              type="text"
              value={branchInfo.website}
              onChange={(e) => setBranchInfo({...branchInfo, website: e.target.value})}
              className={`w-full px-3 py-2 border rounded-lg ${getThemeClasses('input', currentTheme)}`}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => alert('บันทึกข้อมูลสาขาเรียบร้อย')}
            className={`text-white px-6 py-2 rounded-lg font-medium ${getThemeClasses('primaryBtn', currentTheme)} ${getThemeClasses('transition', currentTheme)}`}
          >
            บันทึกข้อมูล
          </button>
        </div>
      </div>
    </div>
  );
};

export default BranchInfo;