$(document).ready(() => {
    $('body').backstretch(
        [
            "images/login0.jpg",
            "images/login.jpg",
        ], {
            transition: 'pushLeft',
            fade: 1000,
            overlay: {
                init: true,
                background: "#000",
                opacity: 0.5
            }
        }
    );
})