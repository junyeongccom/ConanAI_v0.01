import { useFinancialDsdStore } from '../store/useFinancialDsdStore';

export function useFinancialDsd() {
  const { 
    tableData, 
    headers, 
    loading, 
    error, 
    fileName, 
    sheetName, 
    info, 
    setSheetName, 
    upload 
  } = useFinancialDsdStore();
  
  return { 
    tableData, 
    headers, 
    loading, 
    error, 
    fileName, 
    sheetName, 
    info, 
    setSheetName, 
    upload 
  };
} 