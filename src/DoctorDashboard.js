import React, { useState, useEffect } from 'react';

const DoctorDashboard = ({ doctorId }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // --- حالات جديدة للملف الشخصي ---
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [doctorData, setDoctorData] = useState({
    name: '', specialty: '', fee: '', availability: '', address: '', title: '', image_url: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);

  const fetchDoctorData = async () => {
    try {
      // 1. جلب الحجوزات
      const resApps = await fetch(`https://clinic-api-ig3d.onrender.com/doctor-appointments/${doctorId}`);
      const dataApps = await resApps.json();
      setAppointments(dataApps);

      // 2. جلب بيانات الدكتور الشخصية (ليتم عرضها في الفورم)
      // ملاحظة: تأكد أن لديك مسار في السيرفر يجلب بيانات دكتور واحد بالـ ID
      const resDoc = await fetch(`https://clinic-api-ig3d.onrender.com/doctors`); 
      const allDoctors = await resDoc.json();
      const currentDoc = allDoctors.find(d => d.id === parseInt(doctorId));
      if (currentDoc) setDoctorData(currentDoc);

      setLoading(false);
    } catch (e) {
      console.error("Error fetching data:", e);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (doctorId) fetchDoctorData();
  }, [doctorId]);

  // دالة تحديث الملف الشخصي
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', doctorData.name);
    formData.append('specialty', doctorData.specialty);
    formData.append('fee', doctorData.fee);
    formData.append('availability', doctorData.availability);
    formData.append('address', doctorData.address);
    formData.append('title', doctorData.title);
    if (selectedFile) formData.append('image', selectedFile);

    try {
      const response = await fetch(`https://clinic-api-ig3d.onrender.com/api/update-doctor/${doctorId}`, {
        method: 'PUT',
        body: formData, // نرسل formData لأن فيه صورة
      });

      if (response.ok) {
        alert("تم تحديث بياناتك بنجاح!");
        setIsEditingProfile(false);
        fetchDoctorData();
      } else {
        alert("فشل التحديث");
      }
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const updateStatus = async (appId, newStatus) => {
    const message = newStatus === 'completed' ? 'تأكيد حضور المريض؟' : 'تأكيد الإبلاغ عن غياب المريض؟';
    if (window.confirm(message)) {
      try {
        const response = await fetch(`https://clinic-api-ig3d.onrender.com/update-appointment-status/${appId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus })
        });
        if (response.ok) fetchDoctorData();
      } catch (error) { console.error("Error updating status:", error); }
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>جاري التحميل...</div>;

  return (
    <div style={{ padding: '20px', direction: 'rtl', fontFamily: 'Arial, sans-serif' }}>
      
      {/* هيدر الصفحة مع أزرار التحكم */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#2d6a4f', margin: 0 }}>لوحة تحكم العيادة</h2>
        <button 
          onClick={() => setIsEditingProfile(!isEditingProfile)}
          style={{ 
            backgroundColor: isEditingProfile ? '#6c757d' : '#2d6a4f', 
            color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' 
          }}
        >
          {isEditingProfile ? 'العودة للحجوزات' : '⚙️ تعديل ملفي الشخصي'}
        </button>
      </div>

      {!isEditingProfile ? (
        /* --- قسم جدول الحجوزات (الكود القديم بتاعك) --- */
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <thead>
              <tr style={{ backgroundColor: '#f1fcf9' }}>
                <th style={paddingStyle}>اسم المريض</th>
                <th style={paddingStyle}>الموبايل</th>
                <th style={paddingStyle}>التاريخ</th>
                <th style={paddingStyle}>سعر الكشف</th>
                <th style={paddingStyle}>الحالة</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((app) => (
                <tr key={app.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={paddingStyle}>{app.patient_name}</td>
                  <td style={paddingStyle}>{app.mobile}</td>
                  <td style={paddingStyle}>{app.booking_date ? new Date(app.booking_date).toLocaleDateString('ar-EG') : 'غير محدد'}</td>
                  <td style={paddingStyle}>{app.price} ج.م</td>
                  <td style={paddingStyle}>
                    {app.status === 'pending' ? (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => updateStatus(app.id, 'completed')} style={btnSuccess}>حضر</button>
                        <button onClick={() => updateStatus(app.id, 'absent')} style={btnDanger}>غاب</button>
                      </div>
                    ) : (
                      <span style={{ color: app.status === 'completed' ? '#28a745' : '#dc3545', fontWeight: 'bold' }}>
                        {app.status === 'completed' ? '✅ تم الحضور' : '❌ غائب'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* --- قسم تعديل الملف الشخصي (الجديد) --- */
        <form onSubmit={handleUpdateProfile} style={formStyle}>
          <h3>تعديل البيانات العامة للعيادة</h3>
          <div style={inputGroup}>
            <label>الاسم الظاهر للمرضى:</label>
            <input type="text" value={doctorData.name} onChange={(e)=>setDoctorData({...doctorData, name: e.target.value})} style={inputStyle} />
          </div>
          <div style={inputGroup}>
            <label>سعر الكشف (جنية):</label>
            <input type="number" value={doctorData.fee} onChange={(e)=>setDoctorData({...doctorData, fee: e.target.value})} style={inputStyle} />
          </div>
          <div style={inputGroup}>
            <label>المواعيد (نص حر):</label>
            <input type="text" value={doctorData.availability} onChange={(e)=>setDoctorData({...doctorData, availability: e.target.value})} style={inputStyle} placeholder="مثال: يومياً من 6 لـ 10 مساءً" />
          </div>
          <div style={inputGroup}>
            <label>تغيير الصورة الشخصية:</label>
            <input type="file" onChange={(e)=>setSelectedFile(e.target.files[0])} style={inputStyle} />
          </div>
          <button type="submit" style={btnSubmit}>حفظ التغييرات الجديدة</button>
        </form>
      )}
    </div>
  );
};

// --- Styles ---
const paddingStyle = { padding: '15px', textAlign: 'center' };
const btnSuccess = { backgroundColor: '#28a745', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' };
const btnDanger = { backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' };
const formStyle = { maxWidth: '600px', margin: '0 auto', padding: '20px', border: '1px solid #ddd', borderRadius: '10px', backgroundColor: '#f9f9f9' };
const inputGroup = { marginBottom: '15px', display: 'flex', flexDirection: 'column' };
const inputStyle = { padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ccc' };
const btnSubmit = { width: '100%', padding: '12px', backgroundColor: '#2d6a4f', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px' };

export default DoctorDashboard;