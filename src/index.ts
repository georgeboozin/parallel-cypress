#!/usr/bin/env node
import yargs from 'yargs';
import { run } from './run';

const argv = yargs
    .command(
        'run',
        'Run cypress tests',
        (yargs) => {
            yargs.option('threads', {
                description: 'number threads to run tests',
                alias: 't',
                type: 'number',
                default: 1,
            });

            yargs.option('dir', {
                description: 'path directory to run tests',
                alias: 'd',
                type: 'string',
            });

            yargs.demandOption(['dir'], 'Please provide dir argument to run tests')

            return yargs;
        },
        // (argv: { threads: number; dir: string }) => {
        (argv: any) => {
            run({
                dir: argv.dir,
                threads: argv.threads,            
            })
        }
    )
    // .option('time', {
    //     alias: 't',
    //     description: 'Tell the present Time',
    //     type: 'boolean',
    // })
    .help()
    .alias('help', 'h').argv;

if (argv.time) {
    console.log('The current time is: ', new Date().toLocaleTimeString());
}


console.log(argv);
