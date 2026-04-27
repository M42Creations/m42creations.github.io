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

async function loadTemplate(name) {
    const response = await fetch(`${config.templatePath}${name}.html`);
    return await response.text();
}

function renderTemplate(template, data) {
    return template.replace(/{{(.*?)}}/g, (_, key) => data[key.trim()]);
}

async function render(pageName) {
    const page = pages[pageName];
    
    document.title = page.title;

    // Load the HTML template
    const rawTemplate = await loadTemplate("generic-page");
    
    // Set the content on the final displayed HTML page to the rendered template
    document.getElementById("app").innerHTML = renderTemplate(rawTemplate, page);
}

render("about")