---
title: "[NuGet] Demystifier"
description: <span>&#x23;CSharp &#x23;NuGet</span>
layout: libdoc/page

#LibDoc specific below
category: CSharp
order: 106
---
* 
{:toc}

## [Ben.Demystifier](https://github.com/benaadams/Ben.Demystifier)
### 읽기편한 StackTrace를 위한 NuGet 패키지
{:.no_toc}
---

* 기본 닷넷 StackTrace는 읽기 어렵다. (특히 async 메서드 포함 시)
* 이러한 StackTrace를 읽기 쉽게 만들어주는 NuGet 패키지

> **demystify**는 사전적 의미
> * *to make something easier to understand.*
> * *무언가를 이해하기 쉽게 만들다.*

### Demystifier 사용방법
---
* NuGet 패키지 설치
    ```powershell
    Install-Package Ben.Demystifier
    ```

* 사용방법
    ```csharp
    using Ben.Demystifier;
    ...
    catch (Exception ex)
    {
        var demystified = ex.Demystify();
        Console.WriteLine(demystified);
    }
    ```

### StackTrace 비교
---

#### `exception.ToString()`

```csharp
System.InvalidOperationException: Collection was modified; enumeration operation may not execute.
    at System.ThrowHelper.ThrowInvalidOperationException_InvalidOperation_EnumFailedVersion() // ? low value
    at System.Collections.Generic.List`1.Enumerator.MoveNextRare()                         
    at Program.<Iterator>d__3.MoveNext()                                                   // which enumerator?
    at System.Linq.Enumerable.SelectEnumerableIterator`2.MoveNext()                        // which enumerator?
    at System.String.Join(String separator, IEnumerable`1 values)                          
    at Program.GenericClass`1.GenericMethod[TSubType](TSubType& value)                     
    at Program.<MethodAsync>d__4.MoveNext()                                                // which async overload?
--- End of stack trace from previous location where exception was thrown ---              // ? no value
    at System.Runtime.ExceptionServices.ExceptionDispatchInfo.Throw()                      // ? no value
    at System.Runtime.CompilerServices.TaskAwaiter.HandleNonSuccessAndDebuggerNotification(Task task) // ? no value
    at System.Runtime.CompilerServices.TaskAwaiter`1.GetResult()                           // ? no value
    at Program.<MethodAsync>d__5`1.MoveNext()                                              // which async overload?
--- End of stack trace from previous location where exception was thrown ---              // ? no value
    at System.Runtime.ExceptionServices.ExceptionDispatchInfo.Throw()                      // ? no value
    at System.Runtime.CompilerServices.TaskAwaiter.HandleNonSuccessAndDebuggerNotification(Task task) // ? no value
    at System.Runtime.CompilerServices.TaskAwaiter`1.GetResult()                           // ? no value
    at Program.<>c__DisplayClass8_0.<Method>b__0()                                         //  ¯\_(ツ)_/¯
    at Program.<>c__DisplayClass8_0.<Method>b__1()                                         //  ¯\_(ツ)_/¯
    at Program.RunLambda(Func`1 lambda) 
    at Program.Method(String value)
    at Program.<RefMethod>g__LocalFuncRefReturn|10_1(<>c__DisplayClass10_0& )              // local function
    at Program.<RefMethod>g__LocalFuncParam|10_0(String val, <>c__DisplayClass10_0& )      // local function
    at Program.RefMethod(String value)
    at Program.<>c.<.cctor>b__18_1(String s, Boolean b)                                    //  ¯\_(ツ)_/¯
    at Program.<>c.<.cctor>b__18_0(String s, Boolean b)                                    //  ¯\_(ツ)_/¯
    at Program.Start(ValueTuple`2 param)                                                   // Tuple param?
    at Program.<Start>g__LocalFunc1|11_0(Int64 l)                                          // local function
    at Program.<Start>g__LocalFunc2|11_1(Boolean b1, Boolean b2)                           // local function
    at Program.Start()
    at Program.<>c.<.ctor>b__1_0()                                                         //  ¯\_(ツ)_/¯
    at Program.<>c__DisplayClass2_0.<.ctor>b__0(Object state)                              //  ¯\_(ツ)_/¯
    at Program.RunAction(Action`1 lambda, Object state)
    at Program..ctor(Action action)                                                        // constructor
    at Program..ctor()                                                                     // constructor
    at Program.Main(String[] args)
```


#### `exception.Demystify()`

```csharp
System.InvalidOperationException: Collection was modified; enumeration operation may not execute.
at bool System.Collections.Generic.List<T>+Enumerator.MoveNextRare()
at IEnumerable<string> Program.Iterator(int startAt)+MoveNext()                       // Resolved enumerator
at bool System.Linq.Enumerable+SelectEnumerableIterator<TSource, TResult>.MoveNext()  // Resolved enumerator
at string string.Join(string separator, IEnumerable<string> values)                    
at string Program+GenericClass<TSuperType>.GenericMethod<TSubType>(ref TSubType value) 
at async Task<string> Program.MethodAsync(int value)                                  // Resolved async 
at async Task<string> Program.MethodAsync<TValue>(TValue value)                       // Resolved async 
at string Program.Method(string value)+()=>{} [0]                                     // lambda source + ordinal
at string Program.Method(string value)+()=>{} [1]                                     // lambda source + ordinal 
at string Program.RunLambda(Func<string> lambda)                                       
at (string val, bool) Program.Method(string value)                                    // Tuple returning
at ref string Program.RefMethod(in string value)+LocalFuncRefReturn()                 // ref return local func
at int Program.RefMethod(in string value)+LocalFuncParam(string val)                  // local function
at string Program.RefMethod(in string value)                                          // in param (readonly ref)    
at (string val, bool) static Program()+(string s, bool b)=>{}                         // tuple return static lambda
at void static Program()+(string s, bool b)=>{}                                       // void static lambda
at void Program.Start((string val, bool) param)                                       // Resolved tuple param
at void Program.Start((string val, bool) param)+LocalFunc1(long l)                    // void local function 
at bool Program.Start((string val, bool) param)+LocalFunc2(bool b1, bool b2)          // bool return local function 
at string Program.Start()                                                              
at void Program()+()=>{}                                                              // ctor defined lambda  
at void Program(Action action)+(object state)=>{}                                     // ctor defined lambda 
at void Program.RunAction(Action<object> lambda, object state)                         
at new Program(Action action)                                                         // constructor 
at new Program()                                                                      // constructor 
at void Program.Main(String[] args)                                                    
```

#### 차이점
---

* **생성자(constructors)** 

    * 기존

        `at Program..ctor(Action action)`

    * 변경

        `at void Program.RunAction(Action<object> lambda, object state)`
    
* **매개변수(parameters)** `ref`, `out`, `in`

    * 기존

        `at Program.<RefMethod>g__LocalFuncRefReturn|10_1(<>c__DisplayClass10_0& )`

    * 변경

        `at ref string Program.RefMethod(in string value)+LocalFuncRefReturn()`
   
* **반복자(iterators)**  **overload* 확인

    * 기존

        `<Iterator>d__3.MoveNext()`

    * 변경

        `Iterator(int startAt)+MoveNext()`
    
* **Linq** **overload* 확인

    * 기존

        `Linq.Enumerable.SelectEnumerableIterator``2.MoveNext()`

    * 변경

        `Linq.Enumerable+SelectEnumerableIterator<TSource, TResult>.MoveNext()`

* **비동기(async)** **overload* & `async` 확인

    * 기존

        `<MethodAsync>d__5``1.MoveNext()` 

    * 변경

        `async Task<string> Program.MethodAsync(int value)`

* **람다식(lambdas)**
    * 기존

        `at Program.<>c__DisplayClass2_0.<.ctor>b__0(Object state)`
    
    * 변경

        `at void Program(Action action)+(object state)=>{}`

* **로컬 펑션(local functions)**
    * 기존

        `at ref string Program.RefMethod(in string value)+LocalFuncRefReturn()`
    
    * 변경

        `at Program.<RefMethod>g__LocalFuncRefReturn|10_1(<>c__DisplayClass10_0& )`

* **제네릭 매개변수(generic parameters)**
    * 기존

        `RunLambda(Func``1 lambda)`

    * 변경

        `RunLambda(Func<string> lambda)`

* **value tuples**
    * 기존

        `ValueTuple``2 param`

    * 변경

        `(string val, bool) param`

* **원시타입(primitive types)**
    * 기존

        `Int64`, `Boolean`, `String`

    * 변경

        `long`, `bool`, `string`

* **반환형(return types)**

    * 기존

        `at Program.Start()`

    * 변경

        `at string Program.Start()`

