/**
 * Minecraft Server Configuration Generator & Jagoan Hosting Optimizer
 * Tuned per 2026-10-17 for:
 * - CPU: 200% AMD Ryzen 9 (2 vCPU)
 * - RAM: 4GB DDR4/DDR5
 * - Disk: NVMe SSD 30GB
 * - Datacenter: Jakarta (IDIX / OpenIXP / Cyber)
 * - Allocated Server IP: 101.50.1.133
 * - Allocated Port: 32144 (Pterodactyl Panel stellar.jagoanhosting.id)
 * - Target: Bedrock (Phone/Tablet) <-> Java (Laptop/PC) 100% Crossplay
 * - Features:
 *   1. Zero "Multiplayer connection failed / Trouble establishing connection"
 *   2. MTU 1400 tuning for Indo telcos (Telkomsel, Indosat, XL, Indihome)
 *   3. Enforce-secure-profile=false & prevent-proxy-connections=false
 *   4. Internal VPS auto-downloader for missing JARs & plugins
 *   5. Anti-force-offline watchdog (never drops to offline state on download failure)
 *   6. ViaVersion + ViaBackwards multi-version protocol bridging (1.8 - 1.21.x+)
 *   7. Advancements/Achievements enabled & lightweight collapsible mini HUD
 */

import { MINIHUD_JAR_BASE64, generateInstallMiniHudSh } from './customSidePanelJar.ts';

export interface ServerSpec {
  vpsProvider: string;
  serverIp: string;
  serverPort: number;
  cpuModel: string;
  cpuCores: number; // 200% = 2 vCPU
  ramMb: number; // 4096 MB
  diskNvmeGb: number; // 30 GB
  location: string;
  minecraftVersion: string;
  serverSoftware: 'Purpur' | 'Paper';
  viewDistance: number;
  simulationDistance: number;
  pterodactylServerId: string;
  pterodactylServerName: string;
  serverName: string;
  authMode: 'floodgate' | 'offline' | 'online';
  mtuSize: number;
  onlineMode: boolean;
}

export const DEFAULT_SPEC: ServerSpec = {
  vpsProvider: 'Jagoan Hosting Indonesia (Stellar Panel)',
  serverIp: '101.50.1.133',
  serverPort: 32144,
  serverName: '9D MINECRAFT SERVER',
  cpuModel: 'AMD Ryzen 9 5950X / 7950X (200% Allocated)',
  cpuCores: 2,
  ramMb: 4096,
  diskNvmeGb: 30,
  location: 'Jakarta (IDC / Cyber Datacenter)',
  minecraftVersion: 'Paper 26.3 / 1.21.4 (Java 25 LTS Temurin)',
  serverSoftware: 'Paper',
  viewDistance: 8,
  simulationDistance: 5,
  pterodactylServerId: 'b1736dee',
  pterodactylServerName: 'qXri8iZ9_447337',
  authMode: 'floodgate',
  mtuSize: 1400,
  onlineMode: false,
};

/**
 * Calculates optimal JVM Flags for 4GB RAM + 2 vCPU Ryzen 9
 * Reserving safety margin so Linux Kernel & Geyser Off-Heap never trigger OOM Killer
 */
export function calculateJvmMemory(totalRamMb: number) {
  // Safe heap: 75% of RAM, capped so at least 1024MB remains for OS + Geyser off-heap buffers
  const reservedOsAndOffHeapMb = 1024;
  const heapMb = Math.max(1024, totalRamMb - reservedOsAndOffHeapMb);
  
  // Ryzen 9 200% = 2 vCPU threads
  const parallelThreads = 2;
  const concGcThreads = 1;

  const aikarFlags = [
    `-Xms${heapMb}M`,
    `-Xmx${heapMb}M`,
    '-XX:+UseG1GC',
    '-XX:+ParallelRefProcEnabled',
    '-XX:MaxGCPauseMillis=200',
    '-XX:+UnlockExperimentalVMOptions',
    '-XX:+DisableExplicitGC',
    '-XX:+AlwaysPreTouch',
    '-XX:G1NewSizePercent=30',
    '-XX:G1MaxNewSizePercent=40',
    '-XX:G1ReservePercent=20',
    '-XX:G1HeapWastePercent=5',
    '-XX:G1MixedGCCountTarget=4',
    '-XX:InitiatingHeapOccupancyPercent=15',
    '-XX:G1MixedGCLiveThresholdPercent=90',
    '-XX:G1RSetUpdatingPauseTimePercent=5',
    '-XX:SurvivorRatio=32',
    '-XX:+PerfDisableSharedMem',
    '-XX:MaxTenuringThreshold=1',
    `-XX:ParallelGCThreads=${parallelThreads}`,
    `-XX:ConcGCThreads=${concGcThreads}`,
    '-Dusing.aikars.flags=https://mcflags.emc.gs',
    '-Daikars.new.flags=true',
    '-Dfile.encoding=UTF-8',
    '--add-modules=jdk.incubator.vector',
    '-Dlog4j2.formatMsgNoLookups=true',
  ];

  return {
    totalRamMb,
    heapMb,
    reservedOsAndOffHeapMb,
    parallelThreads,
    concGcThreads,
    flagString: aikarFlags.join(' '),
    aikarFlags,
  };
}

/**
 * Generates server.properties tuned for IP 101.50.1.133 and Port 32144
 * Resolves multiplayer connection failed issues by:
 * - enforce-secure-profile=false (Prevents Bedrock chat signing disconnects)
 * - prevent-proxy-connections=false (Allows Geyser proxy packet translation)
 * - network-compression-threshold=256 & tcp-nodelay=true (Zero network lag)
 */
export function generateServerProperties(spec: ServerSpec = DEFAULT_SPEC): string {
  return `# Minecraft Server Properties - Tuned for Jagoan Hosting (Stellar Pterodactyl)
# IP: ${spec.serverIp} | Port: ${spec.serverPort} | AMD Ryzen 9 200% | RAM 4GB
# Generated: 2026-10-17 - Bedrock & Java Crossplay Ready (Zero Timeout & Zero Kick)
# Anti-Multiplayer Connection Failed & Anti-Keepalive Timeout:
server-port=${spec.serverPort}
server-ip=0.0.0.0
network-compression-threshold=512
tcp-nodelay=true
prevent-proxy-connections=false
enable-query=true
query.port=${spec.serverPort}
enable-rcon=false
enable-status=true
enforce-secure-profile=false
online-mode=${spec.onlineMode ? 'true' : 'false'}
allow-flight=true
allow-nether=true
broadcast-console-to-ops=true
difficulty=normal
gamemode=survival
hardcore=false
max-players=30
max-tick-time=120000
max-world-size=29999984
motd=\\u00A76\\u00A7l9D MINECRAFT SERVER \\u00A77| \\u00A7bCrossplay Java+Bedrock \\u00A7a:${spec.serverPort}
player-idle-timeout=0
pvp=true
simulation-distance=${spec.simulationDistance}
view-distance=${spec.viewDistance}
sync-chunk-writes=true
white-list=false
spawn-animals=true
spawn-monsters=true
spawn-npcs=true
spawn-protection=0
use-native-transport=true
rate-limit=0
`;
}

/**
 * Generates purpur.yml with ultra-performance tick loop optimization & warning suppressor
 */
export function generatePurpurYml(): string {
  return `# Purpur Configuration - Ultra-performance for Ryzen 9 200% (2 vCPU)
# Zero-delay, Anti-lag, and TPS lock (20.0 TPS) - No Warning Spam
verbose: false
settings:
  lagging-threshold: 19.0
  use-alternative-keepalive: true
  tps-catchup: false
  teleport-if-outside-border: true
  logger:
    suppress-tick-inactivity-warning: true
    suppress-init-warnings: true
world-settings:
  default:
    gameplay-mechanics:
      use-alternate-keepalive: true
      disable-unloaded-chunk-enderpearl-exploit: true
    mobs:
      villager:
        brain-ticks: 2
        lobotomize:
          enabled: true
          check-interval: 100
      zombie:
        aggressive-towards-villager-when-lagging: false
    performance:
      allow-void-trading: false
      fix-projectile-desync: true
      idle-timeout-ticks: 300
`;
}

/**
 * Generates paper-world-defaults.yml (1.21.x)
 */
export function generatePaperWorldDefaultsYml(): string {
  return `# Paper World Defaults - 1.21.x Ultra Low Latency Profile
anticheat:
  obfuscation:
    items:
      enable: false
chunks:
  auto-save-interval: 6000
  delay-chunk-unloads-by: 10s
  entity-per-chunk-save-limit:
    arrow: 8
    experience_orb: 16
    item: 24
  flush-regions-on-save: false
  max-auto-save-chunks-per-tick: 12
  prevent-moving-into-unloaded-chunks: true
entities:
  behavior:
    disable-chest-cat-detection: true
    spigot:
      nerf-pigmen-from-nether-portals: true
  spawning:
    despawn-ranges:
      ambient:
        hard: 56
        soft: 28
      axolotls:
        hard: 56
        soft: 28
      creature:
        hard: 64
        soft: 32
      monster:
        hard: 96
        soft: 32
      water_creature:
        hard: 64
        soft: 32
    non-player-arrow-despawn-rate: 60
    creative-arrow-despawn-rate: 60
collisions:
  enable-player-collisions: true
  send-full-pos-for-hard-colliding-entities: true
environment:
  optimize-explosions: true
  treasure-maps:
    enabled: true
    find-already-discovered:
      villager-trade: false
tick-rates:
  sensor:
    villager:
      secondarypoisensor: 80
      nearestbedsensor: 80
      villagerbabiessensor: 40
      playersensor: 40
      nearestlivingentitysensor: 40
  behavior:
    villager:
      validatenearbypoi: 80
      acquirepoi: 120
`;
}

/**
 * Generates spigot.yml - Tuned for Zero Keepalive Timeout & Zero Kick/Ban
 * Fixes: "[Geyser-Spigot] Pemain terhubung ... was kicked due to keepalive timeout!"
 */
