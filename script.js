// Section 1: Monthly Stats
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

// Section 2: Calendar and Currently Scheduled Events
document.addEventListener("DOMContentLoaded", function () {
  const events = [
    {
      title: "Falling Furni",
      start: "2023-07-21T17:00:00",
      end: "2023-07-21T19:00:00",
      host: "Laurennn",
      description: "Win 15c",
      roomId: "78742311"
    },
    {
      title: "Habbo Falling Furni",
      start: "2023-07-21T17:30:00",
      end: "2023-07-21T19:00:00",
      host: "Femq",
      description: "Win 5c",
      roomId: "78657513"
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

  calendarSection.addEventListener("click", function (event) {
    if (event.target.classList.contains("expand-button")) {
      toggleCalendarVisibility();
    }
  });
});

// Section 3: Upcoming Events
document.addEventListener("DOMContentLoaded", function () {
  const upcomingEventsSection = document.getElementById("upcoming-events");
  const upcomingEventsList = upcomingEventsSection.querySelector("#upcoming-events-list");

  function handleThumbnailError(image) {
    image.style.display = "none"; // Hide the thumbnail image
  }

  function fetchRoomData(roomId) {
    const apiUrl = `https://www.habbo.com/api/public/rooms/${roomId}`;

    return fetch(apiUrl)
      .then(response => response.json())
      .catch(error => {
	    console.error("Error fetching room data:", error);
		return null;
      });
  }

  function getUpcomingEvents() {
    const calendar = $("#calendar").fullCalendar("getCalendar");
    const currentDate = calendar.getDate();
    const events = calendar.clientEvents((event) => isSameDay(event.start, currentDate)); // Get events for the current day

    upcomingEventsList.innerHTML = ""; // Clear previous events

    if (events.length === 0) {
      const noEventsMsg = document.createElement("p");
      noEventsMsg.textContent = "No upcoming events";
      upcomingEventsList.appendChild(noEventsMsg);
    } else {
      events.forEach(event => {
        const eventListItem = document.createElement("li");
        const eventInfoContainer = document.createElement("div"); // Container for event information
        const eventInfo = document.createElement("div");
        const eventLink = document.createElement("a");
        const eventImagesContainer = document.createElement("div"); // Container for images
        const avatarImage = document.createElement("img");
        const roomThumbnail = document.createElement("img");
        const roomId = event.roomId; // Get the Room ID from the event data

        // Function to display the countdown for the upcoming events
        function updateEventCountdown() {
          const currentTime = new Date().getTime();
          const eventTime = new Date(event.start).getTime();
          const countdown = eventTime - currentTime;

          if (countdown <= 0) {
            eventStart.textContent = "Event Started";
          } else {
            const days = Math.floor(countdown / (1000 * 60 * 60 * 24));
            const hours = Math.floor((countdown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((countdown % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((countdown % (1000 * 60)) / 1000);

            eventStart.textContent = `Start Time: ${days}d ${hours}h ${minutes}m ${seconds}s`;
          }
        }

        // Fetch and set the room name and thumbnailUrl
        fetchRoomData(event.roomId).then(data => {
          if (data) {
            const roomOwner = document.createElement("p");
            roomOwner.textContent = `Room Owner: ${event.host}`;
            const roomNameElement = document.createElement("p");
            roomNameElement.textContent = `Room Name: ${data.name}`;
            const eventDescription = document.createElement("p");
            eventDescription.textContent = `Event Description: ${event.description}`;

            eventInfo.appendChild(roomOwner);
            eventInfo.appendChild(roomNameElement);
            eventInfo.appendChild(eventDescription);

            if (data.thumbnailUrl) {
              roomThumbnail.src = data.thumbnailUrl;
              roomThumbnail.classList.add("room-thumbnail");
              roomThumbnail.style.padding = "10px"; // Add padding to the room thumbnail
              roomThumbnail.style.border = "1px solid black"; // Add a black border to the room thumbnail
            }
          }
        });

        // Fetch and set the character image
        fetchCharacterImage(event.host).then(imageUrl => {
          avatarImage.src = imageUrl;
          avatarImage.classList.add("avatar-default-size"); // Add the avatar-default-size class
        });

        // Create the link to the room
        eventLink.href = `https://www.habbo.com/room/${roomId}`;
        eventLink.textContent = "Go To Room";

        const eventStart = document.createElement("p");
        eventStart.textContent = `Start Time: ${formatEventStartTime(event.start)}`;

        eventInfoContainer.classList.add("event-info");
        eventListItem.appendChild(eventInfoContainer);
        eventInfoContainer.appendChild(eventInfo);

        eventImagesContainer.classList.add("event-images");
        eventImagesContainer.style.display = "flex"; // Add flex display to position images side by side
        eventImagesContainer.appendChild(roomThumbnail); // Place the room thumbnail on the top right corner
        eventImagesContainer.appendChild(eventLink); // Place the link "Go To Room" to the left of the room thumbnail
        eventImagesContainer.appendChild(avatarImage); // Place the avatar image to the left of the link

        eventInfoContainer.appendChild(eventStart);
        eventInfoContainer.appendChild(eventImagesContainer); // Add the eventImagesContainer to the eventInfoContainer

        upcomingEventsList.appendChild(eventListItem);
      });
    }
  }

  // Function to format the event start time as "HH:mm"
  function formatEventStartTime(startTime) {
    const date = new Date(startTime);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  // Helper function to check if two dates are the same day
  function isSameDay(date1, date2) {
    return date1.toISOString().slice(0, 10) === date2.toISOString().slice(0, 10);
  }

  // Function to fetch character image using the provided API
  function fetchCharacterImage(username) {
    const apiUrl = `https://www.habbo.com/habbo-imaging/avatarimage?user=${username}&direction=3&head_direction=3&action=wav&gesture=nrm&size=m&action=wav,sit`;

    return fetch(apiUrl)
      .then(response => response.url)
      .catch(error => {
        console.error("Error fetching character image:", error);
        return ""; // Return empty URL in case of error
      });
  }

  upcomingEventsSection.addEventListener("click", function (event) {
    if (event.target.classList.contains("expand-button")) {
      upcomingEventsSection.classList.toggle("expanded");
      const dropContent = upcomingEventsSection.querySelector(".drop-content");
      dropContent.style.display = upcomingEventsSection.classList.contains("expanded") ? "block" : "none";

      if (upcomingEventsSection.classList.contains("expanded")) {
        getUpcomingEvents(); // Fetch and display upcoming events when the section is expanded
      }
    }
  });
});

// Section 4: Event Scheduler
document.addEventListener("DOMContentLoaded", function () {

  const eventSchedulerForm = document.getElementById("event-scheduler-form");
  eventSchedulerForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const eventName = document.getElementById("event-name").value;
    const eventHost = document.getElementById("host-name").value;
    const eventDate = document.getElementById("date").value;
    const eventTime = document.getElementById("time").value;
    const roomId = document.getElementById("room-id").value; // Get the Room ID value

    if (eventName && eventHost && eventDate && eventTime && roomId) {
      const eventData = {
        title: eventName,
        start: eventDate + "T" + eventTime,
        host: eventHost,
        roomId: roomId, 
      };

      $("#calendar").fullCalendar("renderEvent", eventData, true); 
      $("#event-scheduler").removeClass("expanded"); 
    }
  });
});
