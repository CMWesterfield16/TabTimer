var timerObjects = [];

function Timer(tabID, duration, startDate) {
  this.tabID = tabID;
  this.duration = duration;
  this.startDate = startDate;
  this.diff = function() {
    return duration - (((Date.now() - startDate) / 1000) | 0);
  }
}

function createTimer(tabID, duration, startDate) {
  var timer = new Timer(tabID, duration, startDate);
  timer.index = timerObjects.length;
  timerObjects.push(timer);
  var alarm = new Object();
  alarm.delayInMinutes = duration;
  chrome.alarms.create(""+timer.index, alarm);
  chrome.alarms.onAlarm.addListener(function(alarm) {
    console.log("Alarm Occurred");
    for (var k = 0; k < timerObjects.length; k++) {
      if (timerObjects[k].diff() <= 0) {
        var timer = timerObjects[k];
        chrome.tabs.remove(timer.tabID);
        deleteTimer(k);
      }
    }
  });
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
