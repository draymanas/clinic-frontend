// src/firebase.js

import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

// ==========================================
// 🔥 إعدادات Firebase الخاصة بالويب
// ==========================================
const firebaseConfig = {
  apiKey: "AIzaSyDDrfz6CEAwTqc4Z-oaFI6jLfpKeBAaxUw",
  authDomain: "neuroclinic-app.firebaseapp.com",
  projectId: "neuroclinic-app",
  storageBucket: "neuroclinic-app.firebasestorage.app",
  messagingSenderId: "106196475769",
  appId: "1:106196475769:android:70a8b4c2485b12035719a8"
};

// ==========================================
// 🚀 تهيئة Firebase
// ==========================================
const app = initializeApp(firebaseConfig);

// ==========================================
// 🔔 Firebase Cloud Messaging
// ==========================================
const messaging = getMessaging(app);


// ==========================================
// 🛠️ تسجيل Service Worker الخاص بالإشعارات
// ==========================================
export async function registerFirebaseMessagingSW() {

  if (!('serviceWorker' in navigator)) {
    console.error('❌ هذا المتصفح لا يدعم Service Worker');
    return null;
  }

  try {

    const registration =
      await navigator.serviceWorker.register(
        '/firebase-messaging-sw.js'
      );

    console.log(
      '✅ تم تسجيل Firebase Messaging Service Worker بنجاح:',
      registration.scope
    );

    return registration;

  } catch (error) {

    console.error(
      '❌ فشل تسجيل Firebase Messaging Service Worker:',
      error
    );

    return null;
  }
}


// ==========================================
// 🔑 طلب إذن الإشعارات والحصول على Web FCM Token
// ==========================================
export async function requestForToken() {

  try {

    // تسجيل Service Worker أولًا
    const registration =
      await registerFirebaseMessagingSW();

    if (!registration) {
      console.error(
        '❌ لم يتم تسجيل Service Worker، لذلك لا يمكن الحصول على Token.'
      );
      return null;
    }


    // طلب إذن الإشعارات من المستخدم
    const permission =
      await Notification.requestPermission();

    if (permission !== 'granted') {

      console.log(
        '⚠️ لم يتم منح إذن الإشعارات.'
      );

      return null;
    }


    console.log(
      '✅ تم منح إذن الإشعارات.'
    );


    // ========================================
    // ⚠️ سنضع VAPID Key الحقيقي لاحقًا
    // ========================================
    const currentToken = await getToken(
      messaging,
      {
        vapidKey: 'BG4xgNsX3R5D7a_067O7QN4KmF6G_E6LtqrFDQs6efxZqaZXGlIXWxGOND48PECbbxbrSiu4frRynKtziSZhTGc',
        serviceWorkerRegistration: registration
      }
    );


  if (currentToken) {
  console.log(
    '✅ تم الحصول على Web FCM Token بنجاح'
  );

  // 🔔 حفظ التوكن محليًا لاستخدامه بعد تسجيل دخول الطبيب
  localStorage.setItem(
    'web_fcm_token',
    currentToken
  );

  console.log(
    '✅ تم حفظ Web FCM Token في localStorage'
  );

  return currentToken;
} else {

      console.log(
        '⚠️ لم يتم الحصول على Web FCM Token.'
      );

      return null;
    }

  } catch (error) {

    console.error(
      '❌ خطأ أثناء تهيئة إشعارات الويب:',
      error
    );

    return null;
  }
}


// ==========================================
// 📦 التصدير
// ==========================================
export {
  app,
  messaging
};