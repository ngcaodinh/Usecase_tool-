# AI Prompt — Sinh đặc tả Use Case cho StarUML UseCase Generator

File này chứa **prompt chuẩn** để bạn copy → dán vào ChatGPT / Claude / Gemini / Cursor → kèm mô tả hệ thống của bạn → AI sẽ trả về text theo đúng cú pháp mà plugin StarUML UseCase Generator yêu cầu.

---

## 1. Prompt chính (copy toàn bộ khối dưới)

````markdown
Bạn là chuyên gia phân tích thiết kế hướng đối tượng (OOAD/UML).

Nhiệm vụ: từ mô tả hệ thống bằng tiếng Việt của tôi ở cuối prompt, hãy sinh ra
**đặc tả text dùng cho StarUML UseCase Generator** theo đúng cú pháp bắ buộc
bên dưới.

============================================================
CÚ PHÁP BẮT BUỘC (copy nguyên khối này vào output)
============================================================

System: <Tên hệ thống>

Actor:  A1, A2, A3, ...           # liệt kê tất cả actor, cách nhau dấu phẩy
UseCase: UC1, UC2, UC3, ...      # liệt kê tất cả use case, cách nhau dấu phẩy

# Quan hệ (mỗi dòng 1 quan hệ):
A1  -> UC1                              # Association (Actor dùng UC)
A1  --> UC1                             # Association 1 chiều
UC1 -> <<include>> UC2                  # Include: UC1 BẮT BUỘC gọi UC2
UC1 -> <<extend>>  UC2 # điều kiện      # Extend: UC1 mở rộng UC2 (kèm điều kiện)
A1  -> <<generalize>> A2                # Generalization Actor: A1 kế thừa A2
UC1 -> <<generalize>> UC2               # Generalization UC: UC1 chuyên biệt hóa UC2

# Comment bắt đầu bằng // hoặc # ở đầu dòng (được phép, sẽ bị bỏ qua khi parse)

============================================================
QUY TẮC UML BẮT BUỘC
============================================================

1. Mỗi Use Case phải có ít nhất 1 Actor liên kết (trực tiếp hoặc gián tiếp
   qua Include/Extend).
2. Mỗi Actor phải có ít nhất 1 Use Case liên kết.
3. Include / Extend CHỈ nối giữa UC ↔ UC, KHÔNG nối Actor ↔ UC.
4. Generalization phải cùng loại:
   - Actor → <<generalize>> → Actor
   - UC    → <<generalize>> → UC
   KHÔNG được Actor ↔ UC.
5. Include chain tối đa 20 tầng. Tránh tạo include cycle (A → include → B
   → include → A).
