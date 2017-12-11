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

            "devices": {
                "VS-01": {
                    "name": "Terassen - Utomhus"
                },
                "VS-02": {
                    "name": "Saftblandare - Snickarrummet"
                },
                "VS-03": {
                    "name": "Belysning - Matrummet"
                },
                "VS-04": {
                    "name": "Belysning - Vardagsrummet"
                },
                "VS-05": {
                    "name": "Larm"
                },
                "VS-06": {
                    "name": "Belysning - Kontoret"
                },
                "VS-07": {
                    "name": "Sänglampa - Kontoret"
                },
                "FK-02-01": {
                    "name": "Främre lampor - Biorummet"
                },
                "FK-02-02": {
                    "name": "Bakre lampor - Biorummet"
                },
                "RV-01": {
                    "name": "Sensor - Kontoret",
                    "type": "OccupancySensor",
                    "timeout": 30
                },
                "RV-02": {
                    "name": "Sensor - Biorummet",
                    "type": "OccupancySensor",
                    "timeout": 30
                },
                "RV-03": {
                    "name": "Sensor - Vardagsrummet",
                    "type": "OccupancySensor",
                    "timeout": 30
                },
                "RV-04": {
                    "name": "Sensor - Snickarrummet",
                    "type": "OccupancySensor",
                    "timeout": 60
                },
                "RK-01": {
                    "name": "Ringklocka",
                    "type": "MotionSensor"
                }
            }

        }
    ]


}
