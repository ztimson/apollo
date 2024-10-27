import {SerialPort} from 'serialport';
import Controller from './controller.js';

export default class Serial extends Controller {
  baud;
  interval;
  port;

  constructor(apollo, options) {
    super(apollo);
    this.options = {
      baud: 9600,
      ...options
    };
  }

  async start() {
    this.interval = setInterval(async () => {
      const cons = (await SerialPort.list()).map(p => p.path);
      if(this.ports.length > 0) {
        this.port = new SerialPort({path: cons[0], baudRate: this.options.baud});
        this.port.on('open', () => this.help());
        this.port.on('data', cmd => port.write(JSON.stringify(this.run(cmd))));
        this.port.on('close', () => this.start());
        clearInterval(this.interval);
      }
    }, 1000);
  }
}
