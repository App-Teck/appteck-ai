// ── CONTACT FORM ──
// Dual submit to Formspree and leads.appteck.ai
async function submitForm() {
  const fname = document.getElementById('fname').value.trim();
  const lname = document.getElementById('lname').value.trim();
  const email = document.getElementById('email').value.trim();
  const biz   = document.getElementById('bizname').value.trim();
  const ind   = document.getElementById('industry').value;
  const tier  = document.getElementById('tier').value;
  const msg   = document.getElementById('message').value.trim();

  if (!fname || !email) {
    alert('Please fill in at least your name and email.');
    return;
  }

  const btn = document.querySelector('.form-submit');
  btn.textContent = 'Sending...';
  btn.disabled = true;

  try {
    const payload = JSON.stringify({
      name: fname + ' ' + lname,
      email,
      business: biz,
      industry: ind,
      tier,
      message: msg
    });

    const [res1, res2] = await Promise.all([
      fetch('https://formspree.io/f/mzdkeznw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: payload
      }),
      fetch('https://leads.appteck.ai/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload
      })
    ]);

    if (res1.ok || res2.ok) {
      document.getElementById('contactForm').style.display = 'none';
      document.getElementById('formSuccess').style.display = 'block';
    } else {
      throw new Error('Form error');
    }
  } catch (e) {
    btn.textContent = 'Send Enquiry →';
    btn.disabled = false;
    alert('Something went wrong. Please email us directly at sales@appteck.ai');
  }
}

document.querySelector('.form-submit')?.addEventListener('click', submitForm);
