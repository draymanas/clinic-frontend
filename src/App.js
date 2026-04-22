import DoctorDashboard from './DoctorDashboard';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
// 1. استيراد الصفحة في الأعلى
import DirectBooking from './DirectBooking';
import logo from './logo.png';

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

const allGovernorates = Object.keys(egyptLocations);
const medicalSpecialties = [
  "الكل", "أسنان", "أطفال وحديثي الولادة", "أنف وأذن وحنجرة", "باطنة", "تغذية علاجية",
  "جراحة أطفال", "جراحة أوعية دموية", "جراحة أورام", "جراحة تجميل", "جراحة سمنة ومناظير",
  "عظام", "جراحة قلب وصدر", "جراحة مخ وأعصاب", "جراحة مسالك بولية", "جلدية",
  "جهاز هضمي وكبد", "حساسية ومناعة", "رمد", "روماتيزم", "علاج طبيعي", "غدد صماء وسكري",
  "جراحة عامه","امراض دم","قلب وأوعية دموية", "مخ وأعصاب", "نسا وتوليد", "نفسي"
];
const weekDays = ["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"];
const hoursArr = Array.from({ length: 12 }, (_, i) => i + 1);
const minsArr = ["00", "15", "30", "45"];
const periodsArr = ["صباحاً", "مساءً"];

