import {ask} from './misc.js';
import Daemon from './daemon.js';

const command = process.argv.slice(2).join(' ');
let remote = 'localhost:1969';

function help() {
    return `
Apollo v0.0.0
Remote: ${remote}

Commands:
exit          - Exit CLI
help          - Display this manual
reboot        - Reboot System
remote <addr> - Get/Set Apollo address
sensors       - Display sensor data
shutdown      - Shutdown System
start  <port> - Start Apollo server
stop          - Stop Apollo server
status        - Apollo Subsystems status
`;
}

function run(cmd) {
  try {
    if(cmd.toLowerCase() === 'exit') process.exit();
    else if(cmd === 'help') return help();
    else if(cmd === 'remote') return remote;
    else if(cmd.startsWith('remote')) {
      remote = cmd.split(' ').pop();
      return `Remote Set: ${remote}`;
    } else if(cmd.startsWith('start')) {
        const port = +cmd.split(' ').pop() || 1969;
        new Daemon(port);
        return `Listening on: http://localhost:${port}`;
    } else return fetch(`${remote.startsWith('http') ? '' : 'http://'}${remote}/api/${cmd}`).then(resp => {
        if(resp.ok && resp.headers['Content-Type']?.includes('json'))
            return resp.json();
        else return resp.text();
    }).catch(err => err.message);
  } catch(err) {
    return err.message || err;
  }
}

if(command) console.log(run(command));
else {
    console.log(help());
    while(true) {
        const cmd = await ask('> ');
        console.log(await run(cmd), '\n');
    }
}
