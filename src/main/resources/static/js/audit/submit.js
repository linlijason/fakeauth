$(function(){
  $.ajax({
    type: 'GET',
    url: '/audit/listSubmit',
    success: function(submitList){
      var submitListTable = []
      var type = {'RULE':'规则', 'RULE_SET':'规则集', 'EVENT':'事件'}
      var operationType = {'ADD':'新增', 'CHANGE':'编辑', 'DELETE':'删除'}
      var status = {'TO_AUDIT':'待审核', 'TO_ONLINE':'待上线', 'REJECT':'驳回', 'LAUNCHING':'上线中', 'LAUNCHED':'上线成功', 'FAILED':'上线失败'}
      _.each(submitList, function(data){
        var submitTableHtml = '<tr>'
          + '<td>' + data.id + '</td>'
          + '<td>' + (type[data.contentType]?type[data.contentType]:'') + '</td>'
          + '<td>' + (data.contentId?data.contentId:'') + '</td>'
          + '<td>' + (data.contentName?data.contentName:'') + '</td>'
          + '<td>' + (operationType[data.type]?operationType[data.type]:'') + '</td>'
          + '<td>' + (data.launchTime?moment(data.launchTime).format('YYYY-MM-DD HH:mm:ss'):'') + '</td>'
          + '<td>' + (status[data.auditStatus]?status[data.auditStatus]:'') + '</td>'
          + '<td>' + '<a href="javascript:showDetail(' + data.id + ')">详情</a>' + '</td>'
          + '</tr>';
        submitListTable.push(submitTableHtml)
      });
      $('#submit-list').DataTable().destroy();
      $('#submit-list').find('tbody:last-child').empty().append(submitListTable)
      $('#submit-list').DataTable({
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