import React from 'react';
import { Download, Server, Cpu, HardDrive, MapPin, Sparkles, Check, FileArchive, PackageOpen } from 'lucide-react';
import { ServerSpec } from '../utils/minecraftConfig.ts';

interface NavbarProps {
  spec: ServerSpec;
  onDownloadZip: () => void;
  isDownloading: boolean;
  copiedBash: boolean;
  onCopyBash: () => void;
  isHudOpen?: boolean;
  onToggleHud?: () => void;
  onOpenManualPlugins?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  spec,
  onDownloadZip,
  isDownloading,
  copiedBash,
  onCopyBash,
  isHudOpen,
  onToggleHud,
  onOpenManualPlugins,
}) => {
  return (
    <header className="border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          {/* Logo & Server Specs */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-400/30 shrink-0">
              <Server className="w-5 h-5 text-zinc-950 font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-zinc-100 tracking-tight flex items-center gap-2">
                  <span>Minecraft VPS Jagoanhosting</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-semibold">
                    Pterodactyl Panel
                  </span>
                </h1>
              </div>
              <p className="text-xs text-zinc-400 flex items-center gap-2 flex-wrap">
                <span className="text-zinc-300 font-medium">stellar.jagoanhosting.id</span>
                <span className="inline-block w-1 h-1 rounded-full bg-zinc-700" />
                <span className="text-cyan-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3 inline" /> Jakarta (IDIX Cyber)
                </span>
                <span className="inline-block w-1 h-1 rounded-full bg-zinc-700" />
                <span className="text-amber-400 font-mono">Bedrock 📱 + Java 💻</span>
              </p>
            </div>
          </div>

          {/* Quick Specs Badges */}
          <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
            <div className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-1.5 shadow-sm font-bold">
              <Server className="w-3.5 h-3.5 text-emerald-400" />
              <span>{spec.serverIp}:{spec.serverPort}</span>
            </div>
            <div className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 flex items-center gap-1.5 shadow-sm">
              <Cpu className="w-3.5 h-3.5 text-rose-400" />
              <span>Ryzen 9 (200% CPU)</span>
            </div>
            <div className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 flex items-center gap-1.5 shadow-sm">
              <HardDrive className="w-3.5 h-3.5 text-sky-400" />
              <span>4GB RAM + 30GB NVMe</span>
            </div>
          </div>

          {/* Action Buttons: Unified Single Download + Quick Scripts */}
          <div className="flex items-center gap-2 flex-wrap">
            {onOpenManualPlugins && (
              <button
                onClick={onOpenManualPlugins}
                type="button"
                className="px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-cyan-300 text-xs font-medium border border-cyan-500/40 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-sm"
                title="Buka Unduhan Manual Plugin & Server Core JAR"
              >
                <PackageOpen className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Unduh Manual</span>
                <span>Plugin & JAR</span>
              </button>
            )}

            <button
              onClick={onCopyBash}
              type="button"
              className="px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-medium border border-zinc-700/60 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-sm"
              title="Salin perintah auto-setup untuk konsol Pterodactyl"
            >
              {copiedBash ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Tersalin!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Copy Skrip Konsol</span>
                </>
              )}
            </button>

            {/* UNIFIED SINGLE ZIP DOWNLOAD BUTTON */}
            <button
              onClick={onDownloadZip}
              disabled={isDownloading}
              type="button"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-zinc-950 font-bold text-xs transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/25 active:scale-95 cursor-pointer disabled:opacity-50"
              title="Unduh seluruh skrip, porting, dan konfigurasi server dalam satu ZIP ringan (< 1-2 MB)"
            >
              {isDownloading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                  <span>Membuat ZIP...</span>
                </>
              ) : (
                <>
                  <FileArchive className="w-4 h-4 text-zinc-950" />
                  <span>Unduh ZIP Inti (&lt; 1-2 MB)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
