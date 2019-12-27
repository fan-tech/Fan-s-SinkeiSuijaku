'use strict'
{
  // 定数宣言
  const rule = document.getElementById('rule');
  const levelChoice = document.getElementById('levelChoice');
  const mainGameArea = document.getElementById('mainGameArea');
  const okBtn = document.getElementById('okBtn');
  const startBtn = document.getElementById('startBtn');
  const easyBtn = document.getElementById('easyBtn');
  const normalBtn = document.getElementById('normalBtn');
  const hardBtn = document.getElementById('hardBtn');
  const cardsArea = document.getElementById('cardsArea');
  const errorMsg = document.getElementById('errorMsg');
  const classCardAreas = document.getElementsByClassName('outsideCard');
  const classOnOffCheck = document.getElementsByClassName('card');
  const finalResult = document.getElementById('finalResult');
  const replayBtn = document.getElementById('replayBtn');
  const backBtn = document.getElementById('backBtn');
  const resultComment = document.getElementById('result-comment');
  const missResult = document.getElementById('missResult');

  // タイマー関連定数
  const timer = document.getElementById('timer');
  const finalResultTimer = document.getElementById('finalResultTimer');

  // 変数宣言
  let level = 1;
  let firstNum = 0;
  let secondNum = 0;
  let yetOpenCard
  let gameCounter = 0;
  let missCounter = 0;

  // ----------------------
  // タイマー関係変数
  let startTime;
  let elapsedTime;
  let timerId;
  let timeToadd = 0;

  // タイマー関連
  function finalTimer() {
    let s = Math.floor(elapsedTime / 1000);
    // s = ('0' + s).slice(-2);
    finalResultTimer.textContent = 'あなたのクリアタイムは' + s + '秒でした！';
  }
  function updateTimeText() {
    let s = Math.floor(elapsedTime / 1000);
    // s = ('0' + s).slice(-2);

    timer.textContent = 'time: ' + s + '秒';
  }

  function countUp() {
    timerId = setTimeout(function () {
      elapsedTime = Date.now() - startTime + timeToadd;
      updateTimeText();
      finalTimer();
      countUp();
    }, 10);
  }

  // -----------------------------------------------
  // ここから色々関数宣言したり、準備！
  // -----------------------------------------------

  // 関数：divの中に数字の入ったdivを作る準備をする。

  function createDiv(cardText) {

    const outsideCards = document.createElement('div');
    const div = document.createElement('div');

    outsideCards.className = ('outsideCard');
    div.className = ('card');
    div.textContent = cardText;

    cardsArea.appendChild(outsideCards);
    outsideCards.appendChild(div);
  }

  // 関数：ゲーム終了時に流す、リセットするやつ。
  function resetGame() {
    const removeCards = document.querySelectorAll('div.outsideCard');
    for (let i = 0; i < removeCards.length; i++) {
      cardsArea.removeChild(removeCards[i]);
    }
  }


  // 関数：ゲームスタートします。
  // ここからメインの部分です。
  function gameStart() {
    // タイマー開始です。
    startTime = Date.now();
    countUp();
    updateTimeText();
    for (let i = 0; i < classCardAreas.length; i++) {
      classOnOffCheck[i].classList.add('yet-card');
      classCardAreas[i].addEventListener('click', () => {
        // 1枚目の処理です。
        if (gameCounter === 0) {
          gameCounter++;

          classOnOffCheck[i].classList.add('card-show');
          firstNum = classOnOffCheck[i].textContent;
          classCardAreas[i].style.pointerEvents = 'none';

        } else if (gameCounter === 1) {
          // 2枚目の処理
          gameCounter++;
          classOnOffCheck[i].classList.add('card-show');
          secondNum = classOnOffCheck[i].textContent;
          for (let j = 0; j < classCardAreas.length; j++) {
            classCardAreas[j].style.pointerEvents = 'none';
          }
          checkMiniGameResult(firstNum, secondNum);
        }
      });


      //2枚目が終わったときに結果を確認します。 

      // リセットします。
      firstNum = 0;
      secondNum = 0;

      if (level === 1) {
        resultComment.textContent = "EASY"
      } else if (level === 2) {
        resultComment.textContent = "NORMAL"
      } else if (level === 3) {
        resultComment.textContent = "HARD"
      }
    }
  }




  // ----------------------------------------
  // 関数：2枚目をめくったときの正誤判定を行います。（上で使ってる）
  function checkMiniGameResult(n1, n2) {

    for (let j = 0; j < classCardAreas.length; j++) {
      classCardAreas[j].style.pointerEvents = 'none';
    }
    // もし、数字が一致してたら以下の処理をする。
    if (firstNum === secondNum) {
      for (let i = 0; i < classOnOffCheck.length; ++i) {
        if (classOnOffCheck[i].classList.contains('card-show')) {
          classOnOffCheck[i].classList.remove('card-show');
          classOnOffCheck[i].classList.remove('yet-card');
          classOnOffCheck[i].classList.add('keep-show-card');
        }
      }
      gameCounter = 0;
      // 一致してなかったら以下の処理をする。
    } else if (firstNum !== secondNum) {
      // 1秒後に、一時表示クラスを外してウラ表示にする。
      setTimeout(() => {
        for (let i = 0; i < classOnOffCheck.length; ++i) {
          if (classOnOffCheck[i].classList.contains('card-show')) {
            classOnOffCheck[i].classList.remove('card-show');
            // ミスカウンターを＋1します。
          }
        }
        missCounter++;
        gameCounter = 0;
      }, 1000);
    }
    for (let k = 0; k < classCardAreas.length; k++) {
      classCardAreas[k].style.pointerEvents = 'auto';
    }

    // すでに開いているカードは0枚です。（初期値）
    yetOpenCard = 0;

    // yet-cardクラスがあるかどうかカードの数だけ確認します。
    for (let i = 0; i < classOnOffCheck.length; i++) {
      if (classOnOffCheck[i].classList.contains('yet-card')) {
        yetOpenCard++;
      }
    }
    // 0枚だった場合は最終結果をチェックします。
    if (yetOpenCard === 0) {
      backBtn.style.display = 'none';
      // タイマーを止めてます。
      clearTimeout(timerId);
      timeToadd += Date.now() - startTime;
      checkFinalResult();
    }
    // 最終結果を確認しています。
    // ---------------------------------

    // 関数：最終結果確認（上で使用しています）
    function checkFinalResult() {

      mainGameArea.style.display = 'none';
      finalResult.style.display = 'block';
      // ミスのリザルトを表示！

      missResult.textContent = `おてつきは${missCounter}回でした！`;

      // いわゆる、リセットボタンです。
      replay();
      resetGame();
    }
    // ----------------------------
    // 関数：リセットボタン（上で使用しています）
    function replay() {

      // リプレイボタンを押した時の動き。
      replayBtn.addEventListener('click', () => {
        // タイマーをリセットしています。
        elapsedTime = 0;
        timeToadd = 0;
        // missCounterをリセットします。
        missCounter = 0;


        // 画面を難易度選択にしています。
        finalResult.style.display = 'none';
        levelChoice.style.display = 'block';
      });
    }
  }
  // --------------------------------------
  // 難易度選択へ戻るボタン
  backBtn.addEventListener('click', () => {
    // タイマーを止めてます。
    clearTimeout(timerId);
    timeToadd += Date.now() - startTime;
    // タイマーをリセットしています。
    elapsedTime = 0;
    timeToadd = 0;
    // ゲームのリセットをしてます。
    gameCounter = 0;
    missCounter = 0;
    // 画面を難易度選択にしています。
    mainGameArea.style.display = 'none';
    resetGame();
    levelChoice.style.display = 'block';
    backBtn.style.display = 'none';
  });
  // --------------------------------------
  // ------------------------------
  //配列：簡単モードカードの中身
  const cardsNumEasy = [1, 1, 2, 2]
  // 関数：簡単モードカードシャッフル
  function cardShuffleEasy() {

    for (let j = cardsNumEasy.length - 1; j >= 0; j--) {
      let rand = Math.floor(Math.random() * (j + 1));
      [cardsNumEasy[j], cardsNumEasy[rand]] = [cardsNumEasy[rand], cardsNumEasy[j],]
    }
  }
  // -------------------------------------
  // 配列：ふつうモードのカードの中身
  const cardsNumNormal = [1, 1, 2, 2, 3, 3, 4, 4,];
  // 関数：ふつうモードカードシャッフル
  function cardShuffleNormal() {

    for (let j = cardsNumNormal.length - 1; j >= 0; j--) {
      let rand = Math.floor(Math.random() * (j + 1));
      [cardsNumNormal[j], cardsNumNormal[rand]] = [cardsNumNormal[rand], cardsNumNormal[j],]
    }
  }
  // -------------------------------------
  // 配列：むずかしいモードのカードの中身
  const cardsNumHard = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8,];
  // むずかしいモードカードシャッフル
  function cardShuffleHard() {
    for (let j = cardsNumHard.length - 1; j >= 0; j--) {
      let rand = Math.floor(Math.random() * (j + 1));
      [cardsNumHard[j], cardsNumHard[rand]] = [cardsNumHard[rand], cardsNumHard[j],]
    }
  }
  // -------------------------------------
  // いよいよ本編スタート！
  //-------------------------------------- 
  // OKボタンを押すと次の画面へ
  okBtn.addEventListener('click', () => {
    rule.style.display = 'none';
    levelChoice.style.display = 'block';
  });
  // --------------------------------------
  // 難易度設定画面
  // 簡単モード
  easyBtn.addEventListener('click', () => {
    easyBtn.style.background = '#F4B2BA';
    easyBtn.style.border = '2px solid black';
    startBtn.style.pointerEvents = 'auto';
    errorMsg.style.display = 'none';
    level = 1;
    if (normalBtn.style.background = '#F4B2BA') {
      normalBtn.style.background = '#BDBDBD';
      normalBtn.style.border = '1px solid black';

    }
    if (hardBtn.style.background = '#F4B2BA') {
      hardBtn.style.background = '#BDBDBD';
      hardBtn.style.border = '1px solid black';
    }
  });
  // ふつうモード
  normalBtn.addEventListener('click', () => {
    normalBtn.style.background = '#F4B2BA';
    normalBtn.style.border = '2px solid black';
    startBtn.style.pointerEvents = 'auto';
    level = 2;
    errorMsg.style.display = 'none';
    if (hardBtn.style.background = '#F4B2BA') {
      hardBtn.style.background = '#BDBDBD';
      hardBtn.style.border = '1px solid black';
    }
    if (easyBtn.style.background = '#F4B2BA') {
      easyBtn.style.background = '#BDBDBD';
      easyBtn.style.border = '1px solid black';
    }
  });
  // むずかしいモード
  hardBtn.addEventListener('click', () => {
    hardBtn.style.background = '#F4B2BA';
    hardBtn.style.border = '2px solid black';
    startBtn.style.pointerEvents = 'auto';
    errorMsg.style.display = 'none';
    level = 3;
    if (easyBtn.style.background = '#F4B2BA') {
      easyBtn.style.background = '#BDBDBD';
      easyBtn.style.border = '1px solid black';
    }
    if (normalBtn.style.background = '#F4B2BA') {
      normalBtn.style.background = '#BDBDBD';
      normalBtn.style.border = '1px solid black';
    }
  });
  // --------------------------------------
  // スタートボタンを押すと走り出します。
  startBtn.addEventListener('click', () => {
    //全般設定:難易度設定ボタン出現させます。
    backBtn.style.display = 'block';

    // 簡単モードの場合
    if (level === 1) {
      // カードランダム生成をしている部分
      cardShuffleEasy();
      // カードの数字をdivに入れながら生成。
      for (let i = 0; i < 4; i++) {
        createDiv(cardsNumEasy[i]);
      }
      // メインゲームエリアを表示、レベル選択画面を消す。
      mainGameArea.style.display = 'block';
      levelChoice.style.display = 'none';
      // カード選択エリアの白背景のheight,margin-topを設定。
      cardsArea.style.height = '150px';
      cardsArea.style.marginTop = '50px';
      // ピンク背景のアレを調整
      mainGameArea.style.height = '300px';
      mainGameArea.style.marginTop = '-150px';
      // 難易度設定に戻るボタンの調整
      backBtn.style.marginTop = '170px';


      // ゲーム部分
      gameStart();

      // --------------------------------------
      // ふつうモードの場合
    } else if (level === 2) {
      // カードランダム生成をしている部分
      cardShuffleNormal();
      // カードの数字をdivに入れながら生成。
      for (let i = 0; i < 8; i++) {
        createDiv(cardsNumNormal[i]);
      }
      // メインゲームエリアを表示、レベル選択画面を消す。
      mainGameArea.style.display = 'block';
      levelChoice.style.display = 'none';
      // カード自体のサイズを変更;

      // カード選択エリアの白背景のheight,margin;-topを設定。
      cardsArea.style.height = '270px';
      cardsArea.style.marginTop = '30px';
      // ピンク背景のアレを調整
      mainGameArea.style.height = '390px';
      mainGameArea.style.marginTop = '-195px';
      // 難易度設定に戻るボタンの調整
      backBtn.style.marginTop = '200px';
      // ゲーム部分
      gameStart();

      // --------------------------------------
      // むずかしいモードの場合
    } else if (level === 3) {
      // カードランダム生成をしている部分
      cardShuffleHard();
      // カードの数字をdivに入れながら生成。
      for (let i = 0; i < 16; i++) {
        createDiv(cardsNumHard[i]);
      }
      // メインゲームエリアを表示、レベル選択画面を消す。
      mainGameArea.style.display = 'block';
      levelChoice.style.display = 'none';
      // カード自体のサイズを変更

      // カード選択エリアの白背景のheight,margin-topを設定。
      cardsArea.style.height = '460px';
      cardsArea.style.marginTop = '3px';
      // ピンク背景のアレを調整
      mainGameArea.style.height = '480px';
      mainGameArea.style.marginTop = '-280px';
      // 難易度設定に戻るボタンの調整
      backBtn.style.marginTop = '230px';
      // ゲーム部分
      gameStart();
    }
  });
}
//以上です！