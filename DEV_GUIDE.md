# 일광전구 리뉴얼 — 팀 개발 가이드 (DEV_GUIDE)

> 팀 코딩 협업용 **공유 문서**. 개발에 필요한 **확정 사항·규칙**만 기록한다.
> ⚠️ 아직 안 정해진 항목은 **`[TBD]`**(미정)로 표시 — 팀 합의 후 이 문서에 채운다.
> (디자인 결정 과정·중간 메모는 이 문서에 넣지 않는다.)

---

## 0. 이 문서 사용법
- 개발 관련 **모든 규칙·확정사항의 단일 기준**.
- `[TBD]` = 팀이 같이 정해야 할 빈칸. 정해지면 바로 채운다.
- 무언가 바뀌면 **코드보다 이 문서를 먼저** 업데이트한다.

---

## 1. 프로젝트 개요
- 일광전구 공식 웹사이트 **리뉴얼** — 제품 판매몰 → **브랜드 경험 중심 인터랙티브 웹사이트**.
- 콘셉트: **빛의 본질 · 공간 경험**. (원칙: "역사 연도 나열 금지")
- 구현: **React** 기반.

---

## 2. 페이지 구조

### 2-1. 메인 페이지 (`/`) — 섹션 순서 ✅ 확정
| # | 섹션 | 컴포넌트(예상) |
|---|------|---------------|
| 1 | Header | `Header` (글로벌) |
| 2 | Hero | `HeroSection` |
| 3 | Intro | `IntroSection` |
| 4 | Story | `StorySection` (브랜드 스토리텔링) |
| 5 | Snowman | `SnowmanSection` (제품 시퀀스) |
| 6 | Space | `SpaceSection` (공간 큐레이션) |
| 7 | Collabo | `CollaboSection` |
| 8 | Footer | `Footer` (글로벌) |

> 섹션명은 **팀 피그마 표기 기준**(`collabo`). 컴포넌트 = `CollaboSection`, 폴더/CSS = `collabo`.

### 2-2. 서브 페이지
`[TBD]` — 정해지는 대로 여기에 추가. (예: `/products`, `/about` 등)

---

## 3. 기술 스택 ✅ (확정)
- **프레임워크**: React
- **빌드툴**: **Vite**
- **언어**: **JavaScript** (TypeScript 아님)
- **스타일링**: **CSS Modules** (+ 디자인 토큰은 전역 CSS 변수)
- **패키지 매니저**: **npm** (⚠️ pnpm/yarn 섞지 말 것 — npm으로 통일)
- 스크롤 애니메이션: `[TBD]` (framer-motion / GSAP — 섹션 작업 시 결정)
- 캐러셀: `[TBD]` (Embla / Swiper — 제품 슬라이더 작업 시 결정)

### 프로젝트 받기 / 실행
```bash
# 처음 받을 때
git clone https://github.com/hiramram00-dotcom/ezen_teamproject_1.git
cd ezen_teamproject_1
npm install
npm run dev          # → http://localhost:5173

# 이미 받은 사람: 최신 받기
git pull origin main
npm install          # 새 패키지 생겼을 때만
```
> ⚠️ Node.js 필요. `npm install`은 각자 PC에서 (node_modules는 공유 안 됨).

---

## 4. 폴더 구조 ✅ (확정 · 레포에 반영됨)
```
ezen_teamproject_1/
├─ index.html
├─ public/                 # 정적 파일(favicon 등)
└─ src/
   ├─ main.jsx             # 진입점
   ├─ App.jsx              # 페이지 조립
   ├─ App.module.css
   ├─ index.css            # tokens·typography·global 불러오기
   ├─ sections/            # 섹션 (HeroSection, WorldviewBSection ...)
   ├─ components/          # 재사용 컴포넌트 (GlowText, Carousel ...)
   └─ styles/
      ├─ tokens.css        # ⭐ 디자인 토큰(색·레이아웃·폰트) — 단일 출처
      ├─ typography.css    # 타이포 21종 클래스 (.type-*)
      └─ global.css        # reset + base
```
> `hooks/` `utils/`는 필요해질 때 `src/` 아래에 추가.

---

## 5. 작업 분담
- **코딩 담당 인원은 확정.** 섹션은 **고정 배정 없이 그때그때 나눠** 진행.
- 규칙: **한 섹션 = 한 사람** (같은 파일 동시 수정 금지). 시작할 때 **단톡에 "나 OO 섹션 잡음"** 공유 → 중복 방지.
- 맡은 섹션은 `feature/섹션명` 브랜치에서 작업.

---

## 6. 디자인 토큰 ✅ (확정 · 코드 반영 완료)

> **단일 출처 = `src/styles/tokens.css`.** 팀 공식 디자인 시스템(Figma 변수)에서 추출한 정확값.
> ⚠️ 색·폰트·크기를 컴포넌트에 **하드코딩 금지** → 반드시 `var(--xxx)` 또는 `.type-*` 클래스 사용.

