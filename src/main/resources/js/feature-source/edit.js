$(function () {
  var toDeleteFieldIds = [];
  var fieldRowTemplate = $('#field-row-template').html();
  var $fieldListBox = $('#field-list-box');
  var collectionFieldList = function () {
    var list = [];
    $fieldListBox.children().each(function () {
      var $row = $(this);
      var id = $row.find('input[name="f_id"]').val();
      var name = $row.find('input[name="f_name"]').val();
      var type = $row.find('select[name="f_type"]').val();
      var status = $row.find('select[name="f_status"]').val();
      list.push({'id': id, 'name': name, 'type': type, 'status': status});
    });
    return list;
  };
  //初始化
  (function () {
    _.each(feature_field_list, function (field) {
      var $row = $(fieldRowTemplate);
      $row.find('input[name="f_id"]').val(field.id);
      $row.find('input[name="f_name"]').val(field.name);
      $row.find('select[name="f_type"]').val(field.type);
      $row.find('select[name="f_status"]').val(field.status);
      $fieldListBox.append($row);
    });
  })();
  $('input, select').prop('readonly', true).prop('disabled', true).css('background-color', '#fff');
  $("#createRule").submit(function (event) {
    event.preventDefault();

    var formData = {};
    if ($("#featureSourceId").length) {
      formData["id"] = parseInt($("#featureSourceId").val());
    }
    formData["name"] = $("#featureSourceName").val();
    formData["url"] = $("#featureSourceUrl").val();
    formData["method"] = $("#featureSourceMethod").val();
    formData["params"] = $("#featureSourceParams").val();
    formData["source"] = $("#featureSourceSource").val();
    formData["chargeable"] = $("#featureSourceChargeable").val();
    formData["description"] = $("#featureSourceDescription").val();
    formData["fieldList"] = collectionFieldList();
    formData['toDeleteFieldIds'] = toDeleteFieldIds;
    console.log(formData);

    $.ajax({
      type: "POST",
      url: "/source/save",
      data: JSON.stringify(formData),
      success: function (json) {
        if (json && json.message) {
          alert(json.message);
          return;
        }
        window.location.href = "/source/list";
      },
      dataType: "json",
      contentType: "application/json"
    })

  });
  //field编辑
  var actionRemoveOneField = function (e) {
    e.preventDefault();
    var $row = $(this).closest('.field-row');
    var id = $row.find('input[name="f_id"]').val();
    if (id) {
      toDeleteFieldIds.push(id);
    }
    $row.remove();
  };
  $('#add-one-field').click(function (e) {
    e.preventDefault();
    var $row = $(fieldRowTemplate);
    $row.find('[action="remove-field"]').click(actionRemoveOneField);
    $fieldListBox.append($row);
  });
  $('[action="remove-field"]').click(actionRemoveOneField);
});