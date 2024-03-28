---
title: "2. Domain Layer"
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

> 💡 다음과 같은 예시로 `DomainEvent`들을 소비할 수 있다.
> * 새로운 유저가 가입이 완료된 경우 <br/>
=> <i>유저에게 가입을 환영하는 이메일을 보내기</i>
>   1. Domain: `UserCreatedDomainEvent` 발생
>   2. Application: 환영 이메일을 생성하여 `IEmailService`의 Queue에 등록
>   3. Infrastructure: `EmailService`가 Queue에 등록된 이메일을 전송
> * 유저가 도서를 대여하는 경우 <br/>
=> <i>유저에게 문자/카카오톡 등을 이용해 반납기한을 안내한다.</i>
>   1. Domain: `UserRentedBookDomainEvent` 발생
>   2. Application: 반납기한을 안내하는 메시지를 생성하여 `ISmsService`/`IKakaotalkService`의 Queue에 등록
>   3. Infrastructure: `MessageService`가 Queue에 등록된 메시지를 전송


# **실제 설계**
---
다시 실질적인 프로젝트 설계로 돌아가보자

## **Primitives**
```plaintext
Library
  ├─ Library.Shared
  └─ Library.Domain
     └─ Primitives
```

먼저 `Library.Domain` 프로젝트 아래에 *Primitives* 라는 디렉토리를 만듭니다.

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
public abstract class DomainEvent : MediatR.INotification
{
  public Guid EventId { get; }
  protected DomainEvent()
  {
      EventId = Guid.NewGuid();
  }
}
```
* *MediatR*의 `INotification`을 상속받아, MediatR를 통해 `INotificationHandler`가 이벤트를 소비할 수 있도록 합니다.
* `abstract` 클래스로서, 모든 `DomainEvent`들의 기본이 되는 클래스이며 반드시 상속을 통해서만 구현할 수 있도록 제약합니다.
* `Guid EventId` 프로퍼티를 *protected*된 생성자를 통해 생성하여,
  모든 `DomainEvent`들은 생성되는 시점에 고유한 `EventId`를 부여받도록 합니다.




## **Aggregates**
---

먼저 Aggregate Pattern을 적용한 `User`를 Aggregate로 정의해봅시다.

### User.cs
```plaintext
Library
  ├─ Library.Shared
  └─ Library.Domain
     ├─ Primitives
     └─ Aggregates
        └─ Users
          └─ Entities*
            └─ User.cs*
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

### UserStatus.cs
유저의 상태값을 나타내는 `UserStatus` Enum을 정의해봅시다.

```plaintext
Library
  ├─ Library.Shared
  └─ Library.Domain
     ├─ Primitives
     └─ Aggregates
        └─ Users
          └─ Entities
          └─ Enums*
            └─ UserStaus.cs*
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

### UserCreatedDomainEvent.cs
유저가 생성되었음을 알리는 도메인 이벤트를 만들어봅시다.
```plaintext
Library
  ├─ Library.Shared
  └─ Library.Domain
     ├─ Primitives
     └─ Aggregates
        └─ Users
          └─ Entities
          └─ Enums
          └─ DomainEvents*
            └─ UserCreatedDomainEvent.cs*
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

