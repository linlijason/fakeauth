<#import "_base.ftl" as _base>


<#assign rule_set_list_script="
<script src='/js/user/user-list.js'></script>
">


<@_base.layout custom_script=rule_set_list_script>
<!-- Content Wrapper. Contains page content -->
<div class="content-wrapper">
  <!-- Content Header (Page header) -->
  <section class="content-header">
    <h1>
      账户列表
    </h1>
    <button class="btn btn-success pull-right" data-toggle="modal" data-target="#modal-create-user">新建账户</button>
  </section>

  <div class="modal fade" id="modal-create-user">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <button class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span></button>
          <h4 class="modal-title">创建账户</h4>
        </div>
        <div class="modal-body">
          <div class="form-horizontal">
            <div class="form-group has-feedback">
              <label class="col-sm-3 control-label" for="username">账户名</label>
              <div class="col-sm-7">
                <input class="form-control" id="username" name="username" type="text" placeholder="请输入账户名">
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" action="create-user">确认</button>
        </div>
      </div>
      <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
  </div>

  <!-- Main content -->
  <section class="content container-fluid">
    <div class="row">
      <div class="col-xs-12">
        <div class="box">
          <table id="rule-set-list" class="table table-bordered table-hover text-center">
            <thead>
            <tr>
              <th>账户名</th>
              <th>创建时间</th>
              <th>操作</th>
            </tr>
            </thead>
            <tbody>
              <#list users as user>
              <tr userid="${user.id}">
                <td>${user.username}</td>
                <td><#if user.dateCreated??>${user.dateCreated?datetime}</#if></td>
                <td>
                  <a href="javascript:void(0);" action="reset-password">重置密码</a>
                  |
                  <a  href="javascript:void(0);"action="delete-user">删除账户</a>
                </td>
              </tr>
              </#list>
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
