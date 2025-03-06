document.addEventListener('DOMContentLoaded', function() {
    // Fun loading messages
    const funnyLoadingMessages = [
        "Brewing eucalyptus tea for the server...",
        "Polishing the login leaves...",
        "Counting your data in the pouch...",
        "Hugging the digital trees...",
        "Convincing the drop bears to stay away...",
        "Untangling the vines of the internet...",
        "Gathering bytes like leaves..."
    ];

    // Random witty messages - these change on reload
    const loginWittyMessages = [
        "Passwords are like eucalyptus leaves... protect them!",
        "Login attempts are like climbing a tree - needs grip!",
        "Your password is like a cozy branch - secure and comfy!",
        "Drop bears don't break in - unless you leave the window open.",
        "If your password is 'koala', reconsider your life choices."
    ];

    const registerWittyMessages = [
        "Don't worry, we won't judge your tree-climbing skills (but the algorithm might)",
        "Creating an account is like planting a tree - do it once, enjoy it for years.",
        "We keep your data safer than joeys in a pouch.",
        "Your email is safe with us (we won't sell it... for less than a pile of eucalyptus)",
        "Your account will be more secure than a koala's grip"
    ];

    // Set random witty messages
    document.querySelector('#loginForm .witty-message').textContent =
        loginWittyMessages[Math.floor(Math.random() * loginWittyMessages.length)];

    document.querySelector('#registerForm .witty-message').textContent =
        registerWittyMessages[Math.floor(Math.random() * registerWittyMessages.length)];

    // Tab switching functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const forms = document.querySelectorAll('.form-container form');

    tabBtns.forEach(button => {
        button.addEventListener('click', function() {
            // Update active tab button
            tabBtns.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Show corresponding form
            const formId = this.getAttribute('data-form') + 'Form';
            forms.forEach(form => {
                form.classList.remove('active');
                if (form.id === formId) {
                    form.classList.add('active');
                }
            });

            // Clear previous form messages when switching tabs
            document.querySelectorAll('.form-message').forEach(msg => {
                msg.textContent = '';
                msg.className = 'form-message';
            });

            // Reset koala state
            resetKoalaState();
        });
    });

    // Fix placeholder issue with material design input
    document.querySelectorAll('input').forEach(input => {
        input.setAttribute('placeholder', ' '); // Empty space for placeholder
    });

    // Registration form submission
    document.getElementById('registerForm').addEventListener('submit', async function(event) {
        event.preventDefault();

        const messageElement = document.getElementById('registerMessage');
        messageElement.textContent = funnyLoadingMessages[Math.floor(Math.random() * funnyLoadingMessages.length)];
        messageElement.className = 'form-message';

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (!name || !email || !password) {
            messageElement.textContent = 'All fields are required (yes, every single one)';
            messageElement.className = 'form-message error';
            return;
        }

        try {
            // Simulate loading time for the joke message to be seen
            await new Promise(resolve => setTimeout(resolve, 1500));

            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            });

            const result = await response.json();
            console.log('Register response:', result);

            if (result.success) {
                // Clear form
                this.reset();

                // Show success message
                messageElement.textContent = result.message || "Account created! Ready for climbing.";
                messageElement.className = 'form-message success';

                // Switch to login tab after successful registration
                setTimeout(() => {
                    document.querySelector('[data-form="login"]').click();
                    showSuccessBanner('Account created! Time to show off those climbing skills!');
                }, 1500);
            } else {
                // Show error message with a fun twist
                const errorMessages = {
                    "Email already exists": "This email is already in a tree. Grab another?",
                    "Invalid email format": "That doesn't look like a vine. We need something with an @.",
                    "Password too weak": "That password is weaker than a twig. Try something stronger!"
                };
                messageElement.textContent = errorMessages[result.message] || result.message || "Something went wrong. Nature is unpredictable, right?";
                messageElement.className = 'form-message error';
            }
        } catch (error) {
            console.error('Registration error:', error);
            messageElement.textContent = 'The digital eucalyptus forest is down. Please try again.';
            messageElement.className = 'form-message error';
        }
    });

    // Login form submission
    document.getElementById('loginForm').addEventListener('submit', async function(event) {
        event.preventDefault();

        const messageElement = document.getElementById('loginMessage');
        messageElement.textContent = funnyLoadingMessages[Math.floor(Math.random() * funnyLoadingMessages.length)];
        messageElement.className = 'form-message';

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        if (!email || !password) {
            messageElement.textContent = 'Email and password are required. Like leaves and branches.';
            messageElement.className = 'form-message error';
            return;
        }

        try {
            // Simulate loading time for the joke message to be seen
            await new Promise(resolve => setTimeout(resolve, 1500));

            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const result = await response.json();
            console.log('Login response:', result);

            if (result.success) {
                // Clear form
                this.reset();

                // Show success message
                messageElement.textContent = "Login successful! Tree-climbing mode activated!";
                messageElement.className = 'form-message success';

                // Display welcome banner
                const welcomeMessages = [
                    `Welcome back, ${result.name || 'Joey'}! Climb on!`,
                    `${result.name || 'Joey'} has climbed back in!`,
                    `The legendary ${result.name || 'Joey'} returns!`,
                    `Welcome back! The eucalyptus is fresh for you, ${result.name || 'Joey'}.`
                ];

                showSuccessBanner(welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)]);

                // Store user info in localStorage
                localStorage.setItem('userLoggedIn', 'true');
                localStorage.setItem('userName', result.name || 'Joey');

                // In a real app, you might redirect to a dashboard or homepage after a delay
                // setTimeout(() => {
                //     window.location.href = '/dashboard';
                // }, 2000);
            } else {
                // Show error message with a fun twist
                const errorMessages = {
                    "Invalid credentials": "Those leaves don't match this tree.",
                    "User not found": "We looked everywhere, but couldn't find you. Are you a ghost koala?",
                    "Account locked": "Your account is sleeping in the sun."
                };

                messageElement.textContent = errorMessages[result.message] || result.message || "Login failed. Maybe the tree moved?";
                messageElement.className = 'form-message error';
            }
        } catch (error) {
            console.error('Login error:', error);
            messageElement.textContent = 'Our server is currently taking a nap. Please try again.';
            messageElement.className = 'form-message error';
        }
    });

    // Success banner display function
    function showSuccessBanner(message) {
        const banner = document.getElementById('successBanner');
        const bannerMessage = document.getElementById('successMessage');

        bannerMessage.textContent = message;
        banner.classList.remove('hidden');

        setTimeout(() => {
            banner.classList.add('hidden');
        }, 5000);
    }

    // Animate logo letters on hover
    const logoLetters = document.querySelectorAll('.letter');
    logoLetters.forEach(letter => {
        letter.addEventListener('mouseover', function() {
            this.style.transform = 'translateY(-10px) rotate(' + (Math.random() * 20 - 10) + 'deg)';
        });

        letter.addEventListener('mouseout', function() {
            this.style.transform = 'translateY(0) rotate(0)';
        });
    });

    // Check if user is already logged in (for demonstration purposes)
    if (localStorage.getItem('userLoggedIn') === 'true') {
        const userName = localStorage.getItem('userName') || 'Joey';
        const welcomeBackMessages = [
            `${userName} is back! More eucalyptus for everyone!`,
            `Look who's back! ${userName} has returned!`,
            `${userName} is back! Tree's ready!`,
            `Welcome back, ${userName}! Don't fall out of the tree!`
        ];

        showSuccessBanner(welcomeBackMessages[Math.floor(Math.random() * welcomeBackMessages.length)]);
    }

    // ========= KOALA ANIMATION FUNCTIONALITY =========
    const koala = document.querySelector('.koala-head');
    const loginEmail = document.getElementById('loginEmail');
    const registerEmail = document.getElementById('email');
    const loginPassword = document.getElementById('loginPassword');
    const registerPassword = document.getElementById('password');
    const showLoginPasswordBtn = document.getElementById('showLoginPassword');
    const showPasswordBtn = document.getElementById('showPassword');
    const leftEyelid = document.querySelector('.eye.left .eyelid');
    const rightEyelid = document.querySelector('.eye.right .eyelid');
    const leftPupil = document.querySelector('.eye.left .pupil');
    const rightPupil = document.querySelector('.eye.right .pupil');
    const coveringHands = document.querySelector('.covering-hands');

    // Initialize koala state
    function resetKoalaState() {
        koala.style.transform = 'rotate(0deg)';
        leftEyelid.style.height = '0';
        rightEyelid.style.height = '0';
        coveringHands.classList.remove('show');
        leftPupil.style.transform = 'translateX(0)';
        rightPupil.style.transform = 'translateX(0)';
    }

    // Email focus event for both forms
    [loginEmail, registerEmail].forEach(input => {
        if (!input) return;

        input.addEventListener('focus', () => {
            // Make sure eyes are open
            leftEyelid.style.height = '0';
            rightEyelid.style.height = '0';
            coveringHands.classList.remove('show');

            // Start neck movement animation
            koala.classList.add('looking');
        });

        input.addEventListener('blur', () => {
            // Stop neck movement
            koala.classList.remove('looking');
            koala.style.transform = 'rotate(0deg)';
        });

        // Track typing to move koala head
        input.addEventListener('input', () => {
            const inputLength = input.value.length;
            const maxRotation = 20; // Maximum rotation in degrees
            const direction = (inputLength % 2 === 0) ? 1 : -1; // Alternate directions
            const rotation = Math.min(inputLength, maxRotation) * direction;

            // Move head based on typing
            koala.style.transform = `rotate(${rotation}deg)`;

            // Move pupils
            const pupilPosition = (rotation / maxRotation) * 5; // Max 5px movement
            leftPupil.style.transform = `translateX(${pupilPosition}px)`;
            rightPupil.style.transform = `translateX(${pupilPosition}px)`;
        });
    });

    // Password focus event for both forms
    [loginPassword, registerPassword].forEach(input => {
        if (!input) return;

        input.addEventListener('focus', () => {
            // Close eyes and show hands when typing password
            leftEyelid.style.height = '100%';
            rightEyelid.style.height = '100%';
            coveringHands.classList.add('show'); // Show the hands
            koala.classList.remove('looking');
        });

        input.addEventListener('blur', () => {
            // Open eyes and hide hands when not focused on password
            if (!input.classList.contains('showing-password')) {
                leftEyelid.style.height = '0';
                rightEyelid.style.height = '0';
                coveringHands.classList.remove('show'); // Hide the hands
            }
        });
    });

    // Show password button for both forms
    [showLoginPasswordBtn, showPasswordBtn].forEach((btn, index) => {
        if (!btn) return;

        const passwordInput = index === 0 ? loginPassword : registerPassword;

        btn.addEventListener('mousedown', () => {
            // Change input type to show password
            passwordInput.type = 'text';
            passwordInput.classList.add('showing-password');

            // Peek through hands
            leftEyelid.style.height = '50%'; // Partially open
            rightEyelid.style.height = '50%'; // Partially open
            coveringHands.classList.add('show');
        });

        btn.addEventListener('mouseup', () => {
            // Change back to password type
            passwordInput.type = 'password';
            passwordInput.classList.remove('showing-password');

            // Close eyes fully again
            leftEyelid.style.height = '100%';
            rightEyelid.style.height = '100%';
            coveringHands.classList.remove('show'); // Ensure hands are removed when eyes are closed
        });

        btn.addEventListener('mouseleave', () => {
            // In case mouse leaves the button while pressed
            if (passwordInput.type === 'text') {
                passwordInput.type = 'password';
                passwordInput.classList.remove('showing-password');
                leftEyelid.style.height = '100%';
                rightEyelid.style.height = '100%';
                coveringHands.classList.remove('show'); // Ensure hands are removed when eyes are closed
            }
        });
    });
});
