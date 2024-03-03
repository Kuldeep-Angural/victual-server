const passport = require("passport");
const { saveGoogleLoginDetails } = require("../controller/userController");
const schema = require("../Schema/schema");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, callback) => {
      try {
        const user = await schema.user.findOne({ _id: profile.id });
        if (!user) {
          const user = new schema.user({
            _id: profile?.id,
            name: profile?.displayName,
            email: profile?.emails[0].value,
            googlePhoto: profile.photos[0].value,
            isGoogleLogin: true,
          });
          await user.save();
        }
        return callback(null, profile);
      } catch (error) {
        return callback(error, null);
      }
    }
  )
);

passport.serializeUser((user, callback) => {
  callback(null, user);
});

passport.deserializeUser((user, callback) => {
  callback(null, user);
});
