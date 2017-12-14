"use strict";

var TelldusThermometer = require('./thermometer.js');

module.exports = class TelldusThermometerHygrometer extends TelldusThermometer {


    constructor(platform, config, device) {
        super(platform, config, device);

        this.setupHumiditySensor();
        this.setupTemperatureSensor();
    }

    setupTemperatureSensor() {
        this.services.temperatureSensor = new this.Service.TemperatureSensor(this.name, this.device.name);
        var characteristics = this.services.temperatureSensor.getCharacteristic(this.Characteristic.CurrentTemperature);

        characteristics.setProps({minValue: -50});

        characteristics.on('get', (callback) => {
            callback(null, this.getTemperature());
        });

        services.push(service);

        return services;
    }

    setupHumiditySensor() {
        this.services.humiditySensor = new this.Service.HumiditySensor(this.name, this.device.name);

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
