# InplaceEditing

Welcome to your new gem! In this directory, you'll find the files you need to be able to package up your Ruby library into a gem. Put your Ruby code in the file `lib/inplace_editing`. To experiment with that code, run `bin/console` for an interactive prompt.

TODO: Delete this and the text above, and describe your gem

## Installation

Add this line to your application's Gemfile:

```ruby
gem 'inplace_editing'
```

And then execute:

    $ bundle

Or install it yourself as:

    $ gem install inplace_editing

Add to the controllers you want (e.g. ApplicationController)
```ruby
before_action :set_editor_config
def set_editor_config
  @can_edit = false # or true
  @inplace_editing_mode = (@can_edit ? 'edit' : 'read')
end
```

Don't forget to add scripts

    //= require jquery
    //= require best_in_place
    //= require inplace_editing

    $(document).ready(function() {
      /* Activating Inplace Editor */
      InplaceEditingManager.bindAll();
    });

And styles

    @import "font-awesome";
    @import "inplace_editing";

## Usage

TODO: Write usage instructions here

## Development

After checking out the repo, run `bin/setup` to install dependencies. You can also run `bin/console` for an interactive prompt that will allow you to experiment.

To install this gem onto your local machine, run `bundle exec rake install`. To release a new version, update the version number in `version.rb`, and then run `bundle exec rake release`, which will create a git tag for the version, push git commits and tags, and push the `.gem` file to [rubygems.org](https://rubygems.org).

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/[USERNAME]/inplace_editing. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [Contributor Covenant](http://contributor-covenant.org) code of conduct.


## License

The gem is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).

