// Wait for the DOM to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', () => {

    // --- Animated Background Particles ---
    const particlesContainer = document.getElementById('background-particles');
    const particlesCount = 30; // Adjust for more/fewer particles
    for (let i = 0; i < particlesCount; i++) {
        let particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.top = `${Math.random() * 100}vh`;
        const size = Math.random() * 6 + 2; // Size between 2px and 8px
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.animationDelay = `${Math.random() * 25}s`;
        particlesContainer.appendChild(particle);
    }

    // --- Sticky Navbar Logic ---
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section, header');

    window.addEventListener('scroll', () => {
        // Add scrolled class to navbar
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Highlight active nav link
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });


    // --- Intersection Observer for Scroll Animations ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Handle skill bar animations
                if (entry.target.classList.contains('skills-expertise')) {
                    const skillBars = entry.target.querySelectorAll('.skill-bar');
                    skillBars.forEach(bar => {
                        const percent = bar.dataset.percent;
                        bar.style.width = `${percent}%`;
                    });
                }

                // Add 'is-visible' class for generic fade-in animations
                entry.target.classList.add('is-visible'); 

                observer.unobserve(entry.target); // Stop observing once visible
            }
        });
    }, {
        threshold: 0.2 // Trigger when 20% of the element is visible
    });

    // Observe all project cards that aren't hidden for "View More"
    document.querySelectorAll('.project-card:not(.hidden)').forEach(card => {
        observer.observe(card);
    });

    // Observe new elements in the About Me section
    const aboutText = document.querySelector('.about-text');
    const skillsSection = document.querySelector('.skills-expertise');
    if (aboutText) observer.observe(aboutText);
    if (skillsSection) observer.observe(skillsSection);

    // --- Portfolio "View More" Functionality ---
    const viewMoreBtn = document.getElementById('view-more-btn');
    const hiddenProjects = document.querySelectorAll('.project-card.hidden');

    if (viewMoreBtn) {
        viewMoreBtn.addEventListener('click', () => {
            hiddenProjects.forEach((project, index) => {
                // Set a transition delay for a staggered effect
                project.style.transitionDelay = `${index * 100}ms`;

                // Remove the 'hidden' class to trigger the CSS transition
                project.classList.remove('hidden');

                // Set max-height for smooth expansion
                project.style.maxHeight = project.scrollHeight + 40 + 'px'; // 40 for padding

                // Add to the observer to animate them in as they appear
                observer.observe(project);
            });

            // Hide the "View More" button after it's clicked
            viewMoreBtn.style.opacity = '0';
            viewMoreBtn.style.pointerEvents = 'none';
        });
    }

   /* // --- Contact Form Submission ---
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');*/

    if (contactForm) {
        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            
            const form = event.target;
            const formData = new FormData(form);
            // Web3Forms recommends sending data as a JSON object
            const jsonObject = Object.fromEntries(formData.entries());

            const submitButton = form.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            formStatus.textContent = ''; // Clear previous status
            formStatus.classList.remove('success', 'error');
            
            try {
                const response = await fetch(form.action, {
                    method: form.method,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(jsonObject)
                });

                const result = await response.json();

                if (result.success) {
                    formStatus.textContent = "Thank you for your message! I'll get back to you soon.";
                    formStatus.classList.add('success');
                    form.reset();
                } else {
                    console.error('Submission failed:', result);
                    formStatus.textContent = `Oops! ${result.message}. Please try again.`;
                    formStatus.classList.add('error');
                }
            } catch (error) {
                // Handle network errors
                console.error('Form submission error:', error);
                formStatus.textContent = 'Oops! There was a network error. Please check your connection and try again.';
                formStatus.classList.add('error');
            } finally {
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
            }
        });
    }

});