import { useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "./CVPreview.css";

export default function CVPreview({ cvData }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState("modern");

  const [sections, setSections] = useState([
    { id: "summary", title: "Professional Summary", content: cvData.summary, type: "text" },
    { id: "experience", title: "Work Experience", content: cvData.experiences, type: "bullets" },
    { id: "education", title: "Education", content: cvData.education, type: "bullets" },
    { id: "skills", title: "Skills", content: cvData.skills, type: "skills" },
    { id: "languages", title: "Languages", content: cvData.languages, type: "bullets" },
    { id: "hobbies", title: "Interests", content: cvData.hobbies, type: "skills" },
  ]);

  const themes = [
    { id: "modern", name: "Modern", previewColor: "#3b82f6" },
    { id: "classic", name: "Classic", previewColor: "#2d3748" },
    { id: "elegant", name: "Elegant", previewColor: "#6b21a8" },
  ];

  const handleDownload = async () => {
  setIsDownloading(true);
  try {
    const cv = document.getElementById("cv");

    // Step 1: Measure the height
    const pdf = new jsPDF("p", "mm", "a4");
    const pageHeightPx = 1122; // Approx height in pixels for A4
    const cvHeight = cv.scrollHeight;

    // Step 2: Calculate scale factor if too tall
    let scaleFactor = 1;
    if (cvHeight > pageHeightPx) {
      scaleFactor = pageHeightPx / cvHeight;
      cv.style.transform = `scale(${scaleFactor})`;
      cv.style.transformOrigin = "top left";
      cv.style.width = `${100 / scaleFactor}%`;
    }

    // Step 3: Capture the scaled CV
    const canvas = await html2canvas(cv, {
      scale: 3,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    });

    // Step 4: Restore original scale
    cv.style.transform = "";
    cv.style.width = "";

    // Step 5: Generate PDF
    const imgData = canvas.toDataURL("image/png", 1.0);
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save(`${cvData.name?.replace(/\s+/g, "_") || "professional_cv"}.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("There was an error generating your PDF. Please try again.");
  } finally {
    setIsDownloading(false);
  }
};


  const formatTextWithBullets = (text) => {
    if (!text) return null;
    const lines = text.split('\n').filter(line => line.trim());
    return lines.map((line, index) => (
      <div key={index} className="bullet-point">
        <span className="bullet">•</span>
        <span>{line.trim()}</span>
      </div>
    ));
  };

  const formatSkills = (skills) => {
    if (!skills) return null;
    const skillList = skills.split(',').map(skill => skill.trim()).filter(skill => skill);
    return (
      <div className="skills-container">
        {skillList.map((skill, index) => (
          <span key={index} className="skill-tag">{skill}</span>
        ))}
      </div>
    );
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const newSections = Array.from(sections);
    const [moved] = newSections.splice(result.source.index, 1);
    newSections.splice(result.destination.index, 0, moved);
    setSections(newSections);
  };

  return (
    <div className="preview-container">
      <div className="preview-header">
        <h1>Choose Your CV Theme</h1>
        <div className="theme-selector">
          {themes.map(theme => (
            <div
              key={theme.id}
              className={`theme-option ${selectedTheme === theme.id ? "active" : ""}`}
              style={{ backgroundColor: theme.previewColor }}
              onClick={() => setSelectedTheme(theme.id)}
            >
              <span>{theme.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div id="cv" className={`cv-layout theme-${selectedTheme}`}>
        {/* Theme-specific layouts */}
        {selectedTheme === "modern" && (
          <div className="modern-layout">
            <header className="cv-header modern-header">
              <div className="header-content">
                <div className="header-main">
                  <div className="header-text">
                    <h1 className="name">{cvData.name || "Your Name"}</h1>
                    <h2 className="title">{cvData.title || "Professional Title"}</h2>
                  </div>
                  {cvData.photo && (
                    <div className="photo-container">
                      <img src={cvData.photo} alt="Profile" className="profile-photo" />
                    </div>
                  )}
                </div>
                <div className="contact-info modern-contact">
                  {cvData.email && <div className="contact-item">✉️ {cvData.email}</div>}
                  {cvData.phone && <div className="contact-item">📞 {cvData.phone}</div>}
                  {cvData.address && <div className="contact-item">📍 {cvData.address}</div>}
                </div>
              </div>
            </header>

            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="sections">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className="cv-content modern-content">
                    {sections.map((section, index) => (
                      section.content && (
                        <Draggable key={section.id} draggableId={section.id} index={index}>
                          {(provided) => (
                            <section
                              className="cv-section draggable-section modern-section"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <h3 className="section-title modern-title">{section.title}</h3>
                              <div className="section-content">
                                {section.type === "skills" ? formatSkills(section.content)
                                  : section.type === "bullets" ? formatTextWithBullets(section.content)
                                  : <p className="summary-text">{section.content}</p>}
                              </div>
                            </section>
                          )}
                        </Draggable>
                      )
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        )}

        {selectedTheme === "classic" && (
          <div className="classic-layout">
            <div className="classic-container">
              <aside className="classic-sidebar">
                {cvData.photo && (
                  <div className="classic-photo-container">
                    <img src={cvData.photo} alt="Profile" className="classic-profile-photo" />
                  </div>
                )}
                <div className="classic-contact-section">
                  <h3 className="classic-sidebar-title">Contact</h3>
                  {cvData.email && <div className="classic-contact-item">✉️ {cvData.email}</div>}
                  {cvData.phone && <div className="classic-contact-item">📞 {cvData.phone}</div>}
                  {cvData.address && <div className="classic-contact-item">📍 {cvData.address}</div>}
                </div>
                
                {/* Skills in sidebar for classic theme */}
                {sections.find(s => s.id === "skills")?.content && (
                  <div className="classic-sidebar-section">
                    <h3 className="classic-sidebar-title">Skills</h3>
                    {formatSkills(sections.find(s => s.id === "skills").content)}
                  </div>
                )}
              </aside>

              <main className="classic-main">
                <header className="classic-header">
                  <h1 className="classic-name">{cvData.name || "Your Name"}</h1>
                  <h2 className="classic-title">{cvData.title || "Professional Title"}</h2>
                </header>

                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="sections">
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.droppableProps} className="classic-content">
                        {sections.filter(section => section.id !== "skills").map((section, index) => (
                          section.content && (
                            <Draggable key={section.id} draggableId={section.id} index={index}>
                              {(provided) => (
                                <section
                                  className="cv-section draggable-section classic-section"
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <h3 className="section-title classic-title">{section.title}</h3>
                                  <div className="section-content">
                                    {section.type === "bullets" ? formatTextWithBullets(section.content)
                                      : <p className="summary-text">{section.content}</p>}
                                  </div>
                                </section>
                              )}
                            </Draggable>
                          )
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </main>
            </div>
          </div>
        )}

        {selectedTheme === "elegant" && (
          <div className="elegant-layout">
            <div className="elegant-header-section">
              <div className="elegant-header-content">
                <div className="elegant-header-text">
                  <h1 className="elegant-name">{cvData.name || "Your Name"}</h1>
                  <h2 className="elegant-title">{cvData.title || "Professional Title"}</h2>
                </div>
                {cvData.photo && (
                  <div className="elegant-photo-container">
                    <img src={cvData.photo} alt="Profile" className="elegant-profile-photo" />
                  </div>
                )}
              </div>
              <div className="elegant-contact-bar">
                {cvData.email && <span className="elegant-contact-item">✉️ {cvData.email}</span>}
                {cvData.phone && <span className="elegant-contact-item">📞 {cvData.phone}</span>}
                {cvData.address && <span className="elegant-contact-item">📍 {cvData.address}</span>}
              </div>
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="sections">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className="elegant-content">
                    <div className="elegant-grid">
                      {sections.map((section, index) => (
                        section.content && (
                          <Draggable key={section.id} draggableId={section.id} index={index}>
                            {(provided) => (
                              <section
                                className="cv-section draggable-section elegant-section"
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <div className="elegant-section-header">
                                  <div className="elegant-section-icon">◆</div>
                                  <h3 className="elegant-section-title">{section.title}</h3>
                                </div>
                                <div className="section-content elegant-section-content">
                                  {section.type === "skills" ? formatSkills(section.content)
                                    : section.type === "bullets" ? formatTextWithBullets(section.content)
                                    : <p className="elegant-summary-text">{section.content}</p>}
                                </div>
                              </section>
                            )}
                          </Draggable>
                        )
                      ))}
                    </div>
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        )}
      </div>

      <div className="download-footer">
        <button onClick={handleDownload} disabled={isDownloading} className="btn-download-large">
          {isDownloading ? "Generating..." : "Download PDF"}
        </button>
      </div>
    </div>
  );
}