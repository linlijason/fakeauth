$(function(){
  var $eventTypeSelect = $('#eventType');
  var $appTypeSelect = $('#appType');
  var $eventSelect = $('#event');
  var $ruleSetSelect = $('#ruleSet');

  function renderEventSelect(){
    var eid = $eventTypeSelect.val();
    var aid = $appTypeSelect.val();
    $eventSelect.children(':gt(0)').remove();
    $ruleSetSelect.children(':gt(0)').remove();
    if (eid && aid) {
      $.getJSON('/event/list/by/eventType/' + eid + '/appType/' + aid, function(list){
        initSelectTag($eventSelect, list, '全部事件')
      })
    }
  }

  function renderRuleSetSelect(){
    var eid = $eventSelect.val();
    $ruleSetSelect.children(':gt(0)').remove();
    if (eid) {
      $.getJSON('/rule-set/list/by/event/' + eid, function(list){
        initSelectTag($ruleSetSelect, list, '全部规则集')
      })
    }
  }

  $eventTypeSelect.change(function(e){
    renderEventSelect();
  });
  $appTypeSelect.change(function(e){
    renderEventSelect();
  });
  $eventSelect.change(function(e){
    renderRuleSetSelect();
  });
});
