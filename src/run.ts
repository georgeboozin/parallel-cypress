import fs from 'fs';
import { spawn } from 'child_process';

interface Attributes {
    threads: number;
    dir: string;
}

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

    yargs.demandOption(['dir'], 'Please provide dir argument to run tests');

    return yargs;
};

export const handle = (attrs: Attributes) => {
    const { threads, dir } = attrs;
    if (!fs.existsSync(dir)) {
        // eslint-disable-next-line no-console
        console.error('Incorrect dir path');
        throw new Error('Incorrect dir path');
    }

    const files = fs.readdirSync(dir);
    const roundedQuotient = Math.floor(files.length / threads);
    const cypressCommand = 'node_modules/.bin/cypress run --spec';
    const splitedFiles = files.reduce((acc, cur, index) => {
        const idx = index % roundedQuotient;
        if (Array.isArray(acc[idx])) {
            acc[idx].push(`${dir}/${cur}`);
        } else {
            acc.push([`${dir}/${cur}`]);
        }
        return acc;
    }, [] as string[][]);

    const commands = splitedFiles.map((groupedFiles) => `${cypressCommand} ${groupedFiles.join(',')}`);
    // eslint-disable-next-line no-console
    console.log(commands);

    const returned = splitedFiles.map((testFiles) => {
        const promise = new Promise((resolve, reject) => {
            const cypressRun = spawn('node_modules/.bin/cypress', ['run', '--spec'].concat(testFiles.join(',')));

            cypressRun.stdout.on('data', (data) => {
                // eslint-disable-next-line no-console
                console.log(`stdout: ${data}`);
            });

            cypressRun.stderr.on('data', (data) => {
                // eslint-disable-next-line no-console
                console.log(`stderr: ${data}`);
            });

            cypressRun.on('error', (error) => {
                // eslint-disable-next-line no-console
                console.log(`error: ${error.message}`);
            });

            cypressRun.on('close', (code) => {
                // eslint-disable-next-line no-console
                console.log(`child process exited with code ${code}`);
                if (code) {
                    reject(new Error('test not pass'));
                } else {
                    resolve('success!');
                }
            });
        });

        return promise;
    });

    Promise.all(returned)
        .then(() => {
            // eslint-disable-next-line no-console
            console.log('GOOD!');
        })
        .catch(() => {
            throw new Error('BAD!');
        });
};

export default handle;
