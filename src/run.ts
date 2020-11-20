interface Attributes {
    threads: number;
    dir: string;
}
export const run = (attrs: Attributes) => {
    const { threads, dir} = attrs;
    console.log(threads, dir);
}
