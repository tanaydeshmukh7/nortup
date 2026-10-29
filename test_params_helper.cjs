const { spawn } = require('child_process');
const fs = require('fs');

async function testParams(rx, ry, rz, scale, px, py, fov = 45) {
  // Update CompassCanvas.jsx with the test params
  let code = fs.readFileSync('src/components/CompassCanvas.jsx', 'utf-8');
  
  // Replace scale, position, rotation, fov
  code = code.replace(/scale=\{[^}]+\}/, `scale={${scale}}`);
  code = code.replace(/position=\{[^}]+\}/, `position={[${px}, ${py}, 0]}`);
  code = code.replace(/rotation=\{[^}]+\}/, `rotation={[${rx}, ${ry}, ${rz}]}`);
  code = code.replace(/fov:\s*\d+/, `fov: ${fov}`);
  
  fs.writeFileSync('src/components/CompassCanvas.jsx', code);
  
  // Wait a moment for Vite HMR
  await new Promise(r => setTimeout(r, 800));
}

module.exports = { testParams };
