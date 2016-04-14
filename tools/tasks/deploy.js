// @flow
/* eslint no-console: 0 */

import { exec as _exec } from '../util';
import fs from 'fs';

import {
  BUILD_PATH,
  deploySlot,
} from '../config';

import type {
  GitRepositoryType,
} from '../types';

async function exec(cmd: string, args: any, _opts?: Object = {}): Promise {
  const opts = {
    ..._opts,
    cwd: BUILD_PATH,
  };
  return await _exec(cmd, args, opts);
}

export default async function deploy(): Promise {
  const deployTarget: GitRepositoryType = deploySlot;
  const {
    name,
    remoteURL,
    branch,
  } = deployTarget;
  console.log(`Chosen deploy slot is ${name}`);
  // is git repository?
  try {
    fs.statSync(`${BUILD_PATH}/.git`).isDirectory();
  } catch (error) {
    console.log(`${BUILD_PATH} has no .git directory`);
    console.log('initializing git repository ...');
    await exec('git', ['init']);
    console.log('git repository initialized');
  }
  // has branch?
  const [,, noBranch] = await exec('git', ['checkout', branch]);
  if (noBranch) {
    console.log(`creating ${branch} branch ...`);
    await exec('git', ['checkout', '-b', branch]);
    console.log(`${branch} branch created`);
  }
  // has remote?
  console.log(`setting ${name} remotes ${remoteURL} ...`);
  const [, hasRemote] = await exec('git', ['config', '--get', `remote.${name}.url`]);
  if (hasRemote) {
    await exec('git', ['remote', 'set-url', name, remoteURL]);
  } else {
    await exec('git', ['remote', 'add', name, remoteURL]);
  }
  console.log(`${name} remote correct`);
  // bring repo if already deployed
  const [didDeployCode] = await exec('git', ['ls-remote', '--exit-code', remoteURL, branch]);
  if (didDeployCode === 0) {
    // already deployed
    console.log('fetching legacy ...');
    await exec('git', ['fetch', name]);
    await exec('git', ['reset', '--hard', `${name}/${branch}`]);
    await exec('git', ['clean', '-d', '--force', '.']);
    console.log('all legacy clear');
  }
  console.log('building package ...');
  await exec('npm', ['run', 'build', '--', '--production']);
  console.log('syncing repository ...');
  await exec('git', ['add', '.']);
  await exec('git', ['commit', '-m', 'Update']);
  await exec('git', ['push', name, branch]);
  console.log('repository synced');

  return true;
}
