import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(_request: NextRequest) {
  const shutdownHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>M/S Rong Bahar — Services Decommissioned &amp; Website Closed</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    body { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #0b0f19; color: #f3f4f6; padding: 24px; }
    .card { max-width: 580px; width: 100%; background: #111827; border: 1px solid #1f2937; border-radius: 20px; padding: 40px 32px; text-align: center; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
    .badge { display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px; border-radius: 9999px; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.25); color: #f87171; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 24px; }
    .pulse { width: 8px; height: 8px; border-radius: 50%; background: #ef4444; }
    h1 { font-size: 26px; font-weight: 800; color: #ffffff; line-height: 1.3; margin-bottom: 16px; }
    p { color: #9ca3af; font-size: 15px; line-height: 1.6; margin-bottom: 20px; }
    .divider { height: 1px; background: #1f2937; margin: 24px 0; }
    .status-list { text-align: left; background: #0b0f19; border: 1px solid #1f2937; border-radius: 12px; padding: 16px; font-size: 13px; color: #9ca3af; display: flex; flex-direction: column; gap: 10px; }
    .status-item { display: flex; align-items: center; justify-content: space-between; }
    .status-val { font-weight: 600; color: #ef4444; }
    .footer-note { font-size: 12px; color: #6b7280; margin-top: 24px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">
      <span class="pulse"></span>
      Service Offline
    </div>
    <h1>Website &amp; Services Shut Down</h1>
    <p>
      The online storefront, backend API, database pool, and associated services for <strong>M/S Rong Bahar</strong> have been decommissioned and shut down.
    </p>
    <div class="status-list">
      <div class="status-item">
        <span>Storefront &amp; Domain</span>
        <span class="status-val">Closed / Offline</span>
      </div>
      <div class="status-item">
        <span>Backend API &amp; Services</span>
        <span class="status-val">Disconnected</span>
      </div>
      <div class="status-item">
        <span>Database Connections</span>
        <span class="status-val">Severed</span>
      </div>
      <div class="status-item">
        <span>HTTP Response</span>
        <span class="status-val">503 Service Unavailable</span>
      </div>
    </div>
    <div class="divider"></div>
    <div class="footer-note">
      M/S Rong Bahar &bull; Pakundia Bazar, Kishoreganj &bull; Systems Offline
    </div>
  </div>
</body>
</html>`;

  return new NextResponse(shutdownHtml, {
    status: 503,
    statusText: 'Service Unavailable',
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'retry-after': '86400',
    },
  });
}

export const config = {
  matcher: '/:path*',
};
