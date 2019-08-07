/* jshint esversion: 8 */

let codPersonaG = '';

ipc.on("responseSituacionCiudadanoList", (event, args) => {
  /*---- Selectize para busqueda de beneficiarios ---- */
  $("#listCiudadanoSituacion").selectize({
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
      getExpedienteSituacion(value);
    }
  });
});

async function getExpedienteSituacion(codPersona) {
  ipc.send("requestSituacionExpediente", {
    codPersona: codPersona
  });
}


ipc.on("expedienteSituacionResponseSent", (event, args) => {
  const {
    persona,
    ingresosMensuales,
    techo,
    piso,
    posesion,
    pared,
    codPersona,
  } = args.data;
  $("#ApoyoDetalles").hide();
  $("#datosPersonalesNombre")
    .text(`${persona.nombrePersona} ${persona.paternoPersona} ${persona.maternoPersona}`);
  $("#datosPersonalesDireccion")
    .text(`${persona.direccion.calle} ${persona.direccion.no} ${persona.direccion.colonia} 
    ${persona.direccion.cp} ${persona.direccion.municipio.NOMBRE}, ${persona.direccion.estado.nombre}`);
  $("#datosPersonalesContacto")
    .text(`${persona.contacto.telefono} | ${persona.contacto.celular} | ${persona.contacto.correo}`);
  if (persona.datosFamiliares.length) {
    if (persona.datosFamiliares.length > 1) {
      $("#datosPersonalesFamiliares").text(`${persona.datosFamiliares.length} Familiares`);
    } else {
      $("#datosPersonalesFamiliares").text(`${persona.datosFamiliares.length} Familiar`);
    }
  } else {
    $("#datosPersonalesFamiliares").text(`Sin familiares`);
  }
  $("#datosPersonalesIngresos").text(`$${ingresosMensuales}`);
  $("#datosPersonalesVivienda")
    .text(`Techo:${techo.tipoTecho} | 
            Piso:${piso.tipoPiso} | 
            Pared:${pared.tipoPared} | 
            Posesion:${posesion.posesion}`);
  let urlParams = new URLSearchParams();
  urlParams.set('codPersona', `${codPersona}`);
  let url = (`Casos/expediente_Print.html?${urlParams.toString()}`);
  $("#printExpedienteA").prop("href", url);
  codPersonaG = codPersona;

  $("#InformacionCompletaExpediente").show();
});


ipc.on("FolioCreado", async (event, args) => {
  swal.fire({
    title: `Situación generada con el folio: ${args.folio}`,
    type: 'success',
  });
  $("#idCaso").val(args.idCaso);
  $("#metodo").val('save');
  await inicializatTablaApoyos();
  $("#ApoyoDetalles").show();
});


ipc.on("FolioRecuperado", async (event, args) => {
  swal.fire({
    title: `Situación generada con el folio recuperado: ${args.folio}`,
    type: 'success',
  });
  $("#idCaso").val(args.idCaso);
  $("#metodo").val('update');
  let tablaApoyos = await inicializatTablaApoyos();
  for (var apoyo of args.apoyos) {
    addApoyoRow(apoyo);
  }
  $("#ApoyoDetalles").show();
});

async function addApoyoRow(apoyo) {
  let tablaApoyos = $("#TablaApoyos").DataTable();
  let start = moment(apoyo.fechaInicioA, 'YYYY-M-D');
  let end = moment(apoyo.fechaFinA, 'YYYY-M-D');
  let duration = moment.duration(end.diff(start));
  let estado = apoyo.urgente === "NO" ?
    (apoyo.entregado === "SI") ?
    "Entregado" :
    "En gestión" :
    (apoyo.entregado === "SI") ?
    "Entregado - Urgente" :
    "En gestión - Urgente";
  tablaApoyos.row
    .add([
      `${apoyo.folioApoyo}`,
      `${apoyo.tipo_Apoyo.tipoApoyo}`,
      `${apoyo.frecuencia.Frecuencia}`,
      `${duration.days()} días, ${duration.months()} meses, ${duration.years()} años`,
      `${apoyo.descripcionApoyo}`,
      `${estado}`,
    ]).draw();
}

