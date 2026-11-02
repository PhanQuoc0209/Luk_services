const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');

function getJSON(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

function sendCDP(ws, method, params = {}, id = 1) {
  return new Promise((resolve) => {
    const handler = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === id) {
        ws.removeEventListener('message', handler);
        resolve(msg.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

async function run() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const edge = spawn(edgePath, [
    '--headless=new',
    '--remote-debugging-port=9247',
    '--window-size=1400,1050',
    'http://localhost:3000'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const targets = await getJSON('http://127.0.0.1:9247/json');
    const page = targets.find(t => t.type === 'page');
    const ws = new WebSocket(page.webSocketDebuggerUrl);
    await new Promise((res) => ws.onopen = res);

    let id = 1;
    await new Promise(r => setTimeout(r, 1500));

    const artDir = 'C:/Users/Lenovo/.gemini/antigravity/brain/62961d5b-4900-469a-84a9-bc15c5cd0a17';

    // 1. Scroll to capabilities & capture overview
    await sendCDP(ws, 'Runtime.evaluate', {
      expression: `document.getElementById('capabilities').scrollIntoView();`
    }, id++);
    await new Promise(r => setTimeout(r, 800));

    const overviewImg = await sendCDP(ws, 'Page.captureScreenshot', { format: 'png' }, id++);
    fs.writeFileSync(`${artDir}/verify-homepage-overview.png`, Buffer.from(overviewImg.data, 'base64'));
    console.log('Saved verify-homepage-overview.png');

    // 2. Open Debate Modal (Card 3 in index: Edit Video=0, Edit Slide=1, Transcript=2, Debate=3)
    await sendCDP(ws, 'Runtime.evaluate', {
      expression: `
        window.dispatchEvent(new CustomEvent('luk-open-capability', { detail: { categoryKey: 'DEBATE_RESOURCES' } }));
      `
    }, id++);
    await new Promise(r => setTimeout(r, 1000));

    const debateImg = await sendCDP(ws, 'Page.captureScreenshot', { format: 'png' }, id++);
    fs.writeFileSync(`${artDir}/verify-debate-shopee-modal.png`, Buffer.from(debateImg.data, 'base64'));
    console.log('Saved verify-debate-shopee-modal.png');

    // 3. In Debate Modal, click "Fast Fashion" chip to verify out of stock state
    await sendCDP(ws, 'Runtime.evaluate', {
      expression: `
        const chips = Array.from(document.querySelectorAll('button')).filter(b => b.textContent && b.textContent.includes('Fast Fashion'));
        if (chips[0]) chips[0].click();
      `
    }, id++);
    await new Promise(r => setTimeout(r, 600));

    const debateOutOfStockImg = await sendCDP(ws, 'Page.captureScreenshot', { format: 'png' }, id++);
    fs.writeFileSync(`${artDir}/verify-debate-fastfashion-outofstock.png`, Buffer.from(debateOutOfStockImg.data, 'base64'));
    console.log('Saved verify-debate-fastfashion-outofstock.png');

    // 4. Close modal and open Transcript Modal (categoryKey: 'TRANSCRIPT_EDITING')
    await sendCDP(ws, 'Runtime.evaluate', {
      expression: `
        const closeBtn = document.querySelector('[role="dialog"] button[aria-label="Đóng"]');
        if (closeBtn) closeBtn.click();
      `
    }, id++);
    await new Promise(r => setTimeout(r, 500));

    await sendCDP(ws, 'Runtime.evaluate', {
      expression: `
        window.dispatchEvent(new CustomEvent('luk-open-capability', { detail: { categoryKey: 'TRANSCRIPT_EDITING' } }));
      `
    }, id++);
    await new Promise(r => setTimeout(r, 1000));

    const transcriptImg = await sendCDP(ws, 'Page.captureScreenshot', { format: 'png' }, id++);
    fs.writeFileSync(`${artDir}/verify-transcript-3-services.png`, Buffer.from(transcriptImg.data, 'base64'));
    console.log('Saved verify-transcript-3-services.png');

    // 5. Close modal and open Video Modal (categoryKey: 'VIDEO_EDITING') & expand MV video
    await sendCDP(ws, 'Runtime.evaluate', {
      expression: `
        const closeBtn = document.querySelector('[role="dialog"] button[aria-label="Đóng"]');
        if (closeBtn) closeBtn.click();
      `
    }, id++);
    await new Promise(r => setTimeout(r, 500));

    await sendCDP(ws, 'Runtime.evaluate', {
      expression: `
        window.dispatchEvent(new CustomEvent('luk-open-capability', { detail: { categoryKey: 'VIDEO_EDITING' } }));
      `
    }, id++);
    await new Promise(r => setTimeout(r, 1000));

    // Scroll modal down so MV presentation is fully visible
    await sendCDP(ws, 'Runtime.evaluate', {
      expression: `
        const scrollArea = document.querySelector('[role="dialog"] .overflow-y-auto');
        if (scrollArea) scrollArea.scrollTop = 450;
      `
    }, id++);
    await new Promise(r => setTimeout(r, 600));

    // Click "Xem Video Mẫu MV Presentation"
    await sendCDP(ws, 'Runtime.evaluate', {
      expression: `
        const mvBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Xem Video Mẫu MV'));
        if (mvBtn) mvBtn.click();
      `
    }, id++);
    await new Promise(r => setTimeout(r, 1500));

    const mvVideoImg = await sendCDP(ws, 'Page.captureScreenshot', { format: 'png' }, id++);
    fs.writeFileSync(`${artDir}/verify-mv-presentation-player.png`, Buffer.from(mvVideoImg.data, 'base64'));
    console.log('Saved verify-mv-presentation-player.png');

    ws.close();
  } catch (err) {
    console.error('Error during CDP:', err);
  } finally {
    edge.kill();
  }
}

run();
