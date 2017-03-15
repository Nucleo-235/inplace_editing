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

  def image_editor(localized_object, property, place_holder = nil, default_value = nil, tag_attributes = { })
    locals = editor_locals(localized_object, property, place_holder, default_value)
    image_src = default_value
    if localized_object[property]
      image_src = localized_object.public_send(property)
      image_src = image_src.url if image_src.respond_to?(:url)
    end
    locals[:image_src] = image_src
    locals[:attrs] = tag_attributes
    render partial: 'inplace_editing/image', :locals => locals
  end

  def element_editor(localized_object, property, place_holder = nil, label = nil)
    render layout: 'inplace_editing/element', :locals => editor_locals(localized_object, property, place_holder, nil, label) do |locals|
      yield locals
    end
  end

  def editor_locals(localized_object, property, place_holder = nil, default_value = nil, label = nil)
    { localized_object: localized_object, property: property, place_holder: place_holder, default_value: default_value, label: label }
  end

  def image_bg_editor(localized_object, property, container_tag, attrs)
    if localized_object[property]
      image = localized_object.public_send(property)
      image = image.url if image.respond_to?(:url)
      attrs[:style] = 'background-image:url("' + image + '");' + (attrs[:style] ? attrs[:style] : '')
    end

    locals = editor_locals(localized_object, property)
    locals[:tag] = container_tag
    locals[:attrs] = attrs
    render layout: 'inplace_editing/image_bg', :locals => locals do |view_locals|
      yield view_locals
    end
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

  def content_tag(*args)
    if block_given?
      tag = Tag.new(args[0], args[1] || {})
      old_buf = @output_buffer
      @output_buffer = ActionView::OutputBuffer.new
      value = yield(tag)
      content = tag.render(@output_buffer.presence || value)
      @output_buffer = old_buf
      content
    else
      super
    end
  end

  def empty_content_tag(*args)
    if block_given?
      tag = Tag.new(args[0], args[1] || {})
      old_buf = @output_buffer
      @output_buffer = ActionView::OutputBuffer.new
      content = tag.render(@output_buffer.presence)
      @output_buffer = old_buf
      content
    else
      super
    end
  end

  class Tag
    include ActionView::Helpers::CaptureHelper
    attr_accessor :id
    attr_reader :name, :css

    def initialize(name, attributes = {})
      @name = name
      @attributes = attributes.with_indifferent_access
      @attributes[:class] = Tag::CSS.new(attributes[:class])
    end

    def []=(k,v)
      @attributes[k] = v
    end
    
    def [](k)
      @attributes[k]
    end
    
    def render(content)
      "<#{name}#{render_attributes}>#{content ? content.strip : nil}</#{name}>".html_safe
    end

    def render_attributes
      attrs = @attributes.dup
      if self[:class].empty?
        attrs.delete :class
      else
        attrs[:class] = self[:class].to_s
      end

      attrs.keys.map do |k|
        "#{k}='#{ERB::Util.html_escape(attrs[k])}'".html_safe
      end.join(' ').prepend(' ')
    end

    class CSS
      
      def initialize(css)
        if css.is_a? String
          @internals = css.split(' ')
        else
          @internals = css.to_a
        end
      end

      def to_s
        @internals.uniq.join(' ')
      end

      def empty?
        @internals.empty?
      end

      def <<(name)
        @internals << name
        nil
      end
    end
  end
end

# @inplace_editing_mode = tem que ser setado no after_action usando o @can_edit