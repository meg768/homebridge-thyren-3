"use strict";

var Accessory = require('./accessory.js');

module.exports = class TelldusThermometerHygrometer extends Accessory {

    constructor(platform, config, device) {
        super(platform, config, device);

        switch (this.device.model) {
            case 'temperaturehumidity': {
                this.setupHumiditySensor();
                this.setupTemperatureSensor();
                break;
            }
            case 'temperature': {
                this.setupTemperatureSensor();
                break;
            }
            case 'humidity': {
                this.setupHumiditySensor();
                break;
            }
            default: {
                this.log('Unknown sensor model', this.device.model);
            }
        }
    }

    setupTemperatureSensor() {
        var service = new this.Service.TemperatureSensor(this.displayName, this.device.name);
        var characteristics = service.temperatureSensor.getCharacteristic(this.Characteristic.CurrentTemperature);

        characteristics.setProps({minValue: -50});
        characteristics.updateValue(this.getTemperature());

        characteristics.on('get', (callback) => {
            callback(null, this.getTemperature());
        });

        this.services.push(service);
    }

    setupHumiditySensor() {
        var service = new this.Service.HumiditySensor(this.displayName, this.device.name);
        var characteristics = service.humiditySensor.getCharacteristic(this.Characteristic.CurrentRelativeHumidity);

        characteristics.updateValue(this.getHumidity());

        characteristics.on('get', (callback) => {
            callback(null, this.getHumidity());
        });

        this.services.push(service);
    }

    getTemperature() {
        return this.device.temperature ? parseFloat(this.device.temperature) : undefined;

    }

    getHumidity() {
        return this.device.humidity;
    }
};
