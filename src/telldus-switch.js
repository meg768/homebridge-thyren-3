"use strict";
var TelldusAccessory = require('./telldus-accessory.js');
var telldus = require('telldus');
var isString = require('yow/is').isString;

module.exports = class TelldusSwitch extends TelldusAccessory {

    constructor(platform, config, device) {
        super(platform, config, device);

        this.service = new this.Service.Switch(this.displayName, this.name);
        this.state   = this.readState();

        var characteristic = this.service.getCharacteristic(this.Characteristic.On);

        characteristic.updateValue(this.state);

        characteristic.on('get', (callback) => {
            callback(null, this.getState());
        });

        characteristic.on('set', (value, callback, context) => {
            this.setState(value);
            callback();
        });

        this.device.on('change', () => {

            var newState = this.readState();

            if (this.state != newState) {
                this.log('Reflecting change to HomeKit. %s is now %s.', this.device.name, newState);
                characteristic.updateValue(this.state = newState);
                this.log('Done.');
            }
        });


    }

    getState() {
        return this.state;
    }

    readState() {
         return this.device.state == 'ON';
    }

    setState(state) {
        var result = 0;

        if (state) {
            this.log('Turning on', this.device.name);

            this.platform.alert(this.config.alertOn);
            this.platform.notify(this.config.notifyOn);

            result = telldus.turnOnSync(this.device.id);
            result = telldus.turnOnSync(this.device.id);
        }

        else {
            this.log('Turning off', this.device.name);

            this.platform.alert(this.config.alertOff);
            this.platform.notify(this.config.notifyOff);

            result = telldus.turnOffSync(this.device.id);
            result = telldus.turnOffSync(this.device.id);
        }

        this.log('Result of switching on/off %s (%d).', this.device.name, result);

        this.state = value;
    }


    getServices() {
        var services = super.getServices();
        services.push(this.service);
        return services;
    }

};
