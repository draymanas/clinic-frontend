// HomePage.js
import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

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

const homePageStyles = `
    * {
        box-sizing: border-box;
    }

    .doctor-home {
        background: #f0f4f8;
        min-height: 100vh;
        direction: rtl;
        overflow-x: hidden;
    }

    .doctor-header {
        text-align: center;
        padding: 30px 20px 20px;
        background: #fff;
    }

    .doctor-logo-title {
        font-size: clamp(42px, 6vw, 72px);
        font-weight: 900;
        margin: 0;
        color: #1a73e8;
        line-height: 1.15;
    }

    .doctor-logo-title span {
        color: #2c3e50;
        font-weight: 300;
    }

    .doctor-subtitle {
        color: #64748b;
        font-size: clamp(17px, 2vw, 21px);
        margin: 10px 0 0;
        font-weight: 600;
    }

    /* =========================
       HERO
    ========================= */

    .doctor-hero {
        position: relative;
        width: calc(100% - 40px);
        max-width: 1450px;
        margin: 20px auto 30px;
        overflow: hidden;
        border-radius: 26px;
        background: #eaf5fc;
        box-shadow: 0 12px 35px rgba(0, 70, 120, 0.12);
    }

    .doctor-hero picture {
    display: block;
    width: 100%;
}

.doctor-hero picture {
    display: block;
    width: 100%;
}

.doctor-hero-image {
    display: block;
    width: 100%;
    height: auto;
    aspect-ratio: 2046 / 768;
    object-fit: cover;
}

    .doctor-hero-content {
        position: absolute;
        top: 50%;
        left: 5%;
        transform: translateY(-50%);
        width: min(44%, 570px);
        direction: rtl;
        text-align: right;
    }

    .doctor-hero-badge {
        display: inline-block;
        background: rgba(255,255,255,0.92);
        color: #0369a1;
        border-radius: 50px;
        padding: 8px 16px;
        font-size: 15px;
        font-weight: 800;
        margin-bottom: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.06);
    }

    .doctor-hero-title {
        margin: 0 0 12px;
        color: #0f172a;
        font-size: clamp(28px, 3.2vw, 48px);
        line-height: 1.25;
        font-weight: 900;
    }

    .doctor-hero-description {
        margin: 0 0 20px;
        color: #334155;
        font-size: clamp(16px, 1.7vw, 21px);
        line-height: 1.8;
        font-weight: 600;
    }

    .doctor-hero-button {
        border: none;
        background: #1a73e8;
        color: #fff;
        padding: 14px 28px;
        border-radius: 13px;
        font-size: 18px;
        font-weight: 800;
        cursor: pointer;
        box-shadow: 0 7px 18px rgba(26,115,232,0.25);
        transition: 0.2s ease;
    }

    .doctor-hero-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 22px rgba(26,115,232,0.30);
    }

    /* =========================
       BENEFITS
    ========================= */

    .doctor-benefits {
        max-width: 1200px;
        margin: 0 auto 35px;
        padding: 0 20px;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 18px;
    }

    .doctor-benefit-card {
        background: #fff;
        border-radius: 18px;
        padding: 20px;
        text-align: center;
        box-shadow: 0 6px 20px rgba(0,0,0,0.06);
        border: 1px solid #e2e8f0;
    }

    .doctor-benefit-icon {
        font-size: 32px;
        margin-bottom: 8px;
    }

    .doctor-benefit-title {
        margin: 0 0 6px;
        color: #0f172a;
        font-size: 19px;
        font-weight: 800;
    }

    .doctor-benefit-text {
        margin: 0;
        color: #64748b;
        font-size: 14px;
        line-height: 1.7;
    }

    /* =========================
       SEARCH
    ========================= */

    .doctor-search-wrapper {
        padding: 0 20px;
        max-width: 1250px;
        margin: 0 auto;
    }

    .doctor-search-box {
        background: #fff;
        border-radius: 18px;
        margin-bottom: 40px;
        box-shadow: 0 15px 40px rgba(0,0,0,0.10);
        display: flex;
        flex-wrap: wrap;
        align-items: stretch;
        border: 1px solid #e2e8f0;
        overflow: hidden;
        direction: rtl;
    }

    .doctor-search-field {
        flex: 1 1 240px;
        min-width: 200px;
        padding: 13px 15px;
        display: flex;
        flex-direction: column;
        border-left: 1px solid #eee;
    }

    .doctor-search-label {
        font-size: 16px;
        color: #111827;
        margin-right: 10px;
        margin-bottom: 4px;
        font-weight: 600;
    }

    .doctor-search-row {
        display: flex;
        align-items: center;
    }

    .doctor-search-icon {
        font-size: 24px;
        margin-left: 7px;
    }

    .doctor-search-select,
    .doctor-search-input {
        border: none;
        width: 100%;
        outline: none;
        background: transparent;
        font-size: 16px;
        font-weight: 700;
        color: #111827;
    }

    .doctor-search-input {
        padding: 4px 0;
    }

    .doctor-search-button {
        background: #7cf046;
        color: #000;
        border: none;
        padding: 0 35px;
        font-size: 24px;
        font-weight: 900;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 150px;
        min-height: 65px;
        transition: 0.2s ease;
    }

    .doctor-search-button:hover {
        background: #68dc35;
    }

    /* =========================
       SYMPTOMS
    ========================= */

    .doctor-symptoms {
        max-width: 1100px;
        margin: 30px auto;
        padding: 0 15px;
    }

    .doctor-symptoms-box {
        background: linear-gradient(135deg, #ecfeff, #e0f2fe);
        border: 1px solid #bae6fd;
        border-radius: 22px;
        padding: 28px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
        flex-wrap: wrap;
        direction: rtl;
        box-shadow: 0 6px 20px rgba(14,116,144,0.08);
    }

    .doctor-symptoms-text {
        flex: 1;
        min-width: 260px;
    }

    .doctor-symptoms-label {
        font-size: 15px;
        color: #0369a1;
        font-weight: 800;
        margin-bottom: 7px;
    }

    .doctor-symptoms-title {
        margin: 0 0 8px;
        color: #0f172a;
        font-size: 24px;
        font-weight: 800;
    }

    .doctor-symptoms-description {
        margin: 0;
        color: #475569;
        line-height: 1.8;
        font-size: 15px;
    }

    .doctor-symptoms-button {
        border: none;
        background: #0284c7;
        color: #fff;
        padding: 14px 25px;
        border-radius: 13px;
        font-size: 16px;
        font-weight: 800;
        cursor: pointer;
        box-shadow: 0 5px 15px rgba(2,132,199,0.25);
        white-space: nowrap;
    }

    /* =========================
       SPECIALTIES
    ========================= */

    .doctor-specialties {
        direction: rtl;
        padding: 20px;
    }

    .doctor-specialties-title {
        font-size: 28px;
        font-weight: bold;
        margin-bottom: 20px;
    }

    .doctor-specialties-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 15px;
    }

    .doctor-specialty-card {
        border: 2px solid #3debd3;
        border-radius: 20px;
        padding: 15px;
        text-align: center;
        cursor: pointer;
        transition: 0.25s ease;
        background: #fff;
    }

    .doctor-specialty-card:hover {
        background: #f0fff4;
        transform: translateY(-3px);
        box-shadow: 0 7px 18px rgba(0,0,0,0.07);
    }

    .doctor-specialty-icon {
        font-size: 30px;
        margin-bottom: 10px;
    }

    .doctor-specialty-name {
        font-weight: bold;
        color: #000;
    }

    .doctor-specialty-count {
        font-size: 12px;
        color: #666;
        margin-top: 4px;
    }

    /* =========================
       TABLET
    ========================= */

    @media (max-width: 900px) {
        .doctor-hero-content {
            width: 47%;
            left: 4%;
        }

        .doctor-hero-title {
            font-size: 30px;
        }

        .doctor-hero-description {
            font-size: 16px;
        }

        .doctor-benefits {
            grid-template-columns: repeat(3, 1fr);
        }
    }

    /* =========================
       MOBILE
    ========================= */

    @media (max-width: 767px) {
        .doctor-header {
            padding: 22px 15px 15px;
        }

        .doctor-logo-title {
            font-size: 43px;
        }

        .doctor-subtitle {
            font-size: 16px;
        }

        .doctor-hero {
            width: calc(100% - 24px);
            margin: 12px auto 22px;
            border-radius: 18px;
            display: flex;
            flex-direction: column;
        }

       @media (max-width: 767px) {

    .doctor-hero-image {
    width: 100%;
    height: auto;
    aspect-ratio: 768 / 550;
    object-fit: cover;
}

}

        .doctor-hero-content {
            position: static;
            transform: none;
            width: 100%;
            padding: 22px 20px 24px;
            background: #fff;
            text-align: center;
        }

        .doctor-hero-badge {
            font-size: 13px;
        }

        .doctor-hero-title {
            font-size: 27px;
            margin-bottom: 10px;
        }

        .doctor-hero-description {
            font-size: 16px;
            line-height: 1.75;
            margin-bottom: 16px;
        }

        .doctor-hero-button {
            width: 100%;
            font-size: 17px;
        }

        .doctor-benefits {
            grid-template-columns: 1fr;
            gap: 12px;
            padding: 0 15px;
            margin-bottom: 25px;
        }

        .doctor-benefit-card {
            padding: 15px;
        }

        .doctor-search-wrapper {
            padding: 0 12px;
        }

        .doctor-search-box {
            border-radius: 15px;
        }

        .doctor-search-field {
            flex: 1 1 100%;
            min-width: 100%;
            border-left: none;
            border-bottom: 1px solid #eee;
        }

        .doctor-search-button {
            width: 100%;
            min-height: 58px;
            font-size: 22px;
        }

        .doctor-symptoms {
            padding: 0 12px;
        }

        .doctor-symptoms-box {
            padding: 22px 18px;
            text-align: center;
            justify-content: center;
        }

        .doctor-symptoms-text {
            min-width: 100%;
        }

        .doctor-symptoms-button {
            width: 100%;
        }

        .doctor-specialties {
            padding: 15px 12px;
        }

        .doctor-specialties-title {
            font-size: 23px;
            text-align: center;
        }

        .doctor-specialties-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 10px;
        }

        .doctor-specialty-card {
            padding: 12px 8px;
        }

        .doctor-specialty-icon {
            font-size: 27px;
        }
    }

    @media (max-width: 380px) {
        .doctor-logo-title {
            font-size: 37px;
        }

        .doctor-specialties-grid {
            grid-template-columns: 1fr 1fr;
        }
    }
`;

