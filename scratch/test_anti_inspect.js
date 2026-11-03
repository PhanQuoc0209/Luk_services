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
    '--remote-debugging-port=9250',
    '--window-size=1400,1050',
    'http://localhost:3000'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const targets = await getJSON('http://127.0.0.1:9250/json');
    const page = targets.find(t => t.type === 'page');
    const ws = new WebSocket(page.webSocketDebuggerUrl);
    await new Promise((res) => ws.onopen = res);

    let id = 1;
    await new Promise(r => setTimeout(r, 2000));

    const artDir = 'C:/Users/Lenovo/.gemini/antigravity/brain/62961d5b-4900-469a-84a9-bc15c5cd0a17';

    // 1. Dispatch real F12 via CDP Input domain
    await sendCDP(ws, 'Input.dispatchKeyEvent', {
      type: 'rawKeyDown',
      windowsVirtualKeyCode: 123,
      key: 'F12',
      code: 'F12',
      text: '',
      unmodifiedText: ''
    }, id++);
    await sendCDP(ws, 'Input.dispatchKeyEvent', {
      type: 'keyUp',
      windowsVirtualKeyCode: 123,
      key: 'F12',
      code: 'F12'
    }, id++);

    // Also trigger via window dispatch as backup
    await sendCDP(ws, 'Runtime.evaluate', {
      expression: `
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'F12', keyCode: 123, which: 123, bubbles: true }));
      `
    }, id++);
    await new Promise(r => setTimeout(r, 700));

    const f12ToastImg = await sendCDP(ws, 'Page.captureScreenshot', { format: 'png' }, id++);
    fs.writeFileSync(`${artDir}/verify-f12-blocked-toast.png`, Buffer.from(f12ToastImg.data, 'base64'));
    console.log('Saved verify-f12-blocked-toast.png');

    // 2. Simulate right-click (contextmenu)
    await sendCDP(ws, 'Runtime.evaluate', {
      expression: `
        const ctxEvent = new MouseEvent('contextmenu', {
          bubbles: true,
          cancelable: true,
          clientX: 500,
          clientY: 400
        });
        document.body.dispatchEvent(ctxEvent);
      `
    }, id++);
    await new Promise(r => setTimeout(r, 600));

    const rightClickToastImg = await sendCDP(ws, 'Page.captureScreenshot', { format: 'png' }, id++);
    fs.writeFileSync(`${artDir}/verify-rightclick-blocked-toast.png`, Buffer.from(rightClickToastImg.data, 'base64'));
    console.log('Saved verify-rightclick-blocked-toast.png');

    // 3. Trigger DevTools open detection state (Anti-Clone Shield Lock Screen)
    await sendCDP(ws, 'Runtime.evaluate', {
      expression: `
        // Emulate DevTools open state by firing resize or calling the setter directly
        window.dispatchEvent(new Event('resize'));
        // Or inject the lock screen render to test full visual fidelity
        const guardElem = document.querySelector('[role=\"alert\"]');
      `
    }, id++);

    // Let's capture the Anti-Clone Shield by simulating the detector state
    await sendCDP(ws, 'Runtime.evaluate', {
      expression: `
        // Mock innerWidth vs outerWidth difference > 160
        Object.defineProperty(window, 'outerWidth', { value: 1600, configurable: true });
        Object.defineProperty(window, 'innerWidth', { value: 1200, configurable: true });
      `
    }, id++);
    await new Promise(r => setTimeout(r, 1000));

    const shieldLockImg = await sendCDP(ws, 'Page.captureScreenshot', { format: 'png' }, id++);
    fs.writeFileSync(`${artDir}/verify-anti-clone-shield-lock.png`, Buffer.from(shieldLockImg.data, 'base64'));
    console.log('Saved verify-anti-clone-shield-lock.png');

    ws.close();
  } catch (err) {
    console.error('Error during CDP:', err);
  } finally {
    edge.kill();
  }
}

run();
