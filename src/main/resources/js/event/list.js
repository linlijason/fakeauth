function deleteEvent(eventID){
    var confirm = window.confirm("确定删除事件吗？");
    if (!confirm) return;
    var eventId = eventID;
    $.ajax({
      type: "POST",
      url: "/event/delete/" + eventId,
      success: function(data){
        if(data.isAudit) {
          alert('提交审核成功');
          location.href = "/audit/submit";
        } else {
          if (!data || !data.ok) {
            alert(data.message || '删除失败');
            return;
          }
          location.href = "/event/list";
          alert('删除成功');
        }
      },
      error: function(){
        alert("删除失败");
      }
    });
}
$(function(){
  $('[action="test"]').click(function(e){
    e.preventDefault();
    var $ruleSet = $(this).closest('tr');
    var eventid = $ruleSet.attr('eventid');
    $.ajax({
      type: "POST",
      url: "/event/test/" + eventid,
      success: function(data){
        if (!data) {
          alert(data.message || '执行失败');
          return;
        }
        alert('执行成功');
      },
      error: function(){
        alert("执行失败");
      }
    });
  });
  $.ajax({
      type: 'GET',
      url: '/event/listEvent',
      success: function(eventList){
          var eventListTable = []
          _.each(eventList, function(data){
              var eventTableHtml = '<tr>'
                  + '<td>' + data.id + '</td>'
                  + '<td>' + data.name + '</td>'
                  + '<td>' + data.eventType.name + '</td>'
                  + '<td>' + data.appType.name + '</td>'
                  + '<td>' + moment(data.dateCreated).format('YYYY-MM-DD HH:mm:ss') + '</td>'
                  + '<td>'
                          + '<a class="btn btn-xs btn-primary" href="/event/'+ data.id+'">编辑</a>'
                          + '<a class="btn btn-xs btn-danger" href="javascript:deleteEvent('+ data.id +')">删除</a>'
                          + '<a class="btn btn-xs btn-info" href="/event/show/'+ data.id +'">查看</a>' + '</td>'
                  + '</tr>';
              eventListTable.push(eventTableHtml)
          });
          $('#event-list').DataTable().destroy();
          $('#event-list').find('tBody:last-child').empty().append(eventListTable)
          $('#event-list').DataTable({
            'paging'      : true,
            'pageLength'  : 100,
            'lengthChange': false,
            'searching'   : false,
            'aoColumnDefs': [{'bSortable': false, "aTargets": [1,2,3,5]},{'targets':[5],'sWidth':'20%'}],
            'info'        : true,
            'autoWidth'   : false,
            "language": DATATABLE_LANG_CN
          });
      }
  })
});
