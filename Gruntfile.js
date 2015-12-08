module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      main: {
        src: 'main.js',
        dest: '.tmp/main.js'
      },
      attach: {
        src: 'public.js',
        dest: '.tmp/public.js'
      }
    },
    bookmarklet_wrapper: {
      options: {
        //banner: '\n/*! <%= pkg.name %> by <%= pkg.author %> */'
      },
      main: {
        files: {
          '.tmp/main.js': '.tmp/main.js'
        }
      },
    },
    concat: {
      bibtex: {
        options: {
          separator: ''
        },
        src: ['.tmp/public.js', '.tmp/main.js'],
        dest: 'build/bibtex.js'
      }
    },
    encode: {
      attach: {
        src: '.tmp/public.js',
        dest: '.tmp/public.js'
      },
      css: {
        src: '.tmp/bibtex.css',
        dest: '.tmp/bibtex.css'
      }
    },
    cssmin: {
      options: {
      },
      target: {
        files: {
          '.tmp/bibtex.css': 'bibtex.css'
        }
      }
    },
    insertInlineCss: {
      css: '.tmp/bibtex.css',
      dest: 'build/bibtex.js',
      pattern: 'InlineCssPlaceholder'
    },
    javascriptHeader: {
      dest: 'build/bibtex.js'
    },
    clean: ['.tmp'],
    watch: {
      bibtex: {
        files: ['main.js', 'public.js', 'bibtex.css'],
        tasks: ['default']
      }
    },
  });

  grunt.registerTask('encode', function() {
    var opts, content;
    if (this.args[0])
      opts = grunt.config.data[this.name][this.args[0]];
    else
      opts = grunt.config.data[this.name];
    content = grunt.file.read(opts.src);
    grunt.file.write(opts.dest, encodeURI(content));
  });

  grunt.registerTask('insertInlineCss', function() {
    var opts, css, dest;
    if (this.args[0])
      opts = grunt.config.data[this.name][this.args[0]];
    else
      opts = grunt.config.data[this.name];
    css = grunt.file.read(opts.css);
    dest = grunt.file.read(opts.dest);
    dest = dest.replace(opts.pattern, css);
    grunt.file.write(opts.dest, dest);
  });

  grunt.registerTask('javascriptHeader', function() {
    var opts, myFile, fileparts;
    if (this.args[0])
      opts = grunt.config.data[this.name][this.args[0]];
    else
      opts = grunt.config.data[this.name];
    myFile = grunt.file.read(opts.dest);
    fileparts = myFile.split('javascript:');
    grunt.file.write(opts.dest, 'javascript:' + fileparts.join(''));
  })

  grunt.loadNpmTasks('grunt-bookmarklet-wrapper');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('default', [
    'uglify:main',
    'bookmarklet_wrapper:main',
    'uglify:attach',
    'encode:attach',
    'concat:bibtex',
    'cssmin',
    'encode:css',
    'insertInlineCss',
    'javascriptHeader',
  ]);
  grunt.registerTask('build', [
    'default',
    'clean'
  ]);
};