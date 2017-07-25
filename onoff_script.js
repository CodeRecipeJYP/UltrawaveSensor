
/**
* Created by jaeyoung on 7/24/17.
*/
var Gpio = require('onoff').Gpio;

var pin_trigger = 13
var pin_echo = 19

var trigger = new Gpio(pin_trigger, 'out');
var echo = new Gpio(pin_echo, 'in', 'both');
var startMillis;
var endMillis;

var microtime  = require('microtime');
function getMillis() {
  return microtime.now() / 1000;
}

echo.watch(function (err, value) {
  if (err) {
    throw err;
  }

  if (value) {
    // start
    startMillis = getMillis();
  } else {
    // receive
    endMillis = getMillis();
    var elapsedMillis = endMillis - startMillis;
    // console.log('elapsedMillis', elapsedMillis);
    var length = elapsedMillis * 170 / 1000;
    length = length.toFixed(3);
    if (length < 1) {
      console.log(length, 'm');
    } else if(length > 10) {
      console.log(length, 'm');
    }
  }
  // console.log('echo',value);
});

input_delay = (0.000001)*1000;
cycle_delay = (0.2)*1000;

function triggerOff() {
  // console.log("Trigger off");
  trigger.writeSync(0);
}

function triggerOn() {
  // console.log("Trigger on");
  trigger.writeSync(1);
}

function oneCycle() {
  triggerOn();
  setTimeout(triggerOff, input_delay);
}

setInterval(oneCycle, cycle_delay);
