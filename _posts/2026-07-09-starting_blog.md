---
title: "블로그 시작하기"
category: coding
tags: [Jekyll, Claude Code]
lang: ko

---

## 시작한 개기

1. 코딩, 생물학적 실험 등을 기록할 필요성이 생김
2. 한국 내수적인 것에 국한하지 않기 위한 플랫폼이 필요함
3. 코딩 공부를 겸하기 때문에 단순한 Medium, Naver Blog, Notion 공유 같은 것들을 지양하고 싶었음
4. Open-source이고 접근성 높은 GitHub Pages + Jekyll을 바탕으로 개인 홈페이지를 구축하기로 함
5. Markdown 형식으로 편집하고 싶음
6. Claude Code로 '딸깍' 만들기보다는, Claude에 물어보고 공부하며 작성하는 것을 목표로 함

## 도구 및 환경

1. Claude, Claude Code
2. macOS + Miniforge

## GitHub Pages

개발자라면 누구나 친숙한 플랫폼이다. 그러나 오래 습식 실험실(wet lab)에 몰입한 사람일수록 이 분야에 낯선 경향이 있다. 

2019년 고려대학교 안준용 교수님의 생물통계학 수업(사실은 R을 이용한 데이터 시각화 수업)을 통해 처음 코딩에 입문하면서 GitHub에 접하게 되었다. 2026년 현재까지 GitHub를 적극적으로 활용하지는 않았으나, **무료**, **코딩 친화적**, **개인 홈페이지 제공**이라는 세 가지 이점에 주목하여 이 플랫폼을 통해 개인 홈페이지를 제작하기로 결정했다.

![Github Page 문서](/images/post/2026-07-09-starting_blog/Githubpage.png)

자세한 정보는 [GitHub Pages 문서](https://docs.github.com/ko/pages)에서 확인할 수 있다.

## 설치

### Jekyll

GitHub Pages는 Jekyll을 이용한 홈페이지 구축을 권장한다. 공식 설치 가이드를 따라 환경을 구성한다.

![Jekyll installation](/images/post/2026-07-09-starting_blog/jekyllrb_install.png)

[macOS용 Jekyll 설치 가이드](https://jekyllrb.com/docs/installation/macos/)를 참고하여 환경을 구축했다. `jekyll`, `gem`, `bundler` 모두 설치가 완료되었다.

`./myblog` 폴더를 만들어 여기에 환경을 구축해보자.

```bash
# ./myblog 폴더 생성 및 환경 구축
jekyll new myblog

# myblog로 이동
cd myblog

# jekyll 실행
bundle exec jekyll serve
```

![Jekyll Terminal Run](/images/post/2026-07-09-starting_blog/jekyll_terminal_exec.png)

브라우저에서 `http://localhost:4000`에 접속하면 초기 홈페이지를 확인할 수 있다. 종료하려면 터미널에서 `Ctrl + C`를 입력한다.

![Jekyll Terminal Run](/images/post/2026-07-09-starting_blog/jekyll_initial_page.png)

초기 테마는 비어있는 부분이 많다. 이제 커스터마이징을 위해 Claude Code를 이용하여 빌드하고, 세부 내용을 추가로 공부하기로 했다.

## Claude Code 기반 개발

![Jekyll Serif Theme](/images/post/2026-07-09-starting_blog/Jekyll_serif_theme.png)

선택한 테마는 [Jekyll Serif Theme](https://github.com/zerostaticthemes/jekyll-serif-theme)이다. 구성이 깔끔했다.

![Previous web site](/images/post/2026-07-09-starting_blog/previous_web_page.png)

해당 테마를 활용하면서 이전에 AI를 통해 `index.html` 방식으로만 제작했던 연습용 홈페이지 구성을 통합하기로 했다.

### 개발 계획

Claude Code를 사용하기 전, 필요 사항을 정리했다.

1. 영어-한국어 언어 전환 지원
   - 기본은 영어로 설정
   - 한국어 브라우저는 한국어로 자동 표시
2. 홈페이지 구성 요소
   - 간단한 소개
   - 블로그 포스팅 목록
   - 출판 논문 목록
   - 하단 연락처 정보
3. 테마 기반 개발
   - 선택한 테마를 기초로 커스터마이징
   - 기존 홈페이지 디자인 참고

### 개발 과정

VSCode에서 Jekyll Serif 폴더로 이동하고, Claude Code에 요구사항을 설명했다.

![vscode_claude_please_do_it](/images/post/2026-07-09-starting_blog/vscode_claude_please_do_it.png)

몇 가지 수정사항을 거쳐 깔끔한 페이지가 완성되었다. 유지보수를 위한 파일 구조 및 블로그 글 작성 방법을 Claude Code를 통해 학습했다.

![Bunch of files compared to the first index.html only system](/images/post/2026-07-09-starting_blog/file_list.png)

마지막으로 GitHub에 업로드하여 완료했다.
