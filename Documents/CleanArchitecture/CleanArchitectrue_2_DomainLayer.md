---
title: Domain Layer 설계
description: <span>&#x23;ASP.NET &#x23;CleanArchitecture</span>
layout: libdoc/page

#LibDoc specific below
category: CleanArchitecture
order: 902
---
* 
{:toc}

# **Domain Layer 설계**
---
* Clean Architecture의 핵심이자 심장
* 여러 비즈니스 로직들을 만들기 위한 개념들을 설계하는 곳
* 외부적인 문제들로부터 완전히 손을 뗀 아주 **도도한 레이어**
  * 외부적인 문제들
    * *'DB에 저장은 어떻게 해야하지?'*
    * *'유저가 가입되면 환영 메일을 보내야 하는데 어떡하지?'*
*  **공용어**(*Universal Language*)를 만드는 곳
   * 개발자 뿐만 아니라 기획자, 디자이너,테스터가 모두 이곳에서 정의한 네이밍을 통해 소통하게 한다.
   * 이러한 공용어를 통해 도메인 전문가와의 소통이 원활하고 효율적으로 이뤄지도록 돕는다.

# **짚고 넘어가야할 개념들**
---

## Aggregate
응집성(*Cohesion*)을 가진 객체들의 집합으로, 하나의 Aggregate는 하나의 루트(*Root*)를 가집니다.

이러한 Aggregate는 데이터 처리에 있어 하나의 단위처럼 사용됩니다.

다만, Clean Architecture에 필수적인 개념은 아니고 필요와 선택에 따라 사용해도 되고 사용하지 않아도 됩니다.


## Entitiy
여러분의 도메인에 존재하는 실제 객체를 나타내는 클래스이다.

현재 예제에서는 대표적으로 도서(`Book`), 유저(`User`), 대여(`Rent`)가 이에 해당합니다.


## DomainEvent
도메인에서 발생하는 이벤트를 나타내는 클래스이다.

이러한 `DomainEvent` 들은 하위 레이어에서 처리되어 다양한 기능들을 수행할 수 있는 먹이(?)가 됩니다.

다음과 같은 예시로 이러한 `DomainEvent`들을 소비할 수 있다.
* 새로운 유저가 가입이 완료된 경우 => *유저에게 가입을 환영하는 이메일을 보내기*
  1. Domain: `UserCreatedDomainEvent` 발생
  2. Application: 환영 이메일을 생성하여 `IEmailService`의 Queue에 등록
  3. Infrastructure: `EmailService`가 Queue에 등록된 이메일을 전송
* 유저가 도서를 대여하는 경우 => *유저에게 문자/카카오톡 등을 이용해 반납기한을 안내한다.*
  1. Domain: `UserRentedBookDomainEvent` 발생
  2. Application: 반납기한을 안내하는 메시지를 생성하여 `ISmsService`/`IKakaotalkService`의 Queue에 등록
  3. Infrastructure: `MessageService`가 Queue에 등록된 메시지를 전송


# **실제 설계**
---
다시 실질적인 프로젝트 설계로 돌아가보자

## **Primitives**
```plaintext
LibrarySolution
  ├─LibrarySolution.Shared
  └─LibrarySolution.Domain
     └─Primitives
```

먼저 `LibrarySolution.Domain` 프로젝트 아래에 *Primitives* 라는 디렉토리를 만듭니다.

`Primitives` 는 도메인 레이어의 다양한 객체들의 설계를 위한 기본 `class` 또는 `interface`들을 모아놓는 디렉토리입니다.

### IAggregateRoot
```csharp
namespace Library.Domain.Primitives;
public interface IAggregateRoot
{
}
```
* `IAggregateRoot`는 이를 상속받는 `Entity`가 자신이 *Aggregate-Root*라는 속성만을 나타내는
별도의 기능(메서드)가 없는 *Marker-Interface* 입니다.

### EntityBase
```csharp
namespace Library.Domain.Primitives;
public abstract class EntityBase
{
  private readonly List<DomainEvent> _domainEvents = new();
  protected EntityBase() { }

  public ICollection<DomainEvent> GetDomainEvents() 
      => _domainEvents;

  protected void Raise(DomainEvent domainEvent) 
      => _domainEvents.Add(domainEvent);

  public void ClearDomainEvents() 
      => _domainEvents.Clear();
}
```
* `abstract` 클래스로서, 모든 Entity들의 기본이 되는 클래스이며 반드시 상속을 통해서만 구현할 수 있도록 제약한다.
* `DomainEvent`를 발생시키고, 이를 저장하는 기능을 제공할 수 있도록 기능을 제공한다
  * `List<DomainEvent> _domainEvents` 필드를 통해 발생한 `DomainEvent`들을 저장가능한 컬렉션을 제공합니다.
  * `Raise` 메서드를 통해 `DomainEvent`를 발생시키고, 이를 `_domainEvents`에 저장합니다.
  * `GetDomainEvents()` 메서드를 통해 엔티티에 저장된 `DomainEvent`들을 외부에서 접근할 수 있도록 합니다.
  * `ClearDomainEvents()` 메서드를 통해 이미 처리된 `DomainEvent`들을 외부에서 삭제할 수 있도록 합니다.

