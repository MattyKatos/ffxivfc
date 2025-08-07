// DJ Jippity’s Node.js Express server for Eternal Hearth
const express = require('express');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

// Cache for FC members to avoid repeated scraping
let fcMembersCache = [];
let lastFetchTime = 0;
const CACHE_DURATION = 3600000; // 1 hour in milliseconds

// Endpoint to get FC members from Lodestone
app.get('/api/fc-members', async (req, res) => {
  try {
    const currentTime = Date.now();
    
    // Check if cache is valid
    if (fcMembersCache.length > 0 && currentTime - lastFetchTime < CACHE_DURATION) {
      return res.json(fcMembersCache);
    }
    
    // Fetch FC members from Lodestone
    const members = await scrapeFCMembers();
    
    // Update cache
    fcMembersCache = members;
    lastFetchTime = currentTime;
    
    res.json(members);
  } catch (error) {
    console.error('Error fetching FC members:', error);
    res.status(500).json({ error: 'Failed to fetch FC members' });
  }
});

async function scrapeFCMembers() {
  try {
    const url = 'https://na.finalfantasyxiv.com/lodestone/freecompany/9231394073691181144/member/';
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    
    const members = [];
    
    // Extract member names from the page - only from entry__freecompany__center
    $('.entry__freecompany__center .entry__name').each((i, element) => {
      const name = $(element).text().trim();
      if (name) {
        members.push(name);
      }
    });
    
    // If no members found with the specific selector, try a more general approach
    if (members.length === 0) {
      console.log('No members found with specific selector, trying alternative...');
      $('.entry__name').each((i, element) => {
        const name = $(element).text().trim();
        if (name) {
          members.push(name);
        }
      });
    }
    
    console.log(`Found ${members.length} FC members`);
    return members;
  } catch (error) {
    console.error('Error scraping FC members:', error);
    return [];
  }
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🔥 Eternal Hearth server is running at http://localhost:${PORT} 🔥`);
});
