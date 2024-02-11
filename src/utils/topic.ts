interface TopicInterface {
    value: number | null,
    fixed: boolean,
    isTrue: boolean
}

/** 
 * 生成题目

 * 算法参考：https://blog.csdn.net/qq_40636117/article/details/82461987
*/
const build = async (): Promise<{
    topic: number[][],
    ans: number[][]
}> => {
    const game = (await new SudokuMaker().build());
    return new Promise((resolve) => {
        resolve(game)
    })
}

/** 格式化为九宫格数组，渲染时转回来 */
const formatArr = (a: TopicInterface[][]) => {
    let t: TopicInterface[][] = [];
    let k = 0;
    for (let i = 0; i < 9; i++) {
        let tt = []
        for (let j = 0; j < 9; j++, k++) {
            let x = Math.floor(i / 3) * 3 + Math.floor(j / 3);
            let y = (i % 3) * 3 + (j % 3);
            tt.push(a[x][y]);
        }

        t.push(tt);
    }
    return t;

}

/** 随机整数，随机数包含start和end */
const randomInt = (start: number, end: number) => {
    return start + Math.floor(Math.random() * (end + 1 - start));
}

/**
 *  验证题目
 *  @returns {number} `-1`：错误;`0`：未生成题目; `1`：正确; `2`：完成
 */
const verify = (a: TopicInterface[][], ans: number[][]): -1 | 0 | 1 | 2 => {
    if (a.length != ans.length) {
        return 0;
    }
    let isComplete = true;
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (a[i][j].value == 0) {
                isComplete = false;
                continue;
            }

            if (ans[i][j] != a[i][j].value) {
                return -1;
            }
        }
    }
    return isComplete ? 2 : 1;
}



class SudokuMaker {
    Arr: number[][] = [];//临时数组
    Sudoku: number[][] = [];
    Answer: number[][] = [];//答案
    Game: number[][] = [];

    public constructor() {
        for (let i = 0; i < 9; i++) {
            this.Arr.push(new Array(9).fill(0));
        }
        for (let i = 0; i < 9; i++) {
            this.Sudoku.push(new Array(9).fill(0));
        }
        for (let i = 0; i < 9; i++) {
            this.Answer.push(new Array(9).fill(0));
        }
    }
    public async build() {
        await this.main();
        return {
            topic: this.Game,
            ans: this.Answer
        };
    }
    public async main() {
        await this.rand();
        await this.DFS(this.Arr, 0, false);
        await this.diger();
    }

    private async rand() {
        let t = 0;
        let x, y, num;
        //先往数组里面随机丢t个数
        while (t < 15) {//t不宜多，否则运行起来耗费时间；t也不宜少，否则生成的游戏看起来一点也不随机
            x = randomInt(0, 8);
            y = randomInt(0, 8);
            num = randomInt(0, 9);
            if (this.Arr[y][x] == 0) {
                if (await this.isTrue(this.Arr, x, y, num) == true) {
                    this.Arr[y][x] = num; ++t;
                }
            }
        }
    }

    //判断该数字填写的地方是否符合数独规则
    public async isTrue(arr: number[][], x: number, y: number, num: number) {//数字横坐标；数字纵坐标；数字数值
        //判断中单元格（3*3）
        for (let i = Math.floor(y / 3) * 3; i < Math.floor(y / 3 + 1) * 3; ++i) {
            for (let j = Math.floor(x / 3) * 3; j < Math.floor(x / 3 + 1) * 3; ++j) {
                if (arr[i][j] == num) { return false; }
            }
        }
        //判断横竖
        for (let i = 0; i < 9; ++i) {
            if ((arr[i][x] == num || arr[y][i] == num)) { return false; }
        }
        return true;
    }

    //深度优先搜索寻找
    //绝对有很多种解法，但是我们只需要第一个解出来的
    flag = false;//判断是否不再求解
    total = 0;
    private async DFS(arr: number[][], n: number, all: boolean) {//arr是数独数组，n是探索深度（一共81个格子，深度为81,n为0~80），是否要求全部解
        // console.log(n);

        //n/9为格子的纵坐标，n%9为格子的横坐标
        if (n < 81) {
            //如果已经求出了一种解，终止递归就行了，不用继续求下去了
            if (this.flag == true && all == false) { return; }

            if (arr[Math.floor(n / 9)][n % 9] == 0) {
                for (let i = 1; i < 10; ++i) {
                    if (await this.isTrue(arr, n % 9, Math.floor(n / 9), i) == true) {
                        arr[Math.floor(n / 9)][n % 9] = i;
                        await this.DFS(arr, n + 1, all);
                        arr[Math.floor(n / 9)][n % 9] = 0;
                    }
                }
            } else {
                await this.DFS(arr, n + 1, all);
            }

        } else {
            if (all == false) {
                this.flag = true;
                for (let i = 0; i < 9; ++i) {
                    for (let j = 0; j < 9; ++j) {
                        this.Sudoku[i][j] = arr[i][j];
                        this.Answer[i][j] = arr[i][j];
                    }
                }
            } else {
                for (let i = 0; i < 9; ++i) {
                    for (let j = 0; j < 9; ++j) {
                        if (arr[i][j] != this.Answer[i][j]) {
                            this.Game[i][j] = this.Answer[i][j];
                            i = 10; j = 10;
                            break;
                        }
                    }
                }
            }
        }
    }

    //给数独挖空
    //保证仅有一解
    private async diger() {
        let t = 55;
        this.Game = [];
        for (let i = 0; i < 9; i++) {
            this.Game.push(new Array(9).fill(0));
        }
        while (t > 0) {
            let x = randomInt(0, 8);
            let y = randomInt(0, 8);
            if (this.Sudoku[y][x] != 0) {
                this.Sudoku[y][x] = 0; --t;
            }
        }

        for (let i = 0; i < 9; ++i) {
            for (let j = 0; j < 9; ++j) {
                this.Game[i][j] = this.Sudoku[i][j];
            }
        }

        await this.DFS(this.Sudoku, 0, true);
    }
}

export default {
    build, verify, formatArr
}