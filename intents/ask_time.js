module.exports = (speech) => {
  return slots => {
    console.log(slots)

    const now = new Date();
    const pm = now.getHours() > 12 ? true : false;
    const hour = pm ? now.getHours() - 12 : now.getHours();
    let strNow = pm ? "下午" : "";
    strNow += hour+"点"+now.getMinutes()+"分";

    speech.speak("现在时间是"+strNow);
  }
}