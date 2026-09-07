const SUPABASE_URL = "https://mcwlrxjnxmtqtsoaaysg.supabase.co";
const SUPABASE_KEY = "sb_publishable_BEKzDtCnxnS6rk76XJ7xPw_mbCSe5Zq";
const ADMIN_EMAIL = "alisankenan9@gmail.com";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

class KenaTech {
    constructor() {
        this.leads = [];
        this.clients = [];
        this.adminProjects = [];
        this.init();
    }

    async init() {
        this.cacheElements();
        this.bindEvents();
        this.resetStats();
        await this.checkAuthSession();
    }

    cacheElements() {
        this.leadForm = document.getElementById("leadForm");
        this.formStatus = document.getElementById("formStatus");
        this.leadSubmitButton = document.getElementById("leadSubmitButton");

        this.openAdmin = document.getElementById("openAdmin");
        this.adminLoginModal = document.getElementById("adminLoginModal");
        this.closeLogin = document.getElementById("closeLogin");
        this.loginForm = document.getElementById("loginForm");
        this.loginStatus = document.getElementById("loginStatus");
        this.adminLoginButton = document.getElementById("adminLoginButton");
        this.adminPanel = document.getElementById("adminPanel");
        this.logoutAdmin = document.getElementById("logoutAdmin");
        this.adminIdentity = document.getElementById("adminIdentity");

        this.leadList = document.getElementById("leadList");
        this.clearLeads = document.getElementById("clearLeads");
        this.refreshLeads = document.getElementById("refreshLeads");
        this.leadSearch = document.getElementById("leadSearch");
        this.statusFilter = document.getElementById("statusFilter");
        this.projectFilter = document.getElementById("projectFilter");
        this.visibleLeadCount = document.getElementById("visibleLeadCount");
        this.lastSynced = document.getElementById("lastSynced");
        this.totalLeads = document.getElementById("totalLeads");
        this.newLeads = document.getElementById("newLeads");
        this.contactedLeads = document.getElementById("contactedLeads");
        this.wonLeads = document.getElementById("wonLeads");

        this.openClientPortal = document.getElementById("openClientPortal");
        this.clientAuthModal = document.getElementById("clientAuthModal");
        this.closeClientAuth = document.getElementById("closeClientAuth");
        this.showClientLogin = document.getElementById("showClientLogin");
        this.showClientRegister = document.getElementById("showClientRegister");
        this.clientLoginForm = document.getElementById("clientLoginForm");
        this.clientRegisterForm = document.getElementById("clientRegisterForm");
        this.clientAuthStatus = document.getElementById("clientAuthStatus");
        this.clientLoginButton = document.getElementById("clientLoginButton");
        this.clientRegisterButton = document.getElementById("clientRegisterButton");

        this.clientPanel = document.getElementById("clientPanel");
        this.clientIdentity = document.getElementById("clientIdentity");
        this.clientWelcomeTitle = document.getElementById("clientWelcomeTitle");
        this.clientProjectList = document.getElementById("clientProjectList");
        this.logoutClient = document.getElementById("logoutClient");

        this.adminProjectForm = document.getElementById("adminProjectForm");
        this.adminProjectClient = document.getElementById("adminProjectClient");
        this.adminProjectStatus = document.getElementById("adminProjectStatus");
        this.adminProjectList = document.getElementById("adminProjectList");
        this.refreshAdminProjects = document.getElementById("refreshAdminProjects");
        this.createProjectButton = document.getElementById("createProjectButton");
    }

    bindEvents() {
        this.leadForm?.addEventListener(
            "submit",
            (e) => this.submitLead(e)
        );

        this.openAdmin?.addEventListener(
            "click",
            () => this.handleAdminOpen()
        );

        this.closeLogin?.addEventListener(
            "click",
            () => this.closeAdminLogin()
        );

        this.loginForm?.addEventListener(
            "submit",
            (e) => this.adminLogin(e)
        );

        this.logoutAdmin?.addEventListener(
            "click",
            () => this.logout()
        );

        this.clearLeads?.addEventListener(
            "click",
            () => this.clearAllLeads()
        );

        this.refreshLeads?.addEventListener(
            "click",
            () => this.loadLeads()
        );

        this.leadSearch?.addEventListener(
            "input",
            () => this.applyFilters()
        );

        this.statusFilter?.addEventListener(
            "change",
            () => this.applyFilters()
        );

        this.projectFilter?.addEventListener(
            "change",
            () => this.applyFilters()
        );

        this.openClientPortal?.addEventListener(
            "click",
            () => this.handleClientPortalOpen()
        );

        this.closeClientAuth?.addEventListener(
            "click",
            () => this.closeClientAuthModal()
        );

        this.showClientLogin?.addEventListener(
            "click",
            () => this.switchClientAuth("login")
        );

        this.showClientRegister?.addEventListener(
            "click",
            () => this.switchClientAuth("register")
        );

        this.clientLoginForm?.addEventListener(
            "submit",
            (e) => this.clientLogin(e)
        );

        this.clientRegisterForm?.addEventListener(
            "submit",
            (e) => this.clientRegister(e)
        );

        this.logoutClient?.addEventListener(
            "click",
            () => this.logout()
        );

        this.adminProjectForm?.addEventListener(
            "submit",
            (e) => this.createAdminProject(e)
        );

        this.refreshAdminProjects?.addEventListener(
            "click",
            () => this.loadAdminProjectArea()
        );

        [
            this.adminLoginModal,
            this.clientAuthModal
        ].forEach((modal) => {
            modal?.addEventListener(
                "click",
                (event) => {
                    if (event.target === modal) {
                        modal === this.adminLoginModal
                            ? this.closeAdminLogin()
                            : this.closeClientAuthModal();
                    }
                }
            );
        });

        document.addEventListener(
            "keydown",
            (event) => {
                if (event.key !== "Escape") {
                    return;
                }

                if (
                    this.adminLoginModal
                        ?.classList
                        .contains("show")
                ) {
                    this.closeAdminLogin();
                }

                if (
                    this.clientAuthModal
                        ?.classList
                        .contains("show")
                ) {
                    this.closeClientAuthModal();
                }
            }
        );
    }

