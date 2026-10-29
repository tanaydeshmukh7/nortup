const { spawn } = require('child_process');
const fs = require('fs');

async function captureCanvas() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = 'C:\\Users\\tanay\\AppData\\Local\\Temp\\edge_verify_canvas_' + Date.now();
  const edge = spawn(edgePath, [
    '--headless',
    '--remote-debugging-port=9229',
    '--user-data-dir=' + profileDir,
    '--no-sandbox',
    '--disable-gpu',
    '--window-size=1405,850',
    'http://localhost:5173/'
  ]);

  let list = null;
  for (let i = 0; i < 20; i++) {
    try {
      list = await fetch('http://127.0.0.1:9229/json').then(r => r.json());
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
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1405,
    height: 753,
    deviceScaleFactor: 1,
    mobile: false
  });

  await new Promise(r => setTimeout(r, 3000));

  const canvasBox = await send('Runtime.evaluate', {
    expression: `
      (() => { 
        const c = document.querySelector('canvas'); 
        const r = c.getBoundingClientRect(); 
        const hero = document.querySelector('section > div').getBoundingClientRect();
        return { 
          hero: { x: hero.x, y: hero.y, width: hero.width, height: hero.height },
          canvas: { x: r.x, y: r.y, width: r.width, height: r.height } 
        }; 
      })()
    `,
    returnByValue: true
  });
  console.log('Measurements:', JSON.stringify(canvasBox.result.value, null, 2));
  const r = canvasBox.result.value.canvas;

  const ss = await send('Page.captureScreenshot', { 
    format: 'png',
    clip: { x: r.x, y: r.y, width: r.width, height: r.height, scale: 1 }
  });
  fs.writeFileSync('canvas_only.png', Buffer.from(ss.data, 'base64'));
  console.log('Saved canvas_only.png');

  ws.close();
  edge.kill();
}
captureCanvas();
