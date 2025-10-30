const QUIZ_BANKS = {
    htmlBasics: [
        {
            q: "Which HTML tag creates a link?",
            choices: ["<a>", "<link>", "<href>", "<url>"],
            correctIndex: 0,
            feedback: "Use <a href='...'> to make a clickable link."
        },
        {
            q: "Which element should wrap the visible page content?",
            choices: ["<main>", "<head>", "<meta>", "<style>"],
            correctIndex: 0,
            feedback: "<main> holds the primary content of the page."
        },
    ],

    httpWeb: [
        {
            q: "Which HTTP status code means 'Not Found'?",
            choices: ["200", "301", "404", "500"],
            correctIndex: 2,
            feedback: "404 means the resource doesn't exist at that URL."
        },
        {
            q: "Which HTTP method is typically used to submit form data to the server?",
            choices: ["GET", "POST", "DELETE", "TRACE"],
            correctIndex: 1,
            feedback: "POST is commonly used to send data in the request body."
        },
    ],

    jsIntro: [
        {
            q: "How do you declare a variable in modern JS?",
            choices: ["var x = 5", "let x = 5", "const x = 5", "Both let and const"],
            correctIndex: 3,
            feedback: "`let` and `const` are modern. `var` is older/functional-scope."
        },
        {
            q: "What does `===` do in JavaScript?",
            choices: [
                "Assigns a value",
                "Compares value only",
                "Compares value and type",
                "Ends a statement"
            ],
            correctIndex: 2,
            feedback: "`===` is strict equality: same value AND same type."
        },
    ],
};