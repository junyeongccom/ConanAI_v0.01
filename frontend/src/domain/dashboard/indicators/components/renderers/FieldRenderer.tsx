'use client';

import React, { useState, useEffect } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { PlusCircle, Trash2 } from 'lucide-react';
import { isTableInputSchema, isStructuredListSchema } from '../../types';
import { useAnswers } from '@/shared/hooks/useAnswerHooks';

// 지표 및 목표 파트의 전용 렌더러들 import
import { GhgEmissionsInputRenderer } from './metrics/GhgEmissionsInputRenderer';
import { GhgGuidelineInputRenderer } from './metrics/GhgGuidelineInputRenderer';
import { GhgGasesInputRenderer } from './metrics/GhgGasesInputRenderer';
import { GhgScope12ApproachInputRenderer } from './metrics/GhgScope12ApproachInputRenderer';
import { GhgScope3ApproachInputRenderer } from './metrics/GhgScope3ApproachInputRenderer';
import { PerformanceTrackingInputRenderer } from './metrics/PerformanceTrackingInputRenderer';
import { InternalCarbonPriceInputRenderer } from './metrics/InternalCarbonPriceInputRenderer';

interface FieldRendererProps {
  fieldSchema: any;
  value: any;
  onChange: (value: any) => void;
  className?: string;
}

