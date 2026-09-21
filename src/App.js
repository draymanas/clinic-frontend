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
import { useLocation } from 'react-router-dom';
import { FaBell, FaCheck } from 'react-icons/fa';
import NotificationPage from './NotificationPage';
import { requestForToken, onMessageListener } from './firebase';
import SymptomsPage from './SymptomsPage';

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
  // تحسين صور كلاودينري أوتوماتيكياً لأقصى سرعة وخفة
  if (url.includes('cloudinary.com')) {
    return url.replace('/image/upload/', '/image/upload/w_200,h_200,c_fill,f_auto,q_auto/');
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
  // ==========================================
// 🩺 حالات تحرير الاستشارة الجديدة
// ==========================================

const [consultationDrafts, setConsultationDrafts] = useState({});

const [savingConsultationId, setSavingConsultationId] = useState(null);

const [consultationFilter, setConsultationFilter] = useState('all');
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
 // ==========================================
// 🩺 حفظ / نشر استشارة
// ==========================================

const handleAnswerSubmit = async (id, draft) => {

  if (!draft) {
    alert("❌ لم يتم العثور على بيانات الاستشارة.");
    return;
  }

  const answerText = (draft.answer || '').trim();

  if (!answerText) {
    alert("⚠️ من فضلك اكتب الرد الطبي أولاً.");
    return;
  }

  if (draft.status === 'answered' && !draft.specialty) {
    alert("⚠️ من فضلك اختر التخصص المقترح.");
    return;
  }

  if (draft.is_published && !draft.specialty) {
    alert("⚠️ لا يمكن نشر الاستشارة بدون تحديد التخصص.");
    return;
  }

  try {

    setSavingConsultationId(id);

    const response = await fetch(
      `${ADMIN_API_URL}/${id}`,
      {
        method: 'PUT',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({

          answer: answerText,

          status: draft.status || 'pending',

          specialty:
            draft.specialty || null,

          doctor_id:
            draft.doctor_id
              ? Number(draft.doctor_id)
              : null,

          service_id:
            draft.service_id || null,

          is_published:
            Boolean(draft.is_published)

        })
      }
    );

    const data = await response.json();

    if (!response.ok) {

      throw new Error(
        data?.error ||
        "فشل تحديث الاستشارة"
      );

    }

    alert(
      draft.is_published
        ? "✅ تم حفظ الرد ونشر الاستشارة للعامة بنجاح."
        : "✅ تم حفظ الاستشارة بنجاح."
    );

    await fetchConsultations();

  } catch (error) {

    console.error(
      "❌ خطأ أثناء حفظ الاستشارة:",
      error
    );

    alert(
      `❌ ${error.message || 'حدث خطأ أثناء الحفظ'}`
    );

  } finally {

    setSavingConsultationId(null);

  }
};

// ==========================================
// ✏️ تحديث بيانات استشارة أثناء التحرير
// ==========================================

const updateConsultationDraft = (id, field, value) => {

  setConsultationDrafts(prev => ({

    ...prev,

    [id]: {

      ...(prev[id] || {}),

      [field]: value

    }

  }));

};

// ==========================================
// 📋 الحصول على بيانات التحرير الحالية
// ==========================================

const getConsultationDraft = (consultation) => {

  return {

    answer:
      consultationDrafts[consultation.id]?.answer
      ??
      consultation.answer
      ??
      '',

    status:
      consultationDrafts[consultation.id]?.status
      ??
      consultation.status
      ??
      'pending',

    specialty:
      consultationDrafts[consultation.id]?.specialty
      ??
      consultation.specialty
      ??
      '',

    doctor_id:
      consultationDrafts[consultation.id]?.doctor_id
      ??
      consultation.doctor_id
      ??
      '',

    service_id:
      consultationDrafts[consultation.id]?.service_id
      ??
      consultation.service_id
      ??
      '',

    is_published:
      consultationDrafts[consultation.id]?.is_published
      ??
      consultation.is_published
      ??
      false

  };

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
{/* =====================================================
    🩺 نظام "احكي لنا عن أعراضك"
    لوحة إدارة الاستفسارات
===================================================== */}

{activeTab === 'consultations' && (

  <div
    style={{
      direction: 'rtl'
    }}
  >

    {/* ==========================================
        Header
    ========================================== */}

    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '15px',
        flexWrap: 'wrap',
        marginBottom: '25px'
      }}
    >

      <div>

        <h2
          style={{
            margin: 0,
            color: '#0f172a',
            fontSize: '25px',
            fontWeight: '800'
          }}
        >
          🩺 استفسارات المرضى
        </h2>

        <p
          style={{
            margin: '7px 0 0',
            color: '#64748b',
            fontSize: '14px'
          }}
        >
          مراجعة الأعراض وتوجيه المريض إلى التخصص والطبيب المناسب
        </p>

      </div>


      {/* عدد الاستفسارات */}

      <div
        style={{
          background: '#e0f2fe',
          color: '#0369a1',
          padding: '9px 17px',
          borderRadius: '20px',
          fontWeight: '800'
        }}
      >
        📋 {consultations.length} استفسار
      </div>

    </div>


    {/* ==========================================
        Filter
    ========================================== */}

    <div
      style={{
        background: '#fff',
        borderRadius: '16px',
        padding: '15px',
        marginBottom: '20px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}
    >

      <span
        style={{
          fontWeight: '800',
          color: '#334155'
        }}
      >
        عرض:
      </span>


      <button
        type="button"
        onClick={() =>
          setConsultationFilter('all')
        }
        style={{
          border: 'none',
          borderRadius: '10px',
          padding: '8px 15px',
          cursor: 'pointer',
          fontWeight: '700',
          background:
            consultationFilter === 'all'
              ? '#0284c7'
              : '#f1f5f9',
          color:
            consultationFilter === 'all'
              ? '#fff'
              : '#475569'
        }}
      >
        الكل
      </button>


      <button
        type="button"
        onClick={() =>
          setConsultationFilter('pending')
        }
        style={{
          border: 'none',
          borderRadius: '10px',
          padding: '8px 15px',
          cursor: 'pointer',
          fontWeight: '700',
          background:
            consultationFilter === 'pending'
              ? '#f59e0b'
              : '#f1f5f9',
          color:
            consultationFilter === 'pending'
              ? '#fff'
              : '#475569'
        }}
      >
        ⏳ معلقة
      </button>


      <button
        type="button"
        onClick={() =>
          setConsultationFilter('answered')
        }
        style={{
          border: 'none',
          borderRadius: '10px',
          padding: '8px 15px',
          cursor: 'pointer',
          fontWeight: '700',
          background:
            consultationFilter === 'answered'
              ? '#10b981'
              : '#f1f5f9',
          color:
            consultationFilter === 'answered'
              ? '#fff'
              : '#475569'
        }}
      >
        ✅ تم الرد
      </button>


      <button
        type="button"
        onClick={() =>
          fetchConsultations()
        }
        style={{
          marginRight: 'auto',
          border: '1px solid #cbd5e1',
          background: '#fff',
          color: '#334155',
          borderRadius: '10px',
          padding: '8px 15px',
          cursor: 'pointer',
          fontWeight: '700'
        }}
      >
        🔄 تحديث
      </button>

    </div>


    {/* ==========================================
        القائمة
    ========================================== */}

    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}
    >

      {consultations

        .filter(item => {

          if (
            consultationFilter === 'all'
          ) {
            return true;
          }

          return (
            item.status ===
            consultationFilter
          );

        })

        .map(c => {

          const draft =
            getConsultationDraft(c);

          const isSaving =
            savingConsultationId === c.id;


          // الأطباء المطابقون للتخصص

          const matchingDoctors =
            draft.specialty
              ? (doctors || []).filter(
                  doctor =>
                    doctor.specialty ===
                    draft.specialty
                )
              : [];


          return (

            <article
              key={c.id}
              style={{
                background: '#fff',
                borderRadius: '22px',
                padding: '24px',
                border:
                  c.status === 'pending'
                    ? '2px solid #fde68a'
                    : '1px solid #e2e8f0',
                boxShadow:
                  '0 6px 25px rgba(15,23,42,0.06)'
              }}
            >

              {/* ==================================
                  رأس الاستفسار
              ================================== */}

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '15px',
                  flexWrap: 'wrap',
                  marginBottom: '20px'
                }}
              >

                <div>

                  <div
                    style={{
                      fontSize: '12px',
                      color: '#94a3b8',
                      marginBottom: '5px'
                    }}
                  >
                    رقم الاستفسار: #{c.id}
                  </div>

                  <h3
                    style={{
                      margin: 0,
                      color: '#0f172a',
                      fontSize: '18px',
                      fontWeight: '800'
                    }}
                  >
                    👤 {c.name || 'مستخدم بدون اسم'}
                  </h3>

                  {c.phone && (

                    <div
                      style={{
                        marginTop: '5px',
                        color: '#64748b',
                        direction: 'ltr',
                        textAlign: 'right'
                      }}
                    >
                      📞 {c.phone}
                    </div>

                  )}

                </div>


                {/* الحالة */}

                <div
                  style={{
                    padding: '8px 14px',
                    borderRadius: '20px',
                    fontWeight: '800',
                    fontSize: '13px',

                    background:
                      c.status === 'answered'
                        ? '#dcfce7'
                        : '#fef3c7',

                    color:
                      c.status === 'answered'
                        ? '#166534'
                        : '#92400e'
                  }}
                >

                  {c.status === 'answered'
                    ? '✅ تم الرد'
                    : '⏳ في انتظار الرد'}

                </div>

              </div>


              {/* ==================================
                  السؤال
              ================================== */}

              <div
                style={{
                  background: '#f8fafc',
                  border:
                    '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '18px',
                  marginBottom: '20px'
                }}
              >

                <div
                  style={{
                    color: '#0284c7',
                    fontWeight: '800',
                    marginBottom: '8px'
                  }}
                >
                  ❓ أعراض المريض / الاستفسار
                </div>

                <div
                  style={{
                    color: '#334155',
                    lineHeight: '1.9',
                    fontSize: '15px',
                    whiteSpace: 'pre-wrap'
                  }}
                >
                  {c.question}
                </div>

              </div>


              {/* ==================================
                  الرد
              ================================== */}

              <div
                style={{
                  marginBottom: '20px'
                }}
              >

                <label
                  style={{
                    display: 'block',
                    fontWeight: '800',
                    color: '#334155',
                    marginBottom: '8px'
                  }}
                >
                  🩺 الرد الطبي / التوجيه
                </label>

                <textarea
                  value={draft.answer}
                  onChange={e =>
                    updateConsultationDraft(
                      c.id,
                      'answer',
                      e.target.value
                    )
                  }
                  rows={6}
                  placeholder="اكتب الرد والتوجيه المناسب للمريض هنا..."
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '14px',
                    borderRadius: '14px',
                    border:
                      '1px solid #cbd5e1',
                    fontSize: '15px',
                    lineHeight: '1.9',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    outline: 'none'
                  }}
                />

              </div>


              {/* ==================================
                  التخصص والطبيب
              ================================== */}

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '15px',
                  marginBottom: '20px'
                }}
              >

                {/* التخصص */}

                <div>

                  <label
                    style={{
                      display: 'block',
                      fontWeight: '800',
                      color: '#334155',
                      marginBottom: '8px'
                    }}
                  >
                    🩺 التخصص المقترح
                  </label>

                 <select
  value={draft.specialty}
  onChange={e => {

    setConsultationDrafts(prev => ({

      ...prev,

      [c.id]: {

        ...(prev[c.id] || {}),

        specialty: e.target.value,

        doctor_id: ''

      }

    }));

  }}
  style={{
    width: '100%',
    boxSizing: 'border-box',
    padding: '12px',
    borderRadius: '12px',
    border: '1px solid #cbd5e1',
    background: '#fff',
    fontSize: '15px',
    fontFamily: 'inherit'
  }}
>

                    <option value="">
                      اختر التخصص
                    </option>

                    {[
                      ...new Set(
                        (doctors || [])
                          .map(d =>
                            d.specialty
                          )
                          .filter(Boolean)
                      )
                    ]
                      .sort((a, b) =>
                        a.localeCompare(
                          b,
                          'ar'
                        )
                      )
                      .map(specialty => (

                        <option
                          key={specialty}
                          value={specialty}
                        >
                          {specialty}
                        </option>

                      ))}

                  </select>

                </div>


                {/* الطبيب */}

                <div>

                  <label
                    style={{
                      display: 'block',
                      fontWeight: '800',
                      color: '#334155',
                      marginBottom: '8px'
                    }}
                  >
                    👨‍⚕️ الطبيب المقترح
                  </label>

                  <select
                    value={draft.doctor_id}
                    disabled={
                      !draft.specialty ||
                      matchingDoctors.length === 0
                    }
                    onChange={e =>
                      setConsultationDrafts(prev => ({
                        ...prev,
                        [c.id]: {
                          ...(prev[c.id] || {}),
                          doctor_id: e.target.value
                        }
                      }))
                    }
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '12px',
                      borderRadius: '12px',
                      border:
                        '1px solid #cbd5e1',
                      background:
                        !draft.specialty
                          ? '#f1f5f9'
                          : '#fff',
                      fontSize: '15px',
                      fontFamily: 'inherit'
                    }}
                  >

                    <option value="">
                      {!draft.specialty
                        ? 'اختر التخصص أولاً'
                        : matchingDoctors.length === 0
                        ? 'لا يوجد أطباء بهذا التخصص'
                        : 'اختر الطبيب المقترح'}
                    </option>

                    {matchingDoctors.map(
                      doctor => (

                        <option
                          key={doctor.id}
                          value={doctor.id}
                        >
                          {doctor.name}
                          {doctor.title
                            ? ` - ${doctor.title}`
                            : ''}
                        </option>

                      )
                    )}

                  </select>

                </div>

              </div>


              {/* ==================================
                  اختيار حالة الاستشارة
              ================================== */}

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '15px',
                  marginBottom: '20px'
                }}
              >

                <div>

                  <label
                    style={{
                      display: 'block',
                      fontWeight: '800',
                      color: '#334155',
                      marginBottom: '8px'
                    }}
                  >
                    📌 حالة الاستشارة
                  </label>

                  <select
                    value={draft.status}
                    onChange={e =>
                      updateConsultationDraft(
                        c.id,
                        'status',
                        e.target.value
                      )
                    }
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '12px',
                      borderRadius: '12px',
                      border:
                        '1px solid #cbd5e1',
                      background: '#fff',
                      fontSize: '15px',
                      fontFamily: 'inherit'
                    }}
                  >

                    <option value="pending">
                      ⏳ معلقة
                    </option>

                    <option value="answered">
                      ✅ تم الرد
                    </option>

                  </select>

                </div>


                {/* نشر */}

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    paddingTop: '27px'
                  }}
                >

                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      cursor: 'pointer',
                      background:
                        draft.is_published
                          ? '#ecfdf5'
                          : '#f8fafc',
                      border:
                        `1px solid ${
                          draft.is_published
                            ? '#a7f3d0'
                            : '#e2e8f0'
                        }`,
                      borderRadius: '12px',
                      padding: '12px 15px',
                      width: '100%',
                      boxSizing: 'border-box'
                    }}
                  >

                    <input
                      type="checkbox"
                      checked={
                        Boolean(
                          draft.is_published
                        )
                      }
                      onChange={e =>
                        updateConsultationDraft(
                          c.id,
                          'is_published',
                          e.target.checked
                        )
                      }
                      style={{
                        width: '18px',
                        height: '18px'
                      }}
                    />

                    <span
                      style={{
                        fontWeight: '800',
                        color:
                          draft.is_published
                            ? '#047857'
                            : '#475569'
                      }}
                    >
                      {draft.is_published
                        ? '🌍 منشور للعامة'
                        : '🔒 غير منشور للعامة'}
                    </span>

                  </label>

                </div>

              </div>


              {/* ==================================
                  معلومات النشر
              ================================== */}

              {draft.is_published && (

                <div
                  style={{
                    background: '#ecfdf5',
                    border:
                      '1px solid #a7f3d0',
                    color: '#065f46',
                    borderRadius: '13px',
                    padding: '13px 15px',
                    marginBottom: '18px',
                    lineHeight: '1.8',
                    fontSize: '14px'
                  }}
                >
                  🌍 عند الحفظ، سيظهر هذا السؤال والإجابة
                  في الصفحة العامة <b>/symptoms</b>،
                  وسيظهر للزوار التخصص والطبيب المقترح إذا تم اختيارهما.
                </div>

              )}


              {/* ==================================
                  أزرار الحفظ
              ================================== */}

              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  justifyContent: 'flex-start',
                  flexWrap: 'wrap'
                }}
              >

                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() =>
                    handleAnswerSubmit(
                      c.id,
                      draft
                    )
                  }
                  style={{
                    border: 'none',
                    borderRadius: '12px',
                    padding: '13px 22px',
                    background:
                      isSaving
                        ? '#94a3b8'
                        : '#0284c7',
                    color: '#fff',
                    fontWeight: '800',
                    fontSize: '15px',
                    cursor:
                      isSaving
                        ? 'not-allowed'
                        : 'pointer',
                    boxShadow:
                      '0 4px 12px rgba(2,132,199,0.25)'
                  }}
                >

                  {isSaving
                    ? '⏳ جاري الحفظ...'
                    : draft.is_published
                    ? '🌍 حفظ ونشر'
                    : '💾 حفظ الرد'}

                </button>

              </div>

            </article>

          );

        })}

    </div>


    {/* ==========================================
        لا توجد نتائج
    ========================================== */}

    {consultations.filter(item => {

      if (consultationFilter === 'all') {
        return true;
      }

      return item.status === consultationFilter;

    }).length === 0 && (

      <div
        style={{
          background: '#fff',
          borderRadius: '18px',
          padding: '45px 20px',
          textAlign: 'center',
          color: '#64748b',
          border:
            '1px solid #e2e8f0'
        }}
      >
        <div
          style={{
            fontSize: '42px',
            marginBottom: '10px'
          }}
        >
          📭
        </div>

        لا توجد استفسارات في هذا القسم حاليًا.

      </div>

    )}

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

