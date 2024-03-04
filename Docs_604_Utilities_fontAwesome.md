---
title: 🔗FontAwesome
description: <span>&#x23;Utility &#x23;Icon</span>
layout: libdoc/page

#LibDoc specific below
category: Utilities
order: 604
---
{:.toc}

## 폰트기반 아이콘 라이브러리

[🔗Font Awesome](https://fontawesome.com/)

* 아이콘을 이미지가 아닌 텍스트의 폰트를 기반으로 만들자는 생각에서 나온 라이브러리
* 기본에 Raster Image의 아이콘은 사이즈에 따라 고해상도의 이미지가 필요하지만, <br/>FontAwesome은 SVG기반이기 때문에 사이즈에 상관 없이 크기를 키울 수 있다.
  
### **Nuget  Pacakges**
---

  * [**FontAwesome.WPF**](https://github.com/charri/Font-Awesome-WPF/)
      * 가장 많이 다운로드된 nuget이나, 6~7년전에 업데이트가 끊긴 패키지.
      * .NET Core는 지원하지 않아 Dependency Warning이 뜨기는 하나 
      어차피 WPF는 Windows 환경에서만 실행되기 때문에 문제없이 작동한다. 솔루션에 뜨는 Warning이 싫다면 다른 패키지를 사용하자.
      * 종속성: `.Net Framework 3.5` 부터 지원하여 하위 종속성은 끝내준다.
          
  * [**FontAwesome.Sharp**★★★](https://github.com/awesome-inc/FontAwesome.Sharp)
      * 가장 최근까지 업데이트가 지속되는 패키지.
      * 종속성
          * `.NET 5.0`
          * `.NET Core 3.1`
          * `.NET Framwrok 4.0`
          
  * [**FontAwesome5**](https://github.com/MartinTopfstedt/FontAwesome5)
      
      * *FontAwesome.Sharp* 만큼은 아니나 상당히 최근까지 업데이트가 지속되는 패키지.
      * 종속성
          * `.NET 5.0`
          * `.NET Core 1.0`
          * `.NET Framwrok 4.0`
          * `.NET Standard 1.4`