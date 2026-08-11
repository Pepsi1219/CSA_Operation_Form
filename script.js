// ==================== Global Variables ====================
let startTime, timerInterval, elapsedTime = 0, isRunning = false;
let currentActiveDay = null;
let lastAdjustedDay = 0;
let myChart = null;

// ==================== i18n / Translations ====================
const translations = {
    th: {
        reportTitle: "Operation Training Record",
        themeToggle: "เปลี่ยนโหมดสี",
        btnExport: "ส่งออกไปที่ Excel",
        btnClear: "ล้างข้อมูล",
        btnChart: "กราฟประสิทธิภาพ",
        lblProcess: "ขั้นตอนหลัก",
        lblProcessLevel: "ขั้นตอนหลัก / ระดับงาน",
        lblEmpCode: "รหัสพนักงาน",
        lblTargets: "เป้าหมาย (Eff % / Q'ty ชิ้น/ชม.)",
        lblEmployee: "ชื่อพนักงาน",
        lblTrainer: "ครูฝึก",
        lblSam: "SAM (นาที / วินาที)",
        lblEffTarget: "เป้าหมาย Eff (%)",
        lblQtyTarget: "เป้าหมาย Q'ty (ชิ้น/ชม.)",
        lblWorkLevel: "ระดับงาน",
        lblTrainingDays: "จำนวนวันที่จะต้องฝึก",
        lblTrainingDuration: "จำนวนที่จะต้องฝึก",
        unitDay: "วัน",
        unitHour: "ชั่วโมง",
        lblEffTargetShort: "เป้าหมาย Eff (%)",
        lblSamShort: "SAM (นาที / วินาที)",
        quickEntryTitle: "บันทึกผลของ",
        quickAvgSec: "เวลาเฉลี่ย (วินาที)",
        quickPass: "ผ่าน",
        quickFail: "ไม่ผ่าน",
        lblCurveModel: "รูปแบบแผนการฝึก",
        curveScurve: "S-Curve (ค่อย ๆ เร่ง แล้วชะลอ)",
        curveLog: "Logarithmic (เร็วช่วงแรก และชะลอช่วงปลาย)",
        curvePower: "Power (เร็วช่วงแรก(แต่น้อยกว่า Log) และชะลอช่วงปลาย)",
        curveLinear: "Linear (เพิ่มขึ้นสม่ำเสมอ)",
        lblStartDate: "วันที่เริ่มฝึก",
        lblTransferDate: "วันที่โอนย้าย",
        lblTrainingPeriod: "ช่วงฝึก (เริ่ม → โอนย้าย)",
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
        chartXHour: (d) => `ชั่วโมงที่ ${d}`,
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
        btnDeleteRow: "ลบข้อมูลแถวนี้",
        btnToggleLabels: "ซ่อน/แสดงตัวเลข %",
        btnHideLabels: "ซ่อน %",
        btnShowLabels: "แสดง %",
        btnUnitToPcs: "แสดงเป็นชิ้น",
        btnUnitToPct: "แสดงเป็น %",
        btnPlanAdaptive: "แผนปรับตามผลจริง",
        btnPlanFixed: "แผนคงที่ (Q100 → เป้า)",
        chartYAxisPcs: "จำนวน (ชิ้น/ชม.)",
        titleConfirmDeleteRow: "⚠️ ยืนยันการลบข้อมูล",
        msgConfirmDeleteRow: (d) => `คุณต้องการลบข้อมูลของแถวที่ ${d} ทั้งหมดใช่หรือไม่?\nข้อมูลที่ลบแล้วไม่สามารถเรียกคืนได้`,
        msgConfirmClear: "คุณต้องการลบข้อมูลทั้งหมดในฟอร์มนี้ใช่หรือไม่?\nข้อมูลที่ลบแล้วไม่สามารถเรียกคืนได้",
        titleDone: "✨ ทำรายการสำเร็จ",
        msgClearDone: "ล้างข้อมูลทั้งหมดในระบบเรียบร้อยแล้ว",
        alertTimeFirst: "กรุณาจับเวลาก่อน",
        alertRowNotFound: "ไม่พบแถวที่ระบุในตาราง",
        alertInvalidNumber: "กรุณาระบุตัวเลขที่ถูกต้อง",
        noName: "ไม่ระบุชื่อ"
    },
    en: {
        reportTitle: "Operation Training Record",
        themeToggle: "Toggle Theme",
        btnExport: "Export to Excel",
        btnClear: "Clear Data",
        btnChart: "Performance Chart",
        lblProcess: "Main Process",
        lblProcessLevel: "Main Process / Operation Grade",
        lblEmpCode: "Employee Code",
        lblTargets: "Target (Eff % / Q'ty pcs/hr)",
        lblEmployee: "Employee Name",
        lblTrainer: "Trainer",
        lblSam: "SAM (min / sec)",
        lblEffTarget: "Eff Target (%)",
        lblQtyTarget: "Q'ty Target (pcs/hr)",
        lblWorkLevel: "Operation Grade",
        lblTrainingDays: "Training Days",
        lblTrainingDuration: "Training Duration",
        unitDay: "Days",
        unitHour: "Hours",
        lblEffTargetShort: "Target Eff (%)",
        lblSamShort: "SAM (min / sec)",
        quickEntryTitle: "Record data for",
        quickAvgSec: "Avg Time (sec)",
        quickPass: "Pass",
        quickFail: "Fail",
        lblCurveModel: "Training Plan Model",
        curveScurve: "S-Curve (gradual → fast → plateau)",
        curveLog: "Logarithmic (fast early, slower late)",
        curvePower: "Power (fast early (less than Log), slower late)",
        curveLinear: "Linear (steady increase)",
        lblStartDate: "Start Date",
        lblTransferDate: "Transfer Date",
        lblTrainingPeriod: "Training Period (Start → Transfer)",
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
        chartXHour: (d) => `Hour ${d}`,
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
        btnDeleteRow: "Delete this row",
        btnToggleLabels: "Toggle % labels",
        btnHideLabels: "Hide %",
        btnShowLabels: "Show %",
        btnUnitToPcs: "Show as pcs",
        btnUnitToPct: "Show as %",
        btnPlanAdaptive: "Adaptive plan (follows actual)",
        btnPlanFixed: "Fixed plan (Q100 → target)",
        chartYAxisPcs: "Quantity (pcs/hr)",
        titleConfirmDeleteRow: "⚠️ Confirm Delete Row",
        msgConfirmDeleteRow: (d) => `Delete all data in row ${d}?\nThis action cannot be undone.`,
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
        lblProcessLevel: "Công đoạn chính / Cấp độ công việc",
        lblEmpCode: "Mã nhân viên",
        lblTargets: "Mục tiêu (Eff % / Q'ty cái/giờ)",
        lblEmployee: "Tên công nhân",
        lblTrainer: "Huấn luyện viên",
        lblSam: "SAM (phút / giây)",
        lblEffTarget: "Mục tiêu Eff (%)",
        lblQtyTarget: "Mục tiêu SL (cái/giờ)",
        lblWorkLevel: "Cấp độ vận hành",
        lblTrainingDays: "Số ngày đào tạo",
        lblTrainingDuration: "Thời lượng đào tạo",
        unitDay: "Ngày",
        unitHour: "Giờ",
        lblEffTargetShort: "Mục tiêu Eff (%)",
        lblSamShort: "SAM (phút / giây)",
        quickEntryTitle: "Ghi dữ liệu cho",
        quickAvgSec: "Thời gian TB (giây)",
        quickPass: "Đạt",
        quickFail: "Không đạt",
        lblCurveModel: "Mô hình kế hoạch đào tạo",
        curveScurve: "S-Curve (chậm → nhanh → chậm dần)",
        curveLog: "Logarithmic (nhanh ban đầu, chậm về cuối)",
        curvePower: "Power (nhanh ban đầu (ít hơn Log), chậm về cuối)",
        curveLinear: "Linear (tăng đều)",
        lblStartDate: "Ngày bắt đầu",
        lblTransferDate: "Ngày chuyển giao",
        lblTrainingPeriod: "Kỳ đào tạo (Bắt đầu → Chuyển giao)",
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
        chartXHour: (d) => `Giờ ${d}`,
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
        btnDeleteRow: "Xóa hàng này",
        btnToggleLabels: "Ẩn/hiện nhãn %",
        btnHideLabels: "Ẩn %",
        btnShowLabels: "Hiện %",
        btnUnitToPcs: "Hiện theo cái",
        btnUnitToPct: "Hiện theo %",
        btnPlanAdaptive: "Kế hoạch thích ứng (theo thực tế)",
        btnPlanFixed: "Kế hoạch cố định (Q100 → mục tiêu)",
        chartYAxisPcs: "Số lượng (cái/giờ)",
        titleConfirmDeleteRow: "⚠️ Xác nhận xóa hàng",
        msgConfirmDeleteRow: (d) => `Xóa toàn bộ dữ liệu ở hàng ${d}?\nDữ liệu đã xóa không thể khôi phục.`,
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
        lblProcessLevel: "ຂັ້ນຕອນຫຼັກ / ລະດັບງານ",
        lblEmpCode: "ລະຫັດພະນັກງານ",
        lblTargets: "ເປົ້າໝາຍ (Eff % / Q'ty ຊິ້ນ/ຊົ່ວໂມງ)",
        lblEmployee: "ຊື່ພະນັກງານ",
        lblTrainer: "ຄູຝຶກ",
        lblSam: "SAM (ນາທີ / ວິນາທີ)",
        lblEffTarget: "ເປົ້າໝາຍ Eff (%)",
        lblQtyTarget: "ເປົ້າໝາຍ Q'ty (ຊິ້ນ/ຊົ່ວໂມງ)",
        lblWorkLevel: "ລະດັບການດຳເນີນງານ",
        lblTrainingDays: "ຈຳນວນວັນທີ່ຕ້ອງຝຶກ",
        lblTrainingDuration: "ຈຳນວນທີ່ຕ້ອງຝຶກ",
        unitDay: "ວັນ",
        unitHour: "ຊົ່ວໂມງ",
        lblEffTargetShort: "ເປົ້າໝາຍ Eff (%)",
        lblSamShort: "SAM (ນາທີ / ວິນາທີ)",
        quickEntryTitle: "ບັນທຶກຜົນຂອງ",
        quickAvgSec: "ເວລາສະເລ່ຍ (ວິນາທີ)",
        quickPass: "ຜ່ານ",
        quickFail: "ບໍ່ຜ່ານ",
        lblCurveModel: "ຮູບແບບແຜນການຝຶກ",
        curveScurve: "S-Curve (ຄ່ອຍໆ ເລັ່ງ ແລ້ວຊະລໍ)",
        curveLog: "Logarithmic (ໄວຊ່ວງຕົ້ນ ແລະ ຊະລໍຊ່ວງທ້າຍ)",
        curvePower: "Power (ໄວຊ່ວງຕົ້ນ(ແຕ່ໜ້ອຍກວ່າ Log) ແລະ ຊະລໍຊ່ວງທ້າຍ)",
        curveLinear: "Linear (ເພີ່ມຂຶ້ນສະໝ່ຳສະເໝີ)",
        lblStartDate: "ວັນທີເລີ່ມຝຶກ",
        lblTransferDate: "ວັນທີໂອນຍ້າຍ",
        lblTrainingPeriod: "ຊ່ວງຝຶກ (ເລີ່ມ → ໂອນຍ້າຍ)",
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
        chartXHour: (d) => `ຊົ່ວໂມງທີ ${d}`,
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
        btnDeleteRow: "ລຶບຂໍ້ມູນແຖວນີ້",
        btnToggleLabels: "ເຊື່ອງ/ສະແດງຕົວເລກ %",
        btnHideLabels: "ເຊື່ອງ %",
        btnShowLabels: "ສະແດງ %",
        btnUnitToPcs: "ສະແດງເປັນຊິ້ນ",
        btnUnitToPct: "ສະແດງເປັນ %",
        btnPlanAdaptive: "ແຜນປັບຕາມຜົນຈິງ",
        btnPlanFixed: "ແຜນຄົງທີ່ (Q100 → ເປົ້າ)",
        chartYAxisPcs: "ຈຳນວນ (ຊິ້ນ/ຊົ່ວໂມງ)",
        titleConfirmDeleteRow: "⚠️ ຢືນຢັນການລຶບຂໍ້ມູນ",
        msgConfirmDeleteRow: (d) => `ທ່ານຕ້ອງການລຶບຂໍ້ມູນຂອງແຖວທີ ${d} ທັງໝົດບໍ?\nຂໍ້ມູນທີ່ລຶບແລ້ວບໍ່ສາມາດເອົາຄືນໄດ້`,
        msgConfirmClear: "ທ່ານຕ້ອງການລຶບຂໍ້ມູນທັງໝົດໃນຟອມນີ້ບໍ?\nຂໍ້ມູນທີ່ລຶບແລ້ວບໍ່ສາມາດເອົາຄືນໄດ້",
        titleDone: "✨ ດຳເນີນການສຳເລັດ",
        msgClearDone: "ລຶບຂໍ້ມູນທັງໝົດໃນລະບົບຮຽບຮ້ອຍແລ້ວ",
        alertTimeFirst: "ກະລຸນາຈັບເວລາກ່ອນ",
        alertRowNotFound: "ບໍ່ພົບແຖວທີ່ລະບຸໃນຕາຕະລາງ",
        alertInvalidNumber: "ກະລຸນາລະບຸຕົວເລກທີ່ຖືກຕ້ອງ",
        noName: "ບໍ່ລະບຸຊື່"
    }
};

