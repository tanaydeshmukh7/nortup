const { spawn } = require('child_process');
const fs = require('fs');

async function testPy() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = 'C:\\Users\\tanay\\AppData\\Local\\Temp\\edge_tune_py_' + Date.now();
  const edge = spawn(edgePath, [
    '--headless',
    '--remote-debugging-port=9237',
    '--user-data-dir=' + profileDir,
    '--no-sandbox',
    '--disable-gpu',
    '--window-size=1000,800',
    'http://localhost:5173/tune_compass.html'
  ]);

  let list = null;
  for (let i = 0; i < 20; i++) {
    try {
      list = await fetch('http://127.0.0.1:9237/json').then(r => r.json());
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

  // Test py values: -0.50, -0.55, -0.60, -0.65
  for (let py of [-0.50, -0.55, -0.60, -0.65]) {
    await send('Runtime.evaluate', { 
      expression: `window.renderModel(0.56, 0.08, -0.01, 2.52, -0.01, ${py}, 0, 45);` 
    });
    const mRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const gl = document.getElementById('c').getContext('webgl2') || document.getElementById('c').getContext('webgl');
          const w = 834, h = 685;
          const p = new Uint8Array(w * h * 4);
          gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, p);
          let minY = h, maxY = 0, sumY = 0, count = 0;
          for (let y = 0; y < h; y++) {
            const fy = h - 1 - y;
            for (let x = 0; x < w; x++) {
              const idx = (y * w + x) * 4;
              if (p[idx+3] > 20 && (p[idx] > 30 || p[idx+1] > 30)) {
                if (fy < minY) minY = fy;
                if (fy > maxY) maxY = fy;
                sumY += fy; count++;
              }
            }
          }
          return { minY, maxY, cy: count ? sumY/count : 0 };
        })()
      `,
      returnByValue: true
    });
    console.log(`py=${py}:`, mRes.result.value);
  }

  ws.close();
  edge.kill();
}
testPy();