    async checkAuthSession() {
        const {
            data,
            error
        } = await supabaseClient.auth.getSession();

        if (
            error ||
            !data.session
        ) {
            return;
        }

        const user = data.session.user;

        if (this.isAdmin(user)) {
            this.setAdminIdentity(user);
        } else {
            this.setClientIdentity(user);
        }
    }

    isAdmin(user) {
        return Boolean(
            user?.email &&
            user.email.toLowerCase() ===
                ADMIN_EMAIL.toLowerCase()
        );
    }

    setButtonLoading(
        button,
        loading,
        loadingText,
        normalText
    ) {
        if (!button) {
            return;
        }

        button.disabled = loading;
        button.textContent =
            loading
                ? loadingText
                : normalText;
    }

    setStatus(
        element,
        message,
        type = "normal"
    ) {
        if (!element) {
            return;
        }

        element.textContent = message;

        element.style.color =
            type === "success"
                ? "#10b981"
                : type === "error"
                    ? "#ef4444"
                    : "#94a3b8";
    }

    /* ==============================
       PUBLIC PROPOSAL
    ============================== */

    async submitLead(event) {
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
                .trim()
                .toLowerCase();

        const projectType =
            document
                .getElementById("projectType")
                .value;

        const details =
            document
                .getElementById("projectDetails")
                .value
                .trim();

        if (
            !name ||
            !email ||
            !projectType ||
            !details
        ) {
            this.setStatus(
                this.formStatus,
                "Please complete all fields.",
                "error"
            );

            return;
        }

        this.setButtonLoading(
            this.leadSubmitButton,
            true,
            "Sending...",
            "Submit Proposal Request →"
        );

        this.setStatus(
            this.formStatus,
            "Sending proposal..."
        );

        const {
            error
        } = await supabaseClient
            .from("leads")
            .insert([
                {
                    name,
                    email,
                    project_type: projectType,
                    details,
                    status: "new"
                }
            ]);

        this.setButtonLoading(
            this.leadSubmitButton,
            false,
            "Sending...",
            "Submit Proposal Request →"
        );

        if (error) {
            console.error(
                "Lead insert error:",
                error
            );

            this.setStatus(
                this.formStatus,
                "Something went wrong. Please try again.",
                "error"
            );

            return;
        }

        this.leadForm.reset();

        this.setStatus(
            this.formStatus,
            "✓ Proposal received. KenaTech will contact you soon.",
            "success"
        );

        window.setTimeout(
            () => this.setStatus(
                this.formStatus,
                ""
            ),
            5000
        );
    }

    /* ==============================
       ADMIN AUTH
    ============================== */

    async handleAdminOpen() {
        const {
            data
        } = await supabaseClient.auth.getSession();

        if (
            data.session &&
            this.isAdmin(data.session.user)
        ) {
            await this.openDashboard();
            return;
        }

        if (data.session) {
            await supabaseClient.auth.signOut();
        }

        this.openAdminLogin();
    }

    openAdminLogin() {
        this.adminLoginModal
            ?.classList
            .add("show");

        document.body
            .classList
            .add("modal-open");

        window.setTimeout(
            () =>
                document
                    .getElementById("adminUsername")
                    ?.focus(),
            50
        );
    }

    closeAdminLogin() {
        this.adminLoginModal
            ?.classList
            .remove("show");

        document.body
            .classList
            .remove("modal-open");

        this.loginForm?.reset();

        this.setStatus(
            this.loginStatus,
            ""
        );
    }

    async adminLogin(event) {
        event.preventDefault();

        const email =
            document
                .getElementById("adminUsername")
                .value
                .trim()
                .toLowerCase();

        const password =
            document
                .getElementById("adminPassword")
                .value;

        this.setButtonLoading(
            this.adminLoginButton,
            true,
            "Signing in...",
            "Enter Dashboard"
        );

        this.setStatus(
            this.loginStatus,
            "Signing in..."
        );

        const {
            data,
            error
        } = await supabaseClient
            .auth
            .signInWithPassword({
                email,
                password
            });

        this.setButtonLoading(
            this.adminLoginButton,
            false,
            "Signing in...",
            "Enter Dashboard"
        );

        if (error) {
            this.setStatus(
                this.loginStatus,
                this.authErrorMessage(error),
                "error"
            );

            return;
        }

        if (!this.isAdmin(data.user)) {
            await supabaseClient.auth.signOut();

            this.setStatus(
                this.loginStatus,
                "This account is not an administrator.",
                "error"
            );

            return;
        }

        this.setAdminIdentity(data.user);

        this.closeAdminLogin();

        await this.openDashboard();
    }

