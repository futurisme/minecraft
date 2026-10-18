import React, { useState } from 'react';
import {
  Download,
  Copy,
  Check,
  ExternalLink,
  Folder,
  HardDrive,
  Terminal,
  ShieldCheck,
  Sparkles,
  Zap,
  CheckCircle2,
  FileCode,
  Layers,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { ServerSpec, DEFAULT_SPEC } from '../utils/minecraftConfig.ts';
import { HEAVY_PLUGINS_LIST, HeavyPluginInfo, downloadDirectJar, getCombinedDownloadScript } from '../utils/zipDownloader.ts';

interface ManualPluginDownloaderProps {
  spec?: ServerSpec;
}

export const ManualPluginDownloader: React.FC<ManualPluginDownloaderProps> = ({ spec = DEFAULT_SPEC }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [downloadedItems, setDownloadedItems] = useState<Record<string, boolean>>({});

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleDownloaded = (id: string) => {
    setDownloadedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredPlugins = selectedCategory === 'all'
    ? HEAVY_PLUGINS_LIST
    : HEAVY_PLUGINS_LIST.filter((p) => p.category === selectedCategory);

  const downloadedCount = Object.values(downloadedItems).filter(Boolean).length;
  const combinedScript = getCombinedDownloadScript();

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-zinc-900 to-zinc-950 border border-cyan-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-mono font-medium">
              <HardDrive className="w-3.5 h-3.5" />
              <span>Pemisahan Berkas Berat (Pterodactyl Ready)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-zinc-100 tracking-tight">
              Pusat Unduhan Manual Plugin & Versi Minecraft
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Sesuai preferensi Anda: ZIP utama dibuat sangat ringan (<strong className="text-emerald-400">&lt; 1-2 MB</strong>) hanya berisi skrip, porting, dan konfigurasi server.
              File JAR besar (<strong className="text-zinc-200">paper.jar</strong> dan plugin Minecraft) dapat Anda unduh langsung dari daftar di bawah ini atau otomatis melalui konsol VPS Pterodactyl.
            </p>
          </div>

          <div className="flex sm:flex-col items-center justify-between sm:justify-center p-3 sm:px-4 sm:py-3 rounded-2xl bg-zinc-900/90 border border-zinc-800 text-center shrink-0">
            <span className="text-[11px] text-zinc-400 font-medium">Status Unduhan Manual</span>
            <div className="text-lg sm:text-xl font-mono font-bold text-cyan-400">
              {downloadedCount} / {HEAVY_PLUGINS_LIST.length}
            </div>
            <span className="text-[10px] text-zinc-500">Berkas Ditandai Siap</span>
          </div>
        </div>
      </div>

      {/* Quick 1-Line Console Script for Pterodactyl */}
      <div className="p-4 sm:p-5 rounded-2xl bg-zinc-950 border border-emerald-500/30 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                <span>Opsi Praktis: Download Langsung di Konsol Pterodactyl</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Kecepatan 1 Gbps VPS
                </span>
              </h3>
              <p className="text-[11px] text-zinc-400">
                Daripada mengunduh puluhan MB di laptop lalu mengunggahnya lagi, Anda cukup copy-paste skrip ini di menu <strong>Console</strong> panel Pterodactyl:
              </p>
            </div>
          </div>

          <button
            onClick={() => copyToClipboard(combinedScript, 'all-script')}
            type="button"
            className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-md shrink-0"
          >
            {copiedId === 'all-script' ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Skrip Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Salin Skrip Download 1-Baris</span>
              </>
            )}
          </button>
        </div>

        <div className="relative rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden font-mono text-xs">
          <pre className="p-3 text-emerald-300 overflow-x-auto whitespace-pre-wrap leading-relaxed select-all">
            {`cd /home/container && curl -L -f -o paper.jar "https://api.purpurmc.org/v2/purpur/1.21.4/latest/download" && mkdir -p plugins && curl -L -f -o plugins/Geyser-Spigot.jar "https://download.geysermc.org/v2/projects/geyser/versions/latest/builds/latest/downloads/spigot" && curl -L -f -o plugins/Floodgate-Spigot.jar "https://download.geysermc.org/v2/projects/floodgate/versions/latest/builds/latest/downloads/spigot" && curl -L -f -o plugins/ViaVersion.jar "https://hangarcdn.papermc.io/plugins/ViaVersion/ViaVersion/versions/5.2.1/PAPER/ViaVersion-5.2.1.jar" && echo "eula=true" > eula.txt`}
          </pre>
        </div>
      </div>

      {/* Visual Workflow for Jagoanhosting Pterodactyl Panel */}
      <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
        <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider font-mono flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Cara Pasang di Panel Jagoanhosting (stellar.jagoanhosting.id)</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-1">
            <div className="font-mono text-emerald-400 font-bold text-[11px]">Langkah 1</div>
            <div className="font-semibold text-zinc-200">Upload ZIP Inti (&lt;1MB)</div>
            <div className="text-[11px] text-zinc-400">Buka menu <strong>File Manager</strong>, upload file ZIP konfigurasi, lalu klik kanan &rarr; <strong>Unarchive</strong>.</div>
          </div>
          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-1">
            <div className="font-mono text-cyan-400 font-bold text-[11px]">Langkah 2</div>
            <div className="font-semibold text-zinc-200">Unduh & Letakkan paper.jar</div>
            <div className="text-[11px] text-zinc-400">Unduh <code className="text-cyan-300">paper.jar</code> dan letakkan di root folder <code className="text-zinc-300">/home/container/</code>.</div>
          </div>
          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-1">
            <div className="font-mono text-amber-400 font-bold text-[11px]">Langkah 3</div>
            <div className="font-semibold text-zinc-200">Upload Plugin ke /plugins/</div>
            <div className="text-[11px] text-zinc-400">Masukkan <code className="text-amber-300">Geyser-Spigot.jar</code> dan <code className="text-amber-300">Floodgate.jar</code> ke folder <code className="text-zinc-300">plugins/</code>.</div>
          </div>
          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-1">
            <div className="font-mono text-purple-400 font-bold text-[11px]">Langkah 4</div>
            <div className="font-semibold text-zinc-200">Klik START Server</div>
            <div className="text-[11px] text-zinc-400">Buka menu <strong>Console</strong>, tekan tombol <strong>Start</strong>. Server online 20.0 TPS!</div>
          </div>
        </div>
      </div>

      {/* MiniHUD Pterodactyl Alert & Quick Download Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-zinc-900 to-zinc-950 border border-emerald-500/40 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-zinc-100">
                  MiniHUD Native In-Game (Ping & Server Uptime Collapsible)
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Solusi Screenshot Pterodactyl
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Folder <code className="text-amber-300">plugins/MiniHUD/</code> di server Anda membutuhkan file binary <code className="text-emerald-300">plugins/MiniHUD.jar</code> agar HUD tampil di HP/PC.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => downloadDirectJar('internal://minihud', 'MiniHUD.jar')}
              type="button"
              className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-emerald-500/10 active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh MiniHUD.jar (6 KB)</span>
            </button>
            <button
              onClick={() => copyToClipboard('cd /home/container && bash install-minihud.sh', 'minihud-bash')}
              type="button"
              className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedId === 'minihud-bash' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Salin Skrip VPS</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <span className="text-xs font-mono text-zinc-500 flex items-center gap-1 shrink-0">
          <Filter className="w-3.5 h-3.5" /> Kategori:
        </span>
        {[
          { id: 'all', label: 'Semua Berkas' },
          { id: 'core', label: 'Wajib (Server Core)' },
          { id: 'crossplay', label: 'Crossplay Bedrock' },
          { id: 'protocol', label: 'Protokol & Versi' },
          { id: 'performance', label: 'Optimasi & Performa' },
          { id: 'utility', label: 'Utilitas & Izin' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            type="button"
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
              selectedCategory === cat.id
                ? 'bg-zinc-800 text-zinc-100 border border-zinc-700 shadow-sm font-semibold'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Plugin Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPlugins.map((plugin) => {
          const isDone = !!downloadedItems[plugin.id];
          return (
            <div
              key={plugin.id}
              className={`p-4 rounded-2xl bg-zinc-950 border transition-all space-y-3.5 shadow-sm ${
                plugin.isRequired
                  ? 'border-emerald-500/30 hover:border-emerald-500/50'
                  : 'border-zinc-800 hover:border-zinc-700'
              } ${isDone ? 'ring-1 ring-emerald-500/40 bg-zinc-900/40' : ''}`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-zinc-100">{plugin.name}</span>
                    {plugin.isRequired ? (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold">
                        WAJIB
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
                        OPSIONAL
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                    <span className="text-cyan-300 font-semibold">{plugin.filename}</span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-amber-400">{plugin.sizeMb}</span>
                  </div>
                </div>

                {/* Mark as Downloaded Checkbox */}
                <button
                  onClick={() => toggleDownloaded(plugin.id)}
                  type="button"
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer border ${
                    isDone
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                      : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border-zinc-800'
                  }`}
                  title="Tandai jika sudah diunduh atau diunggah ke Pterodactyl"
                >
                  <CheckCircle2 className={`w-3.5 h-3.5 ${isDone ? 'text-emerald-400 fill-emerald-500/20' : 'text-zinc-600'}`} />
                  <span>{isDone ? 'Siap' : 'Tandai Siap'}</span>
                </button>
              </div>

              {/* Description */}
              <p className="text-xs text-zinc-400 leading-relaxed">
                {plugin.description}
              </p>

              {/* Target Location in Pterodactyl */}
              <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs flex items-center justify-between">
                <span className="text-zinc-500 font-mono flex items-center gap-1.5">
                  <Folder className="w-3.5 h-3.5 text-zinc-400" />
                  Target Folder:
                </span>
                <span className="font-mono font-semibold text-emerald-300 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                  {plugin.targetFolder}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1 border-t border-zinc-800/80">
                <div className="flex items-center gap-2">
                  {/* Direct Download in Browser */}
                  <a
                    href={plugin.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-200 hover:text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Download File ({plugin.sizeMb})</span>
                    <ExternalLink className="w-3 h-3 text-zinc-500" />
                  </a>

                  {/* Copy curl Command */}
                  <button
                    onClick={() => copyToClipboard(plugin.curlCommand, `curl-${plugin.id}`)}
                    type="button"
                    className="py-2 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                    title="Salin perintah curl untuk konsol VPS"
                  >
                    {copiedId === `curl-${plugin.id}` ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-sans">curl OK!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>curl</span>
                      </>
                    )}
                  </button>

                  {/* Copy wget Command */}
                  <button
                    onClick={() => copyToClipboard(plugin.wgetCommand, `wget-${plugin.id}`)}
                    type="button"
                    className="py-2 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                    title="Salin perintah wget"
                  >
                    {copiedId === `wget-${plugin.id}` ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-sans">wget OK!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>wget</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
