// ==================== Global Variables ====================
let startTime, timerInterval, elapsedTime = 0, isRunning = false;
let currentActiveDay = null;
let lastAdjustedDay = 0;
let myChart = null;

// ==================== i18n / Translations ====================
const translations = {
    th: {
        reportTitle: "CSA OPERATION SIGN-OFF REPORT",
        themeToggle: "เปลี่ยนโหมดสี",
        btnExport: "ส่งออกไปที่ Excel",
        btnClear: "ล้างข้อมูล",
        btnChart: "กราฟประสิทธิภาพ",
        lblProcess: "ขั้นตอนหลัก",
        lblEmployee: "พนักงาน",
        lblTrainer: "ครูฝึก",
        lblSam: "SAM (นาที)",
        lblEffTarget: "เป้าหมาย Eff (%)",
        lblQtyTarget: "เป้าหมาย Q'ty (ชิ้น/ชม.)",
        lblWorkLevel: "ระดับงาน",
        lblTrainingDays: "จำนวนวันที่จะต้องฝึก",
        lblStartDate: "วันที่เริ่มฝึก",
        lblTransferDate: "วันที่โอนย้าย",
        lblDayHour: "วัน/ชั่วโมงที่:",
        btnPlanA: "แผน A",
        btnPlanB: "แผน B",
        btnStart: "Start",
        btnStop: "Stop",
        btnContinue: "Continue",
        btnReset: "Reset",
        btnSave: "Save",
        thDayHour: "วัน/ชั่วโมง",
        thEfficiency: "ประสิทธิภาพ",
        thQuality: "คุณภาพ",
        thRootCause: "สาเหตุหลัก",
        thActionPlan: "แผนการแก้ไข",
        thSignature: "ลายเซ็น",
        thTargetPct: "เป้า<br>หมาย<br>(%)",
        thTargetPcs: "เป้า<br>หมาย<br>(ชิ้น)",
        thAvgSec: "เวลา<br>เฉลี่ย<br>(วินาที)",
        thCycleMin: "เวลา<br>ต่อรอบ<br>(นาที)",
        thEffPct: "ประสิทธิ<br>ภาพ<br>(%)",
        thEffPcs: "ประสิทธิ<br>ภาพ<br>(ชิ้น)",
        thPass: "ผ่าน",
        thFail: "ไม่ผ่าน",
        thPassRate: "อัตราผ่าน %",
        thMan: "คน",
        thMachine: "เครื่อง",
        thMethod: "วิธีการ",
        thMaterial: "วัสดุ",
        chartTitle: "กราฟเปรียบเทียบเป้าหมาย vs ประสิทธิภาพจริง",
        modalAvgSec: "ระบุเวลาเฉลี่ย (วินาที)",
        modalPass: 'ระบุจำนวนงานที่ "ผ่าน"',
        modalFail: 'ระบุจำนวนงานที่ "ไม่ผ่าน"',
        modalDayRecorded: "วันที่บันทึกผล:",
        btnCancel: "ยกเลิก",
        btnSaveData: "บันทึกข้อมูล",
        notifTitle: "แจ้งเตือนระบบ",
        signTitle: "ลงลายเซ็น",
        btnClearPad: "ล้าง",
        btnSaveShort: "บันทึก",
        actionPlanTitle: "📝 ระบุแผนการแก้ไข (Action Plan)",
        actionPlanDayRecorded: "วันที่บันทึกแผน:",
        actionPlanPlaceholder: "กรุณาระบุรายละเอียดแผนการแก้ไขปัญหาที่พบ...",
        actionPlanCellPlaceholder: "คลิกเพื่อระบุรายละเอียด...",
        signCellText: "✍️ เซ็นชื่อ",
        chartLegendTarget: "เป้าหมายประสิทธิภาพ (%)",
        chartLegendActual: "ประสิทธิภาพจริง (%)",
        chartXDay: (d) => `วันที่ ${d}`,
        chartYAxis: "เปอร์เซ็นต์ (%)",
        raceOver: (act, gap) => `ปัจจุบัน: ${act}% | คุณทำได้มากกว่าเป้าหมาย +${gap}%`,
        raceGap: (act, gap, tgt) => `ปัจจุบัน: ${act}% | อีก ${gap}% จะถึงเป้าหมาย (${tgt}%)`,
        raceInitial: "เป้าหมาย: 0% | ปัจจุบัน: 0%",
        confirmYes: "ใช่, ต้องการปรับแผน",
        acknowledge: "รับทราบ",
        titleNoData: "⚠️ บันทึกข้อมูลไม่ครบ",
        msgNoData: "กรุณาบันทึกผลประสิทธิภาพจริงก่อนปรับแผน",
        titleAlreadyAdjusted: "⏳ ปรับแผนไปแล้ว",
        msgAlreadyAdjusted: (d) => `คุณได้ปรับแผนสำหรับผลงานวันที่ ${d} ไปแล้ว\n(กดได้วันละ 1 ครั้ง)`,
        titleConfirmPlanA: "📈 ยืนยันปรับแผน A (ขยายวันฝึก)",
        msgConfirmPlanA: (eff, tgt) => `ประสิทธิภาพจริง (${eff}%) ต่ำกว่าเป้าหมาย (${tgt}%)\nคุณต้องการขยายระยะเวลาการฝึกเพิ่มอีก 1 วัน ใช่หรือไม่?`,
        titleConfirmPlanB: "📉 ยืนยันปรับแผน B (ลดวันฝึก)",
        msgConfirmPlanB: (eff, tgt) => `ประสิทธิภาพจริง (${eff}%) สูงกว่าเป้าหมาย (${tgt}%)\nคุณต้องการลดระยะเวลาการฝึกลง 1 วัน ใช่หรือไม่?`,
        titleSuccess: "✨ สำเร็จ",
        msgPlanASuccess: (d) => `ปรับแผน A สำเร็จ: ขยายเวลาฝึกเป็น ${d} วัน`,
        msgPlanBSuccess: (d) => `ปรับแผน B สำเร็จ: ลดเวลาฝึกเหลือ ${d} วัน`,
        titleCondFail: "❌ ไม่ตรงเงื่อนไข",
        msgPlanACond: "เงื่อนไขไม่ตรง: แผน A ใช้เมื่อประสิทธิภาพจริง 'ต่ำกว่า' เป้าหมายเท่านั้น",
        msgPlanBCond: "เงื่อนไขไม่ตรง: แผน B ใช้เมื่อประสิทธิภาพจริง 'สูงกว่า' เป้าหมายเท่านั้น",
        titleCantReduce: "⚠️ ไม่สามารถปรับลดได้",
        msgCantReduce: "ไม่สามารถลดวันฝึกให้ต่ำกว่าวันปัจจุบันได้",
        titleConfirmExport: "📊 ยืนยันการส่งออกข้อมูล",
        msgConfirmExport: (name) => `คุณต้องการส่งออกรายงาน CSA Sign-off\nของพนักงาน: "${name}"\nออกเป็นไฟล์ Excel ใช่หรือไม่?`,
        titleConfirmClear: "⚠️ ยืนยันการล้างข้อมูลทั้งหมด",
        msgConfirmClear: "คุณต้องการลบข้อมูลทั้งหมดในฟอร์มนี้ใช่หรือไม่?\nข้อมูลที่ลบแล้วไม่สามารถเรียกคืนได้",
        titleDone: "✨ ทำรายการสำเร็จ",
        msgClearDone: "ล้างข้อมูลทั้งหมดในระบบเรียบร้อยแล้ว",
        alertTimeFirst: "กรุณาจับเวลาก่อน",
        alertRowNotFound: "ไม่พบแถวที่ระบุในตาราง",
        alertInvalidNumber: "กรุณาระบุตัวเลขที่ถูกต้อง",
        noName: "ไม่ระบุชื่อ"
    },
    en: {
        reportTitle: "CSA OPERATION SIGN-OFF REPORT",
        themeToggle: "Toggle Theme",
        btnExport: "Export to Excel",
        btnClear: "Clear Data",
        btnChart: "Performance Chart",
        lblProcess: "Main Process",
        lblEmployee: "Employee",
        lblTrainer: "Trainer",
        lblSam: "SAM (min)",
        lblEffTarget: "Eff Target (%)",
        lblQtyTarget: "Q'ty Target (pcs/hr)",
        lblWorkLevel: "Operation Grade",
        lblTrainingDays: "Training Days",
        lblStartDate: "Start Date",
        lblTransferDate: "Transfer Date",
        lblDayHour: "Day/Hour:",
        btnPlanA: "Plan A",
        btnPlanB: "Plan B",
        btnStart: "Start",
        btnStop: "Stop",
        btnContinue: "Continue",
        btnReset: "Reset",
        btnSave: "Save",
        thDayHour: "Day/Hour",
        thEfficiency: "Efficiency",
        thQuality: "Quality",
        thRootCause: "Root Cause",
        thActionPlan: "Action Plan",
        thSignature: "Signature",
        thTargetPct: "Target<br>(%)",
        thTargetPcs: "Target<br>(pcs)",
        thAvgSec: "Avg<br>Time<br>(sec)",
        thCycleMin: "Cycle<br>Time<br>(min)",
        thEffPct: "Eff<br>(%)",
        thEffPcs: "Eff<br>(pcs)",
        thPass: "Pass",
        thFail: "Fail",
        thPassRate: "Pass Rate %",
        thMan: "Man",
        thMachine: "Machine",
        thMethod: "Method",
        thMaterial: "Material",
        chartTitle: "Target vs Actual Efficiency Comparison",
        modalAvgSec: "Enter Average Time (seconds)",
        modalPass: 'Enter number of "Pass"',
        modalFail: 'Enter number of "Fail"',
        modalDayRecorded: "Recorded Day:",
        btnCancel: "Cancel",
        btnSaveData: "Save",
        notifTitle: "System Notification",
        signTitle: "Sign Here",
        btnClearPad: "Clear",
        btnSaveShort: "Save",
        actionPlanTitle: "📝 Enter Action Plan",
        actionPlanDayRecorded: "Plan Day:",
        actionPlanPlaceholder: "Please describe the corrective action plan...",
        actionPlanCellPlaceholder: "Click to add details...",
        signCellText: "✍️ Sign",
        chartLegendTarget: "Target Efficiency (%)",
        chartLegendActual: "Actual Efficiency (%)",
        chartXDay: (d) => `Day ${d}`,
        chartYAxis: "Percentage (%)",
        raceOver: (act, gap) => `Current: ${act}% | You exceeded target by +${gap}%`,
        raceGap: (act, gap, tgt) => `Current: ${act}% | ${gap}% more to reach target (${tgt}%)`,
        raceInitial: "Target: 0% | Current: 0%",
        confirmYes: "Yes, adjust plan",
        acknowledge: "OK",
        titleNoData: "⚠️ Incomplete Data",
        msgNoData: "Please record actual efficiency before adjusting the plan",
        titleAlreadyAdjusted: "⏳ Already Adjusted",
        msgAlreadyAdjusted: (d) => `You have already adjusted the plan for day ${d}\n(Only 1 adjustment per day)`,
        titleConfirmPlanA: "📈 Confirm Plan A (Extend Training)",
        msgConfirmPlanA: (eff, tgt) => `Actual efficiency (${eff}%) is below target (${tgt}%)\nDo you want to extend training by 1 more day?`,
        titleConfirmPlanB: "📉 Confirm Plan B (Reduce Training)",
        msgConfirmPlanB: (eff, tgt) => `Actual efficiency (${eff}%) is above target (${tgt}%)\nDo you want to reduce training by 1 day?`,
        titleSuccess: "✨ Success",
        msgPlanASuccess: (d) => `Plan A applied: training extended to ${d} days`,
        msgPlanBSuccess: (d) => `Plan B applied: training reduced to ${d} days`,
        titleCondFail: "❌ Condition Not Met",
        msgPlanACond: "Condition failed: Plan A only applies when actual efficiency is 'below' target",
        msgPlanBCond: "Condition failed: Plan B only applies when actual efficiency is 'above' target",
        titleCantReduce: "⚠️ Cannot Reduce",
        msgCantReduce: "Cannot reduce training days below the current day",
        titleConfirmExport: "📊 Confirm Export",
        msgConfirmExport: (name) => `Export CSA Sign-off report\nfor employee: "${name}"\nto Excel file?`,
        titleConfirmClear: "⚠️ Confirm Clear All Data",
        msgConfirmClear: "Do you want to delete all data in this form?\nDeleted data cannot be recovered",
        titleDone: "✨ Done",
        msgClearDone: "All data has been cleared successfully",
        alertTimeFirst: "Please start the timer first",
        alertRowNotFound: "Row not found in the table",
        alertInvalidNumber: "Please enter a valid number",
        noName: "Unnamed"
    },
    vn: {
        reportTitle: "BÁO CÁO KÝ DUYỆT VẬN HÀNH CSA",
        themeToggle: "Chuyển chế độ",
        btnExport: "Xuất ra Excel",
        btnClear: "Xóa dữ liệu",
        btnChart: "Biểu đồ hiệu suất",
        lblProcess: "Công đoạn chính",
        lblEmployee: "Công nhân",
        lblTrainer: "Huấn luyện viên",
        lblSam: "SAM (phút)",
        lblEffTarget: "Mục tiêu Eff (%)",
        lblQtyTarget: "Mục tiêu SL (cái/giờ)",
        lblWorkLevel: "Cấp độ vận hành",
        lblTrainingDays: "Số ngày đào tạo",
        lblStartDate: "Ngày bắt đầu",
        lblTransferDate: "Ngày chuyển giao",
        lblDayHour: "Ngày/Giờ:",
        btnPlanA: "Kế hoạch A",
        btnPlanB: "Kế hoạch B",
        btnStart: "Bắt đầu",
        btnStop: "Dừng",
        btnContinue: "Tiếp tục",
        btnReset: "Đặt lại",
        btnSave: "Lưu",
        thDayHour: "Ngày/Giờ",
        thEfficiency: "Hiệu suất",
        thQuality: "Chất lượng",
        thRootCause: "Nguyên nhân chính",
        thActionPlan: "Kế hoạch khắc phục",
        thSignature: "Chữ ký",
        thTargetPct: "Mục<br>tiêu<br>(%)",
        thTargetPcs: "Mục<br>tiêu<br>(cái)",
        thAvgSec: "Thời<br>gian TB<br>(giây)",
        thCycleMin: "Chu kỳ<br>(phút)",
        thEffPct: "Hiệu<br>suất<br>(%)",
        thEffPcs: "Hiệu<br>suất<br>(cái)",
        thPass: "Đạt",
        thFail: "Không đạt",
        thPassRate: "Tỷ lệ đạt %",
        thMan: "Con người",
        thMachine: "Máy móc",
        thMethod: "Phương pháp",
        thMaterial: "Vật liệu",
        chartTitle: "So sánh Mục tiêu vs Hiệu suất thực tế",
        modalAvgSec: "Nhập thời gian trung bình (giây)",
        modalPass: 'Nhập số lượng "Đạt"',
        modalFail: 'Nhập số lượng "Không đạt"',
        modalDayRecorded: "Ngày ghi nhận:",
        btnCancel: "Hủy",
        btnSaveData: "Lưu dữ liệu",
        notifTitle: "Thông báo hệ thống",
        signTitle: "Ký tên",
        btnClearPad: "Xóa",
        btnSaveShort: "Lưu",
        actionPlanTitle: "📝 Nhập kế hoạch khắc phục",
        actionPlanDayRecorded: "Ngày ghi kế hoạch:",
        actionPlanPlaceholder: "Vui lòng mô tả chi tiết kế hoạch khắc phục vấn đề...",
        actionPlanCellPlaceholder: "Nhấn để thêm chi tiết...",
        signCellText: "✍️ Ký tên",
        chartLegendTarget: "Mục tiêu hiệu suất (%)",
        chartLegendActual: "Hiệu suất thực tế (%)",
        chartXDay: (d) => `Ngày ${d}`,
        chartYAxis: "Phần trăm (%)",
        raceOver: (act, gap) => `Hiện tại: ${act}% | Bạn vượt mục tiêu +${gap}%`,
        raceGap: (act, gap, tgt) => `Hiện tại: ${act}% | Còn ${gap}% để đạt mục tiêu (${tgt}%)`,
        raceInitial: "Mục tiêu: 0% | Hiện tại: 0%",
        confirmYes: "Có, điều chỉnh kế hoạch",
        acknowledge: "Đồng ý",
        titleNoData: "⚠️ Dữ liệu chưa đủ",
        msgNoData: "Vui lòng ghi nhận hiệu suất thực tế trước khi điều chỉnh kế hoạch",
        titleAlreadyAdjusted: "⏳ Đã điều chỉnh",
        msgAlreadyAdjusted: (d) => `Bạn đã điều chỉnh kế hoạch cho ngày ${d}\n(Chỉ điều chỉnh 1 lần/ngày)`,
        titleConfirmPlanA: "📈 Xác nhận Kế hoạch A (Kéo dài đào tạo)",
        msgConfirmPlanA: (eff, tgt) => `Hiệu suất thực tế (${eff}%) thấp hơn mục tiêu (${tgt}%)\nBạn có muốn kéo dài đào tạo thêm 1 ngày?`,
        titleConfirmPlanB: "📉 Xác nhận Kế hoạch B (Giảm ngày đào tạo)",
        msgConfirmPlanB: (eff, tgt) => `Hiệu suất thực tế (${eff}%) cao hơn mục tiêu (${tgt}%)\nBạn có muốn giảm đào tạo 1 ngày?`,
        titleSuccess: "✨ Thành công",
        msgPlanASuccess: (d) => `Áp dụng Kế hoạch A: kéo dài đào tạo lên ${d} ngày`,
        msgPlanBSuccess: (d) => `Áp dụng Kế hoạch B: giảm đào tạo còn ${d} ngày`,
        titleCondFail: "❌ Không đủ điều kiện",
        msgPlanACond: "Điều kiện không đáp ứng: Kế hoạch A chỉ áp dụng khi hiệu suất 'thấp hơn' mục tiêu",
        msgPlanBCond: "Điều kiện không đáp ứng: Kế hoạch B chỉ áp dụng khi hiệu suất 'cao hơn' mục tiêu",
        titleCantReduce: "⚠️ Không thể giảm",
        msgCantReduce: "Không thể giảm ngày đào tạo xuống dưới ngày hiện tại",
        titleConfirmExport: "📊 Xác nhận xuất dữ liệu",
        msgConfirmExport: (name) => `Bạn muốn xuất báo cáo CSA Sign-off\ncủa công nhân: "${name}"\nra file Excel?`,
        titleConfirmClear: "⚠️ Xác nhận xóa toàn bộ dữ liệu",
        msgConfirmClear: "Bạn muốn xóa toàn bộ dữ liệu trong biểu mẫu này?\nDữ liệu đã xóa không thể khôi phục",
        titleDone: "✨ Hoàn tất",
        msgClearDone: "Đã xóa toàn bộ dữ liệu thành công",
        alertTimeFirst: "Vui lòng bấm giờ trước",
        alertRowNotFound: "Không tìm thấy hàng trong bảng",
        alertInvalidNumber: "Vui lòng nhập số hợp lệ",
        noName: "Chưa xác định"
    },
    lo: {
        reportTitle: "ບົດລາຍງານການເຊັນຮັບຮອງການດຳເນີນງານ CSA",
        themeToggle: "ປ່ຽນໂໝດ",
        btnExport: "ສົ່ງອອກເປັນ Excel",
        btnClear: "ລຶບຂໍ້ມູນ",
        btnChart: "ກຣາຟປະສິດທິພາບ",
        lblProcess: "ຂັ້ນຕອນຫຼັກ",
        lblEmployee: "ພະນັກງານ",
        lblTrainer: "ຄູຝຶກ",
        lblSam: "SAM (ນາທີ)",
        lblEffTarget: "ເປົ້າໝາຍ Eff (%)",
        lblQtyTarget: "ເປົ້າໝາຍ Q'ty (ຊິ້ນ/ຊົ່ວໂມງ)",
        lblWorkLevel: "ລະດັບການດຳເນີນງານ",
        lblTrainingDays: "ຈຳນວນວັນທີ່ຕ້ອງຝຶກ",
        lblStartDate: "ວັນທີເລີ່ມຝຶກ",
        lblTransferDate: "ວັນທີໂອນຍ້າຍ",
        lblDayHour: "ວັນ/ຊົ່ວໂມງ:",
        btnPlanA: "ແຜນ A",
        btnPlanB: "ແຜນ B",
        btnStart: "ເລີ່ມ",
        btnStop: "ຢຸດ",
        btnContinue: "ຕໍ່",
        btnReset: "ຣີເຊັດ",
        btnSave: "ບັນທຶກ",
        thDayHour: "ວັນ/ຊົ່ວໂມງ",
        thEfficiency: "ປະສິດທິພາບ",
        thQuality: "ຄຸນນະພາບ",
        thRootCause: "ສາເຫດຫຼັກ",
        thActionPlan: "ແຜນແກ້ໄຂ",
        thSignature: "ລາຍເຊັນ",
        thTargetPct: "ເປົ້າ<br>ໝາຍ<br>(%)",
        thTargetPcs: "ເປົ້າ<br>ໝາຍ<br>(ຊິ້ນ)",
        thAvgSec: "ເວລາ<br>ສະເລ່ຍ<br>(ວິນາທີ)",
        thCycleMin: "ເວລາ<br>ຕໍ່ຮອບ<br>(ນາທີ)",
        thEffPct: "ປະສິດ<br>ທິພາບ<br>(%)",
        thEffPcs: "ປະສິດ<br>ທິພາບ<br>(ຊິ້ນ)",
        thPass: "ຜ່ານ",
        thFail: "ບໍ່ຜ່ານ",
        thPassRate: "ອັດຕາຜ່ານ %",
        thMan: "ຄົນ",
        thMachine: "ເຄື່ອງ",
        thMethod: "ວິທີການ",
        thMaterial: "ວັດສະດຸ",
        chartTitle: "ກຣາຟປຽບທຽບເປົ້າໝາຍ vs ປະສິດທິພາບຈິງ",
        modalAvgSec: "ລະບຸເວລາສະເລ່ຍ (ວິນາທີ)",
        modalPass: 'ລະບຸຈຳນວນວຽກທີ່ "ຜ່ານ"',
        modalFail: 'ລະບຸຈຳນວນວຽກທີ່ "ບໍ່ຜ່ານ"',
        modalDayRecorded: "ວັນທີບັນທຶກຜົນ:",
        btnCancel: "ຍົກເລີກ",
        btnSaveData: "ບັນທຶກຂໍ້ມູນ",
        notifTitle: "ແຈ້ງເຕືອນລະບົບ",
        signTitle: "ເຊັນລາຍເຊັນ",
        btnClearPad: "ລຶບ",
        btnSaveShort: "ບັນທຶກ",
        actionPlanTitle: "📝 ລະບຸແຜນແກ້ໄຂ (Action Plan)",
        actionPlanDayRecorded: "ວັນທີບັນທຶກແຜນ:",
        actionPlanPlaceholder: "ກະລຸນາລະບຸລາຍລະອຽດແຜນແກ້ໄຂບັນຫາທີ່ພົບ...",
        actionPlanCellPlaceholder: "ຄລິກເພື່ອລະບຸລາຍລະອຽດ...",
        signCellText: "✍️ ເຊັນຊື່",
        chartLegendTarget: "ເປົ້າໝາຍປະສິດທິພາບ (%)",
        chartLegendActual: "ປະສິດທິພາບຈິງ (%)",
        chartXDay: (d) => `ວັນທີ ${d}`,
        chartYAxis: "ເປີເຊັນ (%)",
        raceOver: (act, gap) => `ປັດຈຸບັນ: ${act}% | ທ່ານເຮັດໄດ້ຫຼາຍກວ່າເປົ້າໝາຍ +${gap}%`,
        raceGap: (act, gap, tgt) => `ປັດຈຸບັນ: ${act}% | ອີກ ${gap}% ຈະຮອດເປົ້າໝາຍ (${tgt}%)`,
        raceInitial: "ເປົ້າໝາຍ: 0% | ປັດຈຸບັນ: 0%",
        confirmYes: "ແມ່ນ, ຕ້ອງການປັບແຜນ",
        acknowledge: "ຮັບຊາບ",
        titleNoData: "⚠️ ບັນທຶກຂໍ້ມູນບໍ່ຄົບ",
        msgNoData: "ກະລຸນາບັນທຶກຜົນປະສິດທິພາບຈິງກ່ອນປັບແຜນ",
        titleAlreadyAdjusted: "⏳ ປັບແຜນໄປແລ້ວ",
        msgAlreadyAdjusted: (d) => `ທ່ານໄດ້ປັບແຜນສຳລັບຜົນວັນທີ ${d} ໄປແລ້ວ\n(ກົດໄດ້ວັນລະ 1 ຄັ້ງ)`,
        titleConfirmPlanA: "📈 ຢືນຢັນປັບແຜນ A (ຂະຫຍາຍວັນຝຶກ)",
        msgConfirmPlanA: (eff, tgt) => `ປະສິດທິພາບຈິງ (${eff}%) ຕ່ຳກວ່າເປົ້າໝາຍ (${tgt}%)\nທ່ານຕ້ອງການຂະຫຍາຍໄລຍະຝຶກເພີ່ມອີກ 1 ວັນ ບໍ?`,
        titleConfirmPlanB: "📉 ຢືນຢັນປັບແຜນ B (ຫຼຸດວັນຝຶກ)",
        msgConfirmPlanB: (eff, tgt) => `ປະສິດທິພາບຈິງ (${eff}%) ສູງກວ່າເປົ້າໝາຍ (${tgt}%)\nທ່ານຕ້ອງການຫຼຸດໄລຍະຝຶກລົງ 1 ວັນ ບໍ?`,
        titleSuccess: "✨ ສຳເລັດ",
        msgPlanASuccess: (d) => `ປັບແຜນ A ສຳເລັດ: ຂະຫຍາຍເວລາຝຶກເປັນ ${d} ວັນ`,
        msgPlanBSuccess: (d) => `ປັບແຜນ B ສຳເລັດ: ຫຼຸດເວລາຝຶກເຫຼືອ ${d} ວັນ`,
        titleCondFail: "❌ ບໍ່ຕົງເງື່ອນໄຂ",
        msgPlanACond: "ເງື່ອນໄຂບໍ່ຕົງ: ແຜນ A ໃຊ້ເມື່ອປະສິດທິພາບຈິງ 'ຕ່ຳກວ່າ' ເປົ້າໝາຍເທົ່ານັ້ນ",
        msgPlanBCond: "ເງື່ອນໄຂບໍ່ຕົງ: ແຜນ B ໃຊ້ເມື່ອປະສິດທິພາບຈິງ 'ສູງກວ່າ' ເປົ້າໝາຍເທົ່ານັ້ນ",
        titleCantReduce: "⚠️ ບໍ່ສາມາດຫຼຸດໄດ້",
        msgCantReduce: "ບໍ່ສາມາດຫຼຸດວັນຝຶກໃຫ້ຕ່ຳກວ່າວັນປັດຈຸບັນໄດ້",
        titleConfirmExport: "📊 ຢືນຢັນການສົ່ງອອກຂໍ້ມູນ",
        msgConfirmExport: (name) => `ທ່ານຕ້ອງການສົ່ງອອກລາຍງານ CSA Sign-off\nຂອງພະນັກງານ: "${name}"\nອອກເປັນໄຟລ໌ Excel ບໍ?`,
        titleConfirmClear: "⚠️ ຢືນຢັນການລຶບຂໍ້ມູນທັງໝົດ",
        msgConfirmClear: "ທ່ານຕ້ອງການລຶບຂໍ້ມູນທັງໝົດໃນຟອມນີ້ບໍ?\nຂໍ້ມູນທີ່ລຶບແລ້ວບໍ່ສາມາດເອົາຄືນໄດ້",
        titleDone: "✨ ດຳເນີນການສຳເລັດ",
        msgClearDone: "ລຶບຂໍ້ມູນທັງໝົດໃນລະບົບຮຽບຮ້ອຍແລ້ວ",
        alertTimeFirst: "ກະລຸນາຈັບເວລາກ່ອນ",
        alertRowNotFound: "ບໍ່ພົບແຖວທີ່ລະບຸໃນຕາຕະລາງ",
        alertInvalidNumber: "ກະລຸນາລະບຸຕົວເລກທີ່ຖືກຕ້ອງ",
        noName: "ບໍ່ລະບຸຊື່"
    }
};

