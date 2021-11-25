<#import "_base.ftl" as _base>

<#assign m_script="
<script src='/js/rule/rule-edit.js'></script>
">

<@_base.layout custom_script=m_script>

<!-- Content Wrapper. Contains page content -->
<div class="content-wrapper">
  <!-- Content Header (Page header) -->
  <section class="content-header">
    <h1>编辑规则</h1>
  </section>

  <!-- Main content -->
  <section class="content container-fluid">
    <div class="box">
      <script>
        var show_mode = <#if show_mode??>true<#else>false</#if>;
        var expr_json_text = '<#if rule.exprJsonText??>${rule.exprJsonText?js_string}</#if>';
      </script>
      <!-- form start -->
      <form id="createRule" role="form" class="form-horizontal">
        <div class="box-body">
          <input type="hidden" class="form-control" id="ruleId" value="<#if rule.id??>${rule.id}</#if>" required>
          <div class="form-group">
            <label for="ruleName" class="col-sm-2 control-label">规则名称</label>
            <div class="col-sm-9">
              <input type="text" class="form-control" id="ruleName" value="<#if rule.name??>${rule.name}</#if>" required>
            </div>
          </div>
          <div class="form-group">
            <label for="ruleCategory" class="col-sm-2 control-label">规则类型</label>
            <div class="col-sm-9">
              <select class="form-control" id="ruleCategory">
                <#if rule.category?? && rule.category == "风险规则">
                  <option selected="selected">风险规则</option>
                <#else>
                  <option>风险规则</option>
                </#if>
                <#if rule.category?? && rule.category == "放行规则">
                  <option selected="selected">放行规则</option>
                <#else>
                  <option>放行规则</option>
                </#if>
                <#if rule.category?? && rule.category == "拒绝规则">
                  <option selected="selected">拒绝规则</option>
                <#else>
                  <option>拒绝规则</option>
                </#if>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label for="ruleCondition" class="col-sm-2 control-label">规则条件</label>
            <div class="col-sm-9 feature-fields-box" id="feature-fields-box">
              <div class="row feature-field-row" id="feature-field-row-first">
                <#--第一个feature-field-row，至少一个-->
                <div class="col-sm-1"><!--逻辑操作符占位--></div>
                <div class="col-sm-2">
                  <select class="form-control" name="featureSourceId" required>
                    <option value="">请选择数据源</option>
                    <#list featureSources as fs>
                      <option value="${fs.id}">${fs.id}. ${fs.name}</option>
                    </#list>
                  </select>
                </div>
                <div class="col-sm-3">
                  <select class="form-control" name="ruleFieldId" required>
                    <#--<#list fields as field>-->
                      <#--<option value="${field.id}. ${field.name}">${field.id}. ${field.name}(${field.description!""})</option>-->
                    <#--</#list>-->
                  </select>
                </div>
                <div class="col-sm-2">
                  <select class="form-control" name="ruleOperatorId" required>
                    <#list operators as operator>
                      <option value="${operator.id}">${operator.id}. ${operator.name}</option>
                    </#list>
                  </select>
                </div>
                <div class="col-sm-3">
                  <input type="text" class="form-control" name="ruleThresholdValue" required>
                </div>
                <div class="col-sm-1">
                  <button action="add-feature-field" type="button" class="btn btn-primary btn-sm">添加</button>
                </div>
              </div>
              <div class="more-feature-fields-box" id="more-feature-fields-box">
                <#--此处渲染还有逻辑操作符的字段-->
              </div>
              <script id="feature-field-row-template" type="text/template">
                <div class="row feature-field-row">
                  <div class="col-sm-1">
                    <select class="form-control" name="logicalOp" required>
                      <option>or</option>
                      <option>and</option>
                    </select>
                  </div>
                  <div class="col-sm-2">
                    <select class="form-control" name="featureSourceId" required>
                      <option value="">请选择数据源</option>
                      <#list featureSources as fs>
                        <option value="${fs.id}">${fs.id}. ${fs.name}</option>
                      </#list>
                    </select>
                  </div>
                  <div class="col-sm-3">
                    <select class="form-control" name="ruleFieldId" required>
                    </select>
                  </div>
                  <div class="col-sm-2">
                    <select class="form-control" name="ruleOperatorId" required>
                      <#list operators as operator>
                        <option value="${operator.id}">${operator.id}. ${operator.name}</option>
                      </#list>
                    </select>
                  </div>
                  <div class="col-sm-3">
                    <input type="text" class="form-control" name="ruleThresholdValue" required>
                  </div>
                  <div class="col-sm-1">
                    <button action="remove-feature-field" type="button" class="btn btn-danger btn-sm">删除</button>
                  </div>
                </div>
              </script>
            </div>

          </div>
          <div class="form-group">
            <label for="ruleName" class="col-sm-2 control-label">规则执行分</label>
            <div class="col-sm-9">
              <div class="row">
                <label class="col-sm-3 control-label">命中:</label>
                <div class="col-sm-9">
                  <input type="number" class="form-control" id="ruleHitScore" min="0" max="999" step="1" value="<#if rule.hitScore??>${rule.hitScore}</#if>" required>
                </div>
              </div>
              <div class="row">
                <label class="col-sm-3 control-label">未命中:</label>
                <div class="col-sm-9">

                  <input type="number" class="form-control" id="ruleNotHitScore" min="0" max="999" step="1" value="<#if rule.notHitScore??>${rule.notHitScore}</#if>" required>
                </div>
              </div>
              <div class="row">
                <label class="col-sm-3 control-label">未知:</label>
                <div class="col-sm-9">

                  <input type="number" class="form-control" id="ruleUnknowScore" min="0" max="999" step="1" value="<#if rule.unknownScore??>${rule.unknownScore}</#if>" required>
                </div>
              </div>
            </div>
          </div>

        </div>
        <div class="form-group">
          <label for="ruleDesc" class="col-sm-2 control-label">规则描述</label>
          <div class="col-sm-9">
            <input type="text" class="form-control" id="ruleDesc" value="<#if rule.description??>${rule.description}</#if>" required>
          </div>
        </div>
        <!-- /.box-body -->
        <div class="form-group">
          <div class="btns-box">
            <#if show_mode??>
              <button id="back" type="button" class="btn btn-default">返回</button>
            <#else>
              <button type="button" class="btn btn-default" data-toggle="modal" data-target="#confirm-cancel-rule">取消
              </button>
              <div class="modal fade" id="confirm-cancel-rule">
                <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header">
                      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span></button>
                      <h4 class="modal-title">取消</h4>
                    </div>
                    <div class="modal-body">
                      是否取消？
                    </div>
                    <div class="modal-footer">
                      <a href="/rule/list">
                        <div class="btn btn-primary">确认</div>
                      </a>
                    </div>
                  </div>
                  <!-- /.modal-content -->
                </div>
                <!-- /.modal-dialog -->
              </div>
              <button type="submit" class="btn btn-success">保存</button>
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