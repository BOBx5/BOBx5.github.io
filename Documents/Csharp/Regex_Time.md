---
title: "시간 정규식"
description: <span>&#x23;CSharp &#x23;Regex</span>
layout: libdoc/page

#LibDoc specific below
category: CSharp
order: 103
---
* 
{:toc}

## 시간값 추출하기
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

### 기능
---
* 문자열에서 시간값을 추출하여 반환한다.
* Type: `TimeSpan`
* Default: `TimeSpan.Zero`

### 검출 가능 유형
---
* #### `mm:ss`
*23:59*
* #### `hh:mm:ss`
*23:59:59*