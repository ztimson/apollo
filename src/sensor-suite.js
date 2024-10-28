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

    _env_sensor = false;
    get status() { return { env_sensor: this._env_sensor ? 'ok' : 'failed' }; }

    constructor() {
        this.bme280 = new BME280({i2cBusNo: 1, i2cAddress: 0x76});
    }

    start() {
        return this.bme280.init().then(() => {
          // Poll environmental data
          this._env_sensor = true;
          this.stopBme280 = poll(async () => {
              const d = await this.bme280.readSensorData();
              this._data.humidity = d.humidity / 100;
              this._data.temperature = d.temperature_C;
              this._data.pressure = d.pressure_hPa;
              this._data.altitude = BME280.calculateAltitudeMeters(this.data.pressure);
          }, 1000);
        }).catch(err => {
          this._env_sensor = false;
        });
    }

    stop() {
      if(this.stopBme280) this.stopBme280();
    }
}
