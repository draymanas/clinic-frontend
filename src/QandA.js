import React, { useEffect, useState } from 'react';

const QandA = () => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    document.title = "استشارات مجانية | دكتور أيمن عجيب";
    // جلب الأسئلة التي تم الرد عليها من السيرفر الخاص بك
   // تم تعديل الرابط ليتصل بالسيرفر المرفوع على Render
    fetch('https://clinic-api-ig3d.onrender.com/api/consultations/answered')
      .then(res => res.json())
      .then(data => setQuestions(data))
      .catch(err => console.error("Error fetching Q&A:", err));
  }, []);

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', direction: 'rtl', fontFamily: 'Arial' }}>
      <h1 style={{ textAlign: 'center', color: '#1a73e8' }}>استشارات مجانية </h1>
      
      {questions.map(q => (
        <div key={q.id} style={{ border: '1px solid #ddd', padding: '20px', marginBottom: '20px', borderRadius: '15px', background: '#fff' }}>
          {/* اسم المريض */}
          <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>
            {q.name}:
          </p>
          {/* السؤال */}
          <p style={{ fontSize: '16px', color: '#555' }}>{q.question}</p>
          
          {/* رد الدكتور */}
          <div style={{ background: '#e8f5e9', padding: '15px', borderRadius: '10px', marginTop: '15px', borderRight: '5px solid #2e7d32' }}>
            <p style={{ color: '#2e7d32', fontWeight: 'bold', margin: '0 0 5px 0' }}>رد الدكتور أيمن عجيب:</p>
            <p style={{ margin: 0 }}>{q.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QandA;