document.addEventListener("DOMContentLoaded", function () {
  const scheduleChartContainer = document.getElementById("scheduleChartContainer");

  document.getElementById("monthly-stats").addEventListener("click", function () {
    scheduleChartContainer.style.display = scheduleChartContainer.style.display === "block" ? "none" : "block";
  });

  const ctx = document.getElementById("scheduleChart").getContext("2d");
  const scheduleChartConfig = {
    type: "bar",
    data: {
      labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      datasets: [
        {
          label: "Number of Events",
          data: [5, 7, 3, 9, 12, 8, 6],
          backgroundColor: "rgba(128, 0, 128, 0.8)",
          borderColor: "rgba(128, 0, 128, 1)",
          borderWidth: 1,
        },
        {
          label: "Hosted by Staff",
          data: [2, 3, 1, 4, 5, 3, 2],
          backgroundColor: "rgba(0, 128, 128, 0.8)",
          borderColor: "rgba(0, 128, 128, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  };

  new Chart(ctx, scheduleChartConfig);

  const eventSchedulerSection = document.getElementById("event-scheduler");
  const currentlyScheduledSection = document.getElementById("currently-scheduled");

  const eventSchedulerExpandButton = eventSchedulerSection.querySelector(".expand-button");
  const currentlyScheduledExpandButton = currentlyScheduledSection.querySelector(".expand-button");

  eventSchedulerExpandButton.addEventListener("click", function () {
    eventSchedulerSection.classList.toggle("expanded");
    const dropContent = eventSchedulerSection.querySelector(".drop-content");
    dropContent.style.display = eventSchedulerSection.classList.contains("expanded") ? "block" : "none";
  });

  currentlyScheduledExpandButton.addEventListener("click", function () {
    currentlyScheduledSection.classList.toggle("expanded");
    const dropContent = currentlyScheduledSection.querySelector(".drop-content");
    dropContent.style.display = currentlyScheduledSection.classList.contains("expanded") ? "block" : "none";
  });

  const currentlyScheduledContainer = document.getElementById("currently-scheduled");

  document.getElementById("currently-scheduled").addEventListener("click", function () {
    currentlyScheduledContainer.classList.toggle("expanded");
  });

  const clockInSection = document.getElementById("clock-in");
  const dropContent = clockInSection.querySelector(".drop-content");

  clockInSection.addEventListener("click", function (event) {
    if (isClickInsideClockInSection(event.target) && !dropContent.contains(event.target)) {
      clockInSection.classList.toggle("expanded");
      dropContent.style.display = clockInSection.classList.contains("expanded") ? "block" : "none";
    }
  });

  const clockInForm = document.getElementById("clock-in-form");
  clockInForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const eventName = document.getElementById("event-name-clock").value;
    const staffMember = document.getElementById("staff-member-clock").value;

    if (eventName && staffMember) {
      startTimer();
    }
  });

  let clockedInTime = 0;
  let timerInterval;

  function startTimer() {
    clockedInTime = 0;
    updateTimerDisplay();
    timerInterval = setInterval(function () {
      clockedInTime++;
      updateTimerDisplay();
    }, 1000);

    const clockInTimer = document.getElementById("clock-timer");
    clockInTimer.style.display = "block";
  }

  function updateTimerDisplay() {
    const timerDisplay = document.getElementById("clock-timer-display");
    const hours = Math.floor(clockedInTime / 3600);
    const minutes = Math.floor((clockedInTime % 3600) / 60);
    const seconds = clockedInTime % 60;

    const formattedTime = `${hours}:${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    timerDisplay.textContent = formattedTime;
  }

  function isClickInsideClockInSection(target) {
    return clockInSection.contains(target);
  }

  document.addEventListener("click", function (event) {
    if (!isClickInsideClockInSection(event.target) && !dropContent.contains(event.target)) {
      clockInSection.classList.remove("expanded");
      dropContent.style.display = "none";
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // Sample events data (replace with your own event data)
  const events = [
    {
      title: "Event 1",
      start: "2023-07-21T10:00:00",
      end: "2023-07-21T12:00:00",
      host: "Habbo - Bot",
      description: "Test",
    },
    {
      title: "Habbo Falling Furni",
      start: "2023-07-23T14:30:00",
      end: "2023-07-23T16:00:00",
      host: "Femq",
      description: "Test",
    },
    // Add more events as needed
  ];
  $("#calendar").fullCalendar({
    header: {
      left: "prev,next today",
      center: "title",
      right: "month,agendaWeek,agendaDay",
    },
    defaultView: "month",
    navLinks: true,
    editable: false,
    eventLimit: true,
    events: events,
    eventRender: function (event, element) {
      element.find(".fc-title").append("<br/><b>Host:</b> " + event.host);
      element.find(".fc-title").append("<br/><b>Description:</b> " + event.description);
    },
  });

  const calendarSection = document.getElementById("currently-scheduled");
  const calendar = document.getElementById("calendar");
  let isCalendarExpanded = false;

  function toggleCalendarVisibility() {
    if (isCalendarExpanded) {
      calendar.style.display = "none";
      isCalendarExpanded = false;
    } else {
      calendar.style.display = "block";
      isCalendarExpanded = true;
    }
  }

  document.getElementById("currently-scheduled").addEventListener("click", function (event) {
    if (event.target.classList.contains("expand-button")) {
      toggleCalendarVisibility();
    }
  });
});
