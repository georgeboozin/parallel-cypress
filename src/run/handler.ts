import fs from 'fs';
import glob from 'glob';
import { promisify } from 'util';
import prettyHrtime from 'pretty-hrtime';
import chalk from 'chalk';
import { splitFilesToThreads, runCypressTests, createOutputLogDir } from './helpers';

const globAsync = promisify(glob);

interface Attributes {
    _: string[];
    threads: number;
    dir: string;
    binPath: string;
    outputLogDir: string;
}

export const handler = async (attrs: Attributes) => {
    const { threads: numberThreads, dir, binPath, outputLogDir, _ } = attrs;
    try {
        const getopt = _.slice(1); // remove 'run' command from attrs list

        if (!fs.existsSync(dir)) {
            throw new Error(chalk.redBright('Incorrect dir path'));
        }

        const files = await globAsync(`${dir}/**/*.*`);
        const threadsWithFiles = splitFilesToThreads(files, numberThreads);
        createOutputLogDir(outputLogDir);
        const start = process.hrtime();
        await runCypressTests({ threadsWithFiles, binPath, outputLogDir, getopt });
        const end = process.hrtime(start);
        // eslint-disable-next-line no-console
        console.log(chalk.green(`Tests passed, time: ${prettyHrtime(end)}`));
    } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e.message);
        // eslint-disable-next-line no-process-exit
        process.exit(1);
    }
};
