const Bot = require('./index.js');

const intents = function({speech}) {
  return {
    'FAIL'(){
      speech.speak('很抱歉，我不明白你的意思，请再尝试一次')
    },
    'SWITCH_DEVICE_STATUS'(slots){
      const device = slots.user_device.original_word;
      const status = slots.user_device_status.original_word;
      const room = slots.user_room.original_word;
      speech.speak("明白,我会"+status+room+"的"+device)
    },
    'RAIN'(slots){
      speech.speak("让我来查一查");
    },
    'WEATHER_DAY'(slots){
      speech.speak("让我来问问气象局")
    },
    'TIME'(slots){
      const now = new Date();
      const strNow = now.getHours() + ":"+now.getMinutes();
      speech.speak("现在时间是"+strNow);
    }
  }
}

const opts = {
  apiKey:'1VkerpAf4y8Ipdxc5R1xPsx1',
  secretKey:'kUOllwbrube1Ke1dU0sKliy38h4iGsvB',
  sceneid:3679,
  intents
}

const bot = new Bot(opts);
bot.on('ready', () => bot.start())

bot.on('text', (text)=>console.log(text))
bot.on('intent', data => console.log(data))
bot.on('listen', () => console.log('Listening...'))
