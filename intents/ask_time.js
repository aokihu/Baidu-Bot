module.exports = ({speech, slots}) => {
    console.log(slots)

    const now = new Date();
    const pm = now.getHours() > 12;
    const hour = pm ? now.getHours() - 12 : now.getHours();
    let strNow = pm ? "下午" : "";
    const minutes = now.getMinutes() > 10 ? now.getMinutes() : "零" + now.getMinutes();

    strNow += hour+"点"+minutes+"分";

    speech.speak("现在时间是"+strNow);
}
