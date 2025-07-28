const ecMap = ["L", "M", "Q", "H"];

const qrSizeSlider = document.getElementById("qr-size");
const qrSizeLabel = document.getElementById("qr-size-label");
const ecSlider = document.getElementById("ec-slider");
const ecLabel = document.getElementById("ec-label");

const logoUploadInput = document.getElementById("logo-upload");
const removeLogoBtn = document.getElementById("remove-logo");

const qrTypeSelect = document.getElementById("qr-type");
const wifiSection = document.getElementById("wifi-section");
const qrInput = document.getElementById("qr-input");

const fileInput = logoUploadInput; // just for clarity
const uploadBtn = document.getElementById('upload-btn'); // if you have this button
const filenameDisplay = document.getElementById('upload-filename'); // if you have this element
const thumb = document.getElementById('logo-thumb');

let uploadedLogo = "";
let qrCode;

// Update error correction level label on slider input
ecSlider.addEventListener("input", () => {
  const level = ecMap[ecSlider.value];
  const levelText = { L: "Low", M: "Medium", Q: "Quartile", H: "High" };
  ecLabel.textContent = levelText[level];
});

// Toggle input sections (Wi-Fi or text) based on dropdown selection
function toggleInputSections() {
  const selected = qrTypeSelect.value;
  if (selected === "wifi") {
    wifiSection.style.display = "block";
    qrInput.style.display = "none";
  } else {
    wifiSection.style.display = "none";
    qrInput.style.display = "inline-block";
  }
}

// Run on dropdown change and on page load
qrTypeSelect.addEventListener("change", toggleInputSections);
toggleInputSections();

// Setup color pickers for foreground and background colors
const fgInput = document.getElementById("fg-color");
const bgInput = document.getElementById("bg-color");

fgInput.addEventListener("input", () => {
  // e.g., update QR foreground color preview, regenerate QR, etc.
  // Example: update some preview color or button bg if you want
});

bgInput.addEventListener("input", () => {
  // e.g., update QR background color preview or regenerate QR
});



// Download buttons handlers
document.getElementById("download-png").addEventListener("click", () => {
  if (!qrCode) return alert("Generate a QR code first!");
  qrCode.download({ extension: "png" });
});
document.getElementById("download-svg").addEventListener("click", () => {
  if (!qrCode) return alert("Generate a QR code first!");
  qrCode.download({ extension: "svg" });
});

// Update slider label on input
qrSizeSlider.addEventListener("input", () => {
  qrSizeLabel.textContent = qrSizeSlider.value + "px";
});

// Upload button opens file picker
uploadBtn.addEventListener('click', () => logoUploadInput.click());

// Handle logo upload and preview
logoUploadInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (!file) {
    filenameDisplay.textContent = 'No file chosen';
    thumb.style.display = 'none';
    thumb.src = '';
    uploadedLogo = '';
    return;
  }
  filenameDisplay.textContent = file.name;
  if (file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = e => {
      uploadedLogo = e.target.result;
      thumb.src = e.target.result;
      thumb.style.display = 'inline-block';
    };
    reader.readAsDataURL(file);
  } else {
    uploadedLogo = '';
    thumb.src = '';
    thumb.style.display = 'none';
  }
});

// Remove logo button clears logo and regenerates QR
removeLogoBtn.addEventListener("click", () => {
  uploadedLogo = "";
  logoUploadInput.value = "";
  thumb.style.display = 'none';
  thumb.src = '';
  // Clear filename
  document.getElementById("upload-filename").textContent = "No file chosen";
  // Trigger QR generation
  document.getElementById("generate-btn").click();
});

// Generate QR button click handler
document.getElementById("generate-btn").addEventListener("click", () => {
  const size = Number(qrSizeSlider.value);
  const fgColor = document.getElementById("fg-color").value;
  const bgColor = document.getElementById("bg-color").value;
  const dotStyle = document.getElementById("dot-style").value;
  const cornerStyle = document.getElementById("corner-style").value;
  const ecLevel = ecMap[ecSlider.value]; 

  let data = "";
  const qrType = qrTypeSelect.value;
  if (qrType === "wifi") {
    const ssid = document.getElementById("wifi-ssid").value;
    const password = document.getElementById("wifi-password").value;
    const security = document.getElementById("wifi-security").value;
    const hidden = document.getElementById("wifi-hidden").value; // Corrected here

    data = `WIFI:S:${ssid};T:${security};P:${password};${hidden === "true" ? "H:true;" : ""};`;
  } else {
    data = qrInput.value;
  }

  // Fixed logo size factor (e.g., 17%)
  const defaultLogoFactor = 0.17;
  const logoPx = Math.round(size * defaultLogoFactor);

  const preview = document.getElementById("qr-preview");
  preview.innerHTML = "";

  qrCode = new QRCodeStyling({
    width: size,
    height: size,
    data: data,
    dotsOptions: {
      color: fgColor,
      type: dotStyle
    },
    cornersSquareOptions: {
      type: cornerStyle,
      color: fgColor
    },
    backgroundOptions: {
      color: bgColor
    },
    qrOptions: {
      errorCorrectionLevel: ecLevel
    },
    image: uploadedLogo || undefined,
    imageOptions: {
      crossOrigin: "anonymous",
      margin: 0,
      width: logoPx,
      height: logoPx
    }
  });

  qrCode.append(preview);
});