let currentLang = localStorage.getItem('lang') || 'th';

function t(key, ...args) {
    const dict = translations[currentLang] || translations.th;
    const v = dict[key];
    if (typeof v === 'function') return v(...args);
    if (v == null) return translations.th[key] || key;
    return v;
}

function applyTranslations() {
    document.documentElement.lang = currentLang === 'lo' ? 'lo' : currentLang;

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const val = t(key);
        if (typeof val === 'string') el.textContent = val;
    });
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
        const key = el.getAttribute('data-i18n-html');
        const val = t(key);
        if (typeof val === 'string') el.innerHTML = val;
    });
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        el.title = t(key);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        el.placeholder = t(key);
    });

    // Dynamic: table cells (action plan placeholder & sign text)
    for (let d = 1; d <= 30; d++) {
        const ap = document.getElementById(`actionPlan_${d}`);
        if (ap) ap.placeholder = t('actionPlanCellPlaceholder');
        const st = document.getElementById(`signText_${d}`);
        if (st) st.textContent = t('signCellText');
    }

    // Timer button label if it's in initial "Start" state
    const startBtn = document.getElementById('startStopBtn');
    if (startBtn) {
        if (!isRunning && elapsedTime === 0) startBtn.innerText = t('btnStart');
        else if (isRunning) startBtn.innerText = t('btnStop');
        else startBtn.innerText = t('btnContinue');
    }

    // Language dropdown reflect current
    const langSel = document.getElementById('langSelect');
    if (langSel && langSel.value !== currentLang) langSel.value = currentLang;

    // Refresh race track label
    if (typeof updateRaceTrack === 'function') updateRaceTrack();
}

function changeLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    applyTranslations();
}

// Signature Pad Variables
const canvas = document.getElementById('signature-pad');
let ctx = null;
if (canvas) {
    ctx = canvas.getContext('2d');
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#1a3c6d';
}
let writing = false;

// ==================== Initialization ====================
document.addEventListener('DOMContentLoaded', function() {
    initializeTable();
    initializeSignaturePad();
    calculateAdaptiveGoals();
    updateAutoTargetDay();
    applyTranslations();
});

function initializeTable() {
    const tbody = document.getElementById("tableBody");
    if (!tbody) return;
    
    for(let d=1; d<=30; d++) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td class="day-cell-readonly" tabIndex="-1">${d}</td>
            
            <td class="calculated-cell"><input type="text" id="targetEff_${d}" disabled tabIndex="-1"></td>
            <td class="calculated-cell"><input type="text" id="targetQty_${d}" disabled tabIndex="-1"></td>
            
            <td><input type="text" id="resAvgSec_${d}" readonly class="clickable-input" onclick="openManualModal(${d})" placeholder=""></td>
            
            <td class="calculated-cell"><input type="text" id="resAvgMin_${d}" disabled tabIndex="-1"></td>
            <td class="calculated-cell font-bold"><input type="text" id="resEffPerc_${d}" disabled tabIndex="-1"></td>
            <td class="calculated-cell"><input type="text" id="resEffPcs_${d}" disabled tabIndex="-1"></td>
            
            <td><input type="text" id="qPass_${d}" readonly class="clickable-input" onclick="openManualModal(${d}, 'pass')"></td>
            <td><input type="text" id="qFail_${d}" readonly class="clickable-input" onclick="openManualModal(${d}, 'fail')"></td>
            
            <td class="calculated-cell"><input type="text" id="resQRates_${d}" disabled tabIndex="-1"></td>
            
            <td><input type="checkbox"></td>
            <td><input type="checkbox"></td>
            <td><input type="checkbox"></td>
            <td><input type="checkbox"></td>
            
            <td class="action-plan-cell" onclick="openActionPlanModal(${d})" style="cursor: pointer;">
                <textarea id="actionPlan_${d}" placeholder="${t('actionPlanCellPlaceholder')}" readonly style="cursor: pointer;"></textarea>
            </td>

            <td class="sign-cell" onclick="openSignPad(${d})">
                <span class="placeholder-text" id="signText_${d}">${t('signCellText')}</span>
                <img id="signImg_${d}" src="">
            </td>
        `;
        tbody.appendChild(row);
    }
}

// ==================== Race Track Functions ====================
function updateRaceTrack() {
    const globalEffTarget = parseFloat(document.getElementById('globalEffTarget').value) || 100;

    let lastActualEff = 0;
    for (let d = 1; d <= 30; d++) {
        let val = document.getElementById(`resEffPerc_${d}`).value;
        if (val !== "") {
            lastActualEff = parseFloat(val);
        }
    }

    let progress = (lastActualEff / globalEffTarget) * 100;
    if (progress > 100) progress = 100;
    if (progress < 0) progress = 0;

    const line = document.getElementById('progressLine');
    const label = document.getElementById('distanceLabel');
    const badge = document.getElementById('progressBadge');

    if (!line || !label) return;

    line.style.width = `${progress}%`;

    if (badge) {
        badge.style.left = `${progress}%`;
        badge.textContent = `${Math.round(lastActualEff)}%`;
        badge.classList.toggle('is-complete', lastActualEff >= globalEffTarget);

        if (progress <= 5) {
            badge.style.transform = 'translate(0, -50%)';
        } else if (progress >= 95) {
            badge.style.transform = 'translate(-100%, -50%)';
        } else {
            badge.style.transform = 'translate(-50%, -50%)';
        }
    }

    if (lastActualEff > globalEffTarget) {
        const surplus = (lastActualEff - globalEffTarget).toFixed(1);
        label.innerText = t('raceOver', lastActualEff, surplus);
        label.style.color = "var(--accent-green)";
    } else {
        const gap = Math.round(globalEffTarget - lastActualEff);
        label.innerText = t('raceGap', lastActualEff, gap, globalEffTarget);
        label.style.color = "var(--text-muted)";
    }
}

// ==================== Plan Adjustment Functions ====================
// ตัวแปรเก็บฟังก์ชันที่จะทำงานเมื่อกดยืนยันใน Modal
let onModalConfirmCallback = null;

// ฟังก์ชันเปิดกล่องแจ้งเตือนอเนกประสงค์
function showCustomModal(title, message, isConfirm = false, onConfirmCallback = null) {
    document.getElementById('notifTitle').innerText = title;
    document.getElementById('notifMessage').innerText = message;
    
    const cancelBtn = document.getElementById('notifCancelBtn');
    const confirmBtn = document.getElementById('notifConfirmBtn');
    
    if (isConfirm) {
        cancelBtn.style.display = 'block';
        cancelBtn.innerText = t('btnCancel');
        confirmBtn.innerText = t('confirmYes');
        confirmBtn.className = 'btn btn-success';
        onModalConfirmCallback = onConfirmCallback;
    } else {
        cancelBtn.style.display = 'none';
        confirmBtn.innerText = t('acknowledge');
        confirmBtn.className = 'btn';
        confirmBtn.style.backgroundColor = '#0ea5e9';
        confirmBtn.style.color = '#fff';
        onModalConfirmCallback = null;
    }
    
    // ตั้งค่าปุ่มตกลงเมื่อถูกคลิก
    confirmBtn.onclick = function() {
        if (typeof onModalConfirmCallback === 'function') {
            onModalConfirmCallback();
        }
        closeNotifModal();
    };
    
    document.getElementById('notificationModal').style.display = 'block';
}

function closeNotifModal() {
    document.getElementById('notificationModal').style.display = 'none';
    onModalConfirmCallback = null;
}

// 🛠️ ฟังก์ชัน adjustPlan เวอร์ชันเปลี่ยนเป็น Custom Modal สมบูรณ์แบบ
function adjustPlan(type) {
    const trainDaysInput = document.getElementById('trainingDays');
    let trainDays = parseInt(trainDaysInput.value) || 0;

    let lastDay = 0;
    let lastEff = 0;
    let lastTarget = 0;

    for (let d = 1; d <= 30; d++) {
        const effClean = document.getElementById(`resEffPerc_${d}`).value.replace('%', '');
        const targetClean = document.getElementById(`targetEff_${d}`).value.replace('%', '');
        
        if (effClean !== "" && targetClean !== "") {
            lastDay = d;
            lastEff = parseFloat(effClean);
            lastTarget = parseFloat(targetClean);
        }
    }

    if (lastDay === 0) {
        showCustomModal(t('titleNoData'), t('msgNoData'), false);
        return;
    }

    if (lastAdjustedDay === lastDay) {
        showCustomModal(t('titleAlreadyAdjusted'), t('msgAlreadyAdjusted', lastDay), false);
        return;
    }

    if (type === 'A') {
        if (lastEff < lastTarget) {
            showCustomModal(t('titleConfirmPlanA'), t('msgConfirmPlanA', lastEff, lastTarget), true, function() {
                trainDays += 1;
                trainDaysInput.value = trainDays;
                lastAdjustedDay = lastDay;

                calculateAdaptiveGoals();
                updateAfterAdjust();

                showCustomModal(t('titleSuccess'), t('msgPlanASuccess', trainDays), false);
            });
        } else {
            showCustomModal(t('titleCondFail'), t('msgPlanACond'), false);
            return;
        }
    } else if (type === 'B') {
        if (lastEff > lastTarget) {
            if (trainDays > lastDay) {
                showCustomModal(t('titleConfirmPlanB'), t('msgConfirmPlanB', lastEff, lastTarget), true, function() {
                    trainDays -= 1;
                    trainDaysInput.value = trainDays;
                    lastAdjustedDay = lastDay;

                    calculateAdaptiveGoals();
                    updateAfterAdjust();

                    showCustomModal(t('titleSuccess'), t('msgPlanBSuccess', trainDays), false);
                });
            } else {
                showCustomModal(t('titleCantReduce'), t('msgCantReduce'), false);
                return;
            }
        } else {
            showCustomModal(t('titleCondFail'), t('msgPlanBCond'), false);
            return;
        }
    }
}

// ฟังก์ชันช่วยเคลียร์งานหลังจากปรับแผนเสร็จสิ้น
function updateAfterAdjust() {
    if (typeof showPerformanceChart === "function" && document.getElementById('chartModal').style.display === 'block') {
        showPerformanceChart();
    }
}

function updatePlanButtons() {
    const btnA = document.getElementById('btnPlanA');
    const btnB = document.getElementById('btnPlanB');
    
    if (!btnA || !btnB) return;
    
    let lastDay = 0;
    let lastEff = 0;
    let lastTarget = 0;

    // หาข้อมูลวันล่าสุดที่มีทั้ง ผลจริง และ เป้าหมาย
    for (let d = 1; d <= 30; d++) {
        const effVal = document.getElementById(`resEffPerc_${d}`).value;
        const targetVal = document.getElementById(`targetEff_${d}`).value;
        
        if (effVal !== "" && targetVal !== "") {
            lastDay = d;
            lastEff = parseFloat(effVal);
            lastTarget = parseFloat(targetVal);
        }
    }

    // เงื่อนไขการ Disable
    if (lastDay === 0 || lastAdjustedDay === lastDay) {
        btnA.disabled = true;
        btnB.disabled = true;
        btnA.style.opacity = "0.5";
        btnB.style.opacity = "0.5";
    } else {
        btnA.disabled = !(lastEff < lastTarget);
        btnA.style.opacity = (lastEff < lastTarget) ? "1" : "0.5";
        btnB.disabled = !(lastEff > lastTarget);
        btnB.style.opacity = (lastEff > lastTarget) ? "1" : "0.5";
        updateRaceTrack();
    }
}

// ==================== Chart Functions ====================
function showPerformanceChart() {
    document.getElementById('chartModal').style.display = 'block';

    // เตรียมข้อมูลจากตาราง
    const labels = [];
    const targetData = [];
    const actualData = [];

    for (let d = 1; d <= 30; d++) {
        labels.push(t('chartXDay', d));
        
        // เคลียร์สัญลักษณ์ % ออกก่อนแปลงค่าเป็นตัวเลข (ป้องกันการ Parse ค่าผิดพลาด)
        const tVal = document.getElementById(`targetEff_${d}`).value.replace('%', '');
        targetData.push(tVal ? parseFloat(tVal) : null);

        const aVal = document.getElementById(`resEffPerc_${d}`).value.replace('%', '');
        actualData.push(aVal ? parseFloat(aVal) : null);
    }

    // 💡 ดึงค่าสี Dynamic จาก CSS Variables ณ ขณะนั้น
    const style = getComputedStyle(document.documentElement);
    const colorBlue = style.getPropertyValue('--accent-blue').trim() || '#007bff';
    const colorGreen = style.getPropertyValue('--accent-green').trim() || '#28a745';
    const colorText = style.getPropertyValue('--text-muted').trim() || '#475569';
    const colorGrid = style.getPropertyValue('--border-light').trim() || '#e2e8f0';

    // สร้างกราฟ
    const ctx = document.getElementById('performanceChart').getContext('2d');
    
    if (myChart) { 
        myChart.destroy(); 
    }

    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: t('chartLegendTarget'),
                    data: targetData,
                    borderColor: colorBlue,          /* 💡 เปลี่ยนเป็นสีฟ้าตามตัวแปรระบบ */
                    backgroundColor: 'transparent',
                    borderWidth: 3,
                    tension: 0.1,
                    spanGaps: true
                },
                {
                    label: t('chartLegendActual'),
                    data: actualData,
                    borderColor: colorGreen,         /* 💡 เปลี่ยนเป็นสีเขียวตามตัวแปรระบบ */
                    backgroundColor: 'transparent',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.1,
                    spanGaps: true
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    grid: {
                        color: colorGrid             /* 💡 เส้นกริดแนวตั้งเปลี่ยนตามโหมด */
                    },
                    ticks: {
                        color: colorText             /* 💡 ตัวอักษรบอกวันที่เปลี่ยนตามโหมด */
                    }
                },
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        color: colorGrid             /* 💡 เส้นกริดแนวนอนเปลี่ยนตามโหมด */
                    },
                    ticks: {
                        color: colorText             /* 💡 ตัวเลขเปอร์เซ็นต์เปลี่ยนตามโหมด */
                    },
                    title: {
                        display: true,
                        text: t('chartYAxis'),
                        color: colorText
                    }
                }
            },
            plugins: {
                legend: { 
                    position: 'top',
                    labels: {
                        color: colorText             /* 💡 คำอธิบายสัญลักษณ์กราฟเปลี่ยนตามโหมด */
                    }
                }
            }
        }
    });
}

// ==================== Excel Export ====================
function exportToExcel() {
    // 💡 ดึงชื่อพนักงานมาแสดงในข้อความแจ้งเตือนล่วงหน้าเพื่อความชัดเจน
    const empName = document.getElementById('header_employee')?.value || t('noName');

    showCustomModal(
        t('titleConfirmExport'),
        t('msgConfirmExport', empName),
        true,
        function() {
            // โค้ดส่วนนี้จะทำงานทันทีเมื่อพนักงานกดปุ่ม "ตกลง" บนกล่องคำสั่ง
            
            const wb = XLSX.utils.book_new();
            
            // เตรียม Header ส่วนพนักงาน
            const headerData = [
                ["CSA OPERATION SIGN-OFF REPORT"],
                [""],
                [`ขั้นตอนหลัก: ${document.getElementById('header_process')?.value || "-"}`],
                [`พนักงาน: ${document.getElementById('header_employee')?.value || "-"}`],
                [`ครูฝึก: ${document.getElementById('header_trainer')?.value || "-"}`], 
                [`ระดับงาน: ${document.getElementById('workLevel')?.value || "-"}`],
                [`SAM (นาที): ${document.getElementById('globalSam')?.value || "0"}`], 
                [`เป้าหมาย Eff (%): ${document.getElementById('globalEffTarget')?.value || "0"}`], 
                [`จำนวนวันฝึก: ${document.getElementById('trainingDays')?.value || "0"}`],
                [`ชนิดผ้า: ${document.getElementById('fabricType')?.value || "-"}`], 
                [`วันที่เริ่มฝึก: ${document.getElementById('header_startDate')?.value || "-"}`], 
                [`วันที่โอนย้าย: ${document.getElementById('header_transferDate')?.value || "-"}`],
                [""] 
            ];

            const ws = XLSX.utils.aoa_to_sheet(headerData);

            // ข้อมูลหัวตาราง
            const tableHeader1 = ["วัน", "ประสิทธิภาพ", "", "", "", "", "", "คุณภาพ", "", "", "สาเหตุหลัก", "", "", "", "แผนการแก้ไข", "สถานะลายเซ็น"];
            const tableHeader2 = ["", "เป้าหมายประสิทธิภาพ (%)", "เป้าหมายประสิทธิภาพ (ชิ้น)", "เวลาเฉลี่ยจริง (วินาที)", "เวลาต่อรอบจริง (นาที)", "ประสิทธิภาพจริง (%)", "ประสิทธิภาพจริง (ชิ้น)", "ผ่าน", "ไม่ผ่าน", "อัตราผ่าน %", "คน", "เครื่อง", "วิธีการ", "วัสดุ", "", ""];

            XLSX.utils.sheet_add_aoa(ws, [tableHeader1], { origin: "A13" });
            XLSX.utils.sheet_add_aoa(ws, [tableHeader2], { origin: "A14" });

            // ดึงข้อมูล Tbody 30 แถว
            const rows = [];
            for (let d = 1; d <= 30; d++) {
                const rowData = [];
                rowData.push(d); 
                const inputs = [`targetEff_${d}`, `targetQty_${d}`, `resAvgSec_${d}`, `resAvgMin_${d}`, `resEffPerc_${d}`, `resEffPcs_${d}`, `qPass_${d}`, `qFail_${d}`, `resQRates_${d}`];
                inputs.forEach(id => {
                    let val = document.getElementById(id)?.value || "";
                    if (typeof val === "string" && val.includes("%")) {
                        val = parseFloat(val.replace("%", "")) || 0;
                    }
                    rowData.push(val);
                });
                
                const rowElem = document.querySelector(`#tableBody tr:nth-child(${d})`);
                if (rowElem) {
                    rowElem.querySelectorAll('input[type="checkbox"]').forEach(cb => rowData.push(cb.checked ? "/" : ""));
                    rowData.push(rowElem.querySelector('textarea')?.value || "");
                }
                
                // ตรวจสอบลายเซ็น
                const signImg = document.getElementById(`signImg_${d}`);
                const isSigned = signImg && window.getComputedStyle(signImg).display !== 'none' && signImg.src.startsWith('data:image');
                rowData.push(isSigned ? "SIGNED" : "-");

                rows.push(rowData);
            }
            XLSX.utils.sheet_add_aoa(ws, rows, { origin: "A15" });

            // ใส่เส้นตาราง
            const range = XLSX.utils.decode_range("A13:P44");
            const borderStyle = {
                top: { style: "thin" },
                bottom: { style: "thin" },
                left: { style: "thin" },
                right: { style: "thin" }
            };

            for (let R = range.s.r; R <= range.e.r; ++R) {
                for (let C = range.s.c; C <= range.e.c; ++C) {
                    const cell_address = XLSX.utils.encode_cell({ r: R, c: C });
                    if (!ws[cell_address]) ws[cell_address] = { v: "" };
                    ws[cell_address].s = { 
                        border: borderStyle,
                        alignment: { horizontal: "center", vertical: "center" }
                    };
                }
            }

            // ตั้งค่า Merges และ Columns
            ws['!merges'] = [
                { s: { r: 12, c: 0 }, e: { r: 13, c: 0 } },
                { s: { r: 12, c: 1 }, e: { r: 12, c: 6 } },
                { s: { r: 12, c: 7 }, e: { r: 12, c: 9 } },
                { s: { r: 12, c: 10 }, e: { r: 12, c: 13 } },
                { s: { r: 12, c: 14 }, e: { r: 13, c: 14 } },
                { s: { r: 12, c: 15 }, e: { r: 13, c: 15 } }
            ];
            
            ws['!cols'] = [
                { wch: 8 }, { wch: 22 }, { wch: 22 }, { wch: 18 }, { wch: 18 }, 
                { wch: 18 }, { wch: 18 }, { wch: 8 }, { wch: 8 }, { wch: 12 }, 
                { wch: 6 }, { wch: 6 }, { wch: 6 }, { wch: 6 }, { wch: 35 }, { wch: 15 }
            ];

            XLSX.utils.book_append_sheet(wb, ws, "Operation Report");
            
            // ดาวน์โหลดไฟล์ลงเครื่องคอมพิวเตอร์
            XLSX.writeFile(wb, `CSA_Report_${empName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0,10)}.xlsx`);
        }
    );
}

