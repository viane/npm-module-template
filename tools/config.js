// @flow

import type { GitRepositoryType } from './types';
import path from 'path';

export const DEBUG: boolean = !process.argv.includes('production');

export const deploySlot: GitRepositoryType = {
  name: 'node-stacks',
  remoteURL: 'git@github.com:Beingbook/node-stacks.git',
  branch: 'test-deploy',
};

export const ROOT_PATH = path.resolve(__dirname, '..');
export const SOURCE_PATH = `${ROOT_PATH}/src`;
export const BUILD_PATH = `${ROOT_PATH}/lib`;
