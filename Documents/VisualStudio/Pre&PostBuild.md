---
title: 빌드별 App.config 분기처리
description: <span>&#x23;VisualStudio</span>
layout: libdoc/page

#LibDoc specific below
category: VisualStudio
order: 405
---
* 
{:toc}

## VS 빌드별 App.config 분기처리
---
### 기본 빌드 구성

* Visual Studio 는 기본적으로 프로젝트를 생성하면 `Debug`/`Release` 두가지 빌드 *Configuration*이 있다.
* *Configuration Manager* 에서 빌드 구성을 원하는 이름으로 추가/변경 이 가능하다.
* 문제는 빌드구성별로 프로젝트 구성이 다르게 포함되게 하고 싶은 경우다.

### 빌드별 프로젝트 구성 설정
---
기본적으로 프로젝트의 API의 *baseUrl*을 담고 있는 `App.config` 파일이 존재한다.<br/>
문제는 `Dev`, `Qa`, `Stage`, `Release` 4가지의 각 빌드가 바라보는<br/>
*baseUrl* 이 달라져야 하는 상황이라고 가정하자.<br/>

```csharp
#if Dev
	// Dev URL 주소
#elif Qa
	// Qa URL 주소
#elif Stage
	// Stage URL 주소
#else
	// Release URL 주소
```

위와 같이 Build Constant를 이용하여 소스코드에 분기처리를 할 수 있지만<br/>
소스코드가 지저분해지고 관리 포인트가 늘어나는 문제가 발생한다.

### **해결 방법**
---
다양한 방법들이 있는데 몇가지만 언급하자면

#### 1. 'XML-Document-Transform'을 이용한 방법
---
기본적으로 App.config 파일이 XML인 특성을 활용하는 방법이다.

1. 먼저 프로젝트 경로에 기본적으로 Release 용으로 사용될 `App.config` 파일을 만들어보자.

    기본 *baseUrl*: `https://someapi.com`
    ```xml
    <?xml version="1.0"?>
    <configuration>
      <appSettings>
        <add key="baseUrl" value="https://someapi.com"/>
      </appSettings>
    </configuration>
    ```
    
2. 그 다음 App.config 파일에 교체동작을 할 `App.Dev.config`파일을 만들어보자
    
    Dev용 *baseUrl*: `https://dev.someapi.com`
    ```xml
    <?xml version="1.0"?>
    <configuration xmlns:xdt="http://schemas.microsoft.com/XML-Document-Transform">
      <appSettings>
        <add key="baseUrl" value="https://dev.someapi.com" xdt:Transform="Replace" xdt:Locator="Match(key)" />
      </appSettings>
    </configuration>
    ```
    
3. 그 다음 프로젝트 파일(`*.csproj`)을 아래와 같이 추가한다.
    
    ```xml
    <project>
      <!--기존 프로젝트 구성요소 선언들-->
      ...

      <!--App.Dev.config를 App.config 하위로: 솔루션 탐색기에 파일이 트리 구조로 보이게 함 -->
      <ItemGroup>
        <None Include="App.config" />
        <None Include="App.Dev.config">
          <DependentUpon>App.config</DependentUpon>
        </None>
      </ItemGroup>
    
      <!--컴파일 후 App.config 파일을 교체하는 로직-->
      <UsingTask TaskName="TransformXml" AssemblyFile="$(MSBuildExtensionsPath32)\Microsoft\VisualStudio\v$(VisualStudioVersion)\Web\Microsoft.Web.Publishing.Tasks.dll" />
      <Target Name="AfterCompile" Condition="Exists('App.$(Configuration).config')">
        <!--Generate transformed app config in the intermediate directory-->
        <TransformXml Source="App.config" Destination="$(IntermediateOutputPath)$(TargetFileName).config" Transform="App.$(Configuration).config" />
        <!--Force build process to use the transformed configuration file from now on.-->
        <ItemGroup>
          <AppConfigWithTargetPath Remove="App.config" />
          <AppConfigWithTargetPath Include="$(IntermediateOutputPath)$(TargetFileName).config">
            <TargetPath>$(TargetFileName).config</TargetPath>
          </AppConfigWithTargetPath>
        </ItemGroup>
      </Target>
    </project>
    ```

#### 2. 프로젝트의 'Post-build event'를 이용하는 방법
---
프로젝트의 속성에 들어가서 보면 `Pre-build event` `Post-build event` 가 있다.<br/>
이 중 `Post-build event` 를 활용해 보자

1. 먼저 위에서 삽질했던 `App.Dev.config`에서 replace 동작을 다시 제거하자.

    ```diff
    <configuration xmlns:xdt="http://schemas.microsoft.com/XML-Document-Transform">
      <appSettings>
    -    <add key="baseUrl" value="https://dev.someapi.com" xdt:Transform="Replace" xdt:Locator="Match(key)" />
    +    <add key="baseUrl" value="https://dev.someapi.com"/>
      </appSettings>
    </configuration>
    ```

