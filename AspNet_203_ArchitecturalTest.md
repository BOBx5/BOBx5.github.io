---
title: 아키텍처 테스트
description: 아키텍처에 맞게 코딩되었는지 테스트하기
layout: libdoc/page

#LibDoc specific below
category: ASP.NET
order: 203
---
* 
{:toc}

## NetArchTest.Rule
<img src="https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white"/>[🔗](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white)

<img src="https://img.shields.io/badge/NuGet-004880?style=flat&logo=nuget&logoColor=white"/>[🔗](https://nuget.org/packages/NetArchTest.Rules)

<img src="https://img.shields.io/badge/ProjectWeb-4285F4?style=flat&logoColor=white&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgNTYgNTYiPg0KICAgIDxwYXRoIGZpbGw9IiNGRkZGRkYiIGQ9Ik0yOC4wMjMgNTEuMjczYzEyLjcyNyAwIDIzLjI1LTEwLjU0NiAyMy4yNS0yMy4yNzNDNTEuMjc0IDE1LjI5NyA0MC43MjcgNC43MjcgMjggNC43MjdTNC43MjcgMTUuMjk3IDQuNzI3IDI4YzAgMTIuNzI3IDEwLjU3IDIzLjI3MyAyMy4yOTYgMjMuMjczbS02Ljc1LTM1LjQxNGMxLjM4My0zLjQ5MiAzLjI4Mi02IDUuMzY4LTYuNzczdjcuMzEyYTM0LjA3OCAzNC4wNzggMCAwIDEtNS4zNjgtLjUzOW04LjA2My02Ljc3M2MyLjA4Ni43NzMgNC4wMDggMy4yODEgNS4zNjcgNi43NzNhMzMuNzcgMzMuNzcgMCAwIDEtNS4zNjcuNTRabTQuOTQ1LjY1NmMyLjUwOC44NjcgNC43ODIgMi4yMDMgNi42OCAzLjk2MWMtMS4wMzEuNTg2LTIuMjI3IDEuMDc4LTMuNTYzIDEuNWMtLjg0My0yLjE4LTEuOTIyLTQuMDMxLTMuMTE3LTUuNDZtLTE5LjI2NSAzLjk2MWExOS41NCAxOS41NCAwIDAgMSA2LjcwMy0zLjk2Yy0xLjIxOSAxLjQyOS0yLjI3NCAzLjI4LTMuMTQgNS40NmMtMS4zMTMtLjQyMi0yLjUwOS0uOTE0LTMuNTYzLTEuNW0yNC42MDkgMTIuOTM4Yy0uMTE3LTMuMjU4LS42MS02LjI4Mi0xLjM4My04Ljk1M2MxLjc1OC0uNTQgMy4zMDUtMS4yMiA0LjYxNy0yLjAxNmMyLjQ4NSAzIDQuMTAyIDYuNzk3IDQuMzgzIDEwLjk2OVptLTMwLjg2NyAwYTE5LjA0OSAxOS4wNDkgMCAwIDEgNC4zODMtMTAuOTdjMS4yODkuNzk4IDIuODU5IDEuNDc3IDQuNTkzIDIuMDE3Yy0uNzczIDIuNjcxLTEuMjQyIDUuNjk1LTEuMzU5IDguOTUzWm0yMC41NzggMHYtNy41NDdhMzYuODU2IDM2Ljg1NiAwIDAgMCA2LjIzNC0uNzI3YTM2LjE4MSAzNi4xODEgMCAwIDEgMS4yOSA4LjI3NFptLTEwLjE5NSAwYTMzLjc3OCAzMy43NzggMCAwIDEgMS4yODktOC4yNzRjMS45MjIuMzk5IDQuMDMuNjU2IDYuMjEuNzI3djcuNTQ3Wk04Ljc1OCAyOS4zMzZoNy42MTdjLjA5NCAzLjMwNS41ODYgNi4zOTggMS4zNiA5LjA5NGMtMS43MTIuNTM5LTMuMjU4IDEuMTk1LTQuNTQ3IDEuOTkyYTE5LjI4OSAxOS4yODkgMCAwIDEtNC40My0xMS4wODZtMTAuMzYgMGg3LjUyM3Y3LjY4N2MtMi4xOC4wNy00LjI5LjMwNS02LjIxMS43MjdjLS43MjctMi41MzEtMS4xOTYtNS40MTQtMS4zMTMtOC40MTRtMTAuMjE4IDcuNjg3di03LjY4N2g3LjUyM2MtLjA5MyAzLS41NjIgNS44ODMtMS4yODkgOC40MTRjLTEuOTQ1LS40MjItNC4wMzEtLjY1Ni02LjIzNC0uNzI3bTguOTA2IDEuNDA3Yy43OTctMi42OTYgMS4yNjYtNS43OSAxLjM4My05LjA5NGg3LjYxN2ExOC45MTggMTguOTE4IDAgMCAxLTQuNDMgMTEuMDg2Yy0xLjI4OS0uNzc0LTIuODM1LTEuNDUzLTQuNTctMS45OTJtLTE2Ljk2OSAxLjgyOGEzNC4wNzggMzQuMDc4IDAgMCAxIDUuMzY4LS41NHY3LjMxM2MtMi4wODYtLjc3My0zLjk4NS0zLjI4MS01LjM2OC02Ljc3M204LjA2My0uNTRjMS45NDUuMDQ4IDMuNzI3LjIzNSA1LjM2Ny41NGMtMS4zNiAzLjQ5Mi0zLjI4MSA2LTUuMzY3IDYuNzczWm0tMTQuMjUgMi42NWExOS4wNTkgMTkuMDU5IDAgMCAxIDMuNDkyLTEuNDU0Yy44NDQgMi4xMSAxLjg1MiAzLjg5IDMuMDI0IDUuMzJhMTkuMDg4IDE5LjA4OCAwIDAgMS02LjUxNi0zLjg2N20yMi4zMTItMS40NTRjMS4zMTMuMzk4IDIuNDg1Ljg5IDMuNTE2IDEuNDc3YTE5LjE4OSAxOS4xODkgMCAwIDEtNi41MzkgMy44NjdjMS4xNzItMS40MyAyLjIwMy0zLjIzNSAzLjAyMy01LjM0NCIvPg0KPC9zdmc+"/>[🔗](https://www.ben-morris.com/writing-archunit-style-tests-for-net-and-c-for-self-testing-architectures/)

### 아키텍처 테스트
---
* 예시 
  1. '*A 어셈블리가 B 어셈블리를 반드시 참조해야한다*'
  2. '*A 어셈블리는 B 어셈블리를 참조해서는 안된다*'
  3. '*'Handler'로 끝나는 클래스는 특정 어셈블리를 반드시 참조해야한다*'
  4. '*Entity를 구현하는 클래스는 반드시 파라미터가 없는 `private` constructor를 구현하고 있어야 한다*'
  5. '*DomainEvent를 구현하는 클래스는 반드시 `sealed` 한정자로 구현되어 한다*'
  6. '*ICommandHandler를 구현하는 클래스는 반드시 'Handler'라는 이름으로 끝나야한다.*'
  7. '*모든 인터페이스는 대문자 `I`로 시작해야한다.*'
* 위와 같은 것들을 테스트 자동화로 구현화여 코드가 아키텍처 규칙을 준수하는지 확인할 수 있다.

### 코드 예시
---
1. ***'A 어셈블리가 B 어셈블리를 반드시 참조해야한다.'***
    ```csharp
    public class LayerTest
    {
        private static readonly Assembly ApplicationAssembly = typeof(ApplicationLayer).Assembly;

        [Fact]
        public void Application_Should_HaveDependencyOnDomain()
        {
            var result = Types.InAssembly(ApplicationAssembly)
                .Should()
                .HaveDependencyOn("Application")
                .GetResult();

            result.IsSuccessful.Should().BeTrue();
        }
    }
    ```
2. ***'A 어셈블리는 B 어셈블리를 참조해서는 안된다.'***
    ```csharp
    public class LayerTest
    {
        private static readonly Assembly ApplicationAssembly = typeof(ApplicationLayer).Assembly;

        [Fact]
        public void Application_Should_NotHaveDependencyOnInfrastructure()
        {
            var result = Types.InAssembly(ApplicationAssembly)
                .Should()
                .NotHaveDependencyOn("Infrastructure")
                .GetResult();

            result.IsSuccessful.Should().BeTrue();
        }
    }
    ```
3. ***'Handler'로 끝나는 클래스는 특정 어셈블리를 반드시 참조해야한다.***
    ```csharp
    public class LayerTest
    {
        private static readonly Assembly ApplicationAssembly = typeof(ApplicationLayer).Assembly;

        [Fact]
        public void Application_Should_HaveDependencyOnDomain()
        {
            var result = Types.InAssembly(ApplicationAssembly)
                .That()
                .ResideInNamespace("Application.Handlers")
                .Should()
                .HaveDependencyOn("Domain")
                .GetResult();

            result.IsSuccessful.Should().BeTrue();
        }
    }
    ```
4. ***'Entity를 구현하는 클래스는 반드시 파라미터가 없는 `private` constructor를 구현하고 있어야 한다.'***
    ```csharp
    public class DomainTest
    {
        private static readonly Assembly DomainAssembly = typeof(DomainLayer).Assembly;

        [Fact]
        public void Entities_Should_HaveDefaultConstructor()
        {
            var entityTypes = Types.InAssembly(DomainAssembly)
                .That()
                .Inherit(typeof(EntityBase))
                .GetTypes();
            
            var failingTypes = new List<Type>();
            foreach (var entityType in entityTypes)
            {
                var constructors = entityType.GetConstructors(BindingFlags.NonPublic | BindingFlags.Instance);

                if (!constructors.Any(c => c.GetParameters().Length == 0))
                {
                    failingTypes.Add(entityType);
                }
            }   

            failingTypes.Should().BeEmpty();
        }
    }
    ```
5. ***'DomainEvent를 구현하는 클래스는 반드시 `sealed` 한정자로 구현되어 한다.'***
    ```csharp
    public class DomainTest
    {
        private static readonly Assembly DomainAssembly = typeof(DomainLayer).Assembly;

        [Fact]
        public void DomainEvents_ShouldBeSealed()
        {
            var result = Types.InAssembly(DomainAssembly)
                .That()
                .Inherit(typeof(DomainEvent))
                .Should()
                .BeSealed()
                .GetResult();
            
            result.IsSuccessful.Should().BeTrue();
        }
    }
    ```
6. ***'ICommandHandler를 구현하는 클래스는 반드시 'Handler'라는 이름으로 끝나야한다.'***
    ```csharp
    public class ApplicationTest
    {
        private static readonly Assembly ApplicationAssembly = typeof(ApplicationLayer).Assembly;

        [Fact]
        public void CommandHandlers_ShouldEndWithHandler()
        {
            var result = Types.InAssembly(ApplicationAssembly)
                .That()
                .ImplementInterface(typeof(ICommandHandler<,>))
                .Should()
                .HaveNameEndingWith("Handler")
                .GetResult();

            result.IsSuccessful.Should().BeEmpty();
        }
    }
    ```
7. ***'모든 인터페이스는 대문자 `I`로 시작해야한다.'***
    ```csharp
    public class LayerTest
    {
        private static readonly Assembly DomainAssembly = typeof(DomainLayer).Assembly;

        [Fact]
        public void Interfaces_ShouldStartWithI()
        {
            var result = Types.InAssembly(DomainAssembly)
                .That()
                .AreInterfaces()
                .Should()
                .HaveNameStartingWith("I")
                .GetResult();

            result.IsSuccessful.Should().BeTrue();
        }
    }
    ```

