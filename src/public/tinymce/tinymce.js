tinymce.init({
  selector: 'textarea',
  height: 500,
  theme: 'modern',
  plugins: 'print preview fullpage searchreplace autolink directionality visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists textcolor wordcount imagetools contextmenu colorpicker textpattern help',
  toolbar1: 'formatselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat' ,
  image_advtab: true,
  templates: [
    { title: 'Test template 1', content: 'Test 1' },
    { title: 'Test template 2', content: 'Test 2' }
  ],
  toolbar2 : "imageupload",
        setup: function(editor) {
    initImageUpload(editor);
  }
});

function initImageUpload(editor) {
  // create input and insert in the DOM
  var inp = $('<input id="tinymce-uploader" type="file" name="pic" accept="image/*" style="display:none">');
  $(editor.getElement()).parent().append(inp);

  // add the image upload button to the editor toolbar
  editor.addButton('imageupload', {
    text: '',
    icon: 'image',
    onclick: function(e) { // when toolbar button is clicked, open file select modal
      inp.trigger('click');
    }
  });

  // when a file is selected, upload it to the server
  inp.on("change", function(e){
    uploadFile($(this), editor);
  });
}

function uploadFile(inp, editor) {
  var input = inp.get(0);
  var data = new FormData();
  data.append('image[file]', input.files[0]);

  $.ajax({
    url:'/images',
    type: 'POST',
    data: data,
    processData: false, // Don't process the files
    contentType: false, // Set content type to false as jQuery will tell the server its a query string request
    success: function(data, textStatus, jqXHR) {
      editor.insertContent('<img class="content-img" src="' + data.url + '"/>');
    },
    error: function(jqXHR, textStatus, errorThrown) {
      if(jqXHR.responseText) {
        errors = JSON.parse(jqXHR.responseText).errors
        alert('Error uploading image: ' + errors.join(", ") + '. Make sure the file is an image and has extension jpg/jpeg/png.');
      }
    }
  });
}
            