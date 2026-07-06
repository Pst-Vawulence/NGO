(function() {
  'use strict';

  var form = document.getElementById('contactForm');
  if (!form) return;

  var nameInput = document.getElementById('name');
  var emailInput = document.getElementById('email');
  var orgInput = document.getElementById('organization');
  var helpSelect = document.getElementById('help');
  var messageInput = document.getElementById('message');

  var nameError = document.getElementById('nameError');
  var emailError = document.getElementById('emailError');
  var helpError = document.getElementById('helpError');
  var messageError = document.getElementById('messageError');

  var submitBtn = document.getElementById('formSubmit');
  var successMsg = document.getElementById('formSuccess');
  var errorMsg = document.getElementById('formError');

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function setError(input, errorEl, condition) {
    if (condition) {
      input.classList.add('contact-form__input--error');
      if (errorEl) errorEl.classList.add('contact-form__error--visible');
      return false;
    }
    input.classList.remove('contact-form__input--error');
    if (errorEl) errorEl.classList.remove('contact-form__error--visible');
    return true;
  }

  function clearErrors() {
    var inputs = form.querySelectorAll('.contact-form__input, .contact-form__select, .contact-form__textarea');
    inputs.forEach(function(input) { input.classList.remove('contact-form__input--error', 'contact-form__select--error', 'contact-form__textarea--error'); });
    form.querySelectorAll('.contact-form__error').forEach(function(el) { el.classList.remove('contact-form__error--visible'); });
    if (successMsg) successMsg.classList.remove('contact-form__success--visible');
    if (errorMsg) errorMsg.classList.remove('contact-form__error-msg--visible');
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    clearErrors();

    var name = nameInput ? nameInput.value.trim() : '';
    var email = emailInput ? emailInput.value.trim() : '';
    var help = helpSelect ? helpSelect.value : '';
    var message = messageInput ? messageInput.value.trim() : '';

    var nameValid = setError(nameInput, nameError, !name);
    var emailValid = setError(emailInput, emailError, !email || !validateEmail(email));
    var helpValid = setError(helpSelect, helpError, !help);
    var messageValid = setError(messageInput, messageError, !message);

    if (!nameValid || !emailValid || !helpValid || !messageValid) {
      var firstError = form.querySelector('.contact-form__input--error, .contact-form__select--error, .contact-form__textarea--error');
      if (firstError) firstError.focus();
      return;
    }

    submitBtn.classList.add('contact-form__btn--loading');
    submitBtn.disabled = true;

    var templateParams = {
      from_name: name,
      from_email: email,
      organization: orgInput ? orgInput.value.trim() : '',
      help_topic: help,
      message: message
    };

    if (typeof emailjs !== 'undefined') {
      emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
        .then(function() {
          showSuccess();
        })
        .catch(function() {
          showError();
        })
        .finally(function() {
          submitBtn.classList.remove('contact-form__btn--loading');
          submitBtn.disabled = false;
        });
    } else {
      setTimeout(function() {
        showSuccess();
        submitBtn.classList.remove('contact-form__btn--loading');
        submitBtn.disabled = false;
      }, 1500);
    }
  });

  function showSuccess() {
    if (nameInput) nameInput.value = '';
    if (emailInput) emailInput.value = '';
    if (orgInput) orgInput.value = '';
    if (helpSelect) helpSelect.value = '';
    if (messageInput) messageInput.value = '';
    if (successMsg) successMsg.classList.add('contact-form__success--visible');
    if (errorMsg) errorMsg.classList.remove('contact-form__error-msg--visible');
    setTimeout(function() {
      if (successMsg) successMsg.classList.remove('contact-form__success--visible');
    }, 5000);
  }

  function showError() {
    if (errorMsg) errorMsg.classList.add('contact-form__error-msg--visible');
    if (successMsg) successMsg.classList.remove('contact-form__success--visible');
    setTimeout(function() {
      if (errorMsg) errorMsg.classList.remove('contact-form__error-msg--visible');
    }, 5000);
  }

  var newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      var input = newsletterForm.querySelector('.footer__newsletter-input');
      var btn = newsletterForm.querySelector('.footer__newsletter-btn');
      if (input && input.value.trim()) {
        btn.textContent = 'Subscribed!';
        var checkIcon = document.createElement('i');
        checkIcon.className = 'fas fa-check';
        btn.appendChild(checkIcon);
        input.value = '';
        setTimeout(function() {
          btn.textContent = 'Subscribe ';
          var arrowIcon = document.createElement('i');
          arrowIcon.className = 'fas fa-arrow-right';
          btn.appendChild(arrowIcon);
        }, 3000);
      }
    });
  }
})();
