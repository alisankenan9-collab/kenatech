const SUPABASE_URL =
    "https://mcwlrxjnxmtqtsoaaysg.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_BEKzDtCnxnS6rk76XJ7xPw_mbCSe5Zq";

const ADMIN_EMAIL =
    "alisankenan9@gmail.com";


const supabaseClient =
    supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


class KenaTech {

    constructor() {

        this.leads = [];

        this.adminProjects = [];

        this.clients = [];

        this.init();
    }


    async init() {

        this.cacheElements();

        this.bindEvents();

        this.resetStats();

        await this.checkAuthSession();
    }


    cacheElements() {

        /* PUBLIC */

        this.leadForm =
            document.getElementById(
                "leadForm"
            );

        this.formStatus =
            document.getElementById(
                "formStatus"
            );


        /* ADMIN */

        this.openAdmin =
            document.getElementById(
                "openAdmin"
            );

        this.adminLoginModal =
            document.getElementById(
                "adminLoginModal"
            );

        this.closeLogin =
            document.getElementById(
                "closeLogin"
            );

        this.loginForm =
            document.getElementById(
                "loginForm"
            );

        this.loginStatus =
            document.getElementById(
                "loginStatus"
            );

        this.adminPanel =
            document.getElementById(
                "adminPanel"
            );

        this.logoutAdmin =
            document.getElementById(
                "logoutAdmin"
            );

        this.adminIdentity =
            document.getElementById(
                "adminIdentity"
            );


        /* LEADS */

        this.leadList =
            document.getElementById(
                "leadList"
            );

        this.clearLeads =
            document.getElementById(
                "clearLeads"
            );

        this.refreshLeads =
            document.getElementById(
                "refreshLeads"
            );

        this.leadSearch =
            document.getElementById(
                "leadSearch"
            );

        this.statusFilter =
            document.getElementById(
                "statusFilter"
            );

        this.projectFilter =
            document.getElementById(
                "projectFilter"
            );

        this.visibleLeadCount =
            document.getElementById(
                "visibleLeadCount"
            );

        this.lastSynced =
            document.getElementById(
                "lastSynced"
            );

        this.totalLeads =
            document.getElementById(
                "totalLeads"
            );

        this.newLeads =
            document.getElementById(
                "newLeads"
            );

        this.contactedLeads =
            document.getElementById(
                "contactedLeads"
            );

        this.wonLeads =
            document.getElementById(
                "wonLeads"
            );


        /* CLIENT AUTH */

        this.openClientPortal =
            document.getElementById(
                "openClientPortal"
            );

        this.clientAuthModal =
            document.getElementById(
                "clientAuthModal"
            );

        this.closeClientAuth =
            document.getElementById(
                "closeClientAuth"
            );

        this.showClientLogin =
            document.getElementById(
                "showClientLogin"
            );

        this.showClientRegister =
            document.getElementById(
                "showClientRegister"
            );

        this.clientLoginForm =
            document.getElementById(
                "clientLoginForm"
            );

        this.clientRegisterForm =
            document.getElementById(
                "clientRegisterForm"
            );

        this.clientAuthStatus =
            document.getElementById(
                "clientAuthStatus"
            );


        /* CLIENT PANEL */

        this.clientPanel =
            document.getElementById(
                "clientPanel"
            );

        this.clientIdentity =
            document.getElementById(
                "clientIdentity"
            );

        this.clientWelcomeTitle =
            document.getElementById(
                "clientWelcomeTitle"
            );

        this.clientProjectList =
            document.getElementById(
                "clientProjectList"
            );

        this.logoutClient =
            document.getElementById(
                "logoutClient"
            );


        /* ADMIN PROJECTS */

        this.adminProjectForm =
            document.getElementById(
                "adminProjectForm"
            );

        this.adminProjectClient =
            document.getElementById(
                "adminProjectClient"
            );

        this.adminProjectStatus =
            document.getElementById(
                "adminProjectStatus"
            );

        this.adminProjectList =
            document.getElementById(
                "adminProjectList"
            );

        this.refreshAdminProjects =
            document.getElementById(
                "refreshAdminProjects"
            );
    }


    bindEvents() {

        /* PUBLIC */

        if (this.leadForm) {

            this.leadForm.addEventListener(
                "submit",
                (event) =>
                    this.submitLead(event)
            );
        }


        /* ADMIN */

        if (this.openAdmin) {

            this.openAdmin.addEventListener(
                "click",
                () =>
                    this.handleAdminOpen()
            );
        }


        if (this.closeLogin) {

            this.closeLogin.addEventListener(
                "click",
                () =>
                    this.closeAdminLogin()
            );
        }


        if (this.loginForm) {

            this.loginForm.addEventListener(
                "submit",
                (event) =>
                    this.adminLogin(event)
            );
        }


        if (this.logoutAdmin) {

            this.logoutAdmin.addEventListener(
                "click",
                () =>
                    this.logout()
            );
        }


        /* LEADS */

        if (this.clearLeads) {

            this.clearLeads.addEventListener(
                "click",
                () =>
                    this.clearAllLeads()
            );
        }


        if (this.refreshLeads) {

            this.refreshLeads.addEventListener(
                "click",
                () =>
                    this.loadLeads()
            );
        }


        if (this.leadSearch) {

            this.leadSearch.addEventListener(
                "input",
                () =>
                    this.applyFilters()
            );
        }


        if (this.statusFilter) {

            this.statusFilter.addEventListener(
                "change",
                () =>
                    this.applyFilters()
            );
        }


        if (this.projectFilter) {

            this.projectFilter.addEventListener(
                "change",
                () =>
                    this.applyFilters()
            );
        }


        /* CLIENT */

        if (this.openClientPortal) {

            this.openClientPortal.addEventListener(
                "click",
                () =>
                    this.handleClientPortalOpen()
            );
        }


        if (this.closeClientAuth) {

            this.closeClientAuth.addEventListener(
                "click",
                () =>
                    this.closeClientAuthModal()
            );
        }


        if (this.showClientLogin) {

            this.showClientLogin.addEventListener(
                "click",
                () =>
                    this.switchClientAuth(
                        "login"
                    )
            );
        }


        if (this.showClientRegister) {

            this.showClientRegister.addEventListener(
                "click",
                () =>
                    this.switchClientAuth(
                        "register"
                    )
            );
        }


        if (this.clientLoginForm) {

            this.clientLoginForm.addEventListener(
                "submit",
                (event) =>
                    this.clientLogin(event)
            );
        }


        if (this.clientRegisterForm) {

            this.clientRegisterForm.addEventListener(
                "submit",
                (event) =>
                    this.clientRegister(event)
            );
        }


        if (this.logoutClient) {

            this.logoutClient.addEventListener(
                "click",
                () =>
                    this.logout()
            );
        }


        /* ADMIN PROJECTS */

        if (this.adminProjectForm) {

            this.adminProjectForm.addEventListener(
                "submit",
                (event) =>
                    this.createAdminProject(
                        event
                    )
            );
        }


        if (this.refreshAdminProjects) {

            this.refreshAdminProjects.addEventListener(
                "click",
                () =>
                    this.loadAdminProjectArea()
            );
        }
    }


