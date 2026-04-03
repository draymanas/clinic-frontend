import React, { useState, useEffect } from 'react';
import './App.css';
import { App as CapacitorApp } from '@capacitor/app';
const API_BASE_URL = "https://clinic-api-ig3d.onrender.com";

// --- الثوابت (تعريف مرة واحدة فقط) ---
const medicalSpecialties = [
  "الكل", "أسنان", "أطفال وحديثي الولادة", "أنف وأذن وحنجرة", "باطنة", "تغذية علاجية",
  "جراحة أطفال", "جراحة أوعية دموية", "جراحة أورام", "جراحة تجميل", "جراحة سمنة ومناظير",
  "عظام", "جراحة قلب وصدر", "جراحة مخ وأعصاب", "جراحة مسالك بولية", "جلدية",
  "جهاز هضمي وكبد", "حساسية ومناعة", "رمد", "روماتيزم", "علاج طبيعي", "غدد صماء وسكري",
  "امراض دم","قلب وأوعية دموية", "مخ وأعصاب", "نسا وتوليد", "نفسي"
];
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
const landingBtnStyle = { width: '100%', maxWidth: '300px', padding: '18px', fontSize: '18px', fontWeight: 'bold', borderRadius: '15px', border: 'none', backgroundColor: '#fff', color: '#1a73e8', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' };
const inputStyle = { padding: '15px', borderRadius: '10px', border: '1px solid #ddd', width: '100%', fontSize: '16px', boxSizing: 'border-box', marginBottom: '10px', textAlign: 'right' };

  
// --- المكونات المساعدة ---

const LandingPage = ({ onSelect }) => (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '20px', background: 'linear-gradient(135deg, #1a73e8 0%, #0d47a1 100%)', padding: '20px' }}>
        <h1 style={{ color: '#fff', textAlign: 'center', marginBottom: '40px' }}>منصة دكتور</h1>
        <button onClick={() => onSelect('patient_login')} style={landingBtnStyle}>👤 دخول مريض</button>
        <button onClick={() => onSelect('join')} style={landingBtnStyle}>👨‍⚕️ دخول طبيب</button>
        <button 
            onClick={() => {
                const password = prompt("برجاء إدخال كلمة سر الإدارة:");
                if (password === 'admin123') {
                    // بنبعت كلمة سر برمجية للـ App وهو يتصرف
                    onSelect('admin_verify'); 
                } else if (password !== null) {
                    alert("عفواً، كلمة السر خاطئة!");
                }
            }} 
            style={landingBtnStyle}
        >
            دخول الإدارة ⚙️
        </button>
    </div>
);



