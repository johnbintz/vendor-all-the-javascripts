# -*- encoding: utf-8 -*-
$:.push File.expand_path("../lib", __FILE__)
require "vendor-all-the-javascripts/version"

Gem::Specification.new do |s|
  s.name        = "vendor-all-the-javascripts"
  s.version     = VendorAllTheJavaScripts::VERSION
  s.authors     = ["John Bintz"]
  s.email       = ["john@coswellproductions.com"]
  s.homepage    = ""
  s.summary     = %q{Vendored JavaScript thigns I use}
  s.description = %q{Vendored JavaScript thigns I use}

  s.rubyforge_project = "vendor-all-the-javascripts"

  s.files         = `git ls-files`.split("\n")
  s.test_files    = `git ls-files -- {test,spec,features}/*`.split("\n")
  s.executables   = `git ls-files -- bin/*`.split("\n").map{ |f| File.basename(f) }
  s.require_paths = ["lib"]

  # specify any dependencies here; for example:
  # s.add_development_dependency "rspec"
  # s.add_runtime_dependency "rest-client"
  #
  s.add_development_dependency 'httparty'
  s.add_development_dependency 'rake'
  s.add_development_dependency 'rubyzip'
end
