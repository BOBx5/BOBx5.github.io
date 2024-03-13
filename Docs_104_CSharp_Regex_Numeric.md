---
title: "[Regex] Numeric"
description: <span>&#x23;CSharp &#x23;Regex</span>
layout: libdoc/page

#LibDoc specific below
category: CSharp
order: 104
---
* 
{:toc}

<div align="left">
    <img src="https://img.shields.io/badge/C%23-512BD4?style=flat&logo=csharp&logoColor=white"/>
</div>
---

### 숫자값 추출
---
```csharp
public static int? Digit(string input)
{
    input = input.Trim();
    Regex regex = new Regex(@"[\d,]+"); // ',' 포함
    var match = regex.Match(input);
    if (match.Success)
    {
    return Int32.Parse(match.Value.Replace(",",""));
    }
    return null;
}
```
* 문자열에서 숫자값을 추출하여 반환한다.
* Type: `int`
* Default: `null`
* 검출 가능 유형
    * `123456`
    * `123,456`