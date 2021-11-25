<#import "_base.ftl" as _base>
<#import "_page_bar.ftl" as _page_bar>

<#assign rule_set_list_script="
<script src='/js/rule-set/list.js'></script>
">


<@_base.layout custom_script=rule_set_list_script>
<!-- Content Wrapper. Contains page content -->
<div class="content-wrapper">
  <!-- Content Header (Page header) -->
  <section class="content-header">
    <h1>
      规则集列表
    </h1>
    <div class="pull-right form-inline">
      <label for="eventType">事件类型</label>
      <select class="form-control" name="eventType" required>
        <option selected value="all">全部事件</option>
        <#list eventType as et>
          <option value="${et.id}">${et.id}.${et.name}</option>
        </#list>
      </select>
      <input type="text" placeholder="关键字" class="form-control global_filter" id="global_filter">
      <a href="/rule-set/new" class="btn btn-success">新建规则集</a>
      <form id="hiddenExportA" class="hide hidden" action="/rule-set/list/export/by/ids" method="post" target="_blank">
        <input type="hidden" id="ids" name="ids">
      </form>
      <a href="javascript:export_excel()" class="btn btn-info" target="_blank">导出Excel</a>
    </div>
  </section>

  <!-- Main content -->
  <section class="content container-fluid">
    <div class="row">
      <div class="col-xs-12">
        <div class="box">
          <table id="rule-set-list" class="table table-bordered table-hover text-center">
            <thead>
            <tr>
              <th>ID</th>
              <th>规则集名称</th>
              <th>规则集类型</th>
              <th>创建时间</th>
              <th>执行时间段</th>
              <th>生效日期</th>
              <th>操作</th>
            </tr>
            </thead>
            <tbody>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>

  <!-- /.content -->
</div>
<!-- /.content-wrapper -->

</@_base.layout>
