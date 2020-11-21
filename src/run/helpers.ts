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

export const execBinSync = (files: string[], binPath: string, callback: (err, result?: string) => void) => {
    const arg = files.join(',');
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
            callback(new Error('test not pass'));
        } else {
            callback(null, 'success!');
        }
    });
};

export const execBin = promisify(execBinSync);

export const runCypressTests = (threadsWithFiles: string[][], binPath: string) =>
    threadsWithFiles.map((testFiles) => execBin(testFiles, binPath));
