(function () {
  "use strict";
  const form = document.getElementById("contact-form");
  if (!form) return;
  const statusBox = document.getElementById("form-success");
  const submitButton = document.getElementById("contact-submit");
  const fileInput = document.getElementById("rfq");

  function showStatus(message, isSuccess) {
    statusBox.hidden = false;
    statusBox.textContent = message;
    statusBox.setAttribute("role", isSuccess ? "status" : "alert");
    statusBox.style.whiteSpace = "pre-line";
    statusBox.style.color = isSuccess ? "#176b36" : "#a12622";
  }

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    statusBox.hidden = true;
    if (!form.reportValidity()) return;

    const files = fileInput && fileInput.files ? Array.from(fileInput.files) : [];
    if (files.length > 5) return showStatus("Please attach no more than 5 files.", false);
    if (files.some(file => file.size > 10 * 1024 * 1024)) return showStatus("Each attachment must be 10 MB or smaller.", false);
    if (files.reduce((sum, file) => sum + file.size, 0) > 20 * 1024 * 1024) return showStatus("The combined attachment size must be 20 MB or smaller.", false);

    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = "Sending…";
    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { "Accept": "application/json" }
      });
      let result;
      try { result = await response.json(); }
      catch (_) { result = { success: false, message: "The server returned an unexpected response. Please try again later." }; }
      if (!response.ok || !result.success) throw new Error(result.message || "Your enquiry could not be sent. Please try again later.");
      showStatus(result.message || "Thank you. Your enquiry has been sent.", true);
      form.reset();
    } catch (error) {
      showStatus(error.message || "A connection error occurred. Please try again later.", false);
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }
  });
})();
