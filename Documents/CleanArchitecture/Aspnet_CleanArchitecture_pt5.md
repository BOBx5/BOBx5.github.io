---
title: "4. Presentation Layer"
description: <span>&#x23;ASP.NET &#x23;CleanArchitecture</span>
layout: libdoc/page

#LibDoc specific below
category: CleanArchitecture
order: 905
---
* 
{:toc}

# **Presentation Layer 설계**
---

자, 이제 끝이 얼마 남지 않았습니다.

이번에는 Presentation Layer를 설계해보겠습니다.

MVC 패턴을 사용할 수 있으나, 이번 예제에서는 간단하게 Web API를 사용하여 구현해보겠습니다.

```plaintext
Library
├─ Library.Shared
├─ Library.Domain
├─ Library.Application
├─ Library.Infrastructure
└─ Library.Presentaion*
    └─ Library.Presentaion.Api*
```

먼저 솔루션에 *Library.Presentation* 디렉토리를 생성하고, 

그 안에 *Library.Presentation.Api* 프로젝트를 생성합니다.

솔루션 루트 경로에 *Library.Presentation.Api* 프로젝트를 생성하지 않는 이유는

동일한 Application Layer를 사용하는 여러 Presentation Layer를 만들 수 있기 때문입니다.

# **Library.Presentation.Api**
---

기본 템플릿을 사용하여 Web API 프로젝트를 생성하였다면,

WeatherForecast 관련된 템플릿 파일들을 삭제합니다.

그리고 유저를 생성하는 *Use-Case*를 구현해 봅시다.

## Controllers

### UsersController
---
```plaintext
Library
├─ Library.Shared
├─ Library.Domain
├─ Library.Application
├─ Library.Infrastructure
└─ Library.Presentaion
    └─ Library.Presentaion.Api
        └─ Controllers*
            └─ UsersController.cs*
```
```csharp
[Route("api/[controller]")]
[ApiController]
public class UsersController : ControllerBase
{
    private readonly IMediator _mediator;
    public UsersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> CreateUser(
        [FromBody]CreateUserCommand command)
    {
        CreateUserCommandResponse result = await _mediator.Send(command);
        return Ok(result);
    }
}
```