const inputStyle = { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', width: '100%', boxSizing: 'border-box' };
const getOptimizedImage = (url) => {
  if (!url) return null;
  // لو الرابط من سوبابيز، بنفعله خاصية التصغير والتحويل لـ webp
  if (url.includes('supabase.co')) {
    return url.replace('/storage/v1/object/public/', '/storage/v1/render/image/public/') + 
           '?width=200&height=200&format=webp&quality=80';
  }
  return url;
};
const getNextDateForDay = (dayName) => {
    const daysMap = { "الأحد": 0, "الاثنين": 1, "الثلاثاء": 2, "الأربعاء": 3, "الخميس": 4, "الجمعة": 5, "السبت": 6 };
    const targetDay = daysMap[dayName];
    const today = new Date();
    let daysToAdd = (targetDay + 7 - today.getDay()) % 7;
    if (daysToAdd === 0) daysToAdd = 7; 
    const resultDate = new Date(today);
    resultDate.setDate(today.getDate() + daysToAdd);
    return resultDate.toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long' });
};

// --- 2. مكون تسجيل الدكتور (DoctorRegister) ---
function DoctorRegister() {
    const [newDoc, setNewDoc] = useState({ name: '', mobile: '', specialty: '',bio: '', fee: '', address: '', personal_mobile: '', title: '', city: '', area: '', password: '' });
    const [scheduleDetails, setScheduleDetails] = useState({});
    const [selectedFile, setSelectedFile] = useState(null);

    const handleTimeChange = (day, field, value) => {
        setScheduleDetails(prev => ({ ...prev, [day]: { ...prev[day], [field]: value } }));
    };

    const handleRegister = async () => {
        const availabilityString = weekDays.map(day => {
            const d = scheduleDetails[day];
            if (d?.startH && d?.endH) {
                return `${day} (${d.startH}:${d.startM || '00'} ${d.startP || 'مساءً'} إلى ${d.endH}:${d.endM || '00'} ${d.endP || 'مساءً'})`;
            }
            return null;
        }).filter(Boolean).join(' - '); 

        const formData = new FormData();
        formData.append('name', newDoc.name);
        formData.append('mobile', newDoc.mobile);
        formData.append('specialty', newDoc.specialty);
        formData.append('bio', newDoc.bio)
        formData.append('fee', newDoc.fee);
        formData.append('address', newDoc.address);
        formData.append('personal_mobile', newDoc.personal_mobile);
        formData.append('title', newDoc.title);
        formData.append('city', newDoc.city);
        formData.append('area', newDoc.area);
        formData.append('availability', availabilityString);
        const finalPassword = newDoc.password.trim() === '' ? '1234' : newDoc.password;
        formData.append('password', finalPassword);
        if (selectedFile) formData.append('image', selectedFile);

        const res = await fetch('https://clinic-api-ig3d.onrender.com/register-doctor', {
            method: 'POST',
            body: formData,
        });
if (res.ok) {
    alert("✅ تم إرسال بياناتك وصورتك بنجاح !");
    // اضف window. قبل fbq عشان السيرفر ما يرفضش الـ Build
    window.fbq('track', 'CompleteRegistration');
}
    };

    return (
        <div style={{ maxWidth: '850px', margin: '30px auto', padding: '30px', direction: 'rtl', backgroundColor: '#fff', borderRadius: '20px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
            <h2 style={{ textAlign: 'center', color: '#2c3e50' }}>👨‍⚕️ انضم لشبكة أطبائنا</h2>
            <div style={{ display: 'grid', gap: '15px' }}>
                <input placeholder="الاسم الكامل" onChange={e => setNewDoc({...newDoc, name: e.target.value})} style={inputStyle} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <select onChange={e => setNewDoc({...newDoc, title: e.target.value})} style={inputStyle}>
                        <option value="">اللقب المهني</option>
                        <option value="أخصائي">أخصائي</option><option value="استشاري">استشاري</option><option value="أستاذ دكتور">أستاذ دكتور</option>
                    </select>
                    <select onChange={e => setNewDoc({...newDoc, specialty: e.target.value})} style={inputStyle}>
                        <option value="">التخصص الطبي</option>
                        {medicalSpecialties.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <textarea 
    placeholder="نبذة مختصرة عنك (الخبرات، الشهادات، إلخ...)" 
    onChange={e => setNewDoc({...newDoc, bio: e.target.value})} 
    style={{...inputStyle, height: '80px', resize: 'none'}} 
/>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <select onChange={e => setNewDoc({...newDoc, city: e.target.value, area: ''})} style={inputStyle}>
                        <option value="">المحافظة</option>
                        {allGovernorates.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                    <select onChange={e => setNewDoc({...newDoc, area: e.target.value})} disabled={!newDoc.city} style={inputStyle}>
                        <option value="">المدينة/المنطقة</option>
                        {newDoc.city && egyptLocations[newDoc.city].map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                </div>
                <input placeholder="العنوان التفصيلي" onChange={e => setNewDoc({...newDoc, address: e.target.value})} style={inputStyle} />
                <div style={{ padding: '20px', background: '#f8f9fa', borderRadius: '15px' }}>
                    <p style={{ fontWeight: 'bold' }}>📅 مواعيد العيادة:</p>
                    {weekDays.map(day => (
                        <div key={day} style={{ display: 'flex', gap: '5px', marginBottom: '5px', fontSize: '12px' }}>
                            <span>{day}: من</span>
                            <select onChange={e => handleTimeChange(day, 'startH', e.target.value)}>{hoursArr.map(h => <option key={h} value={h}>{h}</option>)}</select>
                            <select onChange={e => handleTimeChange(day, 'startP', e.target.value)}>{periodsArr.map(p => <option key={p} value={p}>{p}</option>)}</select>
                            <span>إلى</span>
                            <select onChange={e => handleTimeChange(day, 'endH', e.target.value)}>{hoursArr.map(h => <option key={h} value={h}>{h}</option>)}</select>
                            <select onChange={e => handleTimeChange(day, 'endP', e.target.value)}>{periodsArr.map(p => <option key={p} value={p}>{p}</option>)}</select>
                        </div>
                    ))}
                </div>
                <input placeholder="سعر الكشف" onChange={e => setNewDoc({...newDoc, fee: e.target.value})} style={inputStyle} />
                <input type="file" accept="image/*" onChange={(e) => setSelectedFile(e.target.files[0])} />
                <input placeholder="موبايل الحجز" onChange={e => setNewDoc({...newDoc, mobile: e.target.value})} style={inputStyle} />
                <input placeholder="موبايل شخصي (للتواصل)" onChange={e => setNewDoc({...newDoc, personal_mobile: e.target.value})} style={inputStyle} />
                <input placeholder="كلمة المرور" type="password" onChange={e => setNewDoc({...newDoc, password: e.target.value})} style={inputStyle} />
                <button onClick={handleRegister} style={{ padding: '15px', background: '#27ae60', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>إرسال البيانات</button>
            </div>
        </div>
    );
}
function BookingPage({ doctors, fetchData, currentUser, openLogin }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [fSpecialty, setFSpecialty] = useState('الكل');
    const [fCity, setFCity] = useState('الكل');
    const [fArea, setFArea] = useState('الكل');
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showTicket, setShowTicket] = useState(false);
    const [patientData, setPatientData] = useState({ name: '', mobile: '' });
    // دي بنحطها في أول الفنكشن خالص من فوق
    const [isBioExpanded, setIsBioExpanded] = useState(false);
    // --- دالة تحويل اليوم إلى تاريخ رقمي (YYYY-MM-DD) ---
    const getNextDateForDay = (dayName) => {
        const days = { 
            'الأحد': 0, 'الاثنين': 1, 'الثلاثاء': 2, 'الأربعاء': 3, 
            'الخميس': 4, 'الجمعة': 5, 'السبت': 6 
        };
        // تنظيف النص من أي فواصل أو مسافات زائدة
        const cleanDayName = dayName.replace('،', '').trim();
        const targetDay = days[cleanDayName];
        
        const now = new Date();
        const resultDate = new Date();
        
        // حساب الفرق بين اليوم الحالي واليوم المستهدف
        let diff = (targetDay + 7 - now.getDay()) % 7;
        // إذا كان اليوم هو نفس اليوم ولكن الوقت قد فات أو نريد السبت القادم دائماً
        if (diff === 0) diff = 7; 

        resultDate.setDate(now.getDate() + diff);
        
        // إرجاع بصيغة YYYY-MM-DD لضمان قبول قاعدة البيانات (PostgreSQL)
        return resultDate.toISOString().split('T')[0];
    };

    const filtered = doctors.filter(d => 
        d.is_active && 
        (fSpecialty === 'الكل' || d.specialty === fSpecialty) && 
        (fCity === 'الكل' || d.city === fCity) && 
        (fArea === 'الكل' || d.area === fArea) &&
        d.name.includes(searchTerm)
    );

    const handleConfirm = async () => {
        try {
            // 1. استخراج اسم اليوم (مثل "السبت")
            const dayName = selectedSlot.split(' ')[0]; 
            
            // 2. الحصول على التاريخ الرقمي (2026-03-14)
            const actualDate = getNextDateForDay(dayName); 

            const bookingData = {
                doctor_id: selectedDoc.id,
                doctor_name: selectedDoc.name,
                patient_name: patientData.name,
                mobile: patientData.mobile,
                appointment_date: actualDate, // التاريخ الرقمي للسيرفر
                price: selectedDoc.fee,
                status: 'pending'
            };

            const response = await fetch('https://clinic-api-ig3d.onrender.com/book-appointment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingData),
            });

            if (response.ok) {
                await fetchData();
                setShowModal(false);
                
                // 3. تحديث النص للتذكرة (عرض التاريخ مع الوقت للمريض)
                const timePart = selectedSlot.split(' ').slice(1).join(' ');
                setSelectedSlot(`${dayName} ${actualDate} | ${timePart}`);
                
                setShowTicket(true);
            } else {
                const errorResult = await response.json();
                alert("فشل الحجز: " + errorResult.error);
            }
        } catch (error) {
            console.error("Error during booking:", error);
            alert("حدث خطأ أثناء الاتصال بالسيرفر");
        }
};

// ... باقي الـ return الخاص بالمكون (JSX) ...
return (
    <div style={{ backgroundColor: '#f0f4f8', minHeight: '100vh', direction: 'rtl' }}>
      
      {/* 1. اسم الموقع الكبير - DOCTOR */}
      {/* التعديل: تكبير الحجم وزيادة المساحة */}
{/* هذا هو الجزء الأصلي الذي يظهر فيه الاسم - اتركه كما هو أو عدله مرة واحدة فقط */}
<div style={{ textAlign: 'center', padding: '40px 0', background: '#fff' }}>
  <h1 style={{ fontSize: '85px', fontWeight: '900', margin: 0, color: '#1a73e8', textTransform: 'uppercase' }}>
    دكتور <span style={{ color: '#2c3e50', fontWeight: '300' }}>| DOCTOR</span>
  </h1>
  <p style={{ color: '#7f8c8d', fontSize: '20px', marginTop: '10px' }}>احجز طبيبك الآن بكل سهولة</p>

  {/* الآن ضع المستطيل الأحمر هنا مرة واحدة فقط واحذف أي كود "h1" إضافي تحته */}
  <div style={{
    margin: '30px auto',
    width: '90%',
    maxWidth: '1200px',
    padding: '25px',
    backgroundColor: '#fff',
    border: '2px solid #ff0000', 
    borderRadius: '15px', // جعلت الزوايا دائرية أكثر لتناسب التصميم
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
  }}>
<div style={{ 
  backgroundColor: '#e3f2fd', // لون خلفية أزرق فاتح مريح
  padding: '30px', 
  borderRadius: '15px', 
  textAlign: 'center', 
  border: '2px solid #bbdefb', // إطار خفيف متناسق مع الأزرق
  boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
  margin: '20px auto',
  maxWidth: '1100px'
}}>
  <p style={{ 
    fontSize: '28px', 
    color: '#0d47a1', // لون نص أزرق غامق ليظهر بوضوح على الخلفية الفاتحة (أو استبدله بـ #ffffff لو فضلته أبيض)
    fontWeight: '900',
    margin: 0, 
    lineHeight: '1.5' 
  }}>
    احجز دكتورك الآن مع أكبر منصة لحجز الأطباء في مصر..نخبة من أفضل وأمهر الاستشاريين والأخصائيين..اختار الميعاد اللي يناسبك واحجز الآن.
  </p>
</div>
  </div>
{/* قسم العدادات الإحصائية - Trust Counters */}
<div style={{ 
  display: 'flex', 
  justifyContent: 'center', 
  gap: '30px', 
  flexWrap: 'wrap', 
  margin: '20px 0 40px 0' 
}}>
  
  {/* العداد الأول: الأطباء */}
  <div style={{ textAlign: 'center', width: '140px' }}>
    <div style={{
      width: '90px', height: '90px', borderRadius: '50%', border: '4px solid #1a73e8',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '18px', fontWeight: 'bold', color: '#1a73e8',
      margin: '0 auto 10px', backgroundColor: '#fff', boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
    }}>+1000</div>
    <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#2c3e50', margin: 0 }}>👨‍⚕️ طبيب متخصص</p>
  </div>

  {/* العداد الثاني: الحجوزات */}
  <div style={{ textAlign: 'center', width: '140px' }}>
    <div style={{
      width: '90px', height: '90px', borderRadius: '50%', border: '4px solid #2e7d32',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '18px', fontWeight: 'bold', color: '#2e7d32',
      margin: '0 auto 10px', backgroundColor: '#fff', boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
    }}>+10,000</div>
    <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#2c3e50', margin: 0 }}>✅ حجز ناجح</p>
  </div>

  {/* العداد الثالث: الدعم الفني */}
  <div style={{ textAlign: 'center', width: '140px' }}>
    <div style={{
      width: '90px', height: '90px', borderRadius: '50%', border: '4px solid #f57c00',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '18px', fontWeight: 'bold', color: '#f57c00',
      margin: '0 auto 10px', backgroundColor: '#fff', boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
    }}>24/7</div>
    <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#2c3e50', margin: 0 }}>📞 دعم فني</p>
  </div>

</div>
</div>
      <div style={{ padding: '0 20px' }}>
        {/* 2. شريط البحث المنسق (الكبسولة) */}
       <div style={{ background: '#fff', padding: '15px 25px', borderRadius: '50px', marginBottom: '40px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', border: '1px solid #eee' }}>
  
  {/* اختيار التخصص */}
  <select onChange={e => setFSpecialty(e.target.value)} style={{ border: 'none', padding: '10px', fontSize: '15px', outline: 'none', background: 'transparent', cursor: 'pointer' }}>
    <option value="الكل">كل التخصصات</option>
    {medicalSpecialties.map(s => <option key={s} value={s}>{s}</option>)}
  </select>

  <div style={{ width: '1px', height: '30px', background: '#eee' }}></div>

  {/* اختيار المحافظة */}
  <select 
    value={fCity}
    onChange={e => {
        setFCity(e.target.value);
        setFArea("الكل"); // تصفير المدينة فوراً لما يغير المحافظة
    }} 
    style={{ border: 'none', padding: '10px', fontSize: '15px', outline: 'none', background: 'transparent', cursor: 'pointer' }}
  >
    <option value="الكل">كل المحافظات</option>
    {Object.keys(egyptLocations).map(g => <option key={g} value={g}>{g}</option>)}
  </select>

  {/* اختيار المدينة - يظهر فقط لو اختار محافظة */}
  {fCity !== 'الكل' && egyptLocations[fCity] && (
    <>
      <div style={{ width: '1px', height: '30px', background: '#eee' }}></div>
      <select 
        value={fArea} 
        onChange={(e) => setFArea(e.target.value)} 
        style={{ border: 'none', padding: '10px', fontSize: '15px', outline: 'none', background: 'transparent', cursor: 'pointer' }}
      >
        <option value="الكل">كل المدن/المناطق</option>
        {egyptLocations[fCity].map(area => <option key={area} value={area}>{area}</option>)}
      </select>
    </>
  )}

  <div style={{ width: '1px', height: '30px', background: '#eee' }}></div>

  {/* البحث بالاسم */}
  <input 
    placeholder="ابحث عن دكتور..." 
    onChange={e => setSearchTerm(e.target.value)} 
    style={{ border: 'none', padding: '10px', width: '200px', outline: 'none', fontSize: '15px' }} 
  />

         {/* التعديل: جعل الزر أضخم وأوضح */}
<button style={{ 
  background: '#1a73e8', 
  color: '#fff', 
  border: 'none', 
  padding: '15px 40px', // زيادة المسافة داخل الزر
  borderRadius: '10px', 
  fontSize: '22px',      // تكبير الخط
  fontWeight: 'bold',    // جعل الخط عريض
  cursor: 'pointer',
  transition: '0.3s'
}}>
  احجز دكتورك الآن ⚡
</button>
        </div>

        {/* 3. قائمة الأطباء (البطاقات اللي انت عدلتها وشغالة تمام) */}
      <div style={{ 
  display: 'flex', 
  gap: '35px',           // زودنا المسافة بين الكروت قليلاً
  flexWrap: 'wrap', 
  justifyContent: 'center', 
  padding: '40px 10px'   // مساحة داخلية لضمان عدم التصاق الكروت بحواف الشاشة
}}>
          {filtered.map(doc => (
            <div key={doc.id} style={{
  backgroundColor: '#fff',
  padding: '25px',
  borderRadius: '20px',    // زوايا دائرية
  width: '300px',
  textAlign: 'center',
  border: '1px solid #eee', // إطار خفيف
  boxShadow: '0 6px 18px rgba(0,0,0,0.06)', // ظل هادئ واحترافي
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
}}>
            <div style={{ 
    position: 'absolute', 
    top: '15px', 
    left: '15px', 
    backgroundColor: '#e7f3ff', 
    color: '#007bff', 
    padding: '5px 12px', 
    borderRadius: '12px', 
    fontWeight: 'bold',
    fontSize: '14px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    zIndex: 10 // لضمان عدم اختفائه خلف الصورة
}}>
    {doc.fee ? `${doc.fee} ج.م` : 'قيد التحديد'}
</div>
              <img 
  src={getOptimizedImage(doc.image_url) || `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.name)}&background=random&color=fff`} 
  alt={`دكتور ${doc.name} - حجز أطباء - منصة دكتور`} 
  loading="lazy" 
  style={{ width: '100px', height: '100px', borderRadius: '50%', marginBottom: '15px', objectFit: 'cover', border: '3px solid #f0f4f8' }} 
/>
{/* تعديل الاسم ليكون كبير ومسبوق بكلمة دكتور */}
<h3 style={{ fontSize: '24px', fontWeight: 'bold', margin: '5px 0' }}>
  دكتور / {doc.name}
</h3>

{/* دمج اللقب مع التخصص في سطر واحد بخط واضح */}
<p style={{ fontSize: '18px', color: '#1a73e8', fontWeight: 'bold' }}>
  {doc.title} {doc.specialty}
  
</p>
{/* الجزء المعدل للبايو مع خاصية المزيد */}
{doc.bio ? (() => {
    const BioSection = () => {
        const [isExpanded, setIsExpanded] = React.useState(false);
        
        // ده الستايل اللي هيجبر النص يتقص
        const truncatedStyle = {
            fontSize: '15px',
            color: '#444',
            fontStyle: 'italic',
            lineHeight: '1.5em',
            margin: '5px 0',
            // الثلاث سطور الجاية هي المسؤولة عن القص
            display: '-webkit-box',
            WebkitLineClamp: isExpanded ? 'unset' : '2', 
            WebkitBoxDirection: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            // إضافة ارتفاع أقصى في حالة عدم التمدد لضمان ثبات الكارت
            maxHeight: isExpanded ? 'none' : '3em', 
        };

        return (
            <div style={{ width: '100%', minHeight: '80px' }}>
                <p style={truncatedStyle}>
                    "{doc.bio}"
                </p>
                {doc.bio.length > 50 && (
                    <button 
                        onClick={() => setIsExpanded(!isExpanded)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#007bff',
                            cursor: 'pointer',
                            fontSize: '13px',
                            fontWeight: 'bold',
                            padding: '0',
                            display: 'block',
                            margin: '0 auto'
                        }}
                    >
                        {isExpanded ? 'عرض أقل' : '... المزيد'}
                    </button>
                )}
            </div>
        );
    };
    return <BioSection />;
})() : <div style={{ height: '80px' }}></div>}
<p style={{ 
  
  color: '#000000',      // اللون الأسود الصريح كما طلبت
  fontWeight: 'bold',    // جعل الخط عريض (واضح)
  fontSize: '15px',      // الحجم كما هو لم نغيره
  marginBottom: '20px'}}>📍 {doc.city} - {doc.area}</p>
  <div style={{
    backgroundColor: '#fff5f5', // خلفية حمراء فاتحة جداً
    border: '1px solid #ffcccc', // إطار أحمر خفيف
    borderRadius: '8px',
    padding: '5px 15px',
    margin: '10px 0',
    display: 'inline-block', // ليأخذ المستطيل حجم النص فقط
    color: '#d9534f', // لون الخط أحمر هادئ
    fontWeight: 'bold',
    fontSize: '15px'
}}>
    قيمة الكشف: {doc.fee || '0'} جنيه
</div>
<div style={{ color: '#ffc107', fontSize: '18px', marginBottom: '10px' }}>
  ⭐⭐⭐⭐⭐ <span style={{ color: '#7f8c8d', fontSize: '14px' }}>(5.0)</span>
</div>
              <button 
  onClick={() => {
    if (!currentUser) {
      // لو مفيش مستخدم مسجل، افتح نافذة تسجيل الدخول اللي في الـ App
      openLogin(); 
    } else {
      // لو مسجل دخول (سواء مريض أو أدمن)، افتح نافذة الحجز
      setSelectedDoc(doc); 
      setShowModal(true);
    }
  }} 
  style={{ 
    background: 'linear-gradient(45deg, #1a73e8, #0d47a1)', 
    color: '#fff', 
    border: 'none', 
    padding: '12px', 
    borderRadius: '12px', 
    width: '100%', 
    marginTop: '15px', 
    fontWeight: 'bold', 
    cursor: 'pointer',
    transition: '0.3s',
    boxShadow: '0 4px 15px rgba(26, 115, 232, 0.3)'
  }}
  onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
  onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
>
  {currentUser ? 'احجز موعدك الآن' : 'سجل دخول للحجز'}
</button>
            </div>
          ))}
        </div>
      </div>

            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '15px', width: '350px' }}>
                        <h3>حجز د. {selectedDoc.name}</h3>
                        <select onChange={e => setSelectedSlot(e.target.value)} style={inputStyle}>
                            <option value="">اختر اليوم</option>
                            {selectedDoc.availability.split(' - ').map(slot => <option key={slot} value={slot}>{getNextDateForDay(slot.split(' ')[0])} | {slot}</option>)}
                        </select>
                        <input placeholder="اسم المريض" onChange={e => setPatientData({...patientData, name: e.target.value})} style={{...inputStyle, marginTop:'10px'}} />
                        <input placeholder="رقم الموبايل" onChange={e => setPatientData({...patientData, mobile: e.target.value})} style={{...inputStyle, marginTop:'10px'}} />
                        <button onClick={handleConfirm} style={{ width: '100%', padding: '12px', background: '#3498db', color: '#fff', marginTop: '15px', border:'none', borderRadius:'8px' }}>تأكيد</button>
                        <button onClick={() => setShowModal(false)} style={{ width: '100%', marginTop: '10px', color: 'red', border:'none', background:'none' }}>إلغاء</button>
                    </div>
                </div>
            )}

            {showTicket && (
  <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.9)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 }}>
    <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '15px', textAlign: 'right', width: '350px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
      <h2 style={{ color: '#2c3e50', borderBottom: '2px solid #3498db', paddingBottom: '10px' }}>🎟️ تذكرة الحجز</h2>
      <p><b>👤 المريض:</b> {patientData.name}</p>
      <p><b>👨‍⚕️ الدكتور:</b> {selectedDoc.name}</p>
      <p><b>📅 الموعد:</b> {selectedSlot}</p>
      <p><b>📍 عنوان العيادة:</b> {selectedDoc?.address}</p>
      <p><b>📞 رقم العيادة:</b> {selectedDoc?.mobile}</p>
      {/* كود عرض السعر داخل تذكرة الحجز */}
<div style={{
    marginTop: '15px',
    padding: '12px',
    backgroundColor: '#fff9db', // لون أصفر خفيف يعطي إيحاء بالفاتورة
    borderRight: '5px solid #fcc419',
    borderRadius: '4px',
    textAlign: 'right'
}}>
    <span style={{ fontSize: '16px', color: '#666' }}>قيمة الكشف المطلوبة:</span>
    <h3 style={{ margin: '5px 0 0 0', color: '#e67e22', fontWeight: 'bold' }}>
        {selectedDoc.fee} ج.م
    </h3>
    <small style={{ color: '#999' }}>* يتم الدفع عند الحضور للعيادة</small>
</div>
{/* تنويه لقطة الشاشة */}
<div style={{
    marginTop: '20px',
    padding: '10px',
    backgroundColor: '#e7f3ff', // لون أزرق فاتح جداً
    border: '1px dashed #007bff',
    borderRadius: '8px',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
}}>
    <span style={{ fontSize: '20px' }}>📸</span>
    <span style={{ color: '#0056b3', fontWeight: 'bold', fontSize: '14px' }}>
        من فضلك خذ لقطة شاشة (Screenshot) للتذكرة  
    </span>
</div>
      {/* زرار الواتساب الجديد */}
      <button 
        onClick={() => {
          const message = `تأكيد حجز موعد:\nالمريض: ${patientData.name}\nمع الدكتور: ${selectedDoc.name}\nالموعد: ${selectedSlot}`;
          const whatsappUrl = `https://wa.me/2${selectedDoc.mobile}?text=${encodeURIComponent(message)}`;
          window.open(whatsappUrl, '_blank');
        }} 
        style={{ width: '100%', padding: '12px', background: '#25D366', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', marginTop: '15px', fontSize: '15px' }}
      >
        🟢 إرسال عبر واتساب العيادة
      </button>

      <button 
        onClick={() => window.location.reload()} 
        style={{ width: '100%', padding: '10px', background: '#eee', color: '#333', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '10px' }}
      >
        إغلاق
      </button>
    </div>
  </div>
)}
        </div>
    );
}