// ==================== Curve Hint Data ====================
const curveHintData = {
    th: {
        linear: {
            title: "Linear (เส้นตรง / การเรียนรู้แบบสม่ำเสมอ)",
            desc: "เป้าหมายเพิ่มขึ้นคงที่เท่ากันทุกวัน เหมาะกับงานเย็บที่ไม่ซับซ้อน เช่น งานพับชายผ้า งานเย็บเส้นตรง หรือพนักงานที่มีพื้นฐานการใช้จักรมาแล้ว",
            formula: "progress(x) = x / N",
            latex: String.raw`\text{progress}(x) = \dfrac{x}{N}`
        },
        log: {
            title: "Logarithmic (พุ่งเร็วช่วงแรก / เร่งการเรียนรู้)",
            desc: "เป้าหมายพุ่งสูงขึ้นอย่างรวดเร็วตั้งแต่วันแรก ๆ เหมาะกับงานที่เน้นให้จำลำดับขั้นตอนมากกว่าทักษะความแม่นยำของมือ เช่น พอผู้เรียนจำสเต็ปการทำได้ ก็จะสามารถเร่งความเร็วได้ทันที",
            formula: "progress(x) = ln(x + 1) / ln(N + 1)",
            latex: String.raw`\text{progress}(x) = \dfrac{\ln(x + 1)}{\ln(N + 1)}`
        },
        power: {
            title: "Power / Wright's Law (อัตราเร่งปานกลางตามรอบการทำงาน)",
            desc: "เป้าหมายเพิ่มขึ้นตามความชำนาญสะสมจากการฝึกเย็บซ้ำ ๆ เหมาะกับงานเย็บมาตรฐานทั่วไปที่ความเร็วจะเพิ่มขึ้นตามจำนวนชิ้นงานที่ผ่านมือ",
            formula: "progress(x) = √(x / N)",
            latex: String.raw`\text{progress}(x) = \sqrt{\dfrac{x}{N}}`
        },
        scurve: {
            title: "S-Curve (นุ่มนวลช่วงแรก)",
            desc: "เป้าหมายเพิ่มขึ้นอย่างนุ่มนวลในวันแรก ๆ ให้เวลาผู้เรียนปรับตัวและจับจังหวะจักร จากนั้นจะเร่งสปีดขึ้นช่วงกลางเมื่อมือเริ่มชิน เหมาะที่สุดสำหรับงานเย็บที่ใช้ทักษะฝีมือสูง เช่น งานเข้าปก งานติดซิป หรือพนักงานใหม่ที่เพิ่งเริ่มจับจักร",
            formula: "progress(x) = 3t² − 2t³  (โดย t = x / N)",
            latex: String.raw`\text{progress}(x) = 3t^{2} - 2t^{3} \quad \left(t = \dfrac{x}{N}\right)`
        }
    },
    en: {
        linear: {
            title: "Linear (Straight line / Steady learning)",
            desc: "Target grows at a constant rate every day. Best for simple sewing operations like hemming or straight-line stitching, or for operators who already have sewing-machine experience.",
            formula: "progress(x) = x / N",
            latex: String.raw`\text{progress}(x) = \dfrac{x}{N}`
        },
        log: {
            title: "Logarithmic (Fast early / Accelerated learning)",
            desc: "Target rises sharply from the first days. Best for work that relies more on remembering the sequence than on precise handwork — once the operator remembers the steps, speed can be ramped up immediately.",
            formula: "progress(x) = ln(x + 1) / ln(N + 1)",
            latex: String.raw`\text{progress}(x) = \dfrac{\ln(x + 1)}{\ln(N + 1)}`
        },
        power: {
            title: "Power / Wright's Law (Moderate acceleration with repetition)",
            desc: "Target grows with skill accumulated from repeated sewing practice. Best for standard sewing operations where speed increases with the number of pieces the operator has completed.",
            formula: "progress(x) = √(x / N)",
            latex: String.raw`\text{progress}(x) = \sqrt{\dfrac{x}{N}}`
        },
        scurve: {
            title: "S-Curve (Soft start)",
            desc: "Target grows gently in the first days, giving the operator time to adjust and get the machine's rhythm; it then accelerates in the middle once the hands are used to it. Best for high-skill sewing (e.g. collar attaching, zipper insertion) or new operators just starting on the machine.",
            formula: "progress(x) = 3t² − 2t³  (t = x / N)",
            latex: String.raw`\text{progress}(x) = 3t^{2} - 2t^{3} \quad \left(t = \dfrac{x}{N}\right)`
        }
    },
    vn: {
        linear: {
            title: "Linear (Đường thẳng / Học đều đặn)",
            desc: "Mục tiêu tăng đều mỗi ngày. Phù hợp với công đoạn may đơn giản như vắt lai, may đường thẳng, hoặc công nhân đã có nền tảng sử dụng máy may.",
            formula: "progress(x) = x / N",
            latex: String.raw`\text{progress}(x) = \dfrac{x}{N}`
        },
        log: {
            title: "Logarithmic (Tăng nhanh ban đầu / Học tăng tốc)",
            desc: "Mục tiêu tăng vọt ngay từ những ngày đầu. Phù hợp với công việc thiên về ghi nhớ trình tự hơn là độ chính xác của tay — khi công nhân nhớ được các bước, tốc độ có thể tăng ngay.",
            formula: "progress(x) = ln(x + 1) / ln(N + 1)",
            latex: String.raw`\text{progress}(x) = \dfrac{\ln(x + 1)}{\ln(N + 1)}`
        },
        power: {
            title: "Power / Định luật Wright (Tăng tốc vừa theo số lần)",
            desc: "Mục tiêu tăng theo kỹ năng tích lũy từ việc may lặp lại. Phù hợp với các công đoạn may tiêu chuẩn — tốc độ tăng theo số sản phẩm đã hoàn thành.",
            formula: "progress(x) = √(x / N)",
            latex: String.raw`\text{progress}(x) = \sqrt{\dfrac{x}{N}}`
        },
        scurve: {
            title: "S-Curve (Nhẹ nhàng giai đoạn đầu)",
            desc: "Mục tiêu tăng nhẹ trong những ngày đầu, cho công nhân thời gian làm quen và bắt nhịp máy; sau đó tăng tốc ở giữa khi tay đã quen. Phù hợp nhất cho công đoạn may đòi hỏi tay nghề cao (may cổ, tra khóa) hoặc công nhân mới bắt đầu.",
            formula: "progress(x) = 3t² − 2t³  (t = x / N)",
            latex: String.raw`\text{progress}(x) = 3t^{2} - 2t^{3} \quad \left(t = \dfrac{x}{N}\right)`
        }
    },
    lo: {
        linear: {
            title: "Linear (ເສັ້ນຊື່ / ຮຽນຮູ້ສະໝ່ຳສະເໝີ)",
            desc: "ເປົ້າໝາຍເພີ່ມຄົງທີ່ທຸກມື້ ເໝາະກັບງານຫຍິບບໍ່ຊັບຊ້ອນ ເຊັ່ນ ພັບຊາຍຜ້າ ຫຍິບເສັ້ນຊື່ ຫຼືພະນັກງານທີ່ມີພື້ນຖານໃຊ້ຈັກແລ້ວ",
            formula: "progress(x) = x / N",
            latex: String.raw`\text{progress}(x) = \dfrac{x}{N}`
        },
        log: {
            title: "Logarithmic (ພຸ່ງໄວຊ່ວງຕົ້ນ / ເລັ່ງການຮຽນຮູ້)",
            desc: "ເປົ້າໝາຍພຸ່ງສູງໄວແຕ່ວັນທຳອິດ ເໝາະກັບງານທີ່ເນັ້ນຈື່ລຳດັບຂັ້ນຕອນຫຼາຍກວ່າຄວາມແມ່ນຍຳຂອງມື — ພໍຜູ້ຮຽນຈື່ຂັ້ນຕອນໄດ້ ກໍເລັ່ງຄວາມໄວໄດ້ທັນທີ",
            formula: "progress(x) = ln(x + 1) / ln(N + 1)",
            latex: String.raw`\text{progress}(x) = \dfrac{\ln(x + 1)}{\ln(N + 1)}`
        },
        power: {
            title: "Power / Wright's Law (ເລັ່ງປານກາງຕາມຮອບການເຮັດ)",
            desc: "ເປົ້າໝາຍເພີ່ມຂຶ້ນຕາມຄວາມຊຳນານສະສົມຈາກການຫຍິບຊ້ຳ ໆ ເໝາະກັບງານຫຍິບມາດຕະຖານທົ່ວໄປທີ່ຄວາມໄວເພີ່ມຕາມຈຳນວນຊິ້ນທີ່ຜ່ານມື",
            formula: "progress(x) = √(x / N)",
            latex: String.raw`\text{progress}(x) = \sqrt{\dfrac{x}{N}}`
        },
        scurve: {
            title: "S-Curve (ນຸ້ມນວນຊ່ວງຕົ້ນ)",
            desc: "ເປົ້າໝາຍເພີ່ມນຸ້ມນວນໃນວັນທຳອິດ ໃຫ້ຜູ້ຮຽນມີເວລາປັບຕົວ ແລະ ຈັບຈັງຫວະຈັກ ຈາກນັ້ນຈຶ່ງເລັ່ງຊ່ວງກາງເມື່ອມືເລີ່ມຄຸ້ນ ເໝາະທີ່ສຸດສຳລັບງານຫຍິບທັກສະສູງ ເຊັ່ນ ເຂົ້າປົກ ຕິດຊິບ ຫຼືພະນັກງານໃໝ່",
            formula: "progress(x) = 3t² − 2t³  (t = x / N)",
            latex: String.raw`\text{progress}(x) = 3t^{2} - 2t^{3} \quad \left(t = \dfrac{x}{N}\right)`
        }
    }
};

