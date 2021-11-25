<#import "_base.ftl" as _base>


<#assign rule_set_css="
<link rel='stylesheet' href='/css/rule-set/edit.css'>
">

<#assign rule_set_script="
<script src='/js/d3.v3.5.17.min.js'></script>
<script src='/js/rule-set/edit.js'></script>
">


<@_base.layout custom_css=rule_set_css custom_script=rule_set_script>

<!-- Content Wrapper. Contains page content -->
<div class="content-wrapper">
  <!-- Content Header (Page header) -->
  <section class="content-header">
    <h1>
      规则集-<#if ruleSet.id??>${ruleSet.name}<#else>新建</#if>
    </h1>
  </section>

  <!-- Main content -->
  <section class="content container-fluid">
    <div class="box">
      <script>
        var rule_result_types = [], all_rules = [], all_rule_sets = [];
          <#list rule_result_types as aType> rule_result_types.push('${aType}');</#list>
          <#list all_rules as aRule> all_rules.push({
            id:${aRule.id},
            name: '${aRule.id}. ${aRule.name}',
            hit_score: ${aRule.hitScore!0},
            not_hit_score: ${aRule.notHitScore!0},
            unknown_score: ${aRule.unknownScore!0}
          });</#list>
          <#list all_rule_sets as aRuleSet> all_rule_sets.push({
            id: ${aRuleSet.id},
            name: '${aRuleSet.id}. ${aRuleSet.name}',
            period: '<#if aRuleSet.dateBegin??>${aRuleSet.dateBegin?string("yyyy-MM-dd")}</#if>'
            + '~<#if aRuleSet.dateEnd??>${aRuleSet.dateEnd?string("yyyy-MM-dd")}</#if>'
            + ' &nbsp;&nbsp;<#if aRuleSet.timeStart??>${aRuleSet.timeStart?string("HH:mm")}</#if>'
            + '~${aRuleSet.timeStopString!''}'
          });</#list>
        var rule_relations = [], rule_set_transtions = [];
          <#if ruleRelations??>
            <#list ruleRelations as rr> rule_relations.push({
              id: ${rr.ruleId},
              level: ${rr.level},
              hit: ${rr.hitChildRuleId},
              not_hit: ${rr.notHitChildRuleId},
              unknown: ${rr.unknownChildRuleId}
            });</#list>
          </#if>
          <#if ruleSetTransitions??>
            <#list ruleSetTransitions as trans> rule_set_transtions.push({
              min: ${trans.scoreMin},
              max: ${trans.scoreMax},
              dst: ${trans.dstSetID}
            });</#list>
          </#if>
        var show_mode = <#if show_mode??>true<#else>false</#if>;
      </script>

      <form id="rule-set-form" class="form-horizontal" role="form">
        <input type="hidden" id="id" name="id" value="<#if ruleSet.id??>${ruleSet.id}</#if>"/>
        <div class="form-group">
          <label class="col-sm-2 control-label">规则集名称</label>
          <div class="col-sm-9">
            <input type="text" class="form-control" id="name" name="name" required
              value="<#if ruleSet.name??>${ruleSet.name}</#if>">
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-2 control-label">规则集类型</label>
          <div class="col-sm-3">
            <select class="form-control" id="type" name="type" required>
              <#list rule_set_types as type>
                <option value="${type}" <#if ruleSet.type??>
                  <#if ruleSet.type == type>selected</#if></#if>>${type.text}</option>
              </#list>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-2 control-label">规则执行流程</label>
          <div class="col-sm-9 rule-tree-box" id="rule-tree-box">
          <#--规则树div-->
            <div class="rule" level="0">
              <div class="row">
                <div class="col-sm-3">
                  <select class="form-control select2 rule-select" style="width: 100%;">
                    <option value="">请选择规则</option>
                  </select>
                </div>
                <button action="add-one-rule" type="button" class="btn btn-primary btn-sm">添加规则</button>
                <button action="cancel-one-rule" type="button" class="btn btn-default btn-sm">取消添加</button>
              </div>
              <ul class="sub-rule-list" level="" parent="">
              </ul>
            </div>
            <script id="sub-rule-template" type="text/template">
              <li class="rule" parent-result="<%= type %>" level="<%= level %>" parent="<%= parent %>">
                <div class="row">
                  <span class="form-control-static"><%= type_name %></span>
                  <div class="col-sm-3">
                    <select class="form-control select2 rule-select" style="width: 100%;">
                      <option value="">请选择规则</option>
                    </select>
                  </div>
                  <button action="add-one-rule" type="button" class="btn btn-primary btn-sm">
                    添加规则
                  </button>
                  <button action="cancel-one-rule" type="button" class="btn btn-default btn-sm">
                    取消添加
                  </button>
                </div>
                <ul class="sub-rule-list"></ul>
              </li>
            </script>
            <div class="clearfix">
              <div id="tree"></div>
            </div>
          </div>
          <div class="col-sm-9 rule-priority-list-box" id="rule-priority-list-box">
          <#--规则优先级列表div-->
            <div class="clearfix">
              <button id="add-one-priority-rule" type="button" class="btn btn-primary btn-sm">添加规则</button>
            </div>
            <ol class="rule-priority-list" id="rule-priority-list">
            </ol>
            <script id="rule-priority-li-template" type="text/template">
              <li class="priority-rule" level="<%= level %>">
                <div class="row">
                  <div class="col-sm-3">
                    <select class="form-control select2 rule-select" style="width: 100%;">
                      <option value="">请选择规则</option>
                    </select>
                  </div>
                  <button action="remove-one-priority-rule" type="button" class="btn btn-danger btn-sm">
                    删除
                  </button>
                  <span class="btn-group">
                    <button action="move-up-one-priority-rule" type="button" class="btn btn-default btn-sm">
                      <i class="fa fa-long-arrow-up"></i>
                    </button>
                    <button action="move-down-one-priority-rule" type="button" class="btn btn-default btn-sm">
                      <i class="fa fa-long-arrow-down"></i>
                    </button>
                  </span>
                </div>
              </li>
            </script>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-2 control-label">规则集执行结束条件</label>
          <div class="col-sm-9">
            <div class="row">
              <label class="col-sm-3 control-label">REFUSE, 拒绝</label>
              <div class="col-sm-3">
                <input type="number" min="0" max="" class="form-control" id="refuseScoreMin"
                  name="refuseScoreMin" placeholder=""
                  value="<#if ruleSet.refuseScoreMin??>${ruleSet.refuseScoreMin}</#if>">
              </div>
              <div class="col-sm-3">
                <input type="number" min="0" max="" class="form-control" id="refuseScoreMax"
                  name="refuseScoreMax" placeholder=""
                  value="<#if ruleSet.refuseScoreMax??>${ruleSet.refuseScoreMax}</#if>">
              </div>
            </div>
            <div class="row">
              <label class="col-sm-3 control-label">PASS, 通过</label>
              <div class="col-sm-3">
                <input type="number" min="0" max="" class="form-control" id="passScoreMin"
                  name="passScoreMin" placeholder=""
                  value="<#if ruleSet.passScoreMin??>${ruleSet.passScoreMin}</#if>">
              </div>
              <div class="col-sm-3">
                <input type="number" min="0" max="" class="form-control" id="passScoreMax"
                  name="passScoreMax" placeholder=""
                  value="<#if ruleSet.passScoreMax??>${ruleSet.passScoreMax}</#if>">
              </div>
            </div>
            <div class="row">
              <label class="col-sm-3 control-label">HINT, 存在风险项</label>
              <div class="col-sm-3">
                <input type="number" min="0" max="" class="form-control" id="hintScoreMin"
                  name="hintScoreMin" placeholder=""
                  value="<#if ruleSet.hintScoreMin??>${ruleSet.hintScoreMin}</#if>">
              </div>
              <div class="col-sm-3">
                <input type="number" min="0" max="" class="form-control" id="hintScoreMax"
                  name="hintScoreMax" placeholder=""
                  value="<#if ruleSet.hintScoreMax??>${ruleSet.hintScoreMax}</#if>">
              </div>
            </div>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-2 control-label">规则集执行跳转条件</label>
          <div class="col-sm-9">
            <div class="clearfix">
              <button id="add-one-transition" type="button" class="btn btn-primary btn-sm">添加规则集跳转</button>
            </div>
            <div class="clearfix transition-list-box" id="transition-list-box">
            </div>
            <script id="transition-row-template" type="text/template">
              <div class="row rule-set-transition">
                <div class="col-sm-2">
                  <input type="number" min="0" max="" class="form-control"
                    name="scoreMin" required placeholder="">
                </div>
                <div class="col-sm-2">
                  <input type="number" min="0" max="" class="form-control"
                    name="scoreMax" required placeholder="">
                </div>
                <div class="col-sm-3">
                  <select class="form-control select2 rule-set-select" required style="width: 100%;">
                    <option value="">请选择规则集</option>
                  </select>
                </div>
                <button action="remove-transition" type="button" class="btn btn-danger btn-sm">删除</button>
                <div class="horizontal-spacer-10px"></div>
                <span class="text-danger period-area form-control-static"></span>
              </div>
            </script>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-2 control-label">执行时间段</label>
          <div class="col-sm-3">
            <input type="text" class="form-control timepicker" id="timeStart" name="timeStart"
              placeholder="HH:MM" required
              value="<#if ruleSet.timeStart??>${ruleSet.timeStart?string("HH:mm")}</#if>">
          </div>
          <div class="col-sm-3">
            <input type="text" class="form-control timepicker" id="timeStop" name="timeStop"
              placeholder="HH:MM" required
              value="${ruleSet.timeStopString!''}">
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-2 control-label">生效日期</label>
          <div class="col-sm-3">
            <input type="text" class="form-control datepicker" id="dateBegin" name="dateBegin"
              placeholder="yyyy-mm-dd" required
              value="<#if ruleSet.dateBegin??>${ruleSet.dateBegin?string("yyyy-MM-dd")}</#if>">
          </div>
          <div class="col-sm-3">
            <input type="text" class="form-control datepicker" id="dateEnd" name="dateEnd"
              placeholder="yyyy-mm-dd" required
              value="<#if ruleSet.dateEnd??>${ruleSet.dateEnd?string("yyyy-MM-dd")}</#if>">
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
  <!-- /.content -->
</div>
<!-- /.content-wrapper -->
</@_base.layout>
