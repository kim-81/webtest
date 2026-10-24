// 개인 이력서 웹사이트의 작은 인터랙션을 담당합니다.

const menuToggle = document.querySelector('#menuToggle');
const navLinks = document.querySelector('#navLinks');
const scrollProgress = document.querySelector('#scrollProgress');
const currentYear = document.querySelector('#currentYear');
const copyEmailButton = document.querySelector('#copyEmail');
const emailText = document.querySelector('#emailText');
const toast = document.querySelector('#toast');

// 푸터에 현재 연도를 표시합니다.
if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

// 모바일 메뉴 열기/닫기
if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', '메뉴 열기');
    });
  });
}

// 페이지 상단의 진행 표시줄
function updateScrollProgress() {
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
  if (scrollProgress) {
    scrollProgress.style.width = `${Math.min(progress, 100)}%`;
  }
}
window.addEventListener('scroll', updateScrollProgress, { passive: true });
updateScrollProgress();

// 섹션이 화면에 들어오면 부드럽게 나타납니다.
const revealElements = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('is-visible'));
}

// 이메일 주소 복사 버튼
let toastTimer;
if (copyEmailButton && emailText && toast) {
  copyEmailButton.addEventListener('click', async () => {
    const email = emailText.textContent.trim();

    try {
      await navigator.clipboard.writeText(email);
      showToast('이메일 주소를 복사했습니다.');
    } catch (error) {
      // 로컬 파일 등에서 클립보드 접근이 제한되면 선택할 수 있도록 안내합니다.
      const range = document.createRange();
      range.selectNodeContents(emailText);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      showToast('이메일 주소가 선택되었습니다. 복사해 주세요.');
    }
  });
}

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2600);
}