function getCurveHint(model) {
    const lang = curveHintData[currentLang] ? currentLang : 'th';
    return curveHintData[lang][model] || curveHintData[lang].scurve;
}

function renderCurveHint(model, targetId) {
    const box = document.getElementById(targetId);
    if (!box) return;

    // ถ้ายังไม่เลือก curve ให้ซ่อนกล่อง hint
    if (!model) {
        box.textContent = '';
        box.classList.remove('is-visible');
        return;
    }

    const h = getCurveHint(model);
    const descLabel = { th: "คำอธิบาย", en: "Description", vn: "Mô tả", lo: "ຄຳອະທິບາຍ" }[currentLang] || "คำอธิบาย";
    const formulaLabel = { th: "สูตรคำนวณ", en: "Formula", vn: "Công thức", lo: "ສູດຄຳນວນ" }[currentLang] || "สูตรคำนวณ";

    // สร้าง DOM ด้วย textContent — ปลอดภัยจาก XSS
    const makeRow = (label, value) => {
        const row = document.createElement('div');
        row.className = 'curve-hint-row';
        const lbl = document.createElement('span');
        lbl.className = 'curve-hint-label';
        lbl.textContent = label + ':';
        row.appendChild(lbl);
        row.appendChild(document.createTextNode(' '));
        row.appendChild(document.createTextNode(value));
        return row;
    };

    box.textContent = '';
    const title = document.createElement('div');
    title.className = 'curve-hint-title';
    title.textContent = h.title;
    box.appendChild(title);
    box.appendChild(makeRow(descLabel, h.desc));

    // แถวสูตร — เรนเดอร์ด้วย KaTeX (fallback เป็นข้อความล้วนถ้า KaTeX โหลดไม่ทัน)
    const formulaRow = document.createElement('div');
    formulaRow.className = 'curve-hint-row curve-hint-formula-row';
    const flbl = document.createElement('span');
    flbl.className = 'curve-hint-label';
    flbl.textContent = formulaLabel + ':';
    formulaRow.appendChild(flbl);
    formulaRow.appendChild(document.createTextNode(' '));
    const math = document.createElement('span');
    math.className = 'curve-hint-formula';
    if (typeof katex !== 'undefined' && h.latex) {
        try {
            katex.render(h.latex, math, { throwOnError: false, displayMode: false });
        } catch (_) {
            math.textContent = h.formula;
        }
    } else {
        math.textContent = h.formula;
    }
    formulaRow.appendChild(math);
    box.appendChild(formulaRow);
}

function updateAllCurveHints() {
    const mainSel = document.getElementById('curveModel');
    const chartSel = document.getElementById('curveModelChart');
    if (mainSel) renderCurveHint(mainSel.value, 'curveHint');
    if (chartSel) renderCurveHint(chartSel.value, 'curveHintChart');
}

// ==================== Floating Hint Show/Hide ====================
const _hintTimers = {};
const HINT_AUTO_HIDE_MS = 10000;

