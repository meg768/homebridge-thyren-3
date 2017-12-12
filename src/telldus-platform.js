"use strict";

var telldus = require('telldus');
var tellstick = require('./tellstick.js');
var TelldusSwitch = require('./telldus-switch.js');
var TelldusNotificationSwitch = require('./telldus-notification-switch.js');
var TelldusAlertSwitch = require('./telldus-alert-switch.js');
var TelldusMotionSensor = require('./telldus-motion-sensor.js');
var TelldusOccupancySensor = require('./telldus-occupancy-sensor.js');
var TelldusDoorbell = require('./telldus-doorbell.js');
var TelldusThermometer = require('./telldus-thermometer.js');
var TelldusHygrometer = require('./telldus-hygrometer.js');
var TelldusThermometerHygrometer = require('./telldus-thermometer-hygrometer.js');


var Pushover = require('pushover-notifications');

function debug() {
    console.log.apply(this, arguments);
}

module.exports = class TelldusPlatform {

    constructor(log, config, homebridge) {

        this.config = config;
        this.log = log;
        this.homebridge = homebridge;
        this.notifications = false;
        this.alerts = true;
        this.accessories = [];

        telldus.getDevicesSync().forEach((device) => {
            var config = this.config && this.config.devices && this.config.devices[device.name] ? this.config.devices[device.name] : undefined;
            var type = config && config.type || 'Switch';

            if (type && device.type == 'DEVICE') {
                switch(type.toLowerCase()) {
                    case 'motionsensor': {
                        this.accessories.push(new TelldusMotionSensor(this, config, device));
                        break;
                    }
                    case 'alertswitch': {
                        this.accessories.push(new TelldusAlertSwitch(this, config, device));
                        break;
                    }
                    case 'notificationswitch': {
                        this.accessories.push(new TelldusNotificationSwitch(this, config, device));
                        break;
                    }
                    case 'occupancysensor': {
                        this.accessories.push(new TelldusOccupancySensor(this, config, device));
                        break;
                    }
                    default: {
                        this.accessories.push(new TelldusSwitch(this, config, device));
                        break;
                    }
                }

            }

        });


        telldus.addDeviceEventListener((id, status) => {

            var accessory = this.findAccessory(id);

            if (accessory != undefined) {
                if (status.name) {
                    accessory.stateChanged(status.name == 'ON');
                }

            } else {
                this.log('Device', id, 'not found.');
            }
        });

    }

    findAccessory(id) {

        var accessories = this.accessories;

        for (var i = 0; i < accessories.length; i++) {
            var accessory = accessories[i];

            if (id == accessory.device.id)
                return accessory;

            if (id == accessory.device.name) {
                return accessory;
            }
        };
    }

    notify(message) {
        try {
            if (this.notifications)
                this.pushover(message);

        }
        catch (error) {
            this.log(error);
        }
    }

    alert(message) {
        try {
            if (this.alerts)
                this.pushover(message);

        }
        catch (error) {
            this.log(error);
        }
    }

    pushover(message) {
        if (message) {
            if (!this.config.pushover)
                throw new Error('You must configure Pushover credentials.');

            if (!this.config.pushover.user)
                throw new Error('You must configure Pushover user.');

            if (!this.config.pushover.token)
                throw new Error('You must configure Pushover token.');

            var push = new Pushover(this.config.pushover);

            this.log('Sending message:', message);

            push.send({priority:0, message:message}, (error, result) => {
                if (this.error)
                    this.log(error);
            });

        }
    }

    accessories(callback) {
        callback(this.accessories);

    }
}