[MediatR](https://github.com/jbogard/MediatR)을 사용할 수 있도록 **`IMediator`**를 주입받아 필드로 초기화합니다.

1. 요청자로부터 *HTTP Request*의 *Body*로 **`CreateUserCommand`**를 받고, 이를 *MediatR* 파이프라인으로 전송합니다.
2. 내부적으로는 먼저 **`CreateUserCommandValidator`**를 통해 유효성 검사를 수행합니다.
 * 실패하는 경우 **`ValidationException`**을 발생시킵니다.
3. 정상적으로 완료되면 **`CreateUserCommandHandler`**를 통해 비즈니스 로직을 수행합니다.
4. 비즈니스 로직에서 모든 작업이 정상적으로 완료되면 **`CreateUserCommandResponse`**를 반환합니다.
5. Presentation Layer에서는 **HTTP 200 (OK)**와 함께 **`CreateUserCommandResponse`**를 *Response*합니다.


# **Middlewares**
---

## ValidationExceptionMiddleware

자, 이제 `ValidationException`이 *throw* 되는 경우 **HTTP 400 (BadRequest)** 형태로 말아 *HTTP Response*를 생성하는 미들웨어를 만들어봅시다.

```plaintext
Library
├─ Library.Shared
├─ Library.Domain
├─ Library.Application
├─ Library.Infrastructure
└─ Library.Presentaion
    └─ Library.Presentaion.Api
        ├─ Controllers
        └─ Middlewares*
            └─ ValidationExceptionMiddleware.cs*
```
```csharp
public class ValidationExceptionMiddleware : IMiddleware
{
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        ...
    }
}
```

`IMiddleware`를 상속받게 되면 `Task InvokeAsync(HttpContext context, RequestDelegate next)` 메서드를 구현해야 합니다.

```csharp
public async Task InvokeAsync(HttpContext context, RequestDelegate next)
{
    try
    {
        await next(context);
    }
    catch (ValidationException ex)
    {
        ...
    }
}
```

기본적인 처리 방식은 `await next(context)`를 호출함으로써 다음 미들웨어로 요청을 전달하는 방식입니다.

하지만 `ValidationException`이 `await next(context)`를 실행하던 중 *throw* 된 Exception이므로

이제 여러분은 `ValidationException`이 발생하는 경우의 *catch*에 대한 처리를 아래와 같이 구현하면 됩니다.

```csharp
catch (ValidationException ex)
{
    // 1. 이미 다른 미들웨어 등에 의해 Response가 시작된 경우 예외 처리
    if (context.Response.HasStarted)
        throw;

    // 2. HTTP 표준 ProblemDetails 형태로 변환 (참조: https://datatracker.ietf.org/doc/html/rfc7807)
    ProblemDetails problemDetails = new()
    {
        Type = "https://datatracker.ietf.org/doc/html/rfc7807", // 에러 관련 자체 도큐먼트가 있는 경우 URL로 변경
        Title = "Validation error",
        Detail = "One or more validation errors has occurred",
        Status = StatusCodes.Status400BadRequest,
        Instance = context.Request.Path,
    };

    // 3. 오류를 추적하기 위한 TraceId 추가
    problemDetails.Extensions["traceId"] = context.TraceIdentifier;

    // 4. ValidationException의 Errors를 ProblemDetails에 추가
    if (ex.Errors is not null)
    {
        problemDetails.Extensions["invalid-params"] = ex.Errors
            .GroupBy(failure => failure.PropertyName,
                     failure => failure.ErrorMessage,
            (propertyName, errorMessages) => new
            {
                Key = propertyName,
                Values = errorMessages.Distinct().ToArray() // 중복 제거
            })
            .ToDictionary(x => x.Key, x => x.Values);
    }

    // 5. HTTP Status Code 설정
    context.Response.StatusCode = problemDetails.Status.Value;

    // 6. Content-Type 설정
    context.Response.ContentType = MediaTypeNames.Application.ProblemJson;

    // 7. ProblemDetails를 JSON으로 변환하여 Response Body에 추가
    await context.Response.WriteAsync(result);
}
```

이제 생성한 `ValidationExceptionMiddleware`를 사용하기 편리하도록 Extension Method를 생성합니다.

```csharp
namespace Library.Presentaion.Api.Middlewares

public class ValidationExceptionMiddleware : IMiddleware
{
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        try
        {
            ...
        }
        catch (ValidationException ex)
        {
            ...
        }
    }
}
public static class ValidationExceptionMiddlewareExtensions
{
    public static IApplicationBuilder UseValidationExceptionMiddleware(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<ValidationExceptionMiddleware>();
    }
}
```

이제 `ValidationExceptionMiddleware`를 사용하기 위한 준비가 완료되었습니다.


# **Dependency Injection**
---
```csharp
using LibrarySolution.Application;
using LibrarySolution.Controller.Api.Middlewares;
using LibrarySolution.Infrastructure.DateTimeProvider;
using LibrarySolution.Infrastructure.EmailService;
using LibrarySolution.Infrastructure.Persistence;

#region Buidler
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();

// 1. Application Layer
builder.Services.AddApplication(builder.Configuration);

// 2. Infrastructure Layer - Persistence
builder.Services.AddPersistence(builder.Configuration);

// 3. Infrastructure Layer - DateTimeProvider
builder.Services.AddDateTimeService(builder.Configuration);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
#endregion

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// 4. Middleware - ValidationException
app.UseValidationExceptionMiddleware();

app.UseAuthorization();
app.MapControllers();
app.Run();
```

1. **`builder.Services.AddApplication(builder.Configuration);`**

    Application Layer에 대한 DI 설정을 추가합니다.

    > 💡 참조
    >
    > [3. Application Layer - DependencyInjection](/Documents/CleanArchitecture/Aspnet_CleanArchitecture_pt3.html#dependency-injection)

2. **`builder.Services.AddPersistence(builder.Configuration);`**

    Infrastructure Layer의 Persistence 대한 DI 설정을 추가합니다.

    > 💡 참조
    >
    > [4. Infrastructure Layer - Persistence - DependencyInjection](/Documents/CleanArchitecture/Aspnet_CleanArchitecture_pt4.html#dependency-injection-1)

3. **`builder.Services.AddDateTimeService(builder.Configuration);`**

    Infrastructure Layer의 DateTimeProvider에 대한 DI 설정을 추가합니다.

    > 💡 참조
    >
    > [4. Infrastructure Layer - DateTimeProvider - DependencyInjection](/Documents/CleanArchitecture/Aspnet_CleanArchitecture_pt4.html#dependency-injection)
    
4. **`app.UseValidationExceptionMiddleware();`**

    Middleware를 사용하기 위한 DI 설정을 추가합니다.

    > 💡 참조
    >
    > [5. Presentation Layer - Middlewares](/Documents/CleanArchitecture/Aspnet_CleanArchitecture_pt5.html#middlewares)



API를 운영하기 위한 모든 준비가 끝났습니다.



# 다음 단계
---
작성 중...
<!-- [6. 부록](/Documents/CleanArchitecture/Aspnet_CleanArchitecture_pt6.html) -->
