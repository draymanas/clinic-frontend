// src/NotificationPage.js
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

function NotificationPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [notificationData, setNotificationData] = useState({
    title: 'إشعار من منصة دكتور',
    body: 'لا توجد تفاصيل لهذا الإشعار.',
    address: ''
  });

  useEffect(() => {
    const urlTitle = searchParams.get('notif_title');
    const urlBody = searchParams.get('notif_body');
    const urlAddress = searchParams.get('address');

    if (urlTitle || urlBody) {
      const data = {
        title: urlTitle || 'إشعار من منصة دكتور',
        body: urlBody || 'لا توجد تفاصيل لهذا الإشعار.',
        address: urlAddress || ''
      };
      sessionStorage.setItem('last_notification', JSON.stringify(data));
      setNotificationData(data);
    } else {
      // في حالة إعادة تحميل الصفحة (Refresh)
      const savedData = sessionStorage.getItem('last_notification');
      if (savedData) {
        setNotificationData(JSON.parse(savedData));
      }
    }
  }, [searchParams]);

  return (
    <div
      dir="rtl"
      style={{
        minHeight: '100vh',
        background: '#f1f5f9',
        padding: '30px 15px',
        boxSizing: 'border-box',
        fontFamily: 'Cairo, sans-serif'
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
          {/* أيقونة الجرس */}
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
              margin: '0 0 16px 0',
              color: '#0f172a',
              fontSize: '24px',
              lineHeight: '1.5',
              fontWeight: '800'
            }}
          >
            {notificationData.title}
          </h1>

          {/* نص الإشعار */}
          <div
            style={{
              color: '#334155',
              fontSize: '17px',
              lineHeight: '1.9',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              marginBottom: '20px'
            }}
          >
            {notificationData.body}
          </div>

          {/* 📍 صندوق عنوان العيادة بالتفصيل (يظهر إذا توفر العنوان) */}
          {notificationData.address && (
            <div
              style={{
                background: '#f8fafc',
                border: '1.5px solid #e2e8f0',
                borderRight: '5px solid #0284c7',
                borderRadius: '14px',
                padding: '16px 20px',
                marginTop: '20px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#0f172a',
                  fontWeight: '800',
                  fontSize: '16px',
                  marginBottom: '8px'
                }}
              >
                <span style={{ fontSize: '20px' }}>📍</span>
                <span>عنوان ومقر العيادة بالتفصيل:</span>
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: '15.5px',
                  color: '#334155',
                  lineHeight: '1.7',
                  fontWeight: '600'
                }}
              >
                {notificationData.address}
              </p>
            </div>
          )}

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
              textAlign: 'center',
              fontWeight: '600'
            }}
          >
            🔵 منصة دكتور | DoctorEG
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotificationPage;