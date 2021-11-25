$(function(){
  var featureFieldRowTemplate = $("#feature-field-row-template").html();
  var $moreFeatureFieldsBox = $('#more-feature-fields-box');
  var exprJson = null;
  try {
    exprJson = expr_json_text ? $.parseJSON(expr_json_text) : null;
  } catch (e) {
    console.error('把规则条件转换为JSON失败');
  }
  //init
  if (typeof(show_mode) === 'boolean' && show_mode) {
    $('input, select').prop('readonly', true).prop('disabled', true).css('background-color', '#fff');
    $('#back').click(function(e){
      history.back();
    });
  }
  //render fields
  if (exprJson) {
    var isFirst = true;

    function renderFieldsByExprJson(eJson, lastLogicalOp){
      function innerListRender(eList, logicalOp, lastLogicalOp){
        $.each(eList, function(i, expr){
          renderFieldsByExprJson(expr, (i == 0) ? lastLogicalOp : logicalOp);
        });
      }

      if (eJson['or']) {
        innerListRender(eJson['or'], 'or', lastLogicalOp);
      } else if (eJson['and']) {
        innerListRender(eJson['and'], 'and', lastLogicalOp);
      } else {
        var $fieldRow = isFirst ? $('#feature-field-row-first') : actionAddFeatureField(null);
        $fieldRow.find('select[name=logicalOp]').val(lastLogicalOp);
        var $fsTag = $fieldRow.find('select[name=featureSourceId]');
        $fsTag.val(eJson['feature_source_id']);
        initFieldSelectTag($fsTag);
        $fieldRow.find('select[name=ruleFieldId]').val(eJson['field_id']);
        $fieldRow.find('select[name=ruleOperatorId]').val(eJson['operator_id']);
        $fieldRow.find('input[name=ruleThresholdValue]').val(eJson['threshold_value']);
        isFirst = false;
      }
    }

    renderFieldsByExprJson(exprJson, null);
  }

  // 把页面配置转换成'逻辑运算表达式json'结构
  function getExprJsonData(){
    function parseRowExpr($fieldRow){
      var $fsTag = $fieldRow.find('select[name=featureSourceId]'),
        fsName = $fsTag.find("option:selected").text().split('.')[1].trim();
      var $fieldTag = $fieldRow.find('select[name=ruleFieldId]'),
        fieldName = $fieldTag.find("option:selected").text().split('.')[1].split('(')[0].trim();
      var $opTag = $fieldRow.find('select[name=ruleOperatorId]'),
        opName = $opTag.find("option:selected").text().split('.')[1].trim();
      var $thresholdInput = $fieldRow.find('input[name=ruleThresholdValue]');
      return {
        'feature_source_id': $fsTag.val(),
        'feature_source_name': fsName,
        'field_id': $fieldTag.val(),
        'field_name': fieldName,
        'operator_id': $opTag.val(),
        'operator_name': opName,
        'threshold_value': $thresholdInput.val()
      }
    }

    var $featureFieldRowList = $('.feature-field-row');
    var fieldExprStack = [], logicalOpStack = [], exprTreeTrack = []; // 表达式树轨迹
    $featureFieldRowList.each(function(i, ele){
      //解析：fieldExpr压栈
      var $fieldRow = $(ele), newFieldExpr = parseRowExpr($fieldRow);
      var lastFieldExpr = _.last(fieldExprStack);
      fieldExprStack.push(newFieldExpr);
      //判断逻辑操作符，压栈
      var newLogicalOp = $fieldRow.find('select[name=logicalOp]').val();
      if (!newLogicalOp) {
        return
      }
      var lastLogicalOp = _.last(logicalOpStack);
      logicalOpStack.push(newLogicalOp);
      //处理exprTree
      var lastExprTree = _.last(exprTreeTrack);
      if (!lastExprTree) {
        //新的exprTree
        lastExprTree = {};
        lastExprTree[newLogicalOp] = [lastFieldExpr];
        exprTreeTrack.push(lastExprTree);
        return
      }
      if (lastLogicalOp == newLogicalOp) {
        _.values(lastExprTree)[0].push(lastFieldExpr);
        return
      }
      if (lastLogicalOp == 'or' && newLogicalOp == 'and') {
        // 创建一个更深的tree
        var newExprTree = {};
        newExprTree[newLogicalOp] = [lastFieldExpr];
        lastExprTree['or'].push(newExprTree);
        exprTreeTrack.push(newExprTree);
      } else if (lastLogicalOp == 'and' && newLogicalOp == 'or') {
        lastExprTree['and'].push(lastFieldExpr);
        //去exprTreeTrack的上一层
        exprTreeTrack.pop();
        var upperExprTree = _.last(exprTreeTrack);
        if (!upperExprTree) {
          upperExprTree = {};
          upperExprTree[newLogicalOp] = [lastExprTree];
          exprTreeTrack.push(upperExprTree);
        }
      }
    });
    // 处理返回
    var lastFieldExpr = _.last(fieldExprStack);
    if (fieldExprStack.length == 1) {
      return lastFieldExpr;
    }
    var lastExprTree = exprTreeTrack.pop();
    _.values(lastExprTree)[0].push(lastFieldExpr);
    while (_.last(exprTreeTrack)) {
      lastExprTree = exprTreeTrack.pop();
    }
    return lastExprTree;
  }

  //提交处理
  $("#createRule").submit(function(event){
    event.preventDefault();

    var formData = {};
    var ruleId = $("#ruleId").val();
    formData["name"] = $("#ruleName").val();
    formData["category"] = $("#ruleCategory").val();
    formData["expr_json_text"] = JSON.stringify(getExprJsonData());
    formData["hit_score"] = parseInt($("#ruleHitScore").val());
    formData["not_hit_score"] = parseInt($("#ruleNotHitScore").val());
    formData["unknown_score"] = parseInt($("#ruleUnknowScore").val());
    formData["description"] = $("#ruleDesc").val();

    $.ajax({
      type: "POST",
      url: "/rule/save/" + ruleId,
      data: JSON.stringify(formData),
      success: function(data2){
        if(data2["isAudit"]) {
          alert('提交审核成功')
          return location.href = "/audit/submit";
        } else {
          if (!data2["ruleId"]) {
            return alert(data2['message'] || "保存出错，请检查重试")
          }
          window.location.href = "/rule/" + data2["ruleId"];
        }
      },
      error: function(){
        alert("操作失败");
      },
      dataType: "json",
      contentType: "application/json"
    })
  });
  //选择数据源事件
  $('select[name=featureSourceId]').change(featureSourceChangeHandle);

  function featureSourceChangeHandle(e){
    initFieldSelectTag($(this))
  }

  function initFieldSelectTag($featureSourceTag){
    var $featureFieldRow = $featureSourceTag.closest('.feature-field-row');
    var $fieldSelectTag = $featureFieldRow.find('select[name=ruleFieldId]');
    $.ajax({
      dataType: "json",
      url: '/field/list/by/fs/' + $featureSourceTag.val(),
      async: false,
      success: function(fieldList){
        initSelectTag($fieldSelectTag, fieldList, '', 'id', function(item){
          return item['id'] + '. ' + item['name'] + '(' + item['description'] + ')'
        })
      }
    });
  }

  //添加字段行
  $('[action=add-feature-field]').click(actionAddFeatureField);

  function actionAddFeatureField(e){
    var $newFieldRow = $(featureFieldRowTemplate);
    $newFieldRow.find('select[name=featureSourceId]').change(featureSourceChangeHandle);
    $newFieldRow.find('[action=remove-feature-field]').click(actionRemoveFeatureField);
    $moreFeatureFieldsBox.append($newFieldRow);
    return $newFieldRow;
  }

  //删除字段行
  $('[action=remove-feature-field]').click(actionRemoveFeatureField);

  function actionRemoveFeatureField(e){
    $(this).closest('.feature-field-row').remove();
  }
});
