import { useState, useEffect, useContext, useRef } from 'react';
import { 
  Plus, 
  Upload,
  Search} from 'lucide-react';

import { getThemeClasses } from '../../utils/themes';
import { AppContext } from '../../contexts';
import { createDraftSaleInfo, deleteDraftSaleInfo, loadDraftSaleById, loadDraftSaleInfo, processStockFromSale, searchData, updateDraftSaleInfo } from '../../api/saleApi';
import { loadAllProduct } from '../../api/productApi';
import POSTModal from './POSTModal';
import ReviewModal from './ReviewModal';
import CreateEditModal from './CreateEditModal'
import SearchForm from './SearchForm';
import DataTable from './DataTable';
import { Modal } from '../../components/Modals';
import { loadAllBranch } from '../../api/branchApi';

const Sales = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [branchFile, setBranchFile] = useState([])

  const { appData } = useContext(AppContext)
  const { currentTheme, branchCode, userInfo } = appData

  const [draftSale, setDraftSale] = useState([])
  const [filteredSales, setFilteredSales] = useState([])
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showSearchForm, setShowSearchForm] = useState(true);
  const [showPostModal, setShowPostModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', 'review'
  const [currentSaleData, setCurrentSaleData] = useState(null);
  
  const [postProgress, setPostProgress] = useState(0);
  const [postStatus, setPostStatus] = useState('idle'); // 'idle', 'processing', 'completed', 'error'
  const [processedItems, setProcessedItems] = useState([]);
  const [currentProcessingItem, setCurrentProcessingItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [searchCriteria, setSearchCriteria] = useState({
    billno: '',
    document_date_start: '',
    document_date_end: '',
    branch_code: branchCode || '',
    emp_code: '',
    post_status: ''
  });

  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [selectedProductIndex, setSelectedProductIndex] = useState(-1);

  const [isSearching, setIsSearching] = useState(false);
  
  const barcodeInputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  const latestSearchRef = useRef('');
  
  const [saleHeader, setSaleHeader] = useState({
    branchCode: '',
    billNo: '',
    empCode: userInfo.UserName,
    createDate: new Date().toLocaleDateString('en-CA'),
    branchCode: branchCode
  });

  const [currentItem, setCurrentItem] = useState({
    barcode: '',
    productName: '',
    stock: '',
    qty: 0,
    price: 0,
    canStock: null,
    canSet: null
  });

  const [saleItems, setSaleItems] = useState([]);
  const [discount, setDiscount] = useState(0);

  // Debounced search with API call
  const performSearch = async (searchTerm) => {
    if (!searchTerm || searchTerm.trim().length === 0) {
      setSearchResults([]);
      setShowAutocomplete(false);
      setIsSearching(false);
      return;
    }

    // Store latest search term in ref to prevent race condition
    latestSearchRef.current = searchTerm;
    setIsSearching(true);

    try {
      const { data } = await loadAllProduct(searchTerm);

      // Only update if this is still the latest search
      if (latestSearchRef.current === searchTerm) {
        if (data && data.length > 0) {
          setSearchResults(data);

          // Check for exact match
          const exactMatch = data.find(product =>
            product.PCode.toLowerCase() === searchTerm.toLowerCase()
          );

          if (exactMatch) {
            // Exact match found - auto select
            selectProduct(exactMatch);
            setShowAutocomplete(false);
          } else if (data.length === 1) {
            // Only one result - auto select
            selectProduct(data[0]);
            setShowAutocomplete(false);
          } else {
            // Multiple results - show autocomplete
            setShowAutocomplete(true);
            setSelectedProductIndex(-1);
          }
        } else {
          // No results
          setSearchResults([]);
          setShowAutocomplete(false);
        }
        setIsSearching(false);
      }
    } catch (error) {
      if (latestSearchRef.current === searchTerm) {
        setSearchResults([]);
        setShowAutocomplete(false);
        setIsSearching(false);
      }
    }
  };

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
    if (!showAutocomplete) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedProductIndex(prev => 
          prev < searchResults.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedProductIndex(prev => prev > 0 ? prev - 1 : prev);
        break;
      case 'Enter':
        if (selectedProductIndex >= 0) {
          e.preventDefault();
          selectProduct(searchResults[selectedProductIndex]);
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
      stock: currentItem.stock || '',
      qty: currentItem.qty || 0,
      price: product.PPrice11 || 0,
      canStock: product.PStock,
      canSet: product.PSet
    });
    setProductSearchTerm(product.PCode);
    setSelectedProductIndex(-1);
    
    setTimeout(() => {
      setShowAutocomplete(false);
    }, 50);
  };

  const handleBarcodeChange = (e) => {
    const value = e.target.value;
    // Update search term immediately
    setProductSearchTerm(value);

    // Always clear current item when typing

    setCurrentItem({
      barcode: value,
      productName: '', // Clear product name when barcode changes
      stock: '',       // Clear stock as well
      qty: 0,
      price: 0,
      canStock: null,
      canSet: null
    });
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // If empty, clear everything immediately
    if (!value || value.trim().length === 0) {
      setSearchResults([]);
      setShowAutocomplete(false);
      setIsSearching(false);
      latestSearchRef.current = '';
      return;
    }

    // Debounce search - wait for user to stop typing
    searchTimeoutRef.current = setTimeout(() => {
      performSearch(value.trim());
    }, 300);

  };

  const resetNewSaleForm = () => {
    setSaleHeader({
      branchCode: branchCode,
      billNo: '',
      empCode: userInfo.UserName,
      createDate: new Date().toLocaleDateString('en-CA'),
    });
    setCurrentItem({
      barcode: '',
      productName: '',
      stock: '',
      qty: 0,
      price: 0,
      canStock: null,
      canSet: null
    });
    setSaleItems([]);
    setDiscount(0);
    setCurrentSaleData(null);
    setProductSearchTerm('');
  };

  const resetCurrentItem = () => {
    setCurrentItem({
      barcode: '',
      productName: '',
      stock: '',
      qty: 0,
      price: 0,
      canStock: null,
      canSet: null
    });
    setProductSearchTerm('');
    setSearchResults([]);
    setShowAutocomplete(false);
    setIsSearching(false);
    latestSearchRef.current = '';

    // Clear any pending search
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
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
    
    // Focus back to barcode input after adding item
    setTimeout(() => {
      if (barcodeInputRef.current) {
        barcodeInputRef.current.focus();
      }
    }, 100);
  };

  const removeItemFromSale = (itemId) => {
    setSaleItems(prev => prev.filter(item => item.id !== itemId));
  };

  const editSaleItem = (itemId) => {
    const itemToEdit = saleItems.find(item => item.id === itemId);
    if (itemToEdit) {
      setCurrentItem({ ...itemToEdit});
      setProductSearchTerm(itemToEdit.barcode || '');
      removeItemFromSale(itemId);
    }
  };

  const calculateDiscount = () => {
    const discountAmount = parseFloat(discount) || 0;
    if (discountAmount <= 0 || saleItems.length === 0) return;

    const totalPrice = saleItems.reduce((sum, item) => sum + (item.price || 0), 0);
    if (totalPrice === 0) return;

    let remaining = parseFloat(discountAmount.toFixed(2));
    const updatedItems = saleItems.map((item, index) => {
      let itemDiscount;
      if (index === saleItems.length - 1) {
        itemDiscount = parseFloat(remaining.toFixed(2));
      } else {
        itemDiscount = parseFloat(((item.price || 0) / totalPrice * discountAmount).toFixed(2));
        remaining = parseFloat((remaining - itemDiscount).toFixed(2));
      }
      return { ...item, discount: itemDiscount };
    });

    setSaleItems(updatedItems);
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
          createDate: data.documentDate
            ? new Date(data.documentDate).toLocaleDateString('en-CA')
            : new Date().toLocaleDateString('en-CA')
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

  const handleDeleteSale = (id) => {
    setActiveModal({
      type: 'warning',
      title: 'ยืนยันการลบข้อมูล',
      message: 'คุณต้องการลบรายการขายนี้หรือไม่? การดำเนินการนี้ไม่สามารถยกเลิกได้',
      showCancel: true,
      confirmText: 'ลบข้อมูล',
      cancelText: 'ยกเลิก',
      actions: [
        {
          label: 'ยกเลิก',
          onClick: () => setActiveModal(null)
        }
      ],
      onConfirm: async () => {
        setActiveModal(null)
        try {
          const { data, error } = await deleteDraftSaleInfo({ id })
          if (data) {
            initLoadData()
          } else {
            setActiveModal({
              type: 'error',
              title: 'ไม่สามารถลบข้อมูลได้',
              message: error || 'กรุณาลองใหม่อีกครั้ง',
              actions: [{ label: 'ตกลง', onClick: () => setActiveModal(null) }]
            })
          }
        } catch (error) {
          setActiveModal({
            type: 'error',
            title: 'ไม่สามารถลบข้อมูลได้',
            message: error.message || 'กรุณาลองใหม่อีกครั้ง',
            actions: [{ label: 'ตกลง', onClick: () => setActiveModal(null) }]
          })
        }
      }
    })
  }

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
          discount,
          saleItems
        });
      } else {
        result = await createDraftSaleInfo({
          branchCode: saleHeader.branchCode,
          billNo: saleHeader.billNo,
          empCode: saleHeader.empCode,
          createDate: saleHeader.createDate,
          totalItem: totalQty,
          discount,
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
      
      setTimeout(async () => {
        // Reload draft sale data
        await initLoadData();
        
        // Also reload search results to refresh the filtered data
        if (searchCriteria.billno || searchCriteria.document_date_start || searchCriteria.document_date_end || 
            searchCriteria.emp_code || searchCriteria.post_status) {
          await handleSearch();
        }
      }, 1000);
      
    } catch (error) {
      setPostStatus('error');
      console.error('Error during POST process:', error);
    }
  };

  const handleSearch = async () => {
     try {
      setIsLoading(true)
      const { data, error } = await searchData(searchCriteria)
      if(data){
        setFilteredSales(data);
      }

      if(error){
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
  };

  const resetSearch = () => {
    setSearchCriteria({
      billNo: '',
      dateFrom: '',
      dateTo: '',
      branchCode: branchCode || '',
      empCode: '',
      postStatus: ''
    });
    setFilteredSales(draftSale);
  };

  useEffect(() => {
    setFilteredSales(draftSale);
  }, [draftSale]);

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

  useEffect(()=> {
      const initLoadAllbranch = async () => {
        const { data, error } = await loadAllBranch()
        if(data) {
          setBranchFile(data)
        }
        if(error) {
          setActiveModal({
            type: 'error',
            title: 'แสดงข้อมูลสาขาทั้งหมด',
            message: error || 'พบปัญหาในการแสดงรายการสาขาทั้งหมด',
            actions: [
              {
                label: 'ตกลง',
                onClick: () => setActiveModal(null)
              }
            ]
          });
        }
      }
      initLoadAllbranch()
    }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [])

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
          branchFile={branchFile}
        />
      )}

      <DataTable
        getThemeClasses={getThemeClasses}
        currentTheme={currentTheme}
        filteredSales={filteredSales}
        handleReviewSale={handleReviewSale}
        handleEditSale={handleEditSale}
        handleDeleteSale={handleDeleteSale}
        searchCriteria={searchCriteria}
        resetSearch={resetSearch}
        isLoading={isLoading}
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
          filteredProducts={searchResults}
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
          discount={discount}
          setDiscount={setDiscount}
          calculateDiscount={calculateDiscount}
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
            if (activeModal?.onConfirm) {
              activeModal.onConfirm()
            } else {
              setActiveModal(null)
            }
          }}
        />
      )}
    </div>
  );
};

export default Sales;