// 단순 텍스트 입력 컴포넌트 (하이브리드 상태 패턴 적용)
function TextInputField({ value, onChange, placeholder, className, type = "text" }: {
  value: any;
  onChange: (value: any) => void;
  placeholder: string;
  className: string;
  type?: string;
}) {
  const [localValue, setLocalValue] = useState(value || '');

  // 전역 상태 -> 로컬 상태 동기화
  useEffect(() => {
    const globalValue = value || '';
    if (globalValue !== localValue) {
      setLocalValue(globalValue);
    }
  }, [value]);

  // 로컬 상태 -> 전역 상태 동기화 (디바운싱)
  useEffect(() => {
    if (localValue === (value || '')) {
      return;
    }

    const handler = setTimeout(() => {
      console.log('[Debounce] Saving text input...');
      onChange(localValue);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [localValue, onChange, value]);

  return (
    <input
      type={type}
      className={className}
      placeholder={placeholder}
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
    />
  );
}

// 텍스트 영역 컴포넌트 (하이브리드 상태 패턴 적용)
function TextareaField({ value, onChange, placeholder, className }: {
  value: any;
  onChange: (value: any) => void;
  placeholder: string;
  className: string;
}) {
  const [localValue, setLocalValue] = useState(value || '');

  // 전역 상태 -> 로컬 상태 동기화
  useEffect(() => {
    const globalValue = value || '';
    if (globalValue !== localValue) {
      setLocalValue(globalValue);
    }
  }, [value]);

  // 로컬 상태 -> 전역 상태 동기화 (디바운싱)
  useEffect(() => {
    if (localValue === (value || '')) {
      return;
    }

    const handler = setTimeout(() => {
      console.log('[Debounce] Saving textarea...');
      onChange(localValue);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [localValue, onChange, value]);

  return (
    <TextareaAutosize
      minRows={3}
      maxRows={15}
      className={className}
      placeholder={placeholder}
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
    />
  );
}

/**
 * 모든 타입의 필드를 렌더링하는 중앙 허브 역할을 하는 컴포넌트입니다.
 * 재귀적으로 자기 자신을 호출하여 중첩된 복합 타입도 처리할 수 있습니다.
 */
export function FieldRenderer({ fieldSchema, value, onChange, className = "" }: FieldRendererProps) {
  // fieldSchema에서 직접 타입을 가져오거나, 최상위 requirement 객체에서 가져옵니다.
  let type = fieldSchema.type || fieldSchema.data_required_type;
  const placeholder = fieldSchema.placeholder || fieldSchema.input_placeholder_ko || '';
  
  // 스키마 구조 기반 타입 자동 감지 (백엔드 타입이 잘못된 경우 대응)
  if (fieldSchema.input_schema) {
    const schema = fieldSchema.input_schema;
    
    // 타입별 스키마 구조 감지
    if (type === 'ghg_emissions_input') {
      // rows + value_column 구조이면서 categories가 없으면 ghg_guideline_input
      if (schema.rows && schema.value_column && !schema.categories) {
        type = 'ghg_guideline_input';
        console.log('🔄 타입 자동 수정: ghg_emissions_input → ghg_guideline_input (rows + value_column 구조 감지)');
      }
      // categories가 있고 rows가 없으면 진짜 ghg_emissions_input
      else if (schema.categories && !schema.rows) {
        console.log('✅ 올바른 ghg_emissions_input 구조 확인 (categories 배열 존재)');
      }
    }
  }
  
  console.log(`🎨 FieldRenderer: type=${type}, fieldSchema=`, fieldSchema);
  console.log(`🎨 FieldRenderer: 입력받은 타입: ${fieldSchema.type || fieldSchema.data_required_type}`);
  console.log(`🎨 FieldRenderer: 최종 선택된 타입: ${type}`);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  const commonInputProps = {
    className: `w-full p-2 border border-gray-300 rounded-md text-sm ${className}`,
    placeholder,
  };

  // 내부 TableInputRenderer 컴포넌트
  const InlineTableInputRenderer = ({ requirement, value, onChange }: any) => {
    const { currentAnswers } = useAnswers();
    
    const initialData = (() => {
      return Array.isArray(value) && value.length > 0 ? value : [{}];
    })();
    
    const [rows, setRows] = useState(initialData);

    useEffect(() => {
      if (Array.isArray(value) && value.length > 0) {
        setRows(value);
      }
    }, [value]);

    // 개별 필드의 onChange 이벤트 핸들러 (디바운싱은 하위 FieldRenderer에서 처리)
    const handleInputChange = (rowIndex: number, fieldName: string, newValue: any) => {
      const newRows = [...rows];
      newRows[rowIndex] = { ...newRows[rowIndex], [fieldName]: newValue };
      setRows(newRows);
      // 즉시 상위 컴포넌트에 변경사항 전달
      onChange(newRows);
    };

    const addRow = () => {
      const newRows = [...rows, {}];
      setRows(newRows);
      onChange(newRows);
    };

    const removeRow = (rowIndex: number) => {
      const newRows = rows.filter((_: any, i: number) => i !== rowIndex);
      setRows(newRows);
      onChange(newRows);
    };

    const inputSchema = requirement.input_schema || requirement.schema;
    if (!isTableInputSchema(inputSchema)) {
      return (
        <div className="mt-2 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">테이블 입력 스키마 정보가 없습니다.</p>
        </div>
      );
    }

    // 동적 컬럼 생성
    const dynamicColumns: any[] = [];
    console.log('🔍 Dynamic columns debug:', {
      hasDynamicConfig: !!(inputSchema as any).dynamic_columns_from,
      dynamicConfig: (inputSchema as any).dynamic_columns_from,
      allAnswers: currentAnswers
    });

    // 동적 컬럼 생성 로직
    if ((inputSchema as any).dynamic_columns_from) {
      const sourceRequirementId = (inputSchema as any).dynamic_columns_from;
      const sourceData = currentAnswers[sourceRequirementId];
      
      console.log('🔍 Dynamic columns source data:', {
        sourceRequirementId,
        sourceData
      });

      if (Array.isArray(sourceData)) {
        sourceData.forEach((item: any, index: number) => {
          if (item && typeof item === 'object') {
            const columnName = item.target_name || item.name || item.label || `항목_${index + 1}`;
            dynamicColumns.push({
              name: `dynamic_${index}`,
              label: columnName,
              type: 'text',
              is_dynamic: true
            });
          }
        });
      }
    }

    const allColumns = [...(inputSchema.columns || []), ...dynamicColumns];
    const shouldCreateDynamicRows = dynamicColumns.length > 0 && rows.length === 1 && Object.keys(rows[0]).length === 0;

    // 동적 행 생성
    if (shouldCreateDynamicRows) {
      const newRows = dynamicColumns.map((_, index) => {
        const newRow: any = {};
        allColumns.forEach(col => {
          if (col.is_dynamic) {
            newRow[col.name] = col.label;
          }
        });
        return newRow;
      });
      setRows(newRows);
      onChange(newRows);
    }

    return (
      <div className="mt-2">
        <div className="overflow-x-auto border border-gray-300 rounded-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {allColumns.map((col: any) => (
                  <th key={col.name} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">
                    {col.label}
                    {col.required && <span className="text-red-500 ml-1">*</span>}
                  </th>
                ))}
                {!shouldCreateDynamicRows && (
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    작업
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rows.map((row: any, rowIndex: number) => (
                <tr key={rowIndex}>
                  {allColumns.map((col: any) => (
                    <td key={col.name} className="px-3 py-2 border-r border-gray-300">
                      {/* 동적 행에서 is_dynamic 컬럼 또는 is_readonly 컬럼은 읽기 전용 */}
                      {((col.is_dynamic && shouldCreateDynamicRows) || col.is_readonly) ? (
                        <div className="px-2 py-1 text-sm text-gray-700 bg-gray-50 rounded">
                          {row[col.name]}
                        </div>
                      ) : (
                        <FieldRenderer
                          fieldSchema={col}
                          value={row[col.name]}
                          onChange={(newValue) => handleInputChange(rowIndex, col.name, newValue)}
                          className="text-sm"
                        />
                      )}
                    </td>
                  ))}
                  {!shouldCreateDynamicRows && (
                    <td className="px-3 py-2">
                      <button
                        type="button"
                        onClick={() => removeRow(rowIndex)}
                        className="text-red-500 hover:text-red-700"
                        disabled={rows.length <= 1}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!shouldCreateDynamicRows && (
          <button
            type="button"
            onClick={addRow}
            className="mt-2 flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
          >
            <PlusCircle size={16} /> 행 추가
          </button>
        )}
      </div>
    );
  };

  // 내부 StructuredListRenderer 컴포넌트
  const InlineStructuredListRenderer = ({ requirement, value, onChange }: any) => {
    const { currentAnswers } = useAnswers();
    
    const initialData = (() => {
      return Array.isArray(value) && value.length > 0 ? value : [{}];
    })();
    
    const [items, setItems] = useState(initialData);

    useEffect(() => {
      if (Array.isArray(value) && value.length > 0) {
        setItems(value);
      }
    }, [value]);

    // 개별 필드의 onChange 이벤트 핸들러 (디바운싱은 하위 FieldRenderer에서 처리)
    const handleFieldChange = (itemIndex: number, fieldName: string, newValue: any) => {
      const newItems = shouldUseDynamicItems ? [...finalItems] : [...items];
      newItems[itemIndex] = { ...newItems[itemIndex], [fieldName]: newValue };
      setItems(newItems);
      // 즉시 상위 컴포넌트에 변경사항 전달
      onChange(newItems);
    };

    const addItem = () => {
      const newItems = [...items, {}];
      setItems(newItems);
      onChange(newItems);
    };

    const removeItem = (itemIndex: number) => {
      const newItems = items.filter((_: any, i: number) => i !== itemIndex);
      setItems(newItems);
      onChange(newItems);
    };

    const inputSchema = requirement.input_schema || requirement.schema;
    if (!isStructuredListSchema(inputSchema)) {
      return (
        <div className="mt-2 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">구조화된 리스트 스키마 정보가 없습니다.</p>
        </div>
      );
    }

    // 동적 항목 생성: source_requirement가 있으면 해당 답변에서 데이터를 가져와서 항목 생성
    let dynamicItemLabels: any[] = [];
    const shouldUseDynamicItems = !!(inputSchema as any).source_requirement;

    if (shouldUseDynamicItems) {
      const sourceRequirementId = (inputSchema as any).source_requirement;
      const sourceData = currentAnswers[sourceRequirementId];
      
      if (Array.isArray(sourceData)) {
        dynamicItemLabels = sourceData.map((item: any, index: number) => {
          if (item && typeof item === 'object') {
            return item.target_name || item.name || item.label || `항목 ${index + 1}`;
          }
          return `항목 ${index + 1}`;
        });
      }
    }

    const finalItems = shouldUseDynamicItems ? 
      (dynamicItemLabels.length > 0 ? dynamicItemLabels.map((_, index) => items[index] || {}) : [{}]) : 
      items;

    return (
      <div className="mt-2">
        <div className="space-y-4">
          {finalItems.map((item: any, itemIndex: number) => {
            const itemLabel = shouldUseDynamicItems ? 
              (dynamicItemLabels[itemIndex] || `항목 ${itemIndex + 1}`) : 
              `${(inputSchema as any).item_label || '항목'} ${itemIndex + 1}`;

            return (
              <div key={itemIndex} className="border border-gray-200 rounded-md p-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-medium text-gray-900">{itemLabel}</h4>
                  {!shouldUseDynamicItems && (
                    <button
                      type="button"
                      onClick={() => removeItem(itemIndex)}
                      className="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm"
                      disabled={finalItems.length <= 1}
                    >
                      <Trash2 size={16} />
                      항목 삭제
                    </button>
                  )}
                </div>
                <div className="space-y-4">
                  {inputSchema.fields.map((field: any, fieldIndex: number) => (
                    <div key={field.name}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {field.label}
                      </label>
                      {field.guidance && (
                        <p className="text-xs text-gray-500 mb-2">{field.guidance}</p>
                      )}
                      {/* 재귀적 렌더링을 위해 FieldRenderer 사용하되, onChange 기반으로 처리 */}
                      <FieldRenderer
                        fieldSchema={field}
                        value={item[field.name]}
                        onChange={(newValue) => handleFieldChange(itemIndex, field.name, newValue)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        {!shouldUseDynamicItems && (
          <button
            type="button"
            onClick={addItem}
            className="mt-4 w-full py-2 px-4 border border-dashed border-gray-300 rounded-md text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
          >
            <PlusCircle size={16} />
            새 항목 추가
          </button>
        )}
      </div>
    );
  };

  switch (type) {
    // 기존 기본 타입들
    case 'table_input':
      return <InlineTableInputRenderer requirement={fieldSchema} value={value} onChange={onChange} />;

    case 'structured_list':
      return <InlineStructuredListRenderer requirement={fieldSchema} value={value} onChange={onChange} />;

    case 'text_long':
      return (
        <TextareaField
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full p-2 border border-gray-300 rounded-md text-sm resize-none ${className}`}
        />
      );

    case 'number':
      return (
        <TextInputField
          type="number"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={commonInputProps.className}
        />
      );

    case 'date':
      return (
        <input
          type="date"
          className={commonInputProps.className}
          value={value || ''}
          onChange={handleChange}
        />
      );

    case 'select':
      if (fieldSchema.options && Array.isArray(fieldSchema.options)) {
        return (
          <select
            className={`w-full p-2 border border-gray-300 rounded-md text-sm ${className}`}
            value={value || ''}
            onChange={handleChange}
          >
            <option value="">선택하세요</option>
            {fieldSchema.options.map((option: string) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      }
      // options가 없으면 일반 텍스트 입력으로 fallback
      return (
        <TextInputField
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={commonInputProps.className}
        />
      );

    case 'boolean':
      return (
        <div className="flex items-center">
          <input
            type="checkbox"
            className="mr-2 rounded border-gray-300 text-blue-600"
            checked={value === true || value === 'true'}
            onChange={(e) => onChange(e.target.checked)}
          />
          <span className="text-sm text-gray-700">예 / 아니오</span>
        </div>
      );

    // --- 지표 및 목표 파트의 전용 타입들 ---
    case 'ghg_emissions_input':
      return <GhgEmissionsInputRenderer requirement={fieldSchema} />;

    case 'ghg_guideline_input':
      return <GhgGuidelineInputRenderer requirement={fieldSchema} />;

    case 'ghg_gases_input':
      return <GhgGasesInputRenderer requirement={fieldSchema} />;

    case 'ghg_scope12_approach_input':
      return <GhgScope12ApproachInputRenderer requirement={fieldSchema} />;

    case 'ghg_scope3_approach_input':
      return <GhgScope3ApproachInputRenderer requirement={fieldSchema} />;

    case 'performance_tracking_input':
      return <PerformanceTrackingInputRenderer requirement={fieldSchema} />;

    case 'internal_carbon_price_input':
      return <InternalCarbonPriceInputRenderer requirement={fieldSchema} />;

    // 기본 텍스트 입력 (fallback)
    default:
      return (
        <TextInputField
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={commonInputProps.className}
        />
      );
  }
} 