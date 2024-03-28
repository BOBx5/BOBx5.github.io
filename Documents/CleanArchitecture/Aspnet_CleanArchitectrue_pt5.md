---
title: "4. Presentation Layer 설계하기"
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

# **Dependency Injection**
---
API를 운영하기 위한 모든 준비가 끝났습니다.

이제 남은건 `program.cs` 파일에 DI를 설정하는 것입니다.

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
app.UseAuthorization();
app.MapControllers();
app.Run();
```

1. **`builder.Services.AddApplication(builder.Configuration);`**

    Application Layer에 대한 DI 설정을 추가합니다.

    > 💡 참조
    >
    > [3. Application Layer 설계하기 - DependencyInjection](/Documents/CleanArchitecture/Aspnet_CleanArchitectrue_pt3.html#dependency-injection)

2. **`builder.Services.AddPersistence(builder.Configuration);`**

    Infrastructure Layer의 Persistence 대한 DI 설정을 추가합니다.

    > 💡 참조
    >
    > [4. Infrastructure Layer 설계하기 - Persistence - DependencyInjection](/Documents/CleanArchitecture/Aspnet_CleanArchitectrue_pt4.html#dependency-injection-1)

3. **`builder.Services.AddDateTimeService(builder.Configuration);`**

    Infrastructure Layer의 DateTimeProvider에 대한 DI 설정을 추가합니다.

    > 💡 참조
    >
    > [4. Infrastructure Layer 설계하기 - DateTimeProvider - DependencyInjection](/Documents/CleanArchitecture/Aspnet_CleanArchitectrue_pt4.html#dependency-injection)
    


# 다음 단계
---
[6. 부록](/Documents/CleanArchitecture/Aspnet_CleanArchitectrue_pt6.html)
