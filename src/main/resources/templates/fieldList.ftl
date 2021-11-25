<#import "_base.ftl" as _base>
<#import "_page_bar.ftl" as _page_bar>

<#assign m_script="
<script src='/js/field/list.js'></script>
">

<@_base.layout custom_script=m_script>
<!-- Content Wrapper. Contains page content -->
<div class="content-wrapper">
  <!-- Content Header (Page header) -->
  <section class="content-header">
    <h1>
      字段管理
    </h1>
  </section>

  <!-- Main content -->
  <section class="content container-fluid">
    <div class="row">
      <div class="col-xs-12">
        <div class="box">
          <table id="rule-list" class="table table-bordered table-hover text-center">
            <thead>
            <tr>
              <th>ID</th>
              <th>数据源</th>
              <th>名称</th>
              <th>类型</th>
              <th>状态</th>
              <th>描述</th>
              <th>创建时间</th>
              <th>更新时间</th>
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