// ==================== Data Management ====================
function clearAllData() {
    // 💡 เรียกใช้ Modal อเนกประสงค์ตัวเดิม โดยส่งข้อความเตือน และแนบลอจิกการลบเป็น Callback ฟังก์ชัน
    showCustomModal(
        t('titleConfirmClear'),
        t('msgConfirmClear'),
        true,
        function() {
            // โค้ดส่วนนี้จะทำงานทันทีเมื่อพนักงานกด "ตกลง" บน Modal
            
            // 1. เคลียร์ข้อมูลใน Form Header
            const headerInputs = document.querySelectorAll('.form-header input, .form-header select');
            headerInputs.forEach(input => {
                if (input.type === 'date' || input.type === 'number' || input.type === 'text') {
                    input.value = "";
                } else if (input.tagName === 'SELECT') {
                    input.selectedIndex = 0;
                }
            });

            // 2. เคลียร์ข้อมูลในตารางทั้ง 30 แถว
            for (let d = 1; d <= 30; d++) {
                const rowInputs = document.querySelectorAll(`#tableBody tr:nth-child(${d}) input`);
                rowInputs.forEach(input => {
                    if (input.type === 'checkbox') {
                        input.checked = false;
                    } else {
                        input.value = "";
                    }

                    if (input.id === `resAvgSec_${d}`) {
                        input.className = "clickable-input";
                    } else {
                        input.className = "";
                    }
                });

                // ล้าง textarea
                const textarea = document.getElementById(`actionPlan_${d}`);
                if (textarea) textarea.value = "";

                // ล้างลายเซ็น
                const signImg = document.getElementById(`signImg_${d}`);
                const signText = document.getElementById(`signText_${d}`);
                if (signImg) {
                    signImg.src = "";
                    signImg.style.display = 'none';
                }
                if (signText) {
                    signText.style.display = 'block';
                }
            }

            // 3. รีเซ็ตนาฬิกาและตัวเลขวันเริ่มต้น
            resetTimer();
            document.getElementById('targetDay').value = 1;
            
            // 4. คำนวณ Goal ใหม่
            calculateAdaptiveGoals();
            
            lastAdjustedDay = 0;
            updatePlanButtons();
            
            showCustomModal(t('titleDone'), t('msgClearDone'), false);
        }
    );
}

