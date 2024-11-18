// 生成一組不重複的四位數字 函式
function generateAnswer() {
    const digits = []; // 創建空陣列 // ES6 const
    // const在宣告變數時就會進行初始化，無法等到之後再賦予值，因此必定要在一開始就給予值作宣告，否則將會報錯。
    while (digits.length < 4) { // 當陣列長度小於4時，重複執行以下程式碼
      const randomDigit = Math.floor(Math.random() * 10);
      // 隨機生成0～1的數*10=隨機生成1～10的數
      // 並無條件捨去小數點=隨機生成1～10的整數
      if (!digits.includes(randomDigit)) { // 當digits陣列中不包含radomDigit元素時
        digits.push(randomDigit); // 才將radomDigit放進digits陣列中
      }
    }
    return digits.join(''); // join() 方法會將陣列（或一個類陣列（array-like）物件）中所有的元素連接、合併成一個字串，並回傳此字串。
    // ''：表示被串接的元素間 不需要分隔符號
    // 範例："2584"
}
  
// 比較玩家猜測和答案，回傳A和B的數量 函式
function checkGuess(answer, guess) {
    let A = 0, B = 0; // 初始A與B數量為0
    const usedInAnswer = [];
    const usedInGuess = [];

    // 範例answer：3548
    // 範例guess：2584

    // 檢查 A
    for (let i = 0; i < 4; i++) {
        if (guess[i] == answer[i]) { // 如果 猜測陣列中 的第i個元素 與 答案陣列中 的第i個元素 相等
            A++; // A的值就+1
            usedInAnswer.push(i); // 在usedInAnswer陣列中加入 被猜中的位置之索引值
            // 範例 usedInAnswer=[1]
            usedInGuess.push(i); // 在usedInGuess陣列中加入 被猜中的位置之索引值
            // 範例 usedInGuess=[1]
        }
    }

    // 檢查 B
    for (let i = 0; i < 4; i++) { 
        if (!usedInGuess.includes(i)) { // 只要檢查不是A的元素即可
        // 範例：usedInGuess=[1]
            // ->不會檢查陣列中索引值為1的元素
            // i = 0, 2, 3
            for (let j = 0; j < 4; j++) {
                if (!usedInAnswer.includes(j) && guess[i] == answer[j]) {
                // 索引值非為j 且 猜測陣列中 的第i個元素 與 答案陣列中 的第j個元素 相同
                // 範例：跑第一次內迴圈j=0時，因為usedInAnswer=[1]，0並不存在於usedInAnswer陣列中，所以「!usedInAnswer.includes(j)」回傳true
                    // guess[0] 為 2，answer[0]為3，不相同，故回傳false，不執行以下程式碼
                    // 跑第二次內迴圈j=1時，因為usedInAnswer=[1]，1存在於usedInAnswer陣列中，所以「!usedInAnswer.includes(j)」回傳false，不執行以下程式碼
                    // 跑第三次內迴圈j=2時，因為usedInAnswer=[1]，2並不存在於usedInAnswer陣列中，所以「!usedInAnswer.includes(j)」回傳true
                    // guess[0] 為 2，answer[2] 為 4，不相同，故回傳false，不執行以下程式碼
                    // .....
                    // 外迴圈跑到第三次時i=2，第四次內迴圈j=3，因為usedInAnswer=[1]，3並不存在於usedInAnswer陣列中，所以「!usedInAnswer.includes(j)」回傳true
                    // guess[2] 為 8，answer[3] 為 8，相同，故回傳true，執行以下程式碼
                    // 外迴圈跑到第四次時i=3，第三次內迴圈j=2，因為usedInAnswer=[1]，2不存在於usedInAnswer陣列中，所以「!usedInAnswer.includes(j)」回傳true
                    // guess[3] 為 4，answer[2] 為 4，相同，故回傳true，執行以下程式碼
                    B++; // B的值就+1
                    // 範例 B = 2
                    usedInAnswer.push(j); // 在usedInAnswer陣列中加入 位置被猜錯 但數字正確 的位置之索引值
                    // 範例 usedInAnswer = [1, 2, 3]
                    break; // break ：跳離(離開)目前正在執行的迴圈中。
                }
            }
        }
    }

    return { A, B };
    // 範例：1, 2
}

