'use client';

import React, { useState, useEffect, useCallback } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { PlusCircle, Trash2 } from 'lucide-react';
import { isTableInputSchema, isStructuredListSchema } from '../../types';
import { useAnswers } from '@/shared/hooks/useAnswerHooks';
import useAnswerStore from '@/shared/store/answerStore';

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

// 단순 텍스트 입력 컴포넌트 (순수 제어 컴포넌트)
const TextInputField = React.memo(({ value, onChange, placeholder, className, type = "text" }: {
  value: any;
  onChange?: (value: any) => void;
  placeholder: string;
  className: string;
  type?: string;
}) => {
  return (
    <input
      type={type}
      className={className}
      placeholder={placeholder}
      value={value || ''}
      onChange={(e) => onChange?.(e.target.value)}
    />
  );
});

// 텍스트 영역 컴포넌트 (순수 제어 컴포넌트)
const TextareaField = React.memo(({ value, onChange, placeholder, className }: {
  value: any;
  onChange?: (value: any) => void;
  placeholder: string;
  className: string;
}) => {
  return (
    <TextareaAutosize
      minRows={3}
      maxRows={15}
      className={className}
      placeholder={placeholder}
      value={value || ''}
      onChange={(e) => onChange?.(e.target.value)}
    />
  );
});

