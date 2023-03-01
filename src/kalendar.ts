import data from "./lessons";

type TimeSlotID = number;
type lessonInitObject = {
    beginDate?: Date;
    endDate?: Date;
    weekday: number;
    repeat: "weekly" | "biweekly" | "once" | (() => boolean) | undefined;
    time: string | TimeSlot | TimeSlotID;
    name: string;
    teacher: string | undefined;
    building: string | undefined;
    room: string | undefined;
};
type CalendarDisplayObject = {
    beginTime: Date;
    endTime: Date;
    configs: any;
};
type daytime = {
    hour: number;
    minute: number;
};
class TimeSlot {
    begin: daytime;
    end: daytime;
    alias: string | undefined;
    constructor(param: string | { begin: daytime, end: daytime, alias?: string }) {
        if (typeof param === "string") {
            // format: "8:00-9:50"
            let [begin, end] = param.split("-");
            this.begin = {
                hour: parseInt(begin.split(":")[0]),
                minute: parseInt(begin.split(":")[1])
            };
            this.end = {
                hour: parseInt(end.split(":")[0]),
                minute: parseInt(end.split(":")[1])
            };
        } else {
            this.begin = param.begin;
            this.end = param.end;
            this.alias = param.alias;
        }
    }

    setAlias(name: string) {
        this.alias = name;
        return this;
    }
}
function dateDiffInDays(date1: Date, date2: Date): number {
    const msPerDay = 1000 * 60 * 60 * 24; // 每天的毫秒数
    const timeDiff = Math.abs(date2.getTime() - date1.getTime()); // 时间差的毫秒数
    const diffInDays = Math.round(timeDiff / msPerDay); // 转换为天数
    return diffInDays;
}
class Lesson {
    _repeat: (() => boolean) | string = "weekly";
    // check if the lesson should be repeated on this week
    doRepeat(date: Date): boolean {
        if (typeof this._repeat === "string") {
            return ({
                "weekly": ()=>true,
                "biweekly": ()=>Math.floor(dateDiffInDays(this.beginDate, date) / 7)% 2 === 0,
                "once": ()=>false,
            } as any)[this._repeat]();
        } else {
            return this._repeat();
        }
    }

    hasLessonOnTime(date: string | Date): boolean {
        if (typeof date === "string") {
            date = new Date(date);
        }
        // check if within the date range
        if (this.beginDate > date || (this.endDate && this.endDate < date)) {
            return false;
        }
        if (this.doRepeat(date)) {

            return this.time.begin.hour <= (date as Date).getHours() &&
                this.time.end.hour >= (date as Date).getHours() &&
                this.time.begin.minute <= (date as Date).getMinutes() &&
                this.time.end.minute >= (date as Date).getMinutes();

        } else {
            return false;
        }
    }
    //check only date
    hasLessonOnDate(date: string | Date): boolean {
        if (typeof date === "string") {
            date = new Date(date);
        }
        // check if within the date range
        if (this.beginDate > date || (this.endDate && this.endDate < date)) {
            return false;
        }
        if (this.doRepeat(date)) {
            if (this.weekday === (date as Date).getDay()) {
                return true;
            }
        }
        return false;
    }

    getDisplayObjectOfDate(date: Date): CalendarDisplayObject | undefined {
        if (this.hasLessonOnDate(date)) {
            let beginTime = new Date(date);
            let endTime = new Date(date);
            beginTime.setHours(this.time.begin.hour);
            beginTime.setMinutes(this.time.begin.minute);
            endTime.setHours(this.time.end.hour);
            endTime.setMinutes(this.time.end.minute);

            return {
                beginTime: beginTime,
                endTime: endTime,
                configs: {
                    name: this.name,
                    teacher: this.teacher,
                    building: this.building,
                    room: this.room
                }
            };
        } else {
            return undefined;
        }
    }

    beginDate: Date = data.globalConfigs.beginDate;
    endDate?: Date;
    time: TimeSlot;
    name: string;
    teacher: string | undefined;
    building: string;
    room: string;
    weekday: number;
    constructor(param: lessonInitObject) {
        if(typeof param.beginDate === "string") param.beginDate = new Date(param.beginDate);
        if(typeof param.endDate === "string") param.endDate = new Date(param.endDate);
        if(!param.beginDate) param.beginDate = data.globalConfigs.beginDate;
        if(!param.endDate) param.endDate = data.globalConfigs.endDate;
        if(param.beginDate > param.endDate) throw new Error("beginDate should be earlier than endDate");
        if (!param.repeat) param.repeat = "weekly";
        if (typeof param.repeat === "string" && param.repeat.startsWith("function")) {
            this._repeat = getFunctionByString(param.repeat);
        } else if (typeof param.repeat === "string" && ["weekly", "biweekly", "once"].includes(param.repeat)) {
            this._repeat = param.repeat;
        }
        if (typeof param.time === "number") {
            this.time = timeSlots[param.time];
        } else if (typeof param.time === "string") {
            this.time = timeSlots.find((item) => item.alias === param.time) ?? new TimeSlot(param.time);
        } else {
            this.time = param.time;
        }
        this.name = param.name;
        this.weekday = param.weekday;
        this.teacher = param.teacher;
        this.building = param.building ?? "";
        this.room = param.room ?? "";
    }
}
function getFunctionByString(func: string) {
    return Function('"use strict";return (' + func + ')')();
}
function initDefaultTimeSlots() {
    let timeSlots: TimeSlot[] = [
        new TimeSlot("8:00-9:40").setAlias("12"),
        new TimeSlot("10:10-11:50").setAlias("34"),
        new TimeSlot("13:50-15:30").setAlias("56"),
        new TimeSlot("15:50-17:50").setAlias("78"),
    ];

    return timeSlots;
}
let timeSlots = initDefaultTimeSlots();
let lessons: Lesson[] = [];
function importAllLessons() {
    data.lessons.forEach((item) => {
        lessons.push(new Lesson(item as lessonInitObject));
    });
}
function getLessonsOfDate(date: Date | string) {
    if (typeof date === "string") {
        date = new Date(date);
    }
    return lessons.filter((item) => item.hasLessonOnDate(date));
}

function UTCtoChinaTime(date: Date) {
    return new Date(date.getTime() + 8 * 60 * 60 * 1000);
}

export function getLessonDOFromTo(beginDate: Date, endDate: Date) {
    let lessonsDO: CalendarDisplayObject[][] = [];
    for (let i = beginDate; i <= endDate; i.setDate(i.getDate() + 1)) {
        lessonsDO.push([]);
        getLessonsOfDate(i).forEach(element => {
            const lessonDO = element.getDisplayObjectOfDate(i);
            if (lessonDO) {
                lessonsDO[lessonsDO.length - 1].push(lessonDO);
            }
        });
    }
    return lessonsDO;
}

importAllLessons();

let lessonsDO = getLessonDOFromTo(new Date("2023-3-16"), new Date("2023-3-16"));

lessonsDO.forEach((item) => {
    console.log(item);
});
