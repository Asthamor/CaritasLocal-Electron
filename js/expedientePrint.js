/* jshint esversion: 8 */
const electron = require("electron");
const ipc = electron.ipcRenderer;

$(() => {
  let urlParams = new URLSearchParams(window.location.search);
  let codPersona = urlParams.get('codPersona');
  ipc.send("requestExpedientePrint", {
    codPersona: codPersona
  });

  $("#btnPrint").click((event) => {
    $("#btnPrint").hide();
    ipc.send("printDocumentExpediente", {});
  });
  ipc.on("printed", (event, args) => {
    $("#btnPrint").show();

  });


});


ipc.on("expedientePrintResponseSent", async (event, args) => {
  const {
    persona,
    medio,
  } = args.data;
  const {
    direccion,
    contacto,
    datosFamiliares,
  } = persona;
  const {} = args.data;
  $("#nombre").text(persona.nombrePersona);
  $("#paterno").text(persona.paternoPersona);
  $("#materno").text(persona.maternoPersona);
  let sexo = persona.sexo == 'M' ? "Masculino" : "Femenino";
  $("#sexo").text(sexo);
  let birthDate = new Date(persona.fechaNacimientoP);
  $("#nacimiento").text(`${birthDate.getDate()}/${birthDate.getMonth() + 1}/${birthDate.getFullYear()}`);
  $("#edad").text(persona.edad);
  let curp = persona.curp ? persona.curp : "No disponible";
  let rfc = persona.rfc ? persona.rfc : "No disponible";
  let ife = persona.ife ? persona.ife : "No disponible";
  $("#curp").text(curp);
  $("#ife").text(ife);
  $("#rfc").text(rfc);
  $("#direccion")
    .text(`${direccion.calle} ${direccion.no} ${direccion.colonia} ${direccion.cp}, 
      ${direccion.municipio.NOMBRE}, ${direccion.estado.nombre}`);
  let telefono = contacto.telefono ? contacto.telefono : "No disponible";
  let celular = contacto.celular ? contacto.celular : "No disponible";
  let correo = contacto.correo ? contacto.correo : "No disponible";
  $("#telefono").text(telefono);
  $("#celular").text(celular);
  $("#email").text(correo);
  if (datosFamiliares.length > 0) {
    let familiarHtml;
    await fetch("../Casos/expedientePrintFamiliar.html")
      .then(response => response.text())
      .then(data => familiarHtml = data);
    for (var thisfamiliar of datosFamiliares) {
      let familiarSection = format(
        familiarHtml, thisfamiliar.parentesco.parentesco, thisfamiliar.nombreCompleto, thisfamiliar.edad,
        thisfamiliar.ocupacion, thisfamiliar.escolaridad.Escolaridad, thisfamiliar.observacion,
        `$${thisfamiliar.ingresosMensuales}`);
      $("#familiar").append(familiarSection);
    }
  }
  let familiaresTotales = datosFamiliares
    .map(item => Number(item.ingresosMensuales));
  let ingresosFamiliares = familiaresTotales.reduce((a, b) => Number(a) + Number(b), 0);
  let ingresosMensuales = args.data.ingresosMensuales;
  $("#IngresoTotal").text(`$${Number(ingresosFamiliares) + Number(ingresosMensuales)}`);
  $("#AsistenciaMedica").text(args.data.asistenciaMedica);
  $("#Techo").text(args.data.techo.tipoTecho);
  $("#Pared").text(args.data.pared.tipoPared);
  $("#Posesion").text(args.data.posesion.posesion);
  $("#Piso").text(args.data.piso.tipoPiso);
  $("#noCuartos").text(args.data.noCuartos);
  $("#pagaRenta").text(args.data.pagaRenta);
  $("#pagoRenta").text(`$${args.data.pagoRenta}`);
  $("#visitaDomiciliar").text(args.data.visitaDomiciliar);
  $("#descripcionVisita").text(args.data.descripcionVisita);
  $("#observacionesVisita").text(args.data.observacionesVisita);
  $("#informante").text(args.data.informante);
  $("#tipoMedio").text(medio.nombreMedio);
  $("#nombreMedio").text(args.data.nombreMedio);
  $("#nombreInformante").text(args.data.nombreInformante);
  $("#telefonoInformante").text(args.data.telefonoInformante);
  $("#ayudaAnterior").text(args.data.ayudaAnterior);
  $("#descripcionAyuda").text(args.data.descripcionAyuda);
});

function format(fmt, ...args) {
  if (!fmt.match(/^(?:(?:(?:[^{}]|(?:\{\{)|(?:\}\}))+)|(?:\{[0-9]+\}))+$/)) {
    throw new Error('invalid format string.');
  }
  return fmt.replace(/((?:[^{}]|(?:\{\{)|(?:\}\}))+)|(?:\{([0-9]+)\})/g, (m, str, index) => {
    if (str) {
      return str.replace(/(?:{{)|(?:}})/g, m => m[0]);
    } else {
      if (index >= args.length) {
        throw new Error('argument index is out of range in format');
      }
      return args[index];
    }
  });
}