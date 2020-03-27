BarcodeScanner = {};

BarcodeScanner.StartScanning = function() {
    BarcodeScanner.DecodedCodesCount = 0;
    BarcodeScanner.DecodedCodesErrorCount = 0;

    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: document.querySelector("#barcodescanner-livestream"),
            constraints: {
                width: 300,
                height: 350,
                facingMode: "environment"
            }
        },
        locator: {
            patchSize: "large", // x-small, small, medium, large, x-large
            halfSample: false,
            debug: {
                showCanvas: true,
                showPatches: true,
                showFoundPatches: true,
                showSkeleton: true,
                showLabels: true,
                showPatchLabels: true,
                showRemainingPatchLabels: true,
                boxFromPatches: {
                    showTransformed: true,
                    showTransformedBox: true,
                    showBB: true
                }
            }
        },
        numOfWorkers: 2,
        frequency: 10,
        decoder: {
            readers: [
                "code_128_reader",
                "ean_reader",
                "ean_8_reader",
                "code_39_reader",
                "code_39_vin_reader",
                "codabar_reader",
                "upc_reader",
                "upc_e_reader",
                "i2of5_reader"
            ],
            debug: {
                showCanvas: true,
                showPatches: true,
                showFoundPatches: true,
                showSkeleton: true,
                showLabels: true,
                showPatchLabels: true,
                showRemainingPatchLabels: true,
                boxFromPatches: {
                    showTransformed: true,
                    showTransformedBox: true,
                    showBB: true
                }
            }
        },
        locate: true
    }, function(error) {
        if (error) {
            //Grocy.FrontendHelpers.ShowGenericError("Error while initializing the barcode scanning library", error.message);
            toastr.info("Camera access is only possible when supported and allowed by your browser and when grocy is served via a secure (https://) connection");
            setTimeout(function() {
                bootbox.hideAll();
            }, 500);
            return;
        }
        Quagga.start();
    });
}

BarcodeScanner.StopScanning = function() {
        Quagga.stop();

        BarcodeScanner.DecodedCodesCount = 0;
        BarcodeScanner.DecodedCodesErrorCount = 0;

        bootbox.hideAll();
    }
    /*
    Quagga.onDetected(function(result) {
        $.each(result.codeResult.decodedCodes, function(id, error) {
            if (error.error != undefined) {
                BarcodeScanner.DecodedCodesCount++;
                BarcodeScanner.DecodedCodesErrorCount += parseFloat(error.error);
            }
        });

        if (BarcodeScanner.DecodedCodesErrorCount / BarcodeScanner.DecodedCodesCount < 0.15) {
            BarcodeScanner.StopScanning();
            $(document).trigger("Grocy.BarcodeScanned", [result.codeResult.code]);
        }
    });*/
Quagga.onDetected(function(result) { //result.codeResult.startInfo.error < 0.0009 && 
    if ((result.codeResult.code).length > 12) {
        var code = result.codeResult.code,
            $node,
            canvas = Quagga.canvas.dom.image;

        $("#result_strip ul.thumbnails").empty()
        $node = $('<li><div class="thumbnail"><div class="imgWrapper"><img /></div><div class="caption"><h4 class="code"></h4></div></div></li>');
        $node.find("img").attr("src", canvas.toDataURL());
        $node.find("h4.code").html(code);
        $("#result_strip ul.thumbnails").prepend($node);
        $.get(`https://snapstore.devinnovaperu.com/api/product-code-number/${code}/get`, function(data) {
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
Quagga.onProcessed(function(result) {
    var drawingCtx = Quagga.canvas.ctx.overlay;
    var drawingCanvas = Quagga.canvas.dom.overlay;

    if (result) {
        if (result.boxes) {
            drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
            result.boxes.filter(function(box) {
                return box !== result.box;
            }).forEach(function(box) {
                Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: "yellow", lineWidth: 4 });
            });
        }

        if (result.box) {
            Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: "green", lineWidth: 4 });
        }

        if (result.codeResult && result.codeResult.code) {
            Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: "red", lineWidth: 4 });
        }
    }
});

$(document).ready(function() {
    BarcodeScanner.StartScanning();

})

/*
setTimeout(function() {
    $(".barcodescanner-input:visible").each(function() {
        if ($(this).hasAttr("disabled")) {
            $(this).after('<a id="barcodescanner-start-button" class="btn btn-sm btn-primary text-white disabled"><i class="fas fa-camera"></i></a>');
        } else {
            $(this).after('<a id="barcodescanner-start-button" class="btn btn-sm btn-primary text-white"><i class="fas fa-camera"></i></a>');
        }
    });
}, 50);
*/

/* $("#barcodescanner-start-button", ).on("click", function(e) {
        e.preventDefault();
        var inputElement = $(e.currentTarget).prev();
        if (inputElement.hasAttr("disabled")) {
        	// Do nothing and disable the barcode scanner start button
        	$(e.currentTarget).addClass("disabled");
        	return;
        }*/

/*bootbox.dialog({
	message: '<div id="barcodescanner-container" class="col"><div id="barcodescanner-livestream"></div></div>',
	title: 'Scan a barcode',
	onEscape: function() {
		BarcodeScanner.StopScanning();
	},
	size: 'big',
	backdrop: true,
	closeButton: true,
	buttons: {
		torch: {
			label: '<i class="far fa-lightbulb"></i>',
			className: 'btn-warning responsive-button',
			callback: function() {
				Quagga.CameraAccess.getActiveTrack().applyConstraints({ advanced: [{ torch: true }] });
				return false;
			}
		},
		cancel: {
			label: 'Cancel',
			className: 'btn-secondary responsive-button',
			callback: function() {
				BarcodeScanner.StopScanning();
			}
		}
	}
});
BarcodeScanner.StartScanning();
});*/