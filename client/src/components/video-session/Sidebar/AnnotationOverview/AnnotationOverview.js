import React, { Component } from "react";
import classnames from "classnames";
import connectShared from "../../../../highOrderComponents/SharedRoomDataConsumer";
import "./annotation-overview.css";
import AnnotationEntry from "./AnnotationEntry";

class AnnotationOverview extends Component {
  getValidAnnotationContent() {
    var annotationsObj = this.props.sharedRoomData.annotations;
    var annotationKeys = Object.keys(annotationsObj);

    annotationKeys.sort((a, b) => {
      return parseFloat(a) - parseFloat(b);
    });

    const listElements = annotationKeys.map(annotationTimeStamp => {
      return (
        <AnnotationEntry
          key={annotationTimeStamp}
          timeStamp={parseFloat(annotationTimeStamp)}
          data={annotationsObj[annotationTimeStamp]}
        />
      );
    });

    return <ul className="list-group list-group-flush">{listElements}</ul>;
  }

  render() {
    var annotationsObj = this.props.sharedRoomData.annotations;

    var targetContent = null;

    if (!annotationsObj || Object.keys(annotationsObj).length === 0) {
      targetContent = (
        <p className="text-center text-muted mt-5">No annotations available</p>
      );
    } else {
      targetContent = this.getValidAnnotationContent();
    }

    return (
      <div
        className={classnames("annotation-overview", {
          "hidden-nosize": !this.props.visible
        })}
      >
        {targetContent}
      </div>
    );
  }
}

export default connectShared(AnnotationOverview);
