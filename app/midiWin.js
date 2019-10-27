const Store = require('electron-store');
const {app} = require('electron').remote
const audio = require('win-audio').speaker
const nanoKONTROL = require('@kaibu/korg-nano-kontrol');

const store = new Store();

store.set('sliders', [
  "chrome.exe",
  "Spotify.exe",
  "Play",
  "",
  "",
  "",
  "",
  "MASTER",
])
var gdevice
var timeout;

function toHundred(value) {
  return value / 127 *100
}

connect = () => {
  if(gdevice) {
    gdevice.close()
  }
  nanoKONTROL.connect('nanoKONTROL2')
    .then(function(device){
      sliders = store.get('sliders')
      gdevice = device
      console.log('connected!' + device.name);
      sliders.forEach((cur, i) => {
        device.on('slider:' + i, function(value){
          console.log(toHundred(value))
          if(timeout) {
            clearTimeout(timeout);
            timeout = null;
          }

          timeout = setTimeout(function() {
            switch (cur) {
              case 'MASTER':
                audio.setMaster(toHundred(value))
                break;
              default:
                audio.setApplicationName(cur,toHundred(value));
                break;
            }
          }, 10)
        });
      })
    })
    .catch(function(err){
      console.error(err);
    });
}

connect();
