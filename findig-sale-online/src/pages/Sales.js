import React, { useState, useEffect, useContext } from 'react';
import { 
  Plus, 
  Eye, 
  Edit,
  X,
  Calendar,
  Upload,
  FileText,
  Trash2,
  ShoppingCart,
  Search,
  Filter,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Clock} from 'lucide-react';
  import moment from 'moment';

import { getThemeClasses } from '../utils/themes';
import { AppContext } from '../contexts';
import { createDraftSaleInfo, loadDraftSaleById, loadDraftSaleInfo, updateDraftSaleInfo } from '../api/saleApi';

const Sales = () => {
  const { appData } = useContext(AppContext)
  const { currentTheme, db, userInfo } = appData

  const [draftSale, setDraftSale] = useState([])
  const [filteredSales, setFilteredSales] = useState([])
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showSearchForm, setShowSearchForm] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', 'review'
  const [currentSaleData, setCurrentSaleData] = useState(null);
  
  // POST Process States
  const [postProgress, setPostProgress] = useState(0);
  const [postStatus, setPostStatus] = useState('idle'); // 'idle', 'processing', 'completed', 'error'
  const [processedItems, setProcessedItems] = useState([]);
  const [currentProcessingItem, setCurrentProcessingItem] = useState(null);
  
  // Search criteria state
  const [searchCriteria, setSearchCriteria] = useState({
    billNo: '',
    dateFrom: '',
    dateTo: '',
    branchCode: '',
    empCode: '',
    postStatus: ''
  });
  
  const [saleHeader, setSaleHeader] = useState({
    branchCode: '',
    billNo: '',
    empCode: userInfo.UserName,
    createDate: new Date().toISOString().split('T')[0]
  });

  const [currentItem, setCurrentItem] = useState({
    barcode: '',
    productName: '',
    stock: 'A1',
    qty: 0
  });

  const [saleItems, setSaleItems] = useState([]);

  const resetNewSaleForm = () => {
    setSaleHeader({
      branchCode: '',
      billNo: '',
      empCode: userInfo.UserName,
      createDate: new Date().toISOString().split('T')[0],
    });
    setCurrentItem({
      barcode: '',
      productName: '',
      stock: 'A1',
      qty: 0
    });
    setSaleItems([]);
    setCurrentSaleData(null);
  };

  const resetCurrentItem = () => {
    setCurrentItem({
      barcode: '',
      productName: '',
      stock: 'A1',
      qty: 0
    });
  };

  const addItemToSale = () => {
    if (!currentItem.barcode || !currentItem.productName || currentItem.qty <= 0) {
      alert('กรุณากรอกข้อมูลสินค้าให้ครบถ้วน');
      return;
    }

    const newItem = {
      id: Date.now(), // simple ID generation
      ...currentItem,
      total: currentItem.qty // คำนวณยอดรวมได้ตามต้องการ
    };

    setSaleItems(prev => [...prev, newItem]);
    console.log(saleItems)
    resetCurrentItem();
  };

  const removeItemFromSale = (itemId) => {
    setSaleItems(prev => prev.filter(item => item.id !== itemId));
  };

  const editSaleItem = (itemId) => {
    const itemToEdit = saleItems.find(item => item.id === itemId);
    if (itemToEdit) {
      setCurrentItem({
        barcode: itemToEdit.barcode,
        productName: itemToEdit.productName,
        stock: itemToEdit.stock,
        qty: itemToEdit.qty
      });
      removeItemFromSale(itemId);
    }
  };

  // ฟังก์ชันสำหรับ Review ข้อมูลการขาย
  const handleReviewSale = async (id) => {
    try {
      // สมมติว่ามี API สำหรับโหลดรายละเอียด
      const { data, error } = await loadDraftSaleById({ id });
      
      if (data) {
        setCurrentSaleData(data);
        setModalMode('review');
        setShowReviewModal(true);
      } else {
        alert(error || 'ไม่สามารถโหลดข้อมูลได้');
      }
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการโหลดข้อมูล');
      console.error('Error loading sale detail:', error);
    }
  };

  // ฟังก์ชันสำหรับ Edit ข้อมูลการขาย
  const handleEditSale = async (id) => {
    try {
      const { data, error } = await loadDraftSaleById({ id });
      
      if (data) {
        // โหลดข้อมูลลงในฟอร์ม
        setSaleHeader({
          branchCode: data.branchCode || '',
          billNo: data.billNo || '',
          empCode: data.empCode || '',
          createDate: data.createDate || new Date().toISOString().split('T')[0]
        });
        
        // โหลดรายการสินค้า
        setSaleItems(data.items || []);
        setCurrentSaleData(data);
        setModalMode('edit');
        setShowSaleModal(true);
      } else {
        alert(error || 'ไม่สามารถโหลดข้อมูลได้');
      }
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการโหลดข้อมูล');
      console.error('Error loading sale for edit:', error);
    }
  };

  const handleNewSaleSubmit = async () => {
    if (!saleHeader.billNo) {
      alert('กรุณาระบุข้อมูลเลขที่ใบเสร็จ');
      return;
    }

    if (saleItems.length === 0) {
      alert('กรุณาเพิ่มรายการสินค้าอย่างน้อย 1 รายการ');
      return;
    }

    const totalQty = saleItems.reduce((sum, item) => sum + item.qty, 0);

    try {
      let result;
      
      if (modalMode === 'edit') {
        // อัปเดตข้อมูลที่มีอยู่
        result = await updateDraftSaleInfo({
          branchCode: saleHeader.branchCode, 
          billNo: saleHeader.billNo, 
          empCode: saleHeader.empCode, 
          totalItem: totalQty,
          saleItems
        });
      } else {
        // สร้างใหม่
        result = await createDraftSaleInfo({
          branchCode: saleHeader.branchCode, 
          billNo: saleHeader.billNo, 
          empCode: saleHeader.empCode, 
          totalItem: totalQty,
          saleItems
        });
      }

      const { data, error } = result;

      if(data) {
        const actionText = modalMode === 'edit' ? 'อัปเดต' : 'บันทึก';
        alert(`${actionText}ใบขายเรียบร้อย!\n` +
              `เลขที่: ${saleHeader.billNo}\n` +
              `วันที่: ${saleHeader.createDate}\n` +
              `สาขาทำรายการ: ${saleHeader.branchCode}\n` +
              `จำนวนรายการ: ${saleItems.length} รายการ\n` +
              `จำนวนสินค้ารวม: ${totalQty} ชิ้น`);
        initLoadData();
      } else {
        alert(error);
      }
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      console.error('Error saving sale:', error);
    }
    
    setShowSaleModal(false);
    resetNewSaleForm();
  };

  const initLoadData = async () => {
    const { data, error } = await loadDraftSaleInfo({
      branchCode: db
    })

    if(data) {
      setDraftSale(data)
    }else {
      alert(error);
    }
  }

  const handleCreateNew = () => {
    resetNewSaleForm();
    setModalMode('create');
    setShowSaleModal(true);
  };
  
  // ฟังก์ชันสำหรับเปิด POST Modal
  const handlePostStock = () => {
    const tempSales = filteredSales.filter(sale => sale.post_status === 'N' || sale.post_status === 'D');
    
    if (tempSales.length === 0) {
      alert('ไม่มีรายการที่สามารถ POST ได้');
      return;
    }
    
    // Reset state
    setPostProgress(0);
    setPostStatus('idle');
    setProcessedItems([]);
    setCurrentProcessingItem(null);
    setShowPostModal(true);
  };

  // ฟังก์ชันจำลองการ POST แต่ละรายการ
  const processPostItem = async (item, index, total) => {
    setCurrentProcessingItem(item);
    
    // จำลองการประมวลผล
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // จำลองผลลัพธ์ (90% สำเร็จ, 10% ผิดพลาด)
    const isSuccess = Math.random() > 0.1;
    
    const result = {
      ...item,
      processed: true,
      success: isSuccess,
      message: isSuccess ? 'POST สำเร็จ' : 'เกิดข้อผิดพลาด: ไม่สามารถตัดสต๊อกได้',
      processedAt: new Date().toISOString()
    };
    
    setProcessedItems(prev => [...prev, result]);
    setPostProgress(((index + 1) / total) * 100);
    
    return result;
  };

  // ฟังก์ชันหลักสำหรับ POST Process
  const handleConfirmPost = async () => {
    const tempSales = filteredSales.filter(sale => sale.post_status === 'N' || sale.post_status === 'D');
    
    setPostStatus('processing');
    setPostProgress(0);
    setProcessedItems([]);
    
    try {
      const results = [];
      
      for (let i = 0; i < tempSales.length; i++) {
        const result = await processPostItem(tempSales[i], i, tempSales.length);
        results.push(result);
      }
      
      setCurrentProcessingItem(null);
      setPostStatus('completed');
      
      // รีโหลดข้อมูลหลังจาก POST เสร็จ
      setTimeout(() => {
        initLoadData();
      }, 1000);
      
    } catch (error) {
      setPostStatus('error');
      console.error('Error during POST process:', error);
    }
  };

  // ฟังก์ชันการค้นหา
  const handleSearch = () => {
    let filtered = [...draftSale];

    // ค้นหาตามเลขที่ใบเสร็จ
    if (searchCriteria.billNo.trim()) {
      filtered = filtered.filter(item => 
        item.billno.toLowerCase().includes(searchCriteria.billNo.toLowerCase())
      );
    }

    // ค้นหาตามช่วงวันที่
    if (searchCriteria.dateFrom) {
      filtered = filtered.filter(item => 
        new Date(item.document_date) >= new Date(searchCriteria.dateFrom)
      );
    }

    if (searchCriteria.dateTo) {
      filtered = filtered.filter(item => 
        new Date(item.document_date) <= new Date(searchCriteria.dateTo)
      );
    }

    // ค้นหาตามสาขา
    if (searchCriteria.branchCode) {
      filtered = filtered.filter(item => 
        item.branch_code === searchCriteria.branchCode
      );
    }

    // ค้นหาตามพนักงาน
    if (searchCriteria.empCode.trim()) {
      filtered = filtered.filter(item => 
        item.emp_code.toLowerCase().includes(searchCriteria.empCode.toLowerCase())
      );
    }

    // ค้นหาตามสถานะ POST
    if (searchCriteria.postStatus) {
      filtered = filtered.filter(item => 
        item.post_status === searchCriteria.postStatus
      );
    }

    setFilteredSales(filtered);
  };

  // ล้างการค้นหา
  const resetSearch = () => {
    setSearchCriteria({
      billNo: '',
      dateFrom: '',
      dateTo: '',
      branchCode: '',
      empCode: '',
      postStatus: ''
    });
    setFilteredSales(draftSale);
  };

  // อัปเดต filteredSales เมื่อ draftSale เปลี่ยน
  useEffect(() => {
    setFilteredSales(draftSale);
  }, [draftSale]);

  useEffect(() => {
    initLoadData()
  }, [])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showSaleModal || showReviewModal || showPostModal) {
        if (e.key === 'Escape') {
          setShowSaleModal(false);
          setShowReviewModal(false);
          setShowPostModal(false);
        } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
          if (showSaleModal && currentItem.barcode && currentItem.productName && currentItem.qty > 0) {
            addItemToSale();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showSaleModal, showReviewModal, showPostModal, currentItem]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className={`text-2xl font-bold ${getThemeClasses('textPrimary', currentTheme)}`}>เมนูบันทึกการขาย</h1>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button 
            onClick={() => setShowSearchForm(!showSearchForm)}
            className={`text-white px-4 py-2 rounded-lg font-medium bg-gray-500 hover:bg-gray-600 hover:shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out flex items-center`}
          >
            <Search className="w-4 h-4 mr-2" />
            {showSearchForm ? 'ซ่อนการค้นหา' : 'ค้นหา'}
          </button>
          <button 
            onClick={handlePostStock}
            className={`text-white px-4 py-2 rounded-lg font-medium bg-green-500 hover:bg-green-600 hover:shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out flex items-center`}>
            <Upload className="w-4 h-4 mr-2" />
            POST ตัดสต๊อก
          </button>
          <button 
            onClick={handleCreateNew}
            className={`text-white px-4 py-2 rounded-lg font-medium ${getThemeClasses('primaryBtn', currentTheme)} ${getThemeClasses('transition', currentTheme)} flex items-center`}>
            <Plus className="w-4 h-4 mr-2" />
            เพิ่มข้อมูล
          </button>
        </div>
      </div>

      {/* Search Form */}
      {showSearchForm && (
        <div className={`${getThemeClasses('cardBg', currentTheme)} rounded-lg shadow-sm border ${getThemeClasses('cardBorder', currentTheme)} animate-fade-in`}>
          <div className={`p-6 border-b ${getThemeClasses('cardBorder', currentTheme)}`}>
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 bg-gradient-to-r from-gray-500 to-gray-600 rounded-lg flex items-center justify-center`}>
                <Filter className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className={`text-lg font-semibold ${getThemeClasses('textPrimary', currentTheme)}`}>ค้นหาข้อมูลการขาย</h3>
                <p className={`text-sm ${getThemeClasses('textSecondary', currentTheme)}`}>
                  กรอกเงื่อนไขที่ต้องการค้นหา
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <div>
                <label className={`block text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)} mb-2`}>
                  <FileText className="w-4 h-4 inline mr-2" />
                  เลขที่ใบเสร็จ
                </label>
                <input
                  type="text"
                  value={searchCriteria.billNo}
                  onChange={(e) => setSearchCriteria({...searchCriteria, billNo: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg ${getThemeClasses('input', currentTheme)}`}
                  placeholder="ค้นหาเลขที่ใบเสร็จ"
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)} mb-2`}>
                  <Calendar className="w-4 h-4 inline mr-2" />
                  วันที่เริ่มต้น
                </label>
                <input
                  type="date"
                  value={searchCriteria.dateFrom}
                  onChange={(e) => setSearchCriteria({...searchCriteria, dateFrom: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg ${getThemeClasses('input', currentTheme)}`}
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)} mb-2`}>
                  <Calendar className="w-4 h-4 inline mr-2" />
                  วันที่สิ้นสุด
                </label>
                <input
                  type="date"
                  value={searchCriteria.dateTo}
                  onChange={(e) => setSearchCriteria({...searchCriteria, dateTo: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg ${getThemeClasses('input', currentTheme)}`}
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)} mb-2`}>
                  รหัสสาขา
                </label>
                <select
                  value={searchCriteria.branchCode}
                  onChange={(e) => setSearchCriteria({...searchCriteria, branchCode: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg ${getThemeClasses('input', currentTheme)}`}
                >
                  <option value="">ทุกสาขา</option>
                  <option value="001">001 - สำนักงานใหญ่ ICS</option>
                  <option value="002">002 - สาขาทดสอบระบบ</option>
                </select>
              </div>
              
              <div>
                <label className={`block text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)} mb-2`}>
                  รหัสพนักงาน
                </label>
                <input
                  type="text"
                  value={searchCriteria.empCode}
                  onChange={(e) => setSearchCriteria({...searchCriteria, empCode: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg ${getThemeClasses('input', currentTheme)}`}
                  placeholder="ค้นหารหัสพนักงาน"
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)} mb-2`}>
                  สถานะ POST
                </label>
                <select
                  value={searchCriteria.postStatus}
                  onChange={(e) => setSearchCriteria({...searchCriteria, postStatus: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg ${getThemeClasses('input', currentTheme)}`}
                >
                  <option value="">ทุกสถานะ</option>
                  <option value="N">TEMP</option>
                  <option value="Y">POSTED</option>
                  <option value="C">CANCELLED</option>
                </select>
              </div>
            </div>
            
            {/* Search Actions */}
            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className={`text-sm ${getThemeClasses('textMuted', currentTheme)} flex items-center`}>
                พบข้อมูล {filteredSales.length} รายการ จากทั้งหมด {draftSale.length} รายการ
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={resetSearch}
                  className={`px-4 py-2 border rounded-lg font-medium ${getThemeClasses('secondaryBtn', currentTheme)} ${getThemeClasses('transition', currentTheme)} hover:shadow-md flex items-center`}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  ล้างการค้นหา
                </button>
                <button
                  onClick={handleSearch}
                  className={`px-4 py-2 text-white rounded-lg font-medium bg-blue-500 hover:bg-blue-600 ${getThemeClasses('transition', currentTheme)} hover:shadow-lg flex items-center`}
                >
                  <Search className="w-4 h-4 mr-2" />
                  ค้นหา
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={`${getThemeClasses('cardBg', currentTheme)} rounded-lg shadow-sm border ${getThemeClasses('cardBorder', currentTheme)}`}>
        <div className={`p-6 border-b ${getThemeClasses('cardBorder', currentTheme)}`}>
          <h3 className={`text-lg font-semibold ${getThemeClasses('textPrimary', currentTheme)}`}>ข้อมูลบันทึกข้อมูลการขาย</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={getThemeClasses('tableHeader', currentTheme)}>
              <tr>
                <th className={`px-6 py-3 text-left text-xs font-medium ${getThemeClasses('textMuted', currentTheme)} uppercase tracking-wider`}>
                  เลขที่ใบเสร็จ
                </th>
                <th className={`px-6 py-3 text-center text-xs font-medium ${getThemeClasses('textMuted', currentTheme)} uppercase tracking-wider`}>
                  วันที่สร้างเอกสาร
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${getThemeClasses('textMuted', currentTheme)} uppercase tracking-wider`}>
                  จำนวนสินค้า
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${getThemeClasses('textMuted', currentTheme)} uppercase tracking-wider`}>
                  พนักงานทำรายการ
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${getThemeClasses('textMuted', currentTheme)} uppercase tracking-wider`}>
                  สาขา
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${getThemeClasses('textMuted', currentTheme)} uppercase tracking-wider`}>
                  สถานะ POST
                </th>
                <th className={`px-6 py-3 text-center text-xs font-medium ${getThemeClasses('textMuted', currentTheme)} uppercase tracking-wider`}>
                  จัดการ
                </th>
              </tr>
            </thead>
            <tbody className={`${getThemeClasses('cardBg', currentTheme)} divide-y ${getThemeClasses('tableBorder', currentTheme)}`}>
              {filteredSales.length > 0 ? (
                filteredSales.map((draft_sale) => (
                  <tr key={draft_sale.billno} className={getThemeClasses('tableRow', currentTheme)}>
                    <td className={`px-6 py-4 whitespace-nowrap text-center text-sm font-medium ${getThemeClasses('textPrimary', currentTheme)}`}>
                      {draft_sale.billno}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-center text-sm ${getThemeClasses('textPrimary', currentTheme)}`}>
                      {moment(draft_sale.document_date).format('DD/MM/YYYY HH:mm:ss')}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-right text-sm ${getThemeClasses('textSecondary', currentTheme)}`}>
                      {draft_sale.total_item}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-center text-sm ${getThemeClasses('textPrimary', currentTheme)}`}>
                      {draft_sale.emp_code}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-center text-sm ${getThemeClasses('textPrimary', currentTheme)}`}>
                      {draft_sale.branch_code}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-center text-sm ${getThemeClasses('textPrimary', currentTheme)}`}>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        draft_sale.post_status === 'P' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : draft_sale.post_status === 'D'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {draft_sale.post_status}
                      </span>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-center text-sm font-medium`}>
                      <div className="flex justify-center space-x-2">
                        <button 
                          onClick={() => handleReviewSale(draft_sale.id)}
                          className={`p-2 rounded-lg ${getThemeClasses('textSecondary', currentTheme)} hover:${getThemeClasses('textPrimary', currentTheme)} ${getThemeClasses('transition', currentTheme)} hover:bg-blue-50 dark:hover:bg-blue-900`}
                          title="ดูรายละเอียด"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleEditSale(draft_sale.id)}
                          className={`p-2 rounded-lg ${getThemeClasses('textMuted', currentTheme)} hover:${getThemeClasses('textSecondary', currentTheme)} ${getThemeClasses('transition', currentTheme)} hover:bg-yellow-50 dark:hover:bg-yellow-900`}
                          title="แก้ไข"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className={`px-6 py-8 text-center text-sm ${getThemeClasses('textMuted', currentTheme)}`}>
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <FileText className="w-12 h-12 text-gray-300" />
                      <p>ไม่พบข้อมูลการขายที่ตรงกับเงื่อนไขการค้นหา</p>
                      {Object.values(searchCriteria).some(value => value.trim() !== '') && (
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
      </div>

      {/* POST Modal */}
      {showPostModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div 
            className={`${getThemeClasses('cardBg', currentTheme)} rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto ${getThemeClasses('transition', currentTheme)} transform animate-scale-in`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* POST Modal Header */}
            <div className={`sticky top-0 ${getThemeClasses('cardBg', currentTheme)} p-6 border-b ${getThemeClasses('cardBorder', currentTheme)} rounded-t-xl`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center`}>
                    <Upload className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold ${getThemeClasses('textPrimary', currentTheme)}`}>
                      POST ตัดสต๊อก
                    </h3>
                    <p className={`text-sm ${getThemeClasses('textSecondary', currentTheme)}`}>
                      ประมวลผลรายการขายและตัดสต๊อกสินค้า
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPostModal(false)}
                  disabled={postStatus === 'processing'}
                  className={`p-2 rounded-lg ${getThemeClasses('sidebarHover', currentTheme)} ${getThemeClasses('transition', currentTheme)} ${getThemeClasses('textMuted', currentTheme)} hover:${getThemeClasses('textSecondary', currentTheme)} disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Current Date */}
              <div className={`p-4 rounded-lg ${currentTheme === 'dark' ? 'bg-green-900 bg-opacity-20' : 'bg-green-50'} border ${currentTheme === 'dark' ? 'border-green-700' : 'border-green-200'}`}>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-6 h-6 text-green-600" />
                  <div>
                    <h4 className={`text-lg font-semibold ${getThemeClasses('textPrimary', currentTheme)}`}>
                      วันที่ประมวลผล
                    </h4>
                    <p className={`text-sm ${getThemeClasses('textSecondary', currentTheme)}`}>
                      {moment().format('วันddddที่ D MMMM YYYY เวลา HH:mm:ss')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Summary Information */}
              {postStatus === 'idle' && (
                <div className={`p-4 rounded-lg ${getThemeClasses('cardBg', currentTheme)} border ${getThemeClasses('cardBorder', currentTheme)}`}>
                  <h4 className={`text-lg font-semibold mb-4 ${getThemeClasses('textPrimary', currentTheme)}`}>
                    ข้อมูลที่จะดำเนินการ
                  </h4>
                  
                  {(() => {
                    const tempSales = filteredSales.filter(sale => sale.post_status === 'N' || sale.post_status === 'D');
                    const totalItems = tempSales.reduce((sum, sale) => sum + (sale.total_item || 0), 0);
                    
                    return (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="text-center p-4 rounded-lg border-2 border-blue-200 dark:border-blue-700">
                          <div className="text-2xl font-bold text-blue-600">{tempSales.length}</div>
                          <div className={`text-sm ${getThemeClasses('textSecondary', currentTheme)}`}>รายการขาย</div>
                        </div>
                        <div className="text-center p-4 rounded-lg border-2 border-green-200 dark:border-green-700">
                          <div className="text-2xl font-bold text-green-600">{totalItems}</div>
                          <div className={`text-sm ${getThemeClasses('textSecondary', currentTheme)}`}>รายการสินค้า</div>
                        </div>
                        <div className="text-center p-4 rounded-lg border-2 border-purple-200 dark:border-purple-700">
                          <div className="text-2xl font-bold text-purple-600">{tempSales.length > 0 ? tempSales[0].branch_code || 'หลายสาขา' : '-'}</div>
                          <div className={`text-sm ${getThemeClasses('textSecondary', currentTheme)}`}>สาขา</div>
                        </div>
                      </div>
                    );
                  })()}

                  <div className={`p-3 rounded-lg ${currentTheme === 'dark' ? 'bg-yellow-900 bg-opacity-20' : 'bg-yellow-50'} border-l-4 border-yellow-400`}>
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <p className={`text-sm font-medium ${getThemeClasses('textPrimary', currentTheme)}`}>
                          คำเตือน
                        </p>
                        <p className={`text-sm ${getThemeClasses('textSecondary', currentTheme)}`}>
                          การ POST จะตัดสต๊อกสินค้าและไม่สามารถยกเลิกได้ กรุณาตรวจสอบข้อมูลให้ถูกต้องก่อนดำเนินการ
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Processing Section */}
              {postStatus === 'processing' && (
                <div className={`p-4 rounded-lg ${getThemeClasses('cardBg', currentTheme)} border ${getThemeClasses('cardBorder', currentTheme)}`}>
                  <h4 className={`text-lg font-semibold mb-4 ${getThemeClasses('textPrimary', currentTheme)} flex items-center`}>
                    <Clock className="w-5 h-5 mr-2 animate-spin" />
                    กำลังประมวลผล...
                  </h4>
                  
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className={getThemeClasses('textSecondary', currentTheme)}>ความคืบหน้า</span>
                      <span className={getThemeClasses('textSecondary', currentTheme)}>{Math.round(postProgress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${postProgress}%` }}
                      />
                    </div>
                  </div>

                  {/* Current Processing Item */}
                  {currentProcessingItem && (
                    <div className={`p-3 rounded-lg ${currentTheme === 'dark' ? 'bg-blue-900 bg-opacity-20' : 'bg-blue-50'} border ${currentTheme === 'dark' ? 'border-blue-700' : 'border-blue-200'}`}>
                      <div className="flex items-center space-x-3">
                        <div className="animate-pulse">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        </div>
                        <div>
                          <p className={`text-sm font-medium ${getThemeClasses('textPrimary', currentTheme)}`}>
                            กำลังประมวลผล: {currentProcessingItem.billno}
                          </p>
                          <p className={`text-xs ${getThemeClasses('textSecondary', currentTheme)}`}>
                            {currentProcessingItem.total_item} รายการสินค้า
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Processed Items List */}
                  {processedItems.length > 0 && (
                    <div className="mt-4 max-h-60 overflow-y-auto">
                      <h5 className={`text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)} mb-2`}>
                        รายการที่ประมวลผลแล้ว
                      </h5>
                      <div className="space-y-2">
                        {processedItems.map((item, index) => (
                          <div key={index} className={`p-2 rounded-lg ${item.success ? 'bg-green-50 dark:bg-green-900 dark:bg-opacity-20' : 'bg-red-50 dark:bg-red-900 dark:bg-opacity-20'} border ${item.success ? 'border-green-200 dark:border-green-700' : 'border-red-200 dark:border-red-700'}`}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                {item.success ? (
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                ) : (
                                  <X className="w-4 h-4 text-red-600" />
                                )}
                                <span className={`text-sm font-medium ${getThemeClasses('textPrimary', currentTheme)}`}>
                                  {item.billno}
                                </span>
                              </div>
                              <span className={`text-xs ${item.success ? 'text-green-600' : 'text-red-600'}`}>
                                {item.message}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Completed Section */}
              {postStatus === 'completed' && (
                <div className={`p-4 rounded-lg ${getThemeClasses('cardBg', currentTheme)} border ${getThemeClasses('cardBorder', currentTheme)}`}>
                  <div className="text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h4 className={`text-lg font-semibold ${getThemeClasses('textPrimary', currentTheme)} mb-2`}>
                      การ POST เสร็จสิ้น
                    </h4>
                    <p className={`text-sm ${getThemeClasses('textSecondary', currentTheme)} mb-4`}>
                      ประมวลผลเสร็จเรียบร้อยแล้ว เวลา {moment().format('HH:mm:ss')}
                    </p>

                    {/* Results Summary */}
                    {(() => {
                      const successCount = processedItems.filter(item => item.success).length;
                      const errorCount = processedItems.filter(item => !item.success).length;
                      
                      return (
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div className="text-center p-4 rounded-lg border-2 border-blue-200 dark:border-blue-700">
                            <div className="text-lg font-bold text-green-600">{successCount}</div>
                            <div className={`text-xs ${getThemeClasses('textSecondary', currentTheme)}`}>สำเร็จ</div>
                          </div>
                          <div className="text-center p-4 rounded-lg border-2 border-blue-200 dark:border-blue-700">
                            <div className="text-lg font-bold text-red-600">{errorCount}</div>
                            <div className={`text-xs ${getThemeClasses('textSecondary', currentTheme)}`}>ผิดพลาด</div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}

              {/* Error Section */}
              {postStatus === 'error' && (
                <div className={`p-4 rounded-lg ${getThemeClasses('cardBg', currentTheme)} border border-red-200 dark:border-red-700`}>
                  <div className="text-center">
                    <X className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h4 className={`text-lg font-semibold ${getThemeClasses('textPrimary', currentTheme)} mb-2`}>
                      เกิดข้อผิดพลาด
                    </h4>
                    <p className={`text-sm ${getThemeClasses('textSecondary', currentTheme)}`}>
                      ไม่สามารถประมวลผลได้ กรุณาลองใหม่อีกครั้ง
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className={`sticky bottom-0 ${getThemeClasses('cardBg', currentTheme)} p-6 border-t ${getThemeClasses('cardBorder', currentTheme)} rounded-b-xl`}>
              <div className="flex justify-end space-x-3">
                {postStatus === 'idle' && (
                  <>
                    <button
                      onClick={() => setShowPostModal(false)}
                      className={`px-6 py-2 border rounded-lg font-medium ${getThemeClasses('secondaryBtn', currentTheme)} ${getThemeClasses('transition', currentTheme)} hover:shadow-md flex items-center`}
                    >
                      <X className="w-4 h-4 mr-2" />
                      ยกเลิก
                    </button>
                    <button
                      onClick={handleConfirmPost}
                      disabled={filteredSales.filter(sale => sale.post_status === 'N' || sale.post_status === 'D').length === 0}
                      className={`px-6 py-2 text-white rounded-lg font-medium bg-green-500 hover:bg-green-600 ${getThemeClasses('transition', currentTheme)} hover:shadow-lg flex items-center disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      เริ่มการ POST
                    </button>
                  </>
                )}
                
                {postStatus === 'processing' && (
                  <button
                    disabled
                    className={`px-6 py-2 text-white rounded-lg font-medium bg-blue-500 opacity-50 cursor-not-allowed flex items-center`}
                  >
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    กำลังประมวลผล...
                  </button>
                )}
                
                {(postStatus === 'completed' || postStatus === 'error') && (
                  <button
                    onClick={() => setShowPostModal(false)}
                    className={`px-6 py-2 border rounded-lg font-medium ${getThemeClasses('secondaryBtn', currentTheme)} ${getThemeClasses('transition', currentTheme)} hover:shadow-md flex items-center`}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    ปิด
                  </button>
                )}
              </div>
            </div>
          </div>

          <div 
            className="absolute inset-0 -z-10"
            onClick={() => postStatus !== 'processing' && setShowPostModal(false)}
          />
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && currentSaleData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div 
            className={`${getThemeClasses('cardBg', currentTheme)} rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto ${getThemeClasses('transition', currentTheme)} transform animate-scale-in`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Review Modal Header */}
            <div className={`sticky top-0 ${getThemeClasses('cardBg', currentTheme)} p-6 border-b ${getThemeClasses('cardBorder', currentTheme)} rounded-t-xl`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center`}>
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold ${getThemeClasses('textPrimary', currentTheme)}`}>
                      รายละเอียดการขาย
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className={`p-2 rounded-lg ${getThemeClasses('sidebarHover', currentTheme)} ${getThemeClasses('transition', currentTheme)} ${getThemeClasses('textMuted', currentTheme)} hover:${getThemeClasses('textSecondary', currentTheme)}`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* ข้อมูลหัวเอกสาร */}
              <div className={`p-4 rounded-lg ${currentTheme === 'dark' ? 'bg-blue-900 bg-opacity-20' : 'bg-blue-50'} border ${currentTheme === 'dark' ? 'border-blue-700' : 'border-blue-200'}`}>
                <h4 className={`text-lg font-semibold mb-4 ${getThemeClasses('textPrimary', currentTheme)}`}>
                  ข้อมูลหัวเอกสาร
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className={`block text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)} mb-1`}>
                      เลขที่ใบเสร็จ
                    </label>
                    <p className={`text-sm ${getThemeClasses('textPrimary', currentTheme)} font-medium`}>
                      {currentSaleData.billNo}
                    </p>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)} mb-1`}>
                      วันที่สร้างเอกสาร
                    </label>
                    <p className={`text-sm ${getThemeClasses('textPrimary', currentTheme)} font-medium`}>
                      {moment(currentSaleData.documentDate).format('DD/MM/YYYY HH:mm:ss')}
                    </p>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)} mb-1`}>
                      สาขา
                    </label>
                    <p className={`text-sm ${getThemeClasses('textPrimary', currentTheme)} font-medium`}>
                      {currentSaleData.branchCode}
                    </p>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)} mb-1`}>
                      พนักงาน
                    </label>
                    <p className={`text-sm ${getThemeClasses('textPrimary', currentTheme)} font-medium`}>
                      {currentSaleData.empCode}
                    </p>
                  </div>
                </div>
              </div>

              {/* รายการสินค้า */}
              <div className={`p-4 rounded-lg ${getThemeClasses('cardBg', currentTheme)} border ${getThemeClasses('cardBorder', currentTheme)}`}>
                <h4 className={`text-lg font-semibold mb-4 ${getThemeClasses('textPrimary', currentTheme)} flex items-center`}>
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  รายการสินค้า ({currentSaleData.items?.length || 0} รายการ)
                </h4>
                
                {currentSaleData.items && currentSaleData.items.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className={getThemeClasses('tableHeader', currentTheme)}>
                        <tr>
                          <th className={`px-4 py-2 text-left text-xs font-medium ${getThemeClasses('textMuted', currentTheme)} uppercase tracking-wider`}>
                            รหัสบาร์โค้ด
                          </th>
                          <th className={`px-4 py-2 text-left text-xs font-medium ${getThemeClasses('textMuted', currentTheme)} uppercase tracking-wider`}>
                            ชื่อสินค้า
                          </th>
                          <th className={`px-4 py-2 text-center text-xs font-medium ${getThemeClasses('textMuted', currentTheme)} uppercase tracking-wider`}>
                            คลัง
                          </th>
                          <th className={`px-4 py-2 text-right text-xs font-medium ${getThemeClasses('textMuted', currentTheme)} uppercase tracking-wider`}>
                            จำนวน
                          </th>
                        </tr>
                      </thead>
                      <tbody className={`${getThemeClasses('cardBg', currentTheme)} divide-y ${getThemeClasses('tableBorder', currentTheme)}`}>
                        {currentSaleData.items.map((item, index) => (
                          <tr key={index} className={getThemeClasses('tableRow', currentTheme)}>
                            <td className={`px-4 py-3 text-sm ${getThemeClasses('textPrimary', currentTheme)}`}>
                              {item.barcode}
                            </td>
                            <td className={`px-4 py-3 text-sm ${getThemeClasses('textPrimary', currentTheme)}`}>
                              {item.productName}
                            </td>
                            <td className={`px-4 py-3 text-center text-sm ${getThemeClasses('textSecondary', currentTheme)}`}>
                              {item.stock}
                            </td>
                            <td className={`px-4 py-3 text-right text-sm ${getThemeClasses('textSecondary', currentTheme)}`}>
                              {item.qty}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className={`text-center py-4 ${getThemeClasses('textMuted', currentTheme)}`}>
                    ไม่มีรายการสินค้า
                  </p>
                )}

                {/* สรุปรายการ */}
                {currentSaleData.items && currentSaleData.items.length > 0 && (
                  <div className={`mt-4 p-3 rounded-lg ${currentTheme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} border-t ${getThemeClasses('cardBorder', currentTheme)}`}>
                    <div className="flex justify-between items-center">
                      <span className={`text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)}`}>
                        สรุปรายการ
                      </span>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${getThemeClasses('textPrimary', currentTheme)}`}>
                          รวม {currentSaleData.items.reduce((sum, item) => sum + (item.qty || 0), 0)} ชิ้น
                        </div>
                        <div className={`text-sm ${getThemeClasses('textSecondary', currentTheme)}`}>
                          {currentSaleData.items.length} รายการ
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className={`sticky bottom-0 ${getThemeClasses('cardBg', currentTheme)} p-6 border-t ${getThemeClasses('cardBorder', currentTheme)} rounded-b-xl`}>
              <div className="flex justify-end">
                <button
                  onClick={() => setShowReviewModal(false)}
                  className={`px-6 py-2 border rounded-lg font-medium ${getThemeClasses('secondaryBtn', currentTheme)} ${getThemeClasses('transition', currentTheme)} hover:shadow-md flex items-center`}
                >
                  <X className="w-4 h-4 mr-2" />
                  ปิด
                </button>
              </div>
            </div>
          </div>

          <div 
            className="absolute inset-0 -z-10"
            onClick={() => setShowReviewModal(false)}
          />
        </div>
      )}

      {/* Sale Modal (Create/Edit) */}
      {showSaleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div 
            className={`${getThemeClasses('cardBg', currentTheme)} rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto ${getThemeClasses('transition', currentTheme)} transform animate-scale-in`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className={`sticky top-0 ${getThemeClasses('cardBg', currentTheme)} p-6 border-b ${getThemeClasses('cardBorder', currentTheme)} rounded-t-xl`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 bg-gradient-to-r ${modalMode === 'edit' ? 'from-yellow-500 to-yellow-600' : 'from-blue-500 to-blue-600'} rounded-lg flex items-center justify-center`}>
                    {modalMode === 'edit' ? <Edit className="w-6 h-6 text-white" /> : <FileText className="w-6 h-6 text-white" />}
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold ${getThemeClasses('textPrimary', currentTheme)}`}>
                      {modalMode === 'edit' ? 'แก้ไขข้อมูลการขาย' : 'เพิ่มข้อมูลการขาย'}
                    </h3>
                    <p className={`text-sm ${getThemeClasses('textSecondary', currentTheme)}`}>
                      {modalMode === 'edit' ? 'แก้ไขข้อมูลการขายที่มีอยู่' : 'กรอกข้อมูลการขายใหม่ (รองรับหลายรายการ)'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSaleModal(false)}
                  className={`p-2 rounded-lg ${getThemeClasses('sidebarHover', currentTheme)} ${getThemeClasses('transition', currentTheme)} ${getThemeClasses('textMuted', currentTheme)} hover:${getThemeClasses('textSecondary', currentTheme)}`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className={`p-4 rounded-lg ${currentTheme === 'dark' ? 'bg-blue-900 bg-opacity-20' : 'bg-blue-50'} border ${currentTheme === 'dark' ? 'border-blue-700' : 'border-blue-200'}`}>
                <h4 className={`text-lg font-semibold mb-4 ${getThemeClasses('textPrimary', currentTheme)}`}>
                  ข้อมูลหัวเอกสาร
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className={`block text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)} mb-2`}>
                      <FileText className="w-4 h-4 inline mr-2" />
                      เลขที่ใบเสร็จ
                    </label>
                    <input
                      type="text"
                      value={saleHeader.billNo}
                      onChange={(e) => setSaleHeader({...saleHeader, billNo: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg ${getThemeClasses('input', currentTheme)}`}
                      placeholder="เลขที่เอกสาร"
                      autoFocus
                      disabled={modalMode === 'edit'}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)} mb-2`}>
                      <Calendar className="w-4 h-4 inline mr-2" />
                      วันที่
                    </label>
                    <input
                      type="date"
                      value={saleHeader.createDate}
                      onChange={(e) => setSaleHeader({...saleHeader, createDate: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg ${getThemeClasses('input', currentTheme)}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)} mb-2`}>
                      รหัสสาขา
                    </label>
                    <select
                      value={saleHeader.branchCode}
                      onChange={(e) => setSaleHeader({...saleHeader, branchCode: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg ${getThemeClasses('input', currentTheme)}`}
                    >
                      <option value="">เลือกสาขา</option>
                      <option value="001">001 - สำนักงานใหญ่ ICS</option>
                      <option value="002">002 - สาขาทดสอบระบบ</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-lg ${getThemeClasses('cardBg', currentTheme)} border ${getThemeClasses('cardBorder', currentTheme)}`}>
                <h4 className={`text-lg font-semibold mb-4 ${getThemeClasses('textPrimary', currentTheme)} flex items-center`}>
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  เพิ่มรายการสินค้า
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className={`block text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)} mb-2`}>
                      รหัสบาร์โค้ด
                    </label>
                    <input
                      type="text"
                      value={currentItem.barcode}
                      onChange={(e) => setCurrentItem({...currentItem, barcode: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg ${getThemeClasses('input', currentTheme)}`}
                      placeholder="สแกนหรือพิมพ์บาร์โค้ด"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)} mb-2`}>
                      ชื่อสินค้า
                    </label>
                    <input
                      type="text"
                      value={currentItem.productName}
                      onChange={(e) => setCurrentItem({...currentItem, productName: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg ${getThemeClasses('input', currentTheme)}`}
                      placeholder="ชื่อสินค้า"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)} mb-2`}>
                      คลังสินค้า
                    </label>
                    <select
                      value={currentItem.stock}
                      onChange={(e) => setCurrentItem({...currentItem, stock: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg ${getThemeClasses('input', currentTheme)}`}
                    >
                      <option value="A1">A1</option>
                      <option value="A2">A2</option>
                      <option value="B1">B1</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)} mb-2`}>
                      จำนวน
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={currentItem.qty}
                        onChange={(e) => setCurrentItem({...currentItem, qty: parseFloat(e.target.value) || 0})}
                        className={`flex-1 px-3 py-2 border rounded-lg ${getThemeClasses('input', currentTheme)}`}
                        placeholder="0"
                      />
                      <button
                        onClick={addItemToSale}
                        disabled={!currentItem.barcode || !currentItem.productName || currentItem.qty <= 0}
                        className={`px-4 py-2 text-white rounded-lg font-medium ${getThemeClasses('primaryBtn', currentTheme)} ${getThemeClasses('transition', currentTheme)} hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center`}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {saleItems.length > 0 && (
                <div className={`p-4 rounded-lg ${getThemeClasses('cardBg', currentTheme)} border ${getThemeClasses('cardBorder', currentTheme)}`}>
                  <h4 className={`text-lg font-semibold mb-4 ${getThemeClasses('textPrimary', currentTheme)}`}>
                    รายการสินค้า ({saleItems.length} รายการ)
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className={getThemeClasses('tableHeader', currentTheme)}>
                        <tr>
                          <th className={`px-4 py-2 text-left text-xs font-medium ${getThemeClasses('textMuted', currentTheme)} uppercase tracking-wider`}>
                            รหัสบาร์โค้ด
                          </th>
                          <th className={`px-4 py-2 text-left text-xs font-medium ${getThemeClasses('textMuted', currentTheme)} uppercase tracking-wider`}>
                            ชื่อสินค้า
                          </th>
                          <th className={`px-4 py-2 text-center text-xs font-medium ${getThemeClasses('textMuted', currentTheme)} uppercase tracking-wider`}>
                            คลัง
                          </th>
                          <th className={`px-4 py-2 text-right text-xs font-medium ${getThemeClasses('textMuted', currentTheme)} uppercase tracking-wider`}>
                            จำนวน
                          </th>
                          <th className={`px-4 py-2 text-center text-xs font-medium ${getThemeClasses('textMuted', currentTheme)} uppercase tracking-wider`}>
                            จัดการ
                          </th>
                        </tr>
                      </thead>
                      <tbody className={`${getThemeClasses('cardBg', currentTheme)} divide-y ${getThemeClasses('tableBorder', currentTheme)}`}>
                        {saleItems.map((item, index) => (
                          <tr key={item.id} className={getThemeClasses('tableRow', currentTheme)}>
                            <td className={`px-4 py-3 text-sm ${getThemeClasses('textPrimary', currentTheme)}`}>
                              {item.barcode}
                            </td>
                            <td className={`px-4 py-3 text-sm ${getThemeClasses('textPrimary', currentTheme)}`}>
                              {item.productName}
                            </td>
                            <td className={`px-4 py-3 text-center text-sm ${getThemeClasses('textSecondary', currentTheme)}`}>
                              {item.stock}
                            </td>
                            <td className={`px-4 py-3 text-right text-sm ${getThemeClasses('textSecondary', currentTheme)}`}>
                              {item.qty}
                            </td>
                            <td className={`px-4 py-3 text-center text-sm`}>
                              <div className="flex justify-center space-x-2">
                                <button
                                  onClick={() => editSaleItem(item.id)}
                                  className={`p-1 rounded ${getThemeClasses('textSecondary', currentTheme)} hover:${getThemeClasses('textPrimary', currentTheme)} ${getThemeClasses('transition', currentTheme)}`}
                                  title="แก้ไข"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => removeItemFromSale(item.id)}
                                  className={`p-1 rounded text-red-500 hover:text-red-700 ${getThemeClasses('transition', currentTheme)}`}
                                  title="ลบ"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className={`mt-4 p-3 rounded-lg ${currentTheme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} border-t ${getThemeClasses('cardBorder', currentTheme)}`}>
                    <div className="flex justify-between items-center">
                      <span className={`text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)}`}>
                        สรุปรายการ
                      </span>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${getThemeClasses('textPrimary', currentTheme)}`}>
                          รวม {saleItems.reduce((sum, item) => sum + item.qty, 0)} ชิ้น
                        </div>
                        <div className={`text-sm ${getThemeClasses('textSecondary', currentTheme)}`}>
                          {saleItems.length} รายการ
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className={`sticky bottom-0 ${getThemeClasses('cardBg', currentTheme)} p-6 border-t ${getThemeClasses('cardBorder', currentTheme)} rounded-b-xl`}>
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={() => setShowSaleModal(false)}
                  className={`px-6 py-2 border rounded-lg font-medium ${getThemeClasses('secondaryBtn', currentTheme)} ${getThemeClasses('transition', currentTheme)} hover:shadow-md flex items-center justify-center`}
                >
                  <X className="w-4 h-4 mr-2" />
                  ยกเลิก
                </button>
                <button
                  onClick={() => {
                    resetNewSaleForm();
                  }}
                  className={`mt-4 sm:mt-0 px-4 py-2 rounded-lg font-medium ${getThemeClasses('secondaryBtn', currentTheme)} ${getThemeClasses('transition', currentTheme)} hover:shadow-md flex items-center justify-center`}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  ล้างข้อมูล
                </button>
                <button
                  onClick={handleNewSaleSubmit}
                  disabled={!saleHeader.billNo || saleItems.length === 0}
                  className={`px-6 py-2 text-white rounded-lg font-medium ${getThemeClasses('primaryBtn', currentTheme)} ${getThemeClasses('transition', currentTheme)} hover:shadow-lg transform hover:scale-105 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                >
                  {modalMode === 'edit' ? <Edit className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                  {modalMode === 'edit' ? 'อัปเดตข้อมูล' : 'ยืนยันข้อมูล'} ({saleItems.length} รายการ)
                </button>
              </div>
              
              <div className={`mt-4 text-xs ${getThemeClasses('textMuted', currentTheme)} text-center p-2 rounded ${currentTheme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <div className="flex items-center justify-center space-x-4">
                  <span>💡 เคล็ดลับ:</span>
                  <span>กด Ctrl+Enter เพื่อเพิ่มรายการเร็ว</span>
                  <span>•</span>
                  <span>กด Esc เพื่อยกเลิก</span>
                </div>
              </div>
            </div>
          </div>

          <div 
            className="absolute inset-0 -z-10"
            onClick={() => setShowSaleModal(false)}
          />
        </div>
      )}
    </div>
  );
};

export default Sales;