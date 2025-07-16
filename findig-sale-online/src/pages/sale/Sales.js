import { useState, useEffect, useContext, useRef } from 'react';
import { 
  Plus, 
  Upload,
  Search} from 'lucide-react';

import { getThemeClasses } from '../../utils/themes';
import { AppContext } from '../../contexts';
import { createDraftSaleInfo, loadDraftSaleById, loadDraftSaleInfo, updateDraftSaleInfo } from '../../api/saleApi';
import { loadAllProduct } from '../../api/productApi';
import POSTModal from './POSTModal';
import ReviewModal from './ReviewModal';
import CreateEditModal from './CreateEditModal'
import SearchForm from './SearchForm';
import SaleTable from './SaleTable';

// Mock data สำหรับสินค้า
const mockProducts = [
  { barcode: '1234567890123', name: 'เสื้อยืดสีขาว', stock: 'A1', price: 250, available: 50 },
  { barcode: '1234567890124', name: 'เสื้อยืดสีดำ', stock: 'A1', price: 250, available: 30 },
  { barcode: '1234567890125', name: 'กางเกงยีนส์', stock: 'A2', price: 890, available: 25 },
  { barcode: '1234567890126', name: 'รองเท้าผ้าใบ', stock: 'B1', price: 1200, available: 20 },
  { barcode: '1234567890127', name: 'กระเป๋าใส่เอกสาร', stock: 'A1', price: 350, available: 15 },
  { barcode: '1234567890128', name: 'หูฟัง Bluetooth', stock: 'B1', price: 1500, available: 10 },
  { barcode: '1234567890129', name: 'แก้วน้ำสแตนเลส', stock: 'A2', price: 180, available: 40 },
  { barcode: '1234567890130', name: 'พาวเวอร์แบงค์', stock: 'B1', price: 890, available: 35 },
  { barcode: '1234567890131', name: 'สายชาร์จ USB-C', stock: 'A1', price: 120, available: 60 },
  { barcode: '1234567890132', name: 'เคสโทรศัพท์', stock: 'A2', price: 200, available: 45 },
  { barcode: '1234567890133', name: 'ฟิล์มกันรอย', stock: 'B1', price: 80, available: 100 },
  { barcode: '1234567890134', name: 'ที่วางโทรศัพท์', stock: 'A1', price: 150, available: 25 }
];

