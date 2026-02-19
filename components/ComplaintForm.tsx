
import React, { useState } from 'react';
import { ComplaintCategory } from '../types';
import { complaintService } from '../services/complaintService';

const ComplaintForm: React.FC = () => {
  const [caNumber, setCaNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState<ComplaintCategory>(ComplaintCategory.PowerOutage);
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState<string | undefined>(undefined);
  const [photoName, setPhotoName] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!caNumber || !/^\d{12}$/.test(caNumber)) {
      newErrors.caNumber = 'กรุณากรอกหมายเลขผู้ใช้ไฟฟ้า 12 หลักให้ถูกต้อง';
    }
    if (!fullName.trim()) newErrors.fullName = 'กรุณากรอกชื่อ-นามสกุล';
    if (!phone.trim()) newErrors.phone = 'กรุณากรอกเบอร์โทรศัพท์';
    if (!location.trim()) newErrors.location = 'กรุณากรอกสถานที่เกิดเหตุ';
    if (!description.trim()) newErrors.description = 'กรุณาอธิบายรายละเอียดปัญหา';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    if (!validate()) return;

    setLoading(true);
    try {
      await complaintService.addComplaint({
        caNumber,
        fullName,
        phone,
        category,
        location,
        description,
        photo,
      });
      setSuccess('แจ้งเรื่องร้องเรียนสำเร็จ! เจ้าหน้าที่จะติดต่อกลับโดยเร็วที่สุด');
      // Reset form
      setCaNumber('');
      setFullName('');
      setPhone('');
      setCategory(ComplaintCategory.PowerOutage);
      setLocation('');
      setDescription('');
      setPhoto(undefined);
      setPhotoName('');
    } catch (err) {
      setErrors({ form: 'เกิดข้อผิดพลาดในการส่งข้อมูล' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-purple-800 mb-2">แบบฟอร์มแจ้งเรื่องร้องเรียน</h2>
      <p className="text-gray-600 mb-6">กรุณากรอกข้อมูลให้ครบถ้วนเพื่อความรวดเร็วในการดำเนินการ</p>
      
      {success && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded" role="alert"><p>{success}</p></div>}
      {errors.form && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded" role="alert"><p>{errors.form}</p></div>}

      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="caNumber" className="block text-sm font-medium text-gray-700">หมายเลขผู้ใช้ไฟฟ้า (12 หลัก)</label>
            <input type="text" id="caNumber" value={caNumber} onChange={e => setCaNumber(e.target.value.replace(/\D/g, ''))} maxLength={12} className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${errors.caNumber ? 'border-red-500' : 'border-gray-300'}`} required />
            {errors.caNumber && <p className="text-red-500 text-xs mt-1">{errors.caNumber}</p>}
          </div>
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">ชื่อ-นามสกุล</label>
            <input type="text" id="fullName" value={fullName} onChange={e => setFullName(e.target.value)} className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`} required />
            {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">เบอร์โทรศัพท์ติดต่อ</label>
            <input type="tel" id="phone" value={phone} onChange={e => setPhone(e.target.value)} className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${errors.phone ? 'border-red-500' : 'border-gray-300'}`} required />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">ประเภทเรื่องร้องเรียน</label>
            <select id="category" value={category} onChange={e => setCategory(e.target.value as ComplaintCategory)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md">
              {Object.values(ComplaintCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">สถานที่เกิดเหตุ/ที่อยู่</label>
            <textarea id="location" value={location} onChange={e => setLocation(e.target.value)} rows={3} className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${errors.location ? 'border-red-500' : 'border-gray-300'}`} required></textarea>
            {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
          </div>
          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">รายละเอียดปัญหา</label>
            <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={4} className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${errors.description ? 'border-red-500' : 'border-gray-300'}`} required></textarea>
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">แนบรูปภาพ (ถ้ามี)</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="photo" className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500">
                    <span>Upload a file</span>
                    <input id="photo" name="photo" type="file" className="sr-only" accept="image/*" onChange={handlePhotoChange} />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                {photoName && <p className="text-sm text-green-600 pt-2">{photoName}</p>}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-gray-400 disabled:cursor-not-allowed">
            {loading ? 'กำลังส่งข้อมูล...' : 'ส่งเรื่องร้องเรียน'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ComplaintForm;
