import SensorSuite from './sensor-suite.js'

class Apollo {
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
        if (this.onStop) this.onStop();
    }
}

const APOLLO = new Apollo();
export default APOLLO;
