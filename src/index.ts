import yargs from 'yargs';
import { handler, options } from './run';

yargs.command('run', 'Run cypress tests', options, handler).help().alias('help', 'h');

// eslint-disable-next-line no-console
//  console.log(yargs.argv); // show cli args
