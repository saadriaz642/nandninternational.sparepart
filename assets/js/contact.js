/* N&N International @ ASH Spare Parts — contact form
   Honest limitation: no directory contact email address was supplied
   and no email service is configured, so this static site cannot send
   a message to an inbox by itself. On a valid submit the form builds a
   mailto: link with the subject and message prefilled and a blank
   recipient — the visitor adds the directory's email address in their
   own mail app and sends it from there. Nothing is sent automatically
   and no submission is faked. A Copy message button is provided as well.
   A backend can replace buildMailto() later without changing the form. */
(function () {
  function init() {
    var form = document.getElementById("contact-form");
    if (!form) return;
    var status = document.getElementById("contact-status");
    var mailtoBox = document.getElementById("mailto-box");
    var mailtoLink = document.getElementById("mailto-link");
    var copyBtn = document.getElementById("copy-message-btn");

    function setError(inputId, message) {
      var el = document.getElementById(inputId + "-error");
      if (el) el.textContent = message || "";
      var input = document.getElementById(inputId);
      if (input) input.setAttribute("aria-invalid", message ? "true" : "false");
    }
    function setStatus(msg, kind) {
      if (!status) return;
      status.textContent = msg;
      status.className = "form-status" + (kind ? " " + kind : "");
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = document.getElementById("contact-name").value.trim();
      var email = document.getElementById("contact-email").value.trim();
      var phone = document.getElementById("contact-phone").value.trim();
      var subject = document.getElementById("contact-subject").value.trim();
      var message = document.getElementById("contact-message").value.trim();
      var valid = true;

      if (!name) { setError("contact-name", "Please enter your name."); valid = false; } else setError("contact-name", "");
      if (!email) { setError("contact-email", "Please enter your email address."); valid = false; }
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("contact-email", "Please enter a valid email address."); valid = false; }
      else setError("contact-email", "");
      if (!subject) { setError("contact-subject", "Please enter a subject."); valid = false; } else setError("contact-subject", "");
      if (!message) { setError("contact-message", "Please write your message."); valid = false; } else setError("contact-message", "");
      if (phone && !/^[+0-9\s\-()]{7,20}$/.test(phone)) { setError("contact-phone", "Please enter a valid phone number, or leave it blank."); valid = false; }
      else setError("contact-phone", "");

      if (!valid) {
        setStatus("Please correct the highlighted fields and try again.", "error");
        if (mailtoBox) mailtoBox.classList.remove("show");
        return;
      }

      var body = "Name: " + name + "\nEmail: " + email + (phone ? "\nPhone: " + phone : "") + "\n\n" + message;
      var mailto = "mailto:?subject=" + encodeURIComponent("[N&N @ ASH Spare Parts] " + subject) +
        "&body=" + encodeURIComponent(body);
      window.NN_lastMailto = mailto;
      if (mailtoLink) {
        mailtoLink.href = mailto;
        mailtoLink.textContent = mailto;
      }
      if (mailtoBox) mailtoBox.classList.add("show");
      setStatus("Your message is ready. Click “Open in Email App” and add the directory's email address as the recipient — nothing has been sent yet.", "success");
    });

    if (copyBtn) copyBtn.addEventListener("click", function () {
      var name = document.getElementById("contact-name").value.trim();
      var email = document.getElementById("contact-email").value.trim();
      var phone = document.getElementById("contact-phone").value.trim();
      var subject = document.getElementById("contact-subject").value.trim();
      var message = document.getElementById("contact-message").value.trim();
      var text = "Subject: " + subject + "\nName: " + name + "\nEmail: " + email + (phone ? "\nPhone: " + phone : "") + "\n\n" + message;
      function done() { setStatus("Message copied to clipboard.", "success"); }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { setStatus("Copy failed — please select and copy the message manually.", "error"); });
      } else {
        setStatus("Copy is not supported in this browser — please select and copy the message manually.", "error");
      }
    });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
