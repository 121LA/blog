function time(){
    var now = new Date();
    var year = now.getFullYear;
    var month = now.getMonth()+1;
    var day = now.getDay();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();

    month = month<10? '0'+month : month;
    day = day<10 ? '0'+day : day;
    hour = hour<10 ? '0'+hour : hour;
    minute = minute<10 ? '0'+minute : minute;
    second = second<10 ? '0'+second : second;

    return {
        date: now,
        year: year,
        month: year +'-'+ month,
        day: year +'-'+ month +'-'+ day,
        minute: year +'-'+ month +'-'+ day +' '+ hour +':'+ minute,
        second: year +'-'+ month +'-'+ day +' '+ hour +':'+ minute +':'+ second
    }
    
}
// 存储各种时间，方便以后扩展
module.exports = time;