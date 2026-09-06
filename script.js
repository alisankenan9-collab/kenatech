class KenaTech {

    constructor() {

        this.storageKey = "kenatech_leads";

        this.adminUsername = "kenan";
        this.adminPassword = "kenatech2026";

        this.init();
    }


    init() {

        this.cacheElements();

        this.bindEvents();

        this.renderLeads();
    }


    cacheElements() {

        this.leadForm =
            document.getElementById("leadForm");

        this.formStatus =
            document.getElementById("formStatus");

        this.openAdmin =
            document.getElementById("openAdmin");

        this.closeLogin =
            document.getElementById("closeLogin");

        this.loginModal =
            document.getElementById("adminLoginModal");

        this.loginForm =
            document.getElementById("loginForm");

        this.loginStatus =
            document.getElementById("loginStatus");

        this.adminPanel =
            document.getElementById("adminPanel");

        this.logoutAdmin =
            document.getElementById("logoutAdmin");

        this.leadList =
            document.getElementById("leadList");

        this.clearLeads =
            document.getElementById("clearLeads");

        this.totalLeads =
            document.getElementById("totalLeads");

        this.newLeads =
            document.getElementById("newLeads");

        this.contactedLeads =
            document.getElementById("contactedLeads");

        this.wonLeads =
            document.getElementById("wonLeads");
    }


    bindEvents() {

        if (this.leadForm) {

            this.leadForm.addEventListener(
                "submit",
                (event) => this.submitLead(event)
            );
        }


        if (this.openAdmin) {

            this.openAdmin.addEventListener(
                "click",
                () => this.openLogin()
            );
        }


        if (this.closeLogin) {

            this.closeLogin.addEventListener(
                "click",
                () => this.closeLoginModal()
            );
        }


        if (this.loginModal) {

            this.loginModal.addEventListener(
                "click",
                (event) => {

                    if (
                        event.target ===
                        this.loginModal
                    ) {
                        this.closeLoginModal();
                    }

                }
            );
        }


        if (this.loginForm) {

            this.loginForm.addEventListener(
                "submit",
                (event) => this.login(event)
            );
        }


        if (this.logoutAdmin) {

            this.logoutAdmin.addEventListener(
                "click",
                () => this.logout()
            );
        }


        if (this.clearLeads) {

            this.clearLeads.addEventListener(
                "click",
                () => this.clearAllLeads()
            );
        }

    }


    getLeads() {

        try {

            return JSON.parse(
                localStorage.getItem(
                    this.storageKey
                )
            ) || [];

        } catch {

            return [];
        }
    }


    saveLeads(leads) {

        localStorage.setItem(
            this.storageKey,
            JSON.stringify(leads)
        );
    }


    submitLead(event) {

        event.preventDefault();


        const name =
            document
                .getElementById("clientName")
                .value
                .trim();


        const email =
            document
                .getElementById("clientEmail")
                .value
                .trim();


        const type =
            document
                .getElementById("projectType")
                .value;


        const details =
            document
                .getElementById("projectDetails")
                .value
                .trim();


        if (!name || !email || !type || !details) {

            this.showFormStatus(
                "Please complete all fields.",
                "error"
            );

            return;
        }


        const lead = {

            id: Date.now(),

            name: name,

            email: email,

            type: type,

            details: details,

            status: "new",

            date: new Date().toISOString()
        };


        const leads = this.getLeads();


        leads.unshift(lead);


        this.saveLeads(leads);


        this.leadForm.reset();


        this.showFormStatus(
            "✓ Proposal received. KenaTech will contact you soon.",
            "success"
        );


        this.renderLeads();
    }


    showFormStatus(message, type) {

        if (!this.formStatus) {
            return;
        }


        this.formStatus.textContent =
            message;


        if (type === "success") {

            this.formStatus.style.color =
                "#10b981";

        } else {

            this.formStatus.style.color =
                "#ef4444";
        }


        setTimeout(() => {

            this.formStatus.textContent = "";

        }, 5000);
    }


    openLogin() {

        this.loginModal.classList.add("show");

        document.body.classList.add(
            "modal-open"
        );

        document
            .getElementById("adminUsername")
            .focus();
    }


    closeLoginModal() {

        this.loginModal.classList.remove(
            "show"
        );

        document.body.classList.remove(
            "modal-open"
        );

        this.loginStatus.textContent = "";

        this.loginForm.reset();
    }


    login(event) {

        event.preventDefault();


        const username =
            document
                .getElementById("adminUsername")
                .value
                .trim();


        const password =
            document
                .getElementById("adminPassword")
                .value;


        if (
            username === this.adminUsername &&
            password === this.adminPassword
        ) {

            sessionStorage.setItem(
                "kenatech_admin",
                "true"
            );


            this.closeLoginModal();

            this.openDashboard();

        } else {

            this.loginStatus.textContent =
                "Incorrect username or password.";
        }
    }


    openDashboard() {

        this.adminPanel.classList.add(
            "show"
        );

        document.body.classList.add(
            "modal-open"
        );

        this.renderLeads();
    }


    logout() {

        sessionStorage.removeItem(
            "kenatech_admin"
        );


        this.adminPanel.classList.remove(
            "show"
        );

        document.body.classList.remove(
            "modal-open"
        );
    }


    renderLeads() {

        const leads = this.getLeads();


        this.updateStats(leads);


        if (!this.leadList) {
            return;
        }


        if (leads.length === 0) {

            this.leadList.innerHTML = `
                <div class="empty-leads">
                    <div style="font-size:40px;margin-bottom:10px;">
                        📭
                    </div>

                    <h3>No proposals yet</h3>

                    <p>
                        Incoming client requests will appear here.
                    </p>
                </div>
            `;

            return;
        }


        this.leadList.innerHTML =
            leads
                .map(
                    (lead) =>
                        this.createLeadCard(
                            lead
                        )
                )
                .join("");


        this.attachLeadButtons();
    }


    createLeadCard(lead) {

        const statusClass =
            `status-${lead.status}`;


        const statusText =
            lead.status;


        const formattedDate =
            new Date(
                lead.date
            ).toLocaleDateString(
                "en-US",
                {
                    year: "numeric",
                    month: "short",
                    day: "numeric"
                }
            );


        return `
            <article
                class="lead-card"
                data-id="${lead.id}"
            >

                <div class="lead-card-top">

                    <span class="status ${statusClass}">
                        ${this.escapeHTML(statusText)}
                    </span>

                    <span class="lead-date">
                        ${formattedDate}
                    </span>

                </div>


                <h3>
                    ${this.escapeHTML(lead.name)}
                </h3>


                <div class="lead-email">
                    ${this.escapeHTML(lead.email)}
                </div>


                <span class="lead-type">
                    ${this.escapeHTML(lead.type)}
                </span>


                <div class="lead-details">
                    ${this.escapeHTML(lead.details)}
                </div>


                <div class="lead-actions">

                    <button
                        class="status-btn"
                        data-action="status"
                        data-id="${lead.id}"
                    >
                        Next Status
                    </button>


                    <button
                        class="delete-btn"
                        data-action="delete"
                        data-id="${lead.id}"
                    >
                        Delete
                    </button>

                </div>

            </article>
        `;
    }


    attachLeadButtons() {

        const buttons =
            this.leadList.querySelectorAll(
                "button"
            );


        buttons.forEach((button) => {

            button.addEventListener(
                "click",
                () => {

                    const id =
                        Number(
                            button.dataset.id
                        );


                    const action =
                        button.dataset.action;


                    if (
                        action ===
                        "delete"
                    ) {

                        this.deleteLead(id);
                    }


                    if (
                        action ===
                        "status"
                    ) {

                        this.nextStatus(id);
                    }

                }
            );

        });
    }


    nextStatus(id) {

        const leads =
            this.getLeads();


        const lead =
            leads.find(
                (item) =>
                    item.id === id
            );


        if (!lead) {
            return;
        }


        if (lead.status === "new") {

            lead.status =
                "contacted";

        } else if (
            lead.status === "contacted"
        ) {

            lead.status =
                "won";

        } else {

            lead.status =
                "new";
        }


        this.saveLeads(leads);

        this.renderLeads();
    }


    deleteLead(id) {

        const confirmed =
            confirm(
                "Delete this proposal?"
            );


        if (!confirmed) {
            return;
        }


        const leads =
            this.getLeads()
                .filter(
                    (lead) =>
                        lead.id !== id
                );


        this.saveLeads(leads);

        this.renderLeads();
    }


    clearAllLeads() {

        const leads =
            this.getLeads();


        if (leads.length === 0) {

            return;
        }


        const confirmed =
            confirm(
                "Delete ALL proposals?"
            );


        if (!confirmed) {
            return;
        }


        localStorage.removeItem(
            this.storageKey
        );


        this.renderLeads();
    }


    updateStats(leads) {

        const total =
            leads.length;


        const newCount =
            leads.filter(
                (lead) =>
                    lead.status === "new"
            ).length;


        const contacted =
            leads.filter(
                (lead) =>
                    lead.status ===
                    "contacted"
            ).length;


        const won =
            leads.filter(
                (lead) =>
                    lead.status === "won"
            ).length;


        this.totalLeads.textContent =
            total;


        this.newLeads.textContent =
            newCount;


        this.contactedLeads.textContent =
            contacted;


        this.wonLeads.textContent =
            won;
    }


    escapeHTML(value) {

        return String(value)
            .replace(
                /[&<>"']/g,
                (character) => {

                    const entities = {

                        "&": "&amp;",

                        "<": "&lt;",

                        ">": "&gt;",

                        '"': "&quot;",

                        "'": "&#039;"
                    };


                    return entities[
                        character
                    ];
                }
            );
    }

}


/* START APPLICATION */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        window.kenaTech =
            new KenaTech();

    }
);