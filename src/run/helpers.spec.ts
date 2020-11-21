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
            const value = await handleChildProcess(childProcess);
            expect(value).toEqual('success!');
        } catch (e) {
            expect(e.message).toEqual('test not pass');
        }
    });

    test('handleChildProcess exit 1', async () => {
        try {
            const childProcess = new MySpawn(1);
            await handleChildProcess(childProcess);
        } catch (e) {
            expect(e.message).toEqual('test not pass');
        }
    });

    test('execBin', async () => {
        const result = await execBin(['1.js', '2.js'], '/bib/bash');
        expect(result).toEqual('success!');
    });

    test('runCypressTests', async () => {
        const result = await runCypressTests(
            [
                ['1.js', '2.js'],
                ['3.js', '4.js'],
            ],
            '/bin/bash'
        );
        expect(result).toEqual(['success!', 'success!']);
    });
});
