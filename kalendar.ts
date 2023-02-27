type TimeSlotID = number;
type lessonInitObject = {
    firstDate: Date;
    repeat: "weekly" | "biweekly" | "once" | (()=>boolean);
    time: TimeSlot | TimeSlot[] | TimeSlotID;
    name: string;
    teacher: string | undefined;
    building: string;
    room: string;
};

type daytime = {
    hour: number;
    minute: number;
};

class TimeSlot{
    begin: daytime;
    end: daytime;
    constructor(param) {
        
    }
}

function dateDiffInDays(date1: Date, date2: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24; // 每天的毫秒数
  const timeDiff = Math.abs(date2.getTime() - date1.getTime()); // 时间差的毫秒数
  const diffInDays = Math.round(timeDiff / msPerDay); // 转换为天数
  return diffInDays;
}

class lesson {
    repeat: "weekly" | "biweekly" | "once" | (()=>boolean);
    _repeat: boolean;
    firstDate: Date;
    constructor(param:lessonInitObject) {
        if (typeof param.repeat === "string") {
            this._repeat = {
                "weekly": true,
                "biweekly":  ((() => {return dateDiffInDays(this.firstDate, new Date()) /7 % 2 == 0})()),
                "once": false
            }[param.repeat];
        } else {
            this.repeat = param.repeat;
        }
    }
}