// 📋 حالات سجل حجوزات المريض
  const [showPatientHistoryModal, setShowPatientHistoryModal] = useState(false);
  const [patientAppointments, setPatientAppointments] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // دالة جلب حجوزات المريض برقم هاتفه من السيرفر
 // دالة جلب حجوزات المريض المحدثة (تفتح فوراً وتبحث عن الرقم بذكاء)
  const fetchPatientHistory = async () => {
    // 🌟 1. فتح المودال فوراً بدون أي تأخير ليشاهد المريض النافذة
    setShowPatientHistoryModal(true);
    setLoadingHistory(true);

    // 🌟 2. استخراج رقم الموبايل إما من currentUser أو من localStorage مباشرة
    let patientMobile = currentUser?.mobile;
    if (!patientMobile) {
      try {
        const savedUserStr = localStorage.getItem('saved_user');
        if (savedUserStr) {
          const parsed = JSON.parse(savedUserStr);
          patientMobile = parsed?.mobile;
        }
      } catch (e) {
        console.error(e);
      }
    }

    // إذا لم نجد الرقم، نطلب منه إدخاله في النافذة بدلاً من تجاهل الضغطة
    if (!patientMobile) {
      setLoadingHistory(false);
      return;
    }

    try {
      const res = await fetch(`https://clinic-api-ig3d.onrender.com/api/patient-appointments/${encodeURIComponent(patientMobile.trim())}`);
      const data = await res.json();
      setPatientAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("خطأ في جلب حجوزات المريض:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const fetchData = async () => {
    try {
      const resDocs = await fetch('https://clinic-api-ig3d.onrender.com/doctors');
      setDoctors(await resDocs.json());
      const resApps = await fetch('https://clinic-api-ig3d.onrender.com/appointments');
      setAppointments(await resApps.json());
    } catch (e) { console.error("Error fetching data"); }
  };
       
// 🎫 حالة تذكرة الحجز العامة
  const [activeTicket, setActiveTicket] = useState(null);

  useEffect(() => {
    const updateTicketFromStorage = () => {
      const savedTicket = sessionStorage.getItem('active_ticket');
      if (savedTicket) {
        try {
          setActiveTicket(JSON.parse(savedTicket));
        } catch (e) {
          console.error(e);
        }
      } else {
        setActiveTicket(null);
      }
    };

    // قراءة أولية عند فتح الصفحة
    updateTicketFromStorage();

    // 🌟 الاستماع الفوري عند ضغط زر الحجز في SearchPage أو DirectBooking
    window.addEventListener('storage_ticket', updateTicketFromStorage);
    window.addEventListener('storage', updateTicketFromStorage);

    return () => {
      window.removeEventListener('storage_ticket', updateTicketFromStorage);
      window.removeEventListener('storage', updateTicketFromStorage);
    };
  }, []);

useEffect(() => {

  onMessageListener().then((payload) => {

    const title =
      payload.notification?.title ||
      payload.data?.notif_title ||
      'إشعار جديد';

    const body =
      payload.notification?.body ||
      payload.data?.notif_body ||
      '';

    const address =
      payload.data?.address ||
      '';

    setActiveNotification({
      title,
      body,
      address
    });

  }).catch((err) => console.log('failed: ', err));

}, []);

useEffect(() => {
    const savedUser = localStorage.getItem('saved_user');
    const savedId = localStorage.getItem('saved_doctor_id');

    if (savedUser) {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);

        if (user.role === 'doctor') {
    if (window.location.pathname !== '/notification') {
        navigate('/dashboard');
    }
} else if (user.role === 'admin') {
    setIsAdmin(true);

    if (window.location.pathname !== '/notification') {
        navigate('/admin');
    }
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

// عندما يضغط المريض على زر تفعيل الإشعارات أو زر تسجيل الدخول:
const handleEnableNotifications = async () => {
    try {
        const token = await requestForToken(); // دالة طلب التوكن من فايربيز
        
        if (token) {
            const savedUser = localStorage.getItem('saved_user');
            if (savedUser) {
                const user = JSON.parse(savedUser);
                if (user?.role === 'patient' && user?.mobile) {
                    // إرسال التوكن للسيرفر وحفظه في جدول patients
                    await savePatientFCMToken(user.mobile, token);
                    alert("✅ تم تفعيل الإشعارات بنجاح!");
                }
            }
        } else {
            alert("⚠️ يرجى السماح بالإشعارات من إعدادات المتصفح.");
        }
    } catch (error) {
        console.error("خطأ في تفعيل الإشعارات:", error);
    }
};

const savePatientFCMToken = async (mobileNumber, token) => {
  try {
    const response = await fetch('https://clinic-api-ig3d.onrender.com/api/update-patient-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mobile: mobileNumber,
        fcm_token: token
      })
    });

    const data = await response.json();
    if (response.ok) {
      console.log("✅ تم حفظ توكن إشعارات المريض بنجاح:", data);
    } else {
      console.error("❌ فشل حفظ توكن المريض:", data);
    }
  } catch (error) {
    console.error("❌ خطأ أثناء إرسال توكن المريض للسيرفر:", error);
  }
};

// داخل دالة المكون الرئيسي App:
// داخل دالة المكون الرئيسي App:
const [activeNotification, setActiveNotification] = useState(null);
const location = useLocation();

useEffect(() => {
const initializeWebNotifications = async () => {
    const token = await requestForToken();

    if (!token) {
      console.log("⚠️ لم يتم الحصول على Web FCM Token.");
      return;
    }

    const savedUser = localStorage.getItem('saved_user');

    if (!savedUser) {
      console.log("ℹ️ لا يوجد مستخدم مسجل دخول حاليًا.");
      return;
    }

    try {
      const user = JSON.parse(savedUser);

      // 1. إذا كان المستخدم طبيباً (الكود القديم الخاص بك)
      if (user?.role === 'doctor' && user?.id) {
        console.log("🔔 تم العثور على طبيب مسجل دخول، سيتم حفظ التوكن في السيرفر.");
        await saveWebFCMToken(user, token);
      }

      // ==========================================
      // 🩺 2. [إضافة جديدة]: إذا كان المستخدم مريضاً وله رقم موبايل مخزن
      // ==========================================
      if (user?.role === 'patient' && user?.mobile) {
        console.log("🔔 تم العثور على مريض مسجل دخول، سيتم حفظ توكن الإشعارات له.");
        await savePatientFCMToken(user.mobile, token);
      }

    } catch (error) {
      console.error("❌ خطأ في قراءة بيانات المستخدم المحفوظة:", error);
    }
  };

  initializeWebNotifications();
}, []);

useEffect(() => {
  const params = new URLSearchParams(window.location.search);

  const notifTitle = params.get('notif_title');
  const notifBody = params.get('notif_body');

  if (!notifTitle && !notifBody) {
    return;
  }

  // إذا كنا بالفعل داخل صفحة الإشعار فلا نعرض الـ Popup
  if (window.location.pathname === '/notification') {
    return;
  }

  const title = notifTitle || 'إشعار جديد';
  const body = notifBody || '';

  // حفظ آخر إشعار محلياً كنسخة احتياطية
  localStorage.setItem(
    'last_notification',
    JSON.stringify({
      title,
      body,
      created_at: new Date().toISOString()
    })
  );

  // إذا كانت الصفحة تم فتحها بسبب Refresh
  // ننقل المستخدم مباشرة إلى صفحة الإشعار
  const navigationEntry = performance.getEntriesByType('navigation')[0];
  const isReload = navigationEntry?.type === 'reload';

  if (isReload) {
    navigate(
      `/notification?notif_title=${encodeURIComponent(title)}&notif_body=${encodeURIComponent(body)}`
    );

    return;
  }

  // أول وصول للإشعار → Popup
  setActiveNotification({
    title,
    body
  });
}, [location.search, navigate]);

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
const saveWebFCMToken = async (user, token) => {
  if (!user || user.role !== 'doctor' || !user.id || !token) {
    console.log(
      "⚠️ لا يمكن حفظ Web FCM Token: بيانات الطبيب أو التوكن ناقصة"
    );
    return;
  }

  try {
    const response = await fetch(
      'https://clinic-api-ig3d.onrender.com/api/save-token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          doctorId: user.id,
          fcmToken: token
        })
      }
    );



    const data = await response.json();

    if (response.ok) {
      console.log(
        "✅ تم حفظ Web FCM Token للطبيب بنجاح:",
        data
      );
    } else {
      console.error(
        "❌ فشل حفظ Web FCM Token:",
        data
      );
    }

  } catch (error) {
    console.error(
      "❌ خطأ أثناء إرسال Web FCM Token للسيرفر:",
      error
    );
  }
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
      <nav
  style={{
    padding: '6px 15px',
    background: '#2c3e50',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
    flexWrap: 'wrap',
    gap: '6px'
  }}
