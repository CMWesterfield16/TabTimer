var timerObjects = [];

// while (timerObjects.length > 0) {
//   for (var j = 0; j < timerObjects.length; j++) {
//     if (timerObjects[j].diff() <= 0) {
//       var timer = timerObjects[j];
//       chrome.tabs.remove(timer.tabID);
//       deleteTimer(timer.index);
//     }
//   }
// }

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
