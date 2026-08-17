// ============================================
// MY PRODUCTIVITY APP
// Events + Habit Tracker + Statistics + Edit
// ============================================


// ============================================
// DATA
// ============================================

let events = JSON.parse(localStorage.getItem("events")) || [];
let habits = JSON.parse(localStorage.getItem("habits")) || [];

const editEventForm =
    document.getElementById("editEventForm");

const editEventFormElement =
    document.getElementById("editEventFormElement");

const cancelEditEventBtn =
    document.getElementById("cancelEditEventBtn");
// ============================================
// ELEMENTS
// ============================================

// Theme
const themeBtn = document.getElementById("themeBtn");

// Tabs
const tabs = document.querySelectorAll(".tab");
const tabContents = document.querySelectorAll(".tab-content");

// Events
const addEventBtn = document.getElementById("addEventBtn");
const eventForm = document.getElementById("eventForm");
const cancelBtn = document.getElementById("cancelBtn");
const form = document.getElementById("form");
const eventsContainer = document.getElementById("eventsContainer");
const emptyEvents = document.getElementById("emptyEvents");

// Habits
const addHabitBtn = document.getElementById("addHabitBtn");
const habitForm = document.getElementById("habitForm");
const cancelHabitBtn = document.getElementById("cancelHabitBtn");
const habitFormElement = document.getElementById("habitFormElement");
const habitTracker = document.getElementById("habitTracker");
const emptyHabits = document.getElementById("emptyHabits");
const currentMonth = document.getElementById("currentMonth");

// Edit Habit
const editHabitForm = document.getElementById("editHabitForm");
const editHabitFormElement =
    document.getElementById("editHabitFormElement");

const cancelEditHabitBtn =
    document.getElementById("cancelEditHabitBtn");


// ============================================
// DARK MODE
// ============================================

const savedTheme =
    localStorage.getItem("theme");

if (savedTheme === "dark") {

    document.body.classList.add("dark");

    if (themeBtn) {
        themeBtn.textContent = "☀️";
    }

} else {

    if (themeBtn) {
        themeBtn.textContent = "🌙";
    }

}


if (themeBtn) {

    themeBtn.addEventListener("click", () => {

        document.body.classList.toggle("dark");

        const isDark =
            document.body.classList.contains("dark");

        localStorage.setItem(
            "theme",
            isDark ? "dark" : "light"
        );

        themeBtn.textContent =
            isDark ? "☀️" : "🌙";

    });

}


// ============================================
// TABS
// ============================================

tabs.forEach(tab => {

    tab.addEventListener("click", () => {

        const target =
            tab.dataset.tab;

        tabs.forEach(item => {
            item.classList.remove("active");
        });

        tabContents.forEach(content => {
            content.classList.remove("active");
        });

        tab.classList.add("active");

        const targetSection =
            document.getElementById(target);

        if (targetSection) {
            targetSection.classList.add("active");
        }

    });

});


// ============================================
// EVENT FORM
// ============================================

if (addEventBtn) {

    addEventBtn.addEventListener("click", () => {

        eventForm.classList.remove("hidden");

        addEventBtn.style.display = "none";

    });

}


if (cancelBtn) {

    cancelBtn.addEventListener("click", () => {

        eventForm.classList.add("hidden");

        addEventBtn.style.display = "block";

        if (form) {
            form.reset();
        }

    });

}


// ============================================
// SAVE EVENT
// ============================================

if (form) {

    form.addEventListener("submit", event => {

        event.preventDefault();

        const name =
            document.getElementById("eventName")
                .value.trim();

        const date =
            document.getElementById("eventDate")
                .value;

        const time =
            document.getElementById("eventTime")
                .value;

        const reminder =
            document.getElementById("reminder")
                .value;

        const notes =
            document.getElementById("eventNotes")
                .value.trim();


        if (!name || !date || !time) {
            return;
        }


        const newEvent = {

            id: Date.now(),

            name: name,

            date: date,

            time: time,

            reminder: reminder,

            notes: notes

        };


        events.push(newEvent);


        localStorage.setItem(
            "events",
            JSON.stringify(events)
        );


        form.reset();

        eventForm.classList.add("hidden");

        addEventBtn.style.display = "block";


        renderEvents();

    });

}

// ============================================
// RENDER EVENTS
// ============================================