### 6-1. 컬러 (`tokens.css`)
| 변수 | 값 |
|------|-----|
| `--color-base-1` | `#FFFFFF` |
| `--color-base-2` | `#FFF7EA` (크림/서피스) |
| `--color-base-3` | `#000000` |
| `--color-accent-orange` | `#F49307` (포인트·점등) |
| `--color-footer` | `#252525` |

### 6-2. 레이아웃 (`tokens.css`)
`--layout-container-width: 1920px` · `--layout-gutter: 80px` · `--layout-section-padding: 120px` · `--layout-section-gap: 36px`

### 6-3. 폰트 (3종만)
`--font-kr` Pretendard(한글) · `--font-en` Instrument Sans(영문) · `--font-deco` Playfair Display(영문 장식)
- **행간 140% 통일.** 자간: 한글 -3~4% / 영문 -2% (스타일별 상이).

### 6-4. 타이포 (`typography.css`)
- Figma Text Style **21종 = `.type-*` 클래스**로 1:1 대응 (`Index/Typography/Title-1` → `.type-title-1`).
- 사용: `<h1 className="type-title-1">` · `<p className="type-body-4">`
- 종류: `type-title-1~5`, `type-title-semibold`, `type-subtitle-1`, `type-menu`, `type-italic-1~6`, `type-body-1~4`, `type-body-semibold-1~2`, `type-collabo-x`

> 디자인 시스템 값이 바뀌면 → Figma에서 재추출해 `tokens.css`/`typography.css` 갱신.

---

## 7. 페이지 · 섹션 · 컴포넌트 구조 규칙 ✅ (협업 핵심)

### 7-1. 3단계 구분
| 구분 | 정의 | 위치 | 예시 |
|------|------|------|------|
| **페이지(Page)** | 라우팅 단위 (URL 하나) | `pages/` | `HomePage`, `ProductPage` |
| **섹션(Section)** | 한 페이지를 이루는 큰 덩어리 | `sections/` | `HeroSection`, `WorldviewBSection` |
| **컴포넌트(Component)** | 여러 곳에서 재사용하는 조각 | `components/` | `GlowText`, `ProductCard`, `Carousel` |

> 판단 기준: **URL이 바뀌면 페이지 / 페이지 안의 한 화면 블록이면 섹션 / 두 군데 이상 재사용되면 컴포넌트.**

### 7-2. 네이밍 규칙
- **페이지**: `OoPage` (예: `HomePage`, `AboutPage`) — `pages/HomePage/HomePage.jsx`
- **섹션**: `OoSection` (예: `HeroSection`) — `sections/HeroSection/HeroSection.jsx`
- **컴포넌트**: 역할 이름 PascalCase (예: `GlowText`, `SpaceCard`)
- **파일/폴더**: 컴포넌트는 PascalCase, 그 외(유틸·훅) camelCase (`useScrollProgress.js`)
- **변수/함수**: camelCase / **상수**: UPPER_SNAKE_CASE
- **한 컴포넌트 = 한 폴더**(컴포넌트+스타일 같이) 또는 한 파일 — 팀에서 하나로 통일.

### 7-3. index 페이지 ↔ 서브페이지 규칙
- **메인은 `HomePage`(라우트 `/`)**, 그 안에 섹션들을 순서대로 조립.
- 서브페이지는 `OoPage`로 만들고 라우터에 등록. (예: `/products` → `ProductPage`)
- **실제 페이지 목록·라우팅 경로 = `[TBD]`** (기획·디자인 확정 후 채움).

### 7-4. 기타 코드 컨벤션
- **스타일링 = CSS Modules**: 컴포넌트별 `Xxx.module.css` 사용, 클래스는 camelCase(`.welcome`, `.glowWord`). 전역 타이포는 `.type-*` 클래스.
- 매직넘버·**하드코딩 색상/폰트 금지** → 디자인 토큰(6번) 사용.
- import 순서: 외부 라이브러리 → 내부 모듈 → 스타일.

---

## 8. Git 협업 규칙 ✅ (3명 동시 작업 — 가장 중요)
- **`main` 직접 push 금지.** 항상 브랜치 따서 작업.
- **브랜치명**: `feature/섹션명` (예: `feature/worldview-b`), 버그수정 `fix/...`
- **커밋 메시지**: `타입: 내용` 형식
  - `feat:` 기능 / `fix:` 버그 / `style:` 스타일·마크업 / `refactor:` 리팩터 / `docs:` 문서
  - 예) `feat: Worldview B 키워드 스왑 구현`
- **작업 시작 전 반드시 `git pull`** (최신 받고 시작 → 충돌 최소화).
- 머지: **PR(Pull Request) 올리고 한 명 이상 확인 후 머지** (또는 팀 규칙대로).
- **한 섹션 = 한 사람** 원칙 (같은 파일 동시 수정 방지).
- **`.gitignore`** 필수: `node_modules/`, `dist/`, `.env`, `.DS_Store`
- 저장소: **`https://github.com/hiramram00-dotcom/ezen_teamproject_1`**
- ⚠️ **초기 기반 세팅은 main에 올라가 있음**(예외). 이후 모든 작업은 브랜치+PR.