function showCurveHint(boxId) {
    const box = document.getElementById(boxId);
    if (!box || !box.textContent.trim()) return;

    // Hint uses position:fixed to escape .form-header{overflow:hidden}.
    // Anchor it just under its paired select using the select's viewport rect.
    const selectId = boxId === 'curveHintChart' ? 'curveModelChart' : 'curveModel';
    const sel = document.getElementById(selectId);
    if (sel) {
        const rect = sel.getBoundingClientRect();
        box.style.top = `${rect.bottom + 6}px`;
        box.style.left = `${rect.left}px`;
        box.style.minWidth = `${rect.width}px`;
    }

    box.classList.add('is-visible');
    clearTimeout(_hintTimers[boxId]);
    _hintTimers[boxId] = setTimeout(() => hideCurveHint(boxId), HINT_AUTO_HIDE_MS);
}

function hideCurveHint(boxId) {
    const box = document.getElementById(boxId);
    if (box) box.classList.remove('is-visible');
    clearTimeout(_hintTimers[boxId]);
}

function hideAllCurveHints() {
    hideCurveHint('curveHint');
    hideCurveHint('curveHintChart');
}

// ปิดกล่อง hint ทันทีเมื่อคลิกนอกกล่อง/นอก dropdown ที่เกี่ยวข้อง
document.addEventListener('click', (e) => {
    const inMainDrop = e.target.closest('#curveModel') || e.target.closest('#curveHint');
    const inChartDrop = e.target.closest('#curveModelChart') || e.target.closest('#curveHintChart');
    if (!inMainDrop) hideCurveHint('curveHint');
    if (!inChartDrop) hideCurveHint('curveHintChart');
});

// Hint uses position:fixed anchored to the select's client rect — if the page
// scrolls or resizes after showing, the anchor drifts. Cheapest fix: hide it.
window.addEventListener('scroll', hideAllCurveHints, { passive: true, capture: true });
window.addEventListener('resize', hideAllCurveHints);

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
    for (let d = 1; d <= getRowCount(); d++) {
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
    updateAllCurveHints();
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

// ==================== LocalStorage Persistence ====================
const STORAGE_KEY = 'csaOperationForm.v1';
let _saveDebounceTimer = null;
let _isRestoring = false;

function collectPersistedState() {
    const state = { inputs: {}, textareas: {}, checkboxes: {}, signatures: {}, flags: {} };
    state.flags.fixedPlanMode = _fixedPlanMode;

    // Header inputs + selects
    document.querySelectorAll('.form-header input, .form-header select').forEach(el => {
        if (el.id) state.inputs[el.id] = el.value;
    });

    // Row inputs — เฉพาะช่องที่ user กรอกเอง (ช่อง calculated ระบบคำนวณกลับได้)
    for (let d = 1; d <= getRowCount(); d++) {
        ['resAvgSec', 'qPass', 'qFail'].forEach(prefix => {
            const el = document.getElementById(`${prefix}_${d}`);
            if (el && el.value !== "") state.inputs[`${prefix}_${d}`] = el.value;
        });
        const ta = document.getElementById(`actionPlan_${d}`);
        if (ta && ta.value !== "") state.textareas[`actionPlan_${d}`] = ta.value;
        const sig = document.getElementById(`signImg_${d}`);
        if (sig && sig.src && sig.src.startsWith('data:')) {
            state.signatures[`signImg_${d}`] = sig.src;
        }
        const cbs = document.querySelectorAll(`#tableBody tr:nth-child(${d}) input[type="checkbox"]`);
        cbs.forEach((cb, i) => {
            if (cb.checked) state.checkboxes[`cb_${d}_${i}`] = true;
        });
    }
    return state;
}

function saveStateToStorage() {
    if (_isRestoring) return;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(collectPersistedState()));
    } catch (e) {
        console.warn('LocalStorage save failed:', e);
    }
}

function loadStateFromStorage() {
    let state;
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        state = JSON.parse(raw);
    } catch (e) {
        console.warn('LocalStorage load failed:', e);
        return;
    }
    _isRestoring = true;

    // Flags (toggle states)
    if (state.flags) {
        _fixedPlanMode = !!state.flags.fixedPlanMode;
    }

    // Header + row inputs
    Object.entries(state.inputs || {}).forEach(([id, val]) => {
        const el = document.getElementById(id);
        if (el) el.value = val;
    });
    Object.entries(state.textareas || {}).forEach(([id, val]) => {
        const el = document.getElementById(id);
        if (el) el.value = val;
    });
    // ลายเซ็น — ต้องแสดง img และซ่อน text placeholder
    Object.entries(state.signatures || {}).forEach(([id, src]) => {
        const img = document.getElementById(id);
        if (img) {
            img.src = src;
            img.style.display = 'block';
            const d = id.replace('signImg_', '');
            const txt = document.getElementById(`signText_${d}`);
            if (txt) txt.style.display = 'none';
        }
    });
    // Checkboxes
    Object.entries(state.checkboxes || {}).forEach(([key, checked]) => {
        const m = key.match(/^cb_(\d+)_(\d+)$/);
        if (!m) return;
        const [_, d, i] = m;
        const cbs = document.querySelectorAll(`#tableBody tr:nth-child(${d}) input[type="checkbox"]`);
        if (cbs[i]) cbs[i].checked = !!checked;
    });

    // คำนวณช่องที่ derive จาก raw inputs (resAvgMin, resEffPerc, resEffPcs, qRates)
    for (let d = 1; d <= getRowCount(); d++) {
        const hasAvgSec = document.getElementById(`resAvgSec_${d}`)?.value;
        const hasQty = document.getElementById(`qPass_${d}`)?.value || document.getElementById(`qFail_${d}`)?.value;
        if (hasAvgSec || hasQty) {
            manualCalculate(d);
        }
    }

    _isRestoring = false;
}

function clearStateFromStorage() {
    try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
}

function scheduleSave() {
    if (_isRestoring) return;
    clearTimeout(_saveDebounceTimer);
    _saveDebounceTimer = setTimeout(saveStateToStorage, 400);
}

// Peek at saved trainingDays BEFORE building the table so it comes out at the
// right size — otherwise restore would populate row IDs the table doesn't have.
function peekSavedRowCount() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return DEFAULT_ROW_COUNT;
        const state = JSON.parse(raw);
        const v = parseInt(state?.inputs?.trainingDays, 10);
        if (!Number.isFinite(v) || v <= 0) return DEFAULT_ROW_COUNT;
        return Math.max(MIN_ROW_COUNT, Math.min(MAX_ROW_COUNT, v));
    } catch (_) {
        return DEFAULT_ROW_COUNT;
    }
}

// ==================== Initialization ====================
document.addEventListener('DOMContentLoaded', function() {
    initializeTable(peekSavedRowCount());
    initializeSignaturePad();
    loadStateFromStorage();
    calculateAdaptiveGoals();
    updateAutoTargetDay();
    applyTranslations();
    updateAllCurveHints();

    // Auto-save เมื่อมีการเปลี่ยนแปลง input ใด ๆ (debounce 400ms)
    document.addEventListener('input', scheduleSave);
    document.addEventListener('change', scheduleSave);
});

// Row count comes from the trainingDays input. Clamped to [1, 100] for sanity:
// too small → nothing to plan; too large → freezes the DOM and localStorage payload.
const DEFAULT_ROW_COUNT = 30;
const MIN_ROW_COUNT = 1;
const MAX_ROW_COUNT = 100;

function getRowCount() {
    const tbody = document.getElementById('tableBody');
    return tbody ? tbody.children.length : 0;
}

function getTargetRowCount() {
    const raw = document.getElementById('trainingDays')?.value;
    const n = parseInt(raw, 10);
    if (!Number.isFinite(n) || n <= 0) return DEFAULT_ROW_COUNT;
    return Math.max(MIN_ROW_COUNT, Math.min(MAX_ROW_COUNT, n));
}

function buildRow(d) {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td class="day-cell-readonly" tabIndex="-1">
            <span class="day-num" id="dayCell_${d}"></span>
            <button type="button" class="row-del-btn" onclick="deleteRowData(${d})" title="${t('btnDeleteRow')}" data-i18n-title="btnDeleteRow" aria-label="Delete row">
                <i class="fa-solid fa-trash-can"></i>
            </button>
        </td>

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
    return row;
}

function initializeTable(count) {
    const tbody = document.getElementById("tableBody");
    if (!tbody) return;
    const n = Math.max(MIN_ROW_COUNT, Math.min(MAX_ROW_COUNT, count || DEFAULT_ROW_COUNT));
    tbody.innerHTML = '';
    for (let d = 1; d <= n; d++) tbody.appendChild(buildRow(d));
}

