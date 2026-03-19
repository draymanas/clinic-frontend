import React, { useState, useEffect } from 'react';
const specialties = ["عظام", "باطنة", "أطفال", "جلدية", "نساء وتوليد", "جراحة عامة", "علاج طبيعي", "أسنان", "رمد", "مخ وأعصاب"];
// 1. القوائم الموحدة للعناوين والمواعيد
// --- 1. الثوابت العامة ---
const egyptLocations = {
    "القاهرة": ["مدينة نصر", "مصر الجديدة", "المعادي", "وسط البلد", "حلوان", "شبرا", "التجمع الخامس", "التجمع الأول", "الزمالك", "المقطم", "عين شمس", "السلام", "المرج", "الزيتون", "حدائق القبة", "روض الفرج"],
    "الجيزة": ["الدقي", "المهندسين", "العجوزة", "6 أكتوبر", "الشيخ زايد", "الهرم", "فيصل", "البدرشين", "الصف", "أبو النمرس", "الحوامدية", "كرداسة", "أوسيم"],
    "الإسكندرية": ["سموحة", "سيدي جابر", "محرم بك", "المنتزه", "لوران", "سيدي بشر", "العصافرة", "ميامي", "العجمي", "الدخيلة", "الورديان"],
    "القليوبية": ["بنها", "شبرا الخيمة", "قليوب", "قها", "الخانكة", "العبور", "كفر شكر", "شبين القناطر", "طوخ"],
    "الشرقية": ["الزقازيق", "العاشر من رمضان", "بلبيس", "منيا القمح", "أبو كبير", "فاقوس", "ههيا", "ديرب نجم", "الحسينية"],
    "الدقهلية": ["المنصورة", "طلخا", "ميت غمر", "دكرنس", "بلقاس", "شربين", "أجا", "المنزلة", "السنبلاوين"],
    "الغربية": ["طنطا", "المحلة الكبرى", "كفر الزيات", "زفتى", "بسيون", "قطور", "سمنود"],
    "المنوفية": ["شبين الكوم", "السادات", "منوف", "أشمون", "الباجور", "قويسنا", "تلا", "بركة السبع"],
    "البحيرة": ["دمنهور", "كفر الدوار", "إدكو", "رشيد", "أبو حمص", "الدلنجات", "حوش عيسى", "إيتاي البارود", "كوم حمادة"],
    "كفر الشيخ": ["كفر الشيخ", "دسوق", "فوه", "مطوبس", "سيدي سالم", "بيلا", "الرياض"],
    "الفيوم": ["الفيوم", "سنورس", "إطسا", "طامية", "يوسف الصديق", "إبشواي"],
    "بني سويف": ["بني سويف", "الواسطى", "ناصر", "إهناسيا", "ببا", "الفشن", "سمسطا"],
    "المنيا": ["المنيا", "ملوي", "مغاغة", "بني مزار", "مطاي", "سمالوط", "دير مواس", "أبو قرقاص"],
    "أسيوط": ["أسيوط", "ديروط", "منفلوط", "القوصية", "أبنوب", "أبو تيج", "البداري", "ساحل سليم"],
    "سوهاج": ["سوهاج", "طهطا", "جرجا", "أخميم", "المراغة", "جهينة", "البلينا", "دار السلام"],
    "قنا": ["قنا", "قفط", "قوص", "نجع حمادي", "دشنا", "أبو تشت", "الوقف"],
    "الأقصر": ["الأقصر", "البياضية", "القرنة", "الزينية", "إسنا", "أرمنت"],
    "أسوان": ["أسوان", "كوم أمبو", "إدفو", "دراو", "أبو سمبل"],
    "البحر الأحمر": ["الغردقة", "سفاجا", "القصير", "مرسى علم", "رأس غارب"],
    "جنوب سيناء": ["شرم الشيخ", "دهب", "نويبع", "طابا", "رأس سدر", "أبو زنيمة"],
    "شمال سيناء": ["العريش", "الشيخ زويد", "رفح", "بئر العبد"],
    "مطروح": ["مرسى مطروح", "الحمام", "العلمين", "الضبعة", "السلوم", "سيوة"],
    "الوادي الجديد": ["الخارجة", "الداخلة", "الفرافرة", "باريس"]
};
const daysOfWeek = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];

