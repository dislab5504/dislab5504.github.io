// 무한 슬라이드를 위한 JS 로직

const track = document.querySelector('.slider-track');
const slides = Array.from(track.children);
const prevButton = document.querySelector('.prev');
const nextButton = document.querySelector('.next');

// 슬라이드 1장의 실제 너비 + 슬라이드 간 마진을 고려하여 계산
// (위 CSS에서 .slide의 width=600px, margin 좌우 10px, 즉 총 620px 정도)
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

// '다음' 버튼 클릭 시
nextButton.addEventListener('click', () => {
  // 최댓값보다 커지면 안 되므로 (updatedSlides.length - 1)까지만
  if (currentIndex >= updatedSlides.length - 1) return;
  currentIndex++;
  track.style.transition = 'transform 0.4s ease-in-out';
  track.style.transform = `translateX(${-slideWidth * currentIndex}px)`;
});

// '이전' 버튼 클릭 시
prevButton.addEventListener('click', () => {
  if (currentIndex <= 0) return;
  currentIndex--;
  track.style.transition = 'transform 0.4s ease-in-out';
  track.style.transform = `translateX(${-slideWidth * currentIndex}px)`;
});

// 트랜지션이 끝난 뒤, 복제 슬라이드 위치에 도달하면 점프(순환)
track.addEventListener('transitionend', () => {
  // 맨 뒤의 firstClone 위치로 갔을 때 → 실제 첫 번째 슬라이드로 점프
  if (updatedSlides[currentIndex] === firstClone) {
    currentIndex = 1;
    track.style.transition = 'none'; // 점프 시에는 애니메이션 제거
    track.style.transform = `translateX(${-slideWidth * currentIndex}px)`;
  }
  // 맨 앞의 lastClone 위치로 갔을 때 → 실제 마지막 슬라이드로 점프
  if (updatedSlides[currentIndex] === lastClone) {
    currentIndex = slides.length; // (원본 slides의 마지막 인덱스 = slides.length - 1)
    track.style.transition = 'none';
    track.style.transform = `translateX(${-slideWidth * currentIndex}px)`;
  }
});