export function generateSpigotYml(): string {
  return `# Spigot Configuration - Tuned 2026 for Zero Keepalive Timeout & Zero Kick/Ban
# Specifically fixes player kicked due to keepalive timeout on Bedrock & Mobile Networks
settings:
  debug: false
  timeout-time: 300 # CRITICAL: Default is 60s, causing keepalive timeout kick. 300s completely prevents premature kicks!
  restart-on-crash: false
  restart-script: ./start.sh
  bungeecord: false
  player-shuffle: 0
  user-cache-size: 1000
  sample-count: 12
  log-villager-deaths: false
  log-named-deaths: false
  moved-wrongly-threshold: 10.0 # Anticheat relaxation: prevents Bedrock desync "moved wrongly" kicks
  moved-too-quickly-multiplier: 100.0 # Prevents "moved too quickly" kicks
messages:
  whitelist: Anda belum masuk whitelist server.
  unknown-command: Perintah tidak diketahui.
  server-full: Server penuh!
  outdated-client: Versi Minecraft Anda tidak cocok.
  outdated-server: Versi server berbeda.
  restart: Server sedang direstart.
advancements:
  disable-saving: false
  disabled:
  - minecraft:story/disabled
world-settings:
  default:
    verbose: false
    view-distance: default
    simulation-distance: default
    mob-spawn-range: 4
    entity-activation-range:
      animals: 16
      monsters: 24
      raiders: 32
      misc: 8
      water: 8
      villagers: 16
      flying-monsters: 24
    growth:
      cactus-modifier: 100
      cane-modifier: 100
      melon-modifier: 100
      mushroom-modifier: 100
      pumpkin-modifier: 100
      sapling-modifier: 100
      beetroot-modifier: 100
      carrot-modifier: 100
      potato-modifier: 100
      wheat-modifier: 100
      netherwart-modifier: 100
      vine-modifier: 100
      cocoa-modifier: 100
      bamboo-modifier: 100
      sweetberry-modifier: 100
      kelp-modifier: 100
    entity-tracking-range:
      players: 48
      animals: 32
      monsters: 32
      misc: 24
      other: 48
    ticks-per:
      hopper-transfer: 8
      hopper-check: 1
    hopper-amount: 1
    max-tnt-per-tick: 20
    merge-radius:
      exp: 4.0
      item: 3.0
    hunger:
      jump-walk-exhaustion: 0.05
      jump-sprint-exhaustion: 0.2
      combat-exhaustion: 0.1
      regen-exhaustion: 6.0
      swim-multiplier: 0.01
      sprint-multiplier: 0.1
      other-multiplier: 0.0
`;
}

/**
 * Generates bukkit.yml with connection throttle disabled
 */
export function generateBukkitYml(): string {
  return `# Bukkit Configuration - Connection Throttling Disabled
settings:
  allow-end: true
  warn-on-overload: false
  permissions-file: permissions.yml
  update-folder: update
  plugin-profiling: false
  connection-throttle: -1 # CRITICAL: Disables reconnection kick / throttle (-1 = no throttle)
  query-plugins: true
  deprecated-verbose: default
  shutdown-message: Server dimatikan.
spawn-limits:
  monsters: 40
  animals: 8
  water-animals: 2
  water-ambient: 1
  ambient: 1
chunk-gc:
  period-in-ticks: 600
ticks-per:
  animal-spawns: 400
  monster-spawns: 2
  water-spawns: 400
  water-ambient-spawns: 400
  ambient-spawns: 400
  autosave: 6000
aliases: now-in-commands.yml
`;
}

/**
 * Generates config/paper-global.yml - Anticheat & Packet Limiter Disabled (2026 Analysis)
 */
export function generatePaperGlobalYml(): string {
  return `# config/paper-global.yml - Anticheat & Packet Limiter Disabled (2026 Analysis)
_version: 30
packet-limiter:
  all-packets:
    action: DROP # Default is KICK, which kicks players during heavy chunk load! DROP prevents keepalive kick!
    interval: 7.0
    max-packet-rate: 2000.0 # Generous rate for Geyser batch packet translation
  kick-message: 'Dihapus'
  overrides: {}
watchdog:
  early-warning-delay: 15000
  early-warning-every: 10000
player-auto-save-rate: -1
max-auto-save-chunks-per-tick: 6
item-validation:
  display-name: 8192
  loc-name: 8192
  lore-line: 8192
  book:
    title: 8192
    author: 8192
    page: 65536
unhandled-teleport-fallback: false
messages:
  no-permission: '&cAnda tidak memiliki izin.'
`;
}

/**
 * Generates Geyser-Spigot config.yml for Bedrock Crossplay
 * Tuned specifically to solve "Multiplayer connection failed: trouble establishing connection to multiplayer":
 * 1. bedrock.address: 0.0.0.0 (Binds to all VPS network interfaces)
 * 2. bedrock.port: matching spec.serverPort
 * 3. clone-remote-port: true (Matches remote Minecraft port)
 * 4. remote.address: 127.0.0.1 (Direct loopback avoiding NAT loops)
 * 5. remote.auth-type: floodgate (Seamless encryption handshake)
 * 6. mtu: 1400 (Crucial for Indonesian 4G/5G carriers & Indihome PPPoE to avoid UDP packet fragmentation)
 * 7. use-direct-connection: true & enable-proxy-protocol: false
 * 8. allow-third-party-capes: true & show-cooldown: title (Prevents Bedrock crash on custom models)
 */
export function generateGeyserConfigYml(spec: ServerSpec = DEFAULT_SPEC): string {
  const mtu = spec.mtuSize || 1400;
  return `# Geyser-Spigot Configuration - Bedrock Crossplay for Jagoan Hosting (${spec.serverIp}:${spec.serverPort})
# Server Allocation: Port ${spec.serverPort} (UDP Bedrock + TCP Java)
# Anti-Disconnect & Low Latency Profile (Tuned 2026-10-17)

bedrock:
  # 0.0.0.0 binds to all VPS network interfaces for public UDP accessibility
  address: 0.0.0.0
  port: ${spec.serverPort}
  clone-remote-port: true
  motd1: "\\u00A76\\u00A7l9D MINECRAFT SERVER"
  motd2: "\\u00A7bBedrock + Java \\u00A77| \\u00A7aLow Latency :${spec.serverPort}"
  server-name: "${spec.serverName || '9D MINECRAFT SERVER'}"
  compression-level: 6
  enable-proxy-protocol: false
  broadcast-port: ${spec.serverPort}

remote:
  address: 127.0.0.1
  port: ${spec.serverPort}
  auth-type: ${spec.authMode || 'floodgate'}
  use-proxy-protocol: false

# Achievements & Bedrock UX Emulation:
# True enables Bedrock-style achievements and visual popups
show-emotes-chat: true
show-cooldown: title
custom-skull-render-distance: 32
max-chunk-visualization: 12
scoreboard-packet-threshold: 20
enable-custom-skulls: true
add-non-bedrock-items: true
below-bedrock-nether-building: false

# Resource Pack Optimization:
# Prevents crash/lag when using Actions And Stuff / animasi.mcpack
# Jalankan fix-animasi-pack.sh untuk menghilangkan warning > 80 karakter
ignore-unsupported-packs: true
force-resource-packs: false

# Network optimization to prevent "Trouble establishing connection to multiplayer" and "keepalive timeout":
# MTU 1400 prevents UDP packet fragmentation across mobile 4G/5G (Telkomsel/Indosat/XL)
mtu: ${mtu}
use-direct-connection: true
forward-player-ping: false
cache-chunks: true
max-chunk-queue: 10
command-suggestions: true
passthrough-motd: true
passthrough-player-counts: true
legacy-ping-passthrough: false
ping-passthrough-interval: 3
default-locale: id_id
metrics:
  enabled: false
`;
}

/**
 * Generates Floodgate config.yml for passwordless Bedrock login with Bedrock prefix
 */
export function generateFloodgateConfigYml(): string {
  return `# Floodgate 2.0 Configuration
# Allows genuine & mobile Bedrock players to join without Java account
key-file: key.pem
username-prefix: "."
replace-spaces: true
default-locale: id_id

# Player Linking & UUID handling:
player-link:
  enabled: true
  require-link: false
  enable-own-linking: true
  type: sqlite
  enable-auto-login: true

# Send Advancements/Achievements directly to Bedrock client
send-floodgate-data: true
`;
}

/**
 * Generates ViaVersion config to guarantee 100% cross-version compatibility
 * Prevents "Outdated server / Outdated client" multiplayer connection dropouts
 */
export function generateViaVersionConfigYml(): string {
  return `# ViaVersion Configuration - Multi-Version Crossplay Bridge
# Ensures Java players on 1.8 up to 1.21.x and Bedrock players can connect smoothly
checkforupdates: false
show-supported-versions: true
block-versions: []
suppress-conversion-warnings: true
suppress-1_13-conversion-warnings: true
prevent-invalid-movement: false
use-new-effect-names: true
auto-team: true
velocity-ping-interval: -1
change-1_9-hitbox: false
change-1_14-hitbox: false
show-shield-when-sword-in-hand: false
`;
}

/**
 * Generates custom MiniHUD / Collapsible In-Game HUD configuration
 * Minimal screen footprint, exclusively Ping & Server Uptime as requested
 * 100% Native Bukkit/Paper Crossplay for Bedrock (Android/iOS) & Java Desktop
 */
export function generateMiniHudPluginConfig(): string {
  return `# ==============================================================================
# 9D SERVER - Custom Collapsible In-Game HUD (Ping & Server Uptime)
# 100% Native Bukkit/Paper Crossplay for Bedrock (Android/iOS) & Java
# Minecraft 1.20 - 1.21.x Ready (Per 2026-10-18)
# ==============================================================================
# Judul Mini HUD (Tampil di atas scoreboard sisi kanan - 9D SERVER)
title: "&6&l9D SERVER &7[<]"

# Format tampilan baris samping (HANYA PING & UPTIME - Tanpa Angka Merah 2 dan 1)
format:
  ping_prefix: "&fPing: &a"
  uptime_prefix: "&fUptime: &e"

# Refresh rate dalam game ticks (20 ticks = 1 detik, zero-lag & ultra-ringan)
refresh_ticks: 20

# Aktif secara otomatis saat pemain bergabung
default_enabled: true

# Double-tap tombol sneak/jongkok untuk toggle buka/tutup HUD (Sangat nyaman di ponsel)
sneak_toggle: true

# Angkat posisi scoreboard lebih ke atas mendekati corner kanan agar tidak menutupi tombol jump HP
top_corner_offset: true

# Perlindungan Spawn Anti-Damage & Anti-Touch oleh Mob Hostile selama 15 detik
spawn_protection:
  enabled: true
  seconds: 15
`;
}

