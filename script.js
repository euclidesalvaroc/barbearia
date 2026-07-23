let appointments = [];

// Horários disponíveis (intervalo de 1h)
const timeSlots = [
    "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"
];

// Carregar dados do LocalStorage
function loadData() {
    const stored = localStorage.getItem("barberAppointments");
    if (stored) {
        try {
            appointments = JSON.parse(stored);
        } catch (e) { appointments = []; }
    } else {
        // Dados de exemplo para demonstração
        const today = new Date().toISOString().split('T')[0];
        const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
        appointments = [
            {
                id: Date.now() + 1,
                name: "Carlos Mendes",
                phone: "988887777",
                service: "Corte + Barba",
                date: today,
                time: "14:00",
                notes: "Chegar 5min antes",
                createdAt: new Date().toISOString()
            },
            {
                id: Date.now() + 2,
                name: "Rafael Souza",
                phone: "977776666",
                service: "Corte tradicional",
                date: tomorrow,
                time: "10:00",
                notes: "Prefiro máquina 2 dos lados",
                createdAt: new Date().toISOString()
            }
        ];
        saveData();
    }
    renderTimeOptions(); // Preencher select horários
    renderAppointments();
    updateStats();
}

function saveData() {
    localStorage.setItem("barberAppointments", JSON.stringify(appointments));
}

// Formatar telefone para exibição: 923456789 -> 923 456 789
function formatPhoneDisplay(phone) {
    const digits = (phone || "").replace(/\D/g, "");
    return digits.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3");
}

// Validar telefone: deve ter exactamente 9 dígitos numéricos
function isValidPhone(phone) {
    return /^\d{9}$/.test(phone);
}

// Gerar horários disponíveis (não ocupados para a data selecionada)
function renderTimeOptions() {
    const timeSelect = document.getElementById("appointmentTime");
    if (!timeSelect) return;
    const selectedDate = document.getElementById("appointmentDate").value;

    timeSelect.innerHTML = '<option value="">Selecione um horário</option>';

    if (!selectedDate) {
        timeSelect.innerHTML = '<option value="">Selecione uma data primeiro</option>';
        return;
    }

    const bookedTimes = appointments
        .filter(app => app.date === selectedDate)
        .map(app => app.time);

    timeSlots.forEach(slot => {
        if (!bookedTimes.includes(slot)) {
            const option = document.createElement("option");
            option.value = slot;
            option.textContent = slot;
            timeSelect.appendChild(option);
        }
    });

    if (timeSelect.children.length === 1) {
        const msgOpt = document.createElement("option");
        msgOpt.disabled = true;
        msgOpt.textContent = "Sem horários disponíveis nesta data";
        timeSelect.appendChild(msgOpt);
    }
}

// Restringir o campo de telefone a apenas dígitos, máximo 9
function setupPhoneField() {
    const phoneInput = document.getElementById("clientPhone");
    const hint = document.getElementById("phoneHint");
    if (!phoneInput) return;

    phoneInput.addEventListener("input", () => {
        // Remove tudo o que não for dígito e corta em 9 caracteres
        const digitsOnly = phoneInput.value.replace(/\D/g, "").slice(0, 9);
        phoneInput.value = digitsOnly;

        if (digitsOnly.length === 0) {
            hint.textContent = "9 dígitos, sem espaços (ex: 923456789)";
            hint.classList.remove("error");
        } else if (digitsOnly.length < 9) {
            hint.textContent = `Faltam ${9 - digitsOnly.length} dígito(s)`;
            hint.classList.add("error");
        } else {
            hint.textContent = "Número válido";
            hint.classList.remove("error");
        }
    });
}

// Adicionar novo agendamento
function addAppointment(event) {
    event.preventDefault();

    const name = document.getElementById("clientName").value.trim();
    const phone = document.getElementById("clientPhone").value.trim();
    const service = document.getElementById("serviceType").value;
    const date = document.getElementById("appointmentDate").value;
    const time = document.getElementById("appointmentTime").value;
    const notes = document.getElementById("notes").value.trim();

    // Validações
    if (!name || !phone || !service || !date || !time) {
        showToast("Preencha todos os campos obrigatórios!", "error");
        return;
    }

    // Validar telefone: exactamente 9 dígitos
    if (!isValidPhone(phone)) {
        showToast("O telefone deve ter exactamente 9 dígitos!", "error");
        document.getElementById("clientPhone").focus();
        return;
    }

    // Validar se horário já está ocupado (double check)
    const isOccupied = appointments.some(app => app.date === date && app.time === time);
    if (isOccupied) {
        showToast("Este horário já está reservado! Escolha outro.", "error");
        renderTimeOptions();
        return;
    }

    // Validar data passada
    const today = new Date().toISOString().split('T')[0];
    if (date < today) {
        showToast("Não é possível agendar em datas passadas!", "error");
        return;
    }

    const newAppointment = {
        id: Date.now(),
        name: name,
        phone: phone,
        service: service,
        date: date,
        time: time,
        notes: notes || "Sem observações",
        createdAt: new Date().toISOString()
    };

    appointments.push(newAppointment);
    appointments.sort((a, b) => {
        if (a.date === b.date) return a.time.localeCompare(b.time);
        return a.date.localeCompare(b.date);
    });
    saveData();

    // Limpar formulário
    document.getElementById("clientName").value = "";
    document.getElementById("clientPhone").value = "";
    document.getElementById("phoneHint").textContent = "9 dígitos, sem espaços (ex: 923456789)";
    document.getElementById("phoneHint").classList.remove("error");
    document.getElementById("notes").value = "";
    document.getElementById("serviceType").value = "Corte tradicional";

    renderTimeOptions();
    renderAppointments();
    updateStats();
    showToast("Agendamento realizado com sucesso!", "success");
}

