'use client';

import React, { useState, useEffect } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { PlusCircle, Trash2 } from 'lucide-react';
import { isTableInputSchema, isStructuredListSchema } from '../../types';

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
  const type = fieldSchema.type || fieldSchema.data_required_type;
  const placeholder = fieldSchema.placeholder || fieldSchema.input_placeholder_ko || '';
  
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

    return (
      <div className="mt-2">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
            <thead className="bg-gray-50">
              <tr>
                {inputSchema.columns.map((col: any) => (
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
                  {inputSchema.columns.map((col: any) => (
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
      const newItems = [...items];
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

    return (
      <div className="mt-2">
        <div className="space-y-4">
          {items.map((item: any, itemIndex: number) => (
            <div key={itemIndex} className="p-4 border border-gray-300 rounded-md bg-gray-50">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-medium text-gray-700">항목 {itemIndex + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeItem(itemIndex)}
                  className="text-red-500 hover:text-red-700"
                  disabled={items.length <= 1}
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="space-y-3">
                {inputSchema.fields.map((field: any) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      {field.label}
                    </label>
                    {field.guidance && (
                      <p className="text-xs text-gray-500 mt-0.5 mb-2">{field.guidance}</p>
                    )}
                    {/* 재귀적 렌더링을 위해 FieldRenderer 사용하되, onBlur 기반으로 처리 */}
                    <FieldRenderer
                      fieldSchema={field}
                      value={item[field.name]}
                      onChange={(newValue) => handleFieldBlur(itemIndex, field.name, newValue)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addItem}
          className="mt-3 flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
        >
          <PlusCircle size={16} /> 항목 추가
        </button>
      </div>
    );
  };

  switch (type) {
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