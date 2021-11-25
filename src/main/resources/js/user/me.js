/**
 * Created by liumengjun on 2017-09-08.
 */
$(function(){
  var $modalChangePassword = $('#modal-change-password');

  function checkFormData(formData){
    var oldPassword = formData['oldPassword'], newPassword = formData['newPassword'],
      newPasswordAgain = formData['newPasswordAgain'];
    if (!oldPassword || !newPassword || !newPasswordAgain) {
      return alert("请填写完整各项参数");
    }
    if (newPassword != newPasswordAgain) {
      return alert("两次新密码不一样");
    }
    if (newPassword.length < 8) {
      return alert('新密码必须是8位以上字母和数字的组合')
    }
    var hasDigit = false, hasLetter = false;
    for (var i = 0; i < newPassword.length; i++) {
      var c = newPassword[i];
      if (c >= '0' && c <= '9') {
        hasDigit = true
      } else {
        c = c.toLowerCase();
        if (c >= 'a' && c <= 'z') {
          hasLetter = true
        }

      }
    }

    if (!(hasDigit && hasLetter)) {
      return alert('新密码必须是8位以上字母和数字的组合')
    }
    return true
  }

  $('[action="change-password"]').click(function(e){
    e.preventDefault();
    var oldPassword = $.trim($('#old_password').val());
    var newPassword = $.trim($('#new_password').val());
    var newPasswordAgain = $.trim($('#new_password_again').val());
    var formData = {
      oldPassword: oldPassword,
      newPassword: newPassword,
      newPasswordAgain: newPasswordAgain
    };
    if (!(checkFormData(formData) === true)) {
      return;
    }
    $.ajax({
      type: "POST",
      url: "/me/password/change",
      data: JSON.stringify(formData),
      success: function(data){
        if (!data || !data.ok) {
          alert(data.message || '修改失败');
          return;
        }
        alert('修改成功');
        location.href = '/logout'
      },
      error: function(){
        alert("修改失败");
      },
      contentType: "application/json"
    });
  });
});
