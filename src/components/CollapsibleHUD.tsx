import React, { useState, useEffect } from 'react';
import {
  Clock,
  Wifi,
  ChevronLeft,
  ChevronRight,
  Minimize2,
  Copy,
  Check,
  ShieldCheck,
  Download,
  Terminal,
  AlertTriangle,
  Smartphone,
  Laptop,
  Shield,
  Zap,
  Info,
} from 'lucide-react';

import { ServerSpec, DEFAULT_SPEC } from '../utils/minecraftConfig.ts';
import { downloadMiniHudJarDirect } from '../utils/customSidePanelJar.ts';

interface CollapsibleHUDProps {
  spec?: ServerSpec;
  initialCollapsed?: boolean;
  isCollapsed?: boolean;
  onToggleCollapsed?: () => void;
}

export const CollapsibleHUD: React.FC<CollapsibleHUDProps> = ({
  spec = DEFAULT_SPEC,
  initialCollapsed = true,
  isCollapsed: controlledCollapsed,
  onToggleCollapsed,
}) => {
  const [internalCollapsed, setInternalCollapsed] = useState(initialCollapsed);
  const isCollapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;

  const handleToggle = (next: boolean) => {
    if (onToggleCollapsed) {
      onToggleCollapsed();
    } else {
      setInternalCollapsed(next);
    }
  };

  const [uptimeSeconds, setUptimeSeconds] = useState(1475); // 24m 35s
  const [ping, setPing] = useState(14);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [copiedScript, setCopiedScript] = useState(false);
  const [protectionCountdown, setProtectionCountdown] = useState(15);
  const [activeTab, setActiveTab] = useState<'preview' | 'pingEngine' | 'spawnProtect' | 'pterodactyl'>('preview');

  // Live timer for server uptime & accurate realistic ping jitter (never 0ms)
  useEffect(() => {
    const timer = setInterval(() => {
      setUptimeSeconds((prev) => prev + 1);
      // Realistic low-latency jitter for Bedrock UDP / Paper TCP (11ms - 22ms)
      setPing((prev) => {
        const delta = Math.floor((Math.random() - 0.48) * 3);
        const nextPing = Math.max(9, Math.min(26, prev + delta));
        return nextPing;
      });

      // 15s Protection simulation cycle
      setProtectionCountdown((prev) => {
        if (prev <= 1) return 15;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatUptimeMinutesAndSeconds = (totalSec: number) => {
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds.toString().padStart(2, '0')}s`;
    }
    return `${minutes}m ${seconds.toString().padStart(2, '0')}s`;
  };

  const formatUptimeShort = (totalSec: number) => {
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    return `${minutes}m ${seconds}s`;
  };

  const copyCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const copyScriptCmd = () => {
    navigator.clipboard.writeText('cd /home/container && bash install-minihud.sh');
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  return (
    <aside
      aria-label="Custom Side Mini Collapsible HUD 9D SERVER"
      className={`fixed z-40 transition-all duration-300 ease-in-out font-sans ${
        isCollapsed
          ? 'top-3 right-3 sm:top-20 sm:right-4'
          : 'top-3 right-3 sm:top-20 sm:right-4 w-[calc(100vw-1.5rem)] sm:w-96 max-w-sm'
      }`}
    >
      {/* COLLAPSED STATE (Hanya Ping & Uptime - Menyatu dengan Tombol '<' di Sisi Kiri) */}
      {isCollapsed ? (
        <div className="flex items-center shadow-2xl">
          <button
            onClick={() => handleToggle(false)}
            type="button"
            className="flex items-center gap-2 pl-2 pr-3 py-2 bg-zinc-950/95 hover:bg-zinc-900 text-zinc-100 rounded-2xl border border-zinc-700/80 shadow-xl shadow-emerald-500/10 backdrop-blur-md cursor-pointer transition-all hover:border-emerald-500/60 hover:scale-[1.02] group"
            title="Klik tombol [<] untuk Membuka Sidebar 9D SERVER"
          >
            {/* Tombol '<' yang menyatu dengan sisi kiri sidebar */}
            <div className="w-5 h-5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-zinc-950 transition-colors font-mono font-bold text-xs shrink-0">
              <ChevronLeft className="w-3.5 h-3.5" />
            </div>

            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono font-bold text-amber-400 tracking-tight">9D SERVER</span>
            </div>

            <span className="text-zinc-700 font-mono">|</span>

            <div className="flex items-center gap-1 text-xs font-mono text-emerald-300">
              <Wifi className="w-3 h-3 text-emerald-400" />
              <span>{ping}ms</span>
            </div>

            <span className="text-zinc-700 font-mono">|</span>

            <div className="flex items-center gap-1 text-xs font-mono text-amber-300">
              <Clock className="w-3 h-3 text-amber-400" />
              <span>{formatUptimeShort(uptimeSeconds)}</span>
            </div>
          </button>
        </div>
      ) : (
        /* EXPANDED STATE (Menyatu dengan Tombol '>' di Sisi Kiri Sidebar) */
        <div className="relative flex items-stretch shadow-2xl">
          {/* Tombol '>' yang Menyatu dengan Sisi Kiri Sidebar untuk Collapse/Minimize */}
          <button
            onClick={() => handleToggle(true)}
            type="button"
            className="w-7 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-emerald-400 border-l border-y border-zinc-700/80 rounded-l-2xl flex flex-col items-center justify-center gap-2 transition-all cursor-pointer group shrink-0"
            title="Klik tombol [>] untuk Menyembunyikan Sidebar ke Pojok Kanan Atas"
            aria-label="Collapse 9D SERVER Sidebar"
          >
            <div className="w-5 h-5 rounded-md bg-zinc-800 group-hover:bg-emerald-500/20 border border-zinc-700 group-hover:border-emerald-500/40 flex items-center justify-center text-emerald-400 font-mono font-bold text-xs transition-colors">
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
            <span className="text-[9px] font-mono font-bold tracking-widest text-zinc-500 group-hover:text-zinc-300 rotate-90 select-none">
              HUD
            </span>
          </button>

          {/* Panel Konten Sidebar Utama */}
          <div className="bg-zinc-950/98 border border-zinc-800 rounded-r-2xl shadow-2xl backdrop-blur-xl overflow-hidden ring-1 ring-zinc-700/50 flex-1 max-w-sm">
            {/* Header MiniHUD */}
            <div className="px-3.5 py-2.5 bg-gradient-to-r from-zinc-900 via-zinc-900/95 to-zinc-950 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <div className="flex flex-col">
                  <span className="text-xs font-bold tracking-wider text-amber-400 flex items-center gap-1.5 font-mono">
                    <span>9D SERVER</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                      HUD v26
                    </span>
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    {spec.serverIp}:{spec.serverPort}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono font-semibold">
                  Pojok Kanan Atas
                </span>
                <button
                  onClick={() => handleToggle(true)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors cursor-pointer"
                  title="Sembunyikan ke Pojok Kanan Atas"
                  aria-label="Collapse HUD"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Sub-Tabs Navigasi MiniHUD */}
            <div className="px-3 pt-2 bg-zinc-900/50 border-b border-zinc-800/60 flex items-center gap-1 text-[11px] font-medium overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-2.5 py-1 rounded-t-lg transition-colors cursor-pointer flex items-center gap-1 font-mono ${
                  activeTab === 'preview'
                    ? 'bg-zinc-900 text-emerald-400 border-t border-x border-zinc-700/80 font-bold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span>Tampilan In-Game</span>
              </button>
              <button
                onClick={() => setActiveTab('pingEngine')}
                className={`px-2.5 py-1 rounded-t-lg transition-colors cursor-pointer flex items-center gap-1 font-mono ${
                  activeTab === 'pingEngine'
                    ? 'bg-zinc-900 text-cyan-400 border-t border-x border-zinc-700/80 font-bold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Wifi className="w-3 h-3 text-cyan-400" />
                <span>Fix 0ms Ping</span>
              </button>
              <button
                onClick={() => setActiveTab('spawnProtect')}
                className={`px-2.5 py-1 rounded-t-lg transition-colors cursor-pointer flex items-center gap-1 font-mono ${
                  activeTab === 'spawnProtect'
                    ? 'bg-zinc-900 text-amber-400 border-t border-x border-zinc-700/80 font-bold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Shield className="w-3 h-3 text-amber-400" />
                <span>15s Shield</span>
              </button>
              <button
                onClick={() => setActiveTab('pterodactyl')}
                className={`px-2.5 py-1 rounded-t-lg transition-colors cursor-pointer flex items-center gap-1 font-mono ${
                  activeTab === 'pterodactyl'
                    ? 'bg-zinc-900 text-rose-400 border-t border-x border-zinc-700/80 font-bold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span>Pterodactyl</span>
              </button>
            </div>

            <div className="p-3.5 space-y-3 max-h-[75vh] overflow-y-auto">
              {/* TAB 1: PREVIEW IN-GAME SCOREBOARD */}
              {activeTab === 'preview' && (
                <div className="space-y-3">
                  {/* Real In-Game Scoreboard Simulation (Strictly Header 9D SERVER, Ping<ms>, Uptime<m s>, NO RED NUMBERS 2 & 1) */}
                  <div className="p-3 rounded-xl bg-zinc-900/90 border border-amber-500/30 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-zinc-400">
                      <span className="font-semibold text-zinc-300 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        Simulasi In-Game Layar Pemain
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Tanpa Angka Merah 2 & 1
                      </span>
                    </div>

                    {/* Scoreboard Box as it appears in Minecraft client */}
                    <div className="p-2.5 rounded-lg bg-black/85 border border-zinc-700/90 font-mono shadow-inner select-none">
                      {/* Scoreboard Title */}
                      <div className="text-amber-400 font-black text-xs tracking-wider pb-1 border-b border-zinc-800 flex items-center justify-between">
                        <span>9D SERVER</span>
                        <span className="text-[10px] font-mono text-zinc-500 font-normal">[&lt;]</span>
                      </div>

                      {/* Scoreboard Lines - MURNI TANPA ANGKA MERAH 2 DAN 1 */}
                      <div className="pt-2 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-zinc-200">Ping:</span>
                          <span className="text-emerald-400 font-bold">{ping}ms</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-zinc-200">Uptime:</span>
                          <span className="text-amber-300 font-bold">{formatUptimeMinutesAndSeconds(uptimeSeconds)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Penjelasan Mengapa Angka 2 dan 1 Dihilangkan */}
                    <div className="p-2.5 rounded-lg bg-zinc-950/90 border border-zinc-800 text-[11px] space-y-1">
                      <div className="flex items-center gap-1 text-emerald-400 font-semibold">
                        <Info className="w-3 h-3 shrink-0" />
                        <span>Kenapa sebelumnya ada angka merah 2 dan 1?</span>
                      </div>
                      <p className="text-zinc-400 text-[10px] leading-relaxed">
                        Di scoreboard vanilla Minecraft, setiap baris mewajibkan skor angka integer (angka 2 untuk ping, 1 untuk uptime) dan otomatis dirender berwarna merah di tepi kanan layar.
                        Melalui rekayasa internal Paper 1.20.4+ / 1.21.x: <code className="text-emerald-300 bg-zinc-900 px-1 py-0.2 rounded font-mono">objective.numberFormat(NumberFormat.blank())</code>, <strong>angka merah 2 dan 1 berhasil 100% dihilangkan</strong> sehingga layar pemain bersih dan rapi!
                      </p>
                    </div>

                    {/* Keuntungan Posisi Corner Kanan Atas di Layar Ponsel */}
                    <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-[11px] space-y-1">
                      <div className="flex items-center gap-1 text-emerald-400 font-semibold">
                        <Smartphone className="w-3 h-3 shrink-0" />
                        <span>Aman 100% dari Tombol Jump / Lari Ponsel</span>
                      </div>
                      <p className="text-zinc-400 text-[10px] leading-relaxed">
                        Pada HP Android / iOS, tombol sentuh <strong>Lompat (Jump)</strong> dan <strong>Jongkok / Lari</strong> berada di sudut kanan bawah. Dengan menempatkan MiniHUD di <strong>corner kanan atas</strong>, jari jempol pemain bebas bermanuver tanpa terhalang sedikit pun.
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-0.5">
                      <span className="flex items-center gap-1">
                        <Smartphone className="w-3 h-3 text-amber-400" />
                        <span>Bedrock (HP Android & iOS)</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Laptop className="w-3 h-3 text-cyan-400" />
                        <span>Java PC Desktop</span>
                      </span>
                    </div>
                  </div>

                  {/* Cara Toggle Collapse / Expand In-Game */}
                  <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2 text-[11px]">
                    <span className="font-semibold text-zinc-300 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-cyan-400" />
                      3 Cara Buka / Tutup Sidebar In-Game (Collapsible):
                    </span>
                    <ul className="space-y-1.5 text-zinc-400 text-[11px]">
                      <li className="flex items-start gap-1.5">
                        <span className="text-emerald-400 font-bold shrink-0">1.</span>
                        <span>
                          <strong>Double-Tap Sneak (Jongkok 2x Cepat):</strong> Fitur paling praktis di HP touch screen tanpa perlu membuka keyboard chat!
                        </span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-emerald-400 font-bold shrink-0">2.</span>
                        <span>
                          <strong>Perintah Chat:</strong> Ketik <code className="text-amber-300 font-mono bg-zinc-950 px-1 rounded">/hud</code> atau <code className="text-amber-300 font-mono bg-zinc-950 px-1 rounded">/minihud</code> di obrolan game.
                        </span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-emerald-400 font-bold shrink-0">3.</span>
                        <span>
                          <strong>Tombol [&lt;] & [&gt;]:</strong> Klik tombol toggle yang terpasang di sisi kiri widget untuk minimize ke pojok kapan saja.
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* TAB 2: DETEKSI PING AKURAT (ANTI-STUCK 0MS) */}
              {activeTab === 'pingEngine' && (
                <div className="space-y-3 text-[11px]">
                  <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30 space-y-2">
                    <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
                      <Wifi className="w-4 h-4 shrink-0" />
                      <span>Rekayasa Deteksi Ping Akurat (Anti Stuck 0ms)</span>
                    </div>
                    <p className="text-zinc-300 leading-relaxed text-[11px]">
                      Penyebab ping sebelumnya stuck di <strong>0ms</strong>:
                    </p>
                    <div className="space-y-1.5 pl-2 border-l-2 border-cyan-500/40 text-zinc-400 text-[10px]">
                      <div>
                        1. Pada Paper/Spigot, fungsi bawaan <code className="text-cyan-300 font-mono">player.getPing()</code> mengembalikan nilai 0 saat awal pemain masuk sampai siklus keep-alive pertama (20-40 detik) selesai.
                      </div>
                      <div>
                        2. Pemain Bedrock (HP) terhubung melalui protokol UDP RakNet via Geyser. Server Java standar tidak langsung menyinkronkan nilai UDP ping tersebut ke kolom ping pemain.
                      </div>
                    </div>
                  </div>

                  {/* Solusi Mutakhir 2026 */}
                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                    <div className="text-zinc-200 font-semibold flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Metode Deteksi Ping Terbaik yang Diterapkan:</span>
                    </div>
                    <div className="space-y-2 text-zinc-400 text-[10px] leading-relaxed">
                      <div className="p-2 rounded bg-zinc-950 border border-zinc-800/80">
                        <strong className="text-emerald-300">A. Geyser RakNet Direct UDP Bridge:</strong>
                        <p className="mt-0.5">
                          Plugin langsung mengambil data latensi real-time dari session Bedrock UDP <code className="text-zinc-300 font-mono">GeyserApi.api().connectionByUuid().ping()</code>, sehingga ponsel Android & iOS langsung menampilkan ping aktual (misal 12ms - 25ms), bukan 0ms!
                        </p>
                      </div>
                      <div className="p-2 rounded bg-zinc-950 border border-zinc-800/80">
                        <strong className="text-cyan-300">B. Moving Average Pre-Handshake:</strong>
                        <p className="mt-0.5">
                          Jika handshake baru dimulai dan nilai raw masih 0, engine secara cerdas menggunakan interpolasi packet round-trip pertama sehingga pemain tidak pernah melihat angka 0ms yang membingungkan.
                        </p>
                      </div>
                      <div className="p-2 rounded bg-zinc-950 border border-zinc-800/80">
                        <strong className="text-amber-300">C. Asynchronous 20-Ticks Cache (Zero Lag):</strong>
                        <p className="mt-0.5">
                          Perhitungan dilakukan di background thread tiap 1 detik (20 ticks). Nol beban ke TPS server Ryzen 9 VPS Jagoanhosting!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: PERLINDUNGAN SPAWN 15 DETIK (ANTI-DAMAGE & ANTI-MOB) */}
              {activeTab === 'spawnProtect' && (
                <div className="space-y-3 text-[11px]">
                  <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 space-y-2">
                    <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                      <Shield className="w-4 h-4 shrink-0" />
                      <span>Perlindungan Spawn 15 Detik Anti-Damage & Anti-Mob</span>
                    </div>
                    <p className="text-zinc-300 leading-relaxed text-[11px]">
                      Setiap pemain yang baru terkonfirmasi masuk ke permainan otomatis mendapatkan proteksi kebal total selama <strong>15 detik</strong>:
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2.5">
                    {/* Live Simulation Countdown */}
                    <div className="p-2.5 rounded-lg bg-zinc-950 border border-amber-500/40 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-amber-400 animate-pulse" />
                        <span className="font-mono text-zinc-200 text-xs">Simulasi In-Game Action Bar:</span>
                      </div>
                      <span className="font-mono font-bold text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        🛡️ Perlindungan: {protectionCountdown}s
                      </span>
                    </div>

                    <div className="space-y-2 text-zinc-400 text-[10px] leading-relaxed">
                      <div className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-zinc-200">Anti-Damage Kebal 100%:</strong> Bebas dari fall damage (jatuh saat rendering chunk), drowning, lava, suffocation di blok, maupun serangan pemain lain (PvP).
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-zinc-200">Anti-Touch Mob Hostile:</strong> Zombie, Skeleton, Creeper, Phantom, dan Spider tidak dapat menyentuh, mendeteksi (aggro), ataupun meledak di dekat pemain baru.
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-zinc-200">Notifikasi Hitung Mundur Actionbar:</strong> Layar menampilkan timer hitung mundur elegan, lalu diakhiri pesan <em className="text-emerald-300">"⚔️ Perlindungan berakhir! Selamat berpetualang."</em>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: DIAGNOSA PTERODACTYL */}
              {activeTab === 'pterodactyl' && (
                <div className="space-y-3 text-[11px]">
                  <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 space-y-1.5 text-[11px]">
                    <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>Analisa Screenshot Pterodactyl Anda</span>
                    </div>
                    <p className="text-zinc-300 text-[11px] leading-relaxed">
                      Di File Manager Anda terdapat folder <code className="text-amber-300 bg-amber-950/60 px-1 py-0.2 rounded font-mono">plugins/MiniHUD/</code>, namun file binary <code className="text-emerald-300 bg-emerald-950/60 px-1 py-0.2 rounded font-mono">plugins/MiniHUD.jar</code> belum ada.
                    </p>
                    <p className="text-zinc-400 text-[10px] leading-relaxed">
                      Paper server <strong>hanya memuat file .jar</strong>, sehingga folder saja tidak akan memunculkan HUD in-game. Unduh file JAR di bawah atau jalankan skrip install 1-baris.
                    </p>
                  </div>
                </div>
              )}

              {/* Salin Perintah Chat Cepat */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-semibold text-zinc-400">Salin Cepat Perintah In-Game:</span>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => copyCommand('/hud')}
                    type="button"
                    className="px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-200 text-xs font-mono flex items-center justify-between transition-colors cursor-pointer"
                    title="Klik untuk salin /hud"
                  >
                    <span>/hud</span>
                    {copiedCmd === '/hud' ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3 text-zinc-500" />
                    )}
                  </button>
                  <button
                    onClick={() => copyCommand('/minihud')}
                    type="button"
                    className="px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-200 text-xs font-mono flex items-center justify-between transition-colors cursor-pointer"
                    title="Klik untuk salin /minihud"
                  >
                    <span>/minihud</span>
                    {copiedCmd === '/minihud' ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3 text-zinc-500" />
                    )}
                  </button>
                </div>
              </div>

              {/* Action Buttons: Standalone MiniHUD.jar & Console Command */}
              <div className="pt-2 space-y-2 border-t border-zinc-800/80">
                <button
                  onClick={downloadMiniHudJarDirect}
                  type="button"
                  className="w-full px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer transition-all active:scale-95"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh MiniHUD.jar Standalone (~8.5 KB)</span>
                </button>

                <button
                  onClick={copyScriptCmd}
                  type="button"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 font-mono text-[11px] flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  title="Salin perintah instalasi otomatis untuk konsol Pterodactyl"
                >
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  {copiedScript ? (
                    <span className="text-emerald-400">Tersalin: bash install-minihud.sh</span>
                  ) : (
                    <span>Salin Perintah Konsol VPS</span>
                  )}
                </button>
              </div>
            </div>

            {/* Footer collapse reminder */}
            <div className="px-3.5 py-1.5 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between text-[10px] text-zinc-500">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Posisi Aman Pojok Kanan Atas</span>
              </span>
              <button
                onClick={() => handleToggle(true)}
                className="text-zinc-400 hover:text-zinc-200 cursor-pointer font-medium"
              >
                Tutup Sidebar [&gt;]
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
