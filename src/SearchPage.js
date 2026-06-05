// SearchPage.js
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// الثوابت اللي كانت في الـ App.js، ممكن تجيبها من ملف منفصل (constants.js مثلاً)
// أو تنسخها هنا مؤقتًا
const medicalSpecialties = [
  "الكل", "أسنان", "أطفال وحديثي الولادة", "أنف وأذن وحنجرة", "باطنة", "تغذية علاجية",
  "جراحة أطفال", "جراحة أوعية دموية", "جراحة أورام", "جراحة تجميل", "جراحة سمنة ونحافة",
  "عظام", "جراحة قلب وصدر", "جراحة مخ وأعصاب", "جراحة مسالك بولية", "جلدية",
  "جهاز هضمي وكبد", "حساسية ومناعة", "رمد", "روماتيزم", "ذكورة وعقم", "علاج طبيعي", "غدد صماء وسكري",
  "جراحة عامه","امراض دم","قلب وأوعية دموية", "مخ وأعصاب", "نسا وتوليد", "تخاطب", "كلى", "جراحة عمود فقري", "صدر", "نفسي أطفال", "نفسي"
];
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
    // ... باقي المحافظات
};
const allGovernorates = Object.keys(egyptLocations);

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
    const days = { 'الأحد': 0, 'الاثنين': 1, 'الثلاثاء': 2, 'الأربعاء': 3, 'الخميس': 4, 'الجمعة': 5, 'السبت': 6 };
    const cleanDayName = dayName.replace('،', '').trim();
    const targetDay = days[cleanDayName];
    const now = new Date();
    const currentDayOfWeek = now.getDay();

    // حساب الفرق بين اليوم الحالي واليوم المستهدف
    let diff = targetDay - currentDayOfWeek;

    // إذا كان الفرق بالسالب (أي أن اليوم قد مر في الأسبوع الحالي)، نضيف 7 أيام
    // إذا كان الفرق 0 (اليوم هو نفس اليوم)، نستخدم اليوم الحالي (diff = 0)
    if (diff < 0) {
        diff += 7;
    }

    const resultDate = new Date(now);
    resultDate.setDate(now.getDate() + diff);
    
    return resultDate.toISOString().split('T')[0];
};


