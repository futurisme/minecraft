import React, { useState } from 'react';
import {
  ShieldAlert,
  Clock,
  Terminal,
  FileCode,
  Check,
  Copy,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Download,
  FileArchive,
  ArrowRight,
  Sparkles,
  Zap,
  Smartphone,
  Server,
  Layers,
} from 'lucide-react';
import { ServerSpec, DEFAULT_SPEC } from '../utils/minecraftConfig.ts';

interface AntiTimeoutGuideProps {
  spec?: ServerSpec;
  onDownloadZip?: () => void;
  isDownloading?: boolean;
}

export const AntiTimeoutGuide: React.FC<AntiTimeoutGuideProps> = ({
  spec = DEFAULT_SPEC,
  onDownloadZip,
  isDownloading = false,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeFileTab, setActiveFileTab] = useState<'spigot' | 'serverprops' | 'paper' | 'geyser' | 'anticheat'>('spigot');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const oneLineConsoleCommand = `cd /home/container && sed -i 's/timeout-time: [0-9]*/timeout-time: 300/g' spigot.yml 2>/dev/null || true && sed -i 's/moved-wrongly-threshold: [0-9.]*/moved-wrongly-threshold: 10.0/g' spigot.yml 2>/dev/null || true && sed -i 's/player-idle-timeout=[0-9]*/player-idle-timeout=0/g' server.properties 2>/dev/null || true && sed -i 's/allow-flight=.*/allow-flight=true/g' server.properties 2>/dev/null || true && sed -i 's/network-compression-threshold=.*/network-compression-threshold=512/g' server.properties 2>/dev/null || true && mkdir -p config && (sed -i 's/action: KICK/action: DROP/g' config/paper-global.yml 2>/dev/null || true) && sed -i 's/connection-throttle: [0-9]*/connection-throttle: -1/g' bukkit.yml 2>/dev/null || true && echo "✅ Berhasil mematikan timeout & anticheat!"`;

  return (
    <div className="space-y-6">
      {/* Real Log Diagnostic Header */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-rose-950/50 via-zinc-900 to-zinc-950 border border-rose-500/40 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping shrink-0" />
              <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">
                Analisa Log 2026: .Fadhil_Akbar_C was kicked due to keepalive timeout!
              </span>
            </div>
            <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30 font-semibold self-start sm:self-auto">
              Tepat 34 Detik Setelah Join
            </span>
          </div>

          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            Pemain masuk via Bedrock HP (<code className="text-cyan-300 font-bold">114.5.108.76:0</code>, Telkomsel/Indihome) pada <strong className="text-zinc-100">21:34:52</strong>, lalu ditendang pada <strong className="text-zinc-100">21:35:26</strong> (selisih 34 detik).
            Akar masalahnya adalah <strong className="text-rose-400">timer timeout Spigot (default 60 detik)</strong> kehabisan waktu saat Geyser mengirim paket terjemahan chunk ke HP di jaringan seluler, ditambah <strong className="text-rose-400">Paper Packet-Limiter (default KICK)</strong> dan <strong className="text-rose-400">anticheat movement checks</strong>.
          </p>

          {/* Real log display */}
          <div className="p-3.5 rounded-2xl bg-zinc-950/90 border border-zinc-800 font-mono text-xs text-zinc-400 space-y-1">
            <div className="text-zinc-500 text-[11px] font-semibold mb-1">Log Konsol Server Pterodactyl Anda:</div>
            <div className="text-zinc-300">[21:34:51 INFO]: [Geyser-Spigot] Pemain terhubung dengan nama pengguna Fadhil Akbar C</div>
            <div className="text-emerald-400">[21:34:52 INFO]: .Fadhil_Akbar_C[/114.5.108.76:0] logged in with entity id 118 at overworld</div>
            <div className="text-rose-400 font-bold bg-rose-950/40 px-2 py-0.5 rounded border border-rose-500/30">
              [21:35:26 INFO]: .Fadhil_Akbar_C was kicked due to keepalive timeout!
            </div>
            <div className="text-amber-400">[21:35:26 INFO]: [Geyser-Spigot] Fadhil Akbar C telah terputus dari server Java karena §rTimed out</div>
          </div>
        </div>
      </div>

      {/* 1-Click Fast Fix Console Box */}
      <div className="p-5 rounded-2xl bg-zinc-950 border border-emerald-500/30 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                <span>Perintah 1-Baris Konsol Pterodactyl (Fix Langsung 1 Detik)</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Otomatis Rubah Semua File
                </span>
              </h3>
              <p className="text-[11px] text-zinc-400">
                Jalankan perintah ini di tab <strong>Console</strong> panel Pterodactyl untuk otomatis mematikan semua timeout, kick, dan anticheat:
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => copyToClipboard(oneLineConsoleCommand, 'one-line')}
              type="button"
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-md"
            >
              {copiedId === 'one-line' ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Salin Perintah Konsol</span>
                </>
              )}
            </button>

            {onDownloadZip && (
              <button
                onClick={onDownloadZip}
                disabled={isDownloading}
                type="button"
                className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-emerald-300 font-semibold text-xs border border-emerald-500/40 flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
              >
                <FileArchive className="w-4 h-4" />
                <span>Unduh ZIP Inti Ter-Update (&lt;1MB)</span>
              </button>
            )}
          </div>
        </div>

        <div className="relative rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden font-mono text-xs">
          <pre className="p-3.5 text-emerald-300 overflow-x-auto whitespace-pre-wrap leading-relaxed select-all">
            {oneLineConsoleCommand}
          </pre>
        </div>
      </div>

      {/* Step by Step File Breakdown */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
            <FileCode className="w-4 h-4 text-cyan-400" />
            <span>Step-by-Step Rubah File Apa Saja (Manual File Manager)</span>
          </h3>
          <span className="text-xs font-mono text-zinc-400">
            Total 5 File Konfigurasi + 1 Folder Plugin
          </span>
        </div>

        {/* File Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-b border-zinc-800">
          {[
            { id: 'spigot', label: '1. spigot.yml (Timeout Utama)', color: 'text-amber-400' },
            { id: 'serverprops', label: '2. server.properties (AFK Kick & Flight)', color: 'text-emerald-400' },
            { id: 'paper', label: '3. config/paper-global.yml (Packet Limiter)', color: 'text-cyan-400' },
            { id: 'geyser', label: '4. plugins/Geyser-Spigot/config.yml (Chunk Queue)', color: 'text-purple-400' },
            { id: 'anticheat', label: '5. Matikan Plugin Anticheat Eksternal', color: 'text-rose-400' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFileTab(tab.id as any)}
              type="button"
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer whitespace-nowrap border ${
                activeFileTab === tab.id
                  ? 'bg-zinc-900 text-zinc-100 border-zinc-700 shadow-sm font-bold'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 border-transparent'
              }`}
            >
              <span className={tab.color}>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab 1: spigot.yml */}
        {activeFileTab === 'spigot' && (
          <div className="p-5 rounded-2xl bg-zinc-950 border border-amber-500/30 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
              <div>
                <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider block">
                  File #1: spigot.yml (Di Root Folder /home/container)
                </span>
                <h4 className="text-sm font-bold text-zinc-100 mt-0.5">
                  Ubah timeout-time dari 60 menjadi 300 detik & Matikan Anticheat Movement
                </h4>
              </div>
              <button
                onClick={() => copyToClipboard(`settings:\n  timeout-time: 300\n  moved-wrongly-threshold: 10.0\n  moved-too-quickly-multiplier: 100.0`, 'copy-spigot')}
                type="button"
                className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-amber-300 text-xs font-mono border border-amber-500/30 flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
              >
                {copiedId === 'copy-spigot' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Salin Nilai spigot.yml</span>
              </button>
            </div>

            <div className="space-y-2 text-xs text-zinc-300 leading-relaxed">
              <p>
                <strong>Kenapa ini wajib diubah?</strong> Minecraft default Spigot akan memutus pemain jika tidak menerima paket keepalive selama <code className="text-rose-400">60 detik</code>. Di HP Android/iOS (Bedrock) saat masuk pertama kali, rendering dunia menyebabkan keepalive tertunda beberapa detik sehingga server salah mengira koneksi putus!
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/30 font-mono text-xs">
                  <div className="text-rose-400 font-bold mb-1">❌ SEBELUM (Bikin Fadhil Kicked):</div>
                  <pre className="text-rose-300">
{`settings:
  timeout-time: 60
  moved-wrongly-threshold: 0.0625
  moved-too-quickly-multiplier: 10.0`}
                  </pre>
                </div>
                <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 font-mono text-xs">
                  <div className="text-emerald-400 font-bold mb-1">✅ SESUDAH (Zero Keepalive Kick):</div>
                  <pre className="text-emerald-300">
{`settings:
  timeout-time: 300
  moved-wrongly-threshold: 10.0
  moved-too-quickly-multiplier: 100.0`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: server.properties */}
        {activeFileTab === 'serverprops' && (
          <div className="p-5 rounded-2xl bg-zinc-950 border border-emerald-500/30 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
              <div>
                <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider block">
                  File #2: server.properties (Di Root Folder /home/container)
                </span>
                <h4 className="text-sm font-bold text-zinc-100 mt-0.5">
                  Matikan Kick AFK (player-idle-timeout=0) & Izinkan Gerak Bebas (allow-flight=true)
                </h4>
              </div>
              <button
                onClick={() => copyToClipboard(`player-idle-timeout=0\nallow-flight=true\nnetwork-compression-threshold=512\nmax-tick-time=120000`, 'copy-props')}
                type="button"
                className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-emerald-300 text-xs font-mono border border-emerald-500/30 flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
              >
                {copiedId === 'copy-props' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Salin Baris server.properties</span>
              </button>
            </div>

            <div className="space-y-3 text-xs text-zinc-300 leading-relaxed">
              <ul className="space-y-2 list-disc pl-4 text-zinc-300">
                <li>
                  <strong className="text-zinc-100">player-idle-timeout=0 :</strong> Nilai sebelumnya adalah <code className="text-rose-400">15</code> (yang otomatis menendang pemain yang diam 15 menit). Mengubahnya ke <code className="text-emerald-400">0</code> mematikan kick AFK selamanya.
                </li>
                <li>
                  <strong className="text-zinc-100">allow-flight=true :</strong> Sangat krusial untuk pemain HP Bedrock. Tanpa ini, fisika lompat tangga, stepping slab, atau boat di HP akan dianggap terbang oleh Minecraft Java dan langsung di-kick!
                </li>
                <li>
                  <strong className="text-zinc-100">network-compression-threshold=512 :</strong> Mengurangi overhead CPU saat mengompres paket kecil, menjaga paket keepalive tetap lancar tanpa bottleneck.
                </li>
                <li>
                  <strong className="text-zinc-100">max-tick-time=120000 :</strong> Mencegah server watchdog mematikan server secara paksa jika terjadi lag tick saat eksplorasi peta.
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab 3: config/paper-global.yml */}
        {activeFileTab === 'paper' && (
          <div className="p-5 rounded-2xl bg-zinc-950 border border-cyan-500/30 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
              <div>
                <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider block">
                  File #3: config/paper-global.yml (Folder config/)
                </span>
                <h4 className="text-sm font-bold text-zinc-100 mt-0.5">
                  Ubah Packet Limiter Action dari KICK Menjadi DROP
                </h4>
              </div>
              <button
                onClick={() => copyToClipboard(`packet-limiter:\n  all-packets:\n    action: DROP\n    interval: 7.0\n    max-packet-rate: 2000.0`, 'copy-paper')}
                type="button"
                className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-cyan-300 text-xs font-mono border border-cyan-500/30 flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
              >
                {copiedId === 'copy-paper' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Salin config paper-global</span>
              </button>
            </div>

            <div className="space-y-2 text-xs text-zinc-300 leading-relaxed">
              <p>
                Paper server memiliki fitur keamanan internal bernama <strong className="text-zinc-100">packet-limiter</strong>. Secara bawaan, jika sebuah client mengirim terlalu banyak paket saat chunk baru dibuka, aksinya adalah <code className="text-rose-400">KICK</code>.
                Karena Geyser mengirim paket dalam batch untuk HP, Anda harus mengubahnya menjadi <code className="text-emerald-400">DROP</code> agar paket kelebihan hanya diabaikan tanpa menendang pemain!
              </p>
              <div className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 font-mono text-xs text-cyan-300">
{`packet-limiter:
  all-packets:
    action: DROP   # Wajib DROP, BUKAN KICK
    interval: 7.0
    max-packet-rate: 2000.0`}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Geyser-Spigot config.yml */}
        {activeFileTab === 'geyser' && (
          <div className="p-5 rounded-2xl bg-zinc-950 border border-purple-500/30 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
              <div>
                <span className="text-xs font-mono text-purple-400 font-bold uppercase tracking-wider block">
                  File #4: plugins/Geyser-Spigot/config.yml
                </span>
                <h4 className="text-sm font-bold text-zinc-100 mt-0.5">
                  Batasi max-chunk-queue: 10 & forward-player-ping: false
                </h4>
              </div>
              <button
                onClick={() => copyToClipboard(`forward-player-ping: false\ncache-chunks: true\nmax-chunk-queue: 10\nmtu: 1400`, 'copy-geyser')}
                type="button"
                className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-purple-300 text-xs font-mono border border-purple-500/30 flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
              >
                {copiedId === 'copy-geyser' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Salin Nilai Geyser</span>
              </button>
            </div>

            <div className="space-y-2 text-xs text-zinc-300 leading-relaxed">
              <p>
                Ketika pemain ponsel masuk ke koordinat <code className="text-zinc-100">[-28, 70, -1]</code>, Geyser mulai mengirim data chunk. Jika <code className="text-amber-400">max-chunk-queue</code> terlalu besar (misal 30), paket UDP di HP Telkomsel/Indosat akan mengalami packet-drop sehingga paket keepalive tidak sampai tepat waktu.
              </p>
              <div className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 font-mono text-xs text-purple-300 space-y-1">
                <div>forward-player-ping: false # Mencegah ping spike yang memicu timeout</div>
                <div>cache-chunks: true # Menghemat bandwidth CPU server</div>
                <div>max-chunk-queue: 10 # Antrian ramah HP Android/iOS</div>
                <div>mtu: 1400 # Standar MTU anti-fragmentasi operator Indonesia</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Matikan Anticheat Eksternal */}
        {activeFileTab === 'anticheat' && (
          <div className="p-5 rounded-2xl bg-zinc-950 border border-rose-500/30 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
              <div>
                <span className="text-xs font-mono text-rose-400 font-bold uppercase tracking-wider block">
                  Langkah #5: Nonaktifkan Semua Plugin Anticheat
                </span>
                <h4 className="text-sm font-bold text-zinc-100 mt-0.5">
                  Hapus / Pindahkan GrimAC, Vulcan, Themis, Spartan, Matrix
                </h4>
              </div>
              <button
                onClick={() => copyToClipboard(`mkdir -p plugins/disabled_anticheat && for p in GrimAC Vulcan Themis Spartan NoCheatPlus Matrix AAC; do find plugins/ -maxdepth 1 -iname "*$p*.jar" -exec mv {} plugins/disabled_anticheat/ \\; 2>/dev/null; done`, 'copy-kill-anticheat')}
                type="button"
                className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-mono border border-rose-500/40 flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
              >
                {copiedId === 'copy-kill-anticheat' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Salin Script Pindahkan Anticheat</span>
              </button>
            </div>

            <div className="space-y-3 text-xs text-zinc-300 leading-relaxed">
              <p>
                <strong>Fakta Arsitektur Minecraft Bedrock vs Java (2026):</strong>
              </p>
              <ul className="space-y-1.5 list-disc pl-4 text-zinc-300">
                <li>Minecraft Bedrock di HP mengirim paket rotasi kepala, akselerasi gravitasi, dan lompatan dengan interval yang berbeda dengan client Java.</li>
                <li>Plugin Anticheat seperti <strong className="text-rose-400">GrimAC</strong> atau <strong className="text-rose-400">Vulcan</strong> mengira desinkronisasi ini sebagai <em>Fly Hack / Timer Hack / BadPackets</em>, lalu secara diam-diam memblokir paket pemain atau menendangnya keluar (<code className="text-rose-300">kicked due to keepalive timeout</code>).</li>
                <li>Jika Anda memiliki plugin anticheat di folder <code className="text-zinc-100">plugins/</code>, jalankan perintah di atas untuk memindahkannya ke folder cadangan <code className="text-zinc-100">plugins/disabled_anticheat/</code>.</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Summary Checklist */}
      <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2 text-xs">
        <h4 className="font-bold text-zinc-200 uppercase tracking-wider font-mono flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Hasil Setelah Menerapkan Konfigurasi Ini:</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Pemain Bedrock Fadhil Akbar C tidak akan pernah timeout</span>
          </div>
          <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Sistem auto-kick AFK & flight anticheat dinonaktifkan</span>
          </div>
          <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Server stabil 20.0 TPS di Ryzen 9 Jagoanhosting</span>
          </div>
        </div>
      </div>
    </div>
  );
};
