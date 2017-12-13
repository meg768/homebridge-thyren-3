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
        this.items = [];

        telldus.getDevicesSync().forEach((item) => {


            var device = {};

            device.id = item.id;
            device.name = item.name;
            device.type = 'device';
            device.protocol = item.protocol;
            device.model = item.model;

            if (item.status)
                device.state = item.status.name == 'ON';

            var config = this.config[device.name];

            if (config) {
                var type = config.type ? config.type : 'switch';

                switch(type.toLowerCase()) {
                    case 'motionsensorX': {
                        this.items.push(new TelldusMotionSensor(this, config, device));
                        break;
                    }
                    case 'alertswitch': {
                        this.items.push(new TelldusAlertSwitch(this, config, device));
                        break;
                    }
                    case 'notificationswitch': {
                        this.items.push(new TelldusNotificationSwitch(this, config, device));
                        break;
                    }
                    case 'occupancysensor': {
                        this.items.push(new TelldusOccupancySensor(this, config, device));
                        break;
                    }
                    case 'doorbell': {
                        this.items.push(new TelldusDoorbell(this, config, device));
                        break;
                    }
                    default: {
                        this.items.push(new TelldusSwitch(this, config, device));
                        break;
                    }
                }
                break;

            }
        });


        telldus.addDeviceEventListener((id, status) => {

            var item = this.findItem(id);

            if (item != undefined) {
                this.log('Device event:', id, status);

                if (status && status.name)
                    item.device.state = status.name == 'ON';

                item.stateChanged();

                debug('Device event:', device);

            } else {
                debug('Device', id, 'not found.');
            }
        });


    }

    findItem(id) {

        for (var i = 0; i < this.items.length; i++) {
            var item = this.items[i];

            if (id == item.device.id)
                return item;

            if (id == item.device.name) {
                return item;
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
        callback(this.items);
    }
}