function renderEvents() {

    if (!eventsContainer) {
        return;
    }

    eventsContainer.innerHTML = "";

    if (events.length === 0) {

        if (emptyEvents) {
            eventsContainer.appendChild(emptyEvents);
        }

        return;
    }


    // Sort events
    events.sort((a, b) => {

        const dateA =
            new Date(`${a.date}T${a.time}`);

        const dateB =
            new Date(`${b.date}T${b.time}`);

        return dateA - dateB;

    });


    const now = new Date();


    // Remove old/past events from display
    const upcomingEvents =
        events.filter(event => {

            const eventDate =
                new Date(
                    `${event.date}T${event.time}`
                );

            return eventDate >= now;

        });


    if (upcomingEvents.length === 0) {

        const empty =
            document.createElement("div");

        empty.className = "empty-state";

        empty.innerHTML = `
            <div>📅</div>
            <h3>No upcoming events</h3>
            <p>Add your next event.</p>
        `;

        eventsContainer.appendChild(empty);

        return;
    }


    let currentGroup = "";


    upcomingEvents.forEach(event => {

        const eventDate =
            new Date(
                `${event.date}T${event.time}`
            );


        const group =
            getEventGroup(eventDate);


        // Group heading
        if (group !== currentGroup) {

            const heading =
                document.createElement("div");

            heading.className =
                "event-group-title";

            heading.textContent =
                group;

            eventsContainer.appendChild(
                heading
            );

            currentGroup = group;

        }


        const card =
            document.createElement("div");

        card.className =
            "event-card";


        const formattedDate =
            eventDate.toLocaleDateString(
                undefined,
                {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                }
            );


        const formattedTime =
            eventDate.toLocaleTimeString(
                undefined,
                {
                    hour: "numeric",
                    minute: "2-digit"
                }
            );


        const reminderText =
            getReminderText(
                event.reminder
            );


        const countdown =
            getCountdown(eventDate);


        card.innerHTML = `

            <div class="event-card-top">

                <div>

                    <div class="event-title">
                        ${escapeHTML(event.name)}
                    </div>

                    <div class="event-info">
                        📅 ${formattedDate}
                    </div>

                    <div class="event-info">
                        🕐 ${formattedTime}
                    </div>

                    <div class="event-info">
                        🔔 ${reminderText}
                    </div>

                </div>


                <div class="event-countdown">

                    ${countdown}

                </div>

            </div>


            ${
                event.notes
                    ? `
                        <div class="event-notes">
                            ${escapeHTML(event.notes)}
                        </div>
                    `
                    : ""
            }


            <div class="event-actions">

                <button
                    class="edit-event-btn"
                    onclick="editEvent(${event.id})"
                >
                    ✎ Edit
                </button>


                <button
                    class="delete-btn"
                    onclick="deleteEvent(${event.id})"
                >
                    × Delete
                </button>

            </div>

        `;


        eventsContainer.appendChild(card);

    });

}

// ============================================
// EVENT GROUP
// ============================================

function getEventGroup(eventDate) {

    const today = new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );


    const tomorrow =
        new Date(today);

    tomorrow.setDate(
        tomorrow.getDate() + 1
    );


    const eventDay =
        new Date(eventDate);

    eventDay.setHours(
        0,
        0,
        0,
        0
    );


    if (
        eventDay.getTime() ===
        today.getTime()
    ) {

        return "TODAY";

    }


    if (
        eventDay.getTime() ===
        tomorrow.getTime()
    ) {

        return "TOMORROW";

    }


    return eventDate.toLocaleDateString(
        undefined,
        {
            weekday: "long",
            day: "numeric",
            month: "long"
        }
    );

}


// ============================================
// REMINDER TEXT
// ============================================

function getReminderText(value) {

    switch (Number(value)) {

        case 5:
            return "5 minutes before";

        case 15:
            return "15 minutes before";

        case 30:
            return "30 minutes before";

        case 60:
            return "1 hour before";

        case 1440:
            return "1 day before";

        default:
            return "At event time";

    }

}


// ============================================
// COUNTDOWN
// ============================================

