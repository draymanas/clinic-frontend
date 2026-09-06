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
function AdminPage({ doctors, appointments, fetchData }) {
    const handleDelete = async (id) => { if(window.confirm("حذف؟")){ await fetch(`https://clinic-api-ig3d.onrender.com/delete-doctor/${id}`, {method:'DELETE'}); fetchData(); } };
    const handleToggle = async (id, s) => { await fetch(`https://clinic-api-ig3d.onrender.com/toggle-doctor/${id}`, {method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify({status:s})}); fetchData(); };


const [adminSearch, setAdminSearch] = React.useState(''); // للبحث بالاسم
const [adminSpecialty, setAdminSpecialty] = React.useState('الكل'); // للفلترة بالتخصص
const [consultations, setConsultations] = React.useState([]);

// الرابط الأساسي لـ API الأدمن
const ADMIN_API_URL = "https://clinic-api-ig3d.onrender.com/api/admin/consultations";

const fetchConsultations = async () => {
    try {
        const response = await fetch(ADMIN_API_URL);
        if (!response.ok) throw new Error("فشل في جلب البيانات");
        const data = await response.json();
        setConsultations(data);
    } catch (error) {
        console.error("Error fetching consultations:", error);
        alert("حدث خطأ أثناء جلب الاستشارات من السيرفر");
    }
};

React.useEffect(() => { 
    fetchConsultations(); 
}, []);

// استدعاء الدالة عند تحميل الصفحة
React.useEffect(() => { 
    fetchConsultations(); 
}, []);

const handleAnswerSubmit = async (id, answerText, currentStatus) => {
    try {
        const response = await fetch(`${ADMIN_API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                answer: answerText,
                status: currentStatus
            })
        });

        if (response.ok) {
            alert("تم الرد وتحديث الحالة بنجاح!");
            fetchConsultations(); // إعادة تحديث القائمة لرؤية التغييرات فوراً
        } else {
            throw new Error("فشل التحديث في السيرفر");
        }
    } catch (error) {
        console.error("Error updating consultation:", error);
        alert("حدث خطأ أثناء إرسال الرد");
    }
};

const filteredAdminDoctors = doctors.filter(d => {
    const matchName = d.name.toLowerCase().includes(adminSearch.toLowerCase());
    const matchSpecialty = adminSpecialty === 'الكل' || d.specialty === adminSpecialty;
    return matchName && matchSpecialty;
});


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
            fetchData(); // تحديث عشان الترتيب يظهر فوراً
        } catch (err) {
            console.error("Error updating order:", err);
        }
    };

    return (
        <div style={{ padding: '20px', direction: 'rtl' }}>
            <h2 style={{textAlign:'center'}}>📊 إدارة الأطباء</h2>
            <div style={{ 
    display: 'flex', 
    gap: '15px', 
    marginBottom: '20px', 
    backgroundColor: '#f8f9fa', 
    padding: '15px', 
    borderRadius: '10px' 
}}>
    <input 
        type="text" 
        placeholder="🔍 ابحث باسم الدكتور..." 
        style={{ flex: 2, padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
        onChange={(e) => setAdminSearch(e.target.value)}
    />
    
    <select 
        style={{ flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
        onChange={(e) => setAdminSpecialty(e.target.value)}
    >
        <option value="الكل">كل التخصصات</option>
        {medicalSpecialties.map(s => <option key={s} value={s}>{s}</option>)}
    </select>
</div>
            <table style={{width:'100%', background:'#fff', borderCollapse:'collapse', marginBottom:'40px'}}>
                <thead style={{background:'#eee'}}><tr align="right"><th>الدكتور</th><th>المكان</th><th>مميز</th><th>الحالة</th><th style={{ textAlign: 'center' }}>الترتيب</th><th>الإجراء</th></tr></thead>
                <tbody>
                    {filteredAdminDoctors.map(d => (
                        <tr key={d.id} style={{borderBottom:'1px solid #eee'}}>
                            <td style={{padding:'10px'}}>{d.name}</td>
                            <td>{d.city}</td>
                            <td style={{ textAlign: 'center' }}>
    <input 
        type="checkbox" 
        checked={d.featured} // تم تغيير `featured` إلى `featured`
        onChange={() => handleFeaturedToggle(d.id, d.featured)}
        style={{ cursor: 'pointer', transform: 'scale(1.2)' }}
    />
</td>
                            <td>{d.is_active ? '✅ مفعل' : '❌ متوقف'}</td>
                            <td style={{ textAlign: 'center' }}>
                                <input 
                                    type="number" 
                                    defaultValue={d.sort_order === 999 ? '' : d.sort_order}
                                    placeholder="999"
                                    style={{ 
                                        width: '50px', 
                                        textAlign: 'center', 
                                        border: '1px solid #ddd', 
                                        borderRadius: '4px' 
                                    }}
                                    onBlur={(e) => handleOrderChange(d.id, e.target.value)}
                                />
                            </td>
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
           <div>
   <div>
    <h2 style={{textAlign:'center', marginTop:'50px'}}>💬 استشارات المرضى (لوحة التحكم)</h2>
    <table style={{width:'100%', background:'#fff', borderCollapse:'collapse', marginBottom:'50px'}}>
        <thead style={{background:'#1a73e8', color:'#fff'}}>
            <tr>
                <th style={{padding:'12px'}}>الاسم</th>
                <th style={{padding:'12px'}}>السؤال</th>
                <th style={{padding:'12px'}}>الحالة</th>
                <th style={{padding:'12px'}}>الإجابة</th>
                <th style={{padding:'12px'}}>إجراء</th>
            </tr>
        </thead>
        <tbody>
            {consultations.map(c => {
                // متغيرات مؤقتة لحفظ التعديلات التي يقوم بها الأدمن في السطر الحالي قبل الضغط على حفظ
                let localAnswer = c.answer || ""; 
                let localStatus = c.status || "pending";

                return (
                    <tr key={c.id} style={{borderBottom:'1px solid #eee', textAlign: 'center'}}>
                        <td style={{padding:'10px'}}>{c.name}</td>
                        <td style={{padding:'10px', maxWidth:'300px', whiteSpace:'pre-wrap'}}>{c.question}</td>
                        <td style={{padding:'10px'}}>
                            <select 
                                defaultValue={c.status}
                                onChange={(e) => { localStatus = e.target.value; }}
                                style={{padding:'5px', borderRadius:'4px', border:'1px solid #ccc'}}
                            >
                                <option value="pending">⏳ معلق</option>
                                <option value="answered">✅ تم الرد</option>
                            </select>
                        </td>
                        <td style={{padding:'10px'}}>
                            <textarea 
                                placeholder="اكتب الرد هنا..." 
                                defaultValue={c.answer}
                                style={{width:'90%', padding:'5px', minHeight:'50px', borderRadius:'4px'}}
                                onChange={(e) => { localAnswer = e.target.value; }}
                            />
                        </td>
                        <td style={{padding:'10px'}}>
                            <button 
                                onClick={() => handleAnswerSubmit(c.id, localAnswer, localStatus)}
                                style={{
                                    background: '#1a73e8', 
                                    color: '#fff', 
                                    border: 'none', 
                                    padding: '6px 12px', 
                                    borderRadius: '4px', 
                                    cursor: 'pointer'
                                }}
                            >
                                حفظ والتحديث
                            </button>
                        </td>
                    </tr>
                );
            })}
        </tbody>
    </table>
</div>
</div>
        </div>
    );
}

function AccountingPage({ doctors, appointments }) {
  const [selectedDocId, setSelectedDocId] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  // فلترة الحجوزات بناءً على الدكتور والشهر
const doctorAppointments = appointments.filter(app => {
    // 1. الربط بالـ ID (أمان أعلى ضد تشابه الأسماء)
    const currentDoc = doctors.find(d => d.id === parseInt(selectedDocId));
    const isSameDoctor = Number(app.doctor_id) === Number(currentDoc?.id);

    // 2. استخدام حقل booking_date الفعلي من الجدول
    const appDate = new Date(app.booking_date);
    const isSameMonth = (appDate.getMonth() + 1) === parseInt(selectedMonth);

    // 3. التأكد من أن الحالة مكتملة
    const isCompleted = app.status === 'completed';

    return isSameDoctor && isSameMonth && isCompleted;
  });

  // جلب بيانات الدكتور المختار (عشان نعرف سعر كشفه)
 const currentDoc = doctors.find(d => Number(d.id) === Number(selectedDocId));
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
    <div style={{ padding: '30px', direction: 'rtl', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
      <h2 style={{ textAlign: 'center', color: '#2c3e50' }}>💰 نظام الحسابات والتحصيل</h2>
      
     <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
  <select 
    onChange={e => setSelectedDocId(e.target.value)} 
    value={selectedDocId}
    style={{ padding: '10px', borderRadius: '8px' }}
  >
    <option value="">-- اختر الدكتور والفرع --</option>
    {doctors.map(d => (
      <option key={d.id} value={d.id}>
        {d.name} - ({d.area || 'فرع عام'})
      </option>
    ))}
  </select>

        <select onChange={e => setSelectedMonth(e.target.value)} value={selectedMonth} style={{ padding: '10px', borderRadius: '8px' }}>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>شهر {i + 1}</option>
          ))}
        </select>
      </div>

      {selectedDocId && (
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
    src="/logo512.png" 
    alt="منصة دكتور" 
    style={{ 
      height: '60px', 
      maxHeight: '100%', 
      width: 'auto', 
      objectFit: 'contain',
      paddingRight: '10px' 
    }} 
    onError={(e) => { e.target.src = "/logo.png" }} 
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