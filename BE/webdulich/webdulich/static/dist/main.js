var map = L.map('map', {
    meansureControl: true
}).setView([17.5, 106.6], 9);
map.zoomControl.setPosition('topright')
//Hiện bản đồ
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
}).addTo(map);

var wmsLayer = L.Geoserver.wms("http://localhost:8080/geoserver/wms", {
    layers: "ne:quangbinh",
  });
  wmsLayer.addTo(map);

//Đánh dấu 
var defaultMarker = L.marker([17.5, 106.6]).addTo(map)
    .bindPopup('Du lịch Quảng Bình')
    .openPopup();
//Tỉ lệ
L.control.scale().addTo(map)

//Hiển thị tọa độ
map.on('mousemove', function (e) {
    $('.coordinate').html('Lat: ' + e.latlng.lat + ' Lng: ' + e.latlng.lng)
})

// Lưu lớp vào đối tượng overLayMaps
var overLayMaps = {
    "Quảng Bình": defaultMarker, // Lớp mặc định (nếu cần)
};

// Định nghĩa các lớp theo phân loại
var classificationLayers = {};

// URL yêu cầu WFS
var wfsUrl = `http://localhost:8080/geoserver/ne/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ne%3Adulich&maxFeatures=100&outputFormat=application%2Fjson`;

fetch(wfsUrl)
    .then(response => response.json())
    .then(data => {
        data.features.forEach(feature => {
            var coords = feature.geometry.coordinates; // Tọa độ
            var name = feature.properties.ten || 'Không có tên'; // Tên
            var classification = feature.properties.phanLoai || 'Không phân loại'; // Phân loại
            var description = feature.properties.moTa || 'Không có mô tả'; // Mô tả
            var imageUrl = feature.properties.anh || ''; // Ảnh  

            // Tạo marker
            var marker = L.marker([coords[1], coords[0]]);

            // Tạo popup cho marker
            marker.bindPopup(`
                <strong>${name}</strong><br>
                Phân loại: ${classification}<br>
                Mô tả: ${description}<br>
                <img src="${imageUrl}" alt="${name}" style="width: 300px; height: auto;" />
            `);

            // Kiểm tra xem lớp phân loại đã tồn tại chưa
            if (!classificationLayers[classification]) {
                classificationLayers[classification] = L.layerGroup(); // Tạo nhóm lớp mới cho phân loại này
            }

            // Thêm marker vào lớp phân loại tương ứng
            classificationLayers[classification].addLayer(marker);
        });

        // Thêm các lớp phân loại vào overLayMaps
        Object.keys(classificationLayers).forEach(function(classification) {
            overLayMaps[classification] = classificationLayers[classification];
        });

        // Thêm điều khiển lớp
        L.control.layers(null, overLayMaps).addTo(map);
    })
    .catch(error => console.error('Error fetching data:', error));