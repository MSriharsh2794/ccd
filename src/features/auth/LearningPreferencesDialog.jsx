import { useState } from 'react'
import { ArrowRight, X } from 'lucide-react'
import { learningOptions } from './learningOptions.js'

function LearningPreferencesDialog({ initialSelection, onSave, onClose }) {
  const customInterest = initialSelection.find((item) => item.startsWith('Other: ')) || ''
  const [selectedTechnologies, setSelectedTechnologies] = useState(() => initialSelection.filter((item) => !item.startsWith('Other: ')))
  const [otherSelected, setOtherSelected] = useState(Boolean(customInterest))
  const [otherTechnology, setOtherTechnology] = useState(customInterest.slice('Other: '.length))
  const [validationMessage, setValidationMessage] = useState('')

  function toggleTechnology(technology) {
    if (technology === 'Other') {
      setOtherSelected((current) => {
        if (current) setOtherTechnology('')
        return !current
      })
      setValidationMessage('')
      return
    }

    setSelectedTechnologies((current) => current.includes(technology)
      ? current.filter((item) => item !== technology)
      : [...current, technology])
    setValidationMessage('')
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (otherSelected && !otherTechnology.trim()) {
      setValidationMessage('Enter the technology you want to learn.')
      return
    }

    const savedInterests = [
      ...selectedTechnologies,
      ...(otherSelected ? [`Other: ${otherTechnology.trim()}`] : []),
    ]
    onSave(savedInterests)
  }

  return (
    <div className="story-backdrop learning-form-backdrop" onClick={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="login-dialog learning-form-dialog" role="dialog" aria-modal="true" aria-labelledby="learning-form-title">
        <button className="story-close" type="button" aria-label="Close learning form" autoFocus onClick={onClose}><X size={19} /></button>
        <p className="eyebrow"><span className="eyebrow-line" /> Learning interests</p>
        <h2 id="learning-form-title">What do you want to learn?</h2>
        <p className="login-copy">Select at least one technology and save your choices.</p>
        <form onSubmit={handleSubmit}>
          <fieldset className="technology-options">
            <legend>Technologies</legend>
            <div className="technology-options-grid">
              {learningOptions.map((technology) => (
                <label key={technology}>
                  <input
                    type="checkbox"
                    checked={technology === 'Other' ? otherSelected : selectedTechnologies.includes(technology)}
                    onChange={() => toggleTechnology(technology)}
                  />
                  <span>{technology}</span>
                </label>
              ))}
            </div>
            {otherSelected && (
              <label className="other-technology-field">
                <span>Other technology</span>
                <input
                  type="text"
                  value={otherTechnology}
                  onChange={(event) => setOtherTechnology(event.target.value)}
                  placeholder="Enter a technology"
                  required
                />
              </label>
            )}
          </fieldset>
          {validationMessage && <p className="login-message" role="status">{validationMessage}</p>}
          <div className="learning-form-actions">
            <button className="login-button" type="button" onClick={onClose}>Cancel</button>
            <button className="login-submit" type="submit" disabled={selectedTechnologies.length === 0 && !otherSelected}>
              Save learning interests <ArrowRight size={16} />
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default LearningPreferencesDialog