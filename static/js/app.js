$(document).ready(function () {
  $(".reviews-carousel").slick({
      infinite: true,
      slidesToShow: 3,
      slidesToScroll: 3,
      responsive: [
          {
              breakpoint: 768,
              settings: {
                  arrows: true,
                  slidesToShow: 1,
                  centerMode: true,
                  centerPadding: '50px'
              },
          }
      ],
  });


  $(".faq-btn-js").on("click", function () {
      var $answer = $(this).closest("li").find(".faq__answer");
      $answer.toggleClass("hidden");
      $(this).toggleClass("rotate");
  });
});
