---
title: Ealry EOF 오류
description: <span>&#x23;Git</span>
layout: libdoc/page

#LibDoc specific below
category: Git
order: 803
---
* 
{:toc}

## Git Clone 시 발생하는 Early EOF 오류
---
![](/assets/Documents/Git/EarlyEOF/1.webp)

Git Repo Clone 해서 내려받던 중

위와 같은 오류 화면이 발생했다.

오류 메세지를 기반으로 검색하여

아래와 같은 *StackOverflow* 에서 한 Thread를 발견

[***StackOverflow***: *fatal: early EOF fatal: index-pack failed*](https://stackoverflow.com/questions/21277806/fatal-early-eof-fatal-index-pack-failed)

![](/assets/Documents/Git/EarlyEOF/2.webp)

해당 Thread를 참고하여 모든 방법을 적용해봤으나 해결되지 않았다.

다만 해당 Thread에서 언급된 내용을 바탕으로

아래와 같은 해결 방법을 찾아냈다.
    
## 해결방법
---
1. local에 `Clone`할 디렉토리에서 *git bash* 실행
    
    ![](/assets/Documents/Git/EarlyEOF/3.webp)
    
2. *git* 압축설정 0으로 변경
    
    ```bash
    git config --global core.compression 0
    ```
    
3. *git* 압축설정 0으로 변경
    
    ```bash
    git clone --depth 1 *<repository-URL>*
    ```
    
    > 💡
    > 위 방법은 remote Repository의 가장 윗 부분만을
    > `fetch` 해오는 방법으로 실행 후
    > SourceTree 나 기타 git-GUI 툴로 열어보면
    > 히스토리가 전부 날아간채로 보인다.<br/>
    > 해당 상태에서 아무리 `pull`/`fetch`를 시도해도
    > `.git/config` 파일에 설정된 바라보는 depth가
    > 가장 윗단이기 때문에 아무일도 안일어난다.<br/>
    > 따라서 이후 과정을 실행할 필요가 있다.
    
4. ***<u>.git</u>*** 경로로 이동하여 `config`파일 수정

    **기존**
    ```bash
        [core]
            repositoryformatversion = 0
            filemode = false
            bare = false
            logallrefupdates = true
            symlinks = false
            ignorecase = true
        [remote "origin"]
            url = *<repository-URL>*
            fetch = +refs/heads/master:refs/remotes/origin/master
    ```
    
    **변경점**
    ```diff
    [core]
        repositoryformatversion = 0
        filemode = false
        bare = false
        logallrefupdates = true
        symlinks = false
        ignorecase = true
    +   packedGitLimit = 2048m 
    +   packedGitWindowSize = 2048m 
    [remote "origin"]
        url = *<repository-URL>*
    -   fetch = +refs/heads/master:refs/remotes/origin/master
    +   fetch = +refs/heads/:refs/remotes/origin/
    +[pack] 
    +   deltaCacheSize = 4095m 
    +   packSizeLimit = 4095m 
    +   windowMemory = 4095m
    ```
    
    **변경완료**
    ```bash
    [core]
        repositoryformatversion = 0
        filemode = false
        bare = false
        logallrefupdates = true
        symlinks = false
        ignorecase = true
        packedGitLimit = 2048m 
        packedGitWindowSize = 2048m 
    [remote "origin"]
        url = *<repository-URL>*
        fetch = +refs/heads/:refs/remotes/origin/
    [pack] 
        deltaCacheSize = 4095m 
        packSizeLimit = 4095m 
        windowMemory = 4095m
    ```
    
    * *git* 에서 내려받을 때 메모리 사용량 설정을 변경해준다.
    * `fetch` 해오는 경로를 master(repo에 따라 이름은 다를 수 있음) 가 아닌 `*` (와일드카드) 로 변경해준다.
    
5. git-bash의 WorkingDirectory 변경
    
    ```bash
    git cd *<repo-dir>*
    ```
    
6. git `fetch` 로 depth 전체를 가져온다.
    
    ```bash
    git fetch --unshallow
    # 또는
    git fetch --depth=2147483647
    ```
    
7. git pull 로 마무리
    
    ```bash
    git pull --all
    ```

    이 부분까지 정상적으로 실행 되었다면
    문제가 해결된 것이다.
    
8. 4번 과정에서 했던 과정을 원복시켜 저장해준다.
    **원복**
    ```bash
        [core]
            repositoryformatversion = 0
            filemode = false
            bare = false
            logallrefupdates = true
            symlinks = false
            ignorecase = true
        [remote "origin"]
            url = *<repository-URL>*
            fetch = +refs/heads/master:refs/remotes/origin/master
    ```
    