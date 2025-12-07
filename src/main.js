import { requestNotificationPermission, onMessageListener, sendTokenToServer } from "./fcm.js";

let currentToken = null;
const notifications = [];

// DOM 요소
const requestPermissionBtn = document.getElementById("requestPermissionBtn");
const permissionStatus = document.getElementById("permissionStatus");
const tokenDisplay = document.getElementById("tokenDisplay");
const copyTokenBtn = document.getElementById("copyTokenBtn");
const notificationList = document.getElementById("notificationList");

// 상태 메시지 표시
function showStatus(message, type = "info") {
  permissionStatus.innerHTML = `<div class="status ${type}">${message}</div>`;
}

// 토큰 표시
function displayToken(token) {
  currentToken = token;
  tokenDisplay.textContent = token;
  tokenDisplay.classList.remove("empty");
  copyTokenBtn.style.display = "block";
}

// 알림 목록에 추가
function addNotificationToList(payload) {
  const notification = {
    title: payload.notification?.title || "제목 없음",
    body: payload.notification?.body || "내용 없음",
    time: new Date().toLocaleString("ko-KR"),
  };

  notifications.unshift(notification);

  renderNotifications();
}

// 알림 목록 렌더링
function renderNotifications() {
  if (notifications.length === 0) {
    notificationList.innerHTML = `
      <div style="text-align: center; color: #999; padding: 20px;">
        아직 수신된 알림이 없습니다.
      </div>
    `;
    return;
  }

  notificationList.innerHTML = notifications
    .map(
      (notif) => `
    <div class="notification-item">
      <div class="notification-title">${notif.title}</div>
      <div class="notification-body">${notif.body}</div>
      <div class="notification-time">${notif.time}</div>
    </div>
  `
    )
    .join("");
}

// 알림 권한 요청 버튼 클릭
requestPermissionBtn.addEventListener("click", async () => {
  requestPermissionBtn.disabled = true;
  showStatus("알림 권한을 요청하는 중...", "info");

  try {
    const token = await requestNotificationPermission();

    if (token) {
      displayToken(token);
      showStatus("✅ 알림 권한이 허용되었고 FCM 토큰을 받았습니다!", "success");

      // 백엔드로 토큰 전송
      const userId = "user123"; // 실제로는 로그인한 사용자 ID 사용
      const serverUrl = "http://localhost:8080/api/fcm/register";

      showStatus("🔄 서버에 토큰을 등록하는 중...", "info");
      const sent = await sendTokenToServer(token, userId, serverUrl);

      if (sent) {
        showStatus("✅ 토큰이 서버에 등록되었습니다!", "success");
      } else {
        showStatus("⚠️ 토큰은 받았지만 서버 등록에 실패했습니다.", "error");
      }

      // 포그라운드 메시지 리스너 설정
      onMessageListener((payload) => {
        addNotificationToList(payload);
      });
    } else {
      showStatus(
        "❌ 알림 권한이 거부되었거나 토큰을 가져올 수 없습니다.",
        "error"
      );
    }
  } catch (error) {
    console.error("Error:", error);
    showStatus("❌ 오류가 발생했습니다: " + error.message, "error");
  } finally {
    requestPermissionBtn.disabled = false;
  }
});

// 토큰 복사 버튼 클릭
copyTokenBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(currentToken);
    const originalText = copyTokenBtn.textContent;
    copyTokenBtn.textContent = "✅ 복사 완료!";
    setTimeout(() => {
      copyTokenBtn.textContent = originalText;
    }, 2000);
  } catch (error) {
    console.error("복사 실패:", error);
    alert("토큰 복사에 실패했습니다. 수동으로 복사해주세요.");
  }
});

// 페이지 로드 시 초기화
document.addEventListener("DOMContentLoaded", () => {
  // Service Worker 지원 확인
  if (!("serviceWorker" in navigator)) {
    showStatus("❌ 이 브라우저는 Service Worker를 지원하지 않습니다.", "error");
    requestPermissionBtn.disabled = true;
    return;
  }

  // 알림 API 지원 확인
  if (!("Notification" in window)) {
    showStatus("❌ 이 브라우저는 알림을 지원하지 않습니다.", "error");
    requestPermissionBtn.disabled = true;
    return;
  }

  // 현재 권한 상태 확인
  if (Notification.permission === "granted") {
    showStatus(
      "ℹ️ 알림 권한이 이미 허용되어 있습니다. 버튼을 클릭하여 토큰을 받으세요.",
      "info"
    );
  } else if (Notification.permission === "denied") {
    showStatus(
      "❌ 알림 권한이 거부되었습니다. 브라우저 설정에서 권한을 변경해주세요.",
      "error"
    );
  } else {
    showStatus("ℹ️ 버튼을 클릭하여 알림 권한을 요청하세요.", "info");
  }

  console.log("FCM 푸시 알림 앱이 준비되었습니다.");
});

