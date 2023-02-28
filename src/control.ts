import { getLessonDOFromTo } from './kalendar';

const displayWeekend = false;
const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];



function init() {
    //add the weekdays to the table
    for (let i = 0; i < weekdays.length; i++) {
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
function fetchLessons(beginDate : Date, days : number) {
    return getLessonDOFromTo(beginDate, new Date(beginDate.getTime() + days * 24 * 60 * 60 * 1000));
}

function displayWeek(week : Date) {
    //week must be monday
    if(week.getDay() != 1) {
        console.error(week);
        console.error('week must be amonday');
        return;
    }
    //clear the table
    $('#table').empty();
    //add the weekdays to the table
    for (let i = 0; i < weekdays.length; i++) {
        if (displayWeekend || i < 5) {
            $('#table').append('<tr id="row' + i + '"><th>' + weekdays[i] + '</th></tr>');
        }
    }
    
    //add the lessons to the table
    const lessons = fetchLessons(new Date(week), 6);
    console.log(lessons);
    for (let i = 0; i < lessons.length; i++) {
        const lesson = lessons[i];
        const beginTime = lesson.beginTime;
        const endTime = lesson.endTime;
        const weekday = beginTime.getDay();
        if (displayWeekend || weekday <= 5) {
            const beginHour = beginTime.getHours();
            const beginMinute = beginTime.getMinutes();
            const endHour = endTime.getHours();
            const endMinute = endTime.getMinutes();
            const begin = beginHour * 60 + beginMinute;
            const end = endHour * 60 + endMinute;
            const lessonName = lesson.configs.name;
            const lessonTeacher = lesson.configs.teacher;
            const lessonBuilding = lesson.configs.building;
            const lessonRoom = lesson.configs.room;
            const lessonInfo = lessonName + ' ' + lessonTeacher + ' ' + lessonBuilding + ' ' + lessonRoom;
            const row = $('#row' + weekday);
            const lessonHeight = (end - begin) / 2;
            const lessonTop = begin / 2;
            // row.append('<td class="lesson" style="height:' + lessonHeight + 'px; top:' + lessonTop + 'px;">' + lessonInfo + '</td>');
            // add line break
            row.append('<p>' + lessonInfo.replace(/ /g, '<br>') + '</p>');

        }

    }
}

// $(document).ready(init);
init();
displayWeek(new Date("2023-3-20"));