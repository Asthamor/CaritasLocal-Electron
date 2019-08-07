/* jshint esversion: 8 */
/*
const electron = require("electron");
const ipc = electron.ipcRenderer;
const url = require("url");
const selectize = require("selectize");
const swal = require("sweetalert2");
require("datatables.net-bs");
require("datatables.net-responsive-bs");*/

var tablaFamiliares;
let ingresoFamiliar = 0;
let codPersona = "";


ipc.on("responseCiudadanoList", (event, args) => {

    /*---- Selectize para busqueda de beneficiarios ---- */
    $("#listCiudadano").selectize({
        persist: false,
        maxItems: 1,
        create: false,
        highlight: true,
        valueField: "codPersona",
        labelField: "nombreCompleto",
        searchField: "nombreCompleto",
        sortField: "nombreCompleto",
        options: args,
        onChange: value => {
            ciudadano = args.filter(val => val.codPersona == value).shift();
            getExpedienteCiudadano(value);
        }
    });

    inicializarTablaFamiliares();

});

/* ---- Tabla de fmiliares con Datatables.net -----*/
function inicializarTablaFamiliares() {
    tablaFamiliares = $("#TablaFamilia").DataTable({
        "columns": [{
                "name": "parentesco"
            },
            {
                "name": "nombre"
            },
            {
                "name": "edad"
            },
            {
                "name": "ocupacion"
            },
            {
                "name": "ingresos"
            },
            {
                "name": "acciones"
            }, {
                "name": "observacion"
            }
        ],
        "columnDefs": [{
            targets: -1, //-1 es la ultima columna y 0 la primera
            data: null,
            defaultContent: '<button type="button" class="btn bg-blue btn-xs btn-circle waves-effect waves-circle waves-float" id="delete" title="Eliminar Familiar"><i class="material-icons">delete_forever</i></button>'
        }, ]
    });

    //TODO: Funcion para Elimiar el familiar de la BD
    $('#TablaFamilia tbody').on('click', 'button', function () {
        let data = tablaFamiliares.row($(this).parents('tr')).data();
        ipc.send("deleteFamiliarRequest", {
            rowToDelete: tablaFamiliares.row($(this).parents('tr')),
            codPersona: codPersona,
            nombre: data[1],
            edad: data[2],
            ocupacion: data[3],
            ingresos: data[4],
            observacion: data[5],
        });
    });
}

async function getExpedienteCiudadano(codPersona) {
    ipc.send("requestExpediente", {
        codPersona: codPersona
    });
}

ipc.on("newExpedienteResponseSent", (event, args) => {
    const {
        persona,
    } = args.data;
    codPersona = args.data.codPersona;
    //Llenar el formulario con los datos del expediente
    $("#nombrePersona").text(
        `${persona.nombrePersona} ${persona.paternoPersona} ${persona.maternoPersona}`
    );
    if (persona.direccion) {
        $("#direccionPersona").text(
            `${persona.direccion.calle} ${persona.direccion.no} ${persona.direccion.colonia} 
            ${persona.direccion.cp} ${persona.direccion.municipio.NOMBRE}`
        );
    }

    if (persona.contacto) {
        $("#contactoPersona").text(
            `${persona.contacto.telefono} \|\| ${persona.contacto.celular} \|\| ${persona.contacto.correo}`
        );
    }

    tablaFamiliares.clear();
    for (var familiar of persona.datosFamiliares) {
        ingresoFamiliar += Number(familiar.ingresosMensuales);
        tablaFamiliares.row
            .add([
                `${familiar.parentesco.parentesco}`,
                `${familiar.nombreCompleto}`,
                `${familiar.edad}`,
                `${familiar.ocupacion}`,
                `${familiar.ingresosMensuales}`,
                `${familiar.observacion}`
            ]).draw();
    }

    let ingresoTotal = 0;
    $("#Totales").text(ingresoFamiliar);
    $("#Totales").text(0);
    $("#TotalTotal").text(ingresoTotal);
    $("#InformacionCompleta").show();
});

