import fs from 'fs';
import glob from 'glob';
import { spawn } from 'child_process';
import { splitFilesToThreads } from './helpers';

interface Attributes {
    threads: number;
    dir: string;
    binPath: string;
}

export const handler = (attrs: Attributes) => {
    const { threads: numberThreads, dir, binPath } = attrs;
    if (!fs.existsSync(dir)) {
        // eslint-disable-next-line no-console
        console.error('Incorrect dir path');
        throw new Error('Incorrect dir path');
    }

    glob(`${dir}/**/*.*`, (err, files) => {
        if (err) {
            throw err;
        }
        console.log(files);
        const threadsWithFiles = splitFilesToThreads(files, numberThreads);

        console.log('threadsWithFiles');
        console.log(threadsWithFiles);

        const returned = threadsWithFiles.map((testFiles) => {
            const promise = new Promise((resolve, reject) => {
                const arg = testFiles.join(',');
                const cypressRun = spawn(binPath, ['run', '--spec'].concat(arg));

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
    });
};
