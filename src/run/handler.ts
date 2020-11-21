import fs from 'fs';
import glob from 'glob';
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

    glob(`${dir}/**/*.*`, async (err, files) => {
        if (err) {
            throw err;
        }

        // eslint-disable-next-line no-console
        console.log(files);
        const threadsWithFiles = splitFilesToThreads(files, numberThreads);

        // eslint-disable-next-line no-console
        console.log('threadsWithFiles');
        // eslint-disable-next-line no-console
        console.log(threadsWithFiles);

        try {
            await runCypressTests(threadsWithFiles, binPath);
            // eslint-disable-next-line no-console
            console.log('GOOD!');
        } catch (e) {
            throw new Error('BAD!');
        }
    });
};
