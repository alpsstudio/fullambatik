document.addEventListener("DOMContentLoaded", function () {
  // Inisialisasi canvas
  const canvas = document.getElementById("batikCanvas");
  if (!canvas) {
    console.error("Canvas dengan ID 'batikCanvas' tidak ditemukan.");
    return;
  }

  const ctx = canvas.getContext("2d");
  canvas.width = 600;
  canvas.height = 600;

  let shapes = [];

  // Fungsi untuk menggambar objek pada canvas
  function drawShapes() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const shape of shapes) {
      drawShape(shape);
    }
  }

  function drawShape({ type, x, y, size, rotation = 0, flipH = false, flipV = false }) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
    ctx.rotate((rotation * Math.PI) / 180);

    ctx.beginPath();
    if (type === "square") {
      ctx.rect(-size / 2, -size / 2, size, size);
    } else if (type === "circle") {
      ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
    } else if (type === "triangle") {
      ctx.moveTo(0, -size / 2);
      ctx.lineTo(-size / 2, size / 2);
      ctx.lineTo(size / 2, size / 2);
      ctx.closePath();
    }

    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.restore();
  }

  // Fungsi untuk menambahkan shape baru
  function addShape(type) {
    shapes.push({ type, x: 100, y: 100, size: 40 });
    drawShapes();
  }

  // Fungsi untuk menghasilkan pola berdasarkan pilihan
  function generateSelectedPattern() {
    const patternType = document.getElementById("patternSelect").value; // Ambil nilai pola dari dropdown
    if (!patternType) {
      alert("Pilih pola terlebih dahulu.");
      return;
    }

    // Clear canvas dan gambar ulang objek
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    shapes = []; // Reset shapes
    generatePattern(patternType);
  }

  // Fungsi generate pola berdasarkan pola yang dipilih
  function generatePattern(patternType) {
    const tileSize = 60;
    const newShapes = [];
    const shape = { type: "square", x: 100, y: 100, size: 40 }; // Contoh shape yang sudah digambar

    // Menambahkan fungsi generate untuk pola Kristografi dan Frieze
    const add = (dx, dy, rot = 0, flipH = false, flipV = false) => {
      newShapes.push({
        type: shape.type,
        x: shape.x + dx,
        y: shape.y + dy,
        size: shape.size,
        rotation: rot,
        flipH,
        flipV,
      });
    };

    const applySymmetry = (symFunc) => {
      const repeatX = 4;
      const repeatY = 4;
      for (let ix = 0; ix < repeatX; ix++) {
        for (let iy = 0; iy < repeatY; iy++) {
          symFunc(ix * tileSize, iy * tileSize);
        }
      }
    };

    switch (patternType) {
      // Kristografi Patterns
      case "P1":
        applySymmetry((dx, dy) => add(dx, dy));
        break;
      case "P2":
        applySymmetry((dx, dy) => {
          add(dx, dy);
          add(dx, dy, 180);
        });
        break;
      case "P3":
        applySymmetry((dx, dy) => {
          for (let i = 0; i < 3; i++) {
            let angle = i * 120;
            add(dx, dy, angle);
          }
        });
        break;
      case "P4":
        applySymmetry((dx, dy) => {
          for (let i = 0; i < 4; i++) {
            let angle = i * 90;
            add(dx, dy, angle);
          }
        });
        break;
      case "P6":
        applySymmetry((dx, dy) => {
          for (let i = 0; i < 6; i++) {
            let angle = i * 60;
            add(dx, dy, angle);
          }
        });
        break;
      case "Pm":
        applySymmetry((dx, dy) => {
          add(dx, dy);
          add(dx + tileSize, dy, 0, true, false); // Refleksi horizontal
        });
        break;
      case "Pg":
        applySymmetry((dx, dy) => {
          add(dx, dy);
          add(dx, dy + tileSize, 0, false, true); // Refleksi vertikal
        });
        break;

      // Frieze Patterns
      case "friezeP1":
        applySymmetry((dx, dy) => add(dx, dy));
        break;
      case "friezeP2":
        applySymmetry((dx, dy) => {
          add(dx, dy);
          add(dx + tileSize / 2, dy, 0);
        });
        break;
      case "friezeP1m":
        applySymmetry((dx, dy) => {
          add(dx, dy);
          add(dx + tileSize, dy, 0, true, false); // Refleksi horizontal
        });
        break;
      case "friezeP1a":
        applySymmetry((dx, dy) => {
          add(dx, dy);
          add(dx, dy + tileSize, 0, false, true); // Refleksi vertikal
        });
        break;
      case "friezeP2mm":
        applySymmetry((dx, dy) => {
          add(dx, dy);
          add(dx + tileSize, dy, 0, true, false); // Refleksi horizontal
          add(dx, dy + tileSize, 0, false, true); // Refleksi vertikal
        });
        break;
      case "friezeP2mg":
        applySymmetry((dx, dy) => {
          add(dx, dy);
          add(dx + tileSize, dy, 0, true, false); // Refleksi horizontal
          add(dx, dy + tileSize, 90); // Rotasi 90 derajat
        });
        break;
      case "friezeP2gg":
        applySymmetry((dx, dy) => {
          add(dx, dy);
          add(dx + tileSize, dy + tileSize, 0, true, true); // Refleksi diagonal
        });
        break;

      default:
        alert("Pola yang dipilih belum tersedia.");
    }

    // Menggambar pola baru ke canvas
    shapes.push(...newShapes);
    drawShapes();
  }

  // Tambahkan event listener untuk tombol generate
  document.getElementById("generateButton").addEventListener("click", generateSelectedPattern);
});