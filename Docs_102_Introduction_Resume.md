---
title: 이력서
description: 
layout: libdoc/page

#LibDoc specific below
category: Introduction
order: 102
---
* 
{:toc}

## **Personal Information**
---
* 박현우
* 1993년생 (만 31세)
* bapbapbapbapbap@gmail.com
* **5년차** *(2019년 11월 ~)*

## **Education**
---
* 한국폴리텍 4대학 대전캠퍼스
    * 전문학사(**초대졸**)
    * 정보통신시스템과
    * 2012.03 - 2020.02
    * 수상이력
        * 한국폴리텍 4대학 프로젝트 작품 경진대회 **`대상`**

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

* ETC

    ![Postman][Shield_Postman]<br/>
    ![FirebaseFCM][Shield_FirebaseFCM]<br/>
    ![DevExpress][Shield_DevExpress]<br/>
    ![Notion][Shield_Notion]<br/>
    ![Asana][Shield_Asana]<br/>

* Source Management

    ![Git][Shield_Git]<br/>
    ![GitHub][Shield_GitHub]<br/>
    ![GitLab][Shield_GitLab]<br/>
    ![TortoiseSVN][Shield_TortoiseSVN]<br/>

## **경력기술서**
---

### **스파이더크래프트**
---
* 2022.04 - 현재
* 개발1팀
* 전임연구원
* 자사 솔루션(가맹점PC, 대리점PC) 프로그램 기능개발 및 유지보수


