---
title: GitLab SSH토큰 발급/등록
description: <span>&#x23;Git &#x23;GitLab</span>
layout: libdoc/page

#LibDoc specific below
category: Git
order: 802
---
{:.no_toc}

1. Powershell에서 아래 명령어를 입력한다.
    ```shell
    ssh-keygen -t rsa -b 4096 -C "유저명"
    ```
    ![](/assets/Documents/Git/GitlabSshToken/1.webp)

    > 빨간 줄 경로의 파일 확인


2. GitLab에 키 등록하기2. 
    ![](/assets/Documents/Git/GitlabSshToken/2.webp)
    1. Gitlab 로그인
    2. 우상단 프로필 이미지 클릭
    3. **`Edit Profile`** > **`SSH Keys`**
    4. 생성된 `id_rsa.pub` 파일의 내용물을 복사한다.
    5. Gitlab의 Key 입력부분에 붙여넣고 **`AddKey`** 버튼을 눌러서 등록하면 완료된다.