// --- 4. مكون صفحة الإدارة (AdminPage) ---
function AdminPage({ doctors, appointments, fetchData }) {
    const handleDelete = async (id) => { if(window.confirm("حذف؟")){ await fetch(`https://clinic-api-ig3d.onrender.com/delete-doctor/${id}`, {method:'DELETE'}); fetchData(); } };
    const handleToggle = async (id, s) => { await fetch(`https://clinic-api-ig3d.onrender.com/toggle-doctor/${id}`, {method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify({status:s})}); fetchData(); };

    return (
        <div style={{ padding: '20px', direction: 'rtl' }}>
            <h2 style={{textAlign:'center'}}>📊 إدارة الأطباء</h2>
            <table style={{width:'100%', background:'#fff', borderCollapse:'collapse', marginBottom:'40px'}}>
                <thead style={{background:'#eee'}}><tr align="right"><th>الدكتور</th><th>المكان</th><th>الحالة</th><th>الإجراء</th></tr></thead>
                <tbody>
                    {doctors.map(d => (
                        <tr key={d.id} style={{borderBottom:'1px solid #eee'}}>
                            <td style={{padding:'10px'}}>{d.name}</td>
                            <td>{d.city}</td>
                            <td>{d.is_active ? '✅ مفعل' : '❌ متوقف'}</td>
                            <td>
                                <button onClick={() => handleToggle(d.id, !d.is_active)} style={{background: d.is_active ? '#f39c12' : '#27ae60', color:'#fff', border:'none', padding:'5px', borderRadius:'5px'}}>{d.is_active ? 'إيقاف' : 'تفعيل'}</button>
                                <button onClick={() => handleDelete(d.id)} style={{color:'red', marginLeft:'10px', background:'none', border:'none'}}>حذف</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h2 style={{textAlign:'center'}}>📅 الحجوزات الأخيرة</h2>
            <table style={{width:'100%', background:'#fff', borderCollapse:'collapse'}}>
                <thead style={{background:'#34495e', color:'#fff'}}><tr align="right"><th>المريض</th><th>الموبايل</th><th>الدكتور</th><th>التاريخ</th></tr></thead>
                <tbody>
                    {appointments.map(app => (
                        <tr key={app.id} style={{borderBottom:'1px solid #eee'}}>
                            <td style={{padding:'10px'}}>{app.patient_name}</td>
                            <td>{app.mobile}</td>
                            <td>{app.doctor_name}</td>
                            <td style={{ color: 'green', fontWeight: 'bold' }}>
    {app.booking_date || app.appointment_date 
        ? new Date(app.booking_date || app.appointment_date).toLocaleDateString('en-GB') 
        : "غير محدد"}
</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function AccountingPage({ doctors, appointments }) {
  const [selectedDocName, setSelectedDocName] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  // فلترة الحجوزات بناءً على الدكتور والشهر
const doctorAppointments = appointments.filter(app => {
    // 1. الربط بالـ ID (أمان أعلى ضد تشابه الأسماء)
    const currentDoc = doctors.find(d => d.name === selectedDocName);
    const isSameDoctor = Number(app.doctor_id) === Number(currentDoc?.id);

    // 2. استخدام حقل booking_date الفعلي من الجدول
    const appDate = new Date(app.booking_date);
    const isSameMonth = (appDate.getMonth() + 1) === parseInt(selectedMonth);

    // 3. التأكد من أن الحالة مكتملة
    const isCompleted = app.status === 'completed';

    return isSameDoctor && isSameMonth && isCompleted;
  });

  // جلب بيانات الدكتور المختار (عشان نعرف سعر كشفه)
  const currentDoc = doctors.find(d => d.name === selectedDocName);
  const totalAmount = doctorAppointments.length * (currentDoc?.fee || 0);
  const platformFee = totalAmount * 0.20; // نسبة الـ 20%
  const finalMessage = `
🧾 فاتورة مستحقات المنصة - شهر ${selectedMonth}
👨‍⚕️ دكتور: ${selectedDocName}
📊 عدد الحجوزات: ${doctorAppointments.length}
💰 إجمالي الكشوفات: ${totalAmount} ج.م
🏦 نسبة المنصة (20%): ${platformFee} ج.م

✅ طرق الدفع المتاحة:
📱 فودافون كاش: 01032368436
💸 إنستاباي: draymanas@instapay
برجاء إرسال صورة التحويل بعد الدفع.
  `;

  return (
    <div style={{ padding: '30px', direction: 'rtl', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
      <h2 style={{ textAlign: 'center', color: '#2c3e50' }}>💰 نظام الحسابات والتحصيل</h2>
      
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
        <select onChange={e => setSelectedDocName(e.target.value)} style={{ padding: '10px', borderRadius: '8px' }}>
          <option value="">-- اختر الدكتور --</option>
          {doctors.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
        </select>

        <select onChange={e => setSelectedMonth(e.target.value)} value={selectedMonth} style={{ padding: '10px', borderRadius: '8px' }}>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>شهر {i + 1}</option>
          ))}
        </select>
      </div>

      {selectedDocName && (
        <div style={{ background: '#fff', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', maxWidth: '600px', margin: '0 auto' }}>
          <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>تفاصيل الفاتورة</h3>
          <p>عدد الحجوزات المكتملة: <b>{doctorAppointments.length}</b></p>
          <p>إجمالي مبلغ الكشوفات: <b>{totalAmount} ج.م</b></p>
          <p style={{ color: '#e74c3c', fontSize: '18px' }}>مستحقات المنصة (20%): <b>{platformFee} ج.م</b></p>
          
          <div style={{ background: '#f9f9f9', padding: '15px', borderRadius: '10px', marginTop: '20px' }}>
            <p style={{ whiteSpace: 'pre-line', fontSize: '14px' }}>{finalMessage}</p>
          </div>

          <button 
            onClick={() => window.open(`https://wa.me/2${currentDoc?.personal_mobile || currentDoc?.mobile}?text=${encodeURIComponent(finalMessage)}`, '_blank')}
            style={{ width: '100%', padding: '12px', background: '#25D366', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', marginTop: '15px' }}
          >
            إرسال الفاتورة للدكتور (واتساب)
          </button>
        </div>
      )}
    </div>
  );
}
// -// --- 5. المكون الرئيسي (App) ---
function App() {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false); 
  const [activePage, setActivePage] = useState('home'); 
  const [currentUser, setCurrentUser] = useState(null); 
  const [showLoginModal, setShowLoginModal] = useState(false); 

  const fetchData = async () => {
    try {
      const resDocs = await fetch('https://clinic-api-ig3d.onrender.com/doctors');
      setDoctors(await resDocs.json());
      const resApps = await fetch('https://clinic-api-ig3d.onrender.com/appointments');
      setAppointments(await resApps.json());
    } catch (e) { console.error("Error fetching data"); }
  };

  useEffect(() => { fetchData(); }, []);
// --- بعد السطر 647 ---
useEffect(() => {
    const savedUser = localStorage.getItem('saved_user');
    if (savedUser) {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        
        // توجيه تلقائي بناءً على الرول
        if (user.role === 'doctor') {
            setActivePage('doctor_dashboard');
        } else if (user.role === 'admin') {
            setIsAdmin(true);
            setActivePage('admin_dashboard');
        }
    }
}, []);

// --- أضف الكود الجديد هنا ---
// البحث عن هذا الجزء وتعديله
useEffect(() => {
    const path = window.location.pathname;
    if (path.includes('/dr/')) {
      // 1. استخراج الرقم
      const idFromUrl = path.split('/dr/')[1];
      
      // 2. أهم خطوة: توجيه الـ React لفتح صفحة الحجز المباشر
      setActivePage('direct_booking_page');
      
      // ملحوظة: لو عندك متغير بيشيل الـ id بتاع الدكتور المختار، حدثه هنا برضه
      // setSelectedDoctorId(idFromUrl); 
    }
  }, []);
  const navBtnStyle = {
    background: 'none', border: 'none', color: '#fff', cursor: 'pointer',
    fontWeight: 'bold', fontSize: '16px', padding: '10px 15px', borderRadius: '8px',
    transition: '0.3s'
  };

  // دالة تسجيل الخروج
  const handleLogout = () => {
    setIsAdmin(false);
    setCurrentUser(null);
    setActivePage('home');
  };

  return (
    <div style={{ direction: 'rtl', fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
      
      {/* 1. شريط التنقل العلوي (النافبار) */}
      <nav style={{ 
        padding: '8px 15px', // قللنا الـ padding شوية للموبايل
        background: '#2c3e50', 
        display: 'flex', 
        justifyContent: 'space-between', // عشان اللوجو يروح يمين والزراير شمال
        alignItems: 'center',
        position: 'sticky', 
        top: 0, 
        zIndex: 1000, 
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        flexWrap: 'wrap', // يمنع التداخل في الموبايل
        gap: '10px'
      }}>

        {/* --- مكان اللوجو الجديد --- */}
<div 
  onClick={() => setActivePage('home')} 
  style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
>
  <img 
    src="/logo.png" 
    alt="منصة دكتور" 
    style={{ 
      height: '40px', 
      width: 'auto', 
      objectFit: 'contain' 
    }} 
  />
</div>

        {/* --- حاوية الزراير --- */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'nowrap' }}>
        <button onClick={() => setActivePage('home')} style={{...navBtnStyle, backgroundColor: activePage === 'home' ? '#3498db' : 'transparent'}}>🏠 الرئيسية</button>
       {(currentUser?.role !== 'admin' && currentUser?.role !== 'patient') && (
  <button 
    onClick={() => setActivePage('join')} 
    style={{...navBtnStyle, backgroundColor: activePage === 'join' ? '#3498db' : 'transparent'}}
  >
    👨‍⚕️ انضمام طبيب
  </button>
)}
        {isAdmin && (
          <>
            <button onClick={() => setActivePage('admin')} style={{...navBtnStyle, backgroundColor: activePage === 'admin' ? '#e67e22' : 'transparent'}}>⚙️ الإدارة</button>
            <button onClick={() => setActivePage('accounting')} style={{...navBtnStyle, backgroundColor: activePage === 'accounting' ? '#e67e22' : 'transparent'}}>💰 الحسابات</button>
          </>
        )}
           {currentUser?.role === 'doctor' && (
  <button 
    onClick={() => setActivePage('doctor_dashboard')} 
    style={{...navBtnStyle, backgroundColor: activePage === 'doctor_dashboard' ? '#2ecc71' : 'transparent', color: '#fff'}}
  >
    📊 لوحة التحكم
  </button>
)}
        {/* زر تسجيل الدخول الذكي */}
{/* زر تسجيل الدخول الذكي - نسخة منظمة (خروج فوق الاسم) */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
          {!currentUser ? (
            <button onClick={() => setShowLoginModal(true)} style={{...navBtnStyle, background: '#27ae60', fontSize: '14px'}}>🔐 دخول</button>
          ) : (
            <>
              {/* زرار الخروج بقى فوق خالص */}
              {/* زرار الخروج - تم تكبيره واستغلال المساحة الفوقية */}
      <button 
        onClick={handleLogout} 
        style={{
          ...navBtnStyle, 
          backgroundColor: '#e74c3c', 
          fontSize: '14px',        // كبرنا الخط شوية
          padding: '8px 15px',     // زودنا المساحة جوه الزرار عشان يكبر أفقياً ورأسياً
          width: '100%',           // عشان يملأ عرض العمود الصغير بتاعه
          marginBottom: '5px',      // مسافة بسيطة بينه وبين أيقونة الشخص اللي تحته
          marginTop: '2px'         // استغلال المساحة الفوقية اللي قولت عليها
        }}
      >
        خروج
      </button>

      {/* الاسم والأيقونة تحت زرار الخروج */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: '1' }}>
        <span style={{ fontSize: '18px' }}>👤</span>
        <span style={{ fontSize: '10px', color: '#fff', textAlign: 'center' }}>
          {isAdmin ? 'الأدمن' : currentUser.name}
        </span>
      </div>
            </>
          )}
        </div>
</div>
      </nav>

      {/* 2. نافذة تسجيل الدخول (Login Modal) */}
      {showLoginModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 3000 }}>
            <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '15px', width: '350px', direction: 'rtl', boxShadow: '0 5px 25px rgba(0,0,0,0.2)' }}>
                <h3 style={{ textAlign: 'center', color: '#2c3e50' }}>تسجيل الدخول</h3>
                
                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
    <button onClick={() => setCurrentUser({role: 'patient'})} style={{flex:1, padding: '10px', cursor:'pointer', borderRadius: '8px', border: currentUser?.role === 'patient' ? '2px solid #3498db' : '1px solid #ddd'}}>أنا مريض</button>
    <button onClick={() => setCurrentUser({role: 'doctor_check'})} style={{flex:1, padding: '10px', cursor:'pointer', borderRadius: '8px', border: currentUser?.role === 'doctor_check' ? '2px solid #3498db' : '1px solid #ddd'}}>أنا طبيب</button>
    <button onClick={() => setCurrentUser({role: 'admin_check'})} style={{flex:1, padding: '10px', cursor:'pointer', borderRadius: '8px', border: currentUser?.role === 'admin_check' ? '2px solid #3498db' : '1px solid #ddd'}}>أنا أدمن</button>
</div>
{currentUser?.role === 'patient' && (
    <div style={{ display: 'grid', gap: '10px' }}>
        <input 
            placeholder="الاسم" 
            style={inputStyle} 
            onChange={(e) => setCurrentUser({...currentUser, name: e.target.value})} 
        />
        <input 
            placeholder="الموبايل" 
            style={inputStyle} 
            onChange={(e) => setCurrentUser({...currentUser, mobile: e.target.value})} 
        />
        <button 
            onClick={() => { 
                // 1. التأكد من أن البيانات تم حفظها في الذاكرة الدائمة للمتصفح
                localStorage.setItem('saved_user', JSON.stringify(currentUser));
                
                // 2. إغلاق النافذة
                setShowLoginModal(false); 
                
                // تنبيه بسيط للمستخدم (اختياري)
                console.log("تم حفظ بيانات الدخول بنجاح");
            }} 
            style={{ 
                background: '#27ae60', 
                color: '#fff', 
                border: 'none', 
                padding: '12px', 
                borderRadius: '8px', 
                cursor: 'pointer',
                fontWeight: 'bold'
            }}
        >
            دخول وحجز
        </button>
    </div>
)}
                    
                {currentUser?.role === 'admin_check' && (
    <div style={{ display: 'grid', gap: '10px' }}>
        <input 
            type="password" 
            placeholder="كلمة سر الأدمن" 
            style={inputStyle} 
            onKeyDown={(e) => {
                if(e.key === 'Enter' && e.target.value === 'admin123') {
                    // بيانات الآدمن التي سيتم حفظها
                    const adminData = {name: 'Admin', role: 'admin'};
                    
                    setIsAdmin(true);
                    setCurrentUser(adminData);
                    setActivePage('admin'); // تأكد أن اسم الصفحة 'admin' أو 'admin_dashboard' حسب كودك
                    
                    // --- السطر السحري للحفظ ---
                    localStorage.setItem('saved_user', JSON.stringify(adminData));
                    
                    setShowLoginModal(false);
                }
            }} 
        />
        <p style={{fontSize:'12px', color:'gray', textAlign: 'center'}}>اضغط Enter بعد كتابة الباسورد</p>
    </div>
)}
                {/* إذا اختار طبيب: نطلب رقم الموبايل للتحقق */}
{/* إذا اختار طبيب: نطلب الموبايل والباسورد للتحقق */}
{currentUser?.role === 'doctor_check' && (
    <div style={{ display: 'grid', gap: '10px' }}>
        <input 
            placeholder="رقم الموبايل المسجل" 
            style={inputStyle} 
            onChange={(e) => setCurrentUser({...currentUser, tempMobile: e.target.value})} 
        />
        <input 
            type="password"
            placeholder="كلمة المرور" 
            style={inputStyle} 
            onChange={(e) => setCurrentUser({...currentUser, tempPassword: e.target.value})} 
        />
        <button 
            onClick={() => {
                // البحث بالرقم والباسورد معاً والتأكد من التفعيل
                const doc = doctors.find(d => 
                    d.mobile === currentUser.tempMobile && 
                    d.password === currentUser.tempPassword && 
                    d.is_active
                );
                
                if(doc) {
                    const doctorData = { ...doc, role: 'doctor' };
                    
                    // 1. تحديث الحالة
                    setCurrentUser(doctorData);
                    
                    // 2. الحفظ في المتصفح
                    localStorage.setItem('saved_user', JSON.stringify(doctorData));
                    
                    // 3. التوجه للوحة التحكم وإغلاق المودال
                    setActivePage('doctor_dashboard'); 
                    setShowLoginModal(false);
                } else {
                    alert("عذراً، رقم الموبايل أو كلمة المرور غير صحيحة، أو الحساب لم يفعل بعد.");
                }
            }}
            style={{ 
                background: '#3498db', 
                color: '#fff', 
                border: 'none', 
                padding: '12px', 
                borderRadius: '8px', 
                cursor: 'pointer', 
                fontWeight: 'bold',
                marginTop: '5px'
            }}
        >
            دخول لوحة التحكم
        </button>
    </div>
)}
               <button 
  onClick={() => { 
    setShowLoginModal(false); 
    // إذا لم يكن هناك مستخدم حقيقي سجل دخوله (يعني لسه في مرحلة الاختيار أو إدخال البيانات)
    // نقوم بتصفير currentUser ليرجع المودال للحالة الأصلية في المرة القادمة
    if (!currentUser?.id && !isAdmin) {
      setCurrentUser(null); 
    }
  }} 
  style={{ width: '100%', marginTop: '15px', background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', fontSize: '14px' }}
>
  إلغاء وإغلاق
</button></div>
        </div>
      )}

      {/* 3. منطقة عرض المحتوى */}
     <main>
  {/* 1. لو الرابط فيه /dr/، افتح صفحة الدكتور وابعتلها الرقم اللي في العنوان */}
  {window.location.pathname.includes('/dr/') ? (
    <DirectBooking doctorId={window.location.pathname.split('/dr/')[1]} />
  ) : (
    /* 2. لو مفيش، كمل نظامك العادي بتاع امبارح */
    <>
      {activePage === 'home' && (
        <BookingPage 
          doctors={doctors} 
          fetchData={fetchData} 
          currentUser={currentUser} 
          openLogin={() => setShowLoginModal(true)} 
        />
      )}
      {activePage === 'direct_booking_page' && <DirectBooking />}
      {activePage === 'join' && <DoctorRegister />}
      {activePage === 'doctor_dashboard' && currentUser?.role === 'doctor' && (
        <DoctorDashboard doctorId={currentUser.id} />
      )}
      {activePage === 'admin' && isAdmin && (
        <AdminPage doctors={doctors} appointments={appointments} fetchData={fetchData} />
      )}
      {activePage === 'accounting' && isAdmin && (
        <AccountingPage doctors={doctors} appointments={appointments} />
      )}
    </>
  )}
</main>
    </div>
  );
}
export default App;