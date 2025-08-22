import { useState, useEffect, useContext, useRef } from 'react';
import { 
  Plus, 
  Upload,
  Search} from 'lucide-react';

import { getThemeClasses } from '../../utils/themes';
import { AppContext } from '../../contexts';
import { loadReportAllDraftSale } from '../../api/saleApi';
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
    billNo: '',
    dateFrom: '',
    dateTo: '',
    branchCodeFrom: '',
    branchCodeTo: '',
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

 
  const initLoadData = async () => {
    try {
      setIsLoading(true)

      const { data, error } = await loadReportAllDraftSale()

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

  const handleSearch = () => {
    let filtered = [...draftSale];

    if (searchCriteria.billNo.trim()) {
      filtered = filtered.filter(item => 
        item.billno.toLowerCase().includes(searchCriteria.billNo.toLowerCase())
      );
    }

    if (searchCriteria.dateFrom) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.document_date);
        const fromDate = new Date(searchCriteria.dateFrom);
        // เปรียบเทียบเฉพาะวันที่โดยไม่รวมเวลา
        return new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate()) >= 
               new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
      });
    }

    if (searchCriteria.dateTo) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.document_date);
        const toDate = new Date(searchCriteria.dateTo);
        // เปรียบเทียบเฉพาะวันที่โดยไม่รวมเวลา
        return new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate()) <= 
               new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate());
      });
    }

    // กรองตามช่วงสาขา
    if (searchCriteria.branchCodeFrom || searchCriteria.branchCodeTo) {
      filtered = filtered.filter(item => {
        const branchCode = item.branch_code;
        
        // ถ้ามีทั้งสาขาเริ่มต้นและสิ้นสุด
        if (searchCriteria.branchCodeFrom && searchCriteria.branchCodeTo) {
          return branchCode >= searchCriteria.branchCodeFrom && branchCode <= searchCriteria.branchCodeTo;
        }
        
        // ถ้ามีเฉพาะสาขาเริ่มต้น
        if (searchCriteria.branchCodeFrom) {
          return branchCode >= searchCriteria.branchCodeFrom;
        }
        
        // ถ้ามีเฉพาะสาขาสิ้นสุด
        if (searchCriteria.branchCodeTo) {
          return branchCode <= searchCriteria.branchCodeTo;
        }
        
        return true;
      });
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
      branchCodeFrom: '',
      branchCodeTo: '',
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className={`text-2xl font-bold ${getThemeClasses('textPrimary', currentTheme)}`}>รายงานการเปิดบิลด้วยมือ</h1>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button 
            onClick={() => setShowSearchForm(!showSearchForm)}
            className={`text-white px-4 py-2 rounded-lg font-medium bg-gray-500 hover:bg-gray-600 hover:shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out flex items-center`}
          >
            <Search className="w-4 h-4 mr-2" />
            {showSearchForm ? 'ซ่อนการค้นหา' : 'ค้นหา'}
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
        searchCriteria={searchCriteria}
        resetSearch={resetSearch}
        isLoading={isLoading}
      />

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