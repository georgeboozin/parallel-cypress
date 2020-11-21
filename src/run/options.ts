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
    });

    yargs.option('bin-path', {
        description: 'path to cypress binary',
        type: 'string',
        default: 'node_modules/.bin/cypress',
    });

    yargs.demandOption(['dir'], 'Please provide dir argument to run tests');

    return yargs;
};
