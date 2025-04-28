document.addEventListener("DOMContentLoaded", function () {
    const phoneInputs = document.querySelectorAll(".hero-input-phone");

  const itis = [];

  // Ініціалізація плагіна для кожного інпуту
  phoneInputs.forEach(function (input, index) {
    const iti = window.intlTelInput(input, {
      initialCountry: "auto",
      locale: "en",
      localizedCountries: {
        cg: "Congo - Brazzaville",
        cd: "Congo - Kinshasa"
      },
      nationalMode: true,
      autoPlaceholder: "polite",
      formatOnDisplay: false,
      separateDialCode: false, 
      geoIpLookup: function (callback) {
        fetch("https://ipinfo.io/json?token=9f9dee509d49e4")
          .then(res => res.json())
          .then(data => callback(data.country))
          .catch(() => callback("ua"));
      },
      utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js"
    });
    itis[index] = iti;
  });

  const forms = document.querySelectorAll(".form");

   forms.forEach(function (form) {
  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    
    let isValid = true;

    const name = form.querySelector(".hero-input-name").value.trim();
    const phone = form.querySelector(".hero-input-phone").value.trim();
    const email = form.querySelector(".hero-input-email").value.trim();
    const privacy = form.querySelector(".hero-input-privacy").checked;

    // Очистка попередніх помилок
    form.querySelectorAll(".error").forEach(error => error.textContent = "");
    form.querySelectorAll("input").forEach(input => input.classList.remove("error"));
    
    // Валідація імені
    if (name === "") {
      form.querySelector(".error-name").textContent = "Ім’я обовʼязкове";
      form.querySelector(".hero-input-name").classList.add("error");
      isValid = false;
    }

    // Знаходимо найближчий інпут до натиснутої кнопки
    const closestInput = form.querySelector('.hero-input-phone');
    
      const inputIndex = Array.from(phoneInputs).indexOf(closestInput); // Отримуємо індекс інпуту

      const iti = itis[inputIndex]; // Отримуємо інстанс плагіна для цього інпуту


    // Валідація номера телефону
    const isPhoneValid = iti.isValidNumber();
    if (!isPhoneValid) {
      form.querySelector(".error-phone").textContent = "Номер телефону невірний!";
      form.querySelector(".hero-input-phone").classList.add("error");
      isValid = false;
    } else {
      const countryData = iti.getSelectedCountryData();
      const countryCode = countryData.dialCode;
      console.log(`Код країни для інпуту ${inputIndex + 1}:`, countryCode);
    }

    // Валідація email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      form.querySelector(".error-email").textContent = "Email має бути валідним";
      form.querySelector(".hero-input-email").classList.add("error");
      isValid = false;
    }

    // Валідація прийняття умов
    if (!privacy) {
      form.querySelector(".error-privacy").textContent = "Потрібно погодитися з умовами";
      form.querySelector(".checkbox").classList.add("is-invalid");
      isValid = false;
    }

    // Якщо всі перевірки пройдені, відправляємо дані
    if (isValid) {
      console.log("Зберігаємо ваші дані");

      const data = {
        name: name,
        phone: phone,
        email: email,
      };

      try {
        const response = await fetch("https://hyperit.onrender.com/api/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          alert("Заявка надіслана успішно!");
        } else {
          alert("Ваші дані не вдалося зберегти");
          const botLink = `https://t.me/HyperIT_Academy_bot`;
          window.location.href = botLink;
        }
      } catch (error) {
        console.error(error);
        alert("Сталася помилка при підключенні до сервера.");
        const botLink = `https://t.me/HyperIT_Academy_bot`;
        window.location.href = botLink;
      }
    }
  });
});

});

$(document).ready(function () {
    $(".free-lesson-btn-js").on("click", function() {
      $(".backdrop").removeClass("is-hidden");
    });

    $(".modal__close-btn").on("click", function() {
      $(".backdrop").addClass("is-hidden");
      $(".error").text("");
      $(".form input").removeClass("error is-invalid");
    });

    $(".form input").on("input", function () {
        const $input = $(this);
        const value = $input.val().trim();
        const name = $input.attr("name");
      
        if (name === "name" && value !== "") {
          $input.removeClass("error");
          $(".error-name").text("");
        }
      
        if (name === "phone" && /^\+?[1-9]\d{7,14}$/.test(value)) {
          $input.removeClass("error");
          $(".error-phone").text("");
        }
      
        if (name === "email" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          $input.removeClass("error");
          $(".error-email").text("");
        }
    });

    $(".form input[type='checkbox']").on("change", function () {
        if ($(this).is(":checked")) {
          $(".checkbox").removeClass("is-invalid");
          $(".error-privacy").text("");
        }
    });
});
