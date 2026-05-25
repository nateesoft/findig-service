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
import moment from 'moment';
import React from 'react';
import * as XLSX from 'xlsx-js-style';

function getCurrencyFormat(value) {
  return Number(value || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

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
  const [expandedGroups, setExpandedGroups] = useState(new Set());
  const itemsPerPage = 10;
  
  // ฟังก์ชันจัดกลุ่มข้อมูลตามสาขา
  const groupByBranch = (sales) => {
    const grouped = sales.reduce((acc, item) => {
      const branchCode = item.S_Bran || 'ไม่ระบุสาขา';
      if (!acc[branchCode]) {
        acc[branchCode] = {
          branchCode: branchCode,
          items: [],
          totalItems: 0,
          totalQtyIn: 0,
          totalQtyInVal: 0,
          totalQtyOut: 0,
          totalQtyOutVal: 0,
          totalDiscount: 0,
          totalNetTotal: 0
        };
      }
      acc[branchCode].items.push(item);
      acc[branchCode].totalItems += 1;
      acc[branchCode].totalQtyIn += Number(item.S_In || 0);
      acc[branchCode].totalQtyInVal += Number(item.S_In > 0 ? item.S_InCost : 0);
      acc[branchCode].totalQtyOut += Number(item.S_Out || 0);
      acc[branchCode].totalQtyOutVal += Number(item.S_Out > 0 ? item.S_OutCost : 0);
      acc[branchCode].totalDiscount += Number(item.Discount || 0);
      acc[branchCode].totalNetTotal += Number(item.NetTotal || 0);
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
          totalQtyIn: 0,
          totalQtyInVal: 0,
          totalQtyOut: 0,
          totalQtyOutVal: 0,
          totalDiscount: 0,
          totalNetTotal: 0
        };
      }
      acc[groupName].items.push(item);
      acc[groupName].totalItems += 1;
      acc[groupName].totalQtyIn += Number(item.S_In || 0);
      acc[groupName].totalQtyInVal += Number(item.S_In > 0 ? item.S_InCost : 0);
      acc[groupName].totalQtyOut += Number(item.S_Out || 0);
      acc[groupName].totalQtyOutVal += Number(item.S_Out > 0 ? item.S_OutCost : 0);
      acc[groupName].totalDiscount += Number(item.Discount || 0);
      acc[groupName].totalNetTotal += Number(item.NetTotal || 0);
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

  // คำนวณ grand total จากข้อมูลทั้งหมด
  const grandTotals = filteredSales.reduce((acc, item) => {
    acc.totalItems += 1;
    acc.totalQtyIn += Number(item.S_In || 0);
    acc.totalQtyInVal += Number(item.S_In > 0 ? item.S_InCost : 0);
    acc.totalQtyOut += Number(item.S_Out || 0);
    acc.totalQtyOutVal += Number(item.S_Out > 0 ? item.S_OutCost : 0);
    acc.totalDiscount += Number(item.Discount || 0);
    acc.totalNetTotal += Number(item.NetTotal || 0);
    return acc;
  }, { totalItems: 0, totalQtyIn: 0, totalQtyInVal: 0, totalQtyOut: 0, totalQtyOutVal: 0, totalDiscount: 0, totalNetTotal: 0 });
  
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
    } else if (sortField === 'totalQtyIn') {
      aValue = a.totalQtyIn;
      bValue = b.totalQtyIn;
    } else if (sortField === 'totalQtyOut') {
      aValue = a.totalQtyOut;
      bValue = b.totalQtyOut;
    } else if (sortField === 'totalDiscount') {
      aValue = a.totalDiscount;
      bValue = b.totalDiscount;
    } else if (sortField === 'totalNetTotal') {
      aValue = a.totalNetTotal;
      bValue = b.totalNetTotal;
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
    const fmt = (v) => Number(v || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    let grandIn = 0, grandInVal = 0, grandOut = 0, grandOutVal = 0, grandDiscount = 0, grandNet = 0;

    const tableRows = sortedGroups.map(group => {
      let branchIn = 0, branchInVal = 0, branchOut = 0, branchOutVal = 0, branchDiscount = 0, branchNet = 0;

      const productGroupRows = groupByProductGroup(group.items).map(productGroup => {
        let pgIn = 0, pgInVal = 0, pgOut = 0, pgOutVal = 0, pgDiscount = 0, pgNet = 0;

        const itemRows = productGroup.items.map(item => {
          const inVal = Number(item.S_In > 0 ? item.S_InCost : 0);
          const outVal = Number(item.S_Out > 0 ? item.S_OutCost : 0);
          pgIn += Number(item.S_In || 0);
          pgInVal += inVal;
          pgOut += Number(item.S_Out || 0);
          pgOutVal += outVal;
          pgDiscount += Number(item.Discount || 0);
          pgNet += Number(item.NetTotal || 0);
          return `
            <tr>
              <td style="padding-left: 40px;">${item.S_Bran || ''}</td>
              <td>${item.GroupName || ''}</td>
              <td class="text-center">${moment(item.S_Date).format('DD/MM/YYYY')}</td>
              <td>${item.S_No || ''}</td>
              <td>${item.S_Rem || ''}</td>
              <td>${item.S_PCode || ''}</td>
              <td>${item.PDesc || ''}</td>
              <td class="text-right">${item.S_In || ''}</td>
              <td class="text-right">${fmt(inVal)}</td>
              <td class="text-right">${item.S_Out || ''}</td>
              <td class="text-right">${fmt(outVal)}</td>
              <td class="text-center">${item.S_Stk || ''}</td>
              <td class="text-right">${fmt(item.Discount)}</td>
              <td class="text-right">${fmt(item.NetTotal)}</td>
              <td class="text-center">${item.Refund || ''}</td>
              <td class="text-center">${item.RefNo || ''}</td>
            </tr>`;
        }).join('');

        branchIn += pgIn; branchInVal += pgInVal;
        branchOut += pgOut; branchOutVal += pgOutVal;
        branchDiscount += pgDiscount; branchNet += pgNet;

        return `
          <tr style="background-color: #f1f5f9; font-weight: bold;">
            <td colspan="2" style="padding-left: 20px;">กลุ่ม: ${productGroup.groupName} (${productGroup.totalItems} รายการ)</td>
            <td colspan="14"></td>
          </tr>
          ${itemRows}
          <tr class="group-summary">
            <td colspan="7" style="padding-left: 20px;">รวมกลุ่ม: ${productGroup.groupName}</td>
            <td class="text-right">${fmt(pgIn)}</td>
            <td class="text-right">${fmt(pgInVal)}</td>
            <td class="text-right">${fmt(pgOut)}</td>
            <td class="text-right">${fmt(pgOutVal)}</td>
            <td></td>
            <td class="text-right">${fmt(pgDiscount)}</td>
            <td class="text-right">${fmt(pgNet)}</td>
            <td colspan="2"></td>
          </tr>`;
      }).join('');

      grandIn += branchIn; grandInVal += branchInVal;
      grandOut += branchOut; grandOutVal += branchOutVal;
      grandDiscount += branchDiscount; grandNet += branchNet;

      return `
        <tr style="background-color: #f8fafc; font-weight: bold;">
          <td colspan="16" style="padding: 12px;">สาขา: ${group.branchCode} (${group.totalItems} รายการ)</td>
        </tr>
        ${productGroupRows}
        <tr class="branch-summary">
          <td colspan="7">รวมสาขา: ${group.branchCode}</td>
          <td class="text-right">${fmt(branchIn)}</td>
          <td class="text-right">${fmt(branchInVal)}</td>
          <td class="text-right">${fmt(branchOut)}</td>
          <td class="text-right">${fmt(branchOutVal)}</td>
          <td></td>
          <td class="text-right">${fmt(branchDiscount)}</td>
          <td class="text-right">${fmt(branchNet)}</td>
          <td colspan="2"></td>
        </tr>
        <tr><td colspan="16" style="border: none; padding: 4px;"></td></tr>`;
    }).join('');

    const grandTotalRow = `
      <tr class="grand-total">
        <td colspan="7">รวมทั้งหมด</td>
        <td class="text-right">${fmt(grandIn)}</td>
        <td class="text-right">${fmt(grandInVal)}</td>
        <td class="text-right">${fmt(grandOut)}</td>
        <td class="text-right">${fmt(grandOutVal)}</td>
        <td></td>
        <td class="text-right">${fmt(grandDiscount)}</td>
        <td class="text-right">${fmt(grandNet)}</td>
        <td colspan="2"></td>
      </tr>`;

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>รายงานความเคลื่อนไหวสินค้า</title>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Sarabun', Arial, sans-serif; margin: 20px; }
          h1 { text-align: center; margin-bottom: 20px; font-size: 18px; }
          table { width: 100%; border-collapse: collapse; font-size: 12px; }
          th, td { border: 1px solid #ddd; padding: 6px 8px; text-align: left; }
          th { background-color: #f5f5f5; font-weight: bold; }
          .text-center { text-align: center; }
          .text-right { text-align: right; }
          .print-date { text-align: right; margin-bottom: 10px; font-size: 12px; }
          .group-summary { background-color: #EEEEEE; font-weight: bold; }
          .branch-summary { background-color: #CCCCCC; font-weight: bold; }
          .grand-total { background-color: #999999; font-weight: bold; }
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="print-date">วันที่พิมพ์: ${new Date().toLocaleDateString('th-TH')}</div>
        <h1>รายงานความเคลื่อนไหวสินค้า</h1>
        <table>
          <thead>
            <tr>
              <th>สาขา</th>
              <th>กลุ่มสินค้า</th>
              <th class="text-center">วันที่</th>
              <th>เลขที่บิล</th>
              <th>ประเภท</th>
              <th>รหัสสินค้า</th>
              <th>ชื่อสินค้า</th>
              <th class="text-right">รับเข้า(In)</th>
              <th class="text-right">มูลค่ารับเข้า</th>
              <th class="text-right">จ่ายออก(Out)</th>
              <th class="text-right">มูลค่าจ่ายออก</th>
              <th class="text-center">คลัง</th>
              <th class="text-right">ส่วนลด</th>
              <th class="text-right">สุทธิ</th>
              <th class="text-center">ยกเลิกบิล</th>
              <th class="text-center">เลขที่ใบเสร็จ</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
            ${grandTotalRow}
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
    const worksheetData = [];
    // 'header' | 'branch' | 'group' | 'item' | 'group-summary' | 'branch-summary' | 'grand-total' | 'empty'
    const rowTypes = [];
    const COL_COUNT = 16;
    const fmt = (v) => Number(v || 0).toFixed(2);

    const emptyRow = () => Array(COL_COUNT).fill('');
    const summaryRow = (label, sIn, sInVal, sOut, sOutVal, sDiscount, sNet) => [
      label, '', '', '', '', '', '',
      sIn, fmt(sInVal), sOut, fmt(sOutVal), '',
      fmt(sDiscount), fmt(sNet), '', ''
    ];

    worksheetData.push([
      'สาขา', 'กลุ่มสินค้า', 'วันที่', 'เลขที่บิล', 'ประเภท', 'รหัสสินค้า', 'ชื่อสินค้า',
      'รับเข้า(In)', 'มูลค่ารับเข้า', 'จ่ายออก(Out)', 'มูลค่าจ่ายออก', 'คลัง', 'ส่วนลด', 'สุทธิ', 'ยกเลิกบิล', 'เลขที่ใบเสร็จ'
    ]);
    rowTypes.push('header');

    let grandIn = 0, grandInVal = 0, grandOut = 0, grandOutVal = 0, grandDiscount = 0, grandNet = 0;

    sortedGroups.forEach(group => {
      worksheetData.push([
        `สาขา: ${group.branchCode}`, `${group.totalItems} รายการ`,
        ...Array(COL_COUNT - 2).fill('')
      ]);
      rowTypes.push('branch');

      let branchIn = 0, branchInVal = 0, branchOut = 0, branchOutVal = 0, branchDiscount = 0, branchNet = 0;

      groupByProductGroup(group.items).forEach(productGroup => {
        worksheetData.push([
          `  กลุ่ม: ${productGroup.groupName}`, `${productGroup.totalItems} รายการ`,
          ...Array(COL_COUNT - 2).fill('')
        ]);
        rowTypes.push('group');

        let pgIn = 0, pgInVal = 0, pgOut = 0, pgOutVal = 0, pgDiscount = 0, pgNet = 0;

        productGroup.items.forEach(item => {
          const inVal = Number(item.S_In > 0 ? item.S_InCost : 0);
          const outVal = Number(item.S_Out > 0 ? item.S_OutCost : 0);
          worksheetData.push([
            item.S_Bran || '',
            item.GroupName || '',
            moment(item.S_Date).format('DD/MM/YYYY'),
            item.S_No || '',
            item.S_Rem || '',
            item.S_PCode || '',
            item.PDesc || '',
            Number(item.S_In || 0),
            inVal,
            Number(item.S_Out || 0),
            outVal,
            item.S_Stk || '',
            Number(item.Discount || 0),
            Number(item.NetTotal || 0),
            item.Refund || '',
            item.RefNo || ''
          ]);
          rowTypes.push('item');
          pgIn += Number(item.S_In || 0);
          pgInVal += inVal;
          pgOut += Number(item.S_Out || 0);
          pgOutVal += outVal;
          pgDiscount += Number(item.Discount || 0);
          pgNet += Number(item.NetTotal || 0);
        });

        worksheetData.push(summaryRow(
          `  รวมกลุ่ม: ${productGroup.groupName}`,
          pgIn, pgInVal, pgOut, pgOutVal, pgDiscount, pgNet
        ));
        rowTypes.push('group-summary');

        branchIn += pgIn; branchInVal += pgInVal;
        branchOut += pgOut; branchOutVal += pgOutVal;
        branchDiscount += pgDiscount; branchNet += pgNet;
      });

      worksheetData.push(summaryRow(
        `รวมสาขา: ${group.branchCode}`,
        branchIn, branchInVal, branchOut, branchOutVal, branchDiscount, branchNet
      ));
      rowTypes.push('branch-summary');
      worksheetData.push(emptyRow());
      rowTypes.push('empty');

      grandIn += branchIn; grandInVal += branchInVal;
      grandOut += branchOut; grandOutVal += branchOutVal;
      grandDiscount += branchDiscount; grandNet += branchNet;
    });

    worksheetData.push(summaryRow(
      'รวมทั้งหมด',
      grandIn, grandInVal, grandOut, grandOutVal, grandDiscount, grandNet
    ));
    rowTypes.push('grand-total');

    const ws = XLSX.utils.aoa_to_sheet(worksheetData);

    // apply background สี summary rows
    const fillColor = {
      'group-summary':  'EEEEEE',
      'branch-summary': 'CCCCCC',
      'grand-total':    '999999',
    };
    const boldTypes = new Set(['group-summary', 'branch-summary', 'grand-total']);

    rowTypes.forEach((type, r) => {
      const color = fillColor[type];
      if (!color) return;
      for (let c = 0; c < COL_COUNT; c++) {
        const cellAddr = XLSX.utils.encode_cell({ r, c });
        if (!ws[cellAddr]) ws[cellAddr] = { v: '', t: 's' };
        ws[cellAddr].s = {
          fill: { patternType: 'solid', fgColor: { rgb: color } },
          font: boldTypes.has(type) ? { bold: true } : {},
          alignment: { vertical: 'center' }
        };
      }
    });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'รายงานความเคลื่อนไหวสินค้า');
    XLSX.writeFile(wb, `รายงานความเคลื่อนไหวสินค้า_${new Date().toISOString().split('T')[0]}.xlsx`);
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
          <h1 className={`text-2xl font-bold ${getThemeClasses('textPrimary', currentTheme)}`}>รายงานความเคลื่อนไหวสินค้า</h1>
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
              รายงานความเคลื่อนไหวสินค้า
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
                style={{whiteSpace: 'nowrap'}}
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
                style={{whiteSpace: 'nowrap'}}
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
                onClick={() => handleSort('totalQtyIn')}
                style={{whiteSpace: 'nowrap'}}
              >
                <div className="flex items-center justify-center">
                  รวมรับเข้า
                  {getSortIcon('totalQtyIn')}
                </div>
              </th>
              <th
                className={`px-6 py-3 text-center text-xs font-medium ${getThemeClasses(
                  "textMuted",
                  currentTheme
                )} uppercase tracking-wider`}
                style={{whiteSpace: 'nowrap'}}
              >
                มูลค่ารับเข้า
              </th>
              <th
                className={`px-6 py-3 text-center text-xs font-medium ${getThemeClasses(
                  "textMuted",
                  currentTheme
                )} uppercase tracking-wider cursor-pointer hover:${getThemeClasses(
                  "textPrimary",
                  currentTheme
                )} ${getThemeClasses("transition", currentTheme)}`}
                onClick={() => handleSort('totalQtyOut')}
                style={{whiteSpace: 'nowrap'}}
              >
                <div className="flex items-center justify-center">
                  รวมจ่ายออก
                  {getSortIcon('totalQtyOut')}
                </div>
              </th>
              <th
                className={`px-6 py-3 text-center text-xs font-medium ${getThemeClasses(
                  "textMuted",
                  currentTheme
                )} uppercase tracking-wider`}
                style={{whiteSpace: 'nowrap'}}
              >
                มูลค่าจ่ายออก
              </th>
              <th
                className={`px-6 py-3 text-center text-xs font-medium ${getThemeClasses(
                  "textMuted",
                  currentTheme
                )} uppercase tracking-wider cursor-pointer hover:${getThemeClasses(
                  "textPrimary",
                  currentTheme
                )} ${getThemeClasses("transition", currentTheme)}`}
                onClick={() => handleSort('totalDiscount')}
                style={{whiteSpace: 'nowrap'}}
              >
                <div className="flex items-center justify-center">
                  รวมส่วนลด
                  {getSortIcon('totalDiscount')}
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
                onClick={() => handleSort('totalNetTotal')}
                style={{whiteSpace: 'nowrap'}}
              >
                <div className="flex items-center justify-center">
                  รวมสุทธิ
                  {getSortIcon('totalNetTotal')}
                </div>
              </th>
              <th
                className={`px-6 py-3 text-center text-xs font-medium ${getThemeClasses(
                  "textMuted",
                  currentTheme
                )} uppercase tracking-wider`}
                style={{whiteSpace: 'nowrap'}}
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
                      {getCurrencyFormat(branchGroup.totalQtyIn)}
                    </td>
                    <td
                      className={`px-6 py-4 text-center text-sm font-medium ${getThemeClasses(
                        "textPrimary",
                        currentTheme
                      )}`}
                    >
                      {getCurrencyFormat(branchGroup.totalQtyInVal)}
                    </td>
                    <td
                      className={`px-6 py-4 text-center text-sm font-medium ${getThemeClasses(
                        "textPrimary",
                        currentTheme
                      )}`}
                    >
                      {getCurrencyFormat(branchGroup.totalQtyOut)}
                    </td>
                    <td
                      className={`px-6 py-4 text-center text-sm font-medium ${getThemeClasses(
                        "textPrimary",
                        currentTheme
                      )}`}
                    >
                      {getCurrencyFormat(branchGroup.totalQtyOutVal)}
                    </td>
                    <td
                      className={`px-6 py-4 text-center text-sm font-medium ${getThemeClasses(
                        "textPrimary",
                        currentTheme
                      )}`}
                    >
                      {getCurrencyFormat(branchGroup.totalDiscount)}
                    </td>
                    <td
                      className={`px-6 py-4 text-center text-sm font-medium ${getThemeClasses(
                        "textPrimary",
                        currentTheme
                      )}`}
                    >
                      {getCurrencyFormat(branchGroup.totalNetTotal)}
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
                              <div className="flex items-center" style={{whiteSpace: 'nowrap'}}>
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
                              {getCurrencyFormat(productGroup.totalQtyIn)}
                            </td>
                            <td
                              className={`px-6 py-3 text-center text-sm ${getThemeClasses(
                                "textSecondary",
                                currentTheme
                              )}`}
                            >
                              {getCurrencyFormat(productGroup.totalQtyInVal)}
                            </td>
                            <td
                              className={`px-6 py-3 text-center text-sm ${getThemeClasses(
                                "textSecondary",
                                currentTheme
                              )}`}
                            >
                              {getCurrencyFormat(productGroup.totalQtyOut)}
                            </td>
                            <td
                              className={`px-6 py-3 text-center text-sm ${getThemeClasses(
                                "textSecondary",
                                currentTheme
                              )}`}
                            >
                              {getCurrencyFormat(productGroup.totalQtyOutVal)}
                            </td>
                            <td
                              className={`px-6 py-3 text-center text-sm ${getThemeClasses(
                                "textSecondary",
                                currentTheme
                              )}`}
                            >
                              {getCurrencyFormat(productGroup.totalDiscount)}
                            </td>
                            <td
                              className={`px-6 py-3 text-center text-sm ${getThemeClasses(
                                "textSecondary",
                                currentTheme
                              )}`}
                            >
                              {getCurrencyFormat(productGroup.totalNetTotal)}
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
                                <td className={`px-2 py-2 text-xs font-medium ${getThemeClasses("textMuted", currentTheme)} uppercase tracking-wider pl-16`} style={{whiteSpace: 'nowrap'}}>วันที่</td>
                                <td className={`px-2 py-2 text-xs font-medium ${getThemeClasses("textMuted", currentTheme)} uppercase tracking-wider`} style={{whiteSpace: 'nowrap'}}>เลขที่บิล</td>
                                <td className={`px-2 py-2 text-xs font-medium ${getThemeClasses("textMuted", currentTheme)} uppercase tracking-wider`} style={{whiteSpace: 'nowrap'}}>ประเภท</td>
                                <td className={`px-2 py-2 text-xs font-medium ${getThemeClasses("textMuted", currentTheme)} uppercase tracking-wider`} style={{whiteSpace: 'nowrap'}}>รหัสสินค้า</td>
                                <td className={`px-2 py-2 text-xs font-medium ${getThemeClasses("textMuted", currentTheme)} uppercase tracking-wider`} style={{whiteSpace: 'nowrap'}}>ชื่อสินค้า</td>
                                <td className={`px-2 py-2 text-xs font-medium ${getThemeClasses("textMuted", currentTheme)} uppercase tracking-wider text-right`} style={{whiteSpace: 'nowrap'}}>รับเข้า(In)</td>
                                <td className={`px-2 py-2 text-xs font-medium ${getThemeClasses("textMuted", currentTheme)} uppercase tracking-wider text-right`} style={{whiteSpace: 'nowrap'}}>มูลค่ารับเข้า</td>
                                <td className={`px-2 py-2 text-xs font-medium ${getThemeClasses("textMuted", currentTheme)} uppercase tracking-wider text-right`} style={{whiteSpace: 'nowrap'}}>จ่ายออก(Out)</td>
                                <td className={`px-2 py-2 text-xs font-medium ${getThemeClasses("textMuted", currentTheme)} uppercase tracking-wider text-right`} style={{whiteSpace: 'nowrap'}}>มูลค่าจ่ายออก</td>
                                <td className={`px-2 py-2 text-xs font-medium ${getThemeClasses("textMuted", currentTheme)} uppercase tracking-wider`} style={{whiteSpace: 'nowrap'}}>คลัง</td>
                                <td className={`px-2 py-2 text-xs font-medium ${getThemeClasses("textMuted", currentTheme)} uppercase tracking-wider text-right`} style={{whiteSpace: 'nowrap'}}>ส่วนลด</td>
                                <td className={`px-2 py-2 text-xs font-medium ${getThemeClasses("textMuted", currentTheme)} uppercase tracking-wider text-right`} style={{whiteSpace: 'nowrap'}}>สุทธิ</td>
                                <td className={`px-2 py-2 text-xs font-medium ${getThemeClasses("textMuted", currentTheme)} uppercase tracking-wider`} style={{whiteSpace: 'nowrap'}}>ยกเลิกบิล</td>
                                <td className={`px-2 py-2 text-xs font-medium ${getThemeClasses("textMuted", currentTheme)} uppercase tracking-wider`} style={{whiteSpace: 'nowrap'}}>เลขที่ใบเสร็จ</td>
                              </tr>
                              {/* รายการสินค้าในกลุ่ม */}
                              {productGroup.items.map((item, index) => (
                                <tr
                                  key={`${item.S_No}-${index}`}
                                  className={`${getThemeClasses("tableRow", currentTheme)}`}
                                >
                                  <td className={`px-2 py-2 text-sm ${getThemeClasses("textSecondary", currentTheme)} pl-16`}>{moment(item.S_Date).format("DD/MM/YYYY")}</td>
                                  <td className={`px-2 py-2 text-sm ${getThemeClasses("textSecondary", currentTheme)}`}>{item.S_No}</td>
                                  <td className={`px-2 py-2 text-sm ${getThemeClasses("textSecondary", currentTheme)}`}>{item.S_Rem}</td>
                                  <td className={`px-2 py-2 text-sm ${getThemeClasses("textSecondary", currentTheme)}`}>{item.S_PCode}</td>
                                  <td className={`px-2 py-2 text-sm ${getThemeClasses("textSecondary", currentTheme)} truncate`} title={item.PDesc}>{item.PDesc}</td>
                                  <td className={`px-2 py-2 text-sm ${getThemeClasses("textSecondary", currentTheme)} text-right`}>{item.S_In}</td>
                                  <td className={`px-2 py-2 text-sm ${getThemeClasses("textSecondary", currentTheme)} text-right`}>{Number(item.S_In>0 ? item.S_InCost : 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                  <td className={`px-2 py-2 text-sm ${getThemeClasses("textSecondary", currentTheme)} text-right`}>{item.S_Out}</td>
                                  <td className={`px-2 py-2 text-sm ${getThemeClasses("textSecondary", currentTheme)} text-right`}>{Number(item.S_Out>0 ? item.S_OutCost : 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                  <td className={`px-2 py-2 text-sm ${getThemeClasses("textSecondary", currentTheme)}`}>{item.S_Stk}</td>
                                  <td className={`px-2 py-2 text-sm ${getThemeClasses("textSecondary", currentTheme)} text-right`}>{Number(item.Discount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                  <td className={`px-2 py-2 text-sm ${getThemeClasses("textSecondary", currentTheme)} text-right`}>{Number(item.NetTotal || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                  <td className={`px-2 py-2 text-sm ${getThemeClasses("textSecondary", currentTheme)}`}>{item.Refund}</td>
                                  <td className={`px-2 py-2 text-sm ${getThemeClasses("textSecondary", currentTheme)}`}>{item.RefNo}</td>
                                </tr>
                              ))}
                              {/* รวมกลุ่ม summary row */}
                              <tr className="text-sm font-semibold" style={{ backgroundColor: '#e5e7eb', color: '#111827' }}>
                                <td className="px-2 py-2 pl-16" colSpan={5} style={{ whiteSpace: 'nowrap' }}>
                                  รวมกลุ่ม: {productGroup.groupName} ({productGroup.totalItems} รายการ)
                                </td>
                                <td className="px-2 py-2 text-right" style={{ whiteSpace: 'nowrap' }}>{getCurrencyFormat(productGroup.totalQtyIn)}</td>
                                <td className="px-2 py-2 text-right" style={{ whiteSpace: 'nowrap' }}>{getCurrencyFormat(productGroup.totalQtyInVal)}</td>
                                <td className="px-2 py-2 text-right" style={{ whiteSpace: 'nowrap' }}>{getCurrencyFormat(productGroup.totalQtyOut)}</td>
                                <td className="px-2 py-2 text-right" style={{ whiteSpace: 'nowrap' }}>{getCurrencyFormat(productGroup.totalQtyOutVal)}</td>
                                <td className="px-2 py-2"></td>
                                <td className="px-2 py-2 text-right" style={{ whiteSpace: 'nowrap' }}>{getCurrencyFormat(productGroup.totalDiscount)}</td>
                                <td className="px-2 py-2 text-right" style={{ whiteSpace: 'nowrap' }}>{getCurrencyFormat(productGroup.totalNetTotal)}</td>
                                <td className="px-2 py-2" colSpan={2}></td>
                              </tr>
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
                  colSpan="9"
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

          {/* Grand Total Summary */}
          {sortedGroups.length > 0 && (
            <tfoot>
              <tr className="font-bold text-sm" style={{ backgroundColor: '#6b7280', color: '#fff' }}>
                <td className="px-6 py-3" style={{ whiteSpace: 'nowrap' }}>
                  รวมทั้งหมด ({sortedGroups.length} สาขา)
                </td>
                <td className="px-6 py-3 text-center" style={{ whiteSpace: 'nowrap' }}>
                  {grandTotals.totalItems.toLocaleString()} รายการ
                </td>
                <td className="px-6 py-3 text-center" style={{ whiteSpace: 'nowrap' }}>
                  {getCurrencyFormat(grandTotals.totalQtyIn)}
                </td>
                <td className="px-6 py-3 text-center" style={{ whiteSpace: 'nowrap' }}>
                  {getCurrencyFormat(grandTotals.totalQtyInVal)}
                </td>
                <td className="px-6 py-3 text-center" style={{ whiteSpace: 'nowrap' }}>
                  {getCurrencyFormat(grandTotals.totalQtyOut)}
                </td>
                <td className="px-6 py-3 text-center" style={{ whiteSpace: 'nowrap' }}>
                  {getCurrencyFormat(grandTotals.totalQtyOutVal)}
                </td>
                <td className="px-6 py-3 text-center" style={{ whiteSpace: 'nowrap' }}>
                  {getCurrencyFormat(grandTotals.totalDiscount)}
                </td>
                <td className="px-6 py-3 text-center" style={{ whiteSpace: 'nowrap' }}>
                  {getCurrencyFormat(grandTotals.totalNetTotal)}
                </td>
                <td className="px-6 py-3"></td>
              </tr>
            </tfoot>
          )}
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

export default DataTable
