document.addEventListener("DOMContentLoaded", function () {
    let users = JSON.parse(localStorage.getItem("users")) || [];

    const encode = (str) => btoa(str);
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

    // FORGOT PASSWORD
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
        window.location.href = "index.html";
    });

    // SHOW USERNAME
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser && document.getElementById("profileName")) {
        document.getElementById("profileName").innerText = `👤 ${currentUser.username}`;
    }

    // CRIME DETECTION
    document.getElementById("crimeForm")?.addEventListener("submit", function (e) {
        e.preventDefault();
        const description = document.getElementById("crimeDescription").value.toLowerCase();

        const keywordMap = {
            theft: ["stolen", "theft", "robbed", "snatched", "steal"],
            assault: ["hit", "assault", "beat", "fought", "punched", "abuse", "harass"],
            fraud: ["cheated", "fraud", "scammed", "duped"],
            murder: ["killed", "murder", "homicide", "dead", "stabbed"],
            cybercrime: ["hacked", "cyber", "online fraud", "phishing"],
            rape: ["rape", "molested", "sexually assaulted"],
            kidnapping: ["abducted", "kidnapped", "taken away"],
            bribery: ["bribe", "corruption", "demanded money"],
            defamation: ["defamed", "false statement", "character assassination"],
            domesticViolence: ["husband beat", "abused", "domestic violence"],
            drugs: ["drug", "narcotics", "smuggled drugs"],
            stalking: ["followed", "stalked", "harassed"],
            arson: ["burned", "fire", "set on fire"],
            extortion: ["extorted", "blackmailed", "threatened for money"],
            robbery: ["robbery", "armed", "looted"],
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

    // RESULT PAGE – ONLY BNS
    if (window.location.pathname.endsWith("result.html")) {
        const crimeType = localStorage.getItem("selectedCrime");

        const crimeData = {
            theft: { bns: "BNS 303", action: "File FIR", punishment: "3 years or fine", steps: "Go to nearest police station with any proof like bills, witness etc." },
            assault: { bns: "BNS 130", action: "Police complaint", punishment: "3 months or fine", steps: "File a complaint with medical proof, if injured." },
            fraud: { bns: "BNS 316", action: "Report to EOW", punishment: "7 years and fine", steps: "Collect documents/messages and go to police or EOW." },
            murder: { bns: "BNS 101", action: "Immediate FIR", punishment: "Death or life imprisonment", steps: "Call police or dial 112. Provide details." },
            cybercrime: { bns: "BNS 109", action: "Cyber Cell Complaint", punishment: "3 years and fine", steps: "File complaint at cybercrime.gov.in with screenshots." },
            rape: { bns: "BNS 63", action: "Police complaint", punishment: "7 years to life", steps: "Medical exam needed. Dial 112 or go to police." },
            kidnapping: { bns: "BNS 137", action: "File FIR", punishment: "7 years and fine", steps: "Report with last known location of victim." },
            bribery: { bns: "BNS 214", action: "Report to ACB", punishment: "1 year or fine", steps: "If safe, record proof and submit to ACB." },
            defamation: { bns: "BNS 356", action: "File complaint", punishment: "2 years or fine", steps: "Take printed/recorded proof to magistrate." },
            domesticViolence: { bns: "BNS 85", action: "Police complaint", punishment: "3 years and fine", steps: "Visit police or women's help center." },
            drugs: { bns: "NDPS Act", action: "Narcotics Bureau", punishment: "10 years to life", steps: "Submit proof/tip to NCB or police." },
            stalking: { bns: "BNS 78", action: "Police complaint", punishment: "3 years and fine", steps: "Save messages/calls. Report to police." },
            arson: { bns: "BNS 324", action: "File FIR", punishment: "7 years and fine", steps: "Provide photos or fire dept report." },
            extortion: { bns: "BNS 308", action: "Police complaint", punishment: "3 years and fine", steps: "Provide logs or evidence to police." },
            robbery: { bns: "BNS 309", action: "File FIR", punishment: "10 years and fine", steps: "Submit CCTV or eyewitness info." },
            acidAttack: { bns: "BNS 122", action: "Police complaint", punishment: "10 years to life", steps: "Call emergency. Seek medical care and file FIR." },
            dowryHarassment: { bns: "BNS 85", action: "Police complaint", punishment: "3 years and fine", steps: "Contact police or NCW with messages or threats." },
            blackmail: { bns: "BNS 351", action: "File complaint", punishment: "2 years and fine", steps: "Keep screenshot evidence. File complaint." },
            humanTrafficking: { bns: "BNS 139", action: "File FIR", punishment: "7–10 years and fine", steps: "Contact AHTU or dial 112. Provide info." }
        };

        const crimeInfo = crimeData[crimeType];

        if (crimeInfo && document.getElementById("crimeInfo")) {
            const readableName = crimeType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            document.getElementById("crimeInfo").innerHTML = `
                <h3>Crime Detected: ${readableName}</h3>
                <p><strong>BNS Section:</strong> ${crimeInfo.bns}</p>
                <p><strong>Action:</strong> ${crimeInfo.action}</p>
                <p><strong>Punishment:</strong> ${crimeInfo.punishment}</p>
                <p><strong>Next Steps:</strong> ${crimeInfo.steps}</p>
            `;
        } else {
            document.getElementById("crimeInfo").innerText = "❌ Crime not found or not recognized.";
        }
    }
});








