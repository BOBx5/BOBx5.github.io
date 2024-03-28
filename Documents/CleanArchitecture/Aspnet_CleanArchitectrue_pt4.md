---
title: "4. Infrastructure Layer"
description: <span>&#x23;ASP.NET &#x23;CleanArchitecture</span>
layout: libdoc/page

#LibDoc specific below
category: CleanArchitecture
order: 904
---
* 
{:toc}

# **Infrastructure Layer 설계**
---
하위 레이어인 Application Layer을 추상화(*Interface*)한 정의들을 실질적으로 작동할 수 있도록 구현(*Impelment*)하는 단계입니다.

```plaintext
Library
├─ Library.Shared
├─ Library.Domain
├─ Library.Application
└─ Library.Infrastructure*
```

먼저, 솔루션에 Infrastructure Layer를 추가할 디렉토리를 만든 후 
간단하게 시스템의 기준 시간을 제공하는 `IDateTimeProvider` 인터페이스를 구현해봅니다.

# **DateTimeProivider**
---

## 디렉토리 구성
```plaintext
Library
├─ Library.Shared
├─ Library.Domain
├─ Library.Application
└─ Library.Infrastructure
    └─ Library.Infrastructure.DateTimeProvider
```

Infrastructure 디렉토리 아래 `Library.Infrastructure.DateTimeProvider` 프로젝트를 생성 후 Application Layer 프로젝트를 참조합니다.

## DateTimeProvider.cs
그 다음 프로젝트 루트 경로에 `DateTimeProvider.cs` 파일을 생성합니다.
```plaintext
Library
├─ Library.Shared
├─ Library.Domain
├─ Library.Application
└─ Library.Infrastructure
    └─ Library.Infrastructure.DateTimeProvider
        └─ DateTimeProvider.cs*
```
```csharp
using Library.Application.Interfaces;

namespace Library.Infrastructure.DateTimeProvider;
public class DateTimeProvider : IDateTimeProvider
{
    public DateTime Now => DateTime.Now;
    public DateTime UtcNow => DateTime.UtcNow;
}
```

## DependencyInjection.cs
그 다음 DI를 위해 `DependencyInjection.cs` 파일을 생성합니다.
```plaintext
Library
├─ Library.Shared
├─ Library.Domain
├─ Library.Application
└─ Library.Infrastructure
    └─ Library.Infrastructure.DateTimeProvider
        └─ DateTimeProvider.cs*
```
```csharp
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
public static class DependencyInjection
{
    public static IServiceCollection AddDateTimeProvider(
        this IServiceCollection services, IConfiguration configuration)
    {
        services.AddSingleton<IDateTimeProvider, DateTimeProvider>();
        return services;
    }
}
```

## Dependency Injection
`program.cs` 에서는 아래와 같은 간단한 호출로 등록하여 가능합니다.
```csharp
builder.Services.AddDateTimeProvider(builder.Configuration);
```

이로써 시스템 기준시간 정보를 제공하는 서비스 구현이 완료되었습니다.

현재는 단순하게 OS의 시스템 시간을 제공하는 기능이지만, 추후에는 외부 API(NTP 등)를 연동하여 정확한 시간을 제공하는 기능으로 확장할 수 있습니다.

이후에 구현하는 Infrastructure Layer의 구현체들도 마찬가지로 Application Layer의 Interface를 구현하는 방식하고 DI하는 방식으로 진행합니다.


# **Persistence 설계**
---
* Persistence는 이름의 뜻 그대로 데이터의 영속성을 담당하는 레이어로데이터베이스 및 캐싱 등을 담당하는 핵심적인 부분입니다.
* Application Layer에서 정의한 `IApplicationDbContext`와 `IUnitOfWork`를 구현합니다.
* Domain Layer에서 설계한 Entity를 어떤 방식으로 저장하게 될지 결정합니다.
  * Cache
    * No-Cache
    * In-Memory (*IMemoryCache*)
    * Distributed (*StackExchange.Redis*)
  * DB
    * Relational (*SQLServer, MySQL, PostgreSQL*)
    * NoSQL (*MongoDB, Cassandra*)
  * ORM
    * EntityFrameworkCore
    * Dapper

이번 예제에서는 *SQLServer, EntityFrameworkCore*만을 사용하여 구현할 예정이고,

추후 캐싱 처리 등에 대해서는 별도로 다룰 예정입니다.

