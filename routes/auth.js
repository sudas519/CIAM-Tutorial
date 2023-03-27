var express = require('express');
var passport = require('passport');
var OpenIDConnectStrategy = require('passport-openidconnect');
var app = express();
// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(new OpenIDConnectStrategy({
  issuer: process.env['ISSUER'],
  authorizationURL: process.env['AUTHORIZATIONURL'],
  tokenURL: process.env['TOKENURL'],
  userInfoURL: process.env['USRINFO'],
  clientID: process.env['CLIENT_ID'],
  clientSecret: process.env['CLIENT_SECRET'],
  callbackURL: '/oauth2/redirect',
  scope: [ 'profile' ]
}, function verify(issuer, profile, cb) {
  return cb(null, profile);
}));

passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    cb(null, { id: user.id, username: user.username, name: user.displayName });
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});

function checkAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.session.returnTo = req.url
    res.redirect("/");
  }
}
var router = express.Router();

router.get('/login', passport.authenticate('openidconnect'));
//router.get('/register', passport.authenticate('openidconnect'));

router.get('/oauth2/redirect', passport.authenticate('openidconnect', {
  callback: true,
  successReturnToOrRedirect: '/',
  failureRedirect: '/login'
}));

router.post('/logout', function(req, res, next) {
  //router.post('/logout', (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect(process.env.OIDC_CI_BASE_URI + '/idaas/mtfim/sps/idaas/logout?themeId=68eea2c6-f4af-4841-8fbe-c44de1392bf1');
});
//Added on 5th March
router.post('/profile', function(req, res, next) {
 
 });
//Added on 5th March
module.exports = router;
