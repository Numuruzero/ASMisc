/* Create slider elements and define their traits */
const toggleLabel = document.createElement("label");
toggleLabel.class = "switch";
const toggleCheck = document.createElement("input");
toggleCheck.type = "checkbox";
const toggleSlider = document.createElement("span");
toggleSlider.class = "slider round";

/* Create slider "before" element */
const sliderBefore = document.createElement("span");

/* Add their CSS styling */
toggleLabel.style.position = "relative";
toggleLabel.style.display = "inline-block";
toggleLabel.style.width = "60px";
toggleLabel.style.height = "34px";

toggleCheck.style.opacity = "0";
toggleCheck.style.width = "0";
toggleCheck.style.height = "0";

toggleSlider.style.position = "absolute";
toggleSlider.style.cursor = "pointer";
toggleSlider.style.top = "0";
toggleSlider.style.left = "0";
toggleSlider.style.right = "0";
toggleSlider.style.bottom = "0";
toggleSlider.style.backgroundColor = "#ccc";
toggleSlider.style.borderRadius = "34px";
toggleSlider.style.transition = ".4s";

sliderBefore.style.position = "absolute";
sliderBefore.style.zIndex = "1";
sliderBefore.style.height = "26px";
sliderBefore.style.width = "26px";
sliderBefore.style.left = "4px";
sliderBefore.style.bottom = "4px";
sliderBefore.style.backgroundColor = "white";
sliderBefore.style.borderRadius = "50%";
sliderBefore.style.transition = ".4s";

/* Put the elements together */
toggleLabel.appendChild(toggleCheck);
toggleLabel.appendChild(toggleSlider);

document.querySelector("#intro").after(toggleLabel);
toggleSlider.before(sliderBefore);

toggleCheck.addEventListener('change', function() {
  if (this.checked) {
    // Checkbox is checked
    toggleSlider.style.backgroundColor = '#2196F3';
    sliderBefore.style.transform = "translateX(26px)";
  } else {
    // Checkbox is unchecked
    toggleSlider.style.backgroundColor = '#ccc'; // Reset to default
    sliderBefore.style.transform = "translateX(0px)";
  }
});
