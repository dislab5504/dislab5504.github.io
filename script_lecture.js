// 무한 슬라이드를 위한 JS 로직
const track = document.querySelector('.slider-track');
const slides = Array.from(track.children);
const prevButton = document.querySelector('.prev');
const nextButton = document.querySelector('.next');

// 카드 하나의 폭 + 마진 계산
// (위 CSS에서 .slide { width: 250px; margin: 0 10px; } 이므로 총 270px)
let slideWidth = slides[0].getBoundingClientRect().width + 20;

// 현재 보여줄 슬라이드 인덱스
let currentIndex = 0;

/* 
   1) 무한 루프를 위해 맨 앞/맨 뒤 슬라이드를 복제하여 
      트랙의 양 끝에 붙여둔다.
*/
const firstClone = slides[0].cloneNode(true);
const lastClone = slides[slides.length - 1].cloneNode(true);

// 트랙 끝에 '첫 슬라이드 복제본' 추가
track.appendChild(firstClone);
// 트랙 맨 앞에 '마지막 슬라이드 복제본' 추가
track.insertBefore(lastClone, slides[0]);

// 복제 후, 트랙의 모든 자식(슬라이드) 목록 재획득
const updatedSlides = Array.from(track.children);

// 실제 첫 슬라이드를 보기 위해
// 인덱스를 1로 시작 (0번은 lastClone)
currentIndex = 1;
track.style.transform = `translateX(${-slideWidth * currentIndex}px)`;

// 초기에 active 갱신
updateActiveSlide();

// '다음' 버튼 클릭 시
nextButton.addEventListener('click', () => {
  if (currentIndex >= updatedSlides.length - 1) return;
  currentIndex++;
  track.style.transition = 'transform 0.4s ease-in-out';
  track.style.transform = `translateX(${-slideWidth * currentIndex}px)`;

  updateActiveSlide();
});

// '이전' 버튼 클릭 시
prevButton.addEventListener('click', () => {
  if (currentIndex <= 0) return;
  currentIndex--;
  track.style.transition = 'transform 0.4s ease-in-out';
  track.style.transform = `translateX(${-slideWidth * currentIndex}px)`;

  updateActiveSlide();
});

// 트랜지션이 끝난 뒤, 복제 슬라이드 위치에 도달하면 점프(순환)
track.addEventListener('transitionend', () => {
  // 맨 뒤의 firstClone 위치
  if (updatedSlides[currentIndex] === firstClone) {
    currentIndex = 1; // 실제 첫 슬라이드 위치
    track.style.transition = 'none';
    track.style.transform = `translateX(${-slideWidth * currentIndex}px)`;
    updateActiveSlide();
  }
  // 맨 앞의 lastClone 위치
  if (updatedSlides[currentIndex] === lastClone) {
    currentIndex = slides.length; // 실제 마지막 슬라이드 위치
    track.style.transition = 'none';
    track.style.transform = `translateX(${-slideWidth * currentIndex}px)`;
    updateActiveSlide();
  }
});

/* 
  중앙 슬라이드(active) 표시:
  1) 모든 슬라이드에서 active 제거
  2) currentIndex 위치 슬라이드에 active 부여
*/
function updateActiveSlide() {
  updatedSlides.forEach(slide => slide.classList.remove('active'));
  updatedSlides[currentIndex].classList.add('active');
}
