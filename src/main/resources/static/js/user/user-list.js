/**
 * Created by liumengjun on 2017-09-07.
 */
$(function(){
  $('[action="create-user"]').click(function(e){
    e.preventDefault();
    var username = $.trim($('#username').val());
    if (!username) {
      return alert("账户名不能为空");
    }
    $.ajax({
      type: "POST",
      url: "/user/create/",
      data: JSON.stringify({'username': username}),
      success: function(data){
        if (!data || !data.ok) {
          alert(data.message || '创建失败');
          return;
        }
        location.reload();
        alert('创建成功');
      },
      error: function(){
        alert("创建失败");
      },
      contentType: "application/json"
    });
  });

  $('[action="reset-password"]').click(function(e){
    e.preventDefault();
    if (!window.confirm("确定重置该账户的密码吗？")) return;
    var $user = $(this).closest('tr');
    var userid = $user.attr('userid');
    $.ajax({
      type: "POST",
      url: "/user/password/reset/" + userid,
      success: function(data){
        if (!data || !data.ok) {
          alert(data.message || '操作失败');
          return;
        }
        alert('操作成功');
      },
      error: function(){
        alert("操作失败");
      }
    });
  });

  $('[action="delete-user"]').click(function(e){
    e.preventDefault();
    if (!window.confirm("确定删除该账户吗？")) return;
    var $user = $(this).closest('tr');
    var userid = $user.attr('userid');
    $.ajax({
      type: "POST",
      url: "/user/delete/" + userid,
      success: function(data){
        if (!data || !data.ok) {
          alert(data.message || '删除失败');
          return;
        }
        location.reload();
        alert('删除成功');
      },
      error: function(){
        alert("删除失败");
      }
    });
  });
});
