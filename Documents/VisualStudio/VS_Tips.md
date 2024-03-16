---
title: "VisualStudio 팁"
description: <span>&#x23;VisualStudio</span>
layout: libdoc/page

#LibDoc specific below
category: VisualStudio
order: 404
---
* 
{:toc}

## Json → C# Class
---
### Clipboard의 Json을 C# Class로 변환하기
{:.no_toc}

![](/assets/Documents/VisualStudio/VS_Tips/1.webp)

VisualStudio에는 현재 클립보드(`Ctrl` + `C`)에 복사한 json을<br/>
C# Class로 변환하는 기능이 내장되어 있다.

`Edit` > `Paste Special` > `Paste JSON as Classes`

## .NET Symbol MSDN
---
### .NET Symbol 문서로 바로 이동하기
{:.no_toc}
![](/assets/Documents/VisualStudio/VS_Tips/2.webp)
원하는 .NET Symbol에 커서를 두고 `F1`을 누르면<br/>
해당하는 MSDN 문서로 바로 이동할 수 있다.


## Current Document on Solution Explorer
---
### 현재 작업 중인 문서를 솔루션 탐색기에서 찾기
{:.no_toc}

* `Ctrl` + `[` , `S`


## 캐럿 이동
---
### 키보드에서 최대한 손을 떼지 말아보자
{:.no_toc}

**`|` 는 캐럿 위치*
* Symbol 단위의 캐럿 이동

    * 우측이동: `Ctrl` + `→`
    * 좌측이동: `Ctrl` + `←`

    ```csharp
    // 기본 상태
    private |void ThisWillHelpfull

    // [Ctrl] + [→] 입력 시
    private void |ThisWillHelpfull
    ```
    
* SubWord 단위의 캐럿 이동

    * 우측이동: `Ctrl` + `Alt` + `→`<br/>
    * 좌측이동: `Ctrl` + `Alt` + `←`
    
    ```csharp
    // 기본 상태
    private void |ThisWillHelpfull

    // [Ctrl] + [Alt] + [→] 입력 시
    private void This|WillHelpfull

    // [Ctrl] + [Alt] + [→] 추가 입력 시
    private void ThisWill|Helpfull
    ```