### IUserRepository.cs
```plaintext
Library
  ├─ Library.Shared
  └─ Library.Domain
     ├─ Primitives
     └─ Aggregates
        └─ Users
          └─ Entities
          └─ Enums
          └─ DomainEvents
          └─ Repositories
            └─ IUserRepository.cs*
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

### User Entity 기능 정의
---
`User` 엔티티가 가지는 기능들을 정의해봅시다.<br/>
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

#### 기능1. 신규 유저의 생성
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
1. **`private User(string name, string email)`**
  * 새로운 유저를 생성하는 생성자
  * `private` 한정자를 적용하여 `new` 키워드를 이용해 엔티티 외부에서의 생성을 불가능하도록 막습니다.
  * `Id`를 생성자 내부에서 생성하여 외부에서 입력받지 않도록 합니다.
2. **`public static User Create(string name, string email)`**
  * 도메인 외부에서 신규 유저를 생성할 수 있도록 정적 메서드를 제공합니다.
  * 메서드 내부적으로 `2.` 를 통해서 인스턴스를 생성하여 반환합니다.
  * 사용 예시
    ```csharp
    string name = "홍길동";
    string email = "Gildong.Hong@gmail.com"
    var user = User.Create(name, email);
    ```

>  **`private User() { }`** <br/> <br/>
> EntityFramework 에서 `User` 인스턴스를 생성하기 위해서는 <br/>
> 파라미터가 없는 반드시 기본 생성자가 필요합니다.<br/>


#### 기능2. 유저의 이름 변경
---
```csharp
public void ChangeName(string name)
{
  Name = name;
}
```
`Name` 프로퍼티는 외부에서 수정하지 못하도록 `private set` 으로 캡슐화되어 수정이 불가능합니다.

외부에서 `User`의 `Name`을 변경할 수 있도록 제공하는 메서드입니다.


#### 기능3. 유저의 상태값 변경
---
```csharp
public void ChangeStatus(UserStatus userStatus)
{
  UserStatus = userStatus;
}
```
`UserStatus` 프로퍼티 역시 `private set` 으로 캡슐화되어 수정있기 불가능합니다.

따라서 외부에서 `User`의 `UserStatus`를 변경할 수 있도록 제공하는 메서드입니다.

## **Book Aggregates**
---
`User` *Aggregate* 엔티티를 만든 방법과 유사하게

동일하게 도서를 나타내는 `Book` *Aggregate* 엔티티를 만들어봅시다.

### Book.cs
```plaintext
Library
  ├─ Library.Shared
  └─ Library.Domain
     ├─ Primitives
     └─ Aggregates
        ├─ Users
        └─ Books
          └─ Entities*
            └─ Book.cs*
```
```csharp
public class Book : EntityBase, IAggregateRoot
{
  public Guid Id { get; private set; }
  public string Title { get; private set; }
  public string Author { get; private set; }
  public int Quantity { get; private set; }

  // EF를 위한 Parameterless 생성자
  private Book() { }

  // 신규 도서의 생성을 위한 생성자
  private Book(string title, string author, int quantity)
  {
    Id = Guid.NewGuid();
    Title = title;
    Author = author;
    Quantity = quantity;
  }

  // 도서를 신규로 생성할 수 있도록 하는 Factory Method
  public static Book Create(string title, string author, int quantity)
  {
    return new Book(title, author, quantity);
  }
}
```

### IBookRepository.cs
```plaintext
Library
  ├─ Library.Shared
  └─ Library.Domain
     ├─ Primitives
     └─ Aggregates
        ├─ Users
        └─ Books
          └─ Entities
          └─ Repositories*
            └─ IBookRepository.cs*
```
```csharp
namespace Library.Domain.Aggregates.Books.Repositories;

public interface IBookRepository
{
  Task<Book> GetByIdAsync(Guid id);
  Task AddAsync(Book book);
  Task UpdateAsync(Book book);
  Task RemoveAsync(Book book);
}
```


`User` 와 유사한 방식으로 `Book` 엔티티를 만들었다.

특징적으로 `User`, `Book` 모두 `Guid`를 고유 식별자(ID)로 사용하고 있다.

문제는 이런 ID 값들은 혼용의 여지가 있다.<br/>
(*`Guid`가 아니라 `int`, `long` 등에서도 마찬가지*)

이러한 문제를 해결하기 위해 Strongly-Type 객체인 `ValueObject` 개념을 도입해보자.


## **Rent Aggregates**
---
동일하게 '대여'를 나타내는 `Rent` *Aggregate* 엔티티를 만듭니다

### Rent.cs
```plaintext
Library
  ├─ Library.Shared
  └─ Library.Domain
     ├─ Primitives
     └─ Aggregates
        ├─ Users
        ├─ Books
        └─ Rents
          └─ Entities*
            └─ Rent.cs*
```
```csharp
public class Rent : EntityBase, IAggregateRoot
{
  public Guid Id { get; private set; }
  public Guid BookId { get; private set; }
  public Guid UserId { get; private set; }
  public DateTime BorrowedAt { get; private set; }
  public DateTime DueDate { get; private set; }
  public DateTime? ReturnedAt { get; private set; }
  public bool IsReturned => ReturnedAt.HasValue;

  // EF를 위한 Parameterless 생성자
  private Rent() { }

