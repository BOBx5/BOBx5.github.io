---
title: SqlServer 컨테이너 생성 및 설정
description: <span>&#x23;Docker &#x23;SqlServer &#x23;MSSQL</span>
layout: libdoc/page

#LibDoc specific below
category: Docker
order: 601
---
* 
{:toc}

## Docker 및 DB 설정 방법

Docker 에서 SQL Server를 사용하기 위한 방법을 먼저 정리하자.<br/>
커맨드는 전부 *PowerShell* 을 기준으로 설명되어 있습니다.

### 1. SqlServer Image 내려받기

```powershell
docker pull mcr.microsoft.com/mssql/server:2022-latest
```
    
### 2. 컨테이너 이미지 생성하기 

HostPC에 설치된 SQL Server가 있는 경우 `1433` 포트를 <br/>
기본 포트로 사용하기 때문에<br/>
충돌을막기 위해 `1401`로 변경

```powershell
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=안전한비밀번호1!" -p 1401:1433 --name librarydb -d -v librarydb-volume:/var/opt/mssql mcr.microsoft.com/mssql/server:2022-latest
```
    
### 3. 컨테이너의 'sqlcmd' 를 이용한 SQL 쿼리 실행
    
```powershell
docker exec -it librarydb /opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P "안전한비밀번호1!"
```

위 명령어를 실행하면 sqlcmd 프롬프트가 나타난다.
아래 쿼리문을 실행하여 SA 계정의 비밀번호를 변경한다.

```sql
ALTER LOGIN SA WITH PASSWORD='안전한비밀번호1!';
GO
```
    
### 4. 데이터 베이스 생성하기
    
```sql
USE master;
GO
CREATE DATABASE LibraryDb;
GO
```
    
### 5. 로그인 및 DB제어 가능한 신규 사용자 계정 만들기
    
```sql
-- 로그인 계정 생성
CREATE LOGIN libraryadmin WITH PASSWORD='안전한비밀번호1!';
-- 로그인 계정에 DB 접근 권한 부여
CREATE USER libraryadmin FOR LOGIN libraryadmin;
-- 로그인 계정에 DB 제어 권한 부여
GRANT CONTROL ON DATABASE::LibraryDb TO libraryadmin;
-- 로그인 계정에 테이블 생성/제어 권한 부여
GRANT CREATE TABLE TO libraryadmin;
GRANT ALTER ON SCHEMA::dbo TO libraryadmin;

GO
```
    
위 명령어를 실행하면 SA 계정 외에 libraryadmin 계정으로도 로그인이 가능하다.
    
### 6. 'sqlcmd'를 이용한 계정 연결 테스트

```powershell
docker exec -it /opt/mssql-tools/bin/sqlcmd -S localhost -U libraryadmin -P "안전한비밀번호1!"
```
    
### 7. DB컨테이너 접속 아이피 및 포트 획득

```powershell
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' librarydb
docker inspect -f '{{range .Config.Networks}}{{.Ports}}{{end}}' librarydb
```
    
### 8. DB 연결이 되는지 확인
    
HostPC (*DockerDesktop*이 설치된 PC)에서 아래의 방법들을 이용하여 확인이 가능하다

```text
Data Source=localhost,1401;Database=LibraryDb;Integrated Security=false;User ID=sa;Password='안전한비밀번호1!';Encrypt=true;TrustServerCertificate=true;”
```

1. Azure Data Studio
2. SSMS
3. DBeaver

## ASP.NET 어플리케이션과 연결
---
> ⚠️ <br/>
> 먼저 **Docker Desktop** 에서 컨테이너를 실행하게 되면 <br/>
> 기본적으로 ‘*bridge*’ 라는 내부 네트워크 망으로 <br/>
> 연결되어 각 컨테이너별로 개별 IP를 부여받게 된다. <br/>
> (`IPv4` 형태)

**Host** PC에서 Container로 접근하는 할때는은 `localhost:1401` 이지만<br/>
Container →  Container 로 연결할 때 `ConnectionString`은<br/>
‘*bridge*’ 네트워크 망간의 연결이므로 변경되어야 한다.

### 1. 컨테이너간 'Bridge' 내부 IP 확인
그러면 SQL Server가 ‘*bridge*’ 내부에서 부여받은 `IPv4`를 확인해보자
    
```powershell
docker inspect librarydb
```

위 명령어를 실행하면 컨테이너의 inpect를 json 형태로 보여준다.<br/>
거기서 확인해야 할 부분은 아래와 같다.
`NetworkSettings` > `Networks` > *'bridge'* > `IPAddress`

나같은 경우는 현재 `172.17.0.2` 이다.
    
### 2. Host용 'ConnectionString' 확인
`Host`에서 설정한 librarydb의 포트는 `1401`이나 <br/>
도커 네트워크 내부에서의 포트는 `1433` 으로 설정되어있다. <br/>
따라서 `ConnectionString`을 `Data Source` 부분을 아래와 같이 변경해야한다.
    
