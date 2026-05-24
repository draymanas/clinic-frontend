import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { FaMapMarkerAlt, FaStethoscope, FaArrowRight } from 'react-icons/fa';

const AymanProfile = ({ setActivePage, navigate }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '' });

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
  
  // تجهيز الرسالة
  const message = `طلب حجز أونلاين جديد:%0Aالاسم: ${formData.name}%0Aرقم الواتساب: ${formData.phone}`;
  
  // استخدام التوكين و الـ ID الخاص بك
  const token = '8639669118:AAGOpN9rtWDl_J3kmhoBK3PddqI14jPqEgw';
  const chatId = '6635887452'; 
  const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${message}`;
  
  try {
    const response = await fetch(url);
    if (response.ok) {
      alert('تم إرسال طلبك بنجاح، سنتواصل معك قريباً!');
      setShowModal(false);
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
        <title>دكتور أيمن عجيب | استشاري المخ والأعصاب</title>
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
      </Helmet>

      {/* النافذة المنبثقة */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <form onSubmit={sendToTelegram} style={{ background: '#fff', padding: '30px', borderRadius: '20px', width: '90%', maxWidth: '400px', color: '#333' }}>
            <h2>طلب حجز</h2>
            <input required placeholder="الاسم بالكامل" style={{ width: '100%', padding: '10px', margin: '10px 0' }} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            <input required placeholder="رقم الواتساب (كود الدولة +)" style={{ width: '100%', padding: '10px', margin: '10px 0' }} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
            <button type="submit" style={{ width: '100%', padding: '10px', background: '#1a73e8', color: '#fff', border: 'none', borderRadius: '5px' }}>إرسال الطلب</button>
            <button type="button" onClick={() => setShowModal(false)} style={{ width: '100%', marginTop: '10px' }}>إغلاق</button>
          </form>
        </div>
      )}

      {/* زر العودة */}
      <div style={{ padding: '15px', backgroundColor: '#fff' }}>
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: '#1a73e8', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FaArrowRight /> العودة للرئيسية
        </button>
      </div>

      {/* الهيدر الشخصي */}
      <div style={{ background: 'linear-gradient(135deg, #1a73e8 0%, #0d47a1 100%)', color: '#fff', padding: '40px 20px', textAlign: 'center' }}>
        <h1 style={{ margin: '0 0 10px 0' }}>دكتور أيمن عجيب</h1>
        <p style={{ fontSize: '20px', opacity: '0.9' }}>استشاري المخ والأعصاب وجراحة العمود الفقري</p>
        {/* الزر الجديد */}
        <button onClick={() => setShowModal(true)} style={{ marginTop: '20px', padding: '12px 30px', background: '#ffeb3b', border: 'none', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer' }}>
          حجز موعد أونلاين الآن
        </button>
      </div>
      {/* ... باقي الكود الأصلي */}
    
      <div style={{ maxWidth: '1000px', margin: '-40px auto 0', padding: '0 20px' }}>
        
        {/* قسم الفروع والحجز المباشر */}
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          
          {/* فرع أكتوبر */}
          <div style={{ background: '#fff', padding: '25px', borderRadius: '20px', textAlign: 'center', border: '2px solid #1a73e8' }}>
            <FaMapMarkerAlt style={{ fontSize: '30px', color: '#1a73e8' }} />
            <h3 style={{ margin: '15px 0' }}>فرع أكتوبر</h3>
            <p style={{ color: '#141313', fontSize: '20px' }}>ميدان الحصري / فوق سنتر شعبان / الدور الرابع  </p>
            <button 
              onClick={() => window.open('https://www.doctoreg.online/dr/40')}
              style={{ width: '100%', marginTop: '24px', fontSize: '24px', padding: '15px', background: '#1a73e8', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}
            >
               حجز موعد (أكتوبر)
            </button>
          </div>

          {/* فرع شبرا */}
          <div style={{ background: '#fff', padding: '25px', borderRadius: '20px', textAlign: 'center', border: '2px solid #2e7d32' }}>
            <FaMapMarkerAlt style={{ fontSize: '30px', color: '#2e7d32' }} />
            <h3 style={{ margin: '15px 0' }}>فرع شبرا</h3>
            <p style={{ color: '#141313', fontSize: '20px' }}>16 شارع دولتيان فوق كنتاكي الدور الثالث /الخلفاوي</p>
            <button 
              onClick={() => window.open('https://www.doctoreg.online/dr/138')}
              style={{ width: '100%', marginTop: '24px', fontSize: '24px', padding: '15px', background: '#2e7d32', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              حجز موعد (شبرا)
            </button>
          </div>

        </div>
        {/* قسم الخدمات */}
        <div style={{ background: '#fff', borderRadius: '20px', padding: '30px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
          <h2 style={{ color: '#1a73e8', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FaStethoscope /> خدمات العيادة  
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
            <div style={{ padding: '15px', borderRight: '4px solid #3debd3', background: '#f0fff4' }}>جراحات العمود الفقري الميكروسكوبية</div>
            <div style={{ padding: '15px', borderRight: '4px solid #3debd3', background: '#f0fff4' }}>علاج اختناق الأعصاب والم اليد والكتفين</div>
            <div style={{ padding: '15px', borderRight: '4px solid #3debd3', background: '#f0fff4' }}> علاج الانزلاق الغضروفي القطني والعنقي </div>
            
  <div style={{ padding: '15px', borderRight: '4px solid #3debd3', background: '#f0fff4', borderRadius: '12px' }}>
    علاج الم اسفل الظهر و عرق النسا
  </div>

  <div style={{ padding: '15px', borderRight: '4px solid #3debd3', background: '#f0fff4', borderRadius: '12px' }}>
    الصداع النصفي و كافة انواع الصداع  
  </div>

  <div style={{ padding: '15px', borderRight: '4px solid #3debd3', background: '#f0fff4', borderRadius: '12px' }}>
    التهابات العصب السابع والعصب الخامس
  </div>

  <div style={{ padding: '15px', borderRight: '4px solid #3debd3', background: '#f0fff4', borderRadius: '12px' }}>
    التهاب الأعصاب الطرفية و ألم القدمين
  </div>

  <div style={{ padding: '15px', borderRight: '4px solid #3debd3', background: '#f0fff4', borderRadius: '12px' }}>
    الدوخة وعدم الاتزان والرعشة  </div>

  <div style={{ padding: '15px', borderRight: '4px solid #3debd3', background: '#f0fff4', borderRadius: '12px' }}>
     جلطات المخ ونزيف المخ بكافة أنواعه
  </div>

  <div style={{ padding: '15px', borderRight: '4px solid #3debd3', background: '#f0fff4', borderRadius: '12px' }}>
    نوبات الإغماء المتكررة و ارتفاع ضغط المخ و ارتشاح العصب البصري
  </div>

  <div style={{ padding: '15px', borderRight: '4px solid #3debd3', background: '#f0fff4', borderRadius: '12px' }}>
    اضطرابات الغدة النخامية والحركات اللارادية والرعاش
  </div>

<div style={{ padding: '15px', borderRight: '4px solid #3debd3', background: '#f0fff4', borderRadius: '12px' }}>
  ضعف الذاكرة والنسيان، والزهايمر
</div>
  {/* خدمات الأطفال */}

  <div style={{ padding: '15px', borderRight: '4px solid #3debd3', background: '#f0fff4', borderRadius: '12px' }}>
    التشنجات ونوبات الصرع، وزيادة الكهرباء على المخ
  </div>

  <div style={{ padding: '15px', borderRight: '4px solid #3debd3', background: '#f0fff4', borderRadius: '12px' }}>
    تأخر النمو البدني والحركي، وتأخر النمو العقلي
  </div>

  <div style={{ padding: '15px', borderRight: '4px solid #3debd3', background: '#f0fff4', borderRadius: '12px' }}>
    صعوبات التعلم، وتأخر النطق، وضعف الذاكرة
  </div>

  <div style={{ padding: '15px', borderRight: '4px solid #3debd3', background: '#f0fff4', borderRadius: '12px' }}>
    فرط الحركة وتشتت الانتباه (ADHD)، والتوحد
  </div>

  <div style={{ padding: '15px', borderRight: '4px solid #3debd3', background: '#f0fff4', borderRadius: '12px' }}>
    علاج الاستسقاء الدماغي (المياه الزائدة على المخ)
  </div>

  <div style={{ padding: '15px', borderRight: '4px solid #3debd3', background: '#f0fff4', borderRadius: '12px' }}>
    الحركات اللاإرادية، والشلل الدماغي، وضمور العضلات، والتهابات الأعصاب
  </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AymanProfile;