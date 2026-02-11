import "./LoadingSpinner.css";

function LoadingSpinner({ size = "medium", text = "Loading..." }) {
  return (
    <div className={`loading-container ${size}`}>
      <div className="chocolate-loader">
        <div className="chocolate-bar bar-1"></div>
        <div className="chocolate-bar bar-2"></div>
        <div className="chocolate-bar bar-3"></div>
        <div className="chocolate-bar bar-4"></div>
        <div className="chocolate-bar bar-5"></div>
      </div>
      {text && <p className="loading-text">{text}</p>}
    </div>
  );
}

export default LoadingSpinner;
