// Firebase Cloud Messaging Service Worker
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Firebase 설정 (firebase-config.js와 동일한 값 사용)
const firebaseConfig = {
  apiKey: "AIzaSyBG1feNIjSW4sz4ib8eHZfrXWv4CZS9Xvk",
  authDomain: "fcmtest-aeb69.firebaseapp.com",
  projectId: "fcmtest-aeb69",
  storageBucket: "fcmtest-aeb69.firebasestorage.app",
  messagingSenderId: "194844519048",
  appId: "1:194844519048:web:06d7aa343626df54be4d3d",
  measurementId: "G-MXX7Y596ML"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// 백그라운드 메시지 수신 처리
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload.notification?.title || '새 알림';
  const notificationOptions = {
    body: payload.notification?.body || '새로운 메시지가 도착했습니다.',
    icon: payload.notification?.icon || '/firebase-logo.png',
    badge: '/badge-icon.png',
    data: payload.data || {},
    tag: 'fcm-notification',
    requireInteraction: false
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// 알림 클릭 이벤트 처리
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification click received.');

  event.notification.close();

  // 알림 클릭 시 웹앱 열기
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || '/')
  );
});
