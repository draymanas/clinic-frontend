import { useNavigate, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { FaMapMarkerAlt, FaStethoscope, FaArrowRight, FaShareAlt, FaCheck } from 'react-icons/fa';
import { servicesData } from './servicesData';
import { Link } from 'react-router-dom';

const AymanProfile = ({ setActivePage, navigate: propNavigate }) => { 
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showConsultModal, setShowConsultModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', question: '' });
  const [copied, setCopied] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // 🌟 1. رابط الـ SEO العربي الكامل لصفحتك (المعتمد في شريط المتصفح ولجوجل)
  const officialProfileUrl = "https://www.doctoreg.online/dr/" + encodeURIComponent("دكتور-ايمن-عجيب-استشاري-مخ-وأعصاب-وعمود-فقري");
  const officialPath = "/dr/" + encodeURIComponent("دكتور-ايمن-عجيب-استشاري-مخ-وأعصاب-وعمود-فقري");

  // 🌟 2. رابط المشاركة فائق الاختصار والجاذبية للسوشيال ميديا وفيسبوك
  const shortShareUrl = "https://www.doctoreg.online/d/ayman";

  // رابط صورتك الرسمية للمعاينة في السوشيال ميديا
  const doctorPhoto =
  "https://www.doctoreg.online/ayman-profile.webp";
  // تحويل المتصفح تلقائياً إلى رابط الـ SEO الكامل إذا دخل المستخدم عبر /ayman أو /d/ayman
  useEffect(() => {
    if (location.pathname === '/ayman' || location.pathname === '/d/ayman') {
      navigate(officialPath, { replace: true });
    }
  }, [location.pathname, navigate, officialPath]);

  // نسخ رابط المشاركة الشيك
  const handleCopyShortLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shortShareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // روابط حجز الفروع
  const octPath = `/dr/40-${encodeURIComponent("دكتور-ايمن-عجيب-استشاري-مخ-وأعصاب-وعمود-فقري-فرع-أكتوبر")}`;
  const shubraPath = `/dr/138-${encodeURIComponent("دكتور-ايمن-عجيب-استشاري-مخ-وأعصاب-وعمود-فقري-فرع-شبرا")}`;

const schemaData = {
    "@context": "https://schema.org",
    "@type": "Physician",
    "@id": `${officialProfileUrl}#physician`,

    "name": "دكتور أيمن عجيب",
    "url": officialProfileUrl,

    "description":
        "دكتور أيمن عجيب، استشاري المخ والأعصاب والعمود الفقري. يقدم خدمات تشخيص وعلاج أمراض المخ والجهاز العصبي والعمود الفقري من خلال عيادة 6 أكتوبر وشبرا مصر.",

    "medicalSpecialty": [
        "Neurology",
        "Neurosurgery"
    ],

    "department": [
        {
            "@type": "MedicalClinic",
            "@id": `${officialProfileUrl}#october-clinic`,

            "name": "عيادة دكتور أيمن عجيب - فرع 6 أكتوبر",

            "url": `https://www.doctoreg.online${octPath}`,

            "address": {
                "@type": "PostalAddress",
                "streetAddress": "ميدان الحصري، فوق سنتر شعبان، الدور الرابع",
                "addressLocality": "6 أكتوبر",
                "addressRegion": "الجيزة",
                "addressCountry": "EG"
            },

            "hasMap":
                "https://maps.app.goo.gl/wse4VG3tAziZTQVs7"
        },

        {
            "@type": "MedicalClinic",
            "@id": `${officialProfileUrl}#shubra-clinic`,

            "name": "عيادة دكتور أيمن عجيب - فرع شبرا",

            "url": `https://www.doctoreg.online${shubraPath}`,

            "address": {
                "@type": "PostalAddress",
                "streetAddress": "16 شارع دولتيان، فوق كنتاكي، الدور الثالث، الخلفاوي",
                "addressLocality": "شبرا مصر",
                "addressRegion": "القاهرة",
                "addressCountry": "EG"
            },

            "hasMap":
                "https://maps.app.goo.gl/M5ZMNchAfXD3omYT9"
        }
    ]
};

  const sendToTelegram = async (e) => {
    e.preventDefault();
    const message = `طلب حجز أونلاين جديد:%0Aالاسم: ${formData.name}%0Aرقم الواتساب: ${formData.phone}`;
    const token = '8639669118:AAGOpN9rtWDl_J3kmhoBK3PddqI14jPqEgw';
    const chatId = '6635887452'; 
    const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${message}`;
    
    try {
      const response = await fetch(url);
      if (response.ok) {
        alert('تم إرسال طلبك بنجاح، سنتواصل معك قريباً!');
        setShowBookingModal(false);
      } else {
        alert('حدث خطأ أثناء الإرسال، حاول مرة أخرى.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('تعذر الاتصال بخادم التليجرام.');
    }
  };

  return (
    <div style={{ direction: 'rtl', backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '50px', fontFamily: 'Cairo, sans-serif' }}>
      <Helmet>
        <title>دكتور أيمن عجيب | استشاري المخ والأعصاب والعمود الفقري</title>
        <meta name="description" content="عيادات د. أيمن عجيب استشاري جراحة المخ والأعصاب والعمود الفقري (فرع أكتوبر وفرع شبرا). احجز موعدك أو أرسل استشارتك الطبية مباشرة." />
        <link rel="canonical" href={officialProfileUrl} />

        {/* كروت السوشيال ميديا المباشرة */}
        <meta property="og:title" content="دكتور أيمن عجيب | استشاري المخ والأعصاب والعمود الفقري" />
        <meta property="og:description" content="عيادات د. أيمن عجيب لجراحة المخ والأعصاب والعمود الفقري (أكتوبر - شبرا). احجز موعدك أو أرسل استشارتك الطبية أونلاين." />
        <meta property="og:image" content={doctorPhoto} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content={officialProfileUrl} />
        <meta property="og:type" content="profile" />
        <meta property="og:site_name" content="عيادات دكتور أيمن عجيب" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="دكتور أيمن عجيب | استشاري المخ والأعصاب والعمود الفقري" />
        <meta name="twitter:description" content="عيادات د. أيمن عجيب لجراحة المخ والأعصاب والعمود الفقري (أكتوبر - شبرا). احجز موعدك أو أرسل استشارتك الطبية أونلاين." />
        <meta name="twitter:image" content={doctorPhoto} />

        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
      </Helmet>

      {/* النافذة المنبثقة لطلب الحجز الأونلاين */}
      {showBookingModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <form 
            onSubmit={sendToTelegram} 
            style={{ background: '#fff', padding: '30px', borderRadius: '20px', width: '90%', maxWidth: '500px', margin: 'auto', boxSizing: 'border-box' }}
          >
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>طلب حجز موعد</h2>
            
            <input 
              required 
              placeholder="الاسم بالكامل" 
              style={{ width: '100%', padding: '15px', margin: '10px 0', fontSize: '18px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }} 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
            />
            
            <input 
              required 
              placeholder="رقم الواتساب" 
              style={{ width: '100%', padding: '15px', margin: '10px 0', fontSize: '18px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }} 
              onChange={(e) => setFormData({...formData, phone: e.target.value})} 
            />
            
            <button 
              type="submit" 
              style={{ background: '#1a73e8', color: '#fff', padding: '15px', width: '100%', fontSize: '18px', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '10px' }}
            >
              إرسال الطلب
            </button>
            
            <button 
              type="button" 
              onClick={() => setShowBookingModal(false)} 
              style={{ marginTop: '15px', padding: '10px', width: '100%', fontSize: '16px', background: '#f8f9fa', border: '1px solid #ccc', borderRadius: '8px', cursor: 'pointer' }}
            >
              إغلاق
            </button>
          </form>
        </div>
      )}

      {/* مودال الاستشارة المحدث */}
      {showConsultModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <form 
            onSubmit={async (e) => {
              e.preventDefault();
              alert("تم إرسال الاستشارة، جاري الإرسال...");
              
              try {
                const res = await fetch('https://clinic-api-ig3d.onrender.com/api/consultations', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(formData)
                });
                
                const data = await res.json();
                
                if (data.success) {
                  alert('تم استلام سؤالك بنجاح وسنقوم بالرد عليه قريباً!');
                  setShowConsultModal(false); 
                } else {
                  alert('حدث خطأ: ' + (data.message || 'غير معروف'));
                }
              } catch (error) {
                console.error(error);
                alert('خطأ في الاتصال بالسيرفر. تأكد من تشغيل السيرفر!');
              }
            }} 
            style={{ background: '#fff', padding: '30px', borderRadius: '20px', width: '90%', maxWidth: '500px', margin: 'auto' }}
          >
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>إرسال استشارة طبية</h2>
            
            <input 
              required 
              placeholder="الاسم" 
              style={{ width: '100%', padding: '15px', margin: '10px 0', fontSize: '18px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }} 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
            />
            
            <input 
              required 
              placeholder="الموبايل" 
              style={{ width: '100%', padding: '15px', margin: '10px 0', fontSize: '18px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }} 
              onChange={(e) => setFormData({...formData, phone: e.target.value})} 
            />
            
            <textarea 
              required 
              placeholder="اكتب سؤالك هنا..." 
              rows="6" 
              style={{ width: '100%', padding: '15px', margin: '10px 0', fontSize: '18px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box', minHeight: '120px' }} 
              onChange={(e) => setFormData({...formData, question: e.target.value})} 
            />
            
            <button 
              type="submit" 
              style={{ background: '#1a73e8', color: '#fff', padding: '15px', width: '100%', fontSize: '18px', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '10px' }}
            >
              إرسال الاستشارة
            </button>
            
            <button 
              type="button" 
              onClick={() => setShowConsultModal(false)} 
              style={{ marginTop: '15px', padding: '10px', width: '100%', fontSize: '16px', background: '#f8f9fa', border: '1px solid #ccc', borderRadius: '8px', cursor: 'pointer' }}
            >
              إغلاق
            </button>
          </form>
        </div>
      )}

      {/* شريط علوي أنيق للعودة + زر نسخ الرابط المختصر */}
      <div style={{ padding: '12px 20px', backgroundColor: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: '#1a73e8', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px' }}>
          <FaArrowRight /> العودة للرئيسية
        </button>

        {/* زر نسخ رابط صفحتك المختصر والمميز */}
        <button 
          onClick={handleCopyShortLink}
          style={{ 
            background: copied ? '#059669' : '#0f172a', 
            color: '#fff', 
            border: 'none', 
            padding: '8px 16px', 
            borderRadius: '12px', 
            fontSize: '13.5px', 
            fontWeight: 'bold', 
            cursor: 'pointer', 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px' 
          }}
        >
          {copied ? <FaCheck /> : <FaShareAlt />}
          <span>{copied ? 'تم نسخ رابط البروفايل!' : 'نسخ رابط الصفحة للمشاركة'}</span>
        </button>
      </div>


{/* الواجهة الرئيسية - الهوية الطبية الشخصية */}
<section
  style={{
    direction: 'rtl',
    background: 'linear-gradient(120deg, #f5f9ff 0%, #e5f0fc 55%, #d5e7fa 100%)',
    padding: '55px 20px 65px',
    overflow: 'hidden'
  }}
>
  <div
    style={{
      maxWidth: '1150px',
      margin: 'auto',
      display: 'flex',
      alignItems: 'center',
      gap: '30px',
      flexWrap: 'wrap'
    }}
  >
    {/* صورة الطبيب */}
    <div
      style={{
        flex: '1 1 420px',
        maxWidth: '500px',
        width: '100%',
        margin: 'auto',
        textAlign: 'center'
      }}
    >
      <div
        style={{
        padding: '6px',
background: '#fff',
borderRadius: '28px',
boxShadow: '0 18px 45px rgba(13, 55, 100, 0.18)',
overflow: 'hidden'
        }}
      >
        <img
         src="/ayman-profile.webp"
          alt="دكتور أيمن عجيب، استشاري المخ والأعصاب والعمود الفقري"
         style={{
  display: 'block',
  width: '100%',
height: 'auto',
objectFit: 'cover',
  objectPosition: 'center',
  borderRadius: '21px',
  background: '#fff'
}}
        />
      </div>
    </div>

    {/* التعريف بالطبيب */}
    <div
      style={{
        flex: '1 1 450px',
        minWidth: 0,
        textAlign: 'right'
      }}
    >
      <div
        style={{
          display: 'inline-block',
          padding: '9px 18px',
          borderRadius: '30px',
          background: '#d4e8ff',
          color: '#07549a',
          fontWeight: 'bold',
          fontSize: '15px',
          marginBottom: '18px'
        }}
      >
        خبرة أكثر من 20 عامًا داخل وخارج مصر
      </div>

      <h1
        style={{
          color: '#102f59',
          fontSize: 'clamp(32px, 5vw, 48px)',
          lineHeight: '1.4',
          margin: '0 0 12px',
          fontWeight: '800'
        }}
      >
        دكتور أيمن عجيب
      </h1>

      <h2
        style={{
          color: '#1265a8',
          fontSize: 'clamp(21px, 3vw, 28px)',
          lineHeight: '1.6',
          margin: '0 0 22px',
          fontWeight: '700'
        }}
      >
        استشاري المخ والأعصاب والعمود الفقري
      </h2>

      <p
        style={{
          color: '#40536b',
          fontSize: '17px',
          lineHeight: '2',
          margin: '0 0 25px'
        }}
      >
        خبرة مهنية داخل مصر وخارجها، من خلال العمل بمستشفيات جامعة بنها
        ومستشفى الأطفال والمستشفى التخصصي بمصر، ومستشفى الطائف الطبي
        بالمملكة العربية السعودية.
      </p>

      {/* التخصصات */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
          marginBottom: '28px'
        }}
      >
        {[
          'أمراض المخ والأعصاب',
          'جراحة العمود الفقري',
          'آلام الظهر والرقبة'
        ].map((item, index) => (
          <span
            key={index}
            style={{
              background: '#fff',
              color: '#164d83',
              border: '1px solid #c8def5',
              borderRadius: '25px',
              padding: '9px 15px',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            {item}
          </span>
        ))}
      </div>

      {/* أزرار التفاعل */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap'
        }}
      >
        <button
          onClick={() => setShowBookingModal(true)}
          style={{
            background: '#075ba5',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            padding: '15px 27px',
            fontSize: '17px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 6px 16px rgba(7, 91, 165, 0.2)'
          }}
        >
          حجز موعد
        </button>

        <button
          onClick={() => setShowConsultModal(true)}
          style={{
            background: '#fff',
            color: '#075ba5',
            border: '2px solid #075ba5',
            borderRadius: '12px',
            padding: '13px 25px',
            fontSize: '17px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          إرسال استشارة
        </button>
      </div>
    </div>
  </div>
</section>


      <div style={{ maxWidth: '1000px', margin: '20px auto 0', padding: '0 20px' }}>
        {/* قسم الفروع */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '20px' 
        }}>
          
          {/* فرع أكتوبر */}
          <div style={{ background: '#fff', padding: '25px', borderRadius: '20px', textAlign: 'center', border: '2px solid #1a73e8' }}>
            <FaMapMarkerAlt style={{ fontSize: '30px', color: '#1a73e8' }} />
            
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', marginTop: '10px' }}>
              <h3 style={{ margin: '0' }}>فرع أكتوبر</h3>
              <button onClick={() => window.open('https://maps.app.goo.gl/wse4VG3tAziZTQVs7')} style={{ background: '#e3f2fd', border: '1px solid #1a73e8', borderRadius: '8px', padding: '8px 20px', cursor: 'pointer', color: '#1a73e8', fontWeight: 'bold', fontSize: '16px' }}>
                اللوكيشن
              </button>
            </div>
            
            <p style={{ fontSize: '18px', color: '#475569' }}>ميدان الحصري / فوق سنتر شعبان / الدور الرابع</p>
            
            <button 
              onClick={() => navigate(octPath)} 
              style={{ width: '100%', marginTop: '15px', fontSize: '20px', padding: '14px', background: '#1a73e8', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              حجز موعد (أكتوبر)
            </button>
            
            <button onClick={() => window.open('https://g.page/r/CdLCrFOSM76vEBM/review')} style={{ width: '100%', marginTop: '10px', fontSize: '16px', padding: '10px', background: '#e3f2fd', color: '#1a73e8', border: '1px solid #1a73e8', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
              تقييم عيادة أكتوبر ⭐
            </button>
          </div>

          {/* فرع شبرا */}
          <div style={{ background: '#fff', padding: '25px', borderRadius: '20px', textAlign: 'center', border: '2px solid #2e7d32' }}>
            <FaMapMarkerAlt style={{ fontSize: '30px', color: '#2e7d32' }} />
            
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', marginTop: '10px' }}>
              <h3 style={{ margin: '0' }}>فرع شبرا</h3>
              <button onClick={() => window.open('https://maps.app.goo.gl/M5ZMNchAfXD3omYT9')} style={{ background: '#e8f5e9', border: '1px solid #2e7d32', borderRadius: '8px', padding: '8px 20px', cursor: 'pointer', color: '#2e7d32', fontWeight: 'bold', fontSize: '16px' }}>
                اللوكيشن
              </button>
            </div>
            
            <p style={{ fontSize: '18px', color: '#475569' }}>16 شارع دولتيان فوق كنتاكي الدور الثالث /الخلفاوي</p>
            
            <button 
              onClick={() => navigate(shubraPath)} 
              style={{ width: '100%', marginTop: '15px', fontSize: '20px', padding: '14px', background: '#2e7d32', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              حجز موعد (شبرا)
            </button>
            
            <button onClick={() => window.open('https://g.page/r/CULxWxXqThoJEBM/review')} style={{ width: '100%', marginTop: '10px', fontSize: '16px', padding: '10px', background: '#e8f5e9', color: '#2e7d32', border: '1px solid #2e7d32', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
              تقييم عيادة شبرا ⭐
            </button>
          </div>
        </div>

        {/* قسم الخدمات */}
        <div style={{ background: '#fff', borderRadius: '20px', padding: '30px', marginTop: '30px', boxShadow: '0 10px 25px rgba(0,0,0,0.06)' }}>
          <h2 style={{ color: '#1a73e8', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
            <FaStethoscope /> خدمات العيادة 
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
           {servicesData.map((s) => (
  <Link
    key={s.id}
    to={`/service/${s.id}`}
    title={`تعرف على خدمة ${s.title}`}
    style={{
      display: 'block',
      cursor: 'pointer',
      padding: '20px',
      borderRight: '4px solid #3debd3',
      background: '#f0fff4',
      borderRadius: '12px',
      textAlign: 'center',
      fontWeight: 'bold',
      color: '#1e293b',
      textDecoration: 'none',
      transition: 'transform 0.2s'
    }}
    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
  >
    {s.title}
  </Link>
))}
          </div>
        </div>
      </div>

      {/* قسم الاستشارات المجانية والتطبيق */}
      <div style={{ padding: '30px', background: '#e3f2fd', borderRadius: '20px', marginTop: '40px', textAlign: 'center', margin: '20px' }}>
        <h3 style={{ color: '#1565c0', margin: '0 0 10px 0' }}>استشارة طبية مجانية أونلاين</h3>
        <p style={{ margin: '0 0 20px 0', color: '#334155' }}>أرسل سؤالك الطبي وسنقوم بالرد عليه في أقرب وقت.</p>
        
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '20px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => setShowConsultModal(true)} 
            style={{ padding: '14px 35px', background: '#1565c0', color: '#fff', border: 'none', borderRadius: '50px', fontSize: '18px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            إسأل دكتور أيمن
          </button>

          <Link to="/free-consultations" style={{ textDecoration: 'none' }}>
            <button 
              style={{ padding: '14px 35px', background: '#f2945b', color: '#fff', border: 'none', borderRadius: '50px', fontSize: '18px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              الأسئلة والأجوبة
            </button>
          </Link>

          <a 
            href="https://play.google.com/store/apps/details?id=com.doctorplatform.app&pcampaignid=web_share" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ textDecoration: 'none' }}
          >
            <button 
              style={{ padding: '14px 35px', background: '#30b837', color: '#fff', border: 'none', borderRadius: '50px', fontSize: '18px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              حمل تطبيق دكتور الآن 📱
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default AymanProfile;