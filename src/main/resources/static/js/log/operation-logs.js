/**
 * Created by liumengjun on 2017-09-08.
 */
$(function(){
  var $logList = $('#log-list');
  var $logListTBody = $logList.find('tbody:last-child');
  var logRowTemplate = _.template($("#log-row-template").html());

  var DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';
  var DATE_SEPARATOR = ' 到 ', DATE_SEPARATOR_EN = ' - ';
  var $daterangePicker = $('#daterange-wrapper'), $daterangeInput = $('#daterange');
  $daterangePicker.daterangepicker({
    showDropdowns: true,
    timePicker: true,
    timePicker24Hour: true,
    timePickerSeconds: true,
    alwaysShowCalendars: true,
    maxDate: moment(),
    autoUpdateInput: false,
    locale: {
      format: DATE_FORMAT,
      separator: DATE_SEPARATOR,
      applyLabel: "确定",
      cancelLabel: "取消",
      daysOfWeek: DATE_LOCALE_CN.daysMin,
      monthNames: DATE_LOCALE_CN.monthsShort
    }
  });
  $daterangePicker.on('apply.daterangepicker', function(ev, picker) {
    $daterangeInput.val(picker.startDate.format(DATE_FORMAT) + DATE_SEPARATOR + picker.endDate.format(DATE_FORMAT))
  });

  $('#operation-log').submit(function(e){
    e.preventDefault();

    var dateRange = $('#daterange').val();
    var dateArray = dateRange.split(DATE_SEPARATOR);
    dateArray = (dateArray.length == 2 ? dateArray : dateRange.split(DATE_SEPARATOR_EN));
    var dateBegin = dateArray[0].trim();
    var dateEnd = dateArray[1].trim();
    var formData = {
      'dateBegin': dateBegin,
      'dateEnd': dateEnd,
      'operator': $('#operator').val()
    };

    $.ajax({
      type: 'POST',
      url: '/log/operation/search/',
      data: JSON.stringify(formData),
      success: function(opLogs){
        console.log(opLogs);
        var htmlBuf = [];
        _.each(opLogs, function(item){
          var rowHtml = logRowTemplate({
            'content': CONTENT_TYPES_MAP[item.contentType] || item.contentType,
            'contentId': item.contentId,
            'contentName': item.contentName,
            'type': OPERATION_TYPES_MAP[item.type] || item.type,
            'operator': item.operator,
            'dateCreated': moment(item.dateCreated).format(DATE_FORMAT)
          });
          htmlBuf.push(rowHtml);
        });
        $logList.DataTable().destroy();
        $logListTBody.empty().append(htmlBuf.join('\n'));
        $logList.DataTable({
          'paging': true,
          'pageLength': 100,
          'lengthChange': false,
          'searching': false,
          'aoColumnDefs': [{'bSortable': false, "aTargets": [0,1,2,3,4]}],
          'info': true,
          'autoWidth': false,
          "language": DATATABLE_LANG_CN
        });
      },
      contentType: 'application/json'
    });
  })
});
