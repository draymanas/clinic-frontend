// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

// تهيئة فايربيز باستخدام بيانات مشروعك الدقيقة من google-services.json
firebase.initializeApp({
  apiKey: "AIzaSyDDrfz6CEAwTqc4Z-oaFI6jLfpKeBAaxUw",
  authDomain: "neuroclinic-app.firebaseapp.com",
  projectId: "neuroclinic-app",
  storageBucket: "neuroclinic-app.firebasestorage.app",
  messagingSenderId: "106196475769",
  appId: "1:106196475769:android:70a8b4c2485b12035719a8"
});

const messaging = firebase.messaging();

// 1. استقبال الإشعار في الخلفية
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] تم استلام إشعار بالخلفية:', payload);

  const title = payload.notification?.title || payload.data?.title || 'إشعار من منصة دكتور';
  const body = payload.notification?.body || payload.data?.body || '';

  // رابط الفتح الذي يحمل تفاصيل الإشعار بالكامل
  const openUrl = `https://www.doctoreg.online/?notif_title=${encodeURIComponent(title)}&notif_body=${encodeURIComponent(body)}`;

  const notificationOptions = {
    body: body,
    icon: '/logo512.png',
    badge: '/logo512.png',
    data: {
      url: openUrl,
      title: title,
      body: body
    }
  };

  self.registration.showNotification(title, notificationOptions);
});

// 🌟 2. السحر كله هنا: عند النقر على الإشعار من شريط التنبيهات
self.addEventListener('notificationclick', function(event) {
  event.notification.close(); // إغلاق الإشعار فوراً من شريط التنبيهات

  const targetUrl = event.notification.data?.url || 'https://www.doctoreg.online/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      // إذا كان الموقع مفتوحاً بالفعل، قم بتوجيهه وتنشيط النافذة
      for (let i = 0; i < clientList.length; i++) {
        let client = clientList[i];
        if (client.url.includes('doctoreg.online') && 'focus' in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      // إذا كان الموقع مغلقاً، افتح نافذة جديدة مباشرة بالرابط
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});