import React from 'react';
import Dropzone from 'react-dropzone';
import request from 'superagent';

const CLOUDINARY_UPLOAD_PRESET = 'o5dy6l5w';
const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/hdvhoxcbj/image/upload';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      uploadedFile: null,
      uploadedFileCloudinaryUrl: ''
    };
  }

  onImageDrop(files) {
    this.setState({
      uploadedFile: files[0]
    });

    this.handleImageUpload(files[0]);
  }

  handleImageUpload(file) {
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
  }

  render() {
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
}

angular.module('digital-trade',
    [
        'ui.router',
        'ngFileUpload',
        'ngMaterial'
    ]
);

angular.module('digital-trade').config(function($stateProvider, $urlRouterProvider, $locationProvider,  $mdGestureProvider) {

    $mdGestureProvider.skipClickHijack();

    $locationProvider.html5Mode({
        enabled: false,
        hashPrefix: '!',
        requireBase: false
    });

    /* Add New States Above */
    $urlRouterProvider.otherwise('/');


}).controller('ApplicationController', function ($scope, Upload, $mdDialog) {
    $scope.progress = false;

    $scope.uploadPicture = function(event){
        $scope.progress = true;
        $scope.upload($scope.files, event);
    };

    $scope.upload = function (files, event) {
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                Upload.upload({
                    url: '/api/ocr',
                    file: file,
                    fileName: "file"
                }).progress(function (evt) {
                    if(!$scope.progress) {
                        $scope.progress = true;
                    }

                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                }).success(function (data, status, headers, config) {
                    $scope.progress = false;
                    $mdDialog.show(
                        $mdDialog.alert()
                            .parent(angular.element(document.body))
                            .title('Ergebnis')
                            .content(data)
                            .ok('Ok')
                            .targetEvent(event)
                    );
                    console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
                });
            }
        }
    };

});

angular.module('digital-trade').run(function($rootScope) {
    $rootScope.safeApply = function(fn) {
        var phase = $rootScope.$$phase;
        if (phase === '$apply' || phase === '$digest') {
            if (fn && (typeof(fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };
});