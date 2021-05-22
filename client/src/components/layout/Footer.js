import React from "react";

export default props => {
  const faqItem = (

    <a className="bg-dark text-white ml-auto p-2 bd-highlight"

      href="http://h2088653.stratoserver.net/closeuptogether/faq/closeup-faq.html"
      target="_blank"
    >
      FAQ <i className="fa fa-question-circle" />
    </a>

  );
  const outSessionContent = (
    <footer id="main-footer" className="d-flex bd-highlight mb-3 bg-dark text-white">
      <span className="ml-auto p-2 bd-highlight"></span>      Copyright &copy; {new Date().getFullYear()} VideoCollab

      {/* faqItem*/}
    </footer>
  );

  if (!props.isSession) return outSessionContent;

  return null;
};
