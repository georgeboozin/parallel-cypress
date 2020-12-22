import fs from 'fs';
import glob from 'glob';
import { promisify } from 'util';
import prettyHrtime from 'pretty-hrtime';
import chalk from 'chalk';
import { splitFilesToThreads, runCypressTests, createOutputLogDir, getOpt } from './helpers';

const globAsync = promisify(glob);

interface Options {
    _: string[];
    threads: number;
    dir: string;
    binPath: string;
    outputLogDir: string;
}

export const handler = async (options: Options) => {
    const { threads: numberThreads, dir, binPath, outputLogDir, _ } = options;
    try {
        const cypressOptions = getOpt(_); // remove 'run' command from options list

        if (!fs.existsSync(dir)) {
            throw new Error(chalk.redBright('Incorrect dir path'));
        }

        const files = await globAsync(`${dir}/**/*.*`);
        const threadsWithFiles = splitFilesToThreads(files, numberThreads);
        createOutputLogDir(outputLogDir);
        const start = process.hrtime();
        await runCypressTests({ threadsWithFiles, binPath, outputLogDir, options: cypressOptions });
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
