import React, { useState } from 'react';
import {
  Server,
  FolderTree,
  Terminal,
  Activity,
  Sliders,
  Download,
  Check,
  Sparkles,
  Wifi,
  Smartphone,
  Laptop,
  Cpu,
  Layers,
  ShieldCheck,
  ShieldAlert,
  FileArchive,
  AlertTriangle,
  Zap,
  PackageOpen,
  ArrowRight,
  HardDrive,
} from 'lucide-react';
import { Navbar } from './components/Navbar.tsx';
import { CollapsibleHUD } from './components/CollapsibleHUD.tsx';
import { CodeExplorer } from './components/CodeExplorer.tsx';
import { DeploymentGuide } from './components/DeploymentGuide.tsx';
import { PerformanceDeepDive } from './components/PerformanceDeepDive.tsx';
import { ConfigCustomizer } from './components/ConfigCustomizer.tsx';
import { WarningFixGuide } from './components/WarningFixGuide.tsx';
import { MultiplayerDiagnostic } from './components/MultiplayerDiagnostic.tsx';
import { ManualPluginDownloader } from './components/ManualPluginDownloader.tsx';
import { AntiTimeoutGuide } from './components/AntiTimeoutGuide.tsx';
import { DEFAULT_SPEC, ServerSpec } from './utils/minecraftConfig.ts';
import { downloadUnifiedCoreZip } from './utils/zipDownloader.ts';

