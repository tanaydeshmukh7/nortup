const { spawn } = require('child_process');
const fs = require('fs');

async function optimize() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = 'C:\\Users\\tanay\\AppData\\Local\\Temp\\edge_tune_' + Date.now();
  const edge = spawn(edgePath, [
    '--headless',
    '--remote-debugging-port=9231',
    '--user-data-dir=' + profileDir,
    '--no-sandbox',
    '--disable-gpu',
    '--window-size=1000,800',
    'http://localhost:5173/tune_compass.html'
  ]);

  let list = null;
  for (let i = 0; i < 20; i++) {
    try {
      list = await fetch('http://127.0.0.1:9231/json').then(r => r.json());
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

  // Inject landmark measurement function into the browser
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        window.evaluateLandmarks = function(rx, ry, rz, scale, px, py, pz, fov) {
          window.renderModel(rx, ry, rz, scale, px, py, pz, fov);
          const gl = document.getElementById('c').getContext('webgl2') || document.getElementById('c').getContext('webgl');
          const w = 834, h = 685;
          const pixels = new Uint8Array(w * h * 4);
          gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
          
          let minX = w, maxX = 0, minY = h, maxY = 0;
          let topPt = { x: 0, y: h }, botPt = { x: 0, y: 0 };
          let leftPt = { x: w, y: 0 }, rightPt = { x: 0, y: 0 };
          
          for (let y = 0; y < h; y++) {
            // WebGL y=0 is bottom
            const flippedY = h - 1 - y;
            for (let x = 0; x < w; x++) {
              const idx = (y * w + x) * 4;
              const r = pixels[idx], g = pixels[idx+1], a = pixels[idx+3];
              if (a > 20 && (r > 30 || g > 30)) {
                if (x < minX) minX = x;
                if (x > maxX) maxX = x;
                if (flippedY < minY) minY = flippedY;
                if (flippedY > maxY) maxY = flippedY;
                
                if (flippedY < topPt.y) topPt = { x, y: flippedY };
                if (flippedY > botPt.y) botPt = { x, y: flippedY };
                if (x < leftPt.x) leftPt = { x, y: flippedY };
                if (x > rightPt.x) rightPt = { x, y: flippedY };
              }
            }
          }
          return { topPt, botPt, leftPt, rightPt, minX, maxX, minY, maxY };
        };
      })()
    `
  });

  // Target:
  // topPt: (414, 12), botPt: (301, 684), leftPt: (3, 349), rightPt: (833, 341)
  // Let's test grid around correct needle slant (rz < 0)
  // rx tilts around X, ry around Y, rz around Z
  let bestScore = 1e9;
  let bestParams = null;
  let bestMetrics = null;

  // Broad search
  for (let rx of [0.45, 0.52, 0.58, 0.64, 0.70]) {
    for (let ry of [-0.25, -0.15, -0.05, 0.05, 0.15, 0.25]) {
      for (let rz of [-0.28, -0.22, -0.16, -0.10, -0.04, 0.02]) {
        for (let scale of [2.3, 2.5, 2.7, 2.9, 3.1]) {
          for (let py of [-0.15, -0.05, 0.05, 0.15]) {
            for (let px of [-0.15, -0.05, 0.05, 0.15]) {
              const evalRes = await send('Runtime.evaluate', {
                expression: `window.evaluateLandmarks(${rx}, ${ry}, ${rz}, ${scale}, ${px}, ${py}, 0, 45)`,
                returnByValue: true
              });
              const m = evalRes.result.value;
              // Score based on distance from targets
              const dTop = Math.hypot(m.topPt.x - 414, m.topPt.y - 12);
              const dBot = Math.hypot(m.botPt.x - 301, m.botPt.y - 684);
              const dLeft = Math.hypot(m.leftPt.x - 3, m.leftPt.y - 349);
              const dRight = Math.hypot(m.rightPt.x - 833, m.rightPt.y - 341);
              const score = dTop * 1.5 + dBot * 1.5 + dLeft + dRight;
              
              if (score < bestScore) {
                bestScore = score;
                bestParams = { rx, ry, rz, scale, px, py };
                bestMetrics = m;
              }
            }
          }
        }
      }
    }
  }

  console.log('Broad search best score:', bestScore);
  console.log('Broad search best params:', JSON.stringify(bestParams));
  console.log('Broad search best metrics:', JSON.stringify(bestMetrics));

  // Now fine search around bestParams
  let fineScore = bestScore;
  let fineParams = { ...bestParams };
  let fineMetrics = bestMetrics;

  const rxVals = [bestParams.rx - 0.04, bestParams.rx - 0.02, bestParams.rx, bestParams.rx + 0.02, bestParams.rx + 0.04];
  const ryVals = [bestParams.ry - 0.04, bestParams.ry - 0.02, bestParams.ry, bestParams.ry + 0.02, bestParams.ry + 0.04];
  const rzVals = [bestParams.rz - 0.04, bestParams.rz - 0.02, bestParams.rz, bestParams.rz + 0.02, bestParams.rz + 0.04];
  const scaleVals = [bestParams.scale - 0.15, bestParams.scale - 0.08, bestParams.scale, bestParams.scale + 0.08, bestParams.scale + 0.15];
  const pxVals = [bestParams.px - 0.06, bestParams.px - 0.03, bestParams.px, bestParams.px + 0.03, bestParams.px + 0.06];
  const pyVals = [bestParams.py - 0.06, bestParams.py - 0.03, bestParams.py, bestParams.py + 0.03, bestParams.py + 0.06];

  for (let rx of rxVals) {
    for (let ry of ryVals) {
      for (let rz of rzVals) {
        for (let scale of scaleVals) {
          for (let py of pyVals) {
            for (let px of pxVals) {
              const evalRes = await send('Runtime.evaluate', {
                expression: `window.evaluateLandmarks(${rx.toFixed(3)}, ${ry.toFixed(3)}, ${rz.toFixed(3)}, ${scale.toFixed(3)}, ${px.toFixed(3)}, ${py.toFixed(3)}, 0, 45)`,
                returnByValue: true
              });
              const m = evalRes.result.value;
              const dTop = Math.hypot(m.topPt.x - 414, m.topPt.y - 12);
              const dBot = Math.hypot(m.botPt.x - 301, m.botPt.y - 684);
              const dLeft = Math.hypot(m.leftPt.x - 3, m.leftPt.y - 349);
              const dRight = Math.hypot(m.rightPt.x - 833, m.rightPt.y - 341);
              const score = dTop * 1.5 + dBot * 1.5 + dLeft + dRight;
              
              if (score < fineScore) {
                fineScore = score;
                fineParams = { rx, ry, rz, scale, px, py };
                fineMetrics = m;
              }
            }
          }
        }
      }
    }
  }

  console.log('\n=== FINAL FINE SEARCH RESULT ===');
  console.log('Fine score:', fineScore);
  console.log('Fine params:', JSON.stringify(fineParams, null, 2));
  console.log('Fine metrics:', JSON.stringify(fineMetrics, null, 2));

  // Render and capture screenshot of best
  await send('Runtime.evaluate', {
    expression: `window.renderModel(${fineParams.rx}, ${fineParams.ry}, ${fineParams.rz}, ${fineParams.scale}, ${fineParams.px}, ${fineParams.py}, 0, 45);`
  });
  const ss = await send('Page.captureScreenshot', { 
    format: 'png',
    clip: { x: 0, y: 0, width: 834, height: 685, scale: 1 }
  });
  fs.writeFileSync('tune_best.png', Buffer.from(ss.data, 'base64'));
  console.log('Saved tune_best.png');

  ws.close();
  edge.kill();
}
optimize();
