import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateJvmMemory,
  generateServerProperties,
  generateGeyserConfigYml,
  generateFloodgateConfigYml,
  generateViaVersionConfigYml,
  generateStartSh,
  generateSetupBash,
  generateFixAnimasiPackSh,
  generateFixPluginsSh,
  generateAutoRepairSh,
  generateDiagnoseConnectionSh,
  generateInitialConnectionReadme,
  getQuickPatchFiles,
  getAllServerFiles,
  DEFAULT_SPEC,
} from './minecraftConfig.ts';

test('DEFAULT_SPEC is configured with exact user IP, port, server name, and onlineMode=false', () => {
  assert.equal(DEFAULT_SPEC.serverIp, '101.50.1.133');
  assert.equal(DEFAULT_SPEC.serverPort, 32144);
  assert.equal(DEFAULT_SPEC.serverName, '9D MINECRAFT SERVER');
  assert.equal(DEFAULT_SPEC.authMode, 'floodgate');
  assert.equal(DEFAULT_SPEC.mtuSize, 1400);
  assert.equal(DEFAULT_SPEC.onlineMode, false);
});

test('calculateJvmMemory correctly reserves 1GB for OS & Netty on 4GB VPS', () => {
  const result = calculateJvmMemory(4096);
  assert.equal(result.totalRamMb, 4096);
  assert.equal(result.heapMb, 3072);
  assert.equal(result.reservedOsAndOffHeapMb, 1024);
  assert.equal(result.parallelThreads, 2);
  assert.ok(result.flagString.includes('-Xms3072M'));
  assert.ok(result.flagString.includes('-Xmx3072M'));
  assert.ok(result.flagString.includes('-XX:+UseG1GC'));
  assert.ok(result.flagString.includes('-XX:ParallelGCThreads=2'));
});

test('generateServerProperties resolves multiplayer connection drops with enforce-secure-profile=false and online-mode=false', () => {
  const props = generateServerProperties(DEFAULT_SPEC);
  assert.ok(props.includes('server-port=32144'));
  assert.ok(props.includes('query.port=32144'));
  assert.ok(props.includes('tcp-nodelay=true'));
  assert.ok(props.includes('enforce-secure-profile=false'));
  assert.ok(props.includes('prevent-proxy-connections=false'));
  assert.ok(props.includes('online-mode=false'));
  assert.ok(props.includes('simulation-distance=5'));
  assert.ok(props.includes('view-distance=8'));
  assert.ok(props.includes('network-compression-threshold=512'));
});

test('generateGeyserConfigYml enables Bedrock crossplay with MTU 1400 and clean settings', () => {
  const geyser = generateGeyserConfigYml(DEFAULT_SPEC);
  assert.ok(geyser.includes('port: 32144'));
  assert.ok(geyser.includes('clone-remote-port: true'));
  assert.ok(geyser.includes('auth-type: floodgate'));
  assert.ok(geyser.includes('ignore-unsupported-packs: true'));
  assert.ok(geyser.includes('mtu: 1400'));
  assert.ok(geyser.includes('show-emotes-chat: true'));
  // Confirm deprecated capes warnings are removed
  assert.ok(!geyser.includes('allow-third-party-capes'));
});

test('generateFloodgateConfigYml configures bedrock prefix and advancements link', () => {
  const floodgate = generateFloodgateConfigYml();
  assert.ok(floodgate.includes('username-prefix: "."'));
  assert.ok(floodgate.includes('send-floodgate-data: true'));
  assert.ok(floodgate.includes('enable-auto-login: true'));
});

test('generateViaVersionConfigYml enables cross-version compatibility for clients 1.8 to 1.21.x', () => {
  const via = generateViaVersionConfigYml();
  assert.ok(via.includes('show-supported-versions: true'));
  assert.ok(via.includes('suppress-conversion-warnings: true'));
});

test('generateFixPluginsSh removes geyserupdater directory and downloads Geyser, floodgate & viaversion', () => {
  const fixScript = generateFixPluginsSh();
  assert.ok(fixScript.includes('rm -rf plugins/geyserupdater'));
  assert.ok(fixScript.includes('Geyser-Spigot.jar'));
  assert.ok(fixScript.includes('floodgate-spigot.jar'));
  assert.ok(fixScript.includes('ViaVersion.jar'));
});

test('generateInitialConnectionReadme explains Xiaomi Android 16 InitialConnection-13 error and fix', () => {
  const readme = generateInitialConnectionReadme(DEFAULT_SPEC);
  assert.ok(readme.includes('NetherNet InitialConnection-13'));
  assert.ok(readme.includes('Xiaomi 2312FPCA6G'));
  assert.ok(readme.includes('floodgate-spigot.jar'));
});

test('getQuickPatchFiles returns lightweight patch bundle without heavy jars', () => {
  const patchFiles = getQuickPatchFiles(DEFAULT_SPEC);
  const keys = Object.keys(patchFiles);
  assert.ok(keys.includes('install-minihud.sh'));
  assert.ok(keys.includes('fix-plugins.sh'));
  assert.ok(keys.includes('plugins/Floodgate/config.yml'));
  assert.ok(keys.includes('plugins/ViaVersion/config.yml'));
  assert.ok(keys.includes('plugins/MiniHUD/config.yml'));
  assert.ok(keys.includes('README-FIX-MINIHUD.md'));
  assert.ok(keys.includes('README-FIX-INITIALCONNECTION-13.md'));
  assert.ok(!keys.includes('paper.jar'));
  assert.ok(!keys.includes('Geyser-Spigot.jar'));
  assert.equal(keys.length, 12);
});

