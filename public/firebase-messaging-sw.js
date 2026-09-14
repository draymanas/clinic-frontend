// public/firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

// ==========================================
// 🔥 تهيئة Firebase
// ==========================================
firebase.initializeApp({
  apiKey: "AIzaSyDDrfz6CEAwTqc4Z-oaFI6jLfpKeBAaxUw",
  authDomain: "neuroclinic-app.firebaseapp.com",
  projectId: "neuroclinic-app",
  storageBucket: "neuroclinic-app.firebasestorage.app",
  messagingSenderId: "106196475769",
  appId: "1:106196475769:android:70a8b4c2485b12035719a8"
});

const messaging = firebase.messaging();


// ==========================================
// 🔔 1. استقبال إشعار Firebase في الخلفية
// ==========================================
messaging.onBackgroundMessage((payload) => {

  console.log(
    '[firebase-messaging-sw.js] تم استلام إشعار بالخلفية:',
    payload
  );

  // ------------------------------------------
  // استخراج العنوان والمحتوى
  // نعطي الأولوية لبيانات data الجديدة
  // ------------------------------------------
  const title =
    payload.data?.notif_title ||
    payload.notification?.title ||
    'إشعار من منصة دكتور';

  const body =
    payload.data?.notif_body ||
    payload.notification?.body ||
    '';

  // ------------------------------------------
  // 🔗 الرابط الذي سيتم فتحه عند الضغط
  // ------------------------------------------
  const openUrl =
    'https://www.doctoreg.online/notification' +
    '?notif_title=' + encodeURIComponent(title) +
    '&notif_body=' + encodeURIComponent(body);


  // ==========================================
  // إعداد شكل الإشعار
  // ==========================================
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


  // ==========================================
  // 📢 إظهار الإشعار في شريط التنبيهات
  // ==========================================
  return self.registration.showNotification(
    title,
    notificationOptions
  );
});


// ==========================================
// 🖱️ 2. عند الضغط على الإشعار
// ==========================================
self.addEventListener('notificationclick', function(event) {

  console.log(
    '[firebase-messaging-sw.js] تم الضغط على الإشعار'
  );

  // إغلاق الإشعار من شريط التنبيهات
  event.notification.close();


  // ------------------------------------------
  // الحصول على الرابط المخزن داخل الإشعار
  // ------------------------------------------
  const targetUrl =
    event.notification.data?.url ||
    'https://www.doctoreg.online/';


  console.log(
    '[firebase-messaging-sw.js] سيتم فتح:',
    targetUrl
  );


  // ==========================================
  // محاولة استخدام نافذة الموقع المفتوحة بالفعل
  // ==========================================
  event.waitUntil(

    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    })

    .then(function(clientList) {

      // ----------------------------------------
      // إذا كان الموقع مفتوحًا بالفعل
      // ----------------------------------------
      for (let i = 0; i < clientList.length; i++) {

        const client = clientList[i];

        if (
          client.url.includes('doctoreg.online') &&
          'focus' in client
        ) {

          return client.navigate(targetUrl)
            .then(function() {
              return client.focus();
            });

        }
      }


      // ----------------------------------------
      // إذا لم يكن الموقع مفتوحًا
      // افتح صفحة الإشعار مباشرة
      // ----------------------------------------
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }

    })

  );
});