const DoctorDashboard = ({ doctorId }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  
  // الحالة الخاصة ببيانات الدكتور
  const [doctorData, setDoctorData] = useState({
  name: '', 
  specialty: '', 
  fee: '',           // سعر الكشف
  booking_phone: '',   // رقم الحجز
  personal_phone: '',  // الرقم الشخصي
  governorate: '', 
  city: '', 
  detailedAddress: ''
});

  const [availability, setAvailability] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);

  // دالة جلب البيانات (الحجوزات + بيانات البروفايل)
  const fetchDoctorData = async () => {
    try {
      // جلب الحجوزات
      const resApps = await fetch(`https://clinic-api-ig3d.onrender.com/doctor-appointments/${doctorId}`);
      const dataApps = await resApps.json();
      setAppointments(dataApps);

      // جلب بيانات الدكتور عشان نملى الفورم
      const resDoc = await fetch(`https://clinic-api-ig3d.onrender.com/doctors`); 
      const allDoctors = await resDoc.json();
      const currentDoc = allDoctors.find(d => d.id === parseInt(doctorId));

      if (currentDoc) {
        const addrParts = currentDoc.address ? currentDoc.address.split(' - ') : ['', '', ''];
        setDoctorData({
          ...currentDoc,
          governorate: addrParts[0] || '',
          city: addrParts[1] || '',
          detailedAddress: addrParts[2] || ''
        });

        try {
          setAvailability(JSON.parse(currentDoc.availability));
        } catch (e) {
          let initialAvail = {};
          daysOfWeek.forEach(day => initialAvail[day] = { from: '1', to: '1', fromP: 'مساءً', toP: 'مساءً', active: false });
          setAvailability(initialAvail);
        }
      }
      setLoading(false);
    } catch (e) { 
      console.error("Fetch Error:", e);
      setLoading(false); 
    }
  };

  useEffect(() => { if (doctorId) fetchDoctorData(); }, [doctorId]);

  // دالة تحديث حالة الحجز (حضر / غاب) - كودك القديم
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
      } catch (error) { console.error("Update Status Error:", error); }
    }
  };

  const updateDay = (day, field, value) => {
    setAvailability(prev => ({
      ...prev,
      [day]: { ...prev[day], [field]: value }
    }));
  };