function SearchPage({ doctors, fetchData, currentUser, openLogin }) {
    const location = useLocation(); // للوصول إلى query parameters
    const navigate = useNavigate();

    // حالة الفلاتر بناءً على الـ URL أو الافتراضيات
    const query = new URLSearchParams(location.search);
    const [searchTerm, setSearchTerm] = useState(query.get('name') || '');
    const [fSpecialty, setFSpecialty] = useState(query.get('specialty') || 'الكل');
    const [fCity, setFCity] = useState(query.get('city') || 'الكل');
    const [fArea, setFArea] = useState(query.get('area') || 'الكل');

    const [selectedDoc, setSelectedDoc] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showTicket, setShowTicket] = useState(false);
    const [patientData, setPatientData] = useState({ name: '', mobile: '' });

    const doctorsListRef = useRef(null);

    // تحديث الفلاتر عند تغيير الـ URL (مثلاً عند الرجوع من صفحة أخرى)
    useEffect(() => {
        const newQuery = new URLSearchParams(location.search);
        setSearchTerm(newQuery.get('name') || '');
        setFSpecialty(newQuery.get('specialty') || 'الكل');
        setFCity(newQuery.get('city') || 'الكل');
        setFArea(newQuery.get('area') || 'الكل');
    }, [location.search]);

    const filteredDoctors = doctors
        .filter(d => 
            d.is_active &&
            (fSpecialty === 'الكل' || d.specialty === fSpecialty) &&
            (fCity === 'الكل' || d.city === fCity) &&
            (fArea === 'الكل' || d.area === fArea) &&
            d.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            const orderA = a.sort_order ?? 999;
            const orderB = b.sort_order ?? 999;
            if (orderA !== orderB) return orderA - orderB;
            return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        });

    const handleConfirm = async () => {
        try {
            const dayName = selectedSlot.split(' ')[0]; 
            const actualDate = getNextDateForDay(dayName); 

            const bookingData = {
                doctor_id: selectedDoc.id,
                doctor_name: selectedDoc.name,
                patient_name: patientData.name,
                mobile: patientData.mobile,
                appointment_date: actualDate,
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

    // تحديث الـ URL عند تغيير الفلاتر (لضمان عمل زر الرجوع والمشاركة)
    useEffect(() => {
        const params = new URLSearchParams();
        if (searchTerm) params.append('name', searchTerm);
        if (fSpecialty !== 'الكل') params.append('specialty', fSpecialty);
        if (fCity !== 'الكل') params.append('city', fCity);
        if (fArea !== 'الكل') params.append('area', fArea);
        navigate(`?${params.toString()}`, { replace: true });
    }, [searchTerm, fSpecialty, fCity, fArea, navigate]);


    return (
        <div style={{ backgroundColor: '#f0f4f8', minHeight: '100vh', direction: 'rtl', padding: '20px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: 'bold', textAlign: 'center', margin: '20px 0', color: '#2c3e50' }}>ابحث عن دكتورك</h2>

            {/* شريط البحث المطور - تصميم (البار العريض) */}
            <div style={{ 
                background: '#fff', 
                borderRadius: '15px', 
                marginBottom: '40px', 
                boxShadow: '0 15px 40px rgba(0,0,0,0.12)', 
                display: 'flex', 
                flexWrap: 'wrap', 
                alignItems: 'stretch', 
                border: '1px solid #ddd',
                overflow: 'hidden', 
                direction: 'rtl',
                maxWidth: '1200px',
                margin: '0 auto 40px'
            }}>
                <div style={{ flex: '1 1 250px', minWidth: '200px', padding: '10px 15px', display: 'flex', flexDirection: 'column', borderLeft: '1px solid #eee' }}>
                    <label style={{ fontSize: '18px', color: '#0a0101', marginRight: '10px' }}>التخصص</label>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ fontSize: '24px', marginLeft: '5px' }}>🩺</span>
                        <select onChange={e => setFSpecialty(e.target.value)} value={fSpecialty} style={{ border: 'none', width: '100%', fontSize: '16px', fontWeight: 'bold', outline: 'none', cursor: 'pointer', background: 'transparent' }}>
                            <option value="الكل">كل التخصصات</option>
                            {medicalSpecialties.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                </div>

                <div style={{ flex: '1 1 250px', minWidth: '200px', padding: '10px 15px', display: 'flex', flexDirection: 'column', borderLeft: '1px solid #eee' }}>
                    <label style={{ fontSize: '20px', color: '#030101', marginRight: '10px' }}>المحافظة</label>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ fontSize: '24px', marginLeft: '5px' }}>📍</span>
                        <select 
                            value={fCity}
                            onChange={e => { setFCity(e.target.value); setFArea("الكل"); }} 
                            style={{ border: 'none', width: '100%', fontSize: '16px', fontWeight: 'bold', outline: 'none', cursor: 'pointer', background: 'transparent' }}
                        >
                            <option value="الكل">كل المحافظات</option>
                            {Object.keys(egyptLocations).map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                    </div>
                </div>

                <div style={{ 
                    flex: '1 1 250px', 
                    minWidth: '200px',
                    padding: '10px 15px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    borderLeft: '1px solid #eee',
                    opacity: fCity === 'الكل' ? 0.6 : 1,
                    transition: '0.3s'
                }}>
                    <label style={{ fontSize: '20px', color: '#0a0202', marginRight: '10px' }}>المنطقة</label>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ fontSize: '24px', marginLeft: '5px' }}>🏘️</span>
                        <select 
                            disabled={fCity === 'الكل'}
                            value={fArea} 
                            onChange={(e) => setFArea(e.target.value)} 
                            style={{ 
                                border: 'none', 
                                width: '100%', 
                                fontSize: '20px', 
                                fontWeight: 'bold', 
                                outline: 'none', 
                                cursor: fCity === 'الكل' ? 'not-allowed' : 'pointer', 
                                background: 'transparent' 
                            }}
                        >
                            <option value="الكل">اختيار المنطقة</option>
                            {fCity !== 'الكل' && egyptLocations[fCity]?.map(area => (
                                <option key={area} value={area}>{area}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div style={{ flex: '1 1 250px', minWidth: '200px', padding: '10px 15px', display: 'flex', flexDirection: 'column' }}>
                    <label style={{ fontSize: '20px', color: '#070101', marginRight: '10px' }}>اسم الدكتور</label>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ fontSize: '24px', marginLeft: '5px' }}>🔍</span>
                        <input 
                            placeholder="الدكتور" 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            style={{ 
                                border: 'none', 
                                width: '100%', 
                                outline: 'none', 
                                fontSize: '20px', 
                                fontWeight: 'bold' 
                            }} 
                        />
                    </div>
                </div>
            </div>

            {/* 3. قائمة الأطباء (البطاقات) */}
            <div ref={doctorsListRef} style={{
                display: 'flex',
                gap: '35px',
                flexWrap: 'wrap', 
                justifyContent: 'center', 
                padding: '40px 10px'
            }}>
                {filteredDoctors.length > 0 ? (
                    filteredDoctors.map(doc => (
                        <div key={doc.id} style={{
                            position: 'relative',
                            backgroundColor: '#7bfbff',
                            padding: '25px',
                            borderRadius: '20px',
                            width: '300px',
                            textAlign: 'center',
                            border: '1px solid #0a0202',
                            boxShadow: '0 6px 18px rgba(41, 38, 38, 0.06)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}>
                            {doc.featured && ( // تم تغيير `featured` إلى `featured` بناءً على كودك
                                <div style={{
                                    position: 'absolute', top: '15px', left: '15px', 
                                    background: 'linear-gradient(45deg, #f7e167, #f3e567)', 
                                    color: '#000', padding: '8px 22px', borderRadius: '12px', 
                                    fontWeight: '1000', textShadow: '1px 1px 0px rgba(255,255,255,0.3)', 
                                    letterSpacing: '1px', fontSize: '28px', boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                                    zIndex: 100, border: '1px solid #ebbc2e'
                                }}>
                                    مُمَيز
                                </div>
                            )}
                            <img 
                                src={getOptimizedImage(doc.image_url) || `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.name)}&background=random&color=fff`} 
                                alt={`دكتور ${doc.name} - حجز أطباء - منصة دكتور`} 
                                loading="lazy" 
                                style={{ width: '100px', height: '100px', borderRadius: '50%', marginBottom: '15px', objectFit: 'cover', border: '3px solid #f0f4f8' }} 
                            />
                            <h3 style={{ fontSize: '24px', fontWeight: 'bold', margin: '5px 0' }}>
                                دكتور / {doc.name}
                            </h3>
                            <p style={{ fontSize: '18px', color: '#1a73e8', fontWeight: 'bold' }}>
                                {doc.title} {doc.specialty}
                            </p>
                            {doc.bio ? (() => {
                                const BioSection = () => {
                                    const [isExpanded, setIsExpanded] = React.useState(false);
                                    const truncatedStyle = {
                                        fontSize: '15px', color: '#0c0404', fontStyle: 'italic', lineHeight: '1.5em', margin: '5px 0',
                                        display: '-webkit-box', WebkitLineClamp: isExpanded ? 'unset' : '2', 
                                        WebkitBoxDirection: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis',
                                        maxHeight: isExpanded ? 'none' : '3em', 
                                    };
                                    return (
                                        <div style={{ width: '100%', minHeight: '80px' }}>
                                            <p style={truncatedStyle}>"{doc.bio}"</p>
                                            {doc.bio.length > 50 && (
                                                <button 
                                                    onClick={() => setIsExpanded(!isExpanded)}
                                                    style={{ background: 'none', border: 'none', color: '#01060c', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', padding: '0', display: 'block', margin: '0 auto' }}
                                                >
                                                    {isExpanded ? 'عرض أقل' : '... المزيد'}
                                                </button>
                                            )}
                                        </div>
                                    );
                                };
                                return <BioSection />;
                            })() : <div style={{ height: '80px' }}></div>}
                            <p style={{ color: '#000000', fontWeight: 'bold', fontSize: '15px', marginBottom: '20px' }}>
                                📍 {doc.city} - {doc.area} 
                                {doc.address && (
                                    <span style={{ color: '#070101', fontSize: '16px', marginRight: '8px', fontWeight: 'normal' }}>
                                        ({doc.address.split(' ').filter(word => word !== "").slice(0, 3).join(' ')}...)
                                    </span>
                                )}
                            </p>
                            <div style={{
                                backgroundColor: '#85df51', border: '1px solid #3f69df', 
                                borderRadius: '8px', padding: '5px 15px', margin: '10px 0',
                                display: 'inline-block', color: '#070c03', fontWeight: 'bold', fontSize: '15px'
                            }}>
                                قيمة الكشف: {doc.fee || '0'} جنيه
                            </div>
                            <div style={{ color: '#cfe743', fontSize: '18px', marginBottom: '10px' }}>
                                ⭐⭐⭐⭐⭐ <span style={{ color: '#010c06', fontSize: '14px' }}>(5.0)</span>
                            </div>
                            <button 
                                onClick={() => {
                                    if (!currentUser) { openLogin(); } else { setSelectedDoc(doc); setShowModal(true); }
                                }} 
                                style={{ 
                                    background: 'linear-gradient(45deg, #1a73e8, #0d47a1)', color: '#fff', 
                                    border: 'none', padding: '12px', borderRadius: '12px', width: '100%', 
                                    marginTop: '15px', fontWeight: 'bold', cursor: 'pointer',
                                    transition: '0.3s', boxShadow: '0 4px 15px rgba(26, 115, 232, 0.3)'
                                }}
                                onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
                                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                            >
                                {currentUser ? 'احجز موعدك الآن' : 'سجل دخول للحجز'}
                            </button>
                        </div>
                    ))
                ) : (
                    <p style={{ fontSize: '20px', color: '#555', marginTop: '50px' }}>لا توجد نتائج مطابقة لبحثك.</p>
                )}
            </div>

            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100 }}>
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
                        <div style={{
                            marginTop: '15px', padding: '12px', backgroundColor: '#fff9db', 
                            borderRight: '5px solid #fcc419', borderRadius: '4px', textAlign: 'right'
                        }}>
                            <span style={{ fontSize: '16px', color: '#666' }}>قيمة الكشف المطلوبة:</span>
                            <h3 style={{ margin: '5px 0 0 0', color: '#e67e22', fontWeight: 'bold' }}>
                                {selectedDoc.fee} ج.م
                            </h3>
                            <small style={{ color: '#999' }}>* يتم الدفع عند الحضور للعيادة</small>
                        </div>
                        <div style={{
                            marginTop: '20px', padding: '10px', backgroundColor: '#e7f3ff', 
                            border: '1px dashed #007bff', borderRadius: '8px', textAlign: 'center',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                        }}>
                            <span style={{ fontSize: '20px' }}>📸</span>
                            <span style={{ color: '#0056b3', fontWeight: 'bold', fontSize: '14px' }}>
                                من فضلك خذ لقطة شاشة (Screenshot) للتذكرة  
                            </span>
                        </div>
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

export default SearchPage;