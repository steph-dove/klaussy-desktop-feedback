// Smart-download picker. Detects OS + arch and rewrites any `[data-smart-download]`
// link to point at the exact asset for the visitor's platform. Falls back to
// /releases/latest (the static href) if detection fails or the API call errors.
//
// The picker rows below the primary button also get their hrefs populated here
// so users who want a different platform (or whose detection was wrong) get
// direct download links rather than a generic releases page.

(() => {
  const REPO = 'steph-dove/klaussy-desktop';
  const API_URL = `https://api.github.com/repos/${REPO}/releases/latest`;
  // v2: the cache holds the asset names too, not just the version.
  const CACHE_KEY = 'klaussy-latest-release-v2';
  const CACHE_TTL_MS = 60 * 60 * 1000;

  // Matched by ending against the release's own asset list, so the product
  // name in front (Klaussy-, Maussian-) can change between releases.
  const ASSET_SUFFIX = {
    'mac:arm64':      '-macOS-arm64.dmg',
    'mac:x64':        '-macOS-x64.dmg',
    'win:setup':      '-Windows-Setup.exe',
    'win:portable':   '-Windows-Portable.exe',
    'linux:appimage': '-Linux.AppImage',
    'linux:deb':      '-Linux-Debian-Ubuntu.deb',
  };

  const PRIMARY_LABEL = {
    'mac:arm64':      'Download for macOS (Apple Silicon)',
    'mac:x64':        'Download for macOS (Intel)',
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

  // Returns { version, names } for the latest release, or null.
  async function fetchLatestRelease() {
    try {
      const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) || 'null');
      if (cached && Date.now() - cached.ts < CACHE_TTL_MS && Array.isArray(cached.names)) return cached;
    } catch (_) {}
    try {
      const r = await fetch(API_URL, { headers: { Accept: 'application/vnd.github+json' } });
      if (!r.ok) return null;
      const data = await r.json();
      const version = String(data.tag_name || '').replace(/^v/, '');
      const names = (data.assets || []).map(a => String(a.name || ''));
      if (!version || !names.length) return null;
      const release = { version, names, ts: Date.now() };
      try { sessionStorage.setItem(CACHE_KEY, JSON.stringify(release)); } catch (_) {}
      return release;
    } catch (_) {
      return null;
    }
  }

  function assetName(key, release) {
    const suffix = ASSET_SUFFIX[key];
    return suffix ? release.names.find(n => n.endsWith(suffix)) || null : null;
  }

  function downloadUrl(release, filename) {
    return `https://github.com/${REPO}/releases/download/v${release.version}/${filename}`;
  }

  // A platform missing from the release keeps its static /releases/latest href.
  function updatePrimary(btn, key, release) {
    const filename = assetName(key, release);
    if (!filename) return;
    btn.href = downloadUrl(release, filename);
    const label = btn.querySelector('.btn-label');
    const sub = btn.querySelector('.btn-sub');
    if (label && PRIMARY_LABEL[key]) label.textContent = PRIMARY_LABEL[key];
    if (sub) sub.textContent = `v${release.version}`;
  }

  function updatePicker(release) {
    document.querySelectorAll('[data-download-pick]').forEach(row => {
      const filename = assetName(row.getAttribute('data-download-pick'), release);
      if (!filename) return;
      row.href = downloadUrl(release, filename);
      const filenameEl = row.querySelector('.download-row-file');
      if (filenameEl) filenameEl.textContent = filename;
    });
  }

  async function init() {
    const primaryButtons = Array.from(document.querySelectorAll('[data-smart-download]'));
    const pickerRows = document.querySelectorAll('[data-download-pick]');
    if (!primaryButtons.length && !pickerRows.length) return;

    const [platform, release] = await Promise.all([detectPlatform(), fetchLatestRelease()]);
    if (!release) return; // leave static /releases/latest fallback in place

    if (platform && PRIMARY_LABEL[platform]) {
      primaryButtons.forEach(btn => updatePrimary(btn, platform, release));
      document.body.dataset.detectedPlatform = platform;
    }
    updatePicker(release);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
