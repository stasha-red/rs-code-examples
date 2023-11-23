// Найти кнопку на странице
const button = document.querySelector('.menu-toggle');

// Добавить событие по клику
button.onclick = function() {
    // Добавить/убрать класс "opened" и установить атрибут aria-expanded в значение true или false.
    if (button.classList.contains('opened')) {
        button.classList.remove('opened');
        button.setAttribute('aria-expanded', 'false');
    } else {
        button.classList.add('opened');
        button.setAttribute('aria-expanded', 'true');
    }
};