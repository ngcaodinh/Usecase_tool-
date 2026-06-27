// ================================================================
//  StarUML UseCase Generator – build.js
//  Build script: đọc source gốc (LOCAL ONLY) → obfuscate → ghi vào
//  main.js trong repo (file SHIP cho user).
//
//  CHÚ Ý:
//      - Source gốc KHÔNG nằm trong repo. Đường dẫn mặc định trỏ
//        tới D:\CODE\private\ucgen-src\main.js (ngoài repo, local
//        only, KHÔNG backup cloud).
//      - Có thể override bằng env var UCGEN_SRC.
//      - Output luôn ghi đè main.js trong thư mục repo hiện tại.
//
//  Chạy:
//      npm run build
//      hoặc: node tools/build.js
// ================================================================

const fs        = require('fs');
const path      = require('path');
const Obfuscator = require('javascript-obfuscator');

// ── Đường dẫn ────────────────────────────────────────────────────
const DEFAULT_SRC = path.resolve('D:/CODE/private/ucgen-src/main.js');
const SRC  = process.env.UCGEN_SRC || DEFAULT_SRC;
const HERE = __dirname;
const OUT  = path.resolve(HERE, '..', 'main.js');

if (!fs.existsSync(SRC)) {
    console.error('Khong tim thay source goc: ' + SRC);
    console.error('Hay dat file source goc o day, hoac set env UCGEN_SRC=<path>.');
    process.exit(1);
}

// ── Merge main.js + key-loader.js thành 1 file source cho build ──
// (Cả 2 file đều được obfuscate cùng nhau → string base64 của pubkey
// cũng bị mã hoá RC4/base64 → user mở main.js ra không nhận ra.)
const mainCode    = fs.readFileSync(SRC, 'utf8');
const keyLoader   = fs.readFileSync(path.join(HERE, 'key-loader.js'), 'utf8');
const combined    = keyLoader + '\n\n' + mainCode;

// ── Cấu hình obfuscate (xem plan.md muc 2.2) ─────────────────────
const options = {
    compact: true,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 1,
    deadCodeInjection: true,
    deadCodeInjectionThreshold: 0.4,
    debugProtection: true,
    debugProtectionInterval: 5000,
    disableConsoleOutput: false,
    identifierNamesGenerator: 'mangled',
    renameGlobals: false,
    reservedNames: ['init', 'exports'],
    selfDefending: true,
    stringArray: true,
    stringArrayEncoding: ['base64', 'rc4'],
    stringArrayThreshold: 1,
    transformObjectKeys: true,
    unicodeEscapeSequence: true,
    numbersToExpressions: true,
    simplify: true
};

console.log('Build config:');
console.log('  SRC  = ' + SRC);
console.log('  OUT  = ' + OUT);
console.log('  Size = ' + combined.length + ' bytes');
console.log('Obfuscating...');

const t0 = Date.now();
const result = Obfuscator.obfuscate(combined, options);
const code   = result.getObfuscatedCode();
const dt     = Date.now() - t0;

fs.writeFileSync(OUT, code);

console.log('Done in ' + dt + 'ms');
console.log('Output: ' + OUT + ' (' + code.length + ' bytes, ratio ' +
            (code.length / combined.length).toFixed(2) + 'x)');