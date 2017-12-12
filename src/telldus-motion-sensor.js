"use strict";
var TelldusAccessory = require('./telldus-accessory.js');
var telldus = require('telldus');
var Timer = require('./timer.js');

module.exports = class TelldusMotionSensor extends TelldusAccessory {

    constructor(platform, config, device) {
        super(platform, config, device);

        this.service = new this.Service.MotionSensor(this.name);

        var timer = new Timer();
        var service = this.service;
        var state = false;
        var timeout = this.config.timeout ? this.config.timeout : 5;
        var characteristic = service.getCharacteristic(this.Characteristic.MotionDetected);

        characteristic.on('get', (callback) => {
            callback(null, Boolean(state));
        });

        this.device.on('change', () => {

            if (!state) {
                setTimeout(() => {
                    this.log('Movement detected by motion sensor', this.name);

                    if (this.config.notification && this.platform.notifications)
                        this.platform.pushover(this.config.notification);

                    timer.cancel();
                    characteristic.updateValue(state = true);

                    timer.setTimer(timeout * 1000, () => {
                        this.log('Resetting movement for motion sensor', this.name);
                        characteristic.updateValue(state = false);
                    });

                }, 200);

            }
        });
    }


    getServices() {
        var services = super.getServices();
        services.push(this.service);
        return services;

    }

};
