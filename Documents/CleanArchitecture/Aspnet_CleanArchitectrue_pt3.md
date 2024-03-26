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


# **Dependency Injection**
---

Application Layer의 설계사항을 의존성 주입하기 위한 클래스들을

프로젝트 루트 경로에 생성해봅시다.

```plaintext
LibrarySolution
├─ LibrarySolution.Shared
├─ LibrarySolution.Domain
└─ LibrarySolution.Application
    ├─ Abstractions
    ├─ Interfaces
    └─ ApplicationAssembly.cs*
```
## ApplicationAssembly.cs
```csharp
public class ApplicationAssembly
{
    internal static readonly Assembly Assembly = typeof(ApplicationAssembly).Assembly;
}
```
* ApplicationLayer의 Assembly를 반환하는 클래스입니다.

## DependencyInjection.cs

```plaintext
LibrarySolution
├─ LibrarySolution.Shared
├─ LibrarySolution.Domain
└─ LibrarySolution.Application
    ├─ Abstractions
    ├─ Interfaces
    ├─ ApplicationAssembly.cs
    └─ DependencyInjection.cs*
```
```csharp
using MediatR;
namespace LibrarySolution.Application;
public static class DependencyInjection
{
    public static IServiceCollection AddApplication(
        this IServiceCollection services,  
        Configuration configuration)
    {
        services.AddMediatR(config =>
        {
        });
    }
}
```
먼저 ***MediatR***을 사용하도록 선언합니다.

```csharp
services.AddMediatR(config =>
{
    config.RegisterServicesFromAssemblyContaining<ApplicationAssembly>();
});
services.AddApplication();
```
ApplicationLayer의 어셈블리를 읽어 선언되어있는 아래와 같은 MediatR 관련 객체들을 자동으로 등록합니다.
* IRequest
  * IQuery
  * ICommand
* IRequestHandler
  * IQueryHandler
  * ICommandHandler
* INotification
  * DomainEvent
* INotificationHandler
  * DomainEventHandler

> 💡 의존성 주입 방법
> 
> 이후 Presentation Layer의 *MVC* 또는 *WebApi* 프로젝트의 `program.cs`에서 `AddApplication` 메서드를 호출하여 의존성 주입을 수행합니다.
> ```csharp
> var builder = WebApplication.CreateBuilder(args);
> builder.Services.AddApplication(builder.Configuration);
> ```

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
     * 내부적으로 `UserCreatedDomainEvent`를 발생시킵니다.
  2. `_userRepository`에 `User` 엔티티를 저장합니다.
  3. `_unitOfWork`의 `SaveChangesAsync` 메서드를 호출하여 저장합니다.
     * 내부적으로 `User`에 등록되어있는 `UserCreatedDomainEvent`를 발행(*Publish*)합니다.
  4. 저장이 정상적으로 완료되고 나면 `CreateUserCommandResponse`를 생성된 `UserId` 값과 함께 반환합니다.


# **Validation 구현**
---
`CreateUserCommand`에 대한 유효성 검사를 추가해봅시다.

## AbstractValidator&lt;T&gt;

