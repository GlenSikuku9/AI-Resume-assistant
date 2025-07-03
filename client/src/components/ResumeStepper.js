import React from 'react';
import './ResumeStepper.css';

const steps = [
  { label: 'Choose Template' },
  { label: 'Job Description' },
  { label: 'Profile' },
  { label: 'Editor' }
];

function ResumeStepper({ currentStep }) {
  return (
    <div className="resume-stepper-container">
      <ol className="resume-stepper">
        {steps.map((step, idx) => {
          const stepNum = idx + 1;
          const isActive = currentStep === stepNum;
          const isCompleted = currentStep > stepNum;
          return (
            <li
              key={step.label}
              className={`resume-stepper-step${isActive ? ' active' : ''}${isCompleted ? ' completed' : ''}`}
            >
              <div className="step-circle">
                {isCompleted ? <span className="step-check">&#10003;</span> : stepNum}
              </div>
              <div className="step-label">{step.label}</div>
              {idx < steps.length - 1 && <div className="step-bar" />}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export default ResumeStepper; 