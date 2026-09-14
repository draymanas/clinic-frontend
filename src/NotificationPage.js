import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

function NotificationPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const title =
    searchParams.get('notif_title') || 'إشعار من منصة دكتور';

  const body =
    searchParams.get('notif_body') || 'لا توجد تفاصيل لهذا الإشعار.';

  return (
    <div
      dir="rtl"
      style={{
        minHeight: '100vh',
        background: '#f1f5f9',
        padding: '30px 15px',
        boxSizing: 'border-box'
      }}
    >

      <div
        style={{
          maxWidth: '700px',
          margin: '0 auto'
        }}
      >

        {/* زر العودة */}
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'none',
            border: 'none',
            color: '#0284c7',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginBottom: '20px',
            padding: '5px'
          }}
        >
          ← العودة إلى منصة دكتور
        </button>


        {/* كارت الإشعار */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '30px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
            border: '1px solid #e2e8f0'
          }}
        >

          {/* الأيقونة */}
          <div
            style={{
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              background: '#e0f2fe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '34px',
              marginBottom: '20px'
            }}
          >
            🔔
          </div>


          {/* عنوان الإشعار */}
          <h1
            style={{
              margin: '0 0 20px 0',
              color: '#0f172a',
              fontSize: '26px',
              lineHeight: '1.5',
              fontWeight: '800'
            }}
          >
            {title}
          </h1>


          {/* نص الإشعار */}
          <div
            style={{
              color: '#334155',
              fontSize: '18px',
              lineHeight: '2',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}
          >
            {body}
          </div>


          {/* خط فاصل */}
          <div
            style={{
              height: '1px',
              background: '#e2e8f0',
              margin: '30px 0 20px'
            }}
          />


          {/* اسم المنصة */}
          <div
            style={{
              color: '#64748b',
              fontSize: '14px',
              textAlign: 'center'
            }}
          >
            🔵 منصة دكتور
          </div>

        </div>

      </div>

    </div>
  );
}

export default NotificationPage;