먼저 [*FluentValidation*](https://docs.fluentvalidation.net) NuGet 패키지의 `AbstractValidator<T>`를 알아봅시다.

```csharp
using FluentValidation;

public class SomeCommmand
{
    public string Guid { get; set; }
}
public class SomeCommmandValidator : AbstractValidator<SomeCommmand>
{
    const int GuidLength = 36;
    public SomeCommmandValidator()
    {
        RuleFor(x => x.Value)
            .NotEmpty()
            .Length(GuidLength)
            .Must(value => Guid.TryParse(value, out _))
            .Must(GuidFormat)
            .WithMessage("Guid 형식이 아닙니다.");
    }
}

protected bool GuidFormat(string value)
{
    return Guid.TryParse(value, out _);
}

protected override void PreValidate(ValidationContext<CreateUserCommand> context, ValidationResult result)
{
    base.PreValidate(context);
}

public override ValidationResult Validate(ValidationContext<SomeCommmand> context)
{
    return base.Validate(context);
}

public override async Task<ValidationResult> ValidateAsync(ValidationContext<SomeCommmand> context, CancellationToken cancellation)
{
    return await base.ValidateAsync(context, cancellation);
}

protected override void RaiseValidationException(ValidationResult result)
{
    base.RaiseValidationException(result);
}
```

* `SomeCommmand` 클래스에 대한 유효성 검사를 수행하는 `SomeCommmandValidator` 클래스를 선언합니다.
* `AbstractValidator<T>`를 상속받아 구현합니다. (`T` = `SomeCommmand`)
* 생성자에서 `RuleFor` 메서드를 이용하여 `T` 프로퍼티에 대해 유효성 검사를 추가합니다.
* `RuleFor`
  * `NotEmpty()`<br/>
    값이 비어있는지 확인합니다.
  * `Length(GuidLength)`<br/>
    값의 길이를 확인합니다.
  * `Must(value => Guid.TryParse(value, out _))` <br/>
    람다식 표현으로 사용자 정의 유효성 검사를 수행합니다.
  * `Must(GuidFormat)` <br/>
    메서드 참조를 이용하여 사용자 정의 유효성 검사를 수행합니다.
  * `WithMessage("Guid 형식이 아닙니다.")`<br/>
    유효성 검사 실패시 반환할 메시지를 지정합니다.

* `PreValidate`
  * 유효성 검사 이전에 `ValidationContext<T>` 에 대한 커스텀 로직을 수행할 수 있습니다.

* `Validate` & `ValidateAsync`
  * 유효성 검사 시점을 커스터마이징 할 때 이 메서드를 *override* 하여 사용합니다.

* `RaiseValidationException`
  * 유효성 검사 실패하는 경우 `ValidationException`을 발생시킵니다.
  * 이때 *throw* 하기 전 커스텀 로직을 수행할 수 있습니다.
  * 이후 `ValidationException`은 *Presentation Layer*에서 *HTTP 400(Bad Request)*로 처리됩니다.

## CreateUserCommandValidator

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
                ├─ CreateUserCommandHandler.cs
                └─ CreateUserCommandValidator.cs*
```
```csharp
using FluentValidation;
namespace LibrarySolution.Application.UseCases.Users.Commands;
internal sealed class CreateUserCommandValidator : AbstractValidator<CreateUserCommand>
{
    public CreateUserCommandValidator()
    {

    }
}
```
* `CreateUserCommandValidator`는 `CreateUserCommand`에 대한 유효성 검사를 수행합니다.
* `AbstractValidator<CreateUserCommand>`를 상속받아 구현합니다.
* Validation을 실패하는 경우, `ValidationException`을 발생시킵니다.
* `ValidationException`은 Presentaion Layer에서 *HTTP 400(Bad Request)*로 처리됩니다.

1. 먼저, 생성자에 유저의 이름과 관련하여 Validation을 추가해봅시다
   1. `Name`은 공백일 수 없습니다.

    ```csharp
    public CreateUserCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty();
    }
    ```
    2. 공백인 경우, "유저 이름은 공백일 수 없습니다."라는 메시지를 반환합니다.

    ```csharp
    public CreateUserCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage($"유저 이름은 공백일 수 없습니다.");
    }
    ```
    3. `Name`은 50자를 넘을 수 없습니다.

    ```csharp
    public CreateUserCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage($"유저 이름은 공백일 수 없습니다.")
            .MaximumLength(50);
    }
    ```

    4. 50자를 넘을 경우, "유저 이름은 50자를 넘을 수 없습니다."라는 메시지를 반환합니다.

    ```csharp
    public CreateUserCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage($"유저 이름은 공백일 수 없습니다.")
            .MaximumLength(50)
            .WithMessage($"유저 이름은 50자를 넘을 수 없습니다.");
    }
    ```

2. 같은 방식으로 `Email` Validation을 추가합니다.
    1. `Email`은 공백일 수 없습니다.

        ```csharp
        public CreateUserCommandValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty()
                .WithMessage($"유저 이름은 공백일 수 없습니다.")
                .MaximumLength(50)
                .WithMessage($"유저 이름은 50자를 넘을 수 없습니다.");

            RuleFor(x => x.Email)
                .NotEmpty()
                .WithMessage($"유저 이메일은 공백일 수 없습니다.");
        }
        ```
    
    2. Email 형식의 Regex(정규식)을 추가합니다.

        ```csharp
        private static Regex EmailRegex = new Regex(@"^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$");
        public CreateUserCommandValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty()
                .WithMessage($"유저 이름은 공백일 수 없습니다.")
                .MaximumLength(50)
                .WithMessage($"유저 이름은 50자를 넘을 수 없습니다.");

            RuleFor(x => x.Email)
                .NotEmpty()
                .WithMessage($"유저 이메일은 공백일 수 없습니다.")
                .Must(RegisteredRegex.Email.IsMatch)
                .WithMessage($"올바른 이메일 형식이 아닙니다.");
        }
        ```

3. 이제 생성한 Validator를 파이프라인에 추가해봅시다.

    1. [FluentValdation.DependencyInjectionExtension](FluentValidation.DependencyInjectionExtensions) NuGet 패키지를 설치합니다.
    2. Application 프로젝트의 `DependencyInjection.cs` 파일에 아래 라인을 추가합니다.

        `services.AddValidatorsFromAssembly(ApplicationAssembly.Assembly, includeInternalTypes: true);`
        ```csharp
        public static class DependencyInjection
        {
            public static IServiceCollection AddApplication(
                this IServiceCollection services,
                IConfiguration configuration)
            {
                services.AddMediatR(config =>
                {
                    config.RegisterServicesFromAssemblyContaining<ApplicationAssembly>();
                });
                services.AddValidatorsFromAssembly(ApplicationAssembly.Assembly, includeInternalTypes: true);
                return services;
            }
        }
        ```
        * `AddValidatorsFromAssembly` 메서드를 이용하여 Application Layer의 Assembly에 선언된 Validator를 자동으로 등록합니다.
        * `AbstractValidator<T>`를 상속받는 클래스 중 *internal* 로 선언된 클래스도 추가하려면 `includeInternalTypes: true`를 추가합니다.



# **요약**
---
최종적으로 아래와 같은 파이프라인이 형성된다.

[![](https://mermaid.ink/img/pako:eNqVVF1r1EAU_SvDPClk404yuyZBFqoWCiKWNfZB04dpcrXDbiZxZoKty4IPvukvkBb6UKSv-rNk-x-cfO2mZLfQQMh8nHPuzT1zZ4HjLAEcYAWfCxAxvOTsk2RpJJB5WKEzUaQnIJt5rDOJ3ql2njOpecxzJjQ6lKBAaKZ5Jvq7e3k-5_GOzfBFlqZMJEdszhNmQuyGHJh3XoavIWUqaDCZ3IkeoIMwPETT8o-UroHd_YrQSShYqz8Lp6DyTCiY1LQOqmL1Mr2H28OiwWCrgsmtmcEj2378QHZLfdIO9tS5iDdCJxLYDK0urm5_3ay-_0H__n5b_b5Eqx_Xtz9vzOeihj0o5pRx1eZsSrN_FkNeDjZRd8j1nNou0lXpOVd6HqAPlcd0OETPWdJYfVyzQCQ7a9jxsDlKGwfvkprtLTlL0IUUKGRq1jEd1YRNCe5N3DGJv3l1jL5wfYrWIoYVCWzhFGTKeGLaclFqRVifQgoRDswwYXIW4UgsDa7sz7fGbRxoWYCFi7w8AE0L4-Ajm6v16n7CTQVapGkqHCzwGQ4G1LOpNySO53njkUdHDrXwuVknxPaH_th1xh6hHqUjd2nhr1lmhIlNHOpT139Kxq7rE0IsDJX-6_o2qS6VKsr7ilAGXf4HavR_Ig?type=png)](https://mermaid-js.github.io/mermaid-live-editor/edit#pako:eNqVVF1r1EAU_SvDPClk404yuyZBFqoWCiKWNfZB04dpcrXDbiZxZoKty4IPvukvkBb6UKSv-rNk-x-cfO2mZLfQQMh8nHPuzT1zZ4HjLAEcYAWfCxAxvOTsk2RpJJB5WKEzUaQnIJt5rDOJ3ql2njOpecxzJjQ6lKBAaKZ5Jvq7e3k-5_GOzfBFlqZMJEdszhNmQuyGHJh3XoavIWUqaDCZ3IkeoIMwPETT8o-UroHd_YrQSShYqz8Lp6DyTCiY1LQOqmL1Mr2H28OiwWCrgsmtmcEj2378QHZLfdIO9tS5iDdCJxLYDK0urm5_3ay-_0H__n5b_b5Eqx_Xtz9vzOeihj0o5pRx1eZsSrN_FkNeDjZRd8j1nNou0lXpOVd6HqAPlcd0OETPWdJYfVyzQCQ7a9jxsDlKGwfvkprtLTlL0IUUKGRq1jEd1YRNCe5N3DGJv3l1jL5wfYrWIoYVCWzhFGTKeGLaclFqRVifQgoRDswwYXIW4UgsDa7sz7fGbRxoWYCFi7w8AE0L4-Ajm6v16n7CTQVapGkqHCzwGQ4G1LOpNySO53njkUdHDrXwuVknxPaH_th1xh6hHqUjd2nhr1lmhIlNHOpT139Kxq7rE0IsDJX-6_o2qS6VKsr7ilAGXf4HavR_Ig)

1. User가 *HTTP Request*를 요청합니다.
2. Presentation Layer에서 *HTTP Request*를 `TCommand`로 변환 후 *MediatR*을 이용하여 Application Layer로 전달합니다.
3. Application Layer에서 `TCommand`에 해당하는 *Validator*로 보냅니다
4. *Validator*에서 유효성 검사 전 `PreValidate(ValidationContext<TCommand>, ValidationResult result)`메서드를 수행합니다.
5. *Validator*에서 `Validate(ValidationContext<TCommand>)` 또는 `ValidateAsync(ValidationContext<TCommand>, CancellationToken)` 메서드로 유효성 검사를 수행합니다.
6. 유효성검증이 실패하면 `RaiseValidationException(ValidationContext<TCommand>, ValidationResult result)` 메서드를 실행하여 `ValidationException`을 *throw*시킵니다.
7. Application Layer에서 Presentation Layer로 `ValidationException`을 하달합니다.
8. Presentation Layer에서 *HTTP 400(Bad Request)*을 User에게 반환합니다.
9. 유효성검증이 성공하면 `TCommand`를 `TCommandHandler`로 전달합니다.
10. `Handle(TCommand, CancellationToken)` 메서드를 실행하여 비즈니스 로직을 수행 후 `TResponse`를 Presentation Layer로 반환합니다.
11. 정상적으로 완료되었다면 Presentation Layer는 User에게 *HTTP 200(OK)*을 `TResponse`와 함께 반환합니다.
    

---
# [ASP.NET 클린아키텍처 pt.4](/Documents/CleanArchitecture/Aspnet_CleanArchitectrue_pt4.html)