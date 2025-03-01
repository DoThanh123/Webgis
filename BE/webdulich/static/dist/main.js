var map = L.map('map', {
    meansureControl: true
}).setView([17.5, 106.6], 9);
map.zoomControl.setPosition('topright')

//Hiện bản đồ
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
}).addTo(map);

document.getElementById("home").title = 'Về vị trí ban đầu';

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
//Hiển thị tọa độ bản thân
var marker;
var locationVisible = false;

document.getElementById("locate").title = "Hiển thị bản thân";

function onLocationFound() {  
    if (navigator.geolocation) {  
        if (!locationVisible) { // Nếu vị trí chưa hiển thị  
            navigator.geolocation.getCurrentPosition(function(position) {  
                var lat = position.coords.latitude;  
                var lng = position.coords.longitude;  

                // Đặt vị trí cho bản đồ  
                map.setView([lat, lng], 13); // Set zoom level  

                // Nếu marker chưa tồn tại, thì tạo mới  
                if (!marker) {  
                    marker = L.marker([lat, lng]).addTo(map)  
                        .bindPopup("Bạn đang ở đây!")  
                        .openPopup();  
                    marker.setLatLng([lat, lng]);
                }
                else {
                    marker.setLatLng([lat, lng]);
                }  
                locationVisible = true; // Đánh dấu là đã hiển thị  
                document.getElementById("locate").title = "Tắt hiển thị bản thân";  
            }, function() {  
                alert("Không thể lấy vị trí của bạn.");  
            });  
        } else { // Nếu vị trí đã hiển thị  
            if (marker) {  
                map.removeLayer(marker); // Xóa marker khỏi bản đồ  
                marker = null; // Đặt lại marker  
            }  
            locationVisible = false; // Đánh dấu là không còn hiển thị  
            document.getElementById("locate").title = "Hiển thị bản thân";  
        }  
    } else {  
        alert("Trình duyệt của bạn không hỗ trợ Geolocation.");  
    }  
}  

// function onLocationError(e) {  
//     alert(e.message);  
// }  

// $('.locate').click(function() {
//     map.locate({setView: true, maxZoom: 13}) // Tìm vị trí người dùng
// })

// map.on('locationfound', onLocationFound);  
// map.on('locationerror', onLocationError); 

//Hiển thị đường đi tới điểm đc chọn
var routeControl = null; // Biến lưu trữ điều khiển đường đi 
var activeMarkerPosition = null; // Lưu trữ vị trí marker hiện popup 
var activeMarkerName = null; // Lưu trữ tên của marker hiện đang được nhấp vào 

// Hàm tính toán đường đi  
function calculateRoute(start, end) {  
    clearRoutes(); // Xóa đường đi cũ nếu có  
    routeControl = L.Routing.control({  
        waypoints: [start, end],  
        routeWhileDragging: true,  
        geocoder: L.Control.Geocoder.nominatim(),  
        createMarker: function() { return null; } // Không tạo marker GPS mặc định  
    }).addTo(map);
    routeControl.on('routesfound', function(e) {  
        var routes = e.routes;  
        var route = routes[0];  

        // Kiểm tra sự tồn tại của routeControl  
        if (routeControl && routeControl.getContainer()) {  
            var container = routeControl.getContainer(); // Lấy container chính của routeControl  
            
            // Tìm input cho Start  
            var startInput = container.querySelector('input[placeholder="Start"]');  
            // Tìm input cho End  
            var endInput = container.querySelector('input[placeholder="End"]');  

            // Đổi placeholder  
            if (startInput) {  
                startInput.placeholder = 'Vị trí bản thân'; // Thay đổi placeholder cho Start  
            }  
            if (endInput) {  
                endInput.placeholder = activeMarkerName; // Thay đổi placeholder cho End  
            }  
        } else {  
            console.warn("routeControl chưa được khởi tạo hoặc _controlContainer không tồn tại.");  
        }  
    });
}  

// Hàm xóa đường đi  
function clearRoutes() {  
    if (routeControl) {  
        map.removeControl(routeControl);  
        routeControl = null; // reset lại routeControl  
        activeMarkerPosition = null;
        activeMarkerName = null;
        document.getElementById("route").title = "Hiển thị đường đi"
    }  
}
//Hàm hiển thị đường đi
function calculateRouteToMarker(markerPosition) {  
    if(routeControl) {
        clearRoutes();
    } else {
        if (marker) {  
            calculateRoute(marker.getLatLng(), markerPosition);  
            map.setView(markerPosition,12)
            document.getElementById("route").title = "Xóa đường đi"
        } else {  
            alert("Vui lòng bật vị trí của bạn trước.");
        }  
    }
} 

document.getElementById("route").onclick = function() {  
    if (activeMarkerPosition) {  
        calculateRouteToMarker(activeMarkerPosition);  
    }  
};

document.getElementById("route").title = "Hiển thị đường đi"

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
            var marker = L.marker([coords[1], coords[0]]).on('click', function () { 
                activeMarkerPosition = null; 
                activeMarkerPosition = [coords[1], coords[0]]; // Lưu vị trí của marker nhấp
                activeMarkerName = null;
                activeMarkerName = name;  
                //document.getElementById("route-to-popup-marker").disabled = false; // Kích hoạt nút  
            });

            // Tạo popup cho marker
            marker.bindPopup(`
                <strong>${name}</strong><br>
                Phân loại: ${classification}<br>
                Mô tả: ${description}<br>
                <img src="${imageUrl}" alt="${name}" style="width: 300px; height: auto;" />
            `, {
                closeOnClick: false, // Không đóng khi nhấp ra ngoài  
                // autoClose: false,    // Không tự động đóng khi có popup khác được mở 
            });

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