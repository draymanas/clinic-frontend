import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { servicesData } from './servicesData';

const ServiceDetails = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const service = servicesData.find(s => s.id === serviceId);
const [showModal, setShowModal] = React.useState(false);

  if (!service) return <div>عذراً، هذه الخدمة غير متوفرة.</div>;

const sendToTelegram = async (e) => {
  e.preventDefault();
  
  // استخراج البيانات من الـ Form مباشرة باستخدام FormData
  const data = new FormData(e.target);
  const formData = {
    name: data.get('name'),
    phone: data.get('phone')
  };

  const message = `طلب حجز أونلاين جديد من صفحة الخدمة:%0Aالاسم: ${formData.name}%0Aرقم الواتساب: ${formData.phone}`;
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
    <div style={{ padding: '40px', direction: 'rtl', maxWidth: '800px', margin: 'auto' }}>
      
       {/* النافذة المنبثقة */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <form onSubmit={sendToTelegram} style={{ background: '#fff', padding: '30px', borderRadius: '20px', width: '90%', maxWidth: '400px', color: '#333' }}>
            <h2>طلب حجز</h2>
            {/* حقل الاسم */}
<input 
  name="name" 
  required 
  placeholder="الاسم بالكامل" 
  style={{ width: '100%', marginBottom: '10px', padding: '10px' }} 
/>

{/* حقل الواتساب */}
<input 
  name="phone" 
  required 
  placeholder="رقم الواتساب" 
  style={{ width: '100%', marginBottom: '10px', padding: '10px' }} 
/> <button type="submit" style={{ width: '100%', padding: '10px', background: '#1a73e8', color: '#fff', border: 'none', borderRadius: '5px' }}>إرسال الطلب</button>
            <button type="button" onClick={() => setShowModal(false)} style={{ width: '100%', marginTop: '10px' }}>إغلاق</button>
          </form>
        </div>
      )}

      <button onClick={() => navigate(-1)}>العودة للخلف</button>
      <h1>{service.title}</h1>
      <img src={service.image} alt={service.title} style={{ width: '100%', borderRadius: '20px' }} />
      
      <h3>مقدمة:</h3>
      <p>{service.introduction}</p>

      {/* عرض قائمة الأعراض */}
      <h3>الأعراض:</h3>
      <ul>{service.symptoms?.map((s, i) => <li key={i}>{s}</li>)}</ul>

      {/* عرض قائمة الأسباب */}
      <h3>الأسباب:</h3>
      <ul>{service.causes?.map((c, i) => <li key={i}>{c}</li>)}</ul>

      <h3>التشخيص:</h3>
      <p>{service.diagnosis}</p>
      
      <h3>طرق العلاج:</h3>
      <p>{service.treatment}</p>

      <h3>تفاصيل الجراحة:</h3>
      <p>{service.surgeryDetails}</p>

      <h3>لماذا تختار الدكتور ايمن عجيب:</h3>
      <p>{service.whyChooseUs}</p>

    {/* استبدل زر الحجز القديم بهذه الأزرار الجديدة */}
      <div style={{ marginTop: '30px' }}>
        <button 
          onClick={() => window.open('https://www.doctoreg.online/dr/40', '_blank')} 
          style={{ width: '100%', marginTop: '20px', fontSize: '24px', padding: '15px', background: '#1a73e8', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          حجز موعد الان فرع أكتوبر
        </button>

        <button 
          onClick={() => window.open('https://www.doctoreg.online/dr/138', '_blank')} 
          style={{ width: '100%', marginTop: '20px', fontSize: '24px', padding: '15px', background: '#3bb441', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          حجز موعد الان فرع شبرا
        </button>
        {/* الزر الثالث الجديد */}
  <button 
    onClick={() => setShowModal(true)} 
    style={{ width: '100%', marginTop: '20px', fontSize: '24px', padding: '15px', background: '#b541f8', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', color: '#fdf9f9' }}
  >
    حجز موعد أونلاين عبر الفيديو
  </button>

      </div>
    </div>
    
  );
};

export default ServiceDetails;