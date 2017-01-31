# coding: utf-8
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'inplace_editing/version'

Gem::Specification.new do |spec|
  spec.name          = "inplace_editing"
  spec.version       = InplaceEditing::VERSION
  spec.authors       = ["Henrique Rangel"]
  spec.email         = ["dev@hrangel.com.br"]

  spec.summary       = <<SUM
  This front-end gem helps to allow users/managers to inplace edit string, text, images or other elements.
  Besides that it helps to add optional or valid text only if a object's property exists.
SUM
  spec.description   = <<DESC
  InplaceEditing is a jQuery and Best In Place script and a Rails helper that provides methods 
  (string_editor, image_editor, text_editor, element_editor, optional_editor, only_valid_editor) to allow 
  editing any ActiveRecord object's property (since it uses standard BestInPlace form).
DESC
  spec.homepage      = "https://github.com/hrangel/inplace_editing"
  spec.license       = "MIT"

  # Prevent pushing this gem to RubyGems.org. To allow pushes either set the 'allowed_push_host'
  # to allow pushing to a single host or delete this section to allow pushing to any host.
  if spec.respond_to?(:metadata)
    spec.metadata['allowed_push_host'] = "https://rubygems.org"
  else
    raise "RubyGems 2.0 or newer is required to protect against " \
      "public gem pushes."
  end

  spec.files         = `git ls-files -z`.split("\x0").reject do |f|
    f.match(%r{^(test|spec|features)/})
  end
  spec.bindir        = "exe"
  spec.executables   = spec.files.grep(%r{^exe/}) { |f| File.basename(f) }
  spec.require_paths = ["lib"]

  spec.add_development_dependency "bundler", "~> 1.13"
  spec.add_development_dependency "rake", "~> 10.0"
end
