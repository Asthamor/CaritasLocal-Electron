/*jshint esversion: 6 */

const electron = require("electron");
const ipc = electron.ipcRenderer;
const url = require("url");
const selectize = require("selectize");
const swal = require("sweetalert2");
require("datatables.net-bs");
require("datatables.net-responsive-bs");

document.addEventListener("DOMContentLoaded", function (event) {

    jQuery('#login_form').submit((e) => {
        e.preventDefault();
        if ($('#password')[0].checkValidity() &&
            $('#name')[0].checkValidity()) {
            pass = $('#password').val().trim();
            user = $('#name').val().trim();
            data = {
                password: pass,
                username: user,
            };
            ipc.send('UserValidation', data);
        }

    });

    ipc.on('LoginResponse', (event, arg) => {
        if (arg.userStatus == "Valid") {
            ipc.send("loadMainMenu", {
                username: arg.username,
                acceso: arg.acceso,
                tipoAcceso: arg.tipoAcceso,
            });
        } else {
            //TODO: Cambiarlo por Sweetalert
            $("#Mensaje").text(arg.errorMessage);
            $('#myModal').modal('show');
        }
    });
});