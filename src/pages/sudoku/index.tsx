import React, { createRef, useState } from 'react'
import './index.css'
import topic from '@/utils/topic'
import Toolbar from '@/components/Toolbar'


const insertNumberAudio = new Audio('/audio/plop.wav');// 填入数字音效
const clearNumberAudio = new Audio('/audio/clear.mp3');// 擦除数字音效
insertNumberAudio.volume = clearNumberAudio.volume = 0.5;

topic.build()


const sudoku: React.FC = () => {
  const [toolbarHight, setToolbarHight] = useState<number>();
  const [selected, setSelected] = useState<number[]>([-1, -1]);
  const [numbers, setNumbers] = useState<Array<Array<{
    value: number | null,
    fixed: boolean,
  }>>>(() => {
    let tt = []
    for (let i = 0, l = 1; i < 9; i++) {
      const t = [];
      for (let j = 0; j < 9; j++, l++) {
        t.push({
          value: l,
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


  // 开关音频
  const audioSwitch = (isOpen?: boolean) => {
    if (isOpen) {
      insertNumberAudio.volume = clearNumberAudio.volume = 1;
    } else {
      insertNumberAudio.volume = clearNumberAudio.volume = 0;
    }
  }


  // 填入数字
  const insertNumber = (r: number, c: number, n: number | null) => {
    if (selected[0] == -1) {
      return;
    }
    numbers[r][c].value = n;
    setNumbers([...numbers]);
    cancelSelectNumber();

    // 播放音效
    if (n) {
      insertNumberAudio.currentTime = 0.6;
      insertNumberAudio.play();
    } else {
      clearNumberAudio.currentTime = 4.5;
      clearNumberAudio.play();
    }
  }

  // 获取选择输入的数字
  const selectNumber = (num: number) => {
    insertNumber(selected[0], selected[1], num);
  }

  // 清除数字
  const clearNumber = () => {
    insertNumber(selected[0], selected[1], null);
  }

  // 键盘输入数字
  window.onkeydown = (e: KeyboardEvent) => {
    if (e.key.match('[1-9]')) {
      insertNumber(selected[0], selected[1], Number(e.key));
    } else if (e.key == 'Backspace' || e.key == ' ') {
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
                  <div className={`${_item.value ? 'inserted' : ''} ${selected![0] == i && selected![1] == j ? 'selected' : ''} ${_item.fixed ? 'fixed' : ''} `} onClick={() => { selectItem(i, j) }} key={i * (j + 1) + j}>{_item.value}</div>
                )
              })}
            </div>
          )
        })}
      </div>
      <div className="toolbar-main" ref={toolbarRef}>
        <Toolbar getNumber={selectNumber} clearNumber={clearNumber} audioSwitch={audioSwitch}></Toolbar>
      </div>
    </>
  )
}

export default sudoku