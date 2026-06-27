# UseCase Generator v1.0.0

Plugin StarUML tạo sơ đồ **Use Case** từ đặc tả text, tuân thủ chuẩn UML 2.x (ĐH KT Công Nghệ Cần Thơ).

Plugin hỗ trợ **>100 phần tử không chồng chéo** nhờ thuật toán Directional Layout v9.0.

Tích hợp hệ thống **License**: dùng thử miễn phí 3 ngày, sau đó cần kích hoạt bằng License Key (RSA 2048-bit).

---

## 1. Cài đặt qua GitHub URL (khuyến nghị)

1. Mở StarUML
2. Vào **Tools → Extension Manager...**
3. Nhấn nút **Install From Url**
4. Nhập URL:
   ```
   https://github.com/ngcaodinh/Usecase_tool-
   ```
5. Nhấn **Install**
6. **Khởi động lại StarUML**

Sau khi cài, menu **Tools** sẽ có 2 mục mới:

- **Generate Use Case Diagram...** — Mở dialog nhập spec để vẽ diagram
- **UseCase Key** — Xem Machine ID + nhập License Key

---

## 2. Cài thủ công (nếu URL không cài được)

1. Tải repo về (nút **Code → Download ZIP** trên GitHub)
2. Giải nén vào:
   - Windows: `%APPDATA%\StarUML\extensions\user\`
   - macOS: `~/Library/Application Support/StarUML/extensions/user/`
   - Linux: `~/.config/StarUML/extensions/user/`
3. Đảm bảo tên folder là `staruml-usecase-generator`
4. Khởi động lại StarUML

---

## 3. Hệ thống License

### 3.1. Trial miễn phí 3 ngày

- Lần đầu cài plugin, tự động ghi nhận ngày cài.
- Có **3 ngày dùng thử** tất cả tính năng.
- Mỗi lần dùng, plugin so sánh ngày hiện tại với ngày cài để tính số ngày còn lại.
- Nếu chỉnh đồng hồ hệ thống về quá khứ, plugin phát hiện và khoá ngay.
- Sau 3 ngày → plugin ngừng hoạt động cho đến khi nhập License Key.

### 3.2. Kích hoạt License Pro

**Bước 1 — Xem Machine ID:**

1. Vào **Tools → UseCase Key**
2. Hộp thoại hiện **Machine ID** (12 ký tự hex, ví dụ `A1B2C3D4E5F6`).
3. Copy mã này và gửi cho developer (qua Zalo/Email/Messenger).

**Bước 2 — Nhận License Key từ developer**

Developer sinh key bằng công cụ nội bộ (không công khai trên repo vì lý do bảo mật). Bạn chỉ cần chờ nhận key gửi lại.

**Bước 3 — Nhập License Key:**

1. Vào **Tools → UseCase Key**
2. Paste key vào ô → nhấn **OK**
3. Plugin xác minh: chữ ký RSA hợp lệ, Machine ID khớp, chưa hết hạn.
4. Nếu hợp lệ → lưu license → dùng thoải mái đến ngày hết hạn.

### 3.3. Hết hạn

- Đến ngày hết hạn, hộp thoại **UseCase Key** sẽ hiện "Đã hết hạn".
- Lúc đó **Tools → Generate Use Case Diagram...** cũng không vẽ được.
- Gửi Machine ID cho developer để được gia hạn key mới.

---

## 4. Dùng plugin

### 4.1. Mở dialog nhập spec

**Tools → Generate Use Case Diagram...**

Dialog hiện ra với spec mẫu. Bạn có thể:

- Xoá hết → paste spec của bạn
- Hoặc sửa trực tiếp spec mẫu

### 4.2. Cú pháp đặc tả

```text
System: <Tên hệ thống>
Actor:  A1, A2, A3, ...                # liệt kê actor, cách nhau dấu phẩy
UseCase: UC1, UC2, UC3, ...           # liệt kê use case, cách nhau dấu phẩy

A1 -> UC1                              # Association (Actor dùng UC)
A1 --> UC1                             # Association 1 chiều
UC1 -> <<include>> UC2                 # Include: UC1 BẮT BUỘC gọi UC2
UC1 -> <<extend>>  UC2 # điều kiện     # Extend: UC1 mở rộng UC2 (có điều kiện)
A1  -> <<generalize>> A2               # Generalization Actor: A1 kế thừa A2
UC1 -> <<generalize>> UC2              # Generalization UC: UC1 chuyên biệt hóa UC2