// Deletar agendamento individual
function deleteAppointment(id) {
    if (confirm("Tem certeza que deseja cancelar este agendamento?")) {
        appointments = appointments.filter(app => app.id !== id);
        saveData();
        renderAppointments();
        updateStats();
        renderTimeOptions();
        showToast("Agendamento removido!", "warning");
    }
}

// Limpar todos os agendamentos
function clearAllAppointments() {
    if (appointments.length === 0) {
        showToast("Nenhum agendamento para remover", "warning");
        return;
    }
    if (confirm("ATENÇÃO: Isso apagará TODOS os agendamentos permanentemente. Continuar?")) {
        appointments = [];
        saveData();
        renderAppointments();
        updateStats();
        renderTimeOptions();
        showToast("Todos os agendamentos foram removidos", "warning");
    }
}

// Renderizar lista de agendamentos com filtros e busca
function renderAppointments() {
    const searchTerm = document.getElementById("searchInput").value.toLowerCase();
    const serviceFilter = document.getElementById("filterService").value;

    let filtered = [...appointments];

    if (searchTerm) {
        filtered = filtered.filter(app =>
            app.name.toLowerCase().includes(searchTerm) ||
            app.phone.includes(searchTerm)
        );
    }

    if (serviceFilter) {
        filtered = filtered.filter(app => app.service === serviceFilter);
    }

    const container = document.getElementById("appointmentsList");
    if (!container) return;

    if (filtered.length === 0) {
        container.innerHTML = '<div class="empty-message"><i class="fa-solid fa-magnifying-glass"></i>Nenhum agendamento encontrado...</div>';
        return;
    }

    const formatDate = (dateStr) => {
        const [year, month, day] = dateStr.split('-');
        return `${day}/${month}/${year}`;
    };

    const todayStr = new Date().toISOString().split('T')[0];

    let html = "";
    filtered.forEach(app => {
        const isToday = app.date === todayStr;
        const dateDisplay = formatDate(app.date);
        const dayBadge = isToday ? ' <i class="fa-solid fa-circle" style="font-size:0.5em;color:#2fa860;"></i> HOJE' : "";

        html += `
            <div class="appointment-item" data-id="${app.id}">
                <div class="appointment-header">
                    <span class="client-name"><i class="fa-solid fa-user"></i> ${escapeHtml(app.name)}</span>
                    <span class="appointment-date"><i class="fa-regular fa-calendar"></i> ${dateDisplay}${dayBadge} &bull; <i class="fa-regular fa-clock"></i> ${app.time}</span>
                </div>
                <div class="appointment-details">
                    <span class="detail-badge"><i class="fa-solid fa-phone"></i> +244 ${formatPhoneDisplay(app.phone)}</span>
                    <span class="detail-badge"><i class="fa-solid fa-scissors"></i> ${escapeHtml(app.service)}</span>
                </div>
                <div class="appointment-notes"><i class="fa-regular fa-note-sticky"></i> ${escapeHtml(app.notes)}</div>
                <div class="appointment-actions">
                    <button class="btn-small btn-danger btn-delete" onclick="deleteAppointment(${app.id})">
                        <i class="fa-solid fa-xmark"></i> Cancelar
                    </button>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

// Atualizar estatísticas (total e agendamentos de hoje)
function updateStats() {
    const total = appointments.length;
    const today = new Date().toISOString().split('T')[0];
    const todayCount = appointments.filter(app => app.date === today).length;

    document.getElementById("totalCount").innerText = total;
    document.getElementById("todayCount").innerText = todayCount;
}

// Função para escapar HTML
function escapeHtml(str) {
    if (!str) return "";
    return str.replace(/[&<>]/g, function (m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// Toast notification
const toastConfig = {
    success: { color: "#2fa860", icon: "fa-solid fa-circle-check" },
    error: { color: "#e5534b", icon: "fa-solid fa-circle-exclamation" },
    warning: { color: "#f5b042", icon: "fa-solid fa-triangle-exclamation" }
};

function showToast(message, type = "success") {
    const existingToast = document.querySelector(".success-toast");
    if (existingToast) existingToast.remove();

    const cfg = toastConfig[type] || toastConfig.success;

    const toast = document.createElement("div");
    toast.className = "success-toast";
    toast.style.backgroundColor = cfg.color;
    toast.innerHTML = `<i class="${cfg.icon}"></i> ${escapeHtml(message)}`;
    document.body.appendChild(toast);

    setTimeout(() => {
        if (toast) toast.remove();
    }, 3000);
}

// Sincronizar quando data mudar no formulário
function onDateChange() {
    renderTimeOptions();
}

// Eventos e inicialização
document.addEventListener("DOMContentLoaded", () => {
    loadData();
    setupPhoneField();

    const form = document.getElementById("appointmentForm");
    form.addEventListener("submit", addAppointment);

    const dateInput = document.getElementById("appointmentDate");
    dateInput.addEventListener("change", onDateChange);

    const todayFormatted = new Date().toISOString().split('T')[0];
    if (dateInput) dateInput.min = todayFormatted;
    if (!dateInput.value) dateInput.value = todayFormatted;

    const searchInput = document.getElementById("searchInput");
    const filterService = document.getElementById("filterService");

    searchInput.addEventListener("input", () => renderAppointments());
    filterService.addEventListener("change", () => renderAppointments());

    const clearBtn = document.getElementById("clearAllBtn");
    clearBtn.addEventListener("click", clearAllAppointments);

    onDateChange();
});
