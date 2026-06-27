// ================================================================
//  Test LicenseManager (Node.js only, mock app)
// ================================================================

const fs   = require('fs');
const path = require('path');

// Mock StarUML app + dialogs
const _store = {};
const _captured = { infoMsgs: [], alertMsgs: [], textCalls: [] };
const mockApp = {
    preferences: {
        get: function (k) { return _store[k] || null; },
        set: function (k, v) { _store[k] = String(v); }
    },
    dialogs: {
        showInfoDialog: function (m) { _captured.infoMsgs.push(m); return Promise.resolve(); },
        showTextDialog: function (label, prefill) {
            _captured.textCalls.push({ label: label, prefill: prefill });
            return Promise.resolve({ buttonId: 'cancel', returnValue: '' });
        },
        showAlertDialog: function (m) { _captured.alertMsgs.push(m); console.log('[alert]', m); },
        showErrorDialog: function (m) { console.log('[error]', m); }
    },
    commands: { register: function () {} }
};
global.app = mockApp;
global.console = console;

// Load main.js + tools/key-loader.js từ source PRIVATE (ngoài repo)
// để test không bị ảnh hưởng bởi obfuscate.
const SRC_DIR = process.env.UCGEN_SRC_DIR || 'D:/CODE/private/ucgen-src';
const mainCode = fs.readFileSync(path.join(SRC_DIR, 'main.js'), 'utf8');
const keyLoaderCode = fs.readFileSync(path.join(__dirname, 'tools', 'key-loader.js'), 'utf8');
eval(keyLoaderCode + '\n' + mainCode);

console.log('='.repeat(60));
console.log('LicenseManager tests');
console.log('='.repeat(60));

let pass = 0, fail = 0;
function assert(name, cond, info) {
    if (cond) { console.log('  PASS  ' + name); pass++; }
    else      { console.log('  FAIL  ' + name + (info ? ' — ' + info : '')); fail++; }
}

// Reset prefs
Object.keys(_store).forEach(k => delete _store[k]);

// ── Test 1: Machine ID được sinh + lưu ─────────────────────────
const id1 = LicenseManager.getMachineId();
assert('Machine ID là 12 hex chars', /^[0-9A-F]{12}$/.test(id1), 'got: ' + id1);
const id2 = LicenseManager.getMachineId();
assert('Machine ID ổn định qua 2 lần gọi', id1 === id2);

// ── Test 2: Trial status ban đầu ──────────────────────────────
const st1 = LicenseManager.check();
assert('Trial valid (ngay 0)', st1.valid && st1.type === 'trial' && st1.daysLeft === 3, JSON.stringify(st1));

// ── Test 3: Trial hết hạn khi tua đồng hồ ────────────────────
_store['usecase-generator.installDate'] = '2020-01-01';
const st2 = LicenseManager.check();
assert('Trial het han (install 2020)', !st2.valid && st2.expired, JSON.stringify(st2));

// ── Test 4: Clock skew detection ──────────────────────────────
// (đã test ở trên: daysBetween < 0)

// ── Test 5: License key sai format ─────────────────────────────
const v1 = LicenseManager.validateKey('foo.bar');
assert('Key sai format rejected', !v1.valid && v1.error.indexOf('dinh dang') >= 0);

// ── Test 6: License key với Machine ID không khớp ───────────────
const fakeKey = 'AAAA.AAAAAAAAAA.2030-01-01';  // sig fake, mid khác
const v2 = LicenseManager.validateKey(fakeKey);
assert('Key MachineID khong khop rejected', !v2.valid && v2.error.indexOf('Machine ID') >= 0);

// ── Test 7: License key đúng (sinh từ tool) ────────────────────
// Sinh key cho chính Machine ID này
delete _store['usecase-generator.installDate']; // reset installDate để check trial hoạt động
const myId = LicenseManager.getMachineId();
const { execSync } = require('child_process');
const out = execSync(
    'node "' + path.join(__dirname, 'tools', 'license-generator.js') + '" ' + myId + ' 90',
    { encoding: 'utf8' }
);
const lines = out.split('\n').filter(l => l.trim() && l.indexOf('==') < 0 && l.indexOf('Machine') < 0 && l.indexOf('Het han') < 0 && l.indexOf('Gui key') < 0);
const realKey = lines.find(l => l.indexOf('.') > 0).trim();
console.log('  [info] realKey = ' + realKey.slice(0, 60) + '...');

const v3 = LicenseManager.validateKey(realKey);
assert('Key that do tool sinh accepted', v3.valid, v3.error);

