function printpdf() {
    var content = document.getElementById("resume");
  
    const allButtons = document.querySelectorAll("#print button");
    allButtons.forEach(button => {
        button.classList.add("none");
    });
    let allInputCheckboxes = document.querySelectorAll(".input-checkbox");
    allInputCheckboxes.forEach(input => {
        input.classList.add("none");
    })

    html2pdf(content, {
        html2canvas: { scale: 1, logging: true, dpi: 500 }
    });
  
  allButtons.forEach(button => {
      button.classList.remove("none");
  })
  allInputCheckboxes.forEach(input => {
      input.classList.remove("none");
  })
  
   
  }
  
  function addedu() {
    const head = document.createElement('div');
    document.getElementById("education").appendChild(head);
    head.innerHTML = ('<div class="edublock"><span><input type="checkbox" class="input-checkbox"></span><span class="education-head" contenteditable="true">YOUR DEGREE</span><div ><span contenteditable="true">Institute name</span> - <span contenteditable="true">Passing Year</span></div><div class="marks-section"><span contenteditable="true">CGPA/Percentage: </span><span contenteditable="true">8.5/85%</span></div></div>');
    initializeContenteditablePlaceholders();
    saveresume();
  }
  function remedu(event) {
    let val = 0;
    let empty = true;
    const allInputCheckboxes = event.target.parentElement.getElementsByClassName("input-checkbox");
    const array = Array.from(allInputCheckboxes);
    if (array.length === 0) {
        alert("No fields are present to be deleted!")
    }
    else {
        console.log(array);
        array.forEach(element => {
            if (element.checked === true) {
                val = 1;
                element.parentElement.parentElement.remove();
            }
        })
        if (val === 0) alert("Please select the checkboxes to delete the required field!")
    }
    saveresume();
  }
  
  function addcert() {
    const head = document.createElement('div');
    document.getElementById("certification").appendChild(head);
    head.innerHTML = ('<div class="certblock"><span><input type="checkbox" class="input-checkbox"></span><span class="cert-head" contenteditable="true">CERTIFICATION NAME</span><div ><span contenteditable="true">Institute name</span> - <span contenteditable="true">Year</span></div></div>');
    initializeContenteditablePlaceholders();
    saveresume();
    }
    function remcert(event) {
    let val = 0;
    let empty = true;
    const allInputCheckboxes = event.target.parentElement.getElementsByClassName("input-checkbox");
    const array = Array.from(allInputCheckboxes);
    if (array.length === 0) {
        alert("No fields are present to be deleted!")
    }
    else {
        console.log(array);
        array.forEach(element => {
            if (element.checked === true) {
                val = 1;
                element.parentElement.parentElement.remove();
            }
        })
        if (val === 0) alert("Please select the checkboxes to delete the required field!")
    }
    saveresume();
  }


  function addmarks() {
    const head = document.createElement('div');
    document.getElementById("marks").appendChild(head);
    head.innerHTML = ('<div class="marksblock"><span><input type="checkbox" class="input-checkbox"></span><span class="marks-head" contenteditable="true">SEMESTER/YEAR</span><div ><span contenteditable="true">Subject Name</span> - <span contenteditable="true">Grade/Marks</span></div></div>');
    initializeContenteditablePlaceholders();
    saveresume();
  }
  function remmarks(event) {
    let val = 0;
    let empty = true;
    const allInputCheckboxes = event.target.parentElement.getElementsByClassName("input-checkbox");
    const array = Array.from(allInputCheckboxes);
    if (array.length === 0) {
        alert("No fields are present to be deleted!")
    }
    else {
        console.log(array);
        array.forEach(element => {
            if (element.checked === true) {
                val = 1;
                element.parentElement.parentElement.remove();
            }
        })
        if (val === 0) alert("Please select the checkboxes to delete the required field!")
    }
    saveresume();
  }


  function addskill() {
    const head = document.createElement('div');
    document.getElementById("skills").appendChild(head);
    head.innerHTML = ('<div class="skill"><span><input type="checkbox" class="input-checkbox"></span><span><i class="fas fa-chevron-circle-right"></i></span>   <span class="skill-text" contenteditable="true" tabindex="0">write your skill here</span></div>');
    initializeContenteditablePlaceholders();
    saveresume();
  }
  
  function remskill(event) {
    let val = 0;
    const allInputCheckboxes = event.target.parentElement.getElementsByClassName("input-checkbox");
    const array = Array.from(allInputCheckboxes);
    if (array.length === 0) {
        alert("No fields are present to be deleted!")
    }
    else {
        console.log(array);
        array.forEach(element => {
            if (element.checked === true) {
                val = 1;
                element.parentElement.parentElement.remove();
            }
        })
        if (val === 0) alert("Please select the checkboxes to delete the required field!")
    }
    saveresume();
  }
  
  
  function addLang() {
    const head = document.createElement('div');
    document.getElementById("languages").appendChild(head);
    head.innerHTML = ('<div class="language"><span><input type="checkbox" class="input-checkbox"></span><span contenteditable="true">LANGUAGE</span> - <span contenteditable="true">level u know</span></div>');
    initializeContenteditablePlaceholders();
    saveresume();
  }
  function remLang(event) {
    let val = 0;
    const allInputCheckboxes = event.target.parentElement.getElementsByClassName("input-checkbox");
    const array = Array.from(allInputCheckboxes);
    if (array.length === 0) {
        alert("No fields are present to be deleted!")
    }
    else {
        console.log(array);
        array.forEach(element => {
            if (element.checked === true) {
                val = 1;
                element.parentElement.parentElement.remove();
            }
        })
        if (val === 0) alert("Please select the checkboxes to delete the required field!")
    }
    saveresume();
  }
  
  
  function addAch() {
    const head = document.createElement('div');
    document.getElementById("achievement").appendChild(head);
    head.innerHTML = ('<div class="achieve" ><span><input type="checkbox" class="input-checkbox"></span><span contenteditable="true">Write your achievement</span></div>');
    initializeContenteditablePlaceholders();
    saveresume();
  }
  function remAch(event) {
    let val = 0;
    const allInputCheckboxes = event.target.parentElement.getElementsByClassName("input-checkbox");
    const array = Array.from(allInputCheckboxes);
    if (array.length === 0) {
        alert("No fields are present to be deleted!")
    }
    else {
        console.log(array);
        array.forEach(element => {
            if (element.checked === true) {
                val = 1;
                element.parentElement.parentElement.remove();
            }
        })
        if (val === 0) alert("Please select the checkboxes to delete the required field!")
    }
    saveresume();
  }
  
  
  function addInt() {
    const head = document.createElement('div');
    document.getElementById("interest").appendChild(head);
    head.innerHTML = ('<div class="achieve" ><span><input type="checkbox" class="input-checkbox"></span><span contenteditable="true">Write interest</span></div>');
    initializeContenteditablePlaceholders();
    saveresume();
  }
  function remInt(event) {
    let val = 0;
    const allInputCheckboxes = event.target.parentElement.getElementsByClassName("input-checkbox");
    const array = Array.from(allInputCheckboxes);
    if (array.length === 0) {
        alert("No fields are present to be deleted!")
    }
    else {
        array.forEach(element => {
            if (element.checked === true) {
                val = 1;
                element.parentElement.parentElement.remove();
            }
        })
        if (val === 0) alert("Please select the checkboxes to delete the required field!")
    }
    saveresume();
  }
  
  let maxNewSection = 1;
  function addsec() {
    if (maxNewSection < 2) {
        const head = document.createElement('div');
        document.getElementById("newsec").appendChild(head);
        if (maxNewSection === 0) {
            head.innerHTML = ('<div><span><input type="checkbox" class="input-checkbox"></span><span class="title" contenteditable="true">NEW SECTION</span><br><br><div contenteditable="true">This is the description part of your new section. Try to stay within limit and write something which has less than 400 characters. The spaces and symbols you use will also be included so use them for an indentation effect.</div></div>');
        }
        else {
            head.innerHTML = ('<div><br><br><span><input type="checkbox" class="input-checkbox"></span><span class="title" contenteditable="true">NEW SECTION</span><br><br><div contenteditable="true">This is the description part of your new section. Try to stay within limit and write something which has less than 400 characters. The spaces and symbols you use will also be included so use them for an indentation effect.</div></div>');
        }
  
        maxNewSection = maxNewSection + 1;
        initializeContenteditablePlaceholders();
    }
    else {
        alert("Atmost 2 NEW SECTION can be added!")
  
    }
    saveresume();
  }
  function remsec(event) {
    let val = 0;
    const allInputCheckboxes = event.target.parentElement.getElementsByClassName("input-checkbox");
    const array = Array.from(allInputCheckboxes);
    if (array.length === 0) {
        alert("No fields are present to be deleted!")
    }
    else {
        console.log(array);
        array.forEach(element => {
            if (element.checked === true) {
                val = 1;
                maxNewSection = maxNewSection - 1;
                element.parentElement.parentElement.remove();
            }
        })
        if (val === 0) alert("Please select the checkboxes to delete the required field!")
    }
    saveresume();
  }
  
  function saveresume() {
    var sec = document.getElementById("print");
    const value1 = sec.innerHTML;
    var info = document.getElementById("custinfo");
    if (info) {
        info.value = value1;
    }
  }

  function getCurrentUserEmail() {
    const session = JSON.parse(localStorage.getItem('resumeMakerSession'));
    return session ? session.email : null;
  }

  function getSavedResumes() {
    const email = getCurrentUserEmail();
    if (!email) return [];
    const allSaved = JSON.parse(localStorage.getItem('resumeMakerSavedResumes')) || {};
    return allSaved[email] || [];
  }

  function setSavedResumes(resumes) {
    const email = getCurrentUserEmail();
    if (!email) return;
    const allSaved = JSON.parse(localStorage.getItem('resumeMakerSavedResumes')) || {};
    allSaved[email] = resumes;
    localStorage.setItem('resumeMakerSavedResumes', JSON.stringify(allSaved));
  }

  function saveCurrentResume() {
    const email = getCurrentUserEmail();
    if (!email) {
      alert('Please login to save resumes.');
      return;
    }

    const resumeSection = document.getElementById('print');
    if (!resumeSection) return;

    const titleSelect = document.getElementById('nameTitle');
    if (titleSelect) {
        Array.from(titleSelect.options).forEach(option => option.removeAttribute('selected'));
        titleSelect.options[titleSelect.selectedIndex]?.setAttribute('selected', 'selected');
    }

    const selectedTitle = titleSelect?.value.trim() || '';
    const titleText = document.querySelector('.head .name')?.textContent.trim() || 'Untitled';
    const subtitleText = document.querySelector('.head .post')?.textContent.trim() || '';
    const fullName = selectedTitle ? `${selectedTitle} ${titleText}` : titleText;
    const title = subtitleText ? `${fullName} - ${subtitleText}` : fullName;
    const html = resumeSection.innerHTML;
    const resumeId = 'resume-' + Date.now();

    // Try to save to database first
    fetch('http://localhost:5000/api/resumes/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            id: resumeId,
            title: title,
            html: html
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Resume saved successfully to database!');
            renderSavedResumes();
        } else {
            throw new Error(data.message || 'Failed to save');
        }
    })
    .catch(error => {
        console.error('Database save error:', error);
        // Fallback to localStorage
        const savedResumes = getSavedResumes();
        const newResume = {
            id: resumeId,
            title: title,
            timestamp: new Date().toISOString(),
            html: html
        };
        savedResumes.push(newResume);
        setSavedResumes(savedResumes);
        renderSavedResumes();
        alert('Resume saved to local storage (database offline).');
    });
  }

  function renderSavedResumes() {
    const list = document.getElementById('savedResumesList');
    if (!list) return;

    const email = getCurrentUserEmail();
    if (!email) {
        list.innerHTML = '<p class="empty-message">Please login to view saved resumes.</p>';
        return;
    }

    // Try to fetch from database
    fetch(`http://localhost:5000/api/resumes/get?email=${encodeURIComponent(email)}`)
    .then(response => response.json())
    .then(data => {
        if (data.success && data.resumes && data.resumes.length > 0) {
            renderResumeList(data.resumes, list);
        } else {
            // Fallback to localStorage
            loadAndRenderLocalResumes(list);
        }
    })
    .catch(error => {
        console.error('Failed to fetch from database:', error);
        // Fallback to localStorage
        loadAndRenderLocalResumes(list);
    });
  }

  function loadAndRenderLocalResumes(list) {
    const savedResumes = getSavedResumes();
    if (savedResumes.length === 0) {
      list.innerHTML = '<p class="empty-message">No saved resumes yet. Click the save icon to store this resume.</p>';
      return;
    }
    renderResumeList(savedResumes, list);
  }

  function renderResumeList(resumes, list) {
    list.innerHTML = '';
    resumes.slice().reverse().forEach(resume => {
      const item = document.createElement('div');
      item.className = 'saved-resume-item';
      item.innerHTML = `
        <div class="saved-resume-card">
          <div class="saved-resume-meta">
            <strong>${resume.title}</strong>
            <span>${new Date(resume.timestamp).toLocaleString()}</span>
          </div>
          <div class="saved-resume-actions">
            <button type="button" class="btn btn-sm btn-primary" onclick="editSavedResume('${resume.id}')">Edit</button>
            <button type="button" class="btn btn-sm btn-danger" onclick="deleteSavedResume('${resume.id}')">Delete</button>
          </div>
        </div>
      `;
      list.appendChild(item);
    });
  }

  function editSavedResume(id) {
    const savedResumes = getSavedResumes();
    const resume = savedResumes.find(item => item.id == id);
    if (resume) {
      const resumeSection = document.getElementById('print');
      if (resumeSection) {
        resumeSection.innerHTML = resume.html;
        initializeContenteditablePlaceholders();
        alert('Saved resume loaded.');
        return;
      }

      localStorage.setItem('resumeMakerLoadResume', id);
      window.location.href = 'index.html';
      return;
    }

    // If not found locally, try to fetch from backend
    const email = getCurrentUserEmail();
    if (!email) {
      alert('Please login to edit this resume.');
      return;
    }

    fetch(`http://localhost:5000/api/resumes/get?email=${encodeURIComponent(email)}`)
    .then(response => response.json())
    .then(data => {
      if (data.success && data.resumes) {
        const backendResume = data.resumes.find(item => item.id == id);
        if (backendResume) {
          const resumeSection = document.getElementById('print');
          if (resumeSection) {
            resumeSection.innerHTML = backendResume.html;
            initializeContenteditablePlaceholders();
            alert('Saved resume loaded.');
            return;
          }

          // Store in localStorage for loading in index.html
          const localResumes = getSavedResumes();
          localResumes.push({
            id: backendResume.id,
            title: backendResume.title,
            html: backendResume.html,
            timestamp: backendResume.timestamp
          });
          localStorage.setItem('resumeMakerResumes', JSON.stringify(localResumes));

          localStorage.setItem('resumeMakerLoadResume', id);
          window.location.href = 'index.html';
        } else {
          alert('Resume not found.');
        }
      } else {
        alert('Failed to load resume.');
      }
    })
    .catch(error => {
      console.error('Error loading resume:', error);
      alert('Failed to load resume. Please try again.');
    });
  }

  function loadPendingSavedResume() {
    const pendingId = localStorage.getItem('resumeMakerLoadResume');
    if (!pendingId) return;

    const savedResumes = getSavedResumes();
    const resume = savedResumes.find(item => item.id == pendingId);
    localStorage.removeItem('resumeMakerLoadResume');
    if (!resume) return;

    const resumeSection = document.getElementById('print');
    if (resumeSection) {
      resumeSection.innerHTML = resume.html;
      initializeContenteditablePlaceholders();
      alert('Loaded saved resume from dashboard.');
    }
  }

  function deleteSavedResume(id) {
    const email = getCurrentUserEmail();
    if (!email) {
        alert('Please login.');
        return;
    }

    if (!confirm('Are you sure you want to delete this resume?')) {
        return;
    }

    // Try to delete from database first
    fetch('http://localhost:5000/api/resumes/delete', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: id,
            email: email
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            renderSavedResumes();
        } else {
            throw new Error(data.message || 'Failed to delete');
        }
    })
    .catch(error => {
        console.error('Database delete error:', error);
        // Fallback to localStorage
        const savedResumes = getSavedResumes();
        const updated = savedResumes.filter(item => item.id !== id);
        setSavedResumes(updated);
        renderSavedResumes();
    });
  }

  // Display user name on page load
  window.addEventListener('load', function() {
    const session = JSON.parse(localStorage.getItem('resumeMakerSession'));
    if (session && session.name) {
        const userNameElement = document.getElementById('userName');
        if (userNameElement) {
            userNameElement.textContent = 'Welcome, ' + session.name;
        }
    }
    
    // Load saved theme
    const savedTheme = localStorage.getItem('resumeTheme') || 'purple';
    if (savedTheme === 'custom') {
        const customColor = localStorage.getItem('resumeCustomColor') || '#667eea';
        applyTheme('custom', customColor);
        updateCustomSwatch(customColor);
        updateThemeSelector('custom');
    } else {
        applyTheme(savedTheme);
        updateThemeSelector(savedTheme);
    }
    renderSavedResumes();
    loadPendingSavedResume();
  });

