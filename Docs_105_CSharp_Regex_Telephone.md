---
title: "[Regex] Telephone"
description: <span>&#x23;CSharp &#x23;Regex</span>
layout: libdoc/page

#LibDoc specific below
category: CSharp
order: 105
---
* 
{:toc}

## 휴대폰 번호 추출
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

### 기능
---
* 문자열에서 휴대폰 번호를 추출하여 반환한다.
* Type: `string`
* Default: `string.Empty`

### 검출 가능 유형
--- 
`01X`= `010` `011` `016` `017` `018` `019`

1. #### **Pattern 1**
---
```regex
01{1}[016789]{1}-[0-9]{3,4}-[0-9]{4}
```
* ##### `01X-DDD-DDDD`
*010-123-4567*
* ##### `01X-DDDD-DDDD`
*010-1234-5678*

2. #### **Pattern 2**
---
```regex
01{1}[016789]{1}[0-9]{7,8}
```
* ##### `01XDDDDDDDD`
*0101234567*
* ##### `01XDDDDDDD`
*01012345678*
  
## 전화번호 추출
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

### 기능
---
* 문자열에서 전화번호를 추출하여 반환한다.
* Type: `string`
* Default: `string.Empty`

### 검출 가능 유형 
---
`-` 포함된 번호 대응<br/>
`D`= Digit [0-9]

1. #### **Pattern 1**
---
```regex
(0{1}\d{2,3}-\d{3,4}-\d{4})
```
* ##### `0D-DDD-DDDD`
*02-123-4567*
* ##### `0DD-DDD-DDDD`
*031-123-4567*
* ##### `0DD-DDDD-DDDD`
*031-1234-45678*

2. #### **Pattern 2**
---
`-` 없는 번호 대응
```regex
(0{1}\d{2,3}\d{3,4}\d{4})
```
* ##### `0DDDDDDDD`
*021234567*
* ##### `0DDDDDDDDD`
*0311234567*
* ##### `0DDDDDDDDDD`
*03112345678*

3. #### **Pattern 3**
---
배민이 안심번호 가운데 자리 5글자 패턴 대응
```regex
(0{1}\d{2}-\d{3,5}-\d{4})
```
* ##### `0DD-DDD-DDDD`
*031-123-4567*
* ##### `0DD-DDDD-DDDD`
*031-1234-5678*
* ##### `0DD-DDDDD-DDDD`
*050-51234-5678*

4. #### **Pattern 4**
---
서울 지역번호 대응
```regex
(02-\d{3,4}-\d{4})|(02\d{3,4}\d{4})
```
* ##### `02-DDD-DDDD`
*02-123-4567*
* ##### `02-DDDD-DDDD`
*02-12342-5678*
* ##### `02DDDDDDD`
*021234567*
* ##### `02DDDDDDDD`
*0212345678*
