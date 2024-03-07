---
title: GongSolutions.WPF.DragDrop
description: <span>&#x23;WPF &#x23;NuGet</span>
layout: libdoc/page

#LibDoc specific below
category: WPF
order: 305
---
<div align="left">
    <img src="https://img.shields.io/badge/WPF-512BD4?style=flat&logo=dotnet&logoColor=white"/>
    <img src="https://img.shields.io/badge/NuGet-004880?style=flat&logo=nuget&logoColor=white"/>
</div>
{:toc}
---

## [GongSolutions.WPF.DragDrop](https://github.com/punker76/gong-wpf-dragdrop)
### `ItemsControl` 아이템들의 *Drag&Drop*을 지원하는 라이브러리

![](/assets/docs/300_WPF/305/1.webp)
![](/assets/docs/300_WPF/305/2.webp)
![](/assets/docs/300_WPF/305/3.webp)

* `ListBox`, `ListView`, `TreeView`, `DataGrid` 등 `ItemsControl` 컨트롤을 모두 지원한다.
* 다른 컨트롤로의 *INSERT*, *REMOVE*, *COPY* 등의 기능을 지원한다.
* 작업자에게 안내 메세지 등을 띄울 수 있습니다.
* Drag&Drop을 위한 미리보기(Preview)를 제공합니다.
  
## 적용방법
---
1. NuGet 패키지 설치
    ```powershell
    Install-Package GongSolutions.Wpf.DragDrop
    ```
2. XAML에 네임스페이스 추가
    ```xml
    xmlns:dd="urn:gong-wpf-dragdrop"
    ```
    또는
    ```xml
    xmlns:dd="clr-namespace:GongSolutions.Wpf.DragDrop;assembly=GongSolutions.Wpf.DragDrop"
    ```
3. `ListBox`에 `Behavior`로 기능 추가
    ```xml
    <ListBox 
      ItemsSource="{Binding Collection}"
      dd:DragDrop.IsDragSource="True"
      dd:DragDrop.IsDropTarget="True" />  
    ```
4. DropHandler 추가하기
    ```xml
    <ListBox 
      ItemsSource="{Binding Collection}"
      dd:DragDrop.IsDragSource="True"
      dd:DragDrop.IsDropTarget="True"
      dd:DragDrop.DropHandler="{Binding}" />
    ```
    ```csharp
    public class ExampleViewModel : IDropTarget
    {
      public ObservableCollection<ExampleItemViewModel> Items;
      
      private void IDropTarget.DragOver(IDropInfo dropInfo) 
      {
        var sourceItem = dropInfo.Data as ExampleItemViewModel;
        var targetItem = dropInfo.TargetItem as ExampleItemViewModel;
        
        if (sourceItem != null && 
            targetItem != null && 
            targetItem.CanAcceptChildren) 
        {
          dropInfo.DropTargetAdorner = DropTargetAdorners.Highlight;
          dropInfo.Effects = DragDropEffects.Copy;
        }
      }
      
      private void IDropTarget.Drop(IDropInfo dropInfo) 
      {
        var sourceItem = dropInfo.Data as ExampleItemViewModel;
        var targetItem = dropInfo.TargetItem as ExampleItemViewModel;
        targetItem.Children.Add(sourceItem);
      }
    }

    class ExampleItemViewModel
    {
      public bool CanAcceptChildren { get; set; }
      public ObservableCollection<ExampleItemViewModel> Children { get; private set; }
    }
    ```
