import {ask} from './misc.js';
import Daemon from './daemon.js';

const command = process.argv[1];
let remote;

function help() {
    return `
Apollo v0.0.0

Commands:
exit          - Exit CLI
help          - Display this manual
reboot        - Reboot System
remote <addr> - Connect to remote Apollo
sensors       - Display sensor data
shutdown      - Shutdown System
start  <port> - Start Apollo server
stop          - Stop Apollo server
status        - Apollo Subsystems status
`;
}

function run(cmd) {
    if(cmd.toLowerCase() === 'exit') process.exit();
    else if(cmd === 'help') return this.help();
    else if(cmd.startsWith('remote')) remote = cmd.split(' ').pop();
    else if(cmd.startsWith('start')) new Daemon(+cmd.split(' ').pop() || 80);
    else return fetch(`${remote}/api/${cmd}`).then(resp => {
        if(resp.ok && resp.headers['Content-Type'].includes('json'))
            return resp.json();
        else return resp.text();
    });
}

if(command) console.log(run(command));
else console.log(help());
while(true) {
    const cmd = await ask('> ');
    console.log(run(cmd), '\n');
}
