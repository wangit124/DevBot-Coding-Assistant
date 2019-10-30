// define alert function
export function alert(title, message, footer) {
  const customAlert = `<div class="modal fade" id="alert" tabindex="-1" role="dialog">
                        <div class="modal-dialog modal-md modal-dialog-centered">
                          <div class="modal-content">
                            <div class="welcome-modal">
                            <div class="modal-header">
                            <h5 class="modal-title">${title}</h5>
                          </div>
                          <div class="modal-body text-center">
                          ${message}
                            <br>
                            ${footer}
                          </div>
                          <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" style="background-color: #990099 !important;" data-dismiss="modal">Got it</button>
                          </div>
                            </div>
                          </div>
                        </div>
                      </div>`;

  $("#custom-alert").html(customAlert);

  $("#alert").modal("show");
}