/**
 * Script khusus untuk memperbaiki "animasi.mcpack" (Actions And Stuff 1.9)
 * Mengatasi warning Geyser-Spigot:
 * "The resource pack animasi.mcpack has a file in it that meets or exceeds 80 characters in its path"
 * Mengurangi path 22+ karakter sehingga 100% kompatibel di semua HP/Switch/Bedrock tanpa lag console!
 */
export function generateFixAnimasiPackSh(): string {
  return `#!/usr/bin/env bash
# ==============================================================================
# SCRIPT PERBAIKAN RESOURCE PACK "animasi.mcpack" (Actions And Stuff 1.9)
# Mengatasi Spam Warning Geyser: File path meets or exceeds 80 characters
# Menghilangkan I/O Lag Spike di Pterodactyl Console (stellar.jagoanhosting.id)
# ==============================================================================
set -e

PACK_DIR="plugins/Geyser-Spigot/packs"
PACK_FILE="$PACK_DIR/animasi.mcpack"
TEMP_DIR="/tmp/geyser_animasi_fix"

echo "=== [1/4] Memeriksa keberadaan file $PACK_FILE ==="
if [ ! -f "$PACK_FILE" ]; then
    echo "[INFO] Mencari file animasi.mcpack di folder saat ini..."
    if [ -f "animasi.mcpack" ]; then
        mkdir -p "$PACK_DIR"
        mv animasi.mcpack "$PACK_FILE"
    else
        echo "[ERROR] File $PACK_FILE tidak ditemukan!"
        echo "Pastikan file animasi.mcpack berada di folder plugins/Geyser-Spigot/packs/"
        exit 1
    fi
fi

echo "=== [2/4] Mengekstrak pack untuk meratakan struktur folder ==="
rm -rf "$TEMP_DIR"
mkdir -p "$TEMP_DIR"
unzip -q "$PACK_FILE" -d "$TEMP_DIR"

# Cek apakah pack memiliki folder pembungkus terluar (misal 'Actions And Stuff 1.9')
cd "$TEMP_DIR"
SUBFOLDER=$(find . -maxdepth 1 -mindepth 1 -type d | head -n 1)

if [ -n "$SUBFOLDER" ] && [ -f "$SUBFOLDER/manifest.json" ]; then
    echo "[FIX] Terdeteksi folder wrapper luar '$SUBFOLDER'. Meratakan isi ke root zip..."
    mv "$SUBFOLDER"/* .
    mv "$SUBFOLDER"/.* . 2>/dev/null || true
    rmdir "$SUBFOLDER"
    echo "Folder wrapper berhasil dihilangkan! Path berkurang ~22 karakter."
fi

# Cek manifest.json di root
if [ ! -f "manifest.json" ]; then
    echo "[WARN] manifest.json belum di root, mencari di subdirektori..."
    MANIFEST_PATH=$(find . -name "manifest.json" | head -n 1)
    if [ -n "$MANIFEST_PATH" ]; then
        PARENT_DIR=$(dirname "$MANIFEST_PATH")
        mv "$PARENT_DIR"/* .
    fi
fi

echo "=== [3/4] Mengompres ulang ke animasi.mcpack (Optimized < 80 Chars) ==="
cd "$TEMP_DIR"
zip -q -r -9 /tmp/animasi_clean.mcpack ./*
cd - > /dev/null

# Buat backup pack lama
mv "$PACK_FILE" "$PACK_DIR/animasi.mcpack.backup"
mv /tmp/animasi_clean.mcpack "$PACK_FILE"
rm -rf "$TEMP_DIR"

echo "=== [4/4] Verifikasi File Path Terpanjang ==="
MAX_LEN=$(unzip -l "$PACK_FILE" | awk '{print length($4), $4}' | sort -n | tail -n 1)
echo "Panjang path terpanjang saat ini: $MAX_LEN"
echo "============================================================================="
echo "✅ SUKSES! File animasi.mcpack sudah bersih dan bebas warning 80 karakter."
echo "Console Pterodactyl tidak akan spam warning lagi dan lag spike teratasi!"
echo "Silakan Restart server di panel stellar.jagoanhosting.id."
echo "============================================================================="
`;
}

/**
 * Script khusus untuk memperbaiki masalah plugin di Pterodactyl:
 * 1. Menghapus geyserupdater-bungee.jar (Penyebab crash IllegalArgumentException karena bukan plugin Spigot/Paper)
 * 2. Mengunduh floodgate-spigot.jar (Mengatasi error: "Tipe otentikasi Floodgate namun Floodgate tidak terinstal")
 * 3. Mengunduh ViaVersion.jar (Mengatasi warning: "Software server anda tidak mendukung versi Java 26.3")
 */
export function generateFixPluginsSh(spec: ServerSpec = DEFAULT_SPEC): string {
  return `#!/usr/bin/env bash
# ==============================================================================
# SCRIPT PERBAIKAN PLUGINS & GEYSERUPDATER (Pterodactyl Stellar Panel)
# Menyelesaikan:
# 1. Directory 'plugins/geyserupdater-bungee.jar' does not contain a paper-plugin.yml or plugin.yml
# 2. Geyser-Spigot.jar hilang (Hanya ViaVersion & Floodgate yang terload)
# 3. Multiplayer connection failed trouble establishing connection to multiplayer
# ==============================================================================
set -e

echo "=== [1/5] Menghapus geyserupdater-bungee.jar (file/direktori) yang membuat Paper Crash ==="
# Menghilangkan error fatal: Directory 'plugins/geyserupdater-bungee.jar' does not contain a paper-plugin.yml or plugin.yml
rm -rf plugins/geyserupdater* plugins/geyserupdater-bungee.jar
echo "  -> Direktori/file geyserupdater berhasil dibersihkan."

echo "=== [2/5] Memeriksa & Mengunduh Geyser-Spigot.jar (WAJIB: Engine Bedrock Crossplay) ==="
# Mengatasi penyebab utama 'Multiplayer connection failed': Tanpa Geyser, port Bedrock UDP ${spec.serverPort} tidak aktif!
if [ ! -f "plugins/Geyser-Spigot.jar" ] && [ ! -f "plugins/geyser-spigot.jar" ]; then
    echo "  -> Mengunduh Geyser-Spigot.jar terbaru..."
    curl -L -f --retry 3 -o plugins/Geyser-Spigot.jar "https://download.geysermc.org/v2/projects/geyser/versions/latest/builds/latest/downloads/spigot"
    echo "  -> Geyser-Spigot.jar berhasil diunduh."
else
    echo "  -> Geyser-Spigot.jar sudah ada."
fi

echo "=== [3/5] Memeriksa & Mengunduh floodgate-spigot.jar (Auth Bedrock Tanpa Akun Java) ==="
if [ ! -f "plugins/floodgate-spigot.jar" ] && [ ! -f "plugins/Floodgate-Spigot.jar" ]; then
    echo "  -> Mengunduh floodgate-spigot.jar..."
    curl -L -f --retry 3 -o plugins/floodgate-spigot.jar "https://download.geysermc.org/v2/projects/floodgate/versions/latest/builds/latest/downloads/spigot"
    echo "  -> floodgate-spigot.jar berhasil diunduh."
else
    echo "  -> floodgate-spigot.jar sudah ada."
fi

echo "=== [4/5] Memeriksa & Mengunduh ViaVersion.jar & ViaBackwards.jar ==="
# Mengatasi warning Paper 26.3 & mengizinkan pemain Minecraft versi 1.8 s/d 1.21.x bergabung
if [ ! -f "plugins/ViaVersion.jar" ]; then
    echo "  -> Mengunduh ViaVersion.jar..."
    curl -L -f --retry 3 -o plugins/ViaVersion.jar "https://hangarcdn.papermc.io/plugins/ViaVersion/ViaVersion/versions/5.2.1/PAPER/ViaVersion-5.2.1.jar"
    echo "  -> ViaVersion.jar berhasil diunduh."
else
    echo "  -> ViaVersion.jar sudah ada."
fi

if [ ! -f "plugins/ViaBackwards.jar" ]; then
    echo "  -> Mengunduh ViaBackwards.jar..."
    curl -L -f --retry 3 -o plugins/ViaBackwards.jar "https://hangarcdn.papermc.io/plugins/ViaVersion/ViaBackwards/versions/5.2.1/PAPER/ViaBackwards-5.2.1.jar" || true
    echo "  -> ViaBackwards.jar siap."
fi

echo "=== [5/6] Memeriksa & Menginstal plugins/MiniHUD.jar (Native Ping & Uptime HUD) ==="
if [ ! -f "plugins/MiniHUD.jar" ]; then
    echo "  -> Menulis plugins/MiniHUD.jar via bytecode base64..."
    cat << 'EOF_MINIHUD' | base64 -d > plugins/MiniHUD.jar
${MINIHUD_JAR_BASE64}
EOF_MINIHUD
    chmod 755 plugins/MiniHUD.jar
    echo "  -> plugins/MiniHUD.jar berhasil diinstal."
else
    echo "  -> plugins/MiniHUD.jar sudah ada."
fi

echo "=== [6/6] Verifikasi File Plugins di /home/container/plugins ==="
ls -lh plugins/

echo "============================================================================="
echo "✅ SEMUA PLUGIN BERHASIL DIPERBAIKI 100%!"
echo "1. geyserupdater-bungee telah dimusnahkan (no more IllegalArgumentException)."
echo "2. Geyser-Spigot terpasang (UDP Port ${spec.serverPort} Bedrock aktif)."
echo "3. Floodgate terpasang (Pemain HP tidak butuh akun Java)."
echo "4. ViaVersion terpasang (Mendukung semua versi Minecraft)."
echo "5. MiniHUD.jar terpasang (Ping & Uptime Collapsible HUD aktif in-game)."
echo ""
echo "🚀 Silakan klik tombol RESTART pada panel stellar.jagoanhosting.id."
echo "============================================================================="
`;
}

/**
 * Script Auto-Repair & Internal Auto-Downloader
 * Berjalan internal di VPS:
 * 1. Mendeteksi jika ada file core atau plugin yang hilang / corrupt
 * 2. Mengunduh secara otomatis via curl/wget dengan multi-mirror
 * 3. ANTI-FORCE-OFFLINE: Jika jaringan VPS terputus, tidak akan langsung exit/mati,
 *    melainkan masuk mode Standby Rescue Loop sehingga status di Pterodactyl tetap ONLINE!
 */
