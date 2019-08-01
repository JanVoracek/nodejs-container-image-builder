import * as assert from 'assert';
import {ChildProcess} from 'child_process';

import {RegistryClient} from '../src/registry';

import * as localRegistry from './util/local-registry';

describe(__filename, () => {
  let registryProcess: ChildProcess&{port: number};

  before(async () => {
    registryProcess = await localRegistry.run();
    // registryProcess.stdout.pipe(process.stdout,{end:false})
    // registryProcess.stderr.pipe(process.stderr,{end:false})
    registryProcess.on('exit', (code) => {
      if (code) console.log('docker registry exited: ', code);
    });
  });

  after(() => {
    if (registryProcess) registryProcess.kill();
  });

  it('uploads blob to local docker registry', async () => {
    const blob = Buffer.from('hello world');

    const client =
        new RegistryClient('localhost:' + registryProcess.port, 'node');

    const result = await client.upload(blob);

    console.log(result);
    assert.strictEqual(
        result.digest,
        'sha256:b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9',
        'should have uploaded expected blob');
  });
});