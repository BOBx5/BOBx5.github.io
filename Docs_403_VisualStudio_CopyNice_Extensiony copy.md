---
title: "[Extension] Copy Nice"
description: <span>&#x23;VisualStudio &#x23;Extension</span>
layout: libdoc/page

#LibDoc specific below
category: VisualStudio
order: 403
---
* 
{:toc}

## 복붙 시 거슬리는 Indent 제거하기

### 기존 복사(`Ctrl`+`C`) & 붙여넣기(`Ctrl`+`V`)의 문제점
{:.no_toc}
---
![](/assets/docs/400_VisualStudio/403/1.webp)

문서 작성 등을 위해서 코드를 복사하여 다른 웹이나 문서에 붙여넣기를 하면,<br/>
**Indent가 유지**되는데 이로 인해 매번 다시 수정해줘야하는 번거로움이 있다.

### [CopyNice Extension](https://marketplace.visualstudio.com/items?itemName=MadsKristensen.CopyNice)
---
[아티클](https://devblogs.microsoft.com/visualstudio/copy-with-proper-indentation/)

*VisualStudio* Extension 중 하나인 **Copy Nice**를 설치하면,<br/>
복사한 코드를 붙여넣기 할 때 **Indent를 제거**하여 붙여넣기를 할 수 있다.

![설정](/assets/docs/400_VisualStudio/403/2.webp)

`Edit` > `Advanced` > `Strip Leading Whitespace on Copy` 활성화

![결과물](/assets/docs/400_VisualStudio/403/3.webp)