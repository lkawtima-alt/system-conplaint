
import { Complaint, ComplaintStatus, ComplaintCategory } from '../types';

const STORAGE_KEY = 'pea_complaints';

const getComplaints = (): Promise<Complaint[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const complaintsJSON = localStorage.getItem(STORAGE_KEY);
      const complaints = complaintsJSON ? JSON.parse(complaintsJSON) : [];
      // Sort by newest first
      complaints.sort((a: Complaint, b: Complaint) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      resolve(complaints);
    }, 500);
  });
};

const addComplaint = (complaintData: Omit<Complaint, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<Complaint> => {
  return new Promise(async (resolve) => {
    const complaints = await getComplaints();
    const newComplaint: Complaint = {
      ...complaintData,
      id: `PEA-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      status: ComplaintStatus.Pending,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updatedComplaints = [newComplaint, ...complaints];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedComplaints));
    resolve(newComplaint);
  });
};

const updateComplaintStatus = (id: string, status: ComplaintStatus): Promise<Complaint | null> => {
  return new Promise(async (resolve) => {
    let complaints = await getComplaints();
    const complaintIndex = complaints.findIndex((c) => c.id === id);
    if (complaintIndex > -1) {
      complaints[complaintIndex] = {
        ...complaints[complaintIndex],
        status,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
      resolve(complaints[complaintIndex]);
    } else {
      resolve(null);
    }
  });
};

// Seed with some initial data if local storage is empty
const seedInitialData = async () => {
    const complaints = await getComplaints();
    if (complaints.length === 0) {
        const seedData: Omit<Complaint, 'id' | 'status' | 'createdAt' | 'updatedAt'>[] = [
            { caNumber: '112233445566', fullName: 'สมชาย ใจดี', phone: '0812345678', category: ComplaintCategory.PowerOutage, description: 'ไฟฟ้าดับทั้งซอยมา 1 ชั่วโมงแล้ว', location: '123 ถนนสุขุมวิท, กรุงเทพฯ', photo: undefined },
            { caNumber: '223344556677', fullName: 'สมหญิง มีสุข', phone: '0823456789', category: ComplaintCategory.HighVoltage, description: 'สายไฟแรงสูงพาดลงมาใกล้หลังคาบ้าน อันตรายมาก', location: '456 ถนนเพชรบุรี, กรุงเทพฯ', photo: undefined },
            { caNumber: '334455667788', fullName: 'มานะ อดทน', phone: '0834567890', category: ComplaintCategory.Billing, description: 'ค่าไฟเดือนนี้สูงผิดปกติ ทั้งที่ใช้ไฟเท่าเดิม', location: '789 ถนนพระราม 4, กรุงเทพฯ', photo: undefined },
        ];
        for (const data of seedData) {
            await addComplaint(data);
        }
    }
};

seedInitialData();


export const complaintService = {
  getComplaints,
  addComplaint,
  updateComplaintStatus,
};
