import { useState, useEffect } from 'react';
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
  Package,
  Layers
} from 'lucide-react';
import React from 'react';

const SaleTable = ({
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
  const [expandedGroups, setExpandedGroups] = useState(new Set());
  const itemsPerPage = 10;
  
  // ฟังก์ชันจัดกลุ่มข้อมูลตามสาขา
  const groupByBranch = (sales) => {
    const grouped = sales.reduce((acc, item) => {
      const branchCode = item.Branch || 'ไม่ระบุสาขา';
      if (!acc[branchCode]) {
        acc[branchCode] = {
          branchCode: branchCode,
          items: [],
          totalItems: 0,
          totalQty: 0
        };
      }
      acc[branchCode].items.push(item);
      acc[branchCode].totalItems += 1;
      acc[branchCode].totalQty += Number(item.BQty24 || 0);
      return acc;
    }, {});
    
    return Object.values(grouped).sort((a, b) => a.branchCode.localeCompare(b.branchCode));
  };

  // ฟังก์ชันจัดกลุ่มข้อมูลตามกลุ่มสินค้าภายในสาขา
  const groupByProductGroup = (items) => {
    const grouped = items.reduce((acc, item) => {
      const groupName = item.GroupName || 'ไม่ระบุกลุ่ม';
      if (!acc[groupName]) {
        acc[groupName] = {
          groupName: groupName,
          items: [],
          totalItems: 0,
          totalQty: 0
        };
      }
      acc[groupName].items.push(item);
      acc[groupName].totalItems += 1;
      acc[groupName].totalQty += Number(item.BQty24 || 0);
      return acc;
    }, {});
    
    return Object.values(grouped).sort((a, b) => a.groupName.localeCompare(b.groupName));
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

  // ฟังก์ชันสำหรับ toggle การแสดงรายละเอียดของกลุ่มสินค้า
  const toggleGroupExpansion = (branchCode, groupName) => {
    const key = `${branchCode}-${groupName}`;
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedGroups(newExpanded);
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
    
    if (sortField === 'branchCode') {
      aValue = a.branchCode;
      bValue = b.branchCode;
    } else if (sortField === 'totalItems') {
      aValue = a.totalItems;
      bValue = b.totalItems;
    } else if (sortField === 'totalQty') {
      aValue = a.totalQty;
      bValue = b.totalQty;
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
        <title>รายงาน สต๊อกคงเหลือ</title>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Sarabun', Arial, sans-serif; margin: 20px; }
          h1 { text-align: center; margin-bottom: 20px; font-size: 18px; }
          table { width: 100%; border-collapse: collapse; font-size: 12px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f5f5f5; font-weight: bold; }
          .text-center { text-align: center; }
          .print-date { text-align: right; margin-bottom: 10px; font-size: 12px; }
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="print-date">วันที่พิมพ์: ${new Date().toLocaleDateString('th-TH')}</div>
        <h1>รายงาน สต๊อกคงเหลือ</h1>
        <table>
          <thead>
            <tr>
              <th>สาขา</th>
              <th>กลุ่มสินค้า</th>
              <th>รหัสสินค้า</th>
              <th>ชื่อสินค้า</th>
              <th class="text-center">หมวดสินค้า</th>
              <th class="text-center">คงเหลือ</th>
              <th class="text-center">คลัง</th>
            </tr>
          </thead>
          <tbody>
            ${sortedGroups.map(group => `
              <tr style="background-color: #f8fafc; font-weight: bold;">
                <td colspan="7" style="padding: 12px;">
                  สาขา: ${group.branchCode} (${group.totalItems} รายการ, รวม ${group.totalQty} ชิ้น)
                </td>
              </tr>
              ${groupByProductGroup(group.items).map(productGroup => `
                <tr style="background-color: #f1f5f9; font-weight: bold;">
                  <td colspan="7" style="padding-left: 20px;">
                    กลุ่ม: ${productGroup.groupName} (${productGroup.totalItems} รายการ, รวม ${productGroup.totalQty} ชิ้น)
                  </td>
                </tr>
                ${productGroup.items.map(item => `
                  <tr>
                    <td style="padding-left: 40px;">${item.Branch || ''}</td>
                    <td>${item.GroupName || ''}</td>
                    <td>${item.BPCode || ''}</td>
                    <td>${item.PDesc || ''}</td>
                    <td class="text-center">${item.PGroup || ''}</td>
                    <td class="text-center">${item.BQty24 || ''}</td>
                    <td class="text-center">${item.BStk || ''}</td>
                  </tr>
                `).join('')}
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
      'สาขา', 'กลุ่มสินค้า', 'รหัสสินค้า', 'ชื่อสินค้า', 'หมวดสินค้า', 'คงเหลือ', 'คลัง'
    ];
    
    const csvContent = [
      headers.join(','),
      ...sortedGroups.flatMap(group => [
        [`สาขา: ${group.branchCode}`, `${group.totalItems} รายการ`, `รวม ${group.totalQty} ชิ้น`, '', '', '', ''].join(','),
        ...groupByProductGroup(group.items).flatMap(productGroup => [
          [`  กลุ่ม: ${productGroup.groupName}`, `${productGroup.totalItems} รายการ`, `รวม ${productGroup.totalQty} ชิ้น`, '', '', '', ''].join(','),
          ...productGroup.items.map(item => [
            item.Branch || '',
            item.GroupName || '',
            item.BPCode || '',
            `"${item.PDesc || ''}"`,
            item.PGroup || '',
            item.BQty24 || '',
            item.BStk || ''
          ].join(','))
        ])
      ])
    ].join('\n');

    // สร้างไฟล์และดาวน์โหลด
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `รายงาน สต๊อกคงเหลือ_${new Date().toISOString().split('T')[0]}.csv`);
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
          <h1 className={`text-2xl font-bold ${getThemeClasses('textPrimary', currentTheme)}`}>รายงาน สต๊อกคงเหลือ</h1>
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
              รายงาน สต๊อกคงเหลือ
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
                onClick={() => handleSort('branchCode')}
              >
                <div className="flex items-center">
                  สาขา
                  {getSortIcon('branchCode')}
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
                  จำนวนรายการ
                  {getSortIcon('totalItems')}
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
                onClick={() => handleSort('totalQty')}
              >
                <div className="flex items-center justify-center">
                  รวมคงเหลือ
                  {getSortIcon('totalQty')}
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
                <React.Fragment key={branchGroup.branchCode}>
                  {/* สรุปข้อมูลแต่ละสาขา */}
                  <tr className={`${getThemeClasses("tableRow", currentTheme)} ${getThemeClasses("tableHeader", currentTheme)}`}>
                    <td
                      className={`px-6 py-4 text-sm font-semibold ${getThemeClasses(
                        "textPrimary",
                        currentTheme
                      )}`}
                    >
                      <div className="flex items-center">
                        <Package className={`w-4 h-4 mr-2 ${getThemeClasses("accent", currentTheme)}`} />
                        {branchGroup.branchCode}
                      </div>
                    </td>
                    <td
                      className={`px-6 py-4 text-center text-sm font-medium ${getThemeClasses(
                        "textPrimary",
                        currentTheme
                      )}`}
                    >
                      {branchGroup.totalItems.toLocaleString()} รายการ
                    </td>
                    <td
                      className={`px-6 py-4 text-center text-sm font-medium ${getThemeClasses(
                        "textPrimary",
                        currentTheme
                      )}`}
                    >
                      {branchGroup.totalQty.toLocaleString()} ชิ้น
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => toggleBranchExpansion(branchGroup.branchCode)}
                        className={`p-2 rounded-full ${getThemeClasses(
                          "cardBg",
                          currentTheme
                        )} border ${getThemeClasses(
                          "cardBorder",
                          currentTheme
                        )} ${getThemeClasses("hover", currentTheme)} ${getThemeClasses(
                          "transition",
                          currentTheme
                        )}`}
                        title={expandedBranches.has(branchGroup.branchCode) ? "ซ่อนรายละเอียด" : "แสดงรายละเอียด"}
                      >
                        {expandedBranches.has(branchGroup.branchCode) ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                  
                  {/* รายละเอียดกลุ่มสินค้าในแต่ละสาขา */}
                  {expandedBranches.has(branchGroup.branchCode) && (
                    <>
                      {groupByProductGroup(branchGroup.items).map((productGroup) => (
                        <React.Fragment key={`${branchGroup.branchCode}-${productGroup.groupName}`}>
                          {/* สรุปข้อมูลแต่ละกลุ่มสินค้า */}
                          <tr className={`${getThemeClasses("tableRow", currentTheme)} ${getThemeClasses("secondaryBg", currentTheme)}`}>
                            <td
                              className={`px-6 py-3 text-sm font-medium ${getThemeClasses(
                                "textPrimary",
                                currentTheme
                              )} pl-12`}
                            >
                              <div className="flex items-center">
                                <Layers className={`w-4 h-4 mr-2 ${getThemeClasses("secondary", currentTheme)}`} />
                                {productGroup.groupName}
                              </div>
                            </td>
                            <td
                              className={`px-6 py-3 text-center text-sm ${getThemeClasses(
                                "textSecondary",
                                currentTheme
                              )}`}
                            >
                              {productGroup.totalItems.toLocaleString()} รายการ
                            </td>
                            <td
                              className={`px-6 py-3 text-center text-sm ${getThemeClasses(
                                "textSecondary",
                                currentTheme
                              )}`}
                            >
                              {productGroup.totalQty.toLocaleString()} ชิ้น
                            </td>
                            <td className="px-6 py-3 text-center">
                              <button
                                onClick={() => toggleGroupExpansion(branchGroup.branchCode, productGroup.groupName)}
                                className={`p-1 rounded-full ${getThemeClasses(
                                  "cardBg",
                                  currentTheme
                                )} border ${getThemeClasses(
                                  "cardBorder",
                                  currentTheme
                                )} ${getThemeClasses("hover", currentTheme)} ${getThemeClasses(
                                  "transition",
                                  currentTheme
                                )}`}
                                title={expandedGroups.has(`${branchGroup.branchCode}-${productGroup.groupName}`) ? "ซ่อนรายละเอียด" : "แสดงรายละเอียด"}
                              >
                                {expandedGroups.has(`${branchGroup.branchCode}-${productGroup.groupName}`) ? (
                                  <ChevronUp className="w-3 h-3" />
                                ) : (
                                  <ChevronDown className="w-3 h-3" />
                                )}
                              </button>
                            </td>
                          </tr>
                          
                          {/* รายละเอียดสินค้าในแต่ละกลุ่ม */}
                          {expandedGroups.has(`${branchGroup.branchCode}-${productGroup.groupName}`) && (
                            <>
                              {/* Header สำหรับรายละเอียดสินค้า */}
                              <tr className={`${getThemeClasses("tableHeader", currentTheme)}`}>
                                <td
                                  colSpan="4"
                                  className={`px-6 py-2 text-xs font-medium ${getThemeClasses(
                                    "textMuted",
                                    currentTheme
                                  )} uppercase tracking-wider pl-16`}
                                >
                                  <div className="grid grid-cols-5 gap-4">
                                    <span>รหัสสินค้า</span>
                                    <span>ชื่อสินค้า</span>
                                    <span>หมวดสินค้า</span>
                                    <span>คงเหลือ</span>
                                    <span>คลัง</span>
                                  </div>
                                </td>
                              </tr>
                              
                              {/* รายการสินค้าในกลุ่ม */}
                              {productGroup.items.map((item, index) => (
                                <tr
                                  key={`${item.BPCode}-${index}`}
                                  className={`${getThemeClasses("tableRow", currentTheme)}`}
                                >
                                  <td
                                    colSpan="4"
                                    className={`px-6 py-2 text-sm ${getThemeClasses(
                                      "textSecondary",
                                      currentTheme
                                    )} pl-16`}
                                  >
                                    <div className="grid grid-cols-5 gap-4">
                                      <span>{item.BPCode}</span>
                                      <span className="truncate" title={item.PDesc}>{item.PDesc}</span>
                                      <span>{item.PGroup}</span>
                                      <span>{item.BQty24}</span>
                                      <span>{item.BStk}</span>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </>
                          )}
                        </React.Fragment>
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
                    : `${getThemeClasses("textSecondary", currentTheme)} hover:${getThemeClasses("textPrimary", currentTheme)} ${getThemeClasses("hover", currentTheme)}`
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
                    : `${getThemeClasses("textSecondary", currentTheme)} hover:${getThemeClasses("textPrimary", currentTheme)} ${getThemeClasses("hover", currentTheme)}`
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
                            ? `${getThemeClasses("primaryBtn", currentTheme)}`
                            : `${getThemeClasses("textSecondary", currentTheme)} hover:${getThemeClasses("textPrimary", currentTheme)} ${getThemeClasses("hover", currentTheme)}`
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
                    : `${getThemeClasses("textSecondary", currentTheme)} hover:${getThemeClasses("textPrimary", currentTheme)} ${getThemeClasses("hover", currentTheme)}`
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
                    : `${getThemeClasses("textSecondary", currentTheme)} hover:${getThemeClasses("textPrimary", currentTheme)} ${getThemeClasses("hover", currentTheme)}`
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
