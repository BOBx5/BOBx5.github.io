---
title: 아이콘(ico) 생성 스크립트
description: 스크립트 ico 파일을 생성해보자
layout: libdoc/page

#LibDoc specific below
category: PowerShell
order: 501
---
* 
{:toc}

## 계기

닷넷 인스톨러 프로젝트에 바로가기 아이콘을 지정했는데,

아이콘지정 / 빌드 과정에서 아무런 문제가 없는데도

설치 후 해당 바로가기에 아이콘이 설정이 안되고 기본아이콘만 덩그러니 나오는 현상이 있었다.

원인을 찾아보니 `.ico` 파일의 이미지가 너무 커서 적용이 안되는 것이였다.

재밌는건 이미 동일한 사이즈(*256x256px*) 파일이 다른 프로젝트에서는 정상적으로

적용되더란 것이다…  도대체 왜?!

## 원인
`.ico` 파일을 이미지 뷰어(ex.꿀뷰)로 열면 한 이미지만 나온다.

나는 그래서 `.ico` 단순 이미지인데 쓸데 없이 확장자만 다른 

레거시의 번거로운 파일이라고 여겨왔다.

근데 `.ico` 를 VisualStudio로 열어보자.

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/97cb07c9-9682-4083-b32c-c19a552d56d0/Untitled.png)

왼쪽 탭에 여러 사이즈의 이미지를 가지고 있는 것이 보이는가?

`.ico`는 단순한 이미지 파일이 아니라 내부적으로 

여러 이미지(여러 사이즈)를 가질 수 있는 **일종의 압축 파일**이였던 것이였다!

그래서 큰 이미지의 `.ico` 파일을 프로젝트에 첨부해도 내부적으로는 작은 사이즈를 포함하고 있어

인스톨러 프로젝트에서 정상적으로 바로가기 아이콘이 적용되었던 것이다.

## 문제점
ico 생성해주는 온라인 컨버터들은 검색해보면 많다.

근데 이게 신통치가 않다…

- 원하는 사이즈의 `ico` **하나만 변환**해 준다거나
   ex) 원본이미지 ⇒ *favicon192.ico*
- 여러 사이즈의 `ico` 를 **각각 개별 파일로** 떨궈준다거나 
   ex) 원본이미지 ⇒ *favicon32.ico, favicon64.ico, favicon128.ico, favicon192.ico, favicon256.ico*
- 여러 사이즈의 `ico` 를 한 파일로 합쳐주긴 하는데 내가 **원하는 사이즈가 없거나**
   ex) 원본이미지 
   ⇒ *favicon32.ico, favicon64.ico, favicon128.ico, ~~favicon192.ico~~, favicon256.ico
   ⇒ favicon.ico*

이런식으로 뭔가 나사가 하나씩 빠진 컨버터들 밖에 없다.

## 해결방법
오픈소스 [ImageMagick🔗](https://imagemagick.org/index.php) 을 쓰자!!

방법은 어렵지 않다. ImageMagic을 설치한 후 아래 파워쉘 스크립트를 실행하면 된다.

- ✅ 이미지 소스는 하나만!
- ✅ 내가 원하는 사이즈들을 포함하게 해서!
- ✅ 한개의 `.ico`로!

```powershell
#ImageMagick - converter.exe 경로
$convert = "C:\Program Files\ImageMagick-7.1.0-Q16-HDRI\convert.exe" 

#작업경로
$workingDir = "C:\Users\사용자명\Downloads\"; 

#소스이미지
$source = "256px_imageSource.png"; 

#저장파일명
$output = "favicon.ico"; 

#포함하고자 하는 이미지 사이즈들
$sizes = "16,24,32,48,64,128,192,256"; 

#스크립트 실행
& $convert "$workingDir$source" -define icon:auto-resize=$sizes "$workingDir$output";
```

위 스크립트를 실행하면<br/>
`C:\Users\사용자명\Downloads\` 경로에 내부적으로 <br/>
여러 해상도 이미지를 가진  `favicon.ico` 파일이 생성된다.