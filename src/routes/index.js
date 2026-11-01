'use strict';

const express = require('express');

const staticJson        = require('@utils/static-json.util');
const staticImage       = require('@utils/static-image.util');
const playerRoutes      = require('./player.routes');
const storeRoutes       = require('./store.routes');
const inventoryRoutes   = require('./inventory.routes');
const immortalRoutes    = require('./Immortal.routes');
const gameRoutes        = require('./game.routes');
const gachaRoutes       = require('./gacha.routes');
const miscRoutes        = require('./misc.routes');
const logapiRoutes      = require('./logapi.routes');
const misc              = require('@controllers/misc.controller');

// Route prefixes the game clients call. Online uses /live, Survive uses /hshs.
// Both are served by default; override with API_PREFIX in .env
// (comma separated, e.g. API_PREFIX=/hshs for Survive only).
const PREFIXES = (process.env.API_PREFIX || '/live,/hshs')
  .split(',')
  .map((p) => p.trim().replace(/\/+$/, ''))
  .filter(Boolean);

const router = express.Router();

router.get('/', staticImage.serve('mainmenu_banner'));

const LOOT_BOX_FILE_MAP = Object.freeze({
  Default_Gacha: 'static/pots/greedy.json',
  Bullet_Gacha:  'static/pots/bullet.json',
});

for (const P of PREFIXES) {
  router.use(`${P}/player`,       playerRoutes);
  router.use(`${P}/player`,       inventoryRoutes);
  router.use(`${P}`,              gameRoutes);
  router.use(`${P}`,              storeRoutes);
  router.use(`${P}`,              immortalRoutes);
  router.use(`${P}/lootboxgo`,    gachaRoutes);
  router.use(`${P}`,              miscRoutes);

  router.use(`${P}/immortal/get`,            staticJson.serve('static/player/immortal.json'));
  router.use(`${P}/player/curserelic/get`,   staticJson.serve('static/player/curserelic.json'));

  router.get(`${P}/lootboxgo/api/items`, (req, res) => {
    const file = LOOT_BOX_FILE_MAP[req.query.loot_box_short_code];
    if (!file) {
      return res.status(404).json({ error: 'Loot box not found' });
    }
    return staticJson.serve(file)(req, res);
  });
}

router.use('/logapi/v1',         logapiRoutes);

module.exports = router;
