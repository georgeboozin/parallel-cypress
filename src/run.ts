import fs from 'fs';
import { exec } from 'child_process';

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
    const remainder = files.length % threads;
    console.log('roundedQuotient', roundedQuotient);
    console.log('remainder', remainder);
    const cypressCommand = 'node_modules/.bin/cypress run --spec';
    const splitedFiles = files.reduce((acc, cur, index) => {
        const idx = index % roundedQuotient;
        if (Array.isArray(acc[idx])) {
            acc[idx].push(cur);
        } else {
            acc.push([cur]);
        }
        return acc;
    }, [] as string[][]);

    const commands = splitedFiles.map((groupedFiles) => `${cypressCommand} ${groupedFiles.join(',')}`);
    console.log(commands);
    const returned = commands.map((command) => {
        const promise = new Promise((resolve, reject) => {
            exec('ls -la', (error, stdout, stderr) => {
                if (error) {
                    console.log(`error: ${error.message}`);
                    reject(error.message);
                    return;
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                    reject(stderr);
                    return;
                }
                console.log(`stdout: ${stdout}`);
                console.log(`new line`);
                resolve(stdout);
            });
        });

        return promise;
    });

    Promise.all(returned).then(() => {
        console.log(returned);
    });
};

export default handle;
