import { initPhoneInput } from './app.js'

$(document).ready(function () {

    $(".free-lesson-btn-js").on("click", function() {
      $(".backdrop").removeClass("is-hidden");
    });


    $(".modal__close-btn").on("click", function() {
      $(".backdrop").addClass("is-hidden");
      $(".error").text("");
      $(".form input").removeClass("error is-invalid");
    });

    const iti = initPhoneInput();

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

        if (!iti.isValidNumber()) {
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
