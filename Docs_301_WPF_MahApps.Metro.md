---
title: MahApps.Metro
description: <span>&#x23;WPF &#x23;NuGet</span>
layout: libdoc/page

#LibDoc specific below
category: WPF
order: 301
---
* 
{:toc}
<div align="left">
    <img src="https://img.shields.io/badge/WPF-512BD4?style=flat&logo=dotnet&logoColor=white"/>
    <img src="https://img.shields.io/badge/NuGet-004880?style=flat&logo=nuget&logoColor=white"/>
</div>
---

## [MahApps.Metro](https://github.com/MahApps/MahApps.Metro)
---
![MahApps.Metro_1](/assets/docs/300_WPF/301/1.webp)
![MahApps.Metro_2](/assets/docs/300_WPF/301/2.webp)
![MahApps.Metro_3](/assets/docs/300_WPF/301/3.webp)
![MahApps.Metro_4](/assets/docs/300_WPF/301/4.webp)
![MahApps.Metro_5](/assets/docs/300_WPF/301/5.webp)
![MahApps.Metro_6](/assets/docs/300_WPF/301/6.webp)
![MahApps.Metro_7](/assets/docs/300_WPF/301/7.webp)

* Microsoft 에서 개발한 Metro Design 스타일의 테마
* 군더더기 없는 깔끔한 스타일이 특징

## 사용방법
---
* NuGet 패키지 매니저를 이용하여 설치
    ```powershell
    Install-Package MahApps.Metro
    ```
* App.xaml 파일에 아래와 같이 추가
    ```xml
    <Application x:Class="SampleApp"
                xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
                xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
                StartupUri="MainWindow.xaml">
    <Application.Resources>
        <ResourceDictionary>
        <ResourceDictionary.MergedDictionaries>
            <!-- MahApps.Metro ResourceDictionay 추가. 대소문자에 주의! -->
            <ResourceDictionary Source="pack://application:,,,/MahApps.Metro;component/Styles/Controls.xaml" />
            <ResourceDictionary Source="pack://application:,,,/MahApps.Metro;component/Styles/Fonts.xaml" />
            <!-- Theme setting -->
            <ResourceDictionary Source="pack://application:,,,/MahApps.Metro;component/Styles/Themes/Light.Blue.xaml" />
        </ResourceDictionary.MergedDictionaries>
        </ResourceDictionary>
    </Application.Resources>
    </Application>
    ```
* 적용하고자 하는 View에 적용
    > xmlns:mah="clr-namespace:MahApps.Metro.Controls;assembly=MahApps.Metro"

    ```xml
    <mah:MetroWindow 
        x:Class="SampleApp.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
        xmlns:mah="clr-namespace:MahApps.Metro.Controls;assembly=MahApps.Metro"
        xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
        Title="MainWindow"
        Width="800"
        Height="450"
        WindowStartupLocation="CenterScreen"
        mc:Ignorable="d">
    <Grid>
        <!--  Your content  -->
    </Grid>
    </mah:MetroWindow>
    ```
    ```csharp
    using MahApps.Metro.Controls;
    namespace SampleApp
    {
        public partial class MainWindow : MetroWindow
        {
            public MainWindow()
            {
                InitializeComponent();
            }
        }
    }
    ```