ipc.on("expedienteResponseSent", (event, args) => {
    const {
        persona,
    } = args.data;
    if (!args.success) {
        //TODO:Agregar logica cuando falla en cargar datos
        alert(`Show swal with errors ${args.errors}`);
    } else {
        idExpediente = args.data.idExpediente;
        codPersona = args.data.codPersona;
        //Llenar el formulario con los datos del expediente
        $("#nombrePersona").text(
            `${persona.nombrePersona} ${persona.paternoPersona} ${persona.maternoPersona}`
        );
        if (persona.direccion) {
            $("#direccionPersona").text(
                `${persona.direccion.calle} ${persona.direccion.no} ${persona.direccion.colonia} 
            ${persona.direccion.cp} ${persona.direccion.municipio.NOMBRE}`
            );
        }
        if (persona.contacto) {
            $("#contactoPersona").text(
                `${persona.contacto.telefono} \|\| ${persona.contacto.celular} \|\| ${persona.contacto.correo}`
            );
        }
        $("#contactoPersona").text(
            `${persona.contacto.telefono} \|\| ${persona.contacto.celular} \|\| ${persona.contacto.correo}`
        );
        tablaFamiliares.clear();
        for (var familiar of persona.datosFamiliares) {
            ingresoFamiliar += Number(familiar.ingresosMensuales);
            tablaFamiliares.row
                .add([
                    `${familiar.parentesco.parentesco}`,
                    `${familiar.nombreCompleto}`,
                    `${familiar.edad}`,
                    `${familiar.ocupacion}`,
                    `${familiar.ingresosMensuales}`,
                    `${familiar.observacion}`
                ]).draw();
        }
        let ingresoTotal = Number(args.data.ingresosMensuales) + Number(ingresoFamiliar);
        $("#Amedica").val(args.data.asistenciaMedica);
        $("#ocupacion").val(args.data.ocupacion);
        $("#ingresos").val(args.data.ingresosMensuales);
        $("#listEstadoCivil").val(args.data.fkEstadoCivil);
        $("#Totales").text(ingresoFamiliar);
        $("#TotalTotal").text(ingresoTotal);
        $("#cuartos").val(args.data.noCuartos);
        $("#listTecho").val(args.data.fkTecho);
        $("#listPiso").val(args.data.fkPiso);
        $("#listPared").val(args.data.fkPared);
        $("#listPosesion").val(args.data.fkPosesion);
        $("#obervacionesvivienda").val(args.data.observacionesVisita);
        $("#descripcionVisita").val(args.data.descripcionVisita);
        $("#listMedio").val(args.data.fkmedio);
        $("#nombreMedio").val(args.data.medio.nombreMedio);
        $("#descripcionAyuda").val(args.data.descripcionAyuda);
        if (args.data.pagaRenta === "SI") {
            $("#PagaRentaSI").prop('checked', true);
            $("#PagaRentaCuanto").val(args.data.pagoRenta);
        } else {
            $("#PagaRentaNO").prop('checked', true);
            $("#cuantoRenta").hide();
            $("#PagaRentaCuanto").prop('disabled', true);

        }

        if (args.data.visitaDomiciliar === "SI") {
            $("#VisitaSI").prop('checked', true);
            $("#visitaPorque").show();
            $("#visitaDetalle").val(args.data.descripcionVisita);
        } else {
            $("#VisitaNO").prop('checked', true);
            $("#visitaPorque").hide();
            $("#visitaDetalle").prop('disabled', true);

        }

        if (args.data.informante === "NO") {
            $("#informanteNO").prop('checked', true);
            $("#muestraInformante").show();
            $("#nombreInformante").val(args.data.nombreInformante);
            $("#telefonoInformante").val(args.data.telefonoInformante);
        } else {
            $("#informanteSI").prop('checked', true);
            $("#muestraInformante").hide();
            $("#nombreInformante").prop('disabled', true);
            $("#telefonoInformante").prop('disabled', true);

        }

        if (args.data.ayudaAnterior === "SI") {
            $("#ayudaAnteriorSI").prop('checked', true);
            $("#muestraAyuda").show();
            $("#descripcionAyuda").val(args.data.descripcionAyuda);
        } else {
            $("#ayudaAnteriorNO").prop('checked', true);
            $("#muestraAyuda").hide();
            $("#descripcionAyuda").prop('disabled', true);

        }

        $("#InformacionCompleta").show();
    }
});


/*  ------------ CARGA DE CATALOGOS DEL FORMULARIO -------- */
ipc.on("escolaridadesSent", (event, args) => {
    for (var val of args) {
        $(new Option(val.Escolaridad, val.idEscolaridad)).appendTo(
            "#listEscolaridad"
        );
    }
});
ipc.on("parentescosSent", (event, args) => {
    for (var val of args) {
        $(new Option(val.parentesco, val.idParentesco)).appendTo("#listParentesco");
    }
});
ipc.on("estadoCivilSent", (event, args) => {
    for (let val of args) {
        $(new Option(val.EstadoCivil, val.idEstadoCivil)).appendTo("#listEstadoCivil");
    }
});
ipc.on("techoSent", (event, args) => {
    for (let val of args) {
        $(new Option(val.tipoTecho, val.idtecho)).appendTo("#listTecho");
    }
});
ipc.on("paredSent", (event, args) => {
    for (let val of args) {
        $(new Option(val.tipoPared, val.idPared)).appendTo("#listPared");
    }
});
ipc.on("posesionSent", (event, args) => {
    for (let val of args) {
        $(new Option(val.posesion, val.idPosesion)).appendTo("#listPosesion");
    }
});
ipc.on("pisoSent", (event, args) => {
    for (let val of args) {
        $(new Option(val.tipoPiso, val.idpiso)).appendTo("#listPiso");
    }
});
ipc.on("medioSent", (event, args) => {
    for (let val of args) {
        $(new Option(val.nombreMedio, val.idMedio)).appendTo("#listMedio");
    }
});
ipc.on("municipiosSent", (event, args) => {});

