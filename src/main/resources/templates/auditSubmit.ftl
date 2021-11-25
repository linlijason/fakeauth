<#import "_base.ftl" as _base>

<#assign m_script="
<script src='/js/audit/submit.js'></script>
<script src='/js/audit/buildDetail.js'></script>
">

<@_base.layout custom_script=m_script>

<div class="content-wrapper">
  <#--header-->
    <section class="content-header">
      <h1>
        已提交
      </h1>
    </section>
  <#--main body-->
    <section class="content container-fluid">
      <div class="row">
        <div class="col-xs-12">
          <div class="box">
            <table id="submit-list" class="table table-bordered table-hover text-center">
              <thead>
                <tr>
                  <th>序号</th>
                  <th>更新内容</th>
                  <th>内容ID</th>
                  <th>更新内容名称</th>
                  <th>操作类型</th>
                  <th>预上线时间</th>
                  <th>状态</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <#include "detail.ftl">
    </section>
</div>

</@_base.layout>