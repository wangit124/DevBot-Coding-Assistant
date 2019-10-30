import { alert } from "/javascripts/alert.mjs";

$("#create-btn").removeAttr("disabled");
$("#loader").hide();
$("#submit_text").text("Create");
$("#create-btn").click(e => {
  if (!$("#shortcut_input").val() || !$("#data_input").val()) return false;
  $("#create-btn").attr("disabled", "true");
  $("#loader").show();
  $("#submit_text").text("Loading...");
  let post_data = {
    shortcut: $("#shortcut_input").val(),
    language: $("#language").val(),
    full: $("#data_input").val()
  };
  $.post("/create", post_data, function(data) {
    if (data === "failure") {
      $("#contact-modal").modal("hide");
      alert(
        "Shortcut already exists!",
        "This shortcut already exists.",
        "Please select another shortcut."
      );
      $("#create-btn").removeAttr("disabled");
      $("#loader").hide();
      $("#submit_text").text("Create");
    } else {
      setTimeout(() => {
        window.location.href = "/";
        document.location.refresh();
        $("#create-btn").removeAttr("disabled");
        $("#loader").hide();
        $("#submit_text").text("Create");
      }, 1500);
    }
  });
});
