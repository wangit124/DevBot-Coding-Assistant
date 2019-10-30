var editor = ace.edit("code-field");
editor.setTheme("ace/theme/xcode");
editor.session.setMode("ace/mode/swift");
editor.setValue("class DevBot {\n\n}");
$(document).on("change", "#language-switch", function() {
  const language = $("#language-switch").val();
  editor.session.setMode(`ace/mode/${language.toLowerCase()}`);
});
