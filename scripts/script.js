// 全域變數
let guessedCorrectly = false; // 猜測是否正確，初始設為否
let inGame = true; // 遊戲是否為進行狀態，初始設為是
let attempts = 0; // 猜測次數
let guessHistoryOrder = 0; // 猜測歷史記錄（第幾次）
let guessHistoryNumber = []; // 猜測歷史記錄（數字）
let guessHistoryHint = []; // 猜測歷史紀錄（提示）
let answer = "" // 謎底，初始為空字串
let guess = "" // 使用者輸入之猜測，初始為空字串
const limit = 10; // 遊戲猜測次數限制  // ES6 const
// const在宣告變數時就會進行初始化，無法等到之後再賦予值，因此必定要在一開始就給予值作宣告，否則將會報錯。
const gameLink = "https://tamytsai.github.io/1A2B-guess-number-game/" // 分享用的遊戲頁面連結

// 等DOM元素都載入後，再進行動作
$(document).ready(() => { // ES6箭頭函式

    answer = generateAnswer(); // 呼叫 生成一組不重複的四位數字 函式，並將函式回傳之答案存入answer中
    console.log("遊戲開始！系统已經生成一組四位不重複的數字。");
    console.log(`謎底：${answer}`);

    // 按下送出答案按鈕
    $('#submit').click(evt => {
        evt.preventDefault();
        console.log('使用者按下送出答案按鈕');
        playGame();
        history();
        overLimitLoss(); // 判斷猜測是否在達上限次數下，仍未猜中正確答案，輸掉並結束遊戲 函式
        inGameOrNot(); // 根據遊戲是否結束以置換按鈕可按狀態
        showShareButtons(); // 遊戲結束，顯示分享遊戲結果及連結按鈕
    })

    // 按下再來一局按鈕
    $('#restart').click(evt => {
        evt.preventDefault();
        console.log('使用者按下再來一局按鈕');
        init();
        clearInput();
        clearResultShow();
        clearHistoryAndShow();
        inGameOrNot();
    });

    // 按下分享到LINE按鈕
    $('#shareToLine').click(() => {
        // 以貼文形式分享
        // const message = encodeURIComponent(getGameResult());
        // const lineShareUrl = `https://line.me/R/msg/text/?${message}`;
        // window.open(lineShareUrl, '_blank');

        // 以傳送訊息形式分享
        const lineUrl = `line://msg/text/${encodeURIComponent(getGameResultWithUrl())}`;
        // encodeURIComponent() 是 JavaScript 中用於對 URI（Uniform Resource Identifier，統一資源標識符）中的一部分進行編碼的函數。
        // 它的主要作用是將特殊字符轉換為對應的 URI 編碼格式，以便這些字符可以安全地用於 URL 中，而不會引起語法錯誤或意外行為。
        // 參數：str 是要編碼的字串。
        // 返回值：返回該字串的 URI 安全版本，其中特殊字符被替換為 % 開頭的編碼。
        // encodeURIComponent()：編碼 URL 的「單一部分」，例如查詢參數的值。對所有特殊字符進行編碼，適用於單個值。
        // encodeURI()：編碼整個 URL，但保留對 URL 有意義的符號（如 :, /, ?, &, # 等）。保留整個 URL 結構，適用於整體 URL。
        window.open(lineUrl, '_blank'); // 開啟新頁面或新視窗
        // window.open('需要開啟的目標網址', '決定如何打開新頁面或視窗', 選填，設定新視窗的屬性（例如寬度、高度、是否有滾動條等）)
        // '_blank': 在新視窗或新分頁中打開。
        // '_self': 在當前視窗中打開（預設值）。
        // '_parent': 在父框架中打開（如果有框架的情況）。
        // '_top': 在最上層框架中打開（覆蓋整個視窗）。
        // LINE 的 URL 協議（line://msg/text/...）需要呼叫 LINE App，瀏覽器會將此操作視為外部應用程式的呼叫行為。
        // 使用 '_blank' 可以避免覆蓋當前頁面，並保留使用者的瀏覽上下文。
        // 在行動裝置上，如果裝置已安裝 LINE App，會自動跳轉至 LINE 並顯示訊息分享頁面。
        // 在桌面瀏覽器中，若未安裝 LINE App，可能會無法處理 line:// 的協議，需以行動裝置測試。
    });

    // 按下分享到FB按鈕
    $('#shareToFB').click(() => {
        // 以貼文形式分享
        // const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(gameLink)}`;
        // window.open(fbShareUrl, '_blank');
        const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(gameLink)}&quote=${encodeURIComponent(getGameResult())}`;
        window.open(fbShareUrl, '_blank');
        // u：分享的網址連結，例如 https://example.com。
        // quote：自訂的分享文字。
        // Facebook 有時會忽略 quote，尤其是對應的 URL（u）沒有設置正確的 Open Graph 資料。
        // Facebook 分享時主要依賴目標網址的 Open Graph 標籤，例如 og:title、og:description 和 og:image，而非 URL 參數中的文字。
    });

    // 按下複製按鈕
    $('#copyLink').click(() => {
        const shareText = getGameResultWithUrl();
        navigator.clipboard.writeText(shareText)
            .then(() => { // 成功複製到剪貼簿的話
                alert('遊戲結果及連結已複製到剪貼簿！'); // 就跳出提示
            })
            .catch(() => { // 剪貼簿複製失敗的話
                alert('遊戲結果及連結複製失敗，請再重新操作'); // 就跳出提示
            });
        // 非同步
        // 將 shareText 變數中的內容複製到使用者的剪貼簿。navigator.clipboard 是 Web API 的一部分，提供了操作剪貼簿的功能。
        // navigator.clipboard.writeText() 需要在 HTTPS 網頁中使用，否則會因為安全原因無法正常運行。
        // writeText() 方法接收一個字串參數，將該字串放入剪貼簿中。
        // writeText() 返回一個 Promise 物件，這意味著它是一個非同步操作。
        // 異步操作（如 writeText()）指的是非阻塞式的操作，即程式可以繼續執行而不會因為某個操作（如複製到剪貼簿）而停頓。
        // Promise物件後面可以接.then() .catch()
        // .then() 是對這個 Promise 操作的回應，當「複製操作成功完成」後，它會執行這裡的回呼函數。
        // 在這裡，當文字成功複製到剪貼簿時，回呼函數中的 alert() 會被觸發，顯示一個彈出訊息。
        // 沒有涉及 HTTP 請求、伺服器響應或與伺服器的通信。
        // 只是使用了 navigator.clipboard.writeText() 來操作剪貼簿，這是一個非同步的操作，但並不需要從伺服器獲取或發送數據。所以非屬AJAX
    });
    
});

// 生成一組不重複的四位數字 函式
function generateAnswer() {
    let digits = []; // 創建空陣列
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
};

// 主遊戲邏輯
// 主遊戲進行 函式
function playGame() {

    guess = $('#guessNumber').val(); // 用guess儲存使用者輸入的猜測

    const { A, B } = checkGuess(answer, guess); // 多重指定 // 內嵌函式 
    // 將幾A幾B存入A及B常數 
    // 在本函式的範圍中，A及B於此敘述被指定後，就不會再被重新賦值了，所以採常數
    // 範例 A=1 B=2

    if (isFormat(guess)) { //只計算輸入符合格式（由 4 個數字组成的字符串）的猜測次數
        attempts++; // 猜測次數+1
    };

    if (isFormat(guess) && guess != answer) { // 猜測符合格式下，沒猜對
        console.log(`猜測：${guess} | 结果：${A}A${B}B`); // ES6字串與變數串接
        $('#result').html(`猜測：${guess} | 结果：${A}A${B}B`);
    } else if (guess == answer) { // 猜對了
        guessedCorrectly = true; // 將guessedCorrectly變數值改為true
        console.log(`恭喜！你在 ${attempts} 次嘗試後猜中了答案：${answer}`);
        $('#result').html(`恭喜！你在 ${attempts} 次嘗試後猜中了答案：${answer}`);
        inGame = false; // 遊戲結束
    } else { // 猜測不符合格式
        console.log("輸入無效，請輸入一個四位數字。");
        $('#result').html("輸入無效，請輸入一個四位數字。");
    };

};

// 比較玩家猜測和答案，回傳A和B的數量 函式
function checkGuess(answer, guess) {
    let A = 0, B = 0; // 初始A與B數量為0
    let usedInAnswer = [];
    let usedInGuess = [];

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
                    // 全部檢查完就跳離迴圈
                }
            }
        }
    }

    return { A, B };
    // 範例：1, 2
};

// 判斷玩家輸入之猜測是否符合格式 函式
function isFormat(guess) {
    if (/^\d{4}$/.test(guess)) { // 測試玩家輸入的猜測，是否為 四個由0-9數字字串組成的字串
        return true;
    } else {
        return false;
    };
    // 正規表示式
        // ^：表示字串的開頭（符合輸入字串的開始位置。如果設定了RegExp物件的Multiline屬性，^也符合「\n」或「\r」之後的位置。）
        // \d：表示一個數字字串（0-9）（符合一個數字字元。等價於[0-9]。注意Unicode正規表示式會符合全形數字字元。）
        // {4}：表示匹配前面的模式（\d）出現4次（n是一個非負整數。符合確定的n次。例如，「o{2}」不能符合「Bob」中的「o」，但是能符合「food」中的兩個o。）
        // $：表示字串的結尾（符合輸入字串的結束位置。如果設定了RegExp物件的Multiline屬性，$也符合「\n」或「\r」之前的位置。）
    // test() 是 JavaScript 中正規表示式對象的方法，用於測試一個字符串是否匹配给定的正規表示式。如果匹配成功，回傳 true；否則回傳 false。
};

// 猜測歷史記錄保存、生成標籤、顯示 函式
function history() {
    recordHistory(); // 記錄猜測
    createHistoryHtmlTag(); // 創建html標籤
    showHistory(); // 將猜測填入html標籤，顯示於畫面上
}

// 保存猜測歷史記錄 函式
function recordHistory() {

    guess = $('#guessNumber').val();
    // 為降低函式間之耦合性，提高內聚力，故即使playGame()函式中已對guess變數賦值，但本函式仍對guess變數再賦值，以提昇程式碼可擴充性

    // 保存猜測歷史記錄（數字）
    if (isFormat(guess)) { // 只保存符合格式的猜測記錄
        guessHistoryNumber.push(guess);
    }
    console.log(guessHistoryNumber);

    // 保存猜測歷史記錄（提示）
    const { A, B } = checkGuess(answer, guess);
    if (isFormat(guess)) { 
        guessHistoryHint.push(`${A}A${B}B`);
    }
    console.log(guessHistoryHint);
};

// 動態生成html猜測記錄標籤 函式
function createHistoryHtmlTag() {
    let orderContainer = $('.guessHistoryOrder');
    let numberContainer = $('.guessHistoryNumber');
    let hintContainer = $('.guessHistoryHint');

    // 動態生成各類別內部標籤
    for (let i = 1; i <= guessHistoryNumber.length && i <= limit; i++) { // 根據猜測歷史記錄數量去生成標籤，但不要超過遊戲猜測次數限制
        orderContainer.append(`<p id="num${i}"></p>`);
        numberContainer.append(`<p id="guessHistoryNumber${i}"></p>`);
        hintContainer.append(`<p id="guessHistoryHint${i}"></p>`);
    }
}

// 顯示猜測歷史記錄 函式
function showHistory() {
    guess = $('#guessNumber').val();
    // 為降低函式間之耦合性，提高內聚力，故即使playGame()函式中已對guess變數賦值，但本函式仍對guess變數再賦值，以提昇程式碼可擴充性

    // 顯示猜測歷史記錄（第幾次）
    if (isFormat(guess)) {
        guessHistoryOrder ++;
        $(`#num${guessHistoryOrder}`).html(`第${guessHistoryOrder}次猜測`); 
    }
    
    // 顯示猜測歷史記錄（數字）
    for(let i = 0; i < guessHistoryNumber.length; i++) {
        $(`#guessHistoryNumber${i+1}`).html(guessHistoryNumber[i]);
    }

    // 顯示猜測歷史記錄（提示）
    for(let i = 0; i < guessHistoryHint.length; i++) {
        $(`#guessHistoryHint${i+1}`).html(guessHistoryHint[i]);
    }
};

// 判斷猜測是否在達上限次數下，仍未猜中正確答案，輸掉並結束遊戲 函式
function overLimitLoss() {
    if (attempts == limit && !guessedCorrectly) {
        console.log(`可惜！你未於 ${limit} 次嘗試內猜中答案：${answer}`);
        $('#result').html(`可惜！你未於 ${limit} 次嘗試內猜中答案：${answer}`);
        inGame = false;
    }
};

// 判斷是否為遊戲進行狀態，以更改畫面按鈕可按狀態 函式
function inGameOrNot() {
    if (inGame) { // 若遊戲進行中
        $('#submit').attr('disabled', false); // 讓 送出答案按鈕可按
        $('#restart').attr('disabled', true); // 重新開始按鈕不可按
    } else { // 若遊戲非進行中
        $('#submit').attr('disabled', true); // 讓 送出答案按鈕不可按
        $('#restart').attr('disabled', false); // 重新開始按鈕可按
    }
};

// 重新開始遊戲 初始化 函式
function init() {
    answer = generateAnswer(); // 重新生成新答案 更新全域變數answer
    console.log("遊戲重新開始！系统已經重新生成一組新的四位不重複的數字。");
    console.log(`新謎底：${answer}`);
    inGame = true;
    guessedCorrectly = false; // 重置猜測正確性
    attempts = 0;
    $('.shareButtons').css('display', 'none'); // 隱藏分享按鈕
};

// 清除輸入框文字 函式
function clearInput() {
    document.querySelector('#guessNumber').value = "";
};

// 清空猜測結果顯示
function clearResultShow() {
    $('#result').html("");
}

// 清除 猜測記錄 及 頁面顯示之歷史猜測記錄 函式
function clearHistoryAndShow() {
    clearHistoryShow(); // 清除 頁面顯示之歷史猜測記錄（根據當前之猜測記錄數量清除）
    resetHistory(); // 重置（清除）猜測記錄
};

// 清除 頁面顯示之歷史猜測記錄 函式
function clearHistoryShow() {
    // 清空猜測歷史記錄之顯示（第幾次）
    for(let i = 0; i < guessHistoryOrder; i++) {
        $(`#num${i+1}`).html("");
    }
    
    // 清空猜測歷史記錄之顯示（數字）
    for(let i = 0; i < guessHistoryNumber.length; i++) {
        $(`#guessHistoryNumber${i+1}`).html("");
    }
    
    // 清空猜測歷史記錄之顯示（提示）
    for(let i = 0; i < guessHistoryHint.length; i++) {
        $(`#guessHistoryHint${i+1}`).html("");
    }
};

// 重置（清除）猜測記錄 函式
function resetHistory() {
    guessHistoryOrder = 0; // 猜測歷史記錄（第幾次）
    guessHistoryNumber = []; // 猜測歷史記錄（數字）
    guessHistoryHint = []; // 猜測歷史紀錄（提示）
};

// 若遊戲結束，顯示分享遊戲結果及連結按鈕 函式
function showShareButtons() {
    if(!inGame) {
        $('.shareButtons').css('display', 'block');
    }
};

// 取得遊戲結果的文字內容（帶連結）
function getGameResultWithUrl() {
    if (guessedCorrectly){
        return `我花了${attempts}次就解開謎底，你可以嗎？快來挑戰：${gameLink}`;
    } else if(attempts == limit && !guessedCorrectly) {
        return `我花了${limit}次都沒猜到謎底，換你試試：${gameLink}`;
    };
};

// 取得遊戲結果的文字內容（不帶連結）
function getGameResult() {
    if (guessedCorrectly){
        return `我花了${attempts}次就解開謎底，你可以嗎？快來挑戰！`;
    } else if(attempts == limit && !guessedCorrectly) {
        return `我花了${limit}次都沒猜到謎底，換你試試！`;
    };
};




