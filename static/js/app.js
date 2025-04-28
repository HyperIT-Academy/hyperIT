export async function initPhoneInput() {
  const $input = $(".hero-input-phone");

  await $input.intlTelInput({
    initialCountry: "auto",
    locale: "en",
    localizedCountries: {
      cg: "Congo - Brazzaville",
      cd: "Congo - Kinshasa"
    },
    nationalMode: true,
    autoPlaceholder: "polite",
    formatOnDisplay: false,
    separateDialCode: true, 
    geoIpLookup: async function (callback) {
      try {
        const res = await fetch("https://ipinfo.io/json?token=9f9dee509d49e4");
        const data = await res.json();
        callback(data.country);
      } catch (e) {
        callback("ua");
      }
    },
    utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js"
  });

  // Після ініціалізації телефону
  document.querySelectorAll(".iti__country-name").forEach(el => {
    el.textContent = el.textContent.replace(/\s*\(.*?\)/, "");
  });
}

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