function getCountdown(eventDate) {

    const now =
        new Date();

    const difference =
        eventDate - now;


    if (difference <= 0) {
        return "Starting now";
    }


    const totalMinutes =
        Math.floor(
            difference /
            (1000 * 60)
        );


    const days =
        Math.floor(
            totalMinutes / 1440
        );


    const hours =
        Math.floor(
            (totalMinutes % 1440) / 60
        );


    const minutes =
        totalMinutes % 60;


    if (days > 0) {
        return `In ${days}d ${hours}h`;
    }


    if (hours > 0) {
        return `In ${hours}h ${minutes}m`;
    }


    return `In ${minutes}m`;

}
// ============================================
// DELETE EVENT
// ============================================

function deleteEvent(id) {

    events =
        events.filter(
            event => event.id !== id
        );


    localStorage.setItem(
        "events",
        JSON.stringify(events)
    );


    renderEvents();

}
// ============================================
// EDIT EVENT
// ============================================

function editEvent(id) {

    const event =
        events.find(
            event => event.id === id
        );


    if (!event) {
        return;
    }


    if (
        !editEventForm ||
        !editEventFormElement
    ) {

        alert(
            "Edit Event form is missing."
        );

        return;

    }


    document.getElementById(
        "editEventId"
    ).value = event.id;


    document.getElementById(
        "editEventName"
    ).value = event.name;


    document.getElementById(
        "editEventDate"
    ).value = event.date;


    document.getElementById(
        "editEventTime"
    ).value = event.time;


    document.getElementById(
        "editReminder"
    ).value = event.reminder;


    document.getElementById(
        "editEventNotes"
    ).value = event.notes || "";


    editEventForm.classList.remove(
        "hidden"
    );


    editEventForm.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}


// ============================================
// CANCEL EDIT EVENT
// ============================================

if (cancelEditEventBtn) {

    cancelEditEventBtn.addEventListener(
        "click",
        () => {

            editEventForm.classList.add(
                "hidden"
            );

            editEventFormElement.reset();

        }
    );

}


// ============================================
// SAVE EDITED EVENT
// ============================================

if (editEventFormElement) {

    editEventFormElement.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const id =
                Number(
                    document.getElementById(
                        "editEventId"
                    ).value
                );


            const existingEvent =
                events.find(
                    event => event.id === id
                );


            if (!existingEvent) {
                return;
            }


            existingEvent.name =
                document.getElementById(
                    "editEventName"
                ).value.trim();


            existingEvent.date =
                document.getElementById(
                    "editEventDate"
                ).value;


            existingEvent.time =
                document.getElementById(
                    "editEventTime"
                ).value;


            existingEvent.reminder =
                document.getElementById(
                    "editReminder"
                ).value;


            existingEvent.notes =
                document.getElementById(
                    "editEventNotes"
                ).value.trim();


            localStorage.setItem(
                "events",
                JSON.stringify(events)
            );


            editEventFormElement.reset();

            editEventForm.classList.add(
                "hidden"
            );


            renderEvents();

        }
    );

}

// ============================================
// ADD HABIT
// ============================================

if (addHabitBtn) {

    addHabitBtn.addEventListener("click", () => {

        habitForm.classList.remove("hidden");

        addHabitBtn.style.display = "none";

    });

}


if (cancelHabitBtn) {

    cancelHabitBtn.addEventListener("click", () => {

        habitForm.classList.add("hidden");

        addHabitBtn.style.display = "block";

        habitFormElement.reset();

    });

}


if (habitFormElement) {

    habitFormElement.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const name =
                document
                    .getElementById("habitName")
                    .value
                    .trim();


            const icon =
                document
                    .getElementById("habitIcon")
                    .value
                    .trim()
                || "🔥";


            if (!name) {
                return;
            }


            const habit = {

                id: Date.now(),

                name: name,

                icon: icon,

                completedDates: []

            };


            habits.push(habit);


            localStorage.setItem(
                "habits",
                JSON.stringify(habits)
            );


            habitFormElement.reset();

            habitForm.classList.add("hidden");

            addHabitBtn.style.display = "block";


            renderHabitTracker();

            renderHabitStatistics();

        }
    );

}


// ============================================
// MONTH INFORMATION
// ============================================

function getMonthInfo() {

    const now = new Date();

    const year =
        now.getFullYear();

    const month =
        now.getMonth();

    const days =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    return {
        year,
        month,
        days
    };

}


// ============================================
// DATE KEY
// ============================================

function getDateKey(
    year,
    month,
    day
) {

    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

}


// ============================================
// TODAY
// ============================================

