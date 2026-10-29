const { spawn } = require('child_process');
const fs = require('fs');

async function optimize() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = 'C:\\Users\\tanay\\AppData\\Local\\Temp\\edge_tune_' + Date.now();
  const edge = spawn(edgePath, [
    '--headless',
    '--remote-debugging-port=9232',
    '--user-data-dir=' + profileDir,
    '--no-sandbox',
    '--disable-gpu',
    '--window-size=1000,800',
    'http://localhost:5173/tune_compass.html'
  ]);

  let list = null;
  for (let i = 0; i < 20; i++) {
    try {
      list = await fetch('http://127.0.0.1:9232/json').then(r => r.json());
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

  // Run the full vector-based optimization inside the browser in one shot
  const optRes = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const THREE = window.THREE || window.__THREE__;
        // Tips in object coordinates
        const pTop = new THREE.Vector3(-0.0094, 0.9867, -0.0115);
        const pBot = new THREE.Vector3(-0.0018, -0.9850, -0.0545);
        const pLeft = new THREE.Vector3(-0.9974, -0.0055, -0.0566);
        const pRight = new THREE.Vector3(0.9993, -0.0021, -0.0587);

        const w = 834, h = 685;
        // Targets: top (414, 12), bot (301, 684), left (3, 349), right (833, 341)
        const tTop = { x: 414, y: 12 };
        const tBot = { x: 301, y: 684 };
        const tLeft = { x: 3, y: 349 };
        const tRight = { x: 833, y: 341 };

        const cam = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
        cam.position.set(0, 0, 5);
        cam.updateMatrixWorld();

        function projectPt(pt, rot, scale, pos) {
          const v = pt.clone();
          v.applyEuler(rot);
          v.multiplyScalar(scale);
          v.add(pos);
          v.project(cam);
          // Convert NDC (-1 to 1) to screen px (0 to w, 0 to h)
          const px = (v.x * 0.5 + 0.5) * w;
          const py = (-v.y * 0.5 + 0.5) * h;
          return { x: px, y: py };
        }

        let bestScore = 1e9;
        let bestParams = null;

        const euler = new THREE.Euler(0, 0, 0, 'XYZ');
        const pos = new THREE.Vector3(0, 0, 0);

        for (let rx = 0.35; rx <= 0.75; rx += 0.02) {
          for (let ry = -0.30; ry <= 0.30; ry += 0.02) {
            for (let rz = -0.30; rz <= 0.10; rz += 0.015) {
              for (let scale = 2.0; scale <= 3.0; scale += 0.05) {
                for (let px = -0.30; px <= 0.30; px += 0.04) {
                  for (let py = -0.30; py <= 0.30; py += 0.04) {
                    euler.set(rx, ry, rz);
                    pos.set(px, py, 0);

                    const prTop = projectPt(pTop, euler, scale, pos);
                    const prBot = projectPt(pBot, euler, scale, pos);
                    const prLeft = projectPt(pLeft, euler, scale, pos);
                    const prRight = projectPt(pRight, euler, scale, pos);

                    const dTop = Math.hypot(prTop.x - tTop.x, prTop.y - tTop.y);
                    const dBot = Math.hypot(prBot.x - tBot.x, prBot.y - tBot.y);
                    const dLeft = Math.hypot(prLeft.x - tLeft.x, prLeft.y - tLeft.y);
                    const dRight = Math.hypot(prRight.x - tRight.x, prRight.y - tRight.y);

                    const score = dTop * 1.5 + dBot * 1.5 + dLeft + dRight;
                    if (score < bestScore) {
                      bestScore = score;
                      bestParams = { rx, ry, rz, scale, px, py };
                    }
                  }
                }
              }
            }
          }
        }

        return { bestScore, bestParams };
      })()
    `,
    returnByValue: true
  });

  console.log('Opt result:', JSON.stringify(optRes.result.value, null, 2));
  const { bestParams } = optRes.result.value;

  // Render model with best parameters
  await send('Runtime.evaluate', {
    expression: `window.renderModel(${bestParams.rx}, ${bestParams.ry}, ${bestParams.rz}, ${bestParams.scale}, ${bestParams.px}, ${bestParams.py}, 0, 45);`
  });

  const ss = await send('Page.captureScreenshot', { 
    format: 'png',
    clip: { x: 0, y: 0, width: 834, height: 685, scale: 1 }
  });
  fs.writeFileSync('tune_best_fast.png', Buffer.from(ss.data, 'base64'));
  console.log('Saved tune_best_fast.png');

  ws.close();
  edge.kill();
}
optimize();
