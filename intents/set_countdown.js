module.exports = ({speech, slots}) => {
  const {sys_time_interval} = slots;
  const coutdown = parseInt(sys_time_interval.normalized_word);

  setTimeout(() => {
    speech.speak('嘟~嘟~嘟,时间到!')
  }, coutdown * 1000);
  
  speech.speak('设定倒计时'+sys_time_interval.original_word)
}