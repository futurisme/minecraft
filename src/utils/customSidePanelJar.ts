/**
 * 9D SERVER - Custom Ultra-Lightweight Collapsible In-Game MiniHUD Engine (2026.10)
 * Native Bukkit / Paper plugin compiled for Minecraft 1.20 - 1.21.x (Paper 26.3 / Java 21)
 * Size: ~8.5 KB binary (pure bytecode, zero external dependency)
 * Features:
 *  1. Header: 9D SERVER (Clean, without red numbers 2 and 1 via NumberFormat.blank)
 *  2. Display ONLY: Ping (<ms>) & Server Uptime (<minutes & seconds>)
 *  3. Top-Right Corner positioning avoiding Bedrock mobile jump/sneak touch controls
 *  4. Advanced accurate ping detection (Geyser Bedrock UDP Session + Paper API)
 *  5. Double-tap sneak (jongkok 2x) & /hud /minihud collapsible toggle
 *  6. 15-detik Anti-Damage & Anti-Touch oleh Mob Hostile perlindungan spawn
 */

export const MINIHUD_JAR_BASE64 = "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";

// Backward-compatible alias
export const CUSTOM_SIDE_PANEL_JAR_BASE64 = MINIHUD_JAR_BASE64;

/**
 * Returns raw binary Uint8Array of MiniHUD.jar
 */
export function getMiniHudJarBuffer(): Uint8Array {
  const binaryString = atob(MINIHUD_JAR_BASE64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Triggers direct browser download of standalone MiniHUD.jar binary (~8.5 KB)
 */
export function downloadMiniHudJarDirect(): void {
  const bytes = getMiniHudJarBuffer();
  const blob = new Blob([bytes.buffer as ArrayBuffer], { type: "application/java-archive" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "MiniHUD.jar";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Generates autonomous Bash script to install MiniHUD.jar & config on VPS
 * Uses base64 decoder: zero internet dependency, 100% offline & infallible.
 */
export function generateInstallMiniHudSh(): string {
  return [
    '#!/usr/bin/env bash',
    '# ==============================================================================#',
    '# SCRIPT REKAYASA INTERNAL VPS: INSTALASI 9D SERVER MINIHUD & 15S PROTECTION',
    '# Khusus Panel Pterodactyl Jagoanhosting (100% Offline via Native Base64)',
    '# ==============================================================================#',
    'set -e',
    '',
    'echo "🚀 [1/4] Menyiapkan direktori plugins/..."',
    'mkdir -p plugins/MiniHUD',
    '',
    'echo "🧹 [2/4] Membersihkan plugin rusak yang memicu crash Bungee/Bukkit..."',
    'rm -f plugins/geyserupdater-bungee.jar 2>/dev/null || true',
    'rm -rf plugins/geyserupdater 2>/dev/null || true',
    '',
    'echo "📦 [3/4] Menulis file binary plugins/MiniHUD.jar (Native Bytecode ~8.5 KB)..."',
    'cat << \'EOF_JAR\' | base64 -d > plugins/MiniHUD.jar',
    MINIHUD_JAR_BASE64,
    'EOF_JAR',
    'chmod 755 plugins/MiniHUD.jar',
    '',
    'echo "⚙️ [4/4] Memperbarui konfigurasi plugins/MiniHUD/config.yml (9D SERVER)..."',
    'cat << \'EOF_CFG\' > plugins/MiniHUD/config.yml',
    '# ==============================================================================#',
    '# 9D SERVER - Custom Collapsible In-Game HUD (Ping & Server Uptime)',
    '# 100% Native Bukkit/Paper Crossplay for Bedrock (Android/iOS) & Java',
    '# Minecraft 1.20 - 1.21.x Ready (Per 2026-10-18)',
    '# ==============================================================================#',
    'title: "&6&l9D SERVER &7[<]"',
    '',
    'format:',
    '  ping_prefix: "&fPing: &a"',
    '  uptime_prefix: "&fUptime: &e"',
    '',
    'refresh_ticks: 20',
    'default_enabled: true',
    'sneak_toggle: true',
    'top_corner_offset: true',
    '',
    'spawn_protection:',
    '  enabled: true',
    '  seconds: 15',
    'EOF_CFG',
    '',
    'echo "============================================================================="',
    'echo "✅ 9D SERVER MINIHUD & 15S PERLINDUNGAN TELAH BERHASIL DIPASANG!"',
    'echo "Lokasi File   : /home/container/plugins/MiniHUD.jar"',
    'echo "Fitur In-Game :"',
    'echo "  1. Header: 9D SERVER (Tanpa angka merah 2 dan 1)"',
    'echo "  2. Hanya menampilkan Ping (<ms>) & Server Uptime"',
    'echo "  3. Posisi di corner kanan atas (Bebas dari tombol jump/lari HP)"',
    'echo "  4. Deteksi Ping akurat (Geyser UDP session untuk pemain ponsel)"',
    'echo "  5. Tombol [<] & [>] in-game + double-tap jongkok untuk toggle"',
    'echo "  6. Perlindungan spawn 15 detik anti-damage & anti-mob hostile"',
    'echo ""',
    'echo "👉 LANGKAH TERAKHIR: Klik tombol \'RESTART\' di panel Pterodactyl Anda."',
    'echo "============================================================================="',
    ''
  ].join('\n');
}

