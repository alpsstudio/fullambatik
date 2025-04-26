<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Ambatiq - Gambar Batik</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <link rel="stylesheet" href="{{ asset('css/style.css') }}">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">

  <style>
  body {
    margin: 0;
    padding: 0;
    background-color: #1e1b2e;
    font-family: Arial, sans-serif;
    color: white;
    background-image: url('{{ asset('images/batik-pattern.png') }}'); /* Tambahkan gambar pola batik */
    background-size: 300px 300px; /* Ukuran pola */
    background-repeat: repeat; /* Ulangi pola */
    background-position: 0 0;
    animation: moveBackground 10s linear infinite; /* Animasi gerakan */
    opacity: 10; /* Opacity 20% */
  }

  @keyframes moveBackground {
    0% {
      background-position: 0 0;
    }
    100% {
      background-position: 100px 100px; /* Gerakan pola */
    }
  }

    h1 {
      text-align: center;
      padding: 1rem;
      font-size: 2rem;
      color: #c084fc;
    }

    .prompt-section {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      margin: 1rem;
    }

    .prompt-section input[type="text"] {
      width: 100%;
      max-width: 300px;
      padding: 0.5rem;
      border-radius: 5px;
      border: none;
    }

    .prompt-section button {
      padding: 0.5rem 1rem;
      border: none;
      background-color: #6b21a8;
      color: white;
      border-radius: 5px;
      cursor: pointer;
    }

    .prompt-result {
      width: 120px;
      height: 120px;
      background-color: #333;
      border: 2px solid #888;
    }

    .canvas-container {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 1rem;
      position: relative;
      overflow-x: auto;
    }

    canvas {
      border: 2px solid #999;
      background-color: white;
      max-width: 100%;
      height: auto;
    }

    .canvas-controls {
      position: absolute;
      bottom: 10px;
      left: 10px;
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .canvas-controls button {
      padding: 0.3rem 0.7rem;
      font-size: 0.8rem;
      border-radius: 5px;
      background-color: #444;
      color: white;
      border: none;
    }

    .toolbar {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background-color: #2a2a3c;
    }

    .tool-group {
      display: flex;
      flex-direction: column;
      align-items: center;
      background-color: #3b3b4f;
      padding: 1rem;
      border-radius: 10px;
      width: 100%;
      max-width: 300px;
    }

    .button-group {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
    }

    .icon-button {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      font-size: 1rem;
      border-radius: 5px;
      background-color: #444;
      color: white;
      border: none;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .icon-button:hover {
      background-color: #555;
    }

    .icon-button i {
      font-size: 1.2rem;
    }

    .download-button {
      display: block;
      margin: 2rem auto;
      padding: 0.8rem 2rem;
      background-color: #2563eb;
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 1rem;
      cursor: pointer;
    }

    /* Responsive styles */
    @media (min-width: 768px) {
      .toolbar {
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
      }

      .tool-group {
        flex: 1 1 200px;
      }
    }

    .horizontal-group {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      width: 100%;
      max-width: 600px;
      margin: 1rem auto;
    }

    .tool-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }

    .tool-item label {
      font-size: 0.9rem;
      color: white;
    }

    .tool-item input[type="number"],
    .tool-item input[type="color"],
    .tool-item select {
      padding: 0.5rem;
      border-radius: 5px;
      border: none;
      font-size: 1rem;
    }

    .icon-button {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      font-size: 1rem;
      border-radius: 5px;
      background-color: #444;
      color: white;
      border: none;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .icon-button:hover {
      background-color: #555;
    }

    .icon-button i {
      font-size: 1.2rem;
    }

    .button-group {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
    }
  </style>
</head>
<body>

<h1>Ambatiq</h1>

<div class="prompt-section">
  <input type="text" id="promptInput" placeholder="Masukkan prompt batik...">
  <button onclick="generateAI()">Generate</button>
  <div class="prompt-result" id="resultPreview"></div>
</div>

<div class="canvas-container">
  <canvas id="batikCanvas" width="800" height="600"></canvas>
  <div class="canvas-controls">
    <button onclick="undo()">Undo</button>
    <button onclick="redo()">Redo</button>
    <button onclick="clearCanvas()">Hapus</button>
  </div>
</div>

<div class="toolbar" style="display: flex; flex-direction: column; align-items: center; gap: 1rem; padding: 1rem; background-color: #2a2a3c;">
  <div class="tool-group" style="width: 100%; max-width: 400px; background-color: #3b3b4f; padding: 1rem; border-radius: 10px;">
    <div class="tool-item" style="display: flex; justify-content: space-between; align-items: center; gap: 1rem;">
      <label for="brushSize" style="color: white; font-size: 0.9rem;">Ukuran Kuas:</label>
      <input type="number" id="brushSize" min="1" max="10" value="5" style="flex: 1; padding: 0.5rem; border-radius: 5px; border: none; font-size: 1rem;">
      <label for="colorPicker" style="color: white; font-size: 0.9rem;">Warna:</label>
      <input type="color" id="colorPicker" style="flex: 1; padding: 0.5rem; border-radius: 5px; border: none;">
      <button id="paintBucketButton">Paint Bucket</button>

    </div>
  </div>

  <div class="tool-group" style="width: 100%; max-width: 400px; background-color: #3b3b4f; padding: 1rem; border-radius: 10px;">
    <div class="tool-item" style="display: flex; justify-content: space-between; align-items: center; gap: 1rem;">
      <label for="symmetryMode" style="color: white; font-size: 0.9rem;">Simetri:</label>
      <select id="symmetryMode" style="flex: 1; padding: 0.5rem; border-radius: 5px; border: none; font-size: 1rem;">
        <option value="none">Tanpa Simetri</option>
        <option value="vertical">Vertikal</option>
        <option value="horizontal">Horizontal</option>
        <option value="diagonal">Diagonal</option>
        <option value="rotational">Rotasi</option>
      </select>
      <label for="patternSelect" style="color: white; font-size: 0.9rem;">Jenis Pola:</label>
      <select id="patternSelect" style="flex: 1; padding: 0.5rem; border-radius: 5px; border: none; font-size: 1rem;">
      <optgroup label="Kristografi">
      <option value="P1">P1</option>
  <option value="P2">P2</option>
  <option value="P3">P3</option>
  <option value="P4">P4</option>
  <option value="P6">P6</option>
  <option value="Pm">Pm</option>
  <option value="Pg">Pg</option>
    </optgroup>
    <optgroup label="Frieze">
    <option value="friezeP1">Frieze P1</option>
  <option value="friezeP2">Frieze P2</option>
  <option value="friezeP1m">Frieze P1m</option>
  <option value="friezeP1a">Frieze P1a</option>
  <option value="friezeP2mm">Frieze P2mm</option>
  <option value="friezeP2mg">Frieze P2mg</option>
  <option value="friezeP2gg">Frieze P2gg</option>
    </optgroup>
      </select>
    </div>
    <button id="generateButton">Generate Pola</button>
  </div>

  <div class="tool-group" style="width: 100%; max-width: 400px; background-color: rgb(61, 59, 70); padding: 1rem; border-radius: 10px;">
    <label style="color: white; font-size: 0.9rem; margin-bottom: 0.5rem;">Bentuk:</label>
    <div class="button-group" style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 0.5rem;">
        
        <button class="icon-button" style="padding: 0.8rem; background-color: #444; color: white; border: none; border-radius: 5px; cursor: pointer;" onclick="addShape('circle')">
            <i class="fas fa-circle"></i>
        </button>

        <button class="icon-button" style="padding: 0.8rem; background-color: #444; color: white; border: none; border-radius: 5px; cursor: pointer;" onclick="addShape('square')">
            <i class="fas fa-square"></i>
        </button>

        <button class="icon-button" style="padding: 0.8rem; background-color: #444; color: white; border: none; border-radius: 5px; cursor: pointer;" onclick="addShape('triangle')">
            <i class="fas fa-play"></i> <!-- triangle simple -->
        </button>

        <button class="icon-button" style="padding: 0.8rem; background-color: #444; color: white; border: none; border-radius: 5px; cursor: pointer;" onclick="addShape('star')">
            <i class="fas fa-star"></i>
        </button>

        <button class="icon-button" style="padding: 0.8rem; background-color: #444; color: white; border: none; border-radius: 5px; cursor: pointer;" onclick="addShape('line')">
            <i class="fas fa-minus"></i> <!-- garis horizontal -->
        </button>

        <button class="icon-button" style="padding: 0.8rem; background-color: #444; color: white; border: none; border-radius: 5px; cursor: pointer;" onclick="addShape('pentagon')">
            <i class="fas fa-pentagon"></i> <!-- perlu icon library tertentu atau ganti ke custom -->
        </button>

        <button class="icon-button" style="padding: 0.8rem; background-color: #444; color: white; border: none; border-radius: 5px; cursor: pointer;" onclick="addShape('hexagon')">
            <i class="fas fa-hexagon"></i> <!-- custom icon, nanti dibikin -->
        </button>

        <button class="icon-button" style="padding: 0.8rem; background-color: #444; color: white; border: none; border-radius: 5px; cursor: pointer;" onclick="addShape('heart')">
            <i class="fas fa-heart"></i>
        </button>

        <button class="icon-button" style="padding: 0.8rem; background-color: #444; color: white; border: none; border-radius: 5px; cursor: pointer;" onclick="addShape('diamond')">
            <i class="fas fa-diamond"></i> <!-- diamond shape -->
        </button>

        <button class="icon-button" style="padding: 0.8rem; background-color: #444; color: white; border: none; border-radius: 5px; cursor: pointer;" onclick="addShape('plus')">
            <i class="fas fa-plus"></i> <!-- plus shape -->
        </button>

    </div>
</div>


  <button class="download-button" onclick="downloadImage()" style="padding: 0.8rem 2rem; background-color: #2563eb; color: white; border: none; border-radius: 10px; font-size: 1rem; cursor: pointer;">Download</button>
</div>

<script src="{{ asset('js/canvas-app.js') }}"></script>

<!-- Tambahkan Font Awesome -->
<script src="https://kit.fontawesome.com/a076d05399.js" crossorigin="anonymous"></script>
</body>
<!-- Script diletakkan sebelum penutupan body -->
<script src="canvas-app.js"></script>
</body>

</html>

