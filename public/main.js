// DJ Jippity's anime.js front-end magic
window.onload = function() {
  // ANIMATE TITLE
  anime({
    targets: '#main-title',
    translateY: [-80, 0],
    opacity: [0, 1],
    scale: [0.7, 1],
    duration: 1500,
    easing: 'easeOutElastic(1, .8)'
  });
  anime({
    targets: '#subtitle',
    opacity: [0, 1],
    delay: 1700,
    duration: 1000,
    translateY: [-40, 0], // Changed from [40, 0] to [-40, 0] to make it drop down
    easing: 'easeOutQuad'
  });

  // ANIMATE COZY GLOW - FADE IN AND STAY
  anime({
    targets: '.cozy-glow',
    opacity: [0, 0.7],
    delay: 2000,
    duration: 2000,
    easing: 'easeInOutQuad',
    complete: function() {
      // Start the subtle pulse animation after fade-in completes
      anime({
        targets: '.cozy-glow',
        opacity: [0.7, 0.5, 0.7],
        duration: 3000,
        loop: true,
        easing: 'easeInOutSine'
      });
    }
  });
  
  // CREATE AND ANIMATE EMBERS
  createEmbers();
}

// Global variables to store FC members and track recently used names
let fcMembers = [];
let recentlyUsedNames = new Set();
let nameUsageTimestamps = {};

// How long to wait before reusing a name (in milliseconds)
const NAME_REUSE_DELAY = 30000; // 30 seconds

// Function to fetch FC members from the server
async function fetchFCMembers() {
  try {
    const response = await fetch('/api/fc-members');
    if (!response.ok) {
      throw new Error('Failed to fetch FC members');
    }
    fcMembers = await response.json();
    console.log('Fetched FC members:', fcMembers);
  } catch (error) {
    console.error('Error fetching FC members:', error);
    // Fallback with some default names if fetch fails
    fcMembers = ['Eternal Hearth', 'Cozy Home', 'Welcome', 'Join Us'];
  }
}

// Function to get a name that hasn't been used recently
function getUnusedName() {
  const currentTime = Date.now();
  
  // Clean up old names from the recently used set
  for (const name in nameUsageTimestamps) {
    if (currentTime - nameUsageTimestamps[name] > NAME_REUSE_DELAY) {
      recentlyUsedNames.delete(name);
      delete nameUsageTimestamps[name];
    }
  }
  
  // If all names have been used recently and we have more than 1 name,
  // use the oldest one
  if (recentlyUsedNames.size >= fcMembers.length && fcMembers.length > 1) {
    let oldestName = null;
    let oldestTime = Infinity;
    
    for (const name in nameUsageTimestamps) {
      if (nameUsageTimestamps[name] < oldestTime) {
        oldestTime = nameUsageTimestamps[name];
        oldestName = name;
      }
    }
    
    // Mark this name as recently used
    nameUsageTimestamps[oldestName] = currentTime;
    return oldestName;
  }
  
  // Find an unused name
  const availableNames = fcMembers.filter(name => !recentlyUsedNames.has(name));
  
  if (availableNames.length === 0) {
    // If somehow we don't have any names available, just pick a random one
    const randomIndex = Math.floor(Math.random() * fcMembers.length);
    const name = fcMembers[randomIndex];
    nameUsageTimestamps[name] = currentTime;
    recentlyUsedNames.add(name);
    return name;
  }
  
  // Pick a random unused name
  const randomIndex = Math.floor(Math.random() * availableNames.length);
  const name = availableNames[randomIndex];
  
  // Mark this name as recently used
  nameUsageTimestamps[name] = currentTime;
  recentlyUsedNames.add(name);
  
  return name;
}

// Function to create embers
function createEmbers() {
  const embersContainer = document.querySelector('.embers-container');
  const emberCount = 25; // Increased from 15 to 25 for more visible effect
  
  // Initialize the stop flag
  window.stopEmberCreation = false;
  
  // Fetch FC members first
  fetchFCMembers().then(() => {
    // Create initial embers
    for (let i = 0; i < emberCount; i++) {
      createEmber(embersContainer);
    }
    
    // Continue creating embers at intervals
    setInterval(() => {
      if (!window.stopEmberCreation && document.querySelectorAll('.ember').length < 40) { // Increased limit from 25 to 40
        createEmber(embersContainer);
      }
    }, 1000); // New ember every second (faster than before)
  });
}

