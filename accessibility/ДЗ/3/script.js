const btnSwitch = document.querySelector('[role="switch"]');
btnSwitch.onclick = function() {
    if(btnSwitch.getAttribute('aria-checked') === 'true') {
        btnSwitch.setAttribute('aria-checked', 'false');
    } else {
        btnSwitch.setAttribute('aria-checked', 'true');
    }
}