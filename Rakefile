require "bundler/gem_tasks"
require 'httparty'
require 'zip/zip'

def process_zip_url(url, entries = {})
  mkdir_p 'tmp' 

  response = HTTParty.get(url)
  File.open(target = 'tmp/elastic.zip', 'wb') { |fh| fh.print response.body }

  Zip::ZipFile.foreach(target) do |entry|
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

sources = {
  'jquery.cookies' => [
    'http://cookies.googlecode.com/svn/trunk/jquery.cookies.js'
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
  ]
}

desc 'Update verything'
task :update do
  rm_rf 'vendor/assets'

  sources.each do |name, files|
    case files
    when Array
      files.each do |url|
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
      end
    when Proc
      puts "Executing code for #{name}..."
      files.call
    end
  end
end

task :default => :update

