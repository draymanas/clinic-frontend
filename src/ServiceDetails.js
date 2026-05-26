import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { servicesData } from './servicesData';

const ServiceDetails = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const service = servicesData.find(s => s.id === serviceId);

  if (!service) return <div>عذراً، هذه الخدمة غير متوفرة.</div>;

  return (
    <div style={{ padding: '40px', direction: 'rtl', maxWidth: '800px', margin: 'auto' }}>
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

      <h3>لماذا تختارنا:</h3>
      <p>{service.whyChooseUs}</p>

    {/* استبدل زر الحجز القديم بهذه الأزرار الجديدة */}
      <div style={{ marginTop: '30px' }}>
        <button 
          onClick={() => window.open('https://www.doctoreg.online/dr/40', '_blank')} 
          style={{ width: '100%', marginTop: '15px', fontSize: '24px', padding: '15px', background: '#1a73e8', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          حجز موعدالان 
        </button>

        <button 
          onClick={() => window.open('https://www.doctoreg.online/dr/138', '_blank')} 
          style={{ width: '100%', marginTop: '15px', fontSize: '24px', padding: '15px', background: '#2e7d32', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          حجز موعدالان 
        </button>
      </div>
    </div>
    
  );
};

export default ServiceDetails;