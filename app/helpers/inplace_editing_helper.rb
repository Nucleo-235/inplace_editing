module InplaceEditingHelper
  def should_show?(optional_string_value)
    @can_edit || !optional_string_value.blank?
  end

  def optional_editor(localized_object, property)
    render :layout => 'inplace_editing/optional', :locals => editor_locals(localized_object, property) do |locals|
      yield locals
    end
  end

  def only_valid_editor(localized_object, property)
    render :layout => 'inplace_editing/only_valid', :locals => editor_locals(localized_object, property) do |locals|
      yield locals
    end
  end

  def text_editor(localized_object, property, place_holder = nil)
    render partial: 'inplace_editing/text', :locals => editor_locals(localized_object, property, place_holder)
  end

  def string_editor(localized_object, property, place_holder = nil)
    render partial: 'inplace_editing/string', :locals => editor_locals(localized_object, property, place_holder)
  end

  def image_editor(localized_object, property, place_holder = nil, default_value = nil)
    render partial: 'inplace_editing/image', :locals => editor_locals(localized_object, property, place_holder, default_value)
  end

  def element_editor(localized_object, property, place_holder = nil, label = nil)
    render layout: 'inplace/element', :locals => editor_locals(localized_object, property, place_holder, nil, label) do |locals|
      yield locals
    end
  end

  def editor_locals(localized_object, property, place_holder = nil, default_value = nil, label = nil)
    { localized_object: localized_object, property: property, place_holder: place_holder, default_value: default_value, label: label }
  end

  def markdown(text, placeholder = '[texto aqui]')
    return placeholder if !text
    options = {
      filter_html:     false,
      hard_wrap:       true, 
      link_attributes: { rel: 'nofollow', target: "_blank" },
      space_after_headers: true, 
      fenced_code_blocks: true,
      tables: true
    }

    extensions = {
      autolink:           true,
      superscript:        true,
      disable_indented_code_blocks: true
    }

    renderer = Redcarpet::Render::HTML.new(options)
    markdown = Redcarpet::Markdown.new(renderer, extensions)

    markdown.render(text).html_safe
  end
end

# @inplace_editing_mode = tem que ser setado no after_action usando o @can_edit