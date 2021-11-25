<#import "_base.ftl" as _base>
<#import "_page_bar.ftl" as _page_bar>


<#assign m_script="
<script src='/js/moment.min.js'></script>
<script src='/js/event/list.js'></script>
">


<@_base.layout custom_script=m_script>
<!-- Content Wrapper. Contains page content -->
<div class="content-wrapper">
  <!-- Content Header (Page header) -->
  <section class="content-header">
    <h1>
      事件列表
    </h1>
    <div class="pull-right">
      <a href="/event/new" class="btn btn-success">新建事件</a>
      <a href="/event/list/export" class="btn btn-info" target="_blank">导出Excel</a>
    </div>
  </section>

  <!-- Main content -->
  <section class="content container-fluid">
    <div class="row">
      <div class="col-xs-12">
        <div class="box">
          <table id="event-list" class="table table-bordered table-hover text-center">
            <thead>
            <tr>
              <th>ID</th>
              <th>事件名称</th>
              <th>事件类型</th>
              <th>应用类型</th>
              <th>创建时间</th>
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