// Grow/shrink the table without destroying data in kept rows.
// Called when trainingDays changes.
function resizeTable(newCount) {
    const tbody = document.getElementById('tableBody');
    if (!tbody) return;
    const target = Math.max(MIN_ROW_COUNT, Math.min(MAX_ROW_COUNT, newCount));
    const current = tbody.children.length;
    if (target === current) return;

    if (target > current) {
        for (let d = current + 1; d <= target; d++) tbody.appendChild(buildRow(d));
    } else {
        while (tbody.children.length > target) tbody.removeChild(tbody.lastElementChild);
    }
    // Persist the new shape (removed rows drop out of the serialized state) and
    // refresh the plan since row count feeds into the curve window.
    if (!_isRestoring) {
        scheduleSave();
        calculateAdaptiveGoals();
        updateRaceTrack();
        updateAutoTargetDay();
    }
}

// oninput fires per keystroke. Typing "12" transiently passes trainingDays=1,
// which would resize down to 1 row and destroy row 2+ data before "2" arrives.
// Debounce the destructive resize; keep plan recomputation immediate so target
// columns stay responsive as the user types.
let _rowResizeTimer = null;
const ROW_RESIZE_DEBOUNCE_MS = 600;

function onTrainingDaysChange() {
    calculateAdaptiveGoals();
    clearTimeout(_rowResizeTimer);
    _rowResizeTimer = setTimeout(() => {
        resizeTable(getTargetRowCount());
    }, ROW_RESIZE_DEBOUNCE_MS);
}

// ==================== Progressive row-unlock ====================
// A row's data-entry cells (avgSec, pass, fail, checkboxes, action plan, signature)
// are only editable once all previous rows are "filled" — user must record in order
// and can't skip ahead. Row 1 is always unlocked.
// Filled = avgSec + pass + fail are all non-empty.
function isRowFilled(d) {
    const avg = document.getElementById(`resAvgSec_${d}`)?.value.trim() || '';
    const pass = document.getElementById(`qPass_${d}`)?.value.trim() || '';
    const fail = document.getElementById(`qFail_${d}`)?.value.trim() || '';
    return avg !== '' && pass !== '' && fail !== '';
}

// A row is locked (uneditable) when ANY prior row is not yet filled.
// Row 1 is never locked. Guards on modal openers use this to short-circuit clicks.
function isRowLocked(d) {
    if (d <= 1) return false;
    for (let i = 1; i < d; i++) {
        if (!isRowFilled(i)) return true;
    }
    return false;
}

function refreshRowLocks() {
    const tbody = document.getElementById('tableBody');
    if (!tbody) return;
    let unlocked = true;   // row 1 always unlocked
    Array.from(tbody.children).forEach((tr, i) => {
        const d = i + 1;
        tr.classList.toggle('row-locked', !unlocked);
        // The NEXT row's unlock depends on THIS row being filled.
        unlocked = isRowFilled(d);
    });
}

