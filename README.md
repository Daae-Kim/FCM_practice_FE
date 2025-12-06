# FCM 푸시 알림 프론트엔드

Firebase Cloud Messaging(FCM)을 사용한 웹 푸시 알림 데모 애플리케이션입니다.

## 기능

- 알림 권한 요청
- FCM 토큰 생성 및 관리
- 포그라운드/백그라운드 푸시 알림 수신
- 수신된 알림 히스토리 표시

## 설치 및 설정

### 1. 의존성 설치

```bash
npm install
```

### 2. Firebase 프로젝트 설정

1. [Firebase Console](https://console.firebase.google.com/)에서 새 프로젝트 생성
2. 프로젝트 설정 > 일반 > 웹 앱 추가
3. Firebase 설정 값 복사

### 3. Firebase 설정 파일 생성

```bash
# 예시 파일 복사
cp src/firebase-config.example.js src/firebase-config.js
```

`src/firebase-config.js` 파일을 열고 실제 Firebase 프로젝트 값을 입력:

```javascript
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

export const vapidKey = "YOUR_VAPID_KEY";
```

### 4. VAPID 키 생성

1. Firebase Console > 프로젝트 설정 > Cloud Messaging 탭
2. "웹 푸시 인증서" 섹션에서 "키 쌍 생성" 클릭
3. 생성된 키를 복사하여 `src/firebase-config.js`의 `vapidKey`에 입력

### 5. Service Worker 설정 업데이트

`public/firebase-messaging-sw.js` 파일을 열고 Firebase 설정 값을 동일하게 입력:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

## 사용 방법

### 프론트엔드에서:

1. "알림 권한 요청 및 토큰 받기" 버튼 클릭
2. 브라우저 알림 권한 허용
3. 생성된 FCM 토큰 복사

### Postman에서 알림 전송:

#### 방법 1: FCM HTTP v1 API 사용 (권장)

```
POST https://fcm.googleapis.com/v1/projects/YOUR_PROJECT_ID/messages:send
```

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Body:**
```json
{
  "message": {
    "token": "복사한_FCM_토큰",
    "notification": {
      "title": "테스트 알림",
      "body": "FCM 푸시 알림 테스트입니다!"
    },
    "webpush": {
      "fcm_options": {
        "link": "https://your-app-url.com"
      }
    }
  }
}
```

#### 방법 2: Legacy FCM API 사용

```
POST https://fcm.googleapis.com/fcm/send
```

**Headers:**
```
Content-Type: application/json
Authorization: key=YOUR_SERVER_KEY
```

**Body:**
```json
{
  "to": "복사한_FCM_토큰",
  "notification": {
    "title": "테스트 알림",
    "body": "FCM 푸시 알림 테스트입니다!",
    "icon": "/firebase-logo.png"
  },
  "data": {
    "url": "https://your-app-url.com",
    "custom_key": "custom_value"
  }
}
```

## 프로젝트 구조

```
FCM_practice_FE/
├── public/
│   └── firebase-messaging-sw.js  # Service Worker (백그라운드 알림)
├── src/
│   ├── firebase-config.js        # Firebase 설정 (git에서 제외)
│   ├── firebase-config.example.js # Firebase 설정 예시
│   ├── fcm.js                    # FCM 유틸리티 함수
│   └── main.js                   # 메인 앱 로직
├── index.html                    # HTML 진입점
├── vite.config.js                # Vite 설정
└── package.json
```

## 주요 파일 설명

### `src/fcm.js`
- `requestNotificationPermission()`: 알림 권한 요청 및 FCM 토큰 생성
- `onMessageListener()`: 포그라운드 메시지 수신 리스너
- `sendTokenToServer()`: FCM 토큰을 백엔드 서버에 전송

### `public/firebase-messaging-sw.js`
- 백그라운드에서 푸시 알림 수신
- 알림 클릭 이벤트 처리

### `src/main.js`
- UI 초기화 및 이벤트 처리
- 알림 히스토리 관리

## 문제 해결

### 알림이 수신되지 않는 경우

1. **브라우저 권한 확인**: 브라우저 설정에서 알림 권한이 허용되어 있는지 확인
2. **FCM 토큰 확인**: 토큰이 정상적으로 생성되었는지 확인
3. **Firebase 설정 확인**: `firebase-config.js`와 `firebase-messaging-sw.js`의 설정이 동일한지 확인
4. **HTTPS 사용**: 로컬 개발 환경(localhost)이나 HTTPS를 사용하는지 확인
5. **Service Worker 등록 확인**: 개발자 도구 > Application > Service Workers에서 등록 확인

### VAPID 키 오류

- Firebase Console에서 웹 푸시 인증서를 생성했는지 확인
- `vapidKey` 값이 올바르게 설정되어 있는지 확인

## 브라우저 호환성

- Chrome/Edge: 완벽 지원
- Firefox: 완벽 지원
- Safari: macOS 13+, iOS 16.4+ 지원 (제한적)

## 참고 자료

- [Firebase Cloud Messaging 문서](https://firebase.google.com/docs/cloud-messaging/js/client)
- [Web Push Notifications 가이드](https://web.dev/push-notifications-overview/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
