console.log("YOU FUCKING SUCK ROBLOXX FERRET FOREVER!!!");

const Dom = {
    Create(tag, attrs = {}, parent) {
        let el = document.createElement(tag);
        for (let key in attrs) {
            if (key === "text") {
                el.textContent = attrs[key];
            } else if (key == "content") {
                el.innerHTML = attrs[key];
            } 
            else {
                el.setAttribute(key, attrs[key]);
            }
        }

        if (typeof parent === "string") {
            document.querySelector(parent)?.appendChild(el);
        } else if (parent instanceof Element) {
            parent.appendChild(el);
        }

        return el;
    }
};


//
// themes
//

function insertStyle(url) {
    let link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = url;
    document.head.appendChild(link);
}

//https://cdn.jsdelivr.net/gh/rocefruvous/rbx-theme-url-test@refs/heads/main/theme.css
insertStyle("");

async function request(url) {
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "User-Agent": "Mozilla/5.0"
            },
        });

        if (!response.ok) throw new Error(`Response status: ${response.status}`);

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return error;
    }
}

async function getRobux() {
    try {
        const response = await fetch('https://economy.roblox.com/v1/user/currency', {
            method: 'GET',
            credentials: 'include'
        });
        const data = await response.json();
        return data.robux;
    } catch (error) {
        console.error(error);
        return error;
    }
}



///////////////////////////////////////////////////

const currentURL = window.location.href
let userId = 0

if (currentURL) {
    const match = currentURL.match(/\/users\/(\d+)\/profile/)
    if (match) {
        userId = match[1];
        console.log(userId);
    }
}
///////////////////////////////////////////////////



//
// setup new sidebar
//

let sidebar;

fetch(browser.runtime.getURL("assets/sidebar.html"))
  .then(response => response.text())

  .then(html => {
    let existingSidebar = document.querySelector("#navigation");

    if (existingSidebar) {
        existingSidebar.innerHTML = html;
        sidebar = existingSidebar.querySelector("#sidebar-main");
    } 
    else {
        console.warn("no existing sidebar found, injecting a new one.");

        let injectedSidebar = Dom.Create("div", {
            id: "custom-sidebar",
            content: html,
        }, document.body) 

        sidebar = injectedSidebar.querySelector("#sidebar-main");
    }

    //
    // sidebar functions
    //

    if (sidebar) {
        const robuxCounter = sidebar.querySelector("#sidebar-robux-counter");

        async function setRobux() {
            const robux = await getRobux();
    
            robuxCounter.textContent = robux + " Robux"
        }
        setRobux()

        const searchButton = sidebar.querySelector("#sidebar-search")
        const rightHeader = document.querySelector("#right-navigation-header")
        const navbarLeft = rightHeader.querySelector(".navbar-left")
        const inputBar = navbarLeft.querySelector("#navbar-search-input")

        const dropdownMenu = navbarLeft.querySelector(".dropdown-menu")

        navbarLeft.style.display = "none"

        inputBar.addEventListener("focusout", (event) => {
            if (!inputBar.contains(event.relatedTarget) && !dropdownMenu.contains(event.relatedTarget) && !navbarLeft.contains(event.relatedTarget)) {
                navbarLeft.style.display = "none"
            }
        });
        searchButton.onclick = function() {
            navbarLeft.style.display = "block"
            inputBar.focus();
            console.log("clickity")
        };
    }
})

.catch(error => console.error("failed to load sidebar:", error));



insertStyle(browser.runtime.getURL("assets/sidebar.css"))

let navbar = document.querySelector(".rbx-navbar")
if (navbar) {
    navbar.style.display = "none"
}

//
// home page message
//

let homeContainer = document.getElementById('HomeContainer');

if (homeContainer) {
    let mainHomeMessage = homeContainer.querySelector('h1');

    if (mainHomeMessage) {
        const periods = {
            ["04"]: "early morning",
            ["08"]: "morning",
            ["12"]: "noon",
            ["16"]: "afternoon",
            ["20"]: "evening",
            ["23"]: "night",
        }
        let currentTime = new Date();
        let hours = currentTime.getHours();

        let timeOfDay

        for (time in periods) {
            if (hours <= time) {
                timeOfDay = periods[time];
                break;
            }
        }

        mainHomeMessage.textContent = "bad " + timeOfDay +" to you son of a bitch";
        console.log("HI")
    }
}

//
// Check friends (goo for brits)
//

const profileButtons = document.querySelector(".profile-header-buttons");

if (profileButtons) {
    insertStyle(browser.runtime.getURL("assets/friends.css"))

    const button = Dom.Create("button", {
        id: "ferret-friends-button"
    }, profileButtons )

    const span = Dom.Create("span", {
        text: "Friends",
        class: "ferret-friends-span"
    }, button )

    const div = Dom.Create("div", {
        id: "ferret-friends-menu",
        style: "display: none;"
    }, button)
    
    async function fetchFriends() {
        const friendsData = await request("https://friends.roblox.com/v1/users/"+userId+"/friends");

        if (friendsData) {
            let data = friendsData.data
            let lenght = data.length
    
            console.log(data)

            for (let i = 0; i < lenght; i++) {
                const friend = Dom.Create("a", {
                    class: "ferret-friend",
                    href: "https://www.roblox.com/users/"+data[i].id+"/profile"
                }, div)

                const displayName = Dom.Create("h2", {
                    class: "ferret-display-name",
                    text: data[i].displayName
                }, friend)

                const name = Dom.Create("p", {
                    class: "ferret-name",
                    text: "@" + data[i].name
                }, friend)

//                const picture = document.createElement("img")
//                friend.appendChild(picture)
//                picture.src = "https://tr.rbxcdn.com/30DAY-AvatarHeadshot-2BCDCE8A21693B3A4EA6218AE1080B88-Png/150/150/AvatarHeadshot/Webp/noFilter"
//                name.className = "ferret-name"
            }
        }
    }

    button.onclick = function() {
        div.style.display = "grid"
        div.focus();
    };

    div.addEventListener("focusout", (event) => {
        if (!div.contains(event.relatedTarget)) {
            div.style.display = "none"
        }
    });

    fetchFriends();
}

//
// RAP
//

let userDetails = document.querySelector('.profile-header-social-counts');

if (userDetails) {
    const liElement = userDetails.querySelector('li');
    let rapCounter = liElement.cloneNode(true);
    userDetails.appendChild(rapCounter);

    let rapTitle = rapCounter.querySelector(".profile-header-social-count-label")
    rapTitle.textContent = "RAP"

    let actualRap = rapCounter.querySelector("b")

    async function getJson() {
        let rap = 0

        const inventoryData = await request("https://inventory.roblox.com/v1/users/"+userId+"/assets/collectibles?limit=100&sortOrder=Asc");

        if (inventoryData) {
            let data = inventoryData.data
            let lenght = data.length

            for (let i = 0; i < lenght; i++) {
                rap += data[i].recentAveragePrice
            }

            return rap
        }
    }  
    getJson().then(rap => {
        actualRap.textContent = rap;
    });
}