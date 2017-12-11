"use strict";
var TelldusAccessory = require('./telldus-accessory.js');
var telldus = require('telldus');

module.exports = class TelldusSwitch extends TelldusAccessory {

    constructor(platform, config, device) {
        super(platform, config, device);

        this.type = this.config.type ? this.config.type.toLowerCase() : 'lightbulb';

        this.log('Creating new service for %s as type %s.', this.name, this.type);

        switch (this.type) {
            case 'switch':
                {
                    this.service = new this.Service.Switch(this.displayName, this.name);
                    break;
                }
            case 'lightbulb':
                {
                    this.service = new this.Service.Lightbulb(this.displayName, this.name);
                    break;
                }
            default:
                {
                    this.service = new this.Service.Lightbulb(this.displayName, this.name);
                    break;
                }
        }

        var characteristic = this.service.getCharacteristic(this.Characteristic.On);
        characteristic.updateValue(this.device.state == 'ON');

        characteristic.on('get', (callback) => {
            callback(null, this.device.state == 'ON');
        });

        characteristic.on('set', (value, callback, context) => {

            var result = 0;

            if (value) {

                if (this.config.notifications && this.config.notifications.on) {
                    this.platform.notifications = true;
                    this.platform.pushover(this.config.notifications.on);

                }

                this.log('Turning on', this.device.name);
                result = telldus.turnOnSync(this.device.id);
                result = telldus.turnOnSync(this.device.id);

            }

            else {
                if (this.config.notifications && this.config.notifications.off) {
                    this.platform.notifications = false;
                    this.platform.pushover(this.config.notifications.off);

                }

                this.log('Turning off', this.device.name);
                result = telldus.turnOffSync(this.device.id);
            }

            this.log('Result of switching on/off %s (%d).', this.device.name, result);

            callback();
        });

        this.device.on('change', () => {

            var state = this.device.state == 'ON';

            // Indicate movement
            this.log('Reflecting change to HomeKit. %s is now %s.', this.device.name, state ? 'ON' : 'OFF');

            characteristic.updateValue(state);
        });


    }



    getServices() {
        var services = super.getServices();
        services.push(this.service);
        return services;
    }

};
