import * as readline from 'node:readline';
import {exec} from 'child_process';

export function $(str, ...args) {
    let cmd = str.reduce((acc, part, i) => acc + part + (args[i] || ''), '');
    return new Promise((res, rej) => exec(cmd, (err, stdout, stderr) => {
        if (err || stderr) return rej(err || stderr);
        return res(stdout);
    }))
}

export function adjustedInterval(cb, ms) {
    let cancel = false, timeout = null;
    const p = async () => {
        if (cancel) return;
        const start = new Date().getTime();
        await cb();
        const end = new Date().getTime();
        timeout = setTimeout(() => p(), ms - (end - start) || 1);
    };
    p();
    return () => {
        cancel = true;
        if (timeout) clearTimeout(timeout);
    }
}

export function ask(prompt, hide = false) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: true
    });

    return new Promise((resolve) => {
        if (!hide) {
            rl.question(prompt, (answer) => {
                rl.close();
                resolve(answer);
            });
        } else {
            rl.output.write(prompt);
            let input = '';

            // Listen for 'keypress' to handle masking
            rl.input.on('keypress', (char, key) => {
                if (key && key.name === 'return') {
                    rl.output.write('\n'); // Submit on new line
                    rl.close();
                    resolve(input);
                } else if (key && key.name === 'backspace') {
                    if (input.length > 0) {
                        input = input.slice(0, -1);
                        rl.output.write(`\r${prompt}${input.replaceAll(/./g, '*')} \b`);
                    }
                } else {
                    input += char;
                    rl.output.write('\b*'); // Mask the input with '*'
                }
            });

            // Restore settings
            rl.input.setRawMode(true);
            rl.input.resume();
        }
    });
}

export function sleep(ms) {
    return new Promise(res => setTimeout(res, ms));
}
