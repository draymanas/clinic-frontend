import React from 'react';
import { FaMapMarkerAlt, FaCalendarCheck, FaStethoscope, FaArrowRight } from 'react-icons/fa';
const AymanProfile = ({ setActivePage, navigate }) => {
  return (
    <div style={{ direction: 'rtl', backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '50px' }}>
      <div style={{ padding: '15px', backgroundColor: '#fff', borderBottom: '1px solid #eee' }}>
        <button 
          onClick={() => navigate('/')} // هذه هي الدالة التي تعيد المستخدم للرئيسية
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'none',
            border: 'none',
            color: '#1a73e8',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          <FaArrowRight /> العودة للرئيسية
        </button>
      </div>
      {/* الهيدر الشخصي */}
      <div style={{ background: 'linear-gradient(135deg, #1a73e8 0%, #0d47a1 100%)', color: '#fff', padding: '60px 20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '38px', fontWeight: '900', margin: '0 0 10px 0' }}>دكتور أيمن عجيب</h1>
        <p style={{ fontSize: '24px', opacity: '0.9' }}>استشاري المخ والأعصاب وجراحة العمود الفقري</p>
        <p style={{ fontSize: '22px', fontWeight: 'bold', color: '#eef5f4' }}>خبرة أكثر من 20 عاماً</p>
        <p style={{ fontSize: '22px', fontWeight: 'bold', color: '#f0f7f6' }}>احجز موعدك الآن</p>
     
      </div>

      <div style={{ maxWidth: '1000px', margin: '-40px auto 0', padding: '0 20px' }}>
        
        {/* قسم الفروع والحجز المباشر */}
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          
          {/* فرع أكتوبر */}
          <div style={{ background: '#fff', padding: '25px', borderRadius: '20px', textAlign: 'center', border: '2px solid #1a73e8' }}>
            <FaMapMarkerAlt style={{ fontSize: '30px', color: '#1a73e8' }} />
            <h3 style={{ margin: '15px 0' }}>فرع أكتوبر</h3>
            <p style={{ color: '#666', fontSize: '14px' }}>ميدان الحصري / فوق سنتر شعبان / الدور الرابع  </p>
            <button 
              onClick={() => window.open('https://www.doctoreg.online/dr/40')}
              style={{ width: '100%', marginTop: '24px', fontSize: '24px', padding: '15px', background: '#1a73e8', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              <FaCalendarCheck /> حجز موعد (أكتوبر)
            </button>
          </div>

          {/* فرع شبرا */}
          <div style={{ background: '#fff', padding: '25px', borderRadius: '20px', textAlign: 'center', border: '2px solid #2e7d32' }}>
            <FaMapMarkerAlt style={{ fontSize: '30px', color: '#2e7d32' }} />
            <h3 style={{ margin: '15px 0' }}>فرع شبرا</h3>
            <p style={{ color: '#666', fontSize: '14px' }}>شارع شبرا الرئيسي - بجوار محطة المترو</p>
            <button 
              onClick={() => window.open('https://www.doctoreg.online/dr/138')}
              style={{ width: '100%', marginTop: '24px', fontSize: '24px', padding: '15px', background: '#2e7d32', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              <FaCalendarCheck /> حجز موعد (شبرا)
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
    ألم اليد والكتفين، والصداع بكافة أنواعه
  </div>

  <div style={{ padding: '15px', borderRight: '4px solid #3debd3', background: '#f0fff4', borderRadius: '12px' }}>
    التهاب الأعصاب الطرفية والتهابات العصب السابع والعصب الخامس
  </div>

  <div style={{ padding: '15px', borderRight: '4px solid #3debd3', background: '#f0fff4', borderRadius: '12px' }}>
    آلام أسفل الظهر والرجلين
  </div>

  <div style={{ padding: '15px', borderRight: '4px solid #3debd3', background: '#f0fff4', borderRadius: '12px' }}>
    الدوخة وعدم الاتزان والرعشة  </div>

  <div style={{ padding: '15px', borderRight: '4px solid #3debd3', background: '#f0fff4', borderRadius: '12px' }}>
    الحركات اللاإرادية، وجلطات المخ ونزيف المخ بكافة أنواعه
  </div>

  <div style={{ padding: '15px', borderRight: '4px solid #3debd3', background: '#f0fff4', borderRadius: '12px' }}>
    نوبات الإغماء المتكررة والتشنجات
  </div>

  <div style={{ padding: '15px', borderRight: '4px solid #3debd3', background: '#f0fff4', borderRadius: '12px' }}>
    اضطرابات الغدة النخامية
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