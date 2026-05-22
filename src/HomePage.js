// HomePage.js
import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';

// الثوابت اللي كانت في الـ App.js، ممكن تجيبها من ملف منفصل (constants.js مثلاً)
// أو تنسخها هنا مؤقتًا
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
const medicalSpecialties = [
  "الكل", "أسنان", "أطفال وحديثي الولادة", "أنف وأذن وحنجرة", "باطنة", "تغذية علاجية",
  "جراحة أطفال", "جراحة أوعية دموية", "جراحة أورام", "جراحة تجميل", "جراحة سمنة ونحافة",
  "عظام", "جراحة قلب وصدر", "جراحة مخ وأعصاب", "جراحة مسالك بولية", "جلدية",
  "جهاز هضمي وكبد", "حساسية ومناعة", "رمد", "روماتيزم", "ذكورة وعقم", "علاج طبيعي", "غدد صماء وسكري",
  "جراحة عامه","امراض دم","قلب وأوعية دموية", "مخ وأعصاب", "نسا وتوليد", "تخاطب", "كلى", "جراحة عمود فقري", "صدر", "نفسي أطفال", "نفسي"
];

// البيانات الخاصة بالتخصصات مع الأيقونات والعدادات
const specialtiesData = [
    { name: 'أسنان', icon: '🦷', count: 1830 },
    { name: 'باطنة', icon: '🩺', count: 1150 },
    { name: 'عظام', icon: '🦴', count: 887 },
    { name: 'نسا وتوليد', icon: '🤰', count: 1026 },
    { name: 'جلدية', icon: '🧴', count: 578 },
    { name: 'مخ وأعصاب', icon: '🧠', count: 548 },
    { name: 'قلب وأوعية دموية', icon: '❤️', count: 517 },
    { name: 'أنف وأذن وحنجرة', icon: '👂', count: 486 },
    { name: 'جراحة مسالك بولية', icon: '🩻', count: 428 },
    { name: 'غدد صماء وسكري', icon: '🧪', count: 372 },
    { name: 'صدر', icon: '🫁', count: 341 },
    { name: 'رمد', icon: '👁️', count: 342 },
    { name: 'جراحة أورام', icon: '🎗️', count: 289 },
    { name: 'جراحة عمود فقري', icon: '🦴', count: 268 },
    { name: 'أطفال وحديثي الولادة', icon: '👶', count: 711 },
    { name: 'جراحة عامه', icon: '🫀', count: 910 },
    { name: 'علاج طبيعي', icon: '🏃', count: 546 },
    { name: 'نفسي', icon: '🧠', count: 1018 },
    { name: 'روماتيزم', icon: '🛡️', count: 315 },
    { name: 'امراض دم', icon: '🩸', count: 205 },
    { name: 'حساسية ومناعة', icon: '🌿', count: 276 },
    { name: 'علاج الألم', icon: '💉', count: 174 },
    { name: 'أشعة', icon: '🩻', count: 245 },
    { name: 'تحاليل', icon: '🧫', count: 190 },
    { name: 'جراحة قلب وصدر', icon: '❤️‍🩹', count: 120 },
    { name: 'جراحة تجميل', icon: '✨', count: 340 },
    { name: 'تخاطب', icon: '🗣️', count: 122 },
    { name: 'ذكورة وعقم', icon: '👨', count: 175 },
    { name: 'جراحة مخ وأعصاب', icon: '🧠', count: 211 },
    { name: 'جراحة أوعية دموية', icon: '🫀', count: 136 },
    { name: 'جهاز هضمي وكبد', icon: '🫀', count: 166 },
    { name: 'كلى', icon: '🩺', count: 241 },
    { name: 'جراحة أطفال', icon: '👦', count: 132 },
    { name: 'نفسي أطفال', icon: '🧒', count: 155 },
    { name: 'جراحة سمنة ونحافة', icon: '🚭', count: 76 },
    { name: 'تغذية علاجية', icon: '🍎', count: 267 }
];


