document.addEventListener('DOMContentLoaded', () => {
    loadProfile();
    loadNews();
    loadPublications();
    setupThemeToggle();
    setupCursorEffect();
    updateYear();
});

async function loadProfile() {
    try {
        const response = await fetch('data/profile.json?v=' + new Date().getTime());
        const data = await response.json();
        
        // Generate Social Links List (Vertical, Icon + Text)
        const socialListHTML = data.social.map(link => `
            <a href="${link.url}" ${link.url.startsWith('mailto:') ? '' : 'target="_blank"'} class="social-list-item">
                <span class="social-icon-wrapper"><i class="${link.icon}"></i></span>
                <span class="social-text">${link.network}</span>
            </a>
        `).join('');

        // New Two-Column Layout
        const heroHTML = `
            <div class="profile-container">
                <div class="profile-sidebar">
                    <img src="${data.avatar}" alt="${data.name}" class="profile-avatar">
                    <h1 class="profile-name">${data.name}</h1>
                    <div class="profile-affiliations">
                        ${data.affiliations ? data.affiliations.map(line => `<div>${line}</div>`).join('') : ''}
                    </div>
                    
                    <div class="profile-contact-list">
                        ${socialListHTML}
                    </div>
                </div>
                
                <div class="profile-main" id="about">
                    <h2 class="about-title">About Me</h2>
                    <div class="about-text">
                        <p>${data.about}</p>
                    </div>
                </div>
            </div>
        `;
        document.querySelector('.hero-content').innerHTML = heroHTML;

        // Inject Footer Social Links (Keep footer simple icon-only if desired, or remove if redundant. 
        // Usually good to keep footer links. The existing code handles footer injection below.)
        const footerLinksHTML = data.social.map(link => `
            <a href="${link.url}" ${link.url.startsWith('mailto:') ? '' : 'target="_blank"'} class="social-btn">
                <i class="${link.icon}"></i>
            </a>
        `).join('');
        document.getElementById('contact-links').innerHTML = footerLinksHTML;

    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

async function loadNews() {
    try {
        const response = await fetch('data/news.json?v=' + new Date().getTime());
        const data = await response.json();
        
        const newsHTML = data.map(item => `
            <div class="news-item">
                <div class="news-date">${item.date}</div>
                <div class="news-content">${item.content}</div>
            </div>
        `).join('');
        
        document.getElementById('news-list').innerHTML = newsHTML;
    } catch (error) {
        console.error('Error loading news:', error);
    }
}

async function loadPublications() {
    try {
        const response = await fetch('data/publications.json?v=' + new Date().getTime());
        const data = await response.json();
        
        const pubsHTML = data.map(pub => `
            <div class="paper-card">
                ${pub.image ? `<img src="${pub.image}" alt="${pub.title}" class="paper-image">` : ''}
                <div class="paper-content">
                    <h3 class="paper-title">${pub.title}</h3>
                    <p class="paper-authors">${highlightAuthor(pub.authors)}</p>
                    <div class="paper-venue">${pub.venue}</div>
                    <div class="paper-links">
                        ${pub.links.map(link => `<a href="${link.url}" target="_blank">${link.name}</a>`).join('')}
                    </div>
                </div>
            </div>
        `).join('');
        
        document.getElementById('publication-list').innerHTML = pubsHTML;
    } catch (error) {
        console.error('Error loading publications:', error);
    }
}

function highlightAuthor(authors) {
    // Assuming "Zhiyang Hu" is the main author to highlight
    // This could be made dynamic based on profile.json
    return authors.map(author => {
        if (author.includes('Zhiyang Hu') || author.includes('Z. Hu')) {
            return `<strong>${author}</strong>`;
        }
        return author;
    }).join(', ');
}

function setupThemeToggle() {
    const toggleBtn = document.getElementById('theme-toggle');
    const icon = toggleBtn.querySelector('i');
    
    // Check for saved preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        icon.className = 'fas fa-sun';
    }

    toggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            icon.className = 'fas fa-moon';
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            icon.className = 'fas fa-sun';
        }
    });
}

function setupCursorEffect() {
    const glow = document.querySelector('.cursor-glow');
    
    document.addEventListener('mousemove', (e) => {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
    });
}

function updateYear() {
    document.getElementById('year').textContent = new Date().getFullYear();
}
