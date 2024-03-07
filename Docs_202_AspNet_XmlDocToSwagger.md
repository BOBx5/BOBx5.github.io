---
title: XML Document to Swagger Document
description: <span>&#x23;ASP.NET</span>
layout: libdoc/page

#LibDoc specific below
category: ASP.NET
order: 202
---
<div align="left">
    <img src="https://img.shields.io/badge/ASP.NET Core-512BD4?style=flat&logo=.NET&logoColor=white"/>
</div>
{:toc}
---

## C# XML Summary를 Swagger 문서로 변환

```csharp
public class SomeController : ControllerBase
{
    /// <summary>
    /// SomeDto를 등록합니다
    /// </summary>
    /// <param name="dto">등록하고자 하는 DTO</param>
    /// <returns>성공 시 Http 200을 반환합니다.</returns>
    [HttpPost]
    public async Task<IActionResult> Post(SomeDto dto)
    {
        return Ok();
    }
}
```
ASP.NET 개발을 하다보면 위와 같은 XML주석(*Summary*)을 작성하게 되는데<br/>
이를 Swagger 문서로 변환하는 방법을 알아보자.

#### `Program.cs`
```csharp
builder.Services.AddSwaggerGen(options =>
{
    // 참조할 XML 파일명
    var xmlFile = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
    // XML 파일 경로
    var xmlPath = System.IO.Path.Combine(AppContext.BaseDirectory, xmlFile);
    // XML 파일 참조
    options.IncludeXmlComments(xmlPath);
});
```

#### `{ProjectName}.csproj`
```xml
<PropertyGroup>
    <!--XML 도큐먼트 자동 생성-->
    <GenerateDocumentationFile>true</GenerateDocumentationFile>
    <!--XML 주석 미작성 Warning 해제-->
    <NoWarn>$(NoWarn);CS1591</NoWarn>
</PropertyGroup>
```

위와 같이 작성하게 되면 Swagger에 XML 주석이 자동으로 생성 및 반영된다.

개꿀 👍