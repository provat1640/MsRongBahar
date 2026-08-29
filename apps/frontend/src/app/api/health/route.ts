import { NextResponse } from 'next/server';
import { pingBackendHealthAPI } from '../../../lib/api';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const startTime = Date.now();
  const backendHealth = await pingBackendHealthAPI();
  const latencyMs = Date.now() - startTime;

  return NextResponse.json(
    {
      status: backendHealth.healthy ? 'ok' : 'warming_up',
      frontend: {
        status: 'ok',
        runtime: 'Edge / Node.js Vercel Serverless',
        timestamp: new Date().toISOString(),
      },
      backend: {
        status: backendHealth.status,
        healthy: backendHealth.healthy,
        latencyMs,
      },
      message: backendHealth.healthy
        ? 'All systems operational (Storefront + NestJS API + DB).'
        : 'Storefront operational; NestJS Backend is cold-starting / warming up.',
    },
    {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    },
  );
}
