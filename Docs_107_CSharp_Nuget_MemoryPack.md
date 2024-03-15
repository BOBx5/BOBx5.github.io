---
title: "[NuGet] MemoryPack"
description: <span>&#x23;CSharp &#x23;NuGet</span>
layout: libdoc/page

#LibDoc specific below
category: CSharp
order: 107
---
* 
{:toc}

## [Cysharp.MemoryPack](https://github.com/Cysharp/MemoryPack)
---
### 고성능(빠른) 직렬화 라이브러리
{:.no_toc}

* 클라이언트 ↔ 서버 간의 데이터 전송을 위한 Packet 형태의 직렬화 라이브러리
* Json, gRPC 등의 직렬화 방식보다 빠르다.
* C#쪽 전설적인 회사인 [Cysharp](https://github.com/Cysharp)의 라이브러리

### 직렬화 방식 비교
---
* **Json**
  * 장점
    * 가독성이 좋다.
  * 단점
    * 텍스트 기반이나 그로 인해 데이터가 크다
    * 트리구조로 인해 불필요한 반복 구조가 생긴다.

* **gRPC** (Google Protocol Buffer)
  * 장점
    * 대부분의 언어를 지원한다.
  * 단점
    * protobuf를 이용한 Packing/Unpacking의 번거로움이 있음

* **MemoryPack**
  * 장점
    * gRPC 보다 더 빠른 직렬화/역직렬화 속도
    * 바이너리 형태의 가벼운 데이터
  * 단점
    * C# 끼리만 가능하다

### MemoryPack
---
#### 1. 사양
---
  * .NET7 이상 추천
  * .NetStandard 2.1 이상 지원

#### 2. 직렬화 방식
---
  * 첫번째 바이트는 데이터 맴버의 갯수를 나타낸다.<br/>
    (ex: `Class`의 *Property* 갯수)
  * 1개의 Byte로 맴버의 갯수를 표현하기 때문에 최대 데이터 맴버 갯수는 256개

#### 3. 고성능인 이유
---    
`class`의 각 데이터 맴버(프로퍼티)를 접근하여 하나씩 직렬화하는 방식이 아닌<br/>
`class`의 메모리 주소로 접근하여 맴버들의 순서대로 직렬화하기 때문에 빠르다.

> JsonSerialize 대비 10~200배 이상의 속도
    
#### 4. 특징
---
  * 메모리팩 내부적으로 다른 메모리팩을 직렬화 할 수 있다.
  * 이를 활용해 `Header`와 `Body` 형태를 만들고, <br/>
    `Header` 쪽에 데이터 유형, ID, Body의 압축형태 등을 넣는 식으로 활용이 가능하다.

#### 5. 주의사항
---
  * 메모리 주소로 접근하여 직렬화 하기 때문에 **필드순서가 변경**되면 안된다.<br/>
  * 순서 변경이 곧 프로토콜이 변경이기 때문에 주의

#### 6. 사용방법
---
```csharp
var binary = MemoryPackSerializer.Serialize(
    new TestClass
    { 
        Name = "홍길동" 
    });
var obj = MemoryPackSerializer.Deserialize(binary);

[MemoryPackable]
public partial class TestClass
{
	public string Name { get; set; }
}
```