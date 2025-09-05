import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { TextField, FormStepper, ImagePicker } from "../../../../components/common";
import { LEAGUES } from "../../../../constants/leagues";
import useProfileForm from "../../hooks/useProfileForm";
import "../../../../styles/SignupStyles/TeamSignup.css";

export default function TeamSignup() {
  const nav = useNavigate();
  const { state:creds } = useLocation();
  const validate = v => {
    const e = {};
    if (!v.name)     e.name = "Team name required";
    if (!v.league)   e.league = "Pick league";
    if (!v.formation) e.formation = "Required";
    return e;
  };

  const { values, errors, touched, onChange, onBlur, setField, validate:ok }
      = useProfileForm({ name:"", league:"", country:"", formation:"",
                         stadium:"", logo:null }, validate);
  if (!creds) return <Navigate to="/signup" />;

  const onLeague = e => {
    const league = e.target.value;
    const l = LEAGUES.find(l=>l.id===league);
    setField("league", league);
    setField("country", l ? l.country : "");
  };

  const submit = e => {
    e.preventDefault();
    if (!ok()) return;
    nav("/login/team", { state: { justSignedUp: true } });
  };

  return (
    <div className="ts-wrapper">
      <h1 className="ts-headline">Team Profile</h1>
      <form className="ts-form" onSubmit={submit}>
        <TextField id="name" label="Team Name"
                   value={values.name} onChange={onChange}
                   onBlur={onBlur} touched={touched.name}
                   error={errors.name}/>
        <label>League</label>
        <select name="league" value={values.league} onChange={onChange} onClick={onLeague} onBlur={onBlur}>
          <option value="">Select league</option>
          {LEAGUES.map(l => <option key={l.id} value={l.id}>{l.label}</option>)}
        </select>
        {touched.league && errors.league && <span className="error-message">{errors.league}</span>}

        <TextField id="country" label="Country" value={values.country} onChange={onChange} readOnly/>

        <TextField id="formation" label="Playing Formation (4‑3‑3...)"
                   value={values.formation} onChange={onChange}
                   onBlur={onBlur} touched={touched.formation}
                   error={errors.formation}/>

        <TextField id="stadium" label="Stadium" value={values.stadium} onChange={onChange}/>

        <ImagePicker id="logo" label="Team Logo"
                     value={values.logo}
                     onChange={file => setField("logo", file)} />

        <button className="ts-submit">Finish Sign‑Up</button>
        <FormStepper step={1}/>
      </form>
    </div>
  );
}
