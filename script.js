document.addEventListener("DOMContentLoaded", function () {
    let users = JSON.parse(localStorage.getItem("users")) || [];

    // LOGIN
    document.getElementById("loginForm")?.addEventListener("submit", function (e) {
        e.preventDefault();
        const username = document.getElementById("loginUsername").value;
        const password = document.getElementById("loginPassword").value;

        const user = users.find(u => u.username === username);

        if (!user) {
            document.getElementById("loginError").innerText = "User not found. Please sign up.";
        } else if (user.password !== password) {
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

        let users = JSON.parse(localStorage.getItem("users")) || [];

        if (users.some(u => u.username === username)) {
            document.getElementById("signupError").innerText = "Username already taken.";
            document.getElementById("signupMessage").innerText = "";
        } else {
            users.push({ username, password, question, answer: answer.toLowerCase() });
            localStorage.setItem("users", JSON.stringify(users));
            document.getElementById("signupError").innerText = "";
            document.getElementById("signupMessage").innerText = "Signup successful! Redirecting...";
            setTimeout(() => window.location.href = "index.html", 1500);
        }
    });

    // FORGOT PASSWORD — Show question
    document.getElementById("forgotUsername")?.addEventListener("blur", function () {
        const username = this.value.trim();
        const users = JSON.parse(localStorage.getItem("users")) || [];
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

    // FORGOT PASSWORD — Verify answer
    document.getElementById("verifyAnswerBtn")?.addEventListener("click", function () {
        const username = document.getElementById("forgotUsername").value.trim();
        const answer = document.getElementById("forgotAnswer").value.trim().toLowerCase();

        const users = JSON.parse(localStorage.getItem("users")) || [];
        const user = users.find(u => u.username === username);

        if (user && user.answer === answer) {
            document.getElementById("resetPasswordBox").style.display = "block";
            document.getElementById("forgotResult").innerText = "";
        } else {
            document.getElementById("forgotResult").innerText = "Incorrect answer.";
        }
    });

    // FORGOT PASSWORD — Reset
    document.getElementById("forgotForm")?.addEventListener("submit", function (e) {
        e.preventDefault();
        const username = document.getElementById("forgotUsername").value.trim();
        const newPassword = document.getElementById("newPassword").value;

        let users = JSON.parse(localStorage.getItem("users")) || [];
        const index = users.findIndex(u => u.username === username);

        if (index !== -1) {
            users[index].password = newPassword;
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
            theft: ["stolen", "theft", "robbed", "snatched", "steal"],
            assault: ["hit", "assault", "beat", "fought", "punched"],
            fraud: ["cheated", "fraud", "scammed", "duped"],
            murder: ["killed", "murder", "homicide", "dead"],
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

    // RESULT DISPLAY
    if (window.location.pathname.endsWith("result.html")) {
        const crimeData = {
            theft: {
                ipc: "IPC 378",
                action: "File FIR",
                punishment: "3 years or fine",
                steps: "Go to the nearest police station with evidence like bills, photos, or witness statements. File FIR under IPC 378."
            },
            assault: {
                ipc: "IPC 351",
                action: "Police complaint",
                punishment: "3 months or fine",
                steps: "Visit your local police station. Submit medical report if injured. File complaint under IPC 351."
            },
            fraud: {
                ipc: "IPC 420",
                action: "Report to EOW",
                punishment: "7 years and fine",
                steps: "Contact Economic Offences Wing or file FIR. Bring transaction records, messages, or emails as proof."
            },
            murder: {
                ipc: "IPC 302",
                action: "Immediate FIR and arrest",
                punishment: "Death or life imprisonment",
                steps: "Dial 100 or go to police immediately. Provide full detail. Ensure postmortem is done if needed."
            },
            cybercrime: {
                ipc: "IT Act Sec 66",
                action: "Cyber Cell Complaint",
                punishment: "3 years and fine",
                steps: "File online complaint at cybercrime.gov.in or visit cyber cell with screenshots/logs."
            },
            rape: {
                ipc: "IPC 376",
                action: "Police complaint",
                punishment: "7 years to life",
                steps: "Go to police station or dial 112. Medical examination required. Women’s helpline also available."
            },
            kidnapping: {
                ipc: "IPC 363",
                action: "File FIR",
                punishment: "7 years and fine",
                steps: "Visit police with last known location of victim. Provide photo, name, and age."
            },
            bribery: {
                ipc: "IPC 171E",
                action: "Report to ACB",
                punishment: "1 year or fine",
                steps: "Call Anti-Corruption Bureau. If safe, record proof of bribery and report it."
            },
            defamation: {
                ipc: "IPC 499",
                action: "Legal complaint",
                punishment: "2 years or fine",
                steps: "Submit proof (printed/recorded). File complaint to magistrate or lodge FIR."
            },
            domesticViolence: {
                ipc: "IPC 498A",
                action: "Police complaint",
                punishment: "3 years and fine",
                steps: "Go to police or women's protection cell. Also contact protection officer or NGOs."
            },
            drugs: {
                ipc: "NDPS Act",
                action: "Report to Narcotics Bureau",
                punishment: "10 years to life",
                steps: "Call Narcotics Control Bureau. Report discreetly. Provide tip-offs or proof."
            },
            stalking: {
                ipc: "IPC 354D",
                action: "Police complaint",
                punishment: "3 years and fine",
                steps: "File FIR. Save messages/calls as evidence. Women's helpline can also help."
            },
            arson: {
                ipc: "IPC 435",
                action: "File FIR",
                punishment: "7 years and fine",
                steps: "Report to police. Include photos or videos. Fire department report helpful too."
            },
            extortion: {
                ipc: "IPC 384",
                action: "Police complaint",
                punishment: "3 years and fine",
                steps: "Report to police with call logs, messages, etc. Don’t pay extortion."
            },
            robbery: {
                ipc: "IPC 392",
                action: "File FIR",
                punishment: "10 years and fine",
                steps: "Go to police station. Share CCTV or witnesses if available."
            },
            acidAttack: {
                ipc: "IPC 326A",
                action: "Police complaint",
                punishment: "10 years to life",
                steps: "Call emergency. FIR is compulsory. Medical treatment is government-supported."
            },
            dowryHarassment: {
                ipc: "IPC 498A",
                action: "Police complaint",
                punishment: "3 years and fine",
                steps: "Visit police or NCW. Collect evidence like messages or threats."
            },
            blackmail: {
                ipc: "IPC 503",
                action: "Police complaint",
                punishment: "2 years and fine",
                steps: "Report to police. Save screenshots or recordings."
            },
            humanTrafficking: {
                ipc: "IPC 370",
                action: "File FIR",
                punishment: "7–10 years and fine",
                steps: "Contact Anti-Human Trafficking Unit or dial 112. Share victim and suspect info."
            }
        };

        const crimeType = localStorage.getItem("selectedCrime");
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


