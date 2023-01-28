<#macro layout title="规则引擎" custom_css="" custom_script="">
<#--设定number_format防止10000渲染成10,000-->
<#setting number_format="computer">

<!DOCTYPE html>
<!--
This is a starter template page. Use this page to start your new project from
scratch. This page gets rid of all links and provides the needed markup only.
-->
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${title}</title>
  <!-- Tell the browser to be responsive to screen width -->
  <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
  <link rel="stylesheet" href="/css/bootstrap.min.css">
  <!-- Font Awesome -->
  <link rel="stylesheet" href="/css/font-awesome.min.css">
  <!-- Ionicons -->
  <link rel="stylesheet" href="/css/ionicons.min.css">
  <!-- Theme style -->
  <link rel="stylesheet" href="/css/AdminLTE.min.css">
  <!-- AdminLTE Skins. We have chosen the skin-blue for this starter
        page. However, you can choose any other skin. Make sure you
        apply the skin class to the body tag so the changes take effect. -->
  <link rel="stylesheet" href="/css/skin-green-light.min.css">
  <!-- select2 -->
  <link rel="stylesheet" href="/css/select2.min.css">

  <link rel="stylesheet" href="/css/app.css">
  <link rel="stylesheet" href="/css/bootstrap-datepicker3.min.css">
  <link rel="stylesheet" href="/css/jquery.timepicker.min.css">
  <link rel='stylesheet' href='/css/dataTables.bootstrap.min.css'>
  <link rel='stylesheet' href='/css/daterangepicker.css'>
  <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
  <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
  <!--[if lt IE 9]>
  <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
  <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
  <![endif]-->

  <!-- Google Font -->
  <#--<link rel="stylesheet"-->
        <#--href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600,700,300italic,400italic,600italic">-->
<#if !current_user??>
  <style>
    .sidebar-toggle, .main-sidebar {
      display: none
    }
    .content-wrapper, .main-footer {
      margin-left: 0;
    }
  </style>
