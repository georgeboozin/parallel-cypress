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
