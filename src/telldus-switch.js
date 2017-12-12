"use strict";
var TelldusAccessory = require('./telldus-accessory.js');
var telldus = require('telldus');
var isString = require('yow/is').isString;
var sprintf = require('yow/sprintf');

module.exports = class TelldusSwitch extends TelldusAccessory {

    constructor(platform, config, device) {
        super(platform, config, device);

        this.service = new this.Service.Switch(this.displayName, this.name);
        this.state   = this.readState();
        this.characteristic = this.service.getCharacteristic(this.Characteristic.On);

        this.characteristic.updateValue(this.state);

        this.characteristic.on('get', (callback) => {
            callback(null, this.getState());
        });

        this.characteristic.on('set', (state, callback, context) => {
            this.setState(this.state);
            callback();
        });


    }

    stateChanged(newState) {
        if (newState != this.state) {
            this.log('Reflecting change to HomeKit. %s is now %s.', this.device.name, newState);
            this.characteristic.updateValue(this.state = newState);
            this.log('Done.');

        }
    }

    getState() {
        return this.state;
    }

    readState() {
         return this.device.status.name == 'ON';
    }

    turnOn() {
        this.log('Turning on', this.device.name);

        this.platform.alert(this.config.alertOn);
        this.platform.notify(this.config.notifyOn);

        telldus.turnOnSync(this.device.id);
        telldus.turnOnSync(this.device.id);

        this.log(sprintf('Device %s turned on.', this.device.name));

        this.state = true;
    }

    turnOff() {
        this.log('Turning off', this.device.name);

        this.platform.alert(this.config.alertOff);
        this.platform.notify(this.config.notifyOff);

        telldus.turnOffSync(this.device.id);
        telldus.turnOffSync(this.device.id);

        this.log(sprintf('Device %s turned off.', this.device.name));

        this.state = false;
    }

    setState(state) {
        if (state)
            this.turnOn();
        else
            this.turnOff();
    }


    getServices() {
        var services = super.getServices();
        services.push(this.service);
        return services;
    }

};
