import yargs from 'yargs';
import { handler, options } from './run';

yargs
    .command(
        'run',
        'Run cypress tests',
        options,
        // (argv: { threads: number; dir: string }) => {
        (argv: any) => {
            console.log(argv);
            handler({
                dir: argv.dir,
                threads: argv.threads,
                binPath: argv.binPath,
            });
        }
    )
    // .option('time', {
    //     alias: 't',
    //     description: 'Tell the present Time',
    //     type: 'boolean',
    // })
    .help()
    .alias('help', 'h');

if (yargs.argv.time) {
    // eslint-disable-next-line no-console
    console.log('The current time is: ', new Date().toLocaleTimeString());
}

// eslint-disable-next-line no-console
console.log(yargs.argv);
