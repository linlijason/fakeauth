$(function(){
  var $ruleSetListBox = $("#rule-set-list-box");
  var ruleSetRowTemplate = $("#rule-set-row-template").html();
  var maxScore = 0;
  var getScoreErrorMsg = function(){
    return '分数请填写0-' + maxScore + '的整数，区间为闭区间，所有的分数范围应该构成0-' + maxScore + '的全集'
  };

  /**
   * 显示规则集，启用周期、分值范围等提示信息
   */
  function showRuleSetPeriod($ruleSetRow){
    var ruleSetId = $ruleSetRow.find('select').val();
    if (ruleSetId) {
      var obj = _.find(all_rule_sets, function(rs){
        return ruleSetId == rs.id;
      });
      // 增加预览按钮
      var button = '<button action="preview-rule-set" type="button" class="btn btn-default btn-sm" data-toggle="modal" data-target="#preview-rule-set" data-id="'+ obj.id +'">\n' +
          '<i data-id="'+ obj.id +'" class="fa fa-eye"></i>\n' +
          '</button>';
      $ruleSetRow.find('.period-area').html(button + '&nbsp;' + obj.period + '&nbsp;&nbsp;&nbsp;' + '[0, ' + obj.maxScore + ']');
    } else {
      $ruleSetRow.find('.period-area').html('');
    }
  }

  function hideScoresCfg(){
    $('.scores-operator-cfg').hide().find('input').prop('disabled', true);
  }

  function showScoresCfg(){
    $('.scores-operator-cfg').show().find('input').prop('disabled', false);
  }

  //初始化
  var all_rule_sets_map = _.reduce(all_rule_sets, function(cache, rs){
    cache[rs.id] = rs;
    return cache
  }, {});
  (function(){
    //初始化规则集列表
    _.each(rule_set_relations, function(ruleSet){
      var $ruleSetRow = $(ruleSetRowTemplate);
      initSelectTag($ruleSetRow.find('select'), all_rule_sets, "请选择规则集");
      $ruleSetRow.find('select').val(ruleSet.ruleSetId);
      showRuleSetPeriod($ruleSetRow);
      $ruleSetListBox.append($ruleSetRow);
      $ruleSetListBox.find('.select2').trigger('change'); // select2 回县 需主动触发
    });
    if (rule_set_relations.length <= 1) {
      hideScoresCfg();
    }
    //计算最大分数
    updateMaxScore();
  })();
  if (show_mode) {
    $('input, select').prop('readonly', true).prop('disabled', true).css('background-color', '#fdfffb');
    $('#add-one-rule-set, button[action="remove-rule-set"]').remove();
  }

  //保存操作
  function collectRuleSets(){
    var ruleSets = [];
    $ruleSetListBox.children().each(function(){
      var $row = $(this);
      var ruleSetId = $row.find('select').val();
      if (!ruleSetId) {
        return;
      }
      var exists = _.find(ruleSets, function(obj){
        return obj.ruleSetId == ruleSetId;
      });
      if (!exists) {
        ruleSets.push({'ruleSetId': ruleSetId});
      }
    });
    return ruleSets;
  };
  var checkFormData = function(formData){
    var cfgRuleSetList = formData.ruleSets;
    if (cfgRuleSetList.length == 0) {
      alert("必须添加规则集配置")
      return false;
    }
    if (cfgRuleSetList.length < $ruleSetListBox.children().length) {
      alert("规则集配置重复，请检查！");
      return false;
    }
    // if (cfgRuleSetList.length >= 2) {
      var scoreRangeList = [];
      if (formData.refuseScoreMin && formData.refuseScoreMax) {
        scoreRangeList.push([parseInt(formData.refuseScoreMin), parseInt(formData.refuseScoreMax)]);
      } else {
        formData.refuseScoreMin = ''; // 不提交到服务端
        formData.refuseScoreMax = ''; // 不提交到服务端
      }
      if (formData.passScoreMin && formData.passScoreMax) {
        scoreRangeList.push([parseInt(formData.passScoreMin), parseInt(formData.passScoreMax)]);
      } else {
        formData.passScoreMin = ''; // 不提交到服务端
        formData.passScoreMax = ''; // 不提交到服务端
      }
      if (formData.hintScoreMin && formData.hintScoreMax) {
        scoreRangeList.push([parseInt(formData.hintScoreMin), parseInt(formData.hintScoreMax)]);
      } else {
        formData.hintScoreMin = ''; // 不提交到服务端
        formData.hintScoreMax = ''; // 不提交到服务端
      }
      if (scoreRangeList.length < 2) {
        return alert("必须填写至少有两个分范围")
      }
      var rangeError = false;
      _.each(scoreRangeList, function(range){
        if (range[0] < 0 || range[0] > maxScore || range[1] < 0 || range[1] > maxScore || range[0] > range[1]) {
          rangeError = true;
          alert(getScoreErrorMsg());
          return false;
        }
      });
      if (rangeError) {
        return false;
      }
      // 排序分值范围
      scoreRangeList = _.sortBy(scoreRangeList, function(range){
        return range[0]
      });
      if (scoreRangeList[0][0] != 0) { // 检测分值范围最小值
        alert(getScoreErrorMsg());
        return false;
      }
      for (var i = 0; i < scoreRangeList.length - 1; i++) {
        var prevRange = scoreRangeList[i], nextRange = scoreRangeList[i + 1];
        var rangeGap = nextRange[0] - prevRange[1];
        if (rangeGap != 1) { // 检测两个相邻分值范围间隔
          alert(getScoreErrorMsg());
          return false;
        }
      }
      if (scoreRangeList[scoreRangeList.length - 1][1] != maxScore) { // 检测分值范围最大值
        alert(getScoreErrorMsg());
        return false;
      }
    // }
    return true;
  };
  $('#event-form').submit(function(e){
    e.preventDefault();
    var formData = {};
    formData['id'] = $("#id").val();
    formData['name'] = $("#name").val();
    formData['eventType'] = $("#eventType").val();
    formData['appType'] = $("#appType").val();
    formData['ruleSets'] = collectRuleSets();
    if ($ruleSetListBox.children().length >= 2) {
      formData['scoreOperator'] = $('input[type="radio"][name="scoreOperator"]:checked').val();
    }
    formData['refuseScoreMin'] = $("#refuseScoreMin").val();
    formData['refuseScoreMax'] = $("#refuseScoreMax").val();
    formData['passScoreMin'] = $("#passScoreMin").val();
    formData['passScoreMax'] = $("#passScoreMax").val();
    formData['hintScoreMin'] = $("#hintScoreMin").val();
    formData['hintScoreMax'] = $("#hintScoreMax").val();
    // return console.log(formData);
    if (!checkFormData(formData)) {
      return false;
    }

    $.ajax({
      type: "POST",
      url: "/event/save",
      data: JSON.stringify(formData),
      success: function(data){
        if(data.isAudit) {
          alert('提交审核成功');
          location.href = "/audit/submit";
        } else {
          if (!data || !data.id) {
            alert(data.message || '保存失败');
            return;
          }
          location.href = "/event/" + data['id'];
          alert('保存成功');
        }
      },
      error: function(){
        alert("操作失败");
      },
      dataType: "json",
      contentType: "application/json"
    });
    e.stopPropagation();
  });

  //规则集操作
  var changeRuleSetProcess = function(e){
    var $ruleSetRow = $(this).closest('.rule-set');
    showRuleSetPeriod($ruleSetRow);
    updateMaxScore();
    // 查找重复
    $('.rule-set-select').css('border-color', '');
    var ruleSetId = $ruleSetRow.find('select').val();
    var $sameSelecteds = [];
    $('.rule-set-select').each(function(i, ele){
      var $ele = $(ele);
      if ($ele.val() == ruleSetId) {
        $sameSelecteds.push($ele);
      }
    });
    if ($sameSelecteds.length > 1) {
      $.each($sameSelecteds, function(i, $ele){
        $ele.css('border-color', 'red');
      })
    }
  };
  var actionRemoveOneRuleSet = function(e){
    e.preventDefault();
    $(this).closest('.rule-set').remove();
    if ($ruleSetListBox.children().length <= 1) {
      hideScoresCfg();
    }
  };
  $('#add-one-rule-set').click(function(e){
    e.preventDefault();
    var $ruleSetRow = $(ruleSetRowTemplate);
    initSelectTag($ruleSetRow.find('select'), all_rule_sets, "请选择规则集");
    $ruleSetRow.find('[action="remove-rule-set"]').click(actionRemoveOneRuleSet);
    $ruleSetRow.find('select').change(changeRuleSetProcess);
    $ruleSetListBox.append($ruleSetRow);
    if ($ruleSetListBox.children().length >= 2) {
      showScoresCfg();
    } else {
      hideScoresCfg();
    }
  });
  $('[action="remove-rule-set"]').click(actionRemoveOneRuleSet);
  $('select.rule-set-select').change(changeRuleSetProcess);

  var scoreOperatorChangedHandler = function(){
    updateMaxScore();
    // $('input[type=number]').each(function(){
    //   if (maxScore && this.value > maxScore) {
    //     this.value = maxScore;
    //   }
    // })
  };
  $('input[type="radio"][name="scoreOperator"]').change(scoreOperatorChangedHandler);

  function updateMaxScore(){
    var rsList = collectRuleSets();
    if (rsList.length == 0) {
      return maxScore = 0
    }
    if (rsList.length == 1) {
      maxScore = all_rule_sets_map[parseInt(rsList[0].ruleSetId)].maxScore;
      return console.log(maxScore)
    }
    // 因为是大分拒绝，maxScore是ruleSet.refuseScoreMax
    var ruleSetScores = _.map(rsList, function(rs){
      return all_rule_sets_map[parseInt(rs.ruleSetId)].maxScore;
    });
    var scoreOperator = $('input[type="radio"][name="scoreOperator"]:checked').val();
    if (!scoreOperator) {
      return;
    }
    if (scoreOperator == 'MAX') {
      maxScore = _.max(ruleSetScores)
    }
    if (scoreOperator == 'MIN') {
      maxScore = _.min(ruleSetScores)
    }
    if (scoreOperator == 'SUM') {
      maxScore = _.sum(ruleSetScores)
    }
    if (scoreOperator == 'AVERAGE') {
      maxScore = parseInt(_.sum(ruleSetScores) / rsList.length)
    }
    console.log(maxScore);
  }

  function scoreInputChangeHandler(){
    var score = this.value;
    if (score == null || score == '') {
      return
    }
    if (!maxScore) {
      if (score < 0) {
        this.value = 0;
      }
      return;
    }
    if (score < 0 || score > maxScore) {
      if (score < 0) {
        this.value = 0;
      }
      if (score > maxScore) {
        this.value = maxScore;
      }
      alert(getScoreErrorMsg());
      return false;
    }
  }

  $('input[type=number]').change(scoreInputChangeHandler);


  // 预览规则集
  function previewRuleSet(id) {
    $.ajax({
      type: 'GET',
      contentType: 'application/json',
      url: '/rule-set/show/' + id + '/json',
      success: function(data) {
        $('#tree').empty()
        var ruleSetType = data.ruleSet.type
        if (ruleSetType === 'PRIORITY') {
          showRuleSetList(data)
        } else if (ruleSetType === 'TREE') {
          showRuleSetTree(data)
        }
      },
      error: function() {
        alert('获取数据失败');
      }
    });
  };

  $('#rule-set-list-box').click(function(e) {
    var id = $(e.target).attr('data-id');
    if (id) {
      previewRuleSet(id);
    }
  });

  //取消操作
  $('#cancel').click(function(e){
    if (!window.confirm("是否取消？")) return;
    location.href = "/event/list";
  });
  //返回操作
  $('#back').click(function(e){
    history.back();
  });

  // 预览规则集 - 普通规则集
  function showRuleSetList(data) {
    var lis = ''
    data.rules.forEach((item) => {
      lis += `<li>${item.id}.${item.name}</li>`
    })
    var html = `
      <ol class="rule-set-list">
        ${lis}
      </ol>
    `
    $('#tree').append(html)
  }
});
