const fs = require("fs");

const config = {
    templatePath: "templates/"
};

const pages = {
    home: {
        title: "Home",
        content: "Hello world"
    },
    about: {
        title: "About",
        content: "This is the about page. Here is some filler text to make this content long enough for testing a whole paragraph of text. While I have you here, have you ever considered that it's technically physically possible for an entire lobster to instantaneously be transported to the moon? That's true! I won't explain any more."
    }
};

function loadTemplate(name) {
    return fs.readFileSync(`${config.templatePath}${name}.html`, "utf-8");
}

function renderTemplate(template, data) {
    return template.replace(/{{(.*?)}}/g, (_, key) => data[key.trim()]);
}

function render(pageName) {
    const page = pages[pageName];
    
    // Load the HTML template
    const rawTemplate = loadTemplate("generic-page");

    // Return the template populated with page data/content
    return renderTemplate(rawTemplate, page);
}

fs.writeFileSync("dist/index.html", render("about"));