    async checkAuthSession() {

        const {
            data,
            error
        } =
            await supabaseClient
                .auth
                .getSession();


        if (
            error ||
            !data.session
        ) {

            return;
        }


        const user =
            data.session.user;


        if (
            this.isAdmin(user)
        ) {

            this.setAdminIdentity(
                user
            );

        } else {

            this.setClientIdentity(
                user
            );
        }
    }


    isAdmin(user) {

        return (
            user &&
            user.email &&
            user.email.toLowerCase() ===
            ADMIN_EMAIL.toLowerCase()
        );
    }


    /* =====================================
       PUBLIC PROPOSAL
    ===================================== */


    async submitLead(event) {

        event.preventDefault();


        const name =
            document
                .getElementById(
                    "clientName"
                )
                .value
                .trim();


        const email =
            document
                .getElementById(
                    "clientEmail"
                )
                .value
                .trim();


        const type =
            document
                .getElementById(
                    "projectType"
                )
                .value;


        const details =
            document
                .getElementById(
                    "projectDetails"
                )
                .value
                .trim();


        if (
            !name ||
            !email ||
            !type ||
            !details
        ) {

            this.showFormStatus(
                "Please complete all fields.",
                "error"
            );

            return;
        }


        this.showFormStatus(
            "Sending proposal...",
            "success"
        );


        const {
            error
        } =
            await supabaseClient
                .from("leads")
                .insert([
                    {
                        name: name,
                        email: email,
                        project_type: type,
                        details: details,
                        status: "new"
                    }
                ]);


        if (error) {

            console.error(
                "Insert error:",
                error
            );


            this.showFormStatus(
                "Something went wrong. Please try again.",
                "error"
            );

            return;
        }


        this.leadForm.reset();


        this.showFormStatus(
            "✓ Proposal received. KenaTech will contact you soon.",
            "success"
        );
    }


    showFormStatus(
        message,
        type
    ) {

        if (
            !this.formStatus
        ) {
            return;
        }


        this.formStatus.textContent =
            message;


        this.formStatus.style.color =
            type === "success"
                ? "#10b981"
                : "#ef4444";


        setTimeout(
            () => {

                this.formStatus.textContent =
                    "";

            },
            5000
        );
    }


    /* =====================================
       ADMIN AUTH
    ===================================== */


    async handleAdminOpen() {

        const {
            data
        } =
            await supabaseClient
                .auth
                .getSession();


        if (
            data.session &&
            this.isAdmin(
                data.session.user
            )
        ) {

            await this.openDashboard();

            return;
        }


        if (
            data.session
        ) {

            await supabaseClient
                .auth
                .signOut();
        }


        this.openAdminLogin();
    }


    openAdminLogin() {

        if (
            !this.adminLoginModal
        ) {
            return;
        }


        this.adminLoginModal
            .classList
            .add(
                "show"
            );


        document.body
            .classList
            .add(
                "modal-open"
            );
    }


    closeAdminLogin() {

        if (
            this.adminLoginModal
        ) {

            this.adminLoginModal
                .classList
                .remove(
                    "show"
                );
        }


        document.body
            .classList
            .remove(
                "modal-open"
            );


        if (
            this.loginStatus
        ) {

            this.loginStatus.textContent =
                "";
        }


        if (
            this.loginForm
        ) {

            this.loginForm.reset();
        }
    }


    async adminLogin(event) {

        event.preventDefault();


        const email =
            document
                .getElementById(
                    "adminUsername"
                )
                .value
                .trim();


        const password =
            document
                .getElementById(
                    "adminPassword"
                )
                .value;


        this.loginStatus.textContent =
            "Signing in...";


        const {
            data,
            error
        } =
            await supabaseClient
                .auth
                .signInWithPassword({
                    email: email,
                    password: password
                });


        if (error) {

            this.loginStatus.textContent =
                "Incorrect email or password.";

            return;
        }


        if (
            !this.isAdmin(
                data.user
            )
        ) {

            await supabaseClient
                .auth
                .signOut();


            this.loginStatus.textContent =
                "This account is not an administrator.";

            return;
        }


        this.setAdminIdentity(
            data.user
        );


        this.closeAdminLogin();


        await this.openDashboard();
    }


    setAdminIdentity(user) {

        if (
            this.adminIdentity
        ) {

            this.adminIdentity.textContent =
                user?.email ||
                "KenaTech Admin";
        }
    }


    async openDashboard() {

        const {
            data
        } =
            await supabaseClient
                .auth
                .getSession();


        if (
            !data.session ||
            !this.isAdmin(
                data.session.user
            )
        ) {

            this.openAdminLogin();

            return;
        }


        this.adminPanel
            .classList
            .add(
                "show"
            );


        document.body
            .classList
            .add(
                "modal-open"
            );


        await this.loadLeads();

        await this.loadAdminProjectArea();
    }


