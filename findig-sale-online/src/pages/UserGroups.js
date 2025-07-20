import { useEffect, useState } from 'react';

import { getThemeClasses } from '../utils/themes';
import { loadPosUserAll } from '../api/userLoginApi';

const UserGroups = ({ currentTheme }) => {
  const [userList, setUserList] = useState([])

  const initLoadAllUser = async () => {
    try {
      const { data, error } = await loadPosUserAll()
      if(data) {
        setUserList(data)
      }else{
        alert(error || 'ไม่สามารถโหลดข้อมูลได้')
      }
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    }
  }

  useEffect(()=> {
    initLoadAllUser()
  }, [])

  return (
    <div className="space-y-6">
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
                  สถานะใช้งาน
                </th>
              </tr>
            </thead>
            <tbody className={`${getThemeClasses('cardBg', currentTheme)} divide-y ${getThemeClasses('tableBorder', currentTheme)}`}>
              {userList && userList.map((user) => 
                <tr className={getThemeClasses('tableRow', currentTheme)}>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${getThemeClasses('textPrimary', currentTheme)}`}>
                    {user.UserName}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${getThemeClasses('textPrimary', currentTheme)}`}>
                    {user.Name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                      {user.UserGroup}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getThemeClasses('success', currentTheme)}`}>
                      {user.OnACT}
                    </span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserGroups;