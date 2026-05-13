import React from 'react';
import { FaMapMarkerAlt, FaCalendarCheck, FaStethoscope } from 'react-icons/fa';

const AymanProfile = ({ setActivePage }) => {
  return (
    <div style={{ direction: 'rtl', backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '50px' }}>
      <div style={{ padding: '15px', backgroundColor: '#fff', borderBottom: '1px solid #eee' }}>
        <button 
          onClick={() => setActivePage('home')} // هذه هي الدالة التي تعيد المستخدم للرئيسية
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
        <h1 style={{ fontSize: '35px', fontWeight: '900', margin: '0 0 10px 0' }}>دكتور أيمن عجيب</h1>
        <p style={{ fontSize: '20px', opacity: '0.9' }}>استشاري المخ والأعصاب وجراحة العمود الفقري</p>
        <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#3debd3' }}>خبرة أكثر من 20 عاماً</p>
      </div>

      <div style={{ maxWidth: '1000px', margin: '-40px auto 0', padding: '0 20px' }}>
        
        {/* قسم الخدمات */}
        <div style={{ background: '#fff', borderRadius: '20px', padding: '30px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
          <h2 style={{ color: '#1a73e8', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FaStethoscope /> خدمات العيادة والمميزات
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
            <div style={{ padding: '15px', borderRight: '4px solid #3debd3', background: '#f0fff4' }}>جراحات العمود الفقري الميكروسكوبية</div>
            <div style={{ padding: '15px', borderRight: '4px solid #3debd3', background: '#f0fff4' }}>علاج آلام الأعصاب والصرع والجلطات</div>
            <div style={{ padding: '15px', borderRight: '4px solid #3debd3', background: '#f0fff4' }}>أحدث تقنيات رسم المخ والأعصاب</div>
          </div>
        </div>

        {/* قسم الفروع والحجز المباشر */}
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#2c3e50' }}>احجز موعدك الآن في الفرع الأقرب لك</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          
          {/* فرع أكتوبر */}
          <div style={{ background: '#fff', padding: '25px', borderRadius: '20px', textAlign: 'center', border: '2px solid #1a73e8' }}>
            <FaMapMarkerAlt style={{ fontSize: '30px', color: '#1a73e8' }} />
            <h3 style={{ margin: '15px 0' }}>فرع مدينة 6 أكتوبر</h3>
            <p style={{ color: '#666', fontSize: '14px' }}>المحور المركزي - استهداف منطقة أكتوبر</p>
            <button 
              onClick={() => window.open('https://www.doctoreg.online/dr/40')}
              style={{ width: '100%', marginTop: '20px', padding: '15px', background: '#1a73e8', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}
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
              style={{ width: '100%', marginTop: '20px', padding: '15px', background: '#2e7d32', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              <FaCalendarCheck /> حجز موعد (شبرا)
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AymanProfile;