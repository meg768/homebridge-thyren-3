"use strict";

module.exports = function(homebridge) {
    homebridge.registerPlatform('homebridge-thyren-3', 'Thyren 3', require('./src/telldus-platform.js'));
};
