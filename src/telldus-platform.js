"use strict";

var tellstick = require('./tellstick.js');
var TelldusSwitch = require('./telldus-switch.js');
var TelldusMotionSensor = require('./telldus-motion-sensor.js');
var TelldusOccupancySensor = require('./telldus-occupancy-sensor.js');
var TelldusDoorbell = require('./telldus-doorbell.js');
var TelldusThermometer = require('./telldus-thermometer.js');
var TelldusHygrometer = require('./telldus-hygrometer.js');
var TelldusThermometerHygrometer = require('./telldus-thermometer-hygrometer.js');

function debug() {
    console.log.apply(this, arguments);
}

module.exports = class TelldusPlatform {

    constructor(log, config, homebridge) {

        this.config = config;
        this.log = log;
        this.homebridge = homebridge;
    }

    accessories(callback) {
        this.log('Loading accessories...');

        var devices = tellstick.getDevices();
        var accessories = [];

        devices.forEach((device) => {
            var exclude = false;
            var config = this.config && this.config.devices && this.config.devices[device.name] ? this.config.devices[device.name] : {};
            var type   = config.type ? config.type.toLowerCase() : 'lightbulb';

            type = type.toLowerCase();

            if (this.config.exclude) {
                if (this.config.exclude.indexOf(device.name) >= 0)
                    exclude = true;
            }

            if (!exclude) {
                switch(device.model) {
                    case 'selflearning-switch': {
                        switch(type) {
                            case 'motionsensor': {
                                accessories.push(new TelldusMotionSensor(this, config, device));
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