function HomePage() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [fSpecialty, setFSpecialty] = useState('الكل');
    const [fCity, setFCity] = useState('الكل');
    const [fArea, setFArea] = useState('الكل');
   const siteSchema = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "Organization",
            "@id": "https://www.doctoreg.online/#organization",
            "name": "منصة دكتور",
            "alternateName": "DOCTOR",
            "url": "https://www.doctoreg.online/",
            "description": "منصة إلكترونية لحجز مواعيد الأطباء في مصر والبحث عن الأطباء حسب التخصص والمحافظة والمنطقة.",
            "areaServed": {
                "@type": "Country",
                "name": "Egypt"
            }
        },
        {
            "@type": "WebSite",
            "@id": "https://www.doctoreg.online/#website",
            "url": "https://www.doctoreg.online/",
            "name": "منصة دكتور | DOCTOR",
            "publisher": {
                "@id": "https://www.doctoreg.online/#organization"
            },
            "inLanguage": "ar-EG",
            "potentialAction": {
                "@type": "SearchAction",
                "target": "https://www.doctoreg.online/search?name={search_term_string}",
                "query-input": "required name=search_term_string"
            }
        }
    ]
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
    <>
        <style>{homePageStyles}</style>

        <div className="doctor-home">

            {/* ==============================
                SEO
            ============================== */}
            <Helmet>
                <title>دكتور | منصة حجز الأطباء في مصر</title>

                <meta
                    name="description"
                    content="احجز موعدك مع الأطباء والاستشاريين في مصر بسهولة. ابحث عن الطبيب حسب التخصص والمحافظة والمنطقة واحجز موعدك أونلاين."
                />

                <meta
                    name="robots"
                    content="index, follow"
                />

                <script type="application/ld+json">
                    {JSON.stringify(siteSchema)}
                </script>
            </Helmet>


            {/* ==============================
                HEADER
            ============================== */}
            <header className="doctor-header">

                <h1 className="doctor-logo-title">
                    دكتور <span>| DOCTOR</span>
                </h1>

                <p className="doctor-subtitle">
                    احجز طبيبك الآن بكل سهولة
                </p>

            </header>


            {/* ==============================
                HERO BANNER
            ============================== */}
            <section className="doctor-hero">

               <picture>
    <source
        media="(max-width: 767px)"
        srcSet="/doctor-hero-mobile.webp"
    />

    <picture>
    <source
        media="(max-width: 767px)"
        srcSet="/doctor-hero-mobile.webp"
    />

    <img
        src="/doctor-hero.webp"
        alt="منصة دكتور لحجز الأطباء في مصر"
        className="doctor-hero-image"
        fetchPriority="high"
        loading="eager"
        decoding="async"
    />
