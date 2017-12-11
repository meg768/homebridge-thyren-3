"use strict";


module.exports = class HomebridgeAccessory {

    constructor(platform, config) {

        if (!config.name)
            throw new Error('An accessory must have a name.');

        if (!config.displayName)
            throw new Error('An accessory must have a display name.');

        this.log = platform.log;
        this.platform = platform;
        this.homebridge = platform.homebridge;
        this.Characteristic = platform.homebridge.hap.Characteristic;
        this.Service = platform.homebridge.hap.Service;

        this.name = config.name;
        this.displayName = config.displayName;
    }

    identify(callback) {
        this.log('Identify called for accessory', this.name);
        callback();

    }

    getServices() {
        var accessoryInfo = new this.Service.AccessoryInformation();

        accessoryInfo.setCharacteristic(this.Characteristic.Manufacturer, 'Thyrén 3');
        accessoryInfo.setCharacteristic(this.Characteristic.Model, 'Thyrén 3');
        accessoryInfo.setCharacteristic(this.Characteristic.SerialNumber, this.name);

        return [accessoryInfo];

    }

};