// 내부 TableInputRenderer 컴포넌트 (상태 관리의 주체)
const InlineTableInputRenderer = ({ requirement }: any) => {
  const { currentAnswers, updateCurrentAnswer } = useAnswerStore();
  const globalValue = currentAnswers[requirement.requirement_id];

  const [rows, setRows] = useState(() => (Array.isArray(globalValue) ? globalValue : [{}]));
  
  // 1. 전역 상태 -> 로컬 상태 동기화
  useEffect(() => {
    const safeGlobalValue = Array.isArray(globalValue) ? globalValue : [{}];
    if (JSON.stringify(safeGlobalValue) !== JSON.stringify(rows)) {
      setRows(safeGlobalValue);
    }
  }, [globalValue]);

  // 2. 로컬 상태 -> 전역 상태 디바운스 업데이트
  useEffect(() => {
    if (globalValue === undefined && rows.length === 1 && Object.keys(rows[0]).length === 0) {
      return;
    }
    if (JSON.stringify(rows) === JSON.stringify(globalValue)) {
      return;
    }

    const handler = setTimeout(() => {
      console.log(`[Debounce] Saving table_input for ${requirement.requirement_id}...`);
      updateCurrentAnswer(requirement.requirement_id, rows);
    }, 800);

    return () => clearTimeout(handler);
  }, [rows, requirement.requirement_id, globalValue, updateCurrentAnswer]);

    const handleInputChange = (rowIndex: number, fieldName: string, newValue: any) => {
      const newRows = [...rows];
      newRows[rowIndex] = { ...newRows[rowIndex], [fieldName]: newValue };
      setRows(newRows);
    };

    const addRow = () => {
    // 🚨 새로운 행에 고유 ID 부여
    const newRows = [...rows, { id: `temp_${Date.now()}` }];
      setRows(newRows);
    };

    const removeRow = (rowIndex: number) => {
      const newRows = rows.filter((_: any, i: number) => i !== rowIndex);
      setRows(newRows);
    };

    const inputSchema = requirement.input_schema || requirement.schema;
    if (!isTableInputSchema(inputSchema)) {
    return <div className="mt-2 p-4 bg-red-50 border border-red-200 rounded-md"><p className="text-red-600 text-sm">테이블 입력 스키마 정보가 없습니다.</p></div>;
    }

  // 동적 컬럼 생성 로직
  const staticColumns = inputSchema.columns || [];
  const dynamicColumns = (inputSchema.dynamic_columns_from || [])
    .map((dynamicColDef: any) => {
      const yearValue = currentAnswers[dynamicColDef.source_req_id];
      if (yearValue) {
        return {
          name: dynamicColDef.value_key,
          label: `${dynamicColDef.label_prefix || ''}${yearValue}${dynamicColDef.label_suffix || ''}`,
          type: 'text' 
        };
      }
      return null;
    })
    .filter(Boolean);

  const allColumns = [...staticColumns, ...dynamicColumns];

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
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작업</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rows.map((row: any, rowIndex: number) => (
              // 🚨 인덱스 대신 고유 ID를 key로 사용
              <tr key={row.id || rowIndex}>
                  {allColumns.map((col: any) => (
                    <td key={col.name} className="px-3 py-2 border-r border-gray-300">
                        <FieldRenderer
                          fieldSchema={col}
                          value={row[col.name]}
                          onChange={(newValue) => handleInputChange(rowIndex, col.name, newValue)}
                          className="text-sm"
                        />
                    </td>
                  ))}
                    <td className="px-3 py-2">
                  <button type="button" onClick={() => removeRow(rowIndex)} className="text-red-500 hover:text-red-700" disabled={rows.length <= 1}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      <button type="button" onClick={addRow} className="mt-2 flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800">
            <PlusCircle size={16} /> 행 추가
          </button>
      </div>
    );
  };

// 내부 StructuredListRenderer 컴포넌트 (상태 관리의 주체)
const InlineStructuredListRenderer = ({ requirement }: any) => {
  const { currentAnswers, updateCurrentAnswer } = useAnswerStore();
  const globalValue = currentAnswers[requirement.requirement_id];

  const [items, setItems] = useState(() => (Array.isArray(globalValue) ? globalValue : [{}]));

  // 1. 전역 상태 -> 로컬 상태 동기화
  useEffect(() => {
    const safeGlobalValue = Array.isArray(globalValue) ? globalValue : [{}];
    if (JSON.stringify(safeGlobalValue) !== JSON.stringify(items)) {
      setItems(safeGlobalValue);
    }
  }, [globalValue]);

  // 2. 로컬 상태 -> 전역 상태 디바운스 업데이트
    useEffect(() => {
    if (globalValue === undefined && items.length === 1 && Object.keys(items[0]).length === 0) {
      return;
    }
    if (JSON.stringify(items) === JSON.stringify(globalValue)) {
      return;
      }
    const handler = setTimeout(() => {
      console.log(`[Debounce] Saving structured_list for ${requirement.requirement_id}...`);
      updateCurrentAnswer(requirement.requirement_id, items);
    }, 800);
    return () => clearTimeout(handler);
  }, [items, requirement.requirement_id, globalValue, updateCurrentAnswer]);


    const handleFieldChange = (itemIndex: number, fieldName: string, newValue: any) => {
    const newItems = [...items];
      newItems[itemIndex] = { ...newItems[itemIndex], [fieldName]: newValue };
      setItems(newItems);
    };

    const addItem = () => {
    // 🚨 새로운 항목에 고유 ID 부여
    const newItems = [...items, { id: `item_${Date.now()}` }];
      setItems(newItems);
    };

    const removeItem = (itemIndex: number) => {
      const newItems = items.filter((_: any, i: number) => i !== itemIndex);
      setItems(newItems);
    };

    const inputSchema = requirement.input_schema || requirement.schema;
    if (!isStructuredListSchema(inputSchema)) {
    return <div className="mt-2 p-4 bg-red-50 border border-red-200 rounded-md"><p className="text-red-600 text-sm">구조화된 리스트 스키마 정보가 없습니다.</p></div>;
    }

    return (
      <div className="mt-2">
        <div className="space-y-4">
        {items.map((item: any, itemIndex: number) => (
          // 🚨 인덱스 대신 고유 ID를 key로 사용
          <div key={item.id || itemIndex} className="border border-gray-200 rounded-md p-4">
                <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-medium text-gray-900">{`${inputSchema.item_label || '항목'} ${itemIndex + 1}`}</h4>
              <button type="button" onClick={() => removeItem(itemIndex)} className="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm" disabled={items.length <= 1}>
                <Trash2 size={16} /> 항목 삭제
                    </button>
                </div>
                <div className="space-y-4">
              {inputSchema.fields.map((field: any) => (
                    <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
                  {field.guidance && <p className="text-xs text-gray-500 mb-2">{field.guidance}</p>}
                      <FieldRenderer
                        fieldSchema={field}
                        value={item[field.name]}
                        onChange={(newValue) => handleFieldChange(itemIndex, field.name, newValue)}
                      />
                    </div>
                  ))}
                </div>
              </div>
        ))}
        </div>
      <button type="button" onClick={addItem} className="mt-4 w-full py-2 px-4 border border-dashed border-gray-300 rounded-md text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2">
        <PlusCircle size={16} /> 새 항목 추가
          </button>
      </div>
    );
};

/**
 * FieldRenderer: 다양한 타입의 필드를 렌더링하는 핵심 컴포넌트
 * 이 컴포넌트는 `data_required_type`에 따라 적절한 렌더러를 선택하여 렌더링합니다.
 */
export function FieldRenderer({ fieldSchema, value, onChange, className = "" }: FieldRendererProps) {
  // 렌더링 타입을 결정합니다. 이제 `data_required_type`을 사용합니다.
  const type = fieldSchema.data_required_type;

  // 특수 input_type에 대한 렌더러 분기
  switch (type) {
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
    case 'table_input':
      return <InlineTableInputRenderer requirement={fieldSchema} />;
    case 'structured_list':
      return <InlineStructuredListRenderer requirement={fieldSchema} />;
  }

  // 기본 렌더러 분기 (data_required_type이 지정되지 않은 경우)
  const schema = fieldSchema.input_schema || fieldSchema;
  const placeholder = schema.placeholder || fieldSchema.input_placeholder_ko || "내용을 입력해주세요.";
  const defaultType = schema.type || "text";

  switch (defaultType) {
    case "textarea":
      return <TextareaField value={value} onChange={onChange} placeholder={placeholder} className={`w-full p-2 border border-gray-300 rounded-md text-sm resize-none ${className}`} />;
    
    case "number":
      return <TextInputField value={value} onChange={onChange} placeholder={placeholder} className={`w-full p-2 border border-gray-300 rounded-md text-sm ${className}`} type="number" />;

    case "text":
    default:
      return <TextInputField value={value} onChange={onChange} placeholder={placeholder} className={`w-full p-2 border border-gray-300 rounded-md text-sm ${className}`} />;
  }
}

/**
 * RequirementInputForm: 이 컴포넌트는 컨트롤러 역할을 하며, 상태 관리의 주체입니다.
 * 외부에서는 이 컴포넌트에게 requirement 객체만 넘겨주면 됩니다.
 */
export const RequirementInputForm = ({ requirement, className }: { requirement: any, className?: string }) => {
  const { updateCurrentAnswer } = useAnswerStore();

  const handleSimpleChange = (newValue: any) => {
    updateCurrentAnswer(requirement.requirement_id, newValue);
  };
  
  const { currentAnswers } = useAnswers();
  const value = currentAnswers[requirement.requirement_id];

  // 기본 렌더링 로직
  return (
    <FieldRenderer
      fieldSchema={requirement}
      value={value}
      onChange={handleSimpleChange}
      className={className}
    />
  );
} 