import React, { useState } from 'react';
import {
  Terminal,
  Copy,
  Check,
  Server,
  Smartphone,
  Laptop,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Cpu,
  Flame,
  ArrowRight,
} from 'lucide-react';

import { ServerSpec, DEFAULT_SPEC } from '../utils/minecraftConfig.ts';

interface DeploymentGuideProps {
  spec?: ServerSpec;
}

interface Step {
  id: number;
  title: string;
  badge: string;
  desc: string;
  command?: string;
  substeps?: string[];
  tips?: string;
}

const STEPS: Step[] = [
  {
    id: 1,
    title: 'Akses SSH ke VPS Jagoan Hosting',
    badge: 'Koneksi Awal',
    desc: 'Buka terminal di Mac/Linux atau PuTTY/PowerShell di Windows, lalu login dengan IP VPS Jagoan Hosting Anda:',
    command: 'ssh root@IP_VPS_JAGOAN_HOSTING',
    tips: 'Password root didapatkan dari email selamat datang atau menu VPS di client area Jagoan Hosting.',
  },
  {
    id: 2,
    title: 'Buat Direktori & Ekstrak Package ZIP',
    badge: 'Upload & Unzip',
    desc: 'Buat direktori khusus /root/minecraft, lalu unggah file ZIP hasil download dari web ini:',
    command: `mkdir -p /root/minecraft && cd /root/minecraft
# Jika Anda mengunggah via SCP/FileZilla atau curl:
unzip minecraft-jagoanhosting-ryzen9.zip`,
    substeps: [
      'Gunakan FileZilla (SFTP port 22) untuk mengunggah file ZIP ke /root/minecraft',
      'Atau gunakan curl/wget langsung di VPS jika diunggah ke storage cloud.',
    ],
  },
  {
    id: 3,
    title: 'Jalankan 1-Click Auto Setup VPS',
    badge: 'Otomatisasi Sistem',
    desc: 'Eksekusi script setup yang otomatis menginstal Java 21 Temurin, membuat 2GB NVMe swapfile, optimasi kernel BBR Jakarta, dan firewall:',
    command: `chmod +x setup-jagoanhosting.sh start.sh
bash setup-jagoanhosting.sh`,
    tips: 'Script ini secara khusus mengonfigurasi sysctl TCP buffer Jakarta OpenIXP agar latensi super rendah!',
  },
  {
    id: 4,
    title: 'Download Core Paper/Purpur & Plugin Crossplay Otomatis',
    badge: 'Auto-Repair & Download',
    desc: 'Cukup jalankan satu perintah auto-repair internal. Script ini otomatis mengunduh paper.jar, Geyser, Floodgate, dan ViaVersion tanpa risiko force-offline:',
    command: `# Jalankan auto-repair internal VPS:
bash auto-repair.sh

# Atau download lengkap via download-server-jars.sh:
bash download-server-jars.sh`,
    tips: 'Sistem auto-repair memiliki proteksi anti-force-offline: jika internet VPS sempat drop, server tetap siaga (online) dan mengunduh ulang otomatis!',
  },
  {
    id: 5,
    title: 'Jalankan Server dengan Screen (24/7)',
    badge: 'Start Server',
    desc: 'Jalankan server di dalam screen session agar tidak mati saat jendela SSH atau laptop ditutup:',
    command: `screen -S minecraft ./start.sh`,
    substeps: [
      'Tekan CTRL + A lalu D untuk keluar (detach) dari screen tanpa mematikan server.',
      'Untuk masuk kembali ke console kapan saja: screen -r minecraft',
      'Untuk mematikan server dengan aman: ketik stop di console server.',
    ],
  },
  {
    id: 6,
    title: 'Opsional: Jalankan sebagai Systemd Service',
    badge: 'Auto-Boot VPS',
    desc: 'Agar Minecraft otomatis menyala ketika VPS Jagoan Hosting direstart atau maintenance:',
    command: `sudo cp minecraft.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now minecraft
sudo systemctl status minecraft`,
  },
];

