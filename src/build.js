const fs = require("fs");
const { marked } = require("marked");

const config = {
    templatePath: "templates/",
    pageMarkdownPath: "pages/",
    distPath: "../dist/",
    baseTemplateName: "base-html-template"
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

function loadPageMarkdown(pageName) {
    return fs.readFileSync(`${config.pageMarkdownPath}${pageName}.md`, "utf8");
}

function loadTemplate(name) {
    return fs.readFileSync(`${config.templatePath}${name}.html`, "utf-8");
}

function renderTemplate(template, data) {
    return template.replace(/{{(.*?)}}/g, (_, key) => data[key.trim()]);
}

function renderPage(pageName) {
    const page = pages[pageName];

    // Translate page markdown to HTML
    const pageMarkdown = loadPageMarkdown(pageName);
    page["renderedContent"] = marked.parse(pageMarkdown);
    
    return renderTemplate(loadTemplate(config.baseTemplateName), page);
}

fs.writeFileSync(`${config.distPath}index.html`, renderPage("about"));
fs.copyFileSync("styles.css", `${config.distPath}styles.css`);