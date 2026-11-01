'use strict';

const router = require('express').Router();
const misc = require('@controllers/misc.controller');
const { verifySession } = require('@middleware/auth.middleware');

router.post('/treasure/api/progress/get', verifySession, misc.getTreasureProgress);
// the client may call these with GET or POST — accept both
router.route('/mailbox/get').get(verifySession, misc.getMailbox).post(verifySession, misc.getMailbox);
router.route('/gacha/static/api/banner').get(misc.getGachaBanner).post(misc.getGachaBanner);
router.post('/ogilvy/genqr',              verifySession, misc.genQr);
router.post('/exprk/api/table',           misc.getExpRankTable);

router.get('/banner/:key',                misc.getBannerImage);

module.exports = router;
