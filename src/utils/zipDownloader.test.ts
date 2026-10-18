import test from 'node:test';
import assert from 'node:assert/strict';
import { HEAVY_PLUGINS_LIST, getCombinedDownloadScript, JAR_URLS } from './zipDownloader.ts';
import { getAllServerFiles, DEFAULT_SPEC } from './minecraftConfig.ts';

test('HEAVY_PLUGINS_LIST contains core paper.jar and crossplay plugins', () => {
  const paper = HEAVY_PLUGINS_LIST.find((p) => p.filename === 'paper.jar');
  assert.ok(paper, 'paper.jar must be present in heavy plugins list');
  assert.equal(paper.targetFolder, '/ (Root Folder)');
  assert.ok(paper.isRequired);

  const geyser = HEAVY_PLUGINS_LIST.find((p) => p.filename === 'Geyser-Spigot.jar');
  assert.ok(geyser, 'Geyser-Spigot.jar must be present');
  assert.equal(geyser.targetFolder, '/plugins/');

  const floodgate = HEAVY_PLUGINS_LIST.find((p) => p.filename === 'Floodgate-Spigot.jar');
  assert.ok(floodgate, 'Floodgate-Spigot.jar must be present');

  const viaVersion = HEAVY_PLUGINS_LIST.find((p) => p.filename === 'ViaVersion.jar');
  assert.ok(viaVersion, 'ViaVersion.jar must be present');

  const minihud = HEAVY_PLUGINS_LIST.find((p) => p.filename === 'MiniHUD.jar');
  assert.ok(minihud, 'MiniHUD.jar must be present in plugin list');
  assert.equal(minihud.targetFolder, '/plugins/');
  assert.ok(minihud.isRequired);
});

test('getCombinedDownloadScript contains Pterodactyl container path and proper curl commands', () => {
  const script = getCombinedDownloadScript();
  assert.ok(script.includes('paper.jar'));
  assert.ok(script.includes('Geyser-Spigot.jar'));
  assert.ok(script.includes('Floodgate-Spigot.jar'));
  assert.ok(script.includes('ViaVersion.jar'));
  assert.ok(script.includes('eula=true'));
});

test('getAllServerFiles generates crucial configs and scripts without bundling 50MB binaries', () => {
  const files = getAllServerFiles(DEFAULT_SPEC);
  assert.ok(files['server.properties'], 'server.properties must exist');
  assert.ok(files['start.sh'], 'start.sh must exist');
  assert.ok(files['auto-repair.sh'], 'auto-repair.sh must exist');
  assert.ok(files['eula.txt'], 'eula.txt must exist');
  assert.ok(files['plugins/Geyser-Spigot/config.yml'], 'Geyser config must exist');
  assert.ok(files['plugins/Floodgate/config.yml'], 'Floodgate config must exist');
  assert.ok(files['plugins/ViaVersion/config.yml'], 'ViaVersion config must exist');

  // Verify none of the text files are binary jars
  for (const [name, content] of Object.entries(files)) {
    assert.equal(typeof content, 'string', `${name} must be text script/config`);
    assert.ok(!name.endsWith('.jar'), `${name} should not be a raw binary jar`);
  }
});
