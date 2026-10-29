---
title: 개요
toc: false
category: getting-started
icon: home
---

# 개요

Vitepress Theme Akari Docs는 VitePress와 `@m3e/web`으로 만든 문서 테마입니다.

<div class="demo-row">
  <m3e-button variant="filled" href="/ko-KR/getting-started/installation.html">
    <m3e-icon slot="icon" name="rocket_launch"></m3e-icon>
    설치 가이드
  </m3e-button>
  <m3e-chip>
    <m3e-icon slot="icon" name="check"></m3e-icon>
    테마 준비 완료
  </m3e-chip>
  <m3e-chip variant="elevated">
    <m3e-icon slot="icon" name="layers"></m3e-icon>
    Web Components
  </m3e-chip>
  <m3e-badge size="large">v1.0.0</m3e-badge>
</div>

## 기능

<div class="demo-grid">
  <m3e-card variant="outlined">
    <m3e-heading m3e-toc-ignore slot="header" variant="title" size="large">Material 3 Expressive</m3e-heading>
    <div slot="content">색상, 모양, 모션, 타이포그래피는 모두 m3e 디자인 토큰에서 가져오며 공식 Material 3와 일치합니다.</div>
  </m3e-card>
  <m3e-card variant="outlined">
    <m3e-heading m3e-toc-ignore slot="header" variant="title" size="large">폴더 기반 구성</m3e-heading>
    <div slot="content">언어 폴더 안의 폴더는 카테고리이고, 그 안의 폴더는 글입니다. 내비게이션과 언어 목록은 폴더와 프런트매터로 만들어집니다.</div>
  </m3e-card>
  <m3e-card variant="outlined">
    <m3e-heading m3e-toc-ignore slot="header" variant="title" size="large">병렬 페이지와 히어로</m3e-heading>
    <div slot="content">하나의 글을 여러 페이지로 나누고 탭 바로 전환할 수 있습니다. 히어로가 있는 페이지는 이미지에서 색상을 가져옵니다.</div>
  </m3e-card>
  <m3e-card variant="outlined">
    <m3e-heading m3e-toc-ignore slot="header" variant="title" size="large">설정과 화면 모드</m3e-heading>
    <div slot="content">네 가지 화면 모드를 제공합니다. 색상, 변형, 대비, 모션, 텍스트 방향, 글자 크기는 즉시 적용되고 현재 브라우저에 저장됩니다.</div>
  </m3e-card>
  <m3e-card variant="outlined">
    <m3e-heading m3e-toc-ignore slot="header" variant="title" size="large">검색과 다국어</m3e-heading>
    <div slot="content">로컬 색인을 바로 사용할 수 있고, HTTP 백엔드나 사용자 정의 백엔드로 바꿀 수도 있습니다. 언어를 바꿔도 대응하는 페이지에 머뭅니다.</div>
  </m3e-card>
  <m3e-card variant="outlined">
    <m3e-heading m3e-toc-ignore slot="header" variant="title" size="large">교체와 확장</m3e-heading>
    <div slot="content">앱 바, 목차, 푸터 같은 컴포넌트를 교체하거나 CSS 변수를 재정의해 모양을 조정할 수 있습니다.</div>
  </m3e-card>
</div>

## 빠른 시작

```bash
npm install
npm run dev
```

다음 문서:

- [설치](/ko-KR/getting-started/installation): 템플릿으로 저장소 만들기, 요구 사항과 배포.
- [구성](/ko-KR/getting-started/configuration): 공통 구성과 언어 구성.
- [페이지 작성](/ko-KR/getting-started/writing): 새 글, 프런트매터, Markdown.
- [레이아웃과 앱 바](/ko-KR/theme/layout), [사이드 내비게이션](/ko-KR/theme/sidebar): 테마 셸의 구성 요소.

이 사이트는 중국어, 영어, 일본어, 한국어, 프랑스어, 아랍어로 제공됩니다. 레일 하단의 언어 버튼으로 전환합니다.
