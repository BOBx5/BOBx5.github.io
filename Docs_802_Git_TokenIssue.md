---
title: GitLab SSH토큰 발급/등록
description: <span>&#x23;Git &#x23;GitLab</span>
layout: libdoc/page

#LibDoc specific below
category: Git
order: 802
---
<div align="left">
    <img src="https://img.shields.io/badge/Git-F05032?style=flat&logo=git&logoColor=white"/>
    <img src="https://img.shields.io/badge/GitLab-FC6D26?style=flat&logo=gitlab&logoColor=white"/>
</div>
{:.toc}
---

1. Powershell에서 아래 명령어를 입력한다.
    ```shell
    ssh-keygen -t rsa -b 4096 -C "유저명"
    ```
    ![](/assets/docs/800_Git/802/1.webp)


2. GitLab에 키 등록하기2. 
    ![](/assets/docs/800_Git/802/2.webp)
    1. Gitlab 로그인
    2. 우상단 프로필 이미지 클릭
    3. `Edit Profile` > `SSH Keys`
    4. 1.의 파워쉘 화면의 빨간줄 그어진 경로의 *id_rsa.pub* 파일을 열고 내용물을 복사한다.
    5. Gitlab의 Key 입력부분에 붙여넣고 `AddKey` 버튼을 눌러서 등록하면 완료된다.