### DomainEvent
```csharp
namespace Library.Domain.Primitives;
public abstract class DomainEvent
{
  public Guid EventId { get; }
  protected DomainEvent()
  {
      EventId = Guid.NewGuid();
  }
}
```
* `abstract` 클래스로서, 모든 `DomainEvent`들의 기본이 되는 클래스이며 반드시 상속을 통해서만 구현할 수 있도록 제약합니다.
* `Guid EventId` 프로퍼티를 *protected*된 생성자를 통해 생성하여,
  모든 `DomainEvent`들은 생성되는 시점에 고유한 `EventId`를 부여받도록 합니다.




## **Aggregates**
---

먼저 Aggregate Pattern을 적용한 `User`를 Aggregate로 정의해봅시다.

### User
```plaintext
LibrarySolution
  ├─LibrarySolution.Shared
  └─LibrarySolution.Domain
     ├─Primitives
     └─Aggregates
        └─Users
          └─Entities*
            └─User.cs*
```
*Aggregates* 디렉토리 아래 *Users* 디렉토리를 생성합니다.

그 다음 *Users* 디렉토리 아래 *Entities* 디렉토리를 생성하고, `User.cs` 를 생성합니다.

```csharp
namespace Library.Domain.Aggregates.Users.Entities;
public class User : EntityBase, IAggregateRoot
{
  public Guid Id { get; private set; }
  public string Name { get; private set; }
  public string Email { get; private set; }
  public UserStatus Status { get; private set; }
}
```
* `User`는 `EntityBase`를 상속받습니다.
* `IAggregateRoot`를 상속하여 *Aggregate-Root*임을 나타냅니다.
* `User` 엔티티는 `Id`를 통해 식별되며, 아래와 같은 프로퍼티들을 가집니다.
  * `string` `Name`
  * `string` `Email`
  * `UserStatus` `Status`  
* 프로퍼티들을 `private set`으로 한정하여 엔티티 내부에서만 상태값을 변경할 수 있도록 합니다. <i>~~Encapsulation~~</i>

### UserStatus
유저의 상태값을 나타내는 `UserStatus` Enum을 정의해봅시다.

```plaintext
LibrarySolution
  ├─LibrarySolution.Shared
  └─LibrarySolution.Domain
     ├─Primitives
     └─Aggregates
        └─Users
          └─Entities
          └─Enums*
            └─UserStaus.cs*
```
*Users* 디렉토리 아래 *Enums* 디렉토리를 생성하고, `UserStatus.cs`를 생성합니다.
```csharp
namespace Library.Domain.Aggregates.Users.Enums;
public enum UserStatus
{
    /// <summary>일시정지</summary>
    Suspended = 0,

    /// <summary>활동</summary>
    Active = 1,

    /// <summary>정지</summary>
    Stop = 2,
}
```
최종적으로 데이터베이스에 저장되는 시점에는 `int`또는 `long`로 저장되겠지만,
위에 언급한 바처럼 도메인 레이어는 **도도한** 레이어이므로 신경쓰지 않고,
`int`가 아닌 `enum` 형태로만 항상 취급되도록 되어야 합니다.

### UserCreatedDomainEvent
유저가 생성되었음을 알리는 도메인 이벤트를 만들어봅시다.
```plaintext
LibrarySolution
  ├─LibrarySolution.Shared
  └─LibrarySolution.Domain
     ├─Primitives
     └─Aggregates
        └─Users
          └─Entities
          └─Enums
          └─DomainEvents*
            └─UserCreatedDomainEvent.cs*
```
```csharp
namespace Library.Domain.Aggregates.Users.DomainEvents;
public class UserCreatedDomainEvent : DomainEvent
{
  public string Name { get; }
  public string Email { get; }
  public UserCreatedDomainEvent(string name, string email)
  {
      Name = name;
      Email = email;
  }
}
```
* `UserCreatedDomainEvent`는 `DomainEvent`를 상속받습니다. <br/>
  (`DomainEvent`의 `protected DomainEvent()` 생성자를 통해 고유의 `EventId`를 부여받습니다.)
* `Name`과 `Email` 데이터를 포함해 유저가 생성되었을 때 환영하는 이메일을 보낼 수 있도록 합니다.