// Function to create a single ember
function createEmber(container) {
  // Decide if this ember should have a name (1 in 3 chance)
  const hasName = Math.random() < 0.3 && fcMembers.length > 0;
  
  if (hasName) {
    // Create a named ember with FC member name
    createNamedEmber(container);
  } else {
    // Create a regular ember
    createRegularEmber(container);
  }
}

// Function to create a regular ember (just a glowing dot)
function createRegularEmber(container) {
  const ember = document.createElement('div');
  ember.className = 'ember';
  
  // Random position at the bottom of the screen
  const posX = Math.random() * window.innerWidth;
  const startY = Math.random() * 100; // Position near the bottom
  
  // Random size (tiny)
  const size = 2 + Math.random() * 3;
  
  // Set ember properties
  ember.style.left = `${posX}px`;
  ember.style.bottom = `${startY}px`;
  ember.style.width = `${size}px`;
  ember.style.height = `${size}px`;
  
  // Add to container
  container.appendChild(ember);
  
  // Animate the ember
  const duration = 8000 + Math.random() * 7000; // 8-15 seconds
  
  anime({
    targets: ember,
    translateY: [-10, -window.innerHeight - 100], // Start with slight downward movement
    translateX: (Math.random() - 0.5) * 200, // Drift left or right slightly
    opacity: [0.7, 0.7, 0], // Start visible, end invisible
    easing: 'easeOutQuad',
    duration: duration,
    complete: function() {
      if (ember.parentNode) {
        ember.parentNode.removeChild(ember);
      }
    }
  });
}

// Function to create an ember with FC member name
function createNamedEmber(container) {
  // Create wrapper div that will contain both ember and name
  const wrapper = document.createElement('div');
  wrapper.className = 'named-ember-wrapper';
  
  // Create ember element
  const ember = document.createElement('div');
  ember.className = 'ember';
  
  // Create name element
  const nameElement = document.createElement('div');
  nameElement.className = 'member-name';
  
  // Get a name that hasn't been used recently
  const memberName = getUnusedName();
  nameElement.textContent = memberName;
  
  // Random position at the bottom of the screen
  const posX = Math.random() * (window.innerWidth - 150); // Account for name width
  const startY = Math.random() * 100; // Position near the bottom
  
  // Set wrapper properties
  wrapper.style.left = `${posX}px`;
  wrapper.style.bottom = `${startY}px`;
  
  // Add ember and name to wrapper
  wrapper.appendChild(ember);
  wrapper.appendChild(nameElement);
  
  // Add wrapper to container
  container.appendChild(wrapper);
  
  // Animate the named ember
  const duration = 10000 + Math.random() * 8000; // 10-18 seconds (slightly longer than regular embers)
  
  anime({
    targets: wrapper,
    translateY: [-10, -window.innerHeight - 150], // Start with slight downward movement
    translateX: (Math.random() - 0.5) * 100, // Less drift for named embers
    opacity: {
      value: [0, 1, 1, 0],
      duration: duration,
      easing: 'easeInOutSine'
    },
    duration: duration,
    easing: 'easeOutQuad',
    complete: function() {
      if (wrapper.parentNode) {
        wrapper.parentNode.removeChild(wrapper);
      }
    }
  });
}


document.getElementById('ignite-btn').addEventListener('click', function() {
  // Animate the title as before
  anime({
    targets: '#main-title',
    scale: [1, 1.1],
    color: ['#fff', '#ffb347'],
    duration: 800,
    easing: 'easeInOutQuad'
  });
  
  // Stop creating new embers
  window.stopEmberCreation = true;
  
  // Fade everything except the title to black
  anime({
    targets: [
      '#subtitle',
      '#ignite-btn',
      '.cozy-glow',
      '.ember',
      '.named-ember-wrapper',
      '.member-name'
    ],
    opacity: [1, 0],
    duration: 900,
    easing: 'easeInOutQuad'
  });
  
  // Fade body background to black
  anime({
    targets: 'body',
    backgroundColor: ['#121212', '#000'],
    duration: 900,
    easing: 'easeInOutQuad'
  });
  
  // Redirect after fade
  setTimeout(function() {
    window.location.href = 'https://discord.gg/6T9gtkDH7M';
  }, 1100);
});