  // 기본 대여 기간 (14일)
  const int DefaultBorrowPeriod = 14;

  // 신규 대여의 생성을 위한 생성자
  private Rent(Guid bookId, Guid userId, DateTime borrowedAt)
  {
    Id = Guid.NewGuid();
    BookId = bookId;
    UserId = userId;
    BorrowedAt = borrowedAt;
    DueDate = borrowedAt.AddDays(DefaultBorrowPeriod);
  }

  // 대여를 신규로 생성할 수 있도록 하는 Factory Method
  public static Rent Create(Guid bookId, Guid userId, DateTime borrowedAt)
  {
    return new Rent(bookId, userId, borrowedAt);
  }

  // 대여 연장
  public void Extend(int? days = null)
  {
    DueDate = DueDate.AddDays(days ?? DefaultBorrowPeriod);
  }

  // 반납
  public void Return(DateTime returnedAt)
  {
    ReturnedAt = returnedAt;
  }
}
```

### IRentRepository.cs
```plaintext
Library
  ├─ Library.Shared
  └─ Library.Domain
     ├─ Primitives
     └─ Aggregates
        ├─ Users
        └─ Rents
          └─ Entities
          └─ Repositories*
            └─ IRentRepository.cs*
```
```csharp
namespace Library.Domain.Aggregates.Rents.Repositories;

