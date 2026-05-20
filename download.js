// Smart-download picker. Detects OS + arch and rewrites any `[data-smart-download]`
// link to point at the exact asset for the visitor's platform. Falls back to
// /releases/latest (the static href) if detection fails or the API call errors.
//
// The picker rows below the primary button also get their hrefs populated here
// so users who want a different platform (or whose detection was wrong) get
// direct download links rather than a generic releases page.

(() => {
  const REPO = 'steph-dove/klausify-desktop-feedback';
  const API_URL = `https://api.github.com/repos/${REPO}/releases/latest`;
  const CACHE_KEY = 'klaussy-latest-release';
  const CACHE_TTL_MS = 60 * 60 * 1000;

  const ASSET_FOR = {
    'mac:arm64':      v => `Klaussy-${v}-macOS-arm64.dmg`,
    'mac:x64':        v => `Klaussy-${v}-macOS-x64.dmg`,
    'win:setup':      v => `Klaussy-${v}-Windows-Setup.exe`,
    'win:portable':   v => `Klaussy-${v}-Windows-Portable.exe`,
    'linux:appimage': v => `Klaussy-${v}-Linux.AppImage`,
    'linux:deb':      v => `Klaussy-${v}-Linux-Debian-Ubuntu.deb`,
  };

  const PRIMARY_LABEL = {
    'mac:arm64':      'Download for macOS — Apple Silicon',
    'mac:x64':        'Download for macOS — Intel',
    'win:setup':      'Download for Windows',
    'linux:appimage': 'Download for Linux (AppImage)',
    'linux:deb':      'Download for Linux (Debian/Ubuntu)',
  };

  async function detectPlatform() {
    // Prefer the high-entropy UA Client Hints API where available (Chromium).
    if (navigator.userAgentData?.getHighEntropyValues) {
      try {
        const data = await navigator.userAgentData.getHighEntropyValues(['architecture', 'platform']);
        const platform = (data.platform || '').toLowerCase();
        const arch = (data.architecture || '').toLowerCase();
        if (platform.includes('mac') || platform === 'macos') {
          return arch === 'arm' ? 'mac:arm64' : 'mac:x64';
        }
        if (platform.includes('win')) return 'win:setup';
        if (platform.includes('linux')) return 'linux:appimage';
      } catch (_) { /* fall through to UA sniffing */ }
    }
    const ua = navigator.userAgent || '';
    const plat = (navigator.platform || '').toLowerCase();
    if (/windows/i.test(ua) || plat.startsWith('win')) return 'win:setup';
    if (/linux/i.test(ua) && !/android/i.test(ua)) return 'linux:appimage';
    if (/mac/i.test(ua) || /mac/i.test(plat)) {
      const macArch = detectMacArch();
      if (macArch === 'arm64') return 'mac:arm64';
      if (macArch === 'x64')   return 'mac:x64';
      // Safari on M-series Macs lies and says "Intel Mac OS X". When we can't
      // disambiguate, default to Apple Silicon — that's the majority of Macs
      // sold since late 2020.
      return 'mac:arm64';
    }
    return null;
  }

  // Mac arm64 vs x64 isn't exposed by any user-agent string we can trust, but
  // WebGL's renderer hint usually says "Apple M*" or "Apple GPU" on ARM, and
  // contains "Intel" on Intel Macs.
  function detectMacArch() {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) return null;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      if (!ext) return null;
      const renderer = String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) || '').toLowerCase();
      if (!renderer) return null;
      if (renderer.includes('apple') && !renderer.includes('intel')) return 'arm64';
      if (renderer.includes('intel')) return 'x64';
      return null;
    } catch (_) {
      return null;
    }
  }

  async function fetchLatestVersion() {
    try {
      const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) || 'null');
      if (cached && Date.now() - cached.ts < CACHE_TTL_MS) return cached.version;
    } catch (_) {}
    try {
      const r = await fetch(API_URL, { headers: { Accept: 'application/vnd.github+json' } });
      if (!r.ok) return null;
      const data = await r.json();
      const version = String(data.tag_name || '').replace(/^v/, '');
      if (!version) return null;
      try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ version, ts: Date.now() })); } catch (_) {}
      return version;
    } catch (_) {
      return null;
    }
  }

  function downloadUrl(key, version) {
    const filename = ASSET_FOR[key](version);
    return `https://github.com/${REPO}/releases/download/v${version}/${filename}`;
  }

  function updatePrimary(btn, key, version) {
    btn.href = downloadUrl(key, version);
    const label = btn.querySelector('.btn-label');
    const sub = btn.querySelector('.btn-sub');
    if (label && PRIMARY_LABEL[key]) label.textContent = PRIMARY_LABEL[key];
    if (sub) sub.textContent = `v${version}`;
  }

  function updatePicker(version) {
    document.querySelectorAll('[data-download-pick]').forEach(row => {
      const key = row.getAttribute('data-download-pick');
      if (!ASSET_FOR[key]) return;
      row.href = downloadUrl(key, version);
      const filenameEl = row.querySelector('.download-row-file');
      if (filenameEl) filenameEl.textContent = ASSET_FOR[key](version);
    });
  }

  async function init() {
    const primaryButtons = Array.from(document.querySelectorAll('[data-smart-download]'));
    const pickerRows = document.querySelectorAll('[data-download-pick]');
    if (!primaryButtons.length && !pickerRows.length) return;

    const [platform, version] = await Promise.all([detectPlatform(), fetchLatestVersion()]);
    if (!version) return; // leave static /releases/latest fallback in place

    if (platform && PRIMARY_LABEL[platform]) {
      primaryButtons.forEach(btn => updatePrimary(btn, platform, version));
      document.body.dataset.detectedPlatform = platform;
    }
    updatePicker(version);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