// ==================== Race Track Functions ====================
function updateRaceTrack() {
    const globalEffTarget = parseFloat(document.getElementById('globalEffTarget').value) || 100;

    let lastActualEff = 0;
    for (let d = 1; d <= getRowCount(); d++) {
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

    for (let d = 1; d <= getRowCount(); d++) {
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
    for (let d = 1; d <= getRowCount(); d++) {
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
function onCurveModelMainChange() {
    // เปลี่ยน dropdown หลัก → รี hint + recalc + sync ค่าไปยัง dropdown ในกราฟ
    const mainSel = document.getElementById('curveModel');
    const chartSel = document.getElementById('curveModelChart');
    if (mainSel && chartSel) chartSel.value = mainSel.value;
    calculateAdaptiveGoals();
    updateAllCurveHints();
    showCurveHint('curveHint');
}

function onCurveModelChartChange() {
    // Sync ค่ากลับไปที่ dropdown หลัก แล้วคำนวณใหม่ + วาดกราฟใหม่ + รี hint
    const chartSel = document.getElementById('curveModelChart');
    const mainSel = document.getElementById('curveModel');
    if (chartSel && mainSel) mainSel.value = chartSel.value;
    calculateAdaptiveGoals();
    updateAllCurveHints();
    showCurveHint('curveHintChart');
    showPerformanceChart();
}

function showPerformanceChart(skipParamSync) {
    document.getElementById('chartModal').style.display = 'block';

    // Sync inputs กลับจากฟอร์มหลัก ทำเฉพาะตอนเปิดกราฟใหม่ ไม่ใช่ตอน user กำลังพิมพ์
    // (ถ้าทำระหว่างพิมพ์ ค่า "0." จะโดนเขียนทับกลายเป็น "0" ทำให้พิมพ์ "." ไม่ได้)
    if (!skipParamSync) {
        const mainSel = document.getElementById('curveModel');
        const chartSel = document.getElementById('curveModelChart');
        if (mainSel && chartSel) chartSel.value = mainSel.value;
        syncChartParamsFromMain();
    }
    updateAllCurveHints();
    updateToggleLabelsBtn();
    updateToggleUnitBtn();
    updateToggleFixedPlanBtn();

    // เตรียมข้อมูลจากตาราง
    const labels = [];
    const targetData = [];
    const actualData = [];

    // เลือก key label ตามหน่วยที่ครูฝึกเลือก (วัน/ชั่วโมง)
    const trainingUnit = document.getElementById('trainingUnit')?.value || 'day';
    const xLabelKey = trainingUnit === 'hour' ? 'chartXHour' : 'chartXDay';

    // เลือก column ที่จะ plot ตาม unit ที่เลือก
    const usePcs = (_chartUnit === 'pcs');
    const targetIdPrefix = usePcs ? 'targetQty' : 'targetEff';
    const actualIdPrefix = usePcs ? 'resEffPcs' : 'resEffPerc';

    for (let d = 1; d <= getRowCount(); d++) {
        labels.push(t(xLabelKey, d));

        const tRaw = document.getElementById(`${targetIdPrefix}_${d}`)?.value.replace('%', '') || "";
        targetData.push(tRaw ? parseFloat(tRaw) : null);

        const aRaw = document.getElementById(`${actualIdPrefix}_${d}`)?.value.replace('%', '') || "";
        actualData.push(aRaw ? parseFloat(aRaw) : null);
    }

    // Trailing breathing-room slots — no label, no data. Makes the last real
    // data point sit inside the plot instead of hugging the right edge.
    const TRAILING_BLANK_SLOTS = 2;
    for (let i = 0; i < TRAILING_BLANK_SLOTS; i++) {
        labels.push('');
        targetData.push(null);
        actualData.push(null);
    }

    // 💡 ดึงค่าสี Dynamic จาก CSS Variables ณ ขณะนั้น
    const style = getComputedStyle(document.documentElement);
    const colorBlue = style.getPropertyValue('--accent-blue').trim() || '#007bff';
    const colorGreen = style.getPropertyValue('--accent-green').trim() || '#28a745';
    const colorText = style.getPropertyValue('--text-muted').trim() || '#475569';
    const colorGrid = style.getPropertyValue('--border-light').trim() || '#e2e8f0';

    // Register datalabels plugin กับ Chart.js (v4 ไม่ auto-register)
    if (typeof Chart !== 'undefined' && typeof ChartDataLabels !== 'undefined' && !Chart._dataLabelsRegistered) {
        Chart.register(ChartDataLabels);
        Chart._dataLabelsRegistered = true;
    }

    // สร้างกราฟ
    const ctx = document.getElementById('performanceChart').getContext('2d');
    
    if (myChart) { 
        myChart.destroy(); 
    }

    // Direct canvas click listener — เสริม Chart.js onClick กันกรณี plugin ดัก event
    const canvas = document.getElementById('performanceChart');
    if (canvas && !canvas._quickEntryBound) {
        canvas._quickEntryBound = true;
        canvas.addEventListener('click', (e) => {
            if (!myChart || !myChart.chartArea || !myChart.scales?.x) return;
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            console.log('[Canvas click]', { x, y, bottom: myChart.chartArea.bottom });
            if (y < myChart.chartArea.bottom - 8) return;
            const idx = Math.round(myChart.scales.x.getValueForPixel(x));
            console.log('[Canvas click] idx=', idx, '→ day', idx + 1);
            if (idx >= 0 && idx < getRowCount()) openQuickEntryModal(idx + 1);
        });
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
            layout: {
                padding: { top: 8, bottom: 4, left: 8, right: 16 }
            },
            // คลิกที่ label แกน X → เปิด modal บันทึกข้อมูลวันนั้น
            onClick: (evt, _elems, chart) => {
                if (!chart || !chart.chartArea || !chart.scales || !chart.scales.x) return;
                const y = (evt && evt.y != null) ? evt.y : (evt.native ? evt.native.offsetY : null);
                const x = (evt && evt.x != null) ? evt.x : (evt.native ? evt.native.offsetX : null);
                console.log('[Chart click]', { x, y, bottom: chart.chartArea.bottom });
                if (x == null || y == null) return;
                if (y < chart.chartArea.bottom - 8) return;
                const idx = Math.round(chart.scales.x.getValueForPixel(x));
                console.log('[Chart click] idx=', idx, '→ day', idx + 1);
                if (idx >= 0 && idx < getRowCount()) openQuickEntryModal(idx + 1);
            },
            onHover: (evt, _elems, chart) => {
                if (!chart || !chart.chartArea || !chart.canvas) return;
                const y = (evt && evt.y != null) ? evt.y : (evt.native ? evt.native.offsetY : null);
                if (y == null) return;
                chart.canvas.style.cursor = (y >= chart.chartArea.bottom - 8) ? 'pointer' : 'default';
            },
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
                    // % mode: anchor the top at 100 so users always see the ceiling
                    // even when target is 60/75. suggestedMax is a floor for the
                    // computed max — if actual data goes above 100 the axis still expands.
                    // pcs mode: no fixed ceiling; rely on grace to auto-scale nicely.
                    ...(usePcs ? { grace: '8%' } : { suggestedMax: 100, grace: '4%' }),
                    grid: {
                        color: colorGrid
                    },
                    ticks: {
                        color: colorText
                    },
                    title: {
                        display: true,
                        text: usePcs ? t('chartYAxisPcs') : t('chartYAxis'),
                        color: colorText
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                datalabels: {
                    display: (ctx) => _chartLabelsVisible && ctx.dataset.data[ctx.dataIndex] != null,
                    // ตำแหน่ง label: ปกติ target อยู่บน / actual อยู่ล่าง
                    // แต่ถ้า actual > target ในวันนั้น ให้สลับข้าง (actual ขึ้นบน, target ลงล่าง)
                    // เพื่อกันการซ้อนทับเมื่อสองเส้นแตะกัน
                    align: (ctx) => {
                        const i = ctx.dataIndex;
                        const tVal = ctx.chart.data.datasets[0]?.data[i];
                        const aVal = ctx.chart.data.datasets[1]?.data[i];
                        const actualHigher = (aVal != null && tVal != null && aVal > tVal);
                        if (ctx.datasetIndex === 0) return actualHigher ? 'bottom' : 'top';
                        return actualHigher ? 'top' : 'bottom';
                    },
                    anchor: (ctx) => {
                        const i = ctx.dataIndex;
                        const tVal = ctx.chart.data.datasets[0]?.data[i];
                        const aVal = ctx.chart.data.datasets[1]?.data[i];
                        const actualHigher = (aVal != null && tVal != null && aVal > tVal);
                        if (ctx.datasetIndex === 0) return actualHigher ? 'start' : 'end';
                        return actualHigher ? 'end' : 'start';
                    },
                    offset: 10,
                    clamp: true,
                    clip: false,
                    color: (ctx) => ctx.datasetIndex === 0 ? colorBlue : colorGreen,
                    font: { weight: 'bold', size: 11 },
                    backgroundColor: (style.getPropertyValue('--bg-modal').trim()
                        || style.getPropertyValue('--bg-container').trim()
                        || '#ffffff'),
                    borderColor: (ctx) => ctx.datasetIndex === 0 ? colorBlue : colorGreen,
                    borderWidth: 1,
                    borderRadius: 6,
                    padding: { top: 2, bottom: 2, left: 6, right: 6 },
                    formatter: (v) => (v == null ? '' : `${Number(v).toFixed(1)}${usePcs ? '' : '%'}`)
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
                ["Operation Training Record"],
                [""],
                [`ขั้นตอนหลัก: ${document.getElementById('header_process')?.value || "-"}`],
                [`รหัสพนักงาน: ${document.getElementById('header_empCode')?.value || "-"}`],
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
            for (let d = 1; d <= getRowCount(); d++) {
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
            for (let d = 1; d <= getRowCount(); d++) {
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

            // 5. ล้าง localStorage ด้วย เพื่อไม่ให้ข้อมูลถูก restore กลับตอนรีโหลด
            clearStateFromStorage();

            showCustomModal(t('titleDone'), t('msgClearDone'), false);
        }
    );
}

// ==================== Training Unit (Day/Hour) ====================
function onTrainingUnitChange() {
    calculateAdaptiveGoals();
    // ถ้ากราฟเปิดอยู่ ให้ re-render เพื่ออัปเดตแกน X
    const chartModal = document.getElementById('chartModal');
    if (chartModal && chartModal.style.display === 'block') {
        showPerformanceChart();
    }
}

// ==================== Delete Single Row Data ====================
function deleteRowData(d) {
    showCustomModal(
        t('titleConfirmDeleteRow'),
        t('msgConfirmDeleteRow', d),
        true,
        function() {
            // ล้างช่อง raw + derived ทั้งหมดในแถว
            const ids = [
                `targetEff_${d}`, `targetQty_${d}`,
                `resAvgSec_${d}`, `resAvgMin_${d}`, `resEffPerc_${d}`, `resEffPcs_${d}`,
                `qPass_${d}`, `qFail_${d}`, `resQRates_${d}`
            ];
            ids.forEach(id => {
                const el = document.getElementById(id);
                if (el) el.value = "";
            });

            // Uncheck คอลัมน์ 4M
            document.querySelectorAll(`#tableBody tr:nth-child(${d}) input[type="checkbox"]`).forEach(cb => {
                cb.checked = false;
            });

            // Action plan
            const ta = document.getElementById(`actionPlan_${d}`);
            if (ta) ta.value = "";

            // ลายเซ็น
            const sigImg = document.getElementById(`signImg_${d}`);
            const sigTxt = document.getElementById(`signText_${d}`);
            if (sigImg) { sigImg.src = ""; sigImg.style.display = 'none'; }
            if (sigTxt) sigTxt.style.display = 'block';

            // recalc + save
            calculateAdaptiveGoals();
            updateAutoTargetDay();
            saveStateToStorage();

            // ถ้ากราฟเปิดอยู่ ให้รี draw ทันที (กรณีกดลบจากในกราฟ)
            const chartModal = document.getElementById('chartModal');
            if (chartModal && chartModal.style.display === 'block') {
                showPerformanceChart(true);
            }
        }
    );
}

// ==================== Toggle Fixed Plan Mode (แผนคงที่ vs แผนปรับตามผลจริง) ====================
let _fixedPlanMode = false;

function toggleFixedPlan() {
    _fixedPlanMode = !_fixedPlanMode;
    updateToggleFixedPlanBtn();
    calculateAdaptiveGoals();
    saveStateToStorage();
    showPerformanceChart(true);
}

function updateToggleFixedPlanBtn() {
    const btn = document.getElementById('toggleFixedPlanBtn');
    if (!btn) return;
    const icon = btn.querySelector('i');
    const txt = btn.querySelector('.btn-toggle-labels-text');
    if (_fixedPlanMode) {
        if (icon) icon.className = 'fa-solid fa-lock';
        if (txt) txt.textContent = t('btnPlanFixed');
        btn.classList.add('is-on');
        btn.classList.remove('is-off');
    } else {
        if (icon) icon.className = 'fa-solid fa-lock-open';
        if (txt) txt.textContent = t('btnPlanAdaptive');
        btn.classList.remove('is-on');
        btn.classList.add('is-off');
    }
}

// ==================== Toggle Chart Unit (% ↔ ชิ้น/ชม.) ====================
let _chartUnit = 'pct'; // 'pct' | 'pcs'

function toggleChartUnit() {
    _chartUnit = (_chartUnit === 'pct') ? 'pcs' : 'pct';
    updateToggleUnitBtn();
    showPerformanceChart(true);
}

function updateToggleUnitBtn() {
    const btn = document.getElementById('toggleUnitBtn');
    if (!btn) return;
    const txt = btn.querySelector('.btn-toggle-labels-text');
    if (_chartUnit === 'pct') {
        if (txt) txt.textContent = t('btnUnitToPcs');
        btn.classList.remove('is-off');
    } else {
        if (txt) txt.textContent = t('btnUnitToPct');
        btn.classList.add('is-off');
    }
}

// ==================== Toggle Chart Data Labels (แสดง/ซ่อน % บนกราฟ) ====================
let _chartLabelsVisible = true;

function toggleChartLabels() {
    _chartLabelsVisible = !_chartLabelsVisible;
    updateToggleLabelsBtn();
    // วาดกราฟใหม่โดยไม่แตะช่องปรับค่า
    showPerformanceChart(true);
}

function updateToggleLabelsBtn() {
    const btn = document.getElementById('toggleLabelsBtn');
    if (!btn) return;
    const icon = btn.querySelector('i');
    const txt = btn.querySelector('.btn-toggle-labels-text');
    if (_chartLabelsVisible) {
        icon.className = 'fa-solid fa-eye';
        if (txt) txt.textContent = t('btnHideLabels');
        btn.classList.remove('is-off');
    } else {
        icon.className = 'fa-solid fa-eye-slash';
        if (txt) txt.textContent = t('btnShowLabels');
        btn.classList.add('is-off');
    }
}

// ==================== Quick Entry Modal (จากการคลิกป้ายแกน X ในกราฟ) ====================
let _quickEntryDay = null;

function openQuickEntryModal(day) {
    _quickEntryDay = day;
    const unit = document.getElementById('trainingUnit')?.value || 'day';
    const labelKey = unit === 'hour' ? 'chartXHour' : 'chartXDay';
    document.getElementById('quickEntryDayLabel').textContent = t(labelKey, day);

    // เติมค่าเดิมของแถวนั้น (ถ้ามี)
    document.getElementById('quickAvgSec').value = document.getElementById(`resAvgSec_${day}`)?.value || "";
    document.getElementById('quickPass').value = document.getElementById(`qPass_${day}`)?.value || "";
    document.getElementById('quickFail').value = document.getElementById(`qFail_${day}`)?.value || "";

    document.getElementById('quickEntryModal').style.display = 'block';
    setTimeout(() => document.getElementById('quickAvgSec')?.focus(), 50);
}

function closeQuickEntryModal() {
    document.getElementById('quickEntryModal').style.display = 'none';
    _quickEntryDay = null;
}

function saveQuickEntry() {
    if (_quickEntryDay == null) return;
    const d = _quickEntryDay;
    const avgSec = document.getElementById('quickAvgSec').value;
    const pass = document.getElementById('quickPass').value;
    const fail = document.getElementById('quickFail').value;

    document.getElementById(`resAvgSec_${d}`).value = avgSec;
    document.getElementById(`qPass_${d}`).value = pass;
    document.getElementById(`qFail_${d}`).value = fail;

    manualCalculate(d);
    updateAutoTargetDay();
    saveStateToStorage();

    closeQuickEntryModal();
    // วาดกราฟใหม่โดยไม่แตะช่องปรับค่า (กัน sync ทับตอนกำลังพิมพ์)
    showPerformanceChart(true);
}

function deleteQuickEntry() {
    if (_quickEntryDay == null) return;
    const d = _quickEntryDay;
    closeQuickEntryModal();
    // deleteRowData เปิด confirm modal + refresh กราฟให้อัตโนมัติถ้ากราฟเปิดอยู่
    deleteRowData(d);
}

// ==================== Chart Parameter Sync ====================
// ดึงค่าจากฟอร์มหลักมาเติมช่องในกราฟ (ตอนเปิดกราฟ)
function syncChartParamsFromMain() {
    const mainEff = document.getElementById('globalEffTarget');
    const mainDays = document.getElementById('trainingDays');
    const mainUnit = document.getElementById('trainingUnit');
    const mainSamMin = document.getElementById('globalSam');
    const mainSamSec = document.getElementById('globalSamSec');

    const chartEff = document.getElementById('chartEffTarget');
    const chartDays = document.getElementById('chartTrainingDays');
    const chartUnit = document.getElementById('chartTrainingUnit');
    const chartSamMin = document.getElementById('chartSamMin');
    const chartSamSec = document.getElementById('chartSamSec');

    if (chartEff && mainEff) chartEff.value = mainEff.value;
    if (chartDays && mainDays) chartDays.value = mainDays.value;
    if (chartUnit && mainUnit) chartUnit.value = mainUnit.value;
    if (chartSamMin && mainSamMin) chartSamMin.value = mainSamMin.value;
    if (chartSamSec && mainSamSec) chartSamSec.value = mainSamSec.value;
}

// เมื่อ user แก้ค่าใน panel ของกราฟ → sync กลับไปฟอร์มหลัก แล้วรี recalc + วาดกราฟใหม่
function onChartParamChange(field) {
    if (field === 'eff') {
        document.getElementById('globalEffTarget').value = document.getElementById('chartEffTarget').value;
    } else if (field === 'days') {
        document.getElementById('trainingDays').value = document.getElementById('chartTrainingDays').value;
        // Table row count is bound to trainingDays. Debounce so intermediate keystrokes
        // (typing "12" briefly reads as 1) don't shrink and wipe row 2+ data.
        clearTimeout(_rowResizeTimer);
        _rowResizeTimer = setTimeout(() => {
            resizeTable(getTargetRowCount());
            // Only redraw chart if it's still open — user may have closed it during the debounce.
            const modal = document.getElementById('chartModal');
            if (modal && modal.style.display === 'block') showPerformanceChart(true);
        }, ROW_RESIZE_DEBOUNCE_MS);
    } else if (field === 'unit') {
        document.getElementById('trainingUnit').value = document.getElementById('chartTrainingUnit').value;
    } else if (field === 'samMin') {
        const min = document.getElementById('chartSamMin').value;
        document.getElementById('globalSam').value = min;
        // sync ช่องวินาที (คำนวณเฉพาะเมื่อเป็นตัวเลขสมบูรณ์แล้ว) ไม่งั้นเว้นค่าปัจจุบันไว้
        const minNum = parseFloat(min);
        if (min !== "" && !isNaN(minNum)) {
            const sec = (minNum * 60).toFixed(2);
            document.getElementById('chartSamSec').value = sec;
            document.getElementById('globalSamSec').value = sec;
        } else if (min === "") {
            document.getElementById('chartSamSec').value = "";
            document.getElementById('globalSamSec').value = "";
        }
    } else if (field === 'samSec') {
        const sec = document.getElementById('chartSamSec').value;
        document.getElementById('globalSamSec').value = sec;
        const secNum = parseFloat(sec);
        if (sec !== "" && !isNaN(secNum)) {
            const min = (secNum / 60).toFixed(3);
            document.getElementById('chartSamMin').value = min;
            document.getElementById('globalSam').value = min;
        } else if (sec === "") {
            document.getElementById('chartSamMin').value = "";
            document.getElementById('globalSam').value = "";
        }
    }
    calculateAdaptiveGoals();
    // skipParamSync=true — ห้าม sync ค่ากลับมาที่ input ตอน user กำลังพิมพ์
    showPerformanceChart(true);
}

// ==================== SAM Sync (นาที ↔ วินาที) ====================
function syncSam(source) {
    const minEl = document.getElementById('globalSam');
    const secEl = document.getElementById('globalSamSec');
    if (!minEl || !secEl) return;

    if (source === 'min') {
        const v = minEl.value;
        secEl.value = (v === "") ? "" : (parseFloat(v) * 60).toFixed(2);
    } else {
        const v = secEl.value;
        minEl.value = (v === "") ? "" : (parseFloat(v) / 60).toFixed(3);
    }
    calculateAdaptiveGoals();
}

// ==================== Goal Calculation ====================
function calculateAdaptiveGoals() {
    const globalEff = parseFloat(document.getElementById('globalEffTarget').value) || 0;
    const trainDays = parseInt(document.getElementById('trainingDays').value) || 0;
    const sam = parseFloat(document.getElementById('globalSam').value) || 0;

    const qtyT = (sam > 0) ? Math.ceil((60 / sam) * (globalEff / 100)) : 0;
    document.getElementById('globalQtyTarget').value = qtyT;

    let firstDayQ100 = 0;
    for (let d = 1; d <= getRowCount(); d++) {
        if (document.getElementById(`resQRates_${d}`).value === "100%") {
            firstDayQ100 = d;
            break;
        }
    }

    // อัปเดตคอลัมน์ วัน/ชั่วโมง — เริ่มนับ 1 ที่แถวถัดจาก 100% แถวแรก
    for (let d = 1; d <= getRowCount(); d++) {
        const dayCell = document.getElementById(`dayCell_${d}`);
        if (!dayCell) continue;
        dayCell.textContent = (firstDayQ100 > 0 && d > firstDayQ100) ? (d - firstDayQ100) : "";
    }

    let lastActualEff = 0, lastActualDay = 0;
    for (let d = 1; d <= getRowCount(); d++) {
        let effStr = document.getElementById(`resEffPerc_${d}`).value;
        if (effStr && effStr !== "") {
            lastActualEff = parseFloat(effStr);
            lastActualDay = d;
        }
    }

    // เลือก anchor ตามโหมด:
    // - Fixed Plan (ON) → anchor คือวัน Q100 แรก + eff วันนั้น (แผนล็อคไม่ปรับตามผลใหม่)
    // - Adaptive (OFF, default) → anchor คือวันล่าสุดที่บันทึกผล (แผนปรับตามผลจริง)
    let anchorDay, anchorEff;
    if (_fixedPlanMode && firstDayQ100 > 0) {
        anchorDay = firstDayQ100;
        const q100EffStr = document.getElementById(`resEffPerc_${firstDayQ100}`)?.value.replace('%', '') || "";
        anchorEff = q100EffStr ? parseFloat(q100EffStr) : 0;
    } else {
        anchorDay = lastActualDay;
        anchorEff = lastActualEff;
    }

    for (let d = 1; d <= getRowCount(); d++) {
        const targetInput = document.getElementById(`targetEff_${d}`);
        const targetQtyInput = document.getElementById(`targetQty_${d}`);
        const effInput = document.getElementById(`resEffPerc_${d}`);

        if (!targetInput || !targetQtyInput || !effInput) continue;

        if (d <= anchorDay) {
            // preserve: วันที่ผ่านมา + anchor day ไม่แตะ target
        } else {
            let targetValue = 0;
            let showTarget = false;

            const curveModel = document.getElementById('curveModel')?.value || '';
            if (curveModel && firstDayQ100 > 0 && d > firstDayQ100 && d <= trainDays) {
                showTarget = true;

                const remainingDays = trainDays - anchorDay;
                if (remainingDays > 0) {

                    const deltaDay = d - anchorDay;
                    let progress;

                    if (curveModel === 'linear') {
                        // Linear — เพิ่มสม่ำเสมอทุกวัน
                        progress = deltaDay / remainingDays;
                    } else if (curveModel === 'log') {
                        // Logarithmic Y = a + b·ln(x+1) — โตเร็วช่วงแรก ชะลอช่วงท้าย
                        progress = Math.log(deltaDay + 1) / Math.log(remainingDays + 1);
                    } else if (curveModel === 'power') {
                        // Power Y = a·x^b (Wright's Law), b = 0.5 → progress = t^0.5
                        const tNorm = deltaDay / remainingDays;
                        progress = Math.pow(tNorm, 0.5);
                    } else {
                        // S-Curve (smoothstep) — ค่อย ๆ ขึ้น เร่งกลาง ชะลอท้าย
                        const tNorm = deltaDay / remainingDays;
                        progress = tNorm * tNorm * (3 - 2 * tNorm);
                    }

                    targetValue = anchorEff + (globalEff - anchorEff) * progress;
                } else {
                    targetValue = globalEff;
                }
            }

            if (showTarget) {
                const finalT = Math.min(targetValue, globalEff);
                targetInput.value = finalT.toFixed(1) + "%";
                if (sam > 0) targetQtyInput.value = ((60 / sam) * (finalT / 100)).toFixed(1);
            } else {
                targetInput.value = "";
                targetQtyInput.value = "";
            }
        }

        // ── Result vs target coloring ────────────────────────────────────
        // For all 4 result columns: better-than-target = green, worse = red,
        // exactly equal = black. "Better" is greater for efficiency (%, pcs)
        // and less for time (sec, min) — same target, inverse polarity.
        colorRowResults(d);
    }

    refreshRowLocks();
    updatePlanButtons();
    updateRaceTrack();
}

// Green when the actual beats the target, red when it misses, no class (default
// ink) when exactly equal or when either side is empty. Only the two efficiency
// columns and the two time columns are colored — target columns stay neutral.
function colorRowResults(d) {
    const targetEff = parseFloat(document.getElementById(`targetEff_${d}`)?.value.replace('%', ''));
    const targetQty = parseFloat(document.getElementById(`targetQty_${d}`)?.value);

    // avgSec/cycleMin have no explicit target column — derive from targetQty
    // (60 min/hr × 60 sec/min ÷ pcs-per-hr). If target eff is 100% at SAM 0.5min,
    // targetQty = 120 pcs/hr → targetAvgSec = 30s, targetAvgMin = 0.5min.
    const targetAvgSec = isFinite(targetQty) && targetQty > 0 ? 3600 / targetQty : NaN;
    const targetAvgMin = isFinite(targetQty) && targetQty > 0 ? 60 / targetQty : NaN;

    const specs = [
        { id: `resEffPerc_${d}`, target: targetEff,    betterIfLess: false },
        { id: `resEffPcs_${d}`,  target: targetQty,    betterIfLess: false },
        { id: `resAvgSec_${d}`,  target: targetAvgSec, betterIfLess: true  },
        { id: `resAvgMin_${d}`,  target: targetAvgMin, betterIfLess: true  },
    ];

    specs.forEach(({ id, target, betterIfLess }) => {
        const el = document.getElementById(id);
        if (!el) return;
        const raw = (el.value || '').replace('%', '').trim();
        const v = parseFloat(raw);
        if (raw === '' || !isFinite(v) || !isFinite(target)) {
            el.classList.remove('text-success', 'text-danger');
            return;
        }
        const isBetter = betterIfLess ? v < target : v > target;
        const isWorse  = betterIfLess ? v > target : v < target;
        el.classList.toggle('text-success', isBetter);
        el.classList.toggle('text-danger', isWorse);
    });
}

// ==================== Manual Calculation ====================
function manualCalculate(d) {
    const sam = parseFloat(document.getElementById('globalSam').value) || 0;
    const avgSec = parseFloat(document.getElementById(`resAvgSec_${d}`).value) || 0;
    const passRaw = document.getElementById(`qPass_${d}`).value;
    const failRaw = document.getElementById(`qFail_${d}`).value;
    const pass = parseFloat(passRaw) || 0;
    const fail = parseFloat(failRaw) || 0;

    if (avgSec > 0) {
        const avgMin = avgSec / 60;
        document.getElementById(`resAvgMin_${d}`).value = avgMin.toFixed(2);
        if (sam > 0) {
            document.getElementById(`resEffPerc_${d}`).value = ((sam / avgMin) * 100).toFixed(1) + "%";
            document.getElementById(`resEffPcs_${d}`).value = (60 / avgMin).toFixed(1);
        }
    }

    // อัตราผ่านจะคำนวณได้ก็ต่อเมื่อกรอกทั้ง "ผ่าน" และ "ไม่ผ่าน" ครบทั้งสองช่อง
    const bothEntered = passRaw !== "" && failRaw !== "";
    if (bothEntered && (pass + fail) > 0) {
        const qRate = Math.ceil((pass / (pass + fail)) * 100);
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
    // เช็คจาก resAvgSec (ค่านี้ถูกเซตทันทีที่กด Save)
    // ไม่ใช้ resEffPerc เพราะจะเซตก็ต่อเมื่อ SAM ถูกกรอกด้วย
    let lastDayWithData = 0;
    for (let d = 1; d <= getRowCount(); d++) {
        if (document.getElementById(`resAvgSec_${d}`).value !== "") {
            lastDayWithData = d;
        }
    }
    const max = getRowCount() || 1;
    let nextDay = lastDayWithData + 1;
    if (nextDay > max) nextDay = max;
    document.getElementById('targetDay').value = nextDay;
}

// ==================== Modal Functions ====================
let currentInputType = null; // ค่าจะเป็น 'sec', 'pass', หรือ 'fail'

// 2. ปรับฟังก์ชันเปิดให้รับ "ประเภทช่อง" เพิ่มเข้ามา
function openManualModal(day, type = 'sec') {
    if (isRowLocked(day)) return;   // sequential unlock — earlier rows must be filled first
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
    if (isRowLocked(day)) return;
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
    if (isRowLocked(day)) return;
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
window.onCurveModelChartChange = onCurveModelChartChange;
window.onCurveModelMainChange = onCurveModelMainChange;
window.showCurveHint = showCurveHint;
window.hideCurveHint = hideCurveHint;
window.calculateAdaptiveGoals = calculateAdaptiveGoals;
window.syncSam = syncSam;
window.onTrainingUnitChange = onTrainingUnitChange;
window.onTrainingDaysChange = onTrainingDaysChange;
window.onChartParamChange = onChartParamChange;
window.openQuickEntryModal = openQuickEntryModal;
window.deleteRowData = deleteRowData;
window.closeQuickEntryModal = closeQuickEntryModal;
window.saveQuickEntry = saveQuickEntry;
window.deleteQuickEntry = deleteQuickEntry;
window.toggleChartLabels = toggleChartLabels;
window.toggleChartUnit = toggleChartUnit;
window.toggleFixedPlan = toggleFixedPlan;
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
// กด ESC ปิด modal — ปิดเฉพาะตัวที่อยู่บนสุด (child modal ก่อน parent เสมอ)
document.addEventListener('keydown', function(event) {
    if (event.key !== 'Escape' && event.key !== 'Esc') return;

    // ลำดับ priority — child modal อยู่บนสุด ปิดก่อน แล้ว return ทันที
    const notifModal = document.getElementById('notificationModal');
    if (notifModal && notifModal.style.display === 'block') {
        closeNotifModal();
        return;
    }

    const signModal = document.getElementById('signModal');
    if (signModal && signModal.style.display === 'block') {
        closeSignPad();
        return;
    }

    const manualModal = document.getElementById('manualInputModal');
    if (manualModal && manualModal.style.display === 'block') {
        closeManualModal();
        return;
    }

    const actionPlanModal = document.getElementById('actionPlanModal');
    if (actionPlanModal && actionPlanModal.style.display === 'block') {
        closeActionPlanModal();
        return;
    }

    const quickEntryModal = document.getElementById('quickEntryModal');
    if (quickEntryModal && quickEntryModal.style.display === 'block') {
        closeQuickEntryModal();
        return;
    }

    // สุดท้าย — parent modal (กราฟ)
    const chartModal = document.getElementById('chartModal');
    if (chartModal && chartModal.style.display === 'block') {
        chartModal.style.display = 'none';
        return;
    }
});