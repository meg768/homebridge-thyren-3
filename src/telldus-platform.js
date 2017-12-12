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
        this.devices = [];

        telldus.getDevicesSync().forEach((device) => {
            var config = this.config && this.config.devices && this.config.devices[device.name] ? this.config.devices[device.name] : undefined;
            var type = (config && config.type) || 'Switch';

            if (config && type && device.type == 'DEVICE') {
                switch(type.toLowerCase()) {
                    case 'motionsensorX': {
                        this.devices.push(new TelldusMotionSensor(this, config, device));
                        break;
                    }
                    case 'alertswitch': {
                        this.devices.push(new TelldusAlertSwitch(this, config, device));
                        break;
                    }
                    case 'notificationswitch': {
                        this.devices.push(new TelldusNotificationSwitch(this, config, device));
                        break;
                    }
                    case 'occupancysensor': {
                        this.devices.push(new TelldusOccupancySensor(this, config, device));
                        break;
                    }
                    case 'switch': {
                        this.devices.push(new TelldusSwitch(this, config, device));
                        break;
                    }
                }

            }

        });


        telldus.addDeviceEventListener((id, status) => {

            var device = this.findDevice(id);

            if (device != undefined) {
                if (status.name) {
                    device.stateChanged(status.name == 'ON');
                }

            } else {
                this.log('Device', id, 'not found.');
            }
        });

    }

    findDevice(id) {

        var devices = this.devices;

        for (var i = 0; i < devices.length; i++) {
            var device = devices[i];

            if (id == device.device.id)
                return device;

            if (id == device.device.name) {
                return device;
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
        callback(this.devices);

    }
}
