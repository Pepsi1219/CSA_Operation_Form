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
        lblTrainer: "ครูฝึก / ประเภท",
        phTrainerName: "ชื่อครูฝึก",
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
        btnForcePlanOff: "สร้างแผนทันที (ข้าม Q100)",
        btnForcePlanOn: "โหมดสร้างแผนทันทีเปิดอยู่",
        btnForcePlanTitle: "สร้างแผนทันทีโดยไม่ต้องรอ Pass Rate = 100%",
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
        lblTrainer: "Trainer / Type",
        phTrainerName: "Trainer name",
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
        btnForcePlanOff: "Force plan (skip Q100)",
        btnForcePlanOn: "Force plan is ON",
        btnForcePlanTitle: "Generate plan immediately without waiting for Pass Rate = 100%",
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
        lblTrainer: "Huấn luyện viên / Loại",
        phTrainerName: "Tên huấn luyện viên",
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
        btnForcePlanOff: "Tạo kế hoạch ngay (bỏ qua Q100)",
        btnForcePlanOn: "Chế độ tạo kế hoạch ngay đang bật",
        btnForcePlanTitle: "Tạo kế hoạch ngay không cần chờ Pass Rate = 100%",
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
        lblTrainer: "ຄູຝຶກ / ປະເພດ",
        phTrainerName: "ຊື່ຄູຝຶກ",
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
        btnForcePlanOff: "ສ້າງແຜນທັນທີ (ຂ້າມ Q100)",
        btnForcePlanOn: "ໂໝດສ້າງແຜນທັນທີເປີດຢູ່",
        btnForcePlanTitle: "ສ້າງແຜນທັນທີໂດຍບໍ່ຕ້ອງລໍ Pass Rate = 100%",
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
    // Refresh dynamic toggle labels that depend on current on/off state
    if (typeof updateToggleFixedPlanBtn === 'function') updateToggleFixedPlanBtn();
    if (typeof updateToggleUnitBtn === 'function') updateToggleUnitBtn();
    if (typeof updateToggleLabelsBtn === 'function') updateToggleLabelsBtn();
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
    updateToggleFixedPlanBtn();

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
    const base = (!Number.isFinite(n) || n <= 0) ? DEFAULT_ROW_COUNT : n;
    // QCO: trainingDays = "N วันหลังจากผลจริงล่าสุด" → ตารางต้องขยายเป็น anchor + N
    // CSA: trainingDays = ระยะเวลารวมทั้งหมด → ตารางเท่ากับ N (เดิม)
    let target = base;
    if (document.getElementById('trainerType')?.value === 'QCO') {
        target = findLastActualDay() + base;
    }
    return Math.max(MIN_ROW_COUNT, Math.min(MAX_ROW_COUNT, target));
}

