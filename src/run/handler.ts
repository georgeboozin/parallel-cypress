import fs from 'fs';
import glob from 'glob';
import { splitFilesToThreads, runCypressTests, createOutputLogDir } from './helpers';

interface Attributes {
    threads: number;
    dir: string;
    binPath: string;
    outputLogDir: string;
}

export const handler = (attrs: Attributes) => {
    const { threads: numberThreads, dir, binPath, outputLogDir } = attrs;
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
            createOutputLogDir(outputLogDir);
            await runCypressTests({ threadsWithFiles, binPath, outputLogDir });
            // eslint-disable-next-line no-console
            console.log('GOOD!');
        } catch (e) {
            throw new Error('BAD!');
        }
    });
};
