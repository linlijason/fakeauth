<#import "_base.ftl" as _base>

<#assign m_script="
<script src='/js/rule/list.js'></script>
">

<@_base.layout custom_script=m_script>
<!-- Content Wrapper. Contains page content -->
<div class="content-wrapper">
  <!-- Content Header (Page header) -->
  <section class="content-header">
    <h1>
      规则管理
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
    <div class="pull-right form-inline">
      <input class="form-control" type="text" placeholder="关键字" class="global_filter" id="global_filter">
      <button type="button" class="btn btn-success" data-toggle="modal" data-target="#upload-rules">
        导入规则
      </button>
      <div class="modal fade" id="upload-rules">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span></button>
              <h4 class="modal-title">导入规则</h4>
            </div>
            <div class="alert alert-warning alert-dismissible">
              <i class="icon fa fa-warning"></i>请勿重复导入！
            </div>
            <form id="upload-rules-form" method="POST" enctype="multipart/form-data" action="/rule/upload"
                  ons>
              <div class="modal-body">
                <p>
                  <a href="/template/rule_import_template.csv" target="_blank">下载规则导入模板</a>
                </p>
                <input type="file" name="file" required/>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-default pull-left" data-dismiss="modal">关闭</button>
                <button type="submit" class="btn btn-primary">上传</button>
              </div>
            </form>
          </div>
          <!-- /.modal-content -->
        </div>
        <!-- /.modal-dialog -->
      </div>
      <a href="/rule/new">
        <button type="button" class="btn btn-success">新建规则</button>
      </a>
      <form id="hiddenExportA" class="hide hidden" action="/rule/list/export/by/ids" method="post" target="_blank">
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
          <table id="rule-list" class="table table-bordered table-hover text-center">
            <thead>
            <tr>
              <th>规则 ID</th>
              <th>名称</th>
              <th>规则类型</th>
              <th>字段名称</th>
              <th>命中分数</th>
              <th>未命中分数</th>
              <th>未知分数</th>
              <th>规则描述</th>
              <th>创建时间</th>
              <th>操作</th>
            </tr>
            </thead>
            <tbody>
              <#--<#list rules as rule>-->
              <#--<tr>-->
                <#--<td>${rule.id}</td>-->
                <#--<td>${rule.name?upper_case}</td>-->
                <#--<td>${rule.category}</td>-->
                <#--<td>${rule.multiFieldsNames!""}</td>-->
                <#--<td>${rule.hitScore}</td>-->
                <#--<td>${rule.notHitScore}</td>-->
                <#--<td>${rule.unknownScore}</td>-->
                <#--<td>${rule.description}</td>-->
                <#--<td>${rule.dateCreated?datetime}</td>-->
                <#--<td style="white-space: nowrap">-->
                  <#--<a href="/rule/${rule.id}">-->
                    <#--<button type="button" class="btn btn-sm btn-primary">编辑</button>-->
                  <#--</a>-->
                  <#--<button type="button" class="btn btn-sm btn-danger" data-toggle="modal" data-target="#confirm-delete-rule-${rule.id}">删除</button>-->
                  <#--<a class="btn btn-info" href="/rule/show/${rule.id}">查看</a>-->
                  <#--<div class="modal fade" id="confirm-delete-rule-${rule.id}">-->
                    <#--<div class="modal-dialog">-->
                      <#--<div class="modal-content">-->
                        <#--<div class="modal-header">-->
                          <#--<button type="button" class="close" data-dismiss="modal" aria-label="Close">-->
                            <#--<span aria-hidden="true">&times;</span></button>-->
                          <#--<h4 class="modal-title">删除规则</h4>-->
                        <#--</div>-->
                        <#--<div class="modal-body">-->
                          <#--你确定要删除这条规则吗？-->
                        <#--</div>-->
                        <#--<div class="modal-footer">-->
                          <#--<button type="button" class="btn btn-default pull-left" data-dismiss="modal">取消</button>-->
                          <#--<a href="/rule/delete/${rule.id}">-->
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