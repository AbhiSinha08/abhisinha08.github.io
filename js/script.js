function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function hello() {
    const text = [..."Hello World!"];
    const helloText = document.querySelector('#hello');
    let buffer;
    while (true) {
        for (let char of text) {
            await sleep(120);
            helloText.innerHTML += char;
        }
        await sleep(2300);
        for (let i = text.length; i >= 0; i--) {
            await sleep(80);
            buffer = "";
            for (let j = 0; j < i; j++) {
                buffer += text[j];
            }
            helloText.innerHTML = buffer;
        }
        await sleep(700);
    }
}

// On-scroll animation generator function
function scrollAnimate(element, animationClass) {
    const callback = function (entries) {
        entries.forEach((entry) => {      
            if (entry.isIntersecting) {
                entry.target.classList.add(animationClass);
            } else {
                entry.target.classList.remove(animationClass);
            }
        });
    };

    const observer = new IntersectionObserver(callback);

    const targets = document.querySelectorAll(element);
    targets.forEach(function (target) {
        target.classList.remove(animationClass);
        observer.observe(target);
    });
}

const data = {
    skills: {},
    projects: {},
    about: {},
    general: {}
};

async function getData(section) {
    let url = "/data/" + section + ".json";
    let obj = await (await fetch(url)).json();
    // await sleep(2000);
    return obj[section];
}

async function load(section, callback) {
    while (Object.keys(data[section]).length === 0) {
        data[section] = await getData(section);
    }
    const displayArea = document.querySelector('#'+section + ' > .hidden');
    displayArea.classList.remove("hidden");
    document.querySelector('#'+section + ' > #loading').classList.add("hidden");

    // console.log(data);

    if (callback)
        callback();
}

function showSkills() {
    const lang_gr = "from-gr2-1 to-gr2-2";
    const lib_gr = "from-gr3-1 to-gr3-2";
    const tool_gr = "from-gr4-1 to-gr4-2";
    const rate = {
        0: "w-[0.75rem]",
        1: "w-[25%]",
        2: "w-[50%]",
        3: "w-[75%]",
        4: "w-[95%]"
    };
    const template = `
                <div class="px-6 group">
                    <div class="flex mt-3 justify-between w-full items-center">
                        <span> $name$ </span>
                        <img class="h-[2rem] transform duration-150 ease-in
                            lg:motion-safe:opacity-75 lg:motion-safe:group-hover:opacity-100
                            md:motion-safe:group-hover:scale-110"
                            src="./data/images/$icon$" alt="icon">
                    </div>
                    <div class="my-2 rounded-full w-full bg-white/30 h-2">
                        <div class="bg-gradient-to-r $gradient$ $width$
                            h-full rounded-full transform duration-150 ease-in
                            md:motion-safe:group-hover:scale-y-150"></div>
                    </div>
                </div>
                `;
    const languages = document.querySelector("#languages");
    const libraries = document.querySelector("#libraries");
    const tools = document.querySelector("#tools");

    let component, name;
    for (let lang of data.skills.languages) {
        name = Object.keys(lang)[0];
        component = template.replace("$name$", name)
                    .replace("$icon$", lang[name].icon)
                    .replace("$gradient$", lang_gr)
                    .replace("$width$", rate[lang[name].rating]);
        
        languages.innerHTML += component;
    }
    for (let lib of data.skills.libraries) {
        name = Object.keys(lib)[0];
        component = template.replace("$name$", name)
                    .replace("$icon$", lib[name].icon)
                    .replace("$gradient$", lib_gr)
                    .replace("$width$", rate[lib[name].rating]);
        
        libraries.innerHTML += component;
    }
    for (let tool of data.skills.tools) {
        name = Object.keys(tool)[0];
        component = template.replace("$name$", name)
                    .replace("$icon$", tool[name].icon)
                    .replace("$gradient$", tool_gr)
                    .replace("$width$", rate[tool[name].rating]);
        
        tools.innerHTML += component;
    }
}

function showProjects() {
    console.log(data.projects);
}


document.addEventListener('DOMContentLoaded', () => {
    load("general");
    load("skills", showSkills);
    load("projects", showProjects);
    // load("about", showAbout);
    hello();

    const nav = document.querySelector('#nav');
    document.querySelector('#menu').addEventListener("click", () => {
        nav.classList.toggle("hidden");
    });
    const content = document.querySelector('#content');
    content.addEventListener("click", () => {
        nav.classList.add("hidden");
    });

    const navButtons = document.querySelectorAll(".nav-btn, #home-btn");
    for (let btn of navButtons) {
        btn.addEventListener("click", () => {
            nav.classList.add("hidden");
        });
    }

    document.querySelector('#resume').addEventListener("click", () => {
        window.location.href = "./data/Abhinav_Kumar.pdf";
    });

    const home = document.querySelector("#home");
    const skills = document.querySelector("#skills");
    const projects = document.querySelector("#projects");
    const about = document.querySelector("#about");
    const contact = document.querySelector("#contact");

    document.querySelector('#skills-btn').addEventListener("click", () => {
        var topPos = skills.offsetTop;
        content.scrollTop = topPos;
    })

    document.querySelector('#projects-btn').addEventListener("click", () => {
        var topPos = projects.offsetTop;
        content.scrollTop = topPos;
    })

    document.querySelector('#about-btn').addEventListener("click", () => {
        var topPos = about.offsetTop;
        content.scrollTop = topPos;
    })

    document.querySelector('#contact-btn').addEventListener("click", () => {
        var topPos = contact.offsetTop;
        content.scrollTop = topPos;
    })

    // On scroll animations
    scrollAnimate(".fade-l-scroll", "motion-safe:animate-fade-l");
    scrollAnimate(".fade-r-scroll", "motion-safe:animate-fade-r");
    scrollAnimate(".fade-b-scroll", "motion-safe:animate-fade-b");
});