function getToday() {

    const now = new Date();

    return getDateKey(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
    );

}


// ============================================
// RENDER HABIT TRACKER
// ============================================

function renderHabitTracker() {

    if (!habitTracker) {
        return;
    }


    const {
        year,
        month,
        days
    } = getMonthInfo();


    const monthName =
        new Date(
            year,
            month
        ).toLocaleDateString(
            undefined,
            {
                month: "long",
                year: "numeric"
            }
        );


    if (currentMonth) {
        currentMonth.textContent =
            monthName;
    }


    habitTracker.innerHTML = "";


    if (habits.length === 0) {

        habitTracker.style.display =
            "none";

        if (emptyHabits) {
            emptyHabits.style.display =
                "block";
        }

        updateMonthProgress();

        return;

    }


    habitTracker.style.display =
        "block";


    if (emptyHabits) {
        emptyHabits.style.display =
            "none";
    }


    const today =
        getToday();


    // ========================================
    // HEADER
    // ========================================

    const header =
        document.createElement("div");

    header.className =
        "tracker-header";


    const habitHeader =
        document.createElement("div");

    habitHeader.className =
        "habit-label";

    habitHeader.textContent =
        "Habit";


    header.appendChild(habitHeader);


    for (
        let day = 1;
        day <= days;
        day++
    ) {

        const cell =
            document.createElement("div");

        cell.className =
            "day-header";


        const dateKey =
            getDateKey(
                year,
                month,
                day
            );


        if (dateKey === today) {
            cell.classList.add("today");
        }


        cell.textContent =
            day;


        header.appendChild(cell);

    }


    habitTracker.appendChild(header);


    // ========================================
    // HABIT ROWS
    // ========================================

    habits.forEach(habit => {

        if (!habit.completedDates) {
            habit.completedDates = [];
        }


        const row =
            document.createElement("div");

        row.className =
            "tracker-row";


        // Habit label

        const label =
            document.createElement("div");

        label.className =
            "habit-label";


        label.innerHTML = `

            <span class="habit-label-icon">
                ${escapeHTML(habit.icon)}
            </span>

            <span>
                ${escapeHTML(habit.name)}
            </span>

        `;


        row.appendChild(label);


        // Days

        for (
            let day = 1;
            day <= days;
            day++
        ) {

            const cell =
                document.createElement("div");

            cell.className =
                "habit-cell";


            const dateKey =
                getDateKey(
                    year,
                    month,
                    day
                );


            if (dateKey === today) {
                cell.classList.add("today");
            }


            if (
                habit.completedDates
                    .includes(dateKey)
            ) {

                cell.classList.add(
                    "completed"
                );

            }


            const cellDate =
                new Date(
                    year,
                    month,
                    day
                );


            const todayDate =
                new Date();


            todayDate.setHours(
                0,
                0,
                0,
                0
            );


            if (cellDate > todayDate) {
                cell.classList.add(
                    "future"
                );
            }


            cell.title =
                `${habit.name} - ${dateKey}`;


            cell.addEventListener(
                "click",
                () => {

                    toggleHabitDay(
                        habit.id,
                        dateKey
                    );

                }
            );


            row.appendChild(cell);

        }


        habitTracker.appendChild(row);

    });


    updateMonthProgress();

}


// ============================================
// TOGGLE HABIT DAY
// ============================================

function toggleHabitDay(
    habitId,
    dateKey
) {

    const habit =
        habits.find(
            h => h.id === habitId
        );


    if (!habit) {
        return;
    }


    const selectedDate =
        new Date(
            `${dateKey}T00:00:00`
        );


    const today =
        new Date();


    today.setHours(
        0,
        0,
        0,
        0
    );


    if (selectedDate > today) {
        return;
    }


    if (!habit.completedDates) {
        habit.completedDates = [];
    }


    const index =
        habit.completedDates.indexOf(
            dateKey
        );


    if (index === -1) {

        habit.completedDates.push(
            dateKey
        );

    } else {

        habit.completedDates.splice(
            index,
            1
        );

    }


    localStorage.setItem(
        "habits",
        JSON.stringify(habits)
    );


    renderHabitTracker();

    renderHabitStatistics();

}


// ============================================
// DELETE HABIT
// ============================================

