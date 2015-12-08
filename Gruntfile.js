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
      },
      embed: {
        src: 'embed.js',
        dest: '.tmp/embed.js'
      }
    },

    bookmarklet_wrapper: {
      options: {
        //banner: '\n/*! <%= pkg.name %> by <%= pkg.author %> */'
      },
      standard: {
        files: {
          '.tmp/main.js': '.tmp/main.js'
        }
      },
      ie: {
        files: {
          'build/bibtex-ie.js': '.tmp/embed.js'
        }
      }
    },

    concat: {
      options: {
        separator: ''
      },
      bibtex: {
        src: ['.tmp/public.js', '.tmp/main.js'],
        dest: 'build/bibtex.js'
      },
      ie: {
        src: ['public.js', '.tmp/main.js'],
        dest: '.tmp/bibtex-ie.js'
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
      target: {
        files: {
          '.tmp/bibtex.css': 'bibtex.css'
        }
      }
    },

    insertInlineCss: {
      bibtex: {
        css: '.tmp/bibtex.css',
        dest: 'build/bibtex.js',
        pattern: 'InlineCssPlaceholder'
      },
      ie: {
        css: '.tmp/bibtex.css',
        dest: '.tmp/bibtex-ie.js',
        pattern: 'InlineCssPlaceholder'
      }
    },

    javascriptHeader: {
      bibtex: {
        dest: 'build/bibtex.js'
      }
    },

    anonymizeJs: {
      ie: {
        dest: '.tmp/main.js'
      }
    },

    copy: {
      main: {
        src: 'main.js',
        dest: '.tmp/main.js'
      },
      ie: {
        src: '.tmp/bibtex-ie.js',
        dest: 'build/ie/bibtex.js'
      }
    },

    clean: ['.tmp'],

    watch: {
      bibtex: {
        files: ['main.js', 'public.js', 'bibtex.css'],
        tasks: 'default'
      },
      ie: {
        files: ['main.js', 'public.js', 'embed.js', 'bibtex.css'],
        tasks: 'ie'
      }
    }
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
  });

  grunt.registerTask('anonymizeJs', function() {
    var opts, myFile;
    if (this.args[0])
      opts = grunt.config.data[this.name][this.args[0]];
    else
      opts = grunt.config.data[this.name];
    myFile = grunt.file.read(opts.dest);
    grunt.file.write(opts.dest, '(function(){' + myFile + '})();');
  });

  grunt.loadNpmTasks('grunt-bookmarklet-wrapper');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('default', [
    'uglify:main',
    'bookmarklet_wrapper:standard',
    'uglify:attach',
    'encode:attach',
    'concat:bibtex',
    'cssmin',
    'encode:css',
    'insertInlineCss:bibtex',
    'javascriptHeader:bibtex',
  ]);

  grunt.registerTask('ie', [
    'copy:main',
    'anonymizeJs:ie',
    'concat:ie',
    'cssmin',
    'insertInlineCss:ie',
    'copy:ie',
    'uglify:embed',
    'bookmarklet_wrapper:ie'
  ]);

  grunt.registerTask('build', function(job) {
    if (job === 'ie') grunt.task.run('ie');
    else grunt.task.run('default');
    grunt.task.run('clean');
  });

  grunt.registerTask('test', function(job) {
    if (job === 'ie') grunt.task.run('ie');
    else grunt.task.run('default');
  });
};