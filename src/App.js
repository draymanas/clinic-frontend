// App.js
import DoctorDashboard from './DoctorDashboard';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import AymanProfile from './AymanProfile';
// في بداية ملف App.js (مع الـ imports الأخرى)
import ServiceDetails from './ServiceDetails';
// استيراد المكونات الجديدة
import HomePage from './HomePage'; // الصفحة الرئيسية الجديدة
import SearchPage from './SearchPage'; // صفحة البحث الجديدة
import DirectBooking from './DirectBooking';
import QandA from './QandA'; // تأكد من المسار
import { Navigate } from 'react-router-dom'; // تأكد من استيراد 

import { useLocation, useNavigate } from 'react-router-dom';
import { FaBell, FaCheck } from 'react-icons/fa';

// --- 1. الثوابت العامة ---
const egyptLocations = {
    // ... (احتفظ بالثوابت هنا إذا لم تنقلها إلى ملف منفصل)
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
const medicalSpecialties = [
  "الكل", "أسنان", "أطفال وحديثي الولادة", "أنف وأذن وحنجرة", "باطنة", "تغذية علاجية",
  "جراحة أطفال", "جراحة أوعية دموية", "جراحة أورام", "جراحة تجميل", "جراحة سمنة ونحافة",
  "عظام", "جراحة قلب وصدر", "جراحة مخ وأعصاب", "جراحة مسالك بولية", "جلدية",
  "جهاز هضمي وكبد", "حساسية ومناعة", "رمد", "روماتيزم", "ذكورة وعقم", "علاج طبيعي", "غدد صماء وسكري",
  "جراحة عامه","امراض دم","قلب وأوعية دموية", "مخ وأعصاب", "نسا وتوليد", "تخاطب", "كلى", "جراحة عمود فقري", "صدر", "نفسي أطفال", "نفسي"
];


const inputStyle = { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', width: '100%', boxSizing: 'border-box' };

const getOptimizedImage = (url) => {
  if (!url) return null;
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

// ... (DoctorRegister, AdminPage, AccountingPage تبقى كما هي أو تنقل لملفاتها الخاصة)

// مكون تسجيل الدكتور (DoctorRegister)
function DoctorRegister() {
    const [newDoc, setNewDoc] = useState({ name: '', mobile: '', specialty: '',bio: '', fee: '', address: '', personal_mobile: '', title: '', city: '', area: '', password: '' });
    const [scheduleDetails, setScheduleDetails] = useState({});
    const [selectedFile, setSelectedFile] = useState(null);
    const weekDays = ["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"];
    const hoursArr = Array.from({ length: 12 }, (_, i) => i + 1);
    const periodsArr = ["صباحاً", "مساءً"];

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
                        {Object.keys(egyptLocations).map(g => <option key={g} value={g}>{g}</option>)}
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

// مكون صفحة الإدارة (AdminPage)

// ==========================================
// 🌟 المكون الرئيسي للوحة تحكم الإدارة المطورة (Admin Dashboard)
// ==========================================
function AdminPage({ doctors, appointments, fetchData }) {
  // التبويب النشط حالياً: 'doctors' | 'accounting' | 'appointments' | 'notifications' | 'consultations'
  const [activeTab, setActiveTab] = useState('doctors');

  // --- حالات إدارة الأطباء ---
  const [adminSearch, setAdminSearch] = useState('');
  const [adminSpecialty, setAdminSpecialty] = useState('الكل');

  // --- حالات الاستشارات الطبية ---
  const [consultations, setConsultations] = useState([]);
  const ADMIN_API_URL = "https://clinic-api-ig3d.onrender.com/api/admin/consultations";

  // --- حالات الإشعارات ---
  const [notifTarget, setNotifTarget] = useState('all_patients');
  const [selectedDoctorForNotif, setSelectedDoctorForNotif] = useState('');
  const [notifTitle, setNotifTitle] = useState('');
  const [notifBody, setNotifBody] = useState('');
  const [isSendingNotif, setIsSendingNotif] = useState(false);

  // جلب الاستشارات
  const fetchConsultations = async () => {
    try {
      const response = await fetch(ADMIN_API_URL);
      if (!response.ok) throw new Error("فشل في جلب البيانات");
      const data = await response.json();
      setConsultations(data);
    } catch (error) {
      console.error("Error fetching consultations:", error);
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, []);

  // دوال إدارة الأطباء
  const handleDelete = async (id) => {
    if (window.confirm("هل أنت متأكد من رغبتك في حذف هذا الطبيب نهائياً؟")) {
      await fetch(`https://clinic-api-ig3d.onrender.com/delete-doctor/${id}`, { method: 'DELETE' });
      fetchData();
    }
  };

  const handleToggle = async (id, s) => {
    await fetch(`https://clinic-api-ig3d.onrender.com/toggle-doctor/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: s })
    });
    fetchData();
  };

  const handleFeaturedToggle = async (id, currentStatus) => {
    try {
      await fetch(`https://clinic-api-ig3d.onrender.com/update-doctor-featured/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !currentStatus })
      });
      fetchData();
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleOrderChange = async (id, newOrder) => {
    try {
      await fetch(`https://clinic-api-ig3d.onrender.com/update-doctor-order/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sort_order: newOrder || 999 })
      });
      fetchData();
    } catch (err) {
      console.error("Error updating order:", err);
    }
  };

  // الرد على الاستشارة
  const handleAnswerSubmit = async (id, answerText, currentStatus) => {
    try {
      const response = await fetch(`${ADMIN_API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer: answerText, status: currentStatus })
      });
      if (response.ok) {
        alert("✅ تم حفظ الرد وتحديث حالة الاستشارة بنجاح!");
        fetchConsultations();
      } else {
        throw new Error("فشل التحديث");
      }
    } catch (error) {
      alert("❌ حدث خطأ أثناء حفظ الرد");
    }
  };

  // إرسال الإشعارات من السيرفر
  const handleSendNotification = async (e) => {
    e.preventDefault();
    if (!notifTitle.trim() || !notifBody.trim()) {
      alert("يرجى إدخال عنوان الإشعار ونصه");
      return;
    }

    setIsSendingNotif(true);
    try {
      const payload = {
        targetType: notifTarget,
        targetId: notifTarget === 'specific_doctor' ? selectedDoctorForNotif : undefined,
        title: notifTitle,
        body: notifBody
      };

      const res = await fetch("https://clinic-api-ig3d.onrender.com/api/send-bulk-notification", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const resData = await res.json();
      if (res.ok) {
        alert(`✅ ${resData.message || 'تم إرسال الإشعار بنجاح!'}`);
        setNotifTitle('');
        setNotifBody('');
      } else {
        alert(`⚠️ ${resData.error || 'فشل إرسال الإشعار'}`);
      }
    } catch (err) {
      console.error(err);
      alert("❌ حدث خطأ أثناء الاتصال بخادم الإشعارات");
    } finally {
      setIsSendingNotif(false);
    }
  };

  // فلترة الأطباء
  const medicalSpecialties = [
    'مخ وأعصاب', 'جراحة مخ وأعصاب', 'عظام', 'باطنة', 'أطفال', 'نساء وتوليد',
    'قلب وأوعية دموية', 'جلدية', 'عيون', 'أنف وأذن وحنجرة', 'مسالك بولية', 'علاج طبيعي'
  ];

  const filteredAdminDoctors = (doctors || []).filter(d => {
    const matchName = (d.name || '').toLowerCase().includes(adminSearch.toLowerCase());
    const matchSpecialty = adminSpecialty === 'الكل' || d.specialty === adminSpecialty;
    return matchName && matchSpecialty;
  });

  // قائمة أزرار القائمة الجانبية بالترتيب المطلوب
  const menuItems = [
    { id: 'doctors', title: 'إدارة الأطباء', icon: '👨‍⚕️' },
    { id: 'accounting', title: 'إدارة الحسابات', icon: '💰' },
    { id: 'appointments', title: 'إدارة الحجوزات', icon: '📅' },
    { id: 'notifications', title: 'الإشعارات', icon: '🔔' },
    { id: 'consultations', title: 'الاستشارات الطبية', icon: '💬' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', direction: 'rtl', fontFamily: 'Cairo, sans-serif', background: '#f1f5f9' }}>
      
      {/* 🌟 1. العمود الجانبي (Sidebar) على اليمين */}
      <aside style={{
        width: '260px',
        backgroundColor: '#1e293b',
        color: '#fff',
        padding: '24px 14px',
        boxShadow: '-4px 0 15px rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        flexShrink: 0
      }}>
        <div style={{ textAlign: 'center', paddingBottom: '20px', borderBottom: '1px solid #334155', marginBottom: '12px' }}>
          <h3 style={{ margin: '0 0 6px 0', fontSize: '20px', color: '#38bdf8', fontWeight: '800' }}>لوحة الإدارة</h3>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>منصة دكتور | DoctorEG</span>
        </div>

        {/* أزرار التبويبات بالترتيب المطلوب */}
        {menuItems.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '13px 16px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: isActive ? '#0284c7' : 'transparent',
                color: isActive ? '#fff' : '#cbd5e1',
                fontSize: '15.5px',
                fontWeight: isActive ? '700' : '500',
                cursor: 'pointer',
                textAlign: 'right',
                transition: 'all 0.2s ease',
                boxShadow: isActive ? '0 4px 12px rgba(2,132,199,0.3)' : 'none'
              }}
            >
              <span style={{ fontSize: '20px' }}>{item.icon}</span>
              <span>{item.title}</span>
            </button>
          );
        })}
      </aside>

      {/* 🌟 2. منطقة العرض الرئيسية (Main Content) */}
      <main style={{ flex: 1, padding: '30px 35px', overflowY: 'auto' }}>

        {/* -------------------- 1. إدارة الأطباء -------------------- */}
        {activeTab === 'doctors' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
              <h2 style={{ margin: 0, color: '#0f172a', fontSize: '24px', fontWeight: '800' }}>👨‍⚕️ إدارة الأطباء</h2>
              <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '6px 16px', borderRadius: '20px', fontWeight: 'bold', fontSize: '14px' }}>
                إجمالي الأطباء: {doctors ? doctors.length : 0}
              </span>
            </div>

            {/* أدوات البحث والفلترة */}
            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', backgroundColor: '#fff', padding: '16px', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="🔍 ابحث باسم الدكتور..."
                style={{ flex: 2, minWidth: '220px', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '15px', outline: 'none' }}
                onChange={(e) => setAdminSearch(e.target.value)}
              />
              <select
                style={{ flex: 1, minWidth: '180px', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '15px', outline: 'none', background: '#fff' }}
                onChange={(e) => setAdminSpecialty(e.target.value)}
              >
                <option value="الكل">كل التخصصات</option>
                {medicalSpecialties.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* جدول الأطباء */}
            <div style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.04)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
                <thead style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <tr>
                    <th style={{ padding: '14px 18px', color: '#475569' }}>الدكتور</th>
                    <th style={{ padding: '14px 18px', color: '#475569' }}>المحافظة والمنطقة</th>
                    <th style={{ padding: '14px 18px', color: '#475569', textAlign: 'center' }}>مميز ⭐</th>
                    <th style={{ padding: '14px 18px', color: '#475569' }}>الحالة</th>
                    <th style={{ padding: '14px 18px', color: '#475569', textAlign: 'center' }}>الترتيب</th>
                    <th style={{ padding: '14px 18px', color: '#475569', textAlign: 'center' }}>الإجراء</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAdminDoctors.map(d => (
                    <tr key={d.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '14px 18px', fontWeight: 'bold', color: '#1e293b' }}>
                        {d.name}
                        <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 'normal' }}>{d.specialty}</div>
                      </td>
                      <td style={{ padding: '14px 18px', color: '#475569' }}>{d.city} - {d.area || 'عام'}</td>
                      <td style={{ textAlign: 'center', padding: '14px' }}>
                        <input
                          type="checkbox"
                          checked={d.featured || false}
                          onChange={() => handleFeaturedToggle(d.id, d.featured)}
                          style={{ cursor: 'pointer', transform: 'scale(1.3)' }}
                        />
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '4px 10px',
                          borderRadius: '8px',
                          fontSize: '12.5px',
                          fontWeight: 'bold',
                          background: d.is_active ? '#dcfce7' : '#fee2e2',
                          color: d.is_active ? '#166534' : '#991b1b'
                        }}>
                          {d.is_active ? '✅ مفعل' : '❌ متوقف'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center', padding: '14px' }}>
                        <input
                          type="number"
                          defaultValue={d.sort_order === 999 ? '' : d.sort_order}
                          placeholder="999"
                          style={{ width: '60px', textAlign: 'center', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: 'bold' }}
                          onBlur={(e) => handleOrderChange(d.id, e.target.value)}
                        />
                      </td>
                      <td style={{ textAlign: 'center', padding: '14px 18px' }}>
                        <button
                          onClick={() => handleToggle(d.id, !d.is_active)}
                          style={{
                            background: d.is_active ? '#f59e0b' : '#10b981',
                            color: '#fff',
                            border: 'none',
                            padding: '6px 14px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '13px',
                            marginLeft: '8px'
                          }}
                        >
                          {d.is_active ? 'إيقاف' : 'تفعيل'}
                        </button>
                        <button
                          onClick={() => handleDelete(d.id)}
                          style={{
                            background: '#fee2e2',
                            color: '#ef4444',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '13px'
                          }}
                        >
                          حذف
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* -------------------- 2. إدارة الحسابات -------------------- */}
        {activeTab === 'accounting' && (
          <AccountingPage doctors={doctors} appointments={appointments} />
        )}

        {/* -------------------- 3. إدارة الحجوزات -------------------- */}
        {activeTab === 'appointments' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
              <h2 style={{ margin: 0, color: '#0f172a', fontSize: '24px', fontWeight: '800' }}>📅 سجل الحجوزات</h2>
              <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '6px 16px', borderRadius: '20px', fontWeight: 'bold', fontSize: '14px' }}>
                إجمالي الحجوزات: {appointments ? appointments.length : 0}
              </span>
            </div>

            <div style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.04)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
                <thead style={{ background: '#0f172a', color: '#fff' }}>
                  <tr>
                    <th style={{ padding: '14px 18px' }}>المريض</th>
                    <th style={{ padding: '14px 18px' }}>الموبايل</th>
                    <th style={{ padding: '14px 18px' }}>الدكتور والعيادة</th>
                    <th style={{ padding: '14px 18px' }}>تاريخ الحجز</th>
                    <th style={{ padding: '14px 18px' }}>الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {(appointments || []).map(app => (
                    <tr key={app.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '14px 18px', fontWeight: 'bold', color: '#1e293b' }}>{app.patient_name}</td>
                      <td style={{ padding: '14px 18px', color: '#475569', direction: 'ltr', textAlign: 'right' }}>{app.mobile}</td>
                      <td style={{ padding: '14px 18px', color: '#0369a1', fontWeight: '600' }}>{app.doctor_name}</td>
                      <td style={{ padding: '14px 18px', color: '#16a34a', fontWeight: 'bold' }}>
                        {app.booking_date || app.appointment_date
                          ? new Date(app.booking_date || app.appointment_date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })
                          : "غير محدد"}
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          background: app.status === 'completed' ? '#dcfce7' : '#fef3c7',
                          color: app.status === 'completed' ? '#166534' : '#92400e'
                        }}>
                          {app.status === 'completed' ? 'مكتمل' : 'قيد الانتظار'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* -------------------- 4. إدارة الإشعارات -------------------- */}
        {activeTab === 'notifications' && (
          <div>
            <h2 style={{ margin: '0 0 25px 0', color: '#0f172a', fontSize: '24px', fontWeight: '800' }}>🔔 إرسال الإشعارات</h2>
            
            <div style={{ background: '#fff', padding: '30px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.04)', maxWidth: '650px' }}>
              <form onSubmit={handleSendNotification}>
                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#334155' }}>الفئة المستهدفة:</label>
                  <select
                    value={notifTarget}
                    onChange={(e) => setNotifTarget(e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '15px', background: '#fff' }}
                  >
                    <option value="all_patients">📢 جميع المرضى المسجلين</option>
                    <option value="all_doctors">👨‍⚕️ جميع الأطباء المشتركين</option>
                    <option value="specific_doctor">🎯 طبيب محدد بالاسم</option>
                  </select>
                </div>

                {notifTarget === 'specific_doctor' && (
                  <div style={{ marginBottom: '18px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#334155' }}>اختر الطبيب:</label>
                    <select
                      value={selectedDoctorForNotif}
                      onChange={(e) => setSelectedDoctorForNotif(e.target.value)}
                      required
                      style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '15px', background: '#fff' }}
                    >
                      <option value="">-- اضغط لاختيار الطبيب --</option>
                      {(doctors || []).map(d => (
                        <option key={d.id} value={d.id}>{d.name} ({d.specialty})</option>
                      ))}
                    </select>
                  </div>
                )}

                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#334155' }}>عنوان الإشعار:</label>
                  <input
                    type="text"
                    placeholder="مثال: تنبيه هام بخصوص مواعيد العيادة"
                    value={notifTitle}
                    onChange={(e) => setNotifTitle(e.target.value)}
                    required
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '15px', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#334155' }}>نص الرسالة / الإشعار:</label>
                  <textarea
                    rows={4}
                    placeholder="اكتب تفاصيل الإشعار هنا..."
                    value={notifBody}
                    onChange={(e) => setNotifBody(e.target.value)}
                    required
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '15px', boxSizing: 'border-box', resize: 'vertical' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSendingNotif}
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: isSendingNotif ? '#94a3b8' : '#0284c7',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: isSendingNotif ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 12px rgba(2,132,199,0.3)'
                  }}
                >
                  {isSendingNotif ? 'جاري إرسال الإشعار...' : '🚀 إرسال الإشعار الآن'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* -------------------- 5. الاستشارات الطبية -------------------- */}
        {activeTab === 'consultations' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
              <h2 style={{ margin: 0, color: '#0f172a', fontSize: '24px', fontWeight: '800' }}>💬 استشارات المرضى</h2>
              <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '6px 16px', borderRadius: '20px', fontWeight: 'bold', fontSize: '14px' }}>
                إجمالي الاستشارات: {consultations.length}
              </span>
            </div>

            <div style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.04)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
                <thead style={{ background: '#1e293b', color: '#fff' }}>
                  <tr>
                    <th style={{ padding: '14px 16px' }}>الاسم والموبايل</th>
                    <th style={{ padding: '14px 16px', width: '35%' }}>السؤال</th>
                    <th style={{ padding: '14px 16px' }}>الحالة</th>
                    <th style={{ padding: '14px 16px', width: '30%' }}>الإجابة والرد</th>
                    <th style={{ padding: '14px 16px', textAlign: 'center' }}>إجراء</th>
                  </tr>
                </thead>
                <tbody>
                  {consultations.map(c => {
                    let localAnswer = c.answer || "";
                    let localStatus = c.status || "pending";

                    return (
                      <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: 'bold', color: '#1e293b' }}>{c.name}</div>
                          <div style={{ fontSize: '13px', color: '#64748b', direction: 'ltr', textAlign: 'right' }}>{c.phone}</div>
                        </td>
                        <td style={{ padding: '14px 16px', color: '#334155', lineHeight: '1.6', fontSize: '14.5px' }}>
                          {c.question}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <select
                            defaultValue={c.status}
                            onChange={(e) => { localStatus = e.target.value; }}
                            style={{ padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#fff' }}
                          >
                            <option value="pending">⏳ معلق</option>
                            <option value="answered">✅ تم الرد</option>
                          </select>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <textarea
                            placeholder="اكتب إجابة الاستشارة هنا..."
                            defaultValue={c.answer}
                            rows={3}
                            style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px', boxSizing: 'border-box' }}
                            onChange={(e) => { localAnswer = e.target.value; }}
                          />
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                          <button
                            onClick={() => handleAnswerSubmit(c.id, localAnswer, localStatus)}
                            style={{
                              background: '#0284c7',
                              color: '#fff',
                              border: 'none',
                              padding: '8px 16px',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              fontWeight: 'bold',
                              fontSize: '13px',
                              boxShadow: '0 2px 6px rgba(2,132,199,0.3)'
                            }}
                          >
                            حفظ
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

// ==========================================
// 🌟 صفحة الحسابات المدمجة
// ==========================================
function AccountingPage({ doctors, appointments }) {
  const [selectedDocId, setSelectedDocId] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  // فلترة الحجوزات المكتملة
  const doctorAppointments = (appointments || []).filter(app => {
    const currentDoc = (doctors || []).find(d => d.id === parseInt(selectedDocId));
    const isSameDoctor = Number(app.doctor_id) === Number(currentDoc?.id);
    const appDate = new Date(app.booking_date || app.appointment_date);
    const isSameMonth = (appDate.getMonth() + 1) === parseInt(selectedMonth);
    const isCompleted = app.status === 'completed';
    return isSameDoctor && isSameMonth && isCompleted;
  });

  const currentDoc = (doctors || []).find(d => Number(d.id) === Number(selectedDocId));
  const totalAmount = doctorAppointments.length * (currentDoc?.fee || 0);
  const platformFee = totalAmount * 0.20; // نسبة الـ 20%

  const finalMessage = `
🧾 فاتورة مستحقات المنصة - شهر ${selectedMonth}
👨‍⚕️ دكتور: ${currentDoc?.name || 'غير محدد'}
📊 عدد الحجوزات: ${doctorAppointments.length}
💰 إجمالي الكشوفات: ${totalAmount} ج.م
🏦 نسبة المنصة (20%): ${platformFee} ج.م

✅ طرق الدفع المتاحة:
📱 فودافون كاش: 01032368436
💸 إنستاباي: draymanas@instapay
برجاء إرسال صورة التحويل بعد الدفع.
  `;

  return (
    <div>
      <h2 style={{ margin: '0 0 25px 0', color: '#0f172a', fontSize: '24px', fontWeight: '800' }}>💰 نظام الحسابات والتحصيل</h2>

      <div style={{ display: 'flex', gap: '15px', marginBottom: '25px', flexWrap: 'wrap' }}>
        <select
          onChange={e => setSelectedDocId(e.target.value)}
          value={selectedDocId}
          style={{ padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '15px', background: '#fff', minWidth: '240px' }}
        >
          <option value="">-- اختر الدكتور والفرع --</option>
          {(doctors || []).map(d => (
            <option key={d.id} value={d.id}>
              {d.name} - ({d.area || 'فرع عام'})
            </option>
          ))}
        </select>

        <select
          onChange={e => setSelectedMonth(e.target.value)}
          value={selectedMonth}
          style={{ padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '15px', background: '#fff' }}
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>شهر {i + 1}</option>
          ))}
        </select>
      </div>

      {selectedDocId && (
        <div style={{ background: '#fff', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.04)', maxWidth: '600px' }}>
          <h3 style={{ borderBottom: '2px solid #f1f5f9', paddingBottom: '12px', margin: '0 0 16px 0', color: '#1e293b' }}>تفاصيل الفاتورة</h3>
          <p style={{ fontSize: '15px', margin: '8px 0' }}>عدد الحجوزات المكتملة: <b>{doctorAppointments.length}</b></p>
          <p style={{ fontSize: '15px', margin: '8px 0' }}>إجمالي مبلغ الكشوفات: <b>{totalAmount} ج.م</b></p>
          <p style={{ color: '#ef4444', fontSize: '18px', fontWeight: 'bold', margin: '12px 0' }}>مستحقات المنصة (20%): <b>{platformFee} ج.م</b></p>

          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', marginTop: '20px', border: '1px solid #e2e8f0' }}>
            <pre style={{ whiteSpace: 'pre-line', fontSize: '13.5px', fontFamily: 'inherit', margin: 0, color: '#334155' }}>{finalMessage}</pre>
          </div>

          <button
            onClick={() => window.open(`https://wa.me/2${currentDoc?.personal_mobile || currentDoc?.mobile}?text=${encodeURIComponent(finalMessage)}`, '_blank')}
            style={{
              width: '100%',
              padding: '14px',
              background: '#16a34a',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '16px',
              marginTop: '18px',
              boxShadow: '0 4px 12px rgba(22,163,74,0.3)'
            }}
          >
            💬 إرسال الفاتورة للدكتور (واتساب)
          </button>
        </div>
      )}
    </div>
  );
}



// -// --- 5. المكون الرئيسي (App) ---
function App() {
    const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false); 
  const [activePage, setActivePage] = useState('home'); 
  const [currentUser, setCurrentUser] = useState(null); 
  const [showLoginModal, setShowLoginModal] = useState(false); 
  const [loginId, setLoginId] = useState(''); 
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);

  const fetchData = async () => {
    try {
      const resDocs = await fetch('https://clinic-api-ig3d.onrender.com/doctors');
      setDoctors(await resDocs.json());
      const resApps = await fetch('https://clinic-api-ig3d.onrender.com/appointments');
      setAppointments(await resApps.json());
    } catch (e) { console.error("Error fetching data"); }
  };

useEffect(() => {
    const savedUser = localStorage.getItem('saved_user');
    const savedId = localStorage.getItem('saved_doctor_id');

    if (savedUser) {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);

        if (user.role === 'doctor') {
            navigate('/dashboard');
        } else if (user.role === 'admin') {
            setIsAdmin(true);
            navigate('/admin');
        }
        
    } else if (savedId) {
        setCurrentUser({ 
            role: 'doctor_check', 
            tempId: savedId || '', 
            tempMobile: '', 
            tempPassword: '' 
        });
    }
    fetchData(); 
}, []);



