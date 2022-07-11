var ruleTreeData = null;
$(function(){
  var resultTypeNames = {
    'hit': "命中",
    'not_hit': "未命中",
    'unknown': "未知"
  };
  var TYPE_TREE = "TREE", TYPE_PRIORITY = "PRIORITY"; //val
  var $type = $('#type');
  var maxScore = 0;
  var getScoreErrorMsg = function(){
    return '分数请填写0-' + maxScore + '的整数，区间为闭区间，所有的分数范围应该构成0-' + maxScore + '的全集'
  };
  var $ruleTreeBox = $("#rule-tree-box");
  var subRuleTemplate = $("#sub-rule-template").html();
  var $rulePriorityListBox = $('#rule-priority-list-box');
  var $rulePriorityList = $('#rule-priority-list');
  var rulePriorityLiTemplate = $('#rule-priority-li-template').html();
  var $transitionListBox = $('#transition-list-box');
  var transitionRowTemplate = $("#transition-row-template").html();
  var changeRuleSetType = function(type){
    if (type == TYPE_TREE) {
      $rulePriorityListBox.hide();
      $ruleTreeBox.show();
    } else {
      $ruleTreeBox.hide();
      $rulePriorityListBox.show();
    }
  };
  var convRuleRelationsToTree = function(rule_relation_list){
    var level0 = _.find(rule_relation_list, function(rr){
      return rr.level == 0;
    });
    if (!level0) return;
    var findNextLevel = function(rr){
      var rule = all_rules_map[rr.id];
      rr.scores = [];
      rr.children = [];
      _.each(rule_result_types, function(type){
        rr.scores.push(rule[type + '_score']);
        var subRuleId = rr[type]; //不同结果后续rule ID
        if (!subRuleId) return;
        var subrr = _.find(rule_relation_list, function(tmp){
          return tmp.level == (rr.level + 1) && tmp.id == subRuleId && (!tmp.type);
        });
        if (!subrr) return;
        subrr['type'] = type; //表示：rr的type结果，后面是subrr
        rr.children.push(subrr);
        subrr.soFarScore = rr.soFarScore + rule[type + '_score'];
        findNextLevel(subrr);
      });
      rr.isLeaf = (rr.children.length == 0);
    };
    level0.soFarScore = 0;
    findNextLevel(level0);
    return level0;
  };

  function showRuleSetPeriod($ruleSetRow){
    var ruleSetId = $ruleSetRow.find('select').val();
    if (ruleSetId) {
      var obj = _.find(all_rule_sets, function(rs){
        return ruleSetId == rs.id;
      });
      $ruleSetRow.find('.period-area').html(obj.period);
    } else {
      $ruleSetRow.find('.period-area').html('');
    }
  }

  //初始化
  var all_rules_map = _.reduce(all_rules, function(result, rule){
    result[rule.id] = rule;
    return result
  }, {});
  (function(){
    var ruleSetType = $type.val();
    // console.log(ruleSetType);
    changeRuleSetType(ruleSetType);
    var $rule0 = $ruleTreeBox.find('.rule[level="0"]');
    var $rule0Select = $rule0.find('select');
    initSelectTag($rule0Select, all_rules, "请选择规则");
    var initRuleTreeDom = function(ruleNode, $rule){
      if (!ruleNode) return;
      var curRuleId = ruleNode.id;
      var $select = $rule.find('select');
      $select.val(ruleNode.id);
      $select.trigger('change');
      var curLevel = ruleNode.level, newLevel = parseInt(curLevel) + 1;
      var $subRuleList = $rule.find('.sub-rule-list').first();
      $subRuleList.attr("level", newLevel).attr('parent', curRuleId);
      if (ruleNode.children && ruleNode.children.length) {
        _.each(rule_result_types, function(type){
          var subRuleHtml = _.template(subRuleTemplate)({
            'type': type,
            'level': newLevel,
            'parent': curRuleId,
            'type_name': resultTypeNames[type]
          });
          var $subRule = $(subRuleHtml);
          //初始化sub rule
          initSelectTag($subRule.find('select'), all_rules, "请选择规则");
          var subRuleNode = _.find(ruleNode.children, function(tmp){
            return tmp.type == type;
          });
          if (subRuleNode) {
            initRuleTreeDom(subRuleNode, $subRule)
          }
          $subRuleList.append($subRule);
        });
      }
    };
    if (ruleSetType == TYPE_TREE) {
      var ruleRoot = convRuleRelationsToTree(rule_relations);
      ruleTreeData = ruleRoot;
      // console.log(ruleRoot);
      initRuleTreeDom(ruleRoot, $rule0);
    } else {
      _.find(rule_relations, function(rr){
        var $ruleLi = $(rulePriorityLiTemplate), $select = $ruleLi.find('select');
        initSelectTag($select, all_rules, "请选择规则");
        $select.val(rr.id);
        $select.trigger('change'); // select2 回显 需主动触发
        $rulePriorityList.append($ruleLi);
      });
    }
    //初始化规则集跳转信息
    _.each(rule_set_transtions, function(trans){
      var $transRow = $(transitionRowTemplate);
      var $select = $transRow.find('select');
      initSelectTag($select, all_rule_sets, "请选择规则集");
      $transRow.find('input[name="scoreMin"]').val(trans.min);
      $transRow.find('input[name="scoreMax"]').val(trans.max);
      $select.val(trans.dst);
      $select.trigger('change');
      showRuleSetPeriod($transRow);
      $transitionListBox.append($transRow);
    });
    //计算最大分数
     updateMaxScore(false);
  })();
  if (show_mode) {
    $('input, select').prop('readonly', true).prop('disabled', true).css('background-color', '#fff');
    $('button[action="add-one-rule"],button[action="cancel-one-rule"],#add-one-transition,' +
      'button[action="remove-transition"],#add-one-priority-rule,button[action="remove-one-priority-rule"],' +
      'button[action="move-up-one-priority-rule"],button[action="move-down-one-priority-rule"]').remove();
    //返回操作
    $('#back').click(function(e){
      history.back();
    });
  }
  //时间控件
  $('.timepicker').timepicker({
    timeFormat: 'H:i',
    show2400: true,
    interval: 1,
    step: 1,
    minTime: '00:00',
    maxTime: '24:00',
    startTime: '00:00',
    dynamic: false,
    dropdown: true,
    scrollbar: true
  });
  $('.datepicker').datepicker({
    language: 'zh-CN',
    format: 'yyyy-mm-dd'
  });
  var $timeStop = $('#timeStop');
  if ($timeStop.val() == '00:00') {
    $timeStop.val('24:00')
  }

  //保存操作
  function collectRuleList(){
    var ruleList = [];
    if ($type.val() == TYPE_TREE) {
      var $rules = $ruleTreeBox.find('.rule');
      $rules.each(function(){
        var $rule = $(this);
        var ruleId = $rule.find('select').val();
        if (!ruleId) return;
        var ruleObj = {'id': parseInt(ruleId), 'level': parseInt($rule.attr('level'))};
        var $subRuleList = $rule.find('.sub-rule-list').first();
        $subRuleList.children().each(function(){
          var $subRule = $(this);
          var subRuleId = $subRule.find('select').val();
          if (!subRuleId) return;
          var type = $subRule.attr('parent-result');
          ruleObj[type] = parseInt(subRuleId);
        });
        ruleList.push(ruleObj);
      });
    } else {
      var level = 0;
      $rulePriorityList.children().each(function(){
        var ruleId = $(this).find('select').val();
        if (!ruleId) return;
        ruleList.push({'id': ruleId, 'level': level});
        level += 1;
      });
    }
    return ruleList;
  }

  var collectRuleSetTransitions = function(){
    var transitions = [];
    $transitionListBox.children().each(function(){
      var $transRow = $(this);
      var scoreMin = $transRow.find('input[name="scoreMin"]').val();
      var scoreMax = $transRow.find('input[name="scoreMax"]').val();
      var dstRuleSet = $transRow.find('select').val();
      if (scoreMin && scoreMax && dstRuleSet) {
        transitions.push({'min': scoreMin, 'max': scoreMax, 'dst': dstRuleSet});
      }
    });
    return transitions;
  };
  var checkFormData = function(formData){
    if (formData.ruleList.length < 1) {
      alert("至少配置一个规则");
      return false;
    }
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
    _.each(formData.transitions, function(obj){
      scoreRangeList.push([parseInt(obj.min), parseInt(obj.max)]);
    });
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
    if (formData.timeStart == formData.timeStop || formData.timeStart > formData.timeStop) {
      alert("执行时间段两个时间点不能一样，且结束时间应该大于开始时间，请重新配置");
      return false;
    }
    if (formData.dateBegin > formData.dateEnd) {
      alert("请重新填写有效日期");
      return false;
    }
    return true;
  };
  $('#rule-set-form').submit(function(e){
    e.preventDefault();
    var formData = {};
    formData['id'] = $("#id").val();
    formData['name'] = $("#name").val();
    formData['type'] = $type.val();
    formData['refuseScoreMin'] = $("#refuseScoreMin").val();
    formData['refuseScoreMax'] = $("#refuseScoreMax").val();
    formData['passScoreMin'] = $("#passScoreMin").val();
    formData['passScoreMax'] = $("#passScoreMax").val();
    formData['hintScoreMin'] = $("#hintScoreMin").val();
    formData['hintScoreMax'] = $("#hintScoreMax").val();
    formData['timeStart'] = $("#timeStart").val();
    formData['timeStop'] = $("#timeStop").val();
    formData['dateBegin'] = $("#dateBegin").val();
    formData['dateEnd'] = $("#dateEnd").val();
    formData['ruleList'] = collectRuleList();
    formData['transitions'] = collectRuleSetTransitions();
    // console.log(formData);
    if (!checkFormData(formData)) {
      return false;
    }

    $.ajax({
      type: "POST",
      url: "/rule-set/save",
      data: JSON.stringify(formData),
      success: function(data){
        if(data.isAudit){
          alert('提交审核成功')
          location.href = "/audit/submit"
        } else {
          if (!data || !data.id) {
            alert(data.message || '保存失败');
            return;
          }
          location.href = "/rule-set/" + data['id'];
          alert('保存成功');
        }
      },
      error: function(){
        alert("保存失败");
      },
      dataType: "json",
      contentType: "application/json"
    });
    e.stopPropagation();
  });
  //规则集类型change事件
  $type.change(function(e){
    var type = $type.val();
    changeRuleSetType(type);
    if (type == TYPE_TREE) {
      var $rule = $ruleTreeBox.find('.rule[level="0"]');
      $rule.find('.sub-rule-list').first().empty();
      $rule.find('select').val('');
    }
    if (type == TYPE_PRIORITY) {
      $rulePriorityList.empty();
    }
    updateRuleTree();
  });
  //规则执行流程操作 - tree
  var actionAddOneTreeRule = function(e){
    e.preventDefault();
    var $rule = $(this).closest('.rule');
    var $select = $rule.find('select');
    var curRuleId = $select.val();
    if (!curRuleId) {
      alert("请选择一个规则");
      return;
    }
    var curLevel = $rule.attr('level');
    if (!curLevel) {
      curLevel = $rule.closest('ul').attr('level');
    }
    var $subRuleList = $rule.find('.sub-rule-list').first();
    var newLevel = parseInt(curLevel) + 1;
    $subRuleList.attr("level", newLevel).attr('parent', curRuleId);
    if ($subRuleList.children().length) {
      return; // 已经添加了
    }
    $.each(rule_result_types, function(i, type){
      var subRuleHtml = _.template(subRuleTemplate)({
        'type': type,
        'level': newLevel,
        'parent': curRuleId,
        'type_name': resultTypeNames[type]
      });
      var $subRule = $(subRuleHtml);
      //初始化sub rule
      $subRule.find('select.rule-select').change(ruleSelectChangeHandle);
      $subRule.find('[action="add-one-rule"]').click(actionAddOneTreeRule);
      $subRule.find('[action="cancel-one-rule"]').click(actionCancelOneTreeRule);
      initSelectTag($subRule.find('select'), all_rules, "请选择规则");
      $subRuleList.append($subRule);
    });
  };
  var actionCancelOneTreeRule = function(e){
    e.preventDefault();
    var $rule = $(this).closest('.rule');
    var $subRuleList = $rule.find('.sub-rule-list').first();
    if ($subRuleList.children().length) {
      var confirm = window.confirm("取消添加会清空下级所有规则，确定？");
      if (!confirm) return;
      $subRuleList.empty();
      updateMaxScore(true);
      updateRuleTree();
    }
  };
  var ruleSelectChangeHandle = function(e){
    var $rule = $(this).closest('.rule');
    var $select = $rule.find('select');
    var curRuleId = $select.val();
    if (curRuleId) {
      // 修改子节点的parent
      var $subRuleList = $rule.find('.sub-rule-list').first();
      $subRuleList.attr('parent', curRuleId);
      $subRuleList.children().each(function(){
        $(this).attr('parent', curRuleId);
      });
      // enable子节点操作
      var innerEnableSubRule = function($subRuleListNode){
        $subRuleListNode.children().each(function(){
          var $subRule = $(this);
          $subRule.children('div').find('select,button').prop('disabled', false);
          if ($subRule.find('select').first().val()) {
            innerEnableSubRule($subRule.find('.sub-rule-list').first())
          }
        });
      };
      innerEnableSubRule($subRuleList);
    } else {
      // disable子节点操作
      var $subRuleList = $rule.find('.sub-rule-list').first();
      $subRuleList.find('select,button').prop('disabled', true);
    }
    updateMaxScore(true);
    updateRuleTree();
  };
  $('select.rule-select').change(ruleSelectChangeHandle);
  $('[action="add-one-rule"]').click(actionAddOneTreeRule);
  $('[action="cancel-one-rule"]').click(actionCancelOneTreeRule);

  function updateRuleTree(){
    if ($type.val() != TYPE_TREE) {
      return;
    }
    var rrList = collectRuleList();
    var ruleTreeRoot = convRuleRelationsToTree(rrList);
    updateSvgTree(ruleTreeRoot);
  }

  function updateMaxScore(setValue){
    var rrList = collectRuleList();
    if ($type.val() == TYPE_TREE) {
      var ruleTreeRoot = convRuleRelationsToTree(rrList);
      var findMaxScore = function(node){ // 把id变成ruleId，新生成自增id
        if (!node) {
          return 0;
        }
        var nodeMaxScore = (_.max(node.scores) || 0) + node.soFarScore;
        if (node.children && node.children.length) {
          var subMaxScores = _.map(node.children, function(subNode){
            return findMaxScore(subNode);
          });
          var subMaxScore = _.max(subMaxScores);
          if (subMaxScore > nodeMaxScore) {
            nodeMaxScore = subMaxScore;
          }
        }
        return nodeMaxScore;
      };
      maxScore = findMaxScore(ruleTreeRoot);
    } else {
      maxScore = _.sumBy(rrList, function(rr){
        var rule = all_rules_map[rr.id];
        var ruleScores = _.map(rule_result_types, function(type){
          return rule[type + '_score'];
        });
        return _.max(ruleScores)
      });
    }
    console.log(maxScore);
    if(setValue){
      $('#refuseScoreMax').val(maxScore || '');
    }

  }

  //规则执行流程操作 - priority-list
  var actionRemoveOnePriorityRule = function(e){
    e.preventDefault();
    $(this).closest('.priority-rule').remove();
    updateMaxScore(true);
  };
  var actionMoveUpOnePriorityRule = function(e) {
    e.preventDefault();
    var $parent = $(this).closest('.priority-rule');
    $parent.prev().insertAfter($parent);
  }
  var actionMoveDownOnePriorityRule = function(e) {
    e.preventDefault();
    var $parent = $(this).closest('.priority-rule');
    $parent.next().insertBefore($parent);
  }
  $('#add-one-priority-rule').click(function(e){
    e.preventDefault();
    var $ruleLi = $(rulePriorityLiTemplate), $select = $ruleLi.find('select');
    initSelectTag($select, all_rules, "请选择规则");
    $select.change(ruleSelectChangeHandle);
    $ruleLi.find('[action="remove-one-priority-rule"]').click(actionRemoveOnePriorityRule);
    $rulePriorityList.append($ruleLi);
    $ruleLi.find('[action="move-up-one-priority-rule"]').click(actionMoveUpOnePriorityRule);
    $ruleLi.find('[action="move-down-one-priority-rule"]').click(actionMoveDownOnePriorityRule);
  });
  $('[action="remove-one-priority-rule"]').click(actionRemoveOnePriorityRule);
  $('[action="move-up-one-priority-rule"]').click(actionMoveUpOnePriorityRule);
  $('[action="move-down-one-priority-rule"]').click(actionMoveDownOnePriorityRule);

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

  //规则集跳转操作
  var changeRuleSetProcess = function(e){
    var $ruleSetRow = $(this).closest('.rule-set-transition');
    showRuleSetPeriod($ruleSetRow);
  };
  var actionRemoveOneTransition = function(e){
    e.preventDefault();
    $(this).closest('.rule-set-transition').remove();
  };
  $('#add-one-transition').click(function(e){
    e.preventDefault();
    var $transRow = $(transitionRowTemplate);
    initSelectTag($transRow.find('select'), all_rule_sets, "请选择规则集");
    $transRow.find('[action="remove-transition"]').click(actionRemoveOneTransition);
    $transRow.find('select').change(changeRuleSetProcess);
    $transRow.find('input').change(scoreInputChangeHandler);
    $transitionListBox.append($transRow);
  });
  $('[action="remove-transition"]').click(actionRemoveOneTransition);
  $('select.rule-set-select').change(changeRuleSetProcess);
  //取消操作
  $('#cancel').click(function(e){
    if (!window.confirm("是否取消？")) return;
    location.href = "/rule-set/list";
  });


  // rule tree in d3
  var d3_tree_height = 400; //px
  var margin = {top: 20, right: 20, bottom: 20, left: 30},
    width = 600 - margin.right - margin.left,
    height = d3_tree_height - margin.top - margin.bottom;
  var line_byte_size = 20; // 一行byte个数，决定text渲染宽度

  var i = 0, duration = 500, root;

  var tree = d3.layout.tree().size([height, width]);

  var diagonal = d3.svg.diagonal().projection(function(d){
    return [d.y, d.x];
  });

  var svg = d3.select("#tree").append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("class", "group")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  var svgBox = d3.select("svg");

  function updateSvgTree(ruleTreeRoot){
    // console.log(ruleTreeRoot);
    svg.selectAll('path.link').remove();
    svg.selectAll('g.node').remove();
    if (!ruleTreeRoot) {
      return;
    }
    i = 0;
    var reviseTreeId = function(node){ // 把id变成ruleId，新生成自增id
      node.ruleId = node.id;
      node.id = ++i;
      if (node.children && node.children.length) {
        _.each(node.children, function(subNode){
          reviseTreeId(subNode);
        })
      }
    };
    reviseTreeId(ruleTreeRoot);
    root = ruleTreeRoot;
    root.x0 = height / 2;
    root.y0 = 0;
    update(root);
    setTimeout(function(){ // fix size
      var rect = svg[0][0].getBoundingClientRect();
      if (svgBox.attr('width') < rect.width) {
        width = rect.width;
        svgBox.attr('width', width + margin.left + margin.right)
      }
      if (svgBox.attr('height') < rect.height) {
        height = rect.height;
        svgBox.attr('height', height + margin.bottom + margin.bottom)
      }
    }, 888);
  }

  updateSvgTree(ruleTreeData);

  d3.select(self.frameElement).style("height", d3_tree_height + "px");

  function update(source){
    if (!source) return;

    // Compute the new tree layout.
    var nodes = tree.nodes(root).reverse(),
      links = tree.links(nodes);

    // Normalize for fixed-depth.
    nodes.forEach(function(d){
      d.y = d.depth * 180;
    });

    // Update the nodes…
    var node = svg.selectAll("g.node").data(nodes, function(d){
      return d.id || (d.id = ++i);
    });

    // Enter any new nodes at the parent's previous position.
    var nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d){
        return "translate(" + source.y0 + "," + source.x0 + ")";
      });

    nodeEnter.append("circle")
      .attr("r", 1e-6)
      .style("fill", function(d){
        return d._children ? "#ccff99" : "#408eba";
      })
      .on("click", node_click);

    nodeEnter.append("text")
      .attr("class", "rule-name")
      .attr("x", function(d){
        return d.children || d._children ? -13 : 13;
      })
      .attr("dy", ".35em")
      .attr("text-anchor", function(d){
        if (d == root) {
          return "start";
        }
        return d.children || d._children ? "end" : "start";
      })
      .attr("transform", function(d){
        if (d == root && !d.isLeaf) { // root
          return "translate(-7, -30)";
        }
        if (d.children || d._children) { // 中间节点
          return ("translate(-10, " + (d.level & 1 ? -7 : -14) + ")")
        } else {
          var content = nodeContent(d); // leaf
          return (byteSize(content) > line_byte_size) ? "translate(10, -22)" : "";
        }
      })
      .html(function(d){
        var content = nodeContent(d);
        if (d.isLeaf) {
          return (byteSize(content) > line_byte_size) ? renderMultiLineTspan(content, line_byte_size) : content;
        }
        return renderMultiLineTspan(content, line_byte_size);
      })
      .style("fill-opacity", 1e-6)
      .on("click", function(d){
        $('.rule-name').attr('style', 'font-weight:normal');
        d3.select(this).attr('style', 'font-weight:bold');
        // jquery codes
        $('.rule select').css('border-color', ''); // reset all to old color
        // 防止同level同type上层rule id又相同的情况，需要逐层遍历
        var parents = [], tmp = d;
        while (tmp.parent) {
          parents.push(tmp.parent);
          tmp = tmp.parent;
        }
        var $rule = $('.rule[level="0"]');
        for (var k = parents.length - 2; k >= 0; k--) {
          tmp = parents[k];
          $rule = $rule.find('.sub-rule-list').first().children().filter('[parent-result="' + tmp.type + '"]');
        }
        if (d.type) {
          $rule = $rule.find('.sub-rule-list').first().children().filter('[parent-result="' + d.type + '"]');
        }
        $rule.find('select').first().css('border-color', "red"); // mark chosen select
      });

    // Transition nodes to their new position.
    var nodeUpdate = node.transition()
      .duration(duration)
      .attr("transform", function(d){
        return "translate(" + d.y + "," + d.x + ")";
      });

    nodeUpdate.select("circle")
      .attr("r", 10)
      .style("fill", function(d){
        return d._children ? "#ccff99" : "#408eba";
      });

    nodeUpdate.select("text").style("fill-opacity", 1);

    // Transition exiting nodes to the parent's new position.
    var nodeExit = node.exit().transition()
      .duration(duration)
      .attr("transform", function(d){
        return "translate(" + source.y + "," + source.x + ")";
      })
      .remove();

    nodeExit.select("circle").attr("r", 1e-6);

    nodeExit.select("text").style("fill-opacity", 1e-6);

    // Update the links…
    var link = svg.selectAll("path.link").data(links, function(d){
      return d.target.id;
    });

    // Enter any new links at the parent's previous position.
    link.enter().insert("path", "g")
      .attr("class", "link")
      .attr("d", function(d){
        var o = {x: source.x0, y: source.y0};
        return diagonal({source: o, target: o});
      });

    // Transition links to their new position.
    link.transition().duration(duration).attr("d", diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition()
      .duration(duration)
      .attr("d", function(d){
        var o = {x: source.x, y: source.y};
        return diagonal({source: o, target: o});
      })
      .remove();

    // Stash the old positions for transition.
    nodes.forEach(function(d){
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }

  // Toggle children on click.
  function node_click(d){
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
    update(d);
  }

  function nodeContent(d){
    var ruleName = all_rules_map[d.ruleId].name;
    var typePrefix = d.type ? (resultTypeNames[d.type] + ': ') : '';
    var scoreText = d.isLeaf ? ( '  [' + _.map(d.scores, function(s){
      return s + d.soFarScore
    }) + ']') : '';
    return typePrefix + ruleName + scoreText;
  }

  function byteSize(text){
    var i, k = 0, len = text.length;
    for (i = 0; i < len; i++) {
      if (text.charCodeAt(i) < 256) {
        k++;
      } else {
        k += 2;
      }
    }
    return k
  }

  function renderMultiLineTspan(text, wrapsize){
    var i = 0, p = 0, k = 0, len = text.length;
    var tspans = [];
    while (i < len) {
      if (text.charCodeAt(i) < 256) {
        k++;
      } else {
        k += 2;
      }
      if (k >= wrapsize) { // k可能==(wrapsize+1)
        tspans.push('<tspan x="0" dy="1.2em">' + text.substring(p, i + 1) + '</tspan>');
        k = 0;
        p = i + 1;
      }
      i++;
    }
    if (k > 0) {
      tspans.push('<tspan x="0" dy="1.2em">' + text.substring(p) + '</tspan>');
    }
    return tspans.join('');
  }
});
