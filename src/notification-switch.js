"use strict";
var TelldusSwitch = require('./switch.js');
var sprintf = require('yow/sprintf');

module.exports = class NotificationSwitch extends TelldusSwitch {


    setState(state) {

        super.setState(state);

        var alert = sprintf('%s %s', state ? 'on' : 'off');

        if (state) {
            if (this.config.notifyOn)
                alert = this.config.notifyOn;
        }
        else {
            if (this.config.notifyOff)
                alert = this.config.notifyOff;
        }

        this.platform.notifications = state;
        this.platform.alert(alert);
    }

};