export const DeploymentGuide: React.FC<DeploymentGuideProps> = ({ spec = DEFAULT_SPEC }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyCommand = (cmd: string, index: number) => {
    navigator.clipboard.writeText(cmd);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Introduction banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-zinc-900 to-zinc-950 border border-emerald-500/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              Panduan Deployment Teruji Per 17 Oktober 2026
            </span>
            <h2 className="text-xl font-bold text-zinc-100 mt-1">
              Panduan Instalasi VPS Jagoan Hosting (IP: {spec.serverIp} | Port: {spec.serverPort})
            </h2>
            <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed max-w-3xl">
              Panduan ini dirancang untuk memaksimalkan performa AMD Ryzen 9 200% dan RAM 4GB. Dilengkapi perlindungan OOM-Killer,
              swap memory NVMe, dan port tunneling Geyser agar pemain ponsel Bedrock dan laptop Java dapat terhubung tanpa lag.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="px-3 py-2 rounded-xl bg-zinc-900/80 border border-zinc-800 text-center font-mono">
              <div className="text-[10px] text-zinc-500">Estimasi Waktu</div>
              <div className="text-xs font-bold text-emerald-400">~ 3 Menit</div>
            </div>
          </div>
        </div>
      </div>

      {/* Connection Info Cards (Bedrock & Java) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Bedrock Mobile Card */}
        <div className="p-4 rounded-2xl bg-zinc-950 border border-amber-500/30 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-28 h-28 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-100">Koneksi Minecraft Bedrock</h3>
                <p className="text-[11px] text-zinc-400">Android, iOS, iPad, Windows 10/11 Bedrock</p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
              UDP {spec.serverPort}
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono bg-zinc-900/80 p-3 rounded-xl border border-zinc-800">
            <div className="flex justify-between items-center">
              <span className="text-zinc-500">Server Name:</span>
              <span className="text-zinc-200 font-sans">Survival Jagoan Hosting</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-500">Server Address (IP):</span>
              <span className="text-amber-300 font-bold">{spec.serverIp}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-500">Port Bedrock:</span>
              <span className="text-emerald-400 font-bold">{spec.serverPort} (UDP)</span>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-zinc-800 text-[11px]">
              <span className="text-zinc-500">Prefix Username:</span>
              <span className="text-cyan-400 font-bold">. (Contoh: .Budi)</span>
            </div>
          </div>
          <p className="text-[11px] text-zinc-400 mt-2">
            💡 <strong className="text-zinc-300">Achievements aktif:</strong> Pemain Bedrock menerima advancement toast dari Java secara mulus via Floodgate!
          </p>
        </div>

        {/* Java Edition PC Card */}
        <div className="p-4 rounded-2xl bg-zinc-950 border border-cyan-500/30 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-28 h-28 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Laptop className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-100">Koneksi Minecraft Java Edition</h3>
                <p className="text-[11px] text-zinc-400">Laptop / Desktop (Windows, MacOS, Linux)</p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
              TCP {spec.serverPort}
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono bg-zinc-900/80 p-3 rounded-xl border border-zinc-800">
            <div className="flex justify-between items-center">
              <span className="text-zinc-500">Server Name:</span>
              <span className="text-zinc-200 font-sans">Survival Jagoan Hosting</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-500">Server Address (IP):</span>
              <span className="text-cyan-300 font-bold">{spec.serverIp}:{spec.serverPort}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-500">Protokol:</span>
              <span className="text-emerald-400 font-bold">TCP_NODELAY (0 ms lag)</span>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-zinc-800 text-[11px]">
              <span className="text-zinc-500">Versi Kompatibel:</span>
              <span className="text-emerald-400 font-bold">1.21.x (ViaVersion)</span>
            </div>
          </div>
          <p className="text-[11px] text-zinc-400 mt-2">
            ⚡ <strong className="text-zinc-300">Ping Jakarta OpenIXP:</strong> Rata-rata 2ms - 10ms dari Biznet, Indihome, MyRepublic!
          </p>
        </div>
      </div>

      {/* Step by Step Implementation Timeline */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span>Langkah Demi Langkah Eksekusi di Terminal VPS</span>
        </h3>

        <div className="space-y-4">
          {STEPS.map((step, idx) => (
            <div
              key={step.id}
              className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/90 shadow-sm transition-all hover:border-zinc-700"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-xs flex items-center justify-center font-bold">
                    {step.id}
                  </span>
                  <h4 className="text-sm font-bold text-zinc-100">{step.title}</h4>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 self-start sm:self-auto">
                  {step.badge}
                </span>
              </div>

              <p className="text-xs text-zinc-400 mb-3">{step.desc}</p>

              {step.command && (
                <div className="relative rounded-xl bg-zinc-900/90 border border-zinc-800 overflow-hidden font-mono text-xs text-zinc-200">
                  <div className="px-3.5 py-1.5 bg-zinc-950/60 border-b border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500">
                    <span>bash / terminal</span>
                    <button
                      onClick={() => copyCommand(step.command!, idx)}
                      type="button"
                      className="text-zinc-300 hover:text-emerald-400 flex items-center gap-1 cursor-pointer transition-colors"
                      title="Salin perintah"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-sans">Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span className="font-sans">Salin</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-3.5 overflow-x-auto text-emerald-300 whitespace-pre-wrap leading-relaxed select-all">
                    {step.command}
                  </pre>
                </div>
              )}

              {step.substeps && (
                <ul className="mt-2.5 space-y-1 text-xs text-zinc-400">
                  {step.substeps.map((sub, sIdx) => (
                    <li key={sIdx} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{sub}</span>
                    </li>
                  ))}
                </ul>
              )}

              {step.tips && (
                <div className="mt-2.5 p-2 rounded-lg bg-zinc-900/40 border border-zinc-800/60 text-[11px] text-zinc-400">
                  <span className="text-amber-400 font-semibold">Tip: </span>
                  {step.tips}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
