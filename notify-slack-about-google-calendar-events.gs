var mailAddresses = [
  "hoge@gmail.com",
  "fuga@gmail.com"
];

function notifySevenDays() {
  var today = new Date();
  for (var i = 1; i < 8; i++) {
    var date = new Date();
    date.setDate(today.getDate() + i);
    _notify(_getSchedule(mailAddresses, date));
  }
}

function notifyThreeDays() {
  var today = new Date();
  for (var i = 1; i < 4; i++) {
    var date = new Date();
    date.setDate(today.getDate() + i);
    _notify(_getSchedule(mailAddresses, date));
  }
}

function notifyTomorrow() {
  var today = new Date();
  var tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  _notify(_getSchedule(mailAddresses, tomorrow));
}

/**
 * Slack への通知
 * @param {string} message
 */
function _notify(message) {
  var token = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
  var channel = "@channel";
  var username = "Schedule BOT";
  var text = message;
  UrlFetchApp.fetch("https://slack.com/api/chat.postMessage?token=" + token + "&channel=" + channel + "&username=" + username + "&text=" + text);
}

/**
 * GoogleCalendar より予定を取得する
 */
function _getSchedule(mailAddresses, date) {
  // URL にパラメータを含ませるので、\nで改行せずに URL エンコードされた改行コードを使用する
  var message = "";
  message += "----------------------------------------%0A";
  message += Utilities.formatDate(date, 'JST',' YYYY/MM/dd(E)') + "の予定%0A";

  for (var i = 0; i < mailAddresses.length; i++) {
    var cal = _getCalendar(mailAddresses[i]);
    var events = cal.getEventsForDay(date);
    for(var j = 0; j < events.length; j++){
      if (j === 0) {
        message += mailAddresses[i] + "の予定%0A";
      }
      var title = events[j].getTitle();
      var startTime = _timeFormat(events[j].getStartTime());
      var endTime = _timeFormat(events[j].getEndTime());
      var time = startTime === endTime ? "終日" : startTime + " ~ " + endTime;
      message += "    " + title + " : " + time + "%0A";
    }
  }
  return message;
}

function _getCalendar(mailAddress){
  return CalendarApp.getCalendarById(mailAddress);
}

function _timeFormat(date){ 
  return Utilities.formatDate(date,'JST','HH:mm');
}