public interface IRentRepository
{
  Task<Rent> GetByIdAsync(Guid id);
  Task AddAsync(Rent book);
  Task UpdateAsync(Rent book);
  Task RemoveAsync(Rent book);
}
```

## 짚고 넘어가기

자, 이렇게 **유저**, **도서**, **대여** 세가지의 개념이 모두 정의되었습니다.

1. Entity의 생성자를 *private*으로 만들고 생성을 위한 Factory Method를 정의하여, 캡슐화된 인스턴스의 생성에 대해 이해할 수 있었습니다.

2. `UserStatus` Enum을 통해 엔티티에 필요한 상태값을 정의할 수 있는 것을 배웠습니다.

3. `UserCreatedDomainEvent`를 통해 도메인에서 발생하는 이벤트를 정의할 수 있는 것을 배웠습니다.

4. `User`, `Book`, `Rent` 엔티티를 위한 각각의 Repository Interface를 정의할 수 있는 것을 배웠습니다.

5. 마지막으로 `Rent` 엔티티를 통해 각각의 다른 *Aggregate* 간에 서로간의 구현에 대해서는 모른체 ID만을 적용한 얕은 참조관계를 설계하는 방법을 배웠습니다.

> 💡 **Guid의 혼용 문제**
>
> 현재 `Rent` 엔티티는 스스로의 ID인 *Guid* 타입의 `Id`와 `BookId`, `UserId`를 프로퍼티로 지니고 있습니다.
> 
> 문제는 모두 동일한 *Guid* 타입으로 구현되어 있어, 이후 파라미터의 순서가 변경된다거나 하는 경우에 혼용할 가능성이 발생하거나.
>
> `BookId` 또는 `UserId`가 다중키로 변경되거나 하는 것들에 의해 프로퍼티를 추가해야하는 변경사항이 발생할 수 있습니다.
>
> 이러한 변화는 `Rent` 엔티티의 변경을 초래하게 되고, 이는 `Rent` 엔티티의 변경이 다른 *Aggregate*에 영향을 미치게 됩니다.
>
> 이러한 변화는 캡슐화된 설계에 위배되는 것이며, 이를 해결하기 위해 **ValueObject**를 도입해보도록 합시다.



## **ValueObject**
---
*ValueObject*는 Immutable한 객체로, 객체의 상태를 변경할 수 없고, 두 객체가 동일한 값을 가지면 동일한 객체로 취급되는 객체입니다.

`Guid`, `int`, `long`, `double` 등이 이에 해당되나 이러한 기본 타입들은 도메인의 의미를 나타내지 못하므로, 이를 랩핑하여 도메인 의미를 지니는 *ValueObject*를 만드는 것이 좋습니다.

이전에는 *ValueObject*를 만들기 위해 `struct`를 사용하거나,

class `IEquatable<T>` 인터페이스를 구현하여 `Equals` 메서드를 오버라이딩하는 등의 방법을 사용해야 했는데,

C# 9.0 부터는 생긴 [*record*](https://learn.microsoft.com/ko-kr/dotnet/csharp/fundamentals/types/records) 키워드를 통해 손쉽게 Immutable한 객체를 만들 수 있게 되었습니다.

먼저 유저의 ID를 나타내는 `UserId`를 만들어봅시다.

### UserId
---
* UserId.cs

  ```plaintext
  Library
    ├─ Library.Shared
    └─ Library.Domain
      ├─ Primitives
      └─ Aggregates
          ├─ Books
          ├─ Rents
          └─ Users
            ├─ Entities
            ├─ Enums
            ├─ Repositories
            └─ ValueObjects*
              └─ UserId.cs*
  ```
  ```csharp
  public record UserId
  {
    public Guid Value { get; init; }
    private UserId(Guid value)
    {
      Value = value;
    }
    public override string ToString()
    {
      return Value.ToString();
    }

    public static UserId Create()
    {
      var newId = Guid.NewGuid();
      return new UserId(newId);
    }
    public static UserId Parse(Guid value)
    {
      return new UserId(value);
    }
  }
  ```

* `User`에 적용

  ```csharp
  public class User : EntityBase, IAggregateRoot
  {
    public UserId Id { get; private set; }
    public string Name { get; private set; }
    public string Email { get; private set; }
    public UserStatus UserStatus { get; private set; }

    // EF를 위한 Parameterless 생성자
    private User() { }

    // 신규 유저의 생성을 위한 생성자
    private User(string name, string email)
    {
      Id = UserId.Create();
      Name = name;
      Email = email;
      UserStatus = UserStatus.Active;
      Raise(new UserCreatedDomainEvent(name, email));
    }

    // 유저를 신규로 생성할 수 있도록 하는 Factory Method
    public static User Create(string name, string email)
    {
      return new User(name, email);
    }
  }
  ```

### BookId
---
* BookId.cs

  ```plaintext
  Library
    ├─ Library.Shared
    └─ Library.Domain
      ├─ Primitives
      └─ Aggregates
          ├─ Users
          ├─ Rents
          └─ Books
            ├─ Entities
            ├─ Repositories
            └─ ValueObjects*
              └─ BookId.cs*
  ```
  ```csharp
  public record BookId
  {
    public Guid Value { get; init; }
    private BookId(Guid value)
    {
      Value = value;
    }
    public override string ToString()
    {
      return Value.ToString();
    }

    public static BookId Create()
    {
      var newId = Guid.NewGuid();
      return new BookId(newId);
    }
    public static BookId Parse(Guid value)
    {
      return new BookId(value);
    }
  }
  ```
* `Book`에 적용

  ```csharp
  public class Book : EntityBase, IAggregateRoot
  {
    public BookId Id { get; private set; }
    public string Title { get; private set; }
    public string Author { get; private set; }
    public int Quantity { get; private set; }

    // EF를 위한 Parameterless 생성자
    private Book() { }

    // 신규 도서의 생성을 위한 생성자
    private Book(string title, string author, int quantity)
    {
      Id = BookId.Create();
      Title = title;
      Author = author;
      Quantity = quantity;
    }

    // 도서를 신규로 생성할 수 있도록 하는 Factory Method
    public static Book Create(string title, string author, int quantity)
    {
      return new Book(title, author, quantity);
    }
  }
  ```

### RentId
---
* RentId.cs  

  ```plaintext
  Library
    ├─ Library.Shared
    └─ Library.Domain
      ├─ Primitives
      └─ Aggregates
          ├─ Users
          ├─ Books
          └─ Rents
            ├─ Entities
            ├─ Repositories
            └─ ValueObjects*
              └─ RentId.cs*
  ```
  ```csharp
  public record RentId
  {
    public Guid Value { get; init; }
    private RentId(Guid value)
    {
      Value = value;
    }
    public override string ToString()
    {
      return Value.ToString();
    }

    public static RentId Create()
    {
      var newId = Guid.NewGuid();
      return new RentId(newId);
    }
    public static RentId Parse(Guid value)
    {
      return new RentId(value);
    }
  }
  ```
* `Rent`에 적용

  ```csharp
  public class Rent : EntityBase, IAggregateRoot
  {
    public RentId Id { get; private set; }
    public BookId BookId { get; private set; }
    public UserId UserId { get; private set; }
    public DateTime BorrowedAt { get; private set; }
    public DateTime DueDate { get; private set; }
    public DateTime? ReturnedAt { get; private set; }
    public bool IsReturned => ReturnedAt.HasValue;

    // EF를 위한 Parameterless 생성자
    private Rent() { }

    // 기본 대여 기간 (14일)
    const int DefaultBorrowPeriod = 14;

    // 신규 대여의 생성을 위한 생성자
    private Rent(BookId bookId, UserId userId, DateTime borrowedAt)
    {
      Id = RentId.Create();
      BookId = bookId;
      UserId = userId;
      BorrowedAt = borrowedAt;
      DueDate = borrowedAt.AddDays(DefaultBorrowPeriod);
    }

    // 대여를 신규로 생성할 수 있도록 하는 Factory Method
    public static Rent Create(BookId bookId, UserId userId, DateTime borrowedAt)
    {
      return new Rent(bookId, userId, borrowedAt);
    }

    // 대여 연장
    public void Extend(int? days = null)
    {
      DueDate = DueDate.AddDays(days ?? DefaultBorrowPeriod);
    }

    // 반납
    public void Return(DateTime returnedAt)
    {
      ReturnedAt = returnedAt;
    }
  }
  ```

### 팁
---
> C# 12.0의 최신 문법 중 [*Primary-Constructor*](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/proposals/csharp-12.0/primary-constructors)를 활용하면 더욱 간단한게 만들 수도 있습니다.
> ```csharp
> public record UserId(Guid Value)
> {
>   public static UserId Create() => new(Guid.NewGuid());
>   public static UserId Parse(Guid value) => new(value);
>   public override string ToString() => Value.ToString();    
> }
> public record BookId(Guid Value)
> {
>   public static BookId Create() => new(Guid.NewGuid());
>   public static BookId Parse(Guid value) => new(value);
>   public override string ToString() => Value.ToString();    
> }
> public record RentId(Guid Value)
> {
>   public static RentId Create() => new(Guid.NewGuid());
>   public static RentId Parse(Guid value) => new(value);
>   public override string ToString() => Value.ToString();    
> }
> ```

### 요약
---
이로써 `User`, `Book`, `Rent` 엔티티는 모두 내부적으로 *Guid*를 ID로 사용하는지만,

`UserId`, `BookId`, `RentId` *record class* 로 랩핑된 *ValueObject*가 되어

서로 다른 엔티티의 ID간에는 다른 타입으로 취급되므로 개발과정에서 혼용을 방지할 수 있게 되었습니다.

```csharp
var userId = UserId.Create();
var bookId = BookId.Create();
Console.WriteLine(userId == bookId); // 컴파일 에러 발생
```

또한 필요에 따라 특정 엔티티의 ID가 다중키를 사용해야하도록 변경이 필요한 경우에도

해당하는 *ValueObject* 내부적으로만 변경사항이 한정되어, 다른 엔티티에 영향을 미치지 않도록 할 수 있습니다. ***(Propagate 방지)***


# **종합**
---
* ***Entity***
  * 상태(프로퍼티)들을 `private set` 으로 외부에서 수정이 불가능하도록 하도록 합니다.
  * 엔티티의 상태값들을 변경할 수 있는 메서드를 엔티티 클래스 내부적으로 구현하여 노출하도록 합니다.

* ***ValueObject***
  * `record` 키워드를 사용하여 Immutable한 ID 객체를 생성합니다.
  * *Guid*를 ID로 사용하는 엔티티들에 각기 다른 *ValueObject*를 설계하여 사용하여, 혼용을 방지합니다.
  * *ValueObject*의 생성과 변환을 온전하게 *ValueObject* 클래스 내부적으로 구현된 *static* 메서드(`Create()`, `Parse()`)를 통해 캡슐화될 수 있도록 합니다.

> 💡 **Encapsulation** 을 통한 변경의 전파(*Propagate*)를 방지하는것이 핵심!

# 다음 단계
---
[3. Application Layer](/Documents/CleanArchitecture/Aspnet_CleanArchitecture_pt3.html)