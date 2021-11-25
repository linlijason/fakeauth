function deleteRuleSet(ruleSetId){
  var confirm = window.confirm("确定删除规则集吗?")
  if(!confirm) return;
    $.ajax({
      type: "POST",
      url: "/rule-set/delete/" + ruleSetId,
      success: function(data){
        if(data.isAudit){
          alert('提交审核成功')
          location.href = "/audit/submit";
        } else {
          if (!data || !data.ok) {
            alert(data.message || '删除失败');
            return;
          }
          location.href = "/rule-set/list";
          alert('删除成功');
        }
      },
      error: function(){
        alert("删除失败");
      }
    });
}
function filterGlobal () {
  $('#rule-set-list').DataTable().search(
    $('#global_filter').val()
  ).draw();
}
$(document).ready(function() {
  $('input.global_filter').on( 'keyup click', function () {
    filterGlobal();
  });
});
$(function(){
  $('[action="test"]').click(function(e){
    e.preventDefault();
    var $ruleSet = $(this).closest('tr');
    var ruleSetId = $ruleSet.attr('rulesetid');
    $.ajax({
      type: "POST",
      url: "/rule-set/test/" + ruleSetId,
      success: function(data){
        if (!data) {
          alert(data.message || '执行失败');
          return;
        }
        var list = data.list;
        var buf = [];
        buf.push('score: '+data.score);
        buf.push('status: '+data.status);
        _.each(list, function(item){
          var tmp = [];
          _.each(item, function(val, key){
            tmp.push(key + ': ' + val);
          });
          buf.push(tmp.join(',  '))
        });

        alert(buf.join('\n'));
      },
      error: function(){
        alert("执行失败");
      }
    });
  });
  //根据事件类型获取对应规则集
  $('select[name=eventType]').change(eventTypeChangeHandle);

  function eventTypeChangeHandle(e){
    getRuleSetByEventType($(this))
  }

  function getRuleSetByEventType($eventType){
    if($eventType.val() == "all"){
      $.ajax({
        type: 'GET',
        url: '/rule-set/listAll',
        success: function(ruleSetList){
          showCurrentRuleSet(ruleSetList)
        }
      });
    }else{
      $.ajax({
        dataType: "json",
        url: '/rule-set/list/by/event/' + $eventType.val(),
        success: function(ruleSetList){
          showCurrentRuleSet(ruleSetList)
        }
      });
    }
  }
  //获取所有规则集
  $.ajax({
    type: 'GET',
    url: '/rule-set/listAll',
    success: function(ruleSetList){
      showCurrentRuleSet(ruleSetList)
    }
  });
});
function showCurrentRuleSet(ruleSetList){
  var ruleSetListTable = []
  var map = {'PRIORITY':'普通规则集','TREE':'决策树规则集'}
  _.each(ruleSetList, function(data){
    var ruleSetHtml = '<tr>'
      + '<td>' + data.id + '</td>'
      + '<td>' + data.name + '</td>'
      + '<td>' + ((data.type == "PRIORITY")?map.PRIORITY : map.TREE) + '</td>'
      + '<td>' + moment(data.dateCreated).format('YYYY-MM-DD HH:mm:ss') +'</td>'
      + '<td>' + data.timeStart.substring(0,5) + '~' + data.timeStopString.substring(0,5) +'</td>'
      + '<td>' + moment(data.dateBegin).format('YYYY-MM-DD') + '~' + moment(data.dateStop).format('YYYY-MM-DD') +'</td>'
      + '<td>' + '<a class="btn btn-xs btn-primary" href="/rule-set/' + data.id +'">编辑</a>'
      + '<a class="btn btn-xs btn-danger" href="javascript:deleteRuleSet('+ data.id +');">删除</a>'
      + '<a class="btn btn-xs btn-primary" href="/rule-set/copy/' + data.id +'">复制</a>'
      + '<a class="btn btn-xs btn-info" href="/rule-set/show/'+ data.id +'">查看</a>' + '</td>'
      + '</tr>';
    ruleSetListTable.push(ruleSetHtml)
  });
  $('#rule-set-list').DataTable().destroy();
  $('#rule-set-list').find('tBody:last-child').empty().append(ruleSetListTable)
  $('#rule-set-list').DataTable({
    'dom':'ltip',
    'searching': true,
    'paging': true,
    'pageLength': 100,
    'lengthChange': false,
    'aoColumnDefs': [{'bSortable': false, "aTargets": [1,2,4,6]},{'targets':[6],'sWidth':'20%'}],
    'info': true,
    'autoWidth': false,
    'language': {
      'emptyTable':'未查询到数据',
      'zeroRecords':'未找到符合条件的数据',
      'info':'展示 _TOTAL_ 个条目中的 _START_ 到 _END_ 个',
      'infoEmpty':'展示 0 个条目中的 0 到 0 个',
      'infoFiltered':'',
      'paginate': {
        'next':       '下一页',
        'previous':   '上一页'
      }
    }
  });
}

function export_excel(){
  var $dataTable = $('#rule-set-list').DataTable();
  var displayRows = $dataTable.context[0].aiDisplay;
  var allRows = $dataTable.context[0].aiDisplayMaster;
  var $hiddenExportA = $('#hiddenExportA');
  var ids = [];
  if ($('select[name=eventType]').val() != "all" || displayRows.length != allRows.length) {
    if (displayRows.length == 0) {
      return alert('未查询到数据，请重新筛选！');
    }
    // 筛选
    var allIds = $dataTable.column(0).data();
    _.each(displayRows, function(iRow){
      ids.push(allIds[iRow])
    });
  }
  $('#ids').val(ids.join(','));
  $hiddenExportA[0].submit();
}