</picture>
</picture>

                <div className="doctor-hero-content">

                    <div className="doctor-hero-badge">
                        🩺 منصة دكتور لحجز الأطباء
                    </div>

                    <h2 className="doctor-hero-title">
                        ابحث عن طبيبك واحجز موعدك بسهولة
                    </h2>

                    <p className="doctor-hero-description">
                        ابحث عن الطبيب المناسب لك حسب التخصص والمحافظة والمنطقة،
                        واختار الموعد الذي يناسبك.
                    </p>

                    <button
                        className="doctor-hero-button"
                        onClick={() => {
                            document
                                .getElementById('doctor-search-section')
                                ?.scrollIntoView({
                                    behavior: 'smooth',
                                    block: 'center'
                                });
                        }}
                    >
                        🔍 ابحث عن طبيب الآن
                    </button>

                </div>

            </section>


            {/* ==============================
                BENEFITS
            ============================== */}
            <section className="doctor-benefits">

                <div className="doctor-benefit-card">
                    <div className="doctor-benefit-icon">
                        👨‍⚕️
                    </div>

                    <h3 className="doctor-benefit-title">
                        تخصصات طبية متعددة
                    </h3>

                    <p className="doctor-benefit-text">
                        ابحث عن الطبيب المناسب حسب التخصص الذي تحتاجه.
                    </p>
                </div>


          <div className="doctor-benefit-card">
    <Link to="/dr/دكتور-ايمن-عجيب-استشاري-مخ-وأعصاب-وعمود-فقري" className="benefit-card-link">
        <div className="doctor-benefit-icon">
            👨‍⚕️
        </div>
        <h3 className="doctor-benefit-title">
            احجز مباشرة الآن مع الدكتور أيمن عجيب
             استشاري المخ والأعصاب والعمود الفقري
        </h3>
        
    </Link>
