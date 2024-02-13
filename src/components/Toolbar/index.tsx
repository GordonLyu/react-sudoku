import styles from './index.module.css'
import topic from '@/utils/topic'
import time from '@/utils/time'
import React, { useState } from 'react'


interface TopicInterface {
    value: number | null,
    fixed: boolean,
    isTrue: boolean
}

interface Props extends React.HTMLAttributes<any> {
    getNumber: (num: number) => void;
    clearNumber: (all?: boolean) => void;
    audioSwitch: (isOpen?: boolean) => void;
    getTopic: (builded: boolean, data?: {
        topic: TopicInterface[][],
        ans: number[][]
    }) => void
}




const toolbar: React.FC<Props> = (props: Props) => {

    const [audio, setAudio] = useState<boolean>(true)

    // 选择的数字传值到父组件
    const getNumber = (number: number) => {
        props.getNumber(number);
    }

    // 清除数字
    const clearNumber = (all?: boolean) => {
        props.clearNumber(all);
    }

    // 生成题目
    const buildTopic = async () => {
        props.getTopic(false);
        await time.sleep(500);
        let res = await topic.build();
        let tt: TopicInterface[][] = [];
        for (let i = 0; i < 9; i++) {
            let t: TopicInterface[] = []
            for (let j = 0; j < 9; j++) {
                t.push({
                    value: res.topic[i][j],
                    fixed: Boolean(res.topic[i][j]),
                    isTrue: true
                })
            }
            tt.push(t)
        }
        props.getTopic(true, {
            topic: tt,
            ans: res.ans
        });
    }

    const audioSwitch = () => {
        setAudio(!audio);
        props.audioSwitch(!audio);
    }

    let numbers = []

    for (let i = 1; i < 10; i++) {
        numbers.push(<div key={i} className={styles.num} onClick={() => getNumber(i)} >{i}</div>)
    }
    numbers.push(<div key={10} className={styles.num} onClick={() => clearNumber()} >清除</div>)
    numbers.push(<div key={11} className={styles.num} onClick={() => clearNumber(true)} >清除所有</div>)
    numbers.push(<div key={12} className={`${styles.num} ${styles.audio} ${audio ? styles.open : ''}`} onClick={audioSwitch} >{audio ? '开' : '关'}音效</div>)
    numbers.push(<div key={13} className={styles.num} onClick={buildTopic} >生成题目</div>)
    return (
        <div className={styles.toolbar} >
            {numbers}
        </div>
    )
}

export default toolbar