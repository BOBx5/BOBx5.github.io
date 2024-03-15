---
title: 고성능 데이터 적재기
description: <span>&#x23;ASP.NET</span>
layout: libdoc/page

#LibDoc specific below
category: ASP.NET
order: 204
---
* 
{:toc}

## [EventListenerAPI](https://github.com/psmon/EventListenerAPI)
---
* 이벤트마다 커넥션을 사용하는 것 보다 <br/>***커넥션 `1` : 이벤트 `1`***<br/>
  이벤트를 모아서 한번에 처리하는 것이 효율적이다. <br/>***커넥션 `1` : 이벤트 `N`***
* 대표적인 케이스로는 로그 데이터를 적재하는 경우

* 진행 방식

    [![](https://mermaid.ink/img/pako:eNplUcFKw0AQ_ZWwJ4V-QaCCIRV6iCD1IlkPYzLa0GRTNruihIAHD0G9Ch5y6B9YsAqCX5Sm_-Bmk8a0LuwyM-_NzNuZlHixj8QklN1wmE-Nc9ugzFAHb5EJd_2Vb56-q8XrqHYvG-hk4rjqGseeiHkbs0B4U1e_O_EgGfsIYVoVi02xqp6LcvlIKatWefnxk205Dtyl1Wexfnkol-9V_rbPsC33wAYBV5DgYVu5J9MYDo0ziRKVcVTL63TqgK7fa1XTT1tEq9vDLjSm_7Lzib-8rkUP-ZfVDEMhlgxnY5YgF5piW2RAIuQRBL6afFqzKRFTjJASU5k-8BlVG8kUD6SIJ_fMI6bgEgdEzn0QaAeg1hUR8xrCpIuO_EANfstE7TnNevWWs1_X66tD?type=png)](https://mermaid-js.github.io/mermaid-live-editor/edit#pako:eNplUcFKw0AQ_ZWwJ4V-QaCCIRV6iCD1IlkPYzLa0GRTNruihIAHD0G9Ch5y6B9YsAqCX5Sm_-Bmk8a0LuwyM-_NzNuZlHixj8QklN1wmE-Nc9ugzFAHb5EJd_2Vb56-q8XrqHYvG-hk4rjqGseeiHkbs0B4U1e_O_EgGfsIYVoVi02xqp6LcvlIKatWefnxk205Dtyl1Wexfnkol-9V_rbPsC33wAYBV5DgYVu5J9MYDo0ziRKVcVTL63TqgK7fa1XTT1tEq9vDLjSm_7Lzib-8rkUP-ZfVDEMhlgxnY5YgF5piW2RAIuQRBL6afFqzKRFTjJASU5k-8BlVG8kUD6SIJ_fMI6bgEgdEzn0QaAeg1hUR8xrCpIuO_EANfstE7TnNevWWs1_X66tD)

<!-- 
graph TD 
event[불특정Event]
FSM[FSM Actor]
Batch[Batch Actor]
isIdeal{유휴시간\n초과}
isMax{최대갯수\n초과}
DB[(Database)]

event == Queue ==> FSM
FSM ==> isMax
isMax == N ==> isIdeal
isMax == Y ==> Batch
isIdeal == N ==> FSM
isIdeal == Y ==> Batch
Batch == BulkInsert ==> DB 
-->