"use strict";

require('dotenv').config({path: '~/.homebridge'});

module.exports = function(homebridge) {
    homebridge.registerPlatform('homebridge-thyren-3', 'Thyren 3', require('./src/platform.js'));
};
