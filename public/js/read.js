var height = document.documentElement.clientHeight;

$('#submit').click(() => {
    var url = $('#url').val();
    var autoloadNext = $('#autoload-next').is(':checked');
    setCookie('autoloadNext', autoloadNext);
    window.location.href = `?autoloadNext=${autoloadNext}&url=${url}`;
});

$('.tap-to-scroll').click(() => {
    var clientHeight = document.documentElement.clientHeight;
    var scrollByAmount = clientHeight * 0.90;
    $('html, body').animate({
        scrollTop: `+=${scrollByAmount}`
     }, 300);
});

function autoscroll() {
    var element = document.getElementById("text-paragraph-10");
    element.scrollIntoView({block: "center"});
}