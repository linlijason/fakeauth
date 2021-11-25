<#import "_base.ftl" as _base>

<@_base.layout>

<!-- Content Wrapper. Contains page content -->
<div class="content-wrapper">
  <!-- Content Header (Page header) -->
  <section class="content-header">
    <h1>规则执行记录</h1>
  </section>

  <!-- Main content -->
  <section class="content container-fluid">
    <div class="box-body">
      <div class="row">
        <div class="col-xs-12">
          <div class="box">
            <table id="call-log-list" class="table table-bordered table-hover text-center">
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
              <tbody>
                <#list ruleExecutionLogs as ruleExecutionLog>
                  <tr>
                    <td><#if ruleExecutionLog.id??>${ruleExecutionLog.id}</#if></td>
                    <td><#if ruleExecutionLog.ruleName??>${ruleExecutionLog.ruleName}</#if></td>
                    <td><#if ruleExecutionLog.ruleSetName??>${ruleExecutionLog.ruleSetName}</#if></td>
                    <td><#if ruleExecutionLog.ruleStatus??>${ruleExecutionLog.ruleStatus}</#if></td>
                    <td><#if ruleExecutionLog.ruleScore??>${ruleExecutionLog.ruleScore}</#if></td>
                    <td><#if ruleExecutionLog.ruleFieldName??>${ruleExecutionLog.ruleFieldName}</#if></td>
                    <td><#if ruleExecutionLog.ruleFieldValue??>${ruleExecutionLog.ruleFieldValue}</#if></td>
                    <td><#if ruleExecutionLog.costTime??>${ruleExecutionLog.costTime}</#if></td>
                    <td><#if ruleExecutionLog.dateCreated??>${ruleExecutionLog.dateCreated}</#if></td>
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