const { spawn } = require('child_process');
const fs = require('fs');

async function run() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = 'C:\\Users\\tanay\\AppData\\Local\\Temp\\edge_tune_' + Date.now();
  const edge = spawn(edgePath, [
    '--headless',
    '--remote-debugging-port=9230',
    '--user-data-dir=' + profileDir,
    '--no-sandbox',
    '--disable-gpu',
    '--window-size=1000,800',
    'http://localhost:5173/tune_compass.html'
  ]);

  let list = null;
  for (let i = 0; i < 20; i++) {
    try {
      list = await fetch('http://127.0.0.1:9230/json').then(r => r.json());
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

  // Wait for isReady
  for (let i = 0; i < 30; i++) {
    const readyRes = await send('Runtime.evaluate', { expression: 'window.isReady === true' });
    if (readyRes.result && readyRes.result.value) break;
    await new Promise(r => setTimeout(r, 300));
  }
  console.log('Model loaded in tune_compass.html');

  // Hide the ref img temporarily to take pure 3D model screenshot
  await send('Runtime.evaluate', { expression: 'document.getElementById("ref-img").style.display = "none";' });

  // Test set of rotations
  // Let's test current: [0.56, 0.12, 0.04, 2.1, 0, -0.05, 0, 45]
  await send('Runtime.evaluate', { expression: 'window.renderModel(0.56, 0.12, 0.04, 2.1, 0, -0.05, 0, 45);' });
  const ss1 = await send('Page.captureScreenshot', { 
    format: 'png',
    clip: { x: 0, y: 0, width: 834, height: 685, scale: 1 }
  });
  fs.writeFileSync('tune_initial.png', Buffer.from(ss1.data, 'base64'));
  console.log('Saved tune_initial.png');

  ws.close();
  edge.kill();
}
run();