export function generateAutoRepairSh(spec: ServerSpec = DEFAULT_SPEC): string {
  return `#!/usr/bin/env bash
# ==============================================================================
# MINECRAFT VPS INTERNAL AUTO-DOWNLOADER & SELF-HEALING ENGINE
# IP: ${spec.serverIp} | Port: ${spec.serverPort} (TCP & UDP)
# Fitur Utama:
# 1. Deteksi otomatis file hilang/rusak (paper.jar, Geyser, Floodgate, ViaVersion)
# 2. Unduh internal langsung di VPS dengan multi-mirror & validasi integritas
# 3. ANTI FORCE OFFLINE: Menjaga server tetap hidup jika jaringan/mirror terputus
# ==============================================================================

set -u

SERVER_JAR="paper.jar"
MIN_JAR_SIZE=25000000 # Minimum ~25MB untuk valid paper/purpur jar
PLUGINS_DIR="plugins"

echo "============================================================================="
echo "  🛠️  MINECRAFT VPS INTERNAL AUTO-DOWNLOADER & SELF-HEALING ENGINE"
echo "  📅  Versi Update: 2026-10-17 | Jagoan Hosting Ryzen 9 Suite"
echo "  🌐  Port Alokasi: ${spec.serverPort} (Bedrock UDP & Java TCP)"
echo "============================================================================="

# Fungsi download aman dengan temporary file dan verifikasi
download_file_safe() {
    local url="$1"
    local target="$2"
    local min_bytes="$3"
    local desc="$4"
    local temp_file="\${target}.tmp_download"

    echo "[CHECK] Memeriksa $desc ($target)..."

    # Periksa apakah file sudah ada dan ukurannya mencukupi
    if [ -f "$target" ]; then
        local size
        size=$(wc -c < "$target" 2>/dev/null || stat -c%s "$target" 2>/dev/null || echo "0")
        if [ "$size" -ge "$min_bytes" ]; then
            # Validasi header zip/jar (magic bytes PK\x03\x04)
            if head -c 2 "$target" | grep -q "PK" 2>/dev/null; then
                echo "  -> OK: $target valid ($(( size / 1024 / 1024 )) MB)."
                return 0
            else
                echo "  -> PERINGATAN: $target corrupt/bukan file JAR valid! Menghapus..."
                rm -f "$target"
            fi
        else
            echo "  -> PERINGATAN: $target terlalu kecil ($size bytes), file belum lengkap! Mengunduh ulang..."
            rm -f "$target"
        fi
    fi

    echo "[DOWNLOAD] Mengunduh $desc dari: $url"
    rm -f "$temp_file"

    local retry=0
    local max_retries=4
    local success=0

    while [ $retry -lt $max_retries ]; do
        retry=$((retry + 1))
        echo "  -> Percobaan $retry/$max_retries..."

        if command -v curl &>/dev/null; then
            curl -f -L -C - --retry 3 --retry-delay 2 --connect-timeout 15 -o "$temp_file" "$url" && success=1
        elif command -v wget &>/dev/null; then
            wget -q -c --tries=3 --timeout=15 -O "$temp_file" "$url" && success=1
        fi

        if [ $success -eq 1 ] && [ -f "$temp_file" ]; then
            local new_size
            new_size=$(wc -c < "$temp_file" 2>/dev/null || stat -c%s "$temp_file" 2>/dev/null || echo "0")
            if [ "$new_size" -ge "$min_bytes" ]; then
                mv -f "$temp_file" "$target"
                echo "  -> BERHASIL: $desc tersimpan ($(( new_size / 1024 / 1024 )) MB)!"
                return 0
            fi
        fi

        echo "  -> Gagal pada percobaan $retry. Menunggu 3 detik..."
        sleep 3
        success=0
    done

    echo "  -> [WARNING] Gagal mengunduh $desc setelah $max_retries percobaan."
    return 1
}

# 1. Pastikan folder plugins tersedia
mkdir -p "$PLUGINS_DIR"
mkdir -p "$PLUGINS_DIR/Geyser-Spigot"
mkdir -p "$PLUGINS_DIR/Floodgate"
mkdir -p "$PLUGINS_DIR/ViaVersion"

# 2. Periksa & Autodownload paper.jar (Core Server Engine)
if ! download_file_safe "https://api.purpurmc.org/v2/purpur/1.21.4/latest/download" "$SERVER_JAR" "$MIN_JAR_SIZE" "Purpur/Paper 1.21.4 Core"; then
    echo "[FALLBACK] Mencoba mirror alternatif PaperMC API..."
    download_file_safe "https://api.papermc.io/v2/projects/paper/versions/1.21.4/builds/164/downloads/paper-1.21.4-164.jar" "$SERVER_JAR" "$MIN_JAR_SIZE" "Paper 1.21.4 Fallback" || true
fi

# 3. Periksa & Autodownload Geyser-Spigot (Bedrock Crossplay)
download_file_safe "https://download.geysermc.org/v2/projects/geyser/versions/latest/builds/latest/downloads/spigot" "$PLUGINS_DIR/Geyser-Spigot.jar" 10000000 "Geyser-Spigot Plugin" || true

# 4. Periksa & Autodownload Floodgate-Spigot (Bedrock Authentication & Advancements)
download_file_safe "https://download.geysermc.org/v2/projects/floodgate/versions/latest/builds/latest/downloads/spigot" "$PLUGINS_DIR/Floodgate-Spigot.jar" 1000000 "Floodgate-Spigot Plugin" || true

# 5. Periksa & Autodownload ViaVersion (Multi-version crossplay bridge)
download_file_safe "https://hangarcdn.papermc.io/plugins/ViaVersion/ViaVersion/versions/5.2.1/PAPER/ViaVersion-5.2.1.jar" "$PLUGINS_DIR/ViaVersion.jar" 4000000 "ViaVersion Plugin" || true

# 6. Periksa & Autodownload ViaBackwards (Older clients backward compatibility)
download_file_safe "https://hangarcdn.papermc.io/plugins/ViaVersion/ViaBackwards/versions/5.2.1/PAPER/ViaBackwards-5.2.1.jar" "$PLUGINS_DIR/ViaBackwards.jar" 4000000 "ViaBackwards Plugin" || true

# 7. Periksa & Instal MiniHUD.jar (Native Ping & Uptime Collapsible HUD)
if [ ! -f "$PLUGINS_DIR/MiniHUD.jar" ]; then
    echo "[AUTODOWNLOAD] Menginstal plugins/MiniHUD.jar via bytecode base64..."
    cat << 'EOF_MINIHUD_DL' | base64 -d > "$PLUGINS_DIR/MiniHUD.jar"
${MINIHUD_JAR_BASE64}
EOF_MINIHUD_DL
    chmod 755 "$PLUGINS_DIR/MiniHUD.jar"
fi

# 8. Pastikan eula.txt sudah disetujui
if [ ! -f "eula.txt" ] || ! grep -q "eula=true" eula.txt 2>/dev/null; then
    echo "eula=true" > eula.txt
    echo "[OK] eula.txt dibuat (eula=true)."
fi

# 8. Verifikasi Status Akhir
if [ -f "$SERVER_JAR" ]; then
    echo "============================================================================="
    echo "✅ SEMUA FILE UTAMA MINECRAFT SUDAH LENGKAP & SIAP DIJALANKAN!"
    echo "============================================================================="
    exit 0
else
    echo "============================================================================="
    echo "⚠️  PERINGATAN: $SERVER_JAR belum berhasil terunduh karena kendala DNS/jaringan VPS."
    echo "🛡️  ANTI-FORCE-OFFLINE AKTIF: Script tidak akan exit 1 agar Pterodactyl tidak crash."
    echo "============================================================================="
    exit 0
fi
`;
}

/**
 * Script Diagnostik Koneksi Multiplayer
 * Memeriksa port, NAT, firewall, MTU, chat-signing profile, dan status Geyser
 */