#### 4. 외부벤더용 API 서버 개발
{:.no_toc}
---
복잡한 도메인의 유지보수성을 높이기 위해 <br/>
`Clean Architecture`를 도입한 ASP.NET WebAPI 연구개발을 진행하였다.
* ![C#][Shield_csharp] ![ASP.NET Core][Shield_ASP.NET_Core] ![EntityFramework][Shield_EntityFramework] ![SqlServer][Shield_SqlServer]

#### 3. 모듈화
{:.no_toc}
---
기존 Winform 프로젝트의 [*Bloated Long Class*](https://refactoring.guru/ko/smells/large-class) 로 인해<br/>
유지보수성 저하 문제를 해결하기 위해 모듈화 작업을 진행하였다.
* 각 Feature들을 인터페이스화를 이용한 추상화 적용
* *Windows XP* 지원을 위해 사용 중인 `.NET Framework` **`4.0`** 으로 인한 제약 해결
    * BCL의 *DependencyInjection* 미지원으로 인한 직접 구현
    * IoC Container 라이브러리 사용 불가능한 버전으로 유사한 기능 구현
* `Unit Test` 적용

* ![C#][Shield_csharp] ![.NETFramework][Shield_DotNetFramework]

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
    3. 작게 조합하여 사용 가능한 정제 기능을 Unit 단위로 개발
        * Trim
        * Replace
        * Split
        * Regex
        * Select Line
        * Search Text

* ![C#][Shield_csharp] ![.NETFramework][Shield_DotNetFramework]


### **펍플**
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
* *'Adobe 일러스트레이터'* 자동제어 스크립트를 활용한 <br/>
  EPUB 인터렉션(퀴즈, 선긋기 등) 생성기능 개발 및 커스터마이징
* **`Typescript` 도입**하여 통한 인터렉션 생성 스크립트 **개발 생산성 개선**
* ![C#][Shield_csharp] ![.NETCore][Shield_DotNetCore] ![Winform][Shield_Winform] ![DevExpress][Shield_DevExpress] ![Javascript][Shield_Javascript] ![Typescript][Shield_Typescript]

#### 5. Bricks 출판사
{:.no_toc}
---
* 2021.08 - 2021.11
* `PDF` to `EPUB` 컨버터 응용프로그램 개발
* 성능개선 및 고객사 요구사항에 맞춘 커스터마이징 기능 추가
* *'Adobe 일러스트레이터'* 자동제어 스크립트를 활용한 <br/>
  EPUB 인터렉션(퀴즈, 선긋기 등) 생성기능 개발 및 커스터마이징
* ![C#][Shield_csharp] ![.NETCore][Shield_DotNetCore] ![Winform][Shield_Winform] ![DevExpress][Shield_DevExpress] ![Javascript][Shield_Javascript]

#### 4. EPUB 컨버터 솔루션 
{:.no_toc}
---
* 2021.05 - 2022.03
* 자사 핵심 솔루션 `PDF` to `EPUB` 컨버터 응용프로그램 개발
* 핵심 솔루션을 전담하여 R&D, 유지보수를 담당
* 멀티쓰레드 방식 구현으로 자원 최대한 활용할 수 있도록 개선하여,<br/>
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
* 상용 서비스 유지보수
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
* ![C#][Shield_csharp] ![Winform][Shield_Winform] ![DevExpress][Shield_DevExpress]

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
* 노루페인트 MES 웹버전 개발 및 SQL Server SP튜닝
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
#### 효율 최대로!
{:.no_toc}
---
어느 분야에서든 "그냥 하라는대로 해", "시키는대로 해!" 보다는 비즈니스의 플로우와 그 원리를 알고 싶어합니다.
이러한 분석을 바탕으로 비즈니스 로직 개선하고 적용하여 '최대한 효율적으로 일하고 싶어!' 가 저의 기조인 것 같습니다. 저의 이러한 방식 때문에 때로는 윗선에서 '시키는대로 안한다', '하던대로 안하고 자기 마음대로 한다' 거나 하는 오해를 사는 경우도 종종 있는 것 있었으나 대부분의 경우 제 가치를 알아주시는 분들과 일할 수 있어서 좋았던 것 같습니다.

#### 막연한 개발자의 꿈!
{:.no_toc}
----
사실 개발자는 꽤 어린 시절부터 가지고 있던 꿈이였습니다. 
초등학교 시절 학원 수학 선생님이 말씀하신 "너는 DBA 같은게 어울리겠다" 라는 말에 
DBA가 뭔지 막연한 설명을 듣기는 했지만 꿈으로 삼기엔 너무나 어설픈 설명이였습니다. 
근데 왜 그땐 그 말이 그렇게 멋있고 두근거렸는지 잘 모르겠습니다. 
막연한 꿈을 쥐고서는 어떻게 해야할 지 몰랐고 고등학교 시절 학교 공부에 관심이 점점 사리지던 저는
개발자를 해보면 어떨까? 하는 마음에 졸라서 누나가 사준 C언어 책 한권을 보며
야자시간에 노트에 손코딩하고 집에서는 낡은 컴퓨터에 옮겨적고 나오는 쏟아져 나오는 오류를 보며
조금씩 고치고 나오는 그 별짓기 콘솔 창이 그렇게 좋았던 것 같습니다. 

#### 컴퓨터 의외로 나랑 잘 안맞을지도..?
{:.no_toc}
----
집안사정 상 사립대학은 못가고, 그렇다고 학교 공부에 관심이 없던 제 성적으로는 갈 수 있는 국립대학도 없었습니다.
그러다 어머니 지인분이 추천해신 전문대학 폴리텍. 마음도 없는 대학 홈페이지를 뒤적이며
그나마 가장 컴퓨터랑 관련 있을 것 같았던 '유비쿼터스 통신과' 를 지원했고 들어갔습니다.
그런데 왠걸... 들어가보니 컴퓨터랑 관련은 있는게 맞는데 이걸 어따쓰지 싶은 MPU와 지루한 임베디드 수업.
군번도 잊었는데 칩 이름도 안 잊어버립니다.. Atemga128...
그렇게 흥미없는 공부만 하다보니 제가 의외로 컴퓨터로 하는 무언가랑 잘 안맞는건가 싶었습니다.
학업과 알바도 병행하다보니 알바하는게 왜 그리 재밌던지... 
학교를 점점 안나가다가 결국 군대가겠다는 핑계로
휴학을 하고는 알바만 주구장창 했던 것 같습니다.
408 자


#### 몸으로 부딪히는 실무가 잘 맞아!
{:.no_toc}
----
여러가지 다양한 아르바이트를 해봤지만, 장기간 있었던 굵직한 것들만 말씀드리자면

1. 호프집 서빙 아르바이트

    20살 되자마자 알바를 시작해야했고, 학교 수업도 병행해야 했기에 
    제가 살던 동네에서 호프집에서 알바를 시작했습니다.
    별거 아닌 일이였지만 사장님이 일 잘한다고 참 좋아하셨습니다.
    가게 구석에서 '땡그랑~' 소리만 나도 '아~ 젓가락 흘리셨구나' 하고들고가서
    손님들이 호출벨 누르기 전에 갖다드려서 놀라신 적이 있었습니다.
    거의 1년 가까이 일하다 보니 사장님이 가게를 맡겨놓고 놀러가실 정도로 신뢰하셨고, 
    사장님이 바쁘신 날은 맡겨놓으신 열쇠로 혼자 문열고 영업을 시작하기도 하며 사실상 매니저처럼 근무하였습니다.
    그만둘 때 1달치를 더 넣어주신거 보고 '잘못 넣으신건가?' 했는데 지금 생각해보니 퇴직금 챙겨주신거더라구요.
    그 당시 저는 그때 퇴직금이란 말은 정년퇴직 때나 받는건 줄 알았습니다

2. 애슐리(뷔페 프랜차이즈) 주방 아르바이트

    사실 호프집 서빙 경험을 바탕으로 홀에 지원하려 하였으나,
    혹시 주방에서 근무해볼 생각이 없냐는 질문에 "그렇다"고 대답하는 바람에 
    식칼 한번 안잡아본 제가 덜컥 주방에 들어가게 되었습니다.
    다행히 시작은 중식팬을 굴려가며 웍질해야하는 핫파트로 들어갔습니다.
    언제나 바쁘게 움직이면서도 항상 주방을 둘러보며 부족한 재료는 없는지 점검해가며, 
    미리 처리할 수 있는 일들을 해나갔고 또한 바쁜 타이밍마다 빠른 판단력과 임기응변과 
    우선순위 파악 능력으로 수월하게 일을 해결해 나갔으며,
    덕분에 관리자들 사이에서 일머리가 좋다는 평가를 받았습니다.

#### 이... 입대!
{:.no_toc}
---
네... 그 시간이 되었습니다. 사실 알바하다 보면 영장이 올거라고 생각했지만,
생각보다 세상이 제 우유부단함을 잘 맞춰주다보니 미루기 그래서 일부러 군대를 신청해서 들어갔습니다.
14년 12월 입대로 신청하고, 신청 합격 되더라도 못해도 2주~3주 정도는 시간이 있겠지... 하고 있었는데
왠걸 합격여부 발표날 들어가보니 '10일 후 입대'.
얼떨떨함을 수습할 시간도 없이 급하게 알바 스케쥴 정리하고, 친척분들한테 인사하러 다니다가
전자시계 하나 살 시간이 없다가 집앞 문구점에서 짝퉁 카시오 시계를 하나 사서는 입대했습니다.


#### 군대!
{:.no_toc}
---
저는 인사행정병 특기를 받아 대대의 인사계원으로 복무하게 되었습니다.
'최대한 효율적으로 일하고 싶어!'가 기조인 저에게 군대는 쉽지 않은 곳이였습니다.
제 선임이 간단한 업무라고 인수인계 하던 일일명령서 작성 업무.
매일 수백줄에 달하는 일일명령서의 일자와 요일 부분을 선임은
오른손으로는 화살표키를, 왼손으로는 요일을 치는걸 보고 '와...나는 저렇게 못한다. 저렇게 하고싶지 않다.' 
라고 생각해서 부대내의 도서관에서 엑셀책을 찾아 읽고, 사이버지식정보방에서 
펑션 하나하나 찾아봐 가면서 공부해가며 인사과의 반복되는 다양한 업무를
엑셀시트로 바꿔나가며 자동화했습니다. 이때 군의 '인사정보체계' 라는것이 있었는데,
그곳에서 부대 내 병사 정보 목록을 필요한 항목(지금 생각해보면 컬럼)을 선택해서 
엑셀로 내려받을 수 있는 프로그램이 있었습니다.
그곳에서 내려받은 병사 정보를 지금와서 생각해보면 DB처럼 활용하여 여러 자동완성 엑셀양식을 만들었습니다.
중대/이름/기간 만 입력하면 자동으로 휴가증 양식이 완성되게 한다거나 그런것들을 많이 만들었습니다.
이때 절 이뻐하시던 인시과 간부님이 전문하사 해보지 않겠냐고 추천하셔서
6개월간 전문하사로 근무하였습니다. 좀 더 편하게 일할 수 있도록 해보고 싶었던 것들이 많았지만
군대의 인트라넷 특성 상 외부 프로그램을 도입할 수 없었고,
엑셀에만 의존하다 보니 그로 인한 한계들이 너무 분명했습니다.
이때의 경험으로 인해 DB의 필요성을 간접적으로 느끼지 않았나 싶습니다.

#### 전역은 했는데...
{:.no_toc}
---
17년 3월 전역 후 복학하고자 했으나 이미 시기는 놓쳤고, 중간학기에 복학하자니 
전문대 학교 커리큘럼 특성 상 1년단위로 끊지 않으면 애매하게 붕 뜨는 시스템이다 보니
이러지도 못하고 저러지도 못하던 시기였습니다.
제가 군대에 있는 동안 아버지께서 트럭을 구매하시어 푸드트럭 등을 해보시다가 
지역 행사장에서 완구 판매로 가닥을 잡아가시던 중이었습니다. 
그래서 이때 아버지와 함께 다니며 일을 도와드리면서 재미있는 경험을 많이 쌓았습니다.
원래도 숫기가 있는 편은 아니라 처음에는 사람들 앞에 서서 물건을 판다는게 굉장히 어색한 경험이였습니다.
처음에는 아버지 옆에 서서 쭈뼛쭈뼛 계산을 도와드리기만 했으나,
점차 아버지는 돌아다니시면서 완구를 시연하고 제가 점포에 앉아 판매하는 등 일이 손에 익기 시작했습니다.
나중에는 어린이날 행사에 참여하신다는 이야기를 듣고 냉커피/냉음료 같은 것을 팔면 잘 팔리지 않겠냐고 제안했고,
일반적인 방식이 아니라 사람들의 눈을 사로잡을 수 있는 아이디어를 내어 1m 짜리 맥주타워를 구매해 
커피/아이스티 등의 음료를 채워 판매했습니다.
그 외에도 가격책정(예: 1개 500원, 3개 천원) 같은 미묘한 부분이나 아이들의 눈길을 사로잡는
장난감 시연 등 '아~ 이런 게 마케팅이구나….' 라는 걸 간접적으로 느꼈습니다.
아버지와 함께한 시간도 좋았고, 저 자신도 평생 어디 가서 얻을 수 없는 경험이라고 생각되는 시간이었습니다.

#### 컴퓨터 의외로 나랑 잘 맞을지도..?
{:.no_toc}
----
제가 처음 입학했던 학과는 '유비쿼터스통신과' 였습니다.
복학하려고 하니 학과 이름이 `정보통신시스템과` 로 바뀌었고, 
학과 커리큘럼도 소프트웨어 위주로 바뀌에 되었습니다.
바뀐 커리큘럼이 제 적성에 맞았고 오히려 진로 선택을 어디로 해야할지 어려울 정도로 여러 수업들이 재미있었습니다.
재미도 있었고 열심히 노력한 결과 
2학년 1학기 4.23, 2학년 2학기 4.17 학점으로 학과 석차 3등으로 졸업할 수 있었습니다.
(직업 전문학교 특성 상 1, 2등은 선취업한 학생들이... ㅠㅠ)
가장 재미있게 했던 '프로젝트 실습'은 정해진 예산 안에서
아이디어 선정, 재료 선정, 예산 할당, 테스트, 실습일지 작성, 업무 분배 등을 모두 직접 해야하는 과목이었습니다.
다양한 아이디어를 취합하고 기능을 구현할 방법을 모색하였습니다.
단체 프로젝트를 진행하다보니 어쩔 수 없이 불필요한 인원들이 없지는 않았습니다.
한 학생은 영상편집을 주로 하였는데 밤에는 영상 편집 아르바이트를 하며
낮에는 학교에서 잠만 자는 학생이 있었는데 평소에 간단한 업무만 주고,
"대신에 너는 우리 프로젝트 소개 영상을 기똥차게 만들어야 한다"라고 하여
만든 소개영상을 제작하도록 하여 대회 때 차별성을 가질 수 있었습니다.
또 정말 기억에 남는 친구가 하나 있는데 이 친구는 매사 소극적고 적극성이 떨어지고, 잠이 많던 친구가 있었습니다.
평소에 적극성이 떨어져보여 '학교 생활에 큰 관심이 없는 친구구나' 라고 생각했는데,
자료조사를 요청하면서 '이러이러한 목적으로 이러한 뉘앙스의 뉴스기사가 필요해' 라고 간단하게 설명했는데
생각보다 너무 정확하게 의중을 파악하고 정말 적절한 자료를 찾아와 놀라기도 했습니다.
또한 프로젝트 진행 과정에서 이 친구가 계속 붙어서 필요한 도구를 건내주거나 음료를 가져다 주는 등
소극적인 모습 뒤에 남들이 알아보기 힘든 원석같은 친구구나 하는 경험도 있었습니다.
여러가지 에피소드와 우여곡절 그리고 팀원간의 시너지를 통해 프로젝트 작품 대회에서 대상을 탈 수 있었습니다.

#### 첫 번째 회사
{:.no_toc}
---
학교 교수님의 추천으로 '피엘지'에 입사하게 되었습니다. 
WinForm + DevExpress 를 사용한 MES 솔루션을 납품하는 회사로
CRUD 기능을 SP(StoredProcedure)로 작성해두고 솔루션 프로그램에서 해당하는
SP에 파라미터와 함께 호출하는 방식의 솔루션을 갖고있던 회사였습니다.
다양하고 난이도 있는 SP를 직접 작성하면서 데이터베이스와 쿼리에 대해 체득하였습니다.
그러던 중 회사에서 운영하던 Xamarin을 이용한 모바일 솔루션을 인수인계 받게 되었는데,
인수인계 받으면서 사수가 MVVM 방식으로 구현되어 있다면서 이게 중요하기는 한데
자기도 잘 모르겠다~ 라며 넘겨준 솔루션은 View/ViewModel/Model 구조의 디렉토리만 있었습니다.
뭔가 비즈니스 로직이 View에도 조금, ViewModel 조금, Model 조금 흩어져 있어서
'이게... MVVM인건가?' 라는 의문으로 시작하여 여기저기 질문해보고 찾아보며
'아, 회사 현재 폴더만 MVVM이지 전혀 아니구나;;' 라는 것을 깨닫고
저 혼자 주도적으로 MVVM 패턴으로 솔루션을 리팩토링하였습니다.
단순한 절차지향 코드 방식만 알던 저에게 디자인패턴이라는 걸 알게해준 계기였던 것 같습니다.

#### 두 번째 회사
{:.no_toc}
---
Xamarin, MVVM 등을 공부하면서 가입하게 된 카카오톡 오픈톡방에서 Xamarin을 이용한 모바일 개발 인력을
구한다는 이야기를 듣고 연락하였고 입사 제안을 받아 '펍플'로 이직하게 되었습니다.
처음 맡게된 직무는 모 출판사에서 사용할 모바일 EPUB 뷰어 어플리케이션 개발이였습니다.
Xamarin을 활용하여 어플리케이션을 개발하여 방송통신대학교 에 상용 서비스 중인 
어플리케이션으로서 납품하기도 하였습니다.

해당 솔루션을 활용하여 다른 모바일 프로젝트를 진행하던 중 갑자기 무산되며 업무가 없던 저에게
한 부장님이 회사의 핵심 솔루션인 'PDF to EPUB 컨버터 솔루션(이하 컨버터)'이 C#으로 개발되어 있어서
제가 맡아볼 생각이 있냐? 라고 하셔서 해당 솔루션을 담당하게 되었습니다.
기존 컨버터에 이런 용도, 저런 용도로 파편화되어 개발된 다양한 소스들을
분석한 뒤 제어 화면설계 및 기능들을 직접 기획해가며 WPF를 사용한 하나의 통합 솔루션으로 묶었습니다.
또한 고객사에 자동변환 워커 형태로 제공하기 위해서 여러가지들을 도입해야 했는데,
이때 다양한 라이브러리 등을 다음과 같은 것들을 사용해볼 수 있는 기회가 되었습니다.
- EF(Entity Framework), Dapper 등의 ORM을 통한 데이터베이스 제어
- Ghostscript 를 통한 PostScript 문서(ex.PDF) 제어
- Sqlite, Realm 를 이용한 소규모 로컬DB 사용
- Amazon S3 를 이용한 멀티쓰레드 파일 업로드/다운로드 기능 개발
- WPF의 MVVM패턴 위한 Converter, Behavior 등의 라이브러리 개발
- 멀티쓰레드 제어를 통한 스케쥴링 처리 및 병렬작업 처리
- Typescript를 이용한 Adobe 일러스트레이터 자동제어 매크로 생성기 개발

처음부터 끝까지 제 손이 닿지 않은 곳이 없는 제 자식 같은 솔루션이였고,
제가 많은 것들을 배울 수 있도록 한 솔루션이였지만,
아쉽게도 회사의 부도로 인해 퇴사하게 되었습니다.

---




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