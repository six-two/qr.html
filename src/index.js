import "./index.css";
const QRCode = require('qrcode');

const setVisibility = (element, is_visible) => {
  if (is_visible){
    element.style.display = "block";
  } else {
    element.style.display = "none";
  }
};


const qr_init = () => {
  const input_area = document.getElementById("input");
  const error_box = document.getElementById("error");

  const img = document.getElementById("qr-img");
  const qr_link = document.getElementById("qr-link");
  const error_correction = document.getElementById("error-correction");


  const showErrorMessage = (message) => {
    console.log("Error:", message);

    error_box.innerHTML = ""; // remove current children
    const messageElement = document.createTextNode(message);
    error_box.appendChild(messageElement);

    setVisibility(error_box, true);
    setVisibility(img, false);
  };


  const updateQRCode = () => {
    const text = input_area.value;
    const options = { errorCorrectionLevel: error_correction.value };
    QRCode.toDataURL(text, options, (error, url) => {
      if (error) {
        console.error(error);
        showErrorMessage(error);
      } else {
        // console.log(url);
        img.src = url;
        qr_link.href = url;
        setVisibility(error_box, false);
        setVisibility(img, true);
      }
    });
  };

  updateQRCode();
  error_correction.addEventListener("change", updateQRCode);
  input_area.addEventListener("input", updateQRCode);
}
window.addEventListener("load", qr_init);
