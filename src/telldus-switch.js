"use strict";
var TelldusAccessory = require('./telldus-accessory.js');
var telldus = require('telldus');
var isString = require('yow/is').isString;
var sprintf = require('yow/sprintf');

module.exports = class TelldusSwitch extends TelldusAccessory {

    constructor(platform, config, device) {
        super(platform, config, device);

        this.services.switch = new this.Service.Switch(this.displayName, this.name);
        this.state = this.device.state;


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


    stateChanged() {
        super.stateChanged();

        var characteristics = this.services.switch.getCharacteristic(this.Characteristic.On);

        if (this.state != this.device.state) {
            this.log('Reflecting change to HomeKit. %s is now %s.', this.device.name, this.device.state);
            characteristics.updateValue(this.state = this.device.state);
            this.log('Done.');
        }
    }

    getState() {
        return this.state;
    }

    setState(state) {
        if (state)
            this.turnOn();
        else
            this.turnOff();
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

};
