"use strict";

function changePage(url) {
    let href = `?url=${url}`
    const bookmarkId = $('#read-bookmark-id').val()
    if (bookmarkId) {
        href += `&bookmark=${bookmarkId}`
    }
    window.location.href = href;
}

/* #region  Configurations and LocalStorage */
function saveSettings() {
    var settings = {
        url: $('#config-webtoon-url').val(),
        tapToScroll: $('#config-webtoon-tap-to-scroll').is(':checked'),
    }
    var currentUrl = localStorage.getItem('config-webtoon-url');
    settings.urlChanged = currentUrl !== settings.url;
    localStorage.setItem('config-webtoon-url', settings.url);
    localStorage.setItem('config-webtoon-tap-to-scroll', settings.tapToScroll);
    return settings;
}

function isTapToScrollEnabled() {
    return localStorage.getItem('config-webtoon-tap-to-scroll') === 'true'
}

function setConfigWebtoonUrl(url) {
    localStorage.setItem('config-webtoon-url', url);
}
/* #endregion */