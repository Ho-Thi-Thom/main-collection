
addEventButtonFilter()
function addEventButtonFilter() {
    const filter = document.querySelector('.collection__toolbar__filter')
    const buttons = document.querySelectorAll(".collection__toolbar-filter-btn");
    const buttonDropdowns = document.querySelectorAll(".collection__toolbar-filter-btn.dropdown");
    const buttonSidebars = document.querySelectorAll(".collection__toolbar-filter-btn.sidebar");
    const sidebar = document.querySelector('.collection__toolbar__filter-sidebar')
    const closeSidebarBtn = document.querySelector('.collection__toolbar__filter-sidebar > span')

    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            const currentState = button.getAttribute("data-state");
            if (!currentState || currentState === "closed") {
                button.setAttribute("data-state", "opened");
                button.setAttribute("aria-expanded", "true");

            } else {
                button.setAttribute("data-state", "closed");
                button.setAttribute("aria-expanded", "false");
            }

            if (closeSidebarBtn) {
                closeSidebarBtn.addEventListener('click', () => {
                    sidebar.classList.remove('active')
                    button.setAttribute("data-state", "closed");
                    button.setAttribute("aria-expanded", "false");
                })
            }
        });
    });
    buttonDropdowns.forEach((button) => {
        button.addEventListener("click", () => {
            if (filter) {
                filter.classList.toggle("active")
            }
        });
    });
    buttonSidebars.forEach((button) => {
        button.addEventListener("click", () => {
            if (sidebar) {
                sidebar.classList.add('active')
            }
        });
    });



}


document.addEventListener("shopify:section:load", () => {
    addEventButtonFilter()
});


