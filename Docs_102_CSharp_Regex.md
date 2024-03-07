---
title: 유용한 정규식
description: <span>&#x23;C&#x23;</span>
layout: libdoc/page

#LibDoc specific below
category: C#
order: 102
---
<div align="left">
    <img src="https://img.shields.io/badge/C%23-512BD4?style=flat&logo=csharp&logoColor=white"/>
</div>
{:toc}
---

## 여기저기 써먹기 좋은 정규식 스니펫
---

### 날짜값 추출
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

### 시간값 추출
---
```csharp
public static TimeSpan FindTime(string input)
{
    bool isAfterNoon = input.Contains("PM");
    Regex regex = new Regex(@"([0-1]?\d|2[0-3])(?::([0-5]?\d))?(?::([0-5]?\d))");
    var timeMatch = regex.Match(input);
    if (timeMatch.Success)
    {
        int[] split = timeMatch.Value
                               .Split(':')
                               .Select(i => Convert.ToInt32(i))
                               .ToArray();
        // HH
        // "PM" 텍스트가 포함 + 12시 이전인 경우 12시간을 더함
        int hour = isAfterNoon && split[0] < 11 
            ? (12 + split[0]) 
            : split[0];

        // mm
        int minute = split[1];

        // ss
        // 초단위가 없는 경우 0
        int second = split.Count() == 3
            ? split[2]
            : 0;

        return new TimeSpan(hour, minute, second);
    }
    return TimeSpan.Zero;
}
```
* 문자열에서 시간값을 추출하여 반환한다.
* Type: `TimeSpan`
* Default: `TimeSpan.Zero`
* 검출 가능 유형
  * `mm:ss`<br/>23:59
  * `hh:mm:ss`<br/>23:59:59

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

### 휴대폰 번호 추출
---
```csharp
public static string Contact(string input)
{
    Regex regex = null;

    // 01X-DDD(D)-DDDD
    const string pattern1 = @"01{1}[016789]{1}-[0-9]{3,4}-[0-9]{4}";
    regex = new Regex(pattern1);
    var match_noHipen = regex.Match(input);
    if (match_noHipen.Success)
    {
        return match_noHipen.Value;
    }

    // 01XDDD(D)DDDD
    const string pattern2 = @"01{1}[016789]{1}[0-9]{7,8}";
    regex = new Regex(pattern2);
    var match_withHipen = regex.Match(input);
    if (match_withHipen.Success)
    {
        return match_withHipen.Value;
    }

    return string.Empty;
}
```
* 문자열에서 휴대폰 번호를 추출하여 반환한다.
* Type: `string`
* Default: `string.Empty`
* 검출 가능 유형 (`X` = [016789]) `010` `011` `016` `017` `018` `019`
  * `01X-DDD-DDDD`<br/>010-123-4567
  * `01X-DDDD-DDDD`<br/>010-1234-5678
  * `01XDDDDDDDD`<br/>0101234567
  * `01XDDDDDDD`<br/>01012345678
  
### 전화번호 추출
---
```csharp
public static string Contact(string input)
{
    // 0DD(D)-DDD(D)-DDDD
    const string pattern1 = @"(0{1}\d{2,3}-\d{3,4}-\d{4})";

    // 0DD(D)DDD(D)DDDD
    const string pattern2 = @"(0{1}\d{2,3}\d{3,4}\d{4})";

    // 0DD-DDD(DD)-DDDD // 배민이 이상한 형태로 출력되어서 추가함 050-37362-1627
    const string pattern3 = @"(0{1}\d{2}-\d{3,5}-\d{4})";
            
    // 02-DDD(D)-DDDD | 02DDD(D)DDDD  // 서울 지역번호 대응
    const string pattern4 = @"(02-\d{3,4}-\d{4})|(02\d{3,4}\d{4})";

    Regex reg = new Regex($"{pattern1}|{pattern2}|{pattern3}");
    var match = reg.Match(input);
    if (match.Success)
    {
        return match.Value;
    }
    return string.Empty;
}
```
* 문자열에서 전화번호를 추출하여 반환한다.
* Type: `string`
* Default: `string.Empty`
* 검출 가능 유형 (`D` = Digit [0-9])
  1. **Pattern 1** : `-` 포함된 번호 대응
      * `0D-DDD-DDDD`
      * `0DD-DDD-DDDD`
      * `0DD-DDDD-DDDD`
  2. **Pattern 2** : `-` 없는 번호 대응
      * `0DDDDDDDD`<br/>02123456
      * `0DDDDDDDDD`<br/>0311234567
      * `0DDDDDDDDDD`<br/>03112345678
  3. **Pattern 3** : 배민이 가운데 자리 5글자 패턴 대응
      * `0DD-DDDD-DDDD`
      * `0DD-DDDD-DDDD`
      * `0DD-DDDDD-DDDD`<br/>050-37362-1627
  4. **Pattern 4** : 서울 지역번호 대응
      * `02-DDD-DDDD`<br/>02-123-4567
      * `02-DDDD-DDDD`<br/>02-12342-5678
      * `02DDDDDDD`<br/>021234567
      * `02DDDDDDDD`<br/>0212345678
