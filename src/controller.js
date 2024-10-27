import {$} from './misc.js';

export default class Controller {
  apollo;

  constructor(apollo) {
    this.apollo = apollo;
  }

  help() {
    return `
Apollo v0.0.0

Commands:
exit     - Stop Apollo
help     - Display manual
reboot   - Reboot System
sensors  - All sensor data
shutdown - Shutdown System
stop     - Stop Apollo
status   - Subsystem status
`;
  }

  run(cmd) {
    cmd = cmd.toLowerCase();
    if(cmd == 'help') return this.help();
    else if(cmd == 'reboot') $`reboot now`;
    else if(cmd == 'sensors') return this.apollo.sensor.data;
    else if(cmd == 'shutdown') {
      $`shutdown now`;
      this.apollo.stop();
    } else if(cmd == 'status') return this.apollo.status;
    else if(cmd == 'stop' || cmd == 'exit') process.exit();
    else return `Unknown Command: ${cmd}`;
  }
}
