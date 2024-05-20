const form = document.querySelector('form');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    cariPoisson();
    hitung();
})
function cariPoisson() {
    var lambda = parseFloat(document.getElementById('lambda').value);
    var x = parseInt(document.getElementById('nilaiX').value);
    var operator = document.getElementById('dropdown').value; // Mengambil nilai dari dropdown
    var poissonProb;

    if (x <= 5){
        bawah = 0;
        atas = 10;
    } else {
        bawah = x - 5;
        atas = x + 4;
    }
    switch (operator) {
        case 'eq': // x = x
            poissonProb = (Math.pow(lambda, x) * Math.exp(-lambda)) / faktorial(x);
            break;
        case 'lt': // x < x
            poissonProb = 0;
            for (var i = bawah; i <= x; i++) {
                poissonProb += (Math.pow(lambda, i) * Math.exp(-lambda)) / faktorial(i);
            }
            break;
        case 'gt': // x > x
            poissonProb = 0;
            for (var i = x; i <= atas; i++) { // Anggap batas atas adalah 10 untuk contoh ini
                poissonProb += (Math.pow(lambda, i) * Math.exp(-lambda)) / faktorial(i);
            }
            break;
    }

    document.getElementById('dropdown-out').innerHTML = poissonProb.toFixed(6); // Menampilkan hasil dengan 4 angka desimal
}

function faktorial(n) {
    if (n === 0 || n === 1)
        return 1;   
    return n * faktorial(n - 1);
}

function hitung(){
    document.getElementById('graph').style.display = 'block';
    var lambda = parseFloat(document.getElementById('lambda').value);
    var x = parseInt(document.getElementById('nilaiX').value);
    var bawah, atas;
    if (x <= 5){
        bawah = 0;
        atas = 10;
    } else {
        bawah = x - 5;
        atas = x + 4;
    }
    data = []; // Mengosongkan array data
    for (var i = bawah; i <= atas; i++) {
        var hasil = (Math.pow(lambda, i) * Math.exp(-lambda)) / faktorial(i);
        data.push(hasil);
    }
    updateSVG();
}

function updateSVG() {
    var svg = document.querySelector('svg');
    svg.innerHTML = ''; // Mengosongkan SVG sebelum menambahkan elemen baru
    var barWidth = 50; // Lebar batang
    var spacing = 10; // Jarak antar batang

    // Tooltip untuk menampilkan nilai
    var tooltipBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    tooltipBg.setAttribute('id', 'tooltip-bg');
    tooltipBg.setAttribute('x', 0);
    tooltipBg.setAttribute('y', 0);
    tooltipBg.setAttribute('width', 60); // Lebar background tooltip
    tooltipBg.setAttribute('height', 20); // Tinggi background tooltip
    tooltipBg.setAttribute('fill', 'white'); // Warna background
    tooltipBg.setAttribute('stroke', '#07374a'); // Border tooltip
    tooltipBg.setAttribute('visibility', 'hidden'); // Sembunyikan secara default
    svg.appendChild(tooltipBg);

    var tooltip = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    tooltip.setAttribute('id', 'tooltip');
    tooltip.setAttribute('x', 0);
    tooltip.setAttribute('y', 0);
    tooltip.setAttribute('visibility', 'hidden'); // Sembunyikan tooltip secara default
    svg.appendChild(tooltip);

    var batas = parseInt(document.getElementById('nilaiX').value);
        if (batas <= 5){
            bawah = 0;
            atas = 10;
        } else {
            bawah = batas - 5;
            atas = batas + 4;
        }
    data.forEach(function(value, index) {
        var barHeight = value / 0.25 * 100; // Tinggi batang berdasarkan nilai
        var x = (barWidth + spacing) * index; // Posisi x batang
        var y = 95 - barHeight; // Posisi y batang
        var realIndex = index + bawah;

        var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', x);
        rect.setAttribute('y', `${y}%`);
        rect.setAttribute('width', barWidth);
        rect.setAttribute('height', `${barHeight}%`);
        rect.setAttribute('fill', '#4D869C'); // Warna batang

         // Highlight bar sesuai kondisi
        var operator = document.getElementById('dropdown').value; // Mengambil nilai dari dropdown
        if ((operator === 'eq' && realIndex === batas) ||
            (operator === 'lt' && realIndex <= batas) ||
            (operator === 'gt' && realIndex >= batas)) {
            rect.setAttribute('fill', '#07374a'); }
        svg.appendChild(rect);

        rect.addEventListener('mouseover', function() {
            tooltip.setAttribute('x', x + (barWidth / 2));
            tooltip.setAttribute('y', y + barHeight + 80);
            tooltip.textContent = value.toFixed(4);
            tooltip.setAttribute('visibility', 'visible');
            tooltipBg.setAttribute('x', x + (barWidth / 2)); // Posisi background tooltip
            tooltipBg.setAttribute('y', y + barHeight + 65); // Posisi background tooltip
            tooltipBg.setAttribute('visibility', 'visible');

        });
        rect.addEventListener('mouseout', function() {
            tooltip.setAttribute('visibility', 'hidden');
            tooltipBg.setAttribute('visibility', 'hidden');
        });

        var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', x + (barWidth / 2));
        text.setAttribute('y', 400);
        text.textContent = realIndex;
        text.setAttribute('text-anchor', 'middle');
        svg.appendChild(text);
    });
}