2. 그 다음 프로젝트 속성 의 Post-build event 에 아래의 코드를 입력했다.

    ```batch
    if "$(ConfigurationName)"=="Release" goto :nocopy
    del "$(TargetPath).config"
    copy "$(ProjectDir)\App.$(ConfigurationName).config" "$(TargetPath).config"
    :nocopy
    ```

   1. `$(TargetPath)`

       프로젝트의 실행 파일 경로. <br/>
       ex) ‘*SomeApplication.exe’*
   2. `if "$(ConfigurationName)"=="Release" goto :nocopy`
       
       '*ConfigurationName*'이 ‘*Release’* 이면 그대로 로직을 종료한다.

   3. `del "$(TargetPath).config"`
       
       ‘*\*.exe.config’* 파일을 삭제한다.

   4. `copy "$(ProjectDir)\App.$(ConfigurationName).config" "$(TargetPath).config"`
       
       Dev Config 파일을 빌드 경로(*bin*)에 복사해넣는다<br/>
       ‘*App.Dev.config*’ =`COPY`⇒ ‘*SomeApplication.exe.config’*

   프로젝트(*.csproj) 에서 보면 아래와 같다.

    ```xml
    <Target Name="PostBuild" AfterTargets="PostBuildEvent">
    <Exec Command="if &quot;$(ConfigurationName)&quot;==&quot;Release&quot; goto :nocopy&#xD;&#xA;del &quot;$(TargetPath).config&quot;&#xD;&#xA;copy &quot;$(ProjectDir)\App.$(ConfigurationName).config&quot; &quot;$(TargetPath).config&quot;&#xD;&#xA;:nocopy" />
    </Target>
    ```

#### 3. 'Post-build event' + Powershell 이용하는 방법
---

`Post-build event` 는 batch 명령어만 수행이 가능하도록 되어있어 제약이 많다.<br/>
좀 더 다양하고 복잡한 기능이 필요한 경우에는 Powershell script를 이용하는 것이 좋다.

1. 프로젝트 루트 경로에 `PostBuild.ps1` 파일을 생성한다.
    ```powershell
    #프로젝트 속성의 Post-build event 부분에서 파라미터를 전달받는다.
    param (
    	[string]$ConfigurationName,
    	[string]$TargetPath,
    	[string]$ProjectDir
    )
    
    # 프로젝트 output 경로의 'App.config' 파일을 Dev/Qa/Stage/Release 모드에 맞는 파일로 치환한다. (Release인 경우에는 그대로 유지.)

    # 콘솔로 진행상황을 확인하기 위한 스크립트
    Write-Host "┌────────────────Post-build Script────────────────┐"
    Write-Host "├Current script path: $PSCommandPath"
    Write-Host "├Parameters"
    Write-Host "├ * ConfigurationName: $ConfigurationName"
    Write-Host "├ * TargetPath       : $TargetPath"
    Write-Host "├ * ProjectDir       : $ProjectDir"
    Write-Host "├─────────────────────────────────────────"
    Write-Host "├Console"
    
    $isRelease			= $ConfigurationName -eq "Release";
    $isExist_TargetPath = Test-Path -Path "$TargetPath.config";
    $isExist_SourcePath = Test-Path -Path "$ProjectDir\App.$ConfigurationName.config";
    
    # Release 모드 확인. 맞는 경우 치환과정 생략.
    if ($isRelease) 
    {
    	Write-Host "├ 'Release' mode skips copying of config file."
    }
    # 삭제하려는 타겟 config 파일인 TargetFile이 존재하지 않는 경우
    elseif (!$isExist_TargetPath) 
    {
    	Write-Host "├ TargetFile '$TargetPath.config' file does not exist."
    }
    # 치환할 SourceFile이 존재하지 않는 경우
    elseif (!$isExist_SourcePath) 
    {
    	Write-Host "├ SourceFile '$ProjectDir\App.$ConfigurationName.config' file does not exist."
    }
    # 모든 조건이 부합하는 경우 기존 App.config 파일을 삭제하고 App.Dev.config 파일로 치환한다.
    else 
    {
    	Write-Host "├ Removing '$TargetPath.config' file."
    	Remove-Item -Path "$TargetPath.config"
    	Write-Host "├ Copying config file."
    	Write-Host "├  * FROM: '$ProjectDir\App.$ConfigurationName.config'"
    	Write-Host "├  * TO  : '$TargetPath.config'"
    	Copy-Item -Path "$ProjectDir\App.$ConfigurationName.config" -Destination "$TargetPath.config"
    }
    Write-Host "├ "
    Write-Host "└────────────────Post-build Script────────────────┘"
    ```

2. `PostBuild.ps1` 스크립트를 파라미터와 실행하게 한다.
    
    ```batch
    echo "C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe" 
    -file "$(ProjectDir)PostBuildEvent.ps1" 
    -ConfigurationName $(ConfigurationName) 
    -TargetPath $(TargetPath) 
    -ProjectDir $(ProjectDir)
    ```
    
3. 결과물

    그 다음 빌드를 하게 되면 `VisualStuidio` > `Ouput` > `Build` 에서 
    `PostBuildEvent.ps1` 스크립트 실행 결과가 출력된다.

    * Qa 일 때
        
        ![](/assets/Documents/VisualStudio/Pre&PostBuild/1.webp)
        
    * Release 일 때
        
        ![](/assets/Documents/VisualStudio/Pre&PostBuild/2.webp)
    



> `Pre-Build event` 에도 동일한 방식으로 활용할 수 있다.