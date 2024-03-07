---
title: MaterialDesignInXamlToolkit
description: <span>&#x23;WPF &#x23;NuGet</span>
layout: libdoc/page

#LibDoc specific below
category: WPF
order: 301
---
<div align="left">
    <img src="https://img.shields.io/badge/WPF-512BD4?style=flat&logo=dotnet&logoColor=white"/>
    <img src="https://img.shields.io/badge/NuGet-004880?style=flat&logo=nuget&logoColor=white"/>
</div>
{:toc}
---

## [MaterialDesignInXamlToolkit](https://github.com/MaterialDesignInXAML/MaterialDesignInXamlToolkit)
---
![Material_1](/assets/docs/300_WPF/302/1.webp)
![Material_2](/assets/docs/300_WPF/302/2.webp)
![Material_3](/assets/docs/300_WPF/302/3.webp)
![Material_4](/assets/docs/300_WPF/302/4.webp)
![Material_5](/assets/docs/300_WPF/302/5.webp)
![Material_6](/assets/docs/300_WPF/302/6.webp)
![Material_7](/assets/docs/300_WPF/302/7.webp)
![Material_8](/assets/docs/300_WPF/302/8.webp)
![Material_9](/assets/docs/300_WPF/302/9.webp)
![Material_10](/assets/docs/300_WPF/302/10.webp)
![Material_11](/assets/docs/300_WPF/302/11.webp)
![Material_12](/assets/docs/300_WPF/302/12.webp)

* Google 에서 개발한 Material Design 스타일의 테마
* 미니멀하고 세련된 디자인이 특징
* GitHub에 런타임에서 실행해 보고 코드도 확인이 가능한 데모가 있어
비교하면서 사용법을 익히기에 좋다.
* 자체적으로 Icon Pack을 내장하고 있다.
* *MahApps.Metro* 와 혼용도 가능하다. 

## 사용방법 [🔗](https://github.com/MaterialDesignInXAML/MaterialDesignInXamlToolkit/wiki/Getting-Started)
---
* NuGet 패키지 설치
    ```powershell
    Install-Package MaterialDesignInXAML
    ```
