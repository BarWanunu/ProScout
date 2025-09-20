import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { TextField, FormStepper, ImagePicker, FilePicker } from "../../../layout/common";
import { POSITIONS } from "../../../data/positions";
import useProfileForm from "../../hooks/useProfileForm";
import "../../../styles/Signup/PlayerSignup.css";
import playerService from "@/api/services/playerService";

export default function PlayerSignup() {
  const nav = useNavigate();
  const { state: creds } = useLocation();

  const validate = (v) => {
    const e = {};
    if (!v.firstName) e.firstName = "Required";
    if (!v.lastName) e.lastName = "Required";
    if (!v.fullName) e.fullName = "Required";
    if (!v.age || v.age < 16 || v.age > 45) e.age = "16-45 only";
    if (!v.position) e.position = "Pick a position";
    return e;
  };

  const { values, errors, touched, onChange, onBlur, setField, validate: ok } =
    useProfileForm({
      firstName: "", lastName: "", fullName: "",
      team: "", kit: "", position: "", age: "",
      height: "", weight: "", nationality: "", birth: "",
      image: null, video: null,
    }, validate);

  if (!creds) return <Navigate to="/signup" />;

  const submit = async (e) => {
    e.preventDefault();
    if (!ok()) return;

    const profileData = {
      name: values.fullName,
      first_name: values.firstName,
      last_name: values.lastName,
      age: values.age,
      club: values.team,
      number: values.kit,
      position: values.position,
      height: values.height,
      weight: values.weight,
      nationality: values.nationality,
      birthdate: values.birth,
      photo: values.image,
      video: values.video,
    };

    const token = localStorage.getItem("token")

    try {
      await playerService.registerPlayer(profileData, token);
      nav("/login/player", { state: { justSignedUp: true } });
    } catch (err) {
      alert(err?.message || "Registration failed.");
    }
  };

  return (
    <div className="ps-wrapper">
      <h1 className="ps-headline">Player Profile</h1>
      <form className="ps-form" onSubmit={submit}>
        <TextField id="firstName" label="First Name" value={values.firstName}
                   onChange={onChange} onBlur={onBlur}
                   touched={touched.firstName} error={errors.firstName}/>
        <TextField id="lastName" label="Last Name" value={values.lastName}
                   onChange={onChange} onBlur={onBlur}
                   touched={touched.lastName} error={errors.lastName}/>
        <TextField id="fullName" label="Full Name" value={values.fullName}
                   onChange={onChange} onBlur={onBlur}
                   touched={touched.fullName} error={errors.fullName}/>
        <TextField id="age" label="Age" type="number" value={values.age}
                   onChange={onChange} onBlur={onBlur}
                   touched={touched.age} error={errors.age} placeholder="16-45"/>

        <TextField id="team" label="Team" placeholder="Free agent allowed"
                   value={values.team} onChange={onChange}/>
        <TextField id="kit" label="Kit Number" type="number"
                   value={values.kit} onChange={onChange}/>

        <label>Position</label>
        <select name="position" value={values.position} onChange={onChange} onBlur={onBlur}>
          <option value="">Select position</option>
          {POSITIONS.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        {touched.position && errors.position && <span className="error-message">{errors.position}</span>}

        <div className="grid-two">
          <TextField id="height" label="Height (cm)" type="number"
                     value={values.height} onChange={onChange}/>
          <TextField id="weight" label="Weight (kg)" type="number"
                     value={values.weight} onChange={onChange}/>
        </div>

        <TextField id="nationality" label="Nationality" value={values.nationality} onChange={onChange}/>
        <TextField id="birth" label="Birth Date" type="date" value={values.birth} onChange={onChange}/>

        <ImagePicker id="image" label="Profile Image" value={values.image}
                     onChange={(file) => setField("image", file)}/>
        <FilePicker id="video" label="Highlight Video (optional)" accept="video/*"
                    value={values.video} onChange={(file) => setField("video", file)}/>
        <button className="ps-submit">Finish Sign Up</button>
        <FormStepper step={1}/>
      </form>
    </div>
  );
}