### IUserRepository
```plaintext
LibrarySolution
  ├─LibrarySolution.Shared
  └─LibrarySolution.Domain
     ├─Primitives
     └─Aggregates
        └─Users
          └─Entities
          └─Enums
          └─DomainEvents
          └─Repositories
            └─IUserRepository.cs
```
```csharp
namespace Library.Domain.Aggregates.Users.Repositories;
public interface IUserRepository
{
  Task<User> GetByIdAsync(Guid id);
  Task<User> GetByEmailAsync(string email);
  Task AddAsync(User user);
  Task UpdateAsync(User user);
  Task RemoveAsync(User user);
}
```
* `User` 엔티티를 저장하고 조회하는 기능을 정의한 인터페이스입니다.
* 기능은 다음과 같습니다.
  * `GetByIdAsync(Guid id)`: `Id`를 통해 `User`를 조회합니다.
  * `GetByEmailAsync(string email)`: `Email`을 통해 `User`를 조회합니다.
  * `AddAsync(User user)`: 신규 생성된 `User`를 추가합니다.
  * `UpdateAsync(User user)`: 변경된 유저의 상태값을 수정합니다.
  * `RemoveAsync(User user)`: 선택한 유저를 제거합니다.
* 실질적 구현은 추후에 *Persistence* 에서 이뤄지도록 미뤄두고 인터페이스만 먼저 정의합니다.

## User
**User Entity**가 가지는 기능들을 정의해봅시다.<br/>
아래는 현재 상태의 User Entity입니다.
```csharp
namespace Library.Domain.Aggregates.Users.Entities;
public class User : EntityBase, IAggregateRoot
{
  public Guid Id { get; private set; }
  public string Name { get; private set; }
  public string Email { get; private set; }
  public UserStatus UserStatus { get; private set; }
}
```

### 신규 유저의 생성
---
```csharp
public User(Guid guid, string name, string email)
{
  Id = guid;
  Name = name;
  Email = email;
  UserStatus = UserStatus.Active;
  Raise(new UserCreatedDomainEvent(name, email));
}
```
`User` 엔티티를 생성할 때
1. `Id`, `Name`, `Email`를 외부에서 입력받은 값으로 초기화 합니다.
2. `UserStatus`를 활성화(`Active`) 상태로 초기화합니다.
3. `UserCreatedDomainEvent`를 발생시킵니다.

이러한 방식의 `new` 키워드 + *생성자*는 기본적인 인스턴스 생성 방식이지만 다음과 같은 단점이 있습니다.

* 현재 `User` 인스턴스의 생성이 어떤 목적인지 명확하지 않습니다.
  * Database에서 불러와 기존에 있던 유저를 Instance화 시키는 행위인지 (***SELECT***)
  * 새로운 유저를 생성하는 행위인지 (***INSERT***)
  
그래서 다음과 같은 방식으로 변경합니다.
```csharp
private User() { }
private User(string name, string email)
{
  Id = Guid.NewGuid();
  Name = name;
  Email = email;
  UserStatus = UserStatus.Active;
  Raise(new UserCreatedDomainEvent(name, email));
}
public static User Create(string name, string email)
{
  var user = new User(name, email);
  return user;
}
```
1. `private User() { }`
  * 기존 유저의 Instance화를 위한 생성자 (EF Core에서 사용됨)
2. `private User(string name, string email)`
  * 새로운 유저를 생성하는 생성자
  * `private` 한정자를 적용하여 `new` 키워드를 이용해 엔티티 외부에서의 생성을 불가능하도록 막습니다.
  * `Id`를 생성자 내부에서 생성하여 외부에서 입력받지 않도록 합니다.
3. `public static User Create(string name, string email)`
  * 도메인 외부에서 신규 유저를 생성할 수 있도록 정적 메서드를 제공합니다.
  * 메서드 내부적으로 `2.` 를 통해서 인스턴스를 생성하여 반환합니다.
  * 사용 예시
    ```csharp
    string name = "홍길동";
    string email = "Gildong.Hong@gmail.com"
    var user = User.Create(name, email);
    ```


### 유저의 이름 변경
---
```csharp
public void ChangeName(string name)
{
  Name = name;
}
```
`Name` 프로퍼티는 외부에서 수정하지 못하도록 `private set` 으로 캡슐화되어 수정이 불가능합니다.

외부에서 `User`의 `Name`을 변경할 수 있도록 제공하는 메서드입니다.


### 유저의 상태값 변경
---
```csharp
public void ChangeStatus(UserStatus userStatus)
{
  UserStatus = userStatus;
}
```
`UserStatus` 프로퍼티 역시 `private set` 으로 캡슐화되어 수정있기 불가능합니다.

따라서 외부에서 `User`의 `UserStatus`를 변경할 수 있도록 제공하는 메서드입니다.

### 결론
---
* `User`의 프로퍼티들을 `private set` 으로 외부에서 수정이 불가능하도록 제한합니다.
* 외부에서 `User`의 상태값을 변경할 수 있도록 제공하는 메서드를 통해 변경할 수 있도록 합니다.
* `User`의 생성은 `User.Create` 메서드를 통해 생성할 수 있도록 합니다.

위와 같은 요소들을 통해 Entity에 대한 *Encapsulation*을 구현합니다.