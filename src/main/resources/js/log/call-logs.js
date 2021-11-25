$('#daterange-btn').daterangepicker(
  {
    ranges: {
      '今天': [moment(), moment()],
      '昨天': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
      '最近7天': [moment().subtract(6, 'days'), moment()],
      '最近30天': [moment().subtract(29, 'days'), moment()],
      '这个月': [moment().startOf('month'), moment().endOf('month')],
      '上个月': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
    },
    startDate: moment().subtract(6, 'days'),
    endDate: moment(),
    maxDate: moment(),
    autoUpdateInput: false,
    locale: {
      applyLabel: "确定",
      cancelLabel: "取消",
      customRangeLabel: "自定义",
      daysOfWeek: DATE_LOCALE_CN.daysMin,
      monthNames: DATE_LOCALE_CN.monthsShort
    }
  }
);
$('#daterange-btn').on('apply.daterangepicker', function(ev, picker) {
  $('#daterange-btn span').html(picker.startDate.format('YYYY-MM-DD HH:mm:ss') + ' - ' + picker.endDate.format('YYYY-MM-DD HH:mm:ss'))
});

function showLogDetail(src){
  $('#ruleExecLogsContent').empty();
  $.getJSON(src, function(logs){
    var htmlBuf = [];
    _.each(logs, function(ruleExecLog){
      var trHtml = '<tr>'
        + '<td>' + ruleExecLog.id + '</td>'
        + '<td>' + ruleExecLog.ruleName + '</td>'
        + '<td>' + ruleExecLog.ruleSetName + '</td>'
        + '<td>' + ruleExecLog.ruleStatus + '</td>'
        + '<td>' + ruleExecLog.ruleScore + '</td>'
        + '<td>' + (ruleExecLog.ruleFieldName || ruleExecLog.ruleFieldNames) + '</td>'
        + '<td>' + (ruleExecLog.ruleFieldValue || ruleExecLog.ruleFieldValues) + '</td>'
        + '<td>' + ruleExecLog.costTime + '</td>'
        + '<td>' + moment(ruleExecLog.dateCreated).format('YYYY-MM-DD HH:mm:ss') + '</td>'
        + '</tr>';
      htmlBuf.push(trHtml)
    });
    $('#ruleExecLogsContent').append(htmlBuf);
    $('#ruleExecLogsDialog').modal('show');
  });
}

$(document).ready(function () {
  $('#callLog').submit(function (event) {
    event.preventDefault();

    var formData = {};

    var date_range = $('#date-range').text();
    var date_array = date_range.split(' - ');
    if (!date_range || date_array.length != 2) {
        return alert("请选择时间段！")
    }
    var date_begin = date_array[0].trim();
    var date_end = date_array[1].trim();
    formData['date_begin'] = date_begin;
    formData['date_end'] = date_end;
    formData['event_type'] = $('#eventType').val();
    formData['event_name'] = $('#eventName').val();
    formData['application_type'] = $('#applicationType').val();
    formData['user_id'] = $('#userId').val();

    $.ajax({
      type: 'POST',
      url: '/log/api-call/search/',
      data: JSON.stringify(formData),
      success: function (callLogs) {
        var callLogsTableHtml = [];
        _.each(callLogs, function(callLog){
          var isSuccess = (callLog.eventResult != 'ERROR');
          var callLogTableHtml = '<tr>' + '<td>' + callLog.id + '</td>'
            + '<td>' + callLog.eventName + '</td>'
            + '<td>' + callLog.eventType + '</td>'
            + '<td>' + callLog.applicationType + '</td>'
            + '<td>' + (isSuccess ? callLog.ruleSetName : '-') + '</td>'
            + '<td>' + (isSuccess ? callLog.ruleSetScore : '-') + '</td>'
            + '<td>' + callLog.userId + '</td>'
            + '<td>' + (isSuccess ? callLog.eventResult : '-') + '</td>'
            + '<td>' + (isSuccess ? callLog.eventCostTime : '-') + '</td>'
            + '<td>' + moment(callLog.dateCreated).format('YYYY-MM-DD HH:mm:ss') + '</td>'
            + '<td>' + (isSuccess ? '成功' : '失败') + '</td>'
            + '<td>' + '<a href="javascript:showLogDetail(\'/log/api-call/' + callLog.id + '/json\')">查看</a>' + '</td>'
            + '</tr>';
          callLogsTableHtml.push(callLogTableHtml)
        });
        $('#call-log-list').DataTable().destroy();
        $('#call-log-list').find('tbody:last-child').empty().append(callLogsTableHtml);
        $('#call-log-list').DataTable({
          'paging'      : true,
          'pageLength'  : 100,
          'lengthChange': false,
          "aoColumnDefs": [{"bSortable": false, "aTargets": [1,2,3,4,7,10]}],
          'order'       : [[9,'desc']],
          'searching'   : false,
          'info'        : true,
          'autoWidth'   : false,
          "language": DATATABLE_LANG_CN
        });
      },
      dataType: 'json',
      contentType: 'application/json'
    });
  })
});

