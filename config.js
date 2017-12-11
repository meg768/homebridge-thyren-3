{
    "bridge": {
        "name": "Thyren 3",
        "username": "CC:22:3D:E3:CE:57",
        "port": 51826,
        "pin": "031-45-154"
    },

    "description": "This is an example configuration file",

    "platforms": [
        {
            "platform": "Thyren 3",
            "name": "Thyren 3",

            "pushover": {
                "user": "u1mrd1fpevhm8opcbhywcmmdst7qja",
                "token": "amctdgksyefuqxavyuttsh2pcg4ejp"
            },

            "devices": {
                "VS-01": {
                    "name": "Terassen"
                },
                "VS-02": {
                    "name": "Saftblandare"
                },
                "VS-03": {
                    "name": "Belysning i matrummet"
                },
                "VS-04": {
                    "name": "Belysning i vardagsrummet"
                },
                "VS-05": {
                    "name": "Larm",
                    "notifications": {
                        "on": "Larm aktiverat.",
                        "off": "Larm avaktiverat."
                    }
                },
                "VS-06": {
                    "name": "Belysning på kontoret"
                },
                "VS-07": {
                    "name": "Sänglampa"
                },
                "FK-02-01": {
                    "name": "Främre lampor i biorummet"
                },
                "FK-02-02": {
                    "name": "Bakre lampor i biorummet"
                },
                "RV-01": {
                    "name": "Sensor på kontoret",
                    "type": "OccupancySensor",
                    "timeout": 30
                },
                "RV-02": {
                    "name": "Sensor i biorummet",
                    "type": "OccupancySensor",
                    "timeout": 30,
                    "notification": "Rörelse i vardagsrummet."
                },
                "RV-03": {
                    "name": "Sensor i vardagsrummet",
                    "type": "OccupancySensor",
                    "notification": "Rörelse i vardagsrummet."
                    "timeout": 30
                },
                "RV-04": {
                    "name": "Sensor i snickarrummet",
                    "type": "OccupancySensor",
                    "notification": "Rörelse i snickarrummet."
                    "timeout": 60
                },
                "RK-01": {
                    "name": "Ringklocka",
                    "type": "MotionSensor",
                    "notification": "Det ringer på dörren."
                },
                "SR-01": {
                    "name": "Skymmningsrelä"
                },
                "XMAS-01": {
                    "name": "Julbelysning"
                }
            }

        }
    ]


}
