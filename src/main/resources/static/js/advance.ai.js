function initSelectTag($select, obj_list, nonValueText, valueKey, textKey){
  $select.empty();
  if (nonValueText) {
    $select.append('<option value="">' + nonValueText + '</option>');
  }
  if (!valueKey) {
    valueKey = 'id'
  }
  if (!textKey) {
    textKey = 'name'
  }
  var valueKeyIsFn = $.isFunction(valueKey), textKeyIsFn = $.isFunction(textKey);
  $.each(obj_list, function(i, item){
    var value = valueKeyIsFn ? valueKey(item) : item[valueKey];
    var text = textKeyIsFn ? textKey(item) : item[textKey];
    $select.append('<option value="' + value + '">' + text + '</option>')
  });
  // 如果是 select2 标签 则触发 select2 方法
  if ($select.hasClass('select2')) {
    $select.select2({
        dropdownAutoWidth: true,
    });
    $select.trigger('change');
    $select.find('.select2').css('width', '100%');
  }
}

function updateLocationByParam(key, val){
  var key_val = key + '=' + val;
  var old_search = location.search;
  if (!old_search) {
    location.search = "?" + key_val;
    return;
  }
  var key_index = old_search.indexOf(key + "=");
  if (key_index < 0) { // 原来没有page参数
    location.search = old_search + '&' + key_val;
    return;
  }
  // 有旧的key参数
  var end_index = old_search.indexOf('&', key_index + key.length + 1); // 加"{key}="的长度
  if (end_index < 0) { // 无后续参数
    location.search = old_search.substring(0, key_index) + key_val;
  } else { // 有后续参数
    location.search = old_search.substring(0, end_index) + key_val + old_search.substring(end_index);
  }
}

function pageBarInit(fn, $ctx){
  if (!fn) { // 导航点击事件: 默认取pageto属性值,更新url查询参数,可以自定义
    fn = function(e){
      var $this = $(this), $li = $this.closest('li');
      if ($li.hasClass('disabled') || $li.hasClass('active')) return;
      var page_to = $this.data('pageto');
      updateLocationByParam('page', page_to);
    }
  }
  $('.pagination a', $ctx).click(fn);
}

$(document).ajaxError(function(event, jqXHR, ajaxSettings, thrownError){
  if (jqXHR.status == 403 || (jqXHR.responseText && jqXHR.responseText.indexOf('/login/auth') > 0)) {
    location.reload();
  }
});

var DATE_LOCALE_CN = $.fn.datepicker.dates["zh-CN"]; // NOTE：借用`bootstrap-datepicker.zh-CN.min.js`的定义
var DATATABLE_LANG_CN = {
  emptyTable: "无可用数据",
  info: "&nbsp;展示_TOTAL_个条目中的_START_-_END_",
  infoEmpty: "",
  paginate: {
    next: "下一页",
    previous: "上一页"
  }
};

$(function () {
    //Initialize Select2 Elements
    $('.select2').select2();
});