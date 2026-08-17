document.addEventListener('DOMContentLoaded', () => {

    const triggerOverlay = document.getElementById('triggerOverlay');
    const startButton = document.getElementById('startButton');
    const loadingBar = document.getElementById('loadingBar');
    const statusText = document.getElementById('statusText');
    const ambientLight = document.getElementById('ambientLight');
    const roseWrapper = document.getElementById('roseWrapper');
    const roseHead = document.getElementById('roseHead');
    const calyx = document.getElementById('calyx');
    const stem = document.getElementById('stem');
    const leafLeft = document.getElementById('leafLeft');
    const leafRight = document.getElementById('leafRight');
    const endText = document.getElementById('endText');
    const fallingPetalsEl = document.getElementById('fallingPetals');
    const scene = document.querySelector('.scene');

    const PETAL_LAYERS = [
        { count: 4, w: 24, h: 46, curl: 78, delayBase: 0, tz: 2, cls: 'petal-bud' },
        { count: 5, w: 34, h: 58, curl: 65, delayBase: 0.25, tz: 9, cls: 'petal-core' },
        { count: 6, w: 46, h: 72, curl: 48, delayBase: 0.55, tz: 18, cls: 'petal-inner' },
        { count: 7, w: 58, h: 88, curl: 22, delayBase: 0.90, tz: 30, cls: 'petal-mid-inner' },
        { count: 8, w: 72, h: 104, curl: -5, delayBase: 1.30, tz: 44, cls: 'petal-mid' },
        { count: 9, w: 86, h: 118, curl: -25, delayBase: 1.75, tz: 60, cls: 'petal-outer' },
        { count: 10, w: 98, h: 130, curl: -48, delayBase: 2.25, tz: 76, cls: 'petal-blush' },
    ];

    const SEPALS_COUNT = 5;

    const FALLING_PETAL_COLORS = [
        ['#9a001d', '#3d0008'],
        ['#850018', '#2b0005'],
        ['#ad0022', '#480008'],
        ['#bf0028', '#52000c'],
        ['#ffd27a', '#b8860b'],
        ['#ffe9b0', '#d4a017'],
    ];

    let fallingPetalInterval = null;


    function startCardLoader() {
        const duration = 2400;
        const steps = [
            { threshold: 20, text: 'Загружаем Birthday.css...' },
            { threshold: 50, text: 'Выращиваем цифровые лепестки...' },
            { threshold: 80, text: 'Добавляем бархатные текстуры...' },
            { threshold: 95, text: 'Оптимизируем 3D-рендеринг...' },
            { threshold: 100, text: 'Готово к цветению!' }
        ];

        let startTimestamp = null;

        function animateLoader(timestamp) {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const percent = Math.floor(progress * 100);

            loadingBar.style.width = `${percent}%`;
            const activeStep = steps.find(s => percent <= s.threshold) || steps[steps.length - 1];
            statusText.textContent = activeStep.text;

            if (progress < 1) {
                requestAnimationFrame(animateLoader);
            } else {
                startButton.removeAttribute('disabled');
            }
        }

        requestAnimationFrame(animateLoader);
    }


    function createStars() {
        const starfield = document.getElementById('starfield');
        const count = 40;
        for (let i = 0; i < count; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            const size = 1 + Math.random() * 2;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.left = `${Math.random() * 100}vw`;
            star.style.top = `${Math.random() * 100}vh`;
            star.style.setProperty('--tw-dur', `${3 + Math.random() * 4}s`);
            star.style.setProperty('--tw-delay', `${Math.random() * 5}s`);
            star.style.setProperty('--tw-max', `${0.4 + Math.random() * 0.5}`);
            starfield.appendChild(star);
        }
    }

    function createSepals() {
        const step = 360 / SEPALS_COUNT;
        for (let i = 0; i < SEPALS_COUNT; i++) {
            const sepal = document.createElement('div');
            sepal.className = 'sepal';
            const angle = i * step + (Math.random() - 0.5) * 5;
            const delay = 0.3 + i * 0.06;
            const curl = 18 + Math.random() * 8;

            sepal.style.setProperty('--sepal-angle', `${angle}deg`);
            sepal.style.setProperty('--sepal-curl', `${curl}deg`);
            sepal.style.setProperty('--sepal-delay', `${delay}s`);
            calyx.appendChild(sepal);
        }
    }

    function createPetals() {
        PETAL_LAYERS.forEach((layer, li) => {
            const angleStep = 360 / layer.count;
            const layerOffset = li * 24 + (Math.random() - 0.5) * 8;

            for (let i = 0; i < layer.count; i++) {
                const petal = document.createElement('div');
                petal.className = `petal ${layer.cls}`;

                const angle = layerOffset + i * angleStep + (Math.random() - 0.5) * 5;
                const delay = layer.delayBase + i * 0.05;
                const curlJitter = (Math.random() - 0.5) * 6;
                const scaleJitter = 0.94 + Math.random() * 0.12;
                const bloomDur = 2.1 + Math.random() * 0.4;

                petal.style.width = `${layer.w}px`;
                petal.style.height = `${layer.h}px`;
                petal.style.setProperty('--angle', `${angle}deg`);
                petal.style.setProperty('--curl', `${layer.curl + curlJitter}deg`);
                petal.style.setProperty('--scale', scaleJitter);
                petal.style.setProperty('--delay', `${delay}s`);
                petal.style.setProperty('--tz', `${layer.tz}px`);
                petal.style.setProperty('--bloom-dur', `${bloomDur}s`);

                roseHead.appendChild(petal);
            }
        });
    }

    function growStem() {
        return new Promise(resolve => {
            stem.classList.add('grow');

            setTimeout(() => {
                leafLeft.classList.add('visible');
            }, 800);

            setTimeout(() => {
                leafRight.classList.add('visible');
            }, 1100);

            setTimeout(resolve, 2200);
        });
    }

    function bloom() {
        calyx.classList.add('visible');
        ambientLight.classList.add('visible');
        roseHead.classList.add('blooming');
    }

    function spawnFallingPetal() {
        if (fallingPetalsEl.childElementCount > 10) return;

        const isHeart = Math.random() < 0.28;

        const x = 20 + Math.random() * 60;
        const y = 3 + Math.random() * 10;
        const dur = 5.5 + Math.random() * 3.5;
        const delay = Math.random() * 0.6;

        const sign = () => (Math.random() > 0.5 ? 1 : -1);
        const s1 = sign() * (15 + Math.random() * 25);
        const s2 = sign() * (10 + Math.random() * 20);
        const s3 = sign() * (20 + Math.random() * 30);
        const s4 = sign() * (10 + Math.random() * 15);

        if (isHeart) {
            const heart = document.createElement('div');
            heart.className = 'falling-heart';
            heart.textContent = Math.random() < 0.5 ? '❤️' : '💗';

            const size = 12 + Math.random() * 10;

            heart.style.left = `${x}vw`;
            heart.style.top = `${y}vh`;
            heart.style.setProperty('--fh-size', `${size}px`);
            heart.style.setProperty('--f-dur', `${dur}s`);
            heart.style.setProperty('--f-delay', `${delay}s`);
            heart.style.setProperty('--s1', `${s1}px`);
            heart.style.setProperty('--s2', `${s2}px`);
            heart.style.setProperty('--s3', `${s3}px`);
            heart.style.setProperty('--s4', `${s4}px`);

            fallingPetalsEl.appendChild(heart);

            setTimeout(() => {
                if (heart.parentNode) heart.remove();
            }, (dur + delay) * 1000 + 300);
            return;
        }

        const petal = document.createElement('div');
        petal.className = 'falling-petal';

        const w = 10 + Math.random() * 12;
        const h = w * (1.25 + Math.random() * 0.15);

        const colors = FALLING_PETAL_COLORS[Math.floor(Math.random() * FALLING_PETAL_COLORS.length)];

        petal.style.left = `${x}vw`;
        petal.style.top = `${y}vh`;
        petal.style.setProperty('--fp-w', `${w}px`);
        petal.style.setProperty('--fp-h', `${h}px`);
        petal.style.setProperty('--fp-c1', colors[0]);
        petal.style.setProperty('--fp-c2', colors[1]);
        petal.style.setProperty('--f-dur', `${dur}s`);
        petal.style.setProperty('--f-delay', `${delay}s`);
        petal.style.setProperty('--s1', `${s1}px`);
        petal.style.setProperty('--s2', `${s2}px`);
        petal.style.setProperty('--s3', `${s3}px`);
        petal.style.setProperty('--s4', `${s4}px`);

        fallingPetalsEl.appendChild(petal);

        setTimeout(() => {
            if (petal.parentNode) petal.remove();
        }, (dur + delay) * 1000 + 300);
    }

    function startFallingPetals() {
        for (let i = 0; i < 3; i++) {
            setTimeout(() => spawnFallingPetal(), i * 300);
        }

        fallingPetalInterval = setInterval(() => {
            spawnFallingPetal();
        }, 2200);
    }


    async function startAnimationSequence() {
        await growStem();
        await delay(100);
        bloom();

        setTimeout(() => {
            roseWrapper.classList.add('rotating');
        }, 2600);

        setTimeout(() => startFallingPetals(), 3400);

        setTimeout(() => {
            endText.classList.add('visible');
        }, 4600);
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    startButton.addEventListener('click', () => {
        triggerOverlay.classList.add('fade-out');

        setTimeout(() => {
            startAnimationSequence();
        }, 800);
    });
    createStars();
    createSepals();
    createPetals();

    setTimeout(() => {
        startCardLoader();
    }, 400);

});