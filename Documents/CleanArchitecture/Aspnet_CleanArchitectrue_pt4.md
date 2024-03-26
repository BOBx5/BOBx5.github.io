---
title: "3. Infrastructure Layer 설계하기"
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

## ApplicationDbContext
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


## Repository
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
        private readonly IApplicationDbContext _context;
        public UserRepository(IApplicationDbContext context)
        {
            _context = context;
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

## Dependency Injection
---


1. Persistence 프로젝트를 DI 할 수 있도록 루트 경로에 `DependencyInjection.cs` 파일을 생성합니다.

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

2. `AddDbContext`를 통해 `ApplicationDbContext`를 등록합니다.

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

3. `ApplicationDbContext`를 사용할 수 있도록 등록합니다.

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
    > 위와 같이 등록함으로써 동일한 **`ApplicationDbContext`** 인스턴스에 접근하지만
    > 
    > 사용하는 다른 클래스에서 `IApplicationDbContext`를 주입받느냐 `IUnitOfWork`를 주입받느냐에 따라 접근 범위가 달라집니다.
    > 
    > `IApplicationDbContext`를 주입받는 경우 `DbSet<T>`에 접근하여, Entity의 상태값을 변형할 수 있도록 기능을 제공하지만 실질적으로 저장할 수 있는 `SaveChangesAsync`에는 접근할 수 없습니다.
    >
    > 반대로 `IUnitOfWork`는 Entity에 관해서는 아무런 접근을 할 수 없고 `SaveChangesAsync`를 통해 `DbContext.ChangeTracker`에 조작된것으로 표기된(`EntityStatus.Added`, `EntityStatus.Modified`, `EntityStatus.Deleted`)된 Entitiy에만 접근할 수 있게됩니다.
    >
    > 이러한 다형성을 통해 *ReadOnly*인 *IQuery*를 처리하는 *TQueryHandler*에서 `IApplicationDbContext`만을 주입받아 데이터의 조회만을 가능하도록 원천적으로 제한하고,
    >
    > *ICommand*를 처리하는 *TCommandHandler*에서는 `IUnitOfWork`를 함께 주입받아 `SaveChangesAsync`를 통해 데이터를 저장할 수 있도록 구현할 수 있도록 합니다.


# EntityConfiguration
---
* EntityConfiguration은 EntityFrameworkCore의 FluentAPI를 통해 Entity의 구성을 정의하는 클래스입니다.
* Domain 에서 설계한 Entity들을 실질적으로 어떻게 Database에 매핑하여 저장할지에 대한 방법을 정의합니다.

> **Db-First** 방식의 설계
> 
> Configuration을 프로젝트 레벨에서 매우 구체적으로(인덱스 등) 설계하고, Database의 구조를 Entity에 맞추어 설계하는 방식입니다.
>
> .NET CLI의 EF 명령어를 통해 migration을 생성한 뒤, 이를 통해 Database를 생성 및 변경이 가능합니다. <br/>
*(본 예제에서는 다루지 않습니다.)*

## UserConfiguration
---
작성 중..


## BookConfiguration
---
작성 중..

## RentConfiguration
---
작성 중..



# 종합
---

* [DateTimeProvider](#datetimeproivider) 예제를 통해 Infrastructure Layer의 구현하는 방법을 알아보았습니다.
* 





# 다음 단계
---
작성 중..
<!-- 
[4. Presentation Layer 설계](/Documents/CleanArchitecture/Aspnet_CleanArchitectrue_pt5.html) 
-->