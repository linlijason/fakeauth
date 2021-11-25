function showDetail(submitId){
  $.ajax({
    type: 'POST',
    url: '/log/operation/single-search/' + submitId,
    success: function(logs){
      var logTable = []
      if(logs.message.type == "rule"){
        buildRule(logs.message)
      }
      if(logs.message.type == "ruleSet"){
        buildRuleSet(logs.message)
      }
      if(logs.message.type == "event"){
        buildEvent(logs.message)
      }
    }
  });
}
function buildRule(message){
  $('#detail').empty();
  var ruleDetailTable = []
  var ruleDetailHtml = '<tr>'
    + '<td>' + message.name + '</td>'
    + '<td>' + message.category+ '</td>'
    + '<td>' + message.text + '</td>'
    + '<td>' + message.description + '</td>'
    + '</tr>'
  ruleDetailTable.push(ruleDetailHtml)
  $('#detail').append(ruleDetailTable);
  $('#ruleDetail').modal('show');
}
function buildRuleSet(message){
  $('#detail').empty();
  var ruleSetDetailTable = []
  var ruleSetDetailHtml = '<tr>'
    + '<td>' + message.name + '</td>'
    + '<td>' + message.type + '</td>'
    + '</tr>'
  ruleSetDetailTable.push(ruleSetDetailHtml)
  $('#rule-set-detail').append(ruleSetDetailTable);
  $('#ruleSetDetail').modal('show');
}
function buildEvent(message){
  $('#detail').empty();
  var ruleSetDetailTable = []
  var ruleSetDetailHtml = '<tr>'
    + '<td>' + message.name + '</td>'
    + '<td>' + message.eventType + '</td>'
    + '<td>' + message.appType+ '</td>'
    + '</tr>'
  ruleSetDetailTable.push(ruleSetDetailHtml)
  $('#event-detail').append(ruleSetDetailTable);
  $('#eventDetail').modal('show');
}