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
        this.services = {};

        this.services.accessoryInformation = new this.Service.AccessoryInformation();

        this.services.accessoryInformation.setCharacteristic(this.Characteristic.Manufacturer, 'Thyren 3');
        this.services.accessoryInformation.setCharacteristic(this.Characteristic.Model, this.device.model);
        this.services.accessoryInformation.setCharacteristic(this.Characteristic.SerialNumber, this.device.name);


    }


    identify(callback) {
        this.log('Identify called for accessory', this.device.name);
        callback();
    }

    stateChanged() {
    }


    getServices() {
        var services = [];

        this.services.forEach((item) => {
            services.push(item);
        });

        return services;
    }

};
