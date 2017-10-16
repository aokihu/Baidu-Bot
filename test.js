const Bot = require('./index.js');

const opts = {
  apiKey:'1VkerpAf4y8Ipdxc5R1xPsx1',
  secretKey:'kUOllwbrube1Ke1dU0sKliy38h4iGsvB',
  sceneid:3679,
  voiceRate: '8000',
  continual: true,
  sensitivity: "0.4",
  gain: 1.0,
}

const bot = new Bot(opts);
bot.on('ready', () => {
  console.log('Bot准备完毕')
  bot.start()
})

bot.on('text', (text)=>console.log(text))
// bot.on('intent', data => console.log(data))
bot.on('listen', () => console.log('Listening...'))
bot.on('upload', () => console.log('Uploading voice data...'))
bot.on('wakeup', () => console.log('等待您的命令...'))
bot.on('sleep', () => console.log('Sleep'))
bot.on('timeout', () => console.log('TIME OUT'))
bot.on('error' , console.log)
