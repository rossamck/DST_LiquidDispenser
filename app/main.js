const elements = {
    wellTableBody: document.getElementById("wellTableBody"),
    selectedWellsContainer: document.getElementById("selectedWellsContainer"),
    selectedWellsElement: document.getElementById("selectedWells"),
    microLitersInput: document.getElementById("microLitersInput"),
    microLitersSelectButton: document.getElementById("microLitersSelectButton"),
    clearButton: document.getElementById("clearButton"),
    sendButton: document.getElementById("sendButton"),
    selectRowButton: document.getElementById("selectRowButton"),
    selectColumnButton: document.getElementById("selectColumnButton"),
    selectedWells: [],
    clearPresetsButton: document.getElementById("clearPresetsButton"),
    sendSelectionButton: document.getElementById('sendButton'),
    startDispensingButton: document.getElementById("startDispensing"),
    savePresetButton: document.getElementById("savePresetButton"),
    wells: [],

  };

  let selectedVolume = "";
  let socket;
  let isDragging = false;

  
  initWebSocket();
  createWellTable();
  initializeEventListeners();
  
  function initWebSocket() {
    // WebSocket initialization logic
    socket = new WebSocket("ws://192.168.0.183:81");
    socket.addEventListener("open", (event) => {
      console.log("WebSocket connection opened:", event);
    });
    socket.addEventListener("close", (event) => {
      console.log("WebSocket connection closed:", event);
      setTimeout(() => {
        initWebSocket();
      }, 1000);
    });

    //Handle replies from esp
    socket.onmessage = function (event) {
      console.log("RECEIVED");
      console.log(event.data)


      if (event.data === "ready") {
        console.log("Ready received");
        elements.startDispensingButton.disabled = false;
        
      }

      if (event.data === "dispensefinished") {
        console.log("Dispensing finished");
        elements.sendSelectionButton.disabled = false;
      }
    };
  }
  
  function createWellTable() {
    for (let row = 1; row <= 8; row++) {
      const rowElement = document.createElement("tr");
      for (let col = 1; col <= 12; col++) {
        const wellId = String.fromCharCode(64 + row) + col;
        const cellElement = document.createElement("td");
        cellElement.className = "well";
        cellElement.classList.add(row % 2 === 0 ? "even-row" : "odd-row");
        cellElement.classList.add(col % 2 === 0 ? "even-col" : "odd-col");
        cellElement.dataset.well = wellId;
        cellElement.innerHTML = `${wellId}<br><span class="volume"></span>`;
        rowElement.appendChild(cellElement);
      }
      elements.wellTableBody.appendChild(rowElement);
    }
    elements.wells = document.querySelectorAll(".well");
  }
  
  function initializeEventListeners() {
    // Add event listeners to the Start Dispensing button
    elements.startDispensingButton.addEventListener("click", function () {
      socket.send("startDispensing");
      elements.startDispensingButton.disabled = true;
    });
  
    // Add event listeners to the document object to detect mouseup outside the well area
    document.addEventListener("mouseup", (event) => {
      isDragging = false;
    });
  
      // Add event listeners to each well
  elements.wells.forEach((well) => {
    // Add event listener to prevent default drag-and-drop behavior
    well.addEventListener("dragstart", (event) => {
      event.preventDefault();
    });

    // Add event listeners for mousedown, mouseenter, and mouseup
    well.addEventListener("mousedown", (event) => {
      // Handle mousedown event
      isDragging = true;
      const volume = well.dataset.volume || microLitersInput.value;
      toggleWell(well);
    });

    well.addEventListener("mouseenter", (event) => {
      // Handle mouseenter event
      if (isDragging) {
        const volume = well.dataset.volume || microLitersInput.value;
        // setVolume(well, volume);
        toggleWell(well);
      }
    });

    well.addEventListener("mouseup", (event) => {
      // Handle mouseup event
      isDragging = false;
    });
  });
  
    // Add event listeners for other buttons
    elements.clearPresetsButton.addEventListener("click", (event) => {
      // Handle clear presets button click
      if (confirm("Are you sure you want to clear all presets?")) {
        clearAllPresets();
      }
    });
  
    elements.clearButton.addEventListener("click", (event) => {
      // Handle clear button click
      clearAll();
    });
  
    elements.sendButton.addEventListener("click", (event) => {
      // Handle send button click
      const data = [];
      elements.sendSelectionButton.disabled = true;
      elements.selectedWells.forEach((wellId) => {
        const well = document.querySelector(`[data-well="${wellId}"]`);
        const volume = well.dataset.volume || "0";
        data.push([wellId, volume]);
      });
      sendMessage("selectWells", JSON.stringify(data));
    });
  
    elements.selectRowButton.addEventListener("click", (event) => {
      // Handle select row button click
      const rowIndex = parseInt(prompt("Enter row number (1-8)")) - 1;
        if (isNaN(rowIndex) || rowIndex < 0 || rowIndex > 7) {
          alert("Invalid row number!");
          return;
        }

        elements.wells.forEach((well) => {
          const wellRowIndex = well.cellIndex - 1;
          if (wellRowIndex === rowIndex) {
            const volume = well.dataset.volume || microLitersInput.value;
            toggleWell(well);
          }
        });

    });
  
    elements.selectColumnButton.addEventListener("click", (event) => {
      // Handle select column button click
      const colIndex = parseInt(prompt("Enter column number (1-12)")) - 1;
        if (isNaN(colIndex) || colIndex < 0 || colIndex > 11) {
          alert("Invalid column number!");
          return;
        }

        elements.wells.forEach((well) => {
          const wellColIndex = well.parentNode.rowIndex - 1;
          if (wellColIndex === colIndex) {
            const volume = well.dataset.volume || microLitersInput.value;
            // setVolume(well, volume);
            toggleWell(well);
          }
        });
    });
  
    elements.microLitersSelectButton.addEventListener("click", (event) => {
      // Handle microLiters select button click
      const volume = microLitersInput.value;
      elements.selectedWells.forEach((wellId) => {
        const well = document.querySelector(`[data-well="${wellId}"]`);
        // console.log(well);
        setVolume(well, volume);
      });
      elements.selectedWellsElement.textContent = getSelectedWellsText(); // update the selected wells text
    });
  
    // Add event listeners for preset buttons
    const presetButtons = document.querySelectorAll(".preset-button");
    presetButtons.forEach((presetButton) => {
      presetButton.addEventListener("click", (event) => {
        // Handle preset button click
        const presetNumber = event.target.dataset.preset;
        loadPreset(presetNumber);
      });
    });
  
    // Add event listener for 'Save Preset' button
    elements.savePresetButton.addEventListener("click", (event) => {
        const presetNumber = prompt("Enter the preset number (1-8) to save:");
        if (isNaN(presetNumber) || presetNumber < 1 || presetNumber > 8) {
          alert("Invalid preset number!");
          return;
        }

        savePreset(presetNumber);
    });


  }
  
  
  function clearAllPresets() {
    // Clear all presets from localStorage
    for (let i = 1; i <= 8; i++) {
        localStorage.removeItem(`preset${i}`);
      }
      alert("All presets have been cleared.");
    }
  
  function clearAll() {
    // Clear all wells and the selectedWells array
    elements.wells.forEach((well) => {
        if (well.classList.contains("selected")) {
          well.classList.remove("selected");
          clearVolume(well);
        }
        if (well.classList.contains("highlighted")) {
          well.classList.remove("highlighted");
          clearVolume(well);
        }
      });
      selectedWells.length = 0;
      elements.selectedWellsElement.textContent = "";
    }
  
  function toggleWell(well) {
    // Toggle the selection status of a well
    const isSelected = well.classList.toggle("highlighted");
    const wellId = well.getAttribute("data-well");

    if (isSelected && !well.hasAttribute("data-volume")) {
      // Find the index where the wellId should be inserted
      const index = elements.selectedWells.findIndex(
        (element) => compareWellIds(wellId, element) < 0
      );

      if (index === -1) {
        // If the wellId is greater than all elements in the array, push it to the end
        elements.selectedWells.push(wellId);
      } else {
        // Otherwise, insert it at the correct index
        elements.selectedWells.splice(index, 0, wellId);
      }
      elements.selectedWellsElement.textContent = getSelectedWellsText();
    } else if (!isSelected) {
      const index = elements.selectedWells.indexOf(wellId);
      if (index !== -1) {
        elements.selectedWells.splice(index, 1);
        elements.selectedWellsElement.textContent = getSelectedWellsText();
      }
    }
  }
  
  function compareWellIds(a, b) {
    // Compare two well IDs
    // Compare the row letters
    const rowComparison = a[0].localeCompare(b[0]);
    if (rowComparison !== 0) {
      return rowComparison;
    }

    // Compare the column numbers
    const colA = parseInt(a.slice(1));
    const colB = parseInt(b.slice(1));
    return colA - colB;
  }
  
  function setVolume(well, volume, force = false) {
    // Set the volume of a well
    if (well.classList.contains("highlighted") || force) {
        well.dataset.volume = volume;
        well.innerHTML = `${well.getAttribute(
          "data-well"
        )}<br><span class="volume-text">(${volume} µL)</span>`;
        if (!force) well.classList.replace("highlighted", "selected");
      }
  }
  
  function clearVolume(well) {
    // Clear the volume of a well
    delete well.dataset.volume;
    well.innerHTML = well.getAttribute("data-well");
  }
  
  function getSelectedWellsText() {
    // Get a text string containing the selected wells and their volumes
    const selectedData = elements.selectedWells.map((wellId) => {
        const well = document.querySelector(`[data-well="${wellId}"]`);
        const volume = well.dataset.volume || "0";
        return `${wellId} (${volume} µL)`;
      });
      return selectedData.join(", ");
    }
  
  function sendMessage(command, value) {
    // Send a message to the WebSocket
        // socket.addEventListener("open", (event) => {
        //   console.log("WebSocket connection opened:", event);
        socket.send(`${command}:${value}`);
        console.log("Send");
        // socket.close();
        elements.startDispensingButton.disabled = true;
        // });
      }
  
  function loadPreset(presetNumber) {
    // Load a preset from localStorage
    const presetKey = `preset${presetNumber}`;
    const wellsData = JSON.parse(localStorage.getItem(presetKey));

    if (!wellsData) {
      alert(`Preset ${presetNumber} is empty.`);
      return;
    }

    clearAll();

    wellsData.forEach(([wellId, volume]) => {
      const well = document.querySelector(`[data-well="${wellId}"]`);
      if (well) {
        well.classList.add("selected");
        setVolume(well, volume, true);
        elements.selectedWells.push(wellId);
      }
    });

    elements.selectedWellsElement.textContent = getSelectedWellsText();
  }
  
  function savePreset(presetNumber) {
    // Save a preset to localStorage
    const presetKey = `preset${presetNumber}`;
    const existingData = localStorage.getItem(presetKey);

    if (
      existingData &&
      !confirm(`Preset ${presetNumber} already has data. Overwrite?`)
    ) {
      return;
    }

    const wellsData = [];

    elements.selectedWells.forEach((wellId) => {
      const well = document.querySelector(`[data-well="${wellId}"]`);
      const volume = well.dataset.volume || "0";
      wellsData.push([wellId, volume]);
    });

    localStorage.setItem(presetKey, JSON.stringify(wellsData));
    alert(`Preset ${presetNumber} saved.`);
  }
  