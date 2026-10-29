const { spawn } = require('child_process');
const fs = require('fs');

async function testRotations() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = 'C:\\Users\\tanay\\AppData\\Local\\Temp\\edge_tune_' + Date.now();
  const edge = spawn(edgePath, [
    '--headless',
    '--remote-debugging-port=9233',
    '--user-data-dir=' + profileDir,
    '--no-sandbox',
    '--disable-gpu',
    '--window-size=1000,800',
    'http://localhost:5173/tune_compass.html'
  ]);

  let list = null;
  for (let i = 0; i < 20; i++) {
    try {
      list = await fetch('http://127.0.0.1:9233/json').then(r => r.json());
      if (list && list.length) break;
    } catch(e) {}
    await new Promise(r => setTimeout(r, 300));
  }
  const target = list.find(t => t.type === 'page');
  const ws = new WebSocket(target.webSocketDebuggerUrl);

  let id = 1;
  function send(method, params = {}) {
    return new Promise((resolve) => {
      const curId = id++;
      const handler = (msg) => {
        const res = JSON.parse(msg.data);
        if (res.id === curId) {
          ws.removeEventListener('message', handler);
          resolve(res.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: curId, method, params }));
    });
  }

  await new Promise(r => ws.addEventListener('open', r));
  await send('Page.enable');
  await send('Runtime.enable');

  for (let i = 0; i < 30; i++) {
    const readyRes = await send('Runtime.evaluate', { expression: 'window.isReady === true' });
    if (readyRes.result && readyRes.result.value) break;
    await new Promise(r => setTimeout(r, 300));
  }

  // Hide ref img
  await send('Runtime.evaluate', { expression: 'document.getElementById("ref-img").style.display = "none";' });

  // Test 1: rx = 0.56, ry = 0.12, rz = 0.04 (previous)
  await send('Runtime.evaluate', { expression: 'window.renderModel(0.56, 0.12, 0.04, 2.1, 0, -0.05, 0, 45);' });
  const ss1 = await send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: 834, height: 685, scale: 1 } });
  fs.writeFileSync('rot_prev.png', Buffer.from(ss1.data, 'base64'));

  // Test 2: rx = -0.50, ry = -0.20, rz = -0.03, scale = 2.4, px = -0.27, py = 0.34
  await send('Runtime.evaluate', { expression: 'window.renderModel(-0.50, -0.20, -0.03, 2.4, -0.27, 0.34, 0, 45);' });
  const ss2 = await send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: 834, height: 685, scale: 1 } });
  fs.writeFileSync('rot_opt.png', Buffer.from(ss2.data, 'base64'));

  // Show ref img alone
  await send('Runtime.evaluate', { expression: `
    document.getElementById("ref-img").style.display = "block";
    document.getElementById("ref-img").style.opacity = "1";
    document.getElementById("c").style.display = "none";
  ` });
  const ssRef = await send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: 834, height: 685, scale: 1 } });
  fs.writeFileSync('rot_ref.png', Buffer.from(ssRef.data, 'base64'));

  ws.close();
  edge.kill();
  console.log('Saved rot_prev.png, rot_opt.png, rot_ref.png');
}
testRotations();
