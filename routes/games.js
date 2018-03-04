const express = require('express');
const games = express.Router();

// Api Config
const igdb = require('igdb-api-node').default;
const client = igdb('25352be3dff60169e5ff09f019c6dbba');

// Global Var For List and Info
var list;
var game;

// Displays Search Results
games.post('/search', (req, res) => {
  // client.endpoint(options, [fields])
  client.games({
    filters: {
      'version_parent-not_exists': 1
    },
    search: req.body.search,
    limit: 50,
    }, [
      'name',
      'cover',
    ])
  .then(res => {
    list = res.body;
  })
  .catch(err => {
    throw err;
  });

  // Buffer All the Data
  // Need To Find Better Way
  setTimeout(() => {
    res.render('games/index', {list});
  }, 1500);
});

// Displays Information of Selected Game
games.get('/:id', (req, res, next) => {
  const gameId = req.params.id;

  client.games({
    ids: [gameId],
    fields: '*',
    expand: [
      'genres',
      'platforms',
      'themes',
      'games',
      'developers',
      'publishers',
      'game_engines',
      'player_perspectives',
      'game_modes',
    ]
  })
  .then(res => {
    game = res.body;
  })
  .catch(err => {
    throw err;
  })
  // Buffer All the Data
  // Need To Find Better Way
  setTimeout(() => {
    res.render('games/view', {game: game});
  }, 1500);
});


module.exports = games;