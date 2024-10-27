
import express from 'express';
import path from 'path';
import Controller from './controller.js';

export default class Http extends Controller {
  express;

  constructor(apollo, port = 8000) {
    super(apollo);
    this.express = express();
    this.express.get('*', (req, res) => {
       let p = req.params['0'];
       if(!p || p == '/') p = 'index.html';
       const absolute = path.join(import.meta.url, '/../../ui/', p).replace('file:', '');
       res.sendFile(absolute);
    });
    this.express.get('/api/*', async (req, res) => {
      const cmd = req.params['0'];
      console.log(cmd);
      res.json(await this.run(cmd));
    });
    this.express.listen(port);
  }
}