    /* =====================================
       CLIENT AUTH
    ===================================== */


    async handleClientPortalOpen() {

        const {
            data
        } =
            await supabaseClient
                .auth
                .getSession();


        if (
            data.session &&
            !this.isAdmin(
                data.session.user
            )
        ) {

            await this.openClientPanel();

            return;
        }


        if (
            data.session &&
            this.isAdmin(
                data.session.user
            )
        ) {

            alert(
                "Admin is currently signed in. Logout from Admin Dashboard before using Client Portal."
            );

            return;
        }


        this.openClientAuthModal();
    }


    openClientAuthModal() {

        this.clientAuthModal
            .classList
            .add(
                "show"
            );


        document.body
            .classList
            .add(
                "modal-open"
            );


        this.switchClientAuth(
            "login"
        );
    }


    closeClientAuthModal() {

        this.clientAuthModal
            .classList
            .remove(
                "show"
            );


        document.body
            .classList
            .remove(
                "modal-open"
            );


        this.clientAuthStatus.textContent =
            "";
    }


    switchClientAuth(mode) {

        const loginMode =
            mode ===
            "login";


        this.clientLoginForm
            .classList
            .toggle(
                "hidden",
                !loginMode
            );


        this.clientRegisterForm
            .classList
            .toggle(
                "hidden",
                loginMode
            );


        this.showClientLogin
            .classList
            .toggle(
                "active",
                loginMode
            );


        this.showClientRegister
            .classList
            .toggle(
                "active",
                !loginMode
            );


        this.clientAuthStatus.textContent =
            "";
    }


    async clientRegister(event) {

        event.preventDefault();


        const fullName =
            document
                .getElementById(
                    "clientRegisterName"
                )
                .value
                .trim();


        const email =
            document
                .getElementById(
                    "clientRegisterEmail"
                )
                .value
                .trim();


        const password =
            document
                .getElementById(
                    "clientRegisterPassword"
                )
                .value;


        this.setClientAuthStatus(
            "Creating account...",
            "normal"
        );


        const {
            data,
            error
        } =
            await supabaseClient
                .auth
                .signUp({

                    email: email,

                    password: password,

                    options: {

                        data: {

                            full_name:
                                fullName
                        }
                    }
                });


        if (error) {

            console.error(
                error
            );


            this.setClientAuthStatus(
                error.message,
                "error"
            );

            return;
        }


        this.clientRegisterForm
            .reset();


        if (
            data.session
        ) {

            this.closeClientAuthModal();

            await this.openClientPanel();

            return;
        }


        this.setClientAuthStatus(
            "✓ Account created. Check your email to confirm your account, then login.",
            "success"
        );
    }


    async clientLogin(event) {

        event.preventDefault();


        const email =
            document
                .getElementById(
                    "clientLoginEmail"
                )
                .value
                .trim();


        const password =
            document
                .getElementById(
                    "clientLoginPassword"
                )
                .value;


        this.setClientAuthStatus(
            "Signing in...",
            "normal"
        );


        const {
            data,
            error
        } =
            await supabaseClient
                .auth
                .signInWithPassword({

                    email: email,

                    password: password
                });


        if (error) {

            this.setClientAuthStatus(
                "Incorrect email or password.",
                "error"
            );

            return;
        }


        if (
            this.isAdmin(
                data.user
            )
        ) {

            await supabaseClient
                .auth
                .signOut();


            this.setClientAuthStatus(
                "Admin account cannot use Client Portal.",
                "error"
            );

            return;
        }


        this.clientLoginForm
            .reset();


        this.closeClientAuthModal();


        await this.openClientPanel();
    }


    setClientAuthStatus(
        message,
        type
    ) {

        this.clientAuthStatus.textContent =
            message;


        if (
            type ===
            "success"
        ) {

            this.clientAuthStatus.style.color =
                "#10b981";

        } else if (
            type ===
            "error"
        ) {

            this.clientAuthStatus.style.color =
                "#ef4444";

        } else {

            this.clientAuthStatus.style.color =
                "#94a3b8";
        }
    }


    async openClientPanel() {

        const {
            data
        } =
            await supabaseClient
                .auth
                .getSession();


        if (
            !data.session
        ) {

            this.openClientAuthModal();

            return;
        }


        if (
            this.isAdmin(
                data.session.user
            )
        ) {

            return;
        }


        this.setClientIdentity(
            data.session.user
        );


        this.clientPanel
            .classList
            .add(
                "show"
            );


        document.body
            .classList
            .add(
                "modal-open"
            );


        await this.loadClientProfile();

        await this.loadClientProjects();
    }


    setClientIdentity(user) {

        if (
            this.clientIdentity
        ) {

            this.clientIdentity.textContent =
                user?.email ||
                "Client";
        }
    }


    async loadClientProfile() {

        const {
            data:
                sessionData
        } =
            await supabaseClient
                .auth
                .getSession();


        if (
            !sessionData.session
        ) {

            return;
        }


        const user =
            sessionData.session.user;


        const {
            data,
            error
        } =
            await supabaseClient
                .from("profiles")
                .select(
                    "full_name,email"
                )
                .eq(
                    "id",
                    user.id
                )
                .maybeSingle();


        if (error) {

            console.error(
                "Profile error:",
                error
            );

            return;
        }


        if (
            this.clientWelcomeTitle
        ) {

            const name =
                data?.full_name ||
                user.email;


            this.clientWelcomeTitle.textContent =
                `Welcome, ${name}`;
        }
    }


