import { getLessonDOFromTo } from './kalendar';
var displayWeekend = false;
var weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
function init() {
  //add the weekdays to the table
  for (var i = 0; i < weekdays.length; i++) {
    if (displayWeekend || i < 5) {
      $('#heading').append('<th>' + weekdays[i] + '</th>');
    }
  }
}
// LessonDisplayObject:
// {
//     beginTime: 2023-03-16T00:00:00.000Z,
//     endTime: 2023-03-16T01:40:00.000Z,
//     configs: { name: '离散数学', teacher: undefined, building: '', room: '' }
// }

// return LessonDisplayObject[]
function fetchLessons(beginDate, days) {
  return getLessonDOFromTo(beginDate, new Date(beginDate.getTime() + days * 24 * 60 * 60 * 1000));
}
function displayWeek(week) {
  //week must be monday
  if (week.getDay() != 1) {
    console.error(week);
    console.error('week must be amonday');
    return;
  }
  //clear the table
  $('#table').empty();
  //add the weekdays to the table
  for (var i = 0; i < weekdays.length; i++) {
    if (displayWeekend || i < 5) {
      $('#table').append('<tr id="row' + i + '"><th>' + weekdays[i] + '</th></tr>');
    }
  }

  //add the lessons to the table
  var lessons = fetchLessons(new Date(week), 6);
  console.log(lessons);
  for (var _i = 0; _i < lessons.length; _i++) {
    var lesson = lessons[_i];
    var beginTime = lesson.beginTime;
    var endTime = lesson.endTime;
    var weekday = beginTime.getDay();
    if (displayWeekend || weekday <= 5) {
      var beginHour = beginTime.getHours();
      var beginMinute = beginTime.getMinutes();
      var endHour = endTime.getHours();
      var endMinute = endTime.getMinutes();
      var begin = beginHour * 60 + beginMinute;
      var end = endHour * 60 + endMinute;
      var lessonName = lesson.configs.name;
      var lessonTeacher = lesson.configs.teacher;
      var lessonBuilding = lesson.configs.building;
      var lessonRoom = lesson.configs.room;
      var lessonInfo = lessonName + ' ' + lessonTeacher + ' ' + lessonBuilding + ' ' + lessonRoom;
      var row = $('#row' + weekday);
      var lessonHeight = (end - begin) / 2;
      var lessonTop = begin / 2;
      // row.append('<td class="lesson" style="height:' + lessonHeight + 'px; top:' + lessonTop + 'px;">' + lessonInfo + '</td>');
      // add line break
      row.append('<p>' + lessonInfo.replace(/ /g, '<br>') + '</p>');
    }
  }
}

// $(document).ready(init);
init();
displayWeek(new Date("2023-3-20"));