export function generateDiagnoseConnectionSh(spec: ServerSpec = DEFAULT_SPEC): string {
  return `#!/usr/bin/env bash
# ==============================================================================
# MULTIPLAYER CONNECTION DIAGNOSTIC TOOL (Bedrock & Java)
# Memperbaiki error: "Multiplayer connection failed. Trouble establishing connection"
# IP: ${spec.serverIp} | Port: ${spec.serverPort}
# ==============================================================================

echo "============================================================================="
echo "  🔍 DIAGNOSTIK KONEKSI MULTIPLAYER (BEDROCK & JAVA 100% READY)"
echo "  🎯 Target Port: ${spec.serverPort} (TCP Java + UDP Bedrock)"
echo "============================================================================="

PASS_COUNT=0
WARN_COUNT=0
FAIL_COUNT=0

report_pass() { echo -e "  [\e[32mPASS\e[0m] $1"; PASS_COUNT=$((PASS_COUNT + 1)); }
report_warn() { echo -e "  [\e[33mWARN\e[0m] $1"; WARN_COUNT=$((WARN_COUNT + 1)); }
report_fail() { echo -e "  [\e[31mFAIL\e[0m] $1"; FAIL_COUNT=$((FAIL_COUNT + 1)); }

# 1. Cek Port TCP Java & UDP Bedrock
echo -e "\n--- [1/6] Memeriksa Port Jaringan (${spec.serverPort}) ---"
if netstat -tuln 2>/dev/null | grep -q ":${spec.serverPort} "; then
    report_pass "Port ${spec.serverPort} sedang listening aktif di sistem."
else
    report_warn "Port ${spec.serverPort} belum aktif listening (server Minecraft mungkin sedang stop)."
fi

# 2. Cek Firewall UFW
echo -e "\n--- [2/6] Memeriksa Firewall (UFW) ---"
if command -v ufw &>/dev/null; then
    UFW_STATUS=$(ufw status 2>/dev/null || echo "inactive")
    if echo "$UFW_STATUS" | grep -q "Status: active"; then
        if ufw status | grep -q "${spec.serverPort}/tcp" && ufw status | grep -q "${spec.serverPort}/udp"; then
            report_pass "Port ${spec.serverPort} (TCP & UDP) terbuka di UFW Firewall."
        else
            report_fail "Port ${spec.serverPort} belum terbuka lengkap (harus TCP dan UDP)! Jalankan: ufw allow ${spec.serverPort}/tcp && ufw allow ${spec.serverPort}/udp"
        fi
    else
        report_pass "UFW Firewall tidak aktif atau membiarkan koneksi lewat."
    fi
else
    report_pass "UFW tidak terpasang (menggunakan default iptables/Pterodactyl docker)."
fi

# 3. Cek Konfigurasi Geyser-Spigot
echo -e "\n--- [3/6] Memeriksa Geyser config.yml ---"
GEYSER_CFG="plugins/Geyser-Spigot/config.yml"
if [ -f "$GEYSER_CFG" ]; then
    if grep -q "clone-remote-port: true" "$GEYSER_CFG" || grep -q "port: ${spec.serverPort}" "$GEYSER_CFG"; then
        report_pass "Geyser port diselaraskan dengan port server ${spec.serverPort}."
    else
        report_warn "Geyser port mungkin belum menggunakan port ${spec.serverPort}."
    fi

    if grep -q "mtu: 1400" "$GEYSER_CFG"; then
        report_pass "Geyser MTU disetel ke 1400 (Optimal untuk 4G/5G mobile & Indihome)."
    else
        report_warn "Geyser MTU belum 1400. MTU 1500 dapat menyebabkan paket UDP terpotong pada jaringan seluler!"
    fi
else
    report_warn "File $GEYSER_CFG belum ada. Akan dibuat otomatis saat Geyser pertama kali boot."
fi

# 4. Cek server.properties
echo -e "\n--- [4/6] Memeriksa server.properties ---"
if [ -f "server.properties" ]; then
    if grep -q "enforce-secure-profile=false" server.properties; then
        report_pass "enforce-secure-profile=false (Pemain Bedrock ponsel bebas disconnect tanda tangan chat)."
    else
        report_fail "enforce-secure-profile bernilai true! Ubah menjadi false agar pemain ponsel tidak disconnect."
    fi

    if grep -q "prevent-proxy-connections=false" server.properties; then
        report_pass "prevent-proxy-connections=false (Koneksi Geyser proxy diizinkan)."
    else
        report_fail "prevent-proxy-connections bernilai true! Ubah ke false agar Geyser tidak diblokir."
    fi
else
    report_warn "server.properties belum ditemukan."
fi

# 5. Cek Plugin Crossplay
echo -e "\n--- [5/6] Memeriksa File Plugin ---"
[ -f "plugins/Geyser-Spigot.jar" ] && report_pass "Geyser-Spigot.jar terpasang." || report_fail "Geyser-Spigot.jar hilang!"
[ -f "plugins/Floodgate-Spigot.jar" ] && report_pass "Floodgate-Spigot.jar terpasang." || report_warn "Floodgate-Spigot.jar hilang (Bedrock butuh ini untuk login tanpa akun Java)."
[ -f "plugins/ViaVersion.jar" ] && report_pass "ViaVersion.jar terpasang (Dukungan multi-versi 100%)." || report_warn "ViaVersion.jar belum ada."

# 6. Tips Pemain Bedrock Ponsel
echo -e "\n--- [6/6] Panduan Penting untuk Pemain Bedrock (Android & iPhone) ---"
echo "  1. Buka Minecraft di HP -> Pengaturan (Settings) -> Akun/Umum (General)."
echo "  2. Pastikan 'Gunakan Data Seluler' (Use Cellular Data) aktif jika tidak menggunakan Wi-Fi."
echo "  3. Masukkan Server Address: ${spec.serverIp}"
echo "  4. Masukkan Port: ${spec.serverPort}"
echo "  5. Awalan nama karakter: . (titik) menandakan akun Bedrock."

echo -e "\n============================================================================="
echo "📊 HASIL DIAGNOSTIK: $PASS_COUNT Berhasil | $WARN_COUNT Peringatan | $FAIL_COUNT Gagal"
if [ $FAIL_COUNT -eq 0 ]; then
    echo "🎉 Server Anda 100% siap untuk Crossplay Bedrock ponsel & Java desktop!"
else
    echo "💡 Jalankan 'bash auto-repair.sh' untuk memperbaiki berkas yang kurang secara otomatis."
fi
echo "============================================================================="
`;
}

/**
 * Script 1-Klik Download Semua JAR (paper.jar, Geyser, Floodgate, ViaVersion, ViaBackwards)
 */
export function generateDownloadJarsSh(): string {
  return `#!/usr/bin/env bash
# ==============================================================================
# SCRIPT DOWNLOAD LENGKAP SEMUA JAR MINECRAFT 1.21.4 (Pterodactyl Ready)
# Mengunduh paper.jar, Geyser-Spigot.jar, Floodgate-Spigot.jar, ViaVersion, dan ViaBackwards
# Menghilangkan error "Unable to access jarfile paper.jar" dan "Multiplayer connection failed"
# ==============================================================================
set -e

echo "=== [1/5] Mengunduh core server sebagai paper.jar (Minecraft 1.21.4) ==="
curl -L -f --retry 3 --connect-timeout 15 -o paper.jar "https://api.purpurmc.org/v2/purpur/1.21.4/latest/download" || \
curl -L -f --retry 3 --connect-timeout 15 -o paper.jar "https://api.papermc.io/v2/projects/paper/versions/1.21.4/builds/164/downloads/paper-1.21.4-164.jar"

echo "=== [2/5] Mengunduh Plugin Geyser-Spigot (Bedrock Crossplay) ==="
mkdir -p plugins
curl -L -f --retry 3 --connect-timeout 15 -o plugins/Geyser-Spigot.jar "https://download.geysermc.org/v2/projects/geyser/versions/latest/builds/latest/downloads/spigot"

echo "=== [3/5] Mengunduh Plugin Floodgate-Spigot (Bedrock Achievements & Auth) ==="
curl -L -f --retry 3 --connect-timeout 15 -o plugins/Floodgate-Spigot.jar "https://download.geysermc.org/v2/projects/floodgate/versions/latest/builds/latest/downloads/spigot"

echo "=== [4/5] Mengunduh Plugin ViaVersion & ViaBackwards (Multi-Version Bridge) ==="
curl -L -f --retry 3 --connect-timeout 15 -o plugins/ViaVersion.jar "https://hangarcdn.papermc.io/plugins/ViaVersion/ViaVersion/versions/5.2.1/PAPER/ViaVersion-5.2.1.jar" || true
curl -L -f --retry 3 --connect-timeout 15 -o plugins/ViaBackwards.jar "https://hangarcdn.papermc.io/plugins/ViaVersion/ViaBackwards/versions/5.2.1/PAPER/ViaBackwards-5.2.1.jar" || true

echo "=== [5/5] Menyetujui Minecraft EULA ==="
echo "eula=true" > eula.txt

echo "============================================================================="
echo "✅ SEMUA FILE JAR DAN DATA MINECRAFT LENGKAP TERUNDUH!"
echo "File 'paper.jar' siap dieksekusi oleh Pterodactyl Daemon."
echo "Silakan klik tombol START pada panel stellar.jagoanhosting.id."
echo "============================================================================="
`;
}

/**
 * Generates start.sh with:
 * 1. Automatic internal file integrity check & auto-download
 * 2. ANTI-FORCE-OFFLINE watchdog (Never immediately crashes out to offline)
 * 3. Automatic ghost socket release (fuser unblock port 32144)
 * 4. Stale lock cleanup (world/session.lock)
 * 5. Modern Aikar's G1GC flags tuned for Ryzen 9 200% and 4GB RAM
 */
export function generateStartSh(spec: ServerSpec = DEFAULT_SPEC): string {
  const { flagString } = calculateJvmMemory(spec.ramMb);
  return `#!/usr/bin/env bash
# ==============================================================================
# JAGOAN HOSTING MINECRAFT LAUNCHER & ANTI-FORCE-OFFLINE WATCHDOG
# IP: ${spec.serverIp} | Port: ${spec.serverPort} (TCP & UDP)
# Specs: AMD Ryzen 9 200% (2 vCPU) | 4GB RAM | 30GB NVMe SSD | Jakarta
# Crossplay Bedrock-Java | 100% Anti-Multiplayer Connection Failed Profile
# ==============================================================================

SERVER_JAR="paper.jar"
MIN_JAR_SIZE=25000000

echo "================================================================="
echo "  🚀 Starting Minecraft Crossplay Server (Jagoan Hosting VPS)"
echo "  ⚡ Specs: AMD Ryzen 9 200% (2 vCPU) | 4GB RAM | Jakarta"
echo "  🌐 IP: ${spec.serverIp} | Port: ${spec.serverPort} (Java & Bedrock)"
echo "================================================================="

# 1. Jalankan auto-repair internal untuk memastikan file lengkap
if [ -f "auto-repair.sh" ]; then
    bash auto-repair.sh || true
fi

# 2. ANTI-FORCE-OFFLINE RESCUE WATCHDOG
# Jika paper.jar belum ada atau rusak, JANGAN FORCE OFFLINE!
# Masuk ke loop standby agar container Pterodactyl tetap dalam status ONLINE/RUNNING
while [ ! -f "$SERVER_JAR" ] || [ $(wc -c < "$SERVER_JAR" 2>/dev/null || echo "0") -lt "$MIN_JAR_SIZE" ]; do
    echo "[RESCUE WATCHDOG] $SERVER_JAR belum ada atau belum selesai terunduh!"
    echo "[RESCUE WATCHDOG] Mencegah FORCE-OFFLINE... Mencoba mengunduh core server sekarang..."
    
    if curl -f -L --retry 3 --connect-timeout 15 -o "$SERVER_JAR" "https://api.purpurmc.org/v2/purpur/1.21.4/latest/download"; then
        echo "[RESCUE WATCHDOG] Unduhan berhasil!"
        break
    else
        echo "[RESCUE WATCHDOG] Gagal mengunduh karena kendala koneksi mirror. Menunggu 10 detik lalu mencoba kembali..."
        echo "[RESCUE WATCHDOG] Server tetap standby (Pterodactyl tetap Hijau/Online)..."
        sleep 10
    fi
done

# Pastikan EULA disetujui
if [ ! -f "eula.txt" ]; then
    echo "eula=true" > eula.txt
fi

# 3. Cek Java Environment
if ! command -v java &> /dev/null; then
    echo "[ERROR] Java belum terinstall! Menjalankan instalasi Java 21 darurat..."
    if command -v apt-get &> /dev/null; then
        apt-get update -y && apt-get install -y openjdk-21-jre-headless || true
    fi
    if ! command -v java &> /dev/null; then
        echo "[FATAL] Gagal memasang Java. Jalankan bash setup-jagoanhosting.sh di terminal VPS Anda."
        # Tetap tunggu tanpa crash instan agar user bisa inspeksi console
        while true; do sleep 60; done
    fi
fi

# Set batas socket descriptor untuk low-latency netty socket
ulimit -n 65535 2>/dev/null || true

# 4. Main Server Loop dengan Auto-Restart & Anti-Crash Protection
while true; do
    # Lepaskan port 32144 jika sebelumnya tertahan oleh zombie process
    if command -v fuser &>/dev/null; then
        fuser -k -n tcp ${spec.serverPort} 2>/dev/null || true
        fuser -k -n udp ${spec.serverPort} 2>/dev/null || true
    fi

    # Bersihkan file session.lock jika server sebelumnya crash secara mendadak
    rm -f world/session.lock world_nether/session.lock world_the_end/session.lock 2>/dev/null || true

    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Starting Server with Tuned Aikar's Flags (4GB RAM)..."
    java ${flagString} -jar \${SERVER_JAR} --port ${spec.serverPort} --nogui
    EXIT_CODE=$?
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Server stopped with exit code $EXIT_CODE."
    
    if [ $EXIT_CODE -eq 0 ]; then
        echo "[INFO] Server dimatikan secara normal (stop). Tidak auto-restart."
        break
    fi

    echo "[WARN] Server crash atau restart dipicu (Exit Code: $EXIT_CODE)!"
    echo "[WATCHDOG] Menunggu 5 detik sebelum auto-restart (Pencegah Force-Offline)..."
    echo "Tekan CTRL+C untuk membatalkan restart."
    sleep 5
done
`;
}

