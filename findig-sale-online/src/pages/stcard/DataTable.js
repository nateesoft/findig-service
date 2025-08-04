import { useState, useEffect } from 'react';
import { 
  FileText,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import moment from 'moment';

const DataTable = ({
    getThemeClasses,
    currentTheme,
    filteredSales,
    searchCriteria,
    resetSearch
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const itemsPerPage = 10;
  
  // ฟังก์ชันสำหรับการจัดเรียงข้อมูล
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // จัดเรียงข้อมูล
  const sortedSales = [...filteredSales].sort((a, b) => {
    if (!sortField) return 0;
    
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    // จัดการกับข้อมูลวันที่
    if (sortField === 'S_Date') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }
    
    // จัดการกับข้อมูลตัวเลข
    if (sortField === 'S_Que') {
      aValue = Number(aValue);
      bValue = Number(bValue);
    }
    
    // จัดการกับข้อมูลข้อความ
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (aValue < bValue) {
      return sortDirection === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortDirection === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // คำนวณจำนวนหน้าทั้งหมด
  const totalPages = Math.ceil(sortedSales.length / itemsPerPage);
  
  // คำนวณ index เริ่มต้นและสิ้นสุดสำหรับหน้าปัจจุบัน
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = sortedSales.slice(startIndex, endIndex);
  
  // Reset หน้าเมื่อข้อมูลเปลี่ยน
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredSales]);

  // ฟังก์ชันสำหรับแสดงไอคอน sort
  const getSortIcon = (field) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4 ml-1 opacity-50" />;
    }
    return sortDirection === 'asc' 
      ? <ArrowUp className="w-4 h-4 ml-1" />
      : <ArrowDown className="w-4 h-4 ml-1" />;
  };
  
  // ฟังก์ชันสำหรับการเปลี่ยนหน้า
  const goToPage = (page) => {
    setCurrentPage(page);
  };
  
  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  
  // สร้างปุ่มหน้า
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div
      className={`${getThemeClasses(
        "cardBg",
        currentTheme
      )} rounded-lg shadow-sm border ${getThemeClasses(
        "cardBorder",
        currentTheme
      )}`}
    >
      <div
        className={`p-6 border-b ${getThemeClasses(
          "cardBorder",
          currentTheme
        )}`}
      >
        <h3
          className={`text-lg font-semibold ${getThemeClasses(
            "textPrimary",
            currentTheme
          )}`}
        >
          ข้อมูล STCard
        </h3>
        {sortedSales.length > 0 && (
          <p className={`text-sm ${getThemeClasses("textMuted", currentTheme)} mt-2`}>
            แสดงรายการ {startIndex + 1}-{Math.min(endIndex, sortedSales.length)} จากทั้งหมด {sortedSales.length} รายการ
          </p>
        )}
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={getThemeClasses("tableHeader", currentTheme)}>
            <tr>
              <th
                className={`px-6 py-3 text-left text-xs font-medium ${getThemeClasses(
                  "textMuted",
                  currentTheme
                )} uppercase tracking-wider cursor-pointer hover:${getThemeClasses(
                  "textPrimary",
                  currentTheme
                )} ${getThemeClasses("transition", currentTheme)}`}
                onClick={() => handleSort('S_Bran')}
              >
                <div className="flex items-center">
                  สาขา
                  {getSortIcon('S_Bran')}
                </div>
              </th>
              <th
                className={`px-6 py-3 text-center text-xs font-medium ${getThemeClasses(
                  "textMuted",
                  currentTheme
                )} uppercase tracking-wider cursor-pointer hover:${getThemeClasses(
                  "textPrimary",
                  currentTheme
                )} ${getThemeClasses("transition", currentTheme)}`}
                onClick={() => handleSort('S_Date')}
              >
                <div className="flex items-center justify-center">
                  วันที่สร้าง
                  {getSortIcon('S_Date')}
                </div>
              </th>
              <th
                className={`px-6 py-3 text-left text-xs font-medium ${getThemeClasses(
                  "textMuted",
                  currentTheme
                )} uppercase tracking-wider cursor-pointer hover:${getThemeClasses(
                  "textPrimary",
                  currentTheme
                )} ${getThemeClasses("transition", currentTheme)}`}
                onClick={() => handleSort('S_No')}
              >
                <div className="flex items-center">
                  เลขที่บิล
                  {getSortIcon('S_No')}
                </div>
              </th>
              <th
                className={`px-6 py-3 text-left text-xs font-medium ${getThemeClasses(
                  "textMuted",
                  currentTheme
                )} uppercase tracking-wider cursor-pointer hover:${getThemeClasses(
                  "textPrimary",
                  currentTheme
                )} ${getThemeClasses("transition", currentTheme)}`}
                onClick={() => handleSort('S_PCode')}
              >
                <div className="flex items-center">
                  สินค้า
                  {getSortIcon('S_PCode')}
                </div>
              </th>
              <th
                className={`px-6 py-3 text-left text-xs font-medium ${getThemeClasses(
                  "textMuted",
                  currentTheme
                )} uppercase tracking-wider cursor-pointer hover:${getThemeClasses(
                  "textPrimary",
                  currentTheme
                )} ${getThemeClasses("transition", currentTheme)}`}
                onClick={() => handleSort('S_Que')}
              >
                <div className="flex items-center">
                  จำนวน
                  {getSortIcon('S_Que')}
                </div>
              </th>
              <th
                className={`px-6 py-3 text-left text-xs font-medium ${getThemeClasses(
                  "textMuted",
                  currentTheme
                )} uppercase tracking-wider cursor-pointer hover:${getThemeClasses(
                  "textPrimary",
                  currentTheme
                )} ${getThemeClasses("transition", currentTheme)}`}
                onClick={() => handleSort('S_Stk')}
              >
                <div className="flex items-center">
                  คลัง
                  {getSortIcon('S_Stk')}
                </div>
              </th>
              <th
                className={`px-6 py-3 text-left text-xs font-medium ${getThemeClasses(
                  "textMuted",
                  currentTheme
                )} uppercase tracking-wider cursor-pointer hover:${getThemeClasses(
                  "textPrimary",
                  currentTheme
                )} ${getThemeClasses("transition", currentTheme)}`}
                onClick={() => handleSort('S_Rem')}
              >
                <div className="flex items-center">
                  ประเภท
                  {getSortIcon('S_Rem')}
                </div>
              </th>
              <th
                className={`px-6 py-3 text-left text-xs font-medium ${getThemeClasses(
                  "textMuted",
                  currentTheme
                )} uppercase tracking-wider cursor-pointer hover:${getThemeClasses(
                  "textPrimary",
                  currentTheme
                )} ${getThemeClasses("transition", currentTheme)}`}
                onClick={() => handleSort('Data_Sync')}
              >
                <div className="flex items-center">
                  Sync Data
                  {getSortIcon('Data_Sync')}
                </div>
              </th>
            </tr>
          </thead>
          <tbody
            className={`${getThemeClasses(
              "cardBg",
              currentTheme
            )} divide-y ${getThemeClasses("tableBorder", currentTheme)}`}
          >
            {currentItems.length > 0 ? (
              currentItems.map((draft_sale, index) => (
                <tr
                  key={draft_sale.S_No + (index+1)}
                  className={getThemeClasses("tableRow", currentTheme)}
                >
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-center text-sm font-medium ${getThemeClasses(
                      "textPrimary",
                      currentTheme
                    )}`}
                  >
                    {draft_sale.S_Bran}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-center text-sm ${getThemeClasses(
                      "textPrimary",
                      currentTheme
                    )}`}
                  >
                    {moment(draft_sale.S_Date).format(
                      "DD/MM/YYYY"
                    )}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-right text-sm ${getThemeClasses(
                      "textSecondary",
                      currentTheme
                    )}`}
                  >
                    {draft_sale.S_No}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-center text-sm ${getThemeClasses(
                      "textPrimary",
                      currentTheme
                    )}`}
                  >
                    {draft_sale.S_PCode}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-center text-sm ${getThemeClasses(
                      "textPrimary",
                      currentTheme
                    )}`}
                  >
                    {draft_sale.S_Que}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-center text-sm ${getThemeClasses(
                      "textPrimary",
                      currentTheme
                    )}`}
                  >
                    {draft_sale.S_Stk}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-center text-sm ${getThemeClasses(
                      "textPrimary",
                      currentTheme
                    )}`}
                  >
                    {draft_sale.S_Rem}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-center text-sm ${getThemeClasses(
                      "textPrimary",
                      currentTheme
                    )}`}
                  >
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        draft_sale.Data_Sync === "Y"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : draft_sale.Data_Sync === "N"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {draft_sale.Data_Sync}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="9"
                  className={`px-6 py-8 text-center text-sm ${getThemeClasses(
                    "textMuted",
                    currentTheme
                  )}`}
                >
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <FileText className="w-12 h-12 text-gray-300" />
                    <p>ไม่พบข้อมูลการขายที่ตรงกับเงื่อนไขการค้นหา</p>
                    {Object.values(searchCriteria).some(
                      (value) => value.trim() !== ""
                    ) && (
                      <button
                        onClick={resetSearch}
                        className={`text-blue-500 hover:text-blue-700 text-sm underline`}
                      >
                        ล้างการค้นหาเพื่อดูข้อมูลทั้งหมด
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {sortedSales.length > itemsPerPage && (
        <div className={`px-6 py-4 border-t ${getThemeClasses("cardBorder", currentTheme)}`}>
          <div className="flex items-center justify-between">
            <div className={`text-sm ${getThemeClasses("textMuted", currentTheme)}`}>
              หน้า {currentPage} จากทั้งหมด {totalPages} หน้า
            </div>
            
            <div className="flex items-center space-x-2">
              {/* ปุ่มไปหน้าแรก */}
              <button
                onClick={goToFirstPage}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg ${
                  currentPage === 1 
                    ? `${getThemeClasses("textMuted", currentTheme)} cursor-not-allowed` 
                    : `${getThemeClasses("textSecondary", currentTheme)} hover:${getThemeClasses("textPrimary", currentTheme)} hover:bg-gray-50 dark:hover:bg-gray-800`
                } ${getThemeClasses("transition", currentTheme)}`}
                title="หน้าแรก"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>
              
              {/* ปุ่มไปหน้าก่อนหน้า */}
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg ${
                  currentPage === 1 
                    ? `${getThemeClasses("textMuted", currentTheme)} cursor-not-allowed` 
                    : `${getThemeClasses("textSecondary", currentTheme)} hover:${getThemeClasses("textPrimary", currentTheme)} hover:bg-gray-50 dark:hover:bg-gray-800`
                } ${getThemeClasses("transition", currentTheme)}`}
                title="หน้าก่อนหน้า"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              {/* ปุ่มเลขหน้า */}
              <div className="flex items-center space-x-1">
                {getPageNumbers().map((page, index) => (
                  <span key={index}>
                    {page === '...' ? (
                      <span className={`px-3 py-2 text-sm ${getThemeClasses("textMuted", currentTheme)}`}>
                        ...
                      </span>
                    ) : (
                      <button
                        onClick={() => goToPage(page)}
                        className={`px-3 py-2 text-sm rounded-lg ${getThemeClasses("transition", currentTheme)} ${
                          currentPage === page
                            ? `bg-blue-600 text-white font-medium`
                            : `${getThemeClasses("textSecondary", currentTheme)} hover:${getThemeClasses("textPrimary", currentTheme)} hover:bg-gray-50 dark:hover:bg-gray-800`
                        }`}
                      >
                        {page}
                      </button>
                    )}
                  </span>
                ))}
              </div>
              
              {/* ปุ่มไปหน้าถัดไป */}
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg ${
                  currentPage === totalPages 
                    ? `${getThemeClasses("textMuted", currentTheme)} cursor-not-allowed` 
                    : `${getThemeClasses("textSecondary", currentTheme)} hover:${getThemeClasses("textPrimary", currentTheme)} hover:bg-gray-50 dark:hover:bg-gray-800`
                } ${getThemeClasses("transition", currentTheme)}`}
                title="หน้าถัดไป"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              
              {/* ปุ่มไปหน้าสุดท้าย */}
              <button
                onClick={goToLastPage}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg ${
                  currentPage === totalPages 
                    ? `${getThemeClasses("textMuted", currentTheme)} cursor-not-allowed` 
                    : `${getThemeClasses("textSecondary", currentTheme)} hover:${getThemeClasses("textPrimary", currentTheme)} hover:bg-gray-50 dark:hover:bg-gray-800`
                } ${getThemeClasses("transition", currentTheme)}`}
                title="หน้าสุดท้าย"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DataTable
