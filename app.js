const services = [
  { name: "주민등록표 등본(초본) 발급", agency: "행정안전부", category: "주민등록", online: "가능", deadline: "즉시", fee: "온라인 무료" },
  { name: "주민등록증 신규 발급 신청", agency: "행정안전부", category: "주민등록", online: "일부 가능", deadline: "20일", fee: "무료" },
  { name: "주민등록증 재발급 신청", agency: "행정안전부", category: "주민등록", online: "가능", deadline: "20일", fee: "5,000원" },
  { name: "전입신고", agency: "행정안전부", category: "주민등록", online: "가능", deadline: "즉시", fee: "무료" },
  { name: "여권 발급 신청", agency: "외교부", category: "여권·출입국", online: "일부 가능", deadline: "통상 8일", fee: "종류별 상이" },
  { name: "여권 재발급 신청", agency: "외교부", category: "여권·출입국", online: "가능", deadline: "통상 8일", fee: "종류별 상이" },
  { name: "출입국에 관한 사실증명", agency: "법무부", category: "여권·출입국", online: "가능", deadline: "즉시", fee: "온라인 무료" },
  { name: "가족관계증명서 발급", agency: "대법원", category: "가족관계", online: "가능", deadline: "즉시", fee: "온라인 무료" },
  { name: "혼인신고", agency: "대법원", category: "가족관계", online: "불가", deadline: "7일", fee: "무료" },
  { name: "출생신고", agency: "대법원", category: "가족관계", online: "일부 가능", deadline: "즉시", fee: "무료" },
  { name: "지방세 납세증명서 발급", agency: "행정안전부", category: "세금", online: "가능", deadline: "즉시", fee: "무료" },
  { name: "소득금액증명 발급", agency: "국세청", category: "세금", online: "가능", deadline: "즉시", fee: "무료" },
  { name: "사업자등록 신청", agency: "국세청", category: "세금", online: "가능", deadline: "2일", fee: "무료" },
  { name: "건축물대장 등·초본 발급", agency: "국토교통부", category: "부동산", online: "가능", deadline: "즉시", fee: "온라인 무료" },
  { name: "토지(임야)대장 등본 발급", agency: "국토교통부", category: "부동산", online: "가능", deadline: "즉시", fee: "온라인 300원" },
  { name: "지적도(임야도) 등본 발급", agency: "국토교통부", category: "부동산", online: "가능", deadline: "즉시", fee: "온라인 무료" },
  { name: "자동차등록원부 발급", agency: "국토교통부", category: "자동차", online: "가능", deadline: "즉시", fee: "온라인 무료" },
  { name: "운전경력증명서 발급", agency: "경찰청", category: "자동차", online: "가능", deadline: "즉시", fee: "무료" },
  { name: "자동차 이전등록 신청", agency: "국토교통부", category: "자동차", online: "일부 가능", deadline: "즉시", fee: "지역별 상이" },
  { name: "건강보험 자격득실확인서 발급", agency: "국민건강보험공단", category: "복지·보건", online: "가능", deadline: "즉시", fee: "무료" },
  { name: "장애인 등록 신청", agency: "보건복지부", category: "복지·보건", online: "불가", deadline: "30일", fee: "무료" },
  { name: "기초연금 지급 신청", agency: "보건복지부", category: "복지·보건", online: "가능", deadline: "30일", fee: "무료" }
];

const list = document.querySelector("#serviceList");
const searchInput = document.querySelector("#searchInput");
const categoryFilter = document.querySelector("#categoryFilter");
const resultCount = document.querySelector("#resultCount");
const activeFilter = document.querySelector("#activeFilter");
const clearSearch = document.querySelector("#clearSearch");
const resetButton = document.querySelector("#resetButton");
const emptyState = document.querySelector("#emptyState");
const emptyReset = document.querySelector("#emptyReset");

const categories = [...new Set(services.map(({ category }) => category))];
categories.forEach(category => {
  const option = document.createElement("option");
  option.value = category;
  option.textContent = category;
  categoryFilter.append(option);
});

function onlineClass(status) {
  if (status === "가능") return "online-yes";
  if (status === "일부 가능") return "online-some";
  return "online-no";
}

function render() {
  const keyword = searchInput.value.trim().toLocaleLowerCase("ko-KR");
  const category = categoryFilter.value;

  const filtered = services.filter(service => {
    const matchesKeyword = service.name.toLocaleLowerCase("ko-KR").includes(keyword);
    const matchesCategory = category === "all" || service.category === category;
    return matchesKeyword && matchesCategory;
  });

  list.replaceChildren(...filtered.map(service => {
    const row = document.createElement("article");
    row.className = "service-row";
    row.innerHTML = `
      <span class="service-name">${service.name}</span>
      <span class="service-agency">${service.agency}</span>
      <span data-label="민원분야"><span class="tag category-tag">${service.category}</span></span>
      <span data-label="온라인 처리"><span class="tag ${onlineClass(service.online)}">${service.online}</span></span>
      <span class="service-deadline" data-label="처리기한">${service.deadline}</span>
      <span class="service-fee" data-label="수수료">${service.fee}</span>
    `;
    return row;
  }));

  resultCount.textContent = filtered.length;
  clearSearch.hidden = keyword.length === 0;
  emptyState.hidden = filtered.length !== 0;
  list.hidden = filtered.length === 0;

  const conditions = [];
  if (keyword) conditions.push(`‘${searchInput.value.trim()}’ 검색`);
  if (category !== "all") conditions.push(`${category} 분야`);
  activeFilter.textContent = conditions.length
    ? `${conditions.join(" · ")} 결과입니다.`
    : "전체 목록을 표시하고 있습니다.";
}

function resetFilters() {
  searchInput.value = "";
  categoryFilter.value = "all";
  render();
  searchInput.focus();
}

searchInput.addEventListener("input", render);
categoryFilter.addEventListener("change", render);
clearSearch.addEventListener("click", () => {
  searchInput.value = "";
  render();
  searchInput.focus();
});
resetButton.addEventListener("click", resetFilters);
emptyReset.addEventListener("click", resetFilters);

render();
