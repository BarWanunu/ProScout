import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { TextField, FormStepper, ImagePicker } from "../../../../components/common";
import useProfileForm from "../../hooks/useProfileForm";
import "../../../../styles/SignupStyles/ScoutSignup.css";

export default function ScoutSignup() {
  const nav = useNavigate();
  const { state:creds } = useLocation();

  /* ---------- form ---------- */
  const validate = v => {
    const e = {};
    if (!v.firstName) e.firstName = "Required";
    if (!v.surname)   e.surname   = "Required";
    if (!v.phone)     e.phone     = "Phone required";
    if (!v.experience || v.experience < 0) e.experience = "Years?";
    return e;
  };

  const { values, errors, touched, onChange, onBlur, setField, validate:ok }
      = useProfileForm({ firstName:"", surname:"", phone:"",
                         nationality:"", experience:"", image:null }, validate);
  if (!creds) return <Navigate to="/signup" />;

  const submit = e => {
    e.preventDefault();
    if (!ok()) return;
    nav("/login/scout",  { state: { justSignedUp: true } });
  };

  return (
    <div className="ss-wrapper">
      <h1 className="ss-headline">Scout Profile</h1>
      <form className="ss-form" onSubmit={submit}>
        <TextField id="firstName" label="First Name"  value={values.firstName}
                   onChange={onChange} onBlur={onBlur}
                   touched={touched.firstName} error={errors.firstName}/>
        <TextField id="surname"   label="Surname"    value={values.surname}
                   onChange={onChange} onBlur={onBlur}
                   touched={touched.surname} error={errors.surname}/>
        <TextField id="phone"     label="Phone"      value={values.phone}
                   onChange={onChange} onBlur={onBlur}
                   touched={touched.phone} error={errors.phone}/>
        <TextField id="nationality" label="Nationality"
                   value={values.nationality} onChange={onChange}/>
        <TextField id="experience" label="Experience (years)" type="number"
                   value={values.experience} onChange={onChange}
                   onBlur={onBlur} touched={touched.experience}
                   error={errors.experience}/>
        <ImagePicker id="image" label="Profile Image"
                     value={values.image}
                     onChange={file => setField("image", file)} />
        <button className="ss-submit">Finish Sign‑Up</button>
        <FormStepper step={1}/>
      </form>
    </div>
  );
}
