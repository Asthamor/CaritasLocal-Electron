//formatear a miles
function numberFormatMon(amount, decimals) {

    amount += ''; // por si pasan un numero en vez de un string
    amount = parseFloat(amount.replace(/[^0-9\.]/g, '')); // elimino cualquier cosa que no sea numero o punto

    decimals = decimals || 0; // por si la variable no fue fue pasada

    // si no es un numero o es igual a cero retorno el mismo cero
    if (isNaN(amount) || amount === 0)
        return parseFloat(0).toFixed(decimals);

    // si es mayor o menor que cero retorno el valor formateado como numero
    amount = '' + amount.toFixed(decimals);

    var amount_parts = amount.split('.'),
        regexp = /(\d+)(\d{3})/;

    while (regexp.test(amount_parts[0]))
        amount_parts[0] = amount_parts[0].replace(regexp, '$1' + ',' + '$2');

    return amount_parts.join('.');
}

function numberFormat(numero) {
    // Variable que contendra el resultado final
    var resultado = "";
    // Si el numero empieza por el valor "-" (numero negativo)
    if (numero[0] == "-") {
        // Cogemos el numero eliminando los posibles puntos que tenga, y sin el signo negativo
        nuevoNumero = numero.replace(/\./g, '').substring(1);
    } else {
        // Cogemos el numero eliminando los posibles puntos que tenga
        nuevoNumero = numero.replace(/\./g, '');
    }

    // Si tiene decimales, se los quitamos al numero
    if (numero.indexOf(".") >= 0)
        nuevoNumero = nuevoNumero.substring(0, nuevoNumero.indexOf("."));

    // Ponemos un punto cada 3 caracteres
    for (var j, i = nuevoNumero.length - 1, j = 0; i >= 0; i--, j++)
        resultado = nuevoNumero.charAt(i) + ((j > 0) && (j % 3 == 0) ? "," : "") + resultado;

    // Si tiene decimales, se lo a�adimos al numero una vez forateado con los separadores de miles
    if (numero.indexOf(".") >= 0)
        resultado += numero.substring(numero.indexOf(","));

    if (numero[0] == "-") {
        // Devolvemos el valor a�adiendo al inicio el signo negativo
        return "-" + resultado;
    } else {
        return resultado;
    }
}


function $_GET(param) {
    url = document.URL;
    url = String(url.match(/\?+.+/));
    url = url.replace("?", "");
    url = url.split("&");
    x = 0;
    while (x < url.length) {
        p = url[x].split("=");
        if (p[0] == param) {
            return decodeURIComponent(p[1]);
        }
        x++;
    }
}

$("#inputBusquedaEsc").keypress(function(e) {
    if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
        if ($("#inputBusquedaEsc").val().length < 6) {
            swal("Error", "Escriba más de 6 caracteres...", "error");
        } else {

            $.ajax({
                type: "POST",
                url: "Administracion/Data/AccionesCentros.php",
                data: 'metodo=validarPermiso',
                dataType: "html",
                success: function(response) {
                    if (response == 'true') {
                        window.location = 'index.php?page=Inventario/General/general&BuscarI=' + $("#inputBusquedaEsc").val();
                    } else {
                        window.location = 'index.php?page=Inventario/Centro/local&BuscarI=' + $("#inputBusquedaEsc").val();
                    }
                },
                error: function() {
                    swal("Error", "Intente nuevamente hacer la busqueda", "error");

                }
            });

        }
    }
});

function resplado() {
    $.ajax({
        type: "POST",
        url: "../sistemas/Administracion/Data/respaldo.php",
        dataType: "JSON",
        success: function(response) {
            if (response.Success == true) {
                $('#ModalDescarga').modal('toggle');
            } else {
                swal("Error", "No cuenta con permisos para esta opción", "error");
            }


        },
        error: function() {
            swal("Error", "Intente nuevamente hacer la busqueda", "error");
        }
    });
}