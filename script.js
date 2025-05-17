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

    // RESULT PAGE
    if (window.location.pathname.endsWith("result.html")) {
        const crimeType = localStorage.getItem("selectedCrime");

        const crimeData = {
            theft: { ipc: "IPC 378", bns: "BNS 303", action: "File FIR", punishment: "3 years or fine", steps: "Go to the nearest police station with evidence. File FIR under IPC 378 / BNS 303." },
            assault: { ipc: "IPC 351", bns: "BNS 130", action: "Police complaint", punishment: "3 months or fine", steps: "Submit medical report and file complaint." },
            fraud: { ipc: "IPC 420", bns: "BNS 316", action: "Report to EOW", punishment: "7 years and fine", steps: "Collect transaction proof and approach EOW." },
            murder: { ipc: "IPC 302", bns: "BNS 101", action: "Immediate FIR and arrest", punishment: "Death or life imprisonment", steps: "Report to police immediately and ensure postmortem." },
            cybercrime: { ipc: "IT Act Sec 66", bns: "BNS 109", action: "Cyber Cell Complaint", punishment: "3 years and fine", steps: "Use cybercrime.gov.in or visit cyber cell." },
            rape: { ipc: "IPC 376", bns: "BNS 63", action: "Police complaint", punishment: "7 years to life", steps: "Medical exam required. Police and helplines can help." },
            kidnapping: { ipc: "IPC 363", bns: "BNS 137", action: "File FIR", punishment: "7 years and fine", steps: "Report last known location of victim to police." },
            bribery: { ipc: "IPC 171E", bns: "BNS 214", action: "Report to ACB", punishment: "1 year or fine", steps: "Submit recorded evidence if safe." },
            defamation: { ipc: "IPC 499", bns: "BNS 356", action: "File complaint", punishment: "2 years or fine", steps: "Give false statement proof to magistrate." },
            domesticViolence: { ipc: "IPC 498A", bns: "BNS 85", action: "Police complaint", punishment: "3 years and fine", steps: "Approach police or Protection Officer." },
            drugs: { ipc: "NDPS Act", bns: "NDPS Act (unchanged)", action: "Narcotics Bureau", punishment: "10 years to life", steps: "Submit anonymous tip or complaint." },
            stalking: { ipc: "IPC 354D", bns: "BNS 78", action: "Police complaint", punishment: "3 years and fine", steps: "Keep message/call records." },
            arson: { ipc: "IPC 435", bns: "BNS 324", action: "File FIR", punishment: "7 years and fine", steps: "Submit fire dept report and photos." },
            extortion: { ipc: "IPC 384", bns: "BNS 308", action: "Police complaint", punishment: "3 years and fine", steps: "Provide logs, messages or witness." },
            robbery: { ipc: "IPC 392", bns: "BNS 309", action: "File FIR", punishment: "10 years and fine", steps: "Police, CCTV or witness help." },
            acidAttack: { ipc: "IPC 326A", bns: "BNS 122", action: "Police complaint", punishment: "10 years to life", steps: "File FIR, seek emergency treatment." },
            dowryHarassment: { ipc: "IPC 498A", bns: "BNS 85", action: "Police complaint", punishment: "3 years and fine", steps: "Contact NCW or police. Keep proof." },
            blackmail: { ipc: "IPC 503", bns: "BNS 351", action: "File complaint", punishment: "2 years and fine", steps: "Save screenshots/messages. Report." },
            humanTrafficking: { ipc: "IPC 370", bns: "BNS 139", action: "File FIR", punishment: "7–10 years and fine", steps: "Dial 112 or AHTU with details." }
        };

        const crimeInfo = crimeData[crimeType];
        if (crimeInfo && document.getElementById("crimeInfo")) {
            const readableName = crimeType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            document.getElementById("crimeInfo").innerHTML = `
                <h3>Crime Detected: ${readableName}</h3>
                <p><strong>IPC Section:</strong> ${crimeInfo.ipc}</p>
                <p><strong>BNS Section:</strong> ${crimeInfo.bns}</p>
                <p><strong>Action:</strong> ${crimeInfo.action}</p>
                <p><strong>Punishment:</strong> ${crimeInfo.punishment}</p>
                <p><strong>Next Steps:</strong> ${crimeInfo.steps}</p>
                <p style="color: darkred; font-style: italic; margin-top: 10px;">
                    ⚖️ Note: IPC (Indian Penal Code) has been replaced by BNS (Bharatiya Nyaya Sanhita). Refer to the updated BNS section for revised legal provisions and amendments.
            `;
        } else {
            document.getElementById("crimeInfo").innerText = "❌ Crime not found or not recognized.";
        }
    }
});