// ==================== Goal Calculation ====================
function calculateAdaptiveGoals() {
    const globalEff = parseFloat(document.getElementById('globalEffTarget').value) || 0;
    const trainDays = parseInt(document.getElementById('trainingDays').value) || 0;
    const sam = parseFloat(document.getElementById('globalSam').value) || 0;

    const qtyT = (sam > 0) ? Math.ceil((60 / sam) * (globalEff / 100)) : 0;
    document.getElementById('globalQtyTarget').value = qtyT;

    let firstDayQ100 = 0;
    for (let d = 1; d <= 30; d++) {
        if (document.getElementById(`resQRates_${d}`).value === "100%") {
            firstDayQ100 = d;
            break; 
        }
    }

    let lastActualEff = 0, lastActualDay = 0;
    for (let d = 1; d <= 30; d++) {
        let effStr = document.getElementById(`resEffPerc_${d}`).value;
        if (effStr && effStr !== "") { 
            lastActualEff = parseFloat(effStr); 
            lastActualDay = d; 
        }
    }

    for (let d = 1; d <= 30; d++) {
        const targetInput = document.getElementById(`targetEff_${d}`);
        const targetQtyInput = document.getElementById(`targetQty_${d}`);
        const effInput = document.getElementById(`resEffPerc_${d}`);
        
        if (!targetInput || !targetQtyInput || !effInput) continue;
        
        if (d <= lastActualDay && targetInput.value !== "") {
            // ไม่ทำอะไร เพื่อรักษาค่าเป้าหมายเดิม
        } else {
            let targetValue = 0;
            let showTarget = false;

            // คุมคุณภาพน100%
            if (firstDayQ100 > 0 && d > firstDayQ100 && d <= trainDays) {
                showTarget = true;
                
                // สถานการณ์ปัจจุบัน
                const remainingDays = trainDays - lastActualDay;
                if (remainingDays > 0) {

                    // จุดที่ใช้ปรับแผนครับ
                    const increment = (globalEff - lastActualEff) / remainingDays;
                    targetValue = lastActualEff + (increment * (d - lastActualDay));
                } else { 
                    targetValue = globalEff; 
                }
            }

            if (showTarget) {
                const finalT = Math.ceil(Math.min(targetValue, globalEff));
                targetInput.value = finalT + "%";
                if (sam > 0) targetQtyInput.value = Math.ceil((60 / sam) * (finalT / 100));
            } else {
                targetInput.value = ""; 
                targetQtyInput.value = "";
            }
        }

        // ส่วนเปรียบเทียบสี
        const effClean = typeof effInput.value === "string" ? effInput.value.replace("%", "") : effInput.value;
        const targetClean = typeof targetInput.value === "string" ? targetInput.value.replace("%", "") : targetInput.value;

        const currentEff = parseFloat(effClean) || 0;
        const currentTarget = parseFloat(targetClean) || 0;
        
        if (effInput.value !== "" && targetInput.value !== "") {
            if (currentEff >= currentTarget) {
                effInput.className = "text-success";
            } else {
                effInput.className = "text-danger";
            }
        } else {
            effInput.className = ""; 
            updatePlanButtons(); 
            updateRaceTrack();
        }
    }
}

