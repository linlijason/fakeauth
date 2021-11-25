$(function(){
  $.ajax({
    type: 'GET',
    url: '/field/listAll',
    success: function(fieldList){
      var fieldListTable = []
      _.each(fieldList, function(data){
        var fieldListHtml = '<tr>'
            + '<td>' + data.id + '</td>'
            + '<td>' + data.featureSourceId + '. ' + data.featureSourceName + '</td>'
            + '<td>' + data.name + '</td>'
            + '<td>' + data.type + '</td>'
            + '<td>' + data.status + '</td>'
            + '<td>' + (data.description == null?"":data.description) + '</td>'
            + '<td>' + moment(data.dateCreated).format('YYYY-MM-DD HH:mm:ss')+ '</td>'
            + '<td>' + moment(data.dateModified).format('YYYY-MM-DD HH:mm:ss') + '</td>'
            + '</tr>';
        fieldListTable.push(fieldListHtml)
      });
      $('#rule-list').DataTable().destroy();
      $('#rule-list').find('tBody:last-child').empty().append(fieldListTable)
      $('#rule-list').DataTable({
        'paging': true,
        'pageLength': 100,
        'lengthChange': false,
        'searching': false,
        'aoColumnDefs': [{'bSortable': false, "aTargets": [2,3,4,5]}],
        'info': true,
        'autoWidth': false,
        'language': DATATABLE_LANG_CN
      });
    }
  });
});