6. Extend phải có điều kiện (sau dấu #). Nếu không có điều kiện rõ ràng
   thì KHÔNG dùng extend.

============================================================
QUY ƯỚC ĐẶT TÊN
============================================================

- Tên Actor: PascalCase tiếng Anh (vd: Customer, LibraryStaff, AdminUser)
  HOẶC tiếng Việt có dấu tự nhiên (vd: Độc giả, Thủ thư, Ban quản lý).
  KHÔNG dùng snake_case, kebab-case, hoặc tên kỹ thuật (vd: tbl_user).
- Tên Use Case: bắt đầu bằng động từ + bổ ngữ (vd: Đăng nhập, Mượn sách,
  Tìm kiếm sách, Thanh toán qua VNPay). Tránh danh từ đơn lẻ.
- Mỗi Actor / UC chỉ khai báo MỘT LẦN ở phần khai báo đầu.
- Không trùng tên Actor với Use Case.

============================================================
ĐỊNH DẠNG OUTPUT (BẮT BUỘC)
============================================================

- Chỉ trả về text thuần theo đúng cú pháp trên.
- KHÔNG dùng markdown code block (```), KHÔNG bọc ```text.
- KHÔNG giải thích, KHÔNG nhận xét, KHÔNG chú thích ngoài các comment //
  hoặc # trong spec.
- KHÔNG thêm dòng trống thừa ngoài dòng trống phân tách các nhóm.
- Nếu thiếu thông tin để xác định quan hệ, hãy CHỌN giải pháp hợp lý nhất
  và ghi chú bằng comment # ở cuối spec.

============================================================
MÔ TẢ HỆ THỐNG CỦA TÔI
============================================================

<dán mô tả bài toán / đề bài / yêu cầu của bạn vào đây>

Ví dụ:
- Hệ thống quản lý thư viện cho phép độc giả mượn trả sách, thủ thư quản lý
  nhập xuất sách, ban quản lý xem thống kê.
- App bán hàng online cho phép khách đặt mua, thanh toán VNPay/MoMo; admin
  duyệt đơn và quản lý kho.
- Hệ thống đặt phòng khách sạn: khách tìm phòng trống, đặt phòng, thanh
  toán; lễ tân xác nhận, quản lý xem báo cáo doanh thu.

Hãy sinh ra đặc tả text hoàn chỉnh theo đúng cú pháp trên.
````

---

## 2. Prompt rút gọn (khi AI đã hiểu ngữ cảnh)

Nếu bạn đã chat nhiều lượt với AI về hệ thống và chỉ cần ép AI viết đúng
cú pháp, dùng prompt ngắn này:

````markdown
Từ cuộc trò chuyện phía trên, hãy sinh đặc tả text cho StarUML UseCase
Generator theo đúng cú pháp:

System: <tên hệ thống>
Actor:  <danh sách actor, cách nhau dấu phẩy>
UseCase: <danh sách UC, cách nhau dấu phẩy>

A1 -> UC1
UC1 -> <<include>> UC2
UC1 -> <<extend>> UC2 # điều kiện
A1  -> <<generalize>> A2
UC1 -> <<generalize>> UC2

Quy tắc:
- Include/Extend chỉ nối UC ↔ UC.
- Generalization cùng loại (Actor↔Actor hoặc UC↔UC).
- Mỗi UC có ít nhất 1 Actor liên kết (trực tiếp hoặc qua include/extend).
- Mỗi Actor có ít nhất 1 UC liên kết.
- Comment bằng // hoặc # ở đầu dòng.

Output: chỉ text thuần, KHÔNG markdown code block, KHÔNG giải thích.
````

---

## 3. Prompt yêu cầu sửa lỗi spec đã có

Khi bạn đã có 1 spec cũ (do AI sinh ra hoặc tự viết) nhưng plugin báo lỗi,
dán kèm spec vào prompt này:

````markdown
Spec Use Case dưới đây đang bị plugin StarUML UseCase Generator báo lỗi
(kèm thông báo lỗi của plugin). Hãy phân tích và sửa lại cho đúng cú pháp
và quy tắc UML, sau đó trả về spec đã sửa (chỉ text thuần, không markdown).

=== THÔNG BÁO LỖI CỦA PLUGIN ===
<dán message lỗi plugin hiển thị vào đây>

=== SPEC GỐC ===
<dán spec hiện tại vào đây>
````

---

## 4. Checklist output AI (dùng để kiểm tra trước khi paste vào plugin)

Trước khi paste output vào dialog plugin, kiểm tra nhanh:

- [ ] Có dòng `System:` đúng đầu tiên
- [ ] Có dòng `Actor:` liệt kê đủ actor, cách nhau dấu phẩy
- [ ] Có dòng `UseCase:` liệt kê đủ UC, cách nhau dấu phẩy
- [ ] Mỗi UC trong phần khai báo đều xuất hiện ở ít nhất 1 quan hệ
- [ ] Mỗi Actor đều có ít nhất 1 quan hệ `Actor -> UC`
- [ ] Include / Extend chỉ nối UC ↔ UC
- [ ] Generalization cùng loại (Actor↔Actor hoặc UC↔UC)
- [ ] Không có quan hệ nào tham chiếu Actor/UC chưa khai báo
- [ ] Không có chu trình include (A → include → B → include → A)
- [ ] Có thể có hoặc không comment `//` / `#` ở đầu dòng

Nếu thiếu, paste lại prompt chính kèm yêu cầu sửa cụ thể:

> Spec bạn vừa sinh bị thiếu quan hệ cho actor `X` và use case `Y`. Hãy bổ
> sung và trả về spec hoàn chỉnh, chỉ text thuần, không markdown.
