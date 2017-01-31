function asyncImageForm(config) {
  this.config = config;
  // var config = {
    // formSelector: 'form.async-republic-image',
    // inputFileSelector: 'form.async-republic-image .input_addPictureButton',
    // inputSubmitSelector: 'form.async-republic-image input[type=submit]',
    // imagePreviewSelector: 'form.async-republic-image img.preview',
    // imageChangerSelector: 'form.async-republic-image img.preview',
    // errorsGroup: 'republic_image',
    // events: {
      // imageChanged: function() {},
      // imageUploading: function() {},
      // imageUploadSuccess: function() {},
      // imageUploadFail: function() {}
    // }
  // }

  function defaultPostImageSuccess() {
    window.location.reload();
    return false;
  };

  $(config.inputFileSelector).change(function(){
    setImagePreview(this, $(config.imagePreviewSelector));
    config.events.imageChanged(this);
  });

  $(config.imageChangerSelector).click(function(e){
    $(config.inputFileSelector).click();
  });

  $(config.formSelector).submit(function (event) {
    event.preventDefault();

    //grab all form data  
    var formData = new FormData($(this)[0]);

    config.events.imageUploading(this);

    $.ajax({
        url: $(this).attr('action'),
        type: $(this).attr('method'),
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        success: function (responseData) {
          config.events.imageUploadSuccess(responseData);
        },
        error: function () {
          config.events.imageUploadFail(this);
        }
    });

    return false;
  });
};