* App.xaml 파일에 아래와 같이 추가
    ```xml
    <Application 
      x:Class="Example.App"
      xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
      xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
      xmlns:materialDesign="http://materialdesigninxaml.net/winfx/xaml/themes"
      StartupUri="MainWindow.xaml">
      <Application.Resources>
        <ResourceDictionary>
          <ResourceDictionary.MergedDictionaries>
            <materialDesign:BundledTheme 
              BaseTheme="Light" 
              PrimaryColor="DeepPurple" 
              SecondaryColor="Lime" />
            <ResourceDictionary Source="pack://application:,,,/ MaterialDesignThemes.Wpf;component/Themes/MaterialDesignTheme.     Defaults.xaml" /> 
          </ResourceDictionary.MergedDictionaries>
        </ResourceDictionary>
      </Application.Resources>
    </Application>
    ```
    > 테마 컬러를 변경하고 싶다면 `COLOR_NAME`을 변경하면 된다.<br/>
    > [색상 참고용 구글 Swatch](https://www.google.com/design/spec/style/color.html#color-color-palette)
    > ```xml
    > <ResourceDictionary Source="pack://application:,,,/MaterialDesignColors;component/Themes/Recommended/Primary/MaterialDesignColor.COLOR_NAME.xaml" /> <ResourceDictionary Source="pack://application:,,,/MaterialDesignColors;component/Themes/Recommended/Accent/MaterialDesignColor.COLOR_NAME.xaml" />
    > ```


* 적용하고자 하는 View에 적용
    ```xml
    <Window 
      xmlns:materialDesign="http://materialdesigninxaml.net/winfx/xaml/themes"
      TextElement.Foreground="{DynamicResource MaterialDesignBody}"
      Background="{DynamicResource MaterialDesignPaper}"
      TextElement.FontWeight="Medium"
      TextElement.FontSize="14"
      FontFamily="{materialDesign:MaterialDesignFont}"
      [...] >
    <Grid>
        <!--  Your content  -->
    </Grid>
    </mah:MetroWindow>
    ```
    
### MahApps.Metro와 함께 사용하기 [🔗](https://github.com/MaterialDesignInXAML/MaterialDesignInXamlToolkit/wiki/MahApps.Metro-integration)
---
* NuGet Package 설치
    ```powershell
    Install-Package MaterialDesignThemes.MahApps
    ```
* App.xaml<br/>
\>`ResourceDictionary`<br/>
\>`ResourceDictionary.MergedDictionaries`<br/>
에 아래 추가
    ```xml
    <ResourceDictionary Source="pack://application:,,,/MahApps.Metro;component/Styles/Controls.xaml" />
    <ResourceDictionary Source="pack://application:,,,/MahApps.Metro;component/Styles/Fonts.xaml" />
    <ResourceDictionary Source="pack://application:,,,/MahApps.Metro;component/Styles/Themes/Light.Blue.xaml" />
    ```
* View에 적용
    ```xml
    <metro:MetroWindow
        xmlns:metro="http://metro.mahapps.com/winfx/xaml/controls"
        GlowBrush="{DynamicResource AccentColorBrush}"
        BorderThickness="1"
        [...]>
    ```
* 기존 *MaterialDesign*의 테마 색상들을 다음과 같이 교체해야합니다.
    * `HighlightColor`        ▶ `Primary700`
    * `AccentBaseColor`       ▶ `Primary600`
    * `AccentColor`           ▶ `Primary500`
    * `AccentColor2`          ▶ `Primary400`
    * `AccentColor3`          ▶ `Primary300`
    * `AccentColor4`          ▶ `Primary200`
    * `IdealForegroundColor`  ▶ `Primary500Foreground`
    * 적용 코드
        ```xml
        <SolidColorBrush x:Key="HighlightBrush" Color="{DynamicResource Primary700}"/>
        <SolidColorBrush x:Key="AccentBaseColorBrush" Color="{DynamicResource Primary600}" />
        <SolidColorBrush x:Key="AccentColorBrush" Color="{DynamicResource Primary500}"/>
        <SolidColorBrush x:Key="AccentColorBrush2" Color="{DynamicResource Primary400}"/>
        <SolidColorBrush x:Key="AccentColorBrush3" Color="{DynamicResource Primary300}"/>
        <SolidColorBrush x:Key="AccentColorBrush4" Color="{DynamicResource Primary200}"/>
        <SolidColorBrush x:Key="WindowTitleColorBrush" Color="{DynamicResource Primary700}"/>
        <SolidColorBrush x:Key="AccentSelectedColorBrush" Color="{DynamicResource Primary500Foreground}"/>
        <LinearGradientBrush x:Key="ProgressBrush" EndPoint="0.001,0.5" StartPoint="1.002,0.5">
          <GradientStop Color="{DynamicResource Primary700}" Offset="0"/>
          <GradientStop Color="{DynamicResource Primary300}" Offset="1"/>
        </LinearGradientBrush>
        <SolidColorBrush x:Key="CheckmarkFill" Color="{DynamicResource Primary500}"/>
        <SolidColorBrush x:Key="RightArrowFill" Color="{DynamicResource Primary500}"/>
        <SolidColorBrush x:Key="IdealForegroundColorBrush" Color="{DynamicResource Primary500Foreground}"/>
        <SolidColorBrush x:Key="IdealForegroundDisabledBrush" Color="{DynamicResource Primary500}" Opacity="0.4"/>
        <SolidColorBrush x:Key="MahApps.Metro.Brushes.ToggleSwitchButton.OnSwitchBrush.Win10" Color="{DynamicResource Primary500}" />
        <SolidColorBrush x:Key="MahApps.Metro.Brushes.ToggleSwitchButton.OnSwitchMouseOverBrush.Win10" Color="{DynamicResource Primary400}" />
        <SolidColorBrush x:Key="MahApps.Metro.Brushes.ToggleSwitchButton.ThumbIndicatorCheckedBrush.Win10" Color="{DynamicResource Primary500Foreground}" />
        ```
* 폰트 적용 (Material-Roboto => MahApp-Segoe UI)
    ```xml
    <ResourceDictionary Source="pack://application:,,,/MaterialDesignThemes.MahApps;component/Themes/MaterialDesignTheme.MahApps.Fonts.xaml" />
    ```
* 대화상자(Dialog) 적용
  * `DialogControl`을 *override* 하는 `ResourceDictionary`를 생성합니다.
    ```csharp
    var dictionary = new ResourceDictionary();
    dictionary.Source = new Uri("pack://application:,,,/MaterialDesignThemes.MahApps;component/Themes/MaterialDesignTheme.MahApps.Dialogs.xaml");
    ```
  * MetroDialogSettings 의 다음 속성들을 변경합니다.
    ```csharp
    settings.SuppressDefaultResources = true;
    settings.CustomResourceDictionary = dictionary;
    ```
* FlyOut UI 적용
    ```xml
    <ResourceDictionary Source="pack://application:,,,/MaterialDesignThemes.MahApps;component/Themes/MaterialDesignTheme.MahApps.Flyout.xaml" />
    ```

#### 최종 결과

```xml
<Application x:Class="MaterialMahApps.App"
  xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
  xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
  StartupUri="MainWindow.xaml">
  <Application.Resources>
    <ResourceDictionary>
      <ResourceDictionary.MergedDictionaries>
        <!-- MahApps -->
        <ResourceDictionary Source="pack://application:,,,/MahApps.Metro;component/Styles/Controls.xaml" />
        <ResourceDictionary Source="pack://application:,,,/MahApps.Metro;component/Styles/Fonts.xaml" />
        <ResourceDictionary Source="pack://application:,,,/MahApps.Metro;component/Styles/Themes/Light.Blue.xaml" />
        <!-- Material Design -->
        <ResourceDictionary Source="pack://application:,,,/MaterialDesignThemes.Wpf;component/Themes/MaterialDesignTheme.Light.xaml" />
        <ResourceDictionary Source="pack://application:,,,/MaterialDesignThemes.Wpf;component/Themes/MaterialDesignTheme.Defaults.xaml" />
        <ResourceDictionary Source="pack://application:,,,/MaterialDesignColors;component/Themes/Recommended/Primary/MaterialDesignColor.DeepPurple.xaml" />
        <ResourceDictionary Source="pack://application:,,,/MaterialDesignColors;component/Themes/Recommended/Accent/MaterialDesignColor.Lime.xaml" />
        <!-- Material Design: MahApps Compatibility -->
        <ResourceDictionary Source="pack://application:,,,/MaterialDesignThemes.MahApps;component/Themes/MaterialDesignTheme.MahApps.Fonts.xaml" />
        <ResourceDictionary Source="pack://application:,,,/MaterialDesignThemes.MahApps;component/Themes/MaterialDesignTheme.MahApps.Flyout.xaml" />
      </ResourceDictionary.MergedDictionaries>
      <!-- MahApps Brushes -->
      <SolidColorBrush x:Key="HighlightBrush" Color="{DynamicResource Primary700}"/>
      <SolidColorBrush x:Key="AccentBaseColorBrush" Color="{DynamicResource Primary600}" />
      <SolidColorBrush x:Key="AccentColorBrush" Color="{DynamicResource Primary500}"/>
      <SolidColorBrush x:Key="AccentColorBrush2" Color="{DynamicResource Primary400}"/>
      <SolidColorBrush x:Key="AccentColorBrush3" Color="{DynamicResource Primary300}"/>
      <SolidColorBrush x:Key="AccentColorBrush4" Color="{DynamicResource Primary200}"/>
      <SolidColorBrush x:Key="WindowTitleColorBrush" Color="{DynamicResource Primary700}"/>
      <SolidColorBrush x:Key="AccentSelectedColorBrush" Color="{DynamicResource Primary500Foreground}"/>
      <LinearGradientBrush x:Key="ProgressBrush" EndPoint="0.001,0.5" StartPoint="1.002,0.5">
        <GradientStop Color="{DynamicResource Primary700}" Offset="0"/>
        <GradientStop Color="{DynamicResource Primary300}" Offset="1"/>
      </LinearGradientBrush>
      <SolidColorBrush x:Key="CheckmarkFill" Color="{DynamicResource Primary500}"/>
      <SolidColorBrush x:Key="RightArrowFill" Color="{DynamicResource Primary500}"/>
      <SolidColorBrush x:Key="IdealForegroundColorBrush" Color="{DynamicResource Primary500Foreground}"/>
      <SolidColorBrush x:Key="IdealForegroundDisabledBrush" Color="{DynamicResource Primary500}" Opacity="0.4"/>
      <SolidColorBrush x:Key="MahApps.Metro.Brushes.ToggleSwitchButton.OnSwitchBrush.Win10" Color="{DynamicResource Primary500}" />
      <SolidColorBrush x:Key="MahApps.Metro.Brushes.ToggleSwitchButton.OnSwitchMouseOverBrush.Win10" Color="{DynamicResource Primary400}" />
      <SolidColorBrush x:Key="MahApps.Metro.Brushes.ToggleSwitchButton.ThumbIndicatorCheckedBrush.Win10" Color="{DynamicResource Primary500Foreground}" />
    </ResourceDictionary>
  </Application.Resources>
</Application>
```