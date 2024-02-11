import React, { createRef, useState } from 'react'
import './index.css'
import topic from '@/utils/topic'
import Toolbar from '@/components/Toolbar'


const insertNumberAudio = new Audio('/audio/plop.wav');// 填入数字音效
const clearNumberAudio = new Audio('/audio/clear.mp3');// 擦除数字音效
insertNumberAudio.volume = clearNumberAudio.volume = 0.5;

interface TopicInterface {
  value: number | null,
  fixed: boolean,
  isTrue: boolean
}


const sudoku: React.FC = () => {
  const [toolbarHight, setToolbarHight] = useState<number>();
  const [selected, setSelected] = useState<number[]>([-1, -1]);
  const [building, setBuilding] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false)
  const [ans, setAns] = useState<number[][]>([]);
  const [numbers, setNumbers] = useState<TopicInterface[][]>(() => {
    let tt = []
    for (let i = 0, l = 1; i < 9; i++) {
      const t = [];
      for (let j = 0; j < 9; j++, l++) {
        t.push({
          value: 0,
          fixed: false,
          isTrue: true
        });
      }
      tt.push(t);
    }

    return tt;
  });

  const toolbarRef = createRef<HTMLDivElement>()

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

  // 获取题目
  const getTopic = (builded: boolean, res?: {
    topic: TopicInterface[][],
    ans: number[][]
  }) => {
    if (builded) {
      setNumbers(res!.topic);
      setAns(res?.ans!)
      setBuilding(false);
    } else {
      setBuilding(true);
    }
  }

  // 验证答案
  const verify = () => {
    const res = topic.verify(numbers, ans);
    if (res == -1) {
      numbers[selected[0]][selected[1]].isTrue = false;
    } else if (res == 1) {
      numbers[selected[0]][selected[1]].isTrue = true;
    } else if (res == 2) {
      setIsComplete(true)
    }
    setNumbers(numbers);
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
    insertNumberAudio.muted = clearNumberAudio.muted = !isOpen;
  }

  // 填入数字
  const insertNumber = (r: number, c: number, n: number | null) => {
    if (selected[0] == -1 && n != 0) {
      return;
    }
    numbers[r][c].value = n;
    setNumbers([...numbers]);
    cancelSelectNumber();
    if (n != 0) {
      verify();
    }
    // 播放音效
    if (n) {
      insertNumberAudio.currentTime = 0.6;
      insertNumberAudio.play();
    } else {
      clearNumberAudio.currentTime = 4;
      clearNumberAudio.playbackRate = 2;
      setTimeout(() => {
        clearNumberAudio.load()
      }, 400);
      clearNumberAudio.play();
    }
  }

  // 获取选择输入的数字
  const selectNumber = (num: number) => {
    insertNumber(selected[0], selected[1], num);
  }

  // 清除数字
  const clearNumber = (all?: boolean) => {
    let t = numbers
    if (all) {
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if (!t[i][j].fixed && t[i][j].value) {
            numbers[i][j].isTrue = true
            insertNumber(i, j, 0);

          }
        }
      }
    } else {
      insertNumber(selected[0], selected[1], 0);
    }
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
      {isComplete ?
        (<div className='mask'>
          <div>恭喜！已完成数独</div>
          <div onClick={() => { setIsComplete(false) }}>确定</div>
        </div>) : null}
      {building ?
        (<div className='mask'>
          <div>题目生成中，请稍等...</div>
          <div>若生成过久请刷新</div>
        </div>) : null}
      <div className='main' style={{
        marginBottom: `${toolbarHight! + 50}px`
      }}>
        {topic.formatArr(numbers).map((row, i) => {
          return (
            <div className='grid' key={i}>
              {row.map((_item, j) => {
                return (
                  <div className={`${_item.value ? 'inserted' : ''} 
                  ${selected![0] == Math.floor(i / 3) * 3 + Math.floor(j / 3) && selected![1] == (i % 3) * 3 + (j % 3) ? 'selected' : ''} 
                  ${_item.fixed ? 'fixed' : ''} ${_item.isTrue ? '' : 'error'}`} onClick={() => { selectItem(Math.floor(i / 3) * 3 + Math.floor(j / 3), (i % 3) * 3 + (j % 3)) }} key={i * (j + 1) + j}>{_item.value ? _item.value : ''}</div>
                )
              })}
            </div>
          )
        })}
      </div>
      <div className="toolbar-main" ref={toolbarRef}>
        <Toolbar getNumber={selectNumber} clearNumber={clearNumber} audioSwitch={audioSwitch} getTopic={getTopic}></Toolbar>
      </div>
    </>
  )
}

export default sudoku