function deleteHabit(id) {

    const confirmed =
        confirm(
            "Delete this habit and all its tracking history?"
        );


    if (!confirmed) {
        return;
    }


    habits =
        habits.filter(
            habit => habit.id !== id
        );


    localStorage.setItem(
        "habits",
        JSON.stringify(habits)
    );


    renderHabitTracker();

    renderHabitStatistics();

}


// ============================================
// EDIT HABIT
// ============================================

function editHabit(id) {

    const habit =
        habits.find(
            habit => habit.id === id
        );


    if (!habit) {
        return;
    }


    if (
        !editHabitForm ||
        !editHabitFormElement
    ) {

        alert(
            "Edit Habit form is missing from index.html."
        );

        return;

    }


    document.getElementById(
        "editHabitId"
    ).value = habit.id;


    document.getElementById(
        "editHabitName"
    ).value = habit.name;


    document.getElementById(
        "editHabitIcon"
    ).value = habit.icon;


    editHabitForm.classList.remove(
        "hidden"
    );


    editHabitForm.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}


// ============================================
// CANCEL EDIT HABIT
// ============================================

if (cancelEditHabitBtn) {

    cancelEditHabitBtn.addEventListener(
        "click",
        () => {

            editHabitForm.classList.add(
                "hidden"
            );

            editHabitFormElement.reset();

        }
    );

}


// ============================================
// SAVE EDITED HABIT
// ============================================

if (editHabitFormElement) {

    editHabitFormElement.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const id =
                Number(
                    document.getElementById(
                        "editHabitId"
                    ).value
                );


            const name =
                document.getElementById(
                    "editHabitName"
                ).value.trim();


            const icon =
                document.getElementById(
                    "editHabitIcon"
                ).value.trim()
                || "🔥";


            if (!name) {
                return;
            }


            const habit =
                habits.find(
                    habit => habit.id === id
                );


            if (!habit) {
                return;
            }


            // Preserve completedDates.
            // Only change name and icon.

            habit.name =
                name;

            habit.icon =
                icon;


            localStorage.setItem(
                "habits",
                JSON.stringify(habits)
            );


            editHabitFormElement.reset();

            editHabitForm.classList.add(
                "hidden"
            );


            renderHabitTracker();

            renderHabitStatistics();

        }
    );

}


// ============================================
// MONTH PROGRESS
// ============================================

function updateMonthProgress() {

    const progressText =
        document.getElementById(
            "monthProgress"
        );

    const progressFill =
        document.getElementById(
            "monthProgressFill"
        );


    if (
        !progressText ||
        !progressFill
    ) {
        return;
    }


    const {
        year,
        month
    } = getMonthInfo();


    if (habits.length === 0) {

        progressText.textContent =
            "0%";

        progressFill.style.width =
            "0%";

        return;

    }


    const today =
        new Date();


    today.setHours(
        0,
        0,
        0,
        0
    );


    let completed = 0;

    let possible = 0;


    habits.forEach(habit => {

        if (!habit.completedDates) {
            habit.completedDates = [];
        }


        for (
            let day = 1;
            day <= today.getDate();
            day++
        ) {

            possible++;


            const dateKey =
                getDateKey(
                    year,
                    month,
                    day
                );


            if (
                habit.completedDates
                    .includes(dateKey)
            ) {

                completed++;

            }

        }

    });


    const percentage =
        possible === 0
            ? 0
            : Math.round(
                (completed / possible) * 100
            );


    progressText.textContent =
        `${percentage}%`;


    progressFill.style.width =
        `${percentage}%`;

}


// ============================================
// CURRENT STREAK
// ============================================

function calculateCurrentStreak(habit) {

    if (
        !habit ||
        !habit.completedDates ||
        habit.completedDates.length === 0
    ) {
        return 0;
    }


    const completed =
        new Set(
            habit.completedDates
        );


    let date =
        new Date();


    date.setHours(
        0,
        0,
        0,
        0
    );


    let streak = 0;


    while (true) {

        const dateKey =
            getDateKey(
                date.getFullYear(),
                date.getMonth(),
                date.getDate()
            );


        if (!completed.has(dateKey)) {
            break;
        }


        streak++;


        date.setDate(
            date.getDate() - 1
        );

    }


    return streak;

}


// ============================================
// BEST STREAK
// ============================================

