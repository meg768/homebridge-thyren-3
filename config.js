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

            "exclude": [
                "PS-01", "PS-03",
                "FK-00-01", "FK-00-02", "FK-00-03",
                "FK-01-01", "FK-01-02", "FK-01-03",
                "FK-02-03",
                "Sensor-101"
            ],

            "devices": {
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
