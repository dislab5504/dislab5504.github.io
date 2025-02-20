document.addEventListener("DOMContentLoaded", function () {
  const categoryItems = document.querySelectorAll('.categoryBox ul li');
  const searchInput = document.querySelector('.searchInput');
  const paperCards = Array.from(document.querySelectorAll('.paper-card'));
  const paperCountEl = document.querySelector('.paper-count');
  const paginationContainer = document.querySelector('.pagination');

  let currentCategory = 'All Papers';
  let searchTerm = '';
  let currentPage = 1;
  const itemsPerPage = 8; // 한 페이지에 표시할 아이템 수

  // 카테고리 클릭 시 이벤트 처리
  categoryItems.forEach(item => {
    item.addEventListener("click", function () {
      categoryItems.forEach(li => li.classList.remove('current'));
      this.classList.add('current');
      currentCategory = this.getAttribute('data-category');
      currentPage = 1;
      filterAndPaginate();
    });
  });

  // 검색 입력 시 이벤트 처리 (실시간 필터링)
  searchInput.addEventListener('input', function () {
    searchTerm = this.value.trim().toLowerCase();
    currentPage = 1;
    filterAndPaginate();
  });

  // 필터와 페이징을 동시에 처리하는 함수
  function filterAndPaginate() {
    // 1. 필터링: 현재 선택된 카테고리와 검색어에 맞는 카드만 추출
    const filtered = paperCards.filter(card => {
      const cardCategory = card.getAttribute('data-category');
      // 카테고리 매치: "All Papers"인 경우 모두, 그렇지 않으면 일치하는 경우만
      let categoryMatch = (currentCategory === 'All Papers' || cardCategory === currentCategory);
      // 검색어 매치: 카드 내부 텍스트(소문자 처리)에 검색어가 포함되어 있는지
      let text = card.innerText.toLowerCase();
      let searchMatch = text.includes(searchTerm);
      return categoryMatch && searchMatch;
    });

    // 2. 결과 개수 업데이트
    paperCountEl.textContent = `Total: ${filtered.length} Papers`;

    // 3. 페이징 계산
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    if (currentPage > totalPages) currentPage = totalPages || 1; // totalPages가 0인 경우 대비

    // 4. 모든 카드를 숨기고, 현재 페이지에 해당하는 카드만 표시
    paperCards.forEach(card => card.style.display = 'none');
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    filtered.slice(startIndex, endIndex).forEach(card => {
      card.style.display = 'block';
    });

    // 5. 페이지네이션 버튼 렌더링
    renderPagination(totalPages);
  }

  // 페이지네이션 버튼을 동적으로 생성하는 함수
  function renderPagination(totalPages) {
    paginationContainer.innerHTML = ''; // 기존 버튼 제거

    // "첫 페이지" 버튼 생성
    const firstBtn = document.createElement('button');
    firstBtn.className = 'arrow';
    firstBtn.innerHTML = '<span class="material-symbols-outlined">first_page</span>';
    firstBtn.disabled = (currentPage === 1);
    firstBtn.addEventListener('click', function () {
      currentPage = 1;
      filterAndPaginate();
    });
    paginationContainer.appendChild(firstBtn);

    // "이전" 버튼 생성
    const prevBtn = document.createElement('button');
    prevBtn.className = 'arrow';
    prevBtn.style.marginRight = '15px';
    prevBtn.innerHTML = '<span class="material-symbols-outlined">chevron_left</span>';
    prevBtn.disabled = (currentPage === 1);
    prevBtn.addEventListener('click', function () {
      if (currentPage > 1) {
        currentPage--;
        filterAndPaginate();
      }
    });
    paginationContainer.appendChild(prevBtn);

    // 페이지 번호 버튼 생성
    for (let i = 1; i <= totalPages; i++) {
      const pageBtn = document.createElement('button');
      pageBtn.textContent = i;
      if (i === currentPage) {
        pageBtn.classList.add('current');
      }
      pageBtn.addEventListener('click', function () {
        currentPage = i;
        filterAndPaginate();
      });
      paginationContainer.appendChild(pageBtn);
    }

    // "다음" 버튼 생성
    const nextBtn = document.createElement('button');
    nextBtn.className = 'arrow';
    nextBtn.style.marginLeft = '15px';
    nextBtn.innerHTML = '<span class="material-symbols-outlined">chevron_right</span>';
    nextBtn.disabled = (currentPage === totalPages || totalPages === 0);
    nextBtn.addEventListener('click', function () {
      if (currentPage < totalPages) {
        currentPage++;
        filterAndPaginate();
      }
    });
    paginationContainer.appendChild(nextBtn);

    // "마지막 페이지" 버튼 생성
    const lastBtn = document.createElement('button');
    lastBtn.className = 'arrow';
    lastBtn.innerHTML = '<span class="material-symbols-outlined">last_page</span>';
    lastBtn.disabled = (currentPage === totalPages || totalPages === 0);
    lastBtn.addEventListener('click', function () {
      currentPage = totalPages;
      filterAndPaginate();
    });
    paginationContainer.appendChild(lastBtn);
  }

  // 페이지 로드 시 초기 실행
  filterAndPaginate();
});
