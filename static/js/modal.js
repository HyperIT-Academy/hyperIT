$(document).ready(function () {
  $(".hero-input-phone").each(function() {
  const $input = $(this);

  // ініціалізація плагіну intlTelInput
  const iti = $input.intlTelInput({
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

  // Додайте подібну логіку для кожного поля
  $(".form").on("submit", async function (e) {
    e.preventDefault();
    
    let isValid = true;
    
    const form = $(this);
    const name = form.find(".hero-input-name").val().trim();
    const phone = form.find(".hero-input-phone").val().trim();
    const email = form.find(".hero-input-email").val().trim();
    const privacy = form.find(".hero-input-privacy").is(":checked");

    form.find(".error").text("");
    form.find("input").removeClass("error");

    if (name === "") {
      form.find(".error-name").text("Ім’я обовʼязкове");
      form.find(".hero-input-name").addClass("error");
      isValid = false;
    }

    // Перевірка валідності номера телефону
    const isPhoneValid = iti[0].validity.valid;
    if (!isPhoneValid) {
      form.find(".error-phone").text("Номер телефону невірний!");
      form.find(".hero-input-phone").addClass("error");
      isValid = false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      form.find(".error-email").text("Email обовʼязковий і має бути валідним");
      form.find(".hero-input-email").addClass("error");
      isValid = false;
    }

    if (!privacy) {
      form.find(".error-privacy").text("Потрібно погодитися з умовами");
      form.find(".checkbox").addClass("is-invalid");
      isValid = false;
    }

    if (isValid) {
      alert("Зберігаємо ваші дані");

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

    $(".form input").on("input", function () {
        const $input = $(this);
        const value = $input.val().trim();
        const name = $input.attr("name");
      
        if (name === "name" && value !== "") {
          $input.removeClass("error");
          $(".error-name").text("");
        }
      
        if (name === "phone" && /^\+?[0-9\s\-\(\)]{10,20}$/.test(value)) {
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
