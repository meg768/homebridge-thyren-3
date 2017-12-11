"use strict";

var HomebridgeAccessory = require('./homebridge-accessory.js');

module.exports = class TelldusAccessory extends HomebridgeAccessory {

    constructor(platform, config, device) {

        super(platform, {name:device.name, displayName:config.name});

        this.device = device;
        this.config = config;
    }


};
