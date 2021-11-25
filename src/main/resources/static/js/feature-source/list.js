function deleteFeatureSource(featureSourceId){
  var confirm = window.confirm("你确定要删除这个数据源吗？")
  if(!confirm) return
  $.ajax({
    type:"POST",
    url:"/source/delete/" + featureSourceId,
    success: function(data){
      // FIXME
    },
    error: function(){
      alert('删除失败')
    }
  });
}
$(function(){
  $.ajax({
    type: 'GET',
    url: '/source/listAll',
    success: function(featureSourceList){
      var featureSourceListTable = []
      _.each(featureSourceList, function(data){
        var featureSourceHtml = '<tr>'
            + '<td>' + data.id + '</td>'
            + '<td>' + data.name + '</td>'
            + '<td>' + data.url + '</td>'
            + '<td>' + (data.method == null?"":data.method) + '</td>'
            + '<td>' + (data.source == null?"":data.source) + '</td>'
            + '<td>' + (data.params == null?"":data.params) +'</td>'
            + '<td>' + (data.description == null?"":data.description) + '</td>'
            + '<td>' + moment(data.dateCreated).format('YYYY-MM-DD HH:mm') + '</td>'
            + '<td>' + '<a class="btn btn-xs btn-primary" href="/source/' + data.id + '">查看</a></td>'
            + '</tr>';
        featureSourceListTable.push(featureSourceHtml)
      });
      $('#rule-list').DataTable().destroy();
      $('#rule-list').find('tBody:last-child').empty().append(featureSourceListTable)
      $('#rule-list').DataTable({
        'paging': true,
        'pageLength': 100,
        'lengthChange': false,
        'searching': false,
        'aoColumnDefs': [{'bSortable': false, "aTargets": [1,2,3,4,5,6,8]},{'targets':[8],'sWidth':'20%'}],
        'info': true,
        'autoWidth': false,
        'language': DATATABLE_LANG_CN
      });
    }
  });
});