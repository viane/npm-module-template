// @flow

import { run } from './util';

const taskName: string = process.argv[2];
const task: Promise = require(`./tasks/${taskName}`).default;

if (!task) {
  throw Error(`${taskName} task not found`);
}

try {
  run(task);
} catch (error) {
  throw error;
}