// داخل دالة المكون الرئيسي App:
const [activeNotification, setActiveNotification] = useState(null);
const location = useLocation();
 

useEffect(() => {
  // فحص ما إذا كان المستخدم دخل من خلال الضغط على إشعار
  const params = new URLSearchParams(location.search);
  const notifTitle = params.get('notif_title');
  const notifBody = params.get('notif_body');

  if (notifTitle || notifBody) {
    setActiveNotification({
      title: notifTitle || 'إشعار جديد',
      body: notifBody || ''
    });

    // تنظيف الرابط في المتصفح ليبقى الرابط نظيفاً
    const cleanUrl = window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);
  }
}, [location]);

useEffect(() => {
    const path = window.location.pathname;
    
    if (path.includes('/dr/')) {
        const idFromUrl = path.split('/dr/')[1];
        
        setSelectedDoctorId(idFromUrl); 
        navigate(`/dr/${idFromUrl}`); 
        
        
    }
}, []);
  const navBtnStyle = {
    background: 'none', border: 'none', color: '#fff', cursor: 'pointer',
    fontWeight: 'bold', fontSize: '16px', padding: '10px 15px', borderRadius: '8px',
    transition: '0.3s'
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setCurrentUser(null);
    localStorage.removeItem('saved_user'); // إزالة بيانات المستخدم عند الخروج
    localStorage.removeItem('saved_doctor_id'); // إزالة كود الدكتور
    navigate('/')
  };

  return (
    
    <div style={{ direction: 'rtl', fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
      
      {/* 1. شريط التنقل العلوي (النافبار) */}
      <nav style={{ 
        padding: '8px 15px', 
        background: '#2c3e50', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        position: 'sticky', 
        top: 0, 
        zIndex: 1000, 
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        flexWrap: 'wrap', 
        gap: '10px'
      }}>

        {/* --- مكان اللوجو الجديد --- */}
<div 
 onClick={() => navigate('/')}
  style={{ 
    cursor: 'pointer', 
    display: 'flex', 
    alignItems: 'center',
    height: '100%' 
  }}
>
  <img 
    src="/logo512.webp" 
    alt="منصة دكتور" 
    style={{ 
      height: '60px', 
      maxHeight: '100%', 
      width: 'auto', 
      objectFit: 'contain',
      paddingRight: '10px' 
    }} 
    onError={(e) => { e.target.src = "/logo.webp" }} 
  />
</div>

        {/* --- حاوية الزراير --- */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'nowrap' }}>
        {currentUser?.role !== 'doctor' && (
  <button onClick={() => navigate('/')} style={{...navBtnStyle, backgroundColor: window.location.pathname === '/' ? '#3498db' : 'transparent'}}>🏠 الرئيسية</button>
)}
 {(currentUser?.role !== 'admin' && currentUser?.role !== 'patient') && (
  <button 
    onClick={() => navigate('/join')} 
    style={{...navBtnStyle, backgroundColor: activePage === 'join' ? '#3498db' : 'transparent'}}
  >
    👨‍⚕️ انضمام طبيب
  </button>
)}
        {isAdmin && (
          <>
            <button onClick={() => navigate('/admin')} style={{...navBtnStyle, backgroundColor: activePage === 'admin' ? '#e67e22' : 'transparent'}}>⚙️ الإدارة</button>
            <button onClick={() => navigate('/accounting')} style={{...navBtnStyle, backgroundColor: activePage === 'accounting' ? '#e67e22' : 'transparent'}}>💰 الحسابات</button>
          </>
        )}
           {currentUser?.role === 'doctor' && (
  <button 
    onClick={() => navigate('/dashboard')}
    style={{...navBtnStyle, backgroundColor: activePage === 'doctor_dashboard' ? '#2ecc71' : 'transparent', color: '#fff'}}
  >
    📊 لوحة التحكم
  </button>
)}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
          {!currentUser ? (
            <button onClick={() => setShowLoginModal(true)} style={{...navBtnStyle, background: '#27ae60', fontSize: '14px'}}>🔐 دخول</button>
          ) : (
            <>
      <button 
        onClick={handleLogout} 
        style={{
          ...navBtnStyle, 
          backgroundColor: '#e74c3c', 
          fontSize: '14px',        
          padding: '8px 15px',     
          width: '100%',           
          marginBottom: '5px',      
          marginTop: '2px'         
        }}
      >
        خروج
      </button>

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
   <button 
  onClick={() => {
    const savedId = localStorage.getItem('saved_doctor_id') || '';
    setCurrentUser({
      role: 'doctor_check',
      tempId: savedId 
    });
  }} 
  style={{
    flex:1, 
    padding: '10px', 
    cursor:'pointer', 
    borderRadius: '8px', 
    border: currentUser?.role === 'doctor_check' ? '2px solid #3498db' : '1px solid #ddd'
  }}
>
  أنا طبيب
</button>
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
                localStorage.setItem('saved_user', JSON.stringify(currentUser));
                setShowLoginModal(false); 
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
                    const adminData = {name: 'Admin', role: 'admin'};
                    
                    setIsAdmin(true);
                    setCurrentUser(adminData);
                   navigate('/admin');
                    
                    localStorage.setItem('saved_user', JSON.stringify(adminData));
                    
                    setShowLoginModal(false);
                }
            }} 
        />
        <p style={{fontSize:'12px', color:'gray', textAlign: 'center'}}>اضغط Enter بعد كتابة الباسورد</p>
    </div>
)}
                {currentUser?.role === 'doctor_check' && (
    <div style={{ display: 'grid', gap: '10px' }}>
        <input 
    placeholder="كود الدكتور (ID)" 
    style={{...inputStyle, backgroundColor: '#fff9e6'}} 
    value={currentUser.tempId || ''}
    onChange={(e) => setCurrentUser({...currentUser, tempId: e.target.value})} 
/>
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
    const doc = doctors.find(d => 
        String(d.id) === String(currentUser?.tempId) && 
        d.mobile === currentUser?.tempMobile && 
        d.password === currentUser?.tempPassword && 
        d.is_active
    );

    if (doc) {
        const doctorData = { ...doc, role: 'doctor' };

        localStorage.setItem('saved_doctor_id', doc.id); 
        localStorage.setItem('saved_user', JSON.stringify(doctorData)); 

        setCurrentUser(doctorData);

        navigate('/dashboard');
        setShowLoginModal(false);
    } else {
        alert("عذراً، تأكد من (الكود) أو (رقم الموبايل) أو (كلمة المرور)، أو أن الحساب لم يفعل بعد.");
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

      {/* 🌟 نافذة عرض تفاصيل الإشعار بالكامل عند الضغط عليه */}
      {activeNotification && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          direction: 'rtl',
          fontFamily: 'Cairo, sans-serif',
          padding: '20px'
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '24px',
            padding: '30px',
            maxWidth: '500px',
            width: '100%',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            textAlign: 'center',
            animation: 'fadeIn 0.3s ease'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: '#e0f2fe',
              color: '#0284c7',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              fontSize: '28px'
            }}>
              🔔
            </div>

            <h3 style={{
              fontSize: '20px',
              color: '#0f172a',
              margin: '0 0 14px 0',
              fontWeight: '800'
            }}>
              {activeNotification.title}
            </h3>

            <div style={{
              background: '#f8fafc',
              padding: '16px',
              borderRadius: '14px',
              color: '#334155',
              fontSize: '15.5px',
              lineHeight: '1.8',
              whiteSpace: 'pre-wrap',
              textAlign: 'right',
              marginBottom: '24px',
              border: '1px solid #e2e8f0',
              maxHeight: '300px',
              overflowY: 'auto'
            }}>
              {activeNotification.body}
            </div>

            <button
              onClick={() => setActiveNotification(null)}
              style={{
                width: '100%',
                padding: '12px',
                background: '#0284c7',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)'
              }}
            >
              تمت القراءة وإغلاق
            </button>
          </div>
        </div>
      )}

      {/* 3. منطقة عرض المحتوى */}
     <main>
        <Routes>
            {/* الصفحة الرئيسية الجديدة */}
            <Route path="/" element={<HomePage />} />

            {/* صفحة البحث الجديدة */}
            <Route 
                path="/search" 
                element={
                    <SearchPage 
                        doctors={doctors} 
                        fetchData={fetchData} 
                        currentUser={currentUser} 
                        openLogin={() => setShowLoginModal(true)} 
                    />
                } 
            />

             {/* 🌟 رابط المشاركة فائق الاختصار للتعليقات والسوشيال ميديا */}
