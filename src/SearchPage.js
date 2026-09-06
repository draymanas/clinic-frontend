// SearchPage.js - متوافق مع نظام JavaScript (JS) الخالص مع تقسيم المواعيد كل 15 دقيقة والتذكرة الموحدة الفاخرة
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const medicalSpecialties = [
  "الكل", "أسنان", "أطفال وحديثي الولادة", "أنف وأذن وحنجرة", "باطنة", "تغذية علاجية",
  "جراحة أطفال", "جراحة أوعية دموية", "جراحة أورام", "جراحة تجميل", "جراحة سمنة ونحافة",
  "عظام", "جراحة قلب وصدر", "جراحة مخ وأعصاب", "جراحة مسالك بولية", "جلدية",
  "جهاز هضمي وكبد", "حساسية ومناعة", "رمد", "روماتيزم", "ذكورة وعقم", "علاج طبيعي", "غدد صماء وسكري",
  "جراحة عامه","امراض دم","قلب وأوعية دموية", "مخ وأعصاب", "نسا وتوليد", "تخاطب", "كلى", "جراحة عمود فقري", "صدر", "نفسي أطفال", "نفسي"
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
    const cleanDayName = dayName ? dayName.replace('،', '').trim() : 'الأحد';
    const targetDay = days[cleanDayName] !== undefined ? days[cleanDayName] : 0;
    const now = new Date();
    const currentDayOfWeek = now.getDay();

    let diff = targetDay - currentDayOfWeek;
    if (diff < 0) {
        diff += 7;
    }

    const resultDate = new Date(now);
    resultDate.setDate(now.getDate() + diff);
    
    return resultDate.toISOString().split('T')[0];
};

// 🌟 دوال الذكاء الاصطناعي لحساب المواعيد كل 15 دقيقة واستبعاد المحجوز
const parseTimeToMinutes = (timeStr) => {
    if (!timeStr) return null;
    const isPM = /مساء|م|عصرا|ليلا|pm/i.test(timeStr);
    const isAM = /صباحا|ص|am/i.test(timeStr);
    
    const match = timeStr.match(/(\d{1,2})(?::(\d{2}))?/);
    if (!match) return null;
    
    let hours = parseInt(match[1], 10);
    const minutes = match[2] ? parseInt(match[2], 10) : 0;
    
    if (isPM && hours < 12) hours += 12;
    if (isAM && hours === 12) hours = 0;
    
    return hours * 60 + minutes;
};

const formatMinutesToTime = (totalMinutes) => {
    let hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const period = hours >= 12 ? 'مساءً' : 'صباحاً';
    
    if (hours > 12) hours -= 12;
    if (hours === 0) hours = 12;
    
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    return `${hours}:${formattedMinutes} ${period}`;
};

const generate15MinSlots = (availabilitySlot) => {
    if (!availabilitySlot) return [];
    
    const clean = availabilitySlot.replace(/[()]/g, '');
    const parts = clean.split(/إلى|الي|-|حتى|to/i);
    
    let startMin = null;
    let endMin = null;
    
    if (parts.length >= 2) {
        startMin = parseTimeToMinutes(parts[0]);
        endMin = parseTimeToMinutes(parts[1]);
    }
    
    if (startMin === null || endMin === null || endMin <= startMin) {
        startMin = 17 * 60; // 5:00 PM
        endMin = 19 * 60;   // 7:00 PM
    }
    
    const slots = [];
    for (let current = startMin; current < endMin; current += 15) {
        slots.push(formatMinutesToTime(current));
    }
    
    return slots;
};

