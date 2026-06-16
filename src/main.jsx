import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

// 뒤로/앞으로 갈 때 브라우저가 옛 스크롤 위치를 멋대로 복원해서 (콘텐츠가 아직 안 그려진 사이)
// 메인이 엉뚱한 위치로 오던 버그 방지 → 복원을 끄고 라우트 변경 시 직접 top으로 올림(App의 ScrollToTop).
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual'
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
