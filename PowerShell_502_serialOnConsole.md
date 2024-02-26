---
title: 파워쉘로 시리얼 포트 제어하기
description: 파워쉘 스크립트만으로 시리얼 포트를 수신해보자
layout: libdoc/page

#LibDoc specific below
category: PowerShell
order: 502
---
* 
{:toc}

## 계기

---

`com0com`을 이용한 가상 시리얼 포트를 생성하고, 해당포트로 영수증 데이터 수신을 테스트 해야하는 경우가 발생했다. 

별도의 C# 콘솔 프로젝트 생성하고 `SerialPort` 클래스에 물려서 콘솔로 출력하게 할까도 생각했지만, 매번 하기 너무 번거로웠다. 좀더 간단하게 할 방법이 필요했다.

## 해결방법1 (Putty)

---

[Putty](https://www.putty.org/)를 설치하게 되면 설치 폴더(기본: *C:\Program Files\PuTTY*)에 `plink.exe` 가 설치되게 되는데
별도의 GUI가 없는 커맨드 기반의 콘솔 프로그램이다.
해당 폴더를 실행폴더로 잡아 파워쉘을 실행 후 아래의 코드를 실행하면
시리얼포트에 연결되고, 해당 포트로 수신하는 데이터가 콘솔에 출력된다.
필요에 따라 닷넷 프로젝트에 Process로 띄워서 작업할 수 도 있으리라고 본다.

```powershell
# putty의 plink.exe 를 이용하여 COM21 포트 수신
# -serial: 시리얼통신
# "\\.\COM21": COM10 위로는 '\\.\'를 prefix로 작성해줘야 연결이 정상적으로 됨
# -sercfg: 시리얼 설정값
#   BaudRate: 통신속도 설정
#   DataBits: 데이터비트 설정
#   Parity: 패리티 설정 n(None), e(Even), m(Mark), s(Space)
#   FlowControl: 플로우컨트롤 설정 N(None), X(XON/XOF), R(RTS/CTS), D(DSR/DTR)
**plink.exe -serial "\\.\COM21" -sercfg 9600,8,n,1,D**
```

## 해결방법2 (PowerShell)

---

```powershell
#현재 연결 가능한 포트명 목록을 불러옵니다
[System.IO.Ports.SerialPort]::GetPortNames()

# 시리얼포트 생성자를 이용하여 인스턴스를 생성합니다. (아래는 파라미터 순서)
# portName,
# baudRate,
# parity,
# dataBits,
# stopBits
$port = new-Object System.IO.Ports.SerialPort COM21,9600,None,8,one

# 한국어 인코딩 인스턴스를 생성하여 포트에 할당합니다.
$kscEncoding = [System.Text.Encoding]::GetEncoding(949)
$port.Encoding = $kscEncoding

# 데이터 수신 시 발생 이벤트 등록 (데이터 수신 시 콘솔에 찍어준다)
$eventJob = 
  Register-ObjectEvent -InputObject $port -EventName "DataReceived" -Action {
    $Sender.ReadExisting() | Out-Host
  }

# 포트를 개방합니다  
# * 이미 사용 중인 경우 UnauthorizedAccessException 
# * "'COMXX' 포트에 대한 액세스가 거부되었습니다." 에러 발생
$port.open()

$port.ReadExisiting()

# 포트에 string 데이터를 작성합니다. => 수신포트에서 확인 가능
#$port.WriteLine("some string") #Sends string.

# 포트 연결을 종료합니다.
$port.Close()
```

1. `SerialPort` 핸들링하는 클래스에서 최초에 이니셜라이징 되기 전에
기존 `SerialPort`에 버퍼에 있는 데이터를 모두 비우기 위해 
아래를 전부 실행해보았음.
    1. `SerialPort.DiscardInBuffer();`
    2. `SerialPort.DiscardOutBuffer();`
    3. `SerialPort.BaseStream.Flush();`
2. `SerialPort`를 `Open()` 하기 전에 해당 포트에 데이터를 Write 해놓음.
3. `SerialPort`를 `Open()` 후 `ReadExisting()` 를 실행하면 공백데이터(`""`)만 추출됨.
4. 그러나 `SerialPort.ReadLine()` 을 실행하면 기존 버퍼에 있는 데이터가 나옴