const getBookedSlotsForDoctor = (doctorId, date) => {
    try {
        const stored = localStorage.getItem(`booked_slots_${doctorId}_${date}`);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
};

const saveBookedSlotForDoctor = (doctorId, date, timeSlot) => {
    try {
        const current = getBookedSlotsForDoctor(doctorId, date);
        if (!current.includes(timeSlot)) {
            current.push(timeSlot);
            localStorage.setItem(`booked_slots_${doctorId}_${date}`, JSON.stringify(current));
        }
    } catch (e) {
        console.warn('Could not save booked slot', e);
    }
};

// 🌟 دالة إنشاء رابط صديق لمحركات البحث (SEO URL) يظهر اسم الطبيب وتخصصه
const getDoctorUrl = (doc) => {
    if (!doc || !doc.id) return '/search';
    const titlePart = doc.title ? `${doc.title} ` : '';
    const rawText = `دكتور ${doc.name} ${titlePart}${doc.specialty || ''}`.trim();
    const cleanSlug = rawText
        .replace(/[\/\#\?\&\\\:\*\"\'\<\>\|\(\)\,\.]/g, '')
        .trim()
        .replace(/\s+/g, '-');
    return `/dr/${doc.id}-${encodeURIComponent(cleanSlug)}`;
};

export function SearchPage(props) {
    const { doctors = [], fetchData, currentUser, openLogin } = props || {};
    const location = useLocation();
    const navigate = useNavigate();

    // حالة الفلاتر بناءً على الـ URL أو الافتراضيات
    const query = new URLSearchParams(location.search);
    const [searchTerm, setSearchTerm] = useState(query.get('name') || '');
    const [fSpecialty, setFSpecialty] = useState(query.get('specialty') || 'الكل');
    const [fCity, setFCity] = useState(query.get('city') || 'الكل');
    const [fArea, setFArea] = useState(query.get('area') || 'الكل');

    const [selectedDoc, setSelectedDoc] = useState(null);
    const [selectedDay, setSelectedDay] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
    const [bookedSlotsList, setBookedSlotsList] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showTicket, setShowTicket] = useState(false);
    const [patientData, setPatientData] = useState({ name: '', mobile: '' });

    const doctorsListRef = useRef(null);

    // تحديث قائمة المواعيد المتاحة كل 15 دقيقة فور اختيار اليوم واستبعاد المحجوز
    useEffect(() => {
        if (selectedDoc && selectedDay) {
            const dayName = selectedDay.split(' ')[0];
            const actualDate = getNextDateForDay(dayName);
            const allSlots = generate15MinSlots(selectedDay);
            const booked = getBookedSlotsForDoctor(selectedDoc.id, actualDate);
            
            setBookedSlotsList(booked);
            // إخفاء المواعيد المحجوزة مسبقاً حتى لا تظهر لباقي المرضى نهائياً
            const freeSlots = allSlots.filter(slot => !booked.includes(slot));
            setAvailableTimeSlots(freeSlots);
            setSelectedTime(''); // إعادة ضبط الموعد المختار
        } else {
            setAvailableTimeSlots([]);
            setBookedSlotsList([]);
            setSelectedTime('');
        }
    }, [selectedDoc, selectedDay]);

    // فتح نافذة الحجز مع تهيئة الأيام
    const handleOpenBooking = (doc) => {
        setSelectedDoc(doc);
        const slots = doc.availability ? doc.availability.split(' - ').map(s => s.trim()).filter(Boolean) : [];
        if (slots.length > 0) {
            setSelectedDay(slots[0]);
        } else {
            setSelectedDay('الأحد (5:00 مساءً إلى 7:00 مساءً)');
        }
        setSelectedTime('');
        setPatientData({ name: '', mobile: '' });
        setShowModal(true);
    };

    // تحديث الفلاتر عند تغيير الـ URL (مثلاً عند الرجوع من صفحة أخرى)
    useEffect(() => {
        const newQuery = new URLSearchParams(location.search);
        setSearchTerm(newQuery.get('name') || '');
        setFSpecialty(newQuery.get('specialty') || 'الكل');
        setFCity(newQuery.get('city') || 'الكل');
        setFArea(newQuery.get('area') || 'الكل');
    }, [location.search]);

    // دعم جلب الأطباء تلقائياً إن لم يتم تمريرهم عبر الـ props
    const [localDoctors, setLocalDoctors] = useState([]);
    useEffect(() => {
        if (!doctors || doctors.length === 0) {
            fetch('https://clinic-api-ig3d.onrender.com/doctors')
                .then(r => r.json())
                .then(data => {
                    if (Array.isArray(data)) setLocalDoctors(data);
                })
                .catch(err => {
                    console.warn('استخدام أطباء المعاينة:', err);
                    setLocalDoctors([
                        {
                            id: 'ayman-aguib',
                            name: 'ايمن عجيب - فرع اكتوبر',
                            title: 'استشاري',
                            specialty: 'مخ وأعصاب',
                            city: 'الجيزة',
                            area: '6 أكتوبر',
                            address: 'ميدان الحصري / فوق شعبان / الدور الرابع',
                            fee: '600',
                            is_active: true,
                            featured: true,
                            image_url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80',
                            availability: 'الأحد (5:00 مساءً إلى 7:00 مساءً) - الأربعاء (5:00 مساءً إلى 7:00 مساءً)',
                            bio: 'استشاري أول جراحة المخ والأعصاب والعمود الفقري، خبرة واسعة في علاج الانزلاق الغضروفي والصداع المزمن واعتلال الأعصاب.',
                            mobile: '01032368436'
                        }
                    ]);
                });
        }
    }, [doctors]);

    const activeList = (doctors && doctors.length > 0) ? doctors : localDoctors;

    const filteredDoctors = activeList
        .filter(d => 
            (d.is_active !== false) &&
            (fSpecialty === 'الكل' || d.specialty === fSpecialty) &&
            (fCity === 'الكل' || d.city === fCity) &&
            (fArea === 'الكل' || d.area === fArea) &&
            d.name?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            const orderA = a.sort_order ?? 999;
            const orderB = b.sort_order ?? 999;
            if (orderA !== orderB) return orderA - orderB;
            return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        });

    const handleConfirm = async () => {
        if (!selectedDay) {
            alert("من فضلك اختر اليوم المناسب أولاً");
            return;
        }
        if (!selectedTime) {
            alert("من فضلك اختر موعد وساعة الكشف المناسبة لك من المواعيد المتاحة");
            return;
        }
        if (!patientData.name.trim() || !patientData.mobile.trim()) {
            alert("من فضلك أدخل اسم المريض ورقم الموبايل لتأكيد الحجز");
            return;
        }

        const dayName = selectedDay.split(' ')[0]; 
        const actualDate = getNextDateForDay(dayName); 
        const fullAppointment = `${dayName} (${actualDate}) | الساعة: ${selectedTime}`;

        // حفظ الموعد كمحجوز فوراً لمنع ظهوره لباقي المرضى
        saveBookedSlotForDoctor(selectedDoc.id, actualDate, selectedTime);

        const bookingData = {
            doctor_id: selectedDoc.id,
            doctor_name: selectedDoc.name,
            patient_name: patientData.name,
            mobile: patientData.mobile,
            appointment_date: actualDate,
            appointment_time: selectedTime,
            price: selectedDoc.fee,
            status: 'pending'
        };

        try {
            await fetch('https://clinic-api-ig3d.onrender.com/book-appointment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingData),
            });
            if (typeof fetchData === 'function') fetchData();
        } catch (error) {
            console.error("Error during booking:", error);
        } finally {
            setSelectedSlot(fullAppointment);
            setShowModal(false);
            setShowTicket(true);
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

            {/* 3. قائمة الأطباء (البطاقات) - الضغط على البطاقة يفتح صفحة الدكتور بالرابط الاحترافي */}
            <div ref={doctorsListRef} style={{
                display: 'flex',
                gap: '35px',
                flexWrap: 'wrap', 
                justifyContent: 'center', 
                padding: '40px 10px'
            }}>
                {filteredDoctors.length > 0 ? (
                    filteredDoctors.map(doc => (
                        <div 
                            key={doc.id}
                            // 🌟 عند الضغط على أي مكان في بطاقة الدكتور يتم الانتقال لصفحته بالرابط الاحترافي (1255-اسم-تخصص)
                            onClick={() => {
                                navigate(getDoctorUrl(doc));
                            }}
                            title="اضغط لعرض الملف الشخصي ومواعيد الطبيب"
                            style={{
                                position: 'relative',
                                backgroundColor: '#ffffff',
                                padding: '25px',
                                borderRadius: '24px',
                                width: '310px',
                                textAlign: 'center',
                                border: '1.5px solid #e2e8f0',
                                boxShadow: '0 10px 25px rgba(15, 23, 42, 0.06)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.25s ease',
                                boxSizing: 'border-box'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'translateY(-5px)';
                                e.currentTarget.style.boxShadow = '0 18px 35px rgba(15, 23, 42, 0.12)';
                                e.currentTarget.style.borderColor = '#3b82f6';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 10px 25px rgba(15, 23, 42, 0.06)';
                                e.currentTarget.style.borderColor = '#e2e8f0';
                            }}
                        >
                            {doc.featured && (
                                <div style={{
                                    position: 'absolute', top: '15px', left: '15px', 
                                    background: 'linear-gradient(45deg, #f59e0b, #d97706)', 
                                    color: '#fff', padding: '4px 14px', borderRadius: '10px', 
                                    fontWeight: 'bold', fontSize: '13px',
                                    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                                    zIndex: 10
                                }}>
                                    مُمَيز ★
                                </div>
                            )}

                            <img 
                                src={getOptimizedImage(doc.image_url) || `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.name)}&background=0f172a&color=fff`} 
                                alt={`دكتور ${doc.name} - حجز أطباء - منصة دكتور`} 
                                loading="lazy" 
                                style={{ width: '105px', height: '105px', borderRadius: '20px', marginBottom: '15px', objectFit: 'cover', border: '3px solid #f1f5f9', boxShadow: '0 4px 10px rgba(0,0,0,0.06)' }} 
                            />
                            
                            <h3 style={{ fontSize: '20px', fontWeight: '800', margin: '4px 0', color: '#0f172a' }}>
                                دكتور / {doc.name}
                            </h3>
                            
                            <p style={{ fontSize: '15px', color: '#2563eb', fontWeight: '700', margin: '2px 0 10px 0' }}>
                                {doc.title ? `${doc.title} ` : ''}{doc.specialty}
                            </p>

                            {doc.bio ? (() => {
                                const BioSection = () => {
                                    const [isExpanded, setIsExpanded] = useState(false);
                                    const truncatedStyle = {
                                        fontSize: '13px', color: '#475569', fontStyle: 'normal', lineHeight: '1.6em', margin: '5px 0',
                                        display: '-webkit-box', WebkitLineClamp: isExpanded ? 'unset' : '2', 
                                        WebkitBoxDirection: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis',
                                        maxHeight: isExpanded ? 'none' : '3.2em', 
                                    };
                                    return (
                                        <div style={{ width: '100%', minHeight: '65px' }}>
                                            <p style={truncatedStyle}>"{doc.bio}"</p>
                                            {doc.bio.length > 50 && (
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setIsExpanded(!isExpanded);
                                                    }}
                                                    style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', padding: '0', display: 'block', margin: '0 auto' }}
                                                >
                                                    {isExpanded ? 'عرض أقل' : '... المزيد'}
                                                </button>
                                            )}
                                        </div>
                                    );
                                };
                                return <BioSection />;
                            })() : <div style={{ height: '65px' }}></div>}

                            <p style={{ color: '#64748b', fontWeight: '600', fontSize: '13px', margin: '10px 0' }}>
                                📍 {doc.city} - {doc.area} 
                                {doc.address && (
                                    <span style={{ color: '#94a3b8', fontSize: '12px', marginRight: '6px' }}>
                                        ({doc.address.split(' ').filter(Boolean).slice(0, 3).join(' ')}...)
                                    </span>
                                )}
                            </p>

                            <div style={{
                                backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', 
                                borderRadius: '12px', padding: '6px 16px', margin: '6px 0',
                                display: 'inline-block', color: '#0f172a', fontWeight: '800', fontSize: '14px'
                            }}>
                                قيمة الكشف: <span style={{ color: '#059669' }}>{doc.fee || '0'} ج.م</span>
                            </div>

                            <div style={{ color: '#f59e0b', fontSize: '15px', margin: '6px 0 14px 0' }}>
                                ⭐⭐⭐⭐⭐ <span style={{ color: '#64748b', fontSize: '12px', fontWeight: '600' }}>(5.0 تقييم)</span>
                            </div>

                            {/* زر الحجز المباشر الذي يفتح نافذة اختيار الوقت التفاعلية */}
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (!currentUser && typeof openLogin === 'function') { 
                                        openLogin(); 
                                    } else { 
                                        handleOpenBooking(doc);
                                    }
                                }} 
                                style={{ 
                                    background: '#0f172a', 
                                    color: '#fff', 
                                    border: 'none', 
                                    padding: '12px 18px', 
                                    borderRadius: '12px', 
                                    width: '100%', 
                                    fontWeight: '800', 
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.background = '#1e293b'}
                                onMouseOut={(e) => e.currentTarget.style.background = '#0f172a'}
                            >
                                {currentUser || !openLogin ? '⚡ حجز فوري مباشر' : 'سجل دخول للحجز'}
                            </button>
                        </div>
                    ))
                ) : (
                    <p style={{ fontSize: '18px', color: '#64748b', marginTop: '50px' }}>لا توجد نتائج مطابقة لبحثك.</p>
                )}
            </div>

            {/* 🌟 نافذة الحجز السريعة التفاعلية مع تقسيم المواعيد كل ربع ساعة واستبعاد المحجوز */}
            {showModal && selectedDoc && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100, padding: '16px' }}>
                    <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '20px', width: '420px', maxWidth: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 40px rgba(0,0,0,0.25)', border: '1px solid #f1f5f9' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px', marginBottom: '14px' }}>
                            <div>
                                <h3 style={{ margin: '0 0 4px 0', fontSize: '17px', fontWeight: '800', color: '#0f172a' }}>حجز موعد مع د. {selectedDoc.name}</h3>
                                <span style={{ fontSize: '12px', color: '#059669', fontWeight: '700' }}>قيمة الكشف: {selectedDoc.fee} ج.م (تدفع بالعيادة)</span>
                            </div>
                            <button 
                                onClick={() => setShowModal(false)}
                                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#94a3b8', padding: '4px' }}
                            >
                                ✕
                            </button>
                        </div>
                        
                        {/* 1. اختيار اليوم */}
                        <div style={{ marginBottom: '14px' }}>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                                📅 1. اختر يوم الكشف المتاح:
                            </label>
                            <select 
                                onChange={e => setSelectedDay(e.target.value)} 
                                value={selectedDay} 
                                style={{ ...inputStyle, background: '#f8fafc', fontWeight: '600', fontSize: '13px' }}
                            >
                                <option value="">-- اضغط لاختيار اليوم المناسب --</option>
                                {selectedDoc.availability ? selectedDoc.availability.split(' - ').map(slot => (
                                    <option key={slot} value={slot}>
                                        {slot.split(' ')[0]} ({getNextDateForDay(slot.split(' ')[0])}) | {slot}
                                    </option>
                                )) : <option value="الأحد (5:00 مساءً إلى 7:00 مساءً)">الأحد (5:00 مساءً إلى 7:00 مساءً)</option>}
                            </select>
                        </div>

                        {/* 2. تقسيم أوتوماتيكي للساعات كل 15 دقيقة */}
                        {selectedDay && (
                            <div style={{ marginBottom: '16px', background: '#f8fafc', padding: '14px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                    <label style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a' }}>
                                        ⏰ 2. اختر وقت الكشف (كل 15 دقيقة):
                                    </label>
                                    {availableTimeSlots.length > 0 && (
                                        <span style={{ fontSize: '11px', color: '#059669', background: '#ecfdf5', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold' }}>
                                            {availableTimeSlots.length} موعد متاح
                                        </span>
                                    )}
                                </div>

                                {availableTimeSlots.length > 0 ? (
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(3, 1fr)',
                                        gap: '8px',
                                        maxHeight: '160px',
                                        overflowY: 'auto',
                                        padding: '2px'
                                    }}>
                                        {availableTimeSlots.map((timeStr) => {
                                            const isSelected = selectedTime === timeStr;
                                            return (
                                                <button
                                                    key={timeStr}
                                                    type="button"
                                                    onClick={() => setSelectedTime(timeStr)}
                                                    style={{
                                                        padding: '10px 4px',
                                                        borderRadius: '10px',
                                                        border: isSelected ? '2px solid #059669' : '1px solid #cbd5e1',
                                                        background: isSelected ? '#059669' : '#ffffff',
                                                        color: isSelected ? '#ffffff' : '#1e293b',
                                                        fontWeight: isSelected ? '800' : '600',
                                                        fontSize: '12px',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.15s ease',
                                                        textAlign: 'center',
                                                        boxShadow: isSelected ? '0 2px 8px rgba(5, 150, 105, 0.3)' : 'none'
                                                    }}
                                                >
                                                    {isSelected ? '✓ ' : ''}{timeStr}
                                                </button>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '14px', background: '#fef2f2', borderRadius: '10px', border: '1px solid #fecaca' }}>
                                        <span style={{ fontSize: '12px', color: '#dc2626', fontWeight: 'bold' }}>
                                            ⚠️ عذراً، جميع مواعيد هذا اليوم محجوزة بالكامل! يرجى اختيار يوم آخر.
                                        </span>
                                    </div>
                                )}
                                
                                {bookedSlotsList.length > 0 && (
                                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '8px', textAlign: 'center' }}>
                                        🔒 المواعيد المحجوزة مسبقاً تم استبعادها تلقائياً.
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {/* 3. اسم المريض */}
                        <div style={{ marginBottom: '12px' }}>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                                👤 3. اسم المريض ثلاثي:
                            </label>
                            <input 
                                placeholder="أدخل اسم المريض بالكامل" 
                                value={patientData.name}
                                onChange={e => setPatientData({...patientData, name: e.target.value})} 
                                style={inputStyle} 
                            />
                        </div>
                        
                        {/* 4. رقم الموبايل */}
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                                📱 4. رقم الموبايل (لتأكيد الحجز):
                            </label>
                            <input 
                                placeholder="مثال: 01012345678" 
                                dir="ltr"
                                value={patientData.mobile}
                                onChange={e => setPatientData({...patientData, mobile: e.target.value})} 
                                style={inputStyle} 
                            />
                        </div>
                        
                        <button 
                            onClick={handleConfirm} 
                            style={{ 
                                width: '100%', 
                                padding: '14px', 
                                background: '#059669', 
                                color: '#fff', 
                                border: 'none', 
                                borderRadius: '12px', 
                                fontWeight: '800', 
                                fontSize: '15px', 
                                cursor: 'pointer',
                                boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)',
                                transition: 'all 0.2s'
                            }}
                        >
                            تأكيد الحجز النهائي ✓
                        </button>
                        
                        <button onClick={() => setShowModal(false)} style={{ width: '100%', marginTop: '10px', color: '#64748b', border:'none', background:'none', cursor:'pointer', fontSize:'13px' }}>
                            إلغاء والعودة
                        </button>
                    </div>
                </div>
            )}

            {/* 🌟 نافذة التذكرة بعد الحجز المحدثة مطابقة لتصميم صفحة الطبيب الشخصية */}
            {showTicket && selectedDoc && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000, padding: '16px' }}>
                    <div style={{ backgroundColor: '#fff', borderRadius: '24px', maxWidth: '440px', width: '100%', padding: '28px', boxShadow: '0 25px 50px rgba(0,0,0,0.3)', border: '2px solid #e2e8f0', textAlign: 'right' }}>
                        
                        {/* رأس التذكرة */}
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

                        {/* بيانات التذكرة */}
                        <div style={{ marginBottom: '14px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9', fontSize: '13px' }}>
                                <span style={{ color: '#64748b' }}>اسم المريض:</span>
                                <span style={{ fontWeight: 700, color: '#0f172a' }}>{patientData.name}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9', fontSize: '13px' }}>
                                <span style={{ color: '#64748b' }}>الدكتور المعالج:</span>
                                <span style={{ fontWeight: 700, color: '#0f172a' }}>د. {selectedDoc.name}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9', fontSize: '13px' }}>
                                <span style={{ color: '#64748b' }}>التخصص:</span>
                                <span style={{ fontWeight: 700, color: '#0f172a' }}>{selectedDoc.specialty || 'استشاري متخصص'}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9', fontSize: '13px' }}>
                                <span style={{ color: '#64748b' }}>الموعد المحدد:</span>
                                <span style={{ fontWeight: 700, color: '#2563eb' }}>{selectedSlot}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: 'none', fontSize: '13px' }}>
                                <span style={{ color: '#64748b' }}>عنوان العيادة بالتفصيل:</span>
                                <span style={{ maxWidth: '240px', textAlign: 'right', fontWeight: 800, color: '#0f172a' }}>
                                    📍 {selectedDoc?.address || 'العنوان مسجل بالعيادة'}
                                </span>
                            </div>
                        </div>

                        {/* بطاقة السعر */}
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
                                <strong style={{ fontSize: '18px', color: '#78350f' }}>{selectedDoc.fee} ج.م</strong>
                            </div>
                            <span style={{ fontSize: '11px', color: '#b45309' }}>تدفع عند الدخول للعيادة</span>
                        </div>

                        {/* تذكير بأخذ لقطة شاشة */}
                        <div style={{
                            background: '#f0fdf4',
                            border: '1px solid #bbf7d0',
                            borderRadius: '12px',
                            padding: '10px',
                            fontSize: '12px',
                            color: '#166534',
                            fontWeight: 700,
                            textAlign: 'center',
                            marginBottom: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px'
                        }}>
                            <span>📸</span>
                            <span>احفظ لقطة شاشة (Screenshot) للتذكرة لإظهارها بالعيادة</span>
                        </div>

                        {/* زر إرسال التذكرة لواتساب العيادة */}
                        {selectedDoc?.mobile && (
                            <button 
                                onClick={() => {
                                    const message = 
                                        `تأكيد حجز موعد كشف رسمي من منصة دكتور:\n` +
                                        `👤 المريض: ${patientData.name}\n` +
                                        `👨‍⚕️ الدكتور: د. ${selectedDoc.name}\n` +
                                        `📅 الموعد: ${selectedSlot}\n` +
                                        `📍 العنوان: ${selectedDoc.address || ''}\n` +
                                        `📱 هاتف المريض: ${patientData.mobile}\n` +
                                        `🏥 كود الحجز: DOC-${Math.floor(100000 + Math.random() * 900000)}`;
                                    const whatsappUrl = `https://wa.me/2${selectedDoc.mobile}?text=${encodeURIComponent(message)}`;
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
                                <span>💬</span>
                                <span>إرسال التذكرة لواتساب العيادة فوراً</span>
                            </button>
                        )}

                        {/* زر إنهاء */}
                        <button 
                            onClick={() => {
                                setShowTicket(false);
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
        </div>
    );
}

export default SearchPage;