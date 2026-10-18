import JSZip from 'jszip';
import { getAllServerFiles, DEFAULT_SPEC, type ServerSpec } from './minecraftConfig.ts';
import { getMiniHudJarBuffer, downloadMiniHudJarDirect } from './customSidePanelJar.ts';

export interface HeavyPluginInfo {
  id: string;
  name: string;
  filename: string;
  category: 'core' | 'crossplay' | 'protocol' | 'performance' | 'utility';
  categoryLabel: string;
  sizeMb: string;
  description: string;
  targetFolder: string;
  downloadUrl: string;
  curlCommand: string;
  wgetCommand: string;
  isRequired: boolean;
}

export const JAR_URLS = {
  paperJar: 'https://api.purpurmc.org/v2/purpur/1.21.4/latest/download',
  geyserJar: 'https://download.geysermc.org/v2/projects/geyser/versions/latest/builds/latest/downloads/spigot',
  floodgateJar: 'https://download.geysermc.org/v2/projects/floodgate/versions/latest/builds/latest/downloads/spigot',
  viaVersionJar: 'https://hangarcdn.papermc.io/plugins/ViaVersion/ViaVersion/versions/5.2.1/PAPER/ViaVersion-5.2.1.jar',
  viaBackwardsJar: 'https://hangarcdn.papermc.io/plugins/ViaVersion/ViaBackwards/versions/5.2.1/PAPER/ViaBackwards-5.2.1.jar',
};

