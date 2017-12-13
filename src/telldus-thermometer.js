"use strict";

var TelldusAccessory = require('./telldus-accessory.js');

module.exports = class TelldusThermometer extends TelldusAccessory {

    constructor(platform, config, device) {
        super(platform, config, device);

        if (this.services.temperatureSensor)
            throw new Error('A temperature sensor has already been defined!');

        this.services.temperatureSensor = this.Service.TemperatureSensor(this.displayName, this.name);
        this.temperature = 20;

        var characteristics = this.services.switch.getCharacteristic(this.Characteristic.On);

        characteristics.updateValue(this.device.state);

        characteristics.on('get', (callback) => {
            callback(null, this.getState());
        });

        characteristics.on('set', (state, callback, context) => {
            this.setState(state);
            callback();
        });


    }

    getTemperature() {

    }


};
