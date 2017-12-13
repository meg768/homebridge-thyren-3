"use strict";
var TelldusAccessory = require('./telldus-accessory.js');
var telldus = require('telldus');
var Timer = require('./timer.js');

module.exports = class TelldusOccupancySensor extends TelldusAccessory {

    constructor(platform, config, device) {
        super(platform, config, device);

        this.state = false;
        this.services.occupancySensor = new this.Service.OccupancySensor(this.displayName, this.device.name);
        this.timer = new Timer();

        var characteristics = this.services.occupancySensor.getCharacteristic(this.Characteristic.OccupancyDetected);

        characteristics.updateValue(this.state);

        characteristics.on('get', (callback) => {
            callback(null, this.state);
        });
    }


    stateChanged() {
        var timeout = this.config.timeout ? this.config.timeout : 30;
        var service = this.services.occupancySensor;
        var characteristics = service.getCharacteristic(this.Characteristic.OccupancyDetected);

        if (!this.state) {
            this.log('Movement detected on occupancy sensor', this.device.name);

            this.platform.notify(this.config.notify);
            this.platform.alert(this.config.alert);

            this.timer.cancel();
            characteristics.updateValue(this.state = true);

            this.timer.setTimer(timeout * 60 * 1000, () => {
                this.log('Resetting movement for occupancy sensor', this.device.name);
                characteristics.updateValue(this.state = false);
            });
        }

    }

};
