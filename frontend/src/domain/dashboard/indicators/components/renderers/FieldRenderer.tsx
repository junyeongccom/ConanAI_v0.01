'use client';

import React, { useState, useEffect } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { PlusCircle, Trash2, InformationCircleIcon } from 'lucide-react';
import { isTableInputSchema, isStructuredListSchema } from '../../types';
import { useAnswerStore } from '../../stores/answerStore';
import { MetricInputCard } from '../MetricInputCard';

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

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  const commonInputProps = {
    className: `w-full p-2 border border-gray-300 rounded-md text-sm ${className}`,
    placeholder,
    defaultValue: value || '',
    onBlur: handleBlur,
  };

  // 내부 TableInputRenderer 컴포넌트
  const InlineTableInputRenderer = ({ requirement, value, onChange }: any) => {
    const { answers } = useAnswerStore();
    
    const initialData = (() => {
      return Array.isArray(value) && value.length > 0 ? value : [{}];
    })();
    
    const [rows, setRows] = useState(initialData);

    useEffect(() => {
      if (Array.isArray(value) && value.length > 0) {
        setRows(value);
      }
    }, [value]);

    // 개별 필드의 onBlur 이벤트 핸들러
    const handleInputBlur = (rowIndex: number, fieldName: string, newValue: any) => {
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
          <p className="text-red-600 text-sm">테이블 스키마 정보가 없습니다.</p>
        </div>
      );
    }

    // 동적 컬럼 생성
    const dynamicColumns = [];
    console.log('🔍 Dynamic columns debug:', {
      hasDynamicConfig: !!inputSchema.dynamic_columns_from,
      dynamicConfig: inputSchema.dynamic_columns_from,
      allAnswers: answers
    });
    
    if (inputSchema.dynamic_columns_from && Array.isArray(inputSchema.dynamic_columns_from)) {
      for (const dynamicCol of inputSchema.dynamic_columns_from) {
        // 답변 구조에 맞게 수정: answers[id]?.answer_value 또는 answers[id] 직접 접근
        const answerData = answers[dynamicCol.source_req_id];
        const sourceAnswer = answerData?.answer_value || answerData;
        
        console.log(`🔍 Checking ${dynamicCol.source_req_id}:`, {
          answerData,
          sourceAnswer,
          type: typeof sourceAnswer,
          trimmed: sourceAnswer?.toString?.()?.trim?.()
        });
        
        if (sourceAnswer && String(sourceAnswer).trim()) {
          const newColumn = {
            name: dynamicCol.value_key,
            type: 'text',
            label: `${dynamicCol.label_prefix}${String(sourceAnswer)}${dynamicCol.label_suffix}`
          };
          console.log('✅ Adding dynamic column:', newColumn);
          dynamicColumns.push(newColumn);
        }
      }
    }
    
    console.log('🎯 Final dynamic columns:', dynamicColumns);

    // 전체 컬럼 = 기본 컬럼 + 동적 컬럼
    const allColumns = [...inputSchema.columns, ...dynamicColumns];

    return (
      <div className="mt-2">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
            <thead className="bg-gray-50">
              <tr>
                {allColumns.map((col: any) => (
                  <th
                    key={col.name}
                    className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300"
                  >
                    {col.label}
                  </th>
                ))}
                <th className="w-10 px-3 py-2"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rows.map((row: any, rowIndex: number) => (
                <tr key={rowIndex}>
                  {allColumns.map((col: any) => (
                    <td key={col.name} className="px-3 py-2 border-r border-gray-300">
                      {/* 재귀적 렌더링을 위해 FieldRenderer 사용하되, onBlur 기반으로 처리 */}
                      <FieldRenderer
                        fieldSchema={col}
                        value={row[col.name]}
                        onChange={(newValue) => handleInputBlur(rowIndex, col.name, newValue)}
                        className="text-sm"
                      />
                    </td>
                  ))}
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          type="button"
          onClick={addRow}
          className="mt-2 flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
        >
          <PlusCircle size={16} /> 행 추가
        </button>
      </div>
    );
  };

  // 내부 StructuredListRenderer 컴포넌트
  const InlineStructuredListRenderer = ({ requirement, value, onChange }: any) => {
    const { answers } = useAnswerStore();
    
    const initialData = (() => {
      return Array.isArray(value) && value.length > 0 ? value : [{}];
    })();
    
    const [items, setItems] = useState(initialData);

    useEffect(() => {
      if (Array.isArray(value) && value.length > 0) {
        setItems(value);
      }
    }, [value]);

    // 개별 필드의 onBlur 이벤트 핸들러
    const handleFieldBlur = (itemIndex: number, fieldName: string, newValue: any) => {
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
    let dynamicItemLabels = [];
    if (inputSchema.source_requirement && inputSchema.source_field_to_display) {
      const sourceAnswerData = answers[inputSchema.source_requirement];
      const sourceAnswer = sourceAnswerData?.answer_value || sourceAnswerData;
      
      console.log('🔍 Dynamic items debug:', {
        sourceRequirement: inputSchema.source_requirement,
        sourceFieldToDisplay: inputSchema.source_field_to_display,
        sourceAnswerData,
        sourceAnswer
      });
      
      if (Array.isArray(sourceAnswer)) {
        // 각 행의 지정된 필드 값을 가져와서 항목 레이블로 사용
        dynamicItemLabels = sourceAnswer
          .map((row: any) => row[inputSchema.source_field_to_display])
          .filter((label: any) => label && String(label).trim());
        
        console.log('✅ Generated dynamic labels:', dynamicItemLabels);
      }
    }

    // 동적 항목이 있으면 그 개수만큼 items 초기화, 없으면 기본 1개
    const shouldUseDynamicItems = dynamicItemLabels.length > 0;
    const finalItems = shouldUseDynamicItems 
      ? dynamicItemLabels.map((label: string, index: number) => items[index] || {})
      : items;

    return (
      <div className="mt-2">
        {shouldUseDynamicItems && (
          <div className="mb-6 p-4 bg-sky-50 rounded-lg">
            <div className="flex items-start gap-3">
              <InformationCircleIcon className="w-5 h-5 text-sky-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-sky-800 mb-1">
                  목표지표별 진척도 모니터링
                </p>
                <p className="text-xs text-sky-700">
                  위에서 설정한 각 목표지표({dynamicItemLabels.length}개)에 대한 진척도 모니터링 정보를 입력해주세요.
                </p>
              </div>
            </div>
          </div>
        )}
                <div className="space-y-6">
          {finalItems.map((item: any, itemIndex: number) => {
            // 동적 레이블이 있으면 사용, 없으면 기본 레이블
            const itemLabel = shouldUseDynamicItems 
              ? `${dynamicItemLabels[itemIndex]}` 
              : `항목 ${itemIndex + 1}`;
              
            return (
              <MetricInputCard 
                key={itemIndex} 
                title={itemLabel} 
                isDynamic={shouldUseDynamicItems}
              >
                {!shouldUseDynamicItems && (
                  <div className="flex justify-end mb-4">
                    <button
                      type="button"
                      onClick={() => removeItem(itemIndex)}
                      className="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm"
                      disabled={finalItems.length <= 1}
                    >
                      <Trash2 size={16} />
                      항목 삭제
                    </button>
                  </div>
                )}
                
                <div className="space-y-6">
                  {inputSchema.fields.map((field: any, fieldIndex: number) => (
                    <div key={field.name}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {field.label}
                      </label>
                      {field.guidance && (
                        <p className="text-xs text-gray-500 mb-3">{field.guidance}</p>
                      )}
                      {/* 재귀적 렌더링을 위해 FieldRenderer 사용하되, onBlur 기반으로 처리 */}
                      <FieldRenderer
                        fieldSchema={field}
                        value={item[field.name]}
                        onChange={(newValue) => handleFieldBlur(itemIndex, field.name, newValue)}
                      />
                      {fieldIndex < inputSchema.fields.length - 1 && (
                        <hr className="border-gray-200 mt-6" />
                      )}
                    </div>
                  ))}
                </div>
              </MetricInputCard>
            );
          })}
        </div>
        {!shouldUseDynamicItems && (
          <div className="mt-6">
            <button
              type="button"
              onClick={addItem}
              className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <PlusCircle size={16} />
              새 항목 추가
            </button>
          </div>
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
        <TextareaAutosize
          minRows={3}
          maxRows={15}
          className={`w-full p-2 border border-gray-300 rounded-md text-sm resize-none ${className}`}
          placeholder={placeholder}
          defaultValue={value || ''}
          onBlur={handleBlur}
        />
      );

    case 'number':
      return (
        <input
          type="number"
          {...commonInputProps}
        />
      );

    case 'date':
      return (
        <input
          type="date"
          {...commonInputProps}
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
        <input
          type="text"
          {...commonInputProps}
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

    case 'text':
    default:
      return (
        <input
          type="text"
          {...commonInputProps}
        />
      );
  }
} 