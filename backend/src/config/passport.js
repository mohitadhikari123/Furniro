import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/User.model.js";

// Google OAuth Strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if user already exists with this Google ID
                let existingUser = await User.findOne({ googleId: profile.id });
                
                if (existingUser) {
                    return done(null, existingUser);
                }
                
                // Check if user exists with same email
                existingUser = await User.findOne({ email: profile.emails[0].value });
                
                if (existingUser) {
                    // Link Google account to existing user
                    existingUser.googleId = profile.id;
                    existingUser.authProvider = "google";
                    existingUser.avatar = profile.photos[0]?.value;
                    await existingUser.save();
                    return done(null, existingUser);
                }
                
                // Create new user
                const newUser = new User({
                    googleId: profile.id,
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    avatar: profile.photos[0]?.value,
                    authProvider: "google",
                });
                
                await newUser.save();
                done(null, newUser);
            } catch (error) {
                console.error("Error in Google Strategy:", error);
                done(error, null);
            }
        }
    )
);

// Serialize user for session
passport.serializeUser((user, done) => {
    done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

export default passport;