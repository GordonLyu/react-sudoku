/** 生成题目 */
const build = (): Array<Array<number>> => {
    const a = [];
    for (let i = 0; i < 9; i++) {
        a.push(new Array(9).fill(0));
    }
    a[1][1] = 1;
    console.log(a);

    return []
}

/** 验证题目 */
const verify = () => {
    // todo
}


export default {
    build, verify
}