var answer = generateAnswer(); //  呼叫 生成一組不重複的四位數字 函式，並將函式回傳之答案存入常數answer中
// 範例 answer = "2584"
console.log("遊戲開始！系统已經生成一組四位不重複的數字。");
console.log(answer);

// 初始化函式
// function init() {
//     var answer = generateAnswer(); //  呼叫 生成一組不重複的四位數字 函式，並將函式回傳之答案存入常數answer中
//     // 範例 answer = "2584"
//     console.log("遊戲開始！系统已經生成一組四位不重複的數字。");
//     console.log(answer);
// }

var attempts = 0; // 猜測次數
var guessedCorrectly = false; // 猜測是否正確
var guessHistoryNumber = []; // 猜測歷史記錄（數字）
var guessHistoryOrder = 0; // 猜測歷史記錄（第幾次）
var guessHistoryHint = []; // 猜測歷史紀錄（提示）

// 主遊戲邏輯
// 主遊戲進行 函式
function playGame() {

    const guess = $('#guessNumber').val(); // 用常數guess儲存使用者輸入的猜測
    console.log(guess);

    const { A, B } = checkGuess(answer, guess); // 將幾A幾B存入A及B常數
    // 範例 A=1 B=2

    if (/^\d{4}$/.test(guess)) { //只計算輸入符合格式（由 4 个数字组成的字符串）的猜測次數
        attempts++; // 猜測次數+1
    }
    // 正則表達式
        // ^：表示字串的開頭
        // \d：表示一個數字字串（0-9）
        // {4}：表示匹配前面的模式（\d）出現4次
        // $：表示字串的結尾
    // test() 是 JavaScript 中正则表达式对象的方法，用于测试一个字符串是否匹配给定的正则表达式。如果匹配成功，返回 true；否则返回 false。

    if (guess != answer && /^\d{4}$/.test(guess)) {
        console.log(`猜測：${guess} | 结果：${A}A${B}B`); // ES6字串與變數串接
        $('#result').html(`猜測：${guess} | 结果：${A}A${B}B`);
    } else if (guess == answer) {
        guessedCorrectly = true; // 將guessedCorrectly變數值改為true
        console.log(`恭喜！你在 ${attempts} 次嘗試後猜中了答案：${answer}`);
        $('#result').html(`恭喜！你在 ${attempts} 次嘗試後猜中了答案：${answer}`);
    } else {
        console.log("輸入無效，請輸入一個四位數字。");
        $('#result').html("輸入無效，請輸入一個四位數字。");
    }
}

// 保存猜測歷史記錄
function recordHistory() {
    // 保存猜測歷史記錄（數字）
    const guess = $('#guessNumber').val(); // 用常數guess儲存使用者輸入的猜測
    if (/^\d{4}$/.test(guess)) { // 只保存符合格式的猜測記錄
        guessHistoryNumber.push(guess);
    }
    console.log(guessHistoryNumber);

    // 保存猜測歷史記錄（提示）
    const { A, B } = checkGuess(answer, guess);
    if (/^\d{4}$/.test(guess)) { 
        guessHistoryHint.push(`${A}A${B}B`);
    }
    console.log(guessHistoryHint);
}

// 顯示猜測歷史記錄
function showHistory() {
    // 顯示猜測歷史記錄（第幾次）
    const guess = $('#guessNumber').val();
    if (/^\d{4}$/.test(guess)) {
        guessHistoryOrder ++;
        $(`#num${guessHistoryOrder}`).html(`第${guessHistoryOrder}次猜測`); 
    }
    
    // 顯示猜測歷史記錄（數字）
    for(var i = 0; i < 10; i++) {
        $(`#guessHistoryNumber${i+1}`).html(guessHistoryNumber[i]);
    }

    // 顯示猜測歷史記錄（提示）
    for(var i = 0; i < 10; i++) {
        $(`#guessHistoryHint${i+1}`).html(guessHistoryHint[i]);
    }
}

// 等DOM元素都載入後，再進行動作
$(document).ready(() => { // ES6箭頭函式
        // init();
        $('#submit').click(evt => {
            evt.preventDefault();
            console.log('按到了');
            playGame();
            recordHistory();
            showHistory();
        })
        
    }
);

