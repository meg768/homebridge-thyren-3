"use strict";

var telldus = require('telldus');
var TelldusSwitch = require('./switch.js');
var TelldusNotificationSwitch = require('./notification-switch.js');
var TelldusAlertSwitch = require('./alert-switch.js');
var TelldusMotionSensor = require('./motion-sensor.js');
var TelldusOccupancySensor = require('./occupancy-sensor.js');
var TelldusDoorbell = require('./doorbell.js');
var TelldusThermometer = require('./thermometer.js');
var TelldusHygrometer = require('./hygrometer.js');
var TelldusThermometerHygrometer = require('./thermometer-hygrometer.js');


var Pushover = require('pushover-notifications');

function debug() {
    console.log.apply(this, arguments);
}

module.exports = class TelldusPlatform {

    constructor(log, config, homebridge) {

        this.config        = config;
        this.log           = log;
        this.homebridge    = homebridge;
        this.notifications = false;
        this.alerts        = true;
        this.devices       = [];
        this.sensors       = [];

        telldus.getDevicesSync().forEach((item) => {
            var device = {};

            device.id       = item.id;
            device.name     = item.name;
            device.type     = 'device';
            device.protocol = item.protocol;
            device.model    = item.model;
            device.state    = item.status && item.status.name == 'ON';

            var config = this.config.devices ? this.config.devices[device.name] : undefined;

            if (config) {
                var type = config.type ? config.type : 'switch';

                switch(type.toLowerCase()) {
                    case 'motionsensor': {
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
                    case 'doorbell': {
                        this.devices.push(new TelldusDoorbell(this, config, device));
                        break;
                    }
                    default: {
                        this.devices.push(new TelldusSwitch(this, config, device));
                        break;
                    }
                }

            }
        });

        // Add sensors
        telldus.getSensorsSync().forEach((item) => {

            var device = {};

            device.id = item.id;
            device.name = sprintf('Sensor %d', item.id);
            device.type = 'sensor';
            device.protocol = item.protocol;
            device.model = item.model;

            if (item.data) {
                item.data.forEach((entry) => {
                    if (entry.type == 'TEMPERATURE')
                        device.temperature = entry.value;
                    if (entry.type == 'HUMIDITY')
                        device.humidity = entry.value;

                    device.timestamp = entry.timestamp;

                });

            }

            switch (item.model) {
                case 'temperaturehumidity': {
                    this.sensors.push(new TelldusThermometerHygrometer(this, config, device));
                    break;
                }
                case 'temperature': {
                    this.sensors.push(new TelldusThermometer(this, config, device));
                    break;
                }
                case 'humidity': {
                    this.sensors.push(new TelldusHygrometer(this, config, device));
                    break;
                }
            }

        });

        telldus.addDeviceEventListener((id, status) => {

            var item = this.findDevice(id);

            if (item != undefined) {
                var device = item.device;

                device.state = status.name == 'ON';
                item.deviceChanged();

                this.log('Device event:', JSON.stringify(device));

            }
            else {
                this.log('Device', id, 'not found.');
            }
        });

        telldus.addSensorEventListener(function(id, protocol, model, type, value, timestamp) {

            var item = this.findSensor(id);

            if (item != undefined) {
                var device = item.device;

                if (protocol == 'temperature')
                    device.temperature = value;

                if (protocol == 'humidity')
                    device.humidity = value;

                if (protocol == 'temperaturehumidity') {
                    if (type == 1)
                        device.temperature = value;
                    if (type == 2)
                        device.humidity = value;
                }

                device.timestamp = timestamp;

                item.deviceChanged();

                this.log('Sensor event:', device);

            }
            else {
                this.log('Sensor', id, 'not found.');
            }

        });


    }

    findDevice(id) {

        for (var i = 0; i < this.devices.length; i++) {
            var item = this.devices[i];

            if (id == item.device.id)
                return item;

            if (id == item.device.name) {
                return item;
            }
        };
    }

    findSensor(id) {

        for (var i = 0; i < this.sensors.length; i++) {
            var item = this.sensors[i];

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
        callback(this.devices.concat(this.sensors));
    }
}
