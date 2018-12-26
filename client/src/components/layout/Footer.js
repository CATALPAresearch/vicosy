import React from "react";

export default props => {
  const outSessionContent = (
    <footer id="main-footer" className="bg-dark text-white text-center mt-5">
      Copyright &copy; {new Date().getFullYear()} CloseUpTogether
    </footer>
  );

  if (!props.isSession) return outSessionContent;

  return null;
};
