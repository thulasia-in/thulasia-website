import React, { useState } from 'react';
import { BookOpen, Plus, Edit, Trash, Clock, Users, ArrowUpRight } from 'lucide-react';

export default function RecipeManager({ recipes, onAddRecipe, onUpdateRecipe, onDeleteRecipe }) {
  const [showForm, setShowForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emptyForm = {
    title: '', desc: '', prepTime: '5 mins', cookTime: '5 mins',
    serves: '2', difficulty: 'Easy', productUsed: '', ingredients: '', steps: ''
  };
  const [form, setForm] = useState(emptyForm);

  const openAddForm = () => {
    setEditingRecipe(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEditForm = (recipe) => {
    setEditingRecipe(recipe);
    setForm({
      title: recipe.title,
      desc: recipe.desc || '',
      prepTime: recipe.prepTime || '5 mins',
      cookTime: recipe.cookTime || '5 mins',
      serves: recipe.serves || '2',
      difficulty: recipe.difficulty || 'Easy',
      productUsed: recipe.productUsed || '',
      ingredients: (recipe.ingredients || []).join('\n'),
      steps: (recipe.steps || []).join('\n')
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      ...form,
      ingredients: form.ingredients.split('\n').map(i => i.trim()).filter(Boolean),
      steps: form.steps.split('\n').map(s => s.trim()).filter(Boolean)
    };

    let success = false;
    if (editingRecipe) {
      success = await onUpdateRecipe(editingRecipe.id, payload);
    } else {
      success = await onAddRecipe(payload);
    }

    setIsSubmitting(false);
    if (success) {
      setShowForm(false);
      setEditingRecipe(null);
      setForm(emptyForm);
    } else {
      alert('Failed to save recipe. Please check server connection.');
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <BookOpen size={22} /> Recipe Hub Manager
          <span style={{ fontSize: '14px', fontWeight: 600, backgroundColor: 'var(--bg-cream)', padding: '2px 10px', borderRadius: '20px', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
            {recipes.length} recipes
          </span>
        </h3>
        <button onClick={openAddForm} className="btn btn-primary" style={{ fontSize: '13px', padding: '8px 18px' }}>
          <Plus size={15} /> Add Recipe
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div style={{
          backgroundColor: 'var(--bg-cream)',
          border: '2px solid var(--primary)',
          borderRadius: '16px',
          padding: '28px',
          marginBottom: '28px',
          animation: 'fadeIn 0.3s ease'
        }}>
          <h4 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '20px', color: 'var(--primary-dark)' }}>
            {editingRecipe ? `✏️ Editing Recipe: ${editingRecipe.title}` : '➕ Add New Recipe'}
          </h4>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label className="form-label">Recipe Title *</label>
                <input className="form-control" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Poondu Podi Ghee Rice" />
              </div>
              <div>
                <label className="form-label">Product Used *</label>
                <input className="form-control" required value={form.productUsed} onChange={e => setForm({ ...form, productUsed: e.target.value })} placeholder="e.g. Poondu Podi (Garlic Podi)" />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label className="form-label">Short Description *</label>
              <input className="form-control" required value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} placeholder="Brief summary of the dish..." />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label className="form-label">Prep Time</label>
                <input className="form-control" value={form.prepTime} onChange={e => setForm({ ...form, prepTime: e.target.value })} placeholder="5 mins" />
              </div>
              <div>
                <label className="form-label">Cook Time</label>
                <input className="form-control" value={form.cookTime} onChange={e => setForm({ ...form, cookTime: e.target.value })} placeholder="10 mins" />
              </div>
              <div>
                <label className="form-label">Serves</label>
                <input className="form-control" value={form.serves} onChange={e => setForm({ ...form, serves: e.target.value })} placeholder="2" />
              </div>
              <div>
                <label className="form-label">Difficulty</label>
                <select className="form-control" value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })}>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label className="form-label">Ingredients (One per line) *</label>
                <textarea className="form-control" rows={5} required value={form.ingredients} onChange={e => setForm({ ...form, ingredients: e.target.value })} placeholder="2 cups Cooked Steaming Hot Ponni Rice&#10;2 tbsp Thulasia Poondu Podi&#10;2 tbsp Cow Ghee" />
              </div>
              <div>
                <label className="form-label">Steps / Instructions (One per line) *</label>
                <textarea className="form-control" rows={5} required value={form.steps} onChange={e => setForm({ ...form, steps: e.target.value })} placeholder="Ensure cooked rice is steaming hot and dry.&#10;Add 2 tablespoons of cow ghee.&#10;Sprinkle Thulasia Poondu Podi and mix gently." />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary">Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ minWidth: '120px' }}>
                {isSubmitting ? 'Saving...' : (editingRecipe ? '💾 Save Changes' : '✅ Add Recipe')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Recipes Table */}
      {recipes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          <BookOpen size={44} style={{ margin: '0 auto 16px', opacity: 0.25 }} />
          <p style={{ fontWeight: 600, fontSize: '16px' }}>No recipes listed yet</p>
          <p style={{ fontSize: '13px', marginTop: '4px' }}>Click "Add Recipe" to list your first recipe guide.</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-cream)', borderBottom: '2px solid var(--border-color)' }}>
                {['Recipe Title', 'Product Association', 'Details', 'Ingredients/Steps', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recipes.map((r, idx) => (
                <tr key={r.id} style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: idx % 2 === 0 ? 'white' : 'var(--bg-cream)' }}>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ fontWeight: 700, color: 'var(--primary)' }}>{r.title}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{r.desc}</div>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ backgroundColor: 'rgba(180,133,72,0.1)', color: 'var(--accent)', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>
                      {r.productUsed}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', gap: '8px', fontSize: '11px', color: 'var(--text-dark)' }}>
                      <span>⏱️ {r.prepTime} / {r.cookTime}</span>
                      <span>•</span>
                      <span>👥 Serves {r.serves}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px', color: 'var(--text-muted)', fontSize: '11px' }}>
                    <div>🛒 {(r.ingredients || []).length} ingredients</div>
                    <div>📜 {(r.steps || []).length} steps</div>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => openEditForm(r)} style={{ border: 'none', background: 'rgba(17,61,38,0.07)', color: 'var(--primary)', cursor: 'pointer', padding: '6px 8px', borderRadius: '6px' }} title="Edit">
                        <Edit size={14} />
                      </button>
                      <button onClick={() => { if (window.confirm(`Delete recipe "${r.title}"?`)) onDeleteRecipe(r.id); }} style={{ border: 'none', background: '#FFEBEE', color: '#C62828', cursor: 'pointer', padding: '6px 8px', borderRadius: '6px' }} title="Delete">
                        <Trash size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
