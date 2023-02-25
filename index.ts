import { useEffect } from 'react';
import { useState, useRef } from 'react';

class Stack<T> {
  arr: Array<T> = [];

  maxLength: number = 30;

  constructor(maxLength: number | undefined) {
    if (maxLength) {
      this.maxLength = maxLength;
    }
  }

  push = (value: T): void => {
    this.arr.push(value);
    if (this.arr.length > this.maxLength) {
      this.arr = this.arr.slice(this.maxLength * -1)
    }
  }

  pop = (): T => {
    return this.arr.pop() as T;
  }

  clear = (): void => {
    this.arr = [];
  }

  get length() {
    return this.arr.length;
  }
}

interface IOption {
  /**
   * 最大长度，默认30
   */
  maxLength?: number;
}

/**
 * 
 * @param initValue 
 * @param options.maxLength 最大长度，默认30
 * @returns 
 */
export function useHistoryState<T>(initValue: T, options?: IOption) {
  const [value, setValue] = useState<T>(initValue);

  const stackPrev = useRef(new Stack<T>(options?.maxLength));
  const stackNext = useRef(new Stack<T>(options?.maxLength));

  const [isComposition, setIsComposition] = useState(false);

  const tempValue = useRef<T>();

  useEffect(() => {
    window.addEventListener("compositionstart", handleCompositionStart)
    window.addEventListener("compositionend", handleCompositionEnd)
    return () => {
      window.removeEventListener("compositionstart", handleCompositionEnd)
      window.removeEventListener("compositionend", handleCompositionEnd)
    };
  }, [])

  useEffect(() => {
    if (isComposition) {
      tempValue.current = value;
    } else if (typeof tempValue.current !== 'undefined' && tempValue.current !== value) {
      stackPrev.current.push(tempValue.current);
    }
  }, [isComposition])

  const handleCompositionStart = () => {
    setIsComposition(true);
  }

  const handleCompositionEnd = () => {
    setIsComposition(false);
  }

  const onChange = (newValue: T) => {
    if (!isComposition) {
      stackPrev.current.push(value);
    }
    if (stackNext.current.length > 0) {
      stackNext.current.clear();
    }
    setValue(newValue)
  }

  /**
   * 撤销
   */
  const onRevoke = () => {
    if (stackPrev.current.length > 0) {
      const res = stackPrev.current.pop();
      stackNext.current.push(value);
      setValue(res)
    }
  }

  /**
   * 恢复
   */
  const onRecover = () => {
    if (stackNext.current.length > 0) {
      const res = stackNext.current.pop();
      stackPrev.current.push(value);
      setValue(res)
    }
  }

  return {
    value,
    onChange,
    onRecover,
    onRevoke,
  }
}
