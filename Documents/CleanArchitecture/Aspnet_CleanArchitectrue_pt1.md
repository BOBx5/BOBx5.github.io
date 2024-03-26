---
title: "1. 클린아키텍처의 이해와 솔루션 설계하기"
description: <span>&#x23;ASP.NET &#x23;CleanArchitecture</span>
layout: libdoc/page

#LibDoc specific below
category: CleanArchitecture
order: 901
---
* 
{:toc}

[.NET Conf 2024](https://dotnetconf.kr/2024) - '[클린아키텍처로 이사가기](https://dotnetconf.kr/e43c01da2c1c4a0d8ecdb3ca9e5753ce)'

발표 경험을 바탕으로 문서로 정리해보고자 합니다.

# 클린아키텍처란?
---
![](/assets/Documents/CleanArchitecture/)
* *DDD(Domain-Driven-Deisgn)* 을 적용하기 위한 방법론
* 몇가지 상속 등에 관한 엄격한 원칙(*Principle*)을 제외하고는 많은 부분이 자유로움
  * 오히려 모호하기 때문에 가이드라인이 불분명하고 어려움


# 클린아키텍처의 목표
---
* OOP(Object-Oriented-Programming)
  * 원칙을 준수하느 것으로 완성되는 자연스러운 객체지향
* Encapsulation
  * 끊임없이 진화하고 변하는 도메인 영역
  * 이러한 변경사항으로 캡슐화를 통해 영향범위를 최소화
* Choose and Focus
  * 여러가지 작업을 멀티태스킹 하지 않고 집중할 수 있는 구조
  * 각각의 객체들이 가진 `역할`과 `책임`에만 집중하여 개발
  * 분명해진 객체들을 조합하여 만드는 `협력`의 구현
* Flexibility
  * 변경에 대한 대응력을 바탕
  * 다양한 디자인 패턴들의 유기적인 조합
* Testability
  * 각각의 레이어와 객체들이 가진 경계선(*Boundary*)을 통해 테스트 도입의 용의성

# 사용할 패키지
---
* EntityFrameworkCore
  * 닷넷 최고존엄 ORM
* MediatR
  * 각각의 객체들이 가진 `역할`과 `책임`에만 집중할 수 있도록 돕는 파이프라인 도구
* FluentValidation
  * 지저분한 `Attribute`를 통한 유효성 검사를 대체
  * 글 쓰듯 자연스러운 유효성 검사 구현

# 디자인패턴
---
* Aggregate Pattern
  * 응집력(*Cohesion*)이 높은 Domain의 설계
* CQRS(Command Query Responsibility Segregation) Pattern
  * `Command` 와 `Query` 를 분리하여 각각의 역할에 집중
  * `Command` : 변경사항을 처리 (*write/update/remove*)
  * `Query` : 데이터를 조회 (*readonly*)
* Repository Pattern
  * Repository의 인터페이스화를 통한 경계선(*Boundary*)의 명확화
  * Buisness Logic을 영속성(*Persistence*)과 분리
* UnitOfWork Pattern
  * 여러 개의 구분된 Repository의 저장을 하나의 트랜잭션으로 처리
  * Repository와 저장을 기능적으로 분리하여, CRQS 구분에 따른 `Command`와 `Query`의 분리를 보완

# 샘플 예제
---
[![](https://mermaid.ink/img/pako:eNqrVkrOT0lVslJKL0osyFAIcVGIyVMAgtf9LW9a5rza0qCgq2sH5WGTeTNnwZsFDVj19DS8mb4GIqOko5SbWpSbmJkCtKkaJBajVJKRmpsao2QFZKYkFmXHKMXk1QLVJZaW5AdX5iUrWZUUlabqKJUWpCSWpLpkJgIdmKtklZaYUwwXdU3JLMkvgqksSMxTsqpWqlCyMjIz1DO1NLcwNTI0s7C0MDU201GqVLIy0zM2MjIAIWMLU0MLE5NaHaWq_HygqYY6Sqlgs3whgQEOE7CJUWB5kAW1AHveaQU?type=png)](https://mermaid-js.github.io/mermaid-live-editor/edit#pako:eNqrVkrOT0lVslJKL0osyFAIcVGIyVMAgtf9LW9a5rza0qCgq2sH5WGTeTNnwZsFDVj19DS8mb4GIqOko5SbWpSbmJkCtKkaJBajVJKRmpsao2QFZKYkFmXHKMXk1QLVJZaW5AdX5iUrWZUUlabqKJUWpCSWpLpkJgIdmKtklZaYUwwXdU3JLMkvgqksSMxTsqpWqlCyMjIz1DO1NLcwNTI0s7C0MDU201GqVLIy0zM2MjIAIWMLU0MLE5NaHaWq_HygqYY6Sqlgs3whgQEOE7CJUWB5kAW1AHveaQU)

`도서관`을 솔루션 형태로 만들고자 한다.<br/>
각각의 필요한 `Use-Case`를 정의하면 다음과 같이 정의할 수 있을 것이다.
* 도서관(Library): 솔루션
* 도서 `Book`
  * 조회
  * 생성
  * 수정
  * 삭제
* 유저 `User`
  * 조회
  * 생성
  * 수정
  * 삭제
* 대여 `Rent`
  * 조회
  * 대여
  * 연장
  * 반납

# 솔루션 설계하기
---

## 솔루션 및 프로젝트 구조
---
먼저 VisualStudio에서 `LibrarySolution` 솔루션을 생성한다.

### 1. Shared Project
---
```plaintext 
Library
  └─ Library.Shared
     ├─ Helpers
     └─ Extensions
```
솔루션 하위에 `Library.Shared` 프로젝트를 생성한다.

`Library.Shared` 프로젝트는 도메인과 무관하게 

모든 프로젝트에서 공유되는 유틸리티성 코드(*Helper*,  *Extensions* 등)를 담당한다.

### 2. Domain Project
---
```plaintext
Library
  ├─ Library.Shared
  └─ Library.Domain
```
솔루션 하위에 `Library.Domain` 프로젝트를 생성한다.

`Library.Domain` 프로젝트는 도메인의 정의와 도메인의 규칙들을 담당하는 CleanArchitecture의 핵심, 심장부라고 할 수 있다.

### 3. Application Project
---
```plaintext
Library
  ├─ Library.Shared
  ├─ Library.Domain
  └─ Library.Application
```
솔루션 하위에 `Library.Application` 프로젝트를 생성한다.

`Library.Application` 프로젝트는 도메인에 정의된 `역할`과 `책임`을 기본으로
`협력` 을 작성하여 `Use-Case`들을 구현하는 프로젝트이다.

또한 이러한 `Use-Case`들을 구현하기 위한 **기능들에 집중** 여러가지 **인터페이스**들을 정의한다.


### 4. Infrastructure Project
---
```plaintext
Library
  ├─ Library.Shared
  ├─ Library.Domain
  ├─ Library.Application
  └─ Library.Infrastructure
```
솔루션 하위에 `Library.Infrastructure` 프로젝트를 생성한다.

`Library.Infrastructure` 프로젝트는 `Library.Application` 프로젝트에서 
정의된 여러가지 인터페이스들을 실질적으로 구현하는 역할을 한다.

#### 4.1. Persistence
---
```plaintext
Library
  ├─ Library.Shared
  ├─ Library.Domain
  ├─ Library.Application
  └─ Library.Infrastructure
     └─ Library.Infrastructure.Persistence
```
`Library.Infrastructure.Persistence` 프로젝트는 데이터의 영속성을 담당한다.

영속성이란 유저가 `Use-Case`를 통해 변경한 데이터를 실질적으로 저장하는 역할을 한다.

* 데이터베이스
  * RDB(Relational Database)
  * NoSQL
* 데이터 캐싱
  * In-Memory Cache
  * Distributed Cache (Redis)

등을 담당하여 맡아 처리한다.

특징적이라고 하면 이러한 영속성 관련 작업의 처리는 철저히 Persistence 내부로 Encapsulation 하여,
명확하게 경계선(*Boundary*)을 설정하여 외부에서는 단순히 **`interface`**만을 통해 데이터의 영속성을 처리할 수 있도록 한다.


### 5. Presentation Project
---
```plaintext
Library
  ├─ Library.Shared
  ├─ Library.Domain
  ├─ Library.Application
  ├─ Library.Infrastructure
  └─ Library.Presentation
     └─ Library.Presentation.WebApi
     or
     └─ Library.Presentation.MVC
```
솔루션 하위에 `Library.Presentation` **디렉토리**를 먼저 생성하고,
그 아래에는 프로젝트의 필요에 따라 `Library.Presentation.WebApi` 또는 `Library.Presentation.MVC` 프로젝트를 생성한다.

`Library.Presentation` 프로젝트는 사용자와의 상호작용을 담당하는 레이어이다.
대표적인 ASP.NET 에서의 `Controller`로 대변될 수 있겠다.

MVC로 구현하고자 하는 경우 부가적으로 `View`의 설계가 필요할 수 있겠지만,
대부분의 `Use-Case`들이 Application Layer 에서 구현되는 만큼,
아주 얇은 `View`의 구현에만 신경 쓸 수 있을 것이다.

# 다음 단계
---
[2. Domain Layer 설계하기](/Documents/CleanArchitecture/Aspnet_CleanArchitectrue_pt2.html)