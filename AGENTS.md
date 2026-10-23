# 블로그 포스트 업무 (junehk.github.io, Jekyll)

입력: 초안 `draft.md` + 이미지들이 들어있는 초안 폴더 (예: `~/Desktop/strata/`).
원칙: 초안 폴더 원본은 절대 수정·삭제하지 않고, 저장소 쪽에만 생성한다.

## 1. 한국어 퇴고 → 포스트 추가
- 파일: `_posts/YYYY-MM-DD-<slug>.md` (slug은 hyphen, 기존 포스트와 이어지는 이름으로)
- front matter: `title` / `category` (coding | biology, `_data/categories.yml` 참조) / `tags: [3~6개]` / `lang: ko`
- 문체: 원고 톤(1인칭, 직설적) 유지, 띄어쓰기·오탈자·문법만 수정
- 구조: `##` 섹션으로 구분, 이미지 캡션·출처는 `> ` blockquote (기존 포스트와 동일)
- 이미지: markdown `![alt](/images/post/<slug>/NN_name.ext)` 형식, HTML img 금지
  - 초안 이미지를 `images/post/<slug>/`에 `01_name.png`처럼 번호 붙여 복사
- 모델명·수치(t/s, GB 등)는 원문 그대로 유지, 오타로 의심되면 임의 수정 대신 채팅에서 확인

## 2. 영어 번역
- `_posts/YYYY-MM-DD-<slug>-en.md`: `lang: en`, category/tags/이미지는 한국어판과 동일
- 파일명에 `-en` 접미사를 붙여야 post-card의 한/영 자동 연결이 동작
- 기존 `-en` 포스트와 톤 일치 (캡션 "Source:", "Closing Thoughts" 같은 섹션 명명)

## 3. 이미지 압축 (포스팅 완료 후)
- PNG → WebP: `cwebp -lossless`와 `cwebp -q 88 -m 6` 둘 만들어 더 작은 쪽 선택 (cwebp 설치됨)
- 폭 1600px 초과: `sips -Z 1600 src.png --out tmp.png`로 먼저 리사이즈 후 변환
  - 주의: cwebp의 `-resize 1600 0` 문법은 오류 발생, zsh는 변수를 공백으로 분할하지 않음 → shell 변수에 옵션을 담아 펼치지 말 것
- markdown 경로 `.png` → `.webp` 업데이트
- 원본 PNG는 webp 생성 성공 확인 후에만 삭제 (git 히스토리에 원본 보존)
- SVG는 그대로 둠

## 4. 검증 (매 단계 마무리)
- `bundle exec jekyll build` (sass deprecation warning은 기존 것이라 무시)
- 생성 확인: `_site/blog/<slug>/index.html` (+ `-en`)
- 이미지 누락 확인:
  `grep -rhoE 'src="/images/[^"]+' _site/blog | sed 's/src="//' | sort -u | while read p; do [ -f "_site$p" ] || echo MISSING $p; done`

## 완료 보고
- 작업한 파일 경로 요약을 채팅에 정리
- 확인 필요한 불확실 항목(모델명 오타 의심 등)과 추가 제안(영어판 등)을 명시
