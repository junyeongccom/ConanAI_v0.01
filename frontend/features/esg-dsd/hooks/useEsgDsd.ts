import { useEsgDsdStore } from '../store/useEsgDsdStore';

export function useEsgDsd() {
  const { 
    file, 
    fileName, 
    pageNum, 
    extractedText, 
    loading, 
    error, 
    setFile, 
    setPageNum, 
    extract 
  } = useEsgDsdStore();
  
  return { 
    file, 
    fileName, 
    pageNum, 
    extractedText, 
    loading, 
    error, 
    setFile, 
    setPageNum, 
    extract 
  };
} 