const handleUpdateProfile = async (e) => {
  e.preventDefault();
  const formData = new FormData();

  // 1. البيانات الأساسية (ضفنا التخصص هنا)
  formData.append('name', doctorData.name);
  formData.append('specialty', doctorData.specialty); // خانة التخصص
  formData.append('title', doctorData.title);
  formData.append('fee', doctorData.fee);
  
  // 2. الموبايلات (حسب كود التسجيل: mobile و personal_mobile)
  formData.append('mobile', doctorData.booking_phone); 
  formData.append('personal_mobile', doctorData.personal_phone);

  // 3. العنوان (السر هنا: city للمحافظة و area للمدينة و address للتفاصيل)
  formData.append('city', doctorData.governorate); 
  formData.append('area', doctorData.city);
  formData.append('address', doctorData.detailedAddress);

  // 4. المواعيد والصورة
  formData.append('availability', JSON.stringify(availability));
  if (selectedFile) formData.append('image', selectedFile);

  try {
    const response = await fetch(`https://clinic-api-ig3d.onrender.com/api/update-doctor/${doctorId}`, {
      method: 'PUT',
      body: formData,
    });

    if (response.ok) {
      alert("✅ تم تحديث كل البيانات بما فيها التخصص والعنوان!");
      setIsEditingProfile(false);
      fetchDoctorData(); 
    } else {
      alert("❌ فشل التحديث، تأكد من البيانات");
    }
  } catch (error) {
    alert("⚠️ خطأ في الاتصال بالسيرفر");
  }
};

  if (loading) return <div style={{textAlign:'center', padding:'50px'}}>جاري التحميل...</div>;

  return (
    <div style={{ padding: '20px', direction: 'rtl', fontFamily: 'Arial, sans-serif' }}>
      
      {/* هيدر الصفحة */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#2d6a4f', margin: 0 }}>لوحة تحكم الطبيب</h2>
        <button 
          onClick={() => setIsEditingProfile(!isEditingProfile)}
          style={{ backgroundColor: isEditingProfile ? '#6c757d' : '#2d6a4f', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}
        >
          {isEditingProfile ? 'العودة لجدول الحجوزات' : '⚙️ تعديل ملفي الشخصي'}
        </button>
      </div>

      {!isEditingProfile ? (
        /* --- القسم الأول: جدول الحجوزات (كودك الأصلي المعدل) --- */
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
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button onClick={() => updateStatus(app.id, 'completed')} style={btnSuccess}>تأكيد حضور</button>
                        <button onClick={() => updateStatus(app.id, 'absent')} style={btnDanger}>إبلاغ غياب</button>
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
        /* --- القسم الثاني: فورم التعديل الموحدة (مثل صفحة التسجيل) --- */
<form onSubmit={handleUpdateProfile} style={formStyle}>
  <h3 style={{textAlign:'center', color:'#2d6a4f'}}>تحديث بيانات العيادة</h3>
  
  <div style={sectionBox}>
    <label>👤 الاسم الظاهر:</label>
    <input type="text" value={doctorData.name} onChange={(e)=>setDoctorData({...doctorData, name: e.target.value})} style={inputStyle} />
  </div>
{/* خانة التخصص الجديد */}
<div style={sectionBox}>
  <label>🎓 التخصص:</label>
  <select 
    value={doctorData.specialty} 
    onChange={(e) => setDoctorData({...doctorData, specialty: e.target.value})} 
    style={inputStyle}
  >
    <option value="">اختر التخصص</option>
    {specialties.map((spec) => (
      <option key={spec} value={spec}>{spec}</option>
    ))}
  </select>
</div>
  {/* --- الخانات الجديدة اللي طلبتها يا دكتور --- */}
  <div style={{ display: 'flex', gap: '10px' }}>
    <div style={{ flex: 1, ...sectionBox }}>
      <label>💰 سعر الكشف:</label>
      <input type="number" value={doctorData.fee} onChange={(e)=>setDoctorData({...doctorData, fee: e.target.value})} style={inputStyle} />
    </div>
    <div style={{ flex: 1, ...sectionBox }}>
      <label>📞 رقم الحجز (للعيادة):</label>
      <input type="text" value={doctorData.booking_phone} onChange={(e)=>setDoctorData({...doctorData, booking_phone: e.target.value})} style={inputStyle} />
    </div>
  </div>

  <div style={sectionBox}>
    <label>📱 الرقم الشخصي للدكتور:</label>
    <input type="text" value={doctorData.personal_phone} onChange={(e)=>setDoctorData({...doctorData, personal_phone: e.target.value})} style={inputStyle} />
  </div>

  <div style={sectionBox}>
    <label>📍 العنوان بالتفصيل:</label>
    <select value={doctorData.governorate} onChange={(e)=>setDoctorData({...doctorData, governorate: e.target.value, city: ''})} style={inputStyle}>
      <option value="">اختر المحافظة</option>
      {Object.keys(egyptLocations).map(gov => <option key={gov} value={gov}>{gov}</option>)}
    </select>
    <select value={doctorData.city} onChange={(e)=>setDoctorData({...doctorData, city: e.target.value})} style={inputStyle} disabled={!doctorData.governorate}>
      <option value="">اختر المدينة</option>
      {doctorData.governorate && egyptLocations[doctorData.governorate]?.map(c => <option key={c} value={c}>{c}</option>)}
    </select>
    <input type="text" placeholder="العنوان التفصيلي" value={doctorData.detailedAddress} onChange={(e)=>setDoctorData({...doctorData, detailedAddress: e.target.value})} style={inputStyle} />
  {/* --- إعادة خانة رفع الصورة --- */}
<div style={{...sectionBox, marginTop: '15px', border: '1px dashed #2d6a4f'}}>
  <label>🖼️ تحديث الصورة الشخصية:</label>
  <input 
    type="file" 
    accept="image/*" 
    onChange={(e) => setSelectedFile(e.target.files[0])} 
    style={{...inputStyle, border: 'none'}} 
  />
  {selectedFile && <p style={{fontSize: '12px', color: '#2d6a4f'}}>✅ تم اختيار ملف: {selectedFile.name}</p>}
</div>
  </div>
          <button type="submit" style={saveBtn}>💾 حفظ التغييرات النهائية</button>
        </form>
      )}
    </div>
  );
};

// الستايلات الموحدة
const paddingStyle = { padding: '15px', textAlign: 'center' };
const btnSuccess = { backgroundColor: '#28a745', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' };
const btnDanger = { backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' };
const formStyle = { maxWidth: '700px', margin: '0 auto', background: '#fff', padding: '20px', borderRadius: '12px', boxShadow:'0 4px 15px rgba(0,0,0,0.1)' };
const sectionBox = { background: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '15px', border: '1px solid #eee' };
const inputStyle = { width: '100%', padding: '10px', marginTop: '5px', marginBottom: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' };
const dayRow = { display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '10px', fontSize: '13px' };
const smallSelect = { padding: '4px', borderRadius: '4px', border: '1px solid #ccc' };
const saveBtn = { width: '100%', padding: '15px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight:'bold' };

export default DoctorDashboard;