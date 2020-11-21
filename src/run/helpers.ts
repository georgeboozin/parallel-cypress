import { spawn } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

export const splitFilesToThreads = (files: string[], numberThreads: number) =>
    files.reduce((acc, cur, index) => {
        const idx = index % numberThreads;
        if (Array.isArray(acc[idx])) {
            acc[idx].push(cur);
        } else {
            acc.push([cur]);
        }
        return acc;
    }, [] as string[][]);

export const enhanceFilePath = (files: string[], dir: string) => files.map((file: string) => `${dir}/${file}`);

export const createChildProcess = (binPath, arg) => spawn(binPath, ['run', '--spec'].concat(arg));

export const handleChildProcessSync = (childProcess, logFile: string, callback: (err, result?: string) => void) => {
    const outputFile = fs.createWriteStream(logFile);

    childProcess.stdout.pipe(outputFile);

    childProcess.stderr.on('data', (data) => {
        // eslint-disable-next-line no-console
        console.log(`stderr: ${data}`);
    });

    childProcess.on('error', (error) => {
        // eslint-disable-next-line no-console
        console.log(`error: ${error.message}`);
    });

    childProcess.on('close', (code) => {
        const { name } = path.parse(logFile);
        // eslint-disable-next-line no-console
        console.log(`${name} exited with code ${code}`);
        if (code) {
            callback(new Error(`Tests failed, see logs ${logFile}`));
        } else {
            callback(null, 'Success');
        }
    });
};

export const handleChildProcess = promisify(handleChildProcessSync);

interface ExecBin {
    files: string[];
    binPath: string;
    outputLogDir: string;
    index: number;
}

export const execBin = async ({ files, binPath, outputLogDir, index }: ExecBin) => {
    const arg = files.join(',');
    const logFile = path.join(outputLogDir, `thread-${index + 1}.log`);
    const cypressRun = createChildProcess(binPath, arg);
    const result = await handleChildProcess(cypressRun, logFile);
    return result;
};

export const createOutputLogDir = (outputLog) => {
    if (!fs.existsSync(outputLog)) {
        fs.mkdirSync(outputLog, { recursive: true });
    }
};

interface RunCypressTests {
    threadsWithFiles: string[][];
    binPath: string;
    outputLogDir: string;
}

export const runCypressTests = async ({ threadsWithFiles, binPath, outputLogDir }: RunCypressTests) =>
    Promise.all(threadsWithFiles.map((files, index) => execBin({ files, binPath, outputLogDir, index })));
