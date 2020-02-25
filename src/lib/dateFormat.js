export const dateFormat = (date) => {
        var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join("");
    }
// export default formatDate;

export const dateBarFormat = (date) => {

    const year = date.substring(0, 4);
    const month = date.substring(4, 6);
    const day = date.substring(6, 8);

    return date.length > 0 ? year + "-" + month + "-" + day : "";

}
/**
 * 
 * @param {db date타입} date 
 */
export const dateToBarFormat = (date) => {
    const d = new Date(date);

    return date.length > 0? d.getFullYear() + "-" + lpad(d.getMonth(), 2, "0")  + "-" + lpad(d.getDate(), 2, "0"): "";
}

/**
 * @param {원 문자열} str 
 * @param {최대 채우고자 하는 길이} padLen 
 * @param {채우고자하는 문자(char)} padStr 
 */
export const lpad = (str, padLen, padStr) => {
    if (padStr.length > padLen) {
        console.log("오류 : 채우고자 하는 문자열이 요청 길이보다 큽니다");
        return str;
    }
    str += ""; // 문자로
    padStr += ""; // 문자로
    while (str.length < padLen)
        str = padStr + str;
    str = str.length >= padLen ? str.substring(0, padLen) : str;
    return str;
}