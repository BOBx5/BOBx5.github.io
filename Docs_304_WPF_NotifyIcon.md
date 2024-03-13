---
title: NotifyIcon
description: <span>&#x23;WPF &#x23;NuGet</span>
layout: libdoc/page

#LibDoc specific below
category: WPF
order: 304
---
* 
{:toc}
<div align="left">
    <img src="https://img.shields.io/badge/WPF-512BD4?style=flat&logo=dotnet&logoColor=white"/>
    <img src="https://img.shields.io/badge/NuGet-004880?style=flat&logo=nuget&logoColor=white"/>
</div>
---

## [Hardcodet NotifyIcon for WPF](https://github.com/hardcodet/wpf-notifyicon)
### Windows TaskBar에 아이콘을 표시하는 라이브러리

* 윈도우 우측 하단 시스템 트레이 영역에 아이콘을 표시하는 라이브러리
* 지원기능
  * 마우스 클릭에 대한 사용자 지정 팝업(대화형 컨트롤)
  * *Vista* 이상 버전에 대한 사용자 정의 툴팁(*XP/2003*을 위한 대체 기능 포함)
  * `팝업`/`툴팁`/`말풍선`에 애니메이션을 트리거하기 위한 다양한 이벤트 모델
  * 커스텀 아이콘과 사용 가능한 표준 Windows 말풍선
  * WPF [ContextMenu](https://learn.microsoft.com/ko-kr/dotnet/desktop/wpf/controls/contextmenu-overview?view=netframeworkdesktop-4.8&viewFallbackFrom=netdesktop-8.0) 지원
  * 팝업 노출 위치 선택
  * 더블 클릭 등에 표시되는지 여부를 정의
  * `팝업`/`툴팁`/`말풍선`에 대한 손쉬운 데이터 바인딩
  * 트레이 아이콘의 클릭/더블클릭에 대한 `Command` 지원

  
## 적용방법
---
1. NuGet 패키지 설치
    ```powershell
    Install-Package Hardcodet.NotifyIcon.Wpf
    ```
2. XAML에 네임스페이스 추가
    ```xml
    xmlns:tb="http://www.hardcodet.net/taskbar"
    ```
    ```xml
    <Window
      x:Class="Hardcodet.NetDrives.UI.SystemTray.Sample"
      xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
      xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
      xmlns:tb="http://www.hardcodet.net/taskbar">
      <tb:TaskbarIcon 
        x:Name="myNotifyIcon"
        Visibility="Visible"
        ToolTipText="Fallback ToolTip for Windows xp"
        IconSource="/Images/TrayIcons/Logo.ico"
        ContextMenu="{StaticResource TrayMenu}"
        MenuActivation="LeftOrRightClick"
        TrayPopup="{StaticResoure TrayStatusPopup}"
        PopupActivation="DoubleClick"
        TrayToolTip="{StaticResource TrayToolTip}"
        />
    </Window>    
    ```
