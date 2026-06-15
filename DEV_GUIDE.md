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

### 5-1. 메인페이지 최종 검수·감독 ✅ (2026-06-11 확정)
- **담당 = 종욱님(JW).** 역할 = **기술 심판(연출 감독 아님).**
- 멀티오너인 **메인페이지만** 해당 (서브페이지는 1인 담당이라 무관).
- 문제·충돌 발견 시 절차: **파악 → 정리 →**
  - 연출에 **영향 없으면** → 종욱님이 직접 수정 OK.
  - 연출에 **영향 있으면** → 임의 변경 금지. 정리해서 **해당 섹션 담당자에게 알림** → 합의 후 결정.
- **각 섹션의 연출 결정권은 끝까지 그 섹션 담당자에게 있다.**

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
`--layout-container-width: 1920px` · `--layout-gutter: 38px`(페이지 좌우여백) · `--layout-section-padding: 120px` · `--layout-section-gap: 36px`

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

## 9. 에셋(이미지·영상) 규칙 ✅ (필수 · 어기지 말 것)

> ⛔ **`IMG_1234`, `캡처`, `이름없음`, `최종_진짜최종` 같은 의미 없는 이름 절대 금지.**
> 파일명만 보고 **무엇인지/어디 쓰는지** 바로 알 수 있어야 한다.

### 9-1. 네이밍 = `섹션-이름` 2단계 ✅ (2026-06-11 회의 확정)
- 형식: **`섹션-이름.확장자`** — 전부 **소문자 + 하이픈(`-`)** (띄어쓰기·한글·언더스코어 X)
- ⚠️ `video-`·`img-` 같은 **용도 접두어는 안 붙인다.** (이미지=webp·영상=URL로 통일돼서 불필요 / 규칙이 너무 타이트하지 않게)
- 예시: `hero-pendant.webp` · `snowman-front.webp` · `story-flame.webp` · `space-living.webp`
- **공용 에셋**(섹션 무관 — 로고·아이콘)은 섹션명 대신 자기설명 이름: `logo-ilkw.svg`, `ic-arrow-right.svg`

### 9-2. 포맷 ✅ (회의 확정)
- **사진·이미지 = 무조건 `webp`** (용량↓).
- **아이콘·캐릭터(일러스트) = `svg`** (벡터, 깨짐 없음).
- 큰 이미지·아래쪽 섹션은 **lazy-load**. 시퀀스 프레임은 번호 **0패딩**(`001, 002…`).

### 9-3. 이미지 관리 흐름 (취합 → 변환 → 배치)
① **취합**: 팀 **클라우드(구글드라이브)** 한 곳에 모음. 임시 이름 `raw_내용`(알아볼 수 있게, `IMG_1234` 금지).
② **변환**: 드라이브 원본 사진을 **전부 `webp`로 변환.** (이미지 담당)
③ **배치**: 섹션 담당자가 골라 **`섹션-이름.webp`** 로 바꿔 프로젝트에 넣음.
  - 예) `raw_스노우맨_정면` → `snowman-front.webp`
- 어느 섹션에 쓸지·이름은 **그 섹션 담당자가 결정·책임.**

### 9-4. 영상 = 외부(Cloudinary) URL ✅ (회의 확정 · 절대 git 금지)
- **영상은 git에 올리지 않는다.** `.gitignore`로 `public/videos/*` 차단(이미 설정됨 — **유지**).
- 영상은 **Cloudinary에 업로드 → 코드에선 URL로 참조.**
  - 예) `<video src="https://res.cloudinary.com/.../snowman.mp4" ... />`
- ⚠️ `public/videos/`에 **파일을 직접 넣는 옛 방식 금지.** 그 폴더는 git 제외라 **다른 PC·배포 환경에선 영상이 없어 검정화면**이 뜬다(만든 사람 PC에서만 보임). 반드시 Cloudinary URL로.
- 무거운 360° 시퀀스 등도 외부/CDN.

### 9-5. 에셋 위치 (코딩 단계)
- **섹션 전용** 에셋 = `assets/섹션명/` (예: `assets/hero/`, `assets/spaces/`). 그 섹션만 씀.
- **공용 에셋**(로고·아이콘 등 여러 곳에서 쓰는 것) = `assets/common/` 아래 종류별 폴더.
  - **로고** = `assets/common/logo/` — ✅ 현재: `ilkw-i/l/k/w.svg`(글자 분리) + `ilkw.svg`(완성형). **진짜 벡터**(path)로 보관.
  - 아이콘 = `assets/common/icon/` (필요 시).
  - ⚠️ **공용 에셋은 `섹션-이름` 규칙 예외** — 섹션에 속하지 않으므로 `assets/common/종류/` 에 의미명으로. (로고를 특정 섹션 폴더에 두지 말 것 → 헤더·푸터·Hero가 한 곳에서 import)
  - ⚠️ 로고는 **PNG 박힌 가짜 SVG 금지**(비동기 로드·용량↑ 문제). **path 기반 진짜 벡터**만.

---

## 10. 통일 규칙 (협업 충돌 방지 · 필수)

1. **반응형** — **구현 필수**(모바일 대응 함). 단 **브레이크포인트 px 기준 = `[TBD]`** (예: 모바일 ~767 / 태블릿 768~1023 / 데스크탑 1024+). 정해지면 값 하나로 통일.
2. **에디터 포맷 통일** — **Prettier + ESLint** 설정을 레포에 포함, 모두 동일 적용. (들여쓰기·세미콜론 diff 충돌 방지)
3. **패키지매니저 1개로 통일** — npm / pnpm / yarn 중 하나. (lock 파일 충돌 방지)
4. **`.env`·민감정보 커밋 금지** — `.gitignore`에 `.env`, 공유는 `.env.example`만.
5. (스택 확정 후 정할 것) CSS 단위 규칙 · 공통 컴포넌트 우선순위 · 상태관리 등.

---

## 11. 확정 / 미확정 현황 (한눈에)
- ✅ **확정**: 기술스택(React·Vite·CSS Modules·JS·npm) · 폴더구조 · 디자인 토큰(좌우여백 38px 포함) · **메인 섹션 순서** · Git 협업규칙 · **에셋 규칙(네이밍 `섹션-이름` / 이미지 webp·아이콘 svg / 영상 Cloudinary URL)** · **메인페이지 검수·감독(종욱님)** · 레포 셋업
- 🟡 **진행 중**: 서브페이지 구성 · Worldview B 카피 · 반응형 브레이크포인트 값 · 드라이브 이미지 webp 일괄 변환
- ❌ **미정**: 스크롤 애니메이션 라이브러리(framer-motion/GSAP) · 캐러셀 라이브러리 · 라우팅(서브페이지 목록)

> 기반 세팅·디자인 토큰은 **main에 올라가 있음.** 각자 `pull` → 섹션 작업 시작 가능.
