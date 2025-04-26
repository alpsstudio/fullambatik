const canvas = document.getElementById('batikCanvas');
const ctx = canvas.getContext('2d');

let drawing = false;
let brushSize = 5;
let color = '#000000';
let symmetryMode = 'none';
let history = [];
let redoStack = [];
let lastX, lastY;
let shapeInsertPosition = { x: canvas.width / 2, y: canvas.height / 2 };

// Setup
ctx.lineCap = 'round';
ctx.lineJoin = 'round';

// Get elements
const brushSizeInput = document.getElementById('brushSize');
const colorPicker = document.getElementById('colorPicker');
const symmetrySelect = document.getElementById('symmetryMode');


brushSizeInput.addEventListener('input', e => brushSize = parseInt(e.target.value));
colorPicker.addEventListener('input', e => color = e.target.value);
symmetrySelect.addEventListener('change', e => symmetryMode = e.target.value);

function saveState() {
  history.push(canvas.toDataURL());
  if (history.length > 50) history.shift();
  redoStack = [];
}
function undo() {
  if (history.length > 0) {
    redoStack.push(canvas.toDataURL());
    const img = new Image();
    img.src = history.pop();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    }
  }
}
function redo() {
  if (redoStack.length > 0) {
    history.push(canvas.toDataURL());
    const img = new Image();
    img.src = redoStack.pop();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    }
  }
}
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  saveState();
}

function getCursorPos(e) {
  const rect = canvas.getBoundingClientRect();
  if (e.touches && e.touches.length > 0) {
    return {
      x: e.touches[0].clientX - rect.left,
      y: e.touches[0].clientY - rect.top
    };
  } else {
    return {
      x: e.offsetX ?? e.clientX - rect.left,
      y: e.offsetY ?? e.clientY - rect.top
    };
  }
}

// Gambar garis dengan simetri
function drawLine(x1, y1, x2, y2) {
  ctx.strokeStyle = color;
  ctx.lineWidth = brushSize;

  const draw = (sx, sy, ex, ey) => {
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(ex, ey);
    ctx.stroke();
  };

  draw(x1, y1, x2, y2);

  if (symmetryMode === 'vertical') {
    draw(canvas.width - x1, y1, canvas.width - x2, y2);
  } else if (symmetryMode === 'horizontal') {
    draw(x1, canvas.height - y1, x2, canvas.height - y2);
  } else if (symmetryMode === 'diagonal') {
    draw(canvas.width - x1, canvas.height - y1, canvas.width - x2, canvas.height - y2);
  } else if (symmetryMode === 'rotational') {
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const rotate = (x, y, angle) => {
      const dx = x - cx, dy = y - cy;
      return {
        x: cx + dx * Math.cos(angle) - dy * Math.sin(angle),
        y: cy + dx * Math.sin(angle) + dy * Math.cos(angle)
      };
    };
    for (let i = 1; i < 4; i++) {
      const angle = i * Math.PI / 2;
      const p1 = rotate(x1, y1, angle);
      const p2 = rotate(x2, y2, angle);
      draw(p1.x, p1.y, p2.x, p2.y);
    }
  }
}

// Mouse & Touch Events
function startDraw(e) {
  drawing = true;
  const { x, y } = getCursorPos(e);
  lastX = x;
  lastY = y;
  shapeInsertPosition = { x, y }; // Save shape insert pos
}
function draw(e) {
  if (!drawing) return;
  e.preventDefault();
  const { x, y } = getCursorPos(e);
  drawLine(lastX, lastY, x, y);
  lastX = x;
  lastY = y;
  shapeInsertPosition = { x, y };
}
function stopDraw() {
  drawing = false;
  saveState();
}

canvas.addEventListener('mousedown', startDraw);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDraw);
canvas.addEventListener('mouseleave', () => drawing = false);

canvas.addEventListener('touchstart', startDraw);
canvas.addEventListener('touchmove', draw, { passive: false });
canvas.addEventListener('touchend', stopDraw);

