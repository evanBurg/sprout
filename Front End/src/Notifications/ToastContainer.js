import React, { Component } from "react";
import { Context } from "../App";
import { Toast } from 'react-onsenui'

/*
    Toast Structure
    {
        msg: String
        animation: Enum (default | ascend | lift | fall | fade | none)
        animationOptions: Object,
        timeout: Number
        Sound: URI
    }
*/

class ToastContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      styles: {
        container: {
          position: "fixed",
          bottom: 25,
          left: 5,
          right: 5
        }
      }
    };
  }

  render() {
    let { styles } = this.state;
    let { toasts } = this.props;

    toasts = []
    return (
      <Context.Consumer>
        {context => <div id="toast-container" style={styles.container}>
            {toasts.map(toast => {
                return <Toast animation={toast.animation} animationOptions={toast.animationOptions} timeout={toast.timeout}>
                    {toast.msg}
                </Toast>
            })}
        </div>}
      </Context.Consumer>
    );
  }
}

export default ToastContainer;
