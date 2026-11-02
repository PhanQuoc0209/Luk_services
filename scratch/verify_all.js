const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const artDir = 'C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\62961d5b-4900-469a-84a9-bc15c5cd0a17';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1400,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });

  // 1. Screenshot Homepage Capabilities Cards (Showing Debate and Transcript)
  await page.evaluate(() => {
    const el = document.getElementById('capabilities');
    if (el) el.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(artDir, 'verify-debate-capabilities-overview.png') });
  console.log('Saved verify-debate-capabilities-overview.png');

  // 2. Open Debate Modal
  await page.evaluate(() => {
    window.dispatchEvent(new CustomEvent('luk-open-capability', { detail: { categoryKey: 'DEBATE_RESOURCES' } }));
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(artDir, 'verify-debate-shopee-modal.png') });
  console.log('Saved verify-debate-shopee-modal.png');

  // 3. In Debate Modal, click Fast Fashion (Out of stock) to test Shopee state
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const fastFashionBtn = buttons.find(b => b.textContent && b.textContent.includes('Fast Fashion'));
    if (fastFashionBtn) fastFashionBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(artDir, 'verify-debate-shopee-out-of-stock.png') });
  console.log('Saved verify-debate-shopee-out-of-stock.png');

  // 4. Close Debate Modal & Open Transcript Modal
  await page.evaluate(() => {
    const closeBtn = document.querySelector('button[aria-label="Đóng"]');
    if (closeBtn) closeBtn.click();
  });
  await new Promise(r => setTimeout(r, 500));

  await page.evaluate(() => {
    window.dispatchEvent(new CustomEvent('luk-open-capability', { detail: { categoryKey: 'TRANSCRIPT_EDITING' } }));
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(artDir, 'verify-transcript-3-services-modal.png') });
  console.log('Saved verify-transcript-3-services-modal.png');

  // 5. Close Transcript Modal & Open Video Modal to test MV Presentation Video Demo
  await page.evaluate(() => {
    const closeBtn = document.querySelector('button[aria-label="Đóng"]');
    if (closeBtn) closeBtn.click();
  });
  await new Promise(r => setTimeout(r, 500));

  await page.evaluate(() => {
    window.dispatchEvent(new CustomEvent('luk-open-capability', { detail: { categoryKey: 'VIDEO_EDITING' } }));
  });
  await new Promise(r => setTimeout(r, 1000));

  // Click watch video button
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const mvBtn = buttons.find(b => b.textContent && b.textContent.includes('Xem Video Mẫu MV'));
    if (mvBtn) mvBtn.click();
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(artDir, 'verify-mv-presentation-video-player.png') });
  console.log('Saved verify-mv-presentation-video-player.png');

  await browser.close();
}

run().catch(console.error);
