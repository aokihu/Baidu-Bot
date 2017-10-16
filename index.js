const EventEmitter = require('events');
const path = require('path');
const fs = require('fs');
const R = require('ramda');
const BDSpeech = require('baidu_yuyin');
const BDListener = require('baidu-stt');
const BDUNIT = require('baidu_unit');
const player = require('play-sound')(opts = {})

const READY_MAX = 2;

class BaiduBot extends EventEmitter {

  /**
   * @constructor
   * @param {stirng} apiKey
   * @param {string} secretKey
   * @param {string} sceneid
   * @param {string} player
   * @param {boolean} continual
   * @param {Path} intentsDir
   */
  constructor({
    apiKey,
    secretKey,
    sceneid,
    recordRate = '16000',
    player,
    hotword,
    modelFile,
    gain,
    continual,
    sensitivity,
    intentsDir = './intents'}){
      // call super()
      super();

      this.speech = new BDSpeech(apiKey, secretKey);
      this.listener = new BDListener({apiKey, secretKey, voiceRate: recordRate, continual, gain,sensitivity,hotword,modelFile});
      this.unit = new BDUNIT({apiKey, secretKey, sceneid});

      this.listener.on('ready', () => {this._.readyCount += 1;});
      this.unit.on('ready', () => {this._.readyCount += 1;});

      this.listener.init();
      this.unit.init();

      this.listener.on('start', () => this.emit('listen'))
      this.listener.on('success', this._query.bind(this))
      this.listener.on('wakeup', this._wakeup.bind(this))
      this.listener.on('upload', this._upload.bind(this))
      this.listener.on('sleep', () => this.emit('sleep'))
      this.listener.on('fail', error => this.emit('error', error))
      this.listener.on('timeout', () => this.emit('timeout'))
      this.unit.on('success', this._response.bind(this))
      this.unit.on('fail', this._fail.bind(this))
      this.unit.on('debug', (data)=>console.log(data))

      this._ = {
        readyCount: 0,
        status: 'none',
        intents: {},
        intentsDir
      }

      // TODO Load intents from floder
      this._loadIntents();

      setTimeout(() => {
        if(this._.readyCount === READY_MAX) {
          this._.status = 'ready';
          this.emit('ready');
        }else{
          this.emit('error', 'Service is not ready');
        }
      }, 500);

  }

  start(){
    if(this._.status === 'ready'){
      this.listener.listen();
    }
  }

  _loadIntents(){
    fs.readdir(this._.intentsDir, (err, files) => {
      if(err) throw(err);

      const intents = files.map(item => {
        const intentPath = path.resolve(__dirname, this._.intentsDir, item);
        const func = require(intentPath);
        return func;
      });

      const intentKeys = files.map(file => file.toUpperCase().split('.')[0]);
      this._.intents = R.zipObj(intentKeys, intents);
    });
  }

  _query(text){
    this.emit('text', text);
    this.unit.query(text[0]);
  }

  _response(intents){
    const {intent, slots, emotion} = intents;
    const has = R.has(intent, this._.intents);

    if(has){
      try{
        const action = this._.intents[intent];
        action({speech:this.speech, slots, emotion});
      }
      catch(err){
        this.speech.speak("不好!好像发生了错误");
        console.log(err);
      }

    }
  }

  _fail(){
    this.speech.speak("很抱歉，我不明白你的意思，请在尝试一次.")
  }

  _wakeup(){
    player.play('./resources/ding.wav');
    this.emit('wakeup');
  }

  _upload(){
    player.play('./resources/dong.wav');
    this.emit('upload');
  }

}

module.exports = BaiduBot;
