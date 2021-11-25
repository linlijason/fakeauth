<#import "_base.ftl" as _base>


<#assign m_script="
<script src='/js/d3.v3.5.17.min.js'></script>
<script src='/js/lib/rule-set-tree.js'></script>
<script src='/js/event/edit.js'></script>
">


<@_base.layout custom_script=m_script>

<!-- Content Wrapper. Contains page content -->
<div class="content-wrapper">
  <!-- Content Header (Page header) -->
  <section class="content-header">
    <h1>
      事件-<#if event.id??>${event.name}<#else>新建</#if>
    </h1>
  </section>

  <!-- Main content -->
  <section class="content container-fluid">
    <div class="box">
      <script>
        var all_rule_sets = [];
          <#list all_rule_sets as aRuleSet> all_rule_sets.push({
            id: ${aRuleSet.id},
            name: '${aRuleSet.id}. ${aRuleSet.name}',
            period: '<#if aRuleSet.dateBegin??>${aRuleSet.dateBegin?string("yyyy-MM-dd")}</#if>'
            + '~<#if aRuleSet.dateEnd??>${aRuleSet.dateEnd?string("yyyy-MM-dd")}</#if>'
            + ' &nbsp;&nbsp;<#if aRuleSet.timeStart??>${aRuleSet.timeStart?string("HH:mm")}</#if>'
            + '~${aRuleSet.timeStopString!''}',
            maxScore: ${aRuleSet.maxScore}
          });</#list>
        var rule_set_relations = [];
          <#if ruleSetRelations??>
            <#list ruleSetRelations as rr> rule_set_relations.push({ruleSetId: ${rr.ruleSetId}});</#list>
          </#if>
        var show_mode = <#if show_mode??>true<#else>false</#if>;
      </script>

      <form id="event-form" class="form-horizontal" role="form">
        <input type="hidden" id="id" name="id" value="<#if event.id??>${event.id}</#if>"/>
        <div class="form-group">
          <label class="col-sm-2 control-label">事件类型</label>
          <div class="col-sm-3">
            <select class="form-control" id="eventType" name="eventType" required>
              <option value="">请选择事件类型</option>
              <#list all_event_types as type>
                <option value="${type.id}" <#if event.eventType??>
                  <#if event.eventType.id == type.id>selected</#if></#if>>${type.name}</option>
              </#list>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-2 control-label">应用类型</label>
          <div class="col-sm-3">
            <select class="form-control" id="appType" name="appType" required>
              <option value="">请选择应用类型</option>
              <#list all_app_types as type>
                <option value="${type.id}" <#if event.appType??>
                  <#if event.appType.id == type.id>selected</#if></#if>>${type.name}</option>
              </#list>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-2 control-label">事件名称</label>
          <div class="col-sm-9">
            <input type="text" class="form-control" id="name" name="name" required
              value="<#if event.name??>${event.name}</#if>">
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-2 control-label">规则集列表</label>
          <div class="col-sm-9">
            <div class="clearfix">
              <button id="add-one-rule-set" type="button" class="btn btn-primary btn-sm">添加规则集</button>
            </div>
            <div class="clearfix rule-set-list-box" id="rule-set-list-box">
            </div>
            <script id="rule-set-row-template" type="text/template">
              <div class="row rule-set">
                <div class="col-sm-4">
                  <select class="form-control select2 rule-set-select" required style="width: 100%;">
                    <option value="">请选择规则集</option>
                  </select>
                </div>
                <button action="remove-rule-set" type="button" class="btn btn-danger btn-sm">删除</button>
                <div class="horizontal-spacer-10px"></div>
                <span class="text-danger period-area form-control-static"></span>
              </div>
            </script>
          </div>
        </div>
        <div class="form-group scores-operator-cfg">
          <label class="col-sm-2 control-label">事件总得分计算</label>
          <div class="col-sm-6">
            <#list score_operators as op>
              <label class="radio-inline">
                <input type="radio" name="scoreOperator" id="scoreOperator${op}" required
                  value="${op}" <#if event.scoreOperator??> <#if event.scoreOperator == op>checked</#if></#if>
                > ${op.text}
              </label>
            </#list>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-2 control-label">REFUSE, 拒绝</label>
          <div class="col-sm-3">
            <input type="number" min="0" max="" class="form-control" id="refuseScoreMin" name="refuseScoreMin"
              placeholder="" value="${event.refuseScoreMin!''}">
          </div>
          <div class="col-sm-3">
            <input type="number" min="0" max="" class="form-control" id="refuseScoreMax" name="refuseScoreMax"
              placeholder="" value="${event.refuseScoreMax!''}">
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-2 control-label">PASS, 通过</label>
          <div class="col-sm-3">
            <input type="number" min="0" max="" class="form-control" id="passScoreMin" name="passScoreMin"
              placeholder="" value="${event.passScoreMin!''}">
          </div>
          <div class="col-sm-3">
            <input type="number" min="0" max="" class="form-control" id="passScoreMax" name="passScoreMax"
              placeholder="" value="${event.passScoreMax!''}">
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-2 control-label">HINT, 存在风险项</label>
          <div class="col-sm-3">
            <input type="number" min="0" max="" class="form-control" id="hintScoreMin" name="hintScoreMin"
              placeholder="" value="${event.hintScoreMin!''}">
          </div>
          <div class="col-sm-3">
            <input type="number" min="0" max="" class="form-control" id="hintScoreMax" name="hintScoreMax"
              placeholder="" value="${event.hintScoreMax!""}">
          </div>
        </div>

        <div class="form-group">
          <div class="btns-box">
            <#if show_mode??>
              <button id="back" type="button" class="btn btn-default">返回</button>
            <#else>
              <button id="cancel" type="button" class="btn btn-default">取消</button>
              <button id="save" type="submit" class="btn btn-success">保存</button>
            </#if>
          </div>
        </div>
      </form>
    </div>
  </section>

  <!-- 预览模态框 -->
  <div class="modal fade" id="preview-rule-set">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          <h4 class="modal-title">规则集预览</h4>
        </div>
        <div class="modal-body">
          <div id="tree"></div>
        </div>
      </div>
    </div>
  </div>

  <!-- /.content -->
</div>
<!-- /.content-wrapper -->
</@_base.layout>