export const HEAVY_PLUGINS_LIST: HeavyPluginInfo[] = [
  {
    id: 'minihud',
    name: '9D SERVER MiniHUD (Ping & Uptime Collapsible HUD)',
    filename: 'MiniHUD.jar',
    category: 'utility',
    categoryLabel: 'In-Game HUD',
    sizeMb: '~8.5 KB',
    description: 'HUD in-game resmi 9D SERVER (Ping & Uptime server murni tanpa angka merah 2 & 1) untuk Bedrock (HP) & Java. Termasuk perlindungan spawn 15 detik anti-damage & anti-mob, posisi aman di corner kanan atas, serta tombol toggle [<] / [>].',
    targetFolder: '/plugins/',
    downloadUrl: 'internal://minihud',
    curlCommand: 'bash install-minihud.sh',
    wgetCommand: 'bash install-minihud.sh',
    isRequired: true,
  },
  {
    id: 'paper-purpur',
    name: 'Purpur / Paper 1.21.4 (Core Server)',
    filename: 'paper.jar',
    category: 'core',
    categoryLabel: 'Wajib (Server Core)',
    sizeMb: '~55 MB',
    description: 'File executable server Minecraft utama. Wajib ada di root folder Pterodactyl (/home/container) dengan nama paper.jar agar server bisa START.',
    targetFolder: '/ (Root Folder)',
    downloadUrl: 'https://api.purpurmc.org/v2/purpur/1.21.4/latest/download',
    curlCommand: 'curl -L -f -o paper.jar "https://api.purpurmc.org/v2/purpur/1.21.4/latest/download"',
    wgetCommand: 'wget -O paper.jar "https://api.purpurmc.org/v2/purpur/1.21.4/latest/download"',
    isRequired: true,
  },
  {
    id: 'geyser-spigot',
    name: 'Geyser-Spigot (Bedrock Engine)',
    filename: 'Geyser-Spigot.jar',
    category: 'crossplay',
    categoryLabel: 'Crossplay Bedrock',
    sizeMb: '~48 MB',
    description: 'Penerjemah protokol Minecraft Bedrock (HP Android, iOS, Windows 10/11) ke Java Edition secara real-time.',
    targetFolder: '/plugins/',
    downloadUrl: 'https://download.geysermc.org/v2/projects/geyser/versions/latest/builds/latest/downloads/spigot',
    curlCommand: 'curl -L -f -o plugins/Geyser-Spigot.jar "https://download.geysermc.org/v2/projects/geyser/versions/latest/builds/latest/downloads/spigot"',
    wgetCommand: 'wget -O plugins/Geyser-Spigot.jar "https://download.geysermc.org/v2/projects/geyser/versions/latest/builds/latest/downloads/spigot"',
    isRequired: true,
  },
  {
    id: 'floodgate-spigot',
    name: 'Floodgate-Spigot (Bedrock Auth & Skin)',
    filename: 'Floodgate-Spigot.jar',
    category: 'crossplay',
    categoryLabel: 'Crossplay Bedrock',
    sizeMb: '~11 MB',
    description: 'Memungkinkan pemain Bedrock login tanpa akun Java, menampilkan skin Bedrock, dan menghilangkan error "InitialConnection-13".',
    targetFolder: '/plugins/',
    downloadUrl: 'https://download.geysermc.org/v2/projects/floodgate/versions/latest/builds/latest/downloads/spigot',
    curlCommand: 'curl -L -f -o plugins/Floodgate-Spigot.jar "https://download.geysermc.org/v2/projects/floodgate/versions/latest/builds/latest/downloads/spigot"',
    wgetCommand: 'wget -O plugins/Floodgate-Spigot.jar "https://download.geysermc.org/v2/projects/floodgate/versions/latest/builds/latest/downloads/spigot"',
    isRequired: true,
  },
  {
    id: 'viaversion',
    name: 'ViaVersion (Multi-Version Bridge)',
    filename: 'ViaVersion.jar',
    category: 'protocol',
    categoryLabel: 'Protokol & Versi',
    sizeMb: '~4.5 MB',
    description: 'Mengizinkan pemain dengan versi Minecraft Java yang lebih baru atau berbeda untuk tetap bisa masuk ke server.',
    targetFolder: '/plugins/',
    downloadUrl: 'https://hangarcdn.papermc.io/plugins/ViaVersion/ViaVersion/versions/5.2.1/PAPER/ViaVersion-5.2.1.jar',
    curlCommand: 'curl -L -f -o plugins/ViaVersion.jar "https://hangarcdn.papermc.io/plugins/ViaVersion/ViaVersion/versions/5.2.1/PAPER/ViaVersion-5.2.1.jar"',
    wgetCommand: 'wget -O plugins/ViaVersion.jar "https://hangarcdn.papermc.io/plugins/ViaVersion/ViaVersion/versions/5.2.1/PAPER/ViaVersion-5.2.1.jar"',
    isRequired: true,
  },
  {
    id: 'viabackwards',
    name: 'ViaBackwards (Dukungan Versi Lama)',
    filename: 'ViaBackwards.jar',
    category: 'protocol',
    categoryLabel: 'Protokol & Versi',
    sizeMb: '~2.5 MB',
    description: 'Mengizinkan pemain dengan Minecraft versi 1.16 - 1.20 lama untuk login tanpa harus update game mereka.',
    targetFolder: '/plugins/',
    downloadUrl: 'https://hangarcdn.papermc.io/plugins/ViaVersion/ViaBackwards/versions/5.2.1/PAPER/ViaBackwards-5.2.1.jar',
    curlCommand: 'curl -L -f -o plugins/ViaBackwards.jar "https://hangarcdn.papermc.io/plugins/ViaVersion/ViaBackwards/versions/5.2.1/PAPER/ViaBackwards-5.2.1.jar"',
    wgetCommand: 'wget -O plugins/ViaBackwards.jar "https://hangarcdn.papermc.io/plugins/ViaVersion/ViaBackwards/versions/5.2.1/PAPER/ViaBackwards-5.2.1.jar"',
    isRequired: false,
  },
  {
    id: 'chunky',
    name: 'Chunky (Pre-Generator Chunks)',
    filename: 'Chunky.jar',
    category: 'performance',
    categoryLabel: 'Optimasi & Performa',
    sizeMb: '~1.5 MB',
    description: 'Pre-generate world chunk saat server sepi agar tidak terjadi lag spike ketika pemain menjelajah peta baru.',
    targetFolder: '/plugins/',
    downloadUrl: 'https://hangarcdn.papermc.io/plugins/pop4959/Chunky/versions/1.4.28/PAPER/Chunky-1.4.28.jar',
    curlCommand: 'curl -L -f -o plugins/Chunky.jar "https://hangarcdn.papermc.io/plugins/pop4959/Chunky/versions/1.4.28/PAPER/Chunky-1.4.28.jar"',
    wgetCommand: 'wget -O plugins/Chunky.jar "https://hangarcdn.papermc.io/plugins/pop4959/Chunky/versions/1.4.28/PAPER/Chunky-1.4.28.jar"',
    isRequired: false,
  },
  {
    id: 'spark',
    name: 'Spark Profiler (TPS & Memory Inspector)',
    filename: 'spark.jar',
    category: 'performance',
    categoryLabel: 'Optimasi & Performa',
    sizeMb: '~3.2 MB',
    description: 'Alat diagnostik lag terakurat untuk memantau penggunaan RAM 4GB dan CPU Ryzen 9 secara real-time via web dashboard.',
    targetFolder: '/plugins/',
    downloadUrl: 'https://sparkapi.lucko.me/download/spark-paper.jar',
    curlCommand: 'curl -L -f -o plugins/spark.jar "https://sparkapi.lucko.me/download/spark-paper.jar"',
    wgetCommand: 'wget -O plugins/spark.jar "https://sparkapi.lucko.me/download/spark-paper.jar"',
    isRequired: false,
  },
  {
    id: 'luckperms',
    name: 'LuckPerms (Permissions Management)',
    filename: 'LuckPerms-Bukkit.jar',
    category: 'utility',
    categoryLabel: 'Utilitas & Izin',
    sizeMb: '~7.2 MB',
    description: 'Sistem pengaturan role, rank, dan permission admin/member paling cepat dan hemat memori dengan web editor interaktif.',
    targetFolder: '/plugins/',
    downloadUrl: 'https://download.luckperms.net/1554/bukkit/loader/LuckPerms-Bukkit-5.4.140.jar',
    curlCommand: 'curl -L -f -o plugins/LuckPerms-Bukkit.jar "https://download.luckperms.net/1554/bukkit/loader/LuckPerms-Bukkit-5.4.140.jar"',
    wgetCommand: 'wget -O plugins/LuckPerms-Bukkit.jar "https://download.luckperms.net/1554/bukkit/loader/LuckPerms-Bukkit-5.4.140.jar"',
    isRequired: false,
  },
  {
    id: 'essentialsx',
    name: 'EssentialsX (Spawn, Home, Warp)',
    filename: 'EssentialsX.jar',
    category: 'utility',
    categoryLabel: 'Utilitas & Izin',
    sizeMb: '~4.1 MB',
    description: 'Menyediakan fitur dasar survival seperti /setspawn, /spawn, /sethome, /home, /tpa, dan /warp.',
    targetFolder: '/plugins/',
    downloadUrl: 'https://github.com/EssentialsX/Essentials/releases/download/2.20.1/EssentialsX-2.20.1.jar',
    curlCommand: 'curl -L -f -o plugins/EssentialsX.jar "https://github.com/EssentialsX/Essentials/releases/download/2.20.1/EssentialsX-2.20.1.jar"',
    wgetCommand: 'wget -O plugins/EssentialsX.jar "https://github.com/EssentialsX/Essentials/releases/download/2.20.1/EssentialsX-2.20.1.jar"',
    isRequired: false,
  },
  {
    id: 'vault',
    name: 'Vault (Economy & Chat Hook)',
    filename: 'Vault.jar',
    category: 'utility',
    categoryLabel: 'Utilitas & Izin',
    sizeMb: '~450 KB',
    description: 'API penghubung sistem ekonomi dan permission antar plugin Minecraft.',
    targetFolder: '/plugins/',
    downloadUrl: 'https://github.com/MilkBowl/Vault/releases/download/1.7.3/Vault.jar',
    curlCommand: 'curl -L -f -o plugins/Vault.jar "https://github.com/MilkBowl/Vault/releases/download/1.7.3/Vault.jar"',
    wgetCommand: 'wget -O plugins/Vault.jar "https://github.com/MilkBowl/Vault/releases/download/1.7.3/Vault.jar"',
    isRequired: false,
  },
];