    async loadClientProjects() {

        if (
            !this.clientProjectList
        ) {

            return;
        }


        this.clientProjectList.innerHTML = `
            <div class="empty-leads">
                Loading projects...
            </div>
        `;


        const {
            data,
            error
        } =
            await supabaseClient
                .from("projects")
                .select("*")
                .order(
                    "created_at",
                    {
                        ascending:
                            false
                    }
                );


        if (error) {

            console.error(
                "Client projects error:",
                error
            );


            this.clientProjectList.innerHTML = `
                <div class="empty-leads">
                    Unable to load projects.
                </div>
            `;

            return;
        }


        if (
            !data ||
            data.length === 0
        ) {

            this.clientProjectList.innerHTML = `
                <div class="empty-leads">

                    <div style="font-size:40px">
                        📁
                    </div>

                    <h3>
                        No projects yet
                    </h3>

                    <p>
                        Your KenaTech projects will appear here after they are created by the team.
                    </p>

                </div>
            `;

            return;
        }


        this.clientProjectList.innerHTML =
            data
                .map(
                    (project) =>
                        this.createClientProjectCard(
                            project
                        )
                )
                .join("");
    }


    createClientProjectCard(
        project
    ) {

        const status =
            project.status ||
            "planning";


        const progress =
            Number(
                project.progress
            ) || 0;


        return `
            <article
                class="client-project-card"
            >

                <div
                    class="project-card-header"
                >

                    <div>

                        <span
                            class="status status-${this.escapeHTML(status)}"
                        >
                            ${this.escapeHTML(status)}
                        </span>

                        <h2>
                            ${this.escapeHTML(project.title)}
                        </h2>

                        <p>
                            ${this.escapeHTML(
                                project.project_type ||
                                ""
                            )}
                        </p>

                    </div>


                    <span
                        class="lead-date"
                    >
                        Updated
                        ${this.formatDate(
                            project.updated_at
                        )}
                    </span>

                </div>


                <p
                    class="project-description"
                >
                    ${this.escapeHTML(
                        project.description ||
                        ""
                    )}
                </p>


                <div
                    class="client-project-meta"
                >

                    <span>
                        Project #${project.id}
                    </span>

                    <span>
                        ${this.escapeHTML(
                            project.project_type ||
                            "Project"
                        )}
                    </span>

                </div>


                <div
                    class="progress-head"
                >

                    <strong>
                        Development Progress
                    </strong>

                    <strong>
                        ${progress}%
                    </strong>

                </div>


                <div
                    class="progress-track"
                >

                    <div
                        class="progress-bar"
                        style="width:${progress}%"
                    ></div>

                </div>

            </article>
        `;
    }


    /* =====================================
       ADMIN LEADS
    ===================================== */


    async loadLeads() {

        this.showLoading();


        const {
            data,
            error
        } =
            await supabaseClient
                .from("leads")
                .select("*")
                .order(
                    "created_at",
                    {
                        ascending:
                            false
                    }
                );


        if (error) {

            console.error(
                error
            );


            this.showDashboardError(
                "Unable to load proposals."
            );

            return;
        }


        this.leads =
            data || [];


        this.updateStats(
            this.leads
        );


        this.updateSyncTime();


        this.applyFilters();
    }


    applyFilters() {

        let filtered =
            [
                ...this.leads
            ];


        const search =
            this.leadSearch
                ? this.leadSearch
                    .value
                    .trim()
                    .toLowerCase()
                : "";


        const status =
            this.statusFilter
                ? this.statusFilter.value
                : "all";


        const project =
            this.projectFilter
                ? this.projectFilter.value
                : "all";


        if (
            search
        ) {

            filtered =
                filtered.filter(
                    (lead) => {

                        const value =
                            [
                                lead.name,
                                lead.email,
                                lead.project_type,
                                lead.details
                            ]
                                .join(" ")
                                .toLowerCase();


                        return value.includes(
                            search
                        );
                    }
                );
        }


        if (
            status !==
            "all"
        ) {

            filtered =
                filtered.filter(
                    (lead) =>
                        lead.status ===
                        status
                );
        }


        if (
            project !==
            "all"
        ) {

            filtered =
                filtered.filter(
                    (lead) =>
                        lead.project_type ===
                        project
                );
        }


        this.renderLeads(
            filtered
        );


        this.updateVisibleCount(
            filtered.length
        );
    }


