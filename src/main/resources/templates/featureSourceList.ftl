<#import "_base.ftl" as _base>

<#assign m_script="
<script src='/js/feature-source/list.js'></script>
">

<@_base.layout custom_script=m_script>
<!-- Content Wrapper. Contains page content -->
<div class="content-wrapper">
  <!-- Content Header (Page header) -->
  <section class="content-header">
    <h1>
      数据源管理
    </h1>
    <#if message??>
      <div class="alert alert-info alert-dismissible">
        <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
      ${message}
      </div>
    </#if>
    <#if error??>
      <div class="alert alert-danger alert-dismissible">
        <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
      ${error}
      </div>
    </#if>
    <a href="/source/new">
      <button type="button" class="btn btn-success pull-right">新增数据源</button>
    </a>
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
              <th>名称</th>
              <th>URL</th>
              <th>方法</th>
              <th>来源</th>
              <th>参数</th>
              <th>描述</th>
              <th>创建时间</th>
              <th>操作</th>
            </tr>
            </thead>
            <tbody>
              <#--<#list featureSources as featureSource>-->
              <#--<tr>-->
                <#--<td>${featureSource.id}</td>-->
                <#--<td>${featureSource.name?upper_case}</td>-->
                <#--<td>${featureSource.url}</td>-->
                <#--<td>${featureSource.method!""}</td>-->
                <#--<td>${featureSource.source!""}</td>-->
                <#--<td>${featureSource.params!""}</td>-->
                <#--<td>${featureSource.description!""}</td>-->
                <#--<td>${featureSource.dateCreated!""}</td>-->
                <#--<td style="white-space: nowrap">-->
                  <#--<a href="/source/${featureSource.id}">-->
                    <#--<button type="button" class="btn btn-sm btn-primary">编辑</button>-->
                  <#--</a>-->
                  <#--<button type="button" class="btn btn-sm btn-danger" data-toggle="modal" data-target="#confirm-delete-source-${featureSource.id}">删除</button>-->
                  <#--<div class="modal fade" id="confirm-delete-source-${featureSource.id}">-->
                    <#--<div class="modal-dialog">-->
                      <#--<div class="modal-content">-->
                        <#--<div class="modal-header">-->
                          <#--<button type="button" class="close" data-dismiss="modal" aria-label="Close">-->
                            <#--<span aria-hidden="true">&times;</span></button>-->
                          <#--<h4 class="modal-title">删除数据源</h4>-->
                        <#--</div>-->
                        <#--<div class="modal-body">-->
                          <#--你确定要删除这个数据源吗？-->
                        <#--</div>-->
                        <#--<div class="modal-footer">-->
                          <#--<button type="button" class="btn btn-default pull-left" data-dismiss="modal">取消</button>-->
                          <#--<a href="/source/delete/${featureSource.id}">-->
                            <#--<button type="submit" class="btn btn-primary">确认</button>-->
                          <#--</a>-->
                        <#--</div>-->
                      <#--</div>-->
                      <#--<!-- /.modal-content &ndash;&gt;-->
                    <#--</div>-->
                    <#--<!-- /.modal-dialog &ndash;&gt;-->
                  <#--</div>-->
                <#--</td>-->
              <#--</tr>-->
              <#--</#list>-->
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