"use strict";

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
        this.log('Loading accessories...');

        var devices = tellstick.getDevices();
        var accessories = [];

        devices.forEach((device) => {

            var config = this.config && this.config.devices && this.config.devices[device.name] ? this.config.devices[device.name] : undefined;

            if (config) {
                var type = config.type ? config.type.toLowerCase() : 'lightbulb';

                switch(device.model) {
                    case 'selflearning-switch': {
                        switch(type) {
                            case 'motionsensor': {
                                accessories.push(new TelldusMotionSensor(this, config, device));
                                break;
                            }
                            case 'alertswitch': {
                                accessories.push(new TelldusAlertSwitch(this, config, device));
                                break;
                            }
                            case 'notificationswitch': {
                                accessories.push(new TelldusNotificationSwitch(this, config, device));
                                break;
                            }
                            case 'occupancysensor': {
                                accessories.push(new TelldusOccupancySensor(this, config, device));
                                break;
                            }
                            case 'doorbell': {
                                accessories.push(new TelldusDoorbell(this, config, device));
                                break;
                            }
                            default: {
                                accessories.push(new TelldusSwitch(this, config, device));
                            }
                        }
                        break;
                    }

                    case 'codeswitch': {
                        accessories.push(new TelldusSwitch(this, config, device));
                        break;
                    }

                    case 'humidity': {
                        accessories.push(new TelldusHygrometer(this, config, device));
                        break;
                    }

                    case 'EA4C':
                    case 'temperature': {
                        accessories.push(new TelldusThermometer(this, config, device));
                        break;
                    }

                    case '1A2D':
                    case 'temperaturehumidity': {
                        accessories.push(new TelldusThermometerHygrometer(this, config, device));
                        break;
                    }

                    default: {
                        this.log('Ignoring device', device.name);
                        break;
                    }
                }

            }

        });



        callback(accessories);

    }
}
