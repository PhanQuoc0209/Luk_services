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

async function run() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const edge = spawn(edgePath, [
    '--headless=new',
    '--remote-debugging-port=9255',
    '--window-size=1400,1050',
    'http://localhost:3000'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  const targets = await getJSON('http://127.0.0.1:9255/json');
  const page = targets.find(t => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((res) => ws.onopen = res);

  let id = 1;
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const reqId = id++;
    const handler = (e) => {
      try {
        const msg = JSON.parse(e.data);
        if (msg.id === reqId) {
          ws.removeEventListener('message', handler);
          resolve(msg.result);
        }
      } catch (err) {
        reject(err);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id: reqId, method, params }));
  });

  const artDir = 'C:/Users/Lenovo/.gemini/antigravity/brain/62961d5b-4900-469a-84a9-bc15c5cd0a17';

  await new Promise(r => setTimeout(r, 2500));

  // 1. Simulate F12 press
  console.log('Testing F12 key intercept...');
  await send('Runtime.evaluate', {
    expression: `
      const ev = new KeyboardEvent('keydown', { key: 'F12', code: 'F12', keyCode: 123, which: 123, bubbles: true, cancelable: true });
      window.dispatchEvent(ev);
    `
  });
  await new Promise(r => setTimeout(r, 400));

  const f12Check = await send('Runtime.evaluate', {
    expression: `document.querySelector('[role="alert"]') ? document.querySelector('[role="alert"]').textContent : 'NO_TOAST'`
  });
  console.log('F12 Toast text in DOM:', f12Check.result.value);

  const f12Img = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${artDir}/verify-f12-blocked-toast.png`, Buffer.from(f12Img.data, 'base64'));
  console.log('Saved verify-f12-blocked-toast.png');

  // Wait for toast to fade
  await new Promise(r => setTimeout(r, 3000));

  // 2. Simulate Right-Click (contextmenu)
  console.log('Testing right-click intercept...');
  await send('Runtime.evaluate', {
    expression: `
      const ctxEv = new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: 700, clientY: 500 });
      document.body.dispatchEvent(ctxEv);
    `
  });
  await new Promise(r => setTimeout(r, 400));

  const ctxCheck = await send('Runtime.evaluate', {
    expression: `document.querySelector('[role="alert"]') ? document.querySelector('[role="alert"]').textContent : 'NO_TOAST'`
  });
  console.log('Right-click Toast text in DOM:', ctxCheck.result.value);

  const ctxImg = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${artDir}/verify-rightclick-blocked-toast.png`, Buffer.from(ctxImg.data, 'base64'));
  console.log('Saved verify-rightclick-blocked-toast.png');

  // 3. Simulate DevTools open (Docked size delta > 160)
  console.log('Testing DevTools open detection (Anti-Clone Shield)...');
  await send('Runtime.evaluate', {
    expression: `
      Object.defineProperty(window, 'outerWidth', { value: 1600, configurable: true });
      Object.defineProperty(window, 'innerWidth', { value: 1200, configurable: true });
    `
  });
  await new Promise(r => setTimeout(r, 800));

  const shieldImg = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${artDir}/verify-anti-clone-shield-lock.png`, Buffer.from(shieldImg.data, 'base64'));
  console.log('Saved verify-anti-clone-shield-lock.png');

  ws.close();
  edge.kill();
  console.log('Test completed successfully!');
}

run();
