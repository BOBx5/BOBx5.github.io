---
title: 날짜 정규식
description: <span>&#x23;CSharp &#x23;Regex</span>
layout: libdoc/page

#LibDoc specific below
category: CSharp
order: 102
---

![](https://img.shields.io/badge/C%23-512BD4?style=flat&logo=csharp&logoColor=white)

## 날짜값 추출
{:toc}
---
```csharp
public class Seperators
{
    public const string Dot = ".";
    public const string Slash = "/";
    public const string Hyphen = "-";
    public const string Korean = "ko";
}
public static DateTime? FindDate(string input, string seperator)
{
    string Seperator = "";
    switch (seperator)
    {
        case Seperators.Hyphen:
            Seperator = "-";
            break;
        case Seperators.Slash:
            Seperator = "/";
            break;
        case Seperators.Dot:
            Seperator = ".";
            break;
        case Seperators.Korean:
            input = input.Replace("년 ", "-").Replace("년", "-");
            input = input.Replace("월 ", "-").Replace("월", "-");
            input = input.Replace("일 ",  "").Replace("일",  "");
            Seperator = "-";
            break;
        default:
            Seperator = seperator;
            break;
    }

    Regex regex = new Regex(@"(\d{4}.((0\d)|(1[012]))"
                        + Seperator
                        + @"(([012]\d)|3[01]))|(\d{4}/((0\d)|(1[012]))"
                        + Seperator
                        + @"(([012]\d)|3[01]))"
                        );

    var dateMatch = regex.Match(input);
    if (dateMatch.Success)
    {
        return DateTime.Parse($"{dateMatch.Value}");
    }
    return null;
}
```
* 문자열에서 날짜값을 추출하여 반환한다.
* Type: `DateTime?`
* Default: `null`
* 검출 가능 유형
  * `yyyy.MM.dd`<br/>2021.01.01
  * `yyyy/MM/dd`<br/>2021/01/01
  * `yyyy-MM-dd`<br/>2021-01-01
  * `yyyy년MM월dd일`<br/>2021년01월01일
  * `yyyy년 MM월 dd일`<br/>2021년 01월 01일