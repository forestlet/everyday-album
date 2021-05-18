let albums
let date_albums = []
let current
const album_cover_carousel = document.querySelector('#album_covers')
const lang = navigator.language

initAlbums()

// init datepicker
$('#datepicker').datepicker({
    language: lang,
    format: "yyyy-mm-dd",
    maxViewMode: 2,
    todayHighlight: true,
    todayBtn: "linked",
    autoclose: true
});

// init tooltip
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
})

// init toast
var toastElList = [].slice.call(document.querySelectorAll('.toast'))
var toastList = toastElList.map(function (toastEl) {
    return new bootstrap.Toast(toastEl)
})

album_cover_carousel.addEventListener('slide.bs.carousel', function (e) {
    current = e.to;
    changeAlbumInfo()
})

$.getJSON("../asset/album.json", (data) => {
    albums = data
}).then(() => {
    let date = getQueryString("date")
    if (date != null) {
        searchAlbums(date)
        $('#datepicker').val(date)
    }
})

// add fn format
Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

$("#search").click(() => {
    initAlbums()

    if (!$('#datepicker').val()) return

    let pick_date = new Date($('#datepicker').val()).format("yyyy-MM-dd");

    searchAlbums(pick_date)
})

function searchAlbums(pick_date) {
    history.replaceState(null, null, window.location.origin + window.location.pathname + "?date=" + pick_date)

    albums.forEach(album => {
        if (album.release_time.replace(/\d\d\d\d-/, "") == pick_date.replace(/\d\d\d\d-/, "")) {
            date_albums.push(album)
        }
    });

    if (date_albums.length == 0) {
        $("#no_album").show()
    } else {
        showCarousel()
        if (date_albums.length == 1) singleAlbum()
    }
}

function changeAlbumInfo() {
    $('#album_title').text(date_albums[current]["title"])
    $('#album_artist').text(date_albums[current]["artist"])
    $('#album_release_time').text(date_albums[current]["release_time"])
}

function initAlbums() {
    $("#no_album").hide()
    $(".album_info").hide()
    $(".carousel-indicators").hide()
    $(".carousel-control-prev").hide()
    $(".carousel-control-next").hide()

    date_albums = []
    $(".carousel-indicators").empty()
    $(".carousel-inner").empty()
}

function showCarousel() {
    $(".album_info").show()
    $(".carousel-indicators").show()
    $(".carousel-control-prev").show()
    $(".carousel-control-next").show()

    for (let index = 0; index < date_albums.length; index++) {
        album_now = date_albums[index]
        $(".carousel-indicators").append(`<button type="button" data-bs-target="#album_covers" data-bs-slide-to="${index}" aria-label="${album_now["title"]}"></button>`)
        $(".carousel-inner").append(`<div class="carousel-item"> <img src="../asset/img/${album_now["filename"]}" class="album_cover d-block w-100" alt="${album_now["title"]}"> </div>`)
    }
    $(".carousel-indicators").children().eq(0).attr({ "class": "active", "aria-current": "true" })
    $(".carousel-inner").children().eq(0).attr("class", "active carousel-item")

    $('#album_title').text(date_albums[0]["title"])
    $('#album_artist').text(date_albums[0]["artist"])
    $('#album_release_time').text(date_albums[0]["release_time"])
    $(".album_info").show()
}

function singleAlbum() {
    $(".carousel-indicators").hide()
    $(".carousel-control-prev").hide()
    $(".carousel-control-next").hide()
}

// 获得 url 参数
function getQueryString(name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    let r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return decodeURIComponent(r[2]);
    };
    return null;
}

$("#share").click(() => {
    $("#url").text(window.location.href)
    let url = document.getElementById("url")
    url.select();
    document.execCommand("Copy");
    $('.toast').toast('show');
})