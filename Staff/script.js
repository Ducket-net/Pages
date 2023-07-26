document.addEventListener("DOMContentLoaded", async function () {
  const staffList = document.getElementById("staff-list");
  let lastModifiedTimestamp = 0;
 
  function fetchCharacterImage(username, action = "") {
    const actions = ["", "&action=crr=2", "&action=crr=2", "&action=crr=3", "&action=crr=5", "&action=crr=6", "&action=crr=667", "&action=crr=9", "&action=crr=44", "&action=crr=42"];
    const randomAction = action === "" ? actions[Math.floor(Math.random() * actions.length)] : `&action=${action}`;
    const apiAction = action || "wav";
    const apiUrl = `https://www.habbo.com/habbo-imaging/avatarimage?user=${username}&direction=3&head_direction=3&gesture=sml&size=m${randomAction}`;

    return fetch(apiUrl)
      .then(response => {
        if (response.ok) {
          return response.url;
        } else {
          console.error("Error fetching character image:", response.status, response.statusText);
          return null;
        }
      })
      .catch(error => {
        console.error("Error fetching character image:", error);
        return null;
      });
  }

  async function displayStaffList(data) {
    for (const role of data.roles) {
      const roleName = role.role;
      const roleMembers = role.members;

      // Filter out members that are placeholders
      const filteredMembers = roleMembers.filter(member => !member.name.match(/\d+$/));
      if (filteredMembers.length === 0) {
        continue; 
      }

      const rankHeading = document.createElement("h2");
      rankHeading.textContent = roleName;
      staffList.appendChild(rankHeading);

      const rankList = document.createElement("ul");
      rankList.className = "button-container"; 

      for (let i = 0; i < filteredMembers.length; i++) {
        const member = filteredMembers[i];
        const avatarUrl = await fetchCharacterImage(member.name);

        const listItem = document.createElement("li");

        switch (roleName) {
          case "Owner":
            listItem.className = "owner-button";
            break;
          case "General Manager":
            listItem.className = "general-manager-button";
            break;
          case "Events Manager":
            listItem.className = "events-manager-button";
            break;
          case "Social Manager":
            listItem.className = "social-manager-button";
            break;
          case "Community Events Manager":
            listItem.className = "community-events-manager-button";
            break;
          case "Podcaster":
            listItem.className = "podcaster-button";
            break;
          case "Developer":
            listItem.className = "developer-button";
            break;
          case "Moderator":
            listItem.className = "moderator-button";
            break;
          case "Head Designer":
            listItem.className = "head-designer-button";
            break;
          case "Graphics Designer":
            listItem.className = "graphics-designer-button";
            break;
          case "Server Developer":
            listItem.className = "server-developer-button";
            break;
          case "Wired Master":
            listItem.className = "wired-master-button";
            break;
          case "Values":
            listItem.className = "values-button";
            break;
          case "Builder":
            listItem.className = "builder-button";
            break;
          case "Room Builder":
            listItem.className = "room-builder-button";
            break;
          case "Events Assistant":
            listItem.className = "events-assistant-button";
            break;
          case "Events Host":
            listItem.className = "events-host-button";
            break;
          case "News Manager":
            listItem.className = "news-manager-button";
            break;
          case "Staff":
            listItem.className = "staff-button";
            break;
          default:
            listItem.className = "staff-button"; // Fallback to the default staff-button class
            break;
        }

        // Create the avatar image element
        const avatarImage = document.createElement("img");
        avatarImage.classList.add("avatar-image");
        avatarImage.src = avatarUrl;
        listItem.appendChild(avatarImage);

        // Create the member name element and add it to the list item
        const memberName = document.createElement("span");
        memberName.textContent = member.name;
        listItem.appendChild(memberName);

        // Create the description element and add it to the list item
        const description = document.createElement("p");
        description.classList.add("member-description");
        description.textContent = member.description;
        listItem.appendChild(description);

        // Add the Twitter logo and link if Twitter URL is provided
        if (member.twitter) {
          const twitterContainer = document.createElement("div");
          twitterContainer.classList.add("twitter-container");
          listItem.appendChild(twitterContainer);

          const twitterLink = document.createElement("a");
          twitterLink.href = member.twitter;
          twitterLink.target = "_blank";
          twitterContainer.appendChild(twitterLink);

          const twitterLogo = document.createElement("img");
          twitterLogo.src = "http://localhost:8000/images/twitter2.png"; // Replace with the actual path to your Twitter logo image
          twitterLogo.alt = "Twitter";
          twitterLink.appendChild(twitterLogo);

          // Add the event listener to show/hide Twitter container on click
          listItem.addEventListener("click", () => {
		    console.log("Click event fired for:", member.name);	  
            twitterContainer.classList.toggle("show-twitter");
          });
        }

        
        listItem.addEventListener("mouseenter", async () => {
         
          const hoverAvatarUrl = await fetchCharacterImage(member.name, "wav");
          avatarImage.src = hoverAvatarUrl;
        });

        
        listItem.addEventListener("mouseleave", () => {
          avatarImage.src = avatarUrl;
        });

        rankList.appendChild(listItem);
      }

      staffList.appendChild(rankList);
    }
  }

  async function fetchStaffData() {
    try {
      const response = await fetch("http://localhost:8000/Staff.json");
      if (!response.ok) {
        throw new Error("Failed to fetch staff data.");
      }

      
      const currentTimestamp = Date.parse(response.headers.get("last-modified"));
      if (currentTimestamp > lastModifiedTimestamp) {
        lastModifiedTimestamp = currentTimestamp;

        const data = await response.json();
        staffList.textContent = ""; // Clear the staff list before updating
        displayStaffList(data);
      }
    } catch (error) {
      console.error("Error fetching staff data:", error);
      staffList.textContent = "Failed to load staff data.";
    }
  }

  
  try {
    const response = await fetch("http://localhost:8000/Staff.json");
    const data = await response.json();
    displayStaffList(data);
  } catch (error) {
    console.error("Error fetching staff data:", error);
    staffList.textContent = "Failed to load staff data.";
  }

  // Check for updates every 10 seconds
  setInterval(fetchStaffData, 10000);
});
