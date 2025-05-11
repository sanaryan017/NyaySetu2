document.addEventListener("DOMContentLoaded", function () {
    let users = JSON.parse(localStorage.getItem("users")) || [];

    const encode = (str) => btoa(str);  // basic encoding
    const decode = (str) => atob(str);

    // LOGIN
    document.getElementById("loginForm")?.addEventListener("submit", function (e) {
        e.preventDefault();
        const username = document.getElementById("loginUsername").value;
        const password = document.getElementById("loginPassword").value;

        const user = users.find(u => u.username === username);

        if (!user) {
            document.getElementById("loginError").innerText = "User not found. Please sign up.";
        } else if (decode(user.password) !== password) {
            document.getElementById("loginError").innerText = "Incorrect password.";
        } else {
            localStorage.setItem("currentUser", JSON.stringify(user));
            localStorage.setItem("loginTime", Date.now());  // session start time
            window.location.href = "dashboard.html";
        }
    });

    // SIGNUP
    document.getElementById("signupForm")?.addEventListener("submit", function (e) {
        e.preventDefault();
        const username = document.getElementById("signupUsername").value;
        const password = document.getElementById("signupPassword").value;
        const question = document.getElementById("signupSecurityQuestion").value;
        const answer = document.getElementById("signupSecurityAnswer").value;

        if (!username || !password || !question || !answer) return;

        if (users.some(u => u.username === username)) {
            document.getElementById("signupError").innerText = "Username already taken.";
            document.getElementById("signupMessage").innerText = "";
        } else {
            users.push({ username, password: encode(password), question, answer: encode(answer.toLowerCase()) });
            localStorage.setItem("users", JSON.stringify(users));
            document.getElementById("signupError").innerText = "";
            document.getElementById("signupMessage").innerText = "Signup successful! Redirecting...";
            setTimeout(() => window.location.href = "index.html", 1500);
        }
    });

    // SESSION EXPIRY (10 minutes)
    const loginTime = localStorage.getItem("loginTime");
    if (loginTime && Date.now() - loginTime > 10 * 60 * 1000) {
        localStorage.removeItem("currentUser");
        localStorage.removeItem("loginTime");
        alert("Session expired. Please log in again.");
        window.location.href = "index.html";
    }

    // FORGOT PASSWORD — Show question
    document.getElementById("forgotUsername")?.addEventListener("blur", function () {
        const username = this.value.trim();
        const user = users.find(u => u.username === username);

        const questionBox = document.getElementById("securityQBox");
        const questionText = document.getElementById("displayedQuestion");

        if (user) {
            let q = "";
            if (user.question === "pet") q = "What is your pet’s name?";
            if (user.question === "school") q = "What was your first school?";
            if (user.question === "city") q = "Which city were you born in?";
            questionBox.style.display = "block";
            questionText.innerText = q;
            document.getElementById("forgotResult").innerText = "";
            document.getElementById("resetPasswordBox").style.display = "none";
        } else {
            questionBox.style.display = "none";
            document.getElementById("forgotResult").innerText = "Username not found.";
        }
    });

    // VERIFY answer
    document.getElementById("verifyAnswerBtn")?.addEventListener("click", function () {
        const username = document.getElementById("forgotUsername").value.trim();
        const answer = document.getElementById("forgotAnswer").value.trim().toLowerCase();
        const user = users.find(u => u.username === username);

        if (user && decode(user.answer) === answer) {
            document.getElementById("resetPasswordBox").style.display = "block";
            document.getElementById("forgotResult").innerText = "";
        } else {
            document.getElementById("forgotResult").innerText = "Incorrect answer.";
        }
    });

    // RESET PASSWORD
    document.getElementById("forgotForm")?.addEventListener("submit", function (e) {
        e.preventDefault();
        const username = document.getElementById("forgotUsername").value.trim();
        const newPassword = document.getElementById("newPassword").value;
        const index = users.findIndex(u => u.username === username);

        if (index !== -1) {
            users[index].password = encode(newPassword);
            localStorage.setItem("users", JSON.stringify(users));
            document.getElementById("forgotSuccess").innerText = "✅ Password reset! You can now log in.";
            document.getElementById("forgotResult").innerText = "";
            document.getElementById("resetPasswordBox").style.display = "none";
        } else {
            document.getElementById("forgotResult").innerText = "Something went wrong. Try again.";
        }
    });

    // LOGOUT
    document.getElementById("logout")?.addEventListener("click", function () {
        localStorage.removeItem("currentUser");
        localStorage.removeItem("loginTime");
        window.location.href = "index.html";
    });

    // USERNAME DISPLAY
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser && document.getElementById("profileName")) {
        document.getElementById("profileName").innerText = `👤 ${currentUser.username}`;
    }

    // DASHBOARD CRIME DETECTION
    document.getElementById("crimeForm")?.addEventListener("submit", function (e) {
        e.preventDefault();
        const description = document.getElementById("crimeDescription").value.toLowerCase();

        const keywordMap = {
            theft: ["stolen", "theft", "robbed", "snatched", "steal", "pickpocket"],
            assault: ["hit", "assault", "beat", "fought", "punched", "attacked"],
            fraud: ["cheated", "fraud", "scammed", "duped", "tricked"],
            murder: ["killed", "murder", "homicide", "dead", "stabbed"],
            cybercrime: ["hacked", "cyber", "online fraud", "phishing", "data breach"],
            rape: ["rape", "molested", "sexually assaulted"],
            kidnapping: ["abducted", "kidnapped", "taken away"],
            bribery: ["bribe", "corruption", "demanded money"],
            defamation: ["defamed", "false statement", "character assassination"],
            domesticViolence: ["husband beat", "abused", "domestic violence"],
            drugs: ["drug", "narcotics", "smuggled drugs"],
            stalking: ["followed", "stalked", "harassed"],
            arson: ["burned", "fire", "set on fire"],
            extortion: ["extorted", "blackmailed", "threatened for money"],
            robbery: ["robbery", "armed", "looted", "held at gunpoint"],
            acidAttack: ["acid attack", "threw acid"],
            dowryHarassment: ["dowry", "harassed for money", "demanded dowry"],
            blackmail: ["blackmailed", "threatened to reveal"],
            humanTrafficking: ["trafficking", "sold person", "illegal transport"]
        };

        let matchedCrime = null;
        for (const [crime, keywords] of Object.entries(keywordMap)) {
            if (keywords.some(word => description.includes(word))) {
                matchedCrime = crime;
                break;
            }
        }

        if (!matchedCrime) {
            alert("Could not identify the issue. Please describe it in more detail.");
            return;
        }

        localStorage.setItem("selectedCrime", matchedCrime);
        window.location.href = "result.html";
    });

    // RESULT DISPLAY
    if (window.location.pathname.endsWith("result.html")) {
        const crimeType = localStorage.getItem("selectedCrime");
        const crimeData = {/* same as before, no need to repeat */};
        const crimeInfo = crimeData[crimeType];

        if (crimeInfo && document.getElementById("crimeInfo")) {
            const readableName = crimeType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            document.getElementById("crimeInfo").innerHTML = `
                <h3>Crime Detected: ${readableName}</h3>
                <p><strong>IPC:</strong> ${crimeInfo.ipc}</p>
                <p><strong>Action:</strong> ${crimeInfo.action}</p>
                <p><strong>Punishment:</strong> ${crimeInfo.punishment}</p>
                <p><strong>Next Steps:</strong> ${crimeInfo.steps}</p>
            `;
        }
    }
});