<Route path="/d/:slugOrId" element={<DirectBooking />} />

{/* روت صفحة الدكتور الأساسية برابط الـ SEO */}
<Route path="/dr/:slugOrId/:seoSlug?" element={<DirectBooking />} />
<Route path="/dr/:slugOrId" element={<DirectBooking />} />

           <Route path="/d/ayman" element={<AymanProfile />} />
<Route path="/ayman" element={<AymanProfile />} />
<Route path="/dr/دكتور-ايمن-عجيب-استشاري-مخ-وأعصاب-وعمود-فقري" element={<AymanProfile />} />
            {/* 2. الروت القديم: لا نحذفه، بل يوجه المتصفح تلقائياً للرابط الجديد */}
<Route 
  path="/dr_ayman_aguib" 
  element={<Navigate to="/dr/دكتور-ايمن-عجيب-استشاري-مخ-وأعصاب-وعمود-فقري" replace />} 
/>

            {/* الرابط الجديد الاحترافي لصفحة د. أيمن عجيب */}
<Route path="/dr/دكتور-ايمن-عجيب-استشاري-مخ-وأعصاب-وعمود-فقري" element={<AymanProfile />} />

{/* الرابط القديم لضمان استمرار عمله */}
<Route path="/dr_ayman_aguib" element={<AymanProfile />} />

              {/* هذا هو السطر الذي ينقصك */}
              <Route path="/service/:serviceId" element={<ServiceDetails />} />

            {/* صفحة انضمام طبيب */}
            <Route path="/join" element={<DoctorRegister />} />

            {/* لوحة تحكم الأطباء */}
            <Route path="/dashboard" element={<DoctorDashboard doctorId={currentUser?.id} />} />

            {/* صفحة الحجز المباشر (الديناميكية) */}
            <Route path="/dr/:doctorCode" element={<DirectBooking />} />

            {/* صفحة الإدارة (AdminPage) */}
            <Route path="/admin" element={
                <AdminPage 
                    doctors={doctors} 
                    appointments={appointments} 
                    fetchData={fetchData} 
                />
            } />
            {/* مسارات البحث والصفحات النظيفة المتوافقة مع Google SEO */}
<Route path="/search" element={<SearchPage />} />
<Route path="/search/:specialtyParam/:cityParam/:areaParam" element={<SearchPage />} />
<Route path="/search/:specialtyParam/:cityParam" element={<SearchPage />} />
<Route path="/search/:specialtyParam" element={<SearchPage />} />

<Route path="/doctors/:specialtyParam/:cityParam/:areaParam" element={<SearchPage />} />
<Route path="/doctors/:specialtyParam/:cityParam" element={<SearchPage />} />
<Route path="/doctors/:specialtyParam" element={<SearchPage />} />
<Route path="/doctors" element={<SearchPage />} />

// في ملف App.js أضف هذا السطر في مكان الـ Routes
<Route path="/free-consultations" element={<QandA />} />

            {/* صفحة الحسابات (AccountingPage) */}
            <Route path="/accounting" element={
                <AccountingPage 
                    doctors={doctors} 
                    appointments={appointments} 
                />
            } />
        </Routes>
    </main>
    </div>
  );
}
export default App;