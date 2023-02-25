## Getting Started

创建一个留痕的state, 可以进行撤销和恢复操作, 类似对输入框进行ctrl+z和ctrl+y的操作

## Install

```bash
$ npm install --save react-history-state
# or
$ yarn add react-history-state
```

## Usage

```ts
import { useHistoryState } from 'react-history-state';

export default () => {
  const { value, onChange, onRecover, onRevoke } = useHistoryState<string>('');
  return (
    <>
      <input value={value as string} onChange={e => onChange(e.target.value)} />
      <button onClick={onRevoke}>撤销</button>
      <button onClick={onRecover}>恢复</button>
    </>
  )
}
```