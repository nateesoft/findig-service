import { useState, useEffect, useContext, useRef } from 'react';
import { 
  Plus, 
  Upload,
  Search} from 'lucide-react';

import { getThemeClasses } from '../../utils/themes';
import { AppContext } from '../../contexts';
import { createDraftSaleInfo, loadDraftSaleById, loadDraftSaleInfo, processStockFromSale, updateDraftSaleInfo } from '../../api/saleApi';
import { loadAllProduct } from '../../api/productApi';
import POSTModal from './POSTModal';
import ReviewModal from './ReviewModal';
import CreateEditModal from './CreateEditModal'
import SearchForm from './SearchForm';
import SaleTable from './SaleTable';
import { Modal } from '../../components/Modals';

const Sales = () => {
  const [activeModal, setActiveModal] = useState(null);

  const { appData } = useContext(AppContext)
  const { currentTheme, branchCode, userInfo } = appData

  const [draftSale, setDraftSale] = useState([])
  const [filteredSales, setFilteredSales] = useState([])
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showSearchForm, setShowSearchForm] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', 'review'
  const [currentSaleData, setCurrentSaleData] = useState(null);
  
  const [postProgress, setPostProgress] = useState(0);
  const [postStatus, setPostStatus] = useState('idle'); // 'idle', 'processing', 'completed', 'error'
  const [processedItems, setProcessedItems] = useState([]);
  const [currentProcessingItem, setCurrentProcessingItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchCriteria, setSearchCriteria] = useState({
    billNo: '',
    dateFrom: '',
    dateTo: '',
    branchCode: '',
    empCode: '',
    postStatus: ''
  });

  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [selectedProductIndex, setSelectedProductIndex] = useState(-1);

  const [productList, setProductList] = useState([])
  
  const barcodeInputRef = useRef(null);
  const autocompleteRef = useRef(null);
  
  const [saleHeader, setSaleHeader] = useState({
    branchCode: '',
    billNo: '',
    empCode: userInfo.UserName,
    createDate: new Date().toISOString().split('T')[0],
    branchCode: branchCode
  });

  const [currentItem, setCurrentItem] = useState({
    barcode: '',
    productName: '',
    stock: '',
    qty: 0,
    canStock: null,
    canSet: null
  });

  const [saleItems, setSaleItems] = useState([]);

  const searchProducts = (term) => {
    if (!term) return [];
    const searchTerm = term.toLowerCase();
    return productList.filter(product => 
      product.PCode.toLowerCase().includes(searchTerm) || 
      product.PDesc.toLowerCase().includes(searchTerm)
    ).slice(0, 10); // จำกัดผลลัพธ์ 10 รายการ
  };

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

  const selectProduct = (product) => {
    setCurrentItem({
      barcode: product.PCode,
      productName: product.PDesc,
      stock: product.stock,
      qty: product.qty,
      canStock: product.PStock,
      canSet: product.PSet
    });
    setProductSearchTerm(product.PCode);
    setSelectedProductIndex(-1);
    
    setTimeout(() => {
      setShowAutocomplete(false);
    }, 50);
  };

  const handleBarcodeChange = async (e) => {
    const value = e.target.value;
    setCurrentItem({...currentItem, barcode: value});
    
    await initLoadProduct(value)
    
    const exactMatch = productList.find(product => product.barcode === value);
    if (exactMatch) {
      setCurrentItem({
        barcode: exactMatch.PCode,
        productName: exactMatch.PDesc,
        canStock: exactMatch.PStock,
        canSet: exactMatch.PSet
      });
      setShowAutocomplete(false);
    }
  };

  const resetNewSaleForm = () => {
    setSaleHeader({
      branchCode: branchCode,
      billNo: '',
      empCode: userInfo.UserName,
      createDate: new Date().toISOString().split('T')[0],
    });
    setCurrentItem({
      barcode: '',
      productName: '',
      stock: '',
      qty: 0,
      canStock: null,
      canSet: null
    });
    setSaleItems([]);
    setCurrentSaleData(null);
    setProductSearchTerm('');
  };

  const resetCurrentItem = () => {
    setCurrentItem({
      barcode: '',
      productName: '',
      stock: '',
      qty: 0,
      canStock: null,
      canSet: null
    });
  };

  const addItemToSale = () => {
    if (!currentItem.barcode || !currentItem.productName || currentItem.qty <= 0) {
      setActiveModal({
        type: 'warning',
        title: 'ไม่สามารถบันทึกข้อมูลได้',
        message: 'กรุณากรอกข้อมูลสินค้าให้ครบถ้วน',
        actions: [
          {
            label: 'ตกลง',
            onClick: () => setActiveModal(null)
          }
        ]
      });
      return;
    }
    const newItem = {
      id: Date.now(),
      ...currentItem,
      total: currentItem.qty
    };

    setSaleItems(prev => [...prev, newItem]);
    resetCurrentItem();
    setProductSearchTerm('');
  };

  const removeItemFromSale = (itemId) => {
    setSaleItems(prev => prev.filter(item => item.id !== itemId));
  };

  const editSaleItem = (itemId) => {
    const itemToEdit = saleItems.find(item => item.id === itemId);
    if (itemToEdit) {
      setCurrentItem({ ...itemToEdit});
      removeItemFromSale(itemId);
    }
  };

  const initLoadProduct = async (searchText) => {
    try {
      const { data, error } = await loadAllProduct(searchText);
      if (data) {
        setProductList(data)
        setProductSearchTerm(searchText);
      } else {
        setActiveModal({
          type: 'error',
          title: 'ไม่สามารถแสดงข้อมูลได้',
          message: error || 'กรุณาลองใหม่อีกครั้ง',
          actions: [
            {
              label: 'ตกลง',
              onClick: () => setActiveModal(null)
            }
          ]
        });
      }
    } catch (error) {
      setActiveModal({
        type: 'error',
        title: 'ไม่สามารถแสดงข้อมูลได้',
        message: error || 'กรุณาลองใหม่อีกครั้ง',
        actions: [
          {
            label: 'ตกลง',
            onClick: () => setActiveModal(null)
          }
        ]
      });
    }
  };

  const handleReviewSale = async (id) => {
    try {
      const { data, error } = await loadDraftSaleById({ id });
      
      if (data) {
        setCurrentSaleData(data);
        setModalMode('review');
        setShowReviewModal(true);
      } else {
        setActiveModal({
          type: 'error',
          title: 'ไม่สามารถแสดงข้อมูลได้',
          message: error || 'กรุณาลองใหม่อีกครั้ง',
          actions: [
            {
              label: 'ตกลง',
              onClick: () => setActiveModal(null)
            }
          ]
        });
      }
    } catch (error) {
      setActiveModal({
        type: 'error',
        title: 'ไม่สามารถแสดงข้อมูลได้',
        message: error || 'กรุณาลองใหม่อีกครั้ง',
        actions: [
          {
            label: 'ตกลง',
            onClick: () => setActiveModal(null)
          }
        ]
      });
    }
  };

  const handleEditSale = async (id) => {
    try {
      const { data, error } = await loadDraftSaleById({ id });
      
      if (data) {
        setSaleHeader({
          ...data,
          emp_code_update: userInfo.UserName,
          branchCode: branchCode,
          createDate: data.createDate || new Date().toISOString().split('T')[0]
        });
        
        setSaleItems(data.items || []);
        setCurrentSaleData(data);
        setModalMode('edit');
        setShowSaleModal(true);
      } else {
        setActiveModal({
          type: 'error',
          title: 'ไม่สามารถแสดงข้อมูลได้',
          message: error || 'กรุณาลองใหม่อีกครั้ง',
          actions: [
            {
              label: 'ตกลง',
              onClick: () => setActiveModal(null)
            }
          ]
        });
      }
    } catch (error) {
      setActiveModal({
        type: 'error',
        title: 'ไม่สามารถแสดงข้อมูลได้',
        message: error || 'กรุณาลองใหม่อีกครั้ง',
        actions: [
          {
            label: 'ตกลง',
            onClick: () => setActiveModal(null)
          }
        ]
      });
    }
  };

  const handleNewSaleSubmit = async () => {
    if (!saleHeader.billNo) {
      return;
    }

    if (saleItems.length === 0) {
      setActiveModal({
        type: 'warning',
        title: 'ไม่สามารถเพิ่มข้อมูลได้',
        message: 'กรุณาเพิ่มรายการสินค้าอย่างน้อย 1 รายการ',
        actions: [
          {
            label: 'ตกลง',
            onClick: () => setActiveModal(null)
          }
        ]
      });
      return;
    }

    const totalQty = saleItems.reduce((sum, item) => sum + item.qty, 0);

    try {
      let result;
      if (modalMode === 'edit') {
        result = await updateDraftSaleInfo({
          ...saleHeader,
          totalItem: totalQty,
          saleItems
        });
      } else {
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
        initLoadData();
      } else {
        setActiveModal({
          type: 'error',
          title: 'ไม่สามารถแสดงข้อมูลได้',
          message: error || 'กรุณาลองใหม่อีกครั้ง',
          actions: [
            {
              label: 'ตกลง',
              onClick: () => setActiveModal(null)
            }
          ]
        });
      }
    } catch (error) {
      setActiveModal({
        type: 'error',
        title: 'ไม่สามารถแสดงข้อมูลได้',
        message: error || 'กรุณาลองใหม่อีกครั้ง',
        actions: [
          {
            label: 'ตกลง',
            onClick: () => setActiveModal(null)
          }
        ]
      });
    }
    
    resetNewSaleForm();
    setShowSaleModal(false);
  };

  const initLoadData = async () => {
    try {
      setIsLoading(true)

      const { data, error } = await loadDraftSaleInfo({
        branchCode: branchCode
      })

      if(data) {
        setDraftSale(data)
      }else {
        setActiveModal({
          type: 'error',
          title: 'ไม่สามารถแสดงข้อมูลได้',
          message: error || 'กรุณาลองใหม่อีกครั้ง',
          actions: [
            {
              label: 'ตกลง',
              onClick: () => setActiveModal(null)
            }
          ]
        });
      }
    } finally {
      setIsLoading(false)
    }
    
  }

  const handleCreateNew = () => {
    resetNewSaleForm();
    setModalMode('create');
    setShowSaleModal(true);
  };
  
  const handlePostStock = () => {
    const tempSales = filteredSales.filter(sale => sale.post_status === 'N');
    
    if (tempSales.length === 0) {
      setActiveModal({
        type: 'warning',
        title: 'ไม่สามารถ POST ข้อมูลได้',
        message: 'ไม่มีรายการที่สามารถ POST ได้',
        actions: [
          {
            label: 'ตกลง',
            onClick: () => setActiveModal(null)
          }
        ]
      });
      return;
    }
    
    setPostProgress(0);
    setPostStatus('idle');
    setProcessedItems([]);
    setCurrentProcessingItem(null);
    setShowPostModal(true);
  };

  const processPostItem = async (item, index, total) => {
    setCurrentProcessingItem(item);

    let isSuccess = false
    const { data, error } = await processStockFromSale({ branchCode: branchCode, saleInfo: item })
    if(data) {
      isSuccess = true
    }
    
    const result = {
      ...item,
      processed: true,
      success: isSuccess,
      message: isSuccess ? 'POST สำเร็จ' : error,
      processedAt: new Date().toISOString()
    };
    
    setProcessedItems(prev => [...prev, result]);
    setPostProgress(((index + 1) / total) * 100);
    
    return result;
  };

  const handleConfirmPost = async () => {
    const tempSales = filteredSales.filter(sale => sale.post_status === 'N');
    
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
      
      setTimeout(() => {
        initLoadData();
      }, 1000);
      
    } catch (error) {
      setPostStatus('error');
      console.error('Error during POST process:', error);
    }
  };

  const handleSearch = () => {
    let filtered = [...draftSale];

    if (searchCriteria.billNo.trim()) {
      filtered = filtered.filter(item => 
        item.billno.toLowerCase().includes(searchCriteria.billNo.toLowerCase())
      );
    }

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

    if (searchCriteria.branchCode) {
      filtered = filtered.filter(item => 
        item.branch_code === searchCriteria.branchCode
      );
    }

    if (searchCriteria.empCode.trim()) {
      filtered = filtered.filter(item => 
        item.emp_code.toLowerCase().includes(searchCriteria.empCode.toLowerCase())
      );
    }

    if (searchCriteria.postStatus) {
      filtered = filtered.filter(item => 
        item.post_status === searchCriteria.postStatus
      );
    }

    setFilteredSales(filtered);
  };

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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className={`text-2xl font-bold ${getThemeClasses('textPrimary', currentTheme)}`}>ข้อมูลตาราง STCARD</h1>
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

      <SaleTable
        getThemeClasses={getThemeClasses}
        currentTheme={currentTheme}
        filteredSales={filteredSales}
        handleReviewSale={handleReviewSale}
        handleEditSale={handleEditSale}
        searchCriteria={searchCriteria}
        resetSearch={resetSearch}
      />

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

      {showReviewModal && currentSaleData && (
        <ReviewModal 
          getThemeClasses={getThemeClasses}
          currentTheme={currentTheme}
          currentSaleData={currentSaleData}
          setShowReviewModal={setShowReviewModal}
        />
      )}

      {showSaleModal && (
        <CreateEditModal
          getThemeClasses={getThemeClasses}
          currentTheme={currentTheme}
          modalMode={modalMode}
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

      {activeModal && (
        <Modal
          isOpen={!!activeModal}
          onClose={() => setActiveModal(null)}
          type={activeModal.type}
          title={activeModal.title}
          message={activeModal.message}
          confirmText={activeModal.confirmText}
          cancelText={activeModal.cancelText}
          showCancel={activeModal.showCancel}
          onConfirm={() => {
            setActiveModal(null)
          }}
        />
      )}
    </div>
  );
};

export default Sales;