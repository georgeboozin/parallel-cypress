import { splitFilesToThreads, enhanceFilePath } from './helpers';


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
});