const Sales = () => {
  const { appData } = useContext(AppContext)
  const { currentTheme, db, userInfo } = appData

  const [draftSale, setDraftSale] = useState([])
  const [filteredSales, setFilteredSales] = useState([])
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showSearchForm, setShowSearchForm] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showProductSearchModal, setShowProductSearchModal] = useState(false);
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

  // Product search states
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [selectedProductIndex, setSelectedProductIndex] = useState(-1);
  
  // Refs
  const barcodeInputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const productSearchInputRef = useRef(null);
  
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

  // ฟังก์ชันค้นหาสินค้า
  const searchProducts = (term) => {
    if (!term) return [];
    const searchTerm = term.toLowerCase();
    return mockProducts.filter(product => 
      product.barcode.includes(searchTerm) || 
      product.name.toLowerCase().includes(searchTerm)
    ).slice(0, 10); // จำกัดผลลัพธ์ 10 รายการ
  };

  // Auto-complete logic
  useEffect(() => {
    if (productSearchTerm && productSearchTerm.length >= 2) {
      const filtered = searchProducts(productSearchTerm);
      setFilteredProducts(filtered);
      setShowAutocomplete(filtered.length > 0);
      setSelectedProductIndex(-1);
    } else {
      setFilteredProducts([]);
      setShowAutocomplete(false);
      setSelectedProductIndex(-1);
    }
  }, [productSearchTerm]);

  // ปิด autocomplete เมื่อคลิกข้างนอก
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target)) {
        setShowAutocomplete(false);
        setSelectedProductIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // จัดการ keyboard navigation ใน autocomplete
  const handleBarcodeKeyDown = (e) => {
    if (!showAutocomplete || filteredProducts.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedProductIndex(prev => 
          prev < filteredProducts.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedProductIndex(prev => prev > 0 ? prev - 1 : prev);
        break;
      case 'Enter':
        if (selectedProductIndex >= 0) {
          e.preventDefault();
          selectProduct(filteredProducts[selectedProductIndex]);
        }
        break;
      case 'Escape':
        setShowAutocomplete(false);
        setSelectedProductIndex(-1);
        break;
    }
  };

  // เลือกสินค้าจาก autocomplete หรือ search modal
  const selectProduct = (product) => {
    setCurrentItem({
      barcode: product.barcode,
      productName: product.name,
      stock: product.stock,
      qty: 1
    });
    setProductSearchTerm(product.barcode);
    setShowAutocomplete(false);
    setShowProductSearchModal(false);
    setSelectedProductIndex(-1);
    
    // Focus ไปที่ quantity input
    setTimeout(() => {
      const qtyInput = document.querySelector('input[type="number"]');
      if (qtyInput) qtyInput.focus();
    }, 100);
  };

  // จัดการการเปลี่ยนแปลงใน barcode input
  const handleBarcodeChange = (e) => {
    const value = e.target.value;
    setCurrentItem({...currentItem, barcode: value});
    setProductSearchTerm(value);
    
    // ถ้าตรงกับบาร์โค้ดในระบบ จะเติมข้อมูลอัตโนมัติ
    const exactMatch = mockProducts.find(product => product.barcode === value);
    if (exactMatch) {
      setCurrentItem({
        barcode: exactMatch.barcode,
        productName: exactMatch.name,
        stock: exactMatch.stock,
        qty: 1
      });
      setShowAutocomplete(false);
    }
  };

  // เปิด Product Search Modal
  const openProductSearchModal = () => {
    setShowProductSearchModal(true);
    setProductSearchTerm('');
    setFilteredProducts(mockProducts.slice(0, 20)); // แสดงสินค้า 20 รายการแรก
    setTimeout(() => {
      if (productSearchInputRef.current) {
        productSearchInputRef.current.focus();
      }
    }, 100);
  };

  // ค้นหาสินค้าใน modal
  const handleProductSearch = (term) => {
    setProductSearchTerm(term);
    if (term.length >= 2) {
      setFilteredProducts(searchProducts(term));
    } else {
      setFilteredProducts(mockProducts.slice(0, 20));
    }
  };

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
    setProductSearchTerm('');
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

  const initLoadProduct = async () => {
    try {
      // สมมติว่ามี API สำหรับโหลดรายละเอียด
      const { data, error } = await loadAllProduct();
      console.log(data)
      if (data) {
        
      } else {
        alert(error || 'ไม่สามารถโหลดข้อมูลได้');
      }
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการโหลดข้อมูล');
      console.error('Error loading sale detail:', error);
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
    
    resetNewSaleForm();
    setShowSaleModal(false);
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
    initLoadProduct()
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
        <SearchForm
          getThemeClasses={getThemeClasses}
          currentTheme={currentTheme}
          searchCriteria={searchCriteria}
          setSearchCriteria={setSearchCriteria}
          filteredSales={filteredSales}
          draftSale={draftSale}
          resetSearch={resetSearch}
          handleSearch={handleSearch}
        />
      )}

      {/* Sales Table */}
      <SaleTable
        getThemeClasses={getThemeClasses}
        currentTheme={currentTheme}
        filteredSales={filteredSales}
        handleReviewSale={handleReviewSale}
        handleEditSale={handleEditSale}
        searchCriteria={searchCriteria}
        resetSearch={resetSearch}
      />

      {/* POST Modal */}
      {showPostModal && (
        <POSTModal
          currentTheme={currentTheme}
          postStatus={postStatus}
          filteredSales={filteredSales}
          currentProcessingItem={currentProcessingItem}
          handleConfirmPost={handleConfirmPost}
          setShowPostModal={setShowPostModal}
          postProgress={postProgress}
          processedItems={processedItems}
        />
      )}

      {/* Review Modal */}
      {showReviewModal && currentSaleData && (
        <ReviewModal 
          getThemeClasses={getThemeClasses}
          currentTheme={currentTheme}
          currentSaleData={currentSaleData}
          setShowReviewModal={setShowReviewModal}
        />
      )}

      {/* Sale Modal (Create/Edit) */}
      {showSaleModal && (
        <CreateEditModal
          getThemeClasses={getThemeClasses}
          currentTheme={currentTheme}
          modsle={modalMode}
          saleHeader={saleHeader}
          setSaleHeader={setSaleHeader}
          saleItems={saleItems}
          currentItem={currentItem}
          setCurrentItem={setCurrentItem}
          productSearchTerm={productSearchTerm}
          filteredProducts={filteredProducts}
          showAutocomplete={showAutocomplete}
          selectedProductIndex={selectedProductIndex}
          barcodeInputRef={barcodeInputRef}
          autocompleteRef={autocompleteRef}
          handleBarcodeChange={handleBarcodeChange}
          handleBarcodeKeyDown={handleBarcodeKeyDown}
          selectProduct={selectProduct}
          addItemToSale={addItemToSale}
          editSaleItem={editSaleItem}
          removeItemFromSale={removeItemFromSale}
          setShowSaleModal={setShowSaleModal}
          resetNewSaleForm={resetNewSaleForm}
          handleNewSaleSubmit={handleNewSaleSubmit}
        />
      )}
    </div>
  );
};

export default Sales;