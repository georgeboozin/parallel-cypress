import { promisify } from 'util';
import { splitFilesToThreads, enhanceFilePath, execBin } from './helpers';

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

    /* test('enhanceFilePath', async () => {
        const asyncExecBin = promisify(execBin);
        const lenght = await asyncExecBin(['1', '2']);
        expect(lenght).toEqual(2);
        try {
            const lenght2 = await asyncExecBin(['1', '2', '3']);
        } catch(e) {
            expect(e.message).toEqual('ulala');
        }
    }); */
});
