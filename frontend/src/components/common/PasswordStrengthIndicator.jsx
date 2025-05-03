import "./PasswordStrengthIndicator.css";


// This component is used to display the strength of a password. It shows a visual representation of the password strength based on its length and complexity.
export default function PasswordStrengthIndicator({value}) {
  return (
    value && (
        <div className="password-strength">
            <div className="strength-meter">
                <div
                    className={`strength-value ${
                    value.length >= 8 ?
                    (/[A-Z]/.test(value) && /[a-z]/.test(value) && /[0-9]/.test(value) && /[^A-Za-z0-9]/.test(value) ? 
                    'strong' : 'medium') 
                    : 'weak'
                    }`}
                ></div>
            </div>
            <span className="strength-text">
                {value.length < 8 ? 'Weak' : 
                    (/[A-Z]/.test(value) && /[a-z]/.test(value) && /[0-9]/.test(value) && /[^A-Za-z0-9]/.test(value) ? 
                    'Strong' : 'Medium')}
            </span>
        </div>
    )
  );
}
