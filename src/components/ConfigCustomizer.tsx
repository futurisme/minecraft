import React from 'react';
import { Sliders, RefreshCw, Check, Sparkles, HardDrive, Cpu, Server, Wifi } from 'lucide-react';
import { ServerSpec, DEFAULT_SPEC, calculateJvmMemory } from '../utils/minecraftConfig.ts';

interface ConfigCustomizerProps {
  spec: ServerSpec;
  onChangeSpec: (updater: (prev: ServerSpec) => ServerSpec) => void;
  onReset: () => void;
}

export const ConfigCustomizer: React.FC<ConfigCustomizerProps> = ({
  spec,
  onChangeSpec,
  onReset,
}) => {
  const { heapMb, reservedOsAndOffHeapMb, flagString } = calculateJvmMemory(spec.ramMb);

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4 mb-4">
          <div>
            <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-emerald-400" />
              <span>Live Server Config Customizer (Real-Time Synchronized)</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Sesuaikan parameter server. Perubahan langsung tercermin di seluruh file konfigurasi dan paket ZIP.
            </p>
          </div>

          <button
            onClick={onReset}
            type="button"
            className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-mono flex items-center gap-1.5 border border-zinc-800 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5 text-zinc-400" />
            <span>Reset ke Rekomendasi Jagoan Hosting</span>
          </button>
        </div>

        {/* Form controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Server IP */}
          <div className="space-y-1.5">
            <label htmlFor="server-ip" className="text-xs font-semibold text-zinc-200 flex items-center justify-between">
              <span>Alokasi IP Server (Stellar Panel):</span>
              <span className="font-mono text-emerald-400 font-bold">{spec.serverIp}</span>
            </label>
            <input
              id="server-ip"
              type="text"
              value={spec.serverIp}
              onChange={(e) =>
                onChangeSpec((prev) => ({ ...prev, serverIp: e.target.value }))
              }
              className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-200 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            <p className="text-[11px] text-zinc-500">
              IP VPS/Pterodactyl Anda dari panel Jagoan Hosting.
            </p>
          </div>

          {/* Server Port */}
          <div className="space-y-1.5">
            <label htmlFor="server-port" className="text-xs font-semibold text-zinc-200 flex items-center justify-between">
              <span>Alokasi Port Server:</span>
              <span className="font-mono text-cyan-400 font-bold">{spec.serverPort}</span>
            </label>
            <input
              id="server-port"
              type="number"
              min={1024}
              max={65535}
              value={spec.serverPort}
              onChange={(e) =>
                onChangeSpec((prev) => ({ ...prev, serverPort: Number(e.target.value) || 32144 }))
              }
              className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-200 focus:outline-none focus:border-cyan-500 transition-colors"
            />
            <p className="text-[11px] text-zinc-500">
              Port container alokasi (misal: <strong>32144</strong>). Otomatis menyelaraskan Geyser UDP & Java TCP.
            </p>
          </div>

          {/* View Distance */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="view-distance" className="font-semibold text-zinc-200">
                View Distance (Jarak Pandang Render):
              </label>
              <span className="font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                {spec.viewDistance} Chunks
              </span>
            </div>
            <input
              id="view-distance"
              type="range"
              min={4}
              max={16}
              step={1}
              value={spec.viewDistance}
              onChange={(e) =>
                onChangeSpec((prev) => ({ ...prev, viewDistance: Number(e.target.value) }))
              }
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <p className="text-[11px] text-zinc-500">
              Rekomendasi untuk 4GB RAM + Bedrock ponsel: <strong>8 chunks</strong> (keseimbangan grafis & bandwidth hemat).
            </p>
          </div>

          {/* Simulation Distance */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="sim-distance" className="font-semibold text-zinc-200">
                Simulation Distance (Jarak Ticking Mob/Redstone):
              </label>
              <span className="font-mono text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                {spec.simulationDistance} Chunks
              </span>
            </div>
            <input
              id="sim-distance"
              type="range"
              min={3}
              max={10}
              step={1}
              value={spec.simulationDistance}
              onChange={(e) =>
                onChangeSpec((prev) => ({ ...prev, simulationDistance: Number(e.target.value) }))
              }
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <p className="text-[11px] text-zinc-500">
              Rekomendasi untuk Ryzen 9 200%: <strong>5 chunks</strong>. Mencegah lag saat banyak mob farm dibuat.
            </p>
          </div>

          {/* Server Software */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-200 block">
              Core Engine Server:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onChangeSpec((prev) => ({ ...prev, serverSoftware: 'Purpur' }))}
                className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                  spec.serverSoftware === 'Purpur'
                    ? 'bg-purple-500/15 border-purple-500/40 text-purple-200'
                    : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:bg-zinc-900'
                }`}
              >
                <div className="text-xs font-bold font-mono">Purpur 1.21.4 (Rekomendasi)</div>
                <div className="text-[10px] text-zinc-400 mt-0.5">Optimasi villager lobotomy, 20.0 TPS lock</div>
              </button>

              <button
                type="button"
                onClick={() => onChangeSpec((prev) => ({ ...prev, serverSoftware: 'Paper' }))}
                className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                  spec.serverSoftware === 'Paper'
                    ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-200'
                    : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:bg-zinc-900'
                }`}
              >
                <div className="text-xs font-bold font-mono">Paper 1.21.4</div>
                <div className="text-[10px] text-zinc-400 mt-0.5">Standar stabil industri Minecraft</div>
              </button>
            </div>
          </div>

          {/* RAM Allocation Calculator */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-200 block">
              Alokasi RAM VPS (Jagoan Hosting Spec: 4096 MB):
            </label>
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1.5 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-zinc-400">Total RAM VPS:</span>
                <span className="text-zinc-200 font-bold">{spec.ramMb} MB (4 GB)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">JVM Heap (-Xms/-Xmx):</span>
                <span className="text-emerald-400 font-bold">{heapMb} MB (3 GB)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Reserved OS + Geyser Off-Heap:</span>
                <span className="text-purple-400 font-bold">{reservedOsAndOffHeapMb} MB (1 GB)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Resulting Startup Command Preview */}
        <div className="mt-5 pt-4 border-t border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-zinc-200 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Generated JVM Flags Command (Aikar's G1GC):
            </span>
          </div>
          <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 font-mono text-[11px] text-emerald-300 break-all select-all">
            java {flagString} -jar purpur-1.21.4.jar --nogui
          </div>
        </div>
      </div>
    </div>
  );
};
