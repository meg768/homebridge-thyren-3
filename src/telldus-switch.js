"use strict";
var TelldusAccessory = require('./telldus-accessory.js');
var telldus = require('telldus');
var isString = require('yow/is').isString;
var sprintf = require('yow/sprintf');

module.exports = class TelldusSwitch extends TelldusAccessory {

    constructor(platform, config, device) {
        super(platform, config, device);

        this.service = new this.Service.Switch(this.displayName, this.name);
        var characteristic = this.service.getCharacteristic(this.Characteristic.On);
        var state = this.device.state == 'ON';
        characteristic.updateValue(state);

        characteristic.on('get', (callback) => {
            state = this.device.state == 'ON';
            callback(null, state);
        });

        characteristic.on('set', (value, callback, context) => {

            var result = 0;

            if (this.config.type && this.config.type.toLowerCase() == 'alertswitch') {
                this.platform.alerts = value;
                this.platform.pushover(sprintf('%s %s.', this.displayName, value ? 'på' : 'av'));
            }

            if (this.config.type && this.config.type.toLowerCase() == 'notificationswitch') {
                this.platform.notifications = value;
                this.platform.pushover(sprintf('%s %s.', this.displayName, value ? 'på' : 'av'));
            }

            if (value) {
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

            callback();
        });

        this.device.on('change', () => {

            var newState = this.device.state == 'ON';

            // Indicate movement
            if (state != newState) {
                this.log('Reflecting change to HomeKit. %s is now %s.', this.device.name, newState);
                characteristic.updateValue(state = newState);
                this.log('Done.');
            }
        });


    }



    getServices() {
        var services = super.getServices();
        services.push(this.service);
        return services;
    }

};
