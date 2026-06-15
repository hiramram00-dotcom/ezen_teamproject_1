import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ShowroomPage from './pages/ShowroomPage/ShowroomPage.jsx'

/**
 * 임시 라우팅 — 서브페이지 라우팅 확정([TBD]) 전까지 #showroom 해시로 미리보기.
 * TODO: react-router 도입 시 이 분기를 <Route path="/showroom"> 로 교체하고 제거.
 *   (예) localhost:5173/#showroom 으로 접속하면 ShowroomPage 렌더.
 */
const renderByHash = () =>
  window.location.hash === '#showroom' ? <ShowroomPage /> : <App />

const root = createRoot(document.getElementById('root'))
const render = () => root.render(<StrictMode>{renderByHash()}</StrictMode>)

window.addEventListener('hashchange', render)
render()
