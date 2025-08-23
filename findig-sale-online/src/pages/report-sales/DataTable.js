import {
  FileText,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Printer,
  Download,
  ChevronDown,
  ChevronUp,
  Package
} from 'lucide-react';
import moment from 'moment';
import React, { useState, useEffect } from 'react';

const DataTable = ({
    getThemeClasses,
    currentTheme,
    filteredSales,
    searchCriteria,
    resetSearch,
    isLoading
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [expandedBranches, setExpandedBranches] = useState(new Set());
  const itemsPerPage = 10;
  
  // ฟังก์ชันจัดกลุ่มข้อมูลตามสาขา
  const groupByBranch = (sales) => {
    const grouped = sales.reduce((acc, item) => {
      const branchCode = item.branch_code || 'ไม่ระบุสาขา';
      if (!acc[branchCode]) {
        acc[branchCode] = {
          branch_code: branchCode,
          items: [],
          totalItems: 0,
          totalBills: 0
        };
      }
      acc[branchCode].items.push(item);
      acc[branchCode].totalItems += Number(item.qty) || 0;
      acc[branchCode].totalBills += 1;
      return acc;
    }, {});
    
    return Object.values(grouped).sort((a, b) => a.branch_code.localeCompare(b.branch_code));
  };

  // ฟังก์ชันสำหรับ toggle การแสดงรายละเอียดของสาขา
  const toggleBranchExpansion = (branchCode) => {
    const newExpanded = new Set(expandedBranches);
    if (newExpanded.has(branchCode)) {
      newExpanded.delete(branchCode);
    } else {
      newExpanded.add(branchCode);
    }
    setExpandedBranches(newExpanded);
  };
  
  // ฟังก์ชันสำหรับการจัดเรียงข้อมูล
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // จัดกลุ่มข้อมูลตามสาขา
  const groupedData = groupByBranch(filteredSales);
  
  // จัดเรียงข้อมูลกลุ่มตามฟิลด์ที่เลือก
  const sortedGroups = [...groupedData].sort((a, b) => {
    if (!sortField) return 0;
    
    let aValue, bValue;
    
    if (sortField === 'branch_code') {
      aValue = a.branch_code;
      bValue = b.branch_code;
    } else if (sortField === 'totalItems') {
      aValue = a.totalItems;
      bValue = b.totalItems;
    } else if (sortField === 'totalBills') {
      aValue = a.totalBills;
      bValue = b.totalBills;
    } else {
      return 0;
    }
    
    // จัดการกับข้อมูลตัวเลข
    if (typeof aValue === 'number') {
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
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
  const totalPages = Math.ceil(sortedGroups.length / itemsPerPage);
  
  // คำนวณ index เริ่มต้นและสิ้นสุดสำหรับหน้าปัจจุบัน
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentGroups = sortedGroups.slice(startIndex, endIndex);
  
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
              <th class="text-center">วันที่ออกใบเสร็จ</th>
              <th class="text-center">เวลา</th>
              <th class="text-center">จำนวนขาย</th>
              <th>รหัสสินค้า</th>
              <th>ชื่อสินค้า</th>
              <th class="text-center">หมวดสินค้า</th>
              <th class="text-center">สาขา</th>
              <th class="text-center">พนักงาน</th>
            </tr>
          </thead>
          <tbody>
            ${sortedGroups.map(group => `
              <tr style="background-color: #f8fafc; font-weight: bold;">
                <td colspan="9" style="padding: 12px;">
                  สาขา: ${group.branch_code} (${group.totalBills} บิล, รวม ${group.totalItems} สินค้า)
                </td>
              </tr>
              ${group.items.map(item => `
                <tr>
                  <td style="padding-left: 20px;">${item.billno || ''}</td>
                  <td class="text-center">${moment(item.document_date).format('DD/MM/YYYY')}</td>
                  <td class="text-center">${moment(item.document_date).format('HH:mm:ss')}</td>
                  <td class="text-center">${item.qty || ''}</td>
                  <td>${item.barcode || ''}</td>
                  <td>${item.product_name || ''}</td>
                  <td class="text-center">${item.PGroup || ''}</td>
                  <td class="text-center">${item.branch_code || ''}</td>
                  <td class="text-center">${item.emp_code || ''}</td>
                </tr>
              `).join('')}
            `).join('')}
          </tbody>
        </table>
        <div style="margin-top: 20px; text-align: center; font-size: 12px;">
          จำนวนสาขาทั้งหมด: ${sortedGroups.length} สาขา, จำนวนรายการทั้งหมด: ${filteredSales.length} รายการ
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
      'เลขที่ใบเสร็จ', 'วันที่ออกใบเสร็จ', 'เวลา', 'จำนวนขาย', 'รหัสสินค้า', 'ชื่อสินค้า', 'หมวดสินค้า', 'สาขา', 'พนักงาน'
    ];
    
    const csvContent = [
      headers.join(','),
      ...sortedGroups.flatMap(group => [
        [`สาขา: ${group.branch_code}`, `${group.totalBills} บิล`, `รวม ${group.totalItems} สินค้า`, '', '', '', '', '', ''].join(','),
        ...group.items.map(item => [
          item.billno || '',
          moment(item.document_date).format('DD/MM/YYYY'),
          moment(item.document_date).format('HH:mm:ss'),
          item.qty || '',
          item.barcode || '',
          `"${item.product_name || ''}"`,
          item.PGroup || '',
          item.branch_code || '',
          item.emp_code || ''
        ].join(','))
      ])
    ].join('\n');

    // สร้างไฟล์และดาวน์โหลด
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `รายงานการเปิดบิลด้วยมือ แยกตามสาขา_${new Date().toISOString().split('T')[0]}.csv`);
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
            {sortedGroups.length > 0 && (
              <p className={`text-sm ${getThemeClasses("textMuted", currentTheme)} mt-2`}>
                แสดงสาขา {startIndex + 1}-{Math.min(endIndex, sortedGroups.length)} จากทั้งหมด {sortedGroups.length} สาขา ({filteredSales.length} รายการ)
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
                onClick={() => handleSort('branch_code')}
              >
                <div className="flex items-center">
                  สาขา
                  {getSortIcon('branch_code')}
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
                onClick={() => handleSort('totalBills')}
              >
                <div className="flex items-center justify-center">
                  จำนวนบิล
                  {getSortIcon('totalBills')}
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
                onClick={() => handleSort('totalItems')}
              >
                <div className="flex items-center justify-center">
                  รวมสินค้า
                  {getSortIcon('totalItems')}
                </div>
              </th>
              <th
                className={`px-6 py-3 text-center text-xs font-medium ${getThemeClasses(
                  "textMuted",
                  currentTheme
                )} uppercase tracking-wider`}
              >
                รายละเอียด
              </th>
            </tr>
          </thead>
          <tbody
            className={`${getThemeClasses(
              "cardBg",
              currentTheme
            )} divide-y ${getThemeClasses("tableBorder", currentTheme)}`}
          >
            {currentGroups.length > 0 ? (
              currentGroups.map((branchGroup) => (
                <React.Fragment key={branchGroup.branch_code}>
                  {/* สรุปข้อมูลแต่ละสาขา */}
                  <tr className={`${getThemeClasses("tableRow", currentTheme)} ${getThemeClasses("tableHeader", currentTheme)}`}>
                    <td
                      className={`px-6 py-4 text-sm font-semibold ${getThemeClasses(
                        "textPrimary",
                        currentTheme
                      )}`}
                    >
                      <div className="flex items-center">
                        <Package className="w-4 h-4 mr-2 text-blue-600" />
                        {branchGroup.branch_code}
                      </div>
                    </td>
                    <td
                      className={`px-6 py-4 text-center text-sm font-medium ${getThemeClasses(
                        "textPrimary",
                        currentTheme
                      )}`}
                    >
                      {branchGroup.totalBills.toLocaleString()} บิล
                    </td>
                    <td
                      className={`px-6 py-4 text-center text-sm font-medium ${getThemeClasses(
                        "textPrimary",
                        currentTheme
                      )}`}
                    >
                      {branchGroup.totalItems.toLocaleString()} รายการ
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => toggleBranchExpansion(branchGroup.branch_code)}
                        className={`p-2 rounded-full ${getThemeClasses(
                          "cardBg",
                          currentTheme
                        )} border ${getThemeClasses(
                          "cardBorder",
                          currentTheme
                        )} hover:bg-gray-100 dark:hover:bg-gray-700 ${getThemeClasses(
                          "transition",
                          currentTheme
                        )}`}
                        title={expandedBranches.has(branchGroup.branch_code) ? "ซ่อนรายละเอียด" : "แสดงรายละเอียด"}
                      >
                        {expandedBranches.has(branchGroup.branch_code) ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                  
                  {/* รายละเอียดสินค้าในแต่ละสาขา */}
                  {expandedBranches.has(branchGroup.branch_code) && (
                    <>
                      {/* Header สำหรับรายละเอียด */}
                      <tr className={`${getThemeClasses("tableHeader", currentTheme)}`}>
                        <td
                          className={`px-6 py-2 text-xs font-medium ${getThemeClasses(
                            "textMuted",
                            currentTheme
                          )} uppercase tracking-wider`}
                        >
                          ใบเสร็จเลขที่
                        </td>
                        <td
                          className={`px-6 py-2 text-center text-xs font-medium ${getThemeClasses(
                            "textMuted",
                            currentTheme
                          )} uppercase tracking-wider`}
                        >
                          วันที่ออกใบเสร็จ
                        </td>
                        <td
                          className={`px-6 py-2 text-center text-xs font-medium ${getThemeClasses(
                            "textMuted",
                            currentTheme
                          )} uppercase tracking-wider`}
                        >
                          เวลา
                        </td>
                        <td
                          className={`px-6 py-2 text-center text-xs font-medium ${getThemeClasses(
                            "textMuted",
                            currentTheme
                          )} uppercase tracking-wider`}
                        >
                          จำนวนขาย
                        </td>
                        <td
                          className={`px-6 py-2 text-center text-xs font-medium ${getThemeClasses(
                            "textMuted",
                            currentTheme
                          )} uppercase tracking-wider`}
                        >
                          รหัสสินค้า
                        </td>
                        <td
                          className={`px-6 py-2 text-center text-xs font-medium ${getThemeClasses(
                            "textMuted",
                            currentTheme
                          )} uppercase tracking-wider`}
                        >
                          ชื่อสินค้า
                        </td>
                        <td
                          className={`px-6 py-2 text-center text-xs font-medium ${getThemeClasses(
                            "textMuted",
                            currentTheme
                          )} uppercase tracking-wider`}
                        >
                          หมวดสินค้า
                        </td>
                        <td
                          className={`px-6 py-2 text-center text-xs font-medium ${getThemeClasses(
                            "textMuted",
                            currentTheme
                          )} uppercase tracking-wider`}
                        >
                          พนักงาน
                        </td>
                      </tr>
                      
                      {/* รายการสินค้าในสาขา */}
                      {branchGroup.items.map((item) => (
                        <tr
                          key={item.billno+item.barcode}
                          className={`${getThemeClasses("tableRow", currentTheme)}`}
                        >
                          <td
                            className={`px-6 py-3 text-sm ${getThemeClasses(
                              "textPrimary",
                              currentTheme
                            )} pl-8`}
                          >
                            {item.billno}
                          </td>
                          <td
                            className={`px-6 py-3 text-center text-sm ${getThemeClasses(
                              "textSecondary",
                              currentTheme
                            )}`}
                          >
                            {moment(item.document_date).format("DD/MM/YYYY")}
                          </td>
                          <td
                            className={`px-6 py-3 text-center text-sm ${getThemeClasses(
                              "textSecondary",
                              currentTheme
                            )}`}
                          >
                            {moment(item.document_date).format("HH:mm:ss")}
                          </td>
                          <td
                            className={`px-6 py-3 text-center text-sm ${getThemeClasses(
                              "textSecondary",
                              currentTheme
                            )}`}
                          >
                            {item.qty?.toLocaleString()}
                          </td>
                          <td
                            className={`px-6 py-3 text-sm ${getThemeClasses(
                              "textPrimary",
                              currentTheme
                            )} pl-8`}
                          >
                            {item.barcode}
                          </td>
                          <td
                            className={`px-6 py-3 text-sm ${getThemeClasses(
                              "textPrimary",
                              currentTheme
                            )} pl-8`}
                          >
                            {item.product_name}
                          </td>
                          <td
                            className={`px-6 py-3 text-center text-sm ${getThemeClasses(
                              "textSecondary",
                              currentTheme
                            )}`}
                          >
                            {item.PGroup}
                          </td>
                          <td
                            className={`px-6 py-3 text-center text-sm ${getThemeClasses(
                              "textSecondary",
                              currentTheme
                            )}`}
                          >
                            {item.emp_code}
                          </td>
                        </tr>
                      ))}
                    </>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className={`px-6 py-8 text-center text-sm ${getThemeClasses(
                    "textMuted",
                    currentTheme
                  )}`}
                >
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <FileText className="w-12 h-12 text-gray-300" />
                    <p>ไม่พบข้อมูลรายงานที่ตรงกับเงื่อนไขการค้นหา</p>
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
      {sortedGroups.length > itemsPerPage && (
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
