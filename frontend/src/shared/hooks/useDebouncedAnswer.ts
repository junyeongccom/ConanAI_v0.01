import { useState, useEffect, useCallback } from 'react';
import useAnswerStore from '@/shared/store/answerStore';
import { shallow } from 'zustand/shallow';

export function useDebouncedAnswer(requirementId: string, updateCurrentAnswer: (id: string, value: any) => void) {
  
  const debouncedUpdate = useCallback(
    (value: any) => {
      const handler = setTimeout(() => {
        console.log(`[Debounce] Saving ${requirementId}...`);
        updateCurrentAnswer(requirementId, value);
      }, 800);

      return () => {
        clearTimeout(handler);
      };
    },
    [requirementId, updateCurrentAnswer]
  );

  return debouncedUpdate;
} 