const MAX_LOGS = 50;
const logs = [];

let lastScanDebug = null;

export function addDebugLog(entry) {
  const normalized = {
    timestamp: new Date().toISOString(),
    ...entry
  };

  logs.unshift(normalized);
  if (logs.length > MAX_LOGS) logs.pop();
  return normalized;
}

export function setLastScanDebug(debug) {
  lastScanDebug = {
    timestamp: new Date().toISOString(),
    ...debug
  };
  addDebugLog({
    type: 'scan',
    message: 'Quick scan completed',
    source: debug.provider,
    fromFallback: debug.fromFallback,
    processingTimeMs: debug.processingTimeMs,
    eventCount: debug.events?.length || 0
  });
}

export function getDebugSnapshot() {
  return {
    generatedAt: new Date().toISOString(),
    lastScan: lastScanDebug,
    logs
  };
}
