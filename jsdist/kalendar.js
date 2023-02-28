function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
import data from "./lessons";
var TimeSlot = /*#__PURE__*/function () {
  function TimeSlot(param) {
    _classCallCheck(this, TimeSlot);
    if (typeof param === "string") {
      // format: "8:00-9:50"
      var _param$split = param.split("-"),
        _param$split2 = _slicedToArray(_param$split, 2),
        begin = _param$split2[0],
        end = _param$split2[1];
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
  _createClass(TimeSlot, [{
    key: "setAlias",
    value: function setAlias(name) {
      this.alias = name;
      return this;
    }
  }]);
  return TimeSlot;
}();
function dateDiffInDays(date1, date2) {
  var msPerDay = 1000 * 60 * 60 * 24; // 每天的毫秒数
  var timeDiff = Math.abs(date2.getTime() - date1.getTime()); // 时间差的毫秒数
  var diffInDays = Math.round(timeDiff / msPerDay); // 转换为天数
  return diffInDays;
}
var Lesson = /*#__PURE__*/function () {
  function Lesson(param) {
    var _param$building, _param$room;
    _classCallCheck(this, Lesson);
    _defineProperty(this, "_repeat", "weekly");
    _defineProperty(this, "beginDate", data.globalConfigs.beginDate);
    if (typeof param.beginDate === "string") param.beginDate = new Date(param.beginDate);
    if (typeof param.endDate === "string") param.endDate = new Date(param.endDate);
    if (!param.beginDate) param.beginDate = data.globalConfigs.beginDate;
    if (!param.endDate) param.endDate = data.globalConfigs.endDate;
    if (param.beginDate > param.endDate) throw new Error("beginDate should be earlier than endDate");
    if (!param.repeat) param.repeat = "weekly";
    if (typeof param.repeat === "string" && param.repeat.startsWith("function")) {
      this._repeat = getFunctionByString(param.repeat);
    } else if (typeof param.repeat === "string" && ["weekly", "biweekly", "once"].includes(param.repeat)) {
      this._repeat = param.repeat;
    }
    if (typeof param.time === "number") {
      this.time = timeSlots[param.time];
    } else if (typeof param.time === "string") {
      var _timeSlots$find;
      this.time = (_timeSlots$find = timeSlots.find(function (item) {
        return item.alias === param.time;
      })) !== null && _timeSlots$find !== void 0 ? _timeSlots$find : new TimeSlot(param.time);
    } else {
      this.time = param.time;
    }
    this.name = param.name;
    this.weekday = param.weekday;
    this.teacher = param.teacher;
    this.building = (_param$building = param.building) !== null && _param$building !== void 0 ? _param$building : "";
    this.room = (_param$room = param.room) !== null && _param$room !== void 0 ? _param$room : "";
  }
  _createClass(Lesson, [{
    key: "doRepeat",
    value:
    // check if the lesson should be repeated on this week
    function doRepeat(date) {
      var _this = this;
      if (typeof this._repeat === "string") {
        return {
          "weekly": function weekly() {
            return true;
          },
          "biweekly": function biweekly() {
            return Math.floor(dateDiffInDays(_this.beginDate, date) / 7) % 2 === 0;
          },
          "once": function once() {
            return false;
          }
        }[this._repeat]();
      } else {
        return this._repeat();
      }
    }
  }, {
    key: "hasLessonOnTime",
    value: function hasLessonOnTime(date) {
      if (typeof date === "string") {
        date = new Date(date);
      }
      // check if within the date range
      if (this.beginDate > date || this.endDate && this.endDate < date) {
        return false;
      }
      if (this.doRepeat(date)) {
        return this.time.begin.hour <= date.getHours() && this.time.end.hour >= date.getHours() && this.time.begin.minute <= date.getMinutes() && this.time.end.minute >= date.getMinutes();
      } else {
        return false;
      }
    }
    //check only date
  }, {
    key: "hasLessonOnDate",
    value: function hasLessonOnDate(date) {
      if (typeof date === "string") {
        date = new Date(date);
      }
      // check if within the date range
      if (this.beginDate > date || this.endDate && this.endDate < date) {
        return false;
      }
      if (this.doRepeat(date)) {
        if (this.weekday === date.getDay()) {
          return true;
        }
      }
      return false;
    }
  }, {
    key: "getDisplayObjectOfDate",
    value: function getDisplayObjectOfDate(date) {
      if (this.hasLessonOnDate(date)) {
        var beginTime = new Date(date);
        var endTime = new Date(date);
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
  }]);
  return Lesson;
}();
function getFunctionByString(func) {
  return Function('"use strict";return (' + func + ')')();
}
function initDefaultTimeSlots() {
  var timeSlots = [new TimeSlot("8:00-9:40").setAlias("12"), new TimeSlot("10:10-11:50").setAlias("34"), new TimeSlot("13:50-15:30").setAlias("56"), new TimeSlot("15:50-17:50").setAlias("78")];
  return timeSlots;
}
var timeSlots = initDefaultTimeSlots();
var lessons = [];
function importAllLessons() {
  data.lessons.forEach(function (item) {
    lessons.push(new Lesson(item));
  });
}
function getLessonsOfDate(date) {
  if (typeof date === "string") {
    date = new Date(date);
  }
  return lessons.filter(function (item) {
    return item.hasLessonOnDate(date);
  });
}
function UTCtoChinaTime(date) {
  return new Date(date.getTime() + 8 * 60 * 60 * 1000);
}
export function getLessonDOFromTo(beginDate, endDate) {
  var lessonsDO = [];
  var _loop = function _loop(i) {
    getLessonsOfDate(i).forEach(function (element) {
      var lessonDO = element.getDisplayObjectOfDate(i);
      if (lessonDO) {
        lessonsDO.push(lessonDO);
      }
    });
  };
  for (var i = beginDate; i <= endDate; i.setDate(i.getDate() + 1)) {
    _loop(i);
  }
  return lessonsDO;
}
importAllLessons();
var lessonsDO = getLessonDOFromTo(new Date("2023-3-16"), new Date("2023-3-16"));
lessonsDO.forEach(function (item) {
  console.log(item);
});