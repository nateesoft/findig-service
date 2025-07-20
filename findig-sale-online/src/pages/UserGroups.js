import { useEffect, useState } from 'react';

import { getThemeClasses } from '../utils/themes';
import { loadPosUserAll } from '../api/userLoginApi';

const UserGroups = ({ currentTheme }) => {
  const [userList, setUserList] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10) // จำนวนรายการต่อหน้า

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

  // คำนวณข้อมูลสำหรับหน้าปัจจุบัน
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentUsers = userList.slice(indexOfFirstItem, indexOfLastItem)

  // คำนวณจำนวนหน้าทั้งหมด
  const totalPages = Math.ceil(userList.length / itemsPerPage)

  // ฟังก์ชันเปลี่ยนหน้า
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  // ฟังก์ชันไปหน้าก่อนหน้า
  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  // ฟังก์ชันไปหน้าถัดไป
  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  // สร้างอาร์เรย์ของหมายเลขหน้า
  const getPageNumbers = () => {
    const pageNumbers = []
    const maxPagesToShow = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2))
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1)

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i)
    }
    return pageNumbers
  }

  return (
    <div className="space-y-6">
      <div className={`${getThemeClasses('cardBg', currentTheme)} rounded-lg shadow-sm border ${getThemeClasses('cardBorder', currentTheme)}`}>
        <div className={`p-6 border-b ${getThemeClasses('cardBorder', currentTheme)}`}>
          <div className="flex justify-between items-center">
            <h3 className={`text-lg font-semibold ${getThemeClasses('textPrimary', currentTheme)}`}>
              รายชื่อผู้ใช้งานในระบบ
            </h3>
            <div className={`text-sm ${getThemeClasses('textMuted', currentTheme)}`}>
              ทั้งหมด {userList.length} รายการ
            </div>
          </div>
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
              {currentUsers && currentUsers.map((user, index) => 
                <tr key={index} className={getThemeClasses('tableRow', currentTheme)}>
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className={`px-6 py-3 border-t ${getThemeClasses('cardBorder', currentTheme)}`}>
            <div className="flex items-center justify-between">
              {/* ข้อมูลการแสดงผล */}
              <div className={`text-sm ${getThemeClasses('textMuted', currentTheme)}`}>
                แสดง {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, userList.length)} จาก {userList.length} รายการ
              </div>
              
              {/* ปุ่ม Pagination */}
              <div className="flex items-center space-x-2">
                {/* ปุ่มย้อนกลับ */}
                <button
                  onClick={handlePrevious}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-md text-sm ${
                    currentPage === 1
                      ? `${getThemeClasses('textMuted', currentTheme)} cursor-not-allowed`
                      : `${getThemeClasses('textPrimary', currentTheme)} hover:${getThemeClasses('cardBg', currentTheme)} border ${getThemeClasses('cardBorder', currentTheme)}`
                  }`}
                >
                  ก่อนหน้า
                </button>

                {/* หมายเลขหน้า */}
                {getPageNumbers().map((pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`px-3 py-1 rounded-md text-sm ${
                      currentPage === pageNumber
                        ? `bg-blue-500 text-white`
                        : `${getThemeClasses('textPrimary', currentTheme)} hover:${getThemeClasses('cardBg', currentTheme)} border ${getThemeClasses('cardBorder', currentTheme)}`
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}

                {/* ปุ่มถัดไป */}
                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-md text-sm ${
                    currentPage === totalPages
                      ? `${getThemeClasses('textMuted', currentTheme)} cursor-not-allowed`
                      : `${getThemeClasses('textPrimary', currentTheme)} hover:${getThemeClasses('cardBg', currentTheme)} border ${getThemeClasses('cardBorder', currentTheme)}`
                  }`}
                >
                  ถัดไป
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserGroups;