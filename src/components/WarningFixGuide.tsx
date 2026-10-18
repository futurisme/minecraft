import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Terminal,
  FileArchive,
  Copy,
  Check,
  Zap,
  ArrowRight,
  ShieldCheck,
  Server,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { ServerSpec } from '../utils/minecraftConfig.ts';

interface WarningFixGuideProps {
  spec: ServerSpec;
}

import { JAR_URLS, downloadDirectJar } from '../utils/zipDownloader.ts';

export const WarningFixGuide: React.FC<WarningFixGuideProps> = ({ spec }) => {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const jarDownloadCommand = `curl -L -o paper.jar "https://api.purpurmc.org/v2/purpur/1.21.4/latest/download" && echo "eula=true" > eula.txt`;
  const allJarsCommand = `bash download-server-jars.sh`;

  const fixScriptCommand = `cd /root/minecraft || cd /home/container\nbash fix-animasi-pack.sh`;

  const manualFlattenCommand = `cd plugins/Geyser-Spigot/packs
mkdir -p /tmp/fix_pack && unzip -q animasi.mcpack -d /tmp/fix_pack
cd /tmp/fix_pack
# Ratakan isi folder Actions And Stuff ke root
if [ -d "Actions And Stuff 1.9" ]; then
  mv "Actions And Stuff 1.9"/* . && rm -rf "Actions And Stuff 1.9"
fi
zip -q -r -9 ../animasi_fixed.mcpack ./*
cd .. && mv animasi_fixed.mcpack animasi.mcpack && rm -rf /tmp/fix_pack
echo "Selesai! Restart server."`;

  return (
    <div className="space-y-6">
      {/* CRITICAL CRASH FIX: paper.jar Missing in Pterodactyl */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-rose-950/50 via-zinc-900 to-zinc-950 border border-rose-500/40 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping shrink-0" />
            <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">
              Diagnosa Crash Utama: File paper.jar Belum Ada di Server
            </span>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30">
            Exit Code: 1
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 font-mono text-xs text-rose-300 space-y-1">
          <div className="text-zinc-500">// Log Error dari Konsol Pterodactyl Anda:</div>
          <div className="text-zinc-400">container@pterodactyl~ java ... -jar paper.jar</div>
          <div className="text-rose-400 font-bold">Error: Unable to access jarfile paper.jar</div>
          <div className="text-zinc-500">[Pterodactyl Daemon]: Detected server process in a crashed state!</div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
            <span>Kenapa Crash Ini Terjadi & Bagaimana Solusinya?</span>
          </h3>
          <p className="text-xs text-zinc-300 leading-relaxed">
            Startup script panel Jagoan Hosting Anda menjalankan perintah <code className="text-rose-300 font-mono">-jar paper.jar</code>. 
            Karena file core Minecraft belum diunggah atau belum bernama <code className="text-emerald-400 font-mono">paper.jar</code>, container langsung berhenti (crashed).
          </p>
        </div>

        {/* 1-Click Fast Solutions for paper.jar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {/* Solution 1: 1-Click Bash Command */}
          <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-200">Cara 1: Ketik Perintah Ini di Konsol/Terminal</span>
              <button
                onClick={() => copyToClipboard(jarDownloadCommand, 'jarCmd')}
                className="text-xs text-zinc-400 hover:text-emerald-400 flex items-center gap-1 cursor-pointer transition-colors"
              >
                {copiedCmd === 'jarCmd' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 font-mono text-xs text-emerald-300 overflow-x-auto whitespace-pre-wrap select-all">
              {jarDownloadCommand}
            </pre>
            <p className="text-[11px] text-zinc-500">
              Perintah ini mengunduh core Purpur/Paper 1.21.4 terbaru sebagai <strong>paper.jar</strong> dan menyetujui EULA.
            </p>
          </div>

          {/* Solution 2: Direct JAR Downloads */}
          <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-2">
            <span className="text-xs font-bold text-zinc-200 block">Cara 2: Unduh File JAR Langsung & Upload via File Manager</span>
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => downloadDirectJar(JAR_URLS.paperJar, 'paper.jar')}
                type="button"
                className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-mono font-medium border border-emerald-500/40 flex items-center justify-between transition-colors cursor-pointer"
              >
                <span>📥 Download paper.jar (1.21.4 - 54MB)</span>
                <span className="text-[10px] text-emerald-400">Langsung</span>
              </button>
              <button
                onClick={() => downloadDirectJar(JAR_URLS.geyserJar, 'Geyser-Spigot.jar')}
                type="button"
                className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-mono font-medium border border-cyan-500/40 flex items-center justify-between transition-colors cursor-pointer"
              >
                <span>📥 Download Geyser-Spigot.jar (50MB)</span>
                <span className="text-[10px] text-cyan-400">Crossplay</span>
              </button>
              <button
                onClick={() => downloadDirectJar(JAR_URLS.floodgateJar, 'Floodgate-Spigot.jar')}
                type="button"
                className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-mono font-medium border border-amber-500/40 flex items-center justify-between transition-colors cursor-pointer"
              >
                <span>📥 Download Floodgate-Spigot.jar (11MB)</span>
                <span className="text-[10px] text-amber-400">Auth</span>
              </button>
              <button
                onClick={() => downloadDirectJar(JAR_URLS.viaVersionJar, 'ViaVersion.jar')}
                type="button"
                className="px-3 py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-xs font-mono font-medium border border-purple-500/40 flex items-center justify-between transition-colors cursor-pointer"
              >
                <span>📥 Download ViaVersion.jar (Multi-Version)</span>
                <span className="text-[10px] text-purple-400">100% Crossplay</span>
              </button>
            </div>
            <p className="text-[11px] text-zinc-400 pt-1">
              💡 Atau ketik <code className="text-emerald-300">bash auto-repair.sh</code> di konsol untuk mengunduh semua file ini secara otomatis tanpa force-offline.
            </p>
          </div>
        </div>
      </div>

      {/* Alert Diagnostic Card based on user's screenshot */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-950/40 via-zinc-900 to-zinc-950 border border-amber-500/30 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 text-xs font-mono font-semibold">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Diagnosa Konsol Stellar Panel (stellar.jagoanhosting.id)</span>
            </div>
            <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
              <span>Solusi Tuntas Spam Warning "animasi.mcpack" & Anti-Lag Spike</span>
            </h2>
            <p className="text-xs text-zinc-400 max-w-3xl leading-relaxed">
              Terdeteksi pada server <strong className="text-zinc-200">{spec.pterodactylServerName}</strong> ({spec.serverIp}:{spec.serverPort}): 
              Warning berulang <code className="text-amber-300">file in it that meets or exceeds 80 characters in its path</code> akibat struktur folder ganda pada pack <strong>Actions And Stuff 1.9</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs shrink-0">
            <div className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-center">
              <span className="text-[10px] text-zinc-500 block">IP Alokasi</span>
              <span className="text-emerald-400 font-bold">{spec.serverIp}</span>
            </div>
            <div className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-center">
              <span className="text-[10px] text-zinc-500 block">Port Alokasi</span>
              <span className="text-cyan-400 font-bold">{spec.serverPort}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison: Why the warning happens & How it causes Lag Spikes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Cause */}
        <div className="p-4 rounded-2xl bg-zinc-950 border border-rose-500/30 space-y-3">
          <div className="flex items-center gap-2 text-rose-400">
            <AlertTriangle className="w-4 h-4" />
            <h3 className="text-sm font-bold text-zinc-100">Penyebab Warning & Lag Spike</h3>
          </div>
          <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 font-mono text-[11px] text-rose-300 space-y-1">
            <div className="text-zinc-500">// Path file di dalam animasi.mcpack saat ini:</div>
            <div className="text-rose-400 break-all select-all">
              Actions And Stuff 1.9/textures/oreville/ans/uevpzvi/vfxdyjy_hhjhxlt...png
            </div>
            <div className="text-zinc-400 text-[10px] pt-1">
              Panjang: <strong>87 karakter</strong> (Batas standar Bedrock: 80 karakter).
            </div>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            <strong className="text-zinc-200">Dampak pada performa:</strong> Console Pterodactyl menulis ratusan baris log peringatan setiap kali server start atau reload. 
            Hal ini memicu <strong className="text-rose-400">disk I/O stall</strong> dan lonjakan lag (lag spike/TPS drop) pada vCPU Ryzen 9.
          </p>
        </div>

        {/* Resolution */}
        <div className="p-4 rounded-2xl bg-zinc-950 border border-emerald-500/30 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <h3 className="text-sm font-bold text-zinc-100">Solusi Perbaikan Bersih</h3>
          </div>
          <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 font-mono text-[11px] text-emerald-300 space-y-1">
            <div className="text-zinc-500">// Path setelah diratakan ke root zip:</div>
            <div className="text-emerald-400 break-all select-all">
              textures/oreville/ans/uevpzvi/vfxdyjy_hhjhxlt...png
            </div>
            <div className="text-zinc-400 text-[10px] pt-1">
              Panjang: <strong>65 karakter</strong> (Aman & 100% Bebas Warning).
            </div>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            <strong className="text-zinc-200">Hasil:</strong> Seluruh folder pembungkus terluar <code className="text-zinc-300">Actions And Stuff 1.9/</code> dihilangkan dan isinya dipindahkan ke tingkat paling atas (root). 
            Animasi Bedrock tetap berjalan 100% mulus tanpa satu pun warning di console!
          </p>
        </div>
      </div>

      {/* Action Plan: 2 Quick Ways to Fix */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <span>Pilih Cara Memperbaiki: Otomatis via Terminal atau File Manager</span>
        </h3>

        {/* Method 1: Automated Script */}
        <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-mono text-xs flex items-center justify-center font-bold">
                A
              </span>
              <h4 className="text-sm font-bold text-zinc-100">Metode 1: Eksekusi Otomatis (Rekomendasi - 10 Detik)</h4>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 self-start sm:self-auto">
              1-Click Script
            </span>
          </div>

          <p className="text-xs text-zinc-400">
            Jalankan script <code className="text-emerald-300 font-mono">fix-animasi-pack.sh</code> yang sudah kami sertakan di paket server. 
            Script ini otomatis mencari <code className="text-zinc-300">animasi.mcpack</code>, meratakan folder, dan mengompres ulang:
          </p>

          <div className="rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden font-mono text-xs">
            <div className="px-3.5 py-1.5 bg-zinc-950/60 border-b border-zinc-800 flex items-center justify-between text-[11px] text-zinc-500">
              <span>Terminal / SSH</span>
              <button
                onClick={() => copyToClipboard(fixScriptCommand, 'methodA')}
                type="button"
                className="text-zinc-300 hover:text-emerald-400 flex items-center gap-1 cursor-pointer transition-colors"
              >
                {copiedCmd === 'methodA' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-sans">Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span className="font-sans">Salin Perintah</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3.5 text-emerald-300 whitespace-pre-wrap">{fixScriptCommand}</pre>
          </div>
        </div>

        {/* Method 2: Pterodactyl File Manager */}
        <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-mono text-xs flex items-center justify-center font-bold">
                B
              </span>
              <h4 className="text-sm font-bold text-zinc-100">Metode 2: Lewat File Manager Stellar Jagoan Hosting</h4>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 self-start sm:self-auto">
              Tanpa SSH
            </span>
          </div>

          <ol className="space-y-2 text-xs text-zinc-300 list-decimal list-inside leading-relaxed">
            <li>
              Buka menu <strong className="text-white">Files</strong> di panel <code className="text-cyan-300 font-mono">stellar.jagoanhosting.id/server/b1736dee</code>.
            </li>
            <li>
              Masuk ke folder: <code className="text-cyan-300 font-mono">plugins/Geyser-Spigot/packs/</code>.
            </li>
            <li>
              Klik tanda titik tiga pada <code className="text-amber-300 font-mono">animasi.mcpack</code> lalu pilih <strong className="text-white">Unarchive</strong> (ekstrak).
            </li>
            <li>
              Buka folder hasil ekstrak <code className="text-zinc-200 font-mono">Actions And Stuff 1.9</code>, pilih semua isinya (<code className="text-emerald-400">manifest.json</code>, <code className="text-emerald-400">textures</code>, dll), lalu klik tombol <strong className="text-white">Move</strong> dan pindahkan langsung ke <code className="text-cyan-300 font-mono">plugins/Geyser-Spigot/packs/</code>.
            </li>
            <li>
              Pilih semua file tersebut di folder packs, klik <strong className="text-white">Archive</strong>, beri nama <code className="text-emerald-300 font-mono">animasi.mcpack</code>, lalu hapus folder kosong sebelumnya.
            </li>
            <li>
              Klik tombol <strong className="text-emerald-400">Restart Server</strong> di console. Console akan 100% bersih tanpa warning dan tanpa lag!
            </li>
          </ol>
        </div>

        {/* Method 3: Direct Shell Commands */}
        <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/30 font-mono text-xs flex items-center justify-center font-bold">
                C
              </span>
              <h4 className="text-sm font-bold text-zinc-100">Perintah Manual Bash 1-Baris (Jika menggunakan PuTTY/SSH)</h4>
            </div>
            <button
              onClick={() => copyToClipboard(manualFlattenCommand, 'methodC')}
              type="button"
              className="text-xs text-zinc-400 hover:text-emerald-400 flex items-center gap-1 cursor-pointer transition-colors"
            >
              {copiedCmd === 'methodC' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Skrip</span>
                </>
              )}
            </button>
          </div>

          <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 font-mono text-xs text-emerald-300 overflow-x-auto">
            <pre className="whitespace-pre">{manualFlattenCommand}</pre>
          </div>
        </div>
      </div>

      {/* Port 32144 Configuration Checklist */}
      <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
        <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>Verifikasi Keselarasan Port {spec.serverPort} & IP {spec.serverIp}</span>
        </h3>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Semua file konfigurasi pada aplikasi ini telah diselaraskan agar IP dan Port di Pterodactyl Anda ({spec.serverIp}:{spec.serverPort}) langsung tersambung:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
            <span className="text-emerald-400 font-bold block">server.properties</span>
            <span className="text-zinc-400 text-[11px] block mt-1">server-port={spec.serverPort}</span>
            <span className="text-zinc-400 text-[11px] block">query.port={spec.serverPort}</span>
          </div>
          <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
            <span className="text-cyan-400 font-bold block">Geyser-Spigot/config.yml</span>
            <span className="text-zinc-400 text-[11px] block mt-1">bedrock.port: {spec.serverPort}</span>
            <span className="text-zinc-400 text-[11px] block">remote.port: {spec.serverPort}</span>
          </div>
          <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
            <span className="text-amber-400 font-bold block">start.sh launcher</span>
            <span className="text-zinc-400 text-[11px] block mt-1">--port {spec.serverPort}</span>
            <span className="text-zinc-400 text-[11px] block">Aikar's G1GC 3GB</span>
          </div>
        </div>
      </div>
    </div>
  );
};
