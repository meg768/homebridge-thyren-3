"use strict";
var TelldusAccessory = require('./telldus-accessory.js');
var telldus = require('telldus');
var Timer = require('./timer.js');

module.exports = class TelldusOccupancySensor extends TelldusAccessory {

    constructor(platform, config, device) {
        super(platform, config, device);

        this.service = new this.Service.OccupancySensor(this.displayName, this.name);
        this.state = false;
        this.timeout = this.config.timeout ? this.config.timeout : 30;
        this.timer = new Timer();
        this.characteristic = this.service.getCharacteristic(this.Characteristic.OccupancyDetected);

        this.characteristic.updateValue(this.state);

        this.characteristic.on('get', (callback) => {
            callback(null, Boolean(this.state));
        });

    }

    stateChanged(newState) {
        if (!this.state) {

            this.log('Movement detected on occupancy sensor', this.name);

            this.platform.notify(this.config.notify);
            this.platform.alert(this.config.alert);

            this.timer.cancel();
            this.characteristic.updateValue(state = true);

            this.timer.setTimer(this.timeout * 60 * 1000, () => {
                this.log('Resetting movement for occupancy sensor', this.name);
                this.characteristic.updateValue(state = false);
            });
        }

    }

    getServices() {
        var services = super.getServices();
        services.push(this.service);
        return services;

    }

};
