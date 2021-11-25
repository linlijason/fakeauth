<#import "_base.ftl" as _base>

<#assign m_css="
  <link rel='stylesheet' href='/css/daterangepicker.css'>
  <link rel='stylesheet' href='/css/dataTables.bootstrap.min.css'>
">

<#assign m_script="
<script src='/js/moment.min.js'></script>
<script src='/js/daterangepicker.js'></script>
<script src='/js/jquery.dataTables.min.js'></script>
<script src='/js/dataTables.bootstrap.min.js'></script>

<script src='/js/log/operation-logs.js'></script>
">

<@_base.layout custom_css=m_css custom_script=m_script>

<!-- Content Wrapper. Contains page content -->
<div class="content-wrapper">
  <!-- Content Header (Page header) -->
  <section class="content-header">
    <h1>审计日志</h1>
  </section>

  <script>
    var CONTENT_TYPES_MAP = {}, OPERATION_TYPES_MAP = {};
      <#list contentTypes as type>
      CONTENT_TYPES_MAP['${type}'] = '${type.text}';
      </#list>
      <#list operationTypes as type>
      OPERATION_TYPES_MAP['${type}'] = '${type.text}';
      </#list>
  </script>

  <!-- Main content -->
  <section class="content container-fluid">
    <div class="box-body">
      <form id="operation-log" role="form" class="form-horizontal">
        <div class="form-group">
          <div class="col-sm-6">
            <label for="daterange" class="sr-only">日期区间</label>
            <div class="input-group" id="daterange-wrapper">
              <input type="text" class="form-control" id="daterange" name="daterange" required placeholder="请选择时间区间"/>
              <div class="input-group-addon"><i class="glyphicon glyphicon-calendar fa fa-calendar"></i></div>
            </div>
          </div>
          <div class="col-sm-3">
            <label class="sr-only" for="username">username</label>
            <input type="text" class="form-control" id="operator" name="operator" placeholder="请输入用户名">
          </div>
          <div class="col-sm-2">
            <button type="submit" class="btn btn-default">查询</button>
          </div>
        </div>
      </form>
    </div>

    <div class="row">
      <div class="col-xs-12">
        <div class="box">
          <table id="log-list" class="table table-bordered table-hover text-center">
            <thead>
            <tr>
              <th>更新内容</th>
              <th>更新内容ID</th>
              <th>更新内容名称</th>
              <th>操作类型</th>
              <th>操作人</th>
              <th>操作时间</th>
            </tr>
            </thead>
            <tbody>

            </tbody>
          </table>
          <script id="log-row-template" type="text/template">
            <tr>
              <td><%= content %></td>
              <td><%= contentId %></td>
              <td><%= contentName %></td>
              <td><%= type %></td>
              <td><%= operator %></td>
              <td><%= dateCreated %></td>
            </tr>
          </script>
        </div>
      </div>
    </div>
  </section>
  <!-- /.content -->
</div>
<!-- /.content-wrapper -->

</@_base.layout>