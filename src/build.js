const fs = require("fs");
const { marked } = require("marked");
const path = require("path");

const config = {
    templatePath: "templates/",
    pagesPath: "pages/",
    distPath: "../dist/",
    baseTemplateName: "base-html-template"
};

function loadPageMarkdown(pageName) {
    return fs.readFileSync(`${config.pagesPath}${pageName}.md`, "utf8");
}

function loadTemplate(name) {
    return fs.readFileSync(`${config.templatePath}${name}.html`, "utf-8");
}

function renderTemplate(template, data) {
    return template.replace(/{{(.*?)}}/g, (_, key) => data[key.trim()]);
}

function renderPage(pageName, page) {
    // Translate page markdown to HTML
    const pageMarkdown = loadPageMarkdown(pageName);
    page["renderedContent"] = marked.parse(pageMarkdown);
    
    return renderTemplate(loadTemplate(config.baseTemplateName), page);
}

function generateNavHeader(pages) {
    let html = "<nav>";

    let first = true;
    for (const [pageName, page] of Object.entries(pages)) {
        if (!first) {
            html += " | ";
        }
        let path = `${pageName}.html`
        if (page["isIndex"]){
            path = "index.html"
        }
        html += `<a href="${path}">${page.title}</a>`;
        first = false;
    }

    html += "</nav><hr>";

    return html;
}

function build() {
    const pages = require(`./${config.pagesPath}pages.json`);
    
    // Generate the navigation header
    const navHeaderHtml = generateNavHeader(pages)
    
    for (const [pageName, page] of Object.entries(pages)) {
        let htmlName = `${pageName}.html`
        if (page["isIndex"]) {
            htmlName = "index.html"
        }
        page["navHeader"] = navHeaderHtml;
        
        fs.writeFileSync(`${config.distPath}${htmlName}`, renderPage(pageName, page));
    }
    
    fs.copyFileSync("styles.css", `${config.distPath}styles.css`); 
}

build()