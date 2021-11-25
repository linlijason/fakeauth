
function reject(submitId){
  var confirm = window.confirm("确定撤回该申请吗？");
  if (!confirm) return;
  $.ajax({
    type: 'POST',
    url: '/audit/launch-reject/' + submitId,
    success: function(data){
      if(!data || !data.ok){
        alert('操作失败')
      }
      location.href = "/audit/submit"
      alert('撤回成功')
    }
  })
}
$(function(){
  $.ajax({
    type: 'GET',
    url: '/audit/listLaunch',
    success: function(submitList){
      var submitListTable = []
      var type = {'RULE':'规则', 'RULE_SET':'规则集', 'EVENT':'事件'}
      var operationType = {'ADD':'新增', 'CHANGE':'编辑', 'DELETE':'删除'}
      _.each(submitList, function(data){
        var submitTableHtml = '<tr>'
          + '<td>' + data.id + '</td>'
          + '<td>' + (type[data.contentType]?type[data.contentType]:'') + '</td>'
          + '<td>' + (data.contentId?data.contentId:'') + '</td>'
          + '<td>' + (data.contentName?data.contentName:'') + '</td>'
          + '<td>' + (operationType[data.type]?operationType[data.type]:'') + '</td>'
          + '<td>' + (data.launchTime?moment(data.launchTime).format('YYYY-MM-DD HH:mm:ss'):'') + '</td>'
          + '<td>' + '<a href="javascript:showDetail(' + data.id + ')">详情</a>&nbsp;'
                   + (showCallBack?'<a id="callBack" href="javascript:reject(' + data.id + ')">撤回</a>':'') + '</td>'
          + '</tr>';
        submitListTable.push(submitTableHtml)
      });
      $('#launch-list').DataTable().destroy();
      $('#launch-list').find('tbody:last-child').empty().append(submitListTable)
      $('#launch-list').DataTable({
        'paging'      : true,
        'pageLength'  : 100,
        'lengthChange': false,
        'order'       : [[5,'asc']],
        'searching'   : false,
        'info'        : true,
        'autoWidth'   : false,
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