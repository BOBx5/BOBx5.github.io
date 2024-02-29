---
title: WPF Grid Snippet
description: Row&Column Defined XAML <Grid/>
layout: libdoc/page

#LibDoc specific below
category: VisualStudio
order: 402
---
* 
{:toc}

## VisualStudio 기본 스니펫

---

### 기능

#### 1. RowDefinition 생성

* `rd` 입력 후 탭을 누르면 아래와 같은 코드가 생성된다.

    ```xml
    <RowDefinition Height="*"/>
    ```

#### 2. ColumnDefinition 생성

* `cd` 입력 후 탭을 누르면 아래와 같은 코드가 생성된다.

    ```xml
    <ColumnDefinition Width="*"/>
    ```

### 불편사항
* 실제로 xaml 파일을 작성하다보면 `RowDefinition`과 `ColumnDefinition`를 당연히 포함하는 `<Grid/>`를 생성하는 일이 많다.


## 해결방법 1
### 기존 Snippet 수정
---

"*C:/Program Files/Microsoft Visual Studio/2022/Community/DesignTools/Snippets/XAML/{number}*" 경로 내부에 있는 `Grid.snippet` 파일을 수정하여 사용할 수 있다.

```xml
<?xml version="1.0" encoding="utf-8"?>
<CodeSnippets xmlns="http://schemas.microsoft.com/VisualStudio/2005/CodeSnippet">

  *<!-- Full Grid Snippet 추가 -->
  <CodeSnippet Format="1.0.0">
      <Header>
      <SnippetTypes>
          <SnippetType>Expansion</SnippetType>
      </SnippetTypes>
      <Title>Grid Full</Title>
      <Author>BOBx5</Author>
      <Description>Snippet for a Full Grid</Description>
      <HelpUrl>
      </HelpUrl>
      <Shortcut>gridfull</Shortcut>
      </Header>
      <Snippet>
      <Declarations>
          <Literal Editable="true">
          <ID>Value</ID>
          <ToolTip>The height of the row (fixed, star, Auto)</ToolTip>
          <Default>1*</Default>
          <Function>
          </Function>
          </Literal>
      </Declarations>
      <Code Language="XAML">
  <![CDATA[<Grid>
      <Grid.RowDefinitions>
          <RowDefinition Height="1*"/>
      </Grid.RowDefinitions>
      <Grid.ColumnDefinitions>
          <ColumnDefinition Width="1*" />
      </Grid.ColumnDefinitions>
      $selected$$end$
  </Grid>]]>
      </Code>
      </Snippet>
  </CodeSnippet>
  </CodeSnippets>*

<!-- 기존 rd 정의... -->
<CodeSnippet Format="1.0.0"> ...
</CodeSnippet>
<!-- 기존 cd 정의... -->
<CodeSnippet Format="1.0.0"> ...
</CodeSnippet>
```


## 해결방법 2
### 신규 커스텀 Snippet 추가
---

"*C:/Users/{UserName}/Documents/Visual Studio 2022/Code Snippets/XAML/My XAML Snippets*" 경로에 `GridFull.snippet` 파일을 생성한다.

```xml
<?xml version="1.0" encoding="utf-8"?>
<CodeSnippets xmlns="http://schemas.microsoft.com/VisualStudio/2005/CodeSnippet">
  <CodeSnippet Format="1.0.0">
    <Header>
      <SnippetTypes>
        <SnippetType>Expansion</SnippetType>
      </SnippetTypes>
      <Title>Grid Full</Title>
      <Author>BOBx5</Author>
      <Description>Snippet for a Grid with rd and cd</Description>
      <HelpUrl>
      </HelpUrl>
      <Shortcut>gridfull</Shortcut>
    </Header>
    <Snippet>
      <Declarations>
        <Literal Editable="true">
          <ID>Value</ID>
          <ToolTip>The width of the column (fixed, star, Auto)</ToolTip>
          <Default>1*</Default>
          <Function>
          </Function>
        </Literal>
      </Declarations>
      <Code Language="XAML">
        <![CDATA[<Grid>
          <Grid.RowDefinitions>
            <RowDefinition Height="1*"/>
          </Grid.RowDefinitions>
          <Grid.ColumnDefinitions>
            <ColumnDefinition Width="1*"/>
          </Grid.ColumnDefinitions>
        </Grid>]]>
      </Code>
    </Snippet>
  </CodeSnippet>
  <CodeSnippet Format="1.0.0">
    <Header>
      <SnippetTypes>
        <SnippetType>Expansion</SnippetType>
      </SnippetTypes>
      <Title>Grid ColumnDefinition</Title>
      <Author>Microsoft Corporation</Author>
      <Description>Snippet for a Grid ColumnDefinition</Description>
      <HelpUrl>
      </HelpUrl>
      <Shortcut>cd</Shortcut>
    </Header>
    <Snippet>
      <Declarations>
        <Literal Editable="true">
          <ID>Value</ID>
          <ToolTip>The width of the column (fixed, star, Auto)</ToolTip>
          <Default>1*</Default>
          <Function>
          </Function>
        </Literal>
      </Declarations>
      <Code Language="XAML">
        <![CDATA[<ColumnDefinition Width="$Value$" />$selected$$end$]]>
      </Code>
    </Snippet>
  </CodeSnippet>
  <CodeSnippet Format="1.0.0">
    <Header>
      <SnippetTypes>
        <SnippetType>Expansion</SnippetType>
      </SnippetTypes>
      <Title>Grid ColumnDefinition</Title>
      <Author>Microsoft Corporation</Author>
      <Description>Snippet for a Grid ColumnDefinition</Description>
      <HelpUrl>
      </HelpUrl>
      <Shortcut>rd</Shortcut>
    </Header>
    <Snippet>
      <Declarations>
        <Literal Editable="true">
          <ID>Value</ID>
          <ToolTip>The height of the Column (fixed, star, Auto)</ToolTip>
          <Default>1*</Default>
          <Function>
          </Function>
        </Literal>
      </Declarations>
      <Code Language="XAML">
        <![CDATA[<ColumnDefinition Height="$Value$" />$selected$$end$]]>
      </Code>
    </Snippet>
  </CodeSnippet>
</CodeSnippets>
```

## 사용방법
---
이제 VisualStudio에서 xaml 파일을 열고 `grdfull`을 입력 후 탭을 누르면<br/> `Grid`와 `RowDefinition`, `ColumnDefinition`이 모두 포함된 코드가 생성된다.

```xml
<Grid>
    <Grid.RowDefinitions>
        <RowDefinition Height="1*"/>
    </Grid.RowDefinitions>
    <Grid.ColumnDefinitions>
        <ColumnDefinition Width="1*"/>
    </Grid.ColumnDefinitions>
</Grid>
```