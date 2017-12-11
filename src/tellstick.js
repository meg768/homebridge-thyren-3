"use strict";

var telldus = require('telldus');
var Events  = require('events');
var sprintf = require('sprintf-js').sprintf;

var devices = [];

function debug() {
    //console.log.apply(this, arguments);
}

class Device extends Events {

}


function getDevices() {
    return devices;
}

//
// Find the device by id or name.
//

function findDevice(id) {

    for (var i = 0; i < devices.length; i++) {
        var device = devices[i];

        if (id == device.id)
            return device;

        if (id == device.name) {
            return device;
        }
    };
}

//
// Get the device by id or name.
// Throw an error if not found.
//

function getDevice(id) {

    var device = findDevice(id);

    if (device == undefined)
        throw new Error(sprintf('Device %s not defined.', id));
    else
        return device;
}

function init() {


    // Add normal devices

    telldus.getDevicesSync().forEach((item) => {
        if (item.type == 'DEVICE') {

            var device = new Device();

            device.id = item.id;
            device.name = item.name;
            device.type = 'device';
            device.protocol = item.protocol;
            device.model = item.model;

            if (item.status)
                device.state = item.status.name;

            devices.push(device);
        }
    });

    // Add sensors
    telldus.getSensorsSync().forEach((item) => {

        var device = new Device();

        device.id = item.id;
        device.name = sprintf('Sensor-%d', item.id);
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

        devices.push(device);
    });

    telldus.addSensorEventListener(function(id, protocol, model, type, value, timestamp) {

        var device = findDevice(id);

        if (device != undefined) {
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

            device.emit('change');

            debug('Sensor event:', device);

        } else {
            debug('Device', id, 'not found.');
        }

    });

    telldus.addDeviceEventListener(function(id, status) {

        var device = findDevice(id);

        if (device != undefined) {
            if (status.name)
                device.state = status.name;

            device.emit('change');

            debug('Device event:', device);

        } else {
            debug('Device', id, 'not found.');
        }
    });

    debug(JSON.stringify(devices, null, '  '));

}

init();

module.exports.getDevices = getDevices;
module.exports.getDevice = getDevice;
module.exports.findDevice = findDevice;