ipc.on("SituacionSaved", (event, args) => {
  swal.fire({
    type: "success",
    text: "Situación guardada",
  });
  $("#DescripcionCaso").val("");
  $("#idCaso").val("");
  $("#ApoyoDetalles").hide();
  $("#TablaApoyos").DataTable().clear();
  $("#FormNuevoApoyo").reset();
});

ipc.on("SituacionSaveError", (event, args) => {
  swal.fire({
    type: "error",
    text: "No se pudo guardar la situacion",
  });
})

ipc.on("ERRORCrearFolio", (event, args) => {
  swal.fire({
    title: `No se pudo crear un folio para el caso`,
    type: 'error',
  });

});

document.addEventListener("situacionFormLoaded", (event) => {

  ipc.send("requestCombosSituacion", "");
  $("#FechaInicio").bootstrapMaterialDatePicker({
    format: "DD/MM/YYYY",
    lang: 'es',
    clearButton: true,
    weekStart: 1,
    okText: 'Aceptar',
    cancelText: 'Cancelar',
    clearText: 'Limpiar',
    time: false,
  }).on('change', (e, date) => {
    $("#FechaFinal").bootstrapMaterialDatePicker('setDate', date);
    $("#FechaFinal").bootstrapMaterialDatePicker('setMinDate', date);
  });

  $("#FechaFinal").bootstrapMaterialDatePicker({
    format: 'DD/MM/YYYY',
    lang: 'es',
    clearButton: true,
    weekStart: 1,
    okText: 'Aceptar',
    cancelText: 'Cancelar',
    clearText: 'Limpiar',
    time: false,
    minDate: new Date(),
  }).on('change', function (e, date) {
    let start = moment($('#FechaInicio').val(), 'D-M-YYYY');
    let end = moment($('#FechaFinal').val(), 'D-M-YYYY');
    let duration = moment.duration(end.diff(start));
    $('#periodoFecha').text(`${duration.days()} días, ${duration.months()} meses, ${duration.years()} años`);
    $("#periodoFechaInput").val(`${duration.days()} días, ${duration.months()} meses, ${duration.years()} años`);
  });


  $("#btnFolioCaso").click(() => {
    ipc.send("GenerarFolioCaso", {
      codPersona: codPersonaG,
    });
  });

  $("#btnGuardarSituacion").click(() => {
    let desc = $.trim($("#DescripcionCaso").val());
    if (desc) {
      ipc.send("GuardarSituacion", {
        idCaso: $("#idCaso").val(),
        descripcion: $("#DescripcionCaso").val(),
      });
    } else {
      swal.fire({
        type: "warning",
        text: "Ingrese una descripción de situación",
      });
    }
  });

  $("#btnCancelarSituacion").click(() => {
    swal.fire({
      title: '¿Eliminar situación?',
      text: "Se descartarán todos los apoyos registrados para esta situación",
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: "No",
    }).then((result) => {
      if (result.value) {
        ipc.send("EliminarSituacion", {
          idCaso: $("#idCaso").val(),
        });
      }
    });
  });

  ipc.send("requestSituacionCiudadanoList", "");


});

ipc.on("situacionFormDataLoaded", (event, args) => {
  for (let val of args.frecuencias) {
    $(new Option(val.Frecuencia, val.idFrecuencia)).appendTo("#listFrecuencia");
  }
  for (let val of args.tipoApoyo) {
    $(new Option(val.tipoApoyo, val.idTipoApoyo)).appendTo("#listTipoApoyo");
  }
  for (let val of args.tipoRespuesta) {
    $(new Option(val.tipoRespuesta, val.idTipoRespuesta)).appendTo("#listTipoRespuesta");
  }

  $("#FormNuevoApoyo").submit((event) => {
    event.preventDefault();
    let data = new FormData(document.querySelector("#FormNuevoApoyo"));
    data = Object.fromEntries(data);
    ipc.send("NuevoApoyoSubmit", data);
  });
});