/**
 * Single Unified ZIP Generator for Minecraft VPS (Pterodactyl Jagoanhosting)
 * Excludes heavy JAR binaries so ZIP size is guaranteed under 1-2 MB (~35 KB).
 * Generates instantly in browser memory without CORS or external fetch bottlenecks.
 */
export async function downloadUnifiedCoreZip(
  spec: ServerSpec = DEFAULT_SPEC,
  onProgress?: (status: string, percent: number) => void
): Promise<{ filename: string; sizeKb: number }> {
  const zip = new JSZip();
  const files = getAllServerFiles(spec);

  if (onProgress) onProgress('Menghubungkan berkas konfigurasi...', 20);

  // Add all text configuration and script files
  for (const [filePath, content] of Object.entries(files)) {
    zip.file(filePath, content as string);
  }

  // CRITICAL: Include MiniHUD.jar binary directly in the ZIP!
  // Size is only ~5.8 KB, keeps total ZIP <50 KB, but guarantees plugins/MiniHUD.jar is installed on Unarchive!
  zip.file('plugins/MiniHUD.jar', getMiniHudJarBuffer());

  // Ensure eula.txt is present
  zip.file('eula.txt', '# EULA accepted by Minecraft VPS Jagoanhosting Suite\neula=true\n');

  // Add manifest of heavy plugins for manual or script download
  zip.file(
    'plugins_manifest.json',
    JSON.stringify(
      {
        generator: 'Minecraft VPS Jagoanhosting Suite (Pterodactyl)',
        serverIp: spec.serverIp,
        serverPort: spec.serverPort,
        timestamp: new Date().toISOString(),
        note: 'Gunakan file ini sebagai referensi plugin yang diunduh manual atau via script.',
        heavyPlugins: HEAVY_PLUGINS_LIST,
      },
      null,
      2
    )
  );

  // Add clean step-by-step Pterodactyl guide inside ZIP
  zip.file(
    'PTERODACTYL_JAGOANHOSTING_README.txt',
    `================================================================================
MINECRAFT VPS JAGOANHOSTING PTERODACTYL PANEL SETUP
Server: ${spec.serverName} | IP: ${spec.serverIp}:${spec.serverPort}
Panel: https://stellar.jagoanhosting.id/server/${spec.pterodactylServerId}
================================================================================

PETUNJUK INSTALASI CEPAT:
1. Upload file ZIP ini ke menu "File Manager" di panel Pterodactyl.
2. Klik kanan file ZIP (atau klik ikon titik tiga) lalu pilih "Unarchive" (Ekstrak).
3. Hapus file ZIP setelah diekstrak.
4. Siapkan file paper.jar dan plugin-plugin besar secara MANUAL atau via SCRIPT:
   - Opsi A (Super Cepat 1-Baris di Console):
     Buka tab "Console" di Pterodactyl, lalu jalankan:
     bash download-server-jars.sh

   - Opsi B (Manual Upload via Web):
     Unduh paper.jar dan plugin dari tab "Unduh Manual" pada web generator,
     lalu upload paper.jar ke root folder dan plugin ke folder /plugins/.
5. Pastikan EULA sudah aktif (eula=true sudah disertakan di file eula.txt).
6. Klik tombol "Start" di Pterodactyl!

Selamat bermain bersama teman di Bedrock (HP) dan Java (Laptop)!
================================================================================
`
  );

  if (onProgress) onProgress('Mengompres arsip ZIP inti...', 70);

  const blob = await zip.generateAsync(
    {
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 },
    },
    (metadata) => {
      if (onProgress && metadata.percent) {
        onProgress(`Mengompres berkas (${Math.round(metadata.percent)}%)...`, Math.round(metadata.percent));
      }
    }
  );

  const filename = `minecraft-pterodactyl-core-${spec.serverPort}.zip`;
  const sizeKb = Math.round(blob.size / 1024);

  // Trigger download
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  if (onProgress) onProgress('Selesai!', 100);

  return { filename, sizeKb };
}

