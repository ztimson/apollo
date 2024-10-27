import Controller from './controller.js';
import {ask} from './misc.js';

export default class Cli extends Controller {
  constructor(apollo) {
    super(apollo);
    console.log(this.help());
  }

  async start() {
    while(true) {
      const cmd = await ask('> ');
      console.log(this.run(cmd));
      console.log();
    }
  }
}
