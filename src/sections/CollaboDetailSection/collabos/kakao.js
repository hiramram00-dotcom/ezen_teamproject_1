// ILKW × KAKAO FRIENDS 콜라보 데이터
// Figma node 1587:33(히어로) · 1587:62(본문, 1920×4683)
import heroBg from '../assets/kakao-hero.webp'
import brandLogo from '../assets/kakao-logo.svg'
import a from '../assets/kakao-a.webp' // 04 (가로, 우상단)
import b from '../assets/kakao-b.webp' // 050368 (세로, 좌)
import c from '../assets/kakao-c.webp' // 07 (가로, 우중단)
import d from '../assets/kakao-d.webp' // 67aceaa (세로, 좌하단)
import e from '../assets/kakao-e.webp' // 658aaca (세로, 우하단)

const kakao = {
  hero: { bg: heroBg, brandLogo, brandAlt: 'KAKAO FRIENDS', logoAspect: '429 / 90' },
  content: {
    logoAspect: '390 / 82', // 가로 워드마크 비율
    titleWord: 'FRIENDS',
    subtitle: '일상에 작은 즐거움을 더하다',
    bodyLines: [
      '일광전구와 카카오프렌즈의 친근한 감성이 만나',
      '특별한 컬렉션으로 탄생했습니다.',
      '매일 마주하는 순간을 더욱 따뜻하고 특별하게 만듭니다.',
    ],
    brandLogo,
    brandAlt: 'KAKAO FRIENDS',
    productUrl: '#', // TODO: 카카오 에디션 제품 페이지 링크로 교체
    bodyTriggerIndex: 1, // 2번째 사진에서 본문 등장
    // 위치/사이즈: Figma 프레임 1587:62 (1920×4683) 기준 %
    // top은 KBP 첫 사진(14.036%)에 맞춰 전체 +4.66% 내림 (타이틀-사진 여백 KBP와 동일)
    photos: [
      { src: a, left: 60.469, top: 14.035, width: 37.5, height: 9.609 },
      { src: b, left: 1.979, top: 22.672, width: 34.896, height: 21.535 },
      { src: c, left: 57.708, top: 43.915, width: 40.313, height: 10.336 },
      { src: d, left: 1.979, top: 55.871, width: 40.833, height: 19.624 },
      { src: e, left: 65.677, top: 70.28, width: 32.292, height: 19.859 },
    ],
  },
}

export default kakao
