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
    '--remote-debugging-port=9254',
    '--window-size=1400,1050',
    'http://localhost:3000'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  const targets = await getJSON('http://127.0.0.1:9254/json');
  const page = targets.find(t => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((res) => ws.onopen = res);

  let id = 1;
  const send = (method, params = {}) => new Promise(resolve => {
    const handler = e => {
      const msg = JSON.parse(e.data);
      if (msg.id === id) {
        ws.removeEventListener('message', handler);
        resolve(msg.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id: id++, method, params }));
  });

  const artDir = 'C:/Users/Lenovo/.gemini/antigravity/brain/62961d5b-4900-469a-84a9-bc15c5cd0a17';

  await send('Runtime.evaluate', {
    expression: 'window.__AUTOMATION_MODE__ = true;'
  });

  await new Promise(r => setTimeout(r, 1200));

  // 1. Dispatch F12 keydown event
  await send('Runtime.evaluate', {
    expression: `
      const ev = new KeyboardEvent('keydown', { key: 'F12', code: 'F12', keyCode: 123, which: 123, bubbles: true, cancelable: true });
      window.dispatchEvent(ev);
    `
  });
  await new Promise(r => setTimeout(r, 400));

  const toast1 = await send('Runtime.evaluate', {
    expression: `document.querySelector('[role="alert"]') ? document.querySelector('[role="alert"]').textContent : 'NO_TOAST'`
  });
  console.log('F12 Toast text:', toast1.result.value);

  const f12Img = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${artDir}/verify-f12-blocked-toast.png`, Buffer.from(f12Img.data, 'base64'));
  console.log('Saved verify-f12-blocked-toast.png');

  // 2. Dispatch right-click contextmenu event
  await send('Runtime.evaluate', {
    expression: `
      const ctxEv = new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: 600, clientY: 400 });
      document.body.dispatchEvent(ctxEv);
    `
  });
  await new Promise(r => setTimeout(r, 400));

  const toast2 = await send('Runtime.evaluate', {
    expression: `document.querySelector('[role="alert"]') ? document.querySelector('[role="alert"]').textContent : 'NO_TOAST'`
  });
  console.log('Right-click Toast text:', toast2.result.value);

  const ctxImg = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${artDir}/verify-rightclick-blocked-toast.png`, Buffer.from(ctxImg.data, 'base64'));
  console.log('Saved verify-rightclick-blocked-toast.png');

  // 3. Trigger DevTools Anti-Clone Shield lock screen
  await send('Runtime.evaluate', {
    expression: `
      delete window.__AUTOMATION_MODE__;
      Object.defineProperty(window, 'outerWidth', { value: 1600, configurable: true });
      Object.defineProperty(window, 'innerWidth', { value: 1200, configurable: true });
      window.dispatchEvent(new Event('resize'));
    `
  });
  await new Promise(r => setTimeout(r, 800));

  const shieldImg = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${artDir}/verify-anti-clone-shield-lock.png`, Buffer.from(shieldImg.data, 'base64'));
  console.log('Saved verify-anti-clone-shield-lock.png');

  ws.close();
  edge.kill();
}
run();
