document.addEventListener('DOMContentLoaded', () => {
    const startTestBtn = document.getElementById('startTest');
    const stopTestBtn = document.getElementById('stopTest');
    const restartTestBtn = document.getElementById('restartTest');
    const resetTestBtn = document.getElementById('resetTest');
    const showResultBtn = document.getElementById('showResult');
    const typingBox = document.getElementById('typingBox');
    const contentDiv = document.getElementById('content');
    const timerSpan = document.getElementById('timer');
    const mistakesSpan = document.getElementById('mistakes');
    const introDiv = document.querySelector('.intro');
    const testDiv = document.querySelector('.test');
    const nameInput = document.getElementById('name');

    let timer;
    let timeLeft;
    let mistakes = 0;
    const content = "This is a sample text for the typing test. Type it as fast as you can with accuracy.";
    let testStarted = false;

    startTestBtn.addEventListener('click', startTest);
    stopTestBtn.addEventListener('click', stopTest);
    restartTestBtn.addEventListener('click', restartTest);
    resetTestBtn.addEventListener('click', resetTest);
    showResultBtn.addEventListener('click', showResult);

    function startTest() {
        const timeOption = document.querySelector('input[name="time"]:checked');
        if (!timeOption) {
            alert('Please select a timer option');
            return;
        }

        if (!nameInput.value) {
            alert('Please enter your name');
            return;
        }

        timeLeft = parseInt(timeOption.value);
        timerSpan.textContent = `Timer: ${timeLeft}`;
        mistakesSpan.textContent = `Mistakes: ${mistakes}`;
        contentDiv.textContent = content;
        typingBox.disabled = false;
        typingBox.value = '';
        typingBox.focus();
        testStarted = true;

        introDiv.classList.remove('active');
        testDiv.classList.add('active');

        timer = setInterval(() => {
            timeLeft--;
            timerSpan.textContent = `Timer: ${timeLeft}`;
            if (timeLeft <= 0) {
                clearInterval(timer);
                alert('OOPS!! TIME OUT!!');
                stopTest(true); // Pass true to indicate timeout
            }
        }, 1000);
    }

    function stopTest(isTimeout = false) {
        clearInterval(timer);
        typingBox.disabled = true;
        if (testStarted) {
            if (!isTimeout) {
                calculateResult();
            } else {
                setTimeout(calculateResult, 100); // Delay to ensure the timeout alert is shown first
            }
            testStarted = false;
        }
    }

    function restartTest() {
        clearInterval(timer);
        mistakes = 0;
        timeLeft = parseInt(document.querySelector('input[name="time"]:checked').value);
        timerSpan.textContent = `Timer: ${timeLeft}`;
        mistakesSpan.textContent = `Mistakes: ${mistakes}`;
        contentDiv.textContent = content;
        typingBox.value = '';
        typingBox.disabled = false;
        typingBox.focus();
        testStarted = true;

        timer = setInterval(() => {
            timeLeft--;
            timerSpan.textContent = `Timer: ${timeLeft}`;
            if (timeLeft <= 0) {
                clearInterval(timer);
                alert('OOPS!! TIME OUT!!');
                stopTest(true); // Pass true to indicate timeout
            }
        }, 1000);
    }

    function resetTest() {
        clearInterval(timer);
        typingBox.disabled = true;
        mistakes = 0;
        timerSpan.textContent = 'Timer: 00';
        mistakesSpan.textContent = 'Mistakes: 0';
        contentDiv.textContent = '';
        introDiv.classList.add('active');
        testDiv.classList.remove('active');
        nameInput.value = '';
        document.querySelector('input[name="time"]:checked').checked = false;
    }
        

    function showResult() {
        calculateResult();
    }

    function calculateResult() {
        const typedText = typingBox.value.trim();
        const wordsTyped = typedText.split(/\s+/).length; // Improved word count calculation
        const minutes = (parseInt(document.querySelector('input[name="time"]:checked').value) / 60);
        const wpm = (wordsTyped / minutes).toFixed(2);
        const accuracy = ((1 - (mistakes / content.length)) * 100).toFixed(2);
        const userName = nameInput.value;

        alert(`HI, ${userName}\nYour Score \nSpeed: ${wpm} WPM\nAccuracy: ${accuracy}%`);
    }

    typingBox.addEventListener('input', (e) => {
        const typedText = e.target.value;
        contentDiv.innerHTML = '';
        mistakes = 0; // Reset mistakes for each input

        for (let i = 0; i < content.length; i++) {
            const span = document.createElement('span');
            if (typedText[i] === undefined) {
                span.textContent = content[i];
            } else if (typedText[i] === content[i]) {
                span.textContent = content[i];
                span.style.color = 'green';
            } else {
                span.textContent = content[i];
                span.style.color = 'red';
                mistakes++;
            }
            contentDiv.appendChild(span);
        }

        mistakesSpan.textContent = `Mistakes: ${mistakes}`;
    });
});