// COLOR THEME FUNCTIONS
function changeTheme(theme, customColor) {
    if (theme === 'custom') {
        const color = customColor || document.getElementById('customThemeColor')?.value || '#667eea';
        applyTheme('custom', color);
        localStorage.setItem('resumeTheme', 'custom');
        localStorage.setItem('resumeCustomColor', color);
        updateThemeSelector('custom');
        return;
    }

    applyTheme(theme);
    localStorage.setItem('resumeTheme', theme);
    localStorage.removeItem('resumeCustomColor');
    updateThemeSelector(theme);
}

function applyCustomTheme() {
    const colorInput = document.getElementById('customThemeColor');
    if (!colorInput) return;
    const color = colorInput.value;
    changeTheme('custom', color);
}

function applyTheme(theme, customColor) {
    // Remove all theme classes
    document.body.classList.remove('theme-purple', 'theme-blue', 'theme-green', 'theme-pink', 'theme-orange', 'theme-teal', 'theme-indigo', 'theme-red', 'theme-custom');

    if (theme === 'custom') {
        document.body.classList.add('theme-custom');
        const color = customColor || document.getElementById('customThemeColor')?.value || '#667eea';
        const primaryDark = shadeColor(color, -15);
        const secondaryColor = shadeColor(color, 20);
        const accentColor = shadeColor(color, -5);
        const accentDark = shadeColor(color, -35);
        const dangerColor = shadeColor(color, 25);
        const dangerDark = shadeColor(color, 10);

        document.body.style.setProperty('--primary-color', color);
        document.body.style.setProperty('--primary-dark', primaryDark);
        document.body.style.setProperty('--secondary-color', secondaryColor);
        document.body.style.setProperty('--accent-color', accentColor);
        document.body.style.setProperty('--accent-dark', accentDark);
        document.body.style.setProperty('--danger-color', dangerColor);
        document.body.style.setProperty('--danger-dark', dangerDark);
    } else {
        document.body.classList.add('theme-' + theme);
        document.body.style.removeProperty('--primary-color');
        document.body.style.removeProperty('--primary-dark');
        document.body.style.removeProperty('--secondary-color');
        document.body.style.removeProperty('--accent-color');
        document.body.style.removeProperty('--accent-dark');
        document.body.style.removeProperty('--danger-color');
        document.body.style.removeProperty('--danger-dark');
    }
}

