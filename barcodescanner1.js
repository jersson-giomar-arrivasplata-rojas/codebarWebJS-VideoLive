//= require quagga
//= require_tree .

function order_by_occurrence(arr) {
    var counts = {};
    arr.forEach(function(value) {
        if (!counts[value]) {
            counts[value] = 0;
        }
        counts[value]++;
    });

    return Object.keys(counts).sort(function(curKey, nextKey) {
        return counts[curKey] < counts[nextKey];
    });
}

function load_quagga() {
    if ($('#barcode-scanner').length > 0 && navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function') {

        var last_result = [];
        if (Quagga.initialized == undefined) {
            Quagga.onDetected(function(result) {
                var last_code = result.codeResult.code;
                //last_result.push(last_code);
                if (last_code.length > 12) {
                    //code = order_by_occurrence(last_result)[0];
                    //last_result = [];
                    //Quagga.stop();
                    $.get(`https://snapstore.devinnovaperu.com/api/product-code-number/${last_code}/get`, function(data) {
                        var product = JSON.parse(data)[0];
                        $('#add').empty()
                        $('#add').append('<ul>' +
                            '<li>Precio: ' + product.price + '</li>' +
                            '<li>Stock: ' + product.stock + '</li>' +
                            '<li>Name: ' + product.name + '</li>' +
                            '<li>Descuento: ' + product.discounted + '</li>' +
                            '<li>Peso: ' + product.weigth_or_measure + '</li>' +
                            '<li>Producto venta por unidad: ' + product.product_sale_unit + '</li>' +
                            '<li>Producto venta por peso: ' + product.product_sale_weigth + '</li>' +
                            '<li>Descripción: ' + product.description + '</li>' +
                            '</ul>');
                    });

                }
            });
        }

        Quagga.init({
            inputStream: {
                name: "Live",
                type: "LiveStream",
                numOfWorkers: navigator.hardwareConcurrency,
                target: document.querySelector('#barcode-scanner')
            },
            decoder: {
                readers: ['ean_reader', 'ean_8_reader', 'code_39_reader', 'code_39_vin_reader', 'codabar_reader', 'upc_reader', 'upc_e_reader']
            }
        }, function(err) {
            if (err) { console.log(err); return }
            Quagga.initialized = true;
            Quagga.start();
        });

    }
};
$(document).ready(function() {
    load_quagga()
});