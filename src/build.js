const fs = require("fs");
const { marked } = require("marked");
const path = require("path");

const config = {
    templatePath: path.resolve(__dirname, "templates/"),
    pagesPath: path.resolve(__dirname, "pages/"),
    distPath: path.resolve(__dirname, "../dist/"),
    componentPath: path.resolve(__dirname, "components/"),
    baseTemplateName: "base-html-template"
};

// Throw error is dist directory is not in this project folder
// Safeguards against deleting/manipulating incorrect file locations 
if (!config.distPath.startsWith(path.resolve(__dirname, ".."))) {
    throw new Error("Unsafe dist path blocked");
}


function loadPageMarkdown(pageName) {
    return fs.readFileSync(path.join(config.pagesPath,`${pageName}.md`), "utf8");
}

function loadTemplate(name) {
    return fs.readFileSync(path.join(config.templatePath,`${name}.html`), "utf-8");
}

function loadUnityContainer(name) {
    const html = fs.readFileSync(path.join(config.componentPath,`unity-container.html`), "utf-8");
    return html.replace(/{{name}}/g, name);
}

function renderTemplate(template, data) {
    return template.replace(/{{(.*?)}}/g, (_, key) => data[key.trim()]);
}

function applyUnityComponents(content) {
    return content.replace(/{{unity:([\w-]+)}}/g, (_, name) => {
        return loadUnityContainer(name) || "";
    });
}

function renderPage(pageName, page) {
    // Translate page markdown to HTML
    const pageMarkdown = loadPageMarkdown(pageName);
    page["renderedContent"] = marked.parse(pageMarkdown);
    
    page["renderedContent"] = applyUnityComponents(page["renderedContent"]);
    
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
    // Delete existing dist directory and recreate
    if (fs.existsSync(config.distPath)) {
        fs.rmSync(config.distPath, {recursive: true, force: true});
    }
    fs.mkdirSync(config.distPath, { recursive: true });
    
    const pages = require(path.join(config.pagesPath,"pages.json"));
    
    // Generate the navigation header
    const navHeaderHtml = generateNavHeader(pages)
    
    for (const [pageName, page] of Object.entries(pages)) {
        let htmlName = `${pageName}.html`
        if (page["isIndex"]) {
            htmlName = "index.html"
        }
        page["navHeader"] = navHeaderHtml;
        
        fs.writeFileSync(path.join(config.distPath, htmlName), renderPage(pageName, page));
    }
    
    fs.copyFileSync(path.resolve(__dirname, "styles.css"), path.join(config.distPath, "styles.css"));
    fs.cpSync(path.resolve(__dirname, "./unity"), path.join(config.distPath, "unity"), { recursive: true });
}

build()