const PatientSearch = ({ states, setters, onSearch, onBack }) => {
    // نضع فحص بسيط للتأكد أن البيانات وصلت ولا تسبب انهيار (Crash)
    if (!states || !setters) return <div style={{textAlign:'center', padding:'20px'}}>جاري تحميل صفحة البحث...</div>;

    return (
        <div style={{ padding: '20px', backgroundColor: '#f0f2f5', minHeight: '100vh', direction: 'rtl' }}>
            
            {/* زرار الرجوع */}
            <button 
                onClick={onBack} 
                style={{ background: 'none', border: 'none', color: '#1a73e8', marginBottom: '15px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}
            >
                ⬅️ رجوع للخلف
            </button>

            <h3 style={{ textAlign: 'center', color: '#1a73e8', marginBottom: '20px' }}>ابحث عن الطبيب المناسب</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', background: '#fff', padding: '25px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                
                <input 
                    placeholder="ابحث باسم الدكتور (اختياري)" 
                    style={inputStyle} 
                    value={states.searchTerm} 
                    onChange={(e) => setters.setSearchTerm(e.target.value)} 
                />

                <select style={inputStyle} value={states.fSpecialty} onChange={(e) => setters.setFSpecialty(e.target.value)}>
                    <option value="الكل">كل التخصصات</option>
                    {/* تأكد أن medicalSpecialties معرفة في أعلى الملف */}
                    {typeof medicalSpecialties !== 'undefined' && medicalSpecialties.map(s => <option key={s} value={s}>{s}</option>)}
                </select>

                <select style={inputStyle} value={states.fCity} onChange={(e) => { setters.setFCity(e.target.value); setters.setFArea('الكل'); }}>
                    <option value="الكل">كل المحافظات</option>
                    {typeof egyptLocations !== 'undefined' && Object.keys(egyptLocations).map(city => <option key={city} value={city}>{city}</option>)}
                </select>

                {states.fCity !== 'الكل' && typeof egyptLocations !== 'undefined' && egyptLocations[states.fCity] && (
                    <select style={inputStyle} value={states.fArea} onChange={(e) => setters.setFArea(e.target.value)}>
                        <option value="الكل">كل المدن/المناطق</option>
                        {egyptLocations[states.fCity].map(area => <option key={area} value={area}>{area}</option>)}
                    </select>
                )}

                <button 
                    onClick={onSearch} 
                    style={{ background: '#27ae60', color: '#fff', padding: '15px', borderRadius: '12px', border: 'none', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer', marginTop: '10px' }}
                >
                    استعراض الأطباء 🔍
                </button>
            </div>
        </div>
    );
};

function DoctorLogin({ onLoginSuccess, onBack }) {
    const [phone, setPhone] = React.useState('');
    const [password, setPassword] = React.useState(''); // لو عندك عمود باسورد
    const [loading, setLoading] = React.useState(false);
 const [currentDoctor, setCurrentDoctor] = React.useState(null);
   const handleLogin = async () => {
    if (!phone || !password) return alert("من فضلك أدخل رقم الموبايل وكلمة السر");
    setLoading(true);
    try {
        const res = await fetch(`https://clinic-api-ig3d.onrender.com/doctors`);
        const allDoctors = await res.json();
        
        const doctor = allDoctors.find(d => d.mobile === phone || d.booking_phone === phone);

        if (doctor) {
            // التحقق من كلمة السر: إما 1234 أو القيمة المسجلة في قاعدة البيانات (لو أضفت عمود password)
            const correctPassword = doctor.password || "1234"; 

            if (password === correctPassword) {
                alert(`أهلاً دكتور ${doctor.name}`);
                onLoginSuccess(doctor); 
            } else {
                alert("كلمة السر غير صحيحة");
            }
        } else {
            alert("عذراً، هذا الرقم غير مسجل");
        }
    } catch (error) {
        alert("خطأ في الاتصال بالسيرفر");
    } finally {
        setLoading(false);
    }
};
    return (
        <div style={{ padding: '40px', textAlign: 'center', background: '#f8f9fa', height: '100vh', direction: 'rtl' }}>
            <h2 style={{ color: '#2c3e50', marginBottom: '30px' }}>دخول الأطباء</h2>
            <div style={{ background: '#fff', padding: '30px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                <input 
                    placeholder="رقم الموبايل المسجل" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{ ...inputStyle, marginBottom: '15px' }} 
                />
                <input 
                    type="password"
                    placeholder="كلمة السر" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ ...inputStyle, marginBottom: '25px' }} 
                />
                <button 
                    onClick={handleLogin} 
                    disabled={loading}
                    style={{ ...landingBtnStyle, backgroundColor: '#2ecc71', color: '#fff', width: '100%' }}
                >
                    {loading ? "جاري التحقق..." : "دخول اللوحة"}
                </button>
                <button onClick={onBack} style={{ background: 'none', border: 'none', marginTop: '20px', color: '#666', cursor: 'pointer' }}>
                    رجوع للرئيسية
                </button>
            </div>
        </div>
    );
}

// --- مكون بطاقة الدكتور المطور (DoctorCard) ---
const DoctorCard = ({ doc, onBook }) => (
    <div style={{ 
        background: '#fff', borderRadius: '25px', padding: '25px', 
        marginBottom: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', 
        border: '1px solid #eee', textAlign: 'center', direction: 'rtl'
    }}>
        <img 
            src={doc.image_url || `https://ui-avatars.com/api/?name=${doc.name}&background=e3f2fd&color=1a73e8`} 
            alt="Doctor" 
            style={{ width: '100px', height: '100px', borderRadius: '50%', marginBottom: '15px', objectFit: 'cover' }} 
        />
        <h3 style={{ margin: '0 0 10px 0', color: '#000', fontSize: '20px', fontWeight: 'bold' }}>دكتور / {doc.name}</h3>
        
        {/* تعديل الدرجة العلمية + التخصص */}
        <p style={{ margin: '0 0 15px 0', color: '#1a73e8', fontWeight: 'bold', fontSize: '16px' }}>
            {doc.title || 'أخصائي'} {doc.specialty} 
        </p>

        <p style={{ margin: '0 0 15px 0', color: '#000', fontSize: '15px' }}>📍 {doc.city} - {doc.area}</p>
        
        <div style={{ background: '#fff0f3', color: '#e74c3c', padding: '10px 20px', borderRadius: '15px', display: 'inline-block', marginBottom: '15px', fontWeight: 'bold' }}>
            قيمة الكشف: {doc.fee || '---'} جنيه
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', color: '#f39c12', marginBottom: '20px' }}>
            <span>({doc.rating || '5.0'})</span>
            <span style={{color: '#f39c12'}}>★★★★★</span>
        </div>

        {/* زر الحجز المباشر */}
        <button 
            onClick={() => onBook(doc)}
            style={{ 
                width: '100%', padding: '15px', background: '#1a73e8', 
                color: '#fff', border: 'none', borderRadius: '15px', 
                fontWeight: 'bold', fontSize: '16px', cursor: 'pointer'
            }}
        >
            احجز الآن
        </button>
    </div>
);

const getNextDateForDay = (dayName) => {
    const daysAr = { "الأحد": 0, "الاثنين": 1, "الثلاثاء": 2, "الأربعاء": 3, "الخميس": 4, "الجمعة": 5, "السبت": 6 };
    
    // تنظيف اسم اليوم من أي علامات ترقيم زي الشُرط أو الفواصل
    const cleanDayName = dayName.replace(/[،-]/g, '').trim();
    const targetDay = daysAr[cleanDayName];
    
    if (targetDay === undefined) return "";

    const now = new Date();
    const resultDate = new Date();
    
    let diff = (targetDay + 7 - now.getDay()) % 7;
    // لو اليوم هو النهاردة، ممكن نخلي الحجز للاسبوع الجاي أو النهاردة حسب رغبتك
    // if (diff === 0) diff = 7; 

    resultDate.setDate(now.getDate() + diff);
    
    // التعديل الجوهري هنا: التنسيق العالمي YYYY-MM-DD
    const year = resultDate.getFullYear();
    const month = String(resultDate.getMonth() + 1).padStart(2, '0');
    const day = String(resultDate.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`; 
};

// --- صفحة الحجز مع المودال (BookingPage) ---
function BookingPage({ doctors, filters, currentUser, onBack }) {
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [showTicket, setShowTicket] = useState(false);
    const [ticketData, setTicketData] = useState(null);
const saveAppointment = async (bookingData) => {
    try {
        // 1. استخراج اليوم (أول كلمة) عشان نحسب التاريخ الرقمي
        const dayName = bookingData.appointmentTime.split(' ')[0]; 
        
        // 2. تحويل "الجمعة" مثلاً إلى "2026-04-03" (YYYY-MM-DD)
        const cleanDate = getNextDateForDay(dayName); 

        const payload = {
            doctor_id: selectedDoc.id,
            doctor_name: selectedDoc.name,
            patient_name: bookingData.patientName,
            mobile: bookingData.patientPhone,
            // نبعت التاريخ الرقمي فقط للسيرفر عشان ميحصلش Error
            appointment_date: cleanDate, 
            price: selectedDoc.fee,
            status: 'pending'
        };

        const response = await fetch('https://clinic-api-ig3d.onrender.com/book-appointment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            return true; // الحجز كدة هيتسجل في سوبابيز فوراً
        } else {
            const errorResult = await response.json();
            alert("فشل الحجز: " + errorResult.error);
            return false;
        }
    } catch (error) {
        console.error("Error:", error);
        return false;
    }
};
    // فلترة الأطباء
    const filtered = doctors.filter(d => 
        (filters.fSpecialty === 'الكل' || d.specialty === filters.fSpecialty) && 
        (filters.fCity === 'الكل' || d.city === filters.fCity) && 
        d.name.includes(filters.searchTerm)
    );

    const handleOpenModal = (doc) => {
        setSelectedDoc(doc);
        setShowBookingModal(true);
    };



    return (
        <div style={{ backgroundColor: '#f0f4f8', minHeight: '100vh', padding: '15px', direction: 'rtl' }}>
           <button 
        onClick={onBack} 
        style={{ background: 'none', border: 'none', color: '#1a73e8', fontSize: '16px', cursor: 'pointer', marginBottom: '10px', fontWeight: 'bold' }}
    >
        ⬅️ رجوع لتعديل البحث
    </button>
            <h3 style={{ textAlign: 'center', color: '#1a73e8' }}>نتائج البحث ({filtered.length})</h3>
            
            {filtered.map(doc => (
                <DoctorCard key={doc.id} doc={doc} onBook={handleOpenModal} />
            ))}

           {/* مودال الحجز */}
{showBookingModal && (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
        <div style={{ background: '#fff', padding: '30px', borderRadius: '25px', width: '100%', maxWidth: '400px', textAlign: 'right' }}>
            <h3 style={{ color: '#1a73e8' }}>تأكيد الحجز مع د. {selectedDoc.name}</h3>
            
            <label>اسم المريض:</label>
            <input id="patientNameInput" style={inputStyle} defaultValue={currentUser?.name} />
            
            <label>رقم التواصل:</label>
            <input id="patientPhoneInput" style={inputStyle} placeholder="01xxxxxxxxx" />

            <label>اختر موعد واحد من المواعيد المتاحة:</label>
            <select id="appointmentTimeSelect" style={inputStyle}>
    {selectedDoc.availability?.split('-').map((slot, index) => {
        const dayPart = slot.trim().split(' ')[0]; // استخراج كلمة "الأحد" مثلاً
        const datePart = getNextDateForDay(dayPart); // حساب التاريخ
        return (
            <option key={index} value={`${slot.trim()} (بتاريخ ${datePart})`}>
                {slot.trim()} {datePart && `📅 (الموافق ${datePart})`}
            </option>
        );
    })}
</select>

<div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
    <button 
        onClick={async () => {
            try {
                const pName = document.getElementById('patientNameInput')?.value;
                const pPhone = document.getElementById('patientPhoneInput')?.value;
                const pTime = document.getElementById('appointmentTimeSelect')?.value;

                const bookingInfo = {
                    patientName: pName || currentUser?.name,
                    patientPhone: pPhone,
                    doctorName: selectedDoc.name,
                    appointmentTime: pTime,
                    clinicAddress: selectedDoc.address,
                    clinicPhone: selectedDoc.mobile,
                    fee: selectedDoc.fee
                };

                // إرسال البيانات للسيرفر
                const isSaved = await saveAppointment(bookingInfo);

                if (isSaved) {
                    setTicketData(bookingInfo);
                    setShowBookingModal(false); 
                    setShowTicket(true);
                }
            } catch (error) {
                console.error("خطأ أثناء التأكيد:", error);
            }
        }} 
        style={{ 
            flex: 1, 
            background: '#27ae60', 
            color: '#fff', 
            border: 'none', 
            padding: '15px', 
            borderRadius: '15px', 
            fontWeight: 'bold',
            cursor: 'pointer'
        }}
    >
        تأكيد الحجز
    </button>
    <button 
        onClick={() => setShowBookingModal(false)} 
        style={{ 
            flex: 1, 
            background: '#eee', 
            color: '#333', 
            border: 'none', 
            padding: '15px', 
            borderRadius: '15px',
            cursor: 'pointer'
        }}
    >
        إلغاء
    </button>
</div>
        </div>
    </div>
)}

            {showTicket && <BookingTicket ticketData={ticketData} onClose={() => setShowTicket(false)} />}
        </div>
    );
}
// --- مكون تذكرة الحجز (يتم استدعاؤه بعد نجاح الحجز) ---
const BookingTicket = ({ ticketData, onClose }) => {
    const sendWhatsApp = () => {
    // 1. تنظيف الرقم: بنشيل أي حروف أو علامات (+، -، مسافات) ونخلي الأرقام فقط
    const cleanedPhone = ticketData.clinicPhone.replace(/\D/g, '');

    // 2. التأكد من كود الدولة: لو الرقم بيبدأ بـ 01 (مصر) بنضيف له 20 في الأول
    const finalPhone = cleanedPhone.startsWith('01') ? `20${cleanedPhone}` : cleanedPhone;

    const message = `تأكيد حجز من منصة دكتور:\n👨‍⚕️ دكتور: ${ticketData.doctorName}\n👤 المريض: ${ticketData.patientName}\n📅 الموعد: ${ticketData.appointmentTime}\n📍 العنوان: ${ticketData.clinicAddress}\n💰 الكشف: ${ticketData.fee} ج.م`;

    // 3. نستخدم finalPhone بدلاً من ticketData.clinicPhone
    window.open(`https://wa.me/${finalPhone}?text=${encodeURIComponent(message)}`, '_blank');
};

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 3000, padding: '20px', direction: 'rtl' }}>
            <div style={{ background: '#fff', padding: '25px', borderRadius: '25px', width: '100%', maxWidth: '400px', textAlign: 'right', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
                <div style={{ textAlign: 'center', borderBottom: '2px dashed #eee', paddingBottom: '15px', marginBottom: '20px' }}>
                    <h2 style={{ color: '#2c3e50', margin: 0 }}>🎟️ تذكرة الحجز</h2>
                </div>
                
                <div style={{ lineHeight: '2', marginBottom: '20px', fontSize: '15px' }}>
                    <p><b>👤 المريض:</b> {ticketData.patientName}</p>
                    <p><b>👨‍⚕️ الدكتور:</b> {ticketData.doctorName}</p>
                    <p><b>📅 الموعد:</b> {ticketData.appointmentTime}</p>
                    <p><b>📍 العنوان:</b> {ticketData.clinicAddress}</p>
                    <p style={{margin: '5px 0', color: '#1a73e8'}}><b>📞 تليفون العيادة:</b> {ticketData.clinicPhone}</p>
                </div>

                <div style={{ background: '#fff9db', padding: '15px', borderRadius: '15px', textAlign: 'center', marginBottom: '20px', border: '1px solid #ffeeba' }}>
                    <span style={{ fontSize: '13px', color: '#856404' }}>قيمة الكشف المطلوبة</span>
                    <h2 style={{ margin: '5px 0', color: '#856404' }}>{ticketData.fee} ج.م</h2>
                </div>

                <div style={{ border: '1px dashed #3498db', padding: '10px', borderRadius: '10px', textAlign: 'center', color: '#3498db', fontSize: '12px', marginBottom: '15px' }}>
                    📸 يرجى أخذ لقطة شاشة للتذكرة
                </div>

                <button onClick={sendWhatsApp} style={{ width: '100%', padding: '15px', background: '#25D366', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', marginBottom: '10px' }}>إرسال عبر واتساب العيادة 🟢</button>
                <button onClick={onClose} style={{ width: '100%', padding: '10px', background: '#eee', border: 'none', borderRadius: '12px' }}>إغلاق</button>
            </div>
        </div>
    );
    
};

 

function DoctorDashboard({ doctorId, onBack, currentDoctor, onUpdateLocalData, setActivePage }) { const [appointments, setAppointments] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [isEditingProfile, setIsEditingProfile] = React.useState(false);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const resApps = await fetch(`https://clinic-api-ig3d.onrender.com/doctor-appointments/${doctorId}`);
            const dataApps = await resApps.json();
            setAppointments(dataApps || []);
        } catch (error) { console.error("Fetch Error:", error); } finally { setLoading(false); }
    };

     

    const updateStatus = async (appId, newStatus) => {
        try {
            const response = await fetch(`https://clinic-api-ig3d.onrender.com/update-appointment-status/${appId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }) 
            });
            if (response.ok) fetchAppointments();
        } catch (error) { console.error("Update Error:", error); }
    };

    React.useEffect(() => { if (doctorId) fetchAppointments(); }, [doctorId]);

    const statusMap = {
        'pending': { color: '#f1c40f', text: 'بانتظار' },
        'completed': { color: '#27ae60', text: 'تم الكشف' },
        'absent': { color: '#e74c3c', text: 'غياب مريض' }
    };

    return (
        <div style={{ padding: '20px', background: '#f0f2f5', minHeight: '100vh', direction: 'rtl' }}>
            {/* الهيدر مع زرار التعديل الجديد */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '20px', color: '#2c3e50', margin: 0 }}>📋 قائمة الحجوزات</h2>
                <div style={{ display: 'flex', gap: '5px' }}>
               <button 
    onClick={() => setActivePage('doctor_update')} 
    style={{ 
        background: '#3498db', 
        color: '#fff', 
        border: 'none', 
        padding: '10px 15px', 
        borderRadius: '10px', 
        cursor: 'pointer',
        fontWeight: 'bold'
    }}
>
    ⚙️ تعديل بياناتي
</button>

                    <button onClick={onBack} style={{ background: '#e74c3c', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '10px', cursor: 'pointer' }}>خروج</button>
                </div>
            </div>

            

            {/* العدادات (كما هي) */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <div style={statBox}>
                    <div style={{ fontWeight: 'bold', fontSize: '18px' }}>{appointments.length}</div>
                    <div style={{ fontSize: '12px', color: '#7f8c8d' }}>الإجمالي</div>
                </div>
                <div style={{ ...statBox, borderRight: '4px solid #f1c40f' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '18px' }}>{appointments.filter(a => a.status === 'pending').length}</div>
                    <div style={{ fontSize: '12px', color: '#7f8c8d' }}>انتظار</div>
                </div>
            </div>

            {/* القائمة (كما هي تماماً مع أزرار تم وغائب) */}
            {loading ? <p style={{textAlign:'center'}}>جاري التحميل...</p> : (
                appointments.map(app => {
                    const current = statusMap[app.status] || statusMap.pending;
                    return (
                        <div key={app.id} style={{ ...appointmentCard, borderRight: `6px solid ${current.color}`, marginBottom: '15px' }}>
                            <div style={{ flex: 1, paddingRight: '15px' }}>
                                <h4 style={{ margin: '0 0 5px 0' }}>{app.patient_name}</h4>
                                {/* الجزء المعدل لعرض التاريخ والساعة تحت الاسم مباشرة */}
<div style={{ fontSize: '13px', color: '#666', marginTop: '3px' }}>
    📅 {new Date(app.booking_date).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long' })} 
    {" | "} 
    ⏰ {new Date(app.booking_date).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
    {" | "}
    <span style={{ color: current.color, fontWeight: 'bold' }}>{current.text}</span>
</div>
                                <div style={{ fontSize: '14px', color: '#2980b9', marginTop: '5px' }}>📞 {app.mobile}</div>
                            </div>

                            {app.status === 'pending' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <button onClick={() => updateStatus(app.id, 'completed')} style={actionBtn('#27ae60')}>تم</button>
                                    <button onClick={() => updateStatus(app.id, 'absent')} style={actionBtn('#e74c3c')}>غائب</button>
                                </div>
                            )}
                        </div>
                    );
                })
            )}
        </div>
    );
}
// الستايلات (تأكد إنها موجودة برضه)
const statBox = { flex: 1, background: '#fff', padding: '15px', borderRadius: '15px', textAlign: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' };
const appointmentCard = { background: '#fff', padding: '15px', borderRadius: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' };
const actionBtn = (color) => ({ background: color, color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold' });

function DoctorRegister({ onBack, onSuccess }) {
    // البيانات التعريفية للقوائم المنسدلة
    const medicalSpecialties = [
  "الكل", "أسنان", "أطفال وحديثي الولادة", "أنف وأذن وحنجرة", "باطنة", "تغذية علاجية",
  "جراحة أطفال", "جراحة أوعية دموية", "جراحة أورام", "جراحة تجميل", "جراحة سمنة ومناظير",
  "عظام", "جراحة قلب وصدر", "جراحة مخ وأعصاب", "جراحة مسالك بولية", "جلدية",
  "جهاز هضمي وكبد", "حساسية ومناعة", "رمد", "روماتيزم", "علاج طبيعي", "غدد صماء وسكري",
  "امراض دم","قلب وأوعية دموية", "مخ وأعصاب", "نسا وتوليد", "نفسي"
];
    const weekDays = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];
    const hoursArr = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
    const periodsArr = ['صباحاً', 'مساءً'];
    
    // قائمة المحافظات والمدن (يمكنك توسيعها)
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

    // State البيانات
    const [newDoc, setNewDoc] = React.useState({ 
        name: '', mobile: '', specialty: '', fee: '', address: '', 
        personal_mobile: '', title: '', city: '', area: '', password: '' 
    });
    const [scheduleDetails, setScheduleDetails] = React.useState({});
    const [selectedFile, setSelectedFile] = React.useState(null);
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const handleTimeChange = (day, field, value) => {
        setScheduleDetails(prev => ({ ...prev, [day]: { ...prev[day], [field]: value } }));
    };

    const handleRegister = async () => {
        if (!newDoc.name || !newDoc.mobile || !newDoc.password) {
            alert("⚠️ من فضلك أكمل البيانات الأساسية (الاسم، الموبايل، كلمة السر)");
            return;
        }

        setIsSubmitting(true);
        
        // تحويل المواعيد من Object إلى نص طويل للسيرفر
        const availabilityString = weekDays.map(day => {
            const d = scheduleDetails[day];
            if (d?.startH && d?.endH) {
                return `${day} (${d.startH} ${d.startP || 'مساءً'} إلى ${d.endH} ${d.endP || 'مساءً'})`;
            }
            return null;
        }).filter(Boolean).join(' - ');

        const formData = new FormData();
        Object.keys(newDoc).forEach(key => formData.append(key, newDoc[key]));
        formData.append('availability', availabilityString);
        if (selectedFile) formData.append('image', selectedFile);

        try {
            const res = await fetch('https://clinic-api-ig3d.onrender.com/register-doctor', {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                alert("✅ تم إرسال بياناتك بنجاح!");
                if (window.fbq) window.fbq('track', 'CompleteRegistration');
                onSuccess(); 
            } else {
                alert("❌ فشل التسجيل، تأكد أن الرقم غير مسجل مسبقاً");
            }
        } catch (error) {
            alert("⚠️ خطأ في الاتصال بالسيرفر");
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputStyle = { width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '10px', border: '1px solid #ddd', boxSizing: 'border-box', textAlign: 'right' };

    return (
        <div style={{ maxWidth: '850px', margin: '10px auto', padding: '20px', direction: 'rtl', backgroundColor: '#fff', borderRadius: '20px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
            <h2 style={{ textAlign: 'center', color: '#27ae60', fontSize: '20px' }}>👨‍⚕️ انضم إلى منصة دكتور</h2>
            
            <div style={{ display: 'grid', gap: '5px' }}>
                <label style={{ fontSize: '14px', fontWeight: 'bold' }}>الاسم الكامل:</label>
                <input placeholder="د. محمد أحمد" onChange={e => setNewDoc({...newDoc, name: e.target.value})} style={inputStyle} />
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <select onChange={e => setNewDoc({...newDoc, title: e.target.value})} style={inputStyle}>
                        <option value="">اللقب المهني</option>
                        <option value="أخصائي">أخصائي</option>
                        <option value="استشاري">استشاري</option>
                        <option value="أستاذ دكتور">أستاذ دكتور</option>
                    </select>
                    <select onChange={e => setNewDoc({...newDoc, specialty: e.target.value})} style={inputStyle}>
                        <option value="">التخصص الطبي</option>
                        {medicalSpecialties.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <select onChange={e => setNewDoc({...newDoc, city: e.target.value, area: ''})} style={inputStyle}>
                        <option value="">المحافظة</option>
                        {allGovernorates.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                    <select onChange={e => setNewDoc({...newDoc, area: e.target.value})} disabled={!newDoc.city} style={inputStyle}>
                        <option value="">المنطقة</option>
                        {newDoc.city && egyptLocations[newDoc.city].map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                </div>

                <input placeholder="العنوان التفصيلي" onChange={e => setNewDoc({...newDoc, address: e.target.value})} style={inputStyle} />

                <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '15px', marginBottom: '10px' }}>
                    <p style={{ fontWeight: 'bold', margin: '0 0 10px 0' }}>📅 مواعيد العيادة:</p>
                    <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {weekDays.map(day => (
                            <div key={day} style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '8px', fontSize: '12px', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>
                                <span style={{ width: '50px' }}>{day}:</span>
                                <span>من</span>
                                <select style={{ padding: '3px' }} onChange={e => handleTimeChange(day, 'startH', e.target.value)}><option value="">-</option>{hoursArr.map(h => <option key={h} value={h}>{h}</option>)}</select>
                                <select style={{ padding: '3px' }} onChange={e => handleTimeChange(day, 'startP', e.target.value)}>{periodsArr.map(p => <option key={p} value={p}>{p}</option>)}</select>
                                <span>إلى</span>
                                <select style={{ padding: '3px' }} onChange={e => handleTimeChange(day, 'endH', e.target.value)}><option value="">-</option>{hoursArr.map(h => <option key={h} value={h}>{h}</option>)}</select>
                                <select style={{ padding: '3px' }} onChange={e => handleTimeChange(day, 'endP', e.target.value)}>{periodsArr.map(p => <option key={p} value={p}>{p}</option>)}</select>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <input placeholder="سعر الكشف" type="number" onChange={e => setNewDoc({...newDoc, fee: e.target.value})} style={inputStyle} />
                    <input placeholder="كلمة السر" type="password" onChange={e => setNewDoc({...newDoc, password: e.target.value})} style={inputStyle} />
                </div>

                <input placeholder="موبايل الحجز (للمرضى)" onChange={e => setNewDoc({...newDoc, mobile: e.target.value})} style={inputStyle} />
                <input placeholder="موبايل شخصي" onChange={e => setNewDoc({...newDoc, personal_mobile: e.target.value})} style={inputStyle} />
                
                <label style={{ fontSize: '13px' }}>صورة العيادة أو الطبيب:</label>
                <input type="file" accept="image/*" onChange={(e) => setSelectedFile(e.target.files[0])} style={{ marginBottom: '15px' }} />

                <button 
                    onClick={handleRegister} 
                    disabled={isSubmitting}
                    style={{ padding: '15px', background: '#27ae60', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    {isSubmitting ? "جاري الحفظ..." : "إرسال البيانات والاشتراك"}
                </button>
                
                <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#666', marginTop: '10px', cursor: 'pointer' }}>رجوع</button>
            </div>
        </div>
    );
}

function DoctorUpdate({ doctorData, onBack, onUpdateSuccess }) {
    const medicalSpecialties = [
  "الكل", "أسنان", "أطفال وحديثي الولادة", "أنف وأذن وحنجرة", "باطنة", "تغذية علاجية",
  "جراحة أطفال", "جراحة أوعية دموية", "جراحة أورام", "جراحة تجميل", "جراحة سمنة ومناظير",
  "عظام", "جراحة قلب وصدر", "جراحة مخ وأعصاب", "جراحة مسالك بولية", "جلدية",
  "جهاز هضمي وكبد", "حساسية ومناعة", "رمد", "روماتيزم", "علاج طبيعي", "غدد صماء وسكري",
  "امراض دم","قلب وأوعية دموية", "مخ وأعصاب", "نسا وتوليد", "نفسي"
];
    const weekDays = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];
    const hoursArr = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
    const periodsArr = ['صباحاً', 'مساءً'];
    const [formData, setFormData] = React.useState({ ...doctorData });
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

    // نملأ الـ State بالبيانات القديمة للطبيب تلقائياً
    const [editDoc, setEditDoc] = React.useState({ ...doctorData });
    const [scheduleDetails, setScheduleDetails] = React.useState({}); // يفضل تحليل النص القديم هنا لو أردت
    const [selectedFile, setSelectedFile] = React.useState(null);
    const [isUpdating, setIsUpdating] = React.useState(false);
// حط السطر ده في أول الدالة من فوق عشان الإيرور يختفي
     

    const handleTimeChange = (day, field, value) => {
        setScheduleDetails(prev => ({ ...prev, [day]: { ...prev[day], [field]: value } }));
    };
const handleUpdate = async () => {
        setIsUpdating(true);
        
        // 1. تجميع المواعيد
        const availabilityString = weekDays.map(day => {
            const d = scheduleDetails[day];
            if (d?.startH && d?.endH) {
                return `${day} (${d.startH} ${d.startP || 'مساءً'} إلى ${d.endH} ${d.endP || 'مساءً'})`;
            }
            return null;
        }).filter(Boolean).join(' - ');

        // 2. استخدام FormData (عشان السيرفر مستني صورة أو داتا مفككة)
        const dataToSend = new FormData();
        
        // هنا بنستخدم editDoc لأنه الاسم اللي إنت شغال بيه في الحالة (State)
        Object.keys(editDoc).forEach(key => {
            if (editDoc[key] !== null && editDoc[key] !== undefined) {
                dataToSend.append(key, editDoc[key]);
            }
        });
        
        if (availabilityString) dataToSend.append('availability', availabilityString);
        if (selectedFile) dataToSend.append('image', selectedFile);

        // 3. الرابط الصحيح (لازم يبدأ بـ /api/update-doctor/)
        // والـ ID بنجيبه من الـ id أو الـ _id المتاح
        const finalId = editDoc.id || editDoc._id || doctorData.id || doctorData._id;

        try {
            const res = await fetch(`https://clinic-api-ig3d.onrender.com/api/update-doctor/${finalId}`, {
                method: 'PUT', 
                body: dataToSend, 
            });

            const result = await res.json();

            if (res.ok) {
                alert("✅ " + (result.message || "تم التحديث بنجاح!"));
                onUpdateSuccess(result.doctor || editDoc); 
            } else {
                alert("❌ فشل التحديث: " + (result.error || "تأكد من مليء كل الحقول"));
            }
        } catch (error) {
            console.error("Fetch error:", error);
            alert("⚠️ خطأ في الاتصال بالسيرفر");
        } finally {
            setIsUpdating(false);
        }
    };

    const inputStyle = { width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '10px', border: '1px solid #ddd', boxSizing: 'border-box', textAlign: 'right' };

    return (
        <div style={{ maxWidth: '850px', margin: '10px auto', padding: '20px', direction: 'rtl', backgroundColor: '#fff', borderRadius: '20px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
            <h2 style={{ textAlign: 'center', color: '#3498db', fontSize: '20px' }}>⚙️ تحديث بياناتك الشخصية</h2>
            
            <div style={{ display: 'grid', gap: '5px' }}>
                <label>الاسم الحالي:</label>
                <input value={editDoc.name} onChange={e => setEditDoc({...editDoc, name: e.target.value})} style={inputStyle} />
                {/* موبايل الحجز */}
{/* --- بداية الخانات الجديدة --- */}
<div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '15px', background: '#fcfcfc', marginBottom: '15px' }}>
    <p style={{ fontWeight: 'bold', color: '#2c3e50', marginBottom: '10px' }}>📱 بيانات الاتصال:</p>
    
    <label style={{ fontSize: '13px' }}>موبايل الحجز (العيادة):</label>
    <input 
        placeholder="مثلاً: 010..." 
        value={formData.mobile || ''} 
        onChange={e => setFormData({...formData, mobile: e.target.value})} 
        style={inputStyle} 
    />

    <label style={{ fontSize: '13px' }}>الموبايل الشخصي:</label>
    <input 
        placeholder="رقمك الخاص" 
        value={formData.personal_mobile || ''} 
        onChange={e => setFormData({...formData, personal_mobile: e.target.value})} 
        style={inputStyle} 
    />
</div>
{/* --- نهاية الخانات الجديدة --- */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <select value={editDoc.title} onChange={e => setEditDoc({...editDoc, title: e.target.value})} style={inputStyle}>
                        <option value="أخصائي">أخصائي</option>
                        <option value="استشاري">استشاري</option>
                        <option value="أستاذ دكتور">أستاذ دكتور</option>
                    </select>
                    <select value={editDoc.specialty} onChange={e => setEditDoc({...editDoc, specialty: e.target.value})} style={inputStyle}>
                        {medicalSpecialties.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <select value={editDoc.city} onChange={e => setEditDoc({...editDoc, city: e.target.value, area: ''})} style={inputStyle}>
                        <option value="">المحافظة</option>
                        {allGovernorates.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                    <select value={editDoc.area} onChange={e => setEditDoc({...editDoc, area: e.target.value})} style={inputStyle}>
                        <option value="">المنطقة</option>
                        {editDoc.city && egyptLocations[editDoc.city]?.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                </div>

                <label>تغيير مواعيد العيادة (اتركها كما هي إذا لم ترغب في التعديل):</label>
                <div style={{ padding: '15px', background: '#f0f7ff', borderRadius: '15px', marginBottom: '10px' }}>
                     <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                        {weekDays.map(day => (
                            <div key={day} style={{ display: 'flex', gap: '5px', marginBottom: '8px', fontSize: '11px', alignItems: 'center' }}>
                                <span style={{ width: '45px' }}>{day}:</span>
                                <select onChange={e => handleTimeChange(day, 'startH', e.target.value)}><option value="">-</option>{hoursArr.map(h => <option key={h} value={h}>{h}</option>)}</select>
                                <select onChange={e => handleTimeChange(day, 'startP', e.target.value)}>{periodsArr.map(p => <option key={p} value={p}>{p}</option>)}</select>
                                <span>إلى</span>
                                <select onChange={e => handleTimeChange(day, 'endH', e.target.value)}><option value="">-</option>{hoursArr.map(h => <option key={h} value={h}>{h}</option>)}</select>
                                <select onChange={e => handleTimeChange(day, 'endP', e.target.value)}>{periodsArr.map(p => <option key={p} value={p}>{p}</option>)}</select>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <input value={editDoc.fee} placeholder="سعر الكشف الجديد" type="number" onChange={e => setEditDoc({...editDoc, fee: e.target.value})} style={inputStyle} />
                    <input value={editDoc.password} placeholder="كلمة السر" type="text" onChange={e => setEditDoc({...editDoc, password: e.target.value})} style={inputStyle} />
                </div>

                <label>تحديث صورة العيادة:</label>
                <input type="file" accept="image/*" onChange={(e) => setSelectedFile(e.target.files[0])} style={{ marginBottom: '15px' }} />

                <button 
                    onClick={handleUpdate} 
                    disabled={isUpdating}
                    style={{ padding: '15px', background: '#3498db', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    {isUpdating ? "جاري التحديث..." : "حفظ التعديلات"}
                </button>
                
                <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#e74c3c', marginTop: '10px', cursor: 'pointer' }}>إلغاء</button>
            </div>
        </div>
    );
}

function AdminDashboard({ doctors, fetchData, onBack }) {
    const [activeTab, setActiveTab] = useState('doctors');
    const [localAppointments, setLocalAppointments] = useState([]);
    const [selectedDocName, setSelectedDocName] = useState('');
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

    // 1. جلب الحجوزات بالرابط الصحيح (بدون /api)
    useEffect(() => {
        const getApps = async () => {
            try {
                // جربنا /api/appointments وطلعت 404، فاستخدمنا الرابط اللي شغال في صفحة الدكتور
                const res = await fetch('https://clinic-api-ig3d.onrender.com/appointments');
                const data = await res.json();
                if (Array.isArray(data)) {
                    setLocalAppointments(data);
                }
            } catch (e) { 
                console.error("خطأ في جلب البيانات:", e); 
            }
        };
        getApps();
    }, []);

    // 2. وظائف الإدارة (تفعيل/تعطيل وحذف)
    const handleToggle = async (id, currentState) => {
        await fetch(`https://clinic-api-ig3d.onrender.com/toggle-doctor/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: !currentState })
        });
        fetchData(); 
    };

    const handleDelete = async (id) => {
        if (window.confirm("هل تريد حذف هذا الطبيب نهائياً؟")) {
            await fetch(`https://clinic-api-ig3d.onrender.com/delete-doctor/${id}`, { method: 'DELETE' });
            fetchData();
        }
    };

    // 3. منطق الحسابات
    const currentDoc = doctors.find(d => d.name === selectedDocName);
    const doctorAppointments = localAppointments.filter(app => {
        if (!currentDoc) return false;
        const isSameDoc = Number(app.doctor_id) === Number(currentDoc.id);
        const appDate = new Date(app.booking_date);
        const isSameMonth = (appDate.getMonth() + 1) === parseInt(selectedMonth);
        const isCompleted = String(app.status || "").toLowerCase().trim() === 'completed';
        return isSameDoc && isSameMonth && isCompleted;
    });

    const totalAmount = doctorAppointments.length * (currentDoc?.fee || 0);
    const platformFee = totalAmount * 0.20;
    const finalMessage = `🧾 فاتورة مستحقات المنصة\n👨‍⚕️ دكتور: ${selectedDocName}\n📊 حجوزات شهر ${selectedMonth}: ${doctorAppointments.length}\n💰 المجموع: ${totalAmount} ج.م\n🏦 العمولة (20%): ${platformFee} ج.م`;

    return (
        <div style={{ direction: 'rtl', backgroundColor: '#f4f7f6', minHeight: '100vh', paddingBottom: '30px' }}>
            {/* الهيدر */}
            <div style={{ background: '#2c3e50', color: '#fff', padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '20px' }}>➡️</button>
                <h3 style={{ margin: 0 }}>🛡️ لوحة التحكم الإدارية</h3>
                <div style={{ width: '20px' }}></div>
            </div>

            {/* التبويبات */}
            <div style={{ display: 'flex', background: '#fff', borderBottom: '1px solid #ddd' }}>
                <button onClick={() => setActiveTab('doctors')} style={{ flex: 1, padding: '15px', border: 'none', background: 'none', borderBottom: activeTab === 'doctors' ? '3px solid #3498db' : 'none', color: activeTab === 'doctors' ? '#3498db' : '#888', fontWeight: 'bold' }}>إدارة الأطباء</button>
                <button onClick={() => setActiveTab('accounting')} style={{ flex: 1, padding: '15px', border: 'none', background: 'none', borderBottom: activeTab === 'accounting' ? '3px solid #3498db' : 'none', color: activeTab === 'accounting' ? '#3498db' : '#888', fontWeight: 'bold' }}>الحسابات</button>
            </div>

            <div style={{ padding: '15px' }}>
                {activeTab === 'doctors' ? (
                    <>
                        {doctors.map(d => (
                            <div key={d.id} style={{ background: '#fff', padding: '15px', borderRadius: '12px', marginBottom: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <b>{d.name}</b>
                                    <span style={{ color: d.is_active ? '#27ae60' : '#e74c3c' }}>{d.is_active ? '● مفعل' : '● معطل'}</span>
                                </div>
                                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                    <button onClick={() => handleToggle(d.id, d.is_active)} style={{ flex: 2, padding: '8px', borderRadius: '6px', border: 'none', background: d.is_active ? '#f39c12' : '#27ae60', color: '#fff' }}>
                                        {d.is_active ? 'إيقاف' : 'تفعيل'}
                                    </button>
                                    <button onClick={() => handleDelete(d.id)} style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #e74c3c', color: '#e74c3c', background: 'none' }}>حذف</button>
                                </div>
                            </div>
                        ))}
                    </>
                ) : (
                    <div style={{ background: '#fff', padding: '20px', borderRadius: '15px' }}>
                        <select onChange={e => setSelectedDocName(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', marginBottom: '10px' }}>
                            <option value="">-- اختر الدكتور --</option>
                            {doctors.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                        </select>
                        <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', marginBottom: '20px' }}>
                            {[1,2,3,4,5,6,7,8,9,10,11,12].map(m => <option key={m} value={m}>شهر {m}</option>)}
                        </select>

                        {selectedDocName && (
                            <div style={{ textAlign: 'center', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                                <p>حجوزات مكتملة: <b>{doctorAppointments.length}</b></p>
                                <p>الإجمالي: <b>{totalAmount} ج.م</b></p>
                                <p style={{ color: '#e74c3c', fontSize: '18px' }}>عمولة المنصة: <b>{platformFee} ج.م</b></p>
                                <button onClick={() => window.open(`https://wa.me/2${currentDoc?.mobile}?text=${encodeURIComponent(finalMessage)}`)} style={{ width: '100%', padding: '15px', background: '#25D366', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', marginTop: '10px' }}>إرسال الفاتورة واتساب</button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
// --- المكون الرئيسي App ---
export default function App() {
    const [doctors, setDoctors] = useState([]);
    const [activePage, setActivePage] = useState('landing');
    const [searchTerm, setSearchTerm] = useState('');
    const [fSpecialty, setFSpecialty] = useState('الكل');
    const [fCity, setFCity] = useState('الكل');
    const [fArea, setFArea] = useState('الكل');
    const [view, setView] = useState('home'); 
    const [currentDoctor, setCurrentDoctor] = React.useState(null);
    const [doctorMode, setDoctorMode] = React.useState('login'); 
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
    const [appointments, setAppointments] = useState([]); // <--- تأكد من وجود هذا السطر

// ضيف دي تحت الـ States مباشرة جوه App
React.useEffect(() => {
    if (activePage === 'admin_verify') {
        setIsAdminAuthenticated(true); // تفعيل الصلاحية
        setActivePage('admin');        // تحويل لصفحة الإدارة
    }
}, [activePage]);

useEffect(() => {
    // لو المريض ضغط "دخول مريض" وهو مخزن بياناته أصلاً
    if (activePage === 'patient_login') {
        const savedName = localStorage.getItem('saved_pName');
        if (savedName) {
            // طالما فيه اسم محفوظ، ابعته لصفحة البحث علطول
            setActivePage('patient_search');
        }
    }
}, [activePage]);    

    // دالة جلب البيانات (تأكد إن اسمها fetchData)
    const fetchData = async () => {
        try {
            const drRes = await fetch('https://clinic-api-ig3d.onrender.com/doctors');
            const drData = await drRes.json();
            setDoctors(drData);

            const appRes = await fetch('https://clinic-api-ig3d.onrender.com/appointments');
            const appData = await appRes.json();
            setAppointments(appData);
        } catch (e) { console.error("Error fetching data", e); }
    };
    // ... باقي الكود

    useEffect(() => {
        fetch('https://clinic-api-ig3d.onrender.com/doctors')
            .then(res => res.json())
            .then(data => setDoctors(data))
            .catch(e => console.error("Error"));
    }, []);

// --- إضافة التحكم في زرار الرجوع للموبايل ---
   useEffect(() => {
        const handleBackButton = () => {
            // لو المستخدم في صفحة الهبوط (الشاشة الرئيسية) نخرج من التطبيق
            if (activePage === 'landing') {
                return;
            }

            // منطق الرجوع الذكي بناءً على الصفحة الحالية
            if (activePage === 'patient_login' || activePage === 'join' || activePage === 'admin') {
                setActivePage('landing');
            } 
            else if (activePage === 'patient_search') {
                setActivePage('patient_login');
            } 
            else if (activePage === 'home') {
                setActivePage('patient_search');
            } 
            else if (activePage === 'doctor_dashboard') {
                setActivePage('landing');
                setCurrentDoctor(null);
            } // <--- القوس ده كان ناقص عندك
            else if (activePage === 'doctor_update') {
                setActivePage('doctor_dashboard');
            }
        }; // <--- القوس ده كان ناقص لقفل الوظيفة

        // 2. تفعيل المستمع الحقيقي لزرار الموبايل
        const backListener = (async () => {
            const { App: CapApp } = await import('@capacitor/app');
            return CapApp.addListener('backButton', () => {
                handleBackButton(); 
            });
        })();

        // 3. تنظيف المستمع عند إغلاق الصفحة
        return () => {
            backListener.then(l => l.remove());
        };
    }, [activePage]); // <--- القوس ده كان ناقص لقفل 
    return (
    // الـ useEffect // تأكد من إضافة activePage كاعتماد عشان يتحدث مع تغير الصفحة
        <div style={{ direction: 'rtl', fontFamily: 'Arial' }}>
            
            {/* 1. الشاشة الرئيسية */}
            {activePage === 'landing' && <LandingPage onSelect={setActivePage} />}

            {/* 2. شاشة دخول المريض */}
            {activePage === 'patient_login' && (
                <div style={{ padding: '40px', textAlign: 'center', background: '#f0f2f5', height: '100vh' }}>
                    <h3>تسجيل دخول مريض</h3>
                    <input placeholder="الاسم" style={inputStyle} id="pName" />
                    <input placeholder="رقم الموبايل" style={inputStyle} id="pPhone" />
                   <button onClick={() => {
                        const name = document.getElementById('pName').value;
                        const phone = document.getElementById('pPhone').value;
                        
                        if (name && phone) {
                            localStorage.setItem('saved_pName', name);
                            localStorage.setItem('saved_pPhone', phone);
                            setActivePage('patient_search');
                        } else {
                            alert("برجاء إدخال الاسم ورقم الموبايل");
                        }
                    }} style={{...landingBtnStyle, backgroundColor: '#1a73e8', color: '#fff'}}>
                        دخول
                    </button>

                    <button onClick={() => setActivePage('landing')} style={{ background: 'none', border: 'none', marginTop: '20px', color: '#666', cursor: 'pointer' }}>
                        رجوع للشاشة الرئيسية
                    </button>
                </div>
            )}

            {/* 3. شاشة الطبيب (دخول أو انضمام) */}
            {activePage === 'join' && (
                <div style={{ direction: 'rtl', padding: '20px', background: '#f0f2f5', minHeight: '100vh' }}>
                    {doctorMode === 'login' ? (
                        <>
                            <div style={{ background: '#fff', padding: '20px', borderRadius: '15px', marginBottom: '20px', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                                <h3 style={{ fontSize: '16px', color: '#2c3e50' }}>هل أنت طبيب جديد؟</h3>
                                <button 
                                    onClick={() => setDoctorMode('register')}
                                    style={{ background: '#27ae60', color: '#fff', border: 'none', padding: '12px', borderRadius: '10px', width: '100%', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}
                                >
                                    ✨ انضم إلى منصة دكتور الآن
                                </button>
                            </div>
                            <DoctorLogin 
                                onLoginSuccess={(doctor) => {
                                    setCurrentDoctor(doctor);
                                    setActivePage('doctor_dashboard');
                                }}
                                onBack={() => setActivePage('landing')}
                            />
                        </>
                    ) : (
                        <DoctorRegister 
                            onBack={() => setDoctorMode('login')} 
                            onSuccess={(newDoctor) => {
                                setCurrentDoctor(newDoctor);
                                setActivePage('doctor_dashboard');
                            }}
                        />
                    )}
                </div>
            )}

            {/* 4. لوحة تحكم الطبيب */}
            {activePage === 'doctor_dashboard' && (
                <DoctorDashboard 
                    doctorId={currentDoctor?.id} 
                    currentDoctor={currentDoctor}
                    setActivePage={setActivePage} 
                    onUpdateLocalData={(newData) => setCurrentDoctor({...currentDoctor, ...newData})}
                    onBack={() => { setCurrentDoctor(null); setActivePage('landing'); }} 
                />
            )}

            {/* 8. شاشة تحديث بيانات الطبيب (دي اللي كانت ناقصة يا برنس) */}
          {activePage === 'doctor_update' && currentDoctor && (
    <DoctorUpdate 
        doctorData={currentDoctor} 
        onBack={() => setActivePage('doctor_dashboard')} 
        onUpdateSuccess={(updatedDoc) => {
            setCurrentDoctor(updatedDoc); // بنحدث البيانات في الـ App
            setActivePage('doctor_dashboard'); // بنرجعه للوحة التحكم
        }} 
    />
)}

           
{/* 5. بحث المرضى */}
{activePage === 'patient_search' && (
    <PatientSearch 
        states={{searchTerm, fSpecialty, fCity, fArea}}
        setters={{setSearchTerm, setFSpecialty, setFCity, setFArea}}
        onSearch={() => setActivePage('home')} 
        onBack={() => setActivePage('landing')} // زرار الرجوع اللي طلبته
    />
)}
{/* تأكد من إضافة هذا الجزء ليعرض صفحة النتائج */}
{activePage === 'home' && (
    <BookingPage 
        doctors={doctors} 
        filters={{searchTerm, fSpecialty, fCity, fArea}} 
        onBack={() => setActivePage('patient_search')} 
    />
)}

    {/* 7. صفحة الإدارة */}
{activePage === 'admin' && isAdminAuthenticated && (
    <AdminDashboard 
        doctors={doctors} 
        appointments={appointments} 
        fetchData={fetchData} 
        onBack={() => {
            setIsAdminAuthenticated(false); // مسح التوثيق عند الرجوع لزيادة الأمان
            setActivePage('landing');
        }} 
    />
)}
        </div>
    );
}