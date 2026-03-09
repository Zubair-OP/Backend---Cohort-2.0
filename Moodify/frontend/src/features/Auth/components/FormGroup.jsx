const FormGroup = ({label, placeholder, value , onChange}) => {
  return (
    <div className='form-group'>
        <label htmlFor={label}>{label}</label>
        <input value={value} onChange={onChange} type="text" id={label} name={label} placeholder={placeholder} />
    </div>
  )
}

export default FormGroup