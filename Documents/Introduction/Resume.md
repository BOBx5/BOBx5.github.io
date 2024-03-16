---
title: 이력서
description: ""
layout: libdoc/page

#LibDoc specific below
category: Introduction
order: 002
unlisted: true
---
* 
{:toc}

## **Information**
---
* 박현우
* 1993년생 (만 31세)
* bapbapbapbapbap@gmail.com
* **5년차** *(2019년 11월 ~ 현재)*

## **Education**
---
* 한국폴리텍 4대학 대전캠퍼스
    * 전문학사(**초대졸**)
    * 정보통신시스템과
    * 2012.03 - 2020.02
    * 수상이력
        * 한국폴리텍 4대학 프로젝트 작품 경진대회   **`대상`**

            '*보행자 보호를 위한 볼라드시스템*'

            
    
## **대외활동**
---
#### [.NET Conf 2024 x Seoul](https://dotnetconf.kr/2024)
{:.no_toc}
* [***클린아키텍처로 이사가기***](https://dotnetconf.kr/e43c01da2c1c4a0d8ecdb3ca9e5753ce) 세션 [발표자](https://dotnetconf.kr/637e7f4cc73e45f98f5090e4cbd15db9)로 참여
* ![ASP.NET Core][Shield_ASP.NET_Core] `Web API` 에 클린아키텍처를 적용한 샘플 및 가이드라인 소개
    * [샘플 소스코드](https://github.com/BOBx5/2024_.NET_Conf_CleanArchitecture)
    * [발표자료](https://docs.google.com/presentation/d/1-snoN8er940CTcqU9N-i8XOAK3QqcLT57eX9s8ST-zU/edit?usp=sharing)


## **Tech Stack**
---

* Language

    ![C#][Shield_csharp]<br/>
    ![Xaml][Shield_xaml]<br/>
    ![Javascript][Shield_Javascript]<br/>
    ![Typescript][Shield_Typescript]<br/>
    ![PowerShell][Shield_PowerShell]<br/>

* Framework

    ![ASP.NET Core][Shield_ASP.NET_Core]<br/>
    ![WPF][Shield_WPF]<br/>
    ![Winform][Shield_Winform]<br/>
    ![Xamarin][Shield_Xamarin]<br/>

* Database

    ![SqlServer][Shield_SqlServer]<br/>
    ![Supabase][Sheild_Supabase]<br/>
    ![SQLite][Shield_Sqlite]<br/>

* Desing Pattern

    `MVVM` for ![WPF][Shield_WPF] ![Xamarin][Shield_Xamarin] <br/>
    `Web API` for ![ASP.NET Core][Shield_ASP.NET_Core] <br/>
    `MVC` for ![ASP.NET Core][Shield_ASP.NET_Core] <br/>
    `Clean Architecture` for ![ASP.NET Core][Shield_ASP.NET_Core] <br/>

* IDE

    ![VisualStudio][Shield_VisualStudio]<br/>
    ![VisualStudioCode][Shield_VisualStudioCode]<br/>
    ![SSMS][Shield_SSMS]<br/>
    ![DBeaver][Shield_DBeaver]<br/>
    ![AzureDataStudio][Shield_AzureDataStudio]<br/>

* ORM

    ![EntityFramework][Shield_EntityFramework]<br/>
    ![Dapper][Shield_Dapper]<br/>

* Source Management

    ![Git][Shield_Git]<br/>
    ![GitHub][Shield_GitHub]<br/>
    ![GitLab][Shield_GitLab]<br/>
    ![TortoiseSVN][Shield_TortoiseSVN]<br/>

* ETC

    ![Docker][Shield_Docker]<br/>
    ![Postman][Shield_Postman]<br/>
    ![FirebaseFCM][Shield_FirebaseFCM]<br/>
    ![DevExpress][Shield_DevExpress]<br/>
    ![Notion][Shield_Notion]<br/>
    ![Asana][Shield_Asana]<br/>

## **경력기술서**
---

### **(주)스파이더크래프트**
---
* 2022.04 - 현재
* 개발1팀
* 전임연구원
* 자사 솔루션(가맹점PC, 대리점PC) 프로그램 기능개발 및 유지보수

---
#### 4. 모듈화
{:.no_toc}
---
* 기존 Winform 프로젝트의 [Bloated Large Class](https://refactoring.guru/ko/smells/large-class) 로 인해<br/>
  유지보수성 저하 문제를 해결하기 위해 모듈화 작업을 진행하였다.
* 기능들을 각 Feature들로 분리하고 인터페이스화하여 추상화 처리
* WindowsXP 지원을 위해 사용 중인 `.NET Framework 4.0` 으로 인한 제약 해결

   .NET Framework 4.0 BCL 라이브러리의 DependencyInjection 미지원 및<br/>
   관리되는 IoC Container 라이브러리 사용이 불가능하여 유사한 기능

* 추상화 된 모듈을 활용한 `Unit Test` 사내 최초 적용
* ![C#][Shield_csharp] ![.NETFramework][Shield_DotNetFramework]


#### 3. 클린아키텍처 API R&D
{:.no_toc}
---
* 2023.06 - 2023.09
* 복잡한 도메인 및 기존 구조의  낮은 유지보수성을 개선하기 위한<br/>
  ASP.NET WebAPI 에`Clean Architecture`를 도입한 아키텍처 R&D 설계 및 사내 교육 진행
* ![C#][Shield_csharp] ![ASP.NET Core][Shield_ASP.NET_Core] ![EntityFramework][Shield_EntityFramework] ![SqlServer][Shield_SqlServer]

#### 2. 영수증 데이터 추출 테스트 및 룰 생성 Tool 개발
{:.no_toc}
---
* 2022.09 - 2022.12
* 영수증 데이터 정제용 `json` 룰 생성 GUI Tool 개발
* MVVM패턴 적용으로 유지보수성 향상
* 테스트용 영수증 텍스트를 입력하여 정제 결과 *Visualize* 할 수 있도록 구현
* ![C#][Shield_csharp] ![.NETCore][Shield_DotNetCore] ![WPF][Shield_WPF]

#### 1. 영수증 주문정보 추출 라이브러리 개발
{:.no_toc}
---
* 2022.06 - 2022.09
* 기존방식의 문제점

    각 벤더 별 영수증 양식에 맞는 담당 클래스에 정제 룰을 하드코딩하여 배포하는 방식
    1. 영수증 양식이 변경될 때 마다 데이터 하드코딩된 정제 방식을 수정하여 새로 배포해야함
    2. 신규 벤더의 영수증 양식을 추가할 때 마다 새로운 클래스를 설계해야함

* 요구사항
    1. Client-Side에서  정제 로직이 실행되어 Server-Side에 부담을 주지 않아야함
    2. 신규 벤더의 영수증 유형이 추가되더라도 새로운 클래스를 설계하지 않아야함
    3. 영수증 양식에 따라 데이터 정제 룰을 쉽게 수정 및 배포 가능해야함

* R&D 결과
    1. `json` 형식의 영수증 텍스트 정제 룰에 따라 스스로 정제 가능한 라이브러리 개발
    2. 해당 `json`을 서버에서 내려받아 Client 에서 실행되도록 개발
    3. 작게 조합하여 사용 가능한 정제 기능단위 Unit 개발
        * Trim
        * Replace
        * Split
        * Regex
        * Select Line
        * Search Text

* ![C#][Shield_csharp] ![.NETFramework][Shield_DotNetFramework]


### **(주)펍플**
---
* 2020.11 - 2022.04
* 솔루션개발팀
* 주임연구원

#### 6. 천재교과서
{:.no_toc}
---
* 2022.02 - 2022.04
* `PDF` to `EPUB` 컨버터 응용프로그램 개발
* 성능개선 및 고객사 요구사항에 맞춘 커스터마이징 기능 추가
* *'Adobe Illustrator'* 자동제어 스크립트를 활용한 <br/>
  EPUB 인터렉션(퀴즈, 선긋기 등) 생성기능 개발 및 커스터마이징
* **`Typescript` 도입**을 통한 인터렉션 생성 스크립트 **개발 생산성 개선**
* ![C#][Shield_csharp] ![.NETFramework][Shield_DotNetFramework] ![Winform][Shield_Winform] ![DevExpress][Shield_DevExpress] ![Javascript][Shield_Javascript] ![Typescript][Shield_Typescript]

#### 5. Bricks 출판사
{:.no_toc}
---
* 2021.08 - 2021.11
* `PDF` to `EPUB` 컨버터 응용프로그램 개발
* 성능개선 및 고객사 요구사항에 맞춘 커스터마이징 기능 추가
* *'Adobe Illustrator'* 자동제어 스크립트를 활용한 <br/>
  EPUB 인터렉션(퀴즈, 선긋기 등) 생성기능 개발 및 커스터마이징
* ![C#][Shield_csharp] ![.NETFramework][Shield_DotNetFramework] ![Winform][Shield_Winform] ![DevExpress][Shield_DevExpress] ![Javascript][Shield_Javascript]

#### 4. EPUB 컨버터 솔루션 
{:.no_toc}
---
* 2021.05 - 2022.03
* 자사 핵심 솔루션 `PDF` to `EPUB` 컨버터 응용프로그램 개발
* 핵심 솔루션을 전담하여 R&D, 유지보수를 담당
* 멀티쓰레드 방식 구현으로 자원 최대한 활용할 수 있도록 개선<br/>
  기존 솔루션 대비 ***300% 효율 상승***
* Database 및 AWS S3 연동하여 자동으로 Task를 할당하는 기능 개발
* PDF 정보 추출 기능 개발
    * 손실 없는 확대를 위한 도서 컨텐츠 텍스트 SVG 추출
    * 컨텐츠 내용 검색을 위한 텍스트 데이터 추출
    * Raster 이미지 추출 `png` `bmp` `jpg`
    * Vector 이미지 추출 `svg`
* PDF 에 조작을 가해 특정 정보만 담긴 PDF를 제작할 수 있는 기능 개발
* PDF 페이지를 EPUB 규격에 맞는 `xhtml`로 생성하는 기능 개발
* ![C#][Shield_csharp] ![.NETCore][Shield_DotNetCore] ![WPF][Shield_WPF] ![AwsS3][Shield_AwsS3] ![EntityFramwork][Shield_EntityFramework] ![Dapper][Shield_Dapper] ![RealmDB][Shield_RealmDB]

#### 3. 디딤돌 정부과제
{:.no_toc}
---
* 2021.05 - 2021.10
* 자사 자체 규격의 EPUB to [EPUB 3.0](https://www.w3.org/TR/epub-overview-33/) 마이그레이션 솔루션
* ![C#][Shield_csharp] ![.NETCore][Shield_DotNetCore] ![WPF][Shield_WPF]

#### 2. 방송통신대학교 모바일 어플리케이션
{:.no_toc}
---
* 2021.03 - 2021.08
* '방송대 eBook' 모바일 어플리케이션 개발
* 자사 모바일 솔루션 활용한 신규 개발 및 출시
* 출시 서비스 유지보수
* ![C#][Shield_csharp] ![.NETCore][Shield_DotNetCore] ![Xamarin][Shield_Xamarin] ![FirebaseFCM][Shield_FirebaseFCM]

#### 1. 펍플 이앨리스 모바일 솔루션
{:.no_toc}
---
* 2020.11 - 2021.03
* 자사 모바일 EPUB 뷰어 Application 개발
* MVVM Pattern 도입
* ![C#][Shield_csharp] ![.NETCore][Shield_DotNetCore] ![Xamarin][Shield_Xamarin] ![FirebaseFCM][Shield_FirebaseFCM]


### **피엘지**
---
* MES/ERP부서
* 2019.11 - 2020.11
* 사원

#### 6. 에스글로벌
{:.no_toc}
---
* 2020.07 - 2020.11
* 에스글로벌 ERP/MES 프로그램 개발
* ![C#][Shield_csharp] ![.NETFramework][Shield_DotNetFramework] ![Winform][Shield_Winform] ![DevExpress][Shield_DevExpress]

#### 5. 대진브로아
{:.no_toc}
---
* 2020.07 - 2020.11
* 대진브로아 PDA(Android) 생산공정 프로그램 개발
* ![C#][Shield_csharp] ![.NETCore][Shield_DotNetCore] ![Xamarin][Shield_Xamarin] ![SqlServer][Shield_SqlServer] 

#### 4. 노루페인트
{:.no_toc}
---
* 2020.04 - 2020.06
* 노루페인트 생산공정용 웹버전 MES 개발 및 SqlServer 프로시저 튜닝
* ![C#][Shield_csharp] ![.NETFramework][Shield_DotNetFramework] ![Webform][Shield_Webform] ![SqlServer][Shield_SqlServer] 

#### 3. 삼보팩
{:.no_toc}
---
* 2020.03 - 2020.08
* 삼보팩 PDA(Android) 생산공정 프로그램 개발
* ![C#][Shield_csharp] ![.NETCore][Shield_DotNetCore] ![Xamarin][Shield_Xamarin] ![SqlServer][Shield_SqlServer] 

#### 2. 자사 MES 솔루션 개발 프로젝트
{:.no_toc}
---
* 2020.02 - 2020.03
* 기존 자사 MES솔루션 마이그레이션<br/> 
  (`PowerBuilder` → `.NET Framework`)
* ![C#][Shield_csharp] ![.NETFramework][Shield_DotNetFramework] ![Winform][Shield_Winform] ![DevExpress][Shield_DevExpress] ![SqlServer][Shield_SqlServer] 

#### 1. 포스코케미칼 음극재 제2공장
{:.no_toc}
---
* 2019.11 - 2020.02
* MES 관리자시스템 개발
* ![C#][Shield_csharp] ![.NETFramework][Shield_DotNetFramework] ![Winform][Shield_Winform] ![DevExpress][Shield_DevExpress]


## **자기소개서**
---
[자기소개서로 이동](/Documents/Introduction/CV.html)




[Shield_csharp]: https://img.shields.io/badge/C%23-512BD4?style=flat&logo=csharp&logoColor=white

[Shield_SqlServer]: https://img.shields.io/badge/SqlServer-CC2927?style=flat&logo=microsoftsqlserver&logoColor=white

[Shield_xaml]: https://img.shields.io/badge/xaml-0C54C2?style=flat&logo=xaml&logoColor=white

[Shield_Typescript]: https://img.shields.io/badge/Typescript-3178C6?style=flat&logo=typescript&logoColor=white

[Shield_Javascript]: https://img.shields.io/badge/Javascript-F7DF1E?style=flat&logo=javascript&logoColor=white

[Shield_ASP.NET_Core]: https://img.shields.io/badge/ASP.NET%20Core-512BD4?style=flat&logo=.NET&logoColor=white

[Shield_DotNetFramework]: https://img.shields.io/badge/Framework-512BD4?style=flat&logo=.NET&logoColor=white

[Shield_DotNetCore]: https://img.shields.io/badge/Core-512BD4?style=flat&logo=.NET&logoColor=white

[Shield_Webform]: https://img.shields.io/badge/Webform-512BD4?style=flat&logo=.NET&logoColor=white

[Shield_WPF]: https://img.shields.io/badge/WPF-512BD4?style=flat&logo=.NET&logoColor=white

[Shield_Winform]: https://img.shields.io/badge/Winform-512BD4?style=flat&logo=.NET&logoColor=white

[Shield_EntityFramework]: https://img.shields.io/badge/EntityFramework-512BD4?style=flat&logo=.NET&logoColor=white

[Shield_PowerShell]: https://img.shields.io/badge/PowerShell-5391FE?style=flat&logo=powershell&logoColor=white

[Shield_Docker]: https://img.shields.io/badge/Docker-2496ED?style=flat&logo=Docker&logoColor=white

[Shield_GitHub]: https://img.shields.io/badge/GitHub-181717?style=flat&logo=GitHub&logoColor=white

[Shield_GitLab]: https://img.shields.io/badge/GitLab-FC6D26?style=flat&logo=GitLab&logoColor=white

[Shield_Postman]: https://img.shields.io/badge/Postman-FF6C37?style=flat&logo=Postman&logoColor=white

[Shield_VisualStudio]: https://img.shields.io/badge/VisualStudio-5C2D91?style=flat&logo=visualstudio&logoColor=white

[Shield_VisualStudioCode]: https://img.shields.io/badge/VisualStudioCode-007ACC?style=flat&logo=visualstudiocode&logoColor=white

[Shield_SSMS]: https://img.shields.io/badge/SSMS-CC2927?style=flat&logo=microsoftsqlserver&logoColor=white

[Shield_AzureDataStudio]: https://img.shields.io/badge/AzureDataStudio-0078D4?style=flat&logo=microsoftazure&logoColor=white

[Shield_Dapper]: https://img.shields.io/badge/Dapper-512BD4?style=flat&logo=.NET&logoColor=white

[Shield_DBeaver]: https://img.shields.io/badge/DBeaver-382923?style=flat&logo=dbeaver&logoColor=white

[Sheild_Supabase]: https://img.shields.io/badge/Supabase-3FCF8E?style=flat&logo=supabase&logoColor=white

[Shield_Git]: https://img.shields.io/badge/Git-F05032?style=flat&logo=git&logoColor=white

[Shield_SQLite]: https://img.shields.io/badge/SQLite-003B57?style=flat&logo=sqlite&logoColor=white

[Shield_Xamarin]: https://img.shields.io/badge/Xamarin-3498DB?style=flat&logo=xamarin&logoColor=white

[Shield_FirebaseFCM]: https://img.shields.io/badge/Firebase%20FCM-FFCA28?style=flat&logo=firebase&logoColor=white

[Shield_TortoiseSVN]: https://img.shields.io/badge/SVN-Tortoise-blue

[Shield_DevExpress]: https://img.shields.io/badge/DevExpress-FF7200?style=flat&logo=devexpress&logoColor=white

[Shield_AwsS3]: https://img.shields.io/badge/AWS%20S3-569A31?style=flat&logo=amazons3&logoColor=white

[Shield_RealmDB]: https://img.shields.io/badge/RealmDB-39477F?style=flat&logo=realm&logoColor=white

[Shield_Notion]: https://img.shields.io/badge/Notion-000000?style=flat&logo=notion&logoColor=white

[Shield_Asana]: https://img.shields.io/badge/Asana-F06A6A?style=flat&logo=asana&logoColor=white