import cors from 'cors';
import express from 'express';
import path from 'path';
import APOLLO from './apollo.js';
import {$} from './misc.js';

export default class Daemon {
    apollo;
    express;

    constructor(port = 1969) {
        this.apollo = APOLLO;
        this.apollo.start();

        this.express = express();

        this.express.use(cors('*'));

        this.express.get('/api/*', async (req, res) => {
            const cmd = req.params['0'];
            res.json(await this.run(cmd));
        });

        this.express.get('/favicon.*', (req, res) => {
            const absolute = path.join(import.meta.url, '/../../ui/favicon.png').replace('file:', '');
            res.sendFile(absolute);
        });

        this.express.get('*', (req, res) => {
            let p = req.params['0'];
            if (!p || p == '/') p = 'index.html';
            const absolute = path.join(import.meta.url, '/../../ui/', p).replace('file:', '');
            res.sendFile(absolute);
        });

        this.express.listen(port, () => 'Started Apollo');
    }

    run(cmd) {
        cmd = cmd.toLowerCase();
        if (cmd === 'reboot') $`reboot now`;
        else if (cmd === 'sensors') return this.apollo.sensor.data;
        else if (cmd === 'shutdown') {
            this.run('stop');
            $`shutdown now`;
        } else if (cmd === 'status') return this.apollo.status;
        else if (cmd === 'stop') {
            this.express.stop();
            this.apollo.stop();
        }
        else return `Unknown Command: ${cmd}`;
    }
}
