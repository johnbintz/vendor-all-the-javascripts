require "bundler/gem_tasks"
require 'httparty'
require 'zip/zip'

sources = {
  'jquery.cookies' => [
    'http://cookies.googlecode.com/svn/trunk/jquery.cookies.js',
    'http://cookies.googlecode.com/svn/trunk/jaaulde.cookies.js',
    lambda {
      lines = File.readlines(cookies = 'vendor/assets/javascripts/jquery.cookies.js')

      lines.unshift("//= require jaaulde.cookies")
      File.open(cookies, 'wb') { |fh| fh.print lines.collect(&:strip).join("\n") }
    }
  ],
  'jquery-elastic' => lambda {
    process_zip_url('http://jquery-elastic.googlecode.com/files/jquery.elastic-1.6.11.zip', {
      'jquery.elastic.source.js' => 'jquery.elastic.js'
    })
  },
  'jquery-viewport' => [
    'http://www.appelsiini.net/download/jquery.viewport.js'
  ],
  'better-autocomplete' => [
    'https://raw.github.com/betamos/Better-Autocomplete/develop/src/jquery.better-autocomplete.js',
    'https://raw.github.com/betamos/Better-Autocomplete/develop/src/better-autocomplete.css'
  ],
  'moment' => [
    'https://raw.github.com/timrwood/moment/master/moment.js'
  ],
  'ajaxfileuploader' => lambda {
    process_zip_url('http://phpletter.com/download_project_version.php?version_id=34', {
      'ajaxfileupload.js' => 'ajaxfileupload.js'
    })
  },
  'jquery-ui-timepicker' => [
    'http://trentrichardson.com/examples/timepicker/js/jquery-ui-timepicker-addon.js'
  ],
  'underscore.string' => [
    'https://raw.github.com/edtsech/underscore.string/master/lib/underscore.string.js'
  ],
  'jScroll' => [
    'https://github.com/downloads/wduffy/jScroll/jquery.jscroll.js'
  ]
}

def open_zip_url(url, &block)
  mkdir_p 'tmp'

  response = HTTParty.get(url)
  File.open(target = 'tmp/zip.zip', 'wb') { |fh| fh.print response.body }

  Zip::ZipFile.foreach(target, &block)
end

def process_zip_url(url, entries = {})
  open_zip_url(url) do |entry|
    entries.each do |search_entry, target_filename|
      if entry.name[search_entry]
        case File.extname(search_entry)
        when '.js'
          target = 'vendor/assets/javascripts'
        when '.css'
          target = 'vendor/assets/stylesheets'
        end

        entry.extract(File.join(target, target_filename))
      end

      yield entry if block_given?
    end
  end
end

desc 'Update everything'
task :update do
  rm_rf 'vendor/assets'

  sources.each do |name, files|
    case files
    when Array
      files.each do |url|
        case url
        when String
          puts "Retrieving #{url} for #{name}..."
          response = HTTParty.get(url, :format => 'application/octet-stream')

          case File.extname(url)
          when '.js'
            target = Pathname('vendor/assets/javascripts')
          when '.css'
            target = Pathname('vendor/assets/stylesheets')
          end

          target.mkpath
          target.join(File.basename(url)).open('wb') { |fh| fh.print response.body }
        when Proc
          url.call
        end
      end
    when Proc
      puts "Executing code for #{name}..."
      files.call
    end
  end
end

task :default => :update

desc 'Update Plupload'
task :update_plupload do
  root = "vendor-special/assets"

  js = "#{root}/javascripts/plupload"
  css = "#{root}/stylesheets/plupload"
  img = "#{root}/images/plupload"

  [ js, css, img ].each do |dir|
    rm_rf dir
    mkdir_p dir
  end

  open_zip_url("https://github.com/downloads/moxiecode/plupload/plupload_1_5_4.zip") do |entry|
    if entry.file?
      target = case File.extname(entry.name)
      when '.js'
        js
      when '.css'
        css
      else
        img
      end

      [
        [ 'plupload/js/jquery.plupload.queue/**/*', 'jquery.plupload.queue' ],
        [ 'plupload/js/jquery.ui.plupload/**/*', 'jquery.ui.plupload' ],
        [ 'plupload/js/*', '.' ],
      ].each do |glob, dir|
        if File.fnmatch?(glob, entry.name)
          target = File.expand_path(File.join(target, dir, File.basename(entry.name)))

          FileUtils.mkdir_p File.dirname(target)

          entry.extract(target)

          break
        end
      end
    end
  end
end

