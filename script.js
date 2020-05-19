const passwordInput = document.querySelector("#password-input");
const strengthMeter = document.querySelector("#strength-meter");
const hintList = document.querySelector("#hints");

function calculatePasswordStrength(password) {
    const weaknesses = [];
    weaknesses.push(lengthWeakness(password));
    weaknesses.push(lowercaseWeakness(password));
    weaknesses.push(uppercaseWeakness(password));
    weaknesses.push(numberWeakness(password));
    weaknesses.push(specialCharacterWeakness(password));
    weaknesses.push(repeatedCharacterWeakness(password));
    return weaknesses;
}

function lengthWeakness(password) {
    const length = password.length;

    if (length <= 5) {
        return {
            message: "Your password is too short.",
            deduction: 40
        }
    }

    if (length <= 10) {
        return {
            message: "Your password could be longer.",
            deduction: 15
        }
    }
}

function characterTypeWeakness(password, regex, type) {
    const matches = password.match(regex) || [];

    if (matches.length === 0) {
        return {
            message: `Your password doesn't include any ${type}s.`,
            deduction: 20
        }
    }
    
    if (matches.length <= 2) {
        return {
            message: `Your password could include more ${type}s.`,
            deduction: 5
        }
    }
}

function lowercaseWeakness(password) {
    return characterTypeWeakness(password, /[a-z]/g, "lowercase letter");
}

function uppercaseWeakness(password) {
    return characterTypeWeakness(password, /[A-Z]/g, "uppercase letter");
}

function numberWeakness(password) {
    return characterTypeWeakness(password, /[0-9]/g, "number");
}

function specialCharacterWeakness(password) {
    return characterTypeWeakness(password, /[^0-9a-zA-Z\s]/g, "special character");
}

function repeatedCharacterWeakness(password) {
    const regex = /(.)\1/g;
    const matches = password.match(regex) || [];

    if (matches.length > 0) {
        return {
            message: "Your password includes repeated characters.",
            deduction: matches.length * 5
        }
    }
}

function updateStrengthMeter() {
    const password = passwordInput.value;
    const weaknesses = calculatePasswordStrength(password);

    let strength = 100;
    let hints = "";

    weaknesses.forEach(weakness => {
        if (!weakness) return;
        strength -= weakness.deduction;
        hints += `<li>${weakness.message}</li>`;
    });

    strengthMeter.style.setProperty("--strength", strength);
    hintList.innerHTML = hints;
}

passwordInput.addEventListener("input", updateStrengthMeter);

updateStrengthMeter()