import Apollo from './apollo.js';
import Cli from './cli.js';
import Http from './http.js';
import Serial from './serial.js';

(async () => {
  const apollo = new Apollo();
  const cli = new Cli(apollo);
  const serial = new Serial(apollo);
  const http = new Http(apollo);
  await apollo.start();
  cli.start();
  // serial.start();
})();