function updateCustomSwatch(color) {
    const swatch = document.getElementById('customSwatch');
    if (swatch) {
        swatch.style.background = color;
    }
}

function shadeColor(color, percent) {
    let R = parseInt(color.substring(1, 3), 16);
    let G = parseInt(color.substring(3, 5), 16);
    let B = parseInt(color.substring(5, 7), 16);

    R = Math.min(255, Math.max(0, R + Math.round((percent / 100) * 255)));
    G = Math.min(255, Math.max(0, G + Math.round((percent / 100) * 255)));
    B = Math.min(255, Math.max(0, B + Math.round((percent / 100) * 255)));

    const r = R.toString(16).padStart(2, '0');
    const g = G.toString(16).padStart(2, '0');
    const b = B.toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
}

function updateThemeSelector(theme) {
    // Update active button in color selector
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
        if (option.dataset.theme === theme) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
}

// Initialize contenteditable placeholder behavior
function initializeContenteditablePlaceholders() {
    const editableElements = document.querySelectorAll('[contenteditable="true"]');
    
    editableElements.forEach(element => {
        const placeholder = element.textContent.trim();
        element.dataset.placeholder = placeholder;
        
        element.addEventListener('focus', function() {
            // If text matches placeholder, clear it
            if (this.textContent.trim() === this.dataset.placeholder) {
                this.textContent = '';
                this.classList.add('editing');
            }
        });
        
        element.addEventListener('blur', function() {
            // If text is empty, restore placeholder
            if (this.textContent.trim() === '') {
                this.textContent = this.dataset.placeholder;
                this.classList.remove('editing');
            }
        });
    });
}