---

## 9. 에셋(이미지·영상) 네이밍 규칙 ✅ (필수 · 어기지 말 것)

> ⛔ **`IMG_1234`, `캡처`, `이름없음`, `최종_진짜최종` 같은 의미 없는 이름 절대 금지.**
> 파일명만 보고 **무엇인지/어디 쓰는지** 바로 알 수 있어야 한다.

### 9-1. 형식: `용도접두어-의미이름-변형.확장자`
- 전부 **소문자 + 하이픈(`-`)** (띄어쓰기·한글·언더스코어 X)
- 예시:
  - 버튼: `btn-light-finder.svg`
  - 아이콘: `ic-arrow-right.svg`
  - 로고: `logo-ilkw.svg`
  - 섹션 이미지: `worldviewb-pendant-01.webp`
  - 제품: `product-snowman-front.webp`
  - 배경: `bg-hero-dark.webp`
  - 영상: `video-hero.mp4`

### 9-2. 용도 접두어
| 접두어 | 용도 |
|--------|------|
| `btn-` | 버튼 |
| `ic-` | 아이콘 |
| `logo-` | 로고 |
| `bg-` | 배경 이미지 |
| `img-` | 일반 이미지(딱히 분류 없을 때) |
| `product-` | 제품 컷 |
| `video-` | 영상 |
| `seq-` | 스크롤 시퀀스 프레임 (`seq-bulb-001.webp` 처럼 번호 0패딩) |

### 9-3. 이미지 관리 흐름 — 2단계 (취합 → 배치)
> 지금은 **이미지 취합 중**이라 어느 섹션에 뭐 들어갈지 미정 → 최종 이름은 코딩할 때 확정한다.

**① 취합 단계 (현재 · 종욱님+팀)**
- **클라우드 한 곳**(구글드라이브/드롭박스 등)에 모은다. (git 아님)
- 임시 이름 `raw_내용` — **알아볼 수 있게**. 막 이름(`IMG_1234`) 금지.
  - 예: `raw_펜던트_거실.webp`, `raw_스노우맨_정면.webp`

**② 배치 단계 (코딩 시 · 각 섹션 담당자)**
- 자기 섹션 만들 때, 보관함에서 이미지 골라 **최종 규칙 이름으로 바꿔서** 프로젝트에 넣는다.
  - `raw_펜던트_거실.webp` → `worldviewa-pendant.webp`
  - `raw_스노우맨_정면.webp` → `product-snowman-front.webp`
- **어느 섹션에 쓸지는 그 섹션 담당자가 결정 → 이름도 담당자가 책임지고 변환.**

### 9-4. 위치 규칙 (코딩 단계)
- 섹션 전용 에셋은 섹션 폴더 안: `assets/worldview-b/...`
- 공용(로고·아이콘)은 `assets/common/...`
- 영상·360° 시퀀스 등 **무거운 파일은 git에 넣지 말 것** → 외부/CDN. (`.gitignore` 처리)

### 9-5. 포맷·최적화
- 사진/이미지 = **webp** 기본 (용량↓). 아이콘 = svg.
- 큰 이미지·아래쪽 섹션은 **lazy-load**.
- 시퀀스 프레임은 번호 **0패딩 통일**(`001, 002…`)해서 정렬 깨지지 않게.

---

## 10. 통일 규칙 (협업 충돌 방지 · 필수)

1. **반응형** — **구현 필수**(모바일 대응 함). 단 **브레이크포인트 px 기준 = `[TBD]`** (예: 모바일 ~767 / 태블릿 768~1023 / 데스크탑 1024+). 정해지면 값 하나로 통일.
2. **에디터 포맷 통일** — **Prettier + ESLint** 설정을 레포에 포함, 모두 동일 적용. (들여쓰기·세미콜론 diff 충돌 방지)
3. **패키지매니저 1개로 통일** — npm / pnpm / yarn 중 하나. (lock 파일 충돌 방지)
4. **`.env`·민감정보 커밋 금지** — `.gitignore`에 `.env`, 공유는 `.env.example`만.
5. (스택 확정 후 정할 것) CSS 단위 규칙 · 공통 컴포넌트 우선순위 · 상태관리 등.

---

## 11. 확정 / 미확정 현황 (한눈에)
- ✅ **확정**: 기술스택(React·Vite·CSS Modules·JS·npm) · 폴더구조 · 디자인 토큰(코드 반영) · **메인 섹션 순서** · Git 협업규칙 · 네이밍/에셋 규칙 · 레포 셋업
- 🟡 **진행 중**: 서브페이지 구성 · Worldview B 카피 · 반응형 브레이크포인트 값
- ❌ **미정**: 스크롤 애니메이션 라이브러리(framer-motion/GSAP) · 캐러셀 라이브러리 · 라우팅(서브페이지 목록)

> 기반 세팅·디자인 토큰은 **main에 올라가 있음.** 각자 `pull` → 섹션 작업 시작 가능.
