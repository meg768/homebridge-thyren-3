"use strict";


module.exports = class TelldusAccessory  {

    constructor(platform, config, device) {

        if (!device.name)
            throw new Error('An accessory must have a name.');

        if (!config.name)
            throw new Error('An accessory must have a display name.');

        this.log = platform.log;
        this.platform = platform;
        this.homebridge = platform.homebridge;
        this.Characteristic = platform.homebridge.hap.Characteristic;
        this.Service = platform.homebridge.hap.Service;
        this.name = device.name;
        this.displayName = config.name || device.name;
        this.device = device;
        this.config = config;
    }

    identify(callback) {
        this.log('Identify called for accessory', this.name);
        callback();

    }

    stateChanged() {
    }

    getServices() {
        var accessoryInfo = new this.Service.AccessoryInformation();

        accessoryInfo.setCharacteristic(this.Characteristic.Manufacturer, 'Thyren 3');
        accessoryInfo.setCharacteristic(this.Characteristic.Model, this.device.model);
        accessoryInfo.setCharacteristic(this.Characteristic.SerialNumber, this.device.name);

        return [accessoryInfo];

    }

};
