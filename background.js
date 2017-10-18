var timerObjects = [];

function Timer(tabID, duration, startDate) {
  this.tabID = tabID;
  this.duration = duration;
  this.startDate = startDate;
  this.diff = function() {
    // var difference = duration - (((Date.now() - startDate) / 1000) | 0);
    // if (difference <= 0) {
    //   chrome.tabs.remove(tabID);
    //   deleteTimer(timerIndex);
    // }
    return duration - (((Date.now() - startDate) / 1000) | 0);
  }
}

function createTimer(tabID, duration, startDate) {
  var timer = new Timer(tabID, duration, startDate);
  timer.index = timerObjects.length;
  timerObjects.push(timer);

  setTimeout(function() {
    deleteTab(tabID, timer.index);
  }, timer.duration * 1000);

  // var intervalVar = setInterval(timer.diff(), timer.duration);
  // var alarm = new Object();
  // alarm.delayInMinutes = duration;
  // chrome.alarms.create(""+timer.index, alarm);
}

function deleteTimer(timerIndex) {
  timerObjects.splice(timerIndex, 1);
}

function timerDifference(timerIndex) {
  return timerObjects[timerIndex].diff();
}

function tabExists(tabID) {
  var exists = false;
  for (var i = 0; i < timerObjects.length; i++) {
    if (timerObjects[i].tabID === tabID) {
      exists = i;
      i = timerObjects.length;
    }
  }
  return exists;
}

function getTimer(tabIndex) {
  return timerObjects[tabIndex];
}

function mostRecentIndex() {
  return timerObjects.length - 1;
}

function deleteTab(tabID, tabIndex) {
  chrome.tabs.remove(tabID);
  deleteTimer(tabIndex);
}