>

        {/* --- مكان اللوجو الجديد --- */}
{/* ==========================================
    الصف الأول: اللوجو + حساب المستخدم
========================================== */}

<div
  style={{
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexShrink: 0
  }}
>

  {/* --- اللوجو --- */}

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
        paddingRight: '5px'
      }}
      onError={(e) => {
        e.target.src = "/logo.webp";
      }}
    />
  </div>


  {/* ==========================================
      حساب المستخدم
      يظهر بجوار اللوجو وليس مع أزرار الهيدر
  ========================================== */}

  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '7px',
      flexShrink: 0
    }}
  >

    {!currentUser ? (

      /* 🔐 لم يتم تسجيل الدخول */

      <button
        onClick={() => setShowLoginModal(true)}
        style={{
          ...navBtnStyle,
          background: '#27ae60',
          fontSize: '13px',
          padding: '7px 11px',
          whiteSpace: 'nowrap'
        }}
      >
        🔐 دخول
      </button>

    ) : (

      /* 👤 مستخدم مسجل الدخول */

      <>

        {/* اسم المستخدم */}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            color: '#fff',
            whiteSpace: 'nowrap'
          }}
        >

          <span
            style={{
              fontSize: '17px'
            }}
          >
            👤
          </span>

          <span
            style={{
              fontSize: '12px',
              fontWeight: 'bold',
              maxWidth: '95px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {isAdmin
              ? 'الأدمن'
              : currentUser?.name || 'المستخدم'}
          </span>

        </div>


        {/* خروج */}

        <button
          onClick={handleLogout}
          style={{
            ...navBtnStyle,
            backgroundColor: '#e74c3c',
            fontSize: '12px',
            padding: '7px 10px',
            whiteSpace: 'nowrap'
          }}
        >
          خروج
        </button>

      </>

    )}

  </div>

