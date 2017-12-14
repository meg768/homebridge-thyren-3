"use strict";

var TelldusAccessory = require('./accessory.js');

module.exports = class TelldusThermometerHygrometer extends TelldusAccessory {


    constructor(platform, config, device) {
        super(platform, config, device);

        this.setupHumiditySensor();
        this.setupTemperatureSensor();
    }

    setupTemperatureSensor() {
        this.services.temperatureSensor = new this.Service.TemperatureSensor(this.displayName, this.device.name);
        var characteristics = this.services.temperatureSensor.getCharacteristic(this.Characteristic.CurrentTemperature);

        characteristics.setProps({minValue: -50});
        characteristics.updateValue(this.getTemperature());

        characteristics.on('get', (callback) => {
            callback(null, this.getTemperature());
        });
    }

    setupHumiditySensor() {
        this.services.humiditySensor = new this.Service.HumiditySensor(this.displayName, this.device.name);

        var characteristics = this.services.humiditySensor.getCharacteristic(this.Characteristic.CurrentRelativeHumidity);

        characteristics.updateValue(this.getHumidity());

        characteristics.on('get', (callback) => {
            callback(null, this.getHumidity());
        });
    }

    getTemperature() {
        return this.device.temperature ? parseFloat(this.device.temperature) : undefined;

    }

    getHumidity() {
        return this.device.humidity;
    }
};
