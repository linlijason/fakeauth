<#import "_base.ftl" as _base>

<#assign m_script="
<script src='/js/audit/review.js'></script>
<script src='/js/audit/buildDetail.js'></script>
">

<@_base.layout custom_script=m_script>

<div class="content-wrapper">
<#--header-->
  <section class="content-header">
    <h1>
      待审核
    </h1>
  </section>
<#--main body-->
  <section class="content container-fluid">
    <div class="row">
      <div class="col-xs-12">
        <div class="box">
          <table id="review-list" class="table table-bordered table-hover text-center">
            <thead>
              <tr>
                <th>序号</th>
                <th>更新内容</th>
                <th>内容ID</th>
                <th>更新内容名称</th>
                <th>操作类型</th>
                <th>预上线时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tBody></tBody>
          </table>
        </div>
      </div>
    </div>
    <#include "detail.ftl">
  </section>
</div>

</@_base.layout>