</div>

        {/* --- حاوية الزراير --- */}
      {/* ==========================================
    حاوية أزرار التنقل
    منفصلة عن حساب المستخدم
========================================== */}

<div
  style={{
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    flex: 1,
    minWidth: 0
  }}
>
        {currentUser?.role !== 'doctor' && (
  <button onClick={() => navigate('/')} style={{...navBtnStyle, backgroundColor: window.location.pathname === '/' ? '#3498db' : 'transparent'}}>🏠 الرئيسية</button>
)}

  {/* 🩺 زر الاستشارات الطبية (احكي لنا عن أعراضك) */}
      {/* 🩺 زر الاستشارات الطبية (احكي لنا عن أعراضك) */}
        <button 
          onClick={() => navigate('/symptoms')} 
          style={{
            ...navBtnStyle, 
            backgroundColor: window.location.pathname === '/symptoms' ? '#0284c7' : '#e41eb9', // 👈 أخضر فاتح وواضح في الحالة العادية
            color: '#ffffff', // 👈 ثبات لون الخط أبيض تماماً في الحالتين
            border: '1px solid rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
          title="اطرح استفسارك الطبي وسنوجهك للتخصص المناسب"
        >
          <span>🩺</span>
          <span>استشارات طبية</span>
        </button>

{/* 📋 زر سجل الحجوزات يظهر للمريض المسجل فقط */}
{currentUser?.role === 'patient' && currentUser?.mobile && (
  <button 
    onClick={fetchPatientHistory} 
    style={{
      ...navBtnStyle, 
      backgroundColor: '#10b981', 
      display: 'flex', 
      alignItems: 'center', 
      gap: '6px',
      boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
    }}
  >
    <span>📋</span>
    <span>سجل الحجوزات</span>
  </button>
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

    // 🔔 حفظ Web FCM Token للطبيب
    const savedWebFcmToken = localStorage.getItem('web_fcm_token');

    if (savedWebFcmToken) {
        saveWebFCMToken(doctorData, savedWebFcmToken);
    } else {
        console.log("⚠️ لا يوجد Web FCM Token محفوظ حاليًا.");
    }

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
  onClick={() => {
    const title = activeNotification?.title || 'إشعار جديد';
    const body = activeNotification?.body || '';
    
    // 🌟 جلب عنوان العيادة من التذكرة النشطة إذا كان الحجز جديداً
 const clinicAddress = activeNotification?.address || '';

    navigate(
      `/notification?notif_title=${encodeURIComponent(title)}&notif_body=${encodeURIComponent(body)}${clinicAddress ? `&address=${encodeURIComponent(clinicAddress)}` : ''}`
    );

    setActiveNotification(null);
  }}
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
  فتح الإشعار وقراءة التفاصيل
</button>
          </div>
        </div>
      )}

      {/* ✅✅ هنا مكانه الصحيح تماماً (مستقل بذاته وخارج الإشعار) ✅✅ */}
      {showPatientHistoryModal && (
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
          zIndex: 999999,
          direction: 'rtl',
          fontFamily: 'Cairo, sans-serif',
          padding: '15px'
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '24px',
            padding: '25px',
            maxWidth: '750px',
            width: '100%',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            {/* رأس النافذة */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #f1f5f9', paddingBottom: '15px', marginBottom: '15px' }}>
              <div>
                <h3 style={{ margin: '0 0 5px 0', fontSize: '20px', color: '#0f172a', fontWeight: '800' }}>
                  📋 سجل حجوزاتك السابقة
                </h3>
                <span style={{ fontSize: '13px', color: '#64748b' }}>
                  المريض: {currentUser?.name} ({currentUser?.mobile})
                </span>
              </div>
              <button 
                onClick={() => setShowPatientHistoryModal(false)}
                style={{ background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '50%', width: '36px', height: '36px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {/* محتوى الجدول */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {loadingHistory ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                  <div style={{ fontSize: '30px', marginBottom: '10px' }}>⏳</div>
                  جاري تحميل سجل حجوزاتك...
                </div>
              ) : patientAppointments.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                  <div style={{ fontSize: '40px', marginBottom: '10px' }}>🩺</div>
                  لا توجد حجوزات مسجلة بهذا الرقم حتى الآن.
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
                  <thead style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                    <tr>
                      <th style={{ padding: '12px 14px', color: '#475569', fontSize: '14px' }}>الطبيب</th>
                      <th style={{ padding: '12px 14px', color: '#475569', fontSize: '14px' }}>تاريخ الموعد</th>
                      <th style={{ padding: '12px 14px', color: '#475569', fontSize: '14px' }}>سعر الكشف</th>
                      <th style={{ padding: '12px 14px', color: '#475569', fontSize: '14px', textAlign: 'center' }}>حالة الحضور</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patientAppointments.map(app => {
                      let statusText = '⏳ قيد الانتظار';
                      let statusBg = '#fef3c7';
                      let statusColor = '#92400e';

                      if (app.status === 'completed' || app.status === 'attended') {
                        statusText = '✅ تم الحضور';
                        statusBg = '#dcfce7';
                        statusColor = '#166534';
                      } else if (app.status === 'cancelled' || app.status === 'absent') {
                        statusText = '❌ غياب / ملغي';
                        statusBg = '#fee2e2';
                        statusColor = '#991b1b';
                      }

                      return (
                        <tr key={app.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '12px 14px', fontWeight: 'bold', color: '#0f172a' }}>
                            د. {app.doctor_name || 'غير محدد'}
                          </td>
                          <td style={{ padding: '12px 14px', color: '#334155' }}>
                            {app.booking_date || app.appointment_date 
                              ? new Date(app.booking_date || app.appointment_date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })
                              : 'غير محدد'}
                          </td>
                          <td style={{ padding: '12px 14px', color: '#0369a1', fontWeight: 'bold' }}>
                            {app.price ? `${app.price} ج.م` : 'غير محدد'}
                          </td>
                          <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                            <span style={{
                              display: 'inline-block',
                              padding: '5px 12px',
                              borderRadius: '20px',
                              fontSize: '12.5px',
                              fontWeight: 'bold',
                              backgroundColor: statusBg,
                              color: statusColor
                            }}>
                              {statusText}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {/* زر الإغلاق السفلي */}
            <button
              onClick={() => setShowPatientHistoryModal(false)}
              style={{
                marginTop: '15px',
                padding: '12px',
                background: '#0284c7',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              إغلاق
            </button>
          </div>
        </div>
      )}
 {/* 🌟 تذكرة الحجز الرسمية العامة - تظل عائمة فوق أي صفحة حتى يغلقها المستخدم */}
      {activeTicket && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999999, // أعلى من أي صفحة وأعلى من النافبار
          padding: '16px',
          direction: 'rtl',
          fontFamily: 'Cairo, sans-serif'
        }}>
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '24px',
            maxWidth: '440px',
            width: '100%',
            padding: '28px',
            boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
            border: '2px solid #e2e8f0',
            textAlign: 'right'
          }}>
            <div style={{ textAlign: 'center', paddingBottom: '16px', borderBottom: '2px dashed #cbd5e1', marginBottom: '16px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: '#ecfdf5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 8px auto',
                border: '1.5px solid #a7f3d0',
                fontSize: '22px',
                fontWeight: 'bold'
              }}>
                ✓
              </div>
              <h2 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 900, color: '#0f172a' }}>
                تم تأكيد حجز موعدك بنجاح!
              </h2>
              <span style={{ fontSize: '12px', color: '#64748b' }}>
                تذكرة إلكترونية رسمية معتمدة من العيادة
              </span>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9', fontSize: '13px' }}>
                <span style={{ color: '#64748b' }}>اسم المريض:</span>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>{activeTicket.patientName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9', fontSize: '13px' }}>
                <span style={{ color: '#64748b' }}>الدكتور المعالج:</span>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>د. {activeTicket.doctorName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9', fontSize: '13px' }}>
                <span style={{ color: '#64748b' }}>التخصص:</span>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>{activeTicket.specialty || 'استشاري متخصص'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9', fontSize: '13px' }}>
                <span style={{ color: '#64748b' }}>الموعد المحدد:</span>
                <span style={{ fontWeight: 700, color: '#2563eb' }}>{activeTicket.slot}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: 'none', fontSize: '13px' }}>
                <span style={{ color: '#64748b' }}>عنوان العيادة بالتفصيل:</span>
                <span style={{ maxWidth: '240px', textAlign: 'right', fontWeight: 800, color: '#0f172a' }}>
                  📍 {activeTicket.address || 'العنوان مسجل بالعيادة'}
                </span>
              </div>
            </div>

            <div style={{
              background: '#fffbeb',
              borderRight: '4px solid #f59e0b',
              borderRadius: '10px',
              padding: '12px',
              margin: '16px 0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <span style={{ fontSize: '11px', color: '#92400e', display: 'block', fontWeight: 600 }}>قيمة الكشف:</span>
                <strong style={{ fontSize: '18px', color: '#78350f' }}>{activeTicket.fee} ج.م</strong>
              </div>
              <span style={{ fontSize: '11px', color: '#b45309' }}>تدفع عند الدخول للعيادة</span>
            </div>

            <div style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '12px',
              padding: '10px',
              fontSize: '12px',
              color: '#166534',
              fontWeight: 700,
              textAlign: 'center',
              marginBottom: '16px'
            }}>
              📸 احفظ لقطة شاشة (Screenshot) للتذكرة لإظهارها بالعيادة
            </div>

            {activeTicket.doctorMobile && (
              <button 
                onClick={() => {
                  const message = 
                    `تأكيد حجز موعد كشف رسمي من منصة دكتور:\n` +
                    `👤 المريض: ${activeTicket.patientName}\n` +
                    `👨‍⚕️ الدكتور: د. ${activeTicket.doctorName}\n` +
                    `📅 الموعد: ${activeTicket.slot}\n` +
                    `📍 العنوان: ${activeTicket.address || ''}\n` +
                    `📱 هاتف المريض: ${activeTicket.patientMobile}\n` +
                    `🏥 كود الحجز: DOC-${Math.floor(100000 + Math.random() * 900000)}`;
                  const whatsappUrl = `https://wa.me/2${activeTicket.doctorMobile}?text=${encodeURIComponent(message)}`;
                  window.open(whatsappUrl, '_blank');
                }} 
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  background: '#25D366', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: '12px', 
                  cursor: 'pointer', 
                  fontWeight: 'bold', 
                  marginBottom: '10px', 
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <span>💬 إرسال التذكرة لواتساب العيادة فوراً</span>
              </button>
            )}

            {/* زر الإغلاق النهائي: يغلق التذكرة ليكتشف المستخدم الصفحة التي خلفها */}
            <button 
              onClick={() => {
                sessionStorage.removeItem('active_ticket');
                setActiveTicket(null);
              }} 
              style={{ 
                width: '100%', 
                padding: '12px', 
                background: '#f1f5f9', 
                color: '#334155', 
                border: '1px solid #cbd5e1', 
                borderRadius: '12px', 
                cursor: 'pointer', 
                fontWeight: 700, 
                fontSize: '13px' 
              }}
            >
              تم الحفظ، إغلاق النافذة
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
              {/* 🔔 صفحة تفاصيل الإشعار */}
             <Route path="/notification" element={<NotificationPage />} />

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
 <Route
  path="/symptoms"
  element={<SymptomsPage />}
/>
// في ملف App.js أضف هذا السطر في مكان الـ Routes
{/* رابط الاستشارات الطبية */}
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