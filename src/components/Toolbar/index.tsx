import styles from './index.module.css'

import React from 'react'
interface Props extends React.HTMLAttributes<any> {
    getNumber: (num: number) => void;
    clearNumber: () => void;
}


const toolbar: React.FC<Props> = (props: Props) => {

    // 选择的数字传值到父组件
    const getNumber = (number: number) => {
        props.getNumber(number);
    }

    // 清除数字
    const clearNumber = () => {
        props.clearNumber();
    }

    let numbers = []

    for (let i = 1; i < 10; i++) {
        numbers.push(<div key={i} className={styles.num} onClick={() => getNumber(i)} >{i}</div>)
    }
    numbers.push(<div key={10} className={styles.num} onClick={clearNumber} >清除</div>)

    return (
        <div className={styles.toolbar} >
            {numbers}
        </div>
    )
}


export default toolbar