function deleteRule(ruleId){
  var confirm = window.confirm("你确定要删除这条规则吗?")
  if(!confirm) return
  $.ajax({
    type:"POST",
    url:"/rule/delete/" + ruleId,
    success: function(data){
      if(data.isAudit){
        alert('提交审核成功')
        location.href = "/audit/submit";
      } else {
        if(!data || !data.ok) {
          alert(data.message || '删除失败');
          return
        }
        location.href = "/rule/list";
        alert('删除成功')
      }
    },
    error: function(){
      alert('操作失败')
    }
  });
}
function filterGlobal () {
  $('#rule-list').DataTable().search(
    $('#global_filter').val()
  ).draw();
}
$(document).ready(function() {
  $('input#global_filter').on( 'keyup click', function () {
    filterGlobal();
  } );
} );
$(function(){
  $.ajax({
    type: 'GET',
    url: '/rule/listAll',
    success: function(ruleList){
      var ruleListTable = []
      _.each(ruleList, function(data){
        var ruleListHtml = '<tr>'
            + '<td>' + data.id + '</td>'
            + '<td>' + data.name + '</td>'
            + '<td>' + data.category + '</td>'
            + '<td>' + data.multiFieldsNames + '</td>'
            + '<td>' + data.hitScore + '</td>'
            + '<td>' + data.notHitScore + '</td>'
            + '<td>' + data.unknownScore + '</td>'
            + '<td>' + data.description + '</td>'
            + '<td>' + moment(data.dateCreated).format('YYYY-MM-DD HH:mm:ss') + '</td>'
            + '<td>' + '<a class = "btn btn-xs btn-primary" href="/rule/' + data.id + '">编辑</a>'
                     + '<a class = "btn btn-xs btn-danger" href="javascript:deleteRule(' + data.id + ');">删除</a>'
                     + '<a class = "btn btn-xs btn-primary" href="/rule/copy/' + data.id +'">复制</a>'
                     + '<a class = "btn btn-xs btn-info" href="/rule/show/' + data.id + '">查看</a>' + '</td>'
            + '</tr>';
        ruleListTable.push(ruleListHtml)
      });
      $('#rule-list').DataTable().destroy();
      $('#rule-list').find('tBody:last-child').empty().append(ruleListTable)
      $('#rule-list').DataTable({
        'dom':'ltip',
        'searching': true,
        'paging': true,
        'pageLength': 100,
        'lengthChange': false,
        'aoColumnDefs': [{'bSortable': false, "aTargets": [1,2,3,7,9]},{'targets':[9],'sWidth':'20%'}],
        'info': true,
        'autoWidth': false,
        'scrollX':true,
        'fixedColumns':{
          'leftColumns': 2,
          'rightColumns': 1
        },
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
  });
});

function export_excel(){
  var $dataTable = $('#rule-list').DataTable();
  var displayRows = $dataTable.context[0].aiDisplay;
  var allRows = $dataTable.context[0].aiDisplayMaster;
  var $hiddenExportA = $('#hiddenExportA');
  var ids = [];
  if (displayRows.length != allRows.length) {
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
