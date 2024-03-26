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
    └─ Library.Infrastructure.DateTimeProvider
    └─ Library.Infrastructure.Persistence*
```
1. *Library.Infrastructure* 솔루션 디렉토리 아래 *Library.Infrastructure.Persistence* 프로젝트를 생성합니다.

2. *Persistence* 프로젝트에 *EntityFrameworkCore*를 사용하기 위해 다음의 NuGet 패키지들을 설치합니다 
   * [Microsoft.EntityFrameworkCore](https://www.nuget.org/packages/Microsoft.EntityFrameworkCore)
   * [Microsoft.EntityFrameworkCore.Design](https://www.nuget.org/packages/Microsoft.EntityFrameworkCore.Design)
   * [Microsoft.EntityFrameworkCore.SqlServer](https://www.nuget.org/packages/Microsoft.EntityFrameworkCore.SqlServer)

## ApplicationDbContext.cs
---
```plaintext
Library
├─ Library.Shared
├─ Library.Domain
├─ Library.Application
└─ Library.Infrastructure
    └─ Library.Infrastructure.DateTimeProvider
    └─ Library.Infrastructure.Persistence
        └─ ApplicationDbContext.cs*
```
```csharp
using Microsoft.EntityFrameworkCore;

namespace Library.Infrastructure.Persistence;
public class ApplicationDbContext 
    : DbContext
{

}
```
먼저 `ApplicationDbContext.cs` 파일을 생성 후 *Microsoft.EntityFrameworkCore*의 `DbContext`를 상속받습니다.

### IApplicationDbContext
```csharp
using Microsoft.EntityFrameworkCore;
using Library.Application.Interfaces;

namespace Library.Infrastructure.Persistence;
public class ApplicationDbContext 
    : DbContext, IApplicationDbContext
{
    DbSet<User> Users { get; set; }
    DbSet<Book> Books { get; set; }
    DbSet<Rent> Rents { get; set; }
    DatabaseFacade Database { get; }
}
```
> ***IApplicationDbContext***
> ```csharp
> public interface IApplicationDbContext
> {
>     DbSet<User> Users { get; set; }
>     DbSet<Book> Books { get; set; }
>     DbSet<Rent> Rents { get; set; }
>     DatabaseFacade Database { get; }
> }
> ```

Application Layer의 `IApplicationDbContext`를 상속합니다.

이를 통해 `IApplicationDbContext`을 주입받는 객체는 `User`, `Book`, `Rent` Entity에 접근할 수 있습니다.

### Constructor
```csharp
using Microsoft.EntityFrameworkCore;
using Library.Application.Interfaces;

namespace Library.Infrastructure.Persistence;
public class ApplicationDbContext 
    : DbContext, IApplicationDbContext
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
}
```
생성자(*Constructor*)를 통해 *ApplicationDbContext*를 사용하기 위한 서비스들을 주입받습니다.

1. EF 기본 생성 요소인 `DbContextOptions<ApplicationDbContext>`
2. 파이프라인 형성을 위한 MediatR의 `IPublisher`
3. 기준시간 제공을 위한 `IDateTimeProvider`


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
> 이벤트를 발행하는 방식에는 2가지가 있는데 *Optimistic* 방식과 *Pessimistic* 방식이 있습니다.
>
> **Optimistic** 방식은 **낙관적**의미 그대로 트랜잭션 처리가 정상적으로 처리 될것이라 예상하여, 트랜잭션 처리 후 이벤트를 발행하는 방식입니다.
>
> **Pessimistic** 방식은 **비관적**의미 그대로 트랜잭션 처리가 정상적으로 처리 되지 않을 수 있는 것을 상정하여, 트랜잭션 처리 전 이벤트를 발행하는 방식입니다.
>
> 위 예제는 **Optimistic** 방식으로 **Pessimistic** 방식으로 구현하기 위해서는 **`2.`**와 **`3.`**의 순서만 변경하면 됩니다.
>
> 다만, 두가지 방법 모두 장단점이 극명하여 두 방법을 보완할 수 있는, ***Outbox-Pattern*** 방식으로 구현하는 법을 이후에 소개할 예정입니다.


## Repository
---
이제 도메인 레이어에 정의되어있는 Repository를 구현해봅시다.


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
먼저 *Repositories* 디렉토리를 생성합니다.
    
```plaintext
Library
├─ Library.Shared
├─ Library.Domain
├─ Library.Application
└─ Library.Infrastructure
    └─ Library.Infrastructure.DateTimeProvider
    └─ Library.Infrastructure.Persistence
        └─ ApplicationDbContext.cs
        └─ Repositories
            └─ UserRepository.cs*
```
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
1. `UserRepository.cs` 를 생성합니다.
2. `IUserRepository`를 상속받습니다.

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
    
3. 생성자를 통해 `IApplicationDbContext`를 주입받습니다.

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

4. `IUserRepository`의 메서드를 구현합니다.

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
    > 현재는 단순한 Repository의 1-tier 구현이지만, 
    >
    > `UserRepository`를 상속받아 새로운 기능(캐싱처리 등)을 추가할 수 있도록 확장성을 위해 *virtual*로 선언합니다.

# 다음 단계
---
[]()