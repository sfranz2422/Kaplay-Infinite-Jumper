const QUIZ_BANKS = {
    htmlBasics: [
    {
        q: "Which HTML tag defines the largest heading?",
        choices: ["<h6>", "<head>", "<heading>", "<h1>"],
        correctIndex: 3,
        feedback: "Use <h1> for the main heading of your page."
    },
    {
        q: "Which attribute specifies the destination of a link?",
        choices: ["src", "href", "link", "target"],
        correctIndex: 1,
        feedback: "The href attribute defines the URL the link points to."
    },
    {
        q: "Which HTML tag is used to insert an image?",
        choices: ["<img>", "<src>", "<picture>", "<image>"],
        correctIndex: 0,
        feedback: "Use <img src='...' alt='...'> to embed images."
    },
    {
        q: "Which CSS property changes the text color?",
        choices: ["font-color", "text-color", "color", "foreground"],
        correctIndex: 2,
        feedback: "Use the color property to set the text color."
    },
    {
        q: "Which tag is used for creating an unordered list?",
        choices: ["<ol>", "<ul>", "<li>", "<list>"],
        correctIndex: 1,
        feedback: "<ul> creates an unordered (bulleted) list."
    },
    {
        q: "Which HTML element is used to emphasize text?",
        choices: ["<strong>", "<i>", "<em>", "<highlight>"],
        correctIndex: 2,
        feedback: "Use <em> for emphasized (typically italicized) text."
    },
    {
        q: "What does CSS stand for?",
        choices: [
            "Colorful Style Syntax",
            "Cascading Style Sheets",
            "Computer Styling System",
            "Creative Sheet Syntax"
        ],
        correctIndex: 1,
        feedback: "CSS stands for Cascading Style Sheets."
    },
    {
        q: "Which HTML element represents a table row?",
        choices: ["<row>", "<tr>", "<td>", "<table>"],
        correctIndex: 1,
        feedback: "<tr> defines a row inside a table."
    },
    {
        q: "Which attribute provides alternative text for an image?",
        choices: ["alt", "title", "src", "desc"],
        correctIndex: 0,
        feedback: "The alt attribute provides alternate text if the image fails to load."
    },
    {
        q: "Which CSS property sets the background color?",
        choices: ["background", "bg-color", "background-color", "color-bg"],
        correctIndex: 2,
        feedback: "Use background-color to set the background."
    },
    {
        q: "Which tag contains the metadata of an HTML document?",
        choices: ["<body>", "<meta>", "<head>", "<header>"],
        correctIndex: 2,
        feedback: "The <head> element holds metadata, links, and titles."
    },
    {
        q: "Which CSS property controls the size of text?",
        choices: ["font-size", "text-size", "size", "font-height"],
        correctIndex: 0,
        feedback: "Use font-size to adjust the size of text."
    },
    {
        q: "How do you create a numbered list in HTML?",
        choices: ["<ul>", "<ol>", "<li>", "<list>"],
        correctIndex: 1,
        feedback: "An ordered list (<ol>) creates numbered list items."
    },
    {
        q: "Which CSS property adds space inside an element, around the content?",
        choices: ["margin", "padding", "border", "gap"],
        correctIndex: 1,
        feedback: "Padding adds space inside the element’s border."
    },
    {
        q: "What is the correct HTML for creating a checkbox?",
        choices: [
            "<input type='check'>",
            "<checkbox>",
            "<input type='checkbox'>",
            "<form-checkbox>"
        ],
        correctIndex: 2,
        feedback: "Use <input type='checkbox'> to create a checkbox input."
    },
    {
        q: "Which CSS property makes text bold?",
        choices: ["font-weight", "bold", "text-bold", "weight"],
        correctIndex: 0,
        feedback: "Use font-weight: bold; to make text bold."
    },
    {
        q: "Which HTML tag is used to define a hyperlink?",
        choices: ["<a>", "<link>", "<href>", "<url>"],
        correctIndex: 0,
        feedback: "Use <a href='...'> to create hyperlinks."
    },
    {
        q: "Which HTML tag creates a line break?",
        choices: ["<break>", "<lb>", "<br>", "<hr>"],
        correctIndex: 2,
        feedback: "The <br> tag inserts a line break."
    },
    {
        q: "Which CSS property is used to center text horizontally?",
        choices: ["align", "text-center", "text-align", "justify"],
        correctIndex: 2,
        feedback: "Use text-align: center; to center text horizontally."
    },
    {
        q: "Which HTML tag defines a division or section in a document?",
        choices: ["<section>", "<div>", "<block>", "<container>"],
        correctIndex: 1,
        feedback: "The <div> tag defines a generic container for content."
    },
    {
        q: "Which CSS selector targets an element by its ID?",
        choices: [".className", "#idName", "idName", "@idName"],
        correctIndex: 1,
        feedback: "Use #idName to select elements by ID."
    },
    {
        q: "Which CSS property adds space outside an element’s border?",
        choices: ["margin", "padding", "border", "gap"],
        correctIndex: 0,
        feedback: "Margin adds space outside the element’s border."
    },
    {
        q: "Which HTML element is used to play video files?",
        choices: ["<media>", "<movie>", "<video>", "<player>"],
        correctIndex: 2,
        feedback: "Use the <video> element with a src attribute to play videos."
    },
    {
        q: "Which CSS property controls how a background image repeats?",
        choices: ["background-repeat", "repeat-image", "image-repeat", "background-mode"],
        correctIndex: 0,
        feedback: "Use background-repeat: no-repeat; to stop an image from repeating."
    },
    {
        q: "Which HTML tag displays preformatted text?",
        choices: ["<pre>", "<code>", "<text>", "<format>"],
        correctIndex: 0,
        feedback: "The <pre> element preserves whitespace and formatting."
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