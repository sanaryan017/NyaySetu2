document.addEventListener("DOMContentLoaded", function () {
    let users = JSON.parse(localStorage.getItem("users")) || [];

    // 1. LOGIN
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

    // 2. SIGNUP
    document.getElementById("signupForm")?.addEventListener("submit", function (e) {
        e.preventDefault();
        const username = document.getElementById("signupUsername").value;
        const password = document.getElementById("signupPassword").value;

        users = JSON.parse(localStorage.getItem("users")) || [];

        if (users.some(u => u.username === username)) {
            document.getElementById("signupError").innerText = "Username already taken.";
            document.getElementById("signupMessage").innerText = "";
        } else {
            users.push({ username, password });
            localStorage.setItem("users", JSON.stringify(users));
            document.getElementById("signupError").innerText = "";
            document.getElementById("signupMessage").innerText = "Signup successful! Redirecting to login...";
            setTimeout(() => {
                window.location.href = "index.html";
            }, 1500);
        }
    });

    // 3. FORGOT PASSWORD
    document.getElementById("forgotForm")?.addEventListener("submit", function (e) {
        e.preventDefault();
        const username = document.getElementById("forgotUsername").value;
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const user = users.find(u => u.username === username);

        if (user) {
            document.getElementById("forgotResult").innerText = "Your password is: " + user.password;
        } else {
            document.getElementById("forgotResult").innerText = "Username not found.";
        }
    });

    // 4. LOGOUT
    document.getElementById("logout")?.addEventListener("click", function () {
        localStorage.removeItem("currentUser");
        window.location.href = "index.html";
    });

    // 5. DISPLAY USERNAME IN HEADER
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser && document.getElementById("profileName")) {
        document.getElementById("profileName").innerText = `👤 ${currentUser.username}`;
    }

    // 6. DASHBOARD KEYWORD DETECTION
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

    // 7. RESULT DISPLAY
    if (window.location.pathname.endsWith("result.html")) {
        const crimeData = {
            theft: {
                ipc: "IPC 378",
                action: "File FIR",
                punishment: "3 years or fine",
                steps: "Go to the nearest police station with any evidence like bills, photos, or witness statement. File an FIR under IPC 378."
            },
            assault: {
                ipc: "IPC 351",
                action: "Police complaint",
                punishment: "3 months or fine",
                steps: "Visit your local police station. Submit a medical report if injured. File a complaint under IPC 351."
            },
            fraud: {
                ipc: "IPC 420",
                action: "Report to EOW",
                punishment: "7 years and fine",
                steps: "Contact the Economic Offences Wing or file an FIR. Bring transaction records, messages, or emails as proof."
            },
            murder: {
                ipc: "IPC 302",
                action: "Immediate FIR and arrest",
                punishment: "Death or life imprisonment",
                steps: "Dial 100 or go to police immediately. Give as much detail as possible. Ensure a postmortem is conducted if needed."
            },
            cybercrime: {
                ipc: "IT Act Sec 66",
                action: "Cyber Cell Complaint",
                punishment: "3 years and fine",
                steps: "File an online complaint at cybercrime.gov.in or visit nearest cyber cell with screenshots and logs."
            },
            rape: {
                ipc: "IPC 376",
                action: "Immediate police complaint",
                punishment: "7 years to life imprisonment",
                steps: "Go to police station or dial 112. Medical examination is needed. You can also reach out to women’s helplines."
            },
            kidnapping: {
                ipc: "IPC 363",
                action: "File FIR",
                punishment: "7 years and fine",
                steps: "Go to the police station with last known location of the victim. Provide photos, name, and age."
            },
            bribery: {
                ipc: "IPC 171E",
                action: "Report to ACB",
                punishment: "1 year or fine",
                steps: "Call Anti-Corruption Bureau helpline. If safe, record proof of bribery demand and submit."
            },
            defamation: {
                ipc: "IPC 499",
                action: "File complaint",
                punishment: "2 years or fine",
                steps: "Submit printed/recorded false statement to magistrate. File a private complaint or FIR if needed."
            },
            domesticViolence: {
                ipc: "IPC 498A",
                action: "Police complaint",
                punishment: "3 years and fine",
                steps: "Go to police or women’s cell. You can also approach the District Protection Officer for support."
            },
            drugs: {
                ipc: "NDPS Act",
                action: "Narcotics Bureau",
                punishment: "10 years to life imprisonment",
                steps: "Call Narcotics Control Bureau or file FIR. Provide tip-offs or evidence discreetly if possible."
            },
            stalking: {
                ipc: "IPC 354D",
                action: "Police complaint",
                punishment: "3 years and fine",
                steps: "Visit your local police station or women helpline. Save messages or call records as proof."
            },
            arson: {
                ipc: "IPC 435",
                action: "File FIR",
                punishment: "7 years and fine",
                steps: "Go to police with photos/videos of fire damage. Fire department report also helps."
            },
            extortion: {
                ipc: "IPC 384",
                action: "Police complaint",
                punishment: "3 years and fine",
                steps: "Report blackmail or money threats to police. Try to provide call logs, messages or witness if any."
            },
            robbery: {
                ipc: "IPC 392",
                action: "File FIR",
                punishment: "10 years and fine",
                steps: "Go to the nearest police station. Share CCTV footage or eyewitnesses if available."
            },
            acidAttack: {
                ipc: "IPC 326A",
                action: "Police complaint",
                punishment: "10 years to life imprisonment",
                steps: "Call emergency services immediately. File FIR and seek medical care. Government will cover treatment cost."
            },
            dowryHarassment: {
                ipc: "IPC 498A",
                action: "Police complaint",
                punishment: "3 years and fine",
                steps: "Contact police or National Commission for Women. Collect any proof like messages or threats."
            },
            blackmail: {
                ipc: "IPC 503",
                action: "File complaint",
                punishment: "2 years and fine",
                steps: "Report to police with screenshots, messages, or recordings. Never give in to threats."
            },
            humanTrafficking: {
                ipc: "IPC 370",
                action: "File FIR",
                punishment: "7 to 10 years and fine",
                steps: "Contact Anti Human Trafficking Units (AHTU) or dial 112. Share location, people involved, and victim info."
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
