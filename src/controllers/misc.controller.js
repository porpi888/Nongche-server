'use strict';

const staticJson = require('@utils/static-json.util');
const staticImage = require('@utils/static-image.util');
const { sendSuccess, sendError } = require('@utils/response.util');

const isProd = process.env.NODE_ENV === 'production';

exports.addIngameLog = (req, res) => {
  return sendSuccess(res, { logged: true });
};

exports.addMatchLog = (req, res) => {
  return sendSuccess(res, { logged: true });
};

exports.addErrorLog = (req, res) => {
  return sendSuccess(res, { logged: true });
};

exports.checkPenalty = (req, res) => {

  return sendSuccess(res, { hasPenalty: false, penaltyUntil: null });
};

exports.checkServerDetect = (req, res) => {

  return sendSuccess(res, { detected: false });
};

exports.getTreasureProgress = (req, res) => {
  const player = req.player;
  const progress = (player?.playerRecord && player.playerRecord.treasure) || {
    current_step: 0,
    completed: false,
    claimed_rewards: [],
  };
  return sendSuccess(res, { progress });
};

// /hshs/player/playerstat/get
exports.getPlayerStat = (req, res) => {
  const p = req.player || {};
  const rec = p.playerRecord || {};
  const rank = { current_rank_point: 0, current_rank_name: 'Bronze V', current_rank_tier: 5, leaderboard_number: '-' };
  return sendSuccess(res, {
    playerStat: {
      level: p.playerStat?.level || 0,
      exp: p.playerStat?.exp || 0,
      mmrSurvivor: p.playerStat?.mmrSurvivor || 100,
      mmrHunter: p.playerStat?.mmrHunter || 100,
      MatchHistory: p.playerStat?.MatchHistory || { survivor: [], hunter: [], '4v4': [] },
    },
    playerRecord: {},
    playerRecordHunter: rec.hunter || {},
    playerRecordSurvivor: rec.survivor || {},
    rankData: p.rankData || { warden: rank, visitor: rank, '4v4': rank },
    returnPlayerStatus: p.returnPlayerStatus || { active: false, expiresAt: null, history: [], updatedAt: null },
  });
};

// /hshs/store/ghostmarket/list  (empty market)
exports.getGhostMarket = (req, res) => {
  return res.json({ data: { next: {}, previous: {}, store: [] }, status: true });
};

// /hshs/bonus/api/get_bonus_data
exports.getBonusData = (req, res) => {
  return sendSuccess(res, {});
};

exports.getMailbox = (req, res) => {

  return sendSuccess(res, { mails: [], unreadCount: 0 });
};

const BANNER_FILE_MAP = Object.freeze({
  greedy:        'static/gacha/banner_greedy.json',
  default_gacha: 'static/gacha/banner_greedy.json',
  bullet:        'static/gacha/banner_bullet.json',
  bullet_gacha:  'static/gacha/banner_bullet.json',
});

exports.getGachaBanner = async (req, res) => {
  try {
    // id may arrive in the query string or the JSON body, in any letter case
    const raw = req.query?.id ?? req.query?.banner ?? req.query?.loot_box_short_code
             ?? req.body?.id ?? req.body?.banner ?? req.body?.loot_box_short_code;
    const bannerId = String(raw ?? '').toLowerCase();
    const file = BANNER_FILE_MAP[bannerId];
    if (!file) {
      console.log(`[banner] unknown banner id: ${JSON.stringify(raw)} url=${req.originalUrl}`);
      return sendError(res, 404, 'Banner not found');
    }
    const data = await staticJson.load(file);
    return res.json(data);
  } catch (error) {
    return sendError(res, 500, 'Failed to load banner');
  }
};

exports.genQr = (req, res) => {

  return sendSuccess(res, {
    qr_url: null,
    qr_text: null,
    enabled: false,
    message: 'QR service not available on this private server',
  });
};

exports.getExpRankTable = staticJson.serve('static/exprk/exprk_table.json');

exports.getBannerImage = staticImage.serveByParam('key');
