import Swal from "sweetalert2";
import { getValue } from "../Assets/Language/Entries";
import { getLang } from "../utils/common";

export function Alert(message) {
  Swal.fire(message);
}

export function AlertError(message, fn) {
  Swal.fire({
    icon: "error",
    title: "",
    text: message,
  }).then(fn);
}

export function AlertSuccess(message) {
  Swal.fire({
    icon: "success",
    title: message,
    showConfirmButton: false,
    timer: 1500,
  });
}

export function AlertConfirm(message, fn) {
  return Swal.fire({
    text: message,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: getValue("Yes", getLang()),
    cancelButtonText: getValue("No", getLang()),
  });
}

export function LoadingAlert(action) {
  var Title = `${getValue("Loading", getLang())} ...`;
  var sweet_loader =
    '<div class="sweet_loader"><svg viewBox="0 0 140 140" width="100" height="100"><g class="outline"><path d="m 70 28 a 1 1 0 0 0 0 84 a 1 1 0 0 0 0 -84" stroke="rgba(0,0,0,0.1)" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"></path></g><g class="circle"><path d="m 70 28 a 1 1 0 0 0 0 84 a 1 1 0 0 0 0 -84" stroke="#71BBFF" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-dashoffset="200" stroke-dasharray="300"></path></g></svg></div>';

  if (action == "Show") {
    Swal.fire({
      title: Title,
      allowEscapeKey: false,
      showConfirmButton: false,
      showCancelButton: false,
      buttons: false,
      html: "",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  } else {
    // if ($(".swal2-loading").css("display") == "flex")
    Swal.close();
  }
}
