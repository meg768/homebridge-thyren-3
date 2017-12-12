"use strict";
var Switch = require('./telldus-switch.js');
var sprintf = require('yow/sprintf');

module.exports = class NotificationSwitch extends Switch {


    setState(state) {

        this.platform.notifications = state;
        this.platform.pushover(sprintf('%s %s.', this.displayName, state ? 'på' : 'av'));

        super.setState(state);
    }


};