// ==================== Manual Calculation ====================
function manualCalculate(d) {
    const sam = parseFloat(document.getElementById('globalSam').value) || 0;
    const avgSec = parseFloat(document.getElementById(`resAvgSec_${d}`).value) || 0;
    const pass = parseFloat(document.getElementById(`qPass_${d}`).value) || 0;
    const fail = parseFloat(document.getElementById(`qFail_${d}`).value) || 0;

    if (avgSec > 0) {
        const avgMin = avgSec / 60;
        document.getElementById(`resAvgMin_${d}`).value = avgMin.toFixed(2);
        if (sam > 0) {
            document.getElementById(`resEffPerc_${d}`).value = Math.ceil((sam / avgMin) * 100)+ "%";
            document.getElementById(`resEffPcs_${d}`).value = Math.ceil(60 / avgMin);
        }
    }

    const totalQ = pass + fail;
    if (totalQ > 0) {
        const qRate = Math.ceil((pass / totalQ) * 100);
        document.getElementById(`resQRates_${d}`).value = qRate + "%";
    } else {
        document.getElementById(`resQRates_${d}`).value = "";
    }
    
    calculateAdaptiveGoals();
}

// ==================== Timer Functions ====================
function toggleTimer() {
    const btn = document.getElementById('startStopBtn');
    if (!isRunning) {
        isRunning = true;
        btn.innerText = t('btnStop');
        btn.className = "btn btn-stop";
        startTime = Date.now() - elapsedTime;
        timerInterval = setInterval(() => {
            elapsedTime = Date.now() - startTime;
            updateTimerDisplay();
        }, 10);
    } else {
        isRunning = false;
        btn.innerText = t('btnContinue');
        btn.className = "btn btn-start";
        clearInterval(timerInterval);
    }
}