// ลาสต์ที่แถวมีข้อมูลจริงครบ (avgSec + pass + fail); 0 = ยังไม่มีผลใดๆ
function findLastActualDay() {
    let last = 0;
    for (let d = 1; d <= getRowCount(); d++) {
        if (isRowFilled(d)) last = d;
    }
    return last;
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
            // QCO: anchor อาจถอย (แถวผลจริงล่าสุดถูกลบ) — ปรับตารางตาม
            const desired = getTargetRowCount();
            if (desired !== getRowCount()) resizeTable(desired);

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

// ==================== Force Plan Mode (ผูกกับประเภทครูฝึก) ====================
// ปกติแผนจะสร้างหลังจากมีแถวที่ Pass Rate = 100% (Q100) แล้วเท่านั้น
// กรณีพิเศษ: ครูฝึกประเภท "QCO" — พอมีข้อมูลแถวแรก (avgSec+pass+fail) ระบบจะข้าม gate นั้น
// อัตโนมัติ ใช้แถวแรกเป็น anchor แล้ววาดแผนจาก actual → globalEff จนจบ trainingDays
// (ครูฝึกประเภท "CSA" ทำงานเหมือนเดิม — รอ Q100)
let _forcePlanMode = false;

function computeForcePlanMode() {
    const type = document.getElementById('trainerType')?.value || '';
    if (type !== 'QCO') return false;
    // เปิด force เฉพาะเมื่อแถวแรกมีข้อมูลครบ (avgSec + pass + fail)
    return isRowFilled(1);
}

function onTrainerTypeChange() {
    _forcePlanMode = computeForcePlanMode();
    // QCO เปลี่ยนความหมายของ trainingDays → ตารางอาจต้องขยาย/หด
    // resizeTable จะเรียก calculateAdaptiveGoals ให้เอง; ถ้าไม่ต้อง resize ค่อย recalc ตรง
    const desired = getTargetRowCount();
    if (desired !== getRowCount()) {
        resizeTable(desired);
    } else {
        calculateAdaptiveGoals();
    }
    saveStateToStorage();
    if (document.getElementById('chartModal')?.style.display === 'block') {
        showPerformanceChart(true);
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
    // Derive force plan mode from trainer type + row-1 completeness
    // (QCO trainer + first row filled → skip Q100 gate automatically)
    _forcePlanMode = computeForcePlanMode();

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

    let lastActualEff = 0, lastActualDay = 0;
    for (let d = 1; d <= getRowCount(); d++) {
        let effStr = document.getElementById(`resEffPerc_${d}`).value;
        if (effStr && effStr !== "") {
            lastActualEff = parseFloat(effStr);
            lastActualDay = d;
        }
    }

    // อัปเดตคอลัมน์ วัน/ชั่วโมง
    // CSA (ปกติ): เริ่มนับ 1 ที่แถวถัดจาก Q100 แถวแรก
    // QCO (force): เริ่มนับ 1 ที่แถวถัดจาก anchor (แถวผลจริงล่าสุด)
    for (let d = 1; d <= getRowCount(); d++) {
        const dayCell = document.getElementById(`dayCell_${d}`);
        if (!dayCell) continue;
        if (firstDayQ100 > 0 && d > firstDayQ100) {
            dayCell.textContent = (d - firstDayQ100);
        } else if (_forcePlanMode && firstDayQ100 === 0 && d > lastActualDay) {
            dayCell.textContent = (d - lastActualDay);
        } else {
            dayCell.textContent = "";
        }
    }

    // เลือก anchor ตามโหมด:
    // - Fixed Plan (ON) + มี Q100 → anchor คือวัน Q100 แรก + eff วันนั้น (แผนล็อค)
    // - นอกนั้น (Adaptive default หรือ Force Plan) → anchor คือแถวล่าสุดที่บันทึกผล
    //   ถ้ายังไม่มีผลจริงเลย → (0, 0) ทำให้แผนวาดจากศูนย์ → globalEff
    //   ถ้ามีผลจริงแล้ว → แผนจะเริ่มจากแถว "ถัดไป" (row ที่ยังว่าง)
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
            // ยกเว้น Force Plan: เคลียร์ target บนแถวที่มีผลจริงแล้ว
            // (target 1% ที่ค้างจากตอน anchor ยังเป็น 0 ต้องล้างทิ้ง)
            if (_forcePlanMode && firstDayQ100 === 0) {
                targetInput.value = "";
                targetQtyInput.value = "";
            }
        } else {
            let targetValue = 0;
            let showTarget = false;

            const curveModel = document.getElementById('curveModel')?.value || '';
            // ปกติต้องมี Q100 ก่อนแผนถึงจะขึ้น; ถ้าเปิด Force Plan (QCO) → ข้าม gate นั้น
            const effectiveQ100 = firstDayQ100 > 0 ? firstDayQ100 : 0;
            const planGateOpen = firstDayQ100 > 0 || _forcePlanMode;
            // QCO (force): trainingDays = จำนวนวัน "หลัง" anchor → เพดานแผน = anchor + trainDays
            // CSA: trainingDays = ระยะรวมทั้งหมด → เพดานแผน = trainDays (เดิม)
            const planUpperBound = _forcePlanMode ? (anchorDay + trainDays) : trainDays;
            if (curveModel && planGateOpen && d > effectiveQ100 && d <= planUpperBound) {
                showTarget = true;

                // QCO: remainingDays = trainDays เต็ม (นับใหม่จากศูนย์)
                // CSA: remainingDays = trainDays − anchorDay (แชร์เพดานเดิม)
                const remainingDays = _forcePlanMode ? trainDays : (trainDays - anchorDay);
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

    // QCO: จำนวนแถวขึ้นกับ anchor (แถวผลจริงล่าสุด) — anchor เพิ่งขยับ จึงต้อง sync ตาราง
    // เรียก resize เฉพาะจุดที่ข้อมูลลงจริงแล้ว (ไม่ใช่ระหว่าง user พิมพ์ trainingDays)
    const desired = getTargetRowCount();
    if (desired !== getRowCount()) resizeTable(desired);
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
window.onTrainerTypeChange = onTrainerTypeChange;
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

// ==================== Zoom Prevention ====================
// iOS Safari ignores viewport `user-scalable=no`, so we also block the
// gesture events at the JS layer. Covers pinch-to-zoom, double-tap zoom,
// and Ctrl/⌘ + wheel/plus/minus keyboard zoom on desktop browsers.
(function preventZoom() {
    // iOS gesture events (pinch)
    ['gesturestart', 'gesturechange', 'gestureend'].forEach(ev => {
        document.addEventListener(ev, e => e.preventDefault(), { passive: false });
    });

    // Multi-touch pinch on touch devices that don't fire gesture events
    document.addEventListener('touchmove', (e) => {
        if (e.touches && e.touches.length > 1) e.preventDefault();
    }, { passive: false });

    // Double-tap zoom is handled by CSS `touch-action:manipulation` on body +
    // interactive elements. No JS touchend swallow needed here — that approach
    // was flaky (ate rapid legit taps like number-stepper +/- clicks).

    // Ctrl/⌘ + wheel zoom (desktop)
    window.addEventListener('wheel', (e) => {
        if (e.ctrlKey || e.metaKey) e.preventDefault();
    }, { passive: false });

    // Ctrl/⌘ + (+ / − / 0) keyboard zoom (desktop)
    window.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && ['+', '-', '=', '0'].includes(e.key)) {
            e.preventDefault();
        }
    });
})();

// ==================== Formula Help Modal ====================
// Click a labeled field / column header (.formula-help[data-formula="…"]) to
// open a modal that explains the calculation. Uses KaTeX (already loaded from
// the CDN in <head>) for the math, and falls back to plain text if KaTeX
// somehow didn't finish loading. Content is Thai-primary — matches app default.
(function initFormulaHelp() {
    // ── Shared bits reused across all curve-detail entries ───────────────────
    // Target formula is the same shape regardless of curve — only progress(d)
    // changes — so we prepend it to each curve modal's formulas array.
    const TARGET_FORMULA = {
        tex: 'Target_d \\;=\\; anchor \\;+\\; (Eff_{\\text{target}} - anchor) \\times progress(d)',
        note: 'สูตรหลักเหมือนกันทุกรูปแบบ curve — ต่างกันแค่ progress(d) ด้านล่าง'
    };
    const ANCHOR_SECTION = {
        title: 'anchor คืออะไร?',
        html:
            '<b>anchor = จุดตั้งต้นของแผน</b> — ค่า Eff% "จริง" ในวันแรกที่พนักงานทำงานได้ Pass Rate = <code>100%</code> (ไม่มีของเสีย).<br><br>' +
            '<b>ตรรกะ:</b> ก่อนฝึก<b>ความเร็ว</b> พนักงานต้องทำ<b>คุณภาพ</b>ให้ได้ก่อน — ผลิตช้าๆ แต่ห้ามมีของเสีย. วันแรกที่ทำสำเร็จ = "พร้อมฝึกความเร็วแล้ว" ระบบใช้ Eff% วันนั้นเป็นจุดเริ่ม แล้วไล่ขึ้นไปหา Eff เป้าหมายรวม ตาม curve ที่เลือก.<br><br>' +
            '<b>ตัวอย่าง:</b> วันที่ 1 Eff 15% Pass 80% ❌ · วันที่ 2 Eff 22% Pass 95% ❌ · <b>วันที่ 3 Eff 30% Pass 100% ✓</b> → <b>anchor = 30%, anchorDay = 3</b>'
    };

    // ── Formula library ──────────────────────────────────────────────────────
    // Each entry:  { title, desc, formulas:[{tex, note?}], sections?, example?, picker? }
    const LIB = {
        sam: {
            title: 'SAM (Standard Allowed Minutes)',
            desc:  'SAM คือเวลามาตรฐานที่ควรใช้ในการผลิตงาน 1 ชิ้น (หน่วยนาที). ช่อง "นาที" กับ "วินาที" ซิงก์กันอัตโนมัติ — กรอกช่องไหนอีกช่องจะแปลงให้ทันที.',
            formulas: [
                { tex: 'SAM_{\\text{sec}} = SAM_{\\text{min}} \\times 60' },
                { tex: 'SAM_{\\text{min}} = SAM_{\\text{sec}} \\div 60' }
            ],
            example: 'ถ้า SAM = <code>0.5</code> นาที → <code>0.5 × 60 = 30</code> วินาที'
        },
        globalTarget: {
            title: 'เป้าหมาย Q\'ty (ชิ้น/ชม.)',
            desc:  'Q\'ty เป้าหมายคำนวณอัตโนมัติจาก SAM และ Eff เป้าหมาย ผลลัพธ์คือ "จำนวนชิ้นที่ต้องผลิตให้ได้ต่อชั่วโมง" (ปัดขึ้น).',
            formulas: [
                { tex: "Q'ty_{\\text{target}} \\;=\\; \\left\\lceil \\dfrac{60}{SAM_{\\text{min}}} \\times \\dfrac{Eff\\%}{100} \\right\\rceil",
                  note: '60 = จำนวนนาทีต่อชั่วโมง · ⌈ ⌉ = ปัดขึ้น' }
            ],
            example: 'SAM = <code>0.5</code> นาที, Eff = <code>80%</code> → ⌈ (60 ÷ 0.5) × 0.80 ⌉ = ⌈<code>96</code>⌉ = <code>96 pcs/hr</code>'
        },
        // Target(%) routes to a curve-specific modal via the click handler;
        // no standalone `targetPct` entry needed.
        // ── Learning Curve models — one modal per curve ──────────────────────
        curveScurve: {
            curveKey: 'scurve',
            title: 'S-Curve (Smoothstep)',
            desc:  'การเรียนรู้เพิ่มช้าในช่วงต้น เร่งขึ้นตรงกลาง แล้วชะลอลงเมื่อเข้าใกล้เป้า — ให้กราฟรูปตัว "S". เหมาะกับพนักงานที่ต้องใช้เวลาปรับตัวก่อน แล้วเรียนรู้เร็วในช่วงกลาง.',
            formulas: [
                { tex: 'progress(x) \\;=\\; 3t^{2} - 2t^{3}, \\quad t = \\dfrac{x}{N}',
                  note: 'Hermite smoothstep — เส้นโค้งเรียบ ไม่มีจุดหักงอ' }
            ],
            sections: [
                { title: 'ลักษณะการเติบโต', html:
                    '<ul style="margin:0;padding-left:18px;line-height:1.7">' +
                    '<li><b>ช่วงต้น (t=0–0.3)</b> เพิ่มช้า — พนักงานกำลังปรับตัว จับหลัก</li>' +
                    '<li><b>ช่วงกลาง (t=0.3–0.7)</b> เพิ่มเร็ว — เข้าจังหวะแล้ว พัฒนาก้าวกระโดด</li>' +
                    '<li><b>ช่วงปลาย (t=0.7–1.0)</b> ชะลอลง — ใกล้เพดานความสามารถ</li>' +
                    '</ul>' },
                { title: 'เหมาะกับงาน', html: 'งานประกอบซับซ้อน · งานฝีมือหลายจังหวะ · พนักงานใหม่ที่ยังไม่มีพื้นฐาน' },
                { title: 'ตัวอย่างตัวเลข', html:
                    'anchor = <code>40%</code>, target = <code>80%</code>, N = <code>10</code> วัน<br>' +
                    '• วันที่ 2 (t=0.2): progress = <code>0.104</code> → Target = <code>44.2%</code><br>' +
                    '• วันที่ 5 (t=0.5): progress = <code>0.500</code> → Target = <code>60.0%</code><br>' +
                    '• วันที่ 8 (t=0.8): progress = <code>0.896</code> → Target = <code>75.8%</code>' }
            ]
        },
        curveLog: {
            curveKey: 'log',
            title: 'Logarithmic (เรียนรู้เร็วช่วงต้น)',
            desc:  'เพิ่มขึ้นเร็วมากในช่วงต้น (ก้าวหน้าแบบก้าวกระโดดตั้งแต่วันแรกๆ) แล้วชะลอตัวลงเรื่อยๆ เข้าใกล้เป้าอย่างช้าๆ ในช่วงปลาย. โดยประมาณ 50% ของความก้าวหน้าทั้งหมดเกิดขึ้นใน ~30% แรกของเวลาฝึก.',
            formulas: [
                { tex: 'progress(x) \\;=\\; \\dfrac{\\ln(x+1)}{\\ln(N+1)}',
                  note: 'ln = natural logarithm · +1 กันไม่ให้ ln(0)' }
            ],
            sections: [
                { title: 'ลักษณะการเติบโต', html:
                    '<ul style="margin:0;padding-left:18px;line-height:1.7">' +
                    '<li>วันแรกๆ เพิ่มก้าวกระโดด — เห็นผลชัดเจน สร้างขวัญกำลังใจ</li>' +
                    '<li>ช่วงปลายเพิ่มช้าๆ — ต้องอดทนกับการปรับจูนเล็กๆ</li>' +
                    '</ul>' },
                { title: 'เหมาะกับงาน', html: 'งานที่พึ่งพาการจดจำหลัก/ทำซ้ำ · พนักงานเก่าที่มีพื้นฐานดีเปลี่ยนงาน · งานที่ "จับหลักได้แล้วทำได้เร็ว"' },
                { title: 'ตัวอย่างตัวเลข', html:
                    'anchor = <code>40%</code>, target = <code>80%</code>, N = <code>10</code> วัน<br>' +
                    '• วันที่ 1: progress = ln(2)/ln(11) ≈ <code>0.289</code> → Target = <code>51.6%</code><br>' +
                    '• วันที่ 3: progress = ln(4)/ln(11) ≈ <code>0.578</code> → Target = <code>63.1%</code><br>' +
                    '• วันที่ 7: progress = ln(8)/ln(11) ≈ <code>0.867</code> → Target = <code>74.7%</code>' }
            ]
        },
        curvePower: {
            curveKey: 'power',
            title: 'Power (Wright\'s Law)',
            desc:  'อ้างอิงจาก Wright\'s Law (T.P. Wright, 1936) — กฎที่ระบุว่าเวลาผลิตต่อชิ้นลดลงตามอัตราคงที่ทุกครั้งที่ผลผลิตสะสมเพิ่มเป็นสองเท่า. รูปทรงคล้าย Log แต่ชะลอตัวไม่รุนแรงเท่า — ยังคงมีการปรับปรุงต่อเนื่องแม้ในช่วงหลัง.',
            formulas: [
                { tex: 'progress(x) \\;=\\; \\sqrt{\\dfrac{x}{N}}',
                  note: 'รากที่ 2 เทียบเท่า Wright\'s Law ที่ค่า learning rate b = 0.5 (คลาสสิก 85% learning curve)' }
            ],
            sections: [
                { title: 'ลักษณะการเติบโต', html:
                    '<ul style="margin:0;padding-left:18px;line-height:1.7">' +
                    '<li>เพิ่มเร็วช่วงต้น (แต่ไม่รุนแรงเท่า Log)</li>' +
                    '<li>ช่วงปลายยังปรับปรุงต่อเนื่อง ไม่ราบจนแบน</li>' +
                    '</ul>' },
                { title: 'เหมาะกับงาน', html: 'งานเย็บหลายสเต็ป · งานที่ต้องใช้กล้ามเนื้อจำ (motor memory) · การพัฒนาความเร็วต่อเนื่องระยะยาว' },
                { title: 'ตัวอย่างตัวเลข', html:
                    'anchor = <code>40%</code>, target = <code>80%</code>, N = <code>10</code> วัน<br>' +
                    '• วันที่ 1: progress = √0.1 ≈ <code>0.316</code> → Target = <code>52.6%</code><br>' +
                    '• วันที่ 4: progress = √0.4 ≈ <code>0.632</code> → Target = <code>65.3%</code><br>' +
                    '• วันที่ 9: progress = √0.9 ≈ <code>0.949</code> → Target = <code>77.9%</code>' }
            ]
        },
        curveLinear: {
            curveKey: 'linear',
            title: 'Linear (เพิ่มขึ้นสม่ำเสมอ)',
            desc:  'เพิ่มขึ้นในอัตราคงที่ทุกวัน — ทุกวันก้าวหน้าเท่ากัน เข้าใจง่ายที่สุด แต่มักไม่ตรงกับพฤติกรรมการเรียนรู้จริง.',
            formulas: [
                { tex: 'progress(x) \\;=\\; \\dfrac{x}{N}' }
            ],
            sections: [
                { title: 'ลักษณะการเติบโต', html:
                    '<ul style="margin:0;padding-left:18px;line-height:1.7">' +
                    '<li>Slope คงที่ — คำนวณด้วยหัวได้ทันที</li>' +
                    '<li>ไม่สะท้อนความจริงของการเรียนรู้ (ปกติเริ่มเร็วแล้วชะลอ หรือกลับกัน)</li>' +
                    '</ul>' },
                { title: 'เหมาะกับงาน', html: 'ใช้เป็น <b>baseline</b> อย่างง่าย · เมื่อไม่มีข้อมูลรูปแบบการเรียนรู้เฉพาะ · งานที่คาดว่าพัฒนาสม่ำเสมอ' },
                { title: 'ตัวอย่างตัวเลข', html:
                    'anchor = <code>40%</code>, target = <code>80%</code>, N = <code>10</code> วัน<br>' +
                    '• วันที่ 3: progress = <code>0.30</code> → Target = <code>52.0%</code><br>' +
                    '• วันที่ 7: progress = <code>0.70</code> → Target = <code>68.0%</code>' }
            ]
        },
        curvePicker: {
            title: 'รูปแบบแผนการฝึก (Learning Curve)',
            desc:  'คลิกเลือกรูปแบบเพื่ออ่านรายละเอียด — แต่ละแบบเหมาะกับงานคนละประเภท',
            picker: [
                { key: 'curveScurve', label: 'S-Curve',        tag: 'ช้า → เร็ว → ช้า',        use: 'งานฝีมือซับซ้อน · พนักงานใหม่' },
                { key: 'curveLog',    label: 'Logarithmic',    tag: 'เร็วช่วงต้น',              use: 'จับหลักได้เร็ว · พนักงานเก่า' },
                { key: 'curvePower',  label: 'Power (Wright)', tag: 'ปรับปรุงต่อเนื่อง',        use: 'งานเย็บหลายสเต็ป · motor memory' },
                { key: 'curveLinear', label: 'Linear',         tag: 'สม่ำเสมอ',                use: 'baseline · พัฒนาคงที่' }
            ]
        },
        targetQty: {
            title: 'เป้าหมาย Q\'ty (ชิ้น) รายวัน',
            desc:  'แปลงเป้าหมาย Eff (%) ของแถวเป็น "ชิ้น/ชั่วโมง" โดยใช้ SAM.',
            formulas: [
                { tex: "Target_{\\text{pcs}} \\;=\\; \\dfrac{60}{SAM_{\\text{min}}} \\times \\dfrac{Target_\\%}{100}" }
            ],
            example: 'SAM = <code>0.5</code>, Target% = <code>80</code> → (60 ÷ 0.5) × 0.80 = <code>96 pcs/hr</code>'
        },
        avgSec: {
            title: 'เวลาเฉลี่ย (วินาที)',
            desc:  'เวลาเฉลี่ยที่พนักงานใช้ผลิตงาน 1 ชิ้น (จับด้วย Timer หรือกรอกเอง) หน่วยวินาที เป็น input หลักที่ใช้คำนวณ Cycle Time, Eff (%) และ Eff (ชิ้น) ทั้งหมด.',
            formulas: [
                { tex: 'AvgTime_{\\text{min}} = \\dfrac{AvgTime_{\\text{sec}}}{60}' }
            ],
            example: 'ถ้าจับเวลาได้ <code>30</code> วินาที → <code>30 ÷ 60 = 0.5</code> นาที'
        },
        cycleMin: {
            title: 'เวลาต่อรอบ (นาที) — Cycle Time',
            desc:  'เวลาต่อรอบ = เวลาเฉลี่ยที่ใช้ทำงาน 1 ชิ้น หน่วยนาที (แปลงตรงจาก Avg Time วินาที).',
            formulas: [
                { tex: 'CycleTime_{\\text{min}} = \\dfrac{AvgTime_{\\text{sec}}}{60}' }
            ],
            example: '<code>30</code> วินาที → <code>0.50</code> นาที · <code>45</code> วินาที → <code>0.75</code> นาที'
        },
        effPct: {
            title: 'ประสิทธิภาพ Eff (%)',
            desc:  'อัตราส่วนของ "เวลามาตรฐาน (SAM)" ต่อ "เวลาที่ทำจริง" — ยิ่งใช้เวลาน้อยกว่ามาตรฐาน Eff% ยิ่งสูง (เกิน 100% ได้ = เร็วกว่ามาตรฐาน).',
            formulas: [
                { tex: 'Eff\\% \\;=\\; \\dfrac{SAM_{\\text{min}}}{AvgTime_{\\text{min}}} \\times 100' },
                { tex: '\\;=\\; \\dfrac{SAM_{\\text{sec}}}{AvgTime_{\\text{sec}}} \\times 100' }
            ],
            example: 'SAM = <code>0.5</code> นาที, AvgTime = <code>0.4</code> นาที → (0.5 ÷ 0.4) × 100 = <code>125%</code>'
        },
        effPcs: {
            title: 'ประสิทธิภาพ Eff (ชิ้น/ชั่วโมง)',
            desc:  'จำนวนชิ้นที่ผลิตได้จริงต่อชั่วโมง คำนวณจากเวลาเฉลี่ยที่ใช้จริง (ไม่เกี่ยวกับ SAM).',
            formulas: [
                { tex: 'Eff_{\\text{pcs}} \\;=\\; \\dfrac{60}{AvgTime_{\\text{min}}} \\;=\\; \\dfrac{3600}{AvgTime_{\\text{sec}}}' }
            ],
            example: 'AvgTime = <code>30</code> วินาที → 3600 ÷ 30 = <code>120 pcs/hr</code>'
        },
        passRate: {
            title: 'อัตราผ่าน (Pass Rate %)',
            desc:  'สัดส่วนของงานที่ผ่านการตรวจคุณภาพ เทียบกับงานทั้งหมดที่ตรวจ (ผ่าน + ไม่ผ่าน). ระบบจะคำนวณเมื่อกรอก "ผ่าน" และ "ไม่ผ่าน" ครบทั้งสองช่อง.',
            formulas: [
                { tex: "PassRate\\% \\;=\\; \\left\\lceil \\dfrac{Pass}{Pass + Fail} \\times 100 \\right\\rceil",
                  note: '⌈ ⌉ = ปัดขึ้น' }
            ],
            example: 'ผ่าน = <code>47</code>, ไม่ผ่าน = <code>3</code> → ⌈ 47 ÷ 50 × 100 ⌉ = ⌈94⌉ = <code>94%</code>'
        }
    };

    // Curve-detail modals share the Target formula (as leading formula) and
    // the anchor explanation (as trailing section) — inject once here so each
    // curve entry stays focused on its own progress() math.
    ['curveScurve', 'curveLog', 'curvePower', 'curveLinear'].forEach(k => {
        LIB[k].formulas = [TARGET_FORMULA, ...LIB[k].formulas];
        LIB[k].sections = [...(LIB[k].sections || []), ANCHOR_SECTION];
    });

    let modal, titleEl, descEl, bodyEl;

    // ── Build modal DOM ──────────────────────────────────────────────────────
    function buildModal() {
        modal = document.createElement('div');
        modal.id = 'formulaModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close" aria-label="ปิด">&times;</span>
                <h3 class="formula-modal-title"></h3>
                <p class="formula-modal-sub"></p>
                <div class="formula-modal-body"></div>
            </div>
        `;
        document.body.appendChild(modal);
        titleEl = modal.querySelector('.formula-modal-title');
        descEl  = modal.querySelector('.formula-modal-sub');
        bodyEl  = modal.querySelector('.formula-modal-body');

        modal.querySelector('.close').addEventListener('click', close);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) close();
        });
    }

    // ── Inline SVG curve preview ─────────────────────────────────────────────
    // Renders the shape of a learning curve on a small chart so the user can
    // SEE how each curve behaves. Uses anchor=40, target=80, N=10 to match the
    // numeric example already shown in the modal, and overlays a light dashed
    // linear reference so growth character is obvious.
    const CURVE_FNS = {
        scurve: t => 3 * t * t - 2 * t * t * t,
        log:    t => Math.log(t * 10 + 1) / Math.log(11),
        power:  t => Math.sqrt(t),
        linear: t => t
    };
    const CURVE_COLORS = {
        scurve: '#7c3aed',
        log:    '#0891b2',
        power:  '#ea580c',
        linear: '#059669'
    };

    function buildCurveChartSVG(curveKey) {
        const fn = CURVE_FNS[curveKey];
        const color = CURVE_COLORS[curveKey] || '#18181b';
        if (!fn) return '';

        const N = 10, anchor = 40, target = 80;
        const W = 520, H = 220;
        const pL = 44, pR = 14, pT = 14, pB = 32;
        const w = W - pL - pR;
        const h = H - pT - pB;
        const sx = day => pL + (day / N) * w;
        const sy = eff => pT + h - (eff / 100) * h;

        // Curve path — sampled at 60 points for smoothness
        let curvePath = '';
        for (let i = 0; i <= 60; i++) {
            const t = i / 60;
            const y = anchor + (target - anchor) * fn(t);
            curvePath += (i === 0 ? 'M ' : 'L ') + sx(t * N).toFixed(1) + ' ' + sy(y).toFixed(1) + ' ';
        }
        const linearPath = `M ${sx(0)} ${sy(anchor)} L ${sx(N)} ${sy(target)}`;

        const gridYs = [0, 25, 50, 75, 100];
        const xTicks = [0, 2, 5, 8, 10];

        return `
        <svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img"
             aria-label="ตัวอย่างรูปทรง curve" preserveAspectRatio="xMidYMid meet">
          <!-- grid -->
          <g stroke="currentColor" stroke-opacity="0.08">
            ${gridYs.map(v => `<line x1="${pL}" x2="${W-pR}" y1="${sy(v)}" y2="${sy(v)}"/>`).join('')}
          </g>
          <!-- Y tick labels -->
          <g font-size="10" fill="currentColor" fill-opacity="0.55" text-anchor="end" font-family="var(--mono, monospace)">
            ${gridYs.map(v => `<text x="${pL-6}" y="${sy(v)+3}">${v}</text>`).join('')}
          </g>
          <!-- anchor + target reference lines -->
          <line x1="${pL}" x2="${W-pR}" y1="${sy(anchor)}" y2="${sy(anchor)}"
                stroke="currentColor" stroke-opacity="0.35" stroke-dasharray="3 3"/>
          <line x1="${pL}" x2="${W-pR}" y1="${sy(target)}" y2="${sy(target)}"
                stroke="currentColor" stroke-opacity="0.35" stroke-dasharray="3 3"/>
          <text x="${W-pR-4}" y="${sy(anchor)-4}" font-size="10" text-anchor="end"
                fill="currentColor" fill-opacity="0.65">anchor 40%</text>
          <text x="${W-pR-4}" y="${sy(target)-4}" font-size="10" text-anchor="end"
                fill="currentColor" fill-opacity="0.65">target 80%</text>
          <!-- Linear reference (skip when the curve IS linear) -->
          ${curveKey !== 'linear'
              ? `<path d="${linearPath}" stroke="currentColor" stroke-opacity="0.22"
                       stroke-width="1.5" stroke-dasharray="5 4" fill="none"/>`
              : ''}
          <!-- Main curve -->
          <path d="${curvePath}" stroke="${color}" stroke-width="2.5" fill="none"
                stroke-linecap="round" stroke-linejoin="round"/>
          <!-- endpoint dots -->
          <circle cx="${sx(0)}" cy="${sy(anchor)}" r="3.5" fill="${color}"/>
          <circle cx="${sx(N)}" cy="${sy(target)}" r="3.5" fill="${color}"/>
          <!-- X ticks -->
          <g font-size="10" fill="currentColor" fill-opacity="0.55" text-anchor="middle" font-family="var(--mono, monospace)">
            ${xTicks.map(v => `<text x="${sx(v)}" y="${H-pB+14}">${v}</text>`).join('')}
          </g>
          <!-- axis titles -->
          <text x="${pL + w/2}" y="${H-4}" font-size="10.5" text-anchor="middle"
                fill="currentColor" fill-opacity="0.6">วัน (0 → N=10)</text>
          <text x="12" y="${pT + h/2}" font-size="10.5" text-anchor="middle"
                transform="rotate(-90 12 ${pT + h/2})"
                fill="currentColor" fill-opacity="0.6">Eff (%)</text>
          <!-- legend -->
          ${curveKey !== 'linear' ? `
          <g transform="translate(${pL+8}, ${pT+8})" font-size="10" fill="currentColor" fill-opacity="0.7">
            <line x1="0" y1="6" x2="20" y2="6" stroke="${color}" stroke-width="2.5"/>
            <text x="24" y="9">${curveKey}</text>
            <line x1="70" y1="6" x2="90" y2="6" stroke="currentColor" stroke-opacity="0.35" stroke-dasharray="5 4" stroke-width="1.5"/>
            <text x="94" y="9">linear (อ้างอิง)</text>
          </g>` : ''}
        </svg>`;
    }

    function renderTex(container, tex) {
        if (window.katex && typeof window.katex.render === 'function') {
            try {
                window.katex.render(tex, container, { displayMode: true, throwOnError: false });
                return;
            } catch (_) { /* fall through */ }
        }
        // Fallback: show raw TeX in monospace
        container.textContent = tex;
        container.style.fontFamily = 'var(--mono)';
    }

    function open(key) {
        const entry = LIB[key];
        if (!entry) return;
        titleEl.textContent = entry.title;
        descEl.textContent  = entry.desc;
        bodyEl.innerHTML    = '';

        // Picker mode — grid of clickable cards that open sub-modals
        if (entry.picker) {
            const grid = document.createElement('div');
            grid.className = 'curve-picker-grid';
            entry.picker.forEach(card => {
                const b = document.createElement('button');
                b.type = 'button';
                b.className = 'curve-picker-card';
                b.innerHTML = `
                    <div class="curve-picker-label">${card.label}</div>
                    <div class="curve-picker-tag">${card.tag}</div>
                    <div class="curve-picker-use">${card.use}</div>
                    <div class="curve-picker-arrow">อ่านรายละเอียด →</div>
                `;
                b.addEventListener('click', () => open(card.key));
                grid.appendChild(b);
            });
            bodyEl.appendChild(grid);
            modal.style.display = 'block';
            return;
        }

        // Curve preview chart — shown first so shape is immediate
        if (entry.curveKey) {
            const chartWrap = document.createElement('div');
            chartWrap.className = 'formula-chart';
            chartWrap.innerHTML = buildCurveChartSVG(entry.curveKey);
            bodyEl.appendChild(chartWrap);
        }

        // Formulas section
        if (entry.formulas && entry.formulas.length) {
            const formulasWrap = document.createElement('div');
            entry.formulas.forEach(f => {
                const block = document.createElement('div');
                block.className = 'formula-block';
                const math = document.createElement('div');
                renderTex(math, f.tex);
                block.appendChild(math);
                if (f.note) {
                    const n = document.createElement('div');
                    n.className = 'formula-note';
                    n.textContent = f.note;
                    block.appendChild(n);
                }
                formulasWrap.appendChild(block);
            });
            bodyEl.appendChild(formulasWrap);
        }

        // Custom named sections (used by curve-detail entries)
        if (Array.isArray(entry.sections)) {
            entry.sections.forEach(s => {
                const sec = document.createElement('div');
                sec.className = 'formula-section';
                sec.innerHTML = `
                    <p class="formula-section-title">${s.title}</p>
                    <div class="formula-example">${s.html}</div>
                `;
                bodyEl.appendChild(sec);
            });
        }

        // Legacy single-example section
        if (entry.example) {
            const sec = document.createElement('div');
            sec.className = 'formula-section';
            sec.innerHTML = `
                <p class="formula-section-title">ตัวอย่าง</p>
                <p class="formula-example">${entry.example}</p>
            `;
            bodyEl.appendChild(sec);
        }

        modal.style.display = 'block';
    }

    function close() { if (modal) modal.style.display = 'none'; }

    // ── Wire triggers ────────────────────────────────────────────────────────
    function bind() {
        // Delegate on document so later-added .formula-help (e.g. re-rendered
        // headers on language change) also work.
        document.addEventListener('click', (e) => {
            const trigger = e.target.closest('.formula-help[data-formula]');
            if (!trigger) return;
            e.preventDefault();
            let key = trigger.dataset.formula;
            // "curveModel" and "targetPct" are virtual keys — both route to the
            // currently-selected curve's dedicated modal (which now includes the
            // Target formula, progress() for that curve, and the anchor
            // explanation). Falls back to the picker if nothing is selected.
            if (key === 'curveModel' || key === 'targetPct') {
                const sel = document.getElementById('curveModel') || document.getElementById('curveModelChart');
                const val = sel && sel.value;
                const map = { scurve:'curveScurve', log:'curveLog', power:'curvePower', linear:'curveLinear' };
                key = map[val] || 'curvePicker';
            }
            open(key);
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal && modal.style.display === 'block') {
                close();
            }
        });
    }

    function init() { buildModal(); bind(); }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

// ==================== Sticky Stopwatch Bar ====================
// Detect when the sticky bar has actually "stuck" so we can beef up its shadow.
// A 1px sentinel above the bar is watched with IntersectionObserver — cheaper
// and jank-free vs. a scroll listener. Runs after DOMContentLoaded so the bar
// exists in the DOM.
(function initStickyStopwatch() {
    function attach() {
        const bar = document.querySelector('.stopwatch-bar');
        if (!bar || !('IntersectionObserver' in window)) return;
        const sentinel = document.createElement('div');
        sentinel.setAttribute('aria-hidden', 'true');
        sentinel.style.cssText = 'height:1px;margin-bottom:-1px;pointer-events:none;';
        bar.parentNode.insertBefore(sentinel, bar);
        new IntersectionObserver(
            ([entry]) => bar.classList.toggle('is-stuck', !entry.isIntersecting),
            { threshold: [0] }
        ).observe(sentinel);
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', attach);
    } else {
        attach();
    }
})();

// ==================== Pen Annotation Module ====================
// Live-teaching overlay. Toggle with the pen button (bottom-right) or `P`.
// Strokes are stored in document coordinates (pageX/pageY) so they stay pinned
// to content as the page scrolls or the row table grows/shrinks.
(function initPenModule() {
    const SVG_NS = 'http://www.w3.org/2000/svg';
    const TOOL_CFG = {
        pen:         { defaultSize: 3,  opacity: 1    },
        highlighter: { defaultSize: 16, opacity: 0.35 }
    };

    const state = {
        on: false,
        tool: 'pen',                 // 'pen' | 'highlighter' | 'eraser'
        color: '#dc2626',
        size: 3,
        strokes: [],                 // {tool, color, size, opacity, points:[[x,y]…]}
        current: null,
        currentEl: null,
        activePointerId: null,
        lastSizeByTool: { pen: 3, highlighter: 16 },
        collapsed: false             // iPad-style — palette hidden, puck shown
    };
    const TOOL_ICONS = { pen: 'pen-nib', highlighter: 'highlighter', eraser: 'eraser' };

    let overlay, svg, toolbar, banner, sizeInput, puck;

    // ── Puck (iPad-style collapsed indicator) ────────────────────────────────
    function isLightColor(hex) {
        // sRGB luminance heuristic — decides whether the pen-nib icon should
        // be dark or white when painted on a colored puck background.
        const h = hex.replace('#','');
        const r = parseInt(h.slice(0,2), 16);
        const g = parseInt(h.slice(2,4), 16);
        const b = parseInt(h.slice(4,6), 16);
        return (r * 299 + g * 587 + b * 114) / 1000 > 150;
    }

    function syncPuck() {
        if (!puck) return;
        const isEraser = state.tool === 'eraser';
        // Eraser puck: white bg + dark icon (color doesn't apply to eraser).
        // Pen/Highlighter puck: bg = current color, icon flips based on contrast.
        puck.style.background = isEraser ? 'var(--surface)' : state.color;
        puck.style.borderColor = isEraser ? 'var(--border-strong)' : state.color;
        puck.style.color = isEraser
            ? 'var(--ink)'
            : (isLightColor(state.color) ? '#18181b' : '#ffffff');
        const icon = puck.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-' + (TOOL_ICONS[state.tool] || 'pen-nib');
    }

    function setCollapsed(v) {
        state.collapsed = !!v;
        toolbar.classList.toggle('is-collapsed', state.collapsed);
        if (state.collapsed) syncPuck();
    }

    // ── Build DOM ─────────────────────────────────────────────────────────────
    function build() {
        overlay = document.createElement('div');
        overlay.id = 'penOverlay';
        overlay.setAttribute('aria-hidden', 'true');
        svg = document.createElementNS(SVG_NS, 'svg');
        svg.id = 'penSvg';
        svg.setAttribute('xmlns', SVG_NS);
        overlay.appendChild(svg);
        document.body.appendChild(overlay);

        banner = document.createElement('div');
        banner.id = 'penBanner';
        banner.textContent = 'โหมดปากกา — กด Esc หรือปุ่มปากกาเพื่อออก';
        document.body.appendChild(banner);

        toolbar = document.createElement('div');
        toolbar.id = 'penToolbar';
        toolbar.innerHTML = `
            <div id="penTools" role="toolbar" aria-label="Pen tools">
                <div class="pen-drag-handle" id="penDragHandle" title="ลากเพื่อย้ายตำแหน่ง" aria-label="Drag toolbar">
                    <i class="fa-solid fa-grip-vertical"></i>
                </div>
                <div class="pen-group">
                    <button class="pen-btn pen-tool-btn is-active" data-tool="pen"         title="ปากกา"><i class="fa-solid fa-pen-nib"></i></button>
                    <button class="pen-btn pen-tool-btn"           data-tool="highlighter" title="Highlighter"><i class="fa-solid fa-highlighter"></i></button>
                    <button class="pen-btn pen-tool-btn"           data-tool="eraser"      title="ยางลบ (คลิกที่เส้น)"><i class="fa-solid fa-eraser"></i></button>
                </div>
                <div class="pen-group pen-colors">
                    <button class="pen-btn pen-color-btn is-active" data-color="#dc2626" style="--c:#dc2626" title="แดง"></button>
                    <button class="pen-btn pen-color-btn"           data-color="#2563eb" style="--c:#2563eb" title="น้ำเงิน"></button>
                    <button class="pen-btn pen-color-btn"           data-color="#16a34a" style="--c:#16a34a" title="เขียว"></button>
                    <button class="pen-btn pen-color-btn"           data-color="#18181b" style="--c:#18181b" title="ดำ"></button>
                    <button class="pen-btn pen-color-btn"           data-color="#facc15" style="--c:#facc15" title="เหลือง"></button>
                </div>
                <div class="pen-group">
                    <label class="pen-size" title="ขนาดหัวปากกา">
                        <input type="range" id="penSize" min="1" max="32" value="3" aria-label="ขนาด">
                    </label>
                </div>
                <div class="pen-group">
                    <button class="pen-btn" id="penUndo"  title="ย้อนกลับ (Ctrl+Z)"><i class="fa-solid fa-rotate-left"></i></button>
                    <button class="pen-btn" id="penClear" title="ล้างทั้งหมด"><i class="fa-solid fa-trash-can"></i></button>
                </div>
                <button class="pen-btn pen-collapse-btn" id="penCollapse" title="ยุบ (คลิก puck เพื่อขยาย)" aria-label="ยุบ toolbar">
                    <i class="fa-solid fa-chevron-right"></i>
                </button>
            </div>
            <button id="penPuck" class="pen-puck" title="คลิกเพื่อขยาย · ลากเพื่อย้าย" aria-label="Expand pen palette">
                <i class="fa-solid fa-pen-nib"></i>
            </button>
            <button id="penToggle" class="pen-btn pen-toggle" title="เปิด/ปิด โหมดปากกา (P) · ลากเพื่อย้าย" aria-label="Toggle pen">
                <i class="fa-solid fa-pen"></i>
            </button>
        `;
        document.body.appendChild(toolbar);
        sizeInput = toolbar.querySelector('#penSize');
        puck = toolbar.querySelector('#penPuck');
        syncPuck();
    }

    // ── Overlay sizing ────────────────────────────────────────────────────────
    function updateOverlaySize() {
        const w = Math.max(document.documentElement.scrollWidth,  window.innerWidth);
        const h = Math.max(document.documentElement.scrollHeight, window.innerHeight);
        overlay.style.width  = w + 'px';
        overlay.style.height = h + 'px';
        svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
        svg.setAttribute('width',  w);
        svg.setAttribute('height', h);
    }

    // ── Mode toggle ──────────────────────────────────────────────────────────
    function setPenMode(on) {
        state.on = on;
        document.body.classList.toggle('pen-mode-on', on);
        overlay.classList.toggle('is-active', on);
        banner.classList.toggle('is-visible', on);
        if (on) {
            updateOverlaySize();
            // Always enter pen mode with the palette expanded, so users see all
            // tools without hunting for the puck.
            setCollapsed(false);
        }
    }

    // ── Path building (quadratic-smoothed) ───────────────────────────────────
    function pointsToPath(pts) {
        if (!pts.length) return '';
        if (pts.length === 1) {
            const [x, y] = pts[0];
            // draw a tiny dot so a single tap is visible
            return `M ${x} ${y} l 0.01 0.01`;
        }
        let d = `M ${pts[0][0]} ${pts[0][1]}`;
        for (let i = 1; i < pts.length - 1; i++) {
            const [x0, y0] = pts[i];
            const [x1, y1] = pts[i + 1];
            const mx = (x0 + x1) / 2;
            const my = (y0 + y1) / 2;
            d += ` Q ${x0} ${y0} ${mx} ${my}`;
        }
        const last = pts[pts.length - 1];
        d += ` L ${last[0]} ${last[1]}`;
        return d;
    }

    function makePathEl(stroke, index) {
        const p = document.createElementNS(SVG_NS, 'path');
        p.setAttribute('d', pointsToPath(stroke.points));
        p.setAttribute('stroke', stroke.color);
        p.setAttribute('stroke-width', stroke.size);
        p.setAttribute('fill', 'none');
        p.setAttribute('stroke-linecap',  stroke.tool === 'highlighter' ? 'butt' : 'round');
        p.setAttribute('stroke-linejoin', 'round');
        p.setAttribute('opacity', stroke.opacity);
        p.dataset.strokeIndex = index;
        return p;
    }

    function redrawAll() {
        while (svg.firstChild) svg.removeChild(svg.firstChild);
        state.strokes.forEach((s, i) => svg.appendChild(makePathEl(s, i)));
    }

    // ── Drawing handlers ─────────────────────────────────────────────────────
    function pos(e) { return [e.pageX, e.pageY]; }

    function onPointerDown(e) {
        if (!state.on) return;
        if (state.tool === 'eraser') return;      // eraser uses click, not drag
        if (e.button && e.button !== 0) return;   // ignore right/middle click
        e.preventDefault();
        const cfg = TOOL_CFG[state.tool] || TOOL_CFG.pen;
        const stroke = {
            tool: state.tool,
            color: state.color,
            size: state.size,
            opacity: cfg.opacity,
            points: [pos(e)]
        };
        state.current   = stroke;
        state.currentEl = makePathEl(stroke, state.strokes.length);
        state.strokes.push(stroke);
        svg.appendChild(state.currentEl);
        state.activePointerId = e.pointerId;
        if (overlay.setPointerCapture) {
            try { overlay.setPointerCapture(e.pointerId); } catch(_) {}
        }
    }

    function onPointerMove(e) {
        if (!state.on || !state.current) return;
        if (state.activePointerId !== null && e.pointerId !== state.activePointerId) return;
        e.preventDefault();
        const events = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
        for (const ev of events) state.current.points.push(pos(ev));
        state.currentEl.setAttribute('d', pointsToPath(state.current.points));
    }

    function onPointerUp() {
        state.current = null;
        state.currentEl = null;
        state.activePointerId = null;
    }

    // Eraser: click a stroke to delete it. `pointer-events:stroke` on paths
    // (set via body.pen-tool-eraser CSS) makes only the stroke line clickable.
    function onOverlayClick(e) {
        if (!state.on || state.tool !== 'eraser') return;
        const t = e.target;
        if (t && t.tagName === 'path' && t.dataset.strokeIndex !== undefined) {
            const idx = parseInt(t.dataset.strokeIndex, 10);
            state.strokes.splice(idx, 1);
            redrawAll();
        }
    }

    // ── Toolbar actions ──────────────────────────────────────────────────────
    function undo() {
        if (!state.strokes.length) return;
        state.strokes.pop();
        redrawAll();
    }
    function clearAll() {
        if (!state.strokes.length) return;
        state.strokes = [];
        redrawAll();
    }
    function selectTool(tool) {
        // remember previous size per tool so switching feels natural
        state.lastSizeByTool[state.tool] = state.size;
        state.tool = tool;
        toolbar.querySelectorAll('.pen-tool-btn').forEach(b => {
            b.classList.toggle('is-active', b.dataset.tool === tool);
        });
        document.body.classList.toggle('pen-tool-eraser', tool === 'eraser');
        if (tool === 'highlighter' || tool === 'pen') {
            const remembered = state.lastSizeByTool[tool] || TOOL_CFG[tool].defaultSize;
            state.size = remembered;
            sizeInput.value = remembered;
        }
        syncPuck();
    }
    function selectColor(color) {
        state.color = color;
        toolbar.querySelectorAll('.pen-color-btn').forEach(b => {
            b.classList.toggle('is-active', b.dataset.color === color);
        });
        // choosing a color while in eraser mode implies switching back to pen
        if (state.tool === 'eraser') selectTool('pen');
        syncPuck();
    }

    // ── Wiring ───────────────────────────────────────────────────────────────
    function bind() {
        // pen-toggle click is wired via attachDrag (in wireDrag) so the same
        // button can also be dragged to reposition the whole toolbar.
        toolbar.querySelectorAll('.pen-tool-btn').forEach(b => {
            b.addEventListener('click', () => selectTool(b.dataset.tool));
        });
        toolbar.querySelectorAll('.pen-color-btn').forEach(b => {
            b.addEventListener('click', () => selectColor(b.dataset.color));
        });
        sizeInput.addEventListener('input', e => {
            state.size = parseInt(e.target.value, 10) || 1;
        });
        toolbar.querySelector('#penUndo').addEventListener('click', undo);
        toolbar.querySelector('#penClear').addEventListener('click', clearAll);
        toolbar.querySelector('#penCollapse').addEventListener('click', () => setCollapsed(true));

        // Draggable toolbar via the grip handle. Stores position in
        // localStorage so it survives reloads. Clamps to viewport on drop
        // and on window resize so it never lands off-screen.
        wireDrag();

        overlay.addEventListener('pointerdown',   onPointerDown);
        overlay.addEventListener('pointermove',   onPointerMove);
        overlay.addEventListener('pointerup',     onPointerUp);
        overlay.addEventListener('pointercancel', onPointerUp);
        overlay.addEventListener('click',         onOverlayClick);

        window.addEventListener('resize', updateOverlaySize);
        if (window.ResizeObserver) {
            new ResizeObserver(updateOverlaySize).observe(document.body);
        }

        document.addEventListener('keydown', e => {
            const t = e.target;
            const inField = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
            if (!inField && !e.ctrlKey && !e.metaKey && !e.altKey && (e.key === 'p' || e.key === 'P')) {
                setPenMode(!state.on);
                e.preventDefault();
                return;
            }
            if (state.on) {
                if (e.key === 'Escape') { setPenMode(false); }
                else if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z')) {
                    undo(); e.preventDefault();
                }
            }
        });
    }

    // ── Drag-to-move the toolbar ─────────────────────────────────────────────
    // Position is intentionally NOT persisted — the toolbar always resets to
    // its CSS default (bottom-left) on refresh. In-session drags still work.
    let dragState = null;

    function applyToolbarPos(x, y) {
        // Positioning with top/left overrides the default bottom/left anchor.
        toolbar.style.left   = x + 'px';
        toolbar.style.top    = y + 'px';
        toolbar.style.right  = 'auto';
        toolbar.style.bottom = 'auto';
    }

    function clampToViewport(x, y) {
        const rect = toolbar.getBoundingClientRect();
        const maxX = window.innerWidth  - rect.width  - 4;
        const maxY = window.innerHeight - rect.height - 4;
        return [
            Math.max(4, Math.min(x, maxX)),
            Math.max(4, Math.min(y, maxY))
        ];
    }

    // Attach drag behavior to a handle element. If `onClick` is given, fires
    // it when the pointer barely moved (< 4px) — the puck uses this to expand
    // on tap, so tap-vs-drag are cleanly separated on the same element.
    function attachDrag(handle, onClick) {
        if (!handle) return;
        const DRAG_THRESHOLD = 4;
        let localDidMove = false;

        handle.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            const rect = toolbar.getBoundingClientRect();
            dragState = {
                pointerId: e.pointerId,
                dx: e.clientX - rect.left,
                dy: e.clientY - rect.top,
                startX: e.clientX,
                startY: e.clientY
            };
            localDidMove = false;
            handle.setPointerCapture(e.pointerId);
        });

        handle.addEventListener('pointermove', (e) => {
            if (!dragState || e.pointerId !== dragState.pointerId) return;
            if (!localDidMove) {
                const adx = Math.abs(e.clientX - dragState.startX);
                const ady = Math.abs(e.clientY - dragState.startY);
                if (adx + ady < DRAG_THRESHOLD) return;
                localDidMove = true;
                toolbar.classList.add('is-dragging');
            }
            const [x, y] = clampToViewport(e.clientX - dragState.dx, e.clientY - dragState.dy);
            applyToolbarPos(x, y);
        });

        const end = (e) => {
            if (!dragState || e.pointerId !== dragState.pointerId) return;
            const wasDrag = localDidMove;
            dragState = null;
            toolbar.classList.remove('is-dragging');
            if (!wasDrag && onClick) onClick();
            // No persistence — refresh resets to CSS default (bottom-left).
        };
        handle.addEventListener('pointerup',     end);
        handle.addEventListener('pointercancel', end);
    }

    function wireDrag() {
        // Grip handle inside the expanded palette — drag only, no click action.
        attachDrag(toolbar.querySelector('#penDragHandle'));
        // Puck (collapsed state) — drag OR click-to-expand.
        attachDrag(toolbar.querySelector('#penPuck'), () => setCollapsed(false));
        // Pen-toggle (always visible) — drag OR click-to-toggle-pen-mode.
        // This lets users reposition the entry button even when pen mode is off.
        attachDrag(toolbar.querySelector('#penToggle'), () => setPenMode(!state.on));

        // On viewport resize, re-clamp so the toolbar doesn't get stranded off-screen
        window.addEventListener('resize', () => {
            if (toolbar.style.left) {
                const rect = toolbar.getBoundingClientRect();
                const [x, y] = clampToViewport(rect.left, rect.top);
                applyToolbarPos(x, y);
            }
        });
    }

    function init() { build(); bind(); updateOverlaySize(); }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();