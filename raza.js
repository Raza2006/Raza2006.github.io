// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize skills animation
    initSkillsAnimation();
    
    // Mobile menu toggle
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler) {
        navbarToggler.addEventListener('click', function() {
            navbarCollapse.classList.toggle('show');
        });
    }
    
    // Event tracking for Q2
    setupEventTracking();
    
    // Text analysis for Q3
    setupTextAnalysis();
});

// Function to initialize skills animation
function initSkillsAnimation() {
    const skillBars = document.querySelectorAll('.skill-bar');
    
    // Initial setting of skill bars to 0 width
    skillBars.forEach(bar => {
        bar.style.width = '0';
    });
    
    // Create an intersection observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Only animate if element is in view
            if (entry.isIntersecting) {
                const skillBar = entry.target;
                const percent = skillBar.getAttribute('data-percent');
                
                // Animate the skill bar
                setTimeout(() => {
                    skillBar.style.width = percent;
                }, 200);
                
                // Unobserve after animation
                observer.unobserve(skillBar);
            }
        });
    }, { threshold: 0.1 });
    
    // Observe all skill bars
    skillBars.forEach(bar => {
        observer.observe(bar);
    });
}

// Function to setup event tracking (Q2)
function setupEventTracking() {
    // Log page view on load
    logEvent('view', 'page');
    
    // Track clicks on all elements
    document.addEventListener('click', function(event) {
        const target = event.target;
        let objectType = target.tagName.toLowerCase();
        
        // Determine more specific element type
        if (target.closest('a')) {
            objectType = 'link';
        } else if (target.closest('button')) {
            objectType = 'button';
        } else if (target.tagName === 'IMG') {
            objectType = 'image';
        } else if (target.closest('.skill-bar')) {
            objectType = 'skill-bar';
        } else if (target.closest('.nav-link')) {
            objectType = 'navigation-link';
        } else if (target.closest('.social-link')) {
            objectType = 'social-link';
        }
        
        // Log the click event
        logEvent('click', objectType);
    });
    
    // Track viewing of sections when they come into view
    const sections = document.querySelectorAll('section');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                logEvent('view', `section-${sectionId}`);
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
}

// Function to log events
function logEvent(eventType, objectType) {
    const timestamp = new Date().toISOString();
    console.log(`${timestamp}, ${eventType}, ${objectType}`);
}

// Function to setup text analysis (Q3)
function setupTextAnalysis() {
    const analyzeButton = document.getElementById('analyzeButton');
    const textInput = document.getElementById('textInput');
    
    // Lists for text analysis
    const pronouns = [
        'i', 'me', 'my', 'mine', 'myself',
        'you', 'your', 'yours', 'yourself', 'yourselves',
        'he', 'him', 'his', 'himself',
        'she', 'her', 'hers', 'herself',
        'it', 'its', 'itself',
        'we', 'us', 'our', 'ours', 'ourselves',
        'they', 'them', 'their', 'theirs', 'themselves',
        'who', 'whom', 'whose', 'which', 'what',
        'this', 'that', 'these', 'those'
    ];
    
    const prepositions = [
        'about', 'above', 'across', 'after', 'against', 'along', 'amid', 'among', 
        'around', 'as', 'at', 'before', 'behind', 'below', 'beneath', 'beside', 
        'between', 'beyond', 'by', 'concerning', 'considering', 'despite', 'down', 
        'during', 'except', 'for', 'from', 'in', 'inside', 'into', 'like', 'near', 
        'of', 'off', 'on', 'onto', 'out', 'outside', 'over', 'past', 'regarding', 
        'round', 'since', 'through', 'throughout', 'to', 'toward', 'towards', 
        'under', 'underneath', 'until', 'unto', 'up', 'upon', 'with', 'within', 'without'
    ];
    
    const indefiniteArticles = ['a', 'an'];
    
    // Set up click handler for analyze button
    if (analyzeButton && textInput) {
        analyzeButton.addEventListener('click', function() {
            const text = textInput.value;
            
            if (!text.trim()) {
                alert('Please enter some text to analyze.');
                return;
            }
            
            // Log the analysis event
            logEvent('click', 'analyze-text-button');
            
            // Perform analysis
            analyzeBasicStats(text);
            const tokens = tokenizeText(text);
            analyzeParts(tokens, pronouns, 'pronounResults');
            analyzeParts(tokens, prepositions, 'prepositionResults');
            analyzeParts(tokens, indefiniteArticles, 'articleResults');
        });
    }
}

// Function to analyze basic statistics of the text
function analyzeBasicStats(text) {
    // Count letters
    const letterCount = (text.match(/[a-zA-Z]/g) || []).length;
    
    // Count words (split by whitespace)
    const wordCount = text.trim().split(/\s+/).length;
    
    // Count spaces
    const spaceCount = (text.match(/\s/g) || []).length;
    
    // Count newlines
    const newlineCount = (text.match(/\n/g) || []).length;
    
    // Count special symbols (non-alphanumeric, non-whitespace)
    const specialCount = (text.match(/[^a-zA-Z0-9\s]/g) || []).length;
    
    // Update UI with counts
    document.getElementById('letterCount').textContent = letterCount;
    document.getElementById('wordCount').textContent = wordCount;
    document.getElementById('spaceCount').textContent = spaceCount;
    document.getElementById('newlineCount').textContent = newlineCount;
    document.getElementById('specialCount').textContent = specialCount;
}

// Function to tokenize text
function tokenizeText(text) {
    // Convert to lowercase and replace any non-alphanumeric characters with spaces
    const cleanText = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
    
    // Split by whitespace and filter out empty tokens
    return cleanText.split(/\s+/).filter(token => token.length > 0);
}

// Function to analyze tokens for specific parts of speech
function analyzeParts(tokens, wordList, resultContainerId) {
    const resultContainer = document.getElementById(resultContainerId);
    resultContainer.innerHTML = '';
    
    // Count occurrences of each word from the list
    const counts = {};
    tokens.forEach(token => {
        if (wordList.includes(token)) {
            counts[token] = (counts[token] || 0) + 1;
        }
    });
    
    // Display results
    if (Object.keys(counts).length === 0) {
        resultContainer.innerHTML = '<p>None found in the text.</p>';
        return;
    }
    
    // Create a table to display results
    const table = document.createElement('table');
    table.innerHTML = `
        <tr>
            <th>Word</th>
            <th>Count</th>
        </tr>
    `;
    
    // Sort by count (highest first)
    Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .forEach(([word, count]) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${word}</td>
                <td>${count}</td>
            `;
            table.appendChild(row);
        });
    
    resultContainer.appendChild(table);
}