```text
Data Source=172.17.0.2,1433;Database=LibraryDb;Integrated Security=false;User ID=sa;Password='안전한비밀번호1!';Encrypt=true;TrustServerCertificate=true;
```
    
## 요약
---
### 1. SqlServer 이미지 다운로드

```powershell
$sqlServerImage = "mcr.microsoft.com/mssql/server:2022-latest"
docker pull $sqlServerImage
```

### 2. SqlServer 컨테이너 생성

```powershell
# 변수 설정
$sqlServerImage = "mcr.microsoft.com/mssql/server:2022-latest"
$hostPort = 1401
$containerPort = 1433
$saPassword = "safepassword1!"
$containerName = "librarydb"
$databaseName = "librarydb"
$volumeName = "sqlvolume"
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=${saPassword}" -p ${hostPort}:${containerPort} --name ${containerName} -d -v ${volumeName}:/var/opt/mssql mcr.microsoft.com/mssql/server:2022-latest
```

### 3. Database 생성

1. SQL Server 컨테이너 SA계정으로 접속
    
    ```powershell
    docker exec -it ${containerName} /opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P ${saPassword}
    ```
    
2. 데이터베이스 생성
    
    ```sql
    CREATE DATABASE librarydb;
    GO
    EXIT
    ```

### 4. ConnectionString 확인

1. 도커 컨테이너 내부 Bridge 접속 IP 확인
    
    ```powershell
    $sqlserverIpAddress = docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' ${containerName} | Out-String
    $sqlserverIpAddress = $sqlserverIpAddress -replace [environment]::NewLine,""
    $sqlserverIpAddress = $sqlserverIpAddress.TrimStart("failed to get console mode for stdout: The handle is invalid.").Trim()
    echo "`n[SQL Server internal IP] `n${sqlserverIpAddress}`n"
    ```
    
    >💡 출력 예시
    > ```text
    > [SQL Server internal IP]
    > 172.17.0.2
    > ```
    
2. 호스트에서 접근 가능한 *ConnectionString* 출력
    
    ```powershell
    echo "`n[ConnectionString for HOST]`nData Source=localhost,${hostPort};Database=${databaseName};Integrated Security=false;User ID=${databaseUserName};Password='${databaseUserPassword}';Encrypt=true;TrustServerCertificate=true;`n"
    ```
    
    > 💡 출력 예시
    > ```text
    > [ConnectionString for HOST]
    > Data Source=localhost,1401;Database=librarydb;Integrated Security=false;User ID=;Password='';Encrypt=true;TrustServerCertificate=true;
    > ```
    
3. 컨테이너간 bridge에서 접근 가능한 ConnectionString 출력
    
    ```powershell
    echo "`n[ConnectionString for container]`nData Source=localhost,${hostPort};Database=${databaseName};Integrated Security=false;User ID=${databaseUserName};Password='${databaseUserPassword}';Encrypt=true;TrustServerCertificate=true;`n"
    ```
    
    > 💡 출력 예시
    > ```text
    > [ConnectionString for Container]
    > Data Source=localhost,1401;Database=librarydb;Integrated Security=false;User ID=;Password='';Encrypt=true;TrustServerCertificate=true;
    > ```

## 참고
---
### *ConnectionString* 일괄출력 파워쉘 스크립트
{:.no_toc}

```powershell
# 변수 설정
$sqlServerImage = "mcr.microsoft.com/mssql/server:2022-latest"
$hostPort = 1401
$containerPort = 1433
$userId = "sa"
$saPassword = "safepassword1!"
$containerName = "librarydb"
$databaseName = "librarydb"
$volumeName = "sqlvolume"

# 도커 컨테이너 내부 Bridge 접속 IP 확인
$sqlserverIpAddress = docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' ${containerName} | Out-String
$sqlserverIpAddress = $sqlserverIpAddress -replace [environment]::NewLine,""
$sqlserverIpAddress = $sqlserverIpAddress.TrimStart("failed to get console mode for stdout: The handle is invalid.").Trim()
echo "`n[SQL Server internal IP] `n${sqlserverIpAddress}`n"

# 호스트에서 접근 가능한 ConnectionString 출력
echo "`n[ConnectionString for HOST]`nData Source=localhost,${hostPort};Database=${databaseName};Integrated Security=false;User ID=${userId};Password='${saPassword}';Encrypt=true;TrustServerCertificate=true;`n"

# 컨테이너간 bridge에서 접근 가능한 ConnectionString 출력
echo "`n[ConnectionString for container]`nData Source=${sqlserverIpAddress},${containerPort};Database=${databaseName};Integrated Security=false;User ID=${userId};Password='${saPassword}';Encrypt=true;TrustServerCertificate=true;`n"
```
