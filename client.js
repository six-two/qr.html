console.log("QR code generator for PCM by github.com/maggie-lagos")

const input_textarea = document.getElementById("input");
const result_qr = document.getElementById("result-qr");
const result_msg = document.getElementById("result-msg");
const download_btn = document.getElementById("download");
const copy_btn = document.getElementById("copy-to-clip");

const showError = (message) => {
    result_qr.innerHTML = '';
    
    result_msg.innerHTML = `${message}`;
    result_msg.className = "error"
    result_msg.style.display = "block";    
}

var currentQrCode

const generateQR = () => {
    const text = input_textarea.value;
    if (!text) {
        showError("Please type text first to generate your QR code.");
        return
    }

    const qrSize = result_qr.offsetWidth/2;
    try {
        qrCode = new QRCodeStyling({
            width: qrSize,
            height: qrSize,
            type: "svg",
            data: text,
            image: "https://pcm-maggie.s3.amazonaws.com/pcm-logo.png",
            dotsOptions: {
                color: "#471b12",
                type: "square"
            },
            imageOptions: {
                crossOrigin: "anonymous",
                margin: 0
            },
        });

        result_qr.innerHTML = '';
        result_msg.style.display = "none";

        qrCode.append(result_qr);
        currentQrCode = qrCode;
    } catch (error) {
        console.log(error)
        showError("Failed to generate the QR code! Please try a different input.");
    }
}

const downloadQR = () => {
    if (!currentQrCode){
        showError("Please type text first to generate your QR code.");
    }

    currentQrCode.getRawData("png").then((pngBlob) => {
        let blobUrl = URL.createObjectURL(pngBlob);

        let link = document.createElement('a');
        link.download = 'pcm-qr.png';
        link.href = blobUrl
        link.click();
    });
}

const copyQR = () => {
    if (!currentQrCode){
        showError("Please type text first to generate your QR code.");
    }

    currentQrCode.getRawData("png").then((pngBlob) => {
        let item = new ClipboardItem({ "image/png": pngBlob });
        navigator.clipboard.write([item]); 
    });
}

// Remove initial no-JS warning
window.addEventListener("load", () => {
    result_msg.style.display = "none";
})

input_textarea.addEventListener("input", generateQR);
window.addEventListener("resize", generateQR);  // resize here because QR size is set as px by qr library, not CSS

download_btn.addEventListener("click", downloadQR);
copy_btn.addEventListener("click", copyQR);

