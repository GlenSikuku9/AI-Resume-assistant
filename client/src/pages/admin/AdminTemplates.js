import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Form, Alert, Row, Col, Modal } from 'react-bootstrap';
import { getAuth } from 'firebase/auth';

const API_URL = process.env.REACT_APP_API_URL || '';

const initialTemplate = {
  name: '',
  description: '',
  category: 'timeline-driven',
  isActive: true,
  previewImage: '',
  defaultOrder: [],
  sections: [],
  styling: {
    alignments: {},
    layout: {},
    primaryColor: '',
    fontFamily: '',
    sectionStyles: {}
  }
};

function AdminTemplates() {
  const [categoryOptions, setCategoryOptions] = useState([
    'timeline-driven',
    'balanced-combination',
    'skills-focused'
  ]);
  const [newCategory, setNewCategory] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [form, setForm] = useState(initialTemplate);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [newStylingKey, setNewStylingKey] = useState('');
  const [newStylingValue, setNewStylingValue] = useState('');
  const [stylingFieldError, setStylingFieldError] = useState('');
  const [imageUploadError, setImageUploadError] = useState('');
  const [newAlignmentKey, setNewAlignmentKey] = useState('');
  const [newAlignmentValue, setNewAlignmentValue] = useState('');
  const [newLayoutKey, setNewLayoutKey] = useState('');
  const [newLayoutValue, setNewLayoutValue] = useState('');
  const [newSectionStyleKey, setNewSectionStyleKey] = useState('');
  const [newSectionStyleValue, setNewSectionStyleValue] = useState('');

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setLoading(true);
    setError('');
    try {
      const token = await getAuth().currentUser.getIdToken();
      const res = await fetch(`${API_URL}/api/templates`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setTemplates(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to fetch templates');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (template) => {
    setEditingTemplate(template);
    setForm({
      ...template,
      defaultOrder: Array.isArray(template.defaultOrder) ? template.defaultOrder : [],
      sections: Array.isArray(template.sections) ? template.sections : [],
      styling: template.styling || {
        alignments: {},
        layout: {},
        primaryColor: '',
        fontFamily: '',
        sectionStyles: {}
      }
    });
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdd = () => {
    setEditingTemplate(null);
    setForm({ ...initialTemplate });
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Update handleImageChange to upload image to backend
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setImageUploadError('');
      try {
        const token = await getAuth().currentUser.getIdToken();
        const formData = new FormData();
        formData.append('image', file);
        formData.append('templateName', form.name || 'template');
        console.log('Uploading image to:', `${API_URL}/api/templates/upload-image`);
        const res = await fetch(`${API_URL}/api/templates/upload-image`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData
        });
        const data = await res.json();
        console.log('Upload response:', data);
        if (!res.ok) throw new Error(data.error || 'Image upload failed');
        setForm((prev) => ({ ...prev, previewImage: data.imagePath }));
      } catch (err) {
        setImageUploadError(err.message || 'Image upload failed');
        setForm((prev) => ({ ...prev, previewImage: '' }));
      }
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!form.name) errors.name = 'Name is required';
    if (!form.description) errors.description = 'Description is required';
    if (!form.category) errors.category = 'Category is required';
    if (!form.previewImage) errors.previewImage = 'Preview image is required';
    if (!form.defaultOrder || form.defaultOrder.length === 0) errors.defaultOrder = 'Default order is required';
    if (!form.sections || form.sections.length === 0) errors.sections = 'At least one section is required';
    form.sections.forEach((section, idx) => {
      if (!section.name) errors[`section_${idx}`] = 'Section name is required';
    });
    // Styling validation
    const a = form.styling.alignments || {};
    const l = form.styling.layout || {};
    const s = form.styling.sectionStyles || {};
    const requiredAlignments = ['contact', 'contentText', 'date', 'name', 'sectionTitle', 'title'];
    requiredAlignments.forEach(f => { if (!a[f]) errors[`alignments_${f}`] = `${f} alignment is required`; });
    if (!form.styling.fontFamily) errors.fontFamily = 'Font family is required';
    const requiredLayout = ['education', 'experience', 'projects', 'skills', 'summary'];
    requiredLayout.forEach(f => { if (!l[f]) errors[`layout_${f}`] = `${f} layout is required`; });
    if (!form.styling.primaryColor) errors.primaryColor = 'Primary color is required';
    const requiredSectionStyles = ['bulletStyle', 'contentFontSize', 'contentLineHeight', 'sectionTitleFontSize', 'sectionTitleFontWeight', 'spacing'];
    requiredSectionStyles.forEach(f => { if (!s[f]) errors[`sectionStyles_${f}`] = `${f} is required`; });
    return errors;
  };

  const handleSave = async () => {
    const errors = validateForm();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setSaving(true);
    setError('');
    try {
      // No image upload here; image is already uploaded in handleImageChange
      const token = await getAuth().currentUser.getIdToken();
      const method = editingTemplate ? 'PUT' : 'POST';
      const url = editingTemplate
        ? `${API_URL}/api/templates/${editingTemplate.id}`
        : `${API_URL}/api/templates`;
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error('Failed to save template');
      await fetchTemplates();
      setEditingTemplate(null);
      setForm(initialTemplate);
      setImageFile(null);
      setFormErrors({});
    } catch (err) {
      setError('Failed to save template');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this template?')) return;
    setDeletingId(id);
    setError('');
    try {
      const token = await getAuth().currentUser.getIdToken();
      const res = await fetch(`${API_URL}/api/templates/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete template');
      await fetchTemplates();
    } catch (err) {
      setError('Failed to delete template');
    } finally {
      setDeletingId(null);
    }
  };

  // Section management
  const handleAddSection = () => {
    setForm((prev) => ({
      ...prev,
      sections: [...prev.sections, { name: '', required: false }]
    }));
  };
  const handleSectionChange = (idx, field, value) => {
    setForm((prev) => ({
      ...prev,
      sections: prev.sections.map((s, i) => i === idx ? { ...s, [field]: value } : s)
    }));
  };
  const handleRemoveSection = (idx) => {
    setForm((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== idx)
    }));
  };

  // Styling management (individual fields)
  const handleStylingChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      styling: { ...prev.styling, [field]: value }
    }));
  };

  // Default order management
  const handleDefaultOrderChange = (e) => {
    setForm((prev) => ({
      ...prev,
      defaultOrder: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
    }));
  };

  // Image preview modal
  const openImageModal = (img) => {
    setImagePreview(img);
    setShowImageModal(true);
  };
  const closeImageModal = () => setShowImageModal(false);

  return (
    <Container className="mt-4">
      <h2>Template Management</h2>
      <Button className="mb-3" onClick={handleAdd}>Add Template</Button>
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Add/Edit Form */}
      <Card className="mb-4">
        <Card.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control name="name" value={form.name} onChange={handleChange} required isInvalid={!!formErrors.name} />
                  {formErrors.name && <div style={{ color: 'red', fontSize: 13 }}>{formErrors.name}</div>}
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control name="description" value={form.description} onChange={handleChange} required isInvalid={!!formErrors.description} />
                  {formErrors.description && <div style={{ color: 'red', fontSize: 13 }}>{formErrors.description}</div>}
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                    <Form.Select name="category" value={form.category} onChange={handleChange} style={{ flex: 1, minWidth: 180 }}>
                      {categoryOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </Form.Select>
                    <Form.Control
                      type="text"
                      placeholder="Add new category"
                      value={newCategory}
                      onChange={e => setNewCategory(e.target.value)}
                      style={{ flex: 1, minWidth: 120 }}
                    />
                    <Button
                      variant="outline-primary"
                      onClick={() => {
                        if (newCategory && !categoryOptions.includes(newCategory)) {
                          setCategoryOptions([...categoryOptions, newCategory]);
                          setForm(prev => ({ ...prev, category: newCategory }));
                          setNewCategory('');
                        }
                      }}
                      disabled={!newCategory || categoryOptions.includes(newCategory)}
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      Add
                    </Button>
                    {/* Remove button for custom categories */}
                    {categoryOptions.filter(opt => !['timeline-driven', 'balanced-combination', 'skills-focused'].includes(opt)).map(opt => (
                      <Button
                        key={opt}
                        variant="outline-danger"
                        size="sm"
                        style={{ padding: '0 6px', fontSize: 13, marginLeft: 4 }}
                        title={`Remove ${opt}`}
                        onClick={() => {
                          setCategoryOptions(prev => prev.filter(c => c !== opt));
                          if (form.category === opt) {
                            // If the removed category was selected, reset to first available
                            setForm(prev => ({ ...prev, category: categoryOptions.find(c => c !== opt) || '' }));
                          }
                        }}
                      >
                        ×
                      </Button>
                    ))}
                  </div>
                  {formErrors.category && <div style={{ color: 'red', fontSize: 13 }}>{formErrors.category}</div>}
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Preview Image</Form.Label>
                  <Form.Control type="file" accept="image/*" onChange={handleImageChange} isInvalid={!!formErrors.previewImage} />
                  {form.previewImage && (
                    <Button variant="link" onClick={() => openImageModal(imagePreview || form.previewImage)}>
                      <img src={imagePreview || form.previewImage} alt="preview" style={{ width: 60, height: 60, objectFit: 'contain', marginTop: 8 }} />
                    </Button>
                  )}
                  {formErrors.previewImage && <div style={{ color: 'red', fontSize: 13 }}>{formErrors.previewImage}</div>}
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Active"
                    name="isActive"
                    checked={form.isActive}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Default Order (comma separated)</Form.Label>
                  <Form.Control
                    name="defaultOrder"
                    value={form.defaultOrder.join(', ')}
                    onChange={handleDefaultOrderChange}
                    isInvalid={!!formErrors.defaultOrder}
                  />
                  {formErrors.defaultOrder && <div style={{ color: 'red', fontSize: 13 }}>{formErrors.defaultOrder}</div>}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Label>Sections</Form.Label>
                {form.sections.map((section, idx) => (
                  <Row key={idx} className="mb-2 align-items-center">
                    <Col xs={6}>
                      <Form.Control
                        placeholder="Section name"
                        value={section.name}
                        onChange={e => handleSectionChange(idx, 'name', e.target.value)}
                        isInvalid={!!formErrors[`section_${idx}`]}
                      />
                      {formErrors[`section_${idx}`] && <div style={{ color: 'red', fontSize: 13 }}>{formErrors[`section_${idx}`]}</div>}
                    </Col>
                    <Col xs={4}>
                      <Form.Check
                        type="checkbox"
                        label="Required"
                        checked={section.required}
                        onChange={e => handleSectionChange(idx, 'required', e.target.checked)}
                      />
                    </Col>
                    <Col xs={2}>
                      <Button size="sm" variant="danger" onClick={() => handleRemoveSection(idx)}>-</Button>
                    </Col>
                  </Row>
                ))}
                {formErrors.sections && <div style={{ color: 'red', fontSize: 13 }}>{formErrors.sections}</div>}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button size="sm" variant="secondary" onClick={handleAddSection} className="mb-3">Add Section</Button>
                </div>
                <hr />
                <Form.Label>Styling</Form.Label>
                <Form.Group className="mb-2">
                  <Form.Label>Alignments</Form.Label>
                  {['contact', 'contentText', 'date', 'name', 'sectionTitle', 'title'].map(f => (
                    <div key={f} className="mb-2">
                      <Form.Label>{f.charAt(0).toUpperCase() + f.slice(1)}</Form.Label>
                      <Form.Control
                        value={form.styling.alignments?.[f] || ''}
                        onChange={e => setForm(prev => ({
                          ...prev,
                          styling: {
                            ...prev.styling,
                            alignments: { ...prev.styling.alignments, [f]: e.target.value }
                          }
                        }))}
                        placeholder={`e.g. ${f === 'contact' || f === 'name' || f === 'title' ? 'center' : f === 'contentText' || f === 'sectionTitle' ? 'left' : 'right'}`}
                        isInvalid={!!formErrors[`alignments_${f}`]}
                      />
                      {formErrors[`alignments_${f}`] && <div style={{ color: 'red', fontSize: 13 }}>{formErrors[`alignments_${f}`]}</div>}
                    </div>
                  ))}
                  <Form.Label>Font Family</Form.Label>
                  <Form.Control
                    value={form.styling.fontFamily || ''}
                    onChange={e => setForm(prev => ({ ...prev, styling: { ...prev.styling, fontFamily: e.target.value } }))}
                    placeholder="e.g. Inter"
                    isInvalid={!!formErrors.fontFamily}
                  />
                  {formErrors.fontFamily && <div style={{ color: 'red', fontSize: 13 }}>{formErrors.fontFamily}</div>}
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Layout</Form.Label>
                  {['education', 'experience', 'projects', 'skills', 'summary'].map(f => (
                    <div key={f} className="mb-2">
                      <Form.Label>{f.charAt(0).toUpperCase() + f.slice(1)}</Form.Label>
                      <Form.Control
                        value={form.styling.layout?.[f] || ''}
                        onChange={e => setForm(prev => ({
                          ...prev,
                          styling: {
                            ...prev.styling,
                            layout: { ...prev.styling.layout, [f]: e.target.value }
                          }
                        }))}
                        placeholder={f === 'skills' ? 'inline-list' : f === 'summary' ? 'full-width' : 'block'}
                        isInvalid={!!formErrors[`layout_${f}`]}
                      />
                      {formErrors[`layout_${f}`] && <div style={{ color: 'red', fontSize: 13 }}>{formErrors[`layout_${f}`]}</div>}
                    </div>
                  ))}
                  <Form.Label>Primary Color</Form.Label>
                  <Form.Control
                    type="color"
                    value={form.styling.primaryColor || ''}
                    onChange={e => setForm(prev => ({ ...prev, styling: { ...prev.styling, primaryColor: e.target.value } }))}
                    isInvalid={!!formErrors.primaryColor}
                    style={{ width: 60, height: 34, padding: 0, border: 'none', background: 'none' }}
                  />
                  {formErrors.primaryColor && <div style={{ color: 'red', fontSize: 13 }}>{formErrors.primaryColor}</div>}
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Section Styles</Form.Label>
                  {['bulletStyle', 'contentFontSize', 'contentLineHeight', 'sectionTitleFontSize', 'sectionTitleFontWeight', 'spacing'].map(f => (
                    <div key={f} className="mb-2">
                      <Form.Label>{f.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}</Form.Label>
                      <Form.Control
                        value={form.styling.sectionStyles?.[f] || ''}
                        onChange={e => setForm(prev => ({
                          ...prev,
                          styling: {
                            ...prev.styling,
                            sectionStyles: { ...prev.styling.sectionStyles, [f]: e.target.value }
                          }
                        }))}
                        placeholder={
                          f === 'bulletStyle' ? 'disc' :
                          f === 'contentFontSize' ? '14px' :
                          f === 'contentLineHeight' ? '1.5' :
                          f === 'sectionTitleFontSize' ? '16px' :
                          f === 'sectionTitleFontWeight' ? '600' :
                          f === 'spacing' ? 'e.g. 1.5rem' : ''
                        }
                        isInvalid={!!formErrors[`sectionStyles_${f}`]}
                      />
                      {formErrors[`sectionStyles_${f}`] && <div style={{ color: 'red', fontSize: 13 }}>{formErrors[`sectionStyles_${f}`]}</div>}
                    </div>
                  ))}
                </Form.Group>
              </Col>
            </Row>
            <Button variant="primary" onClick={handleSave} disabled={saving} className="mt-3">
              {saving ? 'Saving...' : (editingTemplate ? 'Update Template' : 'Add Template')}
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {/* Template Cards */}
      <Row xs={1} md={2} lg={3} className="g-4">
        {templates.map((tpl) => (
          <Col key={tpl.id}>
            <Card className="h-100">
              {tpl.previewImage && (
                <Card.Img
                  variant="top"
                  src={tpl.previewImage}
                  alt="preview"
                  style={{ height: 120, objectFit: 'contain', cursor: 'pointer' }}
                  onClick={() => openImageModal(tpl.previewImage)}
                />
              )}
              <Card.Body>
                <Card.Title>{tpl.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{tpl.category}</Card.Subtitle>
                <Card.Text>{tpl.description}</Card.Text>
                <div><strong>Active:</strong> {tpl.isActive ? 'Yes' : 'No'}</div>
                <div className="mt-2">
                  <Button size="sm" variant="info" onClick={() => handleEdit(tpl)} className="me-2">Edit</Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(tpl.id)} disabled={deletingId === tpl.id}>
                    {deletingId === tpl.id ? 'Deleting...' : 'Delete'}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Image Preview Modal */}
      <Modal show={showImageModal} onHide={closeImageModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Image Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {imagePreview && <img src={imagePreview} alt="preview" style={{ maxWidth: '100%', maxHeight: 400 }} />}
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default AdminTemplates; 