document.title = "Tab Timer";
var background = chrome.extension.getBackgroundPage();
document.addEventListener('DOMContentLoaded', function () {
  getTabIDInitial(initialCheck);
});

function getTabIDInitial(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };
  console.log("Getting ID Inital");

  chrome.tabs.query(queryInfo, (tabs) => {
    var tabID = tabs[0].id;
    callback(tabID);
  });
}

function initialCheck(tabID) {
  var exists = background.tabExists(tabID);
  console.log("Exists?" + exists);
  load(exists, tabID);
}

function startTimer(startDate, duration, display, tabID, tabIndex) {
  console.log("Starting timer");
  var start = startDate,
          diff,
          minutes,
          seconds;
  function timer() {
      // get the number of seconds that have elapsed since
      // startTimer() was called
      diff = duration - (((Date.now() - start) / 1000) | 0);
      if (diff === 0) {
        clearInterval(intervalVar);
        chrome.tabs.remove(tabID);
        background.deleteTimer(tabIndex);
      }
      // does the same job as parseInt truncates the float
      minutes = (diff / 60) | 0;
      seconds = (diff % 60) | 0;

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;
      display.innerHTML = minutes + ":" + seconds;

      if (diff <= 0) {
          // add one second so that the count down starts at the full duration
          // example 05:00 not 04:59
          start = Date.now() + 1000;
    }
  }
  // we don't want to wait a full second before the timer starts
  timer();
  var intervalVar = setInterval(timer, 1000);
}

function load(exists, tabID) {
  //Title Bar
  var titleDiv = document.createElement('div');
  titleDiv.id = 'title-div';
  titleDiv.className = 'div-formatting';
  container.append(titleDiv);

  var titleText = document.createElement('div');
  titleText.id = 'title-text';
  titleText.innerHTML = 'Tab Timer';
  titleText.className = 'title-text-formatting';
  titleDiv.append(titleText);

  var componentsDiv = document.createElement('div');
  componentsDiv.id = 'components-div';
  componentsDiv.className = 'div-formatting';
  container.append(componentsDiv);

  //Timer set
  var timerDiv = document.createElement('div');
  timerDiv.id = 'timer-div';
  timerDiv.className = 'div-formatting active-container';
  componentsDiv.append(timerDiv);

  var timerText = document.createElement('div');
  timerText.id = 'timer-text';
  timerText.className = 'general-text-formatting';
  timerText.innerHTML = 'Set Timer: ';
  timerDiv.append(timerText);

  var timerInput = document.createElement('INPUT');
  timerInput.setAttribute("type", "text");
  timerInput.id = 'timer-input';
  timerInput.placeholder = 'Type Minutes Here';
  timerDiv.append(timerInput);

  var timerGo = document.createElement('BUTTON');
  timerGo.id = 'timer-go';
  timerGo.innerHTML = 'Set';
  timerGo.className = 'btn-properties';
  timerDiv.append(timerGo);


  //Countdown
  var countdownDiv = document.createElement('div');
  countdownDiv.id = 'countdown-div';
  countdownDiv.className = 'div-formatting hidden-container';
  componentsDiv.append(countdownDiv);

  var countdownText = document.createElement('div');
  countdownText.id = 'countdown-text';
  countdownText.className = 'general-text-formatting';
  countdownText.innerHTML = 'Tab Will Close In: ';
  countdownDiv.append(countdownText);

  var counter = document.createElement('div');
  counter.id = 'counter';
  counter.className = 'general-text-formatting';
  countdownDiv.append(counter);
  //
  // function getTabID(callback, duration, counter) {
  //   var queryInfo = {
  //     active: true,
  //     currentWindow: true
  //   };
  //   console.log("Getting ID");
  //
  //   chrome.tabs.query(queryInfo, (tabs) => {
  //     var tabID = tabs[0].id;
  //     console.log(tabID);
  //     var nowDate = Date.now();
  //     background.createTimer(tabID, duration, nowDate);
  //     var tabIndex = background.mostRecentIndex();
  //     callback(nowDate, duration, counter, tabID, tabIndex);
  //   });
  // }

  timerGo.addEventListener('click', function() {
    var tempTime = timerInput.value;
    if (isNaN(tempTime)) {
      timerInput.value = "";
      timerInput.placeholder = "Please type a number";
    } else {
      countdownDiv.className = 'div-formatting active-container';
      timerDiv.className = 'div-formatting hidden-container';
      var duration = 60 * Number(tempTime);
      var nowDate = Date.now();
      background.createTimer(tabID, duration, nowDate);
      var tabIndex = background.mostRecentIndex();
      startTimer(nowDate, duration, counter, tabID, tabIndex);
    }
  });

  function continuedCountdown(tabIndex) {
    countdownDiv.className = 'div-formatting active-container';
    timerDiv.className = 'div-formatting hidden-container';
    var currentTabObject = background.getTimer(tabIndex);
    startTimer(currentTabObject.startDate,
                currentTabObject.duration,
                counter,
                currentTabObject.tabID,
                currentTabObject.index);
  }

  if (exists !== false) {
    continuedCountdown(exists);
  }
}
