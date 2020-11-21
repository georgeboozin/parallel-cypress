import fs from 'fs';
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
            expect(value).toEqual('success!');
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
            expect(e.message).toEqual('test not pass');
            fs.unlinkSync('thread-1.log');
        }
    });

    test('execBin', async () => {
        const result = await execBin({ files: ['1.js', '2.js'], binPath: '/bin/bash', outputLogDir: '.', index: 0 });
        expect(result).toEqual('success!');
        fs.unlinkSync('thread-1.log');
    });

    test('runCypressTests', async () => {
        const result = await runCypressTests({
            threadsWithFiles: [
                ['1.js', '2.js'],
                ['3.js', '4.js'],
            ],
            binPath: '/bin/bash',
            outputLogDir: '.',
        });
        expect(result).toEqual(['success!', 'success!']);
        fs.unlinkSync('thread-1.log');
        fs.unlinkSync('thread-2.log');
    });
});
