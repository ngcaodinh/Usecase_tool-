// ================================================================
//  Smoke test: parseSpec / classify / computeLayout
//  Đảm bảo refactor LicenseManager không hỏng logic cũ.
// ================================================================

const fs   = require('fs');
const path = require('path');

const mockApp = {
    factory: {
        createDiagram: function(opts) {
            return { id: opts.id, parent: opts.parent, name: '' };
        },
        createModelAndView: function(opts) {
            return {
                id: opts.id,
                _pos: { x1: opts.x1, y1: opts.y1, x2: opts.x2, y2: opts.y2 },
                model: { name: '', _props: {} },
                _tailView: opts.tailView, _headView: opts.headView
            };
        }
    },
    engine: { setProperty: function (m, k, v) { if (m) m[k] = v; } },
    diagrams: { open: function () {} },
    preferences: { get: function () { return null; }, set: function () {} }
};
global.app = mockApp;

// Đọc source gốc từ folder PRIVATE (ngoài repo) + tools/key-loader.js
// để test không bị ảnh hưởng bởi obfuscate.
const SRC_DIR = process.env.UCGEN_SRC_DIR || 'D:/CODE/private/ucgen-src';
const mainCode = fs.readFileSync(path.join(SRC_DIR, 'main.js'), 'utf8');
const keyLoaderCode = fs.readFileSync(path.join(__dirname, 'tools', 'key-loader.js'), 'utf8');
eval(keyLoaderCode + '\n' + mainCode);

const spec =
    'System: Smoke test\n' +
    'Actor: SinhVien, GiaoVien\n' +
    'UseCase: DangNhap, TimMon, DangKyHP\n' +
    'SinhVien -> DangKyHP\n' +
    'GiaoVien -> TimMon\n' +
    'DangKyHP -> <<include>> DangNhap\n' +
    'TimMon -> <<include>> DangNhap\n';

const data  = parseSpec(spec);
const cls   = classify(data);
const lyt   = computeLayout(data, cls);

let ok = 0, ng = 0;
function chk(name, cond, info) {
    if (cond) { console.log('  PASS  ' + name); ok++; }
    else      { console.log('  FAIL  ' + name + (info ? ' — ' + info : '')); ng++; }
}

chk('parseSpec: actors = 2',     data.actors.length === 2, JSON.stringify(data.actors));
chk('parseSpec: useCases = 3',   data.useCases.length === 3, JSON.stringify(data.useCases));
chk('parseSpec: relations = 4 (2 assoc + 2 include)', data.relations.length === 4, JSON.stringify(data.relations));
chk('parseSpec: include relation exists', data.relations.some(r => r.type === 'include'));
chk('parseSpec: association relation exists', data.relations.some(r => r.type === 'association'));
chk('computeLayout: ucPositions exist', Array.isArray(lyt.ucPositions) && lyt.ucPositions.length >= 3);
chk('computeLayout: actorPositions exist', lyt.actorPositions && Object.keys(lyt.actorPositions).length === 2);

console.log('PASS: ' + ok + '  FAIL: ' + ng);
process.exit(ng === 0 ? 0 : 1);
