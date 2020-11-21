import { enhanceFilePath } from './helpers';


describe("helpers", () => {
    test("enhanceFilePath", () => {
        const enhancedFiles = enhanceFilePath(['1.js', '2.js'], 'cypress/integration')
        expect(enhancedFiles).toEqual(['cypress/integration/1.js', 'cypress/integration/2.js']);
        expect(enhancedFiles).toHaveLength(2);
    });
});
