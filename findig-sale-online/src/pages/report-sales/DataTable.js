import { 
  Eye, 
  Edit,
  FileText,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Printer,
  Download
} from 'lucide-react';
import moment from 'moment';
import { useState, useEffect } from 'react';

const DataTable = ({
    getThemeClasses,
    currentTheme,
    filteredSales,
    handleReviewSale,
    handleEditSale,
    searchCriteria,
    resetSearch,
    isLoading
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

  // ฟังก์ชันสำหรับพิมพ์เอกสาร
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>รายงานการเปิดบิลด้วยมือ แยกตามสาขา</title>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Sarabun', Arial, sans-serif; margin: 20px; }
          h1 { text-align: center; margin-bottom: 20px; font-size: 18px; }
          table { width: 100%; border-collapse: collapse; font-size: 12px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f5f5f5; font-weight: bold; }
          .text-center { text-align: center; }
          .text-right { text-align: right; }
          .print-date { text-align: right; margin-bottom: 10px; font-size: 12px; }
          .status-y { background-color: #dcfce7; color: #166534; padding: 2px 8px; border-radius: 12px; }
          .status-n { background-color: #fef3c7; color: #92400e; padding: 2px 8px; border-radius: 12px; }
          .status-other { background-color: #fee2e2; color: #dc2626; padding: 2px 8px; border-radius: 12px; }
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="print-date">วันที่พิมพ์: ${new Date().toLocaleDateString('th-TH')}</div>
        <h1>รายงานการเปิดบิลด้วยมือ แยกตามสาขา</h1>
        <table>
          <thead>
            <tr>
              <th>เลขที่ใบเสร็จ</th>
              <th class="text-center">วันที่สร้างเอกสาร</th>
              <th class="text-right">จำนวนสินค้า</th>
              <th class="text-center">พนักงานทำรายการ</th>
              <th class="text-center">สาขา</th>
              <th class="text-center">สถานะ POST</th>
            </tr>
          </thead>
          <tbody>
            ${sortedSales.map(item => `
              <tr>
                <td>${item.billno || ''}</td>
                <td class="text-center">${moment(item.document_date).format('DD/MM/YYYY HH:mm:ss')}</td>
                <td class="text-right">${item.total_item || ''}</td>
                <td class="text-center">${item.emp_code || ''}</td>
                <td class="text-center">${item.branch_code || ''}</td>
                <td class="text-center">
                  <span class="${
                    item.post_status === 'Y' ? 'status-y' : 
                    item.post_status === 'N' ? 'status-n' : 'status-other'
                  }">${item.post_status || ''}</span>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div style="margin-top: 20px; text-align: center; font-size: 12px;">
          จำนวนรายการทั้งหมด: ${sortedSales.length} รายการ
        </div>
      </body>
      </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  // ฟังก์ชันสำหรับ export Excel
  const handleExportExcel = () => {
    // สร้างข้อมูล CSV
    const headers = [
      'เลขที่ใบเสร็จ', 'วันที่สร้างเอกสาร', 'จำนวนสินค้า', 'พนักงานทำรายการ', 'สาขา', 'สถานะ POST'
    ];
    
    const csvContent = [
      headers.join(','),
      ...sortedSales.map(item => [
        item.billno || '',
        moment(item.document_date).format('DD/MM/YYYY HH:mm:ss'),
        item.total_item || '',
        item.emp_code || '',
        item.branch_code || '',
        item.post_status || ''
      ].join(','))
    ].join('\n');

    // สร้างไฟล์และดาวน์โหลด
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `รายงานการเปิดบิลด้วยมือ แยกตามสาขา${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className={`text-2xl font-bold ${getThemeClasses('textPrimary', currentTheme)}`}>รายงานการเปิดบิลด้วยมือ</h1>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className={`text-lg ${getThemeClasses('textSecondary', currentTheme)}`}>กำลังโหลดข้อมูล...</p>
          </div>
        </div>
      </div>
    );
  }

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
        <div className="flex justify-between items-center">
          <div>
            <h3
              className={`text-lg font-semibold ${getThemeClasses(
                "textPrimary",
                currentTheme
              )}`}
            >
              รายงานการเปิดบิลด้วยมือ แยกตามสาขา
            </h3>
            {sortedSales.length > 0 && (
              <p className={`text-sm ${getThemeClasses("textMuted", currentTheme)} mt-2`}>
                แสดงรายการ {startIndex + 1}-{Math.min(endIndex, sortedSales.length)} จากทั้งหมด {sortedSales.length} รายการ
              </p>
            )}
          </div>
          
          {/* ปุ่มพิมพ์และ Export */}
          <div className="flex space-x-2">
            <button
              onClick={handlePrint}
              className={`flex items-center px-4 py-2 rounded-lg ${getThemeClasses(
                "cardBg",
                currentTheme
              )} border ${getThemeClasses(
                "cardBorder",
                currentTheme
              )} hover:bg-gray-50 dark:hover:bg-gray-700 ${getThemeClasses(
                "transition",
                currentTheme
              )}`}
              title="พิมพ์เอกสาร"
            >
              <Printer className="w-4 h-4 mr-2" />
              <span className={`text-sm ${getThemeClasses("textPrimary", currentTheme)}`}>
                พิมพ์
              </span>
            </button>
            
            <button
              onClick={handleExportExcel}
              className={`flex items-center px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white ${getThemeClasses(
                "transition",
                currentTheme
              )}`}
              title="Export Excel"
            >
              <Download className="w-4 h-4 mr-2" />
              <span className="text-sm">Export Excel</span>
            </button>
          </div>
        </div>
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
                onClick={() => handleSort('billno')}
              >
                <div className="flex items-center">
                  เลขที่ใบเสร็จ
                  {getSortIcon('billno')}
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
                onClick={() => handleSort('document_date')}
              >
                <div className="flex items-center justify-center">
                  วันที่สร้างเอกสาร
                  {getSortIcon('document_date')}
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
                onClick={() => handleSort('total_item')}
              >
                <div className="flex items-center">
                  จำนวนสินค้า
                  {getSortIcon('total_item')}
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
                onClick={() => handleSort('emp_code')}
              >
                <div className="flex items-center">
                  พนักงานทำรายการ
                  {getSortIcon('emp_code')}
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
                onClick={() => handleSort('branch_code')}
              >
                <div className="flex items-center">
                  สาขา
                  {getSortIcon('branch_code')}
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
              currentItems.map((draft_sale) => (
                <tr
                  key={draft_sale.billno}
                  className={getThemeClasses("tableRow", currentTheme)}
                >
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-center text-sm font-medium ${getThemeClasses(
                      "textPrimary",
                      currentTheme
                    )}`}
                  >
                    {draft_sale.billno}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-center text-sm ${getThemeClasses(
                      "textPrimary",
                      currentTheme
                    )}`}
                  >
                    {moment(draft_sale.document_date).format(
                      "DD/MM/YYYY HH:mm:ss"
                    )}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-right text-sm ${getThemeClasses(
                      "textSecondary",
                      currentTheme
                    )}`}
                  >
                    {draft_sale.total_item}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-center text-sm ${getThemeClasses(
                      "textPrimary",
                      currentTheme
                    )}`}
                  >
                    {draft_sale.emp_code}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-center text-sm ${getThemeClasses(
                      "textPrimary",
                      currentTheme
                    )}`}
                  >
                    {draft_sale.branch_code}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
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
                        ล้างการค้นหา
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
