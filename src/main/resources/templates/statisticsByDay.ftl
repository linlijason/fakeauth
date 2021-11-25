<#import "_base.ftl" as _base>

<#assign m_script="
<script src='/js/echarts.min.js'></script>
<script src='/js/statistics/query-form.js'></script>
<script src='/js/moment.min.js'></script>
<script src='/js/daterangepicker.js'></script>
<script src='/js/jquery.dataTables.min.js'></script>
<script src='/js/dataTables.bootstrap.min.js'></script>

<script src='/js/statistics/statistics.js'></script>
">

<#assign m_css="
  <link rel='stylesheet' href='/css/daterangepicker.css'>
  <link rel='stylesheet' href='/css/dataTables.bootstrap.min.css'>
  <style>
  .overlay-wrapper .overlay>.fa { top: 400px;}
  </style>
">

<@_base.layout custom_script=m_script custom_css=m_css>

<!-- Content Wrapper. Contains page content -->
<div class="overlay-wrapper content-wrapper" xmlns="http://www.w3.org/1999/html">
  <#--overlay 加载动画-->
  <div id="overlay" class="overlay" style="display:none;"><i class="fa fa-refresh fa-spin"></i></div>
  <!-- Content Header (Page header) -->
  <section class="content-header">
    <h1>分日统计</h1>
  </section>

  <!-- Main content -->
  <section class="content container-fluid">
    <div class="row no-margin">
      <form id="queryForm">
        <div class="col-sm-3" style="padding-left: 0;" id="daterange-btn">
          <div class="form-control text-center">
            <i class="fa fa-calendar"></i>
            <span id="date-range"></span>
            <i class="fa fa-caret-down"></i>
          </div>
        </div>
        <div class="col-sm-2">
          <select class="form-control" id="eventType" name="eventType">
            <option value="">全部事件类型</option>
            <#list allEventType as eventType>
              <option value="${eventType.id}">${eventType.name}</option>
            </#list>
          </select>
        </div>
        <div class="col-sm-2">
          <select class="form-control" id="appType" name="appType">
            <option value="">全部应用类型</option>
            <#list allAppType as appType>
              <option value="${appType.id}">${appType.name}</option>
            </#list>
          </select>
        </div>
        <div class="col-sm-2">
          <select class="form-control" id="event" name="event">
            <option value="">全部事件</option>
          </select>
        </div>
        <div class="col-sm-2">
          <select class="form-control" id="ruleSet" name="ruleSet">
            <option value="">全部规则集</option>
          </select>
        </div>

        <div class="col-sm-1">
          <button type="submit" id="btnStatisticsByDay" class="btn btn-primary">查询</button>
        </div>
      </form>
    </div>

    <div class="row">
      <div class="col-sm-3 btn-group" role="group">
        <button type="button" id="tabTransactionCount" class="btn btn-default btn-info" value="1">进件次数</button>
        <button type="button" id="tabUserCount" class="btn btn-default" value="0">进件人数</button>
      </div>
    </div>

    <div class="h4 bg-light-blue" style="width: 8em;text-align: center;padding: 5px">总览</div>
    <div class="row">


      <div class="col-sm-4">
        <div class="info-box">
          <span class="info-box-icon bg-green"><i class="fa fa-check"></i></span>

          <div class="info-box-content">
            <span class="info-box-text">进件通过</span>
            <span id="passCount" class="info-box-number"></span>
          </div>
          <!-- /.info-box-content -->
        </div>
        <!-- /.info-box -->
      </div>
      <!-- /.col -->

      <div class="col-sm-4">
        <div class="info-box">
          <span class="info-box-icon bg-red"><i class="fa fa-ban"></i></span>

          <div class="info-box-content">
            <span class="info-box-text">进件拒绝</span>
            <span id="refuseCount" class="info-box-number"></span>
          </div>
          <!-- /.info-box-content -->
        </div>
        <!-- /.info-box -->
      </div>
      <!-- /.col -->

      <div class="col-sm-4">
        <div class="info-box">
          <span class="info-box-icon bg-aqua"><i class="fa fa-database"></i></span>

          <div class="info-box-content">
            <span class="info-box-text">总进件</span>
            <span id="totalCount" class="info-box-number"></span>
          </div>
          <!-- /.info-box-content -->
        </div>
        <!-- /.info-box -->
      </div>
      <!-- /.col -->
    </div>

    <div class="h4 bg-light-blue" style="width: 8em;text-align: center;padding: 5px">分日拒绝情况</div>
    <div id="container" style="width:1024px; height:400px; margin:0 auto;"></div>

    <div class="h4 bg-light-blue" style="width: 8em;text-align: center;padding: 5px">规则贡献</div>
    <div class="row">
      <div class="col-xs-12">
        <div class="box">
          <table id="rule-list" class="table table-bordered table-hover text-center">
            <thead>
            <tr>
              <th>ID</th>
              <th>规则名称</th>
              <th>规则类型</th>
              <th>命中率</th>
            </tr>
            </thead>
            <tbody>

            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>l
  <!-- /.content -->
</div>
<!-- /.content-wrapper -->
</@_base.layout>