function calculateBestStreak(habit) {

    if (
        !habit ||
        !habit.completedDates ||
        habit.completedDates.length === 0
    ) {
        return 0;
    }


    const dates =
        [...new Set(
            habit.completedDates
        )].sort();


    let best = 1;

    let current = 1;


    for (
        let i = 1;
        i < dates.length;
        i++
    ) {

        const previous =
            new Date(
                `${dates[i - 1]}T00:00:00`
            );


        const currentDate =
            new Date(
                `${dates[i]}T00:00:00`
            );


        const difference =
            (
                currentDate -
                previous
            ) /
            (
                1000 *
                60 *
                60 *
                24
            );


        if (difference === 1) {

            current++;

            best =
                Math.max(
                    best,
                    current
                );

        } else {

            current = 1;

        }

    }


    return best;

}


// ============================================
// HABIT MONTH PERCENTAGE
// ============================================

function calculateHabitMonthPercentage(
    habit
) {

    const {
        year,
        month
    } = getMonthInfo();


    const today =
        new Date();


    today.setHours(
        0,
        0,
        0,
        0
    );


    let possible = 0;

    let completed = 0;


    for (
        let day = 1;
        day <= today.getDate();
        day++
    ) {

        const dateKey =
            getDateKey(
                year,
                month,
                day
            );


        possible++;


        if (
            habit.completedDates &&
            habit.completedDates.includes(
                dateKey
            )
        ) {

            completed++;

        }

    }


    if (possible === 0) {
        return 0;
    }


    return Math.round(
        (
            completed /
            possible
        ) * 100
    );

}


// ============================================
// RENDER HABIT STATISTICS
// ============================================

function renderHabitStatistics() {

    const currentStreakElement =
        document.getElementById(
            "currentStreak"
        );

    const bestStreakElement =
        document.getElementById(
            "bestStreak"
        );

    const totalCompletedElement =
        document.getElementById(
            "totalCompleted"
        );

    const statsContainer =
        document.getElementById(
            "habitStatsContainer"
        );


    if (
        !currentStreakElement ||
        !bestStreakElement ||
        !totalCompletedElement ||
        !statsContainer
    ) {
        return;
    }


    if (habits.length === 0) {

        currentStreakElement.textContent =
            "0 days";

        bestStreakElement.textContent =
            "0 days";

        totalCompletedElement.textContent =
            "0 days";

        statsContainer.innerHTML =
            "";

        return;

    }


    let overallCurrentStreak = 0;

    let overallBestStreak = 0;

    let totalCompleted = 0;


    habits.forEach(habit => {

        const current =
            calculateCurrentStreak(
                habit
            );


        const best =
            calculateBestStreak(
                habit
            );


        overallCurrentStreak =
            Math.max(
                overallCurrentStreak,
                current
            );


        overallBestStreak =
            Math.max(
                overallBestStreak,
                best
            );


        totalCompleted +=
            habit.completedDates
                ? habit.completedDates.length
                : 0;

    });


    currentStreakElement.textContent =
        `${overallCurrentStreak} day${overallCurrentStreak === 1 ? "" : "s"}`;


    bestStreakElement.textContent =
        `${overallBestStreak} day${overallBestStreak === 1 ? "" : "s"}`;


    totalCompletedElement.textContent =
        `${totalCompleted} day${totalCompleted === 1 ? "" : "s"}`;


    // Individual habit stats

    statsContainer.innerHTML =
        "";


    habits.forEach(habit => {

        const current =
            calculateCurrentStreak(
                habit
            );


        const best =
            calculateBestStreak(
                habit
            );


        const percentage =
            calculateHabitMonthPercentage(
                habit
            );


        const card =
            document.createElement("div");


        card.className =
            "habit-stat-card";


        card.innerHTML = `

            <div class="habit-stat-header">

                <div class="habit-stat-title">

                    <span class="habit-stat-icon">
                        ${escapeHTML(habit.icon)}
                    </span>

                    <span class="habit-stat-name">
                        ${escapeHTML(habit.name)}
                    </span>

                </div>


                <div class="habit-stat-actions">

                    <button
                        class="edit-habit-btn"
                        onclick="editHabit(${habit.id})"
                        title="Edit habit"
                    >
                        ✎
                    </button>


                    <button
                        class="delete-habit-btn"
                        onclick="deleteHabit(${habit.id})"
                        title="Delete habit"
                    >
                        ×
                    </button>

                </div>

            </div>


            <div class="habit-stat-details">

                <div class="habit-stat-detail">

                    <small>
                        Current
                    </small>

                    <strong>
                        ${current} days
                    </strong>

                </div>


                <div class="habit-stat-detail">

                    <small>
                        Best
                    </small>

                    <strong>
                        ${best} days
                    </strong>

                </div>


                <div class="habit-stat-detail">

                    <small>
                        This month
                    </small>

                    <strong>
                        ${percentage}%
                    </strong>

                </div>

            </div>

        `;


        statsContainer.appendChild(card);

    });

}


