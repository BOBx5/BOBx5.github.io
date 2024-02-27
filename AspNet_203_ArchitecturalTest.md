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

## [NetArchTest.Rule](https://nuget.org/packages/NetArchTest.Rules)

### 아키텍처 테스트
---
* 예시 
  1. '*A 어셈블리가 B 어셈블리를 반드시 참조해야한다*'
  2. '*A 어셈블리는 B 어셈블리를 참조해서는 안된다*'
  3. '*'Handler'로 끝나는 클래스는 특정 어셈블리를 반드시 참조해야한다*'
  4. '*Entity를 구현하는 클래스는 반드시 파라미터가 없는 `private` constructor를 구현하고 있어야 한다*'
  5. '*DomainEvent를 구현하는 클래스는 반드시 `sealed` 한정자로 구현되어 한다*'
  6. '*ICommandHandler를 구현하는 클래스는 반드시 'Handler'라는 이름으로 끝나야한다.*'
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
            var domainEventTypes = Types.InAssembly(DomainAssembly)
                .That()
                .ImplementInterface(typeof(DomainEvent))
                .GetTypes();

            var failingTypes = new List<Type>();
            foreach (var domainEventType in domainEventTypes)
            {
                if (!domainEventType.IsSealed)
                {
                    failingTypes.Add(domainEventType);
                }
            }

            failingTypes.Should().BeEmpty();
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
