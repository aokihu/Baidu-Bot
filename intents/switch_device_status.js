module.exports = ({speech, slots}) => {

  console.log(slots);
  const {user_device:device, user_room:room, user_device_status:status} = slots;
  const text = "好的,我会为您"+status.original_word+room.original_word+"的"+device.original_word;
  speech.speak(text);
}
