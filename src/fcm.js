import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { firebaseConfig, vapidKey } from './firebase-config.js';

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

/**
 * FCM 토큰 요청 및 권한 확인
 * @returns {Promise<string|null>} FCM 토큰 또는 null
 */
export async function requestNotificationPermission() {
  try {
    // 알림 권한 요청
    const permission = await Notification.requestPermission();

    if (permission === 'granted') {
      console.log('알림 권한이 허용되었습니다.');

      // Service Worker 등록
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      console.log('Service Worker 등록 완료:', registration);

      // FCM 토큰 가져오기
      const token = await getToken(messaging, {
        vapidKey: vapidKey,
        serviceWorkerRegistration: registration
      });

      if (token) {
        console.log('FCM 토큰:', token);
        return token;
      } else {
        console.log('토큰을 가져올 수 없습니다.');
        return null;
      }
    } else if (permission === 'denied') {
      console.warn('알림 권한이 거부되었습니다.');
      return null;
    } else {
      console.log('알림 권한이 기본 상태입니다.');
      return null;
    }
  } catch (error) {
    console.error('알림 권한 요청 중 오류 발생:', error);
    return null;
  }
}

/**
 * 포그라운드 메시지 수신 리스너 설정
 * @param {Function} callback 메시지 수신 시 실행할 콜백 함수
 */
export function onMessageListener(callback) {
  onMessage(messaging, (payload) => {
    console.log('포그라운드 메시지 수신:', payload);

    // 브라우저 알림 표시
    if (Notification.permission === 'granted') {
      const notificationTitle = payload.notification?.title || '새 알림';
      const notificationOptions = {
        body: payload.notification?.body || '새로운 메시지가 도착했습니다.',
        icon: payload.notification?.icon || '/firebase-logo.png',
        data: payload.data || {}
      };

      new Notification(notificationTitle, notificationOptions);
    }

    // 콜백 함수 실행
    if (callback && typeof callback === 'function') {
      callback(payload);
    }
  });
}

/**
 * FCM 토큰을 서버에 전송
 * @param {string} token FCM 토큰
 * @param {string} userId 사용자 ID
 * @param {string} serverUrl 서버 API URL
 */
export async function sendTokenToServer(token, userId, serverUrl) {
  try {
    const response = await fetch(serverUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        token: token
      })
    });

    if (response.ok) {
      console.log('토큰이 서버에 전송되었습니다.');
      return true;
    } else {
      console.error('토큰 전송 실패:', response.status);
      return false;
    }
  } catch (error) {
    console.error('토큰 전송 중 오류 발생:', error);
    return false;
  }
}
