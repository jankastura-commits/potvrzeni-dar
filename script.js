function $(id){ return document.getElementById(id); }

function setRequired(el, required){
  if (!el) return;
  if (required) el.setAttribute("required", "required");
  else el.removeAttribute("required");
}

function showErrors(msg){
  const box = $("errorBox");
  box.textContent = msg;
  box.classList.remove("hidden");
}

function clearErrors(){
  const box = $("errorBox");
  box.textContent = "";
  box.classList.add("hidden");
}

function onlyDigits(str){
  return (str || "").replace(/\D+/g, "");
}

function isValidICO(ico){
  const d = onlyDigits(ico);
  return d.length === 8; // jednoduchá kontrola délky (stačí pro praxi)
}

function switchDonorType(type){
  const fo = $("foFields");
  const po = $("poFields");

  if (type === "PO"){
    fo.classList.add("hidden");
    po.classList.remove("hidden");
    po.setAttribute("aria-hidden", "false");

    // FO required OFF
    setRequired($("firstName"), false);
    setRequired($("lastName"), false);
    setRequired($("emailFO"), false);

    // PO required ON
    setRequired($("companyName"), true);
    setRequired($("ico"), true);
    setRequired($("contactPerson"), true);
    setRequired($("emailPO"), true);
  } else {
    po.classList.add("hidden");
    po.setAttribute("aria-hidden", "true");
    fo.classList.remove("hidden");

    // FO required ON
    setRequired($("firstName"), true);
    setRequired($("lastName"), true);
    setRequired($("emailFO"), true);

    // PO required OFF
    setRequired($("companyName"), false);
    setRequired($("ico"), false);
    setRequired($("contactPerson"), false);
    setRequired($("emailPO"), false);
  }
}

(function init(){
  const radios = document.querySelectorAll('input[name="donorType"]');
  radios.forEach(r => r.addEventListener("change", (e)=> {
    clearErrors();
    switchDonorType(e.target.value);
  }));

  // Default: FO
  switchDonorType("FO");

  const form = $("donationForm");
  form.addEventListener("submit", (e)=> {
    clearErrors();

    // extra validations
    const donorType = document.querySelector('input[name="donorType"]:checked')?.value || "FO";

    // ICO check only for PO
    if (donorType === "PO"){
      const ico = $("ico").value;
      if (!isValidICO(ico)){
        e.preventDefault();
        showErrors("Prosím zkontroluj IČO (mělo by mít 8 číslic).");
        return;
      }
    }

    // ZIP basic check
    const zip = onlyDigits($("zip").value);
    if (zip.length < 5){
      e.preventDefault();
      showErrors("Prosím zkontroluj PSČ (většinou 5 číslic).");
      return;
    }

    // Amount check
    const amount = Number($("amount").value);
    if (!Number.isFinite(amount) || amount <= 0){
      e.preventDefault();
      showErrors("Prosím zadej částku daru větší než 0.");
      return;
    }

    // If PO, copy email to common field name for easier processing (optional)
    // We keep both fields anyway (email / email_po).
    // No preventDefault -> Netlify will handle submission and redirect to thanks.html
  });
})();
