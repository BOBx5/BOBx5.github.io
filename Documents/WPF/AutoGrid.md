---
title: AutoGrid
description: <span>&#x23;WPF &#x23;NuGet</span>
layout: libdoc/page

#LibDoc specific below
category: WPF
order: 306
---
* 
{:toc}

## [**wpf-autogrid**](https://github.com/carbonrobot/wpf-autogrid)
### 번거로운 WPF Grid의 보일러플레이트를 간소하게 해주는 NuGet
{:.no_toc}

---

#### 1. CASE
---
* **기존**
  ```xml
  <Grid>
    <Grid.RowDefinitions>
      <RowDefinition Height="35" />
      <RowDefinition Height="35" />
    </Grid.RowDefinitions>
    <Grid.ColumnDefinitions>
      <ColumnDefinition Width="100" />
      <ColumnDefinition Width="auto" />
    </Grid.ColumnDefinitions>
    
    <Label Grid.Row="0" Grid.Column="0"/>
    <TextBox Grid.Row="0" Grid.Column="1"/>
    <Label Grid.Row="1" Grid.Column="0"/>
    <TextBox Grid.Row="1" Grid.Column="1"/>
  </Grid>
  ```
* **AutoGrid**
  ```xml
  <AutoGrid RowCount="2" RowHeight="35" Columns="100,auto">
    <Label />     <!-- Row=0, Col=0 -->
    <TextBox />   <!-- Row=0, Col=1 -->
    <Label />     <!-- Row=1, Col=0 -->
    <TextBox />   <!-- Row=1, Col=1 -->
  </AutoGrid>
  ```

#### 2. CASE
---
10의 마진을 가진 6x6 그리드
* **기존**
  ```xml
  <Grid Margin="10">
    <Grid.RowDefinitions>
      <RowDefinition Height="*"/>
      <RowDefinition Height="*"/>
      <RowDefinition Height="*"/>
      <RowDefinition Height="*"/>
      <RowDefinition Height="*"/>
      <RowDefinition Height="*"/>
    </Grid.RowDefinitions>
    <Grid.ColumnDefinitions>
      <ColumnDefinition Width="*"/>
    </Grid.ColumnDefinitions>
  </Grid>
  ```

* **AutoGrid**
  ```xml
  <AutoGrid ColumnCount="6" ColumnWidth="*" RowHeight="*" RowCount="6" ChildMargin="10" />
  ```

#### 3. CASE
---
2:5 비율의 6x2 그리드
* **기존**
  ```xml
  <Grid>
    <Grid.RowDefinitions>
      <RowDefinition Height="25"/>
      <RowDefinition Height="25"/>
      <RowDefinition Height="25"/>
      <RowDefinition Height="25"/>
      <RowDefinition Height="25"/>
      <RowDefinition Height="25"/>
    </Grid.RowDefinitions>
    <Grid.ColumnDefinitions>
      <ColumnDefinition Width="2*"/>
      <ColumnDefinition Width="5*"/>
    </Grid.ColumnDefinitions>
  </Grid>
  ```

* **AutoGrid**
  ```xml
  <AutoGrid Columns="2*,5*" RowCount="6" RowHeight="25" />
  ```

#### 4. CASE
---
Row: `35`, `35`<br/>
Column: `100`, `auto`<br/>
이고 *Row 1*, *Column 0*의 `Label`은 `Collapsed` 상태의 그리드

* **기존**
  ```xml
  <Grid>
    <Grid.RowDefinitions>
      <RowDefinition Height="35" />
      <RowDefinition Height="35" />
    </Grid.RowDefinitions>
    <Grid.ColumnDefinitions>
      <ColumnDefinition Width="100" />
      <ColumnDefinition Width="auto" />
    </Grid.ColumnDefinitions>
    
    <Label   Grid.Row="0" Grid.Column="0"/>
    <TextBox Grid.Row="0" Grid.Column="1"/>
    <Label   Grid.Row="1" Grid.Column="0" Visibility="Collapsed"/>
    <TextBox Grid.Row="1" Grid.Column="1"/>
  </Grid>
  ```

* **AutoGrid**
  ```xml
  <AutoGrid RowCount="2" RowHeight="35" Columns="100,auto">
    <Label />                             <!-- Row=0, Col=0 -->
    <TextBox />                           <!-- Row=0, Col=1 -->
    <Label Visibility="Collapsed" />
    <TextBox />                           <!-- Row=1, Col=0 -->
  </AutoGrid>
  ```