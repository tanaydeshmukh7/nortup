const { spawn } = require('child_process');
const fs = require('fs');

async function testScaleAndPos() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = 'C:\\Users\\tanay\\AppData\\Local\\Temp\\edge_tune_' + Date.now();
  const edge = spawn(edgePath, [
    '--headless',
    '--remote-debugging-port=9234',
    '--user-data-dir=' + profileDir,
    '--no-sandbox',
    '--disable-gpu',
    '--window-size=1000,800',
    'http://localhost:5173/tune_compass.html'
  ]);

  let list = null;
  for (let i = 0; i < 20; i++) {
    try {
      list = await fetch('http://127.0.0.1:9234/json').then(r => r.json());
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

  // Test grid of scale (2.4 to 2.7) and py (-0.25 to -0.40) and px (-0.05 to +0.05)
  // rx=0.56, ry=0.12, rz=0.04 (or fine adjustments)
  const results = [];
  for (let scale of [2.4, 2.5, 2.55, 2.6, 2.65]) {
    for (let py of [-0.25, -0.30, -0.35, -0.40]) {
      for (let px of [-0.04, -0.01, 0.0, 0.02]) {
        for (let rx of [0.52, 0.55, 0.58]) {
          await send('Runtime.evaluate', { 
            expression: `window.renderModel(${rx}, 0.12, 0.04, ${scale}, ${px}, ${py}, 0, 45);` 
          });
          const mRes = await send('Runtime.evaluate', {
            expression: `
              (() => {
                const gl = document.getElementById('c').getContext('webgl2') || document.getElementById('c').getContext('webgl');
                const w = 834, h = 685;
                const p = new Uint8Array(w * h * 4);
                gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, p);
                let minX = w, maxX = 0, minY = h, maxY = 0;
                let sumX = 0, sumY = 0, count = 0;
                for (let y = 0; y < h; y++) {
                  const fy = h - 1 - y;
                  for (let x = 0; x < w; x++) {
                    const idx = (y * w + x) * 4;
                    if (p[idx+3] > 20 && (p[idx] > 30 || p[idx+1] > 30)) {
                      if (x < minX) minX = x;
                      if (x > maxX) maxX = x;
                      if (fy < minY) minY = fy;
                      if (fy > maxY) maxY = fy;
                      sumX += x; sumY += fy; count++;
                    }
                  }
                }
                return { minX, maxX, minY, maxY, cx: count ? sumX/count : 0, cy: count ? sumY/count : 0 };
              })()
            `,
            returnByValue: true
          });
          const m = mRes.result.value;
          // Target: minX ≈ 3, maxX ≈ 833, minY ≈ 12, maxY ≈ 665, cx ≈ 411, cy ≈ 363
          const err = Math.abs(m.minX - 3) + Math.abs(m.maxX - 833) + Math.abs(m.minY - 12) + Math.abs(m.maxY - 665) + Math.abs(m.cx - 411) + Math.abs(m.cy - 363);
          results.push({ rx, scale, px, py, err, ...m });
        }
      }
    }
  }

  results.sort((a, b) => a.err - b.err);
  console.log('Top 5 configurations:');
  for (let i = 0; i < 5; i++) {
    console.log(JSON.stringify(results[i]));
  }

  const best = results[0];
  await send('Runtime.evaluate', { 
    expression: `window.renderModel(${best.rx}, 0.12, 0.04, ${best.scale}, ${best.px}, ${best.py}, 0, 45);` 
  });
  const ss = await send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: 834, height: 685, scale: 1 } });
  fs.writeFileSync('tune_fitted.png', Buffer.from(ss.data, 'base64'));
  console.log('Saved tune_fitted.png');

  ws.close();
  edge.kill();
}
testScaleAndPos();
