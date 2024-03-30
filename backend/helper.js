function timetoseconds(time) {
    return parseInt(time.substr(0, 2)) * 3600 + parseInt(time.substr(3, 5)) * 60 + parseInt(time.substr(6, 8));
}

function secondstotime(seconds) {
    var hours = Math.floor(seconds / 3600);
    var minutes = Math.floor((seconds - (hours * 3600)) / 60);
    var secondss = seconds - (hours * 3600) - (minutes * 60);

    if (hours < 10) { hours = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }
    if (secondss < 10) { secondss = "0" + secondss; }
    return hours + ':' + minutes + ':' + secondss;
}

function getTime(days = 0, format = "Y-m-d H:i:s") {
    var date = new Date();
    date.setDate(date.getDate() + days);
    date.toLocaleString("en-US", { timeZone: "Asia/Jakarta" });
    let year = date.getFullYear();
    let month = ("0" + (date.getMonth() + 1)).slice(-2);
    let dates = ("0" + date.getDate()).slice(-2);
    let hours = ("0" + date.getHours()).slice(-2);
    let minutes = ("0" + date.getMinutes()).slice(-2);
    let seconds = ("0" + date.getSeconds()).slice(-2);
    let date_time;
    if (format == "Y-m-d H:i:s") {
        date_time = year + "-" + month + "-" + dates + " " + hours + ":" + minutes + ":" + seconds;
    } else if (format == "Y-m-d") {
        date_time = year + "-" + month + "-" + dates;
    } else if (format == "H:i:s") {
        date_time = hours + ":" + minutes + ":" + seconds;
    }
    return date_time;
}
function getDates(dt, days = 0, format = "Y-m-d H:i:s") {
    let date = new Date(dt);
    date.setDate(date.getDate() + days);
    date.toLocaleString("en-US", { timeZone: "Asia/Jakarta" });
    let year = date.getFullYear();
    let month = ("0" + (date.getMonth() + 1)).slice(-2);
    let dates = ("0" + date.getDate()).slice(-2);
    let hours = ("0" + date.getHours()).slice(-2);
    let minutes = ("0" + date.getMinutes()).slice(-2);
    let seconds = ("0" + date.getSeconds()).slice(-2);
    let date_time;
    if (format == "Y-m-d H:i:s") {
        date_time = year + "-" + month + "-" + dates + " " + hours + ":" + minutes + ":" + seconds;
    } else if (format == "Y-m-d") {
        date_time = year + "-" + month + "-" + dates;
    } else if (format == "H:i:s") {
        date_time = hours + ":" + minutes + ":" + seconds;
    }
    return date_time;
}

function getSatSun(month, year) {
    let holidays = [];
    for (let i = 0; i <= new Date(year, month, 0).getDate(); i++) {
        let date = new Date(year, month, i);
        if (date.getDay() == 6 || date.getDay() === 0) {
            if (holidays.length <= 2 && date.getDate() == 31) {
                continue;
            } else if (holidays.length <= 2 && date.getDate() == 30) {
                continue;
            }
            holidays.push(date.getDate());
        }
    }
    return holidays;
}
function getNotSatSun(month, year) {
    let holidays = [];
    for (let i = 0; i <= new Date(year, month, 0).getDate(); i++) {
        let date = new Date(year, month, i);
        if (date.getDay() == 1 || date.getDay() == 2 || date.getDay() == 3 || date.getDay() == 4 || date.getDay() == 5) {
            if (holidays.length <= 2 && date.getDate() == 31) {
                continue;
            } else if (holidays.length <= 2 && date.getDate() == 30) {
                continue;
            }
            holidays.push(date.getDate());
        }
    }
    return holidays;
}

function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}


module.exports = { getNotSatSun, getSatSun, timetoseconds, secondstotime, getTime, getDates, daysInMonth }