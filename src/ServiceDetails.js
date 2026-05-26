import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { servicesData } from './servicesData'; // تأكد أن المسار صحيح

const ServiceDetails = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const service = servicesData.find(s => s.id === serviceId);

  if (!service) {
    return <div style={{padding: '50px', textAlign: 'center'}}>عذراً، هذه الخدمة غير متوفرة حالياً.</div>;
  }

  return (
    <div style={{ padding: '40px', direction: 'rtl', maxWidth: '800px', margin: 'auto' }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: '20px' }}>العودة للخلف</button>
      <h1>{service.title}</h1>
      <img src={service.image} alt={service.title} style={{ width: '100%', borderRadius: '20px' }} />
      <div style={{ marginTop: '20px' }}>
         <h3>شرح الخدمة:</h3>
         <p>{service.description}</p>
         <h3>طرق العلاج:</h3>
         <p>{service.treatment}</p>
      </div>
      <button onClick={() => navigate('/booking')} style={{marginTop: '20px', padding: '10px 20px'}}>احجز موعد الآن</button>
    </div>
  );
};

export default ServiceDetails;