---
title: FontAwesome
description: <span>&#x23;WPF &#x23;NuGet</span>
layout: libdoc/page

#LibDoc specific below
category: WPF
order: 303
---
<div align="left">
    <img src="https://img.shields.io/badge/WPF-512BD4?style=flat&logo=dotnet&logoColor=white"/>
    <img src="https://img.shields.io/badge/NuGet-004880?style=flat&logo=nuget&logoColor=white"/>
</div>
{:toc}
---

## [Font Awesome](https://fontawesome.com/)
### 폰트기반 아이콘 라이브러리

* 아이콘을 이미지가 아닌 텍스트의 폰트를 기반으로 만들자는 생각에서 나온 라이브러리
* 기본에 *Raster Image*(*.jpg, *.png 등) 형태로 제작된 아이콘은 사이즈에 따른
  고해상도의 이미지가 필요하지만,
  FontAwesome은 **SVG기반**이기 때문에 사이즈 깨지는 현상 없이 늘릴 수 있다.
  
### 관련 NuGet Pacakges
---

  * [**FontAwesome.WPF**](https://github.com/charri/Font-Awesome-WPF/)
      * 가장 많이 다운로드된 NuGet이나, 6~7년전에 업데이트가 끊긴 패키지.
      * *.NET Core*는 지원하지 않아 <u>Dependency Warning</u>이 뜨기는 하나<br/>
      어차피 WPF는 Windows 환경에서만 실행되기 때문에 문제없이 작동한다.<br/>
      솔루션에 뜨는 Warning이 싫다면 다른 패키지를 사용하자.
      * *.Net Framework 3.5* 부터 지원하여 하위 종속성 👍
          
  * [**FontAwesome.Sharp** (추천)](https://github.com/awesome-inc/FontAwesome.Sharp)
      * 가장 최근까지 업데이트가 지속되는 패키지
      * 종속성
          * *.NET 5.0*
          * *.NET Core 3.1*
          * *.NET Framwrok 4.0*
          
  * [**FontAwesome5**](https://github.com/MartinTopfstedt/FontAwesome5)
      
      * *FontAwesome.Sharp* 만큼은 아니나 상당히 최근까지 업데이트가 지속되는 패키지
      * 종속성
          * *.NET 5.0*
          * *.NET Core 1.0*
          * *.NET Framwrok 4.0*
          * *.NET Standard 1.4*