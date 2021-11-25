function acceptAudit(submitId){
  var confirm = window.confirm("确定批准该申请吗？");
  if (!confirm) return;
  var formData = {}
  formData["launchTime"] = $('#' + submitId).val()
  $.ajax({
    type: 'POST',
    url: '/audit/accept/' + submitId,
    data: JSON.stringify(formData),
    success: function(data){
      if(data["message"]){
        alert(data["message"])
      }
      if(!data || !data.ok){
        alert('操作失败')
        return
      }
      location.href = "/audit/launch"
      alert('审核通过')
    },
    dataType: "json",
    contentType: "application/json"
  });
}
function reject(submitId){
  var confirm = window.confirm("确定驳回该申请吗？");
  if (!confirm) return;
  $.ajax({
    type: 'POST',
    url: '/audit/review-reject/' + submitId,
    success: function(data){
      if(!data || !data.ok){
        return alert('操作失败')
      }
      location.reload();
      alert('驳回成功')
    }
  })
}
function chooseTime(){
  var DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';
  $('input[name="daterange"]').daterangepicker({
      singleDatePicker: true,
      timePicker: true,
      timePickerSeconds: true,
      timePicker24Hour: true,
      locale: {
        format: DATE_FORMAT,
        applyLabel: "确定",
        cancelLabel: "取消",
        daysOfWeek: DATE_LOCALE_CN.daysMin,
        monthNames: DATE_LOCALE_CN.monthsShort
      }
    });
}
$(function(){
  $.ajax({
    type: 'GET',
    url: '/audit/listReview',
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
          + '<td>' + '<input type="text" class="form-control" id=' + data.id + ' name="daterange" required placeholder="请选择预上线时间"/>' + '</td>'
          + '<td>' + '<a href="javascript:showDetail(' + data.id + ')">详情</a>&nbsp;'
                   + '<a href="javascript:acceptAudit(' + data.id + ')">批准</a>&nbsp;'
                   + '<a href="javascript:reject(' + data.id + ')">驳回</a>' + '</td>'
          + '</tr>';
        submitListTable.push(submitTableHtml)
      });
      $('#review-list').DataTable().destroy();
      $('#review-list').find('tbody:last-child').empty().append(submitListTable)
      $('#review-list').on('draw.dt', chooseTime)
      $('#review-list').DataTable({
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