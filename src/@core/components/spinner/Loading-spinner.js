const ComponentSpinner = (props) => {
  return (
    <div className="fallback-spinner app-loader" style={{position:"fixed", width: "100%", height: "100%", zIndex: "999", left: "0", top: "0", background: "rgba(255,255,255,0.84)"}}>
      {props?.txt && <h3>{props?.txt}...</h3>}
      <div className="loading">
        <div className="effect-1 effects"></div>
        <div className="effect-2 effects"></div>
        <div className="effect-3 effects"></div>
      </div>
    </div>
  )
}

export default ComponentSpinner