// ============================================
// HTML ESCAPE
// ============================================

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value;

    return div.innerHTML;

}


// ============================================
// CUSTOM CURSOR
// ============================================

if (
    window.matchMedia(
        "(pointer: fine)"
    ).matches
) {

    const cursor =
        document.createElement("div");

    cursor.className =
        "custom-cursor";

    document.body.appendChild(
        cursor
    );


    let mouseX = 0;
    let mouseY = 0;

    let cursorX = 0;
    let cursorY = 0;


    document.addEventListener(
        "mousemove",
        event => {

            mouseX =
                event.clientX;

            mouseY =
                event.clientY;

        }
    );


    function animateCursor() {

        cursorX +=
            (
                mouseX -
                cursorX
            ) * 0.18;


        cursorY +=
            (
                mouseY -
                cursorY
            ) * 0.18;


        cursor.style.left =
            `${cursorX}px`;

        cursor.style.top =
            `${cursorY}px`;


        requestAnimationFrame(
            animateCursor
        );

    }


    animateCursor();


    document.addEventListener(
        "mouseover",
        event => {

            const target =
                event.target.closest(
                    "button, a, input, select, textarea, .habit-cell"
                );


            if (target) {

                cursor.classList.add(
                    "hover"
                );

            }

        }
    );


    document.addEventListener(
        "mouseout",
        event => {

            const target =
                event.target.closest(
                    "button, a, input, select, textarea, .habit-cell"
                );


            if (target) {

                cursor.classList.remove(
                    "hover"
                );

            }

        }
    );


    document.addEventListener(
        "mousedown",
        () => {

            cursor.classList.add(
                "click"
            );

        }
    );


    document.addEventListener(
        "mouseup",
        () => {

            cursor.classList.remove(
                "click"
            );

        }
    );

}
// ============================================
// NOTIFICATIONS
// ============================================

async function requestNotificationPermission() {

    if (!("Notification" in window)) {

        alert(
            "This browser does not support notifications."
        );

        return false;
    }


    if (Notification.permission === "granted") {
        return true;
    }


    if (Notification.permission === "denied") {

        alert(
            "Notifications are blocked. Enable them in your browser settings."
        );

        return false;
    }


    const permission =
        await Notification.requestPermission();


    return permission === "granted";

}

setTimeout(() => {

    if (Notification.permission === "granted") {

        new Notification("My Productivity", {
            body: "Notifications are working! 🔔"
        });

    } else {

        console.log(
            "Notification permission:",
            Notification.permission
        );

    }

}, 3000);
// ============================================
// TEST PWA NOTIFICATION
// ============================================

async function testNotification() {

    console.log(
        "Notification permission:",
        Notification.permission
    );


    if (!("Notification" in window)) {

        console.log(
            "Notification API not supported"
        );

        return;

    }


    if (Notification.permission !== "granted") {

        console.log(
            "Notification permission is not granted"
        );

        return;

    }


    if (!("serviceWorker" in navigator)) {

        console.log(
            "Service Worker not supported"
        );

        return;

    }


    try {

        const registration =
            await navigator.serviceWorker.ready;


        console.log(
            "Service Worker ready:",
            registration
        );


        await registration.showNotification(
            "My Productivity",
            {
                body: "PWA notifications are working! 🔔",
                icon: "./icon-192.png",
                badge: "./icon-192.png",
                tag: "notification-test"
            }
        );


        console.log(
            "Notification sent successfully"
        );


    } catch (error) {

        console.error(
            "Notification failed:",
            error
        );

    }

}


setTimeout(
    testNotification,
    3000
);
// Ask for notification permission
// when the app is first opened.

requestNotificationPermission();
// ============================================
// INITIALIZE APP
// ============================================

renderEvents();

renderHabitTracker();

renderHabitStatistics();