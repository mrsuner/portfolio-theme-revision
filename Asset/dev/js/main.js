import '../main.css';

(function(window, document, KB, $, hljs){
    // Adding logo through js if php templates have been overridden by other plugins
    if (!document.body.classList.contains("TR")){
        // Add Class
        document.body.classList.add("TR");
    }
    if (document.querySelector("header .logo > a") && !document.querySelector("header .logo > a > img")){
        // Replace Logo
        document.querySelector("header .logo > a").innerHTML = '<img src="' + getFavicon() + '" />';
    }

    // Init page Menu
    initMenu("section.sidebar-container > .sidebar");
    initMobileNavigation();
    initMobileAppNavigation();
    if (KB){
        KB.on('modal.afterRender', function(){
            // Init modal menu
            initMenu("#modal-overlay #modal-content section.sidebar-container > .sidebar");
            // add search box to select
            if ($){
                if (checkListSize($("#form-action_name"))){
                    $("#form-action_name").select2();
                }
                if (checkListSize($("#form-owner_id"))){
                    $("#form-owner_id").select2();
                    $(document).on("click", ".assign-me[data-target-id='form-owner_id']", function() {
                        $("#form-owner_id").trigger("change");
                    })
                }
            }

			initMobileNavigation();
			initMobileAppNavigation();
        });
        KB.on('dropdown.afterRender', function(){
            if ($){
                $dropdownMenu = $("#dropdown > ul.dropdown-submenu-open");
                // fix a bug that displays ghost spacing, compatible with firefox
                $dropdownMenu.children("li:not(.no-hover)").has("i.fa").css({
                    fontSize: 0
                });
                // add search box to dropdown menu
                if (checkListSize($dropdownMenu)){
                    $dropdownMenu.prepend('<li id="dropdown-search"><input tabindex="0" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" role="textbox"></li>');
                    $searchInput = $("#dropdown > ul.dropdown-submenu-open > #dropdown-search input");
                    $searchInput.on("click", function(event){
                        event.preventDefault();
                        event.stopImmediatePropagation();
                    });
                    $searchInput.on("keyup", searchKeyupHandler);
                }
            }
        });
    }
    
    // syntax highlight
    if (hljs){
        hljs.highlightAll();
    }

    // turn metamagik title to tips
    var metamagikTitles = document.querySelectorAll(".metamagik-footer-title");
    if (metamagikTitles.length > 0){
        document.querySelectorAll(".metamagik-footer-value").forEach((item, index) => {
            var text = metamagikTitles[index].querySelector("strong").innerText.trim();
            item.title = text.substring(0, text.length - 1);
        });
    }

    /* ---------- functions ---------- */

    // check list size
    function checkListSize($dropList){
        if ($dropList && $dropList.children(":not(.no-hover)").length > 25){
            return true;
        }
        return false;
    }
    // keyup event handler
    function searchKeyupHandler(){
        $(this).off("keyup");
        $searchList = $("#dropdown ul.dropdown-submenu-open li:not(.no-hover):not(#dropdown-search) > a");
        keyword = $(this).val();
        search($searchList, keyword, $(this));
    }
    // search function
    function search($searchList, keyword, $input){
        $searchList.each(function(){
            curentVal = $(this).text();
            if (keyword && curentVal.indexOf(keyword) < 0){
                $(this).parent().hide();
            }
            else {
                $(this).parent().show();
            }
        });
        curentInputVal = $input.val();
        if (curentInputVal == keyword){
            $input.on("keyup", searchKeyupHandler);
        }
        else{
            search($searchList, curentInputVal, $input);
        }
    }
    // Menu Init Function
    function initMenu(menuQS){
        var menu = document.querySelector(menuQS);

        if (menu){
            var menuBtnCon = document.querySelector(menuQS).parentNode;

            if (menuBtnCon && (! menuBtnCon.querySelector(".themeRevisionMenuBtn"))){
                var menuBtn = document.createElement("span");
                menuBtn.innerHTML = '<div class="themeRevisionMenuBtn">&equiv;</div>';
                menuBtnCon.insertBefore(menuBtn, menu);
                
                menuBtn.querySelector(".themeRevisionMenuBtn").onclick = function(event){
                    event.stopPropagation();
                    if (menu.style.display != "block"){
                        menu.style.display = "block";
                    }
                    else {
                        menu.style.display = "";
                    }
                };
                document.body.onclick = function(){
                    if (menu.style.display == "block"){
                        menu.style.display = "";
                    }
                }
            }
        }
    }

    // Fixed mobile navigation must be independently pannable even when the
    // page contains a wide Kanboard board table. Reveal the active item after
    // layout without intercepting touch gestures or keyboard focus.
    function initMobileNavigation(){
        if (!window.matchMedia || !window.matchMedia("(max-width: 600px)").matches){
            return;
        }

        var containers = document.querySelectorAll(
            ".project-header > .views-switcher-component, .page > .page-header, .page > #main > .page-header"
        );

        window.requestAnimationFrame(function(){
            containers.forEach(function(container){
                var activeLink = container.querySelector("li.active a, a.active, a[aria-current='page']");
                if (!activeLink){
                    return;
                }

                var containerBounds = container.getBoundingClientRect();
                var activeBounds = activeLink.getBoundingClientRect();
                if (activeBounds.left < containerBounds.left || activeBounds.right > containerBounds.right){
                    activeLink.scrollIntoView({block: "nearest", inline: "center", behavior: "auto"});
                }
            });
        });
    }

    // A compact app-level footer makes frequent cross-project destinations
    // reachable without shrinking Kanboard's desktop navigation. More collects
    // the current native/plugin links instead of maintaining a second route
    // registry that would drift as plugins are added.
    function initMobileAppNavigation(){
        if (!window.matchMedia || !window.matchMedia("(max-width: 1023px)").matches || document.querySelector(".tr-mobile-app-footer")){
            return;
        }

        var footer = document.createElement("nav");
        footer.className = "tr-mobile-app-footer";
        footer.setAttribute("aria-label", "Mobile navigation");

        var more = document.createElement("section");
        more.className = "tr-mobile-app-more";
        more.hidden = true;
        more.setAttribute("aria-label", "More navigation");
        more.innerHTML = "<h2>More</h2><ul></ul>";

        var destinations = [
            {label: "Portfolio", icon: "fa-briefcase", href: makeRoute("PortfolioController", "show", {plugin: "PortfolioDashboard"})},
            {label: "Tasks", icon: "fa-check-square-o", href: makeRoute("MobileController", "tasks", {plugin: "PortfolioDashboard"})},
            {label: "Timeline", icon: "fa-history", href: makeRoute("MobileController", "timeline", {plugin: "PortfolioDashboard"})}
        ];

        destinations.forEach(function(destination){
            var link = document.createElement("a");
            link.href = destination.href;
            link.innerHTML = "<i class=\"fa "+destination.icon+"\" aria-hidden=\"true\"></i><span>"+destination.label+"</span>";
            if (sameRoute(destination.href)){
                link.classList.add("is-active");
                link.setAttribute("aria-current", "page");
            }
            footer.appendChild(link);
        });

        var moreButton = document.createElement("button");
        moreButton.type = "button";
        moreButton.setAttribute("aria-expanded", "false");
        moreButton.setAttribute("aria-controls", "tr-mobile-app-more");
        moreButton.innerHTML = "<i class=\"fa fa-bars\" aria-hidden=\"true\"></i><span>More</span>";
        more.id = "tr-mobile-app-more";
		if (!destinations.some(function(destination){ return sameRoute(destination.href); })){
			moreButton.classList.add("is-active");
		}
        moreButton.addEventListener("click", function(){
            var open = more.hidden;
            more.hidden = !open;
            moreButton.setAttribute("aria-expanded", open ? "true" : "false");
        });
        footer.appendChild(moreButton);

        populateMoreNavigation(more.querySelector("ul"));
        document.body.classList.add("tr-mobile-app-nav");
        document.body.appendChild(more);
        document.body.appendChild(footer);

        document.addEventListener("keydown", function(event){
            if (event.key === "Escape" && !more.hidden){
                more.hidden = true;
                moreButton.setAttribute("aria-expanded", "false");
                moreButton.focus();
            }
        });
    }

    function makeRoute(controller, action, params){
        var url = new URL(window.location.pathname, window.location.origin);
        url.searchParams.set("controller", controller);
        url.searchParams.set("action", action);
        Object.keys(params).forEach(function(key){ url.searchParams.set(key, params[key]); });
        return url.toString();
    }

    function sameRoute(href){
        var destination = new URL(href, window.location.origin);
        var current = new URL(window.location.href);
        return destination.searchParams.get("controller") === current.searchParams.get("controller")
            && destination.searchParams.get("action") === current.searchParams.get("action");
    }

    function populateMoreNavigation(list){
        var seen = {};
        var sources = document.querySelectorAll("header a[href], .project-header a[href], section.sidebar-container > .sidebar a[href], .page > .page-header a[href]");
        sources.forEach(function(source){
            var href = source.href;
            var label = source.textContent.trim();
            if (!href || href.indexOf("#") === href.length - 1 || !label || seen[href]){
                return;
            }
            seen[href] = true;
            var item = document.createElement("li");
            var link = document.createElement("a");
            link.href = href;
            link.textContent = label;
            item.appendChild(link);
            list.appendChild(item);
        });
    }
    //Get Favicon
    function getFavicon(){
        if (document.querySelector("head link[rel='icon']")){
            return document.querySelector("head link[rel='icon']").getAttribute("href");
        }
        return "/assets/img/favicon.png";
    }
})(window, document, typeof KB == "undefined" ? null : KB, typeof jQuery == "undefined" ? null: jQuery, typeof hljs == "undefined" ? null: hljs); // compatible with public visit page
