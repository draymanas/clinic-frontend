// src/components/ServiceDetails.js
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { servicesData } from './servicesData';

const ServiceDetails = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const service = servicesData.find(s => s.id === serviceId);

  if (!service) return <div>عذراً، هذه الخدمة غير متوفرة حالياً.</div>;

  return (
    <div style={{ padding: '40px', direction: 'rtl', maxWidth: '800px', margin: 'auto' }}>
      <button onClick={() => navigate(-1)}>العودة</button>
      <h1>{service.title}</h1>
      <img src={service.image} alt={service.title} style={{ width: '100%', borderRadius: '20px' }} />
      <p>{service.description}</p>
      <h3>طرق العلاج:</h3>
      <p>{service.treatment}</p>
      <button onClick={() => navigate('/booking')}>احجز موعد الآن</button>
    </div>
  );
};

export default ServiceDetails;