export const options = (yargs) => {
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

    yargs.option('extension', {
        description: 'file test extension',
        alias: 'e',
        type: 'string',
        default: 'js',
    });

    yargs.option('bin-path', {
        description: 'path to cypress binary',
        type: 'string',
        default: 'node_modules/.bin/cypress',
    });

    yargs.option('output-log-dir', {
        description: 'path to output log dir',
        type: 'string',
        default: 'parallel-cypress',
    });

    yargs.option('ignore-thread-exception', {
        description: 'ignore thread exception',
        alias: 'i',
        type: 'boolean',
        default: false,
    });

    yargs.demandOption(['dir'], 'Please provide dir argument to run tests');

    return yargs;
};
