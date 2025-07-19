import { useState, useEffect } from 'react';
import { 
  Eye, 
  FileText,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

const SaleTable = ({
    getThemeClasses,
    currentTheme,
    filteredSales,
    handleReviewSale,
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
    if (sortField === 'document_date') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }
    
    // จัดการกับข้อมูลตัวเลข
    if (sortField === 'total_item') {
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
                onClick={() => handleSort('Branch')}
              >
                <div className="flex items-center">
                  สาขา
                  {getSortIcon('Branch')}
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
                onClick={() => handleSort('BPCode')}
              >
                <div className="flex items-center justify-center">
                  สินค้า
                  {getSortIcon('BPCode')}
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
                onClick={() => handleSort('BStk')}
              >
                <div className="flex items-center">
                  คลัง
                  {getSortIcon('BStk')}
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
                onClick={() => handleSort('BQty13')}
              >
                <div className="flex items-center">
                  M13
                  {getSortIcon('BQty13')}
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
                onClick={() => handleSort('BQty14')}
              >
                <div className="flex items-center">
                  M14
                  {getSortIcon('BQty14')}
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
                onClick={() => handleSort('BQty15')}
              >
                <div className="flex items-center">
                  M15
                  {getSortIcon('BQty15')}
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
                onClick={() => handleSort('BQty16')}
              >
                <div className="flex items-center">
                  M16
                  {getSortIcon('BQty16')}
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
                onClick={() => handleSort('BQty17')}
              >
                <div className="flex items-center">
                  M17
                  {getSortIcon('BQty17')}
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
                onClick={() => handleSort('BQty18')}
              >
                <div className="flex items-center">
                  M18
                  {getSortIcon('BQty18')}
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
                onClick={() => handleSort('BQty19')}
              >
                <div className="flex items-center">
                  M19
                  {getSortIcon('BQty19')}
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
                onClick={() => handleSort('BQty20')}
              >
                <div className="flex items-center">
                  M20
                  {getSortIcon('BQty20')}
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
                onClick={() => handleSort('BQty21')}
              >
                <div className="flex items-center">
                  M21
                  {getSortIcon('BQty21')}
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
                onClick={() => handleSort('BQty22')}
              >
                <div className="flex items-center">
                  M22
                  {getSortIcon('BQty22')}
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
                onClick={() => handleSort('BQty23')}
              >
                <div className="flex items-center">
                  M23
                  {getSortIcon('BQty23')}
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
                onClick={() => handleSort('BQty24')}
              >
                <div className="flex items-center">
                  M24
                  {getSortIcon('BQty24')}
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
                onClick={() => handleSort('SendToPOS')}
              >
                <div className="flex items-center">
                  Sync Data
                  {getSortIcon('SendToPOS')}
                </div>
              </th>
              <th
                className={`px-6 py-3 text-center text-xs font-medium ${getThemeClasses(
                  "textMuted",
                  currentTheme
                )} uppercase tracking-wider`}
              >
                จัดการ
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
              currentItems.map((draft_sale) => (
                <tr
                  key={draft_sale.BPCode}
                  className={getThemeClasses("tableRow", currentTheme)}
                >
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-left text-sm font-medium ${getThemeClasses(
                      "textPrimary",
                      currentTheme
                    )}`}
                  >
                    {draft_sale.Branch}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-center text-sm ${getThemeClasses(
                      "textPrimary",
                      currentTheme
                    )}`}
                  >
                    {draft_sale.BPCode}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-center text-sm ${getThemeClasses(
                      "textSecondary",
                      currentTheme
                    )}`}
                  >
                    {draft_sale.BStk}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-center text-sm ${getThemeClasses(
                      "textSecondary",
                      currentTheme
                    )}`}
                  >
                    {draft_sale.BQty13}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-center text-sm ${getThemeClasses(
                      "textSecondary",
                      currentTheme
                    )}`}
                  >
                    {draft_sale.BQty14}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-center text-sm ${getThemeClasses(
                      "textSecondary",
                      currentTheme
                    )}`}
                  >
                    {draft_sale.BQty15}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-center text-sm ${getThemeClasses(
                      "textSecondary",
                      currentTheme
                    )}`}
                  >
                    {draft_sale.BQty16}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-center text-sm ${getThemeClasses(
                      "textSecondary",
                      currentTheme
                    )}`}
                  >
                    {draft_sale.BQty17}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-center text-sm ${getThemeClasses(
                      "textSecondary",
                      currentTheme
                    )}`}
                  >
                    {draft_sale.BQty18}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-center text-sm ${getThemeClasses(
                      "textSecondary",
                      currentTheme
                    )}`}
                  >
                    {draft_sale.BQty19}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-center text-sm ${getThemeClasses(
                      "textSecondary",
                      currentTheme
                    )}`}
                  >
                    {draft_sale.BQty20}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-center text-sm ${getThemeClasses(
                      "textSecondary",
                      currentTheme
                    )}`}
                  >
                    {draft_sale.BQty21}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-center text-sm ${getThemeClasses(
                      "textSecondary",
                      currentTheme
                    )}`}
                  >
                    {draft_sale.BQty22}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-center text-sm ${getThemeClasses(
                      "textSecondary",
                      currentTheme
                    )}`}
                  >
                    {draft_sale.BQty23}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-center text-sm ${getThemeClasses(
                      "textSecondary",
                      currentTheme
                    )}`}
                  >
                    {draft_sale.BQty24}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-center text-sm ${getThemeClasses(
                      "textPrimary",
                      currentTheme
                    )}`}
                  >
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        draft_sale.SendToPOS === "N"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : draft_sale.SendToPOS === "Y"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {draft_sale.SendToPOS}
                    </span>
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-center text-sm font-medium`}
                  >
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => handleReviewSale(draft_sale.id)}
                        className={`p-2 rounded-lg ${getThemeClasses(
                          "textSecondary",
                          currentTheme
                        )} hover:${getThemeClasses(
                          "textPrimary",
                          currentTheme
                        )} ${getThemeClasses(
                          "transition",
                          currentTheme
                        )} hover:bg-blue-50 dark:hover:bg-blue-900`}
                        title="ดูรายละเอียด"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="17"
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

export default SaleTable