</div>


                <div className="doctor-benefit-card">
                    <div className="doctor-benefit-icon">
                        📱
                    </div>

                    <h3 className="doctor-benefit-title">
                        من الموقع أو التطبيق
                    </h3>

                    <p className="doctor-benefit-text">
                        يمكنك الوصول إلى خدمات منصة دكتور بسهولة من هاتفك.
                    </p>
                </div>

            </section>


            {/* ==============================
                SEARCH SECTION
            ============================== */}
            <section
                id="doctor-search-section"
                className="doctor-search-wrapper"
            >

                <div className="doctor-search-box">

                    {/* 1. التخصص */}
                    <div className="doctor-search-field">

                        <label
                            htmlFor="home-specialty-select"
                            className="doctor-search-label"
                        >
                            أنا أبحث عن دكتور
                        </label>

                        <div className="doctor-search-row">

                            <span className="doctor-search-icon">
                                🩺
                            </span>

                            <select
                                id="home-specialty-select"
                                aria-label="أنا أبحث عن دكتور - التخصص"
                                value={fSpecialty}
                                onChange={(e) =>
                                    setFSpecialty(e.target.value)
                                }
                                className="doctor-search-select"
                            >
                                <option value="الكل">
                                    اختيار التخصص
                                </option>

                                {medicalSpecialties
                                    .filter((s) => s !== "الكل")
                                    .map((s) => (
                                        <option
                                            key={s}
                                            value={s}
                                        >
                                            {s}
                                        </option>
                                    ))}
                            </select>

                        </div>

                    </div>


                    {/* 2. المحافظة */}
                    <div className="doctor-search-field">

                        <label
                            htmlFor="home-city-select"
                            className="doctor-search-label"
                        >
                            في محافظة
                        </label>

                        <div className="doctor-search-row">

                            <span className="doctor-search-icon">
                                📍
                            </span>

                            <select
                                id="home-city-select"
                                aria-label="في محافظة"
                                value={fCity}
                                onChange={(e) => {
                                    setFCity(e.target.value);
                                    setFArea("الكل");
                                }}
                                className="doctor-search-select"
                            >
                                <option value="الكل">
                                    كل المحافظات
                                </option>

                                {Object.keys(egyptLocations).map((g) => (
                                    <option
                                        key={g}
                                        value={g}
                                    >
                                        {g}
                                    </option>
                                ))}
                            </select>

                        </div>

                    </div>


                    {/* 3. المنطقة */}
                    <div
                        className="doctor-search-field"
                        style={{
                            opacity: fCity === "الكل" ? 0.6 : 1,
                            transition: "0.3s"
                        }}
                    >

                        <label
                            htmlFor="home-area-select"
                            className="doctor-search-label"
                        >
                            في منطقة
                        </label>

                        <div className="doctor-search-row">

                            <span className="doctor-search-icon">
                                🏘️
                            </span>

                            <select
                                id="home-area-select"
                                aria-label="في منطقة"
                                disabled={fCity === "الكل"}
                                value={fArea}
                                onChange={(e) =>
                                    setFArea(e.target.value)
                                }
                                className="doctor-search-select"
                                style={{
                                    cursor:
                                        fCity === "الكل"
                                            ? "not-allowed"
                                            : "pointer"
                                }}
                            >

                                <option value="الكل">
                                    اختيار المنطقة
                                </option>

                                {fCity !== "الكل" &&
                                    egyptLocations[fCity]?.map(
                                        (area) => (
                                            <option
                                                key={area}
                                                value={area}
                                            >
                                                {area}
                                            </option>
                                        )
                                    )}

                            </select>

                        </div>

                    </div>


                    {/* 4. اسم الدكتور */}
                    <div className="doctor-search-field">

                        <label
                            htmlFor="home-doctor-input"
                            className="doctor-search-label"
                        >
                            أو اكتب اسم الدكتور
                        </label>

                        <div className="doctor-search-row">

                            <span className="doctor-search-icon">
                                🔍
                            </span>

                            <input
                                id="home-doctor-input"
                                aria-label="أو اكتب اسم الدكتور"
                                placeholder="اكتب اسم الدكتور"
                                value={searchTerm}
                                onChange={(e) =>
                                    setSearchTerm(e.target.value)
                                }
                                className="doctor-search-input"
                            />

                        </div>

                    </div>


                    {/* زر البحث */}
                    <button
                        onClick={() =>
                            handleSearchRedirect(
                                fSpecialty,
                                fCity,
                                fArea,
                                searchTerm
                            )
                        }
                        className="doctor-search-button"
                    >
                        ابحث 🔍
                    </button>

                </div>

            </section>


            {/* ==============================
                SYMPTOM ASSISTANT
            ============================== */}
            <section className="doctor-symptoms">

                <div className="doctor-symptoms-box">

                    <div className="doctor-symptoms-text">

                        <div className="doctor-symptoms-label">
                            🔍 مش عارف تروح لأي دكتور؟
                        </div>

                        <h2 className="doctor-symptoms-title">
                            احكي لنا عن أعراضك
                        </h2>

                        <p className="doctor-symptoms-description">
                            اكتب الأعراض التي تشعر بها،
                            وساعدك في الوصول إلى التخصص المناسب
                            والطبيب المناسب.
                        </p>

                    </div>


                    <button
                        onClick={() => navigate('/symptoms')}
                        className="doctor-symptoms-button"
                    >
                        🩺 ابدأ الآن
                    </button>

                </div>

            </section>


            {/* ==============================
                SPECIALTIES
            ============================== */}
            <section className="doctor-specialties">

                <h2 className="doctor-specialties-title">
                    اختار التخصص اللي محتاجه:
                </h2>

                <div className="doctor-specialties-grid">

                    {specialtiesData.map((spec) => (

                        <div
                            key={spec.name}
                            onClick={() =>
                                handleSearchRedirect(spec.name)
                            }
                            className="doctor-specialty-card"
                        >

                            <div className="doctor-specialty-icon">
                                {spec.icon}
                            </div>

                            <div className="doctor-specialty-name">
                                {spec.name}
                            </div>

                            <div className="doctor-specialty-count">
                                {spec.count} دكتور
                            </div>

                        </div>

                    ))}

                </div>

            </section>

        </div>
    </>
);
}

export default HomePage;