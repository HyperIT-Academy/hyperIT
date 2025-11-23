document.addEventListener('DOMContentLoaded', () => {
  const modalBackdrop = document.querySelector('.backdrop');
  const openButtons = document.querySelectorAll('.modal-open-js, .free-lesson-btn-js');
  const closeButtons = document.querySelectorAll('[data-modal-close]');

  if (!modalBackdrop) return;

  const openModal = (event) => {
    if (event) {
      event.preventDefault();
    }
    modalBackdrop.classList.remove('is-hidden');
    document.body.classList.add('modal-open');
  };

  const closeModal = () => {
    modalBackdrop.classList.add('is-hidden');
    document.body.classList.remove('modal-open');
  };

  openButtons.forEach((button) => {
    button.addEventListener('click', openModal);
  });

  closeButtons.forEach((button) => {
    button.addEventListener('click', closeModal);
  });

  modalBackdrop.addEventListener('click', (event) => {
    if (event.target === modalBackdrop) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modalBackdrop.classList.contains('is-hidden')) {
      closeModal();
    }
  });
});
