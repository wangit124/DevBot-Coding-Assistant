// Show welcome message
$(document).ready(() => {
  if (!sessionStorage.getItem("session_id")) {
    $("#welcome").modal("show");
  }
  sessionStorage.setItem("session_id", "active");
});
