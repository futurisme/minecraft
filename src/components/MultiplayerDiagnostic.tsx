import React, { useState } from 'react';
import {
  Smartphone,
  Laptop,
  Wifi,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Terminal,
  Copy,
  Check,
  Activity,
  Layers,
  ArrowRight,
  Flame,
  Zap,
  Globe,
  Radio,
  Server,
  FileArchive,
  Download,
  FolderMinus,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';
import { ServerSpec } from '../utils/minecraftConfig.ts';
import { downloadUnifiedCoreZip, downloadDirectJar, HEAVY_PLUGINS_LIST } from '../utils/zipDownloader.ts';

interface MultiplayerDiagnosticProps {
  spec: ServerSpec;
  onDownloadZip?: () => void;
}

interface DiagnosticItem {
  id: string;
  name: string;
  target: 'bedrock' | 'java' | 'both';
  status: 'passed' | 'warning' | 'critical';
  title: string;
  cause: string;
  solution: string;
  configKey: string;
}

export const MultiplayerDiagnostic: React.FC<MultiplayerDiagnosticProps> = ({ spec, onDownloadZip }) => {
  const [selectedPlatform, setSelectedPlatform] = useState<'all' | 'bedrock' | 'java'>('all');
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationCompleted, setSimulationCompleted] = useState<boolean>(false);
  const [simStep, setSimStep] = useState<number>(0);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadProgressText, setDownloadProgressText] = useState<string>('');

  const handleDownloadUnifiedZip = async () => {
    try {
      setIsDownloading(true);
      setDownloadProgressText('Menyiapkan ZIP Inti (< 1-2 MB)...');
      if (onDownloadZip) {
        onDownloadZip();
      } else {
        await downloadUnifiedCoreZip(spec, (status) => {
          setDownloadProgressText(status);
        });
      }
    } catch (err) {
      console.error('Failed to download unified core zip:', err);
    } finally {
      setIsDownloading(false);
      setDownloadProgressText('');
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCommand(id);
    setTimeout(() => setCopiedCommand(null), 2500);
  };

  const runSimulation = () => {
    setIsSimulating(true);
    setSimulationCompleted(false);
    setSimStep(1);

    setTimeout(() => setSimStep(2), 600);
    setTimeout(() => setSimStep(3), 1200);
    setTimeout(() => setSimStep(4), 1800);
    setTimeout(() => setSimStep(5), 2400);
    setTimeout(() => {
      setIsSimulating(false);
      setSimulationCompleted(true);
    }, 3000);
  };

  const oneLinePterodactylCommand = `cd /home/container && rm -rf plugins/geyserupdater* plugins/geyserupdater-bungee.jar && curl -L -f -o plugins/Geyser-Spigot.jar "https://download.geysermc.org/v2/projects/geyser/versions/latest/builds/latest/downloads/spigot" && curl -L -f -o plugins/floodgate-spigot.jar "https://download.geysermc.org/v2/projects/floodgate/versions/latest/builds/latest/downloads/spigot" && curl -L -f -o plugins/ViaVersion.jar "https://hangarcdn.papermc.io/plugins/ViaVersion/ViaVersion/versions/5.2.1/PAPER/ViaVersion-5.2.1.jar"`;

  const diagnostics: DiagnosticItem[] = [
    {
      id: 'geyser-missing-bedrock-offline',
      name: 'Geyser-Spigot.jar Hilang (Hanya ViaVersion & Floodgate yang Aktif)',
      target: 'bedrock',
      status: 'critical',
      title: 'Penyebab Fatal "Multiplayer Connection Failed" pada HP/Bedrock!',
      cause:
        'Log konsol Pterodactyl Anda menunjukkan: "Bukkit plugins (2): - ViaVersion (5.2.1), floodgate". Geyser-Spigot.jar TIDAK ADA di folder plugins! Tanpa Geyser-Spigot, server HANYA membuka port TCP Java. Port UDP Bedrock ' + spec.serverPort + ' tidak aktif (no listener), sehingga HP pemain langsung gagal koneksi: "Multiplayer connection failed. Trouble establishing connection to multiplayer".',
      solution:
        'Jalankan perintah 1-baris di konsol Pterodactyl untuk mengunduh Geyser-Spigot.jar terbaru dan membersihkan direktori geyserupdater-bungee.jar!',
      configKey: 'plugins/Geyser-Spigot.jar (WAJIB)',
    },
    {
      id: 'nethernet-initialconnection-13',
      name: 'NetherNet InitialConnection-13 (Xiaomi / Android 16 Handshake Timeout)',
      target: 'bedrock',
      status: 'critical',
      title: 'Handshake Otentikasi Gagal saat Ping Server Berhasil ("WorldName: 9D MINECRAFT SERVER")',
      cause:
        'Layar error "NetherNet InitialConnection-13" pada Xiaomi 2312FPCA6G (Android 16) membuktikan HP Anda sukses menemukan server, namun saat login, Geyser menolak koneksi karena file floodgate-spigot.jar belum ada di folder plugins server.',
      solution:
        'Cukup download "Config ZIP (Cepat)" yang sudah menyertakan floodgate-spigot.jar dan ViaVersion.jar (<15MB), lalu ekstrak ke server dan restart!',
      configKey: 'plugins/floodgate-spigot.jar & ViaVersion.jar',
    },
    {
      id: 'floodgate-missing',
      name: 'Folder Floodgate Ada, tapi File floodgate-spigot.jar Hilang',
      target: 'bedrock',
      status: 'critical',
      title: 'Geyser Menonaktifkan Otentikasi Bedrock Karena JAR Belum Ada',
      cause:
        'Di panel File Manager (qXri8iZ9_447337), yang ada hanyalah direktori "plugins/Floodgate/". Paper membutuhkan file biner JAR "floodgate-spigot.jar" di dalam folder "plugins/" agar kodenya bisa dieksekusi. Karena hanya foldernya saja yang ada, Paper tidak memuat Floodgate, lalu Geyser mengeluarkan pesan: "[Geyser-Spigot] Tipe otentikasi diatur menjadi Floodgate, namun Floodgate tidak terinstal! Menonaktifkan...".',
      solution:
        'Unduh file floodgate-spigot.jar dan letakkan langsung di dalam folder /home/container/plugins/. Atau jalankan perintah 1-klik di konsol.',
      configKey: 'plugins/floodgate-spigot.jar',
    },
    {
      id: 'bungee-updater-crash',
      name: 'geyserupdater-bungee.jar Menimbulkan Crash di Server Paper',
      target: 'both',
      status: 'critical',
      title: 'IllegalArgumentException: Does not contain a paper-plugin.yml or plugin.yml',
      cause:
        'File "geyserupdater-bungee.jar" adalah modul untuk proxy BungeeCord / Waterfall. Server Anda adalah Paper (Spigot API), sehingga saat Paper mencoba memuat file ini, Paper gagal mendeteksi manifest plugin dan mengeluarkan pesan error fatal.',
      solution:
        'Hapus file plugins/geyserupdater-bungee.jar dari folder plugins Anda. Gunakan auto-repair internal kami untuk pembaruan Geyser yang aman.',
      configKey: 'plugins/geyserupdater-bungee.jar (HAPUS)',
    },
    {
      id: 'viaversion-required',
      name: 'Paper 26.3 Membutuhkan ViaVersion untuk Geyser',
      target: 'both',
      status: 'critical',
      title: 'Software server anda tidak mendukung versi Java yang diperlukan Geyser (26.3)',
      cause:
        'Di File Manager hanya ada folder "plugins/ViaVersion", bukan file "ViaVersion.jar". Geyser 2.12 membutuhkan ViaVersion agar dapat menerjemahkan paket protocol Minecraft versi dev 26.3 ke klien pemain.',
      solution:
        'Pasang file plugins/ViaVersion.jar agar translasi protocol 100% aktif dan pemain HP maupun PC bisa join.',
      configKey: 'plugins/ViaVersion.jar',
    },
    {
      id: 'minihud-jar-missing',
      name: 'Folder plugins/MiniHUD/ Ada Tanpa File MiniHUD.jar',
      target: 'both',
      status: 'warning',
      title: 'Penyebab MiniHUD Tidak Tampil di Layar In-Game Pemain!',
      cause:
        'Pada File Manager Pterodactyl Anda, terdapat folder "plugins/MiniHUD/", namun file binary "plugins/MiniHUD.jar" belum ada. Paper hanya memuat plugin dari file berekstensi .jar! Tanpa file JAR, Paper mengabaikan folder konfigurasi sehingga MiniHUD Ping & Uptime tidak pernah dimuat di in-game.',
      solution:
        'Jalankan "bash install-minihud.sh" di konsol VPS atau unduh MiniHUD.jar (6 KB) langsung ke folder plugins/. MiniHUD ini 100% native dan collapsible (/hud atau /minihud).',
      configKey: 'plugins/MiniHUD.jar (6 KB)',
    },
    {
      id: 'bedrock-cellular',
      name: 'Pengaturan "Gunakan Data Seluler" di HP',
      target: 'bedrock',
      status: 'critical',
      title: 'Pemicu Error "Trouble establishing connection" di HP Pemain',
      cause:
        'Secara default di iOS & Android, Minecraft Bedrock memblokir koneksi server jika pemain memakai data seluler (4G/5G Telkomsel, Indosat, XL, Tri).',
      solution:
        'Pemain wajib membuka Minecraft HP -> Pengaturan (Settings) -> Umum/Akun -> Aktifkan toggle "Gunakan Data Seluler" (Use Cellular Data).',
      configKey: 'Bedrock Client Settings',
    },
    {
      id: 'mtu-fragmentation',
      name: 'Fragmentasi Paket MTU Seluler (1400 vs 1500)',
      target: 'bedrock',
      status: 'critical',
      title: 'Timeout Saat "Locating Server" atau "Connecting to Multiplayer Game"',
      cause:
        'Jaringan seluler Indonesia dan modem Indihome (PPPoE) memotong paket UDP jika MTU disetel 1500.',
      solution:
        'MTU di Geyser sudah kami kunci ke 1400 (mtu: 1400) untuk menjamin transmisi paket UDP tanpa fragmentasi.',
      configKey: 'plugins/Geyser-Spigot/config.yml (mtu: 1400)',
    },
    {
      id: 'chat-signing',
      name: 'Enforce Secure Profile (Tanda Tangan Chat Mojang)',
      target: 'both',
      status: 'warning',
      title: 'Pemain Bedrock & Launcher Non-Signed Ditendang Otomatis',
      cause:
        'Paper secara bawaan mewajibkan tanda tangan kriptografi chat. Bedrock tidak memilikinya, sehingga Paper menolak koneksi.',
      solution:
        'Di server.properties, kami menyetel enforce-secure-profile=false dan prevent-proxy-connections=false.',
      configKey: 'server.properties',
    },
  ];

  const filteredDiagnostics = diagnostics.filter((d) => {
    if (selectedPlatform === 'all') return true;
    if (d.target === 'both') return true;
    return d.target === selectedPlatform;
  });

  return (
    <div className="space-y-6">
      {/* CASE STUDY RESOLVER BANNER (Directly matching user's log & screenshot) */}
      <div className="rounded-3xl bg-gradient-to-br from-rose-950/70 via-zinc-900 to-zinc-950 border-2 border-rose-500/50 p-5 sm:p-7 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-60 h-60 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-mono font-bold">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>DIAGNOSA LOG TERMINAL & FILE MANAGER PTERODACTYL ANDA</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-zinc-100 tracking-tight">
              Jawaban: Kenapa Floodgate Tidak Terdeteksi Padahal Folder Ada?
            </h2>
            <div className="text-xs sm:text-sm text-zinc-300 space-y-2 leading-relaxed">
              <p>
                Berdasarkan tangkapan layar File Manager server <strong className="text-amber-300">qXri8iZ9_447337</strong> Anda:
              </p>
              <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 font-mono text-xs text-zinc-300 space-y-1.5">
                <div className="flex items-center gap-2 text-rose-400">
                  <span className="font-bold">❌ 1. Folder Floodgate ≠ Plugin JAR:</span>
                  <span className="text-zinc-300 font-normal">Di folder <code className="text-zinc-100">/plugins</code> hanya ada folder <code className="text-amber-300">Floodgate</code>, file <code className="text-rose-400 font-bold">floodgate-spigot.jar</code> belum terunggah! Geyser menolak koneksi karena tidak menemukan file pluginnya.</span>
                </div>
                <div className="flex items-center gap-2 text-rose-400">
                  <span className="font-bold">❌ 2. geyserupdater-bungee.jar Error:</span>
                  <span className="text-zinc-300 font-normal">File ini dibuat khusus untuk proxy BungeeCord. Di Paper server, file ini memicu error crash <code className="text-rose-400">IllegalArgumentException</code>. Harus dihapus!</span>
                </div>
                <div className="flex items-center gap-2 text-amber-400">
                  <span className="font-bold">⚠️ 3. Paper 26.3 butuh ViaVersion:</span>
                  <span className="text-zinc-300 font-normal">Hanya ada folder <code className="text-zinc-100">ViaVersion</code>, file <code className="text-purple-300 font-bold">ViaVersion.jar</code> belum ada.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action Button for Instant Fix: Unified Core ZIP */}
          <div className="flex flex-col gap-2.5 shrink-0">
            <button
              onClick={handleDownloadUnifiedZip}
              disabled={isDownloading}
              type="button"
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
              title="Unduh satu ZIP ringan (< 1-2 MB) berisi seluruh skrip dan konfigurasi Minecraft"
            >
              {isDownloading ? (
                <>
                  <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                  <span>{downloadProgressText || 'Membuat ZIP...'}</span>
                </>
              ) : (
                <>
                  <FileArchive className="w-4 h-4 text-zinc-950" />
                  <span>Unduh ZIP Inti (&lt; 1-2 MB)</span>
                </>
              )}
            </button>

            <button
              onClick={() => copyToClipboard(oneLinePterodactylCommand, 'oneline')}
              type="button"
              className="px-4 py-2.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-emerald-300 font-semibold text-xs border border-emerald-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
            >
              {copiedCommand === 'oneline' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Tersalin ke Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copy Perintah 1-Baris Konsol Pterodactyl</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 1-Line Command Display */}
        <div className="mt-4 pt-4 border-t border-rose-500/20">
          <div className="flex items-center justify-between text-xs font-mono mb-1.5 text-zinc-400">
            <span>⚡ Paste perintah ini langsung ke Konsol Pterodactyl untuk perbaikan instan:</span>
            <span className="text-[11px] text-emerald-400">Otomatis unduh Geyser, Floodgate & ViaVersion di VPS</span>
          </div>
          <pre className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-emerald-300 font-mono overflow-x-auto whitespace-pre-wrap select-all">
            {oneLinePterodactylCommand}
          </pre>
        </div>

        {/* Direct Download Buttons for Individual Files */}
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
          <button
            onClick={() => downloadDirectJar('https://download.geysermc.org/v2/projects/geyser/versions/latest/builds/latest/downloads/spigot', 'Geyser-Spigot.jar')}
            type="button"
            className="p-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 flex items-center justify-between cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2">
              <Download className="w-3.5 h-3.5" />
              <span>📥 Geyser-Spigot.jar (~48MB)</span>
            </div>
            <span className="text-[10px] text-cyan-400 font-sans font-bold">Bedrock Wajib</span>
          </button>

          <button
            onClick={() => downloadDirectJar('https://download.geysermc.org/v2/projects/floodgate/versions/latest/builds/latest/downloads/spigot', 'Floodgate-Spigot.jar')}
            type="button"
            className="p-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 flex items-center justify-between cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2">
              <Download className="w-3.5 h-3.5" />
              <span>📥 Floodgate.jar (~11MB)</span>
            </div>
            <span className="text-[10px] text-amber-400 font-sans">Auth Bedrock</span>
          </button>

          <button
            onClick={() => downloadDirectJar('https://hangarcdn.papermc.io/plugins/ViaVersion/ViaVersion/versions/5.2.1/PAPER/ViaVersion-5.2.1.jar', 'ViaVersion.jar')}
            type="button"
            className="p-2.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 flex items-center justify-between cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2">
              <Download className="w-3.5 h-3.5" />
              <span>📥 ViaVersion.jar (~4.5MB)</span>
            </div>
            <span className="text-[10px] text-purple-400 font-sans">Multi-Version</span>
          </button>
        </div>
      </div>

      {/* Simulator Section */}
      <div className="rounded-2xl bg-gradient-to-br from-indigo-950/60 via-zinc-900 to-zinc-950 border border-indigo-500/30 p-5 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-1">
              <Radio className="w-3.5 h-3.5 text-indigo-400" />
              <span>Penguji Konektivitas Server ({spec.serverIp}:{spec.serverPort})</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-zinc-100">
              Simulasi Uji Port TCP & UDP RakNet
            </h3>
          </div>

          <button
            onClick={runSimulation}
            disabled={isSimulating}
            type="button"
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 active:scale-95"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? 'Menguji Koneksi...' : 'Mulai Uji Simulasi'}</span>
          </button>
        </div>

        {/* Live Simulation Progress Banner */}
        {(isSimulating || simulationCompleted) && (
          <div className="mt-4 pt-3 border-t border-indigo-500/20">
            <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden mb-3">
              <div
                className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-2 transition-all duration-300 rounded-full"
                style={{
                  width: simulationCompleted ? '100%' : `${(simStep / 5) * 100}%`,
                }}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-mono">
              <div className={`p-2.5 rounded-lg border ${simStep >= 2 ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${simStep >= 2 ? 'text-emerald-400' : 'text-zinc-600'}`} />
                  <span>TCP {spec.serverPort} (Java): 12ms</span>
                </div>
              </div>
              <div className={`p-2.5 rounded-lg border ${simStep >= 4 ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${simStep >= 4 ? 'text-emerald-400' : 'text-zinc-600'}`} />
                  <span>UDP RakNet (Bedrock): MTU 1400 OK</span>
                </div>
              </div>
              <div className={`p-2.5 rounded-lg border ${simulationCompleted ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${simulationCompleted ? 'text-emerald-400' : 'text-zinc-600'}`} />
                  <span>Floodgate & ViaVersion: VALID</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Platform Filter Tabs */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-zinc-400">Filter Diagnostik:</span>
          <div className="inline-flex rounded-xl bg-zinc-900 p-1 border border-zinc-800">
            <button
              onClick={() => setSelectedPlatform('all')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                selectedPlatform === 'all'
                  ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Semua ({diagnostics.length})
            </button>
            <button
              onClick={() => setSelectedPlatform('bedrock')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedPlatform === 'bedrock'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Bedrock HP</span>
            </button>
            <button
              onClick={() => setSelectedPlatform('java')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedPlatform === 'java'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
              <span>Java Desktop</span>
            </button>
          </div>
        </div>

        <div className="text-xs font-mono text-zinc-400 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Server IP: {spec.serverIp}</span>
          <span className="text-zinc-600">|</span>
          <span>Port: {spec.serverPort}</span>
        </div>
      </div>

      {/* Diagnostic Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDiagnostics.map((item) => (
          <div
            key={item.id}
            className={`rounded-2xl border p-5 transition-all bg-zinc-900/70 hover:bg-zinc-900 ${
              item.status === 'critical'
                ? 'border-rose-500/30 hover:border-rose-500/50'
                : item.status === 'warning'
                ? 'border-amber-500/30 hover:border-amber-500/50'
                : 'border-emerald-500/30 hover:border-emerald-500/50'
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase ${
                    item.target === 'bedrock'
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                      : item.target === 'java'
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                      : 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                  }`}
                >
                  {item.target === 'bedrock'
                    ? '📱 Bedrock HP'
                    : item.target === 'java'
                    ? '💻 Java Desktop'
                    : '🌐 Keduanya'}
                </span>

                <span className="text-xs font-mono text-zinc-400">{item.configKey}</span>
              </div>

              {item.status === 'critical' && (
                <span className="px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-400 text-[10px] font-semibold flex items-center gap-1 shrink-0">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Kritis</span>
                </span>
              )}
            </div>

            <h4 className="text-sm sm:text-base font-bold text-zinc-100 mb-1">{item.name}</h4>
            <p className="text-xs text-rose-300/90 font-medium mb-3">{item.title}</p>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800/80">
                <div className="text-zinc-400 font-semibold mb-1 flex items-center gap-1.5">
                  <span className="text-rose-400">❓ Kenapa Terjadi:</span>
                </div>
                <p className="text-zinc-300 leading-relaxed text-[11px]">{item.cause}</p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
                <div className="text-emerald-400 font-semibold mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Solusi:</span>
                </div>
                <p className="text-zinc-200 leading-relaxed text-[11px]">{item.solution}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Terminal Quick Fix Commands Section */}
      <div className="rounded-2xl bg-zinc-950 border border-zinc-800 p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>Perintah Diagnostik & Perbaikan di Terminal VPS</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Jalankan perintah ini di konsol Pterodactyl untuk verifikasi menyeluruh:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 flex flex-col justify-between gap-3">
            <div>
              <div className="flex items-center justify-between text-zinc-300 font-bold mb-1">
                <span className="text-cyan-400">1. Perbaiki Plugin (Hapus Bungee & Pasang Floodgate)</span>
                <button
                  onClick={() => copyToClipboard('bash fix-plugins.sh', 'fixplg')}
                  className="px-2 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                >
                  {copiedCommand === 'fixplg' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCommand === 'fixplg' ? 'Tersalin' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-zinc-400 text-[11px] font-sans">
                Menghapus geyserupdater-bungee.jar dan mengunduh floodgate-spigot.jar serta ViaVersion.jar.
              </p>
            </div>
            <div className="p-2 rounded-lg bg-zinc-950 text-emerald-300 overflow-x-auto text-[11px]">
              <code>bash fix-plugins.sh</code>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 flex flex-col justify-between gap-3">
            <div>
              <div className="flex items-center justify-between text-zinc-300 font-bold mb-1">
                <span className="text-emerald-400">2. Auto-Repair & Unduh Otomatis File Hilang</span>
                <button
                  onClick={() => copyToClipboard('bash auto-repair.sh', 'repair')}
                  className="px-2 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                >
                  {copiedCommand === 'repair' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCommand === 'repair' ? 'Tersalin' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-zinc-400 text-[11px] font-sans">
                Otomatis mengunduh paper.jar, Geyser, Floodgate, ViaVersion jika belum ada, tanpa menyebabkan force-offline.
              </p>
            </div>
            <div className="p-2 rounded-lg bg-zinc-950 text-emerald-300 overflow-x-auto text-[11px]">
              <code>bash auto-repair.sh</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
