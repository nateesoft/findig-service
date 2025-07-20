import { useEffect, useState } from 'react';
import { getThemeClasses } from '../utils/themes';
import { loadBranchInfo } from '../api/branchApi';

const BranchInfo = ({ currentTheme }) => {
  const [branchInfo, setBranchInfo] = useState({});

  const initLoadBranch = async () => {
    try {
      const { data, error } = await loadBranchInfo()
      if(data) {
        setBranchInfo(data)
      }else{
        alert(error || 'ไม่สามารถโหลดข้อมูลได้')
      }
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    }
  }

  useEffect(()=> {
    initLoadBranch()
  }, [])

  return (
    <div className="space-y-6">
      <h1 className={`text-2xl font-bold ${getThemeClasses('textPrimary', currentTheme)}`}>ข้อมูลรายละเอียดสาขา</h1>

      <div className={`${getThemeClasses('cardBg', currentTheme)} rounded-lg shadow-sm border ${getThemeClasses('cardBorder', currentTheme)} p-6`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={`block text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)} mb-2`}>
              รหัสสาขา
            </label>
            <input
              type="text"
              value={branchInfo.Code}
              onChange={(e) => setBranchInfo({...branchInfo, branchCode: e.target.value})}
              className={`w-full px-3 py-2 border rounded-lg ${getThemeClasses('input', currentTheme)}`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)} mb-2`}>
              ชื่อสาขา
            </label>
            <input
              type="text"
              value={branchInfo.Name}
              onChange={(e) => setBranchInfo({...branchInfo, branchName: e.target.value})}
              className={`w-full px-3 py-2 border rounded-lg ${getThemeClasses('input', currentTheme)}`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)} mb-2`}>
              เบอร์โทรศัพท์
            </label>
            <input
              type="text"
              value={branchInfo.Tel_No}
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
              value={branchInfo.E_Mail}
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
              value={branchInfo.Manager}
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
        </div>
      </div>
    </div>
  );
};

export default BranchInfo;