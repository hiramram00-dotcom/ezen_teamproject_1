// ILKW × KITTY BUNNY PONY 콜라보 데이터
// Figma node 1565:312(히어로) · 1565:327(본문, 1920×4683)
import heroBg from '../assets/collabo-kbp-hero.webp'
import brandLogo from '../assets/kbp-logo.svg'
import a from '../assets/kbp-6.webp'
import b from '../assets/kbp-12.webp'
import c from '../assets/kbp-4.webp'
import d from '../assets/kbp-10.webp'
import e from '../assets/kbp-5.webp'

const kbp = {
  hero: { bg: heroBg, brandLogo, brandAlt: 'KITTY BUNNY PONY', logoAspect: '1 / 1' },
  content: {
    logoAspect: '1 / 1', // 정사각 로고
    titleWord: 'PATTERN',
    subtitle: '빛과 패턴이 만나는 순간',
    bodyLines: [
      '일광전구의 빛과 키티버니포니의 패턴이 만나',
      '공간에 새로운 분위기를 더합니다.',
      '일상을 더욱 따뜻하고 특별하게 만드는 협업 컬렉션입니다.',
    ],
    brandLogo,
    brandAlt: 'KITTY BUNNY PONY',
    productUrl: 'https://ilkwdesign.com/FLAMINGO26-Table-KBP-Edition',
    bodyTriggerIndex: 1, // 2번째 사진에서 본문 등장
    // 위치/사이즈: 프레임 1920×4683 기준 %
    photos: [
      { src: a, left: 63.667, top: 14.036, width: 34.354, height: 9.929 },
      { src: b, left: 1.979, top: 19.012, width: 31.771, height: 19.539 },
      { src: c, left: 55, top: 40.088, width: 43.021, height: 11.745 },
      { src: d, left: 1.979, top: 57.278, width: 42.135, height: 22.827 },
      { src: e, left: 69.063, top: 66.46, width: 28.958, height: 17.787 },
    ],
  },
}

export default kbp
