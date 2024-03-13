---
title: Gitflow
description: <span>&#x23;Git</span>
layout: libdoc/page

#LibDoc specific below
category: Git
order: 801
---
{:.no_toc}

# 효과적인 프로젝트 관리를 위한 Gitflow 전략

![](/assets/docs/800_Git/801/1.webp)

1. **`develop`**/**`release`**/**`master`** 브랜치에 직접 작업하는 일은 없다.
2. 각 branch에서 생성할 수 있는 branch
    - **`develop`**
        - **`feature`**
        - **`release`**
    - **`master`**
        - `hotfix`
3. branch 별 특징
    1. **`develop`**<br/>
    개발이 완료된 기능들이 병합되는 브랜치

    2. **`master`**<br/>
    현재 라이브 배포된 버전

    3. **`feature`**<br/>
    신규 기능개발 또는 기능개선용. <br/>
    여러 개발자들이 각자 자기가 맡은 부분만 개발할 때 따서 작업하는 식.<br/>
    ex) "*feature/비즈니스로직_속도개선_리팩토링*"<br/>
        Merge대상 브랜치: **`develop`**

    4. **`release`**<br/>
    배포일정 등이 확정된 경우 각 개발자들이 작업하던 
    **`feature`**들을 마무리하고 Finish 처리하여 develop에 모두 반영(Merge) 한 뒤
    **`release`** 브랜치를 **`develop`**에서 따서 생성한다.<br/>
    모든 배포 준비가 완료되면 **`release`** 브랜치를 Finish 하여 <br/>
    **`develop`** & **`master`**에 Merge 시킨다.<br/>
    ex) "*relase/1.11.0*"<br/>
    Merge대상 브랜치: **`develop`** **`master`**
    
    5. `hotfix`<br/>
    배포된 버전에서 긴급하게 수정해야할 경우 생성한다.<br/>
    배포 준비가 완료되면 `hotfix` 브랜치를 Finish 하여<br/>
    **`develop`** & **`release`** & **`master`**에 Merge 시킨다.<br/>
    ex)"*hotfix/1.11.1*"<br/>
    Merge대상 브랜치: **`develop`** **`release`** **`master`**