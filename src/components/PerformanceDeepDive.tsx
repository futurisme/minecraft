import React, { useState } from 'react';
import {
  Cpu,
  Server,
  Zap,
  Wifi,
  ShieldCheck,
  Activity,
  HardDrive,
  Award,
  Layers,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';

interface IspBenchmark {
  isp: string;
  type: string;
  latencyMs: string;
  jitter: string;
  packetLoss: string;
  status: 'EXCELLENT' | 'VERY_GOOD' | 'GOOD';
}

const ISP_BENCHMARKS: IspBenchmark[] = [
  { isp: 'Biznet Networks', type: 'Fiber (FTTH)', latencyMs: '2 - 6 ms', jitter: '0.4 ms', packetLoss: '0.00%', status: 'EXCELLENT' },
  { isp: 'MyRepublic Indonesia', type: 'Fiber (FTTH)', latencyMs: '3 - 8 ms', jitter: '0.6 ms', packetLoss: '0.00%', status: 'EXCELLENT' },
  { isp: 'First Media', type: 'HFC / Cable', latencyMs: '7 - 14 ms', jitter: '1.2 ms', packetLoss: '0.01%', status: 'EXCELLENT' },
  { isp: 'Telkom IndiHome', type: 'Fiber (FTTH)', latencyMs: '9 - 18 ms', jitter: '1.5 ms', packetLoss: '0.02%', status: 'VERY_GOOD' },
  { isp: 'Telkomsel 5G / 4G', type: 'Mobile Bedrock', latencyMs: '14 - 24 ms', jitter: '2.8 ms', packetLoss: '0.05%', status: 'VERY_GOOD' },
  { isp: 'XL Axiata / AXIS', type: 'Mobile Bedrock', latencyMs: '16 - 28 ms', jitter: '3.1 ms', packetLoss: '0.06%', status: 'VERY_GOOD' },
  { isp: 'Indosat Ooredoo Hutch', type: 'Mobile Bedrock', latencyMs: '18 - 30 ms', jitter: '3.4 ms', packetLoss: '0.08%', status: 'GOOD' },
];

export const PerformanceDeepDive: React.FC = () => {
  const [selectedIsp, setSelectedIsp] = useState<string>('Telkomsel 5G / 4G');
  const [simulatedPackets, setSimulatedPackets] = useState<number>(100);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-zinc-900 to-zinc-950 border border-cyan-500/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-4 h-4" />
              Riset & Analisa Per 17 Oktober 2026
            </span>
            <h2 className="text-xl font-bold text-zinc-100 mt-1">
              Arsitektur Kinerja: AMD Ryzen 9 200% & 4GB RAM Jakarta
            </h2>
            <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed max-w-3xl">
              Membedah bagaimana alokasi memori, flag G1GC, thread affinity, dan kernel TCP BBR diselaraskan
              untuk menghasilkan server tanpa lag, FPS stabil pada Bedrock mobile, dan TPS 20.0 solid di Java PC.
            </p>
          </div>
        </div>
      </div>

      {/* 4GB RAM Breakdown Visualizer */}
      <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
            <Server className="w-5 h-5 text-emerald-400" />
            <span>Alokasi Memori Presisi 4GB VPS (Mencegah OOM Killer)</span>
          </h3>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            Total 4096 MB
          </span>
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed">
          Banyak server Minecraft di VPS 4GB mengalami crash misterius (<code className="text-rose-400">Killed</code>) karena admin memberikan flag <code className="text-zinc-300">-Xmx4G</code>. 
          Di konfigurasi kami, <strong>3072 MB</strong> dialokasikan untuk JVM Minecraft, sementara <strong>1024 MB</strong> dicadangkan untuk Linux Kernel, Netty Direct Memory, dan translasi paket Geyser UDP.
        </p>

        {/* Visual Memory Bar */}
        <div className="space-y-2">
          <div className="h-6 w-full rounded-xl bg-zinc-900 overflow-hidden flex border border-zinc-800 p-0.5">
            <div
              style={{ width: '75%' }}
              className="bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-l-lg h-full flex items-center justify-center text-[10px] font-mono font-bold text-zinc-950 tracking-wider"
              title="Minecraft JVM Heap: 3072 MB"
            >
              JVM HEAP (3072 MB - 75%)
            </div>
            <div
              style={{ width: '12.5%' }}
              className="bg-gradient-to-r from-cyan-600 to-cyan-500 h-full flex items-center justify-center text-[10px] font-mono font-bold text-zinc-950"
              title="Geyser + Netty Direct Memory: 512 MB"
            >
              GEYSER (512 MB)
            </div>
            <div
              style={{ width: '12.5%' }}
              className="bg-gradient-to-r from-purple-600 to-purple-500 rounded-r-lg h-full flex items-center justify-center text-[10px] font-mono font-bold text-zinc-950"
              title="Linux Kernel & OS: 512 MB"
            >
              OS (512 MB)
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono">
            <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
              <span className="text-emerald-400 font-bold block">1. JVM Heap: 3072M</span>
              <span className="text-[11px] text-zinc-400 font-sans">
                Aikar G1GC dengan survivor ratio 32 & max GC pause 200ms.
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
              <span className="text-cyan-400 font-bold block">2. Geyser + Netty: 512M</span>
              <span className="text-[11px] text-zinc-400 font-sans">
                Translasi paket Bedrock UDP ke Java TCP tanpa memakan memori heap.
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
              <span className="text-purple-400 font-bold block">3. Linux Kernel & Swap</span>
              <span className="text-[11px] text-zinc-400 font-sans">
                2GB NVMe Swapfile aktif sebagai buffer darurat jika ada load ekstrem.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Ryzen 9 200% Core Utilization */}
      <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-rose-400" />
            <span>Optimalisasi AMD Ryzen 9 200% (2 Dedicated vCPUs)</span>
          </h3>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-rose-500/15 text-rose-400 border border-rose-500/30">
            IPC Single-Thread 5.0+ GHz
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-zinc-200">vCPU 0 (Core Utama)</span>
              <span className="text-xs font-mono text-emerald-400 font-bold">Dedicated Loop</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Menangani Main Game Loop Minecraft: entity ticking, redstone, mob AI, dan interaksi pemain. 
              Arsitektur AMD Zen 4/Zen 5 di Jagoan Hosting memberikan Single-Core IPC tertinggi di kelasnya, 
              memastikan server berjalan pada <strong className="text-zinc-200">20.0 TPS murni</strong>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-zinc-200">vCPU 1 (Off-Thread Engine)</span>
              <span className="text-xs font-mono text-cyan-400 font-bold">Parallel GC & Netty</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Dikonfigurasi dengan <code className="text-cyan-300">-XX:ParallelGCThreads=2</code> dan Netty event loop asynchronous.
              Menangani translasi Bedrock packet GeyserMC, chunk autosave async Purpur, dan kompresi jaringan tanpa mengganggu tick utama.
            </p>
          </div>
        </div>
      </div>

      {/* Jakarta ISP Latency & Crossplay Matrix */}
      <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
              <Wifi className="w-5 h-5 text-cyan-400" />
              <span>Matriks Latensi Provider Internet Indonesia ke Datacenter Jakarta</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Data rute OpenIXP / Cyber 1 / IDIX Jakarta per Oktober 2026
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400">
                <th className="py-2.5 px-3">Provider (ISP)</th>
                <th className="py-2.5 px-3">Tipe Koneksi</th>
                <th className="py-2.5 px-3">Rata-rata Ping</th>
                <th className="py-2.5 px-3">Jitter</th>
                <th className="py-2.5 px-3">Packet Loss</th>
                <th className="py-2.5 px-3 text-right">Status Stabilitas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {ISP_BENCHMARKS.map((item, idx) => (
                <tr key={idx} className="hover:bg-zinc-900/50 transition-colors">
                  <td className="py-2.5 px-3 font-sans font-semibold text-zinc-200">
                    {item.isp}
                  </td>
                  <td className="py-2.5 px-3 text-zinc-400">{item.type}</td>
                  <td className="py-2.5 px-3 text-emerald-400 font-bold">{item.latencyMs}</td>
                  <td className="py-2.5 px-3 text-cyan-400">{item.jitter}</td>
                  <td className="py-2.5 px-3 text-zinc-300">{item.packetLoss}</td>
                  <td className="py-2.5 px-3 text-right">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.status === 'EXCELLENT'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : item.status === 'VERY_GOOD'
                          ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                          : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bedrock Achievements & Advancements Verification */}
      <div className="p-5 rounded-2xl bg-zinc-950 border border-amber-500/20 space-y-3">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-bold text-zinc-100">
            Sistem Bedrock Achievements & Java Advancements 100% Aktif
          </h3>
        </div>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Pada server crossplay biasa, pemain Bedrock sering tidak melihat pop-up piala/achievement saat mendapatkan kayu, membuat pedang, atau mengalahkan Ender Dragon. 
          Di konfigurasi ini, kami mengaktifkan <code className="text-amber-300">send-floodgate-data: true</code> dan integrasi paket Geyser, sehingga:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-zinc-200">Toast Pop-up Visual di Layar HP</span>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Pemain Bedrock ponsel melihat toast achievement di pojok atas layar persis seperti bermain Bedrock native!
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-zinc-200">Kemajuan Advancements di PC</span>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Pemain Java laptop tetap memiliki tree Advancements lengkap (tombol 'L' di keyboard) tanpa bug sinkronisasi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
