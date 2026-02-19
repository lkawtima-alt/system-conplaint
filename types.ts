
export enum ComplaintCategory {
  PowerOutage = 'ไฟดับ',
  HighVoltage = 'ไฟอันตราย',
  Billing = 'ปัญหาค่าไฟ',
  NewConnection = 'ขอใช้ไฟใหม่',
}

export enum ComplaintStatus {
  Pending = 'รับเรื่องแล้ว',
  InProgress = 'กำลังดำเนินการ',
  Resolved = 'แก้ไขเรียบร้อยแล้ว',
}

export interface Complaint {
  id: string;
  caNumber: string;
  fullName: string;
  phone: string;
  category: ComplaintCategory;
  description: string;
  photo?: string; // base64 string
  location: string;
  status: ComplaintStatus;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}