function updateTimerDisplay() {
    const totalSec = Math.floor(elapsedTime / 1000);
    const m = Math.floor(totalSec / 60).toString().padStart(2, '0');
    const s = (totalSec % 60).toString().padStart(2, '0');
    const ms = Math.floor((elapsedTime % 1000) / 10).toString().padStart(2, '0');
    document.getElementById('timerDisplay').innerText = `${m}:${s}:${ms}`;
}

function resetTimer() {
    clearInterval(timerInterval);
    elapsedTime = 0; 
    isRunning = false;
    document.getElementById('timerDisplay').innerText = "00:00:00";
    document.getElementById('startStopBtn').innerText = t('btnStart');
    document.getElementById('startStopBtn').className = "btn btn-start";
}

function recordAndCalculate() {
    const day = document.getElementById('targetDay').value;
    
    if (elapsedTime === 0) {
        showCustomModal(t('titleNoData'), t('alertTimeFirst'), false);
        return;
    }
    
    // คำนวณวินาทีเฉลี่ย
    const avgSec = (elapsedTime / 1000);
    
    const targetInput = document.getElementById(`resAvgSec_${day}`);
    if (targetInput) {
        targetInput.value = avgSec.toFixed(2);
        manualCalculate(day);
        updateAutoTargetDay();
        resetTimer(); 
    } else {
        showCustomModal(t('titleNoData'), t('alertRowNotFound'), false);
    }
}

function updateAutoTargetDay() {
    let lastDayWithData = 0;
    for (let d = 1; d <= 30; d++) {
        if (document.getElementById(`resEffPerc_${d}`).value !== "") {
            lastDayWithData = d;
        }
    }
    let nextDay = lastDayWithData + 1;
    if (nextDay > 30) nextDay = 30;
    document.getElementById('targetDay').value = nextDay;
}

// ==================== Modal Functions ====================
let currentInputType = null; // ค่าจะเป็น 'sec', 'pass', หรือ 'fail'

// 2. ปรับฟังก์ชันเปิดให้รับ "ประเภทช่อง" เพิ่มเข้ามา
function openManualModal(day, type = 'sec') {
    currentActiveDay = day;
    currentInputType = type; // จำไว้ว่ากดมาจากช่องไหน
    
    document.getElementById('modalDayLabel').innerText = day;
    
    let targetId = `resAvgSec_${day}`;
    let modalTitle = t('modalAvgSec');

    if (type === 'pass') {
        targetId = `qPass_${day}`;
        modalTitle = t('modalPass');
    } else if (type === 'fail') {
        targetId = `qFail_${day}`;
        modalTitle = t('modalFail');
    }
    
    // เปลี่ยนหัวข้อหน้าต่างตามบริบทที่กด
    const header = document.querySelector('#manualInputModal h3');
    if (header) header.innerText = modalTitle;
    
    const currentVal = document.getElementById(targetId).value;
    document.getElementById('manualSecondsInput').value = currentVal || "";
    document.getElementById('manualInputModal').style.display = 'block';
    
    setTimeout(() => document.getElementById('manualSecondsInput').focus(), 100);
}

// ==================== On-Screen Keypad Logic ====================

// 1. ฟังก์ชันเมื่อกดปุ่มตัวเลข 0 - 9
function pressNum(num) {
    const inputField = document.getElementById('manualSecondsInput');
    
    // ถ้าค่าปัจจุบันเป็น "0" ให้ลบออกแล้วแทนที่ด้วยเลขใหม่ แต่ถ้าเป็นค่าอื่นให้เอาเลขไปต่อท้าย (Concatenate)
    if (inputField.value === "0") {
        inputField.value = num;
    } else {
        inputField.value += num;
    }
    
    // โฟกัสอินพุตไว้เสมอเพื่อให้พิมพ์คีย์บอร์ดจริงควบคู่ได้
    inputField.focus(); 
}

// 2. ฟังก์ชันปุ่ม [C] สำหรับล้างค่าทั้งหมดเป็นว่างเปล่า
function pressClear() {
    document.getElementById('manualSecondsInput').value = "";
    document.getElementById('manualSecondsInput').focus();
}

// 3. ฟังก์ชันปุ่มลบทีละหลัก (Backspace)
function pressBackspace() {
    const inputField = document.getElementById('manualSecondsInput');
    let currentVal = inputField.value;
    
    if (currentVal.length > 0) {
        inputField.value = currentVal.slice(0, -1); // ตัดตัวอักษรสุดท้ายออก 1 ตำแหน่ง
    }
    inputField.focus();
}

