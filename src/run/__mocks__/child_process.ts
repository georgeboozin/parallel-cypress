import { EventEmitter } from 'events';
import { Readable } from 'stream';

const childProcess = jest.createMockFromModule('child_process');

export class MySpawn extends EventEmitter {
    stdout: any;

    stderr: any;

    constructor(code: number) {
        super();
        const self = this;
        this.stdout = new Readable({
            read() {
                this.push('tests ran');
                this.push(null);
                setTimeout(() => {
                    self.emit('close', code);
                }, 100)
            },
        });

        this.stderr = new Readable({
            read() {
                this.push(null);
            },
        });
    }
}


export const spawn = () => new MySpawn(0);

export default childProcess;
