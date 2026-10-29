const { spawn } = require('child_process');
const fs = require('fs');

async function testCandidate(rx, ry, rz, scale, px, py, name) {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = 'C:\\Users\\tanay\\AppData\\Local\\Temp\\edge_tune_c_' + Date.now();
  const edge = spawn(edgePath, [
    '--headless',
    '--remote-debugging-port=9236',
    '--user-data-dir=' + profileDir,
    '--no-sandbox',
    '--disable-gpu',
    '--window-size=1000,800',
    'http://localhost:5173/tune_compass.html'
  ]);

  let list = null;
  for (let i = 0; i < 20; i++) {
    try {
      list = await fetch('http://127.0.0.1:9236/json').then(r => r.json());
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

  await send('Runtime.evaluate', { expression: 'document.getElementById("ref-img").style.display = "none";' });
  await send('Runtime.evaluate', { expression: `window.renderModel(${rx}, ${ry}, ${rz}, ${scale}, ${px}, ${py}, 0, 45);` });
  
  const ss = await send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: 834, height: 685, scale: 1 } });
  fs.writeFileSync(name, Buffer.from(ss.data, 'base64'));
  console.log('Saved ' + name);

  ws.close();
  edge.kill();
}

async function run() {
  await testCandidate(0.58, 0.08, -0.02, 2.52, 0.0, -0.02, 'candidate_1.png');
  await testCandidate(0.56, 0.06, -0.01, 2.50, 0.0, -0.03, 'candidate_2.png');
  await testCandidate(0.60, 0.08, -0.02, 2.55, 0.0, -0.02, 'candidate_3.png');
}
run();
