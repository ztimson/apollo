import BME280 from 'bme280-sensor';
import {poll} from './misc.js';

export default class SensorSuite {
    bme280;
    stopBme280;

    _data = {
        acceleration: [null, null, null],
        altitude: null,
        battery: null,
        gpsStrength: null,
        gyro: [null, null, null],
        humidity: null,
        magnetometer: [null, null, null],
        position: [null, null],
        pressure: null,
        temperature: null,
        voltage: null,
    }
    set data(d) { this._data = d; }
    get data() { return {timestamp: new Date().getTime(), ...this._data}; }

    get status() { return { sensors: 'ok' }; }

    constructor() {
        this.bme280 = new BME280({i2cBusNo: 1, i2cAddress: 0x76});
    }

    async start() {
        await this.bme280.init();

        // Poll environmental data
        this.stopBme280 = poll(async () => {
            const d = await this.bme280.readSensorData();
            this._data.humidity = d.humidity / 100;
            this._data.temperature = d.temperature_C;
            this._data.pressure = d.pressure_hPa;
            this._data.altitude = BME280.calculateAltitudeMeters(this.data.pressure);
        }, 1000);
    }

    stop() {
      if(this.stopBme280) this.stopBme280();
    }
}