// Tambah shape sesuai posisi terakhir klik
function addShape(shape) {
  const { x, y } = shapeInsertPosition;
  const size = 50;

  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2;

  ctx.beginPath();

  switch (shape) {
    case 'circle':
      ctx.arc(x, y, size / 2, 0, 2 * Math.PI);
      break;

    case 'square':
      ctx.rect(x - size / 2, y - size / 2, size, size);
      break;

    case 'triangle':
      ctx.moveTo(x, y - size / 2);
      ctx.lineTo(x - size / 2, y + size / 2);
      ctx.lineTo(x + size / 2, y + size / 2);
      ctx.closePath();
      break;

    case 'star':
      drawStar(x, y, 5, size / 2, size / 4);
      break;

    case 'line':
      ctx.moveTo(x - size / 2, y);
      ctx.lineTo(x + size / 2, y);
      break;

    case 'pentagon':
      drawPolygon(x, y, 5, size / 2);
      break;

    case 'hexagon':
      drawPolygon(x, y, 6, size / 2);
      break;

    case 'heart':
      drawHeart(x, y, size);
      break;

    case 'diamond':
      ctx.moveTo(x, y - size / 2);
      ctx.lineTo(x - size / 2, y);
      ctx.lineTo(x, y + size / 2);
      ctx.lineTo(x + size / 2, y);
      ctx.closePath();
      break;

    case 'plus':
      drawPlus(x, y, size);
      break;

    default:
      console.log("Shape tidak dikenali:", shape);
      return;
  }

  ctx.stroke();
  saveState();
}
function drawPolygon(x, y, sides, radius) {
  const angle = (2 * Math.PI) / sides;
  ctx.beginPath();
  for (let i = 0; i < sides; i++) {
    const dx = x + radius * Math.cos(i * angle - Math.PI / 2);
    const dy = y + radius * Math.sin(i * angle - Math.PI / 2);
    if (i === 0) ctx.moveTo(dx, dy);
    else ctx.lineTo(dx, dy);
  }
  ctx.closePath();
}

function drawStar(cx, cy, spikes, outerRadius, innerRadius) {
  let rot = Math.PI / 2 * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
}

function drawHeart(x, y, size) {
  const topCurveHeight = size * 0.3;
  ctx.beginPath();
  ctx.moveTo(x, y + topCurveHeight);
  ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
  ctx.bezierCurveTo(x - size / 2, y + (size + topCurveHeight) / 2, x, y + (size + topCurveHeight) / 2, x, y + size);
  ctx.bezierCurveTo(x, y + (size + topCurveHeight) / 2, x + size / 2, y + (size + topCurveHeight) / 2, x + size / 2, y + topCurveHeight);
  ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
  ctx.closePath();
}

function drawPlus(x, y, size) {
  const thickness = size / 3;
  ctx.beginPath();
  ctx.rect(x - thickness / 2, y - size / 2, thickness, size);
  ctx.rect(x - size / 2, y - thickness / 2, size, thickness);
}


// Download
function downloadImage() {
  const link = document.createElement('a');
  link.download = 'ambatiq_batik.png';
  link.href = canvas.toDataURL();
  link.click();
}

// Placeholder untuk fitur generate pola & AI
function generatePattern(type) {
  const ctx = canvas.getContext("2d");
  const original = ctx.getImageData(0, 0, canvas.width, canvas.height);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const tileW = canvas.width / 3;
  const tileH = canvas.height / 3;

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      ctx.save();
      ctx.translate(col * tileW, row * tileH);

      switch (type) {
        // Kristografi Patterns
        case "P1": // Translasi saja
          break;
        case "P2":
          ctx.translate(tileW / 2, tileH / 2);
          ctx.rotate(Math.PI);
          ctx.translate(-tileW / 2, -tileH / 2);
          break;
        case "P3":
          ctx.translate(tileW / 2, tileH / 2);
          ctx.rotate((120 * Math.PI) / 180);
          ctx.translate(-tileW / 2, -tileH / 2);
          break;
        case "P4":
          ctx.translate(tileW / 2, tileH / 2);
          ctx.rotate((90 * Math.PI) / 180);
          ctx.translate(-tileW / 2, -tileH / 2);
          break;
        case "P6":
          ctx.translate(tileW / 2, tileH / 2);
          ctx.rotate((60 * Math.PI) / 180);
          ctx.translate(-tileW / 2, -tileH / 2);
          break;
        case "Pm":
          ctx.scale(-1, 1); // Refleksi horizontal
          ctx.translate(-tileW, 0);
          break;
        case "Pg":
          ctx.scale(1, -1); // Refleksi vertikal
          ctx.translate(0, -tileH);
          break;

        // Frieze Patterns
        case "friezeP1": // Translasi saja
          break;
        case "friezeP2":
          ctx.translate(tileW / 2, 0);
          ctx.scale(-1, 1); // Refleksi horizontal
          ctx.translate(-tileW / 2, 0);
          break;
        case "friezeP1m":
          ctx.scale(-1, 1); // Refleksi horizontal
          ctx.translate(-tileW, 0);
          break;
        case "friezeP1a":
          ctx.scale(1, -1); // Refleksi vertikal
          ctx.translate(0, -tileH);
          break;
        case "friezeP2mm":
          ctx.scale(-1, 1); // Refleksi horizontal
          ctx.translate(-tileW, 0);
          ctx.scale(1, -1); // Refleksi vertikal
          ctx.translate(0, -tileH);
          break;
        case "friezeP2mg":
          ctx.scale(-1, 1); // Refleksi horizontal
          ctx.translate(-tileW, 0);
          ctx.rotate(Math.PI / 2); // Rotasi 90 derajat
          break;
        case "friezeP2gg":
          ctx.scale(-1, -1); // Refleksi diagonal
          ctx.translate(-tileW, -tileH);
          break;

        default:
          console.warn("Pola belum diimplementasikan:", type);
      }

      ctx.drawImage(
        canvas,
        0,
        0,
        tileW,
        tileH,
        0,
        0,
        tileW,
        tileH
      );

      ctx.restore();
    }
  }
}

