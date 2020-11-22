import fs from 'fs';
import glob from 'glob';
import { promisify } from 'util';
import chalk from 'chalk';
import { splitFilesToThreads, runCypressTests, createOutputLogDir } from './helpers';

const globAsync = promisify(glob);

interface Attributes {
    threads: number;
    dir: string;
    binPath: string;
    outputLogDir: string;
}

export const handler = async (attrs: Attributes) => {
    const { threads: numberThreads, dir, binPath, outputLogDir } = attrs;
    try {
        if (!fs.existsSync(dir)) {
            throw new Error('Incorrect dir path');
        }

        const files = await globAsync(`${dir}/**/*.*`);
        const threadsWithFiles = splitFilesToThreads(files, numberThreads);
        createOutputLogDir(outputLogDir);
        await runCypressTests({ threadsWithFiles, binPath, outputLogDir });
        // eslint-disable-next-line no-console
        console.log(chalk.green('Tests passed'));
    } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e.message);
        // eslint-disable-next-line no-process-exit
        process.exit(1);
    }
};
