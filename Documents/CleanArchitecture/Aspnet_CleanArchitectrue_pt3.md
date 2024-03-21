---
title: ASP.NET 클린아키텍처 pt.3
description: <span>&#x23;ASP.NET &#x23;CleanArchitecture</span>
layout: libdoc/page

#LibDoc specific below
category: CleanArchitecture
order: 903
---
* 
{:toc}

# **Application Layer 설계**
---
* 도메인 레이어를 활용하여 비즈니스 로직(*Use-Case*)을 구현합니다.
* 하위 레이어인 Infrastructure Layer을 추상화(*Interface*)하여 만듭니다.
* [MediatR](https://github.com/jbogard/MediatR)을 활용하여 파이프라인을 구축합니다.

---
# **Abstractions 선언**
---

## Commands
* **`ICommand`**

    ```plaintext
    LibrarySolution
    ├─ LibrarySolution.Shared
    ├─ LibrarySolution.Domain
    └─ LibrarySolution.Application
        └─ Abstractions
            └─ Commands
                └─ ICommand.cs*
    ```
    ```csharp
    namespace LibrarySolution.Application.Abstractions.Commands;
    public interface ICommand : MediatR.IRequest<MediatR.Unit>
    {

    }
    public interface ICommand<out TResponse> : MediatR.IRequest<TResponse>
    {

    }
    ```
    * [MediatR](https://github.com/jbogard/MediatR)의 `IRequest` 인터페이스를 상속는 `ICommand` 인터페이스를 선언합니다.
    * **`ICommand`** 는 결과값 없는 `Command`를 위한 인터페이스입니다.
    * **`ICommand<out TResponse>`** 는 `TResponse`를 반환하도록 요청하는 Command 입니다.
    
* **`ICommandHandler`**

    ```plaintext
    LibrarySolution
    ├─ LibrarySolution.Shared
    ├─ LibrarySolution.Domain
    └─ LibrarySolution.Application
        ├─ Primitives
        └─ Abstractions
            └─ Commands
                ├─ ICommand.cs
                └─ ICommandHandler.cs*
    ```
    ```csharp
    namespace LibrarySolution.Application.Abstractions.Commands;
    public interface ICommandHandler<TCommand>
        : MediatR.IRequestHandler<TCommand, MediatR.Unit> where TCommand : ICommand
    {

    }
    public interface ICommandHandler<in TCommand, TResponse>
        : MediatR.IRequestHandler<TCommand, TResponse> where TCommand : ICommand<TResponse>
    {

    }
    ```
  * [MediatR](https://github.com/jbogard/MediatR)의 `IRequestHandler` 인터페이스를 상속받는 `ICommandHandler` 인터페이스를 선언합니다.
  * **`ICommandHandler<TCommand>`**는 반환값이 없는 `ICommand` 처리 담당 클래스의 인터페이스입니다.
  * **`ICommandHandler<TCommand, TResponse>`**는 `ICommand<out TResponse>` 처리 담당 클래스의 인터페이스입니다.

## Query
* **`IQuery`**

    ```plaintext
    LibrarySolution
    ├─ LibrarySolution.Shared
    ├─ LibrarySolution.Domain
    └─ LibrarySolution.Application
        └─ Abstractions
            ├─ Commands
            └─ Queries
                └─ IQuery.cs*
    ```
    ```csharp
    namespace LibrarySolution.Application.Abstractions.Queries;
    public interface IQuery<out TResponse> : MediatR.IRequest<TResponse>
    {

    }
    ```
    * [MediatR](https://github.com/jbogard/MediatR)의 `IRequest` 인터페이스를 상속는 `IQuery` 인터페이스를 선언합니다.
    * *Query*는 반드시 결과값이 있어야 하므로 *Command*와 달리 결과값을 반환하는 `IQuery` 인터페이스만 선언합니다.

* **`IQueryHandler`**

    ```plaintext
    LibrarySolution
    ├─ LibrarySolution.Shared
    ├─ LibrarySolution.Domain
    └─ LibrarySolution.Application
        ├─ Primitives
        └─ Abstractions
            ├─ Commands
            └─ Queries
                ├─ IQuery.cs
                └─ IQueryHandler.cs*
    ```
    ```csharp
    namespace LibrarySolution.Application.Abstractions.Queries;
    public interface IQueryHandler<TQuery, TResponse>
        : MediatR.IRequestHandler<TQuery, TResponse> where TQuery : IQuery<TResponse>
    {

    }
    ```
  * [MediatR](https://github.com/jbogard/MediatR)의 `IRequestHandler` 인터페이스를 상속받는 `IQueryHandler` 인터페이스를 선언합니다.
  * **`IQueryHandler<TQuery, TResponse>`**는 `IQuery<out TResponse>` 처리 담당 클래스의 인터페이스입니다.

{:.no_toc}
> 💡 **CQRS: Command Query Responsibility Segregation**
> 
> *CQRS*는 *Command*와 *Query*를 분리하여 각각의 역할에 집중하도록 하는 디자인 패턴입니다.
> 
> 필요에 따라 *Query*는 별도의 *Read-Only* DbContext(ColdDB)를 를 따로 붙여서 사용하거나,
> 
> [Dapper](https://github.com/DapperLib/Dapper) 등을 이용하여 탄력적인 조회를 구현할 수 있습니다.

## Events
* **`IDomainEventHandler`**

    ```plaintext
    LibrarySolution
    ├─ LibrarySolution.Shared
    ├─ LibrarySolution.Domain
    └─ LibrarySolution.Application
        └─ Abstractions
            ├─ Commands
            ├─ Queries
            └─ Events
                └─ IDomainEventHandler.cs*
    ```
    ```csharp
    internal interface IDomainEventHandler<in TDomainEvent> : MediatR.NotificationHandler<TDomainEvent>
    where TDomainEvent : DomainEvent
    {

    }
    ```
    * **`IDomainEventHandler`**는 `TDomainEvent` 처리 담당 클래스의 인터페이스입니다.
    * DomainEvent 는 어플리케이션 레이어 내부적으로 처리가 완료되야 하기 때문에 `internal`로 선언합니다.



# **Interface의 선언**
---
* 하위 레이어인 Infrastructure Layer에서 사용할 수 있도록 추상화된 인터페이스를 선언합니다.
* 예시
  * 시스템의 기준 시간을 제공하는 `IDateTimeProvider` 인터페이스
  * 데이터베이스의 컨텍스트를 제공하는 `IApplicationDbContext` 인터페이스
  * 데이터베이스의 트랜잭션을 제공하는 `IUnitOfWork` 인터페이스
  * 이메일 전송 기능을 제공하는 `IEmailSender` 인터페이스
  * 문자전송 기능을 제공하는 `ISmsSender` 인터페이스

## IApplicationDbContext

```plaintext
LibrarySolution
├─ LibrarySolution.Shared
├─ LibrarySolution.Domain
└─ LibrarySolution.Application
    ├─ Abstractions
    └─ Interfaces
        └─ IApplicationDbContext.cs*
```
```csharp
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
namespace LibrarySolution.Application.Abstractions.Interfaces;
public interface IApplicationDbContext
{
    DbSet<User> Users { get; set; }
    DbSet<Book> Books { get; set; }
    DbSet<Rent> Rents { get; set; }
    DatabaseFacade Database { get; }
}
```
* CleanArchitecture의 원칙(*Principle*)에 따라 ApplicationLayer에서는 하위 레이어인 InfrastructureLayer에 대한 의존성을 가져서는 안됩니다. 따라서, 다음과 같은 사항들에 대해 알 수 없어야합니다.
  * 어떠한 Database를 사용하는지 (e.g. *SQL Server, PostgreSQL, MySQL, SQLite, CosmosDB, etc.*)
  * 데이터캐싱은 어떻게 하는지 (e.g. *Redis, In-Memory, etc.*)
* 그 대신 데이터베이스 사용에 관한 Contract만 정의할 수 있도록 [Microsoft.EntityFrameworkCore.Relational](https://www.nuget.org/packages/Microsoft.EntityFrameworkCore.Relational) NuGet패키지만 참조합니다.
  *  `DbSet<T>`
  *  `DatabaseFacade`
* 저장하는 메서드(ex.EF-`SaveChangesAsync`)는 선언되어 있지 않아 `IApplicationDbContext` 스스로는 저장하는 기능을 제공할 수 없습니다.

## IUnitOfWork

```plaintext
LibrarySolution
├─ LibrarySolution.Shared
├─ LibrarySolution.Domain
└─ LibrarySolution.Application
    ├─ Abstractions
    └─ Interfaces
        ├─ IApplicationDbContext.cs
        └─ IUnitOfWork.cs*
```
```csharp
namespace LibrarySolution.Application.Abstractions.Interfaces;
public interface IUnitOfWork
{
    public Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
```
* `IUnitOfWork` 인터페이스는 데이터의 저장만을 담당하는 인터페이스입니다.
* `IUnitOfWork` 인터페이스는 `IApplicationDbContext` 인터페이스에서 수행한 상태값 변경에 대해 알지 못합니다.
* `IApplicationDbContext` 에서는 데이터의 상태값 변경 후,<br/>
`IUnitOfWork`의 `SaveChangesAsync` 메서드를 호출하는 방식으로 트랜잭셔널한 처리를 가능하게 합니다.


# **Use-Case 구현**
---
지금까지 선언한 인터페이스들을 활용하여 *Use-Case*를 구현해 봅시다.

먼저 사용자를 생성하는 *Command*를 생성해봅시다.

먼저 디렉토리를 생성합니다

```plaintext
LibrarySolution
├─ LibrarySolution.Shared
├─ LibrarySolution.Domain
└─ LibrarySolution.Application
    ├─ Abstractions
    ├─ Interfaces
    └─ UseCases*
        └─ Users*
            └─ Commands*
```

## CreateUserCommand

```plaintext
LibrarySolution
├─ LibrarySolution.Shared
├─ LibrarySolution.Domain
└─ LibrarySolution.Application
    ├─ Abstractions
    ├─ Interfaces
    └─ UseCases
        └─ Users
            └─ Commands
                └─ CreateUserCommand.cs*
```
```csharp
namespace LibrarySolution.Application.UseCases.Users.Commands;
public record CreateUserCommand : ICommand<CreateUserCommandResponse>
{
    public string Name { get; init; }
    public string Email { get; init; }
}
```
* `CreateUserCommand`는 `CreateUserCommandResponse`를 반환하도록 하는 요청합니다.

## CreateUserCommandResponse

```plaintext
LibrarySolution
├─ LibrarySolution.Shared
├─ LibrarySolution.Domain
└─ LibrarySolution.Application
    ├─ Abstractions
    ├─ Interfaces
    └─ UseCases
        └─ Users
            └─ Commands
                ├─ CreateUserCommand.cs
                └─ CreateUserCommandResponse.cs*
```
```csharp
namespace LibrarySolution.Application.UseCases.Users.Commands;
public record CreateUserCommandResponse
{
  public string Id { get; init; }
}
```
* `CreateUserCommandResponse`는 신규로 생성된 유저의 Id(`UserId`)를 반환합니다.

## CreateUserCommandHandler

```plaintext
LibrarySolution
├─ LibrarySolution.Shared
├─ LibrarySolution.Domain
└─ LibrarySolution.Application
    ├─ Abstractions
    ├─ Interfaces
    └─ UseCases
        └─ Users
            └─ Commands
                ├─ CreateUserCommand.cs
                ├─ CreateUserCommandResponse.cs
                └─ CreateUserCommandHandler.cs*
```
```csharp
namespace LibrarySolution.Application.UseCases.Users.Commands;
public record CreateUserCommandHandler : ICommandHandler<CreateUserCommand, CreateUserCommandResponse>
{
    private readonly IUserRepository _userRepository;
    private readonly IUnitOfWork _unitOfWork;
    public CreateUserCommandHandler(
        IUserRepository userRepository, 
        IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
    }
    
    public async Task<CreateUserCommandResponse> Handle(CreateUserCommand request, CancellationToken cancellationToken)
    {
        User newUser = User.Create(request.Name, request.Email);
        await _userRepository.AddAsync(newUser, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        UserId createdUserId = newUser.Id;
        return new CreateUserCommandResponse 
        { 
            Id = createdUserId.ToString() 
        };
    }
}
```

* DomainLayer에서 선언한 `IUserRepository`를 주입(DI) 받습니다.
* ApplicationLayer에서 선언한 `IUnitOfWork`를 주입(DI) 받습니다.
* `Task<CreateUserCommandResponse> Handle(CreateRentCommand request, CancellationToken cancellationToken)`
  1. 요청으로 들어온 `request`를 이용하여 `User.Create` 메서드를 이용해 엔티티를 생성합니다.
  2. `_userRepository`에 `User` 엔티티를 저장합니다.
  3. `_unitOfWork`의 `SaveChangesAsync` 메서드를 호출하여 저장합니다.
  4. 저장이 정상적으로 완료되고 나면 `CreateUserCommandResponse`를 생성된 `UserId` 값과 함께 반환합니다.


> 작성 진행 중...
