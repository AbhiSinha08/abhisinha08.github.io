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
let expanded = null;
let currentFilter = [];

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
    if (displayArea)
        displayArea.classList.remove("hidden");
    const loading = document.querySelector('#'+section + ' > #loading')
    if (loading)
        loading.classList.add("hidden");

    // console.log(data);
    
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
    let number = 0;

    function hideAll(except) {
        for (let section of Object.keys(sections)) {
            if (except !== sections[section]) {
                sections[section].classList.add('hidden');
                sections[section].classList.remove('flex');
                document.querySelector('#' + section + ' header svg').classList.remove('rotate-180');
            }
        }
    }

    async function slideshow(slides, left, right, expand) {
        const images = slides.querySelectorAll(".proj-image");

        for (let image of images) {
            image.classList.add('hidden');
        }
        images[0].classList.remove('hidden');
        let current = 0, len = images.length;
    
        function change(x) {
            images[current].classList.add('hidden');
            current = (current + x) % len;
            if (current === -1) current = len - 1;
            images[current].classList.remove('hidden');
        }
    
        left.addEventListener('click', () => {change(-1);});
        right.addEventListener('click', () => {change(1);});

        expand.addEventListener('click', () => {
            left.classList.toggle('bg-gray-800/80');
            right.classList.toggle('bg-gray-800/80');
            slides.classList.toggle('expanded');
            // srcroll x at the start of slides.parent.parent
            const projList = slides.parentElement.parentElement;
            projList.scrollLeft = 0;
            expanded = slides;
        })
    }

    const template = `
                <div id="proj-$id$" class="flex flex-col lg:flex-row lg:flex-wrap justify-between h-[55vh] lg:h-[45vh] min-w-[90%] sm:min-w-[70%] sm:max-w-[80%] md:min-w-[50%] md:max-w-[70%] lg:w-[50%]">
                    <div class="flex slides transform flex-col flex-grow h-auto w-full lg:w-[60%] lg:flex-grow-0 lg:order-1">    
                        <div class="flex justify-center relative w-full lg:w-auto max-h-[27vh]">
                            <button class="left-btn absolute z-30 left-0 top-0 flex flex-col justify-center h-full">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-auto fill-transparent stroke-gray-400/90 rotate-90" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>  
                            $images$
                            <button class="right-btn absolute z-30 right-0 top-0 flex flex-col justify-center h-full">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-auto fill-transparent stroke-gray-400/90 -rotate-90" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            <button class="expand absolute z-20 h-full w-full top-0 left-0"> </button>
                        </div>
                        <div class="text-bold font-nunito text-2xl text-center py-1 px-2"> $name$ </div>
                    </div>
                    <p class="text-[1rem] leading-snug font-light px-2 lg:px-6 py-auto flex-grow-[2] lg:order-3"> $description$ </p>
                    <div class="flex flex-col justify-between lg:justify-start lg:gap-8 lg:pt-4 flex-grow lg:flex-grow-0 lg:order-2 lg:max-w-[40%]">    
                        <p class="text-[1.1rem] font-normal text-blue-200 px-2 lg:px-4">
                            <span class="hidden xl:block leading-[4rem] font-semibold"> Technologies Used: </span>
                            $techstack$
                        </p>
                        <div class="flex lg:flex-col justify-around lg:justify-start lg:items-center xl:flex-row xl:justify-around lg:gap-2 font-nunito px-2 lg:px-4 pb-1">
                            $link$
                        </div>
                    </div>
                </div>
                <span class="py-4 h-[55vh] lg:h-[45vh] rounded-2xl bg-white/20 min-w-[2px]"> </span>
                `;
    const linkTemplate = `<a href="$href$" class="text-white px-3 py-1 bg-orange-400/80 md:hover:bg-orange-500 focus:bg-orange-500 transition duration-100 rounded-lg"> $linkName$ </a>`;
    const imageTemplate = `<img src="./data/images/$imagepath$" alt="image" class="proj-image rounded-md object-contain">`;

    let component, name, links, tech, images;
    let projID = 1;
    const techList = {};

    const foot = document.querySelector('#foot');

    for (let sec of Object.keys(sections)) {
        document.querySelector('#' + sec + ' header').onclick = () => {
            hideAll(sections[sec]);
            sections[sec].classList.toggle('hidden');
            sections[sec].classList.toggle('flex');
            const svg = document.querySelector('#' + sec + ' header svg');
            svg.classList.toggle('rotate-180');
            if (svg.classList.contains('rotate-180')) {
                foot.classList.add('hidden');
            }
            else foot.classList.remove('hidden');
        }

        number += data.projects[sec].length;

        if (data.projects[sec].length == 0)
            sections[sec].innerHTML = "Projects coming soon";
        else {
            for (let project of data.projects[sec]){
                name = Object.keys(project)[0];

                tech = "";
                for (let x of project[name].techStack) {
                    tech += x + ", ";
                    if (x in techList)
                        techList[x].push(project);
                    else techList[x] = [project];
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

                images = "";
                images += imageTemplate.replace("$imagepath$", project[name].images.main);
                for (let image of project[name].images.slides) {
                    images += imageTemplate.replace("$imagepath$", image);
                }
                
                component = template
                            .replace("$id$", projID)
                            .replace("$images$", images)
                            .replace("$name$", name)
                            .replace("$description$", project[name].desc)
                            .replace("$link$", links)
                            .replace("$techstack$", tech);

                sections[sec].innerHTML += component;

                projID += 1;
            }
            sections[sec].lastElementChild.classList.add('hidden');
        }
    }
    
    async function filter() {
        const optionTemplate = `<option value="$tech$"> $tech$ </option>`;
        const filterArea = document.querySelector('#filter');
        const filterList = document.querySelector('#filterList');
        const dropdown = filterArea.querySelector('#tech');
        const button = filterArea.querySelector('#add');
        button.disabled = true;
        const filterProjects = document.querySelector('#showFilters');
        const filterProjectsDisplay = filterProjects.querySelector('#display');
        const filterTemplate = `<span class="bg-blue-200/70 text-base/80 px-2 rounded-md border-[1px] border-blue-300 mr-2">
                                    $tech$
                                </span>`;
        const clearBtnHTML = `
                            <button id="clear" class="mr-2 flex items-center transition duration-150 transform motion-safe:hover:translate-y-1 opacity-70 hover:opacity-100">
                                <p> Clear </p> 
                                <svg version="1.1" class="stroke-current h-5 pl-2 w-auto text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
                                    <circle class="path circle" stroke-width="6" stroke-miterlimit="10" cx="65.1" cy="65.1" r="62.1"/>
                                    <line class="path line"stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" x1="34.4" y1="37.9" x2="95.8" y2="92.3"/>
                                    <line class="path line" stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" x1="95.8" y1="38" x2="34.4" y2="92.2"/>
                                </svg>
                            </button>`;

        function updateFilters() {
            filterList.innerHTML = "";
            let filter;
            for (let tech of currentFilter) {
                filter = filterTemplate.replace("$tech$", tech);
                filterList.innerHTML += filter;
            }
            if (currentFilter.length > 0) {
                filterList.innerHTML += clearBtnHTML;
                const clearBtn = filterArea.querySelector('#clear');
                clearBtn.addEventListener('click', () => {
                    currentFilter = [];
                    updateFilters();
                });
                document.querySelector('#allProjects').classList.add('hidden');
                foot.classList.add('hidden');
                filterProjects.classList.remove('hidden');
                filterProjectsDisplay.innerHTML = "";

                let component, name, links, tech, images;
                let projID2 = 1;
                const displayed = [];
                for (let x of currentFilter) {
                    for (let project of techList[x]) {
                        let temp = false
                        for (y of displayed)
                            if (project == y) {
                                temp = true;
                                break;
                            }
                        if (temp)
                            continue;

                        name = Object.keys(project)[0];

                        tech = "";
                        for (let y of project[name].techStack) {
                            tech += y + ", ";
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
                    
                        images = "";
                        images += imageTemplate.replace("$imagepath$", project[name].images.main);
                        for (let image of project[name].images.slides) {
                            images += imageTemplate.replace("$imagepath$", image);
                        }

                        component = template
                                    .replace("$id$", projID2)
                                    .replace("$images$", images)
                                    .replace("$name$", name)
                                    .replace("$description$", project[name].desc)
                                    .replace("$link$", links)
                                    .replace("$techstack$", tech);
                    
                        filterProjectsDisplay.innerHTML += component;
                    
                        projID2 += 1;
                        displayed.push(project);
                    }
                }
                filterProjectsDisplay.lastElementChild.classList.add('hidden');

                let project;
                for (let i = 1; i <= projID2; i++) {
                    project = document.querySelector('#proj-' + i);
                    const leftBtn = project.querySelector('.left-btn');
                    const rightBtn = project.querySelector('.right-btn');
                    const expandBtn = project.querySelector('.expand');
                    const slides = project.querySelector('.slides');

                    slideshow(slides, leftBtn, rightBtn, expandBtn);
                }
            }
            else {
                filterProjects.classList.add('hidden');
                document.querySelector('#allProjects').classList.remove('hidden');
                foot.classList.remove('hidden');
            }
        }

        let option;
        for (let tech of Object.keys(techList).sort()) {
            option = optionTemplate
                     .replaceAll('$tech$', tech);
            dropdown.innerHTML += option;
        }

        dropdown.addEventListener("change", () => {
            button.disabled = false;
        });
        button.addEventListener('click', () => {
            let tech = dropdown.value;
            let temp = true;
            for (let value of currentFilter) {
                if (tech === value) {
                    temp = false;
                    break;
                }
            }
            if (temp)
                currentFilter = [tech, ...currentFilter];

            updateFilters();
        });
    }

    filter();


    let project;
    for (let i = 1; i <= number; i++) {
        project = document.querySelector('#proj-' + i);
        const leftBtn = project.querySelector('.left-btn');
        const rightBtn = project.querySelector('.right-btn');
        const expandBtn = project.querySelector('.expand');
        const slides = project.querySelector('.slides');

        slideshow(slides, leftBtn, rightBtn, expandBtn);
    }
}

function showGeneral() {
    const contact = document.querySelector('#contact');
    const home = document.querySelector("#home");
    // TODO
}

function showAbout() {
    const section = document.querySelector("#about");

    const dot = `<div class="h-full w-52 flex justify-center items-center">
                    <span class="hidden sm:block rounded-full lg:motion-safe:group-hover:scale-y-[0.91] h-2 w-2 bg-indigo-800"></span>
                </div>`;
    const timeline = section.querySelector('#timeline');
    const events = section.querySelector('#events');

    const additionalTemplate = `<span> <div class="w-1 inline-flex"> <div class="h-1 w-1 relative bottom-[0.15rem] rounded-full bg-white/80"></div> </div>
                                    $data$
                                </span>`;
    const template = `<div class="flex sm:block items-center">
                        <div class="flex flex-col justify-start items-center w-auto sm:w-52 sm:h-auto">
                            <span class="hidden sm:inline-block h-8 w-[2px] my-2 bg-gray-300 rounded-full transform transition duration-200 lg:motion-safe:scale-y-0 lg:motion-safe:group-hover:scale-y-100"></span>
                            <span class=" lg:motion-safe:-translate-y-8 lg:motion-safe:group-hover:translate-y-0 text-yellow-400 font-nunito font-bold $timefontsize$ lg:motion-safe:opacity-80 lg:motion-safe:group-hover:opacity-100 transform lg:motion-safe:group-hover:scale-110 transition duration-200"> $time$ </span>
                            <span class="transform transition duration-300 lg:motion-safe:-translate-y-8 lg:motion-safe:group-hover:translate-y-0 text-center font-nunito $headfontsize$ leading-tight"> $head$ </span>
                            <div class="transform transition duration-300 lg:motion-safe:-translate-y-8 lg:motion-safe:group-hover:translate-y-0 flex text-white/70 items-start">
                                <svg class="fill-transparent stroke-white/70 h-3 w-5 mt-1 stroke-[20]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 395.71 395.71" xml:space="preserve">
                                    <path d="M197.849,0C122.131,0,60.531,61.609,60.531,137.329c0,72.887,124.591,243.177,129.896,250.388l4.951,6.738 c0.579,0.792,1.501,1.255,2.471,1.255c0.985,0,1.901-0.463,2.486-1.255l4.948-6.738c5.308-7.211,129.896-177.501,129.896-250.388 C335.179,61.609,273.569,0,197.849,0z M197.849,88.138c27.13,0,49.191,22.062,49.191,49.191c0,27.115-22.062,49.191-49.191,49.191 c-27.114,0-49.191-22.076-49.191-49.191C148.658,110.2,170.734,88.138,197.849,88.138z"/>
                                </svg>
                                <p class="text-sm leading-tight pl-1"> $place$ </p>
                            </div>
                            <div class="transform transition duration-300 lg:motion-safe:-translate-y-8 lg:motion-safe:group-hover:translate-y-0 mt-1 text-sm italic text-white/90 flex flex-col items-start gap-[0.15rem]">
                                $additional$
                            </div>
                        </div>
                        <span class="sm:hidden w-8 h-[2px] mx-2 bg-gray-300 rounded-full"></span>
                      </div>`;

    let additionalData, element, timeFont, headFont;
    for (let item of data.about.history) {
        timeline.innerHTML += dot;
        additionalData = "";
        for (let data of item.additional) {
            additionalData += additionalTemplate
                              .replace("$data$", data);
        }
        if (item.timeline.length > 6)
            timeFont = "text-2xl";
        else timeFont = "text-4xl";
        if (item.head.length > 40)
            headFont = "";
        else headFont = "text-lg";
        element = template
                  .replace("$time$", item.timeline)
                  .replace("$timefontsize$", timeFont)
                  .replace("$head$", item.head)
                  .replace("$headfontsize$", headFont)
                  .replace("$place$", item.place)
                  .replace("$additional$", additionalData);
        events.innerHTML += element;
    }

    section.querySelector('#bio').innerHTML = data.about.bio;

    const achievements = section.querySelector('#achievements');
    const achievementsTemplate = `<p class="leading-tight"> <div class="w-3 mr-2 inline-flex"> <div class="h-1 w-3 relative bottom-[0.2rem] rounded-full bg-white/60"></div> </div>
                                      $achievement$
                                  </p>`;
    
    if (data.about.achievements.length == 0) {
        achievements.classList.add('hidden');
        achievements.parentElement.classList.add('justify-center');
    }
    else {
        for (let achievement of data.about.achievements) {
            element = achievementsTemplate
                      .replace("$achievement$", achievement);
            achievements.innerHTML += element;
        }
        achievements.parentElement.classList.add('justify-between');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    load("general", showGeneral);
    load("skills", showSkills);
    load("projects", showProjects);
    load("about", showAbout);
    hello();

    const nav = document.querySelector('#nav');
    document.querySelector('#menu').addEventListener("click", () => {
        nav.classList.toggle("hidden");
    });
    const content = document.querySelector('#content');
    content.addEventListener("click", () => {
        nav.classList.add("hidden");
        if (expanded)
            expanded.classList.remove('hidden');
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
    const topPos = {
        home: home.offsetTop,
        skills: skills.offsetTop,
        projects: projects.offsetTop,
        about: about.offsetTop,
        contact: contact.offsetTop
    };
    var currentElement = 0;

    document.querySelector('#skills-btn').addEventListener("click", () => {
        content.scrollTop = topPos.skills;
        currentElement = 1;
    })

    document.querySelector('#projects-btn').addEventListener("click", () => {
        content.scrollTop = topPos.projects;
        currentElement = 2;
    })

    document.querySelector('#about-btn').addEventListener("click", () => {
        content.scrollTop = topPos.about;
        currentElement = 3;
    })

    document.querySelector('#contact-btn').addEventListener("click", () => {
        content.scrollTop = topPos.contact;
        currentElement = 4;
    })


    // Scroll snap with JS
    // const scrollContainer = document.querySelector('.scroll-y-container');
    // const scrollElements = document.querySelectorAll('.scroll-y');
    // const nextPos = () => (currentElement + 1) % scrollElements.length;
    // let scrolling = false;

    // scrollContainer.addEventListener('wheel', (event) => {
    //     scrolling = true;
    // });

    // setInterval(() => {
    //     if (scrolling) {
    //         scrolling = false;
    //         // place the scroll handling logic here
    //         scrollContainer.scrollTo(0, scrollElements[nextPos()].offsetTop);
    //         currentElement = nextPos();
    //     }
    // },200);
    

    // On scroll animations
    // scrollAnimate(".fade-l-scroll", "motion-safe:animate-fade-l");
    // scrollAnimate(".fade-r-scroll", "motion-safe:animate-fade-r");
    // scrollAnimate(".fade-b-scroll", "motion-safe:animate-fade-b");
});