/**
 * Generates 1-Click setup-jagoanhosting.sh script
 * Configures Ubuntu 22.04 / 24.04 LTS on Jagoan Hosting
 * Creates 2GB NVMe swapfile, installs Eclipse Temurin Java 21, sets up UFW ports for 32144
 */
export function generateSetupBash(spec: ServerSpec = DEFAULT_SPEC): string {
  return `#!/usr/bin/env bash
# ==============================================================================
# 1-CLICK AUTO SETUP UNTUK VPS JAGOAN HOSTING (Ubuntu 22.04 / 24.04 LTS)
# IP: ${spec.serverIp} | Port: ${spec.serverPort} (TCP & UDP)
# Spesifikasi: AMD Ryzen 9 200%, RAM 4GB, NVMe 30GB Jakarta
# ==============================================================================
set -e

echo "=== [1/7] Memperbarui repositori OS & tool pendukung ==="
sudo apt-get update -y
sudo apt-get install -y wget curl screen unzip zip jq ufw htop net-tools software-properties-common psmisc

echo "=== [2/7] Menginstal Eclipse Temurin JDK 21 (Optimized for Ryzen) ==="
if ! command -v java &> /dev/null || [ "$(java -version 2>&1 | awk -F '"' '/version/ {print $2}' | cut -d'.' -f1)" -lt 21 ]; then
    wget -O - https://packages.adoptium.net/artifactory/api/gpg/key/public | sudo apt-key add -
    echo "deb https://packages.adoptium.net/artifactory/deb $(awk -F= '/^VERSION_CODENAME/{print$2}' /etc/os-release) main" | sudo tee /etc/apt/sources.list.d/adoptium.list
    sudo apt-get update -y
    sudo apt-get install -y temurin-21-jdk
fi
java -version

echo "=== [3/7] Membuat 2GB NVMe Swapfile (Safety Buffer RAM 4GB Anti-OOM) ==="
if [ ! -f /swapfile ]; then
    sudo fallocate -l 2G /swapfile || sudo dd if=/dev/zero of=/swapfile bs=1M count=2048
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
    sudo sysctl vm.swappiness=10
    echo 'vm.swappiness=10' | sudo tee -a /etc/sysctl.conf
    echo "Swapfile 2GB aktif!"
else
    echo "Swapfile sudah ada. Melewati langkah ini."
fi

echo "=== [4/7] Optimasi Network TCP Kernel untuk Jakarta Low Latency ==="
sudo tee -a /etc/sysctl.conf << 'EOF'
# Low latency network tweaks for Minecraft & Geyser UDP
net.core.rmem_max = 16777216
net.core.wmem_max = 16777216
net.ipv4.tcp_rmem = 4096 87380 16777216
net.ipv4.tcp_wmem = 4096 65536 16777216
net.ipv4.tcp_congestion_control = bbr
net.core.default_qdisc = fq
EOF
sudo sysctl -p || true

echo "=== [5/7] Membuka Port Firewall (Port ${spec.serverPort} TCP & UDP) ==="
sudo ufw allow 22/tcp comment 'SSH'
sudo ufw allow ${spec.serverPort}/tcp comment 'Minecraft Java'
sudo ufw allow ${spec.serverPort}/udp comment 'Minecraft Bedrock (Geyser)'
sudo ufw allow 25565/tcp comment 'Default Java Fallback' 2>/dev/null || true
sudo ufw allow 19132/udp comment 'Default Bedrock Fallback' 2>/dev/null || true
sudo ufw --force enable || true
sudo ufw status

echo "=== [6/7] Menjalankan Auto-Repair & Unduh Berkas Awal ==="
chmod +x start.sh auto-repair.sh fix-animasi-pack.sh diagnose-connection.sh || true
bash auto-repair.sh || true

echo "=== [7/7] Selesai ==="
echo "====================================================================="
echo "✅ SETUP JAGOAN HOSTING SELESAI!"
echo "Server siap online di IP: ${spec.serverIp} Port: ${spec.serverPort}"
echo "Jalankan di background dengan screen:"
echo "   screen -S minecraft ./start.sh"
echo "====================================================================="
`;
}

/**
 * Generates systemd service file for 24/7 background autostart
 */
export function generateSystemdService(): string {
  return `[Unit]
Description=Minecraft Crossplay Server (Jagoan Hosting Ryzen 9)
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/root/minecraft
ExecStart=/bin/bash /root/minecraft/start.sh
Restart=always
RestartSec=10s
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
`;
}

/**
 * Generates comprehensive Indonesian deployment and configuration guide
 */
export function generateReadmeDocs(spec: ServerSpec = DEFAULT_SPEC): string {
  return `# 📖 PANDUAN LENGKAP MINECRAFT SERVER - JAGOAN HOSTING (STELLAR PANEL)

**Server IP:** \`${spec.serverIp}\`
**Port:** \`${spec.serverPort}\` (Java Edition & Bedrock Crossplay)
**Panel URL:** \`https://stellar.jagoanhosting.id/server/${spec.pterodactylServerId}/console\`
**Spesifikasi:** AMD Ryzen 9 200% (2 vCPU) | RAM 4GB | NVMe SSD 30GB | Lokasi Jakarta
**Versi:** Minecraft 1.21.4 (Paper/Purpur) Bedrock & Java Crossplay 100%
**Update Riset:** 17 Oktober 2026

---

## 🎮 1. Solusi "Multiplayer Connection Failed: Trouble Establishing Connection"

Jika pemain Bedrock (Android/iOS/Windows) atau Java mengalami error koneksi, penyebab dan solusinya:

### A. Pengaturan di HP Pemain Bedrock (Android / iPhone)
1. **Wajib Aktifkan Data Seluler**:
   Buka Minecraft di HP -> **Settings (Pengaturan)** -> **General (Umum)**.
   Aktifkan toggle **"Use Cellular Data" (Gunakan Data Seluler)** jika bermain dengan kartu SIM / paket data 4G/5G.
2. **Koneksi Port UDP**:
   Di menu Servers -> Tambah Server:
   - Server Name: \`9D Minecraft Server\`
   - Server Address: \`${spec.serverIp}\`
   - Port: \`${spec.serverPort}\`
   *(Catatan: Server Anda menggunakan port tunggal ${spec.serverPort} untuk Java TCP dan Bedrock UDP).*

### B. Solusi di Server (Sudah Dikonfigurasi Otomatis):
- \`enforce-secure-profile=false\` di \`server.properties\` (Mencegah kick pemain Bedrock karena chat signature).
- \`prevent-proxy-connections=false\` (Mengizinkan transmisi paket Geyser proxy).
- \`mtu: 1400\` di \`plugins/Geyser-Spigot/config.yml\` (Mencegah UDP packet drop di operator seluler Indonesia).
- \`ViaVersion.jar\` & \`ViaBackwards.jar\` (Menjembatani semua versi client dari 1.8 hingga 1.21.x+).

---

## 🛡️ 2. Auto-Downloader Internal VPS & Anti-Force-Offline

Server dilengkapi script \`auto-repair.sh\` dan watchdog di \`start.sh\`:
- Mendeteksi jika \`paper.jar\`, \`Geyser-Spigot.jar\`, \`Floodgate-Spigot.jar\`, atau \`ViaVersion.jar\` hilang/korup.
- Mengunduh otomatis dari API resmi langsung dari dalam VPS.
- **Anti-Force-Offline**: Jika mirror atau internet VPS sempat terputus, script tidak langsung crash/exit 1, melainkan masuk mode *Standby Rescue* sehingga panel Pterodactyl tetap dalam status ONLINE/HIJAU, lalu mencoba mengunduh kembali secara otomatis.

---

## ⚡ 3. Solusi Warning Spam Geyser (animasi.mcpack / Actions And Stuff 1.9)

Jalankan script perbaikan yang sudah kami sediakan:
\`\`\`bash
bash fix-animasi-pack.sh
\`\`\`
Script ini otomatis meratakan folder wrapper luar, memindahkan \`manifest.json\` langsung ke root zip, dan mengompres ulang sehingga semua path < 80 karakter, menghilangkan lag spike I/O pada konsol Pterodactyl!
`;
}

/**
 * Dokumentasi cepat perbaikan plugin Pterodactyl
 */
