import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { servicesData } from './servicesData';
import { FaArrowRight, FaCalendarCheck, FaShareAlt, FaUserMd, FaCheckCircle, FaClinicMedical } from 'react-icons/fa';

const ServiceDetails = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const service = servicesData.find(s => s.id === serviceId);

  if (!service) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', fontFamily: 'Cairo, sans-serif', direction: 'rtl' }}>
        <h2>عذراً، هذه المقالة أو الخدمة غير متوفرة.</h2>
        <button 
          onClick={() => navigate('/ayman')} 
          style={{ padding: '10px 25px', background: '#1a73e8', color: '#fff', border: 'none', borderRadius: '10px', marginTop: '15px', cursor: 'pointer' }}
        >
          العودة لصفحة الخدمات
        </button>
      </div>
    );
  }

  // رابط المشاركة للسوشيال ميديا (ليولد الكارت العربي المخصص)
const shareUrl = `https://www.doctoreg.online/s/${service.id}`;
// الرابط الأصلي للصفحة للأرشفة والسيو
const pageUrl = `https://www.doctoreg.online/service/${service.id}`;
  const pageTitle = service.seoTitle || `${service.title} | دكتور أيمن عجيب استشاري مخ وأعصاب`;
  const pageDescription = service.seoDescription || service.shortDescription || service.introduction;
  const pageImage = service.image ? (service.image.startsWith('http') ? service.image : `https://www.doctoreg.online${service.image}`) : 'https://www.doctoreg.online/spine-surgery.png';

  // سكيما طبية ذكية ومتقدمة لجوجل تثبت خبرة الدكتور في هذا الموضوع (E-E-A-T)
  const medicalSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "headline": service.title,
    "description": pageDescription,
    "url": pageUrl,
    "image": pageImage,
    "about": {
      "@type": "MedicalCondition",
      "name": service.title,
      "possibleTreatment": service.treatment,
      "signOrSymptom": service.symptoms?.map(s => ({ "@type": "MedicalSignOrSymptom", "name": s }))
    },
    "author": {
      "@type": "Physician",
      "name": "دكتور أيمن عجيب",
      "jobTitle": "استشاري المخ والأعصاب والعمود الفقري",
      "url": "https://www.doctoreg.online/d/ayman"
    },
    "publisher": {
      "@type": "Organization",
      "name": "منصة دكتور",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.doctoreg.online/logo512.png"
      }
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl); // 🌟 ينسخ رابط /s/ المولد للكارت فوراً
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const sendToTelegram = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const name = data.get('name');
    const phone = data.get('phone');

    const message = `طلب حجز موعد جديد من صفحة مقال (${service.title}):%0Aالاسم: ${name}%0Aالموبايل/واتساب: ${phone}`;
    const token = '8639669118:AAGOpN9rtWDl_J3kmhoBK3PddqI14jPqEgw';
    const chatId = '6635887452'; 
    const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${message}`;
    
    try {
      const response = await fetch(url);
      if (response.ok) {
        alert('تم إرسال طلبك بنجاح، سنتواصل معك هاتفياً أو عبر الواتساب لتأكيد الموعد!');
        setShowModal(false);
      } else {
        alert('حدث خطأ أثناء الإرسال، حاول مرة أخرى.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('تعذر الاتصال بخادم التليجرام.');
    }
  };

  // روابط الحجز للفرعين بالصيغة السريعة
  const octBookingPath = `/dr/40-${encodeURIComponent("دكتور-ايمن-عجيب-استشاري-مخ-وأعصاب-وعمود-فقري-فرع-أكتوبر")}`;
  const shubraBookingPath = `/dr/138-${encodeURIComponent("دكتور-ايمن-عجيب-استشاري-مخ-وأعصاب-وعمود-فقري-فرع-شبرا")}`;

  return (
    <div style={{ fontFamily: 'Cairo, sans-serif', direction: 'rtl', backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '60px' }}>
      
      {/* 🌟 وسوم الـ SEO والسكيما المنظمة لجوجل والسوشيال ميديا */}
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={pageUrl} />

        {/* Facebook Open Graph */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={pageImage} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="عيادات دكتور أيمن عجيب" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={pageImage} />

        <script type="application/ld+json">{JSON.stringify(medicalSchema)}</script>
      </Helmet>

      {/* نافذة الحجز السريع المباشرة */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.75)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '16px' }}>
          <form onSubmit={sendToTelegram} style={{ background: '#fff', padding: '30px', borderRadius: '24px', width: '100%', maxWidth: '440px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '20px', color: '#0f172a', textAlign: 'center' }}>طلب حجز استشارة أو كشف</h3>
            <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: '#64748b', textAlign: 'center' }}>بخصوص: {service.title}</p>
            
            <input 
              name="name" 
              required 
              placeholder="الاسم بالكامل" 
              style={{ width: '100%', marginBottom: '14px', padding: '14px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '15px', boxSizing: 'border-box' }} 
            />

            <input 
              name="phone" 
              required 
              placeholder="رقم الموبايل أو الواتساب" 
              style={{ width: '100%', marginBottom: '20px', padding: '14px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '15px', boxSizing: 'border-box' }} 
            /> 
            
            <button type="submit" style={{ width: '100%', padding: '14px', background: '#1a73e8', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
              تأكيد إرسال الطلب
            </button>
            <button type="button" onClick={() => setShowModal(false)} style={{ width: '100%', marginTop: '10px', padding: '10px', background: '#f1f5f9', border: 'none', borderRadius: '12px', color: '#475569', cursor: 'pointer', fontWeight: 'bold' }}>
              إلغاء
            </button>
          </form>
        </div>
      )}

      {/* الشريط العلوي */}
      <header style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '14px 20px', position: 'sticky', top: 0, zIndex: 30 }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button 
            onClick={() => navigate(-1)} 
            style={{ background: 'none', border: 'none', color: '#1a73e8', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px' }}
          >
            <FaArrowRight /> العودة لصفحة الدكتور
          </button>

          <button 
            onClick={handleShare}
            style={{ background: copied ? '#059669' : '#f1f5f9', color: copied ? '#fff' : '#0f172a', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <FaShareAlt />
            <span>{copied ? 'تم نسخ رابط المقال!' : 'مشاركة المقال'}</span>
          </button>
        </div>
      </header>

      {/* الحاوية الرئيسية للمقال الطبي */}
      <main style={{ maxWidth: '860px', margin: '30px auto', padding: '0 20px' }}>
        
        <article style={{ background: '#fff', borderRadius: '24px', padding: '30px 25px', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
          
          {/* تصنيف وكاتب المقال لتعزيز الـ E-E-A-T */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', color: '#64748b', fontSize: '14px' }}>
            <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '4px 12px', borderRadius: '8px', fontWeight: 'bold' }}>دليل طبي تخصصي</span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <FaUserMd color="#1a73e8" /> بقلم: <strong>د. أيمن عجيب</strong> (استشاري مخ وأعصاب)
            </span>
          </div>

          <h1 style={{ fontSize: '26px', lineHeight: '1.4', color: '#0f172a', margin: '0 0 20px 0', fontWeight: '800' }}>
            {service.title}
          </h1>

          {service.image && (
            <img 
              src={service.image} 
              alt={service.title} 
              style={{ width: '100%', maxHeight: '420px', objectFit: 'cover', borderRadius: '18px', marginBottom: '25px', border: '1px solid #f1f5f9' }} 
            />
          )}
          
          {/* المقدمة */}
          <div style={{ background: '#f8fafc', borderRight: '4px solid #1a73e8', padding: '18px', borderRadius: '12px', marginBottom: '25px', fontSize: '16px', lineHeight: '1.8', color: '#334155' }}>
            {service.introduction || service.shortDescription || service.description}
          </div>

          {/* الأعراض */}
          {service.symptoms && service.symptoms.length > 0 && (
            <div style={{ marginBottom: '25px' }}>
              <h2 style={{ fontSize: '20px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <FaCheckCircle color="#dc2626" size={18} /> الأعراض الشائعة التي تستدعي الفحص:
              </h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
                {service.symptoms.map((s, i) => (
                  <li key={i} style={{ background: '#fff1f2', padding: '10px 14px', borderRadius: '10px', fontSize: '15px', color: '#9f1239', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#e11d48', fontWeight: 'bold' }}>•</span> {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* الأسباب */}
          {service.causes && service.causes.length > 0 && (
            <div style={{ marginBottom: '25px' }}>
              <h2 style={{ fontSize: '20px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <FaCheckCircle color="#d97706" size={18} /> أهم الأسباب وعوامل الخطورة:
              </h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
                {service.causes.map((c, i) => (
                  <li key={i} style={{ background: '#fef3c7', padding: '10px 14px', borderRadius: '10px', fontSize: '15px', color: '#92400e', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#d97706', fontWeight: 'bold' }}>•</span> {c}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* التشخيص */}
          {service.diagnosis && (
            <div style={{ marginBottom: '25px' }}>
              <h2 style={{ fontSize: '20px', color: '#0f172a', marginBottom: '10px' }}>كيف يتم التشخيص الدقيق؟</h2>
              <p style={{ fontSize: '15.5px', lineHeight: '1.8', color: '#475569', margin: 0 }}>{service.diagnosis}</p>
            </div>
          )}
          
          {/* طرق العلاج */}
          {service.treatment && (
            <div style={{ marginBottom: '25px' }}>
              <h2 style={{ fontSize: '20px', color: '#0f172a', marginBottom: '10px' }}>خيارات وبروتوكولات العلاج:</h2>
              <p style={{ fontSize: '15.5px', lineHeight: '1.8', color: '#475569', margin: 0 }}>{service.treatment}</p>
            </div>
          )}

          {/* تفاصيل الجراحة (إن وجدت) */}
          {service.surgeryDetails && (
            <div style={{ marginBottom: '25px' }}>
              <h2 style={{ fontSize: '20px', color: '#0f172a', marginBottom: '10px' }}>التقنيات الحديثة والتدخلات الدقيقة:</h2>
              <p style={{ fontSize: '15.5px', lineHeight: '1.8', color: '#475569', margin: 0 }}>{service.surgeryDetails}</p>
            </div>
          )}

          {/* لماذا تختار الدكتور أيمن عجيب */}
          {service.whyChooseUs && (
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '16px', padding: '20px', marginTop: '30px' }}>
              <h3 style={{ fontSize: '18px', color: '#1e40af', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaClinicMedical /> لماذا تختار عيادات د. أيمن عجيب؟
              </h3>
              <p style={{ fontSize: '15px', lineHeight: '1.8', color: '#1e3a8a', margin: 0 }}>{service.whyChooseUs}</p>
            </div>
          )}

          {/* قسم بطاقات الحجز في نهاية المقال */}
          <div style={{ marginTop: '35px', paddingTop: '25px', borderTop: '1px solid #e2e8f0' }}>
            <h3 style={{ textAlign: 'center', color: '#0f172a', fontSize: '21px', margin: '0 0 8px 0' }}>
              احجز موعد كشف أو استشارة الآن
            </h3>
            <p style={{ textAlign: 'center', color: '#64748b', fontSize: '14px', margin: '0 0 20px 0' }}>
              اختر الفرع الأقرب إليك لمعاينة جدول المواعيد والحجز الفوري
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
              
              {/* فرع أكتوبر */}
              <button 
                onClick={() => navigate(octBookingPath)} 
                style={{ background: '#1a73e8', color: '#fff', border: 'none', borderRadius: '14px', padding: '16px', fontSize: '17px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <FaCalendarCheck />
                <span>حجز عيادة أكتوبر</span>
              </button>

              {/* فرع شبرا */}
              <button 
                onClick={() => navigate(shubraBookingPath)} 
                style={{ background: '#16a34a', color: '#fff', border: 'none', borderRadius: '14px', padding: '16px', fontSize: '17px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <FaCalendarCheck />
                <span>حجز عيادة شبرا</span>
              </button>

              {/* استشارة أو حجز أونلاين */}
              <button 
                onClick={() => setShowModal(true)} 
                style={{ background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '14px', padding: '16px', fontSize: '17px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <FaUserMd />
                <span>حجز استشارة سريعة</span>
              </button>

            </div>
          </div>

        </article>

      </main>

    </div>
  );
};

export default ServiceDetails;