function HomePage() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [fSpecialty, setFSpecialty] = useState('الكل');
    const [fCity, setFCity] = useState('الكل');
    const [fArea, setFArea] = useState('الكل');
    const orgSchema = {
        "@context": "https://schema.org",
        "@type": "MedicalOrganization",
        "name": "دكتور | DOCTOR",
        "url": "https://www.doctoreg.online/",
        "description": "أكبر منصة لحجز الأطباء في مصر، تضم نخبة من أفضل الاستشاريين والأخصائيين في جميع التخصصات الطبية.",
        "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "areaServed": "EG",
            "availableLanguage": "Arabic"
        }
    };

    const handleSearchRedirect = (specialty = 'الكل', city = 'الكل', area = 'الكل', name = '') => {
        const params = new URLSearchParams();
        if (name) params.append('name', name);
        if (specialty !== 'الكل') params.append('specialty', specialty);
        if (city !== 'الكل') params.append('city', city);
        if (area !== 'الكل') params.append('area', area);
        navigate(`/search?${params.toString()}`);
    };

   return (
        <div style={{ backgroundColor: '#f0f4f8', minHeight: '100vh', direction: 'rtl' }}>
            {/* 3. إضافة الـ Helmet لضبط العنوان والوصف والـ Schema */}
            <Helmet>
                <title>دكتور | منصة حجز الأطباء الأولى في مصر</title>
                <meta name="description" content="احجز موعدك مع أفضل الأطباء والاستشاريين في مصر. تغطية شاملة لجميع التخصصات الطبية، حجز سهل ومباشر عبر الإنترنت." />
                <script type="application/ld+json">
                    {JSON.stringify(orgSchema)}
                </script>
            </Helmet>
             <div style={{ textAlign: 'center', padding: '40px 0', background: '#fff' }}>
                <h1 style={{ fontSize: '85px', fontWeight: '900', margin: 0, color: '#1a73e8', textTransform: 'uppercase' }}>
                    دكتور <span style={{ color: '#2c3e50', fontWeight: '300' }}>| DOCTOR</span>
                </h1>
                <p style={{ color: '#7f8c8d', fontSize: '20px', marginTop: '10px' }}>احجز طبيبك الآن بكل سهولة</p>

                <div style={{
                    display: 'flex',
                    flexDirection: (typeof window !== 'undefined' && window.innerWidth < 768) ? 'column' : 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '20px',
                    padding: '20px',
                    direction: 'rtl'
                }}>
                    {/* القسم الأول (يمين): حاوية المستطيلات */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '15px',
                        flex: (typeof window !== 'undefined' && window.innerWidth < 768) ? 'none' : '1',
                        maxWidth: '400px',
                        margin: '10px auto'
                    }}>
                        {/* 1. مستطيل تحميل التطبيق (نسخة الأندرويد فقط) */}
                        <div style={{
                            background: 'linear-gradient(135deg, #e8f5e9 0%, #ffffff 100%)', 
                            padding: '20px', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                            border: '1px solid #c8e6c9', textAlign: 'center', display: 'flex',
                            flexDirection: 'column', gap: '12px'
                        }}>
                            <h3 style={{ color: '#0c1218', margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
                                📱 حمل تطبيق دكتور للأندرويد
                            </h3>
                            <p style={{ margin: 0, fontSize: '20px', color: '#131111' }}>احجز موعدك بضغطة واحدة من موبايلك</p>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <button 
                                    onClick={() => window.open('https://play.google.com/store/apps/details?id=com.doctorplatform.app&pcampaignid=web_share', '_blank')}
                                    style={{
                                        background: '#0a960a', color: '#fff', border: 'none', padding: '16px 30px', 
                                        borderRadius: '10px', cursor: 'pointer', fontSize: '20px', fontWeight: 'bold',
                                        display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                        transition: 'transform 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                >
                                    <span>تحميل من Google Play</span>
                                </button>
                            </div>
                        </div>

                        {/* 2. المستطيل التعريفي (الحالي) */}
                        <div style={{
                            border: '2px solid #3eeb09', borderRadius: '15px', backgroundColor: '#e3f2fd',
                            padding: '12px 20px', display: 'flex', alignItems: 'center',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
                        }}>
                            <p style={{ 
                                fontSize: '22px', color: '#0d47a1', fontWeight: '800', 
                                lineHeight: '1.8', margin: 0, textAlign: 'center'
                            }}>
                                احجز دكتورك الآن مع أكبر منصة لحجز الأطباء في مصر.. نخبة من أفضل وأمهر الاستشاريين والأخصائيين.. اختار الميعاد اللي يناسبك واحجز الآن.
                            </p>
                        </div>
                    </div>

                    {/* القسم الثاني (منتصف): الصورة وزر الحجز */}
                    <div style={{ 
                        textAlign: 'center', display: 'flex', flexDirection: 'column', 
                        alignItems: 'center', padding: '20px', flex: '1'
                    }}>
                        <img 
                            src="/10.png" 
                            alt="دكتور أيمن عجيب" 
                            onClick={() => {
                                navigate('/dr_ayman_aguib'); 
                                window.scrollTo(0, 0); 
                            }}
                            style={{ 
                                width: (typeof window !== 'undefined' && window.innerWidth < 768) ? '90%' : '400px',
                                maxWidth: '400px', height: 'auto', borderRadius: '10px',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.1)', marginBottom: '10px', cursor: 'pointer' 
                            }} 
                        />
                        <button 
                            onClick={() => navigate('/dr_ayman_aguib')}
                            style={{
                                width: '100%', maxWidth: '400px', margin: '10px auto',
                                padding: '12px 20px', backgroundColor: '#1a73e8', color: '#fff',
                                border: 'none', borderRadius: '12px', fontSize: '22px',
                                fontWeight: '700', cursor: 'pointer', display: 'block'
                            }}
                        >
                            احجز مباشرة الان مع الدكتور ايمن عجيب
                        </button>
                    </div>

                    {/* القسم الثالث (يسار): العدادات */}
                    <div style={{ 
                        display: 'flex', 
                        flexDirection: (typeof window !== 'undefined' && window.innerWidth < 768) ? 'row' : 'column',
                        flexWrap: 'wrap', gap: '30px', justifyContent: 'center', alignItems: 'center', flex: '1'
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ width: '90px', height: '90px', borderRadius: '50%', border: '4px solid #1a73e8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 'bold', color: '#1a73e8', margin: '0 auto 10px', backgroundColor: '#fff' }}>+1000</div>
                            <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#2c3e50' }}>👨‍⚕️ طبيب متخصص</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ width: '90px', height: '90px', borderRadius: '50%', border: '4px solid #2e7d32', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 'bold', color: '#2e7d32', margin: '0 auto 10px', backgroundColor: '#fff' }}>+10,000</div>
                            <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#2c3e50' }}>✅ حجز ناجح</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ width: '90px', height: '90px', borderRadius: '50%', border: '4px solid #f57c00', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 'bold', color: '#f57c00', margin: '0 auto 10px', backgroundColor: '#fff' }}>24/7</div>
                            <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#2c3e50' }}>📞 دعم فني</p>
                        </div>
                    </div>
                </div>

                <div style={{ padding: '0 20px', maxWidth: '1200px', margin: '0 auto' }}>
                    {/* شريط البحث المطور - تصميم (البار العريض) */}
                    <div style={{ 
                        background: '#fff', borderRadius: '15px', marginBottom: '40px', 
                        boxShadow: '0 15px 40px rgba(0,0,0,0.12)', display: 'flex', 
                        flexWrap: 'wrap', alignItems: 'stretch', border: '1px solid #ddd',
                        overflow: 'hidden', direction: 'rtl'
                    }}>
                        <div style={{ flex: '1 1 250px', minWidth: '200px', padding: '10px 15px', display: 'flex', flexDirection: 'column', borderLeft: '1px solid #eee' }}>
                            <label style={{ fontSize: '18px', color: '#0a0101', marginRight: '10px' }}>أنا أبحث عن دكتور</label>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{ fontSize: '24px', marginLeft: '5px' }}>🩺</span>
                                <select onChange={e => setFSpecialty(e.target.value)} value={fSpecialty} style={{ border: 'none', width: '100%', fontSize: '16px', fontWeight: 'bold', outline: 'none', cursor: 'pointer', background: 'transparent' }}>
                                    <option value="الكل">اختيار التخصص</option>
                                    {medicalSpecialties.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>

                        <div style={{ flex: '1 1 250px', minWidth: '200px', padding: '10px 15px', display: 'flex', flexDirection: 'column', borderLeft: '1px solid #eee' }}>
                            <label style={{ fontSize: '20px', color: '#030101', marginRight: '10px' }}>في محافظة</label>
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
                            flex: '1 1 250px', minWidth: '200px', padding: '10px 15px', 
                            display: 'flex', flexDirection: 'column', borderLeft: '1px solid #eee',
                            opacity: fCity === 'الكل' ? 0.6 : 1, transition: '0.3s'
                        }}>
                            <label style={{ fontSize: '20px', color: '#0a0202', marginRight: '10px' }}>في منطقة</label>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{ fontSize: '24px', marginLeft: '5px' }}>🏘️</span>
                                <select 
                                    disabled={fCity === 'الكل'} 
                                    value={fArea} 
                                    onChange={(e) => setFArea(e.target.value)} 
                                    style={{ 
                                        border: 'none', width: '100%', fontSize: '20px', 
                                        fontWeight: 'bold', outline: 'none', 
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
                            <label style={{ fontSize: '20px', color: '#070101', marginRight: '10px' }}>أو اكتب اسم الدكتور</label>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{ fontSize: '24px', marginLeft: '5px' }}>🔍</span>
                                <input 
                                    placeholder="الدكتور " 
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    style={{ 
                                        border: 'none', width: '100%', outline: 'none', 
                                        fontSize: '20px', fontWeight: 'bold' 
                                    }} 
                                />
                            </div>
                        </div>

                        <button 
                            onClick={() => handleSearchRedirect(fSpecialty, fCity, fArea, searchTerm)}
                            style={{ 
                                background: '#7cf046', color: '#000000', border: 'none', 
                                padding: '0 40px', fontSize: '28px', fontWeight: 'bold', 
                                cursor: 'pointer', display: 'flex', alignItems: 'center',
                                justifyContent: 'center', minWidth: '150px', minHeight: '60px', flex: '1 1 100%'
                            }}
                        >
                            ابحث 🔍
                        </button>
                    </div>
                </div>

                {/* بداية جدول التخصصات الجديد */}
                <div style={{ direction: 'rtl', padding: '20px' }}>
                    <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '20px' }}>اختار التخصص اللي محتاجه:</h2>
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
                        gap: '15px' 
                    }}>
                        {specialtiesData.map((spec) => (
                            <div key={spec.name} 
                                onClick={() => handleSearchRedirect(spec.name)}
                                style={{
                                    border: '2px solid #3debd3', borderRadius: '20px', padding: '15px',
                                    textAlign: 'center', cursor: 'pointer', transition: '0.3s',
                                    background: '#fff'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#f0fff4'}
                                onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
                            >
                                <div style={{ fontSize: '30px', marginBottom: '10px' }}>{spec.icon}</div>
                                <div style={{ fontWeight: 'bold', color: '#000' }}>{spec.name}</div>
                                <div style={{ fontSize: '12px', color: '#666' }}>{spec.count} دكتور</div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* نهاية جدول التخصصات */}
            </div>
        </div>
    );
}

export default HomePage;