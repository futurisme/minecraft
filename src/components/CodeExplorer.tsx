import React, { useState } from 'react';
import {
  FileCode,
  Copy,
  Check,
  Download,
  FolderTree,
  Search,
  Sparkles,
  CheckCircle2,
  Terminal,
  Shield,
  Layers,
} from 'lucide-react';
import { getAllServerFiles, ServerSpec } from '../utils/minecraftConfig.ts';

interface CodeExplorerProps {
  spec: ServerSpec;
  onDownloadZip: () => void;
  isDownloading: boolean;
}

interface FileMetadata {
  description: string;
  category: 'core' | 'network' | 'crossplay' | 'script' | 'docs';
  whyItMatters: string;
}

const FILE_DESCRIPTIONS: Record<string, FileMetadata> = {
  'fix-plugins.sh': {
    category: 'script',
    description: 'Script Perbaikan Plugin: Hapus geyserupdater-bungee & Pasang Floodgate/ViaVersion',
    whyItMatters:
      'Menyelesaikan crash IllegalArgumentException dari geyserupdater-bungee.jar dan mengunduh floodgate-spigot.jar serta ViaVersion.jar secara instan.',
  },
  'auto-repair.sh': {
    category: 'script',
    description: 'Auto-Downloader Internal VPS & Self-Healing Watchdog (Anti-Force-Offline)',
    whyItMatters:
      'Mendeteksi dan mengunduh otomatis paper.jar, Geyser, Floodgate, dan ViaVersion langsung di dalam VPS. Jika internet/mirror sempat terputus, script masuk Standby Rescue Mode sehingga status server di Pterodactyl TIDAK force-offline!',
  },
  'diagnose-connection.sh': {
    category: 'script',
    description: 'Tool Diagnostik Koneksi Multiplayer (Bedrock & Java 100% Ready)',
    whyItMatters:
      'Menguji TCP/UDP port 32144, aturan UFW firewall, MTU 1400, ketiadaan enforce-secure-profile, dan ketersediaan plugin crossplay secara instan.',
  },
  'download-server-jars.sh': {
    category: 'script',
    description: 'Script 1-Klik Download paper.jar 1.21.4, Geyser, Floodgate, ViaVersion, dan EULA',
    whyItMatters:
      'Solusi instan untuk error "Unable to access jarfile paper.jar". Mengunduh semua file JAR yang dibutuhkan server dalam 5 detik langsung ke direktori server.',
  },
  'eula.txt': {
    category: 'core',
    description: 'Persetujuan Minecraft End User License Agreement (EULA)',
    whyItMatters:
      'Berisi eula=true agar server Minecraft langsung berjalan saat pertama kali dijalankan tanpa crash.',
  },
  'start.sh': {
    category: 'script',
    description: 'Skrip launcher server dengan Aikar Flags tuned untuk Ryzen 9 200% & 4GB RAM',
    whyItMatters:
      'Mengalokasikan 3072M Heap (G1GC) dan menyisakan 1024M untuk OS + Netty Geyser. Otomatis loop restart jika crash dengan ulimit 65535.',
  },
  'setup-jagoanhosting.sh': {
    category: 'script',
    description: '1-Click bash installer khusus VPS Jagoan Hosting (Ubuntu 22.04 / 24.04 LTS)',
    whyItMatters:
      'Menginstal Java 21 Temurin, membuat 2GB NVMe swapfile darurat, tweak TCP BBR kernel Jakarta, dan membuka UFW firewall 25565 & 19132 UDP.',
  },
  'server.properties': {
    category: 'core',
    description: 'Properti server utama dengan optimasi jaringan Jakarta OpenIXP',
    whyItMatters:
      'tcp-nodelay=true mematikan Nagle algorithm, network-compression-threshold=256, simulation-distance=5 (anti-drop TPS pada 4GB RAM).',
  },
  'purpur.yml': {
    category: 'core',
    description: 'Konfigurasi Purpur 1.21.x dengan optimasi tick loop & villager lobotomy',
    whyItMatters:
      'Menghilangkan tick spike dari mob villager/zombie, alternate-keepalive menghindari kick lag tak terduga pada ISP Indonesia.',
  },
  'paper-world-defaults.yml': {
    category: 'core',
    description: 'Pengaturan chunk, entities despawn, dan autosave Paper/Purpur',
    whyItMatters:
      'Entity despawn range di-tune agar Ryzen 9 200% tidak terbebani mob jauh, chunk auto-save interval 6000 tick (5 menit) mengurangi I/O lag NVMe.',
  },
  'plugins/Geyser-Spigot/config.yml': {
    category: 'crossplay',
    description: 'Konfigurasi GeyserMC untuk crossplay Bedrock pada Port 32144',
    whyItMatters:
      'Port 32144 (clone-remote-port: true), MTU 1400 (standar telko Indo), auth-type floodgate, ignore-unsupported-packs: true (anti-warning), dan translasi visual achievement Bedrock.',
  },
  'fix-animasi-pack.sh': {
    category: 'script',
    description: 'Script otomatis perbaikan animasi.mcpack (Actions And Stuff 1.9) - Mengatasi Warning 80 Karakter',
    whyItMatters:
      'Mengekstrak dan meratakan folder Actions And Stuff 1.9 agar path berkurang 22 karakter (di bawah batas 80 karakter). Menghilangkan 100% spam warning console dan lag spike I/O pada Stellar Panel!',
  },
  'plugins/Floodgate/config.yml': {
    category: 'crossplay',
    description: 'Autentikasi Bedrock tanpa butuh akun Java, prefix titik (.)',
    whyItMatters:
      'Menghubungkan akun Bedrock langsung, mengizinkan nama ber-prefix ".", dan meneruskan advancement/achievements langsung ke klien Bedrock.',
  },
  'plugins/ViaVersion/config.yml': {
    category: 'crossplay',
    description: 'Jembatan Protokol Multi-Versi Java (1.8 s.d 1.21.x) & Bedrock',
    whyItMatters:
      'Mencegah error "Outdated Server" atau "Trouble Establishing Connection" saat klien pemain memiliki versi yang berbeda dengan server.',
  },
  'plugins/MiniHUD/config.yml': {
    category: 'core',
    description: 'Side Mini HUD & Actionbar hemat layar untuk pemain Bedrock & Java',
    whyItMatters:
      'Sangat ringan (1 tick per detik, zero CPU load). Default ke Actionbar pada pemain Bedrock agar tidak menutupi kontrol ponsel!',
  },
  'minecraft.service': {
    category: 'script',
    description: 'Systemd service daemon untuk menjalankan server di background 24/7',
    whyItMatters:
      'Server otomatis jalan saat VPS direstart/reboot oleh Jagoan Hosting tanpa perlu login SSH manual.',
  },
  'README-DEPLOYMENT.md': {
    category: 'docs',
    description: 'Dokumentasi lengkap instalasi langkah demi langkah dalam Bahasa Indonesia',
    whyItMatters:
      'Panduan lengkap per 17 Oktober 2026: mulai dari SSH, unzip, setup port, hingga cara mabar Bedrock ponsel dan laptop.',
  },
  'install-minihud.sh': {
    category: 'script',
    description: 'Script Instalasi MiniHUD Native (Ping & Uptime) via Bytecode Base64',
    whyItMatters:
      'Memasang plugins/MiniHUD.jar dan plugins/MiniHUD/config.yml secara offline dan aman di VPS Pterodactyl, menghapus file geyserupdater rusak, dan mengaktifkan /hud toggle in-game.',
  },
  'README-FIX-MINIHUD.md': {
    category: 'docs',
    description: 'Panduan Analisa & Solusi MiniHUD In-Game (Bedrock & Java)',
    whyItMatters:
      'Menjelaskan analisa screenshot Pterodactyl: folder MiniHUD tanpa file .jar, mod Fabric vs server-side Bukkit, dan cara mengaktifkan tampilan Ping & Uptime in-game.',
  },
  'README-FIX-INITIALCONNECTION-13.md': {
    category: 'docs',
    description: 'Solusi Tuntas Error "NetherNet InitialConnection-13" (Khusus Bedrock Mobile)',
    whyItMatters:
      'Penjelasan lengkap berdasarkan error log Xiaomi 2312FPCA6G: perbaikan handshake Floodgate, pembersihan geyserupdater-bungee, dan aktivasi ViaVersion.',
  },
};