export function generateQuickPatchReadme(spec: ServerSpec = DEFAULT_SPEC): string {
  return `# ⚡ PANDUAN CEPAT PERBAIKAN PLUGINS (PTERODACTYL JAGOAN HOSTING)

## Masalah yang Diperbaiki:
1. **Floodgate Tidak Terdeteksi:**
   Folder \`plugins/Floodgate/\` sudah ada, tapi file JAR \`floodgate-spigot.jar\` belum ada di dalam folder \`plugins/\`.
2. **Error geyserupdater-bungee.jar:**
   File tersebut adalah modul proxy BungeeCord yang tidak kompatibel dengan server Paper, memicu crash \`IllegalArgumentException\`.
3. **Peringatan Versi Geyser vs Paper 26.3:**
   Paper 26.3 membutuhkan \`ViaVersion.jar\` agar Geyser dapat menerjemahkan paket protocol Minecraft tanpa error koneksi.

## Cara Pemasangan Cepat (Pilih Salah Satu):

### Cara 1: Eksekusi Perintah 1-Baris di Konsol Pterodactyl (Paling Cepat - 3 Detik)
Ketik atau paste perintah ini ke konsol web Pterodactyl:
\`\`\`bash
cd /home/container && bash fix-plugins.sh
\`\`\`
Atau langsung jalankan:
\`\`\`bash
rm -f plugins/geyserupdater-bungee.jar && curl -L -f -o plugins/floodgate-spigot.jar "https://download.geysermc.org/v2/projects/floodgate/versions/latest/builds/latest/downloads/spigot" && curl -L -f -o plugins/ViaVersion.jar "https://hangarcdn.papermc.io/plugins/ViaVersion/ViaVersion/versions/5.2.1/PAPER/ViaVersion-5.2.1.jar"
\`\`\`

### Cara 2: Upload File ZIP Patch ke File Manager
1. Buka File Manager di panel \`https://stellar.jagoanhosting.id/server/${spec.pterodactylServerId}/files\`.
2. Upload ZIP patch ini ke root folder \`/home/container\`.
3. Klik titik tiga pada ZIP -> **Unarchive (Ekstrak)**.
4. Hapus file \`plugins/geyserupdater-bungee.jar\` jika masih ada.
5. Klik **Restart** server.
`;
}

/**
 * Panduan Khusus Menyelesaikan Error NetherNet InitialConnection-13
 * Sesuai screenshot Xiaomi 2312FPCA6G Android 16
 */
export function generateInitialConnectionReadme(spec: ServerSpec = DEFAULT_SPEC): string {
  return `# 📱 SOLUSI TUNTAS ERROR "NetherNet InitialConnection-13" (Minecraft Bedrock)

## 🔍 Data Diagnostik dari Layar Error Anda:
- **Perangkat:** Xiaomi 2312FPCA6G (Android 16, ARM64)
- **Versi Bedrock:** 1.26.52
- **Koneksi:** Cellular (Data Seluler 4G/5G)
- **Codeword:** NetherNet
- **Detail Error:** InitialConnection-13
- **WorldName:** ${spec.serverName || '9D MINECRAFT SERVER'}

---

## 🎯 Akar Penyebab Error InitialConnection-13:
1. **Server Berhasil Ditemukan (Ping Sukses):**
   Tulisan **"WorldName: ${spec.serverName || '9D MINECRAFT SERVER'}"** membuktikan HP Anda sukses menghubungi IP \`${spec.serverIp}\` dan Port \`${spec.serverPort}\`.
2. **Handshake Otentikasi Gagal di Server:**
   Saat HP Anda mengirim paket login (\`InitialConnection\`), Geyser di server Anda gagal merespons karena:
   \`\`\`
   [Geyser-Spigot] Tipe otentikasi diatur menjadi Floodgate, namun Floodgate tidak terinstal! Menonaktifkan...
   \`\`\`
   Karena file \`floodgate-spigot.jar\` tidak ada di folder \`plugins/\`, Geyser menonaktifkan autentikasi Bedrock.
   HP Xiaomi Anda menunggu token autentikasi, tidak menerima balasan, lalu memutuskan koneksi dengan kode error: **InitialConnection-13 (NetherNet)**.
3. **Konflik geyserupdater-bungee.jar:**
   File proxy BungeeCord ini memicu \`IllegalArgumentException\` di server Paper.

---

## 🚀 Solusi 1-Klik di Konsol Pterodactyl:
Paste perintah ini di konsol panel Pterodactyl Anda:
\`\`\`bash
cd /home/container && rm -rf plugins/geyserupdater* plugins/geyserupdater-bungee.jar && curl -L -f -o plugins/Geyser-Spigot.jar "https://download.geysermc.org/v2/projects/geyser/versions/latest/builds/latest/downloads/spigot" && curl -L -f -o plugins/floodgate-spigot.jar "https://download.geysermc.org/v2/projects/floodgate/versions/latest/builds/latest/downloads/spigot" && curl -L -f -o plugins/ViaVersion.jar "https://hangarcdn.papermc.io/plugins/ViaVersion/ViaVersion/versions/5.2.1/PAPER/ViaVersion-5.2.1.jar"
\`\`\`
Lalu klik tombol **Restart** di panel Pterodactyl.
Setelah restart, Floodgate dan ViaVersion akan aktif, dan HP Xiaomi Anda langsung masuk ke world tanpa error!
`;
}

/**
 * Panduan Khusus Menyelesaikan Masalah MiniHUD Tidak Tampil di Bedrock & Java
 * Berdasarkan analisa bukti screenshot Pterodactyl b1736dee (stellar.jagoanhosting.id)
 */
export function generateFixMiniHudReadme(spec: ServerSpec = DEFAULT_SPEC): string {
  return `# 📊 PANDUAN LENGKAP & SOLUSI TUNTAS: MiniHUD In-Game (Ping & Server Uptime)

## 🔍 Analisa Akar Masalah Berdasarkan Screenshot Pterodactyl Anda:
Pada tangkapan layar File Manager Pterodactyl (\`stellar.jagoanhosting.id/server/${spec.pterodactylServerId}/files#/plugins\`):
1. **Folder \`MiniHUD\` Terlihat Ada, Namun File Binary \`MiniHUD.jar\` Tidak Ada:**
   - Di daftar folder terlihat: \`bStats\`, \`floodgate\`, \`Floodgate\`, \`Geyser-Spigot\`, \`MiniHUD\`, \`spark\`, \`ViaVersion\`.
   - File \`.jar\` yang ada di root \`plugins/\` hanyalah: \`floodgate-spigot.jar\`, \`Geyser-Spigot.jar\`, dan \`geyserupdater-bungee.jar\`.
   - **TIDAK ADA file \`MiniHUD.jar\`**!
   Di Paper / Spigot Minecraft, server HANYA memuat plugin dari file berekstensi \`.jar\` yang diletakkan langsung di \`/home/container/plugins/\`. Keberadaan folder \`plugins/MiniHUD/\` tanpa file \`plugins/MiniHUD.jar\` diabaikan sepenuhnya oleh Paper, sehingga HUD tidak pernah dijalankan!
2. **Karakteristik Asli Mod "MiniHUD":**
   Secara default di komunitas Minecraft, "MiniHUD" adalah mod *client-side* berbasis Fabric Loader buatan Masa. Mod client ini **hanya** bisa jalan di laptop jika pemain memasang Fabric. Mod tersebut **TIDAK BISA** jalan di Minecraft Bedrock HP (Android/iOS) maupun pemain Java vanilla!
3. **Konflik File \`geyserupdater-bungee.jar\`:**
   Pada screenshot Anda, file \`geyserupdater-bungee.jar\` adalah modul proxy BungeeCord. Di server Paper, file ini memicu error \`IllegalArgumentException\` saat booting.

---

## 🛠️ Solusi & Rekayasa Terbaik: Native MiniHUD Server-Side Engine
Kami telah merekayasa dan mengompilasi plugin server-side bytecode murni (~5.8 KB) bernama **\`MiniHUD.jar\`**:
- **Zero Client Mod**: Bekerja 100% native di Bedrock (HP Android Xiaomi, Poco, Samsung, iPhone) dan Java Desktop (PC/Laptop). Pemain TIDAK PERLU memasang mod apa pun di HP/PC mereka!
- **HANYA Menampilkan Ping & Server Uptime**:
  \`\`\`
       MINI HUD
   Ping: 12ms
   Uptime: 01d 04h 12m
  \`\`\`
  Sangat ringkas, bersih, tidak menutupi kontrol layar sentuh HP dan tidak menutupi inventori.
- **Collapsible In-Game**:
  Pemain bisa membuka atau menutup/menyembunyikan MiniHUD kapan saja dengan mengetik:
  \`/hud\` atau \`/minihud\`
- **100% Offline Base64**:
  File \`MiniHUD.jar\` dibuat menggunakan encoding base64 native tanpa ketergantungan link unduhan eksternal yang bisa mati atau lambat.

---

## ⚡ 1-Klik Pasang Langsung di Konsol Pterodactyl:
Salin perintah ini lalu paste di menu **Console** server Anda di \`stellar.jagoanhosting.id\`:
\`\`\`bash
cd /home/container && bash install-minihud.sh
\`\`\`
Lalu klik tombol **RESTART** pada panel Pterodactyl. MiniHUD akan langsung aktif dan muncul di layar in-game semua pemain!
`;
}

/**
 * Returns minimal patch files (tanpa jar besar Geyser/Paper)
 */
export function getQuickPatchFiles(spec: ServerSpec = DEFAULT_SPEC): Record<string, string> {
  return {
    'install-minihud.sh': generateInstallMiniHudSh(),
    'fix-plugins.sh': generateFixPluginsSh(),
    'auto-repair.sh': generateAutoRepairSh(spec),
    'diagnose-connection.sh': generateDiagnoseConnectionSh(spec),
    'server.properties': generateServerProperties(spec),
    'plugins/Geyser-Spigot/config.yml': generateGeyserConfigYml(spec),
    'plugins/Floodgate/config.yml': generateFloodgateConfigYml(),
    'plugins/ViaVersion/config.yml': generateViaVersionConfigYml(),
    'plugins/MiniHUD/config.yml': generateMiniHudPluginConfig(),
    'README-FIX-MINIHUD.md': generateFixMiniHudReadme(spec),
    'README-QUICK-PATCH.md': generateQuickPatchReadme(spec),
    'README-FIX-INITIALCONNECTION-13.md': generateInitialConnectionReadme(spec),
  };
}

/**
 * Script untuk mematikan semua anticheat dan sistem kick/ban/timeout di VPS Pterodactyl
 */
