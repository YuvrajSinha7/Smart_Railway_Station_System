import { exec } from 'child_process';
import fs from 'fs';

// 10 minutes in milliseconds
const CHECK_INTERVAL = 10 * 60 * 1000;
const LOG_FILE = 'health_status.log';

function logStatus(message, isError = false) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${isError ? 'ERROR' : 'INFO'}: ${message}\n`;
  console.log(logMessage.trim());
  fs.appendFileSync(LOG_FILE, logMessage);
}

function runHealthChecks() {
  logStatus('Starting automated 10-minute code health checks...');

  // 1. Dry run a Vite build to check for syntax/bundle errors
  logStatus('Executing simulated Vite build check...');
  exec('npm run build', (error, stdout, stderr) => {
    if (error) {
      logStatus(`Build Check FAILED:\n${stderr || error.message}`, true);
    } else {
      logStatus('Build Check PASSED: No compilation or syntax errors found.');
    }

    // 2. We can also add more checks like linting here in the future
    logStatus('Health check cycle complete.');
  });
}

// Initial Run
runHealthChecks();

// Interval Run
setInterval(() => {
  runHealthChecks();
}, CHECK_INTERVAL);

logStatus('Health monitor service initialized and active.');