test('generateAutoRepairSh implements internal VPS auto-download and anti-force-offline rescue', () => {
  const autoRepair = generateAutoRepairSh(DEFAULT_SPEC);
  assert.ok(autoRepair.includes('paper.jar'));
  assert.ok(autoRepair.includes('Geyser-Spigot.jar'));
  assert.ok(autoRepair.includes('Floodgate-Spigot.jar'));
  assert.ok(autoRepair.includes('ViaVersion.jar'));
  assert.ok(autoRepair.includes('ANTI-FORCE-OFFLINE AKTIF'));
  assert.ok(autoRepair.includes('download_file_safe'));
});

test('generateDiagnoseConnectionSh tests port 32144, UFW firewall, MTU, and chat signing', () => {
  const diag = generateDiagnoseConnectionSh(DEFAULT_SPEC);
  assert.ok(diag.includes('DIAGNOSTIK KONEKSI MULTIPLAYER'));
  assert.ok(diag.includes('enforce-secure-profile=false'));
  assert.ok(diag.includes('prevent-proxy-connections=false'));
  assert.ok(diag.includes('mtu: 1400'));
  assert.ok(diag.includes('Gunakan Data Seluler'));
});

test('generateStartSh includes watchdog loop preventing immediate force offline', () => {
  const startSh = generateStartSh(DEFAULT_SPEC);
  assert.ok(startSh.includes('paper.jar'));
  assert.ok(startSh.includes('RESCUE WATCHDOG'));
  assert.ok(startSh.includes('Mencegah FORCE-OFFLINE'));
  assert.ok(startSh.includes('-Xms3072M'));
  assert.ok(startSh.includes('--port 32144'));
  assert.ok(startSh.includes('fuser -k -n tcp 32144'));
});

test('generateSetupBash configures temurin-21-jdk, 2GB swap, and UFW firewall port 32144', () => {
  const setup = generateSetupBash(DEFAULT_SPEC);
  assert.ok(setup.includes('temurin-21-jdk'));
  assert.ok(setup.includes('mkswap /swapfile'));
  assert.ok(setup.includes('ufw allow 32144/tcp'));
  assert.ok(setup.includes('ufw allow 32144/udp'));
  assert.ok(setup.includes('auto-repair.sh'));
});

test('generateServerProperties configures player-idle-timeout=0 and allow-flight=true', () => {
  const props = generateServerProperties(DEFAULT_SPEC);
  assert.ok(props.includes('player-idle-timeout=0'));
  assert.ok(props.includes('allow-flight=true'));
  assert.ok(props.includes('network-compression-threshold=512'));
  assert.ok(props.includes('max-tick-time=120000'));
});

test('getAllServerFiles returns all 25 required deployment, anti-timeout, MiniHUD, and recovery files', () => {
  const files = getAllServerFiles(DEFAULT_SPEC);
  const keys = Object.keys(files);
  assert.ok(keys.includes('install-minihud.sh'));
  assert.ok(keys.includes('fix-plugins.sh'));
  assert.ok(keys.includes('auto-repair.sh'));
  assert.ok(keys.includes('disable-all-anticheat.sh'));
  assert.ok(keys.includes('diagnose-connection.sh'));
  assert.ok(keys.includes('download-server-jars.sh'));
  assert.ok(keys.includes('eula.txt'));
  assert.ok(keys.includes('server.properties'));
  assert.ok(keys.includes('spigot.yml'));
  assert.ok(keys.includes('bukkit.yml'));
  assert.ok(keys.includes('config/paper-global.yml'));
  assert.ok(keys.includes('purpur.yml'));
  assert.ok(keys.includes('paper-world-defaults.yml'));
  assert.ok(keys.includes('plugins/Geyser-Spigot/config.yml'));
  assert.ok(keys.includes('plugins/Floodgate/config.yml'));
  assert.ok(keys.includes('plugins/ViaVersion/config.yml'));
  assert.ok(keys.includes('plugins/MiniHUD/config.yml'));
  assert.ok(keys.includes('fix-animasi-pack.sh'));
  assert.ok(keys.includes('start.sh'));
  assert.ok(keys.includes('setup-jagoanhosting.sh'));
  assert.ok(keys.includes('minecraft.service'));
  assert.ok(keys.includes('README-DEPLOYMENT.md'));
  assert.ok(keys.includes('README-FIX-MINIHUD.md'));
  assert.ok(keys.includes('README-FIX-INITIALCONNECTION-13.md'));
  assert.ok(keys.includes('README-FIX-KEEPALIVE-TIMEOUT.md'));
  assert.equal(keys.length, 25);
});

test('generateMiniHudPluginConfig focuses strictly on Ping and Server Uptime with 9D SERVER title', () => {
  const files = getAllServerFiles(DEFAULT_SPEC);
  const miniHudConfig = files['plugins/MiniHUD/config.yml'];
  assert.ok(miniHudConfig.includes('ping_prefix: "&fPing: &a"'));
  assert.ok(miniHudConfig.includes('uptime_prefix: "&fUptime: &e"'));
  assert.ok(miniHudConfig.includes('9D SERVER'));
  assert.ok(miniHudConfig.includes('default_enabled: true'));
});