    renderLeads(leads) {

        if (
            !this.leadList
        ) {

            return;
        }


        if (
            leads.length === 0
        ) {

            this.leadList.innerHTML = `
                <div class="empty-leads">

                    <div
                        style="
                            font-size:40px;
                            margin-bottom:10px;
                        "
                    >
                        📭
                    </div>

                    <h3>
                        No proposals found
                    </h3>

                    <p>
                        No leads match the current filters.
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

        const status =
            lead.status ||
            "new";


        const email =
            this.escapeHTML(
                lead.email
            );


        return `
            <article
                class="lead-card"
                data-id="${lead.id}"
            >

                <div
                    class="lead-card-top"
                >

                    <span
                        class="status status-${this.escapeHTML(status)}"
                    >
                        ${this.escapeHTML(status)}
                    </span>

                    <span
                        class="lead-date"
                    >
                        ${this.formatDate(
                            lead.created_at
                        )}
                    </span>

                </div>


                <h3>
                    ${this.escapeHTML(
                        lead.name
                    )}
                </h3>


                <div
                    class="lead-email"
                >
                    ${email}
                </div>


                <span
                    class="lead-type"
                >
                    ${this.escapeHTML(
                        lead.project_type ||
                        "Other"
                    )}
                </span>


                <div
                    class="lead-details"
                >
                    ${this.escapeHTML(
                        lead.details ||
                        ""
                    )}
                </div>


                <div
                    class="lead-actions"
                >

                    <button
                        class="status-btn"
                        data-action="status"
                        data-id="${lead.id}"
                        type="button"
                    >
                        ${this.getNextStatusLabel(
                            status
                        )}
                    </button>


                    <button
                        class="status-btn"
                        data-action="analyze"
                        data-id="${lead.id}"
                        type="button"
                    >
                        ✨ Smart Analyze
                    </button>


                    <a
                        class="email-btn"
                        href="mailto:${email}"
                    >
                        Email Client
                    </a>


                    <button
                        class="delete-btn"
                        data-action="delete"
                        data-id="${lead.id}"
                        type="button"
                    >
                        Delete
                    </button>

                </div>


                <div
                    id="analysis-${lead.id}"
                ></div>

            </article>
        `;
    }


    getNextStatusLabel(
        status
    ) {

        if (
            status ===
            "new"
        ) {

            return "Mark Contacted";
        }


        if (
            status ===
            "contacted"
        ) {

            return "Mark Won";
        }


        return "Reset Status";
    }


    attachLeadButtons() {

        const buttons =
            this.leadList
                .querySelectorAll(
                    "button[data-action]"
                );


        buttons.forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    async () => {

                        const id =
                            Number(
                                button
                                    .dataset
                                    .id
                            );


                        const action =
                            button
                                .dataset
                                .action;


                        if (
                            action ===
                            "delete"
                        ) {

                            await this.deleteLead(
                                id
                            );
                        }


                        if (
                            action ===
                            "status"
                        ) {

                            await this.nextStatus(
                                id
                            );
                        }


                        if (
                            action ===
                            "analyze"
                        ) {

                            this.analyzeLead(
                                id
                            );
                        }
                    }
                );
            }
        );
    }


    /* =====================================
       SMART PROPOSAL ANALYZER
    ===================================== */


    analyzeLead(id) {

        const lead =
            this.leads.find(
                (item) =>
                    item.id === id
            );


        if (
            !lead
        ) {

            return;
        }


        const analysis =
            this.generateSmartAnalysis(
                lead
            );


        const container =
            document.getElementById(
                `analysis-${id}`
            );


        if (
            !container
        ) {

            return;
        }


        if (
            container.innerHTML.trim() !==
            ""
        ) {

            container.innerHTML =
                "";

            return;
        }


        container.innerHTML = `
            <div
                style="
                    margin-top:18px;
                    padding:18px;
                    border-radius:14px;
                    border:1px solid rgba(96,165,250,0.22);
                    background:rgba(2,6,23,0.85);
                "
            >

                <div
                    style="
                        color:#60a5fa;
                        font-size:11px;
                        font-weight:800;
                        letter-spacing:1.5px;
                        margin-bottom:10px;
                    "
                >
                    ✨ KENATECH SMART ANALYSIS
                </div>


                <div
                    style="
                        display:grid;
                        gap:10px;
                        font-size:13px;
                    "
                >

                    <div>
                        <strong>
                            Project:
                        </strong>

                        <span
                            style="
                                color:#94a3b8;
                            "
                        >
                            ${this.escapeHTML(
                                analysis.project
                            )}
                        </span>
                    </div>


                    <div>
                        <strong>
                            Complexity:
                        </strong>

                        <span
                            style="
                                color:#94a3b8;
                            "
                        >
                            ${this.escapeHTML(
                                analysis.complexity
                            )}
                        </span>
                    </div>


                    <div>
                        <strong>
                            Priority:
                        </strong>

                        <span
                            style="
                                color:#94a3b8;
                            "
                        >
                            ${this.escapeHTML(
                                analysis.priority
                            )}
                        </span>
                    </div>


                    <div>
                        <strong>
                            Estimated Scope:
                        </strong>

                        <span
                            style="
                                color:#94a3b8;
                            "
                        >
                            ${this.escapeHTML(
                                analysis.scope
                            )}
                        </span>
                    </div>


                    <div>
                        <strong>
                            Suggested Technologies:
                        </strong>

                        <div
                            style="
                                color:#60a5fa;
                                margin-top:4px;
                            "
                        >
                            ${this.escapeHTML(
                                analysis.technologies
                            )}
                        </div>
                    </div>


                    <div>
                        <strong>
                            Recommended Action:
                        </strong>

                        <div
                            style="
                                color:#94a3b8;
                                margin-top:4px;
                                line-height:1.6;
                            "
                        >
                            ${this.escapeHTML(
                                analysis.action
                            )}
                        </div>
                    </div>


                    <div>
                        <strong>
                            Questions for Client:
                        </strong>

                        <div
                            style="
                                color:#94a3b8;
                                margin-top:4px;
                                line-height:1.6;
                            "
                        >
                            ${this.escapeHTML(
                                analysis.questions
                            )}
                        </div>
                    </div>

                </div>

            </div>
        `;
    }


    generateSmartAnalysis(lead) {

        const text =
            `${lead.project_type || ""} ${lead.details || ""}`
                .toLowerCase();


        let complexity =
            "Medium";


        let priority =
            "Normal";


        let scope =
            "Medium-size digital project";


        let technologies =
            "HTML, CSS, JavaScript, Supabase";


        let action =
            "Contact the client and clarify the full project requirements before preparing the proposal.";


        let questions =
            "Ask about deadline, budget, required pages/features and preferred design style.";


        /* WEBSITE */

        if (
            lead.project_type ===
            "Website"
        ) {

            technologies =
                "HTML, CSS, JavaScript, Supabase, Vercel";


            scope =
                "Business website / landing experience";


            questions =
                "Ask how many pages are needed, whether they already have a design, and whether they need a CMS or admin panel.";
        }


        /* WEB APPLICATION */

        if (
            lead.project_type ===
            "Web Application"
        ) {

            complexity =
                "Medium–High";


            technologies =
                "JavaScript, Supabase Auth, PostgreSQL, APIs, Vercel";


            scope =
                "Interactive web application with backend functionality";


            questions =
                "Ask which user roles are required, what data should be stored and what the main application workflow is.";
        }


        /* SAAS */

        if (
            lead.project_type ===
            "SaaS"
        ) {

            complexity =
                "High";


            technologies =
                "JavaScript, Supabase, PostgreSQL, Auth, Edge Functions, SaaS architecture";


            scope =
                "Multi-user SaaS product";


            action =
                "Schedule a requirements discussion and define the MVP before development begins.";


            questions =
                "Ask who the target users are, what the core MVP feature is, whether subscriptions are required and which user roles are needed.";
        }


        /* MOBILE */

        if (
            lead.project_type ===
            "Mobile App"
        ) {

            complexity =
                "High";


            technologies =
                "React Native or Flutter, Supabase, Authentication, APIs";


            scope =
                "Mobile application with backend services";


            questions =
                "Ask whether the app is for Android, iOS or both, what the main screens are and whether push notifications are required.";
        }


        /* ECOMMERCE */

        if (
            text.includes(
                "shop"
            ) ||
            text.includes(
                "store"
            ) ||
            text.includes(
                "ecommerce"
            ) ||
            text.includes(
                "e-commerce"
            ) ||
            text.includes(
                "product"
            ) &&
            text.includes(
                "payment"
            )
        ) {

            complexity =
                "High";


            technologies =
                "Frontend, Supabase, Product Database, Checkout Integration, Admin Dashboard";


            scope =
                "E-commerce platform";


            questions =
                "Ask how many products they expect, which payment provider they want and whether inventory management is required.";
        }


        /* AUTH */

        if (
            text.includes(
                "login"
            ) ||
            text.includes(
                "register"
            ) ||
            text.includes(
                "account"
            ) ||
            text.includes(
                "user"
            )
        ) {

            complexity =
                this.raiseComplexity(
                    complexity
                );


            technologies +=
                ", Supabase Auth";
        }


        /* DATABASE */

        if (
            text.includes(
                "database"
            ) ||
            text.includes(
                "dashboard"
            ) ||
            text.includes(
                "admin"
            )
        ) {

            complexity =
                this.raiseComplexity(
                    complexity
                );


            technologies +=
                ", PostgreSQL";
        }


        /* API */

        if (
            text.includes(
                "api"
            ) ||
            text.includes(
                "integration"
            ) ||
            text.includes(
                "connect"
            )
        ) {

            complexity =
                this.raiseComplexity(
                    complexity
                );


            technologies +=
                ", API Integration";
        }


        /* AI */

        if (
            text.includes(
                "ai"
            ) ||
            text.includes(
                "artificial intelligence"
            ) ||
            text.includes(
                "chatbot"
            )
        ) {

            complexity =
                "High";


            technologies +=
                ", AI API / Automation";


            scope +=
                " with AI functionality";
        }


        /* PAYMENT */

        if (
            text.includes(
                "payment"
            ) ||
            text.includes(
                "pay"
            ) ||
            text.includes(
                "subscription"
            )
        ) {

            complexity =
                "High";


            technologies +=
                ", Payment Integration";


            questions +=
                " Confirm the payment provider and whether recurring subscriptions are required.";
        }


        /* URGENT */

        if (
            text.includes(
                "urgent"
            ) ||
            text.includes(
                "asap"
            ) ||
            text.includes(
                "quick"
            ) ||
            text.includes(
                "fast"
            )
        ) {

            priority =
                "High";
        }


        /* LARGE DESCRIPTION */

        const wordCount =
            String(
                lead.details ||
                ""
            )
                .trim()
                .split(
                    /\s+/
                )
                .filter(
                    Boolean
                )
                .length;


        if (
            wordCount >
            100
        ) {

            complexity =
                this.raiseComplexity(
                    complexity
                );


            scope =
                "Detailed / larger project scope";
        }


        return {

            project:
                lead.project_type ||
                "Other",

            complexity:
                complexity,

            priority:
                priority,

            scope:
                scope,

            technologies:
                this.removeDuplicates(
                    technologies
                ),

            action:
                action,

            questions:
                questions
        };
    }


    raiseComplexity(
        current
    ) {

        if (
            current ===
            "Low"
        ) {

            return "Medium";
        }


        if (
            current ===
            "Medium"
        ) {

            return "Medium–High";
        }


        if (
            current ===
            "Medium–High"
        ) {

            return "High";
        }


        return current;
    }


    removeDuplicates(
        technologies
    ) {

        const values =
            technologies
                .split(",")
                .map(
                    (item) =>
                        item.trim()
                );


        return [
            ...new Set(
                values
            )
        ]
            .join(", ");
    }


    /* =====================================
       LEAD STATUS
    ===================================== */


    async nextStatus(id) {

        const lead =
            this.leads.find(
                (item) =>
                    item.id === id
            );


        if (
            !lead
        ) {

            return;
        }


        let newStatus =
            "new";


        if (
            lead.status ===
            "new"
        ) {

            newStatus =
                "contacted";

        } else if (
            lead.status ===
            "contacted"
        ) {

            newStatus =
                "won";
        }


        const {
            error
        } =
            await supabaseClient
                .from("leads")
                .update({

                    status:
                        newStatus
                })
                .eq(
                    "id",
                    id
                );


        if (error) {

            console.error(
                error
            );


            alert(
                "Status could not be updated."
            );

            return;
        }


        await this.loadLeads();
    }


    async deleteLead(id) {

        const confirmed =
            confirm(
                "Delete this proposal?"
            );


        if (
            !confirmed
        ) {

            return;
        }


        const {
            error
        } =
            await supabaseClient
                .from("leads")
                .delete()
                .eq(
                    "id",
                    id
                );


        if (error) {

            console.error(
                error
            );


            alert(
                "Proposal could not be deleted."
            );

            return;
        }


        await this.loadLeads();
    }


    async clearAllLeads() {

        if (
            this.leads.length ===
            0
        ) {

            return;
        }


        if (
            !confirm(
                "Delete ALL proposals?"
            )
        ) {

            return;
        }


        if (
            !confirm(
                "Are you absolutely sure?"
            )
        ) {

            return;
        }


        const {
            error
        } =
            await supabaseClient
                .from("leads")
                .delete()
                .gt(
                    "id",
                    0
                );


        if (error) {

            console.error(
                error
            );


            alert(
                "Could not delete proposals."
            );

            return;
        }


        await this.loadLeads();
    }


    /* =====================================
       ADMIN PROJECT MANAGEMENT
    ===================================== */


    async loadAdminProjectArea() {

        await this.loadClients();

        await this.loadAdminProjects();
    }


    async loadClients() {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("profiles")
                .select(
                    "id,full_name,email,role,created_at"
                )
                .eq(
                    "role",
                    "client"
                )
                .order(
                    "created_at",
                    {
                        ascending:
                            false
                    }
                );


        if (error) {

            console.error(
                "Clients error:",
                error
            );

            return;
        }


        this.clients =
            data || [];


        if (
            !this.adminProjectClient
        ) {

            return;
        }


        this.adminProjectClient.innerHTML = `
            <option value="">
                Select Client
            </option>
        `;


        this.clients.forEach(
            (client) => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    client.id;


                option.textContent =
                    `${
                        client.full_name ||
                        "Client"
                    } — ${
                        client.email
                    }`;


                this.adminProjectClient
                    .appendChild(
                        option
                    );
            }
        );
    }


    async createAdminProject(event) {

        event.preventDefault();


        const clientId =
            this.adminProjectClient
                .value;


        const title =
            document
                .getElementById(
                    "adminProjectTitle"
                )
                .value
                .trim();


        const projectType =
            document
                .getElementById(
                    "adminProjectType"
                )
                .value;


        const description =
            document
                .getElementById(
                    "adminProjectDescription"
                )
                .value
                .trim();


        if (
            !clientId ||
            !title ||
            !projectType ||
            !description
        ) {

            this.adminProjectStatus.textContent =
                "Complete all project fields.";

            this.adminProjectStatus.style.color =
                "#ef4444";

            return;
        }


        this.adminProjectStatus.style.color =
            "#94a3b8";


        this.adminProjectStatus.textContent =
            "Creating project...";


        const {
            error
        } =
            await supabaseClient
                .from("projects")
                .insert([
                    {

                        client_id:
                            clientId,

                        title:
                            title,

                        project_type:
                            projectType,

                        description:
                            description,

                        status:
                            "planning",

                        progress:
                            0
                    }
                ]);


        if (error) {

            console.error(
                error
            );


            this.adminProjectStatus.style.color =
                "#ef4444";


            this.adminProjectStatus.textContent =
                "Project could not be created.";

            return;
        }


        this.adminProjectForm
            .reset();


        this.adminProjectStatus.style.color =
            "#10b981";


        this.adminProjectStatus.textContent =
            "✓ Project created.";


        await this.loadAdminProjects();
    }


    async loadAdminProjects() {

        if (
            !this.adminProjectList
        ) {

            return;
        }


        this.adminProjectList.innerHTML = `
            <div class="empty-leads">
                Loading client projects...
            </div>
        `;


        const {
            data,
            error
        } =
            await supabaseClient
                .from("projects")
                .select("*")
                .order(
                    "created_at",
                    {
                        ascending:
                            false
                    }
                );


        if (error) {

            console.error(
                error
            );


            this.adminProjectList.innerHTML = `
                <div class="empty-leads">
                    Could not load projects.
                </div>
            `;

            return;
        }


        this.adminProjects =
            data || [];


        if (
            this.adminProjects.length ===
            0
        ) {

            this.adminProjectList.innerHTML = `
                <div class="empty-leads">
                    No client projects yet.
                </div>
            `;

            return;
        }


        this.adminProjectList.innerHTML =
            this.adminProjects
                .map(
                    (project) =>
                        this.createAdminProjectCard(
                            project
                        )
                )
                .join("");


        this.attachAdminProjectButtons();
    }


    createAdminProjectCard(
        project
    ) {

        const client =
            this.clients.find(
                (item) =>
                    item.id ===
                    project.client_id
            );


        return `
            <article
                class="admin-project-card"
                data-project-id="${project.id}"
            >

                <div
                    class="project-card-header"
                >

                    <div>

                        <span
                            class="status status-${this.escapeHTML(project.status)}"
                        >
                            ${this.escapeHTML(project.status)}
                        </span>

                        <h3>
                            ${this.escapeHTML(project.title)}
                        </h3>

                        <p>
                            ${this.escapeHTML(
                                client?.email ||
                                "Unknown client"
                            )}
                        </p>

                    </div>


                    <span
                        class="lead-date"
                    >
                        #${project.id}
                    </span>

                </div>


                <p
                    class="project-description"
                >
                    ${this.escapeHTML(
                        project.description ||
                        ""
                    )}
                </p>


                <div
                    class="progress-head"
                >

                    <span>
                        Progress
                    </span>

                    <strong>
                        ${project.progress}%
                    </strong>

                </div>


                <div
                    class="progress-track"
                >

                    <div
                        class="progress-bar"
                        style="width:${project.progress}%"
                    ></div>

                </div>


                <div
                    class="admin-project-controls"
                >

                    <select
                        class="admin-project-status-select"
                        data-project-id="${project.id}"
                    >

                        <option
                            value="planning"
                            ${
                                project.status ===
                                "planning"
                                    ? "selected"
                                    : ""
                            }
                        >
                            Planning
                        </option>

                        <option
                            value="development"
                            ${
                                project.status ===
                                "development"
                                    ? "selected"
                                    : ""
                            }
                        >
                            Development
                        </option>

                        <option
                            value="review"
                            ${
                                project.status ===
                                "review"
                                    ? "selected"
                                    : ""
                            }
                        >
                            Review
                        </option>

                        <option
                            value="completed"
                            ${
                                project.status ===
                                "completed"
                                    ? "selected"
                                    : ""
                            }
                        >
                            Completed
                        </option>

                    </select>


                    <input
                        class="admin-project-progress-input"
                        data-project-id="${project.id}"
                        type="number"
                        min="0"
                        max="100"
                        value="${project.progress}"
                    >

                </div>


                <div
                    class="admin-project-actions"
                >

                    <button
                        class="status-btn"
                        data-project-action="save"
                        data-project-id="${project.id}"
                        type="button"
                    >
                        Save Changes
                    </button>


                    <button
                        class="delete-btn"
                        data-project-action="delete"
                        data-project-id="${project.id}"
                        type="button"
                    >
                        Delete Project
                    </button>

                </div>

            </article>
        `;
    }


    attachAdminProjectButtons() {

        const buttons =
            this.adminProjectList
                .querySelectorAll(
                    "button[data-project-action]"
                );


        buttons.forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    async () => {

                        const id =
                            Number(
                                button
                                    .dataset
                                    .projectId
                            );


                        if (
                            button
                                .dataset
                                .projectAction ===
                            "save"
                        ) {

                            await this.saveAdminProject(
                                id
                            );
                        }


                        if (
                            button
                                .dataset
                                .projectAction ===
                            "delete"
                        ) {

                            await this.deleteAdminProject(
                                id
                            );
                        }
                    }
                );
            }
        );
    }


    async saveAdminProject(id) {

        const statusSelect =
            this.adminProjectList
                .querySelector(
                    `.admin-project-status-select[data-project-id="${id}"]`
                );


        const progressInput =
            this.adminProjectList
                .querySelector(
                    `.admin-project-progress-input[data-project-id="${id}"]`
                );


        if (
            !statusSelect ||
            !progressInput
        ) {

            return;
        }


        const progress =
            Math.max(
                0,
                Math.min(
                    100,
                    Number(
                        progressInput.value
                    ) || 0
                )
            );


        const {
            error
        } =
            await supabaseClient
                .from("projects")
                .update({

                    status:
                        statusSelect.value,

                    progress:
                        progress
                })
                .eq(
                    "id",
                    id
                );


        if (error) {

            console.error(
                error
            );


            alert(
                "Project could not be updated."
            );

            return;
        }


        await this.loadAdminProjects();
    }


    async deleteAdminProject(id) {

        if (
            !confirm(
                "Delete this client project?"
            )
        ) {

            return;
        }


        const {
            error
        } =
            await supabaseClient
                .from("projects")
                .delete()
                .eq(
                    "id",
                    id
                );


        if (error) {

            console.error(
                error
            );


            alert(
                "Project could not be deleted."
            );

            return;
        }


        await this.loadAdminProjects();
    }


    /* =====================================
       GENERAL
    ===================================== */


    async logout() {

        await supabaseClient
            .auth
            .signOut();


        if (
            this.adminPanel
        ) {

            this.adminPanel
                .classList
                .remove(
                    "show"
                );
        }


        if (
            this.clientPanel
        ) {

            this.clientPanel
                .classList
                .remove(
                    "show"
                );
        }


        document.body
            .classList
            .remove(
                "modal-open"
            );


        this.leads = [];

        this.adminProjects = [];

        this.clients = [];


        this.resetStats();
    }


    updateStats(leads) {

        if (
            this.totalLeads
        ) {

            this.totalLeads.textContent =
                leads.length;
        }


        if (
            this.newLeads
        ) {

            this.newLeads.textContent =
                leads.filter(
                    (lead) =>
                        lead.status ===
                        "new"
                )
                    .length;
        }


        if (
            this.contactedLeads
        ) {

            this.contactedLeads.textContent =
                leads.filter(
                    (lead) =>
                        lead.status ===
                        "contacted"
                )
                    .length;
        }


        if (
            this.wonLeads
        ) {

            this.wonLeads.textContent =
                leads.filter(
                    (lead) =>
                        lead.status ===
                        "won"
                )
                    .length;
        }
    }


    resetStats() {

        if (
            this.totalLeads
        ) {

            this.totalLeads.textContent =
                "0";
        }


        if (
            this.newLeads
        ) {

            this.newLeads.textContent =
                "0";
        }


        if (
            this.contactedLeads
        ) {

            this.contactedLeads.textContent =
                "0";
        }


        if (
            this.wonLeads
        ) {

            this.wonLeads.textContent =
                "0";
        }


        if (
            this.visibleLeadCount
        ) {

            this.visibleLeadCount.textContent =
                "0 proposals";
        }
    }


    updateVisibleCount(count) {

        if (
            !this.visibleLeadCount
        ) {

            return;
        }


        this.visibleLeadCount.textContent =
            `${count} ${
                count ===
                1
                    ? "proposal"
                    : "proposals"
            }`;
    }


    updateSyncTime() {

        if (
            !this.lastSynced
        ) {

            return;
        }


        this.lastSynced.textContent =
            `Last synced: ${
                new Date()
                    .toLocaleTimeString(
                        [],
                        {
                            hour:
                                "2-digit",

                            minute:
                                "2-digit"
                        }
                    )
            }`;
    }


    showLoading() {

        if (
            !this.leadList
        ) {

            return;
        }


        this.leadList.innerHTML = `
            <div class="empty-leads">

                <div
                    style="
                        font-size:38px;
                        margin-bottom:10px;
                    "
                >
                    ⏳
                </div>

                <h3>
                    Loading proposals...
                </h3>

            </div>
        `;
    }


    showDashboardError(message) {

        if (
            !this.leadList
        ) {

            return;
        }


        this.leadList.innerHTML = `
            <div class="empty-leads">

                <div
                    style="
                        font-size:38px;
                        margin-bottom:10px;
                    "
                >
                    ⚠️
                </div>

                <h3>
                    Dashboard Error
                </h3>

                <p>
                    ${this.escapeHTML(
                        message
                    )}
                </p>

            </div>
        `;
    }


    formatDate(value) {

        const date =
            new Date(
                value
            );


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return "";
        }


        return date
            .toLocaleDateString(
                "en-US",
                {
                    year:
                        "numeric",

                    month:
                        "short",

                    day:
                        "numeric"
                }
            );
    }


    escapeHTML(value) {

        return String(
            value ?? ""
        )
            .replace(
                /[&<>"']/g,
                (character) => {

                    const entities = {

                        "&":
                            "&amp;",

                        "<":
                            "&lt;",

                        ">":
                            "&gt;",

                        '"':
                            "&quot;",

                        "'":
                            "&#039;"
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