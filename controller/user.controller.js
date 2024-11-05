
const signup = async (req, res) => {
    const { username, email, password } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
        return res.status(400).json({ error: "Username, email, and password are required." });
    }

    try {
        // Create a new Parse User object
        const user = new Parse.User();
        user.set("username", username);
        user.set("email", email);
        user.set("password", password);

        // Attempt to sign up the user
        await user.signUp();

        // Respond with success
        res.status(201).json({
            message: "User successfully created",
            user: {
                id: user.id,
                username: user.get("username"),
                email: user.get("email"),
            },
        });
    } catch (error) {
        // Enhanced error handling based on Parse error codes
        if (error.code === 202) {
            return res.status(409).json({ error: "Username already taken." });
        } else if (error.code === 203) {
            return res.status(409).json({ error: "Email already registered." });
        } else if (error.code === 125) {
            return res.status(400).json({ error: "Invalid email address." });
        } else {
            // For other unknown errors, log it and send a generic message
            console.error("Signup error:", error);
            return res.status(500).json({ error: "An unexpected error occurred during signup. Please try again." });
        }
    }
};



const login = async (req, res) => {
    const { username, password } = req.body;

    // Validate required fields
    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required." });
    }

    try {
        // Attempt to log in the user
        const user = await Parse.User.logIn(username, password);

        // Send successful response with user data and session token
        res.status(200).json({
            message: "Login successful",
            user: {
                id: user.id,
                username: user.get("username"),
                email: user.get("email"),
            },
            sessionToken: user.getSessionToken(),
        });
    } catch (error) {
        // Handle specific error codes for login failures
        if (error.code === 101) {
            return res.status(401).json({ error: "Invalid username or password." });
        } else {
            // Log unknown errors and send a generic message
            console.error("Login error:", error);
            return res.status(500).json({ error: "An unexpected error occurred during login. Please try again." });
        }
    }
};



// Optional
const logout = async (req, res) => {
    const sessionToken = req.headers["x-parse-session-token"];

    // Check if session token is provided
    if (!sessionToken) {
        return res.status(400).json({ error: "Session token is required for logout." });
    }

    try {
        // Set session token and log out
        const query = new Parse.Query(Parse.Session);
        query.equalTo('sessionToken', sessionToken);
        const session = await query.first({ useMasterKey: true });

        if (!session) {
            return res.status(401).json({ error: 'Unauthorized: Invalid session token' });
        }

        await Parse.User.logOut();

        // Send success response
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        // Handle specific error codes for logout failures
        if (error.code === 209) {
            return res.status(401).json({ error: "Invalid session token." });
        } else {
            // Log unknown errors and send a generic message
            console.error("Logout error:", error);
            return res.status(500).json({ error: "An unexpected error occurred during logout. Please try again." });
        }
    }
};


module.exports = {
    signup,
    login,
    logout
}