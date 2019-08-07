/*jshint esversion: 8 */
const electron = require("electron");
const ipc = electron.ipcRenderer;
const url = require("url");
const selectize = require("selectize");
const swal = require("sweetalert2");
require("datatables.net-bs");
require("datatables.net-responsive-bs");

var dateLocale = "YYYY-MM-DD";
/**
 * @param {String} url - address for the HTML to fetch
 * @return {String} the resulting HTML string fragment
 */
async function fetchHtmlAsText(url) {
    return await (await fetch(url)).text();
}

document.addEventListener("DOMContentLoaded", function (event) {


    const electron = require("electron");
    const ipc = electron.ipcRenderer;

    load_casos = async function loadCasos() {
        content = document.getElementById("main-section");
        content.innerHTML = await fetchHtmlAsText("../html/inicioCasos.html");
        document.dispatchEvent(new Event('inicioCasosLoaded'));
    };

    load_informes = async function loadInformes() {
        content = document.getElementById("main-section");
        content.innerHTML = await fetchHtmlAsText("../html/informes.html");
        document.dispatchEvent(new Event('informesLoaded'));
    };

    load_gestion_ciudadanos = async function load_gestion() {
        content = document.getElementById("main-section");
        content.innerHTML = await fetchHtmlAsText("../html/gestion_ciudadanos.html");
        document.dispatchEvent(new Event('gestionCiudadanoLoaded'));
    };
    load_casos();


    //Carga de ventana de expediente con un expediente preasignado
    ipc.on('pushExpediente', (event, args) => {
        load_menuOption("GenerarExpediente");
        document.dispatchEvent(new Event('doFillExpedienteForm'));

        //cargar el expediente en la vista
    });

    ipc.on('pushCaso', (event, args) => {
        load_menuOption('IniciarCaso');
        document.dispatchEvent(new Event('doFillCasoForm', args));
        // cargar la informacion del usuario en la vista
    });

    document.addEventListener('inicioCasosLoaded', () => {

        $("#NuevoCiudadano").click(() => {
            load_menuOption("NuevoCiudadano");
        });
        $("#GenerarExpediente").click(() => {
            load_menuOption("GenerarExpediente");
        });
        $("#IniciarCaso").click(() => {
            load_menuOption("IniciarCaso");
        });
        $("#DarSeguimiento").click(() => {
            load_menuOption("DarSeguimiento");
        });
    });


    async function load_menuOption(optionSelected) {
        content = document.getElementById("inner-section");
        $('.info-box-3').css('height', '80px');
        $('#case-menu .card').prop('hidden', true);
        switch (optionSelected) {
            case "NuevoCiudadano":
                content.innerHTML = await fetchHtmlAsText("../html/Casos/nuevo_ciudadano.html");
                document.dispatchEvent(new Event('newFormLoaded'));
                break;
            case "GenerarExpediente":
                content.innerHTML = await fetchHtmlAsText("../html/Casos/generar_expediente.html");
                document.dispatchEvent(new Event('expedienteFormLoaded'));
                break;
            case "IniciarCaso":
                content.innerHTML = await fetchHtmlAsText("../html/Casos/iniciar_situacion.html");
                document.dispatchEvent(new Event('situacionFormLoaded'));
                break;
            case "DarSeguimiento":
                content.innerHTML = await fetchHtmlAsText("../html/Casos/seguimiento.html");
                document.dispatchEvent(new Event('seguimientoFormLoaded'));
                break;
        }

    }
});