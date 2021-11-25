<#import "_base.ftl" as _base>

<#assign m_css="
<link rel='stylesheet' href='/css/bi-stat/stat-hour.css'>
">

<#assign m_script="
<script src='/js/echarts.min.js'></script>
<script src='/js/statistics/query-form.js'></script>
<script src='/js/statistics/stat-hour.js'></script>
">

<@_base.layout custom_script=m_script custom_css=m_css>

<!-- Content Wrapper. Contains page content -->
<div class="content-wrapper">
  <!-- Content Header (Page header) -->
  <section class="content-header">
    <h1>分时统计</h1>
  </section>

  <!-- Main content -->
  <section class="content container-fluid">
    <div class="row no-margin">
      <form id="queryForm">
        <select class="col-sm-2" id="eventType" name="eventType">
          <option value="">全部事件类型</option>
          <#list allEventType as eventType>
            <option value="${eventType.id}">${eventType.name}</option>
          </#list>
        </select>
        <select class="col-sm-2" id="appType" name="appType">
          <option value="">全部应用类型</option>
          <#list allAppType as appType>
            <option value="${appType.id}">${appType.name}</option>
          </#list>
        </select>
        <select class="col-sm-2" id="event" name="event">
          <option value="">全部事件</option>
        </select>
        <select class="col-sm-2" id="ruleSet" name="ruleSet">
          <option value="">全部规则集</option>
        </select>

        <div class="col-sm-2">
          <button type="submit" id="btnQuery" class="btn btn-primary">查询</button>
        </div>
      </form>
    </div>

    <div class="row">
      <div class="col-sm-3 btn-group" role="group">
        <button type="button" id="tabTransactionCount" class="btn btn-default">进件次数</button>
        <button type="button" id="tabUserCount" class="btn btn-default">进件人数</button>
      </div>
    </div>

  <#--<div class="row flags">-->
  <#--<div class="col-sm-3">近30天<span class="flag flag-month">&nbsp;</span></div>-->
  <#--<div class="col-sm-3">近7天<span class="flag flag-week">&nbsp;</span></div>-->
  <#--<div class="col-sm-3">今天<span class="flag flag-today">&nbsp;</span></div>-->
  <#--</div>-->

    <div class="vertical-spacer-10px"></div>
    <div id="chart24h" style="width:800px; height:400px;"></div>
  </section>
  <!-- /.content -->
</div>
<!-- /.content-wrapper -->
</@_base.layout>