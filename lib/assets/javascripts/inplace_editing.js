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
    return new asyncImageForm({
      formElement: $(imageForm),
      inputFileElement: $(imageForm).find('input[type=file]'),
      imagePreviewElement: $(imageForm).find('img.editable-preview'),
      imageChangerElement: $(imageForm).find('a.insert-image, .image-container'),
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
  tryBindImage: function(parentElementOrSelector) {
    var self = this;
    $.each($(parentElementOrSelector).find('.inplace_editor_image'), function(index, element) {
      self.bindImage(element);
    });
  },
  bindImageBG: function(imageBGContainer) {
    return new asyncImageBGForm({
      containerElement: $(imageBGContainer),
      formElement: $(imageBGContainer).find('form'),
      inputFileElement: $(imageBGContainer).find('input[type=file]'),
      imageChangerElement: $(imageBGContainer).find('a.insert-image, a.edit-image'),
      errorsGroup: '#{localized_object.class.name.downcase}',
      events: {
        imageChanged: function() {
          $(imageBGContainer).find('a.insert-image').hide();
          $(imageBGContainer).find('.actions-container').show();
          $(imageBGContainer).find('.actions-container input').prop('disabled', false);
        },
        imageUploading: function() {
          $(imageBGContainer).find('.actions-container input').prop('disabled', true)
        },
        imageUploadSuccess: function() {
          $(imageBGContainer).find('.actions-container').hide();
        },
        imageUploadFail: function() {
          $(imageBGContainer).find('.actions-container').show();
          $(imageBGContainer).find('.actions-container input').prop('disabled', false)
        }
      }
    });
  },
  tryBindImageBG: function(parentElementOrSelector) {
    var self = this;
    $.each($(parentElementOrSelector).find('.inplace_editor_image_bg'), function(index, element) {
      self.bindImageBG(element);
    });
  },
  bindAll: function(parentElement) {
    var self = this;
    if (!parentElement)
      parentElement = 'body';
    self.tryBindText(parentElement);
    self.tryBindImage(parentElement);
    self.tryBindImageBG(parentElement);
  }
}

function asyncImageForm(config) {
  var image_form = this;
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
    image_form.config.setConfigOrSelector(elementProperties[i]);
  }

  image_form.config.inputFileElement.change(function(){
    setImagePreview(this, image_form.config.imagePreviewElement);
    image_form.config.events.imageChanged(this);
  });

  image_form.config.imageChangerElement.click(function(e){
    if(typeof e.preventDefault === 'function')
      e.preventDefault();

    image_form.config.inputFileElement.click();
    return false;
  });

  image_form.config.formElement.submit(function (event) {
    event.preventDefault();

    //grab all form data  
    var formData = new FormData($(this)[0]);

    image_form.config.events.imageUploading(this);

    $.ajax({
        url: $(this).attr('action'),
        type: $(this).attr('method'),
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        success: function (responseData) {
          image_form.config.events.imageUploadSuccess(responseData);
        },
        error: function () {
          image_form.config.events.imageUploadFail(this);
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

function asyncImageBGForm(config) {
  var image_bg_form = this;
  this.config = config;
  this.config.setConfigOrSelector = function(prefix) {
    var self = this;
    var key = prefix + 'Element';
    if (!self.hasOwnProperty(key) || !self[key]) {
      self[key] = $(self[prefix + 'Selector']);
    }
  };
  // var config = {
    // containerSelector: '.image_bg_container',
    // containerElement: null,
    // formSelector: 'form.async-republic-image',
    // formElement: null,
    // inputFileSelector: 'form.async-republic-image .input_addPictureButton',
    // inputFileElement: null,
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

  var elementProperties = ['container', 'form', 'inputFile', 'imageChanger'];
  for (var i = 0; i < elementProperties.length; i++) {
    image_bg_form.config.setConfigOrSelector(elementProperties[i]);
  }

  image_bg_form.config.inputFileElement.change(function(){
    setImageBGPreview(this, image_bg_form.config.containerElement);
    image_bg_form.config.events.imageChanged(this);
  });

  image_bg_form.config.imageChangerElement.click(function(e){
    if(typeof e.preventDefault === 'function')
      e.preventDefault();

    image_bg_form.config.inputFileElement.click();
    return false;
  });

  image_bg_form.config.formElement.submit(function (event) {
    event.preventDefault();

    //grab all form data  
    var formData = new FormData($(this)[0]);

    image_bg_form.config.events.imageUploading(this);

    $.ajax({
        url: $(this).attr('action'),
        type: $(this).attr('method'),
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        success: function (responseData) {
          image_bg_form.config.events.imageUploadSuccess(responseData);
        },
        error: function () {
          image_bg_form.config.events.imageUploadFail(this);
        }
    });

    return false;
  });
};

function setImageBGPreview(input, imageElement, noImageElement) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            if (noImageElement)
              noImageElement.hide();
            var originalBG = $(imageElement).attr('data-background-image');
            if (!originalBG)
              $(imageElement).attr('data-background-image', $(imageElement).css('background-image'));
            $(imageElement).css('background-image', 'url(' + e.target.result + ')');
        }

        reader.readAsDataURL(input.files[0]);
    } else {
      if (noImageElement)
        noImageElement.show();
      var originalBG = $(imageElement).attr('data-background-image');
      if (originalBG && originalBG.length)
        $(imageElement).css('background-image', originalBG);
    }
}