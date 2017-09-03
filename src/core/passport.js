/**
 * Created by arkeros on 9/5/17.
 * https://scotch.io/tutorials/easy-node-authentication-linking-all-accounts-together#toc-linking-accounts-together
 *
 * @flow
 */

import passport from 'passport';
import { Strategy as DiscordStrategy } from 'passport-discord';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';
import { Strategy as RedditStrategy } from 'passport-reddit';

import { User } from '../data/models';
import { auth } from '../config';


passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  // User.findById(id, function (err, user) {
  //   done(err, user);
  // });
  // TODO
  done(null, new User(id));
});


/**
 * Sign in with Facebook.
 */
passport.use(new FacebookStrategy({
  ...auth.facebook,
  callbackURL: '/login/facebook/return',
  profileFields: ['name', 'email', 'link'],
  passReqToCallback: true,
}, (req, accessToken, refreshToken, profile, done) => {
  const loginName = 'facebook';
  const claimType = 'urn:facebook:access_token';
  // console.log({ profile, refreshToken, accessToken });
  const id = `facebook:${profile.id}`;
  const user = new User(id);
  done(null, user);
}));

/**
 * Sign in with Discord.
 */
passport.use(new DiscordStrategy({
  ...auth.discord,
  callbackURL: '/login/discord/return',
}, (accessToken, refreshToken, profile, done) => {
  console.log({ profile, refreshToken, accessToken });
  const id = `discord:${profile.id}`;
  const user = new User(id);
  done(null, user);
}));

/**
 * Sign in with Google.
 */
passport.use(new GoogleStrategy({
  ...auth.google,
  callbackURL: '/login/google/return',
}, (accessToken, refreshToken, profile, done) => {
  console.log({ profile, refreshToken, accessToken });
  const id = `google:${profile.id}`;
  const user = new User(id);
  done(null, user);
}));

/**
 * Sign in with Reddit.
 */
passport.use(new RedditStrategy({
  ...auth.reddit,
  callbackURL: '/login/reddit/return',
}, (accessToken, refreshToken, profile, done) => {
  console.log({ profile, refreshToken, accessToken });
  const id = `reddit:${profile.id}`;
  const user = new User(id);
  done(null, user);
}));


export default passport;
