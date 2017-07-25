
/**
* Created by jaeyoung on 7/24/17.
*/
var gpio = require('rpi-gpio');
var timer = require('timers');
var microtime  = require('microtime');

var pin_trigger = 33
var pin_echo = 35

var startMillis;
var endMillis;
var startFlag;

function getMillis() {
  return microtime.now() / 1000;
}

function initialize() {
  gpio.setup(pin_trigger, gpio.DIR_OUT);
  gpio.setup(pin_echo, gpio.DIR_IN);

  input_delay = (0.000001)*1000;
  cycle_delay = (1)*1000;
  read_delay = (0.1)*1000;
  startFlag = false;
}

function readEcho() {
  gpio.read(pin_echo, function(err, value) {
    if (err) {
      throw err;
    }

    console.log('echo',value);

    if (value) {
      // start
      startFlag = true;
      startMillis = getMillis();
    } else if(startFlag) {
      // receive
      endMillis = getMillis();

      var elapsedMillis = endMillis - startMillis;
      console.log("time", elapsedMillis);
      var length = elapsedMillis * 170 / 1000;
      length = length.toFixed(3);
      console.log(length, 'm');
      startFlag = false;
    }
  });
}

function oneCycle() {
  triggerOn();
  setTimeout(triggerOff, input_delay);
}


function triggerOff() {
  // console.log("Trigger off");
  gpio.write(pin_trigger, false);
}

function triggerOn() {
  // console.log("Trigger on");
  gpio.write(pin_trigger, true);
  startMillis = new Date().getTime();
}

initialize();
setInterval(readEcho, read_delay);
setInterval(oneCycle, cycle_delay);
