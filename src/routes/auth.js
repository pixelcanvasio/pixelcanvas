/**
 * Created by arkeros on 24/5/17.
 * @flow
 */


import express from 'express';


const router = express.Router();

export default (passport) => {
  router.get('/facebook',
    passport.authenticate('facebook', { scope: ['email', 'user_location'] }),
  );
  router.get('/facebook/return', passport.authenticate('facebook', {
    failureRedirect: '/login',
    successRedirect: '/',
  }));

  router.get('/discord', passport.authenticate('discord', { scope: ['identify', 'email'] }));
  router.get('/login/discord/return', passport.authenticate('discord', {
    failureRedirect: '/login',
    successRedirect: '/',
  }));

  router.get('/google', passport.authenticate('google', { scope: ['profile'] }));
  router.get('/google/return', passport.authenticate('google', {
    failureRedirect: '/login',
    successRedirect: '/',
  }));

  router.get('/reddit', passport.authenticate('reddit', { duration: 'permanent', state: 'foo' }));
  router.get('/reddit/return', passport.authenticate('reddit', {
    failureRedirect: '/login',
    successRedirect: '/',
  }));

  return router;
};
