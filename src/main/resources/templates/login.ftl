<#import "_base.ftl" as _base>

<@_base.layout>

<!-- Content Wrapper. Contains page content -->
<div class="content-wrapper">
  <!-- Content Header (Page header) -->
  <section class="content-header">
    <h1>
      登录
    </h1>
  </section>

  <!-- Main content -->
  <section class="content container-fluid">

    <div class="login-box-body">
      <form action="/login/auth" method="post" class="form-horizontal" role="form"
            onSubmit="return checkSubmit()">
        <div class="form-group has-feedback">
          <label class="col-sm-3 control-label"></label>
          <div class="col-sm-7">
            <span class="text-danger" id="errorMsg"><#if errorMsg??>${errorMsg}</#if></span>
          </div>
        </div>
        <div class="form-group has-feedback">
          <label class="col-sm-3 control-label" for="username">用户名</label>
          <div class="col-sm-7">
            <input class="form-control" id="username" name="username" type="text"
                   placeholder="请输入用户名">
          </div>
        </div>
        <div class="form-group has-feedback">
          <label class="col-sm-3 control-label" for="password">密码</label>
          <div class="col-sm-7">
            <input class="form-control" id="password" name="password" type="password"
                   placeholder="请输入密码">
          </div>
        </div>
        <div class="form-group">
          <button type="submit" class="center-block btn btn-default">登录</button>
        </div>
      </form>
    </div>

  </section>
  <!-- /.content -->
</div>
<!-- /.content-wrapper -->
<script>
  function checkSubmit() {
    $("#errorMsg").text("");
    if (!$("#username").val()) {
      $("#errorMsg").text("用户名不能为空");
      return false;
    }
    if (!$("#password").val()) {
      $("#errorMsg").text("密码不能为空");
      return false;
    }
    return true;
  }
</script>
</@_base.layout>