</#if>
${custom_css}
</head>
<body class="hold-transition skin-green-light sidebar-mini">
<div class="wrapper">

  <!-- Main Header -->
  <header class="main-header">

    <!-- Logo -->
    <a href="/" class="logo">
      <!-- mini logo for sidebar mini 50x50 pixels -->
      <span class="logo-mini"><b>R</b>E</span>
      <!-- logo for regular state and mobile devices -->
      <span class="logo-lg"><b>Rules</b>Engine</span>
    </a>

    <!-- Header Navbar -->
    <nav class="navbar navbar-static-top" role="navigation">
      <!-- Sidebar toggle button-->
      <a href="#" class="sidebar-toggle" data-toggle="push-menu" role="button">
        <span class="sr-only">Toggle navigation</span>
      </a>
      <!-- Navbar Right Menu -->
      <div class="navbar-custom-menu">
        <ul class="nav navbar-nav">
          <!-- User Account: style can be found in dropdown.less -->
          <li class="dropdown user user-menu">
            <#if current_user??>
              <a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-expanded="false" style="font-size:1.2em;">
                <i class="fa fa-user" aria-hidden="true"></i>
                <span class="hidden-xs">${current_user.username}</span>
              </a>
              <ul class="dropdown-menu">
                <!-- Menu Body -->
                <#if current_user.authorities?seq_contains("SUPERUSER")>
                  <li><a href="${auth_users_addr}" target="_blank">账户管理</a></li>
                </#if>
                <li><a href="${auth_home_addr}">修改密码</a></li>
                <li><a href="/logout">退出</a></li>
              </ul>
              <!-- /.dropdown-menu -->
            <#else >
              <a href="/login" class="dropdown-toggle" data-toggle="dropdown" aria-expanded="false" style="font-size:1.2em;">
                <i class="fa fa-user" aria-hidden="true"></i>
                <span class="hidden-xs">登录</span>
              </a>
            </#if>
          </li>
          <!-- /.dropdown.user -->
        </ul>
      </div>
    </nav>
  </header>

  <#--modal-change-password-->
  <#if current_user??>
    <div class="modal fade" id="modal-change-password">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <button class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">修改密码</h4>
          </div>
          <div class="modal-body">
            <div class="form-horizontal">
              <div class="form-group has-feedback">
                <label class="col-sm-3 control-label" for="username">原密码</label>
                <div class="col-sm-7">
                  <input class="form-control" id="old_password" name="old_password" type="password" placeholder="">
                </div>
              </div>
              <div class="form-group has-feedback">
                <label class="col-sm-3 control-label" for="username">新密码</label>
                <div class="col-sm-7">
                  <input class="form-control" id="new_password" name="new_password" type="password"
                    placeholder="请输入8位以上字母和数字组成的密码">
                </div>
              </div>
              <div class="form-group has-feedback">
                <label class="col-sm-3 control-label" for="username">确认新密码</label>
                <div class="col-sm-7">
                  <input class="form-control" id="new_password_again" name="new_password_again" type="password"
                    placeholder="">
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary" action="change-password">修改</button>
          </div>
        </div>
        <!-- /.modal-content -->
      </div>
      <!-- /.modal-dialog -->
    </div>
  </#if>

  <!-- Left side column. contains the logo and sidebar -->
  <aside class="main-sidebar">

    <!-- sidebar: style can be found in sidebar.less -->
    <section class="sidebar">
      <!-- Sidebar Menu -->
      <ul class="sidebar-menu" data-widget="tree" data-accordion=0>
      <#--<li class="header">HEADER</li>-->
        <!-- Optionally, you can add icons to the links -->
        <li class="active tree-view menu-open">
          <a href="#"><i class="fa fa-hand-paper-o"></i> <span>规则决策引擎</span>
            <span class="pull-right-container"><i class="fa fa-angle-left pull-right"></i></span>
          </a>
          <ul class="treeview-menu">
            <li><a href="/event/list">事件管理</a></li>
            <li><a href="/rule-set/list">规则集管理</a></li>
            <li><a href="/rule/list">规则管理</a></li>
            <li><a href="/source/list">数据源管理</a></li>
            <li><a href="/field/list">字段管理</a></li>
          </ul>
        </li>
        <li class="active tree-view menu-open">
          <a href="#"><i class="fa fa-bar-chart"></i> <span>BI 统计</span>
            <span class="pull-right-container"><i class="fa fa-angle-left pull-right"></i></span>
          </a>
          <ul class="treeview-menu">
            <li><a href="/statistics/day">分日统计</a></li>
            <li><a href="/statistics/hour">分时统计</a></li>
          </ul>
        </li>
        <li class="active tree-view menu-open">
          <a href="#"><i class="fa fa-history"></i> <span>日志</span>
            <span class="pull-right-container"><i class="fa fa-angle-left pull-right"></i></span>
          </a>
          <ul class="treeview-menu">
            <li><a href="/log/api-call/">调用日志</a></li>
            <li><a href="/log/operation/">审计日志</a></li>
          </ul>
        </li>
        <li class="active tree-view menu-open">
          <a href="#"><i class="fa fa-history"></i> <span>发布管理</span>
            <span class="pull-right-container"><i class="fa fa-angle-left pull-right"></i></span>
          </a>
          <ul class="treeview-menu">
            <li><a href="/audit/submit/">已提交</a></li>
            <li><a href="/audit/review">待审核</a></li>
            <li><a href="/audit/launch">待上线</a></li>
          </ul>
        </li>
      </ul>
      <!-- /.sidebar-menu -->
    </section>
    <!-- /.sidebar -->
  </aside>

  <#nested>

  <!-- Main Footer -->
  <footer class="main-footer">
    <!-- Default to the left -->
    <strong>Copyright &copy; 2023 PLUS.</strong> All rights reserved.
  </footer>

</div>
<!-- ./wrapper -->

<!-- REQUIRED JS SCRIPTS -->

<!-- jQuery 3 -->
<script src="/js/jquery.min.js"></script>
<!-- Bootstrap 3.3.7 -->
<script src="/js/bootstrap.min.js"></script>
<!-- AdminLTE App -->
<script src="/js/adminlte.min.js"></script>
<!-- lodash 4.17.4 (same with underscore.js 1.8.3) -->
<script src="/js/lodash.min.js"></script>
<#--datepicker-->
<script src="/js/bootstrap-datepicker.min.js"></script>
<script src="/js/bootstrap-datepicker.zh-CN.min.js"></script>
<script src="/js/jquery.timepicker.min.js"></script>
<#--dataTable-->
<script src='/js/jquery.dataTables.min.js'></script>
<script src='/js/dataTables.bootstrap.min.js'></script>
<!-- select2 -->
<script src="/js/select2.full.min.js"></script>
<#--advance.ai utils-->
<script src="/js/advance.ai.js"></script>
<#if current_user??>
<script src="/js/user/me.js"></script>
</#if>
<script src='/js/moment.min.js'></script>
<#--datapicker-->
<script src='/js/daterangepicker.js'></script>

${custom_script}

<!-- Optionally, you can add Slimscroll and FastClick plugins.
     Both of these plugins are recommended to enhance the
     user experience. -->
</body>
</html>
</#macro>
