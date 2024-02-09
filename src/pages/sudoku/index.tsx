import React, { createRef, useState } from 'react'
import './index.css'
import topic from '@/utils/topic'
import Toolbar from '@/components/Toolbar'

topic.build()






const sudoku: React.FC = () => {
  const [toolbarHight, setToolbarHight] = useState<number>();
  const [selected, setSelected] = useState<number[]>([-1, -1]);
  const [numbers, setNumbers] = useState<Array<Array<number | null>>>(() => {
    let tt = []
    for (let i = 0, l = 0; i < 9; i++) {
      const t: number[] = [];
      for (let j = 0; j < 9; j++, l++) {
        t.push(l);
      }
      tt.push(t);
    }
    return tt;
  });

  const toolbarRef = createRef<HTMLDivElement>()

  // 选择数字
  const ChangeToolbarHight = () => {
    if (toolbarRef.current?.clientHeight) {
      setToolbarHight(toolbarRef.current?.clientHeight);
    }
  }

  // 选择元素
  const selectItem = (ij: number[]) => {
    if (selected[0] == ij[0] && selected[1] == ij[1]) {
      setSelected([-1, -1]);
    } else {
      setSelected(ij);
    }
  }
  setTimeout(() => {
    ChangeToolbarHight();
  }, 0)
  onresize = () => {
    ChangeToolbarHight();
  }


  // 获取选择的数字
  const selectNumber = (num: number) => {
    numbers[selected[0]][selected[1]] = num;
    setNumbers([...numbers])
    console.log(numbers);
  }

  // 清除数字
  const clearNumber = () => {
    numbers[selected[0]][selected[1]] = null;
    setNumbers([...numbers])
  }

  // 键盘输入数字
  window.onkeydown = (e: KeyboardEvent) => {
    if (e.key.match('[1-9]')) {
      numbers[selected[0]][selected[1]] = Number(e.key);
      setNumbers([...numbers])
    } else if (e.key == 'Backspace') {
      clearNumber();
    }

  }

  return (
    <>
      <div className='main' style={{
        marginBottom: `${toolbarHight! + 50}px`
      }}>
        {numbers.map((row, i) => {
          return (
            <div className='grid' key={i}>
              {row.map((_item, j) => {
                return (
                  <div className={selected![0] == i && selected![1] == j ? 'selected' : ''} onClick={() => { selectItem([i, j]) }} key={i * (j + 1) + j}>{_item}</div>
                )
              })}
            </div>
          )
        })}
      </div>
      <div className="toolbar-main" ref={toolbarRef}>
        <Toolbar getNumber={selectNumber} clearNumber={clearNumber}></Toolbar>
      </div>
    </>
  )
}

export default sudoku