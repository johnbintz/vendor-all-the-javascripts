require "vendor-all-the-javascripts/version"

module VendorAllTheJavaScripts
  if defined?(Rails)
    class Railtie < Rails::Engine
    end
  end
end
