import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./CVForm.css";
  
export default function CVForm({ setCVData }) {
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    address: "",
    phone: "",
    email: "",
    linkedin: "",
    website: "",
    summary: "",
    experiences: "",
    education: "",
    skills: "",
    languages: "",
    hobbies: "",
    photo: null,
  });

  const [currentSection, setCurrentSection] = useState(0);
  const [photoPreview, setPhotoPreview] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const sections = [
    "personal",
    "photo",
    "summary", 
    "experience",
    "education",
    "skills",
    "languages",
    "hobbies"
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file (JPEG, PNG, etc.)');
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('Please select an image smaller than 2MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target.result);
        setFormData(prev => ({ ...prev, photo: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoPreview(null);
    setFormData(prev => ({ ...prev, photo: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setCVData(formData);
    navigate("/preview");
  };

  const nextSection = () => {
    setCurrentSection(prev => Math.min(prev + 1, sections.length - 1));
  };

  const prevSection = () => {
    setCurrentSection(prev => Math.max(prev - 1, 0));
  };

  return (
    
    <div className="form-container">
      <h1>/learn react/</h1>
      <div className="form-header">
        <div className="header-content">
          <h1>Create Your Professional CV</h1>
          <p>Fill in your details to generate a polished, professional resume</p>
        </div>
        <div className="progress-indicator">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
            ></div>
          </div>
          <span>Step {currentSection + 1} of {sections.length}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="cv-form">
        {/* Personal Information Section */}
        <div className={`section ${currentSection === 0 ? 'active' : ''}`}>
          <div className="section-header">
            <div className="section-number">1</div>
            <h2>Personal Information</h2>
          </div>
          <div className="form-grid">
            <div className="input-group">
              <label htmlFor="name">Full Name *</label>
              <input 
                id="name"
                name="name" 
                placeholder="John Doe" 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="input-group">
              <label htmlFor="title">Professional Title</label>
              <input 
                id="title"
                name="title" 
                placeholder="Senior Web Developer" 
                onChange={handleChange} 
              />
            </div>
            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <input 
                id="email"
                name="email" 
                type="email"
                placeholder="john.doe@email.com" 
                onChange={handleChange} 
              />
            </div>
            <div className="input-group">
              <label htmlFor="phone">Phone Number</label>
              <input 
                id="phone"
                name="phone" 
                placeholder="+1 (555) 123-4567" 
                onChange={handleChange} 
              />
            </div>
            <div className="input-group full-width">
              <label htmlFor="address">Address</label>
              <input 
                id="address"
                name="address" 
                placeholder="123 Main Street, City, State 12345" 
                onChange={handleChange} 
              />
            </div>
            <div className="input-group">
              <label htmlFor="linkedin">LinkedIn URL</label>
              <input 
                id="linkedin"
                name="linkedin" 
                placeholder="linkedin.com/in/johndoe" 
                onChange={handleChange} 
              />
            </div>
            <div className="input-group">
              <label htmlFor="website">Personal Website</label>
              <input 
                id="website"
                name="website" 
                placeholder="johndoeportfolio.com" 
                onChange={handleChange} 
              />
            </div>
          </div>
        </div>

        {/* Photo Upload Section */}
        <div className={`section ${currentSection === 1 ? 'active' : ''}`}>
          <div className="section-header">
            <div className="section-number">2</div>
            <h2>Profile Photo</h2>
          </div>
          <div className="photo-upload-section">
            <div className="photo-upload-content">
              <div className="upload-area">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoChange}
                  accept="image/*"
                  className="file-input"
                  id="photo-upload"
                />
                <label htmlFor="photo-upload" className="upload-label">
                  {photoPreview ? (
                    <div className="photo-preview-container">
                      <img 
                        src={photoPreview} 
                        alt="Profile preview" 
                        className="photo-preview"
                      />
                      <div className="photo-overlay">
                        <span className="change-photo-text">Change Photo</span>
                      </div>
                    </div>
                  ) : (
                    <div className="upload-placeholder">
                      <div className="upload-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                          <path d="M12 16V8M12 8L9 11M12 8L15 11" stroke="currentColor" strokeWidth="2"/>
                          <path d="M4 16V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V16" stroke="currentColor" strokeWidth="2"/>
                          <rect x="3" y="3" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      </div>
                      <div className="upload-text">
                        <h3>Upload Profile Photo</h3>
                        <p>Click to browse or drag and drop</p>
                        <span className="file-requirements">JPEG, PNG • Max 2MB</span>
                      </div>
                    </div>
                  )}
                </label>
                
                {photoPreview && (
                  <button 
                    type="button" 
                    className="btn-remove-photo"
                    onClick={handleRemovePhoto}
                  >
                    Remove Photo
                  </button>
                )}
              </div>

              <div className="photo-guidelines">
                <h4>Photo Guidelines:</h4>
                <ul>
                  <li>Use a professional headshot</li>
                  <li>Clear, well-lit face</li>
                  <li>Neutral background</li>
                  <li>Professional attire</li>
                  <li>Recent photo (last 2 years)</li>
                </ul>
                <p className="optional-note">
                  <em>Note: Photo is optional but recommended for professional CVs</em>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Summary Section */}
        <div className={`section ${currentSection === 2 ? 'active' : ''}`}>
          <div className="section-header">
            <div className="section-number">3</div>
            <h2>Professional Summary</h2>
          </div>
          <div className="input-group">
            <label htmlFor="summary">
              Brief overview of your professional background and career objectives
              <span className="char-count">{formData.summary.length}/300</span>
            </label>
            <textarea
              id="summary"
              name="summary"
              placeholder="Experienced web developer with 5+ years in building scalable applications. Passionate about creating efficient solutions and mentoring junior developers..."
              rows="4"
              maxLength="300"
              onChange={handleChange}
            ></textarea>
          </div>
        </div>

        {/* Experience Section */}
        <div className={`section ${currentSection === 3 ? 'active' : ''}`}>
          <div className="section-header">
            <div className="section-number">4</div>
            <h2>Work Experience</h2>
          </div>
          <div className="input-group">
            <label htmlFor="experiences">
              List your work experiences (one per line)
              <span className="hint">Format: Company | Role | Duration | Key achievements</span>
            </label>
            <textarea
              id="experiences"
              name="experiences"
              placeholder="Google | Senior Frontend Developer | 2020-Present | Led team of 5 developers, improved performance by 40%&#10;Microsoft | Web Developer | 2018-2020 | Implemented responsive designs for enterprise applications"
              rows="5"
              onChange={handleChange}
            ></textarea>
          </div>
        </div>

        {/* Education Section */}
        <div className={`section ${currentSection === 4 ? 'active' : ''}`}>
          <div className="section-header">
            <div className="section-number">5</div>
            <h2>Education</h2>
          </div>
          <div className="input-group">
            <label htmlFor="education">
              Educational background (one per line)
              <span className="hint">Format: Degree | Institution | Year</span>
            </label>
            <textarea
              id="education"
              name="education"
              placeholder="Bachelor of Science in Computer Science | Stanford University | 2018&#10;Master of Business Administration | Harvard University | 2020"
              rows="4"
              onChange={handleChange}
            ></textarea>
          </div>
        </div>

        {/* Skills Section */}
        <div className={`section ${currentSection === 5 ? 'active' : ''}`}>
          <div className="section-header">
            <div className="section-number">6</div>
            <h2>Skills</h2>
          </div>
          <div className="input-group">
            <label htmlFor="skills">
              Technical and professional skills (comma separated)
            </label>
            <textarea
              id="skills"
              name="skills"
              placeholder="JavaScript, React, Node.js, TypeScript, AWS, Agile Methodology, Team Leadership, Project Management"
              rows="3"
              onChange={handleChange}
            ></textarea>
          </div>
        </div>

        {/* Languages Section */}
        <div className={`section ${currentSection === 6 ? 'active' : ''}`}>
          <div className="section-header">
            <div className="section-number">7</div>
            <h2>Languages</h2>
          </div>
          <div className="input-group">
            <label htmlFor="languages">
              Languages you speak (comma separated with proficiency level)
            </label>
            <textarea
              id="languages"
              name="languages"
              placeholder="English (Native), Spanish (Fluent), French (Intermediate), German (Basic)"
              rows="2"
              onChange={handleChange}
            ></textarea>
          </div>
        </div>

        {/* Hobbies Section */}
        <div className={`section ${currentSection === 7 ? 'active' : ''}`}>
          <div className="section-header">
            <div className="section-number">8</div>
            <h2>Interests & Hobbies</h2>
          </div>
          <div className="input-group">
            <label htmlFor="hobbies">
              Personal interests and hobbies (comma separated)
            </label>
            <textarea
              id="hobbies"
              name="hobbies"
              placeholder="Open-source contributions, Technical blogging, Marathon running, Photography, Chess"
              rows="2"
              onChange={handleChange}
            ></textarea>
          </div>
        </div>

        <div className="form-navigation">
          {currentSection > 0 && (
            <button type="button" className="btn-secondary" onClick={prevSection}>
              ← Previous
            </button>
          )}
          {currentSection < sections.length - 1 ? (
            <button type="button" className="btn-primary" onClick={nextSection}>
              Next →
            </button>
          ) : (
            <button type="submit" className="btn-generate">
              Generate Professional CV
            </button>
          )}
        </div>
      </form>
    </div>
  );
}