/*  FIN ------------ CARGA DE CATALOGOS DEL FORMULARIO -------- */


/* ---------- RESPUESTAS DE SUBMITS ----------- */

ipc.on("familiarAddedSuccess", (event, args) => {
    swal.fire({
        titleText: 'Éxito',
        text: `Familiar añadido`,
        type: 'success'
    });
    ingresoFamiliar += Number(args.result.ingresosMensuales);
    sumaIngresos();
    tablaFamiliares.row
        .add([
            `${args.result.parentesco.parentesco}`,
            `${args.result.nombreCompleto}`,
            `${args.result.edad}`,
            `${args.result.ocupacion}`,
            `${args.result.ingresosMensuales}`,
            `${args.result.observacion}`
        ]).draw();
});

ipc.on("ERRORFamiliarAdd", (event, args) => {
    swal.fire({
        title: '¡Error!',
        text: "No se pudo añadir el familiar, inténtelo más tarde",
        type: 'error',
    });
    console.error(error);
});

ipc.on("familiarRemoveSuccess", (event, args) => {
    swal.fire({
        titleText: 'Éxito',
        text: `Familiar eliminado`,
        type: 'success'
    });
    ingresoFamiliar -= Number(args.result.ingresosMensuales);
    sumaIngresos();
    tablaFamiliares.row(args.deletedRow).remove().draw();
});

ipc.on("ERRORFamiliarRemove", (event, args) => {
    swal.fire({
        title: '¡Error!',
        text: "No se pudo eliminar el familiar, inténtelo más tarde",
        type: 'error',
    });
    console.error(error);
});


/* FIN --------- RESPUESTAS DE SUBMITS -----------*/

document.addEventListener("expedienteFormLoaded", () => {
    //Toggles del formulario
    $("input[name=PagaRenta]").change((event) => {
        if ($("#PagaRentaSI").prop("checked")) {
            $("#cuantoRenta").show();
            $("#PagaRentaCuanto").prop('disabled', false);
        }
        if ($("#PagaRentaNO").prop("checked")) {
            $("#cuantoRenta").hide();
            $("#PagaRentaCuanto").prop('disabled', true);

        }
    });

    $("input[name=Visita]").change((event) => {
        if ($("#VisitaSI").prop("checked")) {
            $("#visitaPorque").show();
            $("#visitaDetalle").prop('disabled', false);

        }
        if ($("#VisitaNO").prop("checked")) {
            $("#visitaPorque").hide();
            $("#visitaDetalle").prop('disabled', true);
        }
    });

    $("input[name=informante]").change((event) => {
        if ($("#informanteSI").prop("checked")) {
            $("#muestraInformante").hide();
            $("#nombreInformante").prop('disabled', true);
            $("#telefonoInformante").prop('disabled', true);


        }
        if ($("#informanteNO").prop("checked")) {
            $("#muestraInformante").show();
            $("#nombreInformante").prop('disabled', false);
            $("#telefonoInformante").prop('disabled', false);


        }
    });

    $("input[name=ayudaAnterior]").change((event) => {
        if ($("#ayudaAnteriorSI").prop("checked")) {
            $("#muestraAyuda").show();
            $("#descripcionAyuda").prop('disabled', false);

        }
        if ($("#ayudaAnteriorNO").prop("checked")) {
            $("#muestraAyuda").hide();
            $("#descripcionAyuda").prop('disabled', true);

        }
    });

    //Envio de peticiones de datos de catalogo y a la base de datos
    ipc.send("requestCiudadanoList", "");
    ipc.send("expedienteFormGetParentesco", "");
    ipc.send("expedienteFormGetEscolaridad", "");
    ipc.send("expedienteFormGetEstadoCivil", "");
    ipc.send("expedienteFormGetTecho", "");
    ipc.send("expedienteFormGetPared", "");
    ipc.send("expedienteFormGetPosesion", "");
    ipc.send("expedienteFormGetPiso", "");
    ipc.send("expedienteFormGetMedio", "");

    $("#FormFamiliares").submit((event, args) => {
        event.preventDefault();
        let data = new FormData(document.querySelector("#FormFamiliares"));
        data.append("codPersona", codPersona);
        ipc.send("addFamiliarRequest", JSON.stringify(Object.fromEntries(data)));
        document.querySelector("#FormFamiliares").reset();
    });

    $("#FormExpediente").submit((event, args) => {
        event.preventDefault();
        let data = new FormData(document.querySelector("#FormExpediente"));
        data.append("codPersona", codPersona);
        data.append("idExpediente", idExpediente);
        ipc.send("submitExpedienteData", JSON.stringify(Object.fromEntries(data)));
        document.querySelector("#FormExpediente").reset();
    });
});

function sumaIngresos() {
    $("#TotalTotal").text(Number($("#ingresos").val()) + ingresoFamiliar);
}