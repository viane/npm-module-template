// @flow

import { spawn } from 'child_process';

import PrettyError from 'pretty-error';
export const pe = new PrettyError();

// create pretty log string with date
function formatDate(date: Date, message: string): string {
  return `[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}] ${message}`;
}

// task runner
export async function run(task: any, args: Array<any> = []): Promise {
  const startTime: Date = new Date();
  console.log(formatDate(startTime, `${task.name} started`)); // eslint-disable-line
  let endTime: Date;
  try {
    await task(...args);
    endTime = new Date();
    console.log(formatDate(endTime, `${task.name} finished ${endTime - startTime}ms`)); // eslint-disable-line
    return true;
  } catch (error) {
    endTime = new Date();
    console.error(pe.render(error)); // eslint-disable-line
    console.error(formatDate(endTime, `${task.name} failed ${endTime - startTime}ms`)); // eslint-disable-line
    return false;
  }
}

export function exec(command: string, args?: any, options?: Object): Promise {
  return new Promise((resolve: any, reject: any): void => {
    let out: string = '';
    let err: string = '';
    const p = spawn(command, args, options);
    p.stdout.on('data', (data: string): void => {
      out += data;
    });
    p.stderr.on('data', (data: string): void => {
      err += data;
    });
    p.on('error', reject);
    p.on('close', (code: number): Promise => resolve([code, out.trim(), err.trim()]));
  });
}
