import React, { useState, useEffect } from 'react';

const DoctorDashboard = ({ doctorId }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
const fetchDoctorData = async () => {
    try {
      // تأكد من استخدام doctorId الممرر للمكون (Component Props)
      const res = await fetch(`https://clinic-api-ig3d.onrender.com/doctor-appointments/${doctorId}`);
      const data = await res.json();
      console.log("البيانات اللي رجعت للطبيب:", data); // شوف دي بتطبع إيه في المتصفح
      setAppointments(data);
      setLoading(false);
    } catch (e) {
      console.error("Error fetching doctor data:", e);
      setLoading(false);
    }
   };

  useEffect(() => {
    if (doctorId) fetchDoctorData();
  }, [doctorId]);

const updateStatus = async (appId, newStatus) => {
    const message = newStatus === 'completed' ? 'تأكيد حضور المريض؟' : 'تأكيد الإبلاغ عن غياب المريض؟';
    
    if (window.confirm(message)) {
        try {
            // نستخدم المسار الجديد الذي أضفناه للسيرفر
            const response = await fetch(`https://clinic-api-ig3d.onrender.com/update-appointment-status/${appId}`, {
                method: 'PUT', // تأكد أنها PUT لتطابق السيرفر
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                fetchDoctorData(); // تحديث الجدول فوراً
            } else {
                alert("حدث خطأ أثناء تحديث الحالة");
            }
        } catch (error) {
            console.error("Error updating status:", error);
        }
    }
};

const isExpired = (bookingDate) => {
    if (!bookingDate) return false;
    const bookingTime = new Date(bookingDate).getTime();
    const currentTime = new Date().getTime();
    const hoursPassed = (currentTime - bookingTime) / (1000 * 60 * 60);
    return hoursPassed > 48;
};

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>جاري التحميل...</div>;

  return (
    <div style={{ padding: '20px', direction: 'rtl' }}>
      <h2 style={{ textAlign: 'center', color: '#2d6a4f' }}>جدول حجوزات العيادة</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', backgroundColor: '#fff' }}>
        <thead>
          <tr style={{ backgroundColor: '#f1fcf9' }}>
            <th style={paddingStyle}>اسم المريض</th>
            <th style={paddingStyle}>الموبايل</th>
            <th style={paddingStyle}>التاريخ</th>
            <th style={paddingStyle}>سعر الكشف</th>
            <th style={paddingStyle}>النسبة (20%)</th>
            <th style={paddingStyle}>الحالة</th>
            <th style={paddingStyle}>إجراء</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((app) => {
            // حل مشكلة "not defined" - نستخدم المسميات من قاعدة البيانات مباشرة
            const currentPrice = app.price || 0; 
            const currentCommission = currentPrice * 0.20;

            return (
              <tr key={app.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={paddingStyle}>{app.patient_name}</td>
                <td style={paddingStyle}>{app.mobile}</td>
<td style={paddingStyle}>
    {/* غيرنا app.appointment_date إلى app.booking_date */}
    {app.booking_date ? new Date(app.booking_date).toLocaleDateString('ar-EG') : 'غير محدد'}
</td>
                <td style={paddingStyle}>{currentPrice} ج.م</td>
                <td style={paddingStyle}>{currentCommission} ج.م</td>
                <td style={paddingStyle}>
    {app.status === 'pending' ? (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            {/* الزر الأخضر للحضور */}
            <button 
                onClick={() => updateStatus(app.id, 'completed')}
                style={{ 
                    backgroundColor: '#28a745', color: 'white', border: 'none', 
                    padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' 
                }}
            >
                تأكيد حضور
            </button>

            {/* الزر الأحمر للغياب */}
            <button 
                onClick={() => updateStatus(app.id, 'absent')}
                style={{ 
                    backgroundColor: '#dc3545', color: 'white', border: 'none', 
                    padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' 
                }}
            >
                إبلاغ غياب
            </button>
        </div>
    ) : (
        <span style={{ 
            color: app.status === 'completed' ? '#28a745' : '#dc3545', 
            fontWeight: 'bold' 
        }}>
            {app.status === 'completed' ? '✅ تم الحضور' : '❌ غائب'}
        </span>
    )}
</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const paddingStyle = { padding: '12px' };
const absentButtonStyle = { backgroundColor: '#e74c3c', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' };

export default DoctorDashboard;