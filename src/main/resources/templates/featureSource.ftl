<#import "_base.ftl" as _base>


<#assign m_script="
<script src='/js/feature-source/edit.js'></script>
">


<@_base.layout custom_script=m_script>

<!-- Content Wrapper. Contains page content -->
<div class="content-wrapper">
  <!-- Content Header (Page header) -->
  <section class="content-header">
    <h1>
      数据源 - <#if featureSource.id??>${featureSource.name}<#else>新建</#if>
    </h1>

  </section>

  <!-- Main content -->
  <section class="content container-fluid">
    <div class="box">
      <script>
        var feature_field_list = [];
          <#if featureFieldList??>
            <#list featureFieldList as field> feature_field_list.push({
              id: ${field.id},
              name: '${field.name}',
              type: '${field.type}',
              status: '${field.status}'
            });</#list>
          </#if>
      </script>
      <!-- form start -->
      <form id="createRule" role="form" class="form-horizontal">
        <div class="box-body">
          <input type="hidden" class="form-control" id="featureSourceId"
                value="<#if featureSource.id??>${featureSource.id}</#if>">
          <div class="form-group">
            <label for="featureSourceName" class="col-sm-2 control-label">数据源名称</label>
            <div class="col-sm-9">
              <input type="text" class="form-control" id="featureSourceName"
                    value="<#if featureSource.name??>${featureSource.name}</#if>" required>
            </div>
          </div>
          <div class="form-group">
            <label for="featureSourceUrl" class="col-sm-2 control-label">URL</label>
            <div class="col-sm-9">
              <input type="text" class="form-control" id="featureSourceUrl"
                    value="<#if featureSource.url??>${featureSource.url}</#if>" required>
            </div>
          </div>
          <div class="form-group">
            <label for="featureSourceMethod" class="col-sm-2 control-label">请求方法</label>
            <div class="col-sm-9">
              <input type="text" class="form-control" id="featureSourceMethod"
                    value="<#if featureSource.method??>${featureSource.method!""}</#if>" required>
            </div>
          </div>
          <div class="form-group">
            <label for="featureSourceParams" class="col-sm-2 control-label">请求参数</label>
            <div class="col-sm-9">
              <input type="text" class="form-control" id="featureSourceParams"
                    value="<#if featureSource.params??>${featureSource.params!""}</#if>">
            </div>
          </div>
          <div class="form-group">
            <label for="featureSourceSource" class="col-sm-2 control-label">来源</label>
            <div class="col-sm-9">
              <input type="text" class="form-control" id="featureSourceSource"
                    value="<#if featureSource.source??>${featureSource.source!""}</#if>" required>
            </div>
          </div>
          <div class="form-group">
            <label for="featureSourceChargeable" class="col-sm-2 control-label">是否付费</label>
            <div class="col-sm-9">
              <select id="featureSourceChargeable" class="form-control">
                <#if featureSource.chargeable?? && featureSource.chargeable == false>
                  <option selected>0</option>
                <#else>
                  <option>0</option>
                </#if>
                <#if featureSource.chargeable?? && featureSource.chargeable == true>
                  <option selected>1</option>
                <#else>
                  <option>1</option>
                </#if>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label for="featureSourceDescription" class="col-sm-2 control-label">描述</label>
            <div class="col-sm-9">
              <input type="text" class="form-control" id="featureSourceDescription"
                    value="<#if featureSource.description??>${featureSource.description!""}</#if>"
                    required>
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-2 control-label" class="col-sm-2 control-label">字段列表</label>
            <div class="col-sm-9">
              <div class="clearfix">
                <#--<button id="add-one-field" type="button" class="btn btn-primary btn-sm">添加字段</button>-->
              </div>
              <div class="clearfix field-list-box" id="field-list-box">
              </div>
              <script id="field-row-template" type="text/template">
                <div class="field-row form-inline">
                  <input type="hidden" name="f_id">
                  <label>名称</label>
                  <input class="form-control" type="text" size="20" name="f_name" required>
                  <label>类型</label>
                  <select class="form-control" name="f_type" required>
                    <#list fieldTypes as fieldType>
                      <option>${fieldType}</option>
                    </#list>
                  </select>
                  <label>状态</label>
                  <select class="form-control" name="f_status" required>
                    <option>ACTIVE</option>
                    <option>DEACTIVE</option>
                  </select>
                  <#--<button action="remove-field" type="button" class="btn btn-danger btn-sm">删除</button>-->
                </div>
              </script>
            </div>
          </div>
          <!-- /.box-body -->
          <div class="form-group">
            <div class="btns-box">
              <#--<button type="button" class="btn btn-default" data-toggle="modal" data-target="#confirm-cancel-source">取消-->
              <#--</button>-->
              <div class="modal fade" id="confirm-cancel-source">
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
                      <a href="/source/list">
                        <div class="btn btn-primary">确认</div>
                      </a>
                    </div>
                  </div>
                  <!-- /.modal-content -->
                </div>
                <!-- /.modal-dialog -->
              </div>
              <#--<button type="submit" class="btn btn-success">保存</button>-->
            </div>
          </div>
      </form>
     </div> 
  </section>
  <!-- /.content -->
</div>
<!-- /.content-wrapper -->
</@_base.layout>