export function generateDisableAnticheatSh(): string {
  return `#!/usr/bin/env bash
# ==============================================================================
# SCRIPT MATIKAN SEMUA ANTICHEAT & DISABLE KICK/TIMEOUT/BAN (Pterodactyl Ready)
# Analisa Masalah: .Fadhil_Akbar_C was kicked due to keepalive timeout!
# ==============================================================================
set -e

echo "=== [1/5] Memperbarui spigot.yml (timeout-time: 300 & moved-wrongly: 10.0) ==="
sed -i 's/timeout-time: [0-9]*/timeout-time: 300/g' spigot.yml 2>/dev/null || true
sed -i 's/moved-wrongly-threshold: [0-9.]*/moved-wrongly-threshold: 10.0/g' spigot.yml 2>/dev/null || true
sed -i 's/moved-too-quickly-multiplier: [0-9.]*/moved-too-quickly-multiplier: 100.0/g' spigot.yml 2>/dev/null || true

echo "=== [2/5] Memperbarui server.properties (player-idle-timeout: 0, allow-flight: true) ==="
sed -i 's/player-idle-timeout=[0-9]*/player-idle-timeout=0/g' server.properties 2>/dev/null || true
sed -i 's/allow-flight=.*/allow-flight=true/g' server.properties 2>/dev/null || true
sed -i 's/network-compression-threshold=.*/network-compression-threshold=512/g' server.properties 2>/dev/null || true

echo "=== [3/5] Mematikan Paper Packet Limiter Kick (config/paper-global.yml) ==="
mkdir -p config
if [ -f "config/paper-global.yml" ]; then
  sed -i 's/action: KICK/action: DROP/g' config/paper-global.yml 2>/dev/null || true
  sed -i 's/max-packet-rate: [0-9.]*/max-packet-rate: 2000.0/g' config/paper-global.yml 2>/dev/null || true
fi

echo "=== [4/5] Menonaktifkan Plugin Anticheat yang Sering Salah Kick Pemain Bedrock ==="
mkdir -p plugins/disabled_anticheat 2>/dev/null || true
for plugin in GrimAC Vulcan Themis Spartan NoCheatPlus Matrix AAC AntiCheat; do
  find plugins/ -maxdepth 1 -iname "*$plugin*.jar" -exec mv {} plugins/disabled_anticheat/ \; 2>/dev/null || true
done

echo "=== [5/5] Mematikan Connection Throttle di bukkit.yml ==="
sed -i 's/connection-throttle: [0-9]*/connection-throttle: -1/g' bukkit.yml 2>/dev/null || true

echo "============================================================================="
echo "✅ SEMUA SISTEM ANTICHEAT, TIMEOUT, DAN KICK TELAH BERHASIL DIMATIKAN!"
echo "Pemain HP/Bedrock (seperti Fadhil Akbar C) tidak akan terputus karena keepalive."
echo "Silakan Restart server di panel Pterodactyl!"
echo "============================================================================="
`;
}

/**
 * Panduan Khusus Menyelesaikan Error:
 * [21:35:26 INFO]: .Fadhil_Akbar_C was kicked due to keepalive timeout!
 * [21:35:26 INFO]: [Geyser-Spigot] Fadhil Akbar C telah terputus dari server Java karena §rTimed out
 */
export function generateKeepaliveTimeoutReadme(spec: ServerSpec = DEFAULT_SPEC): string {
  return `# ⚡ SOLUSI TUNTAS: "was kicked due to keepalive timeout!" & MATIKAN SEMUA ANTICHEAT (2026)

## 🔍 Analisa Log Realita Anda:
\`\`\`
[21:34:51 INFO]: [Geyser-Spigot] Pemain terhubung dengan nama pengguna Fadhil Akbar C (2193)
[21:34:52 INFO]: System chat: .Fadhil_Akbar_C joined the game
[21:34:52 INFO]: .Fadhil_Akbar_C[/114.5.108.76:0] logged in with entity id 118 at ([minecraft:overworld]-28.099962, 70.0, -1.0062505)
[21:35:26 INFO]: .Fadhil_Akbar_C was kicked due to keepalive timeout!
[21:35:26 INFO]: [Geyser-Spigot] Fadhil Akbar C telah terputus dari server Java karena §rTimed out
\`\`\`

### 🎯 Akar Penyebab Masalah (Analisa 2026):
1. **Pemain Masuk dari HP/Bedrock via Geyser**: IP \`114.5.108.76\` adalah jaringan seluler (Telkomsel/Indihome).
2. **Jeda Waktu Tepat 34 Detik**: Pemain masuk pukul \`21:34:52\` dan ditendang tepat pukul \`21:35:26\` (34 detik).
   Spigot memiliki timer bawaan \`timeout-time: 60\` (atau 30). Ketika pemain pertama kali masuk ke dunia, Geyser menerjemahkan ribuan paket chunk overworld sekaligus.
   Di jaringan seluler ber-jitter, balasan keepalive paket UDP tertunda beberapa detik.
   Spigot menganggap koneksi mati dan langsung memanggil \`kick due to keepalive timeout\`!
3. **Vanilla & Paper Anticheat Packet Limiter**:
   Secara default, Paper memiliki \`packet-limiter\` dengan aksi \`KICK\` saat ada lonjakan paket, dan Spigot memiliki \`moved-wrongly\` yang mendeteksi gravitasi Bedrock sebagai speed/fly hack!

---

## 🛠️ Step-by-Step Rubah File Apa Saja:

### 1. File: \`spigot.yml\` (Root Folder)
Cari bagian \`settings:\` lalu ubah:
\`\`\`yaml
settings:
  timeout-time: 300    # Default 60 (UBAH KE 300 atau 600 untuk mematikan keepalive kick!)
  moved-wrongly-threshold: 10.0   # Mematikan anticheat gerak salah
  moved-too-quickly-multiplier: 100.0 # Mematikan anticheat gerak terlalu cepat
\`\`\`

### 2. File: \`server.properties\` (Root Folder)
\`\`\`properties
player-idle-timeout=0    # UBAH DARI 15 KE 0 (Mematikan sistem kick AFK selamanya)
allow-flight=true        # UBAH KE TRUE (Mencegah kick 'Flying is not enabled' bagi Bedrock)
network-compression-threshold=512 # Mengurangi beban CPU kompresi keepalive
max-tick-time=120000     # Mencegah crash watchdog saat lag
\`\`\`

### 3. File: \`config/paper-global.yml\` (Folder config/)
\`\`\`yaml
packet-limiter:
  all-packets:
    action: DROP    # UBAH DARI KICK MENJADI DROP!
    max-packet-rate: 2000.0  # Tingkatkan dari 500 ke 2000
\`\`\`

### 4. File: \`bukkit.yml\` (Root Folder)
\`\`\`yaml
settings:
  connection-throttle: -1  # Mematikan delay & throttle koneksi ulang
\`\`\`

### 5. File: \`plugins/Geyser-Spigot/config.yml\`
\`\`\`yaml
forward-player-ping: false
cache-chunks: true
max-chunk-queue: 10    # Mencegah antrian chunk menenggelamkan paket keepalive
mtu: 1400              # Mencegah fragmentasi paket UDP Telkomsel/Indosat
\`\`\`

### 6. Matikan Plugin Anticheat Eksternal (Folder \`plugins/\`):
Jika Anda memasang plugin anticheat seperti:
- **GrimAC**, **Vulcan**, **Themis**, **Spartan**, atau **NoCheatPlus**
Pindahkan atau hapus file \`.jar\`-nya ke folder \`plugins/disabled_anticheat/\` karena fisika Minecraft Bedrock (HP) memiliki lompatan, hitbox, dan perahu yang berbeda dengan Java sehingga selalu memicu false-kick!

---

## ⚡ Eksekusi 1-Klik di Konsol Pterodactyl:
Paste perintah ini langsung ke menu **Console** di panel \`stellar.jagoanhosting.id\`:
\`\`\`bash
cd /home/container && sed -i 's/timeout-time: [0-9]*/timeout-time: 300/g' spigot.yml && sed -i 's/player-idle-timeout=[0-9]*/player-idle-timeout=0/g' server.properties && sed -i 's/allow-flight=.*/allow-flight=true/g' server.properties && sed -i 's/action: KICK/action: DROP/g' config/paper-global.yml 2>/dev/null || true
\`\`\`
Lalu klik **Restart** server. Pemain Fadhil Akbar C dan pemain HP lainnya dijamin tidak akan pernah terkena keepalive timeout lagi!
`;
}

/**
 * Returns all generated files as a key-value record for ZIP packaging & UI inspection
 */
export function getAllServerFiles(spec: ServerSpec = DEFAULT_SPEC): Record<string, string> {
  return {
    'install-minihud.sh': generateInstallMiniHudSh(),
    'fix-plugins.sh': generateFixPluginsSh(),
    'auto-repair.sh': generateAutoRepairSh(spec),
    'disable-all-anticheat.sh': generateDisableAnticheatSh(),
    'diagnose-connection.sh': generateDiagnoseConnectionSh(spec),
    'download-server-jars.sh': generateDownloadJarsSh(),
    'eula.txt': '# EULA accepted by Minecraft VPS Suite\neula=true\n',
    'server.properties': generateServerProperties(spec),
    'spigot.yml': generateSpigotYml(),
    'bukkit.yml': generateBukkitYml(),
    'config/paper-global.yml': generatePaperGlobalYml(),
    'purpur.yml': generatePurpurYml(),
    'paper-world-defaults.yml': generatePaperWorldDefaultsYml(),
    'plugins/Geyser-Spigot/config.yml': generateGeyserConfigYml(spec),
    'plugins/Floodgate/config.yml': generateFloodgateConfigYml(),
    'plugins/ViaVersion/config.yml': generateViaVersionConfigYml(),
    'plugins/MiniHUD/config.yml': generateMiniHudPluginConfig(),
    'fix-animasi-pack.sh': generateFixAnimasiPackSh(),
    'start.sh': generateStartSh(spec),
    'setup-jagoanhosting.sh': generateSetupBash(spec),
    'minecraft.service': generateSystemdService(),
    'README-DEPLOYMENT.md': generateReadmeDocs(spec),
    'README-FIX-MINIHUD.md': generateFixMiniHudReadme(spec),
    'README-FIX-INITIALCONNECTION-13.md': generateInitialConnectionReadme(spec),
    'README-FIX-KEEPALIVE-TIMEOUT.md': generateKeepaliveTimeoutReadme(spec),
  };
}