let paintBucketMode = false;

// Tombol aktifkan Paint Bucket
const paintBucketButton = document.getElementById('paintBucketButton');
paintBucketButton.addEventListener('click', () => {
  paintBucketMode = !paintBucketMode;
  paintBucketButton.classList.toggle('active', paintBucketMode); // Opsional: kasih efek tombol aktif
});

// Flood Fill algoritma sederhana
function floodFill(x, y, fillColor) {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const targetColor = [
    data[((y * canvas.width) + x) * 4],
    data[((y * canvas.width) + x) * 4 + 1],
    data[((y * canvas.width) + x) * 4 + 2],
    data[((y * canvas.width) + x) * 4 + 3]
  ];

  if (colorsMatch(targetColor, hexToRGBA(fillColor))) {
    return; // Tidak perlu diwarnai kalau warnanya sama
  }

  const pixelStack = [{ x, y }];

  while (pixelStack.length) {
    const { x, y } = pixelStack.pop();
    let currentY = y;

    // Naik ke atas sejauh warna target
    while (currentY >= 0 && matchStartColor(x, currentY, targetColor, data)) {
      currentY--;
    }
    currentY++;

    let reachLeft = false;
    let reachRight = false;

    // Turun ke bawah
    while (currentY < canvas.height && matchStartColor(x, currentY, targetColor, data)) {
      colorPixel(x, currentY, fillColor, data);

      if (x > 0) {
        if (matchStartColor(x - 1, currentY, targetColor, data)) {
          if (!reachLeft) {
            pixelStack.push({ x: x - 1, y: currentY });
            reachLeft = true;
          }
        } else if (reachLeft) {
          reachLeft = false;
        }
      }

      if (x < canvas.width - 1) {
        if (matchStartColor(x + 1, currentY, targetColor, data)) {
          if (!reachRight) {
            pixelStack.push({ x: x + 1, y: currentY });
            reachRight = true;
          }
        } else if (reachRight) {
          reachRight = false;
        }
      }

      currentY++;
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

// Bantuannya:
function matchStartColor(x, y, targetColor, data) {
  const index = (y * canvas.width + x) * 4;
  return (
    data[index] === targetColor[0] &&
    data[index + 1] === targetColor[1] &&
    data[index + 2] === targetColor[2] &&
    data[index + 3] === targetColor[3]
  );
}

function colorPixel(x, y, fillColor, data) {
  const index = (y * canvas.width + x) * 4;
  const rgba = hexToRGBA(fillColor);
  data[index] = rgba[0];
  data[index + 1] = rgba[1];
  data[index + 2] = rgba[2];
  data[index + 3] = 255;
}

function colorsMatch(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
}

function hexToRGBA(hex) {
  const bigint = parseInt(hex.slice(1), 16);
  return [
    (bigint >> 16) & 255,
    (bigint >> 8) & 255,
    bigint & 255,
    255
  ];
}

// Ubah event klik canvas
canvas.addEventListener('click', (e) => {
  if (paintBucketMode) {
    const { x, y } = getCursorPos(e);
    floodFill(Math.floor(x), Math.floor(y), color);
    saveState();
  }
});



document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.querySelector("a[href='/canvas']");

  // Tambahkan efek klik pada tombol
  startButton.addEventListener("click", (e) => {
      e.preventDefault();
      startButton.classList.add("scale-90");
      setTimeout(() => {
          startButton.classList.remove("scale-90");
          window.location.href = startButton.getAttribute("href");
      }, 200);
  });

  // Tambahkan log untuk debugging
  console.log("Welcome page loaded successfully!");
});