## 디렉토리 및 프로젝트 구성
---
```plaintext
Library
├─ Library.Shared
├─ Library.Domain
├─ Library.Application
└─ Library.Infrastructure
    ├─ Library.Infrastructure.DateTimeProvider
    └─ Library.Infrastructure.Persistence*
```
1. *Library.Infrastructure* 솔루션 디렉토리 아래 *Library.Infrastructure.Persistence* 프로젝트를 생성합니다.

2. *Persistence* 프로젝트에 *EntityFrameworkCore*를 사용하기 위해 다음의 NuGet 패키지들을 설치합니다 
   * [Microsoft.EntityFrameworkCore](https://www.nuget.org/packages/Microsoft.EntityFrameworkCore)
   * [Microsoft.EntityFrameworkCore.Design](https://www.nuget.org/packages/Microsoft.EntityFrameworkCore.Design)
   * [Microsoft.EntityFrameworkCore.SqlServer](https://www.nuget.org/packages/Microsoft.EntityFrameworkCore.SqlServer)

## **ApplicationDbContext**
---
```plaintext
Library
├─ Library.Shared
├─ Library.Domain
├─ Library.Application
└─ Library.Infrastructure
    ├─ Library.Infrastructure.DateTimeProvider
    └─ Library.Infrastructure.Persistence
        └─ ApplicationDbContext.cs*
```
먼저 *Persistence* 프로젝트 루트 경로에 `ApplicationDbContext.cs` 파일을 생성하고,

생성자를 통해 *ApplicationDbContext*를 사용하기 위한 서비스들을 주입받습니다.

```csharp
using Microsoft.EntityFrameworkCore;

namespace Library.Infrastructure.Persistence;
public class ApplicationDbContext 
{
    private readonly IPublisher _publisher;
    private readonly IDateTimeProvider _dateTimeProvider;
    public ApplicationDbContext(
        IPublisher publisher,
        IDateTimeProvider dateTimeProvider)
    {
        _publisher = publisher;
        _dateTimeProvider = dateTimeProvider;
    }
}
```

### DbContext 
---
```csharp
using Microsoft.EntityFrameworkCore;

namespace Library.Infrastructure.Persistence;
public class ApplicationDbContext 
    : DbContext
{
    private readonly IPublisher _publisher;
    private readonly IDateTimeProvider _dateTimeProvider;
    public ApplicationDbContext(
        DbContextOptions<ApplicationDbContext> options,
        IPublisher publisher,
        IDateTimeProvider dateTimeProvider) 
        : base(options)
    {
        _publisher = publisher;
        _dateTimeProvider = dateTimeProvider;
    }
}
```
*Microsoft.EntityFrameworkCore*의 `DbContext`를 상속합니다.

그 다음 생성자에서 `DbContextOptions`를 주입받고,

`DbContext`의 기본 생성자에 넘겨주어 `DbContext`를 초기화합니다. (`: base(options)`)

### IApplicationDbContext
---
```csharp
using Microsoft.EntityFrameworkCore;

namespace Library.Infrastructure.Persistence;
public class ApplicationDbContext 
    : DbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<Book> Books { get; set; }
    public DbSet<Rent> Rents { get; set; }

    private readonly IPublisher _publisher;
    private readonly IDateTimeProvider _dateTimeProvider;
    public ApplicationDbContext(
        DbContextOptions<ApplicationDbContext> options,
        IPublisher publisher,
        IDateTimeProvider dateTimeProvider) 
        : base(options)
    {
        _publisher = publisher;
        _dateTimeProvider = dateTimeProvider;
    }
}
```
Application Layer의 `IApplicationDbContext`를 상속합니다.

`IApplicationDbContext`의 `DbSet<User>`, `DbSet<Book>`, `DbSet<Rent>`와 

EF의 `DbContext`의 `DbSet<T>`간의 다형성을 이용하여, 

`ApplicationDbContext`에 `DbSet<T>`을 선언합니다.

> **IApplicationDbContext**
> ```csharp
> public interface IApplicationDbContext
> {
>     DbSet<User> Users { get; set; }
>     DbSet<Book> Books { get; set; }
>     DbSet<Rent> Rents { get; set; }
>     DatabaseFacade Database { get; }
> }
> ```


### IUnitOfWork
---
```csharp
using Microsoft.EntityFrameworkCore;
using Library.Application.Interfaces;

namespace Library.Infrastructure.Persistence;
public class ApplicationDbContext 
    : DbContext, IApplicationDbContext, IUnitOfWork
{
    DbSet<User> Users { get; set; }
    DbSet<Book> Books { get; set; }
    DbSet<Rent> Rents { get; set; }
    DatabaseFacade Database { get; }
    
    private readonly IPublisher _publisher;
    private readonly IDateTimeProvider _dateTimeProvider;
    public ApplicationDbContext(
        DbContextOptions<ApplicationDbContext> options,
        IPublisher publisher,
        IDateTimeProvider dateTimeProvider)
        : base(options)
    {
        _publisher = publisher;
        _dateTimeProvider = dateTimeProvider;
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken)
    {
        ...
    }
}
```

마지막으로 Application Layer의 `IUnitOfWork`를 상속하여, 저장할 수 있도록 구현합니다.

*override*로 처리되는 이유는 EF의 `DbContext`에서 `SaveChangesAsync`가 있고,

`IUnitOfWork`에도 `SaveChangesAsync`가 있기 때문에, `DbContext`의 `SaveChangesAsync`를 `IUnitOfWork`의 `SaveChangesAsync`로 오버라이드하여 구현합니다.

이제 실질적으로 데이터를 저장하는 `SaveChangesAsync`를 구현해봅시다.

1. 먼저, 도메인 엔티티에 등록된 도메인 이벤트들을 가져옵니다.

    ```csharp
    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken)
    {
        // 1.
        List<DomainEvent> domainEvents = this.ChangeTracker.Entries<EntityBase>()
            .Select(e => e.Entity)
            .Where(e => e.DomainEvents.Any())
            .SelectMany(e => 
            {
                var events = e.GetDomainEvents().ToList();
                e.ClearDomainEvents();
                return events;
            });
    }
    ```


2. 엔티티의 변경사항을 데이터베이스에 저장합니다.

    ```csharp
    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken)
    {
        // 1.
        List<DomainEvent> domainEvents = this.ChangeTracker.Entries<EntityBase>()
            .Select(e => e.Entity)
            .Where(e => e.DomainEvents.Any())
            .SelectMany(e => 
            {
                var events = e.GetDomainEvents().ToList();
                e.ClearDomainEvents();
                return events;
            });
        
        // 2. 
        int result = await base.SaveChangesAsync(cancellationToken);
    }
    ```

3. 이벤트들을 처리하는 담당 *EventHandler*들이 처리할 수 있도록, 도메인 이벤트를 발행합니다.

    ```csharp
    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken)
    {
        // 1.
        List<DomainEvent> domainEvents = this.ChangeTracker.Entries<EntityBase>()
            .Select(e => e.Entity)
            .Where(e => e.DomainEvents.Any())
            .SelectMany(e => 
            {
                var events = e.GetDomainEvents().ToList();
                e.ClearDomainEvents();
                return events;
            });

        // 2. 
        int result = await base.SaveChangesAsync(cancellationToken);

        // 3.
        foreach (var domainEvent in domainEvents)
        {
            await _publisher.Publish(domainEvent);
        }

        return result;
    }
    ```

이로써 `ApplicationDbContext`의 `SaveChangesAsync`가 완성되었습니다.

> 💡**사실은 잘못된 예제**
>
> 이벤트를 발행하는 방식 중 *Optimistic* 방식과 *Pessimistic* 방식이 있습니다.
>
> **Optimistic** 방식은 **낙관적**의미 그대로 트랜잭션 처리가 정상적으로 처리 될것이라 예상하여, 트랜잭션 처리 후 이벤트를 발행하는 방식입니다.
>
> **Pessimistic** 방식은 **비관적**의미 그대로 트랜잭션 처리가 정상적으로 처리 되지 않을 수 있는 것을 상정하여, 트랜잭션 처리 전 이벤트를 발행하는 방식입니다.
>
> 위 예제는 **Optimistic** 방식으로 **Pessimistic** 방식으로 구현하기 위해서는 **`2.`**와 **`3.`**의 순서만 변경하면 됩니다.
>
> 다만, 두가지 방법 모두 이벤트 발행 중 *Exception* 발생에 대해 매우 취약한 구조를 지니고 있습니다.
>
> 이를 보완하여 각각의 이벤트들을 독립적으로 처리할 수 있는 ***Outbox-Pattern*** 에 대해서는 이후에 소개하도록 하겠습니다.

## **Repository**
---
이제 도메인 레이어에 정의되어있는 Repository를 구현해봅시다.

먼저 UserRepository를 구현해보겠습니다.

### UserRepository

1. 먼저 Persistence 프로젝트 루트 경로에 *Repositories* 디렉토리를 생성합니다.

    ```plaintext
    Library
    ├─ Library.Shared
    ├─ Library.Domain
    ├─ Library.Application
    └─ Library.Infrastructure
        └─ Library.Infrastructure.DateTimeProvider
        └─ Library.Infrastructure.Persistence
            └─ ApplicationDbContext.cs
            └─ Repositories*
    ```
2. *Repositories* 디렉토리에 `UserRepository.cs` 를 생성합니다.
    
    ```plaintext
    Library
    ├─ Library.Shared
    ├─ Library.Domain
    ├─ Library.Application
    └─ Library.Infrastructure
        ├─ Library.Infrastructure.DateTimeProvider
        └─ Library.Infrastructure.Persistence
            ├─ ApplicationDbContext.cs
            └─ Repositories
                └─ UserRepository.cs*
    ```
3. `IUserRepository`를 상속받습니다.

    ```csharp
    using Library.Application.Interfaces;
    using Library.Domain.Aggregates.Users.Entities;
    using Library.Domain.Aggregates.Users.Repositories;
    using Microsoft.EntityFrameworkCore;

    namespace Library.Infrastructure.Persistence.Repositories;
    public class UserRepository : IUserRepository
    {
        private readonly DbSet<User> _users;
        public UserRepository(IApplicationDbContext context)
        {
            _users = context.Users;
        }
    }
    ```
    > ***IUserRepository***
    > ```csharp
    > namespace Library.Domain.Aggregates.Users.Repositories;
    > public interface IUserRepository
    > {
    >   Task<User> GetByIdAsync(UserId userId);
    >   Task<User> GetByEmailAsync(string email);
    >   Task AddAsync(User user);
    >   Task UpdateAsync(User user);
    >   Task RemoveAsync(User user);
    > }
    > ```
    
4. 생성자에서 통해 `IApplicationDbContext`를 주입받고, `DbSet<User>`을 필드로 선언합니다.

    ```csharp
    using Library.Application.Interfaces;
    using Library.Domain.Aggregates.Users.Entities;
    using Library.Domain.Aggregates.Users.Repositories;
    using Microsoft.EntityFrameworkCore;

    namespace Library.Infrastructure.Persistence.Repositories;
    public class UserRepository : IUserRepository
    {
        private readonly DbSet<User> _users;
        public UserRepository(IApplicationDbContext context)
        {
            _users = context.Users;
        }
    }
    ```

5. `IUserRepository`의 메서드를 구현합니다.

    ```csharp
    using Library.Application.Interfaces;
    using Library.Domain.Aggregates.Users.Entities;
    using Library.Domain.Aggregates.Users.Repositories;
    using Microsoft.EntityFrameworkCore;

    namespace Library.Infrastructure.Persistence.Repositories;
    public class UserRepository : IUserRepository
    {
        private readonly DbSet<User> _users;
        public UserRepository(IApplicationDbContext context)
        {
            _users = context.Users;
        }

        public virtual async Task<User> GetByIdAsync(UserId userId)
        {
            return await _users.FirstOrDefaultAsync(user => user.Id == userId);
        }
        public virtual async Task<User> GetByEmailAsync(string email)
        {
            return await _users.FirstOrDefaultAsync(user => user.Email == email);
        }
        public virtual async Task AddAsync(User user)
        {
            await _users.AddAsync(user); // 자동으로 EntityState.Added 인 Entry가 생성됩니다.
        }
        public virtual async Task UpdateAsync(User user)
        {
            var entry = _users.Attach(user);
            entry.State = EntityState.Modified;
            return Task.CompletedTask;
        }
        public virtual async Task RemoveAsync(User user)
        {
            _users.Remove(user);
            return Task.CompletedTask;
        }
    }
    ```

    > 💡 *virtual* 로 하는 이유
    > 
    > 현재는 단순한 Repository가 Database와 직접 연동되는 1-tier 구현이지만, 
    >
    > `UserRepository`를 상속받아 새로운 기능(캐싱처리 등)을 추가할 수 있도록 확장성을 위해 *virtual*로 선언합니다.

### BookRepository
동일한 방식으로 '도서'를 다룰 수 있도록 BookRepository 구현합니다.

```plaintext
Library
├─ Library.Shared
├─ Library.Domain
├─ Library.Application
└─ Library.Infrastructure
    ├─ Library.Infrastructure.DateTimeProvider
    └─ Library.Infrastructure.Persistence
        ├─ ApplicationDbContext.cs
        └─ Repositories
            ├─ UserRepository.cs
            └─ BookRepository.cs*
```
```csharp
using Library.Application.Interfaces;
using Library.Domain.Aggregates.Books.Entities;
using Library.Domain.Aggregates.Books.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Library.Infrastructure.Persistence.Repositories;
public class BookRepository : IBookRepository
{
    private readonly DbSet<Book> _books;
    public BookRepository(IApplicationDbContext context)
    {
        _books = context.Books;
    }

    public virtual async Task<Book> GetByIdAsync(BookId bookId)
    {
        return await _books.FirstOrDefaultAsync(book => book.Id == bookId);
    }
    public virtual async Task AddAsync(Book book)
    {
        await _books.AddAsync(book);
    }
    public virtual async Task UpdateAsync(Book book)
    {
        var entry = _books.Attach(book);
        entry.State = EntityState.Modified;
        return Task.CompletedTask;
    }
    public virtual async Task RemoveAsync(Book book)
    {
        _books.Remove(book);
        return Task.CompletedTask;
    }
}
```

### RentRepository
마지막으로 대여를 다룰 수 있도록 RentRepository를 구현합니다.

```plaintext
Library
├─ Library.Shared
├─ Library.Domain
├─ Library.Application
└─ Library.Infrastructure
    ├─ Library.Infrastructure.DateTimeProvider
    └─ Library.Infrastructure.Persistence
        ├─ ApplicationDbContext.cs
        └─ Repositories
            ├─ UserRepository.cs
            ├─ BookRepository.cs
            └─ RentRepository.cs*
```
```csharp
using Library.Application.Interfaces;
using Library.Domain.Aggregates.Rents.Entities;
using Library.Domain.Aggregates.Rents.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Library.Infrastructure.Persistence.Repositories;
public class RentRepository : IRentRepository
{
    private readonly DbSet<Rent> _rents;
    public RentRepository(IApplicationDbContext context)
    {
        _rents = context.Rents;
    }
    public virtual async Task<Rent> GetByIdAsync(RentId rentId)
    {
        return await _rents.FirstOrDefaultAsync(rent => rent.Id == rentId);
    }
    public virtual async Task AddAsync(Rent rent)
    {
        await _rents.AddAsync(rent);
    }
    public virtual async Task UpdateAsync(Rent rent)
    {
        var entry = _rents.Attach(rent);
        entry.State = EntityState.Modified;
        return Task.CompletedTask;
    }
    public virtual async Task RemoveAsync(Rent rent)
    {
        _rents.Remove(rent);
        return Task.CompletedTask;
    }
}
```

## **EntityConfiguration**
---
* EntityConfiguration은 EntityFrameworkCore의 FluentAPI를 통해 Entity의 구성을 정의하는 클래스입니다.
* Domain 에서 설계한 Entity들을 실질적으로 어떻게 Database에 매핑하여 저장할지에 대한 방법을 정의합니다.

> **Code-First** 방식의 설계도 가능합니다.
> 
> Configuration을 프로젝트의 코드로 매우 구체적으로(인덱스 등) 설계하고, Database의 구조를 Entity에 맞추어 설계하는 방식입니다.
> 
> .NET CLI의 EF 명령어를 통해 migration을 생성한 뒤, 이를 통해 Database를 생성 및 변경이 가능합니다. <br/>
> *(본 예제에서는 다루지 않습니다.)*

먼저 Persistence 루트경로에 *EntityConfiguration* 디렉토리를 생성해 줍니다.
```plaintext
Library
├─ Library.Shared
├─ Library.Domain
├─ Library.Application
└─ Library.Infrastructure
    ├─ Library.Infrastructure.DateTimeProvider
    └─ Library.Infrastructure.Persistence
        ├─ ApplicationDbContext.cs
        ├─ DependencyInjection.cs
        ├─ Repositories
        └─ EntityConfiguration*
```

이제 EF의 FluentAPI를 통해 Entity의 구성을 정의하는 `UserConfiguration`을 작성해봅시다.

### UserConfiguration
---
```plaintext
Library
├─ Library.Shared
├─ Library.Domain
├─ Library.Application
└─ Library.Infrastructure
    ├─ Library.Infrastructure.DateTimeProvider
    └─ Library.Infrastructure.Persistence
        ├─ ApplicationDbContext.cs
        ├─ DependencyInjection.cs
        ├─ Repositories
        └─ EntityConfiguration*
            └─ UserConfiguration.cs*
```
*EntityConfiguration* 디렉토리에 `UserConfiguration.cs` 파일을 생성하고

이제 Domain에서 정의한 `User` 엔티티를 DB에 맵핑하는 과정이 필요합니다.

```csharp
using Library.Domain.Aggregates.Users.Entities;
using Library.Domain.Aggregates.Users.Enums;
using Library.Domain.Aggregates.Users.ValueObjects;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Library.Infrastructure.Persistence.EntityConfiguration;
internal sealed class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        ...
    }
}
```

`...` 에 해당하는 부분에 `User` 엔티티의 구성을 정의합니다.

1. 먼저 **테이블**을 설정해줍니다.

    ```csharp
    // 기본 Schema 인 경우 (e.g. [dbo].[User])
    builder.ToTable("User");

    // 다른 Schema 인 경우 (e.g. [Library].[User])
    builder.ToTable("User", "Library");
    ```

2. 그 다음, **Primary Key**를 설정해줍니다.

    ```csharp
    builder.HasKey(user => user.Id);
    ```

3. 그리고 각각의 **Property**들을 설정합니다.

    1. *ValueObject*로 정의한 `UserId` 타입의 `Id`를 설정해야합니다.

        UserId의 특성들을 살펴보고, 특성에 맞는 설정 방법을 알아보겠습니다.

        * 필수값입니다. = `NOT NULL` Column 
            
            ```csharp
            builder.Property(user => user.Id)
                .IsRequired(); // Not Null
            ```
        * 고정길이입니다. = `CHAR(36)` Column

            ```csharp
            builder.Property(user => user.Id)
                .HasMaxLength(36) // GUID의 길이
                .IsFixedLength(); // 고정길이
            ```

        * 내부적으로는 Guid 타입이나 C#에서는 `UserId`로 랩핑되어 있습니다.

            ```csharp
            builder.Property(user => user.Id)
                .HasConversion( // C# Type ↔ DB Type간의 상호변환
                    userId => userId.ToString(),
                    dbValue => UserId.Parse(dbValue));
            ```
    2. 동일한 방식으로 `UserStatus` enum 값인 `Status`의 특성을 보면

        * 필수값입니다.
        * DB에는 `INT`로 저장됩니다.
        * C#에서는 `UserStatus` enum으로 사용됩니다.

        위 특성들을 적용하면 아래와 같습니다.

        ```csharp
        builder.Property(user => user.Status)
            .IsRequired()
            .HasConversion(
                userStatus => (int)userStatus,
                dbValue => (UserStatus)dbValue);
        ```

같은 방식으로 나머지 프로퍼티들에 대해서도 적용하면 다음과 같습니다.

```csharp
using Library.Domain.Aggregates.Users.Entities;
using Library.Domain.Aggregates.Users.Enums;
using Library.Domain.Aggregates.Users.ValueObjects;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Library.Infrastructure.Persistence.EntityConfiguration;
internal sealed class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("User");    
        builder.HasKey(user => user.Id);

        builder.Property(user => user.Id)
            .IsRequired()
            .HasMaxLength(36)
            .IsFixedLength()
            .HasConversion(
                userId  => userId.ToString(),
                dbValue => UserId.Parse(dbValue));

        builder.Property(user => user.Name)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(user => user.Status)
            .IsRequired()
            .HasConversion(
                userStatus => (int)userStatus,
                dbValue    => (UserStatus)dbValue);

        builder.Property(user => user.Email)
            .IsRequired(false)
            .HasMaxLength(50);
    }
}
```


### BookConfiguration
---
```plaintext
Library
├─ Library.Shared
├─ Library.Domain
├─ Library.Application
└─ Library.Infrastructure
    ├─ Library.Infrastructure.DateTimeProvider
    └─ Library.Infrastructure.Persistence
        ├─ ApplicationDbContext.cs
        ├─ DependencyInjection.cs
        ├─ Repositories
        └─ EntityConfiguration
            ├─ UserConfiguration.cs
            └─ BookConfiguration.cs*
```
```csharp
using Library.Domain.Aggregates.Books.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Library.Infrastructure.Persistence.EntityConfiguration;
internal sealed class BookConfiguration : IEntityTypeConfiguration<Book>
{
    public void Configure(EntityTypeBuilder<Book> builder)
    {
        builder.ToTable("Book");
        builder.HasKey(book => book.Id);

        builder.Property(book => book.Id)
            .IsRequired()
            .HasMaxLength(36)
            .IsFixedLength()
            .HasConversion(
                bookId  => bookId.ToString(),
                dbValue => BookId.Parse(dbValue));

        builder.Property(book => book.Title)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(book => book.Author)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(book => book.Quantity)
            .IsRequired();
    }
}
```



### RentConfiguration
---
```plaintext
Library
├─ Library.Shared
├─ Library.Domain
├─ Library.Application
└─ Library.Infrastructure
    ├─ Library.Infrastructure.DateTimeProvider
    └─ Library.Infrastructure.Persistence
        ├─ ApplicationDbContext.cs
        ├─ DependencyInjection.cs
        ├─ Repositories
        └─ EntityConfiguration
            ├─ UserConfiguration.cs
            ├─ BookConfiguration.cs
            └─ RentConfiguration.cs*
```
```csharp
using Library.Domain.Aggregates.Books.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Library.Infrastructure.Persistence.EntityConfiguration;
internal sealed class RentConfiguration : IEntityTypeConfiguration<Rent>
{
    public void Configure(EntityTypeBuilder<Rent> builder)
    {
        builder.ToTable("Rent");
        builder.HasKey(rent => rent.Id);

        builder.Property(rent => rent.Id)
            .IsRequired()
            .HasMaxLength(36)
            .IsFixedLength()
            .HasConversion(
                rentId  => rentId.ToString(),
                dbValue => RentId.Parse(dbValue));

        builder.Property(rent => rent.UserId)
            .IsRequired()
            .HasMaxLength(36)
            .IsFixedLength()
            .HasConversion(
                userId  => userId.ToString(),
                dbValue => UserId.Parse(dbValue));

        builder.Property(rent => rent.BookId)
            .IsRequired()
            .HasMaxLength(36)
            .IsFixedLength()
            .HasConversion(
                bookId  => bookId.ToString(),
                dbValue => BookId.Parse(dbValue));

        builder.Property(rent => rent.BorrowedAt)
            .IsRequired();

        builder.Property(rent => rent.DueDate)
            .IsRequired();

        builder.Property(rent => rent.ReturnDate);
    }
}
```

### ApplicationDbContext
---
**ApplicationDbContext.cs**
```csharp
public class ApplicationDbContext 
    : DbContext, IApplicationDbContext, IUnitOfWork
{
    ...

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }
}
```

마지막으로 `IEntityTypeConfiguration<T>` 를 상속받는 class를 프로그램에서 어셈블리에서 자동으로 DbContext를 생성할 때 설정할 수 있도록 `OnModelCreating` 메서드를 오버라이드하여 설정합니다.

## **Dependency Injection**
---

```plaintext
Library
├─ Library.Shared
├─ Library.Domain
├─ Library.Application
└─ Library.Infrastructure
    ├─ Library.Infrastructure.DateTimeProvider
    └─ Library.Infrastructure.Persistence
        ├─ Repositories
        ├─ ApplicationDbContext.cs
        └─ DependencyInjection.cs*
```
```csharp
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace LibrarySolution.Infrastructure.Persistence;
public static class DependencyInjection
{
    
    public static IServiceCollection AddPersistence(this IServiceCollection services, IConfiguration configuration)
    {

    }
}
```

1. 먼저, Persistence 프로젝트를 DI 할 수 있도록 루트 경로에 `DependencyInjection.cs` 파일을 생성합니다.

2. `program.cs` 에서 간단한 메서드를 통해 Persistence를 DI 할 수 있도록 <br/> 
`AddPersistence(this IServiceCollection services, IConfiguration configuration)` 메서드를 생성합니다.

### IApplicationDbContext & IUnitOfWork
---
1. 먼저 EF가 DbContext를 사용할 수 있도록 등록합니다.

    ```csharp
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;

    namespace LibrarySolution.Infrastructure.Persistence;
    public static class DependencyInjection
    {
        public static IServiceCollection AddPersistence(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<ApplicationDbContext>((serviceProvider, options) =>
            {
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"));
            });
            return services;
        }
    }
    ```

2. `ApplicationDbContext`를 사용할 수 있도록 등록합니다.

    ```csharp
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;

    namespace LibrarySolution.Infrastructure.Persistence;
    public static class DependencyInjection
    {
        public static IServiceCollection AddPersistence(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<ApplicationDbContext>((serviceProvider, options) =>
            {
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"));
            });

            services.AddScoped<IApplicationDbContext>(provider => provider.GetRequiredService<ApplicationDbContext>());
            services.AddScoped<IUnitOfWork>(provider => provider.GetRequiredService<ApplicationDbContext>());

            return services;
        }
    }
    ```
    > 💡 **`IApplicationDbContext`와 `IUnitOfWork`**
    > 
    > `IApplicationDbContext`과 `IUnitOfWork` 모두 **`ApplicationDbContext`** 를 바라보도록 설정하여, 사실상 어느 인터페이스를 주입받든 동일한 인스턴스이지만,
    > 
    > *Injection* 받는 다른 클래스에서 `IApplicationDbContext`를 주입받느냐 `IUnitOfWork`를 주입받느냐에 따라 사용가능한 접근 범위가 달라집니다.
    > 
    > **`IApplicationDbContext`**를 주입받는 경우 `DbSet<T>`에 접근하여, Entity의 상태값을 변형할 수 있도록 기능을 제공하지만 실질적으로 저장할 수 있는 `SaveChangesAsync`에는 접근할 수 없습니다.
    >
    > 반대로 **`IUnitOfWork`**는 Entity에 관해서는 아무런 접근을 할 수 없고 `SaveChangesAsync`를 통해 `DbContext.ChangeTracker`에 조작된것으로 표기된(`EntityStatus.Added`, `EntityStatus.Modified`, `EntityStatus.Deleted`)된 Entitiy에만 접근할 수 있게됩니다.
    >
    > 이러한 다형성을 통해 *ReadOnly*인 *IQuery*를 처리하는 *TQueryHandler*에서 `IApplicationDbContext`만을 주입받아 데이터의 조회만 가능하도록 원천적으로 제한하고,
    >
    > *ICommand*를 처리하는 *TCommandHandler*에서는 `IUnitOfWork`를 함께 주입받아 `SaveChangesAsync`를 통해 데이터를 저장도 할 수 있도록 구현할 수 있도록 합니다.

### Repository
---
```csharp
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace LibrarySolution.Infrastructure.Persistence;
public static class DependencyInjection
{
    public static IServiceCollection AddPersistence(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<ApplicationDbContext>((serviceProvider, options) =>
        {
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"));
        });

        services.AddScoped<IApplicationDbContext>(provider => provider.GetRequiredService<ApplicationDbContext>());
        services.AddScoped<IUnitOfWork>(provider => provider.GetRequiredService<ApplicationDbContext>());

        services.AddScoped<IBookRepository, BookRepository>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IRentRepository, RentRepository>();            

        return services;
    }
}
```

# **종합**
---

* [DateTimeProvider](#datetimeproivider) 
  * Application Layer에 정의(*Define*)된 *interface*를 <br/>
    Infrastructure Layer에서 구현(*Implement*)하는 방법
* [Persistence](#persistence-설계)
  * [ApplicationDbContext](#applicationdbcontext)
    * [IApplicationDbContext](#iapplicationdbcontext)
      * DbContext를 *ReadOnly*하게 접근하는 방법
    * [IUnitOfWork](#iunitofwork)
      * Entity의 변경사항을 저장하는 방법
      * Entity에 등록된 DomainEvent를 발행하는 방법
      * 서로 분리되어 서로를 알 수 없는 *Aggreagte*들의 변경사항을 트랜잭셔널하게 처리하는 방법
  * [Repository](#repository)
    * Domain Layer에 정의된 *I...Repository*를 EF를 통해 테이블과 연동하여 구현하는 방법
  * [EntityConfiguration](#entityconfiguration)
    * Domain Layer의 Entity를 DB스키마에 맞게 맵핑하는 방법


# 다음 단계
---
[4. Presentation Layer](/Documents/CleanArchitecture/Aspnet_CleanArchitectrue_pt5.html)