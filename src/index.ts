import yargs from 'yargs';
import { handler, options } from './run';

// eslint-disable-next-line @typescript-eslint/no-unused-expressions
yargs.command('run', 'Run cypress tests', options, handler).help().alias('help', 'h').argv;

// if (yargs.argv.time) {
//     // eslint-disable-next-line no-console
//     console.log('The current time is: ', new Date().toLocaleTimeString());
// }

// eslint-disable-next-line no-console
//  console.log(yargs.argv); // show cli args
