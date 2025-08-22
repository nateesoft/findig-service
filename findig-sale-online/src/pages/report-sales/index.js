import { useState, useEffect, useContext, useRef } from 'react';
import { Search} from 'lucide-react';

import { getThemeClasses } from '../../utils/themes';
import { AppContext } from '../../contexts';
import SearchForm from './SearchForm';
import DataTable from './DataTable';
import { Modal } from '../../components/Modals';
import { loadAllBranch } from '../../api/branchApi';
import { loadSaleReport } from '../../api/reportApi';

const Sales = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [branchFile, setBranchFile] = useState([])

  const { appData } = useContext(AppContext)
  const { currentTheme, branchCode } = appData

  const [draftSale, setDraftSale] = useState([])
  const [filteredSales, setFilteredSales] = useState([])
  const [showSearchForm, setShowSearchForm] = useState(true);
  
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef(null);
  
  const [searchCriteria, setSearchCriteria] = useState({
    billNo: '',
    document_date_Start: '',
    document_date_End: '',
    empCode: '',
    branch_code_Start: branchCode || '',
    branch_code_End: branchCode || ''
  });

  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [selectedProductIndex, setSelectedProductIndex] = useState(-1);

  const [productList, setProductList] = useState([])
  
  const autocompleteRef = useRef(null);
 
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

  const handleSearch = async () => {
    try {
      // สร้าง AbortController ใหม่และยกเลิก request เดิม (ถ้ามี)
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();
      
      setIsLoading(true);
      
      const { data, error } = await loadSaleReport()

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
    } catch (err) {
      if (err.name !== 'AbortError') {
        setActiveModal({
          type: 'error',
          title: 'ไม่สามารถค้นหาได้',
          message: 'เกิดข้อผิดพลาดในการค้นหา',
          actions: [
            {
              label: 'ตกลง',
              onClick: () => setActiveModal(null)
            }
          ]
        });
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleCancelSearch = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
    }
  };

  const resetSearch = () => {
    setSearchCriteria({
      billNo: '',
      document_date_Start: '',
      document_date_End: '',
      empCode: '',
      branch_code_Start: branchCode || '',
      branch_code_End: branchCode || ''
    });
    setFilteredSales(draftSale);
  };

  useEffect(() => {
    setFilteredSales(draftSale);
  }, [draftSale]);

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
          handleCancelSearch={handleCancelSearch}
          isLoading={isLoading}
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