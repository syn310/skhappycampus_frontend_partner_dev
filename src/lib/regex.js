/** 숫자만 있는지 체크 */
export const isNumberReg = (value) => {
    const reg = new RegExp("^[0-9]+$");
    return reg.test(value);
}
/** url 형식에 맞는지 체크(http/https없이) */
export const isUrlReg = (strUrl) => {
    const expUrl = new RegExp("^(www\.){1}[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?");
    return expUrl.test(strUrl);
}