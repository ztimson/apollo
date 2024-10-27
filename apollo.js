import SensorSuite from './sensor-suite.js'

export default class Apollo {
  sensor;
  onStop;

  get status() {
    return {...this.sensor.status};
  }

  constructor() {
    this.sensor = new SensorSuite();
  }

  async start() {
    await this.sensor.start();
  }

  stop() {
    this.sensor.stop();
    if(this.onStop) this.onStop();
  }
}
