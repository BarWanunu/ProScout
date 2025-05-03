import "./FormStepper.css";

// This component is used to display the progress of a multi-step form. It shows the current step and the steps that have been completed.
export default function FormStepper({ step = 0 }) {
    return (
      <div className="form-progress">
        <div className={`progress-step ${step >= 0 ? "active" : ""}`}>Account</div>
        <div className="progress-connector" />
        <div className={`progress-step ${step >= 1 ? "active" : ""}`}>Profile</div>
        <div className="progress-connector" />
        <div className={`progress-step ${step >= 2 ? "active" : ""}`}>Complete</div>
      </div>
    );
  }
  