    setAdminIdentity(user) {
        if (this.adminIdentity) {
            this.adminIdentity.textContent =
                user?.email ||
                "KenaTech Admin";
        }
    }

    async openDashboard() {
        const {
            data
        } = await supabaseClient.auth.getSession();

        if (
            !data.session ||
            !this.isAdmin(data.session.user)
        ) {
            this.openAdminLogin();
            return;
        }

        this.setAdminIdentity(
            data.session.user
        );

        this.adminPanel
            ?.classList
            .add("show");

        this.clientPanel
            ?.classList
            .remove("show");

        document.body
            .classList
            .add("modal-open");

        await Promise.all([
            this.loadLeads(),
            this.loadAdminProjectArea()
        ]);
    }

    /* ==============================
       CLIENT AUTH
    ============================== */

    async handleClientPortalOpen() {
        const {
            data
        } = await supabaseClient.auth.getSession();

        if (
            data.session &&
            !this.isAdmin(data.session.user)
        ) {
            await this.openClientPanel();
            return;
        }

        if (
            data.session &&
            this.isAdmin(data.session.user)
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
            ?.classList
            .add("show");

        document.body
            .classList
            .add("modal-open");

        this.switchClientAuth("login");

        window.setTimeout(
            () =>
                document
                    .getElementById("clientLoginEmail")
                    ?.focus(),
            50
        );
    }

    closeClientAuthModal() {
        this.clientAuthModal
            ?.classList
            .remove("show");

        document.body
            .classList
            .remove("modal-open");

        this.setStatus(
            this.clientAuthStatus,
            ""
        );
    }

    switchClientAuth(mode) {
        const loginMode =
            mode === "login";

        this.clientLoginForm
            ?.classList
            .toggle(
                "hidden",
                !loginMode
            );

        this.clientRegisterForm
            ?.classList
            .toggle(
                "hidden",
                loginMode
            );

        this.showClientLogin
            ?.classList
            .toggle(
                "active",
                loginMode
            );

        this.showClientRegister
            ?.classList
            .toggle(
                "active",
                !loginMode
            );

        this.setStatus(
            this.clientAuthStatus,
            ""
        );
    }

    async clientRegister(event) {
        event.preventDefault();

        const fullName =
            document
                .getElementById("clientRegisterName")
                .value
                .trim();

        const email =
            document
                .getElementById("clientRegisterEmail")
                .value
                .trim()
                .toLowerCase();

        const password =
            document
                .getElementById("clientRegisterPassword")
                .value;

        if (password.length < 8) {
            this.setStatus(
                this.clientAuthStatus,
                "Password must be at least 8 characters.",
                "error"
            );

            return;
        }

        this.setButtonLoading(
            this.clientRegisterButton,
            true,
            "Creating account...",
            "Create Client Account"
        );

        this.setStatus(
            this.clientAuthStatus,
            "Creating account..."
        );

        const {
            data,
            error
        } = await supabaseClient
            .auth
            .signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName
                    }
                }
            });

        this.setButtonLoading(
            this.clientRegisterButton,
            false,
            "Creating account...",
            "Create Client Account"
        );

        if (error) {
            console.error(
                "Client registration error:",
                error
            );

            const message =
                this.authErrorMessage(error);

            this.setStatus(
                this.clientAuthStatus,
                message,
                "error"
            );

            return;
        }

        this.clientRegisterForm.reset();

        if (data.session) {
            this.closeClientAuthModal();

            await this.openClientPanel();

            return;
        }

        this.setStatus(
            this.clientAuthStatus,
            "✓ Account created. Confirm the email sent by KenaTech, then use Login.",
            "success"
        );
    }

    async clientLogin(event) {
        event.preventDefault();

        const email =
            document
                .getElementById("clientLoginEmail")
                .value
                .trim()
                .toLowerCase();

        const password =
            document
                .getElementById("clientLoginPassword")
                .value;

        this.setButtonLoading(
            this.clientLoginButton,
            true,
            "Signing in...",
            "Login to Portal"
        );

        this.setStatus(
            this.clientAuthStatus,
            "Signing in..."
        );

        const {
            data,
            error
        } = await supabaseClient
            .auth
            .signInWithPassword({
                email,
                password
            });

        this.setButtonLoading(
            this.clientLoginButton,
            false,
            "Signing in...",
            "Login to Portal"
        );

        if (error) {
            this.setStatus(
                this.clientAuthStatus,
                this.authErrorMessage(error),
                "error"
            );

            return;
        }

        if (this.isAdmin(data.user)) {
            await supabaseClient.auth.signOut();

            this.setStatus(
                this.clientAuthStatus,
                "Admin account cannot use Client Portal.",
                "error"
            );

            return;
        }

        this.clientLoginForm.reset();

        this.closeClientAuthModal();

        await this.openClientPanel();
    }

    authErrorMessage(error) {
        const raw =
            String(
                error?.message ||
                ""
            ).toLowerCase();

        if (
            raw.includes(
                "email not confirmed"
            )
        ) {
            return "Please confirm your email before signing in.";
        }

        if (
            raw.includes(
                "rate limit"
            )
        ) {
            return "Email limit reached. Wait a little and try again, or use an existing account.";
        }

        if (
            raw.includes(
                "already registered"
            ) ||
            raw.includes(
                "already been registered"
            )
        ) {
            return "This email is already registered. Use Login instead.";
        }

        if (
            raw.includes(
                "invalid login credentials"
            )
        ) {
            return "Incorrect email or password.";
        }

        if (
            raw.includes(
                "password"
            )
        ) {
            return error.message;
        }

        return (
            error?.message ||
            "Authentication failed. Please try again."
        );
    }

    async openClientPanel() {
        const {
            data
        } = await supabaseClient.auth.getSession();

        if (!data.session) {
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
            ?.classList
            .add("show");

        this.adminPanel
            ?.classList
            .remove("show");

        document.body
            .classList
            .add("modal-open");

        await Promise.all([
            this.loadClientProfile(),
            this.loadClientProjects()
        ]);
    }

    setClientIdentity(user) {
        if (this.clientIdentity) {
            this.clientIdentity.textContent =
                user?.email ||
                "Client";
        }
    }

    async loadClientProfile() {
        const {
            data: sessionData
        } = await supabaseClient.auth.getSession();

        if (!sessionData.session) {
            return;
        }

        const user =
            sessionData.session.user;

        const {
            data,
            error
        } = await supabaseClient
            .from("profiles")
            .select("full_name,email")
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
        }

        const name =
            data?.full_name ||
            user.user_metadata?.full_name ||
            user.email;

        if (this.clientWelcomeTitle) {
            this.clientWelcomeTitle.textContent =
                `Welcome, ${name}`;
        }
    }

    async loadClientProjects() {
        if (!this.clientProjectList) {
            return;
        }

        this.clientProjectList.innerHTML =
            this.loadingCard(
                "Loading projects..."
            );

        const {
            data,
            error
        } = await supabaseClient
            .from("projects")
            .select("*")
            .order(
                "created_at",
                {
                    ascending: false
                }
            );

        if (error) {
            console.error(
                "Client projects error:",
                error
            );

            this.clientProjectList.innerHTML =
                this.emptyCard(
                    "Unable to load projects.",
                    "⚠️"
                );

            return;
        }

        if (!data?.length) {
            this.clientProjectList.innerHTML =
                this.emptyCard(
                    "No projects yet",
                    "📁",
                    "Your KenaTech projects will appear here after they are created by the team."
                );

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

    createClientProjectCard(project) {
        const status =
            project.status ||
            "planning";

        const progress =
            this.clampProgress(
                project.progress
            );

        return `
            <article class="client-project-card">

                <div class="project-card-header">

                    <div>

                        <span class="status status-${this.escapeHTML(status)}">
                            ${this.escapeHTML(status)}
                        </span>

                        <h2>
                            ${this.escapeHTML(
                                project.title ||
                                "Project"
                            )}
                        </h2>

                        <p>
                            ${this.escapeHTML(
                                project.project_type ||
                                ""
                            )}
                        </p>

                    </div>

                    <span class="lead-date">
                        Updated
                        ${this.formatDate(
                            project.updated_at ||
                            project.created_at
                        )}
                    </span>

                </div>

                <p class="project-description">
                    ${this.escapeHTML(
                        project.description ||
                        ""
                    )}
                </p>

                <div class="client-project-meta">

                    <span>
                        Project #${Number(project.id) || ""}
                    </span>

                    <span>
                        ${this.escapeHTML(
                            project.project_type ||
                            "Project"
                        )}
                    </span>

                </div>

                <div class="progress-head">

                    <strong>
                        Development Progress
                    </strong>

                    <strong>
                        ${progress}%
                    </strong>

                </div>

                <div class="progress-track">

                    <div
                        class="progress-bar"
                        style="width:${progress}%"
                    ></div>

                </div>

            </article>
        `;
    }

    /* ==============================
       LEADS
    ============================== */

    async loadLeads() {
        if (!this.leadList) {
            return;
        }

        this.leadList.innerHTML =
            this.loadingCard(
                "Loading proposals..."
            );

        const {
            data,
            error
        } = await supabaseClient
            .from("leads")
            .select("*")
            .order(
                "created_at",
                {
                    ascending: false
                }
            );

        if (error) {
            console.error(
                "Leads error:",
                error
            );

            this.leadList.innerHTML =
                this.emptyCard(
                    "Unable to load proposals.",
                    "⚠️"
                );

            return;
        }

        this.leads =
            data ||
            [];

        this.updateStats();

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
                ?.value
                .trim()
                .toLowerCase() ||
            "";

        const status =
            this.statusFilter
                ?.value ||
            "all";

        const project =
            this.projectFilter
                ?.value ||
            "all";

        if (search) {
            filtered =
                filtered.filter(
                    (lead) =>
                        [
                            lead.name,
                            lead.email,
                            lead.project_type,
                            lead.details
                        ]
                            .join(" ")
                            .toLowerCase()
                            .includes(search)
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

        if (this.visibleLeadCount) {
            this.visibleLeadCount.textContent =
                `${filtered.length} proposal${
                    filtered.length === 1
                        ? ""
                        : "s"
                }`;
        }
    }

    renderLeads(leads) {
        if (!this.leadList) {
            return;
        }

        if (!leads.length) {
            this.leadList.innerHTML =
                this.emptyCard(
                    "No proposals found",
                    "📭",
                    "No leads match the current filters."
                );

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
                lead.email ||
                ""
            );

        const mailto =
            encodeURIComponent(
                lead.email ||
                ""
            );

        return `
            <article
                class="lead-card"
                data-id="${Number(lead.id)}"
            >

                <div class="lead-card-top">

                    <span
                        class="status status-${this.escapeHTML(status)}"
                    >
                        ${this.escapeHTML(status)}
                    </span>

                    <span class="lead-date">
                        ${this.formatDate(
                            lead.created_at
                        )}
                    </span>

                </div>

                <h3>
                    ${this.escapeHTML(
                        lead.name ||
                        "Unknown"
                    )}
                </h3>

                <div class="lead-email">
                    ${email}
                </div>

                <span class="lead-type">
                    ${this.escapeHTML(
                        lead.project_type ||
                        "Other"
                    )}
                </span>

                <div class="lead-details">
                    ${this.escapeHTML(
                        lead.details ||
                        ""
                    )}
                </div>

                <div class="lead-actions">

                    <button
                        class="status-btn"
                        data-action="status"
                        data-id="${Number(lead.id)}"
                        type="button"
                    >
                        ${this.getNextStatusLabel(
                            status
                        )}
                    </button>

                    <button
                        class="status-btn"
                        data-action="analyze"
                        data-id="${Number(lead.id)}"
                        type="button"
                    >
                        ✨ Smart Analyze
                    </button>

                    <a
                        class="email-btn"
                        href="mailto:${mailto}"
                    >
                        Email Client
                    </a>

                    <button
                        class="delete-btn"
                        data-action="delete"
                        data-id="${Number(lead.id)}"
                        type="button"
                    >
                        Delete
                    </button>

                </div>

                <div
                    id="analysis-${Number(lead.id)}"
                ></div>

            </article>
        `;
    }

    getNextStatusLabel(status) {
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
        this.leadList
            ?.querySelectorAll(
                "button[data-action]"
            )
            .forEach(
                (button) => {
                    button.addEventListener(
                        "click",
                        async () => {
                            const id =
                                Number(
                                    button.dataset.id
                                );

                            if (
                                button.dataset.action ===
                                "delete"
                            ) {
                                await this.deleteLead(
                                    id
                                );
                            }

                            if (
                                button.dataset.action ===
                                "status"
                            ) {
                                await this.nextStatus(
                                    id
                                );
                            }

                            if (
                                button.dataset.action ===
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

    /* ==============================
       SMART ANALYZE
    ============================== */

    analyzeLead(id) {
        const lead =
            this.leads.find(
                (item) =>
                    item.id === id
            );

        const container =
            document.getElementById(
                `analysis-${id}`
            );

        if (
            !lead ||
            !container
        ) {
            return;
        }

        if (
            container
                .innerHTML
                .trim()
        ) {
            container.innerHTML =
                "";

            return;
        }

        const analysis =
            this.generateSmartAnalysis(
                lead
            );

        container.innerHTML = `
            <div class="analysis-box">

                <div class="analysis-title">
                    ✨ KENATECH SMART ANALYSIS
                </div>

                <div class="analysis-grid">

                    <div>
                        <strong>
                            Project:
                        </strong>

                        <span>
                            ${this.escapeHTML(
                                analysis.project
                            )}
                        </span>
                    </div>

                    <div>
                        <strong>
                            Complexity:
                        </strong>

                        <span>
                            ${this.escapeHTML(
                                analysis.complexity
                            )}
                        </span>
                    </div>

                    <div>
                        <strong>
                            Priority:
                        </strong>

                        <span>
                            ${this.escapeHTML(
                                analysis.priority
                            )}
                        </span>
                    </div>

                    <div>
                        <strong>
                            Estimated Scope:
                        </strong>

                        <span>
                            ${this.escapeHTML(
                                analysis.scope
                            )}
                        </span>
                    </div>

                    <div>

                        <strong>
                            Suggested Technologies:
                        </strong>

                        <div>
                            ${this.escapeHTML(
                                analysis.technologies
                            )}
                        </div>

                    </div>

                    <div>

                        <strong>
                            Recommended Action:
                        </strong>

                        <div>
                            ${this.escapeHTML(
                                analysis.action
                            )}
                        </div>

                    </div>

                    <div>

                        <strong>
                            Questions for Client:
                        </strong>

                        <div>
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
            [
                "HTML",
                "CSS",
                "JavaScript",
                "Supabase"
            ];

        let action =
            "Contact the client and clarify the full project requirements before preparing the proposal.";

        let questions =
            "Ask about deadline, budget, required pages/features and preferred design style.";

        if (
            lead.project_type ===
            "Website"
        ) {
            technologies =
                [
                    "HTML",
                    "CSS",
                    "JavaScript",
                    "Supabase",
                    "Vercel"
                ];

            scope =
                "Business website / landing experience";

            questions =
                "Ask how many pages are needed, whether they already have a design, and whether they need a CMS or admin panel.";

        } else if (
            lead.project_type ===
            "Web Application"
        ) {
            complexity =
                "Medium–High";

            technologies =
                [
                    "JavaScript",
                    "Supabase Auth",
                    "PostgreSQL",
                    "APIs",
                    "Vercel"
                ];

            scope =
                "Interactive web application with backend functionality";

            questions =
                "Ask which user roles are required, what data should be stored and what the main application workflow is.";

        } else if (
            lead.project_type ===
            "SaaS"
        ) {
            complexity =
                "High";

            technologies =
                [
                    "JavaScript",
                    "Supabase",
                    "PostgreSQL",
                    "Auth",
                    "Edge Functions",
                    "SaaS architecture"
                ];

            scope =
                "Multi-user SaaS product";

            action =
                "Schedule a requirements discussion and define the MVP before development begins.";

            questions =
                "Ask who the target users are, what the core MVP feature is, whether subscriptions are required and which user roles are needed.";

        } else if (
            lead.project_type ===
            "Mobile App"
        ) {
            complexity =
                "High";

            technologies =
                [
                    "React Native or Flutter",
                    "Supabase",
                    "Authentication",
                    "APIs"
                ];

            scope =
                "Mobile application with backend services";

            questions =
                "Ask whether the app is for Android, iOS or both, what the main screens are and whether push notifications are required.";
        }

        if (
            (
                text.includes("shop") ||
                text.includes("store") ||
                text.includes("ecommerce") ||
                text.includes("e-commerce")
            ) ||
            (
                text.includes("product") &&
                text.includes("payment")
            )
        ) {
            complexity =
                "High";

            technologies.push(
                "Product Database",
                "Checkout Integration",
                "Admin Dashboard"
            );

            scope =
                "E-commerce platform";

            questions =
                "Ask how many products they expect, which payment provider they want and whether inventory management is required.";
        }

        if (
            [
                "login",
                "register",
                "account",
                "user"
            ].some(
                (word) =>
                    text.includes(word)
            )
        ) {
            complexity =
                this.raiseComplexity(
                    complexity
                );

            technologies.push(
                "Supabase Auth"
            );
        }

        if (
            [
                "database",
                "dashboard",
                "admin"
            ].some(
                (word) =>
                    text.includes(word)
            )
        ) {
            complexity =
                this.raiseComplexity(
                    complexity
                );

            technologies.push(
                "PostgreSQL"
            );
        }

        if (
            [
                "api",
                "integration",
                "connect"
            ].some(
                (word) =>
                    text.includes(word)
            )
        ) {
            complexity =
                this.raiseComplexity(
                    complexity
                );

            technologies.push(
                "API Integration"
            );
        }

        if (
            [
                "ai",
                "artificial intelligence",
                "chatbot"
            ].some(
                (word) =>
                    text.includes(word)
            )
        ) {
            complexity =
                "High";

            technologies.push(
                "AI API / Automation"
            );

            scope +=
                " with AI functionality";
        }

        if (
            [
                "payment",
                "subscription"
            ].some(
                (word) =>
                    text.includes(word)
            )
        ) {
            complexity =
                "High";

            technologies.push(
                "Payment Integration"
            );

            questions +=
                " Confirm the payment provider and whether recurring subscriptions are required.";
        }

        if (
            [
                "urgent",
                "asap",
                "quick",
                "fast"
            ].some(
                (word) =>
                    text.includes(word)
            )
        ) {
            priority =
                "High";
        }

        const wordCount =
            String(
                lead.details ||
                ""
            )
                .trim()
                .split(/\s+/)
                .filter(Boolean)
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

            complexity,

            priority,

            scope,

            technologies:
                [
                    ...new Set(
                        technologies
                    )
                ].join(", "),

            action,

            questions
        };
    }

    raiseComplexity(current) {
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

    /* ==============================
       LEAD STATUS
    ============================== */

    async nextStatus(id) {
        const lead =
            this.leads.find(
                (item) =>
                    item.id === id
            );

        if (!lead) {
            return;
        }

        const newStatus =
            lead.status === "new"
                ? "contacted"
                : lead.status === "contacted"
                    ? "won"
                    : "new";

        const {
            error
        } = await supabaseClient
            .from("leads")
            .update({
                status: newStatus
            })
            .eq(
                "id",
                id
            );

        if (error) {
            console.error(
                "Lead status error:",
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
        if (
            !confirm(
                "Delete this proposal?"
            )
        ) {
            return;
        }

        const {
            error
        } = await supabaseClient
            .from("leads")
            .delete()
            .eq(
                "id",
                id
            );

        if (error) {
            console.error(
                "Delete lead error:",
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
        if (!this.leads.length) {
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
        } = await supabaseClient
            .from("leads")
            .delete()
            .gt(
                "id",
                0
            );

        if (error) {
            console.error(
                "Clear leads error:",
                error
            );

            alert(
                "Could not delete proposals."
            );

            return;
        }

        await this.loadLeads();
    }

    updateStats() {
        if (this.totalLeads) {
            this.totalLeads.textContent =
                this.leads.length;
        }

        if (this.newLeads) {
            this.newLeads.textContent =
                this.leads.filter(
                    (lead) =>
                        lead.status ===
                        "new"
                ).length;
        }

        if (this.contactedLeads) {
            this.contactedLeads.textContent =
                this.leads.filter(
                    (lead) =>
                        lead.status ===
                        "contacted"
                ).length;
        }

        if (this.wonLeads) {
            this.wonLeads.textContent =
                this.leads.filter(
                    (lead) =>
                        lead.status ===
                        "won"
                ).length;
        }
    }

    resetStats() {
        [
            this.totalLeads,
            this.newLeads,
            this.contactedLeads,
            this.wonLeads
        ].forEach(
            (element) => {
                if (element) {
                    element.textContent =
                        "0";
                }
            }
        );
    }

    updateSyncTime() {
        if (!this.lastSynced) {
            return;
        }

        this.lastSynced.textContent =
            `Last synced: ${
                new Date()
                    .toLocaleTimeString(
                        [],
                        {
                            hour: "2-digit",
                            minute: "2-digit"
                        }
                    )
            }`;
    }

    /* ==============================
       PROJECT MANAGEMENT
    ============================== */

    async loadAdminProjectArea() {
        await this.loadClients();
        await this.loadAdminProjects();
    }

    async loadClients() {
        const {
            data,
            error
        } = await supabaseClient
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
                    ascending: false
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
            data ||
            [];

        if (!this.adminProjectClient) {
            return;
        }

        this.adminProjectClient.innerHTML =
            '<option value="">Select Client</option>';

        this.clients.forEach(
            (client) => {
                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    client.id;

                option.textContent =
                    `${client.full_name || "Client"} — ${client.email}`;

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
                .getElementById("adminProjectTitle")
                .value
                .trim();

        const projectType =
            document
                .getElementById("adminProjectType")
                .value;

        const description =
            document
                .getElementById("adminProjectDescription")
                .value
                .trim();

        if (
            !clientId ||
            !title ||
            !projectType ||
            !description
        ) {
            this.setStatus(
                this.adminProjectStatus,
                "Complete all project fields.",
                "error"
            );

            return;
        }

        this.setButtonLoading(
            this.createProjectButton,
            true,
            "Creating...",
            "Create Project"
        );

        this.setStatus(
            this.adminProjectStatus,
            "Creating project..."
        );

        const {
            error
        } = await supabaseClient
            .from("projects")
            .insert([
                {
                    client_id: clientId,
                    title,
                    project_type: projectType,
                    description,
                    status: "planning",
                    progress: 0
                }
            ]);

        this.setButtonLoading(
            this.createProjectButton,
            false,
            "Creating...",
            "Create Project"
        );

        if (error) {
            console.error(
                "Create project error:",
                error
            );

            this.setStatus(
                this.adminProjectStatus,
                "Project could not be created.",
                "error"
            );

            return;
        }

        this.adminProjectForm.reset();

        this.setStatus(
            this.adminProjectStatus,
            "✓ Project created.",
            "success"
        );

        await this.loadAdminProjects();
    }

    async loadAdminProjects() {
        if (!this.adminProjectList) {
            return;
        }

        this.adminProjectList.innerHTML =
            this.loadingCard(
                "Loading client projects..."
            );

        const {
            data,
            error
        } = await supabaseClient
            .from("projects")
            .select("*")
            .order(
                "created_at",
                {
                    ascending: false
                }
            );

        if (error) {
            console.error(
                "Admin projects error:",
                error
            );

            this.adminProjectList.innerHTML =
                this.emptyCard(
                    "Could not load projects.",
                    "⚠️"
                );

            return;
        }

        this.adminProjects =
            data ||
            [];

        if (
            !this.adminProjects.length
        ) {
            this.adminProjectList.innerHTML =
                this.emptyCard(
                    "No client projects yet.",
                    "📁"
                );

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

    createAdminProjectCard(project) {
        const client =
            this.clients.find(
                (item) =>
                    item.id ===
                    project.client_id
            );

        const status =
            project.status ||
            "planning";

        const progress =
            this.clampProgress(
                project.progress
            );

        return `
            <article
                class="admin-project-card"
                data-project-id="${Number(project.id)}"
            >

                <div class="project-card-header">

                    <div>

                        <span
                            class="status status-${this.escapeHTML(status)}"
                        >
                            ${this.escapeHTML(status)}
                        </span>

                        <h3>
                            ${this.escapeHTML(
                                project.title ||
                                "Project"
                            )}
                        </h3>

                        <p>
                            ${this.escapeHTML(
                                client?.email ||
                                "Unknown client"
                            )}
                        </p>

                    </div>

                    <span class="lead-date">
                        #${Number(project.id)}
                    </span>

                </div>

                <p class="project-description">
                    ${this.escapeHTML(
                        project.description ||
                        ""
                    )}
                </p>

                <div class="progress-head">

                    <span>
                        Progress
                    </span>

                    <strong>
                        ${progress}%
                    </strong>

                </div>

                <div class="progress-track">

                    <div
                        class="progress-bar"
                        style="width:${progress}%"
                    ></div>

                </div>

                <div class="admin-project-controls">

                    <select
                        class="admin-project-status-select"
                        data-project-id="${Number(project.id)}"
                    >
                        ${this.projectStatusOptions(status)}
                    </select>

                    <input
                        class="admin-project-progress-input"
                        data-project-id="${Number(project.id)}"
                        type="number"
                        min="0"
                        max="100"
                        value="${progress}"
                    >

                </div>

                <div class="admin-project-actions">

                    <button
                        class="status-btn"
                        data-project-action="save"
                        data-project-id="${Number(project.id)}"
                        type="button"
                    >
                        Save Changes
                    </button>

                    <button
                        class="delete-btn"
                        data-project-action="delete"
                        data-project-id="${Number(project.id)}"
                        type="button"
                    >
                        Delete Project
                    </button>

                </div>

            </article>
        `;
    }

    projectStatusOptions(current) {
        return [
            [
                "planning",
                "Planning"
            ],
            [
                "development",
                "Development"
            ],
            [
                "review",
                "Review"
            ],
            [
                "completed",
                "Completed"
            ]
        ]
            .map(
                ([value, label]) =>
                    `
                        <option
                            value="${value}"
                            ${
                                current === value
                                    ? "selected"
                                    : ""
                            }
                        >
                            ${label}
                        </option>
                    `
            )
            .join("");
    }

    attachAdminProjectButtons() {
        this.adminProjectList
            ?.querySelectorAll(
                "button[data-project-action]"
            )
            .forEach(
                (button) => {
                    button.addEventListener(
                        "click",
                        async () => {
                            const id =
                                Number(
                                    button.dataset.projectId
                                );

                            if (
                                button.dataset.projectAction ===
                                "save"
                            ) {
                                await this.saveAdminProject(
                                    id
                                );
                            }

                            if (
                                button.dataset.projectAction ===
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

        const status =
            statusSelect.value;

        const progress =
            this.clampProgress(
                progressInput.value
            );

        progressInput.value =
            progress;

        const {
            error
        } = await supabaseClient
            .from("projects")
            .update({
                status,
                progress,
                updated_at:
                    new Date()
                        .toISOString()
            })
            .eq(
                "id",
                id
            );

        if (error) {
            console.error(
                "Project update error:",
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
        } = await supabaseClient
            .from("projects")
            .delete()
            .eq(
                "id",
                id
            );

        if (error) {
            console.error(
                "Project delete error:",
                error
            );

            alert(
                "Project could not be deleted."
            );

            return;
        }

        await this.loadAdminProjects();
    }

    /* ==============================
       COMMON
    ============================== */

    async logout() {
        await supabaseClient.auth.signOut();

        this.adminPanel
            ?.classList
            .remove("show");

        this.clientPanel
            ?.classList
            .remove("show");

        this.adminLoginModal
            ?.classList
            .remove("show");

        this.clientAuthModal
            ?.classList
            .remove("show");

        document.body
            .classList
            .remove("modal-open");

        this.resetStats();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    clampProgress(value) {
        const number =
            Number(value);

        if (
            !Number.isFinite(
                number
            )
        ) {
            return 0;
        }

        return Math.min(
            100,
            Math.max(
                0,
                Math.round(number)
            )
        );
    }

    loadingCard(message) {
        return `
            <div class="empty-leads">

                <div
                    style="
                        font-size:32px;
                        margin-bottom:8px;
                    "
                >
                    ⏳
                </div>

                <p>
                    ${this.escapeHTML(message)}
                </p>

            </div>
        `;
    }

    emptyCard(
        title,
        icon = "📭",
        description = ""
    ) {
        return `
            <div class="empty-leads">

                <div
                    style="
                        font-size:40px;
                        margin-bottom:10px;
                    "
                >
                    ${icon}
                </div>

                <h3>
                    ${this.escapeHTML(title)}
                </h3>

                ${
                    description
                        ? `
                            <p>
                                ${this.escapeHTML(description)}
                            </p>
                        `
                        : ""
                }

            </div>
        `;
    }

    formatDate(value) {
        if (!value) {
            return "—";
        }

        const date =
            new Date(value);

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return "—";
        }

        return date.toLocaleDateString(
            "en-US",
            {
                month: "short",
                day: "numeric",
                year: "numeric"
            }
        );
    }

    escapeHTML(value) {
        return String(
            value ??
            ""
        ).replace(
            /[&<>'"]/g,
            (char) =>
                ({
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    "'": "&#039;",
                    '"': "&quot;"
                })[char]
        );
    }
}

document.addEventListener(
    "DOMContentLoaded",
    () => {
        window.kenaTech =
            new KenaTech();
    }
);