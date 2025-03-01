//Toàn màn hình
var mapId = document.getElementById('map')
var fullScreen = false
document.getElementById("fullScreenView").title = 'Toàn màn hình'
function fullScreenView() {
    if (document.fullscreenElement) {
        document.exitFullscreen()
        document.getElementById("fullScreenView").title = 'Toàn màn hình'
        fullScreen = false
    } else {
        mapId.requestFullscreen()
        document.getElementById("fullScreenView").title = 'Thoát toàn màn hình'
        fullScreen = true
    }
}

//Tìm kiếm
var boundingBox = [[20.958, 104.831], [21.270, 106.038]];

// var geocoder = L.Control.geocoder().addTo(map);

// Về điểm gốc
$('.zoom-to-layer').click(function() {
    map.setView([17.5, 106.6], 9)
})