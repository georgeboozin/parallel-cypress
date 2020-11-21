import { spawn } from 'child_process';
import { promisify } from 'util';

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

export const handleChildProcessSync = (childProcess, callback: (err, result?: string) => void) => {
    childProcess.stdout.on('data', (data) => {
        // eslint-disable-next-line no-console
        console.log(`stdout: ${data}`);
    });

    childProcess.stderr.on('data', (data) => {
        // eslint-disable-next-line no-console
        console.log(`stderr: ${data}`);
    });

    childProcess.on('error', (error) => {
        // eslint-disable-next-line no-console
        console.log(`error: ${error.message}`);
    });

    childProcess.on('close', (code) => {
        // eslint-disable-next-line no-console
        console.log(`child process exited with code ${code}`);
        if (code) {
            callback(new Error('test not pass'));
        } else {
            callback(null, 'success!');
        }
    });
};

export const handleChildProcess = promisify(handleChildProcessSync);

export const execBin = async (files: string[], binPath: string) => {
    const arg = files.join(',');
    const cypressRun = createChildProcess(binPath, arg);
    const result = await handleChildProcess(cypressRun);
    return result;
};

export const runCypressTests = async (threadsWithFiles: string[][], binPath: string) =>
    Promise.all(threadsWithFiles.map((testFiles) => execBin(testFiles, binPath)));
