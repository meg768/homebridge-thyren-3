"use strict";
var TelldusAccessory = require('./accessory.js');
var Timer = require('yow/timer');

module.exports = class TelldusMotionSensor extends TelldusAccessory {

    constructor(platform, config, device) {
        super(platform, config, device);

        this.state = false;
        this.services.motionSensor = new this.Service.MotionSensor(this.displayName, this.device.name);
        this.timer = new Timer();

        var service = this.services.motionSensor;
        var characteristics = service.getCharacteristic(this.Characteristic.MotionDetected);

        characteristics.updateValue(this.state);

        characteristics.on('get', (callback) => {
            callback(null, this.state);
        });
    }


    deviceChanged() {
        var timeout = this.config.timeout ? this.config.timeout : 5;
        var service = this.services.motionSensor;
        var characteristics = service.getCharacteristic(this.Characteristic.MotionDetected);

        if (!this.state) {
            this.log('Movement detected on motion sensor', this.device.name);

            this.platform.notify(this.config.notify);
            this.platform.alert(this.config.alert);

            this.timer.cancel();
            characteristics.updateValue(this.state = true);

            this.timer.setTimer(timeout * 1000, () => {
                this.log('Resetting movement for motion sensor', this.device.name);
                characteristics.updateValue(this.state = false);
            });
        }

    }

};
