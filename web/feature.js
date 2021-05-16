let albums
let date_albums = []
let current
const album_cover_carousel = document.querySelector('#album_covers')
const lang = navigator.language

// init datepicker
$('#datepicker').datepicker({
    language: lang,
    endDate: "today",
    maxViewMode: 2,
    todayHighlight: true,
    todayBtn: "linked",
});

album_cover_carousel.addEventListener('slid.bs.carousel', function (e) {
    current = e.to;
    changeAlbumInfo()
})

$.getJSON("../asset/album.json", (data) => {
    albums = data
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

initAlbums()

$("#search").click(() => {
    initAlbums()

    if (!$('#datepicker').val()) return

    let pick_date = new Date($('#datepicker').val()).format("MM-dd");

    albums.forEach(album => {
        if (album.release_time.replace(/\d\d\d\d-/, "") == pick_date) {
            date_albums.push(album)
        }
    });

    if (date_albums.length != 0) showCarousel()

    if (date_albums.length == 1) singleAlbum()
})

function changeAlbumInfo() {
    $('#album_title').text(date_albums[current]["title"])
    $('#album_artist').text(date_albums[current]["artist"])
    $('#album_release_time').text(date_albums[current]["release_time"])
}

function initAlbums() {
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
