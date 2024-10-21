console.log("QR code generator for PCM by github.com/maggie-lagos")

const get_or_default_int = (name, default_value) => {
    const stored = localStorage.getItem(name);
    if (stored != null) {
        try {
            return parseInt(stored);
        } catch (error) {
            console.warn(`Failed to parse stored entry for '${name}'`);
        } 
    }
    return default_value;
}

const input_textarea = document.getElementById("input");
const result_qr = document.getElementById("result-qr");
const result_msg = document.getElementById("result-msg");


window.addEventListener("load", () => {
    result_msg.style.display = "none";
})

const updateResultMsg = (message, isErr) => {
    result_qr.innerHTML = '';
    
    result_msg.innerHTML = `${message}`;
    result_msg.className = isErr ? "error": "qr-message";
    result_msg.style.display = "block";    
}

const generateQR = () => {
    const text = input_textarea.value;
    if (!text) {
        updateResultMsg("Please type text first to generate your QR code.", true);
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
        //console.log(qrCode)

        updateResultMsg("Use Camera App to scan", false)   // also clears previous QR code
        qrCode.append(result_qr);
    } catch (error) {
        updateResultMsg("Failed to generate the QR code! Please try a different input.", true);
    }
}

// Update the QR code whenever the text changes
input_textarea.addEventListener("input", generateQR);
window.addEventListener("resize", generateQR);

