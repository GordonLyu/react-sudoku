import styles from './index.module.css'

import React, { useState } from 'react'
interface Props extends React.HTMLAttributes<any> {
    getNumber: (num: number) => void;
    clearNumber: () => void;
    audioSwitch: (isOpen?: boolean) => void;
}


const toolbar: React.FC<Props> = (props: Props) => {

    const [audio, setAudio] = useState<boolean>(true)

    // 选择的数字传值到父组件
    const getNumber = (number: number) => {
        props.getNumber(number);
    }

    // 清除数字
    const clearNumber = () => {
        props.clearNumber();
    }

    const audioSwitch = () => {
        setAudio(!audio);
        props.audioSwitch(!audio);
    }

    let numbers = []

    for (let i = 1; i < 10; i++) {
        numbers.push(<div key={i} className={styles.num} onClick={() => getNumber(i)} >{i}</div>)
    }
    numbers.push(<div key={10} className={styles.num} onClick={clearNumber} >清除</div>)
    numbers.push(<div key={11} className={`${styles.num} ${styles.audio} ${audio ? styles.open : ''}`} onClick={audioSwitch} >{audio ? '开' : '关'}音效</div>)

    return (
        <div className={styles.toolbar} >
            {numbers}
        </div>
    )
}

export default toolbar