ipc.on("apoyoSaved", async (event, args) => {
  await addApoyoRow(args);
  swal.fire({
    text: "Apoyo guardado",
    type: "success",
  });
});

ipc.on("ApoyoDeleted", async (event, args) => {
  let tablaApoyos = $("#TablaApoyos").DataTable();
  let index = $("#TablaApoyos").dataTable().fnFindCellRowIndexes(args.folioToDelete, 0);
  tablaApoyos.row(index).remove().draw();
  swal.fire({
    text: "Apoyo eliminado",
    type: "success",
  });
});

ipc.on("SituacionDeleted", async (event, args) => {
  let tablaApoyos = $("#TablaApoyos").DataTable();
  tablaApoyos.clear();
  $()
  swal.fire({
    text: "Situación eliminada",
    type: "success",
  });
});


async function inicializatTablaApoyos() {
  let tablaApoyos;
  /* ---- Tabla de fmiliares con Datatables.net -----*/
  if (!$.fn.DataTable.isDataTable('#TablaApoyos')) {

    tablaApoyos = $("#TablaApoyos").DataTable({
      "responsive": true,
      "columns": [{
          "name": "folioApoyo"
        },
        {
          "name": "tipoApoyo"
        },
        {
          "name": "frecuencia"
        },
        {
          "name": "tiempo"
        },
        {
          "name": "descripcion",
        },
        {
          "name": "estatus",
          render: (data, type, row) => {
            switch (data) {
              case "Entregado - Urgente":
                return data + "<i class='material-icons'>alarm_on</i>";
              case "Entregado":
                return data + "<i class='material-icons'>check_circle_outline</i>";
              case "En gestión":
                return data + "<i class='material-icons'>alarm_off</i>";
              case "En gestión - Urgente":
                return data + "<i class='material-icons'>access_alarm</i>";
            }
          },
        },
        {
          "name": "eliminar"
        },

      ],
      "columnDefs": [{
        targets: -1, //-1 es la ultima columna y 0 la primera
        data: null,
        defaultContent: '<button type="button" class="btn bg-blue btn-xs btn-circle waves-effect waves-circle waves-float" id="delete" title="Eliminar Apoyo"><i class="material-icons">delete_forever</i></button>',
        createdCell: (td, cellData, rowData, row, col) => {
          $(td).addClass("text-center");
        }
      }, {
        targets: 5,
        createdCell: (td, cellData, rowData, row, col) => {
          if (cellData === "Entregado - Urgente") {
            $(td).addClass("bg-teal text-center");
          } else if (cellData === "Entregado") {
            $(td).addClass("bg-green text-center");
          } else if (cellData === "En gestión") {
            $(td).addClass("bg-deep-orange text-center");
          } else if (cellData === "En gestión - Urgente") {
            $(td).addClass("bg-red text-center");
          }
        }
      }],
      language: {
        "sProcessing": "Procesando...",
        "sLengthMenu": "Mostrar _MENU_ registros",
        "sZeroRecords": "No se encontraron resultados",
        "sEmptyTable": "Ningún dato disponible en esta tabla",
        "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
        "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
        "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
        "sInfoPostFix": "",
        "sSearch": "Buscar:",
        "sUrl": "",
        "sInfoThousands": ",",
        "sLoadingRecords": "Cargando...",
        "oPaginate": {
          "sFirst": "Primero",
          "sLast": "Último",
          "sNext": "Siguiente",
          "sPrevious": "Anterior"
        },
        "oAria": {
          "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
          "sSortDescending": ": Activar para ordenar la columna de manera descendente"
        }
      },
    });

    $('#TablaApoyos tbody').on('click', 'button', function () {
      let data = tablaApoyos.row($(this).parents('tr')).data();
      ipc.send("deleteApoyoRequest", {
        rowToDelete: tablaApoyos.row($(this).parents('tr')),
        folio: data[0],
      });
    });

  } else {
    $("#TablaApoyos").DataTable().clear().draw();
    tablaApoyos = $("#TablaApoyos").DataTable();
  }
  return tablaApoyos;

}