// js/utils/browser.js
export function getBrowserData() {
  return {
    userAgent: navigator.userAgent,
    language: navigator.language || navigator.userLanguage,
    screen: `${screen.width}x${screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    platform: navigator.platform,
    cookiesEnabled: navigator.cookieEnabled,
    doNotTrack: navigator.doNotTrack,
    referrer: document.referrer || null,
    timestamp: new Date().toISOString(),
  };
}

let cachedVisitorId = null;
export async function getVisitorId() {
  if (cachedVisitorId) return cachedVisitorId;

  try {
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    cachedVisitorId = result.visitorId;
  } catch (err) {
    console.warn("FprintJS doesn't work, using fallback");
    cachedVisitorId = 'fp-fallback-' + Math.random().toString(36).substr(2, 16);
  }

  return cachedVisitorId;
}

// js/utils/browser.js
let cachedIp = null;
export async function getIp() {
  if (cachedIp !== null) return cachedIp;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const res = await fetch("https://api.ipify.org?format=json", {
      signal: controller.signal
    });
    clearTimeout(timeout);

    const { ip } = await res.json();
    cachedIp = ip;
  } catch (err) {
    console.warn("PIP doesn't work", err.name);
    cachedIp = "0.0.0.0"; 
  }

  return cachedIp;
}