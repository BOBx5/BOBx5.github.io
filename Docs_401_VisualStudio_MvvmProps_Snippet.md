---
title: "[Snippet] MVVM Property"
description: <span>&#x23;VisualStudio &#x23;CSharp &#x23;MVVM &#x23;Snippet</span>
layout: libdoc/page

#LibDoc specific below
category: VisualStudio
order: 401
---
* 
{:toc}
<div align="left">
    <img src="https://img.shields.io/badge/VisualStudio-5C2D91?style=flat&logo=visualstudio&logoColor=white"/>
    <img src="https://img.shields.io/badge/C%23-512BD4?style=flat&logo=csharp&logoColor=white"/>
</div>
---

# MVVM 패턴용 편리한 프로퍼티 스니펫 

## 기본 'propfull' 스니펫

---

* Visual Studio에서 'propfull'이라고 입력하면 탭을 누르면 아래와 같은 코드가 생성된다.<br/>

    ```csharp
    private string _myProperty;

    public int MyProperty
    {
        get { return myVar; }
        set { myVar = value; }
    }
    ```

## MVVM 패턴을 적용한 코드

 ---

* MVVM 패턴에서는 프로퍼티가 변경될 때마다 `OnPropertyChanged` 메서드를 호출하여 UI를 업데이트한다.
  
    ```csharp
    private string _myProperty;

    public string MyProperty
    {
        get { return _myProperty; }
        set
        {
            if (_myProperty != value)
            {
                _myProperty = value;
                OnPropertyChanged(nameof(MyProperty));
            }
        }
    }
    ```
    
* 간소화 시키면 아래와 같이 작성할 수 있다. * *CommunityToolKit 기준*
    
    ```csharp
    private string _myProperty;

    public string MyProperty
    {
        get => _myProperty;
        set => SetProperty(ref _myProperty, value);
    }
    ```

## 스니펫으로 만들어보자

---

```xml
<?xml version="1.0" encoding="utf-8" ?>
<CodeSnippets  xmlns="<http://schemas.microsoft.com/VisualStudio/2005/CodeSnippet>">
	<CodeSnippet Format="1.0.0">
		<Header>
			<Title>propmvvm</Title>
			<Shortcut>propmvvm</Shortcut>
			<Description>Code snippet for property and backing field with mvvm pattern</Description>
			<Author>BOBx5</Author>
			<SnippetTypes>
				<SnippetType>Expansion</SnippetType>
			</SnippetTypes>
		</Header>
		<Snippet>
			<Declarations>
				<Literal>
					<ID>type</ID>
					<ToolTip>Property type</ToolTip>
					<Default>int</Default>
				</Literal>
				<Literal>
					<ID>property</ID>
					<ToolTip>Property name</ToolTip>
					<Default>MyProperty</Default>
				</Literal>
			</Declarations>
			<Code Language="csharp"><![CDATA[public $type$ $property$
	{
		get => _$property$;
		set => SetProperty(ref _$property$, value);
	}
	private $type$ _$property$;]]>
			</Code>
		</Snippet>
	</CodeSnippet>
</CodeSnippets>
```

* 위와 같이 작성된 파일을 *propmvvm.snippet* 이라는 이름으로 저장한다.
* 아래 경로에 저장한다
    > *C:/Users/{PC유저명}/Documents/Visual Studio 2022/Code Snippets/Visual C#/My Code Snippets* 
  
## 결과물

---

이제 VS에서 `propmvvm`이라고 입력하면 아래와 같은 코드가 생성된다.

```csharp
public int MyProperty
{
    get => _MyProperty;
    set => SetProperty(ref _MyProperty, value);
}
private int _MyProperty;
```

### 개선사항

--- 

#### 1. 가독성 개선
##### 선언 순서 변경

---

 * (기존) *<u>field</u>* 선 선언 & *<u>property</u>* 후 선언

    ![](/assets/docs/400_VisualStudio/401/1.webp)<br/>

 * (변경) *<u>property</u>* 선 선언 & *<u>field</u>* 후 선언으로

    ![](/assets/docs/400_VisualStudio/401/2.webp)<br/>

 * VisualStudio의 *CodeLens*는 property를 참조하는 숫자를 보여주는데, <br/>
  그게 field 선언 사이의 공간을 띄워 가독성이 떨어지게 만든다.<br/>
  특히, *<u>property</u>* 스코프를 접으면 눈에 띈다.

#### 2. 편리한 네이밍 변경
##### 대소문자 변경

 ---

* (기존) *<u>field</u>*명: 언더바`_` + 소문자 시작

    ![](/assets/docs/400_VisualStudio/401/3.webp)<br/>
    `private int _myProperty;`

* (변경) *<u>field</u>*명: 언더바`_` + 대문자 시작

    ![](/assets/docs/400_VisualStudio/401/4.webp)<br/>
    `private int _MyProperty;`

* VS스니펫은 일괄적으로 네이밍 변경 기능을 제공하는데<br/>
  덕분에 기본 `propfull` 스니펫은 `_myProperty` *<u>field</u>*를 일괄적으로 변경할 수 있다.

* `propmvvm` 스니펫은 *<u>field</u>* & *<u>property</u>* 모두 대문자 시작으로 동일하게 변경하여<br/>
스니펫 입력 시 일괄적으로 같은 이름을 넣어줄 수 있게 만들었다.



