import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { FaMapMarkerAlt, FaStethoscope, FaArrowRight } from 'react-icons/fa';
import { servicesData } from './servicesData';
import { Link } from 'react-router-dom';

const AymanProfile = ({ setActivePage, navigate: propNavigate }) => { 
// أضف هذه الأسطر في بداية المكون (مكان الـ useState القديمة)
const [showBookingModal, setShowBookingModal] = useState(false);
const [showConsultModal, setShowConsultModal] = useState(false); // مودال جديد
const [formData, setFormData] = useState({ name: '', phone: '', question: '' }); // أضفنا question
  const navigate = useNavigate();
  const schemaData = {
    "@context": "https://schema.org/",
    "@type": "Physician",
    "name": "دكتور أيمن عجيب",
    "url": "https://www.doctoreg.online/dr_ayman_aguib",
    "description": "استشاري المخ والأعصاب وجراحة العمود الفقري بخبرة أكثر من 20 عاماً.",
    "address": { "@type": "PostalAddress", "addressLocality": "مصر", "addressCountry": "EG" }
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
    <div style={{ direction: 'rtl', backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '50px' }}>
      <Helmet>
        <title>دكتور أيمن عجيب | استشاري المخ والأعصاب والعمود الفقري</title>
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
      </Helmet>

      {/* النافذة المنبثقة */}
      {showBookingModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <form onSubmit={sendToTelegram} style={{ background: '#fff', padding: '30px', borderRadius: '20px', width: '90%', maxWidth: '400px', color: '#333' }}>
            <h2>طلب حجز</h2>
            <input required placeholder="الاسم بالكامل" style={{ width: '100%', padding: '10px', margin: '10px 0' }} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            <input required placeholder="رقم الواتساب" style={{ width: '100%', padding: '10px', margin: '10px 0' }} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
            <button type="submit" style={{ width: '100%', padding: '10px', background: '#1a73e8', color: '#fff', border: 'none', borderRadius: '5px' }}>إرسال الطلب</button>
            <button type="button" onClick={() => setShowBookingModal(false)} style={{ width: '100%', marginTop: '10px' }}>إغلاق</button>
          </form>
        </div>
      )}
    {/* مودال الاستشارة المحدث */}
{showConsultModal && (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
        <form 
            onSubmit={async (e) => {
                e.preventDefault();
                // 1. إظهار رسالة انتظار
                alert("جاري الإرسال، يرجى الانتظار...");
                
                try {
                   // بدلاً من رابط الـ localhost، استخدم رابط الـ API المرفوع على Render
const res = await fetch('https://clinic-api-ig3d.onrender.com/api/consultations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
});
                    
                    const data = await res.json();
                    
                    if (data.success) {
                        alert('تم استلام سؤالك بنجاح وسنقوم بالرد عليه قريباً!');
                        setShowConsultModal(false); // سيغلق المودال الآن
                    } else {
                        alert('حدث خطأ: ' + data.message);
                    }
                } catch (error) {
                    alert('خطأ في الاتصال بالسيرفر. تأكد من تشغيل السيرفر!');
                }
            }} 
            style={{ background: '#fff', padding: '30px', borderRadius: '20px', width: '90%', maxWidth: '400px' }}
        >
            <h2>إرسال استشارة طبية</h2>
            <input required placeholder="الاسم" onChange={(e) => setFormData({...formData, name: e.target.value})} />
            <input required placeholder="الموبايل" onChange={(e) => setFormData({...formData, phone: e.target.value})} />
            <textarea required placeholder="اكتب سؤالك هنا..." onChange={(e) => setFormData({...formData, question: e.target.value})} />
            <button type="submit" style={{ background: '#1a73e8', color: '#fff', padding: '10px', width: '100%' }}>إرسال الاستشارة</button>
            <button type="button" onClick={() => setShowConsultModal(false)} style={{ marginTop: '10px', width: '100%' }}>إغلاق</button>
        </form>
    </div>
)}
      {/* زر العودة */}
      <div style={{ padding: '15px', backgroundColor: '#fff' }}>
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: '#1a73e8', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FaArrowRight /> العودة للرئيسية
        </button>
      </div>

      {/* الهيدر */}
      <div style={{ background: 'linear-gradient(135deg, #1a73e8 0%, #0d47a1 100%)', color: '#fff', padding: '40px 20px', textAlign: 'center' }}>
        <h1>دكتور أيمن عجيب</h1>
        <p style={{ fontSize: '24px', opacity: '0.9' }}>استشاري المخ والأعصاب وجراحة العمود الفقري</p>
        <button onClick={() => setShowBookingModal(true)} style={{ marginTop: '20px', fontSize: '24px', padding: '16px 36px', background: '#3bff5c', border: 'none', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer' }}>
          حجز موعد اونلاين الان عبر الفيديو
        </button>
      </div>

      <div style={{ maxWidth: '1000px', margin: '20px auto 0', padding: '0 20px' }}>
        
        {/* قسم الفروع - مصمم ليكون عمودياً على الموبايل وبجانب بعض على الكمبيوتر */}
        <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '20px' 
        }}>
          
          {/* فرع أكتوبر */}
          <div style={{ background: '#fff', padding: '25px', borderRadius: '20px', textAlign: 'center', border: '2px solid #1a73e8' }}>
            <FaMapMarkerAlt style={{ fontSize: '30px', color: '#1a73e8' }} />
            <h3>فرع أكتوبر</h3>
            <p style={{ fontSize: '18px' }}>ميدان الحصري / فوق سنتر شعبان / الدور الرابع</p>
            <button onClick={() => window.open('https://www.doctoreg.online/dr/40')} style={{ width: '100%', marginTop: '15px', fontSize: '24px', padding: '15px', background: '#1a73e8', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
              حجز موعد (أكتوبر)
            </button>
          </div>

          {/* فرع شبرا */}
          <div style={{ background: '#fff', padding: '25px', borderRadius: '20px', textAlign: 'center', border: '2px solid #2e7d32' }}>
            <FaMapMarkerAlt style={{ fontSize: '30px', color: '#2e7d32' }} />
            <h3>فرع شبرا</h3>
            <p style={{ fontSize: '18px' }}>16 شارع دولتيان فوق كنتاكي الدور الثالث /الخلفاوي</p>
            <button onClick={() => window.open('https://www.doctoreg.online/dr/138')} style={{ width: '100%', marginTop: '15px', fontSize: '24px', padding: '15px', background: '#2e7d32', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
              حجز موعد (شبرا)
            </button>
          </div>
        </div>
        {/* قسم الخدمات */}
       {/* قسم الخدمات - مستبدل بالكود الديناميكي */}
<div style={{ background: '#fff', borderRadius: '20px', padding: '30px', marginTop: '30px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
  <h2 style={{ color: '#1a73e8', display: 'flex', alignItems: 'center', gap: '10px' }}>
    <FaStethoscope /> خدمات العيادة 
  </h2>
  
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
    {servicesData.map((s) => (
      <div 
        key={s.id} 
       onClick={() => navigate(`/service/${s.id}`)}
        style={{ 
          cursor: 'pointer', 
          padding: '20px', 
          borderRight: '4px solid #3debd3', 
          background: '#f0fff4', 
          borderRadius: '12px',
          textAlign: 'center',
          transition: 'transform 0.2s'
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        {s.title}
      </div>
    ))}
  </div>
</div></div>
  {/* قسم الاستشارات المجانية */}
<div style={{ padding: '30px', background: '#e3f2fd', borderRadius: '20px', marginTop: '40px', textAlign: 'center', margin: '20px' }}>
  <h3 style={{ color: '#1565c0' }}>استشارة طبية مجانية أونلاين</h3>
  <p>أرسل سؤالك الطبي وسأقوم بالرد عليه في أقرب وقت لإفادة الجميع.</p>
  <button 
    onClick={() => setShowConsultModal(true)} 
    style={{ padding: '15px 40px', background: '#1565c0', color: '#fff', border: 'none', borderRadius: '50px', fontSize: '20px', cursor: 'pointer' }}
  >
    إسأل دكتور أيمن
  </button>
      <Link to="/free-consultations">
   <button>الأسئلة والأجوبة (استشارات مجانية)</button>
</Link>
</div>
    </div>
    
  );
};

export default AymanProfile;