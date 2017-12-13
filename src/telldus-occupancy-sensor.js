"use strict";
var TelldusAccessory = require('./telldus-accessory.js');
var telldus = require('telldus');
var Timer = require('./timer.js');

module.exports = class TelldusOccupancySensor extends TelldusAccessory {

    constructor(platform, config, device) {
        super(platform, config, device);

        this.state = false;
        this.service = new this.Service.OccupancySensor(this.displayName, this.device.name);
        this.timer = new Timer();
        this.characteristic = this.service.getCharacteristic(this.Characteristic.OccupancyDetected);

        this.characteristic.updateValue(this.state);

        this.characteristic.on('get', (callback) => {
            callback(null, this.state);
        });

    }

    stateChanged() {
        var timeout = this.config.timeout ? this.config.timeout : 30;

        if (!this.state) {
            this.log('Movement detected on occupancy sensor', this.device.name);

            this.platform.notify(this.config.notify);
            this.platform.alert(this.config.alert);

            this.timer.cancel();
            this.characteristic.updateValue(this.state = true);

            this.timer.setTimer(timeout * 60 * 1000, () => {
                this.log('Resetting movement for occupancy sensor', this.device.name);
                this.characteristic.updateValue(this.state = false);
            });
        }

    }

    getServices() {
        var services = super.getServices();
        services.push(this.service);
        return services;
    }

};
