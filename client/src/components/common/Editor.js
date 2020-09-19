import React, { Component } from 'react';

import { encodePostPreview } from '../../util/Encoder'

import './Editor.css';

class PostInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      preview: false,
      latestValue: this.props.value,
      previewContent: {__html:''}
    };

    this.showWrite = this.showWrite.bind(this);
    this.showPreview = this.showPreview.bind(this);
  }

  showWrite() {
    this.setState({
      preview: false
    });
  }

  showPreview() {
    if(this.props.value===this.state.latestValue){
      this.setState({
        preview: true
      });
    } else {
      this.setState({
        preview: true,
        latestValue: this.props.value,
        previewContent: encodePostPreview(this.props.value)
      });
    }
  }

  render() {
    let { name, value, onChange } = this.props;

    return(
      <div className="editor">
        <div className="editor-header">
          <nav className="editor-tabs">
            <button type="button" onClick={this.showWrite} className={"editor-tab" + (this.state.preview?"":" editor-tab-active")}>Write</button>
            <button type="button" onClick={this.showPreview} className={"editor-tab" + (this.state.preview?" editor-tab-active":"")}>Preview</button>
          </nav>
        </div>

        {
          this.state.preview?
          <div className="editor-body editor-show">
            <div className="editor-preview" dangerouslySetInnerHTML={this.state.previewContent}></div>
          </div>
          :
          <div className="editor-body editor-show">
            <textarea name={name} className='form-control editor-content' value={value} onChange={(e) => {e.persist(); onChange(e)}} placeholder="Enter text" spellCheck="false"></textarea>
          </div>
        }

        <div className="editor-footer">
          Katex editor
        </div>
      </div>
    );
  }
}
  
export default PostInput;