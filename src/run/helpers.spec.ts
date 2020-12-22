import fs from 'fs';
import chalk from 'chalk';
// eslint-disable-next-line @typescript-eslint/camelcase
import * as child_process from 'child_process';
import { MySpawn } from './__mocks__/child_process';
import { splitFilesToThreads, enhanceFilePath, handleChildProcess, execBin, runCypressTests } from './helpers';

jest.mock('child_process');

describe('helpers', () => {
    test('splitFilesToThreads', () => {
        const threadsWithFilesEven = splitFilesToThreads(['1.js', '2.js'], 2);
        expect(threadsWithFilesEven).toEqual([['1.js'], ['2.js']]);
        expect(threadsWithFilesEven).toHaveLength(2);

        const threadsWithFilesOdd = splitFilesToThreads(['1.js', '2.js', '3.js'], 2);
        expect(threadsWithFilesOdd).toEqual([['1.js', '3.js'], ['2.js']]);
        expect(threadsWithFilesOdd).toHaveLength(2);

        const threadsWithFilesThree = splitFilesToThreads(['1.js', '2.js', '3.js'], 3);
        expect(threadsWithFilesThree).toEqual([['1.js'], ['2.js'], ['3.js']]);
        expect(threadsWithFilesThree).toHaveLength(3);
    });

    test('enhanceFilePath', () => {
        const enhancedFiles = enhanceFilePath(['1.js', '2.js'], 'cypress/integration');
        expect(enhancedFiles).toEqual(['cypress/integration/1.js', 'cypress/integration/2.js']);
        expect(enhancedFiles).toHaveLength(2);
    });

    test('handleChildProcess exit 0', async () => {
        try {
            const childProcess = new MySpawn(0);
            const value = await handleChildProcess(childProcess, 'thread-1.log');
            expect(value).toEqual('Success');
            fs.unlinkSync('thread-1.log');
        } catch (e) {
            expect(e.message).toEqual('test not pass');
        }
    });

    test('handleChildProcess exit 1', async () => {
        try {
            const childProcess = new MySpawn(1);
            await handleChildProcess(childProcess, 'thread-1.log');
        } catch (e) {
            expect(e.message).toEqual(
                `${chalk.redBright('Tests failed, see logs')} ${chalk.blue.underline('thread-1.log')}`
            );
            fs.unlinkSync('thread-1.log');
        }
    });

    test('execBin', async () => {
        const spySpawn = jest.spyOn(child_process, 'spawn');
        const result = await execBin({
            files: ['1.js', '2.js'],
            binPath: '/bin/bash',
            outputLogDir: './',
            index: 0,
            getopt: ['--env', 'allure=true'],
        });
        expect(result).toEqual('Success');
        expect(spySpawn).toHaveBeenCalledTimes(1);
        expect(spySpawn).toBeCalledWith('/bin/bash', ['run', '--spec', '1.js,2.js', '--env', 'allure=true']);
        fs.unlinkSync('thread-1.log');
        spySpawn.mockRestore();
    });

    test('execBin empty getopt', async () => {
        const spySpawn = jest.spyOn(child_process, 'spawn');
        const result = await execBin({
            files: ['1.js', '2.js'],
            binPath: '/bin/bash',
            outputLogDir: './',
            index: 0,
            getopt: [],
        });
        expect(spySpawn).toHaveBeenCalledTimes(1);
        expect(spySpawn).toBeCalledWith('/bin/bash', ['run', '--spec', '1.js,2.js']);
        expect(result).toEqual('Success');
        fs.unlinkSync('thread-1.log');
        spySpawn.mockRestore();
    });

    test('runCypressTests', async () => {
        const spySpawn = jest.spyOn(child_process, 'spawn');
        const result = await runCypressTests({
            threadsWithFiles: [
                ['1.js', '2.js'],
                ['3.js', '4.js'],
            ],
            binPath: '/bin/bash',
            outputLogDir: './',
            getopt: ['--env', 'allure=true'],
        });
        expect(result).toEqual(['Success', 'Success']);
        expect(spySpawn).toHaveBeenCalledTimes(2);
        expect(spySpawn).toHaveBeenNthCalledWith(1, '/bin/bash', [
            'run',
            '--spec',
            '1.js,2.js',
            '--env',
            'allure=true',
        ]);
        expect(spySpawn).toHaveBeenNthCalledWith(2, '/bin/bash', [
            'run',
            '--spec',
            '3.js,4.js',
            '--env',
            'allure=true',
        ]);
        fs.unlinkSync('thread-1.log');
        fs.unlinkSync('thread-2.log');
        spySpawn.mockRestore();
    });
});