export const CodeExplorer: React.FC<CodeExplorerProps> = ({ spec, onDownloadZip, isDownloading }) => {
  const allFiles = getAllServerFiles(spec);
  const fileKeys = Object.keys(allFiles);

  const [activeFile, setActiveFile] = useState<string>('start.sh');
  const [copied, setCopied] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredFiles = fileKeys.filter((name) =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeContent = allFiles[activeFile] || '';
  const currentMeta = FILE_DESCRIPTIONS[activeFile] || {
    description: 'Konfigurasi server Minecraft',
    category: 'core',
    whyItMatters: 'Disesuaikan untuk spesifikasi Jagoan Hosting Ryzen 9 200%.',
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(activeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadSingleFile = (fileName: string, content: string) => {
    const cleanName = fileName.includes('/') ? fileName.split('/').pop()! : fileName;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = cleanName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Overview Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
            <FolderTree className="w-5 h-5 text-emerald-400" />
            <span>Koleksi Full Source Code & Konfigurasi Siap Deploy</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Semua file di bawah telah dipra-konfigurasi untuk VPS Jagoan Hosting Jakarta (AMD Ryzen 9 200%, 4GB RAM, NVMe 30GB).
            Tinggal unzip atau copy-paste langsung ke server Anda.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onDownloadZip}
            disabled={isDownloading}
            className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20 active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Semua (.ZIP)</span>
          </button>
        </div>
      </div>

      {/* Main File Explorer Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left: File Tree & Selector */}
        <div className="lg:col-span-4 bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
          {/* Search Bar */}
          <div className="p-3 border-b border-zinc-800 bg-zinc-900/50">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari file server..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors font-mono"
              />
            </div>
          </div>

          {/* File List */}
          <div className="divide-y divide-zinc-800/60 max-h-[580px] overflow-y-auto">
            {filteredFiles.map((file) => {
              const isSelected = file === activeFile;
              const meta = FILE_DESCRIPTIONS[file];
              const isCrossplay = file.includes('Geyser') || file.includes('Floodgate') || file.includes('ViaVersion');
              const isScript = file.endsWith('.sh') || file.endsWith('.service');

              return (
                <button
                  key={file}
                  onClick={() => setActiveFile(file)}
                  type="button"
                  className={`w-full text-left p-3 transition-colors flex items-start gap-2.5 cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-500/10 border-l-2 border-emerald-400 text-zinc-100'
                      : 'hover:bg-zinc-900/60 text-zinc-400'
                  }`}
                >
                  <FileCode
                    className={`w-4 h-4 mt-0.5 shrink-0 ${
                      isSelected
                        ? 'text-emerald-400'
                        : isCrossplay
                        ? 'text-amber-400'
                        : isScript
                        ? 'text-cyan-400'
                        : 'text-zinc-500'
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-mono font-medium truncate text-zinc-200">
                        {file}
                      </span>
                      {isCrossplay && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-300 font-mono shrink-0">
                          Crossplay
                        </span>
                      )}
                      {isScript && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/15 text-cyan-300 font-mono shrink-0">
                          Script
                        </span>
                      )}
                    </div>
                    {meta && (
                      <p className="text-[11px] text-zinc-500 truncate mt-0.5">
                        {meta.description}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick stats footer */}
          <div className="p-3 bg-zinc-900/40 border-t border-zinc-800 text-[11px] font-mono text-zinc-500 flex items-center justify-between">
            <span>Total: {fileKeys.length} files</span>
            <span className="text-emerald-400 font-bold">100% Ready-to-Unzip</span>
          </div>
        </div>

        {/* Right: Code Viewer & Architectural Analysis */}
        <div className="lg:col-span-8 space-y-3">
          {/* File Header & Tuning Rationale */}
          <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-emerald-400 font-mono font-bold">
                  {activeFile}
                </span>
                <span className="text-xs text-zinc-400">{currentMeta.description}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => downloadSingleFile(activeFile, activeContent)}
                  type="button"
                  className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-mono flex items-center gap-1.5 border border-zinc-800 transition-colors cursor-pointer"
                  title="Download hanya file ini"
                >
                  <Download className="w-3 h-3 text-zinc-400" />
                  <span>Download File</span>
                </button>

                <button
                  onClick={copyToClipboard}
                  type="button"
                  className="px-3 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 text-xs font-mono font-medium flex items-center gap-1.5 border border-emerald-500/30 transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Salin Kode</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Why it matters badge */}
            <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-300 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-zinc-200">Analisa Optimasi Ryzen 9 / 4GB RAM: </span>
                <span className="text-zinc-400">{currentMeta.whyItMatters}</span>
              </div>
            </div>
          </div>

          {/* Syntax Highlighted Code Viewer */}
          <div className="rounded-2xl bg-zinc-950 border border-zinc-800 overflow-hidden shadow-lg">
            {/* Window bar */}
            <div className="px-4 py-2 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between text-xs font-mono text-zinc-400">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                </div>
                <span className="text-zinc-500 ml-2">/root/minecraft/{activeFile}</span>
              </div>
              <span className="text-zinc-500">{activeContent.split('\n').length} baris</span>
            </div>

            {/* Code Box */}
            <div className="p-4 font-mono text-xs text-zinc-200 overflow-x-auto max-h-[520px] bg-zinc-950/90 leading-relaxed selection:bg-emerald-500/30">
              <pre className="whitespace-pre">
                {activeContent.split('\n').map((line, idx) => {
                  const isComment = line.trim().startsWith('#') || line.trim().startsWith('//');
                  const isKey = line.includes('=') || line.includes(':');
                  const isBash = line.startsWith('echo') || line.startsWith('sudo') || line.startsWith('curl');

                  return (
                    <div key={idx} className="table-row hover:bg-zinc-900/50">
                      <span className="table-cell pr-4 text-right select-none text-zinc-600 text-[11px] w-8">
                        {idx + 1}
                      </span>
                      <span
                        className={`table-cell ${
                          isComment
                            ? 'text-zinc-500 italic'
                            : isBash
                            ? 'text-cyan-300 font-semibold'
                            : isKey
                            ? 'text-emerald-300'
                            : 'text-zinc-300'
                        }`}
                      >
                        {line}
                      </span>
                    </div>
                  );
                })}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
