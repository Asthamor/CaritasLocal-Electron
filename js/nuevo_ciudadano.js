/*jshint esversion: 8 */
var Promise = require('bluebird');


document.addEventListener('newFormLoaded', () => {
    const electron = require("electron");
    const ipc = electron.ipcRenderer;
    const Swal = require('sweetalert2');


    $('#FormNuevoCiudadano').validator();
    $('.form-group').on('focus', () => {
        $('.form-line', this).addClass('focused');
    });
    $('.form-group').on('blur', () => {
        $('.form-line', this).removeClass('focused');
    });
    $("#fechaNacimiento").bootstrapMaterialDatePicker({
        format: dateLocale,
        lang: 'es',
        clearButton: true,
        weekStart: 1,
        okText: 'Aceptar',
        cancelText: 'Cancelar',
        clearText: 'Limpiar',
        time: false,
        maxDate: new Date(),
    }).on('change', function (e, date) {
        let fechaNac = moment(date).format(dateLocale);
        let fechaAct = moment();
        calculateAge(fechaAct, fechaNac);
        $(".cssedad").addClass('focused');
        $(".cssfechaNacimiento").addClass('focused');
        $("#curp").focus();
    });


    $('#listEstado').on('change', (e) => {
        var idEstado = $('#listEstado').val();
        getMunicipios(idEstado);
    });



    getStatesList();

    async function getStatesList() {
        ipc.send("ciudadanoFormGetStates", '');
    }
    ipc.on('StatesSent', (event, args) => {
        for (var val of args) {
            $(new Option(val.nombre, val.idEstado)).appendTo("#listEstado");
        }
    });

    async function getMunicipios(state) {
        ipc.send("ciudadanoFormGetMunicipio", {
            idState: state
        });
    }

    ipc.on('MunicipiosSent', (event, args) => {
        $('#listMunicipio').children().remove(':not(:first)');
        for (var val of args) {
            $(new Option(val.NOMBRE, val.idMunicipio)).appendTo("#listMunicipio");
        }
    });

    function calculateAge(date_now, birth_date) {
        var dateNow = moment(date_now);
        var birthDate = moment(birth_date);
        var years = dateNow.diff(birthDate, 'year');
        if (years) {
            $('#edad').val(years);
        }
    }

    $('#FormNuevoCiudadano').validator().on('submit', (e) => {

        if (e.isDefaultPrevented()) {} else {
            e.preventDefault();
            var data = {
                name: $('#nombre').val(),
                paterno: $('#paterno').val(),
                materno: $('#materno').val(),
                listSexo: $('#listSexo').val(),
                fechaNacimiento: $('#fechaNacimiento').val(),
                edad: $('#edad').val(),
                curp: $('#curp').val(),
                ine: $('#ine').val(),
                rfc: $('#rfc').val(),
                calle: $('#calle').val(),
                numero: $('#no').val(),
                colonia: $('#colonia').val(),
                estado: $('#listEstado').val(),
                municipio: $('#listMunicipio').val(),
                codigoPostal: $('#cp').val(),
                telefono: $('#telefono').val(),
                celular: $('#celular').val(),
                correo: $('#correo').val(),
            };
            ipc.send('NewCiudadanoSubmit', data);
        }

    });

    ipc.on('CiudadanoSubmitted', (event, args) => {
        const {
            success,
            folio,
            errors
        } = args;

        if (success == true) {
            document.getElementById("FormNuevoCiudadano").reset();
            Swal.fire({
                titleText: 'Éxito',
                text: `Persona registrada con el folio ${folio}`,
                type: 'success'
            }).then((result) => {
                Swal.fire({
                    titleText: 'Expediente',
                    text: '¿Desea iniciar su expediente?',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Sí',
                    cancelButtonText: 'No, apoyo directo',
                    heightAuto: false,
                }).then((result) => {
                    let data = {
                        folioPersona: folio,
                    }
                    ipc.send('getExpediente', data);
                }, (dismiss) => {
                    //GO to ininciar caso Mostrar datos del ciudadano
                    alert('iniciar caso');
                });
            });



        } else {
            Swal.fire({
                title: '¡Error!',
                html: errors.join('<br>'),
                type: 'error',
            });

        }

    });



});