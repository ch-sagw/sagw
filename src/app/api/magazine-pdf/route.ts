import { NextRequest } from 'next/server';
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';
import { existsSync } from 'node:fs';
import {
  isPdfGenerationEnabled,
  verifyPdfGenerationAuth,
} from '@/utilities/pdfGenerationSecurity';

export const runtime = 'nodejs';

const buildOrigin = (req: NextRequest): string | null => {
  const proto = req.headers.get('x-forwarded-proto') ?? 'http';
  const host = req.headers.get('x-forwarded-host') ?? req.headers.get('host');

  if (!host) {
    return null;
  }

  return `${proto}://${host}`;
};

const sanitizePath = (pathValue: string): string | null => {
  if (!pathValue.startsWith('/')) {
    return null;
  }

  if (pathValue.startsWith('//')) {
    return null;
  }

  if (pathValue.includes('\\')) {
    return null;
  }

  const parsedPath = new URL(pathValue, 'http://localhost');
  const {
    pathname,
  } = parsedPath;

  if (parsedPath.search || parsedPath.hash) {
    return null;
  }

  // Reject path traversal attempts targeting other routes after normalization.
  if (pathname.includes('..')) {
    return null;
  }

  // Reject unusual duplicate-slash path structures in normalized path.
  if (pathname.includes('//')) {
    return null;
  }

  return pathname;
};

const isAllowedFrontendPath = (pathname: string): boolean => {
  const segments = pathname.split('/')
    .filter(Boolean);

  if (segments.length < 2) {
    return false;
  }

  const forbiddenRoots = new Set([
    'admin',
    'api',
  ]);

  return !forbiddenRoots.has(segments[1] || '');
};

const escapeHtml = (value: string): string => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll('\'', '&#39;');

const getExecutablePath = async (): Promise<string> => {
  // On local macOS/Windows/Linux, use an installed browser binary.
  if (!process.env.VERCEL) {
    const playwrightExecutablePath = (() : string => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const playwright = require('playwright');

        return playwright.chromium.executablePath() as string;
      } catch {
        return '';
      }
    })();
    let localCandidates: string[] = [];

    if (process.platform === 'darwin') {
      localCandidates = [
        playwrightExecutablePath,
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        '/Applications/Chromium.app/Contents/MacOS/Chromium',
        '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary',
      ];
    } else if (process.platform === 'linux') {
      localCandidates = [
        playwrightExecutablePath,
        '/usr/bin/google-chrome-stable',
        '/usr/bin/google-chrome',
        '/usr/bin/chromium-browser',
        '/usr/bin/chromium',
      ];
    } else if (process.platform === 'win32') {
      localCandidates = [
        playwrightExecutablePath,
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
      ];
    }

    const localPath = localCandidates.find((candidate) => existsSync(candidate));

    if (localPath) {
      return localPath;
    }

    throw new Error('Local browser not found.');
  }

  const executablePath = await chromium.executablePath();

  return executablePath;
};

export const GET = async (req: NextRequest): Promise<Response> => {
  if (!isPdfGenerationEnabled()) {
    return new Response('PDF generation is disabled', {
      status: 503,
    });
  }

  const pathValue = req.nextUrl.searchParams.get('path');
  const token = req.nextUrl.searchParams.get('token');
  const expiresAtRaw = req.nextUrl.searchParams.get('expiresAt');

  if (!pathValue) {
    return new Response('Missing `path` query parameter', {
      status: 400,
    });
  }

  if (!token || !expiresAtRaw) {
    return new Response('Missing token parameters', {
      status: 401,
    });
  }

  const sanitizedPath = sanitizePath(pathValue);

  if (!sanitizedPath) {
    return new Response('Invalid `path` query parameter', {
      status: 400,
    });
  }

  const origin = buildOrigin(req);

  if (!origin) {
    return new Response('Could not resolve request origin', {
      status: 400,
    });
  }

  if (!isAllowedFrontendPath(sanitizedPath)) {
    return new Response('Invalid `path` query parameter', {
      status: 400,
    });
  }

  const targetUrl = new URL(sanitizedPath, origin);
  const expiresAt = Number.parseInt(expiresAtRaw, 10);
  const isAuthorized = verifyPdfGenerationAuth({
    expiresAt,
    path: targetUrl.pathname,
    token,
  });

  if (!isAuthorized) {
    return new Response('Invalid or expired PDF token', {
      status: 401,
    });
  }

  const pathParts = targetUrl.pathname.split('/')
    .filter(Boolean);
  const slug = pathParts[pathParts.length - 1] ?? 'magazine-detail';
  const filename = `${slug}.pdf`;
  const escapedUrl = escapeHtml(targetUrl.toString());
  const exportDate = new Date()
    .toISOString()
    .split('T')[0] || '';
  let browser: Awaited<ReturnType<typeof puppeteer.launch>> | null = null;

  try {
    const executablePath = await getExecutablePath();
    const launchArgs = process.env.VERCEL
      ? [
        ...chromium.args,
        '--disable-web-security',
        '--hide-scrollbars',
      ]
      : [
        '--disable-web-security',
        '--hide-scrollbars',
        ...(process.platform === 'linux'
          ? [
            '--no-sandbox',
            '--disable-setuid-sandbox',
          ]
          : []),
      ];

    browser = await puppeteer.launch({
      args: launchArgs,
      executablePath,
      headless: true,
    });

    const consentValue = encodeURIComponent(JSON.stringify({
      analytics: true,
      consentGiven: true,
      essential: true,
      external: true,
      timestamp: Date.now(),
    }));
    const page = await browser.newPage();

    await page.setCookie({
      name: 'cookie_consent',
      path: '/',
      sameSite: 'Lax',
      secure: targetUrl.protocol === 'https:',
      url: targetUrl.origin,
      value: consentValue,
    });

    await page.goto(targetUrl.toString(), {
      waitUntil: 'networkidle0',
    });
    await page.emulateMediaType('print');

    const pdf = await page.pdf({
      displayHeaderFooter: true,
      footerTemplate: '<div></div>',
      format: 'A4',
      headerTemplate: `
        <div style="width: 100%; padding: 0 24px; font-size: 9px; line-height: 1.3; color: #444;">
          <div>${escapedUrl}</div>
          <div>${escapeHtml(exportDate)}</div>
        </div>
      `,
      margin: {
        bottom: '24px',
        left: '24px',
        right: '24px',
        top: '72px',
      },
      printBackground: true,
    });

    return new Response(new Uint8Array(pdf), {
      headers: {
        'Cache-Control': 'no-store',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Type': 'application/pdf',
      },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error
      ? error.message
      : 'Unknown error';

    return new Response(`Failed to generate PDF: ${errorMessage}`, {
      status: 500,
    });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};
