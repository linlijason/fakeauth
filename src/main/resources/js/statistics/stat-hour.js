/**
 * Created by liumengjun on 2017-08-23.
 */
$(function(){
  var TAB_ACTIVE_CLASS = 'btn-info';
  var $tabTransaction = $('#tabTransactionCount');
  var $tabUser = $('#tabUserCount');
  var lastQueryStatData = null;
  var hoursChart = echarts.init(document.getElementById('chart24h'));
  var monthData = [];
  var weekData = [];
  var todayData = [];
  // 模拟数据
  // todayData = _.map(_.range(24), function(){
  //   return {'refuse': _.random(0, 100), 'total': 100}
  // });
  // monthData = _.map(todayData, function(num){
  //   return {'refuse': parseInt(_.random(0.9 * num.refuse, 1.1 * num.refuse) * 30), 'total': 3000}
  // });
  // weekData = _.map(todayData, function(num){
  //   return {'refuse': parseInt(_.random(0.9 * num.refuse, 1.1 * num.refuse) * 7), 'total': 700}
  // });
  var seriesDatas = [monthData, weekData, todayData];

  function gatherSeriesData(){
    seriesDatas = [monthData, weekData, todayData]
  }

  function toPercentList(dataArray){
    return _.map(dataArray, function(num){
      if (num.total == 0) {
        return 0
      }
      return parseInt(num.refuse / num.total * 10000) / 100
    })
  }

  function hourFormat(h){
    return ((h < 10) ? '0' : '') + h + ':00'
  }

  var option = {
    title: {
      text: '进件被拒绝的数量/百分比'
    },
    grid: {
      left: '60',
      right: '20'
    },
    tooltip: {
      trigger: 'axis',
      showContent: true,
      formatter: function(params, ticket, callback){
        var buf = [];
        if (params.length) {
          buf.push(hourFormat(params[0].dataIndex) + ' ~ ' + hourFormat(params[0].dataIndex + 1));
        }
        _.each(params, function(param){
          buf.push('<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;' +
            'background-color:' + param.color + ';"></span>' +
            param.seriesName + ': ' + seriesDatas[param.seriesIndex][param.dataIndex].refuse + '/' + param.value + '%')
        });
        return buf.join('<br/>')
      }
    },
    legend: {
      itemWidth: 40,
      itemHeight: 25,
      data: _.map(['近30天', '近7天', '今天'], function(name){
        return {name: name, icon: 'rect'}
      })
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: _.map(_.range(24), function(num){
        return num + 1
      }),
      axisTick: {
        interval: 0
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value} %'
      }
    },
    series: [
      {
        name: '近30天',
        type: 'line',
        data: toPercentList(monthData),
        label: {
          emphasis: {
            show: false,
            formatter: function(params){
              return params.seriesName + ': ' + monthData[params.dataIndex].refuse + '/' + params.value.toFixed(2) + '%'
            }
          }
        }
      },
      {
        name: '近7天',
        type: 'line',
        data: toPercentList(weekData),
        label: {
          emphasis: {
            show: false,
            formatter: function(params){
              return params.seriesName + ': ' + weekData[params.dataIndex].refuse + '/' + params.value.toFixed(2) + '%'
            }
          }
        }
      },
      {
        name: '今天',
        type: 'line',
        data: toPercentList(todayData),
        label: {
          emphasis: {
            show: false,
            formatter: function(params){
              return params.seriesName + ': ' + todayData[params.dataIndex].refuse + '/' + params.value.toFixed(2) + '%'
            }
          }
        }
      }
    ]
  };

  hoursChart.setOption(option);

  function showTransactionView(){
    if (!lastQueryStatData) {
      return
    }
    $tabUser.removeClass(TAB_ACTIVE_CLASS);
    $tabTransaction.addClass(TAB_ACTIVE_CLASS);
    monthData = lastQueryStatData.transactionHourStatOf30Day;
    weekData = lastQueryStatData.transactionHourStatOf7Day;
    todayData = lastQueryStatData.transactionHourStatOfToday;
    _updateCharts();
  }

  function showUserView(){
    if (!lastQueryStatData) {
      return
    }
    $tabTransaction.removeClass(TAB_ACTIVE_CLASS);
    $tabUser.addClass(TAB_ACTIVE_CLASS);
    monthData = lastQueryStatData.userHourStatOf30Day;
    weekData = lastQueryStatData.userHourStatOf7Day;
    todayData = lastQueryStatData.userHourStatOfToday;
    _updateCharts();
  }

  function _updateCharts(){
    gatherSeriesData();
    option.series[0].data = toPercentList(monthData);
    option.series[1].data = toPercentList(weekData);
    option.series[2].data = toPercentList(todayData);
    hoursChart.setOption(option)
  }

  $('#queryForm').submit(function(e){
    e.preventDefault();
    var eventTypeId = $('#eventType').val() || 0;
    var appTypeId = $('#appType').val() || 0;
    var eventId = $('#event').val() || 0;
    var ruleSetId = $('#ruleSet').val() || 0;
    $.getJSON('/statistics/query/hour/' + eventTypeId + '/' + appTypeId + '/' + eventId + '/' + ruleSetId, function(json){
      console.log(json);
      lastQueryStatData = json;
      showTransactionView();
    })
  });

  $tabTransaction.click(function(e){
    if ($tabTransaction.hasClass(TAB_ACTIVE_CLASS)) {
      return;
    }
    showTransactionView();
  });

  $tabUser.click(function(e){
    if ($tabUser.hasClass(TAB_ACTIVE_CLASS)) {
      return;
    }
    showUserView();
  })
});
