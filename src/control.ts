import { getLessonDOFromTo } from './kalendar';

const displayWeekend = false;
const displayTeacher = false;
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

const px_per_min = 1.2;

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
        const lessonsOfDay = lessons[i];
        let lastLessonEnd = 0;
        for(let j = 0; j < lessonsOfDay.length; j++) {
            const lesson = lessonsOfDay[j];
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
                const row = $('#row' + weekday);
                const lessonHeight = (end - begin)*px_per_min;
                const zero_line = 8 * 60 * px_per_min;
                let lessonTop = begin * px_per_min - zero_line;
                if (lessonTop < 0) {
                    lessonTop = 0;
                }
                lessonTop -= lastLessonEnd;
                lastLessonEnd += lessonTop + lessonHeight;
                let mydiv = document.createElement('div');
                mydiv.className = 'lesson';
                mydiv.style.position = 'relative';
                mydiv.style.marginTop = lessonTop + 'px';
                mydiv.style.height = lessonHeight + 'px';
                mydiv.style.textAlign = 'center';
                let pLessonName = document.createElement('p');
                pLessonName.innerText = lessonName;
                mydiv.appendChild(pLessonName);
                if (displayTeacher) {
                    let pLessonTeacher = document.createElement('p');
                    pLessonTeacher.innerText = lessonTeacher;
                    mydiv.appendChild(pLessonTeacher);
                }
                let pLocation = document.createElement('p');
                pLocation.innerText = lessonBuilding + ' ' + lessonRoom;
                mydiv.appendChild(pLocation);
                
                row.append(mydiv);
            }
        }
    }
}

// $(document).ready(init);
init();
displayWeek(new Date("2023-3-20"));