// Toggle color selector visibility
document.addEventListener('DOMContentLoaded', function() {
    const colorToggle = document.getElementById('colorToggle');
    const colorSelector = document.getElementById('colorSelector');
    
    // Initialize contenteditable placeholders
    initializeContenteditablePlaceholders();
    
    if (colorToggle && colorSelector) {
        colorToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            colorSelector.classList.toggle('hidden');
            
            // Update active theme button when opening
            const savedTheme = localStorage.getItem('resumeTheme') || 'purple';
            updateThemeSelector(savedTheme);
        });
        
        // Close color selector when clicking outside
        document.addEventListener('click', function(e) {
            if (!colorSelector.contains(e.target) && !colorToggle.contains(e.target)) {
                colorSelector.classList.add('hidden');
            }
        });
    }
});

// JOB DESCRIPTION MATCHING FUNCTIONS
document.getElementById('jdFile').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Upload file to extract text
    const formData = new FormData();
    formData.append('file', file);

    fetch('http://localhost:5000/api/jd/process', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById('jdText').value = data.text;
        } else {
            alert('Failed to process file: ' + data.message);
        }
    })
    .catch(error => {
        console.error('File processing error:', error);
        alert('Failed to process file. Please try again.');
    });
});

function matchResumes() {
    const jdText = document.getElementById('jdText').value.trim();
    if (!jdText) {
        alert('Please enter a job description.');
        return;
    }

    const email = getCurrentUserEmail();
    if (!email) {
        alert('Please login to use this feature.');
        return;
    }

    // First check if user has any saved resumes
    fetch(`http://localhost:5000/api/resumes/get?email=${encodeURIComponent(email)}`)
    .then(response => response.json())
    .then(data => {
        if (!data.success || !data.resumes || data.resumes.length === 0) {
            alert('No saved resumes found. Please create and save some resumes first before using the matching feature.');
            return;
        }

        // Proceed with matching
        fetch('http://localhost:5000/api/resumes/match', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                jd_text: jdText
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayBestMatch(data.best_match, data.score, data.debug);
            } else {
                alert('Failed to match resumes: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Matching error:', error);
            alert('Failed to match resumes. Please try again.');
        });
    })
    .catch(error => {
        console.error('Error checking resumes:', error);
        alert('Failed to check saved resumes. Please try again.');
    });
}

