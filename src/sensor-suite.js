import {adjustedInterval, sleep} from '@ztimson/utils';
import {bms} from './bms.js';
import {bme} from './bme280.js';
import {imu} from './bno080.js';

export default class SensorSuite {
    data = {
        battery: {charging: false, temperature: 0, percentage: 0, voltage: 0},
        environment: {humidity: 0, temperature: 0, pressure: 0, altitude: 0},
        movement: {accelerometer: null, gyro: null, magnetometer: null},
        gps: {accuracy: null, lat: null, long: null, altitude: 0, ground: 0, time: 0}
    }
    intervals = [];
    status = {}

    #altitude; // Pressure <-> GPS correction for future calculations TODO: Update on GPS events
    get altitude() {
        return data.environment.altitude + (this.#altitude ?? 0);
    }

    constructor() {
    }

    static #hPaToAltitude(hPa) {
        return 44330 * (1 - Math.pow(hPa / 1013.25, 1 / 5.255));
    }

    async start() {
        // Movement
        this.intervals.push(adjustedInterval(async () => {
            this.data.movement = await this.statusWrapper(imu(), 'imu');
        }, 1000));
        // Environment
        this.intervals.push(adjustedInterval(async () => {
            this.data.environment = await this.statusWrapper(bme(), 'bme280');
        }, 1000));
        // Battery
        await sleep(500); // Offset reading sensor data
        this.intervals.push(adjustedInterval(async () => {
            this.data.battery = await this.statusWrapper(bms(), 'bms');
        }, 1000));
    }

    statusWrapper(promise, key) {
        return promise.then(resp => {
            this.status[key] = 'ok'
            return resp;
        }).catch(err => {
            this.status[key] = err.message;
        });
    }

    stop() {
        this.intervals.forEach(unsubscribe => unsubscribe());
        this.intervals = [];
    }
}
