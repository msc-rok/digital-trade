var React = require("react");
var Dropzone = require('react-dropzone');
var request = require('superagent');

const CLOUDINARY_UPLOAD_PRESET = 'o5dy6l5w';
const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/hdvhoxcbj/image/upload';

var App = React.createClass({
  // Set up initial state
  getInitialState: function() {
    return {
      uploadedFile: null,
      uploadedFileCloudinaryUrl: ''
    };
  }
,
  onImageDrop: function(files) {
    this.setState({
      uploadedFile: files[0]
    });

    this.handleImageUpload(files[0]);
  }
,
  handleImageUpload: function(file) {
    let upload = request.post(CLOUDINARY_UPLOAD_URL)
                     .field('upload_preset', CLOUDINARY_UPLOAD_PRESET)
                     .field('file', file);

    upload.end((err, response) => {
      if (err) {
        console.error(err);
      }

      if (response.body.secure_url !== '') {
        this.setState({
          uploadedFileCloudinaryUrl: response.body.secure_url
        });
      }

      
    });
  },

   render: function() {
    return (
      <form>
        <div className="FileUpload">
          <Dropzone
            onDrop={this.onImageDrop.bind(this)}
            multiple={false}
            accept="image/*">
            <div>Drop an image or click to select a file to upload.</div>
          </Dropzone>
        </div>

        <div>
          {this.state.uploadedFileCloudinaryUrl === '' ? null :
          <div>
            <p>{this.state.uploadedFile.name}</p>
            <img src={this.state.uploadedFileCloudinaryUrl} />
          </div>}
        </div>
      </form>
    )
  }
});

module.exports = App;