var initStartDate = moment().subtract(6, 'days'),
  initEndDate = moment();
function daterange_callback(start, end){
  $('#daterange-btn').find('span').html(start.format('YYYY-MM-DD') + ' ~ ' + end.format('YYYY-MM-DD'))
}
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
    startDate: initStartDate,
    endDate: initEndDate,
    maxDate: moment(),
    locale: {
      applyLabel: "确定",
      cancelLabel: "取消",
      customRangeLabel: "自定义",
      daysOfWeek: DATE_LOCALE_CN.daysMin,
      monthNames: DATE_LOCALE_CN.monthsShort
    }
  },
  daterange_callback
);
daterange_callback(initStartDate, initEndDate);

function showLoading(){
  $('#overlay').show();
}
function hideLoading(){
  $('#overlay').hide();
}

$(document).ready(function () {

  let dom = document.getElementById("container");
  let myChart = echarts.init(dom);
  let app = {};
  option = {
    title: {
      text: '进件被拒绝数量/百分比图'
    },
    tooltip: {
      trigger: 'axis',
      showContent: false // 只有一组数据，不显示tooltip内容
    },
    legend: {
      data: ['Refuse']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: []
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value} %'
      }
    },
    series: []
  };
  myChart.setOption(option, true);

  function processY(list) {
    let y = [];
    for (let d of list) {
      if (d["totalCount"]) {
        y.push(parseInt(d.refuseCount * 10000.0 / d.totalCount) / 100) // 精确到两位小数
      } else {
        y.push(0)
      }
    }
    return y;
  }

  function overview(passCount, refuseCount, totalCount) {
    $("#passCount").text(passCount);
    $("#refuseCount").text(refuseCount);
    $("#totalCount").text(totalCount);
  }

  function lineChart(x, y) {
    myChart.setOption({
      xAxis: {data: x},
      series: [{
        name: 'Refuse',
        type: 'line',
        data: processY(y),
        label: {
          emphasis: {
            show: true,
            formatter: function (params) {
              return params.seriesName + ': ' + y[params.dataIndex].refuseCount + '/' + params.value.toFixed(2) + '%'
            }
          }
        }
      }]
    });
  }

  let $tabTransactionCount = $('#tabTransactionCount');
  let $tabUserCount = $('#tabUserCount');
  let responseData = {};

  $tabTransactionCount.click(function () {
    if ($tabTransactionCount.val() === "0") {
      $tabTransactionCount.val("1");
      $tabUserCount.val("0");
      $tabTransactionCount.removeAttr('class');
      $tabTransactionCount.attr('class', 'btn btn-default btn-info');
      $tabUserCount.removeAttr('class');
      $tabUserCount.attr('class', 'btn btn-default');
      // 总数
      overview(responseData["passCountByTransactionId"], responseData["refuseCountByTransactionId"], responseData["totalCountByTransactionId"]);

      // 图表
      lineChart(responseData["xByTransactionId"], responseData["yByTransactionId"]);
    }
  });

  $tabUserCount.click(function () {
    if ($tabUserCount.val() === "0") {
      $tabUserCount.val("1");
      $tabTransactionCount.val("0");
      $tabTransactionCount.removeAttr('class');
      $tabTransactionCount.attr('class', 'btn btn-default');
      $tabUserCount.removeAttr('class');
      $tabUserCount.attr('class', 'btn btn-default btn-info');
      // 总数
      overview(responseData["passCountByUserId"], responseData["refuseCountByUserId"], responseData["totalCountByUserId"]);

      // 图表
      lineChart(responseData["xByUserId"], responseData["yByUserId"]);
    }
  });

  $('#queryForm').submit(function (event) {
    event.preventDefault();
    showLoading();
    let formData = {};

    let dateRange = $('#date-range').text();
    let dateBegin = dateRange.split(' ~ ')[0].trim();
    let dateEnd = dateRange.split(' ~ ')[1].trim();
    formData['dateBegin'] = dateBegin;
    formData['dateEnd'] = dateEnd;
    formData['eventTypeId'] = $('#eventType').val() || 0;
    formData['eventId'] = $('#event').val() || 0;
    formData['appTypeId'] = $('#appType').val() || 0;
    formData['ruleSetId'] = $('#ruleSet').val() || 0;
    formData['tabTransaction'] = $tabTransactionCount.val();
    formData['tabUser'] = $tabUserCount.val();

    $.ajax({
      type: 'POST',
      url: '/statistics/day',
      data: JSON.stringify(formData),
      success: function (data) {
        hideLoading();

        // 总数
        overview(data["passCountByTransactionId"], data["refuseCountByTransactionId"], data["totalCountByTransactionId"]);

        // 图表
        lineChart(data["xByTransactionId"], data["yByTransactionId"]);
        responseData = data;

        // 规则命中排行
        let hitRules = data["hitRules"];
        hitRules.sort(function (a, b) {
          return b["hitRate"] - a["hitRate"]
        });
        console.log(hitRules);
        let tableHtml = [];

        function pad2(n) {  // always returns a string
          return (n < 10 ? '0' : '') + n;
        }

        for (let hitRule of hitRules) {
          let trHtml = '<tr>' + '<td>' + hitRule.ruleId + '</td>' + '<td>' + hitRule.ruleName + '</td>' + '<td>' + hitRule.ruleCategory + '</td>' + '<td>' + hitRule.hitRate + '</td>' + '</tr>';
          tableHtml.push(trHtml)
        }
        $('#rule-list').DataTable().destroy();
        $('#rule-list').find('tbody:last-child').empty().append(tableHtml);
        $('#rule-list').DataTable({
          'paging': true,
          'lengthChange': false,
          'searching': false,
          'ordering': true,
          'info': true,
          'autoWidth': false,
          "language": DATATABLE_LANG_CN
        });
      },
      dataType: 'json',
      contentType: 'application/json',
      error: function() {
        hideLoading();
        alert("请求出错，请重试！");
      }
    });
  })
});