/**
 * Alias for unified core download (preserving backward compatibility)
 */
export async function downloadServerZip(
  spec: ServerSpec = DEFAULT_SPEC,
  _includeHeavyJars: boolean = false,
  onProgress?: (status: string, percent: number) => void
): Promise<void> {
  await downloadUnifiedCoreZip(spec, onProgress);
}

export async function downloadQuickPatchZip(
  spec: ServerSpec = DEFAULT_SPEC,
  _includePatchJars: boolean = false,
  onProgress?: (status: string, percent: number) => void
): Promise<void> {
  await downloadUnifiedCoreZip(spec, onProgress);
}

export async function downloadCrossplayBundleZip(
  spec: ServerSpec = DEFAULT_SPEC,
  onProgress?: (status: string, percent: number) => void
): Promise<void> {
  await downloadUnifiedCoreZip(spec, onProgress);
}

/**
 * Direct standalone downloader for official plugin or core jar files
 */
export function downloadDirectJar(url: string, filename: string): void {
  if (filename === 'MiniHUD.jar' || url === 'internal://minihud') {
    downloadMiniHudJarDirect();
    return;
  }
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/**
 * Generate combined 1-line bash script to download all heavy files on the server directly
 */
export function getCombinedDownloadScript(): string {
  const lines: string[] = [
    '#!/usr/bin/env bash',
    '# ==============================================================================#',
    '# SCRIPT 1-KLIK DOWNLOAD SEMUA PLUGIN & CORE JAR DI VPS JAGOANHOSTING PTERODACTYL #',
    '# ==============================================================================#',
    'set -e',
    'mkdir -p plugins',
    'echo "📥 [1/5] Mengunduh paper.jar (Core 1.21.4)..."',
    'curl -L -f --retry 3 -o paper.jar "https://api.purpurmc.org/v2/purpur/1.21.4/latest/download"',
    'echo "📥 [2/5] Mengunduh Geyser-Spigot.jar (Bedrock Crossplay)..."',
    'curl -L -f --retry 3 -o plugins/Geyser-Spigot.jar "https://download.geysermc.org/v2/projects/geyser/versions/latest/builds/latest/downloads/spigot"',
    'echo "📥 [3/5] Mengunduh Floodgate-Spigot.jar (Bedrock Auth & Skins)..."',
    'curl -L -f --retry 3 -o plugins/Floodgate-Spigot.jar "https://download.geysermc.org/v2/projects/floodgate/versions/latest/builds/latest/downloads/spigot"',
    'echo "📥 [4/5] Mengunduh ViaVersion.jar (Multi-version support)..."',
    'curl -L -f --retry 3 -o plugins/ViaVersion.jar "https://hangarcdn.papermc.io/plugins/ViaVersion/ViaVersion/versions/5.2.1/PAPER/ViaVersion-5.2.1.jar" || true',
    'echo "📥 [5/5] Menginstal MiniHUD.jar (Native Ping & Uptime Collapsible HUD)..."',
    'bash install-minihud.sh || true',
    'echo "eula=true" > eula.txt',
    'echo "✅ SEMUA PLUGIN & CORE JAR SELESAI DIUNDUH DI VPS!"',
    'echo "Silakan klik START pada panel Pterodactyl stellar.jagoanhosting.id"',
  ];
  return lines.join('\n');
}
