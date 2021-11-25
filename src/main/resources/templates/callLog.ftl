<#import "_base.ftl" as _base>

<#assign m_css="
  <link rel='stylesheet' href='/css/daterangepicker.css'>
  <link rel='stylesheet' href='/css/dataTables.bootstrap.min.css'>
">

<#assign m_script="
<script src='/js/daterangepicker.js'></script>
<script src='/js/jquery.dataTables.min.js'></script>
<script src='/js/dataTables.bootstrap.min.js'></script>

<script src='/js/log/call-logs.js'></script>
">

<@_base.layout custom_css=m_css custom_script=m_script>

<!-- Content Wrapper. Contains page content -->
<div class="content-wrapper">
  <!-- Content Header (Page header) -->
  <section class="content-header">
    <h1>调用日志</h1>
  </section>

  <!-- Main content -->
  <section class="content container-fluid">
    <div class="box-body">
      <form id="callLog" role="form" class="form-horizontal">
        <div class="form-group">
          <div class="row">
            <label for="daterange-btn" class="col-sm-2 control-label">日期区间</label>
            <div class="col-sm-3">
              <div class="input-group">
                <button type="button" class="btn btn-default pull-right" id="daterange-btn">
                  <i class="fa fa-calendar"></i>
                  <span id="date-range">选择时间段</span>
                  <i class="fa fa-caret-down"></i>
                </button>
              </div>
            </div>
            <label for="eventType" class="col-sm-2 control-label">事件类型</label>
            <div class="col-sm-3">
              <select class="form-control" id="eventType">
                <option selected>全部事件</option>
                <#list eventTypes as eventType>
                  <option>${eventType}</option>
                </#list>
              </select>
            </div>
          </div>
        </div>
        <div class="form-group">
          <div class="row">
            <label for="applicationType" class="col-sm-2 control-label">应用类型</label>
            <div class="col-sm-3">
              <select class="form-control" id="applicationType">
                <option selected>全部应用</option>
                <#list applicationTypes as applicationType>
                  <option>${applicationType}</option>
                </#list>
              </select>
            </div>
            <label for="applicationType" class="col-sm-2 control-label">事件名称</label>
            <div class="col-sm-3">
              <select class="form-control" id="eventName">
                <option selected>不限事件名</option>
                <#list eventNames as eventName>
                  <option>${eventName}</option>
                </#list>
              </select>
            </div>
          </div>
        </div>
        <div class="form-group">
          <div class="row">
            <label for="applicationType" class="col-sm-2 control-label">用户 Id</label>
            <div class="col-sm-3">
              <input type="text" class="form-control" id="userId" value="">
            </div>
            <button type="submit" class="btn btn-primary" id="search">查询</button>
          </div>
        </div>
      </form>
    </div>

    <div class="row">
      <div class="col-xs-12">
        <div class="box">
          <table id="call-log-list" class="table table-bordered table-hover text-center">
            <thead>
            <tr>
              <th>ID</th>
              <th>事件名称</th>
              <th>事件类型</th>
              <th>应用类型</th>
              <th>规则集名称</th>
              <th>规则集执行分数</th>
              <th>用户 ID</th>
              <th>审核结果</th>
              <th>总耗时(ms)</th>
              <th>执行时间</th>
              <th>执行状态</th>
              <th>操作</th>
            </tr>
            </thead>
            <tbody>

            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="modal fade" id="ruleExecLogsDialog">
      <div class="modal-dialog" style="width: 994px;">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">规则执行记录</h4>
          </div>
          <div class="modal-body" style="max-height: 600px; overflow-y: auto;">
            <table class="table table-bordered table-hover text-center">
              <thead>
              <tr>
                <th>ID</th>
                <th>规则名称</th>
                <th>规则集名称</th>
                <th>规则执行结果</th>
                <th>规则执行分数</th>
                <th>规则字段名称</th>
                <th>规则字段值</th>
                <th>规则耗时(ms)</th>
                <th>执行日期</th>
              </tr>
              </thead>
              <tbody id="ruleExecLogsContent">

              </tbody>
            </table>
          </div>
        </div>
        <!-- /.modal-content -->
      </div>
      <!-- /.modal-dialog -->
    </div>
  </section>
  <!-- /.content -->
</div>
<!-- /.content-wrapper -->

</@_base.layout>