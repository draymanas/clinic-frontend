import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DirectBooking = () => {
    // 1. كل الـ States
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showTicket, setShowTicket] = useState(false);
    const [patientData, setPatientData] = useState({ name: '', mobile: '' });
    const [selectedSlot, setSelectedSlot] = useState('');

    // 2. جلب البيانات
    useEffect(() => {
        const pathParts = window.location.pathname.split('/');
        const id = pathParts[pathParts.length - 1]; 

        setLoading(true);
        axios.get(`https://clinic-api-ig3d.onrender.com/doctor-direct/${id}`)
            .then(res => {
                setDoctor(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("خطأ:", err);
                setDoctor(null);
                setLoading(false);
            });
    }, []); 

    // 3. الدوال المساعدة
    const getNextDateForDay = (dayName) => {
        const days = { 'الأحد': 0, 'الاثنين': 1, 'الثلاثاء': 2, 'الأربعاء': 3, 'الخميس': 4, 'الجمعة': 5, 'السبت': 6 };
        const cleanDayName = dayName.replace('،', '').trim();
        const targetDay = days[cleanDayName];
        const now = new Date();
        const resultDate = new Date();
        let diff = (targetDay + 7 - now.getDay()) % 7;
        if (diff === 0) diff = 7;
        resultDate.setDate(now.getDate() + diff);
        return resultDate.toISOString().split('T')[0];
    };

    const handleConfirmBooking = async () => {
        if (!selectedSlot) return alert("من فضلك اختر اليوم أولاً");

        const dayName = selectedSlot.split(' ')[0]; 
        const actualDate = getNextDateForDay(dayName); 

        const bookingData = {
            doctor_id: doctor.id,
            doctor_name: doctor.name,
            patient_name: patientData.name,
            mobile: patientData.mobile,
            appointment_date: actualDate,
            price: doctor.fee,
            status: 'pending'
        };

        try {
            const response = await axios.post('https://clinic-api-ig3d.onrender.com/book-appointment', bookingData);
            if (response.data) {
                setShowModal(false);
                setShowTicket(true);
            }
        } catch (error) {
            alert("حدث خطأ في الحجز");
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>جاري تحميل بيانات الطبيب...</div>;
    
    if (!doctor) return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <h2>عذراً، هذا الرابط غير صحيح</h2>
            <button onClick={() => window.location.href = '/'}>العودة للرئيسية</button>
        </div>
    );

    return (
        <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', textAlign: 'center' }}>
            <img 
                src={doctor.image_url || 'https://via.placeholder.com/150'} 
                alt={doctor.name} 
                style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover' }} 
            />
            <h1 style={{ color: '#2c3e50' }}>دكتور {doctor.name}</h1>
            <p style={{ color: '#3498db', fontSize: '18px', fontWeight: 'bold' }}>{doctor.specialty}</p>
            
            <div style={{ margin: '20px 0', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '10px' }}>
                <strong>سعر الكشف: {doctor.fee} جنيه</strong>
            </div>

            <button 
                style={{ background: '#27ae60', color: '#fff', border: 'none', padding: '12px 30px', borderRadius: '8px', cursor: 'pointer', fontSize: '18px' }}
                onClick={() => setShowModal(true)}
            >
                احجز موعد الآن
            </button>

            {/* --- المودال --- */}
            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '15px', width: '350px', textAlign: 'right', direction: 'rtl' }}>
                        <h3 style={{marginTop: 0}}>حجز موعد مع د. {doctor.name}</h3>
                        <label style={{display:'block', marginBottom:'5px', fontWeight:'bold'}}>اختر اليوم المتاح:</label>
                        <select 
                            onChange={e => setSelectedSlot(e.target.value)} 
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '10px' }}
                        >
                            <option value="">-- اختر من الجدول --</option>
                            {doctor.availability && doctor.availability.split(' - ').map(slot => (
                                <option key={slot} value={slot}>
                                    {getNextDateForDay(slot.split(' ')[0])} | {slot}
                                </option>
                            ))}
                        </select>
                        <input placeholder="اسم المريض" onChange={e => setPatientData({...patientData, name: e.target.value})} style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
                        <input placeholder="رقم الموبايل" onChange={e => setPatientData({...patientData, mobile: e.target.value})} style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
                        <button onClick={handleConfirmBooking} style={{ width: '100%', padding: '12px', background: '#27ae60', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>تأكيد الحجز</button>
                        <button onClick={() => setShowModal(false)} style={{ width: '100%', marginTop: '10px', color: 'red', border:'none', background:'none', cursor:'pointer' }}>إلغاء</button>
                    </div>
                </div>
            )}

            {/* --- التذكرة --- */}
            {showTicket && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.9)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 }}>
                    <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '15px', textAlign: 'right', width: '350px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', direction: 'rtl' }}>
                        <h2 style={{ color: '#2c3e50', borderBottom: '2px solid #3498db', paddingBottom: '10px', marginTop: 0 }}>🎟️ تذكرة الحجز</h2>
                        <div style={{ lineHeight: '1.8', marginBottom: '15px' }}>
                            <p style={{ margin: '5px 0' }}><b>👤 المريض:</b> {patientData.name}</p>
                            <p style={{ margin: '5px 0' }}><b>👨‍⚕️ الدكتور:</b> {doctor.name}</p>
                            <p style={{ margin: '5px 0' }}><b>📅 الموعد:</b> {selectedSlot}</p>
                            <p style={{ margin: '5px 0' }}><b>📍 عنوان العيادة:</b> {doctor.address || 'العنوان مسجل لدى العيادة'}</p>
                            <p style={{ margin: '5px 0' }}><b>📞 رقم العيادة:</b> {doctor.mobile}</p>
                        </div>
                        <div style={{ marginTop: '15px', padding: '12px', backgroundColor: '#fff9db', borderRight: '5px solid #fcc419', borderRadius: '4px' }}>
                            <span style={{ fontSize: '14px', color: '#666' }}>قيمة الكشف المطلوبة:</span>
                            <h3 style={{ margin: '5px 0 0 0', color: '#e67e22', fontWeight: 'bold' }}>{doctor.fee} ج.م</h3>
                            <small style={{ color: '#999' }}>* يتم الدفع عند الحضور للعيادة</small>
                        </div>
                        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#e7f3ff', border: '1px dashed #007bff', borderRadius: '8px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '20px' }}>📸</span>
                            <span style={{ color: '#0056b3', fontWeight: 'bold', fontSize: '13px' }}>خذ لقطة شاشة (Screenshot) للتذكرة</span>
                        </div>
                        <button 
                            onClick={() => {
                                const message = `تأكيد حجز موعد من منصة دكتور:\nالمريض: ${patientData.name}\nمع الدكتور: ${doctor.name}\nالموعد المختار: ${selectedSlot}`;
                                const whatsappUrl = `https://wa.me/2${doctor.mobile}?text=${encodeURIComponent(message)}`;
                                window.open(whatsappUrl, '_blank');
                            }} 
                            style={{ width: '100%', padding: '12px', background: '#25D366', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', marginTop: '15px', fontSize: '15px' }}
                        >
                            🟢 إرسال عبر واتساب العيادة
                        </button>
                        <button onClick={() => window.location.reload()} style={{ width: '100%', padding: '10px', background: '#eee', color: '#333', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '10px' }}>إغلاق</button>
                    </div>
                </div>
            )}
        </div>
    ); // قفلة الـ return
}; // قفلة الـ DirectBooking

export default DirectBooking;