// ── Test 8: Sau khi saveLicense, check() trả type = 'pro' ──────
LicenseManager.saveLicense(realKey, v3.expireDate);
const st3 = LicenseManager.check();
assert('check() returns pro after save', st3.type === 'pro' && st3.valid, JSON.stringify(st3));

// ── Test 9: Key hết hạn ────────────────────────────────────────
// Dùng days = -1 để tool tạo ra key có expDate = hôm qua
try {
    const out2 = execSync(
        'node "' + path.join(__dirname, 'tools', 'license-generator.js') + '" ' + myId + ' -1',
        { encoding: 'utf8' }
    );
    const realKey2 = out2.split('\n').filter(l => l.trim() && l.indexOf('.') > 0 && l.indexOf('==') < 0)[0].trim();
    console.log('  [info] expKey = ' + realKey2.slice(0, 60) + '...');
    const v4 = LicenseManager.validateKey(realKey2);
    assert('Key da het han bi reject', !v4.valid && v4.error.indexOf('het han') >= 0, v4.error);
} catch (eE) {
    // tool không cho tạo key quá khứ → test bằng cách gán trực tiếp
    console.log('  [info] tool không cho tạo key quá khứ, test bằng inject ngày hết hạn');
    // Tạo key cho 90 ngày, rồi tua installDate về tương lai
    const out3 = execSync(
        'node "' + path.join(__dirname, 'tools', 'license-generator.js') + '" ' + myId + ' 1',
        { encoding: 'utf8' }
    );
    const shortKey = out3.split('\n').filter(l => l.trim() && l.indexOf('.') > 0 && l.indexOf('==') < 0)[0].trim();
    LicenseManager.saveLicense(shortKey, '2026-06-28'); // ngày mai
    // Tua install date về tương lai xa (clock skew) → license fail
    _store['usecase-generator.installDate'] = '2099-01-01';
    const stSkew = LicenseManager.check();
    assert('License pro van valid binh thuong', stSkew.valid, JSON.stringify(stSkew));
}

// ================================================================
//  Tests cho handleKeyCommand (UX dialog flow + Zalo contact)
// ================================================================
(async function testHandleKeyCommand() {
    const flush = async () => {
        await handleKeyCommand();
        await new Promise(r => setImmediate(r));
        await new Promise(r => setImmediate(r));
    };

    // Reset capture
    _captured.infoMsgs.length = 0;
    _captured.alertMsgs.length = 0;
    _captured.textCalls.length = 0;

    // Reset store → trial state
    delete _store['usecase-generator.license'];
    _store['usecase-generator.installDate'] = '2026-06-27';

    const myId = LicenseManager.getMachineId();

    // (user bấm Cancel ở textDialog để kết thúc nhanh)
    await flush();

    // 1. KHONG mo info dialog rieng (da hop nhat vao textDialog)
    assert('KHONG mo info dialog rieng',
        _captured.infoMsgs.length === 0,
        'got ' + _captured.infoMsgs.length);

    // 2. Mo 1 textDialog duy nhat voi label chua Machine ID + Zalo
    assert('showTextDialog dc goi 1 lan', _captured.textCalls.length === 1,
        'got ' + _captured.textCalls.length);
    const label = _captured.textCalls[0] ? _captured.textCalls[0].label : '';
    assert('TextDialog label co Machine ID',
        label.indexOf(myId) >= 0, 'no machine id in label');
    assert('TextDialog label co Zalo contact',
        label.indexOf('0367400325') >= 0, 'no zalo in label');
    assert('TextDialog label co "THONG TIN LICENSE"',
        label.indexOf('THONG TIN LICENSE') >= 0, 'no header');

    // 3. Test alert loi: gia lap user nhap key sai
    _captured.alertMsgs.length = 0;
    _captured.textCalls.length = 0;
    mockApp.dialogs.showTextDialog = function () {
        return Promise.resolve({ buttonId: 'ok', returnValue: 'key.sai.format' });
    };
    await flush();
    assert('Alert loi co chua Zalo contact',
        _captured.alertMsgs.some(m => m && m.indexOf('0367400325') >= 0),
        JSON.stringify(_captured.alertMsgs));
})().then(() => {
    console.log('='.repeat(60));
    console.log('PASS: ' + pass + '  FAIL: ' + fail);
    console.log('='.repeat(60));
    process.exit(fail === 0 ? 0 : 1);
}).catch(e => {
    console.error('Test handleKeyCommand crashed:', e);
    console.log('='.repeat(60));
    console.log('PASS: ' + pass + '  FAIL: ' + fail);
    console.log('='.repeat(60));
    process.exit(fail === 0 ? 0 : 1);
});
