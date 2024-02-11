/**
 * 睡眠函数，配合 `async`, `wait` 使用
 * @param {number} ms ，单位毫秒
 */
const sleep = async (ms: number) => {
    return new Promise((resolve) => {
        setTimeout(() => { resolve(true) }, ms)
    })
}



export default {
    sleep
}