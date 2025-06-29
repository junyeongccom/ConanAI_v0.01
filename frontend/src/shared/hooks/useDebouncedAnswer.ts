import { useState, useEffect } from 'react';
import useAnswerStore from '@/shared/store/answerStore';

export function useDebouncedAnswer(requirementId: string): [any, (value: any) => void] {
  const { currentAnswers, updateCurrentAnswer } = useAnswerStore((state) => ({
    currentAnswers: state.currentAnswers,
    updateCurrentAnswer: state.updateCurrentAnswer,
  }));

  // 1. 해당 requirement의 전역 상태 값을 가져온다.
  const globalValue = currentAnswers[requirementId];

  // 2. UI의 즉각적인 반응을 위한 로컬 상태
  const [localValue, setLocalValue] = useState(globalValue);

  // 3. 전역 상태가 (외부 요인으로) 변경되면, 로컬 상태를 동기화한다.
  useEffect(() => {
    // 전역 값과 로컬 값이 다를 때만 업데이트하여 무한 루프 방지
    if (JSON.stringify(globalValue) !== JSON.stringify(localValue)) {
      setLocalValue(globalValue);
    }
  }, [globalValue]);

  // 4. 로컬 상태가 변경되면, 디바운싱을 통해 전역 상태를 업데이트한다.
  useEffect(() => {
    // 로컬 상태가 초기값이 아니거나, 이미 전역 상태와 같으면 실행하지 않음
    if (localValue === undefined || JSON.stringify(localValue) === JSON.stringify(globalValue)) {
      return;
    }

    const handler = setTimeout(() => {
      console.log(`[Debounce] Saving ${requirementId}...`);
      updateCurrentAnswer(requirementId, localValue);
    }, 500); // 500ms 지연

    return () => {
      clearTimeout(handler);
    };
  }, [localValue, requirementId, globalValue, updateCurrentAnswer]);

  // 컴포넌트에서는 이 값과 함수만 사용하게 됨
  return [localValue, setLocalValue];
} 