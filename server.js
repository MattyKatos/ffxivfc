// DJ Jippity's Node.js Express server for Eternal Hearth
// Using older Node.js compatible code
var express = require('express');
var path = require('path');
var https = require('https');
var cheerio = require('cheerio');
var app = express();
var PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

// Cache for FC members to avoid repeated scraping
var fcMembersCache = [];
var lastFetchTime = 0;
var CACHE_DURATION = 3600000; // 1 hour in milliseconds

// Endpoint to get FC members from Lodestone
app.get('/api/fc-members', function(req, res) {
  try {
    var currentTime = Date.now();
    
    // Check if cache is valid
    if (fcMembersCache.length > 0 && currentTime - lastFetchTime < CACHE_DURATION) {
      return res.json(fcMembersCache);
    }
    
    // Fetch FC members from Lodestone
    scrapeFCMembers()
      .then(function(members) {
        // Update cache
        fcMembersCache = members;
        lastFetchTime = currentTime;
        
        res.json(members);
      })
      .catch(function(error) {
        console.error('Error fetching FC members:', error);
        res.status(500).json({ error: 'Failed to fetch FC members' });
      });
  } catch (error) {
    console.error('Error in FC members endpoint:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
});

function scrapeFCMembers() {
  return new Promise(function(resolve, reject) {
    var url = 'https://na.finalfantasyxiv.com/lodestone/freecompany/9231394073691181144/member/';
    
    https.get(url, function(res) {
      var data = '';
      
      // A chunk of data has been received
      res.on('data', function(chunk) {
        data += chunk;
      });
      
      // The whole response has been received
      res.on('end', function() {
        try {
          var $ = cheerio.load(data);
          var members = [];
          
          // Extract member names from the page - only from entry__freecompany__center
          $('.entry__freecompany__center .entry__name').each(function(i, element) {
            var name = $(element).text().trim();
            if (name) {
              members.push(name);
            }
          });
          
          // If no members found with the specific selector, try a more general approach
          if (members.length === 0) {
            console.log('No members found with specific selector, trying alternative...');
            $('.entry__name').each(function(i, element) {
              var name = $(element).text().trim();
              if (name) {
                members.push(name);
              }
            });
          }
          
          // If still no members, provide some default names
          if (members.length === 0) {
            console.log('No members found, using default names');
            return resolve(['Eternal Hearth', 'Cozy Home', 'Welcome', 'Join Us']);
          }
          
          console.log('Found ' + members.length + ' FC members');
          resolve(members);
        } catch (error) {
          console.error('Error parsing FC members:', error);
          reject(error);
        }
      });
    }).on('error', function(error) {
      console.error('Error fetching FC members:', error);
      reject(error);
    });
  });
}

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, function() {
  console.log('🔥 Eternal Hearth server is running at http://localhost:' + PORT + ' 🔥');
});
