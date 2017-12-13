"use strict";
var Switch = require('./telldus-switch.js');
var sprintf = require('yow/sprintf');

module.exports = class NotificationSwitch extends Switch {


    setState(state) {
        var name = this.services.switch.getCharacteristic(this.Characteristic.Name);

        name.getValue((error, value) => {
            if (!error) {
                this.platform.notifications = state;
                this.platform.pushover(sprintf('%s %s.', value, state ? 'på' : 'av'));

            }
        });

        super.setState(state);
    }


};
