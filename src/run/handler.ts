import fs from 'fs';
import glob from 'glob';
import { spawn } from 'child_process';
import { splitFilesToThreads, runCypressTests } from './helpers';

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

        const promises = runCypressTests(threadsWithFiles, binPath);

        Promise.all(promises)
            .then(() => {
                // eslint-disable-next-line no-console
                console.log('GOOD!');
            })
            .catch(() => {
                throw new Error('BAD!');
            });
    });
};
