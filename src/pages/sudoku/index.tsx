import React, { createRef, useState } from 'react'
import './index.css'
import topic from '@/utils/topic'
import Toolbar from '@/components/Toolbar'

topic.build()






const sudoku: React.FC = () => {
  const [toolbarHight, setToolbarHight] = useState<number>();
  const [selected, setSelected] = useState<number[]>([-1, -1]);
  const [numbers, setNumbers] = useState<Array<Array<{
    value: number | null,
    fixed: boolean,
  }>>>(() => {
    let tt = []
    for (let i = 0, l = 0; i < 9; i++) {
      const t = [];
      for (let j = 0; j < 9; j++, l++) {
        t.push({
          value: null,
          fixed: false
        });
      }
      tt.push(t);
    }
    return tt;
  });


  const toolbarRef = createRef<HTMLDivElement>()



  setTimeout(() => {
    numbers[1][1] = {
      value: 3,
      fixed: true
    };
    setNumbers([...numbers])

  }, 0)



  // 工具栏高度自适应
  const ChangeToolbarHight = () => {
    if (toolbarRef.current?.clientHeight) {
      setToolbarHight(toolbarRef.current?.clientHeight);
    }
  }
  setTimeout(() => {
    ChangeToolbarHight();
  }, 0)
  onresize = () => {
    ChangeToolbarHight();
  }

  // 选择格子
  const selectItem = (r: number, c: number) => {
    if (numbers[r][c].fixed) {
      return;
    }
    // 再次点击已选择的格子取消选择
    if (selected[0] == r && selected[1] == c) {
      cancelSelectNumber();
    } else {
      setSelected([r, c]);
    }
  }

  // 取消选取格子
  const cancelSelectNumber = () => {
    setSelected([-1, -1]);
  }

  // 获取选择输入的数字
  const selectNumber = (num: number) => {
    if (selected[0] == -1) {
      return;
    }
    numbers[selected[0]][selected[1]].value = num;
    setNumbers([...numbers]);
    cancelSelectNumber();
  }

  // 清除数字
  const clearNumber = () => {
    numbers[selected[0]][selected[1]].value = null;
    setNumbers([...numbers])
  }

  // 键盘输入数字
  window.onkeydown = (e: KeyboardEvent) => {
    if (selected[0] == -1) {
      return;
    }
    if (e.key.match('[1-9]')) {
      numbers[selected[0]][selected[1]].value = Number(e.key);
      setNumbers([...numbers])
    } else if (e.key == 'Backspace' || e.key == ' ') {
      clearNumber();
    }
    cancelSelectNumber();
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
                  <div className={`${_item.value ? 'inserted' : ''} ${selected![0] == i && selected![1] == j ? 'selected' : ''} ${_item.fixed ? 'fixed' : ''} `} onClick={() => { selectItem(i, j) }} key={i * (j + 1) + j}>{_item.value}</div>
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