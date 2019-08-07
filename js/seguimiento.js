/* jshint esversion: 8 */


document.addEventListener("seguimientoFormLoaded", async (event) => {
  ipc.send("getCasosSeguimiento", {});
});

ipc.on("TablaSituacionesData", (event, args) => {
  inicializarTablaSeguimientos();
  for (var situacion of args.situaciones) {
    addSeguimientoRow(situacion);
  }
  let tablaSeguimiento = $("#TablaSeguimiento").DataTable();
  tablaSeguimiento.draw();
});

ipc.on("TablaSituacionError", (event, args) => {
  swal.fire({
    "title": "No se pudieron cargar los datos de seguimiento",
    "type": "error",
  });
});


function inicializarTablaSeguimientos() {
  let tablaSeguimiento = $("#TablaSeguimiento").DataTable({
    "responsive": true,
    "columns": [{
      "name": "folio",
      "width": "8%",

    }, {
      "name": "fecha",
      "width": "8%",
    }, {
      "name": "nombre",
    }, {
      "name": "tipoApoyo",
      "width": "7%",
    }, {
      "name": "respuesta",
      "width": "6%",
    }, {
      "name": "descripcion",
    }, {
      "name": "estatus",
      render: (data, type, row) => {
        switch (data) {
          case "Entregado - Urgente":
            return "<i class='material-icons'>alarm_on</i><br/>" + data;
          case "Entregado":
            return "<i class='material-icons'>check_circle_outline</i><br/>" + data;
          case "En gestión":
            return "<i class='material-icons'>alarm_off</i><br/>" + data;
          case "En gestión - Urgente":
            return "<i class='material-icons'>access_alarm</i><br/>" + data;
        }
      },
      "width": "8%",


    }, {
      "name": "seguimiento",
    }, {
      "name": "verSeguimiento",
    }],
    "columnDefs": [{
      targets: 6,
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
    }, {
      targets: 7, //-1 es la ultima columna y 0 la primera
      data: null,
      width: "8%",
      defaultContent: '<button type="button" class="btn btn-outline bg-blue waves-effect waves-float btn-tbl seg-btn btn-block" title="Seguimiento"><span><i class="material-icons">book</i><br/>Seguimiento</span></button>',
      createdCell: (td, cellData, rowData, row, col) => {
        $(td).addClass("text-center");
      }
    }, {
      targets: 8,
      data: null,
      width: "8%",
      defaultContent: '<button type="button" class="btn btn-outline bg-blue waves-effect waves-float btn-tbl view-seg-btn btn-block" title="Seguimiento"><span><i class="material-icons">visibility</i><br/>Ver seguimiento</span></button>',
      createdCell: (td, cellData, rowData, row, col) => {
        $(td).addClass("text-center");
      }
    }, ],
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

  $('#TablaSeguimiento tbody').on('click', '.seg-btn', async function () {
    let data = tablaSeguimiento.row($(this).parents('tr')).data();
    const {
      value: formValues
    } = await swal.fire({
      title: '¿Se entregó el apoyo al ciudadano?',
      html: `<div class="row">
  <input type="hidden" id="folioApoyo" value="${data[0]}" name="folioApoyo">
  <div class="col-md-12 form-group form-float text-center">
    <div class="radio-inline">
      <label>
        <input type="radio" id="SiEntregado" value="SI" name="entregado" class="browser-default">Sí se
        entregó
      </label>
    </div>
    <div class="radio-inline">
      <label>
        <input type="radio" id="NoEntregado" value="NO" name="entregado" class="browser-default">
        No se entregó
      </label>
    </div>
    <div class="radio-inline">
      <label>
        <input type="radio" id="enGestion" value="gestion" name="entregado" class="browser-default">
        En gestión
      </label>
    </div>
  </div>
</div>

<div class="row">
  <div class="col-md-12 form-group text-left">
    <label for="observacionModal">Observación:</label>
    <textarea class="form-control" placeholder="Escriba la descripción del seguimiento" id="observacionModal"
      name="observacionModal" rows="3"></textarea>
  </div>
</div>
<div class="row">
  <div class="col-md-12 form-group text-left">
    <label for="fechaModal">Fecha:</label>
    <input type="date" class="form-control" id="fechaModal" name="fechaModal">
  </div>
</div>`,
      focusConfirm: false,
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Registrar seguimiento",
      preConfirm: () => {
        return [
          document.getElementById('swal-input1').value,
          document.getElementById('swal-input2').value
        ]
      }
    });

    if (formValues) {
      swal.fire(JSON.stringify(formValues))
    }


  });

}
async function addSeguimientoRow(seguimiento) {
  const {
    folioApoyo,
    fechaRegistro,
    descripcionApoyo,
  } = seguimiento;
  const {
    nombrePersona,
    maternoPersona,
    paternoPersona,
  } = seguimiento.caso.persona;
  const {
    tipoApoyo,
  } = seguimiento.tipo_Apoyo;
  const {
    tipoRespuesta,
  } = seguimiento.tipo_Respuesta;
  let tablaSeguimiento = $("#TablaSeguimiento").DataTable();

  let estado = seguimiento.urgente === "NO" ?
    (seguimiento.entregado === "SI") ?
    "Entregado" :
    "En gestión" :
    (seguimiento.entregado === "SI") ?
    "Entregado - Urgente" :
    "En gestión - Urgente";
  tablaSeguimiento.row
    .add([
      `${folioApoyo}`,
      `${fechaRegistro}`,
      `${nombrePersona} ${maternoPersona} ${paternoPersona}`,
      `${tipoApoyo}`,
      `${tipoRespuesta}`,
      `${descripcionApoyo}`,
      `${estado}`,
    ]);
}