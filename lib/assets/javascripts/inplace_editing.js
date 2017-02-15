var InplaceEditingManager = {
  bindText: function(element) {
    $(element).best_in_place();
  },
  tryBindText: function(parentElementOrSelector) {
    var self = this;
    $.each($(parentElementOrSelector).find('.best_in_place.inplace_editor'), function(index, element) {
      self.bindText(element);
    });
  },
  bindImage: function(imageForm) {
    return asyncImageForm({
      formElement: $(imageForm),
      inputFileElement: $(imageForm).find('input[type=file]'),
      imagePreviewElement: $(imageForm).find('img.editable-preview'),
      imageChangerElement: $(imageForm).find('img.preview, a.insert-image'),
      errorsGroup: '#{localized_object.class.name.downcase}',
      events: {
        imageChanged: function() {
          $(imageForm).find('a.insert-image').hide();
          $(imageForm).find('.actions-container').show();
          $(imageForm).find('.actions-container input').prop('disabled', false);
        },
        imageUploading: function() {
          $(imageForm).find('.actions-container input').prop('disabled', true)
        },
        imageUploadSuccess: function() {
          $(imageForm).find('.actions-container').hide();
        },
        imageUploadFail: function() {
          $(imageForm).find('.actions-container').show();
          $(imageForm).find('.actions-container input').prop('disabled', false)
        }
      }
    });
  },
  tryBindImage: function(parentElement) {
    var self = this;
    $.each($(parentElementOrSelector).find('.inplace_editor_image'), function(index, element) {
      self.bindImage(element);
    });
  },
  bindAll: function(parentElement) {
    if (!parentElement)
      parentElement = 'body';
    tryBindText(parentElement);
    tryBindImage(parentElement);
  }
}

function asyncImageForm(config) {
  this.config = config;
  this.config.setConfigOrSelector = function(prefix) {
    var self = this;
    var key = prefix + 'Element';
    if (!self.hasOwnProperty(key) || !self[key]) {
      self[key] = $(self[prefix + 'Selector']);
    }
  };
  // var config = {
    // formSelector: 'form.async-republic-image',
    // formElement: null,
    // inputFileSelector: 'form.async-republic-image .input_addPictureButton',
    // inputFileElement: null,
    // imagePreviewSelector: 'form.async-republic-image img.preview',
    // imagePreviewElement: null,
    // imageChangerSelector: 'form.async-republic-image img.preview',
    // imageChangerElement: null,
    // errorsGroup: 'republic_image',
    // events: {
      // imageChanged: function() {},
      // imageUploading: function() {},
      // imageUploadSuccess: function() {},
      // imageUploadFail: function() {}
    // }
  // }

  var elementProperties = ['form', 'inputFile', 'imagePreview', 'imageChanger'];
  for (var i = 0; i < elementProperties.length; i++) {
    this.config.setConfigOrSelector(elementProperties[i]);
  }

  function defaultPostImageSuccess() {
    window.location.reload();
    return false;
  };

  config.inputFileElement.change(function(){
    setImagePreview(this, config.imagePreviewElement);
    config.events.imageChanged(this);
  });

  config.imageChangerElement.click(function(e){
    if(typeof e.preventDefault === 'function')
      e.preventDefault();

    config.inputFileElement.click();
    return false;
  });

  config.formElement.submit(function (event) {
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

function setImagePreview(input, imageElement, noImageElement) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            if (noImageElement)
              noImageElement.hide();
            imageElement.attr('src', e.target.result);
            imageElement.show();
        }

        reader.readAsDataURL(input.files[0]);
    } else {
      if (noImageElement)
        noImageElement.show();
      imageElement.hide();
    }
}