function displayBestMatch(resume, score, debug) {
    const resultsDiv = document.getElementById('matchResults');
    const bestMatchDiv = document.getElementById('bestMatch');

    if (!resume) {
        let noMatchMessage = '<p>No suitable match found among your saved resumes.</p>';
        if (debug && debug.jd_keywords && debug.jd_keywords.length > 0) {
            noMatchMessage += `<p><small>Keywords extracted from JD: ${debug.jd_keywords.slice(0, 10).join(', ')}${debug.jd_keywords.length > 10 ? '...' : ''}</small></p>`;
            noMatchMessage += '<p><small>Try creating resumes that include these skills and technologies.</small></p>';
        }
        bestMatchDiv.innerHTML = noMatchMessage;
    } else {
        let keywordsFound = '';
        if (debug && debug.match_details) {
            const matchDetail = debug.match_details.find(m => m.title === resume.title);
            if (matchDetail && matchDetail.keywords_found.length > 0) {
                keywordsFound = `<p><small>Matching keywords: ${matchDetail.keywords_found.join(', ')}</small></p>`;
            }
        }
        
        bestMatchDiv.innerHTML = `
            <div class="match-info">
                <strong>${resume.title}</strong>
                <p>Match Score: ${score}</p>
                <p>Saved on: ${new Date(resume.timestamp).toLocaleString()}</p>
                ${keywordsFound}
                <button type="button" class="btn btn-primary btn-sm" onclick="editSavedResume('${resume.id}')">Edit Resume</button>
            </div>
        `;
    }

    resultsDiv.style.display = 'block';
}
