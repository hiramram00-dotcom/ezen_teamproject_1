# public/videos

풀스크린 동영상 섹션용 영상 파일을 여기에 둔다.
**무거운 파일이라 git에는 안 올린다** (DEV_GUIDE §9-4) — 영상 원본은
팀 클라우드 드라이브에서 받아 각자 이 폴더에 직접 넣는다.

## 현재 필요한 파일
| 파일명 | 쓰는 곳 |
|--------|---------|
| `video-ilkw-snowman.mp4` | `Snowman2Section` (Figma 468:701) |

- 네이밍: `video-` 접두어 + 의미이름 (전부 소문자·하이픈).
- 코드에서는 루트 경로로 참조: `/videos/video-snowman.mp4`.
- CDN/외부 호스팅을 쓰려면 `Snowman2Section.jsx` 의 `VIDEO_SRC` 를 외부 URL 로 교체.