export default function App() {
  const [spec, setSpec] = useState<ServerSpec>(DEFAULT_SPEC);
  const [activeTab, setActiveTab] = useState<'antitimeout' | 'manual' | 'multiplayer' | 'files' | 'warningfix' | 'guide' | 'performance' | 'customizer'>('antitimeout');
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadProgressText, setDownloadProgressText] = useState<string>('');
  const [copiedBash, setCopiedBash] = useState<boolean>(false);
  const [isHudOpen, setIsHudOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  /**
   * UNIFIED SINGLE ZIP DOWNLOAD HANDLER
   * Packages only crucial scripts and configurations without heavy jars.
   * Total size is guaranteed < 1-2 MB (typically ~35 KB) and takes < 0.2s.
   */
  const handleDownloadUnifiedZip = async () => {
    try {
      setIsDownloading(true);
      setDownloadProgressText('Menyiapkan file konfigurasi & skrip inti...');
      const result = await downloadUnifiedCoreZip(spec, (status) => {
        setDownloadProgressText(`${status}`);
      });
      showToast(`✅ Berhasil mengunduh ZIP Inti (${result.sizeKb} KB)! Siap di-upload ke Pterodactyl.`);
    } catch (err) {
      console.error('Error generating unified core zip:', err);
      showToast('❌ Gagal membuat ZIP. Silakan gunakan perintah konsol 1-baris.');
    } finally {
      setIsDownloading(false);
      setDownloadProgressText('');
    }
  };

  const handleCopyBash = () => {
    const pterodactylCommand = `cd /home/container && curl -L -f -o paper.jar "https://api.purpurmc.org/v2/purpur/1.21.4/latest/download" && mkdir -p plugins && curl -L -f -o plugins/Geyser-Spigot.jar "https://download.geysermc.org/v2/projects/geyser/versions/latest/builds/latest/downloads/spigot" && curl -L -f -o plugins/Floodgate-Spigot.jar "https://download.geysermc.org/v2/projects/floodgate/versions/latest/builds/latest/downloads/spigot" && curl -L -f -o plugins/ViaVersion.jar "https://hangarcdn.papermc.io/plugins/ViaVersion/ViaVersion/versions/5.2.1/PAPER/ViaVersion-5.2.1.jar" && echo "eula=true" > eula.txt`;
    navigator.clipboard.writeText(pterodactylCommand);
    setCopiedBash(true);
    showToast('📋 Skrip 1-Baris Download Otomatis Pterodactyl tersalin ke clipboard!');
    setTimeout(() => setCopiedBash(false), 2500);
  };

  const handleResetSpec = () => {
    setSpec(DEFAULT_SPEC);
    showToast('🔄 Spesifikasi dikembalikan ke default IP 101.50.1.133 Port 32144');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-zinc-950">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-zinc-900 border border-emerald-500/50 text-emerald-300 text-xs font-mono shadow-2xl flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        spec={spec}
        onDownloadZip={handleDownloadUnifiedZip}
        isDownloading={isDownloading}
        copiedBash={copiedBash}
        onCopyBash={handleCopyBash}
        isHudOpen={isHudOpen}
        onToggleHud={() => setIsHudOpen((prev) => !prev)}
        onOpenManualPlugins={() => setActiveTab('manual')}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Hero Quick Banner with Unified Action */}
        <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-900/90 to-zinc-950 border border-zinc-800/90 shadow-xl relative overflow-hidden">
          {/* Subtle glow background */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2.5 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-medium flex-wrap">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Pterodactyl Panel ({spec.vpsProvider})</span>
                <span className="text-zinc-600">•</span>
                <span className="text-zinc-300 font-bold">{spec.serverIp}:{spec.serverPort}</span>
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-zinc-100 tracking-tight">
                Paket Konfigurasi Minecraft VPS Pterodactyl
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Tombol unduh ZIP telah disatukan: hanya mengompres berkas-berkas penting (<strong className="text-emerald-400">script, porting, dan konfigurasi</strong>) sehingga ukuran ZIP sangat kecil (<strong className="text-emerald-300">&lt; 1-2 MB</strong>, realita ~35 KB) dan selesai seketika. Modul besar seperti <strong className="text-zinc-200">paper.jar</strong> dan <strong className="text-zinc-200">plugin Minecraft</strong> dapat Anda unduh secara manual atau otomatis melalui konsol VPS.
              </p>
            </div>

            {/* UNIFIED ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 flex-wrap">
              {/* PRIMARY UNIFIED DOWNLOAD BUTTON */}
              <button
                onClick={handleDownloadUnifiedZip}
                disabled={isDownloading}
                type="button"
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 font-black text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-500/25 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                title="Unduh satu ZIP ringan (< 1-2 MB) berisi seluruh skrip dan konfigurasi Minecraft"
              >
                {isDownloading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                    <span>{downloadProgressText || 'Membuat ZIP...'}</span>
                  </>
                ) : (
                  <>
                    <FileArchive className="w-5 h-5 text-zinc-950" />
                    <div className="text-left">
                      <div>Unduh ZIP Inti (&lt; 1-2 MB)</div>
                      <div className="text-[10px] font-mono text-zinc-800 font-semibold -mt-0.5">Konfigurasi & Skrip Pterodactyl (~35 KB)</div>
                    </div>
                  </>
                )}
              </button>

              {/* ANTITIMEOUT QUICK JUMP BUTTON */}
              <button
                onClick={() => setActiveTab('antitimeout')}
                type="button"
                className="px-4 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-600 hover:from-rose-400 hover:to-amber-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-rose-500/25 active:scale-95 transition-all cursor-pointer"
                title="Buka Solusi Tuntas Error keepalive timeout & Matikan Semua Anticheat"
              >
                <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
                <span>Fix Keepalive Timeout (Fadhil Kick)</span>
              </button>

              {/* SECONDARY: OPEN MANUAL DOWNLOAD HUB */}
              <button
                onClick={() => setActiveTab('manual')}
                type="button"
                className="px-4 py-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-cyan-300 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-cyan-500/40 transition-all cursor-pointer active:scale-95 shadow-md"
                title="Buka Pusat Unduhan Manual Plugin & JAR Besar"
              >
                <PackageOpen className="w-4 h-4 text-cyan-400" />
                <span>Unduh Manual Plugin & JAR</span>
              </button>
            </div>
          </div>

          {/* Quick Checklist Badges */}
          <div className="relative z-10 mt-5 pt-4 border-t border-zinc-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="flex items-center gap-2 text-zinc-300">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Zero Keepalive Timeout (300s)</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-300">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Semua Anticheat & Kick Dimatikan</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-300">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>IP {spec.serverIp} Port {spec.serverPort}</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-300">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>ZIP Inti Ringan (&lt; 1-2 MB)</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav aria-label="Main Tabs" className="flex items-center gap-2 border-b border-zinc-800 pb-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('antitimeout')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'antitimeout'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>⚡ Solusi Timeout & Anticheat (Fadhil Kick Fix)</span>
          </button>

          <button
            onClick={() => setActiveTab('manual')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'manual'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
            }`}
          >
            <PackageOpen className="w-4 h-4 text-cyan-400" />
            <span>📦 Unduh Manual Plugin & Core JAR</span>
          </button>

          <button
            onClick={() => setActiveTab('multiplayer')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'multiplayer'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>🎮 Solusi Multiplayer & Diagnostik</span>
          </button>

          <button
            onClick={() => setActiveTab('files')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'files'
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
            }`}
          >
            <FolderTree className="w-4 h-4 text-emerald-400" />
            <span>📂 Penjelajah Berkas Inti (18 File)</span>
          </button>

          <button
            onClick={() => setActiveTab('warningfix')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'warningfix'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>⚠️ Panduan Fix Warning & Crash</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'guide'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
            }`}
          >
            <Terminal className="w-4 h-4 text-amber-400" />
            <span>📋 Panduan Pterodactyl & VPS</span>
          </button>

          <button
            onClick={() => setActiveTab('performance')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'performance'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
            }`}
          >
            <Activity className="w-4 h-4 text-sky-400" />
            <span>⚡ Optimasi Ryzen 9 & RAM 4GB</span>
          </button>

          <button
            onClick={() => setActiveTab('customizer')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'customizer'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
            }`}
          >
            <Sliders className="w-4 h-4 text-purple-400" />
            <span>⚙️ Kustomisasi Port & Spek</span>
          </button>
        </nav>

        {/* Tab Content Views */}
        <div>
          {activeTab === 'antitimeout' && (
            <AntiTimeoutGuide
              spec={spec}
              onDownloadZip={handleDownloadUnifiedZip}
              isDownloading={isDownloading}
            />
          )}

          {activeTab === 'manual' && (
            <ManualPluginDownloader spec={spec} />
          )}

          {activeTab === 'multiplayer' && (
            <MultiplayerDiagnostic spec={spec} onDownloadZip={handleDownloadUnifiedZip} />
          )}

          {activeTab === 'files' && (
            <CodeExplorer
              spec={spec}
              onDownloadZip={handleDownloadUnifiedZip}
              isDownloading={isDownloading}
            />
          )}

          {activeTab === 'warningfix' && (
            <WarningFixGuide spec={spec} />
          )}

          {activeTab === 'guide' && (
            <DeploymentGuide spec={spec} />
          )}

          {activeTab === 'performance' && (
            <PerformanceDeepDive />
          )}

          {activeTab === 'customizer' && (
            <ConfigCustomizer
              spec={spec}
              onChangeSpec={setSpec}
              onReset={handleResetSpec}
            />
          )}
        </div>
      </main>

      {/* Collapsible Mini HUD */}
      <CollapsibleHUD
        spec={spec}
        isCollapsed={!isHudOpen}
        onToggleCollapsed={() => setIsHudOpen((prev) => !prev)}
      />

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-6 mt-12 text-center text-xs text-zinc-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Minecraft VPS Jagoanhosting Suite (Pterodactyl Panel stellar.jagoanhosting.id)</span>
          </div>
          <div>
            Repositori GitHub: <span className="text-zinc-400 font-medium">github/futurisme/minecraft</span> (Tersimpan Permanen)
          </div>
        </div>
      </footer>
    </div>
  );
}
