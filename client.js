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

const header = document.getElementById("header");
const text_and_qr = document.getElementById("text-and-qr");

const input_textarea = document.getElementById("input");
const input_error = document.getElementById("input-error");

const result = document.getElementById("result-div");
const result_qr = document.getElementById("result-qr");
const result_msg = document.getElementById("result-msg");

// Size of the QR code in pixels. Set it to 0 to automatically fit the free space
let QR_MIN_SIZE = get_or_default_int("QR_MIN_SIZE", 30); //in pixels
let QR_MAX_SIZE = get_or_default_int("QR_MAX_SIZE", Infinity); // in pixels


window.addEventListener("load", () => {
    result_msg.style.display = "none";
})

const PADDING = 10; // 5px on any side for the text-and-qr element -> always 10px in total

const showInputError = (message) => {
    // escape message before showing
    if (message) {
        input_error.innerHTML = ""; // remove current children
        const messageElement = document.createTextNode(message);
        input_error.appendChild(messageElement);
        input_error.style.display = "block";
    } else {
        input_error.style.display = "none";
    }
}

const updateResultMsg = (message, isErr) => {
    result_qr.innerHTML = '';
    
    result_msg.innerHTML = `${message}`;
    result_msg.className = isErr ? "error": "info";
    result_msg.style.display = "block";    
}

const on_window_resize = () => {
    const width = text_and_qr.clientWidth;
    const height = text_and_qr.clientHeight;
    if (!width || !height) {
        console.warn(`Size cannot be 0 or undefined. But size is (${width}, ${height})`)
    }

    const toStyleValue = (size_in_pixels) => {
        return `${Math.max(size_in_pixels - PADDING, 0)}px`
    }
    if (width < height) {
        const remaining_height = document.body.clientHeight - header.clientHeight - 100; // 100 is the minimum height of the input area div
        // portrait view -> vertical
        text_and_qr.style.flexDirection = "column";
        result_qr.style.maxWidth = "";
        result_qr.style.maxHeight = toStyleValue(Math.min(width, remaining_height));
    } else {
        // landscape view -> horizontal
        const remaining_width = document.body.clientWidth - 200; // 200 is the minimum width of the input area div
        text_and_qr.style.flexDirection = "row";
        result_qr.style.maxWidth = toStyleValue(Math.min(height, remaining_width));
        // Workaround for QR code not shrinking
        result_qr.style.maxHeight = toStyleValue(document.body.clientHeight - header.clientHeight);
    }

    generateQR();
};

const generateQR = () => {
    const text = input_textarea.value;

    if (!text) {
        updateResultMsg("You need to type some text in the input area! It will then be rendered as a QR code.", true);
        return
    }

    try {
        qrCode = new QRCodeStyling({
            width: 400,
            height: 400,
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

        updateResultMsg("Use Camera App to scan.", false)   // also clears previous QR code
        qrCode.append(result_qr);
    } catch (error) {
        updateResultMsg("Failed to generate the QR code! Please try a different input.", true);
    }
}

// Call resize shortly after loading the page to determine the inital layout
setTimeout(on_window_resize, 10);

// Update the QR code whenever the text or the window size changes
// Use max-width/height to keep the QR code div in square shape and allow the textarea to use the remaining space
input_textarea.addEventListener("input", generateQR);
