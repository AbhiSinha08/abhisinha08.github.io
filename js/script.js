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
    // console.log(data.projects);

    const sections = {
        web: document.querySelector('#web > .hidden'),
        app: document.querySelector('#app > .hidden'),
        game: document.querySelector('#game > .hidden'),
        web3: document.querySelector('#web3 > .hidden'),
        ml: document.querySelector('#ml > .hidden')
    };

    function hideAll(except) {
        for (let section of Object.keys(sections)) {
            if (except !== sections[section]) {
                sections[section].classList.add('hidden');
                sections[section].classList.remove('flex');
                document.querySelector('#' + section + ' header svg').classList.remove('rotate-180');
            }
        }
    }

    const template = `
                <div class="flex flex-col lg:flex-row lg:flex-wrap justify-between h-[55vh] lg:h-[45vh] min-w-[90%] sm:min-w-[70%] sm:max-w-[80%] md:min-w-[50%] md:max-w-[70%] lg:w-[50%] snap-start snap-always">
                    <div class="flex flex-col flex-grow h-auto w-full lg:w-[60%] lg:flex-grow-0 lg:order-1">    
                        <div class="flex justify-center w-full lg:w-auto max-h-[27vh]">    
                            <img src="./data/images/$image$" alt="image" class="rounded-md">
                        </div>
                        <div class="text-bold font-nunito text-2xl text-center py-1 px-2"> $name$ </div>
                    </div>
                    <p class="text-[1rem] leading-snug font-light px-2 lg:px-6 py-auto flex-grow-[2] lg:order-3"> $description$ </p>
                    <div class="flex flex-col justify-between lg:justify-start lg:gap-8 lg:pt-4 flex-grow lg:flex-grow-0 lg:order-2 lg:max-w-[40%]">    
                        <p class="text-[1.1rem] font-normal text-blue-200 px-2 lg:px-4">
                            <span class="hidden xl:block leading-[4rem] font-semibold"> Technologies Used: </span>
                            $techstack$
                        </p>
                        <div class="flex lg:flex-col justify-around lg:justify-start lg:items-center xl:flex-row xl:justify-around lg:gap-2 font-mono px-2 lg:px-4 pb-1">
                            $link$
                        </div>
                    </div>
                </div>
                `;
    const linkTemplate = `<a href="$href$" class="underline underline-offset-[3px] text-blue-900"> $linkName$ </a>`;

    let component, name, links, tech;

    for (let section of Object.keys(sections)) {
        document.querySelector('#' + section + ' header').onclick = () => {
            hideAll(sections[section]);
            sections[section].classList.toggle('hidden');
            sections[section].classList.toggle('flex');
            document.querySelector('#' + section + ' header svg').classList.toggle('rotate-180');
        }

        if (data.projects[section].length == 0)
            sections[section].innerHTML = "Projects coming soon";
        else {
            for (let project of data.projects[section]){
                name = Object.keys(project)[0];

                tech = "";
                for (let x of project[name].techStack) {
                    tech += x + ", ";
                }
                tech = tech.slice(0, -2);

                links = "";
                if (project[name].links.github)
                    links += linkTemplate.replace("$linkName$", "GitHub")
                             .replace("$href$", project[name].links.github);
                if (project[name].links.hosted)
                    links += linkTemplate.replace("$linkName$", "Hosted")
                             .replace("$href$", project[name].links.hosted);
                if (project[name].links.demo)
                    links += linkTemplate.replace("$linkName$", "Demo")
                             .replace("$href$", project[name].links.demo);

                component = template.replace("$image$", project[name].images.main)
                            .replace("$name$", name)
                            .replace("$description$", project[name].desc)
                            .replace("$link$", links)
                            .replace("$techstack$", tech);

                sections[section].innerHTML += component;
            }
        }
    }
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