function closeManualModal() {
    document.getElementById('manualInputModal').style.display = 'none';
    currentInputType = null; // ล้างค่าสถานะเมื่อปิด
}

// 3. ปรับฟังก์ชันบันทึกให้กระจายค่ากลับไปถูกช่อง
function saveManualSeconds() {
    const inputValue = parseFloat(document.getElementById('manualSecondsInput').value);
    
    if (isNaN(inputValue) || inputValue < 0) {
        showCustomModal(t('titleNoData'), t('alertInvalidNumber'), false);
        return;
    }

    if (currentInputType === 'sec') {
        // เคสที่ 1: บันทึกเวลาเฉลี่ย
        document.getElementById(`resAvgSec_${currentActiveDay}`).value = inputValue;
        manualCalculate(currentActiveDay);
        updateAutoTargetDay(); // รันเฉพาะเคสจับเวลา
        
    } else if (currentInputType === 'pass') {
        // เคสที่ 2: บันทึกงานผ่าน
        document.getElementById(`qPass_${currentActiveDay}`).value = Math.floor(inputValue);
        manualCalculate(currentActiveDay); // คำนวณสูตรใหม่ทันที
        
    } else if (currentInputType === 'fail') {
        // เคสที่ 3: บันทึกงานไม่ผ่าน
        document.getElementById(`qFail_${currentActiveDay}`).value = Math.floor(inputValue);
        manualCalculate(currentActiveDay); // คำนวณสูตรใหม่ทันที
    }
    
    closeManualModal();
}

// ==================== Signature Functions ====================
function initializeSignaturePad() {
    if (!canvas) return;
    
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    window.addEventListener('mouseup', stopDrawing);
    
    canvas.addEventListener('touchstart', startDrawingTouch, { passive: false });
    canvas.addEventListener('touchmove', drawTouch, { passive: false });
    window.addEventListener('touchend', stopDrawing);
}

function getCoordinates(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
}

function startDrawing(e) {
    writing = true;
    ctx.beginPath();
    const pos = getCoordinates(e);
    ctx.moveTo(pos.x, pos.y);
    e.preventDefault();
}

function draw(e) {
    if (!writing) return;
    const pos = getCoordinates(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    e.preventDefault();
}

function startDrawingTouch(e) {
    e.preventDefault();
    writing = true;
    ctx.beginPath();
    const pos = getCoordinates(e);
    ctx.moveTo(pos.x, pos.y);
}

function drawTouch(e) {
    e.preventDefault();
    if (!writing) return;
    const pos = getCoordinates(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
}

function stopDrawing() {
    writing = false;
}

function openSignPad(day) { 
    currentActiveDay = day; 
    document.getElementById('signModal').style.display = 'block'; 
    clearPad(); 
}

function closeSignPad() { 
    document.getElementById('signModal').style.display = 'none'; 
}

function clearPad() { 
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
}

function saveSignature() {
    const dataURL = canvas.toDataURL();
    const signImg = document.getElementById(`signImg_${currentActiveDay}`);
    const signText = document.getElementById(`signText_${currentActiveDay}`);
    
    if (signImg && signText) {
        signImg.src = dataURL;
        signImg.style.display = 'block';
        signText.style.display = 'none';
    }
    closeSignPad();
}

// ==================== Helper Functions ====================
function handleAvgSecChange(d) {
    const avgSecInput = document.getElementById(`resAvgSec_${d}`);
    const qFailInput = document.getElementById(`qFail_${d}`);

    if (avgSecInput.value !== "" && qFailInput.value === "") {
        qFailInput.value = 0;
    }
}

// ==================== Modern Theme Control Function ====================

function toggleTheme() {
    // 1. ตรวจสอบว่าปัจจุบันหน้าเว็บเป็นโหมดมืดอยู่หรือไม่
    const currentTheme = document.documentElement.getAttribute('data-theme');
    
    if (currentTheme === 'dark') {
        // ถ้าเป็นโหมดมืดอยู่ -> เปลี่ยนเป็นโหมดสว่าง (ลบแอตทริบิวต์ออก)
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
    } else {
        // ถ้าเป็นโหมดสว่างอยู่ -> เปลี่ยนเป็นโหมดมืด (ใส่แอตทริบิวต์ dark)
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    }
}

// 2. ระบบเช็กสถานะธีมล่าสุดทันทีที่พนักงานเปิดหน้าเว็บขึ้นมา (Auto-Apply Saved Theme)
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    const langSel = document.getElementById('langSelect');
    if (langSel) langSel.value = currentLang;
});

// ==================== Action Plan Modal Controls ====================

let currentActionPlanDay = null; // ตัวแปร Global จำว่าตอนนี้กำลังเปิดแผนของวันที่เท่าไหร่

// 1. ฟังก์ชันเปิดหน้าต่างระบุแผนแก้ไข
function openActionPlanModal(day) {
    currentActionPlanDay = day;
    
    // แสดงเลขวันบนหัวข้อ
    document.getElementById('actionPlanDayLabel').innerText = day;
    
    // ดึงข้อความเก่าที่มีอยู่ในตาราง (ถ้ามี) มาส่องแสดงใน Modal รอไว้ก่อน
    const currentText = document.getElementById(`actionPlan_${day}`).value;
    document.getElementById('modalActionPlanInput').value = currentText;
    
    // เปิดการแสดงผล Modal
    document.getElementById('actionPlanModal').style.display = 'block';
    
    // โฟกัสไปที่ช่องพิมพ์ทันทีหลังจากเปิดหน้าจอ
    setTimeout(() => document.getElementById('modalActionPlanInput').focus(), 100);
}

// 2. ฟังก์ชันปิดหน้าต่างโดยไม่บันทึกค่า
function closeActionPlanModal() {
    document.getElementById('actionPlanModal').style.display = 'none';
    currentActionPlanDay = null;
}

// 3. ฟังก์ชันดึงคำสั่งที่บันทึก ยัดกลับลงไปในตารางหลัก
function saveActionPlanInput() {
    if (!currentActionPlanDay) return;
    
    // ดึงค่าคำอธิบายที่พนักงานพิมพ์ใน Modal
    const updatedText = document.getElementById('modalActionPlanInput').value;
    
    // เขียนค่ายัดกลับลงไปที่ช่อง Textarea ของตารางในวันนั้นๆ
    document.getElementById(`actionPlan_${currentActionPlanDay}`).value = updatedText;
    
    // ปิดหน้าต่างให้เรียบร้อย
    closeActionPlanModal();
}


// Export functions to global scope
window.exportToExcel = exportToExcel;
window.clearAllData = clearAllData;
window.showPerformanceChart = showPerformanceChart;
window.calculateAdaptiveGoals = calculateAdaptiveGoals;
window.adjustPlan = adjustPlan;
window.toggleTimer = toggleTimer;
window.resetTimer = resetTimer;
window.recordAndCalculate = recordAndCalculate;
window.openManualModal = openManualModal;
window.closeManualModal = closeManualModal;
window.saveManualSeconds = saveManualSeconds;
window.manualCalculate = manualCalculate;
window.openSignPad = openSignPad;
window.closeSignPad = closeSignPad;
window.clearPad = clearPad;
window.saveSignature = saveSignature;
window.changeLanguage = changeLanguage;

// ==================== Shortcut Keys Listener ====================
// ระบบดักจับการกดปุ่มบนคีย์บอร์ด (ปุ่ม ESC เพื่อปิด Modal)
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' || event.key === 'Esc') {
        
        // 1. ตรวจสอบและปิดหน้าต่างระบุเวลาเฉลี่ย (Manual Input Modal)
        const manualModal = document.getElementById('manualInputModal');
        if (manualModal && manualModal.style.display === 'block') {
            closeManualModal();
        }
        
        // 2. ตรวจสอบและปิดหน้าต่างลงลายเซ็น (Signature Modal)
        const signModal = document.getElementById('signModal');
        if (signModal && signModal.style.display === 'block') {
            closeSignPad();
        }
        
        // 3. ตรวจสอบและปิดหน้าต่างแสดงกราฟ (Chart Modal)
        const chartModal = document.getElementById('chartModal');
        if (chartModal && chartModal.style.display === 'block') {
            chartModal.style.display = 'none';
        }

        // 4. หน้าต่างปรับแผน (Notification Modal)
        const notifModal = document.getElementById('notificationModal');
        if (notifModal && notifModal.style.display === 'block') {
            closeNotifModal();
        } 
        // 5. ส่วนที่เพิ่มใหม่: ตรวจสอบและปิดหน้าต่างระบุแผนการแก้ไข (Action Plan Modal)
        const actionPlanModal = document.getElementById('actionPlanModal');
        if (actionPlanModal && actionPlanModal.style.display === 'block') {
            closeActionPlanModal();
        }
    }
});