# Comment bắt đầu bằng // hoặc #
```

### 4.3. Dùng AI sinh đặc tả (khuyến nghị)

Bạn không cần viết đặc tả bằng tay. Copy prompt mẫu bên dưới, dán vào ChatGPT/Claude/Gemini/Cursor, kèm mô tả hệ thống của bạn, rồi paste output vào plugin:

```text
Bạn là chuyên gia UML. Hãy sinh đặc tả text cho StarUML UseCase Generator
theo đúng cú pháp dưới đây.

=== CÚ PHÁP BẮT BUỘC ===
System: <Tên hệ thống>
Actor:  A1, A2, A3, ...
UseCase: UC1, UC2, UC3, ...

A1 -> UC1
A1 --> UC1
UC1 -> <<include>> UC2
UC1 -> <<extend>>  UC2 # điều kiện
A1  -> <<generalize>> A2
UC1 -> <<generalize>> UC2

# Comment bắt đầu bằng // hoặc #

=== YÊU CẦU ===
- Actor phải viết HOA CHỮ CÁI ĐẦU MỖI TỪ (PascalCase) hoặc tiếng Việt có dấu
- UseCase phải nằm trong cùng hệ thống
- Mỗi UC phải có ít nhất 1 Actor liên kết (trực tiếp hoặc qua include/extend)
- Include/Extend chỉ nối giữa UC-UC, KHÔNG nối Actor-UC
- Generalization phải cùng loại: Actor-Actor hoặc UC-UC
- Comment bằng // hoặc # ở đầu dòng

=== MÔ TẢ HỆ THỐNG CỦA TÔI ===
<dán mô tả bài toán / đề bài / yêu cầu vào đây>

Hãy sinh ra đặc tả text hoàn chỉnh, KHÔNG giải thích gì thêm,
KHÔNG dùng markdown code block, chỉ trả về text thuần theo đúng cú pháp trên.
```

---

## 5. Ví dụ đầy đủ copy-paste được

```text
System: Hệ thống Quản lý Thư viện

Actor: Độc giả, Thủ thư, Ban quản lý

UseCase: Đăng nhập, Đăng ký thẻ, Tìm sách, Mượn sách, Trả sách,
         Đặt trước sách, Gia hạn, Nhập sách, Thanh lý sách, Thống kê

// Associations
Độc giả       -> Tìm sách
Độc giả       -> Mượn sách
Độc giả       -> Trả sách
Độc giả       -> Đặt trước sách
Độc giả       -> Gia hạn
Độc giả       -> Đăng ký thẻ
Thủ thư       -> Nhập sách
Thủ thư       -> Thanh lý sách
Ban quản lý   -> Thống kê
Ban quản lý   -> Nhập sách

// Include: Mượn / Trả / Đặt trước / Gia hạn đều cần đăng nhập
Mượn sách        -> <<include>> Đăng nhập
Trả sách         -> <<include>> Đăng nhập
Đặt trước sách   -> <<include>> Đăng nhập
Gia hạn          -> <<include>> Đăng nhập
Đăng ký thẻ      -> <<include>> Đăng nhập

// Extend: Đặt trước mở rộng Tìm sách
Đặt trước sách   -> <<extend>> Tìm sách # khi sách đã có người mượn

// Generalization Actor
Thủ thư          -> <<generalize>> Ban quản lý
```

---

## 6. Quy tắc UML mà plugin kiểm tra

1. Mỗi **Use Case** phải có ít nhất 1 **Actor** liên kết (trực tiếp hoặc gián tiếp qua Include/Extend).
2. Mỗi **Actor** phải có ít nhất 1 **Use Case** liên kết (trừ khi toàn bộ Actor đều rỗng).
3. **Include / Extend** chỉ được nối giữa **UC ↔ UC** (không được nối Actor ↔ UC).
4. **Generalization** phải cùng loại (Actor ↔ Actor hoặc UC ↔ UC).

Nếu vi phạm, plugin sẽ hiện cảnh báo trước khi sinh sơ đồ.

---

## 7. Thuật toán layout (v9.0)

- **Directional Layout** — khớp chuẩn UML slide ĐH KTCN Cần Thơ:
  - Actors: cột TRÁI (ngoài boundary)
  - Primary UC (entry points): 1 hàng GIỮA boundary
  - Include targets: cột PHẢI của primary UC (→)
  - Extend targets: DƯỚI primary UC (↓)
  - Generalization Actor: mũi tên rỗng con→cha
- **Force-directed refinement**: O(n²) separation forces chống overlap
- **Cross-layer collision resolution**: scan + push toàn diện
- **Smart spread**: entry/exit points trên UC boundaries cho đường đẹp
- Hằng số: `UC_W=140, UC_H=50, H_GAP=100, V_GAP=100, ACTOR_W=40, ACTOR_H=70`
- Hỗ trợ **>100 phần tử** không chồng chéo

---

## 8. Bảo mật License

- License Key dùng chữ ký **RSA 2048-bit + SHA-256**.
- Public key nhúng trong plugin (trong `tools/public-key.pem`, được base64-encode qua `tools/key-loader.js`) để xác minh → plugin không thể tự sinh key hợp lệ.
- Chỉ developer giữ private key mới sinh được key.
- Mọi công cụ sinh key + private key + passphrase được giữ **NGOÀI repo public** (`.gitignore` chặn `tools/private-key.pem`, `tools/license-generator.js`, `tools/gen-keys.js`).

### Cấu hình obfuscate (xem `tools/build.js`)

| Tính năng | Mô tả |
|---|---|
| `compact: true` | Nén code thành 1 dòng |
| `controlFlowFlattening` | Phá cấu trúc `if/else/while` thành state-machine |
| `stringArray + RC4/base64` | Tất cả chuỗi literal mã hoá 2 lớp → không search được |
| `deadCodeInjection` | Chèn code rác |
| `selfDefending` | Phát hiện nếu bị format lại bằng prettier/js-beautifier |
| `debugProtection` | Chặn `debugger;` statement |
| `transformObjectKeys` | Mã hoá key của object literals |
| `unicodeEscapeSequence` | Escape ký tự Unicode |
| `numbersToExpressions` | Biến số thành biểu thức toán học |
| `identifierNamesGenerator: mangled` | Đổi tên biến thành `a0`, `_0x4f2a` |

Public key RSA được base64-encode trong `tools/key-loader.js` → trong file obfuscate chỉ thấy 1 chuỗi base64 dài, không nhận ra đó là public key.

### Giới hạn

Obfuscate **KHÔNG** chống được determined attacker (vẫn có thể debug từng bước). Mục đích: tăng chi phí crack cho user bình thường (có chút kỹ năng dev) lên vài giờ → vài ngày. Nếu cần bảo mật tuyệt đối, phải dùng **server-side validation** (user gửi key lên server verify).

---

## 9. Build (dành cho developer)

File `main.js` trong repo là bản đã được **obfuscate** (mã hoá tên biến, chuỗi, control-flow) để người dùng đọc code cũng không hiểu được logic verify license.

Source gốc `src/main.js` được giữ **NGOÀI repo** (folder `D:\CODE\private\ucgen-src\`), không push lên GitHub, không backup lên cloud. Dev tự chịu trách nhiệm backup cá nhân.

### Quy trình sửa code

1. Sửa code trong `D:\CODE\private\ucgen-src\main.js` (file đẹp, đầy comment).
2. Chạy build để sinh `main.js` obfuscate:
   ```bash
   npm run build
   ```
3. Build script sẽ:
   - Đọc `D:\CODE\private\ucgen-src\main.js` + `tools/key-loader.js`
   - Obfuscate (control-flow flattening, string array RC4/base64, dead code, anti-debug, ...)
   - Ghi đè lên `main.js` trong repo (file SHIP cho user)
4. Test (đọc source gốc, không qua obfuscate):
   ```bash
   npm test
   ```
5. Commit + push:
   ```bash
   git add main.js tools/build.js tools/key-loader.js package.json
   git commit -m "..."
   git push
   ```

---

## 10. Lịch sử phiên bản

### v1.0.0 (2026-06-27)
- Tích hợp hệ thống License: trial 3 ngày + RSA-signed key
- Menu Tools thứ 2: "UseCase Key" (xem Machine ID + nhập key)
- Cập nhật `package.json` đúng format StarUML Extension Registry
- Hỗ trợ cài đặt qua Extension Manager → Install From URL
- Repo: https://github.com/ngcaodinh/Usecase_tool-

### v9.0 (2026-06-22)
- **Layout engine**: Grid-based hierarchical placement — primary UC, layer1, layer2+, extend UCs, isolated UC, mỗi layer có grid riêng
- **Thuật toán phân lớp**: include chain propagation (max 20 iterations) để xác định UC thuộc layer nào
- **Fan-out alignment**: layer1 UCs được căn chỉnh dưới primary UC tương ứng
- **Sort order**: primary UC theo fan-out count, layer1/layer2+ theo source UC name
- **Extend placement**: Dưới boundary (extend area), 4 columns max, row/column gaps riêng
- **Isolated UC**: UC không có include/actor → đặt ở cuối grid

### v6.9.1 (2026-06-21) — backup
- **Bug**: `classify()` thiếu field `useCases` → `computeLayout(cls)` crash
- **Fix**: Thêm `useCases: data.useCases